import { useState, useCallback, useEffect, useRef } from 'react';
import { rollCheck, rollDamage } from '../utils/dice.js';
import { saveGame } from '../utils/saveLoad.js';
import { ITEMS, getItem } from '../data/items.js';
import { getEnemiesForLocation } from '../data/enemies.js';
import { FACTIONS } from '../data/factions.js';
import { LOCATIONS, ACTION_LABELS } from '../data/locations.js';
import { rollForEvent, getHeatEncounter } from '../data/events.js';
import { getDAEventForTrigger, shouldTriggerDAEvent } from '../data/deathAngel_events.js';
import { RECIPES } from '../data/crafting.js';
import { createPassion } from '../data/passions.js';

const WOUND_LEVELS = ['None','Stabilized','Serious','Critical','Mortal'];
const AP_REGEN_MS=30000, AP_AMT=5, NERVE_MS=60000, NERVE_AMT=3, TIME_MS=120000;
const ASCENSION_PER_INSIGHT = 5;
const MAX_GUILT_STACKS = 10;

export function createNewCharacter(form) {
  const ds=form.darkSecret;
  const attrs={reason:0,intuition:0,perception:0,coolness:0,violence:0,soul:0,willpower:0,fortitude:0,reflexes:0,...(ds?.startingBonus||{})};
  Object.entries(form.attributePoints||{}).forEach(([k,v])=>{attrs[k]=(attrs[k]||0)+v;});
  const inventory=[];
  if(form.startingItemId&&ITEMS[form.startingItemId]) inventory.push({...ITEMS[form.startingItemId],qty:1});
  (form.advantages||[]).forEach(adv=>{if(adv.id==='artifact_keeper')inventory.push({...ITEMS['unknown_artifact'],qty:1});});
  const factionStandings={};
  Object.keys(FACTIONS).forEach(fId=>{factionStandings[fId]=fId===form.faction?10:0;});
  return {
    name:form.name, darkSecret:ds, advantages:form.advantages||[], disadvantages:form.disadvantages||[],
    attributes:attrs,
    stability:10+(attrs.soul||0), maxStability:10+(attrs.soul||0),
    wounds:'None', insight:ds?.startingInsight||0, maxInsight:10,
    ap:100, maxAp:100, nerve:50, maxNerve:50, thalers:500,
    faction:form.faction||'neutral', factionStandings, inventory,
    equippedWeapon:null, equippedArmor:null,
    rituals:ds?.id==='occultist'?['seeking','warding']:[],
    location:'residential', npcTrust:{}, recentEventIds:[], trainingProgress:{},
    passions: (form.passions || []).filter(p => p?.description?.trim()).map(p => createPassion(p.typeId || 'person', p.description)),
    // Intro quest is auto-started for all new characters
    questProgress: { intro_quest: { stageIdx: 0, actionCount: 0, completed: false } },
        log:(()=>{const t=Date.now();return[
      {id:t,type:'system',timestamp:new Date().toLocaleTimeString(),
      text:`You wake into the Illusion as ${form.name}. Dark secret: ${ds?.name||'Unknown'}. Something is different today.`},
      {id:t+100,type:'system',timestamp:new Date().toLocaleTimeString(),
      text:`[Investigation] "First Steps in the Illusion" has begun. Check the Investigations tab for guidance.`}];})(),
    stats:{actionsPerformed:0,crimesCommitted:0,entitiesDefeated:0,ritualsPerformed:0,stabilityLost:0,insightGained:0,thalersEarned:0,daysPlayed:1},
    gameTime:{day:1,hour:8}, ascensionProgress:0, guiltStacks:0, heat:0, maxHeat:100, activeEffects:[], createdAt:Date.now(),
  };
}

