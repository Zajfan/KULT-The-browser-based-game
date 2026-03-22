import { useState } from 'react';
import { DARK_SECRETS } from '../data/darkSecrets.js';
import { ADVANTAGES, DISADVANTAGES } from '../data/advantages.js';
import { FACTIONS } from '../data/factions.js';
import { ITEMS } from '../data/items.js';
import styles from './CharacterCreation.module.css';

const ATTRS = [
  { id:'reason',    label:'Reason',     desc:'Logic, analysis, deduction' },
  { id:'intuition', label:'Intuition',  desc:'Gut feelings, subconscious' },
  { id:'perception',label:'Perception', desc:'Attention, observation' },
  { id:'coolness',  label:'Coolness',   desc:'Composure, deception, charm' },
  { id:'violence',  label:'Violence',   desc:'Combat, aggression, force' },
  { id:'soul',      label:'Soul',       desc:'Spiritual depth, true reality' },
  { id:'willpower', label:'Willpower',  desc:'Resistance to horror, endurance' },
  { id:'fortitude', label:'Fortitude',  desc:'Physical resilience, pain' },
  { id:'reflexes',  label:'Reflexes',   desc:'Speed, evasion, reaction' },
];

const PRESETS = [
  { label:'Survivor',  points:{ fortitude:2, violence:1, coolness:1, willpower:1 } },
  { label:'Scholar',   points:{ reason:2, perception:2, intuition:1 } },
  { label:'Occultist', points:{ soul:2, intuition:2, willpower:1 } },
  { label:'Operator',  points:{ coolness:2, reflexes:2, violence:1 } },
];

const SECRET_ITEMS = {
  occultist:'grimoire_fragment', guilty:'false_papers', dimensional:'map_nowhere',
  cult_leader:'contact_list', researcher:'research_dossier', death_wish:'battle_weapon',
  unknown_past:'unknown_artifact', acedia:'worn_rosary',
};

const TOTAL_PTS = 5;

const STEP_LABELS = ['Dark Secret','Attributes','Advantages','Faction','Finalize'];

