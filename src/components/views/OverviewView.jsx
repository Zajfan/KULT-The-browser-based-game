import { useMemo } from 'react';
import { getMilestone, getNextMilestone, INSIGHT_EVENTS } from '../../data/awakening.js';
import { getScenariosForInsight } from '../../data/scenarios.js';
import { getExtendedScenariosForInsight } from '../../data/scenarios_extended.js';
import { getSideCasesForInsight } from '../../data/side_cases.js';
import { getAvailableQuests, getQuestProgress } from '../../data/quests.js';
import { FACTIONS, getFactionRank } from '../../data/factions.js';
import { getDeathAngelForSecret } from '../../data/deathAngels.js';
import { getTransmission } from '../../data/transmission.js';
import styles from './OverviewView.module.css';

const WOUND_LABEL_COLOR = {
  None:'var(--vital-lit)', Stabilized:'var(--gold)', Serious:'oklch(62% 0.14 55)',
  Critical:'var(--red-lit)', Mortal:'var(--red-vivid)'
};

export default function OverviewView({ character }) {
  const milestone     = getMilestone(character.insight);
  const nextMilestone = getNextMilestone(character.insight);
  const patronDA      = getDeathAngelForSecret(character.darkSecret?.id);

  const allScenarios = useMemo(() => [
    ...getScenariosForInsight(character.insight),
    ...getExtendedScenariosForInsight(character.insight),
  ], [character.insight]);

  const sp = character.scenarioProgress || {};

  const activeScenarios = allScenarios.filter(s => {
    const p = sp[s.id];
    return p && !p.completed && p.actIdx > 0;
  });

  const availableScenarios = allScenarios.filter(s => {
    const p = sp[s.id];
    return !p || p.actIdx === 0;
  }).slice(0, 3);

  const activeQuests = getAvailableQuests(character).filter(q => {
    const p = getQuestProgress(character, q.id);
    return !p.completed && (p.actionCount > 0 || p.stageIdx > 0);
  });

  const sides = getSideCasesForInsight(character.insight).slice(0, 4);

  const day = character.gameTime?.day ?? 1;
  const transmission = useMemo(() => getTransmission(day, character.insight), [day, character.insight]);

  const factionEntries = Object.entries(character.factionStandings || {})
    .filter(([,v]) => Math.abs(v) > 5)
    .sort(([,a],[,b]) => Math.abs(b) - Math.abs(a))
    .slice(0, 4);

  const stabPct = (character.stability / character.maxStability) * 100;
  const stabColor = character.stability > 6 ? 'var(--vital-lit)' : character.stability > 3 ? 'var(--gold)' : 'var(--red-vivid)';

  return (
    <div className={styles.page}>

      {/* Character header */}
      <div className={styles.charHeader}>
        <div className={styles.charLeft}>
          <div className={styles.charName}>{character.name}</div>
          <div className={styles.charSecret}>{character.darkSecret?.name} — <em>{character.darkSecret?.subtitle}</em></div>
          <div className={styles.charAbility}>{character.darkSecret?.specialAbility}</div>
        </div>
        <div className={styles.charRight}>
          <div className={styles.charStat}>
            <span>Stability</span>
            <div className={styles.charBar}>
              <div className={styles.charBarFill} style={{width:`${stabPct}%`,background:stabColor}}/>
            </div>
            <span className='mono' style={{color:stabColor}}>{Math.floor(character.stability)}/{character.maxStability}</span>
          </div>
          <div className={styles.charStat}>
            <span>Wounds</span>
            <span className='mono' style={{color:WOUND_LABEL_COLOR[character.wounds]}}>{character.wounds}</span>
          </div>
          <div className={styles.charStat}>
            <span>Thalers</span>
            <span className='mono gold'>₮{character.thalers.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <hr className='rule-blood' />

      {/* Awakening status */}
      <section className={styles.section}>
        <h3 className={styles.sh}>Awakening Status</h3>
        <div className={styles.awakening}>
          <div className={styles.milestone}>
            <span className={styles.msGlyph} style={{color: milestone.color}}>◈</span>
            <div>
              <div className={styles.msTitle} style={{color: milestone.color}}>{milestone.title}</div>
              <div className={styles.msSub}>{milestone.subtitle}</div>
              <p className={styles.msDesc}>{milestone.description}</p>
            </div>
            <div className={styles.insightPips}>
              {Array.from({length:10},(_,i)=>(
                <div key={i} className={`${styles.pip} ${i < character.insight ? styles.pipOn : ''}`}
                  style={i < character.insight ? {background: milestone.color} : {}}/>
              ))}
              <span className='mono' style={{color: milestone.color, fontSize:'0.72rem'}}>{character.insight}/10</span>
            </div>
          </div>
          {nextMilestone && (
            <div className={styles.nextMs}>
              <span className={styles.nextLabel}>Next</span>
              <span className={styles.nextTitle} style={{color: nextMilestone.color}}>{nextMilestone.title}</span>
              <span className='mono dim' style={{fontSize:'0.65rem'}}>at Insight {nextMilestone.insight}</span>
            </div>
          )}
        </div>
        {milestone.unlocks?.length > 0 && (
          <div className={styles.unlocks}>
            <span className={styles.unlockLabel}>Currently Unlocked</span>
            <div className={styles.unlockList}>
              {milestone.unlocks.map(u => <span key={u} className='badge badge-dim'>{u}</span>)}
            </div>
          </div>
        )}
      </section>

      {/* Patron Death Angel */}
      {patronDA && (
        <>
          <hr className='rule' />
          <section className={styles.section}>
            <h3 className={styles.sh}>Patron Death Angel</h3>
            <div className={styles.patronDA}>
              <span className={styles.daIcon}>{patronDA.icon}</span>
              <div>
                <div className={styles.daName}>{patronDA.name} — {patronDA.title}</div>
                <div className={styles.daAspect}>{patronDA.aspect}</div>
                <p className={styles.daNote}>{patronDA.manifestation}</p>
              </div>
            </div>
          </section>
        </>
      )}

      <hr className='rule' />

      <div className={styles.twoCol}>
        {/* Active Investigations */}
        <div>
          <h3 className={styles.sh}>Active Investigations</h3>
          {activeScenarios.length === 0 && activeQuests.length === 0 && (
            <p className='italic dim' style={{fontSize:'0.82rem'}}>No active investigations. Check the Cases & Investigations view to begin one.</p>
          )}
          {activeScenarios.map(s => {
            const p = sp[s.id] || {};
            const act = s.acts[p.actIdx];
            return (
              <div key={s.id} className={styles.activeCase}>
                <div className={styles.caseName}>{s.name}</div>
                {act && (
                  <>
                    <div className={styles.caseAct}>Act {p.actIdx + 1}: {act.title}</div>
                    <p className={styles.caseObjective}>{act.objective}</p>
                    <div className={styles.caseTrigger}>
                      <span className='mono dim' style={{fontSize:'0.65rem'}}>
                        Next: <span className='gold'>{act.trigger?.action?.replace(/_/g,' ')}</span>
                        {act.trigger?.location && ` at ${act.trigger.location.replace(/_/g,' ')}`}
                        {act.trigger?.count > 1 && ` ×${act.trigger.count - (p.actionCount || 0)} remaining`}
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
          {activeQuests.map(q => {
            const p = getQuestProgress(character, q.id);
            const stage = q.stages[p.stageIdx];
            return (
              <div key={q.id} className={styles.activeCase}>
                <div className={styles.caseName}>{q.name} <span className='badge badge-veil'>Quest</span></div>
                {stage && (
                  <>
                    <div className={styles.caseAct}>{stage.title}</div>
                    <p className={styles.caseObjective}>{stage.objective}</p>
                  </>
                )}
              </div>
            );
          })}

          <hr className='rule' style={{margin:'14px 0'}} />
          <h3 className={styles.sh}>Available Cases</h3>
          {availableScenarios.map(s => (
            <div key={s.id} className={styles.availCase}>
              <span className={styles.availName}>{s.name}</span>
              <span className='dim' style={{fontSize:'0.72rem', fontStyle:'italic'}}>{s.subtitle}</span>
            </div>
          ))}
        </div>

        {/* Right column: factions + transmission */}
        <div>
          <h3 className={styles.sh}>Faction Standing</h3>
          <div className={styles.factions}>
            {factionEntries.map(([fId, standing]) => {
              const f = FACTIONS[fId]; if (!f) return null;
              const rank = getFactionRank(standing);
              return (
                <div key={fId} className={styles.factionRow}>
                  <span style={{color: f.color}}>{f.icon}</span>
                  <span className={styles.fName}>{f.name}</span>
                  <span className='mono' style={{color: rank.color, fontSize:'0.72rem'}}>{rank.label}</span>
                  <span className='mono dim' style={{fontSize:'0.65rem'}}>{standing > 0 ? '+' : ''}{standing}</span>
                </div>
              );
            })}
            {factionEntries.length === 0 && (
              <p className='italic dim' style={{fontSize:'0.78rem'}}>No significant faction relationships yet.</p>
            )}
          </div>

          <hr className='rule' style={{margin:'14px 0'}} />
          <h3 className={styles.sh}>City News</h3>
          <div className={styles.news}>
            {transmission.mundane.slice(0,2).map((item, i) => (
              <p key={i} className={styles.newsItem}>{item}</p>
            ))}
            {transmission.supernatural.slice(0,1).map((item, i) => (
              <p key={`s${i}`} className={`${styles.newsItem} ${styles.supernatural}`}>{item}</p>
            ))}
          </div>

          <hr className='rule' style={{margin:'14px 0'}} />
          <h3 className={styles.sh}>Side Cases</h3>
          {sides.map(c => (
            <div key={c.id} className={styles.sideCase}>
              <span className={styles.scName}>{c.name}</span>
              <p className={styles.scHook}>{c.hook.substring(0, 100)}...</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