export function useGameState() {
  const [screen,setScreen]=useState('title');
  const [character,setCharacter]=useState(null);
  const [combat,setCombat]=useState(null);
  const [activeModal,setActiveModal]=useState(null);
  const [pendingEvent,setPendingEvent]=useState(null);
  const [pendingDAEvent,setPendingDAEvent]=useState(null);
  const T=useRef({});

  useEffect(()=>{
    if(!character||screen!=='game') return;
    T.current.ap=setInterval(()=>setCharacter(c=>(!c||c.ap>=c.maxAp)?c:{...c,ap:Math.min(c.ap+AP_AMT,c.maxAp)}),AP_REGEN_MS);
    T.current.nerve=setInterval(()=>setCharacter(c=>(!c||c.nerve>=c.maxNerve)?c:{...c,nerve:Math.min(c.nerve+NERVE_AMT,c.maxNerve)}),NERVE_MS);
    T.current.time=setInterval(()=>setCharacter(c=>{
      if(!c)return c;
      const h=(c.gameTime.hour+1)%24;
      const d=h===0?c.gameTime.day+1:c.gameTime.day;
      const newHeat=Math.max(0,(c.heat||0)-1);
      let n={...c,gameTime:{hour:h,day:d},heat:newHeat};
      // Guilt daily drain: high guilt stacks corrode stability once per day at midnight
      if(h===0){
        const guilt=n.guiltStacks||0;
        if(guilt>=8){
          // Max guilt — severe daily toll
          n.stability=Math.max(0,(n.stability||0)-2);
          n.nerve=Math.max(0,(n.nerve||0)-10);
        } else if(guilt>=5){
          // Significant guilt — moderate daily toll
          n.stability=Math.max(0,(n.stability||0)-1);
        }
        // Guilt naturally decays 1 stack per day at low levels
        if(guilt>0&&guilt<3) n.guiltStacks=guilt-1;
      }
      return n;
    }),TIME_MS);
    return()=>Object.values(T.current).forEach(clearInterval);
  },[screen,character?.name]);

  useEffect(()=>{
    if(character&&screen==='game'){const t=setTimeout(()=>saveGame({character,screen}),2000);return()=>clearTimeout(t);}
  },[character,screen]);

  const addLog=useCallback((entry)=>{
    setCharacter(c=>({...c,log:[{id:Date.now()+Math.random(),timestamp:new Date().toLocaleTimeString(),...entry},...c.log].slice(0,200)}));
  },[]);

  const applyDelta=useCallback((delta)=>{
    setCharacter(c=>{
      let n={...c};
      if(delta.thalers!==undefined) n.thalers=Math.max(0,n.thalers+delta.thalers);
      if(delta.ap)      n.ap=Math.min(Math.max(0,n.ap+delta.ap),n.maxAp);
      if(delta.nerve)   n.nerve=Math.min(Math.max(0,n.nerve+delta.nerve),n.maxNerve);
      if(delta.stability) n.stability=Math.min(Math.max(0,n.stability+delta.stability),n.maxStability);
      if(delta.insight){
        const prev=n.insight;
        n.insight=Math.min(Math.max(0,n.insight+delta.insight),n.maxInsight);
        // Each point of Insight gained advances Ascension
        const gained=n.insight-prev;
        if(gained>0) n.ascensionProgress=Math.min((n.ascensionProgress||0)+gained*ASCENSION_PER_INSIGHT,100);
      }
      if(delta.factionReward){const{faction,amount}=delta.factionReward;if(faction&&amount)n.factionStandings={...n.factionStandings,[faction]:(n.factionStandings[faction]||0)+amount};}
      if(delta.stats){n.stats={...n.stats};Object.entries(delta.stats).forEach(([k,v])=>{n.stats[k]=(n.stats[k]||0)+v;});}
      return n;
    });
  },[]);

  const startGame=useCallback((form)=>{setCharacter(createNewCharacter(form));setScreen('game');},[]);
  const loadSavedGame=useCallback((saved)=>{setCharacter(saved.character);setScreen('game');},[]);

  const travel=useCallback((locId)=>{
    const loc=LOCATIONS[locId];if(!loc)return;
    if(loc.unlockInsight>(character?.insight||0)){addLog({type:'error',text:`Insight ${character?.insight} too low (requires ${loc.unlockInsight}).`});return;}
    setCharacter(c=>({...c,location:locId}));
    addLog({type:'travel',text:`→ ${loc.name}. ${loc.description}`});
    // Police heat encounter check during travel
    const heat = character?.heat || 0;
    if (heat > 40) {
      const encounterChance = heat > 70 ? 0.5 : 0.25;
      if (Math.random() < encounterChance) {
        const encounter = getHeatEncounter(heat);
        if (encounter) {
          setPendingEvent(encounter);
        }
      }
    }
  },[character,addLog]);

  const maybeFireEvent=useCallback((locationId)=>{
    if(!character)return;
    const evt=rollForEvent(locationId,character.insight,character.gameTime?.hour||8,character.recentEventIds||[]);
    if(evt){setPendingEvent(evt);setCharacter(c=>({...c,recentEventIds:[...(c.recentEventIds||[]).slice(-9),evt.id]}));}
  },[character]);

  const checkDAEvent = useCallback((triggerType) => {
    if (!character?.darkSecret?.id) return;
    if (!shouldTriggerDAEvent(character, triggerType)) return;
    const evt = getDAEventForTrigger(character.darkSecret.id, triggerType);
    if (evt && !pendingDAEvent && !pendingEvent) {
      setPendingDAEvent(evt);
    }
  }, [character, pendingDAEvent, pendingEvent]);

  const resolveDAEvent = useCallback((outcome, rewards, consequences) => {
    if (rewards?.insightGain) applyDelta({insight: rewards.insightGain, stats:{insightGained:rewards.insightGain}});
    if (consequences?.stabilityLoss) applyDelta({stability: -consequences.stabilityLoss, stats:{stabilityLost:consequences.stabilityLoss}});
    addLog({type:'ritual_complete', text:`[${character?.darkSecret?.name}] Your patron makes itself known.`});
  }, [applyDelta, addLog, character]);

  // Scenario progress tracking
  const advanceScenario = useCallback((scenarioId, actIdx, ending = null) => {
    setCharacter(c => {
      const qp = {...(c.scenarioProgress || {})};
      if (ending) {
        qp[scenarioId] = {...(qp[scenarioId]||{}), completed: true, ending};
      } else {
        qp[scenarioId] = {...(qp[scenarioId]||{}), actIdx: actIdx + 1};
      }
      return {...c, scenarioProgress: qp};
    });
  }, []);

  const resolveEvent=useCallback((outcome,rewards,consequences)=>{
    if(rewards.thalers)      applyDelta({thalers:rewards.thalers});
    if(rewards.insightGain)  applyDelta({insight:rewards.insightGain,stats:{insightGained:rewards.insightGain}});
    if(rewards.factionReward)applyDelta({factionReward:rewards.factionReward});
    if(consequences.stabilityLoss) applyDelta({stability:-consequences.stabilityLoss,stats:{stabilityLost:consequences.stabilityLoss}});
    if(rewards.heatReduction) setCharacter(c=>({...c,heat:Math.max(0,(c.heat||0)-rewards.heatReduction)}));
    if(consequences.heatGain) setCharacter(c=>({...c,heat:Math.min(c.maxHeat||100,(c.heat||0)+consequences.heatGain)}));
    addLog({type:outcome,text:`[Encounter resolved: ${outcome}]`});
  },[applyDelta,addLog]);

  const performAction=useCallback((actionId)=>{
    if(!character)return;
    const loc=LOCATIONS[character.location];if(!loc)return;
    const apCost=loc.apCost[actionId]||10;
    if(character.ap<apCost){addLog({type:'error',text:`Need ${apCost} AP.`});return;}
    applyDelta({ap:-apCost,stats:{actionsPerformed:1}});
    if(actionId==='rest'){applyDelta({ap:30,stability:1});addLog({type:'rest',text:'You rest. AP +30, Stability +1.'});return;}
    if(actionId==='heal_wounds'){if(character.thalers<300){addLog({type:'error',text:'Costs ₮300.'});return;}applyDelta({thalers:-300});setCharacter(c=>{const i=WOUND_LEVELS.indexOf(c.wounds);return{...c,wounds:i>0?WOUND_LEVELS[i-1]:'None'};});addLog({type:'heal',text:'Wound level reduced. (−₮300)'});return;}
    if(actionId==='treat_stability'){if(character.thalers<200){addLog({type:'error',text:'Costs ₮200.'});return;}applyDelta({thalers:-200,stability:3});addLog({type:'heal',text:'Stability +3. (−₮200)'});return;}
    if(actionId==='visit_psych_ward'){if(character.thalers<500){addLog({type:'error',text:'Costs ₮500.'});return;}applyDelta({thalers:-500,stability:6});addLog({type:'heal',text:'Intensive therapy. Stability +6. (−₮500)'});return;}
    if(['pick_fight','ambush_enemy','face_nepharite'].includes(actionId)){const enemies=getEnemiesForLocation(character.location);const enemy={...enemies[Math.floor(Math.random()*enemies.length)]};enemy.currentHp=enemy.hp;setCombat({enemy,round:1,log:[]});addLog({type:'combat',text:`⚔ ${enemy.name} — ${enemy.description}`});return;}
    const AMAP={search_apartment:'perception',speak_neighbor:'coolness',train_home:'fortitude',work_job:'reason',meet_contact:'coolness',research_library:'reason',bribe_official:'coolness',commit_crime:'perception',find_informant:'coolness',buy_contraband:'coolness',network_awakened:'soul',trade_information:'coolness',find_ritual:'intuition',access_backroom:'intuition',research_lore:'reason',find_pattern:'reason',access_restricted:'perception',decode_document:'reason',speak_patient:'intuition',examine_records:'reason',attempt_escape:'reflexes',contact_entity:'soul',investigate_factory:'perception',find_cache:'perception',infiltrate_cult:'coolness',commune_entity:'soul',harvest_essence:'willpower',open_rift:'soul',confront_archon:'willpower',speak_dead:'soul',rescue_soul:'willpower',steal_secret:'intuition',bribe_doctor:'coolness'};
    const attr=AMAP[actionId]||'reason';
    const result=rollCheck(character.attributes[attr]||0);
    const rw={},cs={};
    if(actionId==='work_job'){if(result.outcome==='complete')rw.thalers=Math.floor(Math.random()*150)+100;else if(result.outcome==='partial')rw.thalers=Math.floor(Math.random()*80)+50;}
    if(actionId==='bribe_official'){if(character.thalers<200){addLog({type:'error',text:'Need ₮200.'});return;}applyDelta({thalers:-200});if(result.outcome==='complete'){rw.nerve=10;}else if(result.outcome==='partial'){rw.nerve=5;}else{cs.stabilityLoss=1;}}
    if(['find_ritual','research_lore','find_pattern','access_restricted','research_library','decode_document'].includes(actionId)&&result.outcome!=='failure')rw.insightGain=1;
    if(['commune_entity','contact_entity','open_rift','speak_dead','harvest_essence'].includes(actionId)){cs.stabilityLoss=result.outcome==='complete'?1:result.outcome==='partial'?2:3;if(result.outcome!=='failure')rw.insightGain=1;}
    if(actionId==='network_awakened'){if(result.outcome==='complete')rw.factionReward={faction:'awakened_circle',amount:15};else if(result.outcome==='partial')rw.factionReward={faction:'awakened_circle',amount:5};}
    if(actionId==='find_cache'){if(result.outcome==='complete')rw.thalers=Math.floor(Math.random()*300)+100;else if(result.outcome==='partial')rw.thalers=Math.floor(Math.random()*100)+50;}
    if(actionId==='infiltrate_cult'){if(result.outcome==='complete')rw.factionReward={faction:'death_angel_aligned',amount:20};else if(result.outcome==='partial')rw.factionReward={faction:'death_angel_aligned',amount:5};else cs.stabilityLoss=2;}
    if(actionId==='confront_archon'){cs.stabilityLoss=result.outcome==='complete'?2:result.outcome==='partial'?3:4;if(result.outcome!=='failure')rw.insightGain=2;}
    if(rw.thalers)applyDelta({thalers:rw.thalers,stats:{thalersEarned:rw.thalers}});
    if(rw.nerve)applyDelta({nerve:rw.nerve});
    if(rw.insightGain)applyDelta({insight:rw.insightGain,stats:{insightGained:rw.insightGain}});
    if(rw.factionReward)applyDelta({factionReward:rw.factionReward});
    if(cs.stabilityLoss){const hasMR=character.advantages?.some(a=>a.id==='resistance_mental');const loss=hasMR?Math.max(0,cs.stabilityLoss-1):cs.stabilityLoss;applyDelta({stability:-loss,stats:{stabilityLost:loss}});}
    const icon=result.outcome==='complete'?'✦':result.outcome==='partial'?'◆':'✖';
    let text=`[${ACTION_LABELS[actionId]||actionId}] ${icon} ${result.label} (${result.total})`;
    if(rw.thalers)text+=` · +₮${rw.thalers}`;
    if(rw.insightGain)text+=` · Insight +${rw.insightGain}`;
    if(cs.stabilityLoss)text+=` · Stability −${cs.stabilityLoss}`;
    addLog({type:result.outcome,text});
    if(Math.random()<0.18)maybeFireEvent(character.location);
    // Death Angel events based on state
    if (Math.random() < 0.08) {
      const triggers = ['stability_low','stability_critical','guilt_high','research_deep','insight_milestone'];
      const t = triggers[Math.floor(Math.random()*triggers.length)];
      checkDAEvent(t);
    }
  },[character,applyDelta,addLog,maybeFireEvent,checkDAEvent]);

  const attackEnemy=useCallback(()=>{
    if(!combat)return;
    const result=rollCheck(character.attributes.violence);
    const wb=character.equippedWeapon?(getItem(character.equippedWeapon)?.bonus||0):0;
    let pd=0,ed=0,log='';
    // Apply enemy debuff from terrify
    const debuffBonus=combat.debuffRounds>0?-3:0;
    if(result.outcome==='complete'){pd=rollDamage(2,6,wb);log=`Strike for ${pd}.`;}
    else if(result.outcome==='partial'){pd=rollDamage(1,6,wb);ed=rollDamage(1,4,Math.max(0,(combat.enemy.bonus||0)+debuffBonus));log=`Exchange — deal ${pd}, take ${ed}.`;}
    else{ed=rollDamage(1,6,Math.max(0,(combat.enemy.bonus||0)+debuffBonus));log=`Missed. Hit for ${ed}.`;}
    // Negate damage if phase_shift/negate_damage was active
    if(combat.negateNext){ed=0;log+=' (Damage negated.)';}
    if(ed>0)setCharacter(c=>{const i=WOUND_LEVELS.indexOf(c.wounds);return{...c,wounds:ed>=10?WOUND_LEVELS[Math.min(i+2,4)]:ed>=5?WOUND_LEVELS[Math.min(i+1,4)]:c.wounds};});
    if(combat.enemy.stabilityThreat){const sr=rollCheck(character.attributes.willpower);const loss=sr.outcome==='failure'?(combat.enemy.stabilityThreat.maxLoss||1):0;if(loss>0){applyDelta({stability:-loss,stats:{stabilityLost:loss}});log+=` Horror −${loss} Stability.`;}}
    const newHp=combat.enemy.currentHp-pd;
    if(newHp<=0){
      let loot='';
      combat.enemy.loot?.forEach(l=>{if(Math.random()<l.chance){if(l.thalers){const a=Math.floor(Math.random()*(l.thalers[1]-l.thalers[0]))+l.thalers[0];if(a>0){applyDelta({thalers:a,stats:{thalersEarned:a}});loot+=` +₮${a}.`;}}if(l.item){const item=ITEMS[l.item];if(item){setCharacter(c=>({...c,inventory:[...c.inventory,{...item,qty:1}]}));loot+=` Found ${item.name}.`;}}}});
      applyDelta({stats:{entitiesDefeated:1}});
      addLog({type:'combat_win',text:`⚔ ${log} — ${combat.enemy.name} defeated.${loot}`});
      setCombat(null);
    } else {
      setCombat(p=>({...p,round:p.round+1,darkAbilityCooldown:Math.max(0,(p.darkAbilityCooldown||0)-1),negateNext:false,debuffRounds:Math.max(0,(p.debuffRounds||0)-1),enemy:{...p.enemy,currentHp:newHp},log:[...p.log,{round:p.round,text:log,roll:result.total}]}));
    }
  },[combat,character,applyDelta,addLog]);

  const fleeCombat=useCallback(()=>{
    if(!combat)return;
    const result=rollCheck(character.attributes.reflexes);
    if(result.outcome!=='failure'){addLog({type:'flee',text:`Escaped from ${combat.enemy.name}.`});setCombat(null);}
    else{const d=rollDamage(1,6,combat.enemy.bonus||0);setCharacter(c=>{const i=WOUND_LEVELS.indexOf(c.wounds);return{...c,wounds:d>=5?WOUND_LEVELS[Math.min(i+1,4)]:c.wounds};});addLog({type:'flee_fail',text:`Escape failed — hit for ${d}.`});setCombat(p=>p?{...p,darkAbilityCooldown:Math.max(0,(p.darkAbilityCooldown||0)-1),negateNext:false,debuffRounds:Math.max(0,(p.debuffRounds||0)-1)}:p);}
  },[combat,character,addLog]);

  const commitCrime=useCallback((crime)=>{
    if(!character)return;
    if(character.nerve<crime.nerveCost){addLog({type:'error',text:`Need ${crime.nerveCost} Nerve.`});return;}
    if(character.ap<crime.apCost){addLog({type:'error',text:`Need ${crime.apCost} AP.`});return;}
    applyDelta({ap:-crime.apCost,nerve:-crime.nerveCost,stats:{crimesCommitted:1}});
    const result=rollCheck(character.attributes[crime.attribute]||0);
    let text='';
    if(result.outcome==='complete'){text=crime.successText;if(crime.reward?.[1]>0){const a=Math.floor(Math.random()*(crime.reward[1]-crime.reward[0]))+crime.reward[0];applyDelta({thalers:a,stats:{thalersEarned:a}});text+=` +₮${a}.`;}if(crime.rewardInsight){applyDelta({insight:1,stats:{insightGained:1}});text+=' Insight +1.';}if(crime.factionReward)applyDelta({factionReward:crime.factionReward});}
    else if(result.outcome==='partial'){text=crime.partialText;if(crime.reward?.[1]>0){const a=Math.floor(Math.random()*(crime.reward[1]-crime.reward[0])*0.4)+crime.reward[0];if(a>0){applyDelta({thalers:a});text+=` +₮${a}.`;}}}
    else{text=crime.failureText;if(crime.stabilityLoss){applyDelta({stability:-crime.stabilityLoss});text+=` −${crime.stabilityLoss} Stability.`;}if(crime.risk==='arrest'){const f=Math.floor(Math.random()*200)+100;applyDelta({thalers:-f});text+=` Fined ₮${f}.`;}}
    // Guilt accumulates for violent/serious crimes on success or partial success
    if(result.outcome!=='failure'){
      const guiltGain=crime.risk==='everything'?2:crime.risk==='violence'?1:0;
      if(guiltGain>0){setCharacter(c=>({...c,guiltStacks:Math.min((c.guiltStacks||0)+guiltGain,MAX_GUILT_STACKS)}));text+=` Guilt +${guiltGain}.`;}
    }
    // Heat increases based on crime outcome
    const heatGain=crime.heatGain?.[result.outcome]??0;
    if(heatGain>0){
      setCharacter(c=>{const newHeat=Math.min((c.heat||0)+heatGain,c.maxHeat||100);return{...c,heat:newHeat};});
      text+=` Heat +${heatGain}.`;
    }
    addLog({type:`crime_${result.outcome}`,text:`[${crime.name}] ${text}`});
    // Guilt above threshold triggers Gamygyn's attention
    const newGuilt=(character.guiltStacks||0)+(result.outcome!=='failure'?(crime.risk==='everything'?2:crime.risk==='violence'?1:0):0);
    if(newGuilt>=5&&Math.random()<0.4) checkDAEvent('guilt_high');
    if(newGuilt>=8) checkDAEvent('guilt_high');
  },[character,applyDelta,addLog]);

  const performRitual=useCallback((ritual)=>{
    if(!character)return;
    if(character.insight<ritual.insightRequired){addLog({type:'error',text:`Need Insight ${ritual.insightRequired}.`});return;}
    if(character.ap<ritual.apCost){addLog({type:'error',text:`Need ${ritual.apCost} AP.`});return;}
    if(character.thalers<ritual.thalerCost){addLog({type:'error',text:`Need ₮${ritual.thalerCost}.`});return;}
    applyDelta({ap:-ritual.apCost,thalers:-ritual.thalerCost,stats:{ritualsPerformed:1}});
    const result=rollCheck(character.attributes[ritual.attribute]||0);
    let sl=0,text='';
    if(result.outcome==='complete'){text=ritual.successText;if(ritual.gainInsight){applyDelta({insight:1,stats:{insightGained:1}});text+=' Insight +1.';}}
    else if(result.outcome==='partial'){text=ritual.partialText;sl=Math.ceil(ritual.stabilityRisk/2);}
    else{text=ritual.failureText;sl=ritual.stabilityRisk;}
    if(sl>0){applyDelta({stability:-sl,stats:{stabilityLost:sl}});text+=` −${sl} Stability.`;}
    // Rituals advance ascension progress
    if(result.outcome!=='failure'){
      const ascGain=result.outcome==='complete'?5:2;
      setCharacter(c=>{
        const newAsc=Math.min((c.ascensionProgress||0)+ascGain,100);
        return{...c,ascensionProgress:newAsc};
      });
      text+=` Ascension +${ascGain}.`;
    }
    addLog({type:`ritual_${result.outcome}`,text:`[Ritual: ${ritual.name}] ${text}`});
    // Rituals of penance/binding can reduce guilt
    if(['redemption','binding','seeking'].includes(ritual.id)&&result.outcome==='complete'){
      setCharacter(c=>({...c,guiltStacks:Math.max(0,(c.guiltStacks||0)-1)}));
    }
    // High guilt makes DA events more likely after rituals
    if((character.guiltStacks||0)>=5&&Math.random()<0.3) checkDAEvent('guilt_high');
  },[character,applyDelta,addLog]);

  const performTraining=useCallback((facility)=>{
    if(!character)return;
    if(character.ap<facility.apCost){addLog({type:'error',text:`Need ${facility.apCost} AP.`});return;}
    if(character.thalers<facility.thalerCost){addLog({type:'error',text:`Need ₮${facility.thalerCost}.`});return;}
    applyDelta({ap:-facility.apCost,thalers:-facility.thalerCost>0?-facility.thalerCost:0});
    const attr=facility.trains[Math.floor(Math.random()*facility.trains.length)];
    const result=rollCheck(character.attributes[attr]||0);
    if(result.outcome!=='failure'){
      setCharacter(c=>{
        const prog={...(c.trainingProgress||{})};
        prog[attr]=(prog[attr]||0)+facility.successBonus;
        let attrs={...c.attributes};
        if(prog[attr]>=1&&(attrs[attr]||0)<5){prog[attr]-=1;attrs[attr]=(attrs[attr]||0)+1;addLog({type:'complete',text:`⚡ Breakthrough! ${attr} increased to ${attrs[attr]}.`});}
        return{...c,attributes:attrs,trainingProgress:prog};
      });
      if(facility.woundRisk&&result.outcome==='partial'){setCharacter(c=>{const i=WOUND_LEVELS.indexOf(c.wounds);return{...c,wounds:WOUND_LEVELS[Math.min(i+1,4)]};});}
      addLog({type:result.outcome==='complete'?'complete':'partial',text:`Trained ${attr} at ${facility.name}. Progress +${facility.successBonus.toFixed(2)}.`});
    } else {
      if(facility.woundRisk)setCharacter(c=>{const i=WOUND_LEVELS.indexOf(c.wounds);return{...c,wounds:WOUND_LEVELS[Math.min(i+1,4)]};});
      addLog({type:'failure',text:`Training at ${facility.name} yielded nothing today.`});
    }
  },[character,applyDelta,addLog]);

  const useItem=useCallback((itemId)=>{
    if(!character)return;
    const item=getItem(itemId);if(!item)return;
    if(!character.inventory.find(i=>i.id===itemId))return;
    let text='';
    setCharacter(c=>{
      let n={...c};
      if(item.effect==='heal_wound'){const levels=item.value||1;const i=WOUND_LEVELS.indexOf(c.wounds);if(i>0){n.wounds=WOUND_LEVELS[Math.max(0,i-levels)];text=`${item.name}: wound improved.`;}else{text='No wounds.';return c;}}
      else if(['heal_stability','restore_stability'].includes(item.effect)){n.stability=Math.min(c.stability+(item.value||1),c.maxStability);text=`${item.name}: Stability +${item.value||1}.`;if(item.id==='black_lotus'){n.stability=Math.max(0,n.stability-1);text+=' −1 from lotus.';}}
      else if(item.effect==='gain_insight'){n.insight=Math.min(c.insight+(item.value||1),c.maxInsight);if(!item.skipStabilityLoss){n.stability=Math.max(0,c.stability-1);text=`${item.name}: Insight +${item.value||1}, Stability −1.`;}else{text=`${item.name}: Insight +${item.value||1}.`;}}
      else if(item.effect==='restore_ap'){n.ap=Math.min(c.ap+(item.value||30),c.maxAp);text=`${item.name}: AP +${item.value||30}.`;}
      const inv=[...c.inventory];const idx=inv.findIndex(i=>i.id===itemId);
      if(idx!==-1){inv[idx]={...inv[idx],qty:inv[idx].qty-1};if(inv[idx].qty<=0)inv.splice(idx,1);}
      n.inventory=inv;return n;
    });
    if(text)addLog({type:'item',text});
  },[character,addLog]);

  const equipItem=useCallback((itemId)=>{const item=getItem(itemId);if(!item)return;if(item.type==='weapon'){setCharacter(c=>({...c,equippedWeapon:itemId}));addLog({type:'equip',text:`Equipped ${item.name}.`});}else if(item.type==='armor'){setCharacter(c=>({...c,equippedArmor:itemId}));addLog({type:'equip',text:`Equipped ${item.name}.`});}},[addLog]);
  const buyItem=useCallback((itemId)=>{
    const item=getItem(itemId);if(!item||!character)return;
    if(character.thalers<item.price){addLog({type:'error',text:`Need ₮${item.price}.`});return;}
    applyDelta({thalers:-item.price});
    setCharacter(c=>{
      const inv=[...c.inventory];
      const existing=inv.findIndex(i=>i.id===itemId);
      if(existing!==-1){inv[existing]={...inv[existing],qty:(inv[existing].qty||1)+1};}
      else{inv.push({...item,qty:1});}
      return{...c,inventory:inv};
    });
    addLog({type:'buy',text:`Bought ${item.name} for ₮${item.price}.`});
  },[character,applyDelta,addLog]);
  const sellItem=useCallback((itemId)=>{const item=getItem(itemId);if(!item||!character)return;const sp=Math.floor(item.price*0.6);applyDelta({thalers:sp});setCharacter(c=>{const inv=[...c.inventory];const i=inv.findIndex(x=>x.id===itemId);if(i!==-1){inv[i]={...inv[i],qty:inv[i].qty-1};if(inv[i].qty<=0)inv.splice(i,1);}return{...c,inventory:inv};});addLog({type:'sell',text:`Sold ${item.name} for ₮${sp}.`});},[character,applyDelta,addLog]);
  const updateNPCTrust=useCallback((npcId,delta)=>{setCharacter(c=>({...c,npcTrust:{...(c.npcTrust||{}),[npcId]:Math.min(100,Math.max(0,(c.npcTrust?.[npcId]||0)+delta))}}));},[]);

  // ── Special dark secret combat ability ─────────────────────────────────
  const useDarkAbility=useCallback(()=>{
    if(!combat||!character)return;
    const ability=character.darkSecret?.combatAbility;
    if(!ability){addLog({type:'error',text:'No special ability.'});return;}
    const cd=combat.darkAbilityCooldown||0;
    if(cd>0){addLog({type:'error',text:`Ability on cooldown (${cd} rounds remaining).`});return;}
    const result=rollCheck(character.attributes[ability.attribute]||0);
    const wb=character.equippedWeapon?(getItem(character.equippedWeapon)?.bonus||0):0;
    let abilityText='';
    let pd=0,ed=0;
    if(result.outcome!=='failure'){
      const flavor=ability.flavorSuccess;
      switch(ability.effect){
        case 'negate_damage':
          abilityText=`${ability.name}: ${flavor} (Incoming damage negated this round.)`;
          setCombat(p=>({...p,round:p.round+1,darkAbilityCooldown:ability.cooldown,negateNext:true,log:[...p.log,{round:p.round,text:abilityText,roll:result.total}]}));
          addLog({type:'complete',text:`[Special] ${abilityText}`});
          return;
        case 'death_heal':{
          const wIdx=WOUND_LEVELS.indexOf(character.wounds);
          if(wIdx>0)setCharacter(c=>({...c,wounds:WOUND_LEVELS[wIdx-1]}));
          pd=rollDamage(1,4,wb)+4;
          abilityText=`${ability.name}: ${flavor} Wound improved, deal ${pd} bonus damage.`;
          break;}
        case 'double_damage':
          pd=rollDamage(2,6,wb)*2;
          abilityText=`${ability.name}: ${flavor} Deal ${pd} damage.`;
          break;
        case 'soul_strike':
          pd=rollDamage(1,6,wb)+6;
          abilityText=`${ability.name}: ${flavor} Deal ${pd} damage. Entity destabilized.`;
          break;
        case 'berserk':
          pd=rollDamage(3,6,wb);
          ed=rollDamage(1,6);
          abilityText=`${ability.name}: ${flavor} Deal ${pd}, take ${ed} (self-inflicted).`;
          if(ed>0){const wi=WOUND_LEVELS.indexOf(character.wounds);setCharacter(c=>({...c,wounds:ed>=5?WOUND_LEVELS[Math.min(wi+1,4)]:c.wounds}));}
          break;
        case 'phase_shift':
          abilityText=`${ability.name}: ${flavor} (All attacks bypass you this round.)`;
          setCombat(p=>({...p,round:p.round+1,darkAbilityCooldown:ability.cooldown,negateNext:true,log:[...p.log,{round:p.round,text:abilityText,roll:result.total}]}));
          addLog({type:'complete',text:`[Special] ${abilityText}`});
          return;
        case 'terrify':
          abilityText=`${ability.name}: ${flavor} Enemy attack bonus reduced for 2 rounds.`;
          setCombat(p=>({...p,round:p.round+1,darkAbilityCooldown:ability.cooldown,debuffRounds:2,log:[...p.log,{round:p.round,text:abilityText,roll:result.total}]}));
          addLog({type:'complete',text:`[Special] ${abilityText}`});
          return;
        case 'tactical':
          pd=8;
          abilityText=`${ability.name}: ${flavor} Deal ${pd} guaranteed damage.`;
          break;
        case 'wild_card':{
          const effects=['double_damage','negate_damage','soul_strike','death_heal'];
          const e=effects[Math.floor(Math.random()*effects.length)];
          if(e==='negate_damage'){setCombat(p=>({...p,round:p.round+1,darkAbilityCooldown:ability.cooldown,negateNext:true,log:[...p.log,{round:p.round,text:`${ability.name}: ${flavor} (Random: damage negated.)`,roll:result.total}]}));addLog({type:'complete',text:`[Special] ${ability.name}: Random — damage negated.`});return;}
          pd=e==='double_damage'?rollDamage(2,6,wb)*2:e==='soul_strike'?rollDamage(1,6,wb)+6:rollDamage(1,4,wb)+4;
          abilityText=`${ability.name}: ${flavor} Deal ${pd} (random effect).`;
          break;}
        default:
          pd=rollDamage(1,6,wb)+3;
          abilityText=`${ability.name}: ${flavor} Deal ${pd}.`;
      }
    } else {
      abilityText=`${ability.name}: ${ability.flavorFail}`;
    }
    if(pd>0){
      const newHp=combat.enemy.currentHp-pd;
      if(newHp<=0){
        let loot='';
        combat.enemy.loot?.forEach(l=>{if(Math.random()<l.chance){if(l.thalers){const a=Math.floor(Math.random()*(l.thalers[1]-l.thalers[0]))+l.thalers[0];if(a>0){applyDelta({thalers:a,stats:{thalersEarned:a}});loot+=` +₮${a}.`;}}if(l.item){const item=ITEMS[l.item];if(item){setCharacter(c=>({...c,inventory:[...c.inventory,{...item,qty:1}]}));loot+=` Found ${item.name}. `;}}}});
        applyDelta({stats:{entitiesDefeated:1}});
        addLog({type:'combat_win',text:`⚔ [Special] ${abilityText} — ${combat.enemy.name} defeated.${loot}`});
        setCombat(null);
      } else {
        setCombat(p=>({...p,round:p.round+1,darkAbilityCooldown:ability.cooldown,enemy:{...p.enemy,currentHp:newHp},log:[...p.log,{round:p.round,text:abilityText,roll:result.total}]}));
        addLog({type:'complete',text:`[Special] ${abilityText}`});
      }
    } else {
      setCombat(p=>({...p,round:p.round+1,darkAbilityCooldown:Math.max(0,ability.cooldown-1),log:[...p.log,{round:p.round,text:abilityText,roll:result.total}]}));
      addLog({type:'failure',text:`[Special] ${abilityText}`});
    }
  },[combat,character,applyDelta,addLog]);

  // ── Crafting ────────────────────────────────────────────────────────────
  const craftItem=useCallback((recipeId)=>{
    if(!character)return;
    const recipe=RECIPES.find(r=>r.id===recipeId);
    if(!recipe){addLog({type:'error',text:'Unknown recipe.'});return;}
    if((character.insight||0)<recipe.insightRequired){addLog({type:'error',text:`Need Insight ${recipe.insightRequired}.`});return;}
    if((character.ap||0)<recipe.apCost){addLog({type:'error',text:`Need ${recipe.apCost} AP.`});return;}
    // Check for ingredients (respect qty)
    const needed={};
    recipe.ingredients.forEach(id=>{needed[id]=(needed[id]||0)+1;});
    for(const[id,count] of Object.entries(needed)){
      const inv=character.inventory.find(i=>i.id===id);
      if(!inv||(inv.qty||1)<count){addLog({type:'error',text:`Missing ingredient: ${ITEMS[id]?.name||id}.`});return;}
    }
    applyDelta({ap:-recipe.apCost});
    setCharacter(c=>{
      let inv=[...c.inventory];
      // Consume ingredients
      Object.entries(needed).forEach(([id,count])=>{
        const idx=inv.findIndex(i=>i.id===id);
        if(idx!==-1){inv[idx]={...inv[idx],qty:inv[idx].qty-count};if(inv[idx].qty<=0)inv.splice(idx,1);}
      });
      // Add result
      const result=ITEMS[recipe.resultId];
      if(result){const existIdx=inv.findIndex(i=>i.id===recipe.resultId);if(existIdx!==-1){inv[existIdx]={...inv[existIdx],qty:(inv[existIdx].qty||1)+1};}else{inv.push({...result,qty:1});}}
      return{...c,inventory:inv};
    });
    addLog({type:'complete',text:`[Crafting] ${recipe.name} created.`});
  },[character,applyDelta,addLog]);

  return {
    screen,setScreen,character,setCharacter,combat,setCombat,
    activeModal,setActiveModal,
    pendingEvent,setPendingEvent,
    pendingDAEvent,setPendingDAEvent,
    startGame,loadSavedGame,travel,performAction,
    attackEnemy,fleeCombat,commitCrime,performRitual,performTraining,
    useItem,equipItem,buyItem,sellItem,updateNPCTrust,resolveEvent,
    advanceScenario,resolveDAEvent,checkDAEvent,
    useDarkAbility, craftItem,
    addLog,
  };
}