export default function CharacterCreation({ onStart, onBack }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name:'', darkSecret:null, attributePoints:{},
    advantages:[], disadvantages:[], faction:'neutral', startingItemId:null,
  });

  const spent = Object.values(form.attributePoints).reduce((a,b)=>a+b, 0);
  const advCost = form.advantages.reduce((a,x)=>a+(x.cost||1),0);
  const disBon  = form.disadvantages.reduce((a,x)=>a+(x.bonus||1),0);
  const budget  = 3 + disBon;

  const selectSecret = (s) => {
    setForm(f=>({...f, darkSecret:s, startingItemId:SECRET_ITEMS[s.id]||null, faction:s.startingFaction||'neutral'}));
    setStep(1);
  };

  const adj = (attr, d) => {
    const cur = form.attributePoints[attr]||0;
    const nxt = cur+d;
    if (nxt < -2 || nxt > 3) return;
    if (d>0 && spent >= TOTAL_PTS) return;
    setForm(f=>({...f, attributePoints:{...f.attributePoints,[attr]:nxt}}));
  };

  const toggleAdv = (adv) => {
    if (form.advantages.find(a=>a.id===adv.id)) {
      setForm(f=>({...f,advantages:f.advantages.filter(a=>a.id!==adv.id)}));
    } else {
      if (advCost+adv.cost > budget) return;
      setForm(f=>({...f,advantages:[...f.advantages,adv]}));
    }
  };
  const toggleDis = (dis) => {
    if (form.disadvantages.find(d=>d.id===dis.id)) {
      setForm(f=>({...f,disadvantages:f.disadvantages.filter(d=>d.id!==dis.id)}));
    } else {
      setForm(f=>({...f,disadvantages:[...f.disadvantages,dis]}));
    }
  };

  const canNext = () => {
    if (step===0) return !!form.darkSecret;
    if (step===4) return form.name.trim().length >= 2;
    return true;
  };

  /* ── Steps ───────────────────────── */

  const S0 = () => (
    <>
      <div className={styles.stepHead}>
        <span className={styles.stepEyebrow}>Step 01 — Origin</span>
        <h2 className={styles.stepTitle}>Choose your Dark Secret</h2>
        <p className={styles.stepDesc}>
          The event or circumstance that cracked the Illusion for you. It defines who you were before you started waking up — and who you are becoming.
        </p>
      </div>
      <div className={styles.secretGrid}>
        {DARK_SECRETS.map(s=>(
          <div key={s.id} data-glyph="⛧"
            className={`${styles.secretCard} ${form.darkSecret?.id===s.id?styles.selected:''}`}
            onClick={()=>selectSecret(s)}>
            <div className={styles.secretName}>{s.name}</div>
            <div className={styles.secretSub}>{s.subtitle}</div>
            <p className={styles.secretDesc}>{s.description}</p>
            {s.startingBonus && (
              <div className={styles.secretBonuses}>
                {Object.entries(s.startingBonus).map(([k,v])=>(
                  <span key={k} className={`badge ${v>0?'badge-vital':'badge-red'}`}>{k} {v>0?'+':''}{v}</span>
                ))}
              </div>
            )}
            <p className={styles.secretAbility}>{s.specialAbility}</p>
            <p className={styles.secretHint}>💡 {s.hint}</p>
          </div>
        ))}
      </div>
    </>
  );

  const S1 = () => (
    <>
      <div className={styles.stepHead}>
        <span className={styles.stepEyebrow}>Step 02 — Capabilities</span>
        <h2 className={styles.stepTitle}>Distribute Attributes</h2>
        <p className={styles.stepDesc}>
          Spread {TOTAL_PTS} points across your nine attributes. Range is −2 to +3.
          These are added to every 2d10 roll you make.
        </p>
      </div>
      <div className={styles.presets}>
        <span className={styles.presetsLabel}>Quick build:</span>
        {PRESETS.map(p=>(
          <button key={p.label} className='act act-sm'
            onClick={()=>setForm(f=>({...f,attributePoints:{...p.points}}))}>
            {p.label}
          </button>
        ))}
        <button className='act act-sm' onClick={()=>setForm(f=>({...f,attributePoints:{}}))}>Clear</button>
      </div>
      <div className={`${styles.attrBudget} ${spent>TOTAL_PTS?styles.over:''}`}>
        <span>{spent}</span> / {TOTAL_PTS} points spent
      </div>
      <div className={styles.attrGrid}>
        {ATTRS.map(a=>{
          const bonus = form.darkSecret?.startingBonus?.[a.id]||0;
          const spent_ = form.attributePoints[a.id]||0;
          const total  = bonus+spent_;
          return (
            <div key={a.id} className={styles.attrRow}>
              <div className={styles.attrInfo}>
                <span className={styles.attrLabel}>{a.label}</span>
                <span className={styles.attrHint}>{a.desc}</span>
              </div>
              <div className={styles.attrControl}>
                {bonus!==0&&<span className={`badge ${bonus>0?'badge-vital':'badge-red'}`}>{bonus>0?'+':''}{bonus}</span>}
                <button className='act act-sm' onClick={()=>adj(a.id,-1)} disabled={spent_<=-2}>−</button>
                <span className={`${styles.attrVal} ${total>0?styles.pos:total<0?styles.neg:''}`}>
                  {total>0?'+':''}{total}
                </span>
                <button className='act act-sm' onClick={()=>adj(a.id,1)} disabled={spent_>=3||spent>=TOTAL_PTS}>+</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  const S2 = () => (
    <>
      <div className={styles.stepHead}>
        <span className={styles.stepEyebrow}>Step 03 — Refinement</span>
        <h2 className={styles.stepTitle}>Advantages &amp; Disadvantages</h2>
        <p className={styles.stepDesc}>
          You have {budget} points to spend on advantages (base 3 + {disBon} from disadvantages). Spent: {advCost}.
        </p>
      </div>
      <div className={styles.advLayout}>
        <div>
          <div className={styles.advHead}>Advantages</div>
          <div className={styles.advList}>
            {ADVANTAGES.map(adv=>{
              const on  = !!form.advantages.find(a=>a.id===adv.id);
              const ok  = on||(advCost+adv.cost<=budget);
              return (
                <div key={adv.id} className={`${styles.advCard} ${on?styles.advOn:''} ${!ok&&!on?styles.locked:''}`}
                  onClick={()=>ok&&toggleAdv(adv)}>
                  <div className={styles.advCardHead}>
                    <span className={styles.advName}>{adv.name}</span>
                    <span className='badge badge-gold'>{adv.cost}pt</span>
                  </div>
                  <p className={styles.advDesc}>{adv.description}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className={styles.advHead}>Disadvantages <span className='dim'>(grant extra points)</span></div>
          <div className={styles.advList}>
            {DISADVANTAGES.map(dis=>{
              const on = !!form.disadvantages.find(d=>d.id===dis.id);
              return (
                <div key={dis.id} className={`${styles.advCard} ${on?styles.disOn:''}`} onClick={()=>toggleDis(dis)}>
                  <div className={styles.advCardHead}>
                    <span className={styles.advName}>{dis.name}</span>
                    <span className='badge badge-red'>+{dis.bonus}pt</span>
                  </div>
                  <p className={styles.advDesc}>{dis.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  const S3 = () => (
    <>
      <div className={styles.stepHead}>
        <span className={styles.stepEyebrow}>Step 04 — Allegiance</span>
        <h2 className={styles.stepTitle}>Choose your Faction</h2>
        <p className={styles.stepDesc}>
          Your initial allegiance shapes who finds you and who hunts you. Nothing here is permanent.
        </p>
      </div>
      <div className={styles.factionGrid}>
        {Object.values(FACTIONS).map(f=>(
          <div key={f.id} data-interactive
            className={`${styles.factionCard} ${form.faction===f.id?styles.fSelected:''}`}
            style={{'--fc':f.color}}
            onClick={()=>setForm(x=>({...x,faction:f.id}))}>
            <span className={styles.fIcon}>{f.icon}</span>
            <div className={styles.fName}>{f.name}</div>
            <p className={styles.fDesc}>{f.description}</p>
            {f.bonuses&&(
              <div className={styles.fBonuses}>
                {Object.entries(f.bonuses).map(([k,v])=>(
                  <div key={k} className={styles.fBonus}>
                    <span className={`badge ${k==='enemies'?'badge-red':'badge-gold'}`}>{k}</span>
                    <span className={styles.fBonusText}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );

  const S4 = () => {
    const s = form.darkSecret;
    const item = form.startingItemId ? ITEMS[form.startingItemId] : null;
    const allAttrs = {};
    ATTRS.forEach(a=>{ allAttrs[a.id]=(s?.startingBonus?.[a.id]||0)+(form.attributePoints[a.id]||0); });
    return (
      <>
        <div className={styles.stepHead}>
          <span className={styles.stepEyebrow}>Step 05 — Identity</span>
          <h2 className={styles.stepTitle}>Name yourself</h2>
          <p className={styles.stepDesc}>The name you carry in the Illusion. Choose carefully.</p>
        </div>
        <div className={styles.nameSection}>
          <input className='field' type='text' placeholder='Enter your name...'
            value={form.name} maxLength={30}
            onChange={e=>setForm(f=>({...f,name:e.target.value}))}
            autoFocus />
        </div>
        <div className={styles.summary}>
          <div className={styles.summaryBlock}>
            <span className={styles.summaryLabel}>Dark Secret</span>
            <p style={{fontFamily:'var(--display)',fontSize:'0.82rem',color:'var(--gold-lit)'}}>{s?.name}</p>
            <p style={{fontSize:'0.72rem',fontStyle:'italic',color:'var(--ink-dim)',marginTop:4}}>{s?.specialAbility}</p>
          </div>
          <div className={styles.summaryBlock}>
            <span className={styles.summaryLabel}>Attributes</span>
            <div className={styles.summaryAttrs}>
              {ATTRS.map(a=>(
                <span key={a.id} className={`${styles.summaryAttr} ${allAttrs[a.id]>0?styles.pos:allAttrs[a.id]<0?styles.neg:''}`}>
                  {a.label.slice(0,3)}: {allAttrs[a.id]>0?'+':''}{allAttrs[a.id]}
                </span>
              ))}
            </div>
          </div>
          {form.advantages.length>0&&(
            <div className={styles.summaryBlock}>
              <span className={styles.summaryLabel}>Advantages</span>
              <p style={{fontSize:'0.78rem',color:'var(--ink)'}}>{form.advantages.map(a=>a.name).join(', ')}</p>
            </div>
          )}
          <div className={styles.summaryBlock}>
            <span className={styles.summaryLabel}>Faction / Starting Item</span>
            <p style={{fontSize:'0.78rem',color:'var(--ink)'}}>
              {FACTIONS[form.faction]?.icon} {FACTIONS[form.faction]?.name}
              {item&&<span className='dim'> · {item.icon} {item.name}</span>}
            </p>
          </div>
        </div>
      </>
    );
  };

  const STEPS = [S0,S1,S2,S3,S4];
  const CurrentStep = STEPS[step];

  return (
    <div className={styles.shell}>
      {/* Progress */}
      <header className={styles.progress}>
        <button className={`act act-sm ${styles.backBtn}`} onClick={onBack}>← Back</button>
        <div className={styles.steps}>
          {STEP_LABELS.map((l,i)=>(
            <div key={i} className={`${styles.step} ${i===step?styles.active:''} ${i<step?styles.done:''}`}
              onClick={()=>i<step&&setStep(i)}>
              <span className={styles.stepNum}>{String(i+1).padStart(2,'0')}</span>
              <span className={styles.stepLabel}>{l}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className={styles.body}>
        <CurrentStep />
      </div>

      {/* Footer nav */}
      <footer className={styles.footer}>
        {step>0&&<button className='act' onClick={()=>setStep(s=>s-1)}>← Previous</button>}
        <div style={{flex:1}}/>
        {step<STEPS.length-1
          ? <button className='act act-gold' onClick={()=>setStep(s=>s+1)} disabled={!canNext()}>Continue →</button>
          : <button className='act act-danger act-lg' onClick={()=>canNext()&&onStart({...form})} disabled={!canNext()}>
              ⛧ Enter the Illusion
            </button>
        }
      </footer>
    </div>
  );
}
