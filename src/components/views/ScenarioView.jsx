import { useState } from 'react';
import { getScenariosForInsight, getScenario } from '../../data/scenarios.js';
import styles from './ScenarioView.module.css';

const APPROACH_LABELS = {
  investigation:'Investigation', social:'Social', infiltration:'Infiltration',
  research:'Research', negotiation:'Negotiation', confrontation:'Confrontation',
  surveillance:'Surveillance', exploration:'Exploration', communication:'Communication',
  personal:'Personal', 'social':'Social',
};

const LENGTH_COLOR = { Short:'var(--vital-lit)', Medium:'var(--gold)', Long:'var(--red-lit)' };

export default function ScenarioView({ character }) {
  const available   = getScenariosForInsight(character.insight);
  const locked      = 5 - available.length;
  const [active, setActive]       = useState(available[0]?.id || null);
  const [expandAct, setExpandAct] = useState(null);

  const progress    = character.scenarioProgress || {};
  const current     = available.find(s => s.id === active);

  // Determine how many acts are complete for a scenario
  const getActsDone = (scenarioId) => {
    const sp = progress[scenarioId];
    if (!sp) return 0;
    return sp.actIdx || 0;
  };

  const isActAvailable = (scenario, actIdx) => {
    const done = getActsDone(scenario.id);
    return actIdx <= done;
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Major Investigations</h2>
      <p className={styles.sub}>
        Long-form scenarios drawing from all editions of KULT. These are the investigations that change everything.
        {locked > 0 && <span className='dim'> {locked} locked behind higher Insight.</span>}
      </p>
      <div className='rule-blood' />

      <div className={styles.layout}>
        {/* Scenario index */}
        <aside className={styles.index}>
          {available.map(s => {
            const done = getActsDone(s.id);
            const total = s.acts.length;
            const sp = progress[s.id];
            const isComplete = sp?.completed;
            return (
              <button key={s.id}
                className={`${styles.scenBtn} ${active===s.id?styles.scenOn:''} ${isComplete?styles.scenDone:''}`}
                onClick={() => setActive(s.id)}>
                <div className={styles.scenName}>{s.name}</div>
                <div className={styles.scenMeta}>
                  <span style={{color: LENGTH_COLOR[s.estimatedLength], fontSize:'0.65rem'}}>{s.estimatedLength}</span>
                  <span className='mono dim' style={{fontSize:'0.6rem'}}>{done}/{total} acts</span>
                </div>
                <div className={styles.scenPips}>
                  {s.acts.map((_,i)=>(
                    <div key={i} className={`${styles.scenPip} ${i<done?styles.pipDone:i===done&&!isComplete?styles.pipNow:''}`}/>
                  ))}
                </div>
              </button>
            );
          })}
          {Array.from({length:locked},(_,i)=>(
            <div key={i} className={styles.scenLocked}>
              <span>◈</span>
              <span className='mono dim' style={{fontSize:'0.65rem'}}>Locked</span>
            </div>
          ))}
        </aside>

        {/* Scenario body */}
        <main className={styles.body}>
          {current && (
            <div className={styles.scenario}>
              <div className={styles.scenHeader}>
                <div>
                  <div className={styles.scenTitle}>{current.name}</div>
                  <div className={styles.scenSub}>{current.subtitle}</div>
                </div>
                <div className={styles.scenTags}>
                  <span style={{color: LENGTH_COLOR[current.estimatedLength]}} className='badge badge-dim'>
                    {current.estimatedLength}
                  </span>
                  <span className='badge badge-dim'>{current.edition}</span>
                  <span className='badge badge-dim'>Insight {current.insightRequired}+</span>
                </div>
              </div>

              <p className={styles.scenSynopsis}>{current.synopsis}</p>

              <div className={styles.themes}>
                {current.themes.map(t=>(
                  <span key={t} className='badge badge-veil'>{t}</span>
                ))}
              </div>

              <div className='rule' />

              {/* Acts */}
              <div className={styles.acts}>
                {current.acts.map((act, idx) => {
                  const actDone     = idx < getActsDone(current.id);
                  const actCurrent  = idx === getActsDone(current.id) && !progress[current.id]?.completed;
                  const actLocked   = !isActAvailable(current, idx);

                  return (
                    <div key={act.id}
                      className={`${styles.act} ${actDone?styles.actDone:actCurrent?styles.actNow:actLocked?styles.actLocked:''}`}
                      onClick={() => !actLocked && setExpandAct(expandAct===act.id?null:act.id)}>

                      <div className={styles.actHeader}>
                        <span className={styles.actNum}>Act {act.num}</span>
                        <span className={styles.actTitle}>{act.title}</span>
                        <span className='badge badge-dim'>{APPROACH_LABELS[act.approach]}</span>
                        {act.isConclusion && <span className='badge badge-gold'>Conclusion</span>}
                        {actLocked && <span className={styles.actLock}>Locked</span>}
                      </div>

                      {expandAct === act.id && !actLocked && (
                        <div className={styles.actBody}>
                          <p className={styles.actDesc}>{act.description}</p>

                          <div className={styles.actObjective}>
                            <span className={styles.objLabel}>Objective</span>
                            <p>{act.objective}</p>
                          </div>

                          <div className={styles.actLocation}>
                            <span className='mono dim' style={{fontSize:'0.65rem'}}>
                              Location: <span className='gold'>{act.location?.replace(/_/g,' ')}</span>
                              {act.trigger && ` · requires: ${act.trigger.action?.replace(/_/g,' ')} ×${act.trigger.count}`}
                            </span>
                            {act.stabilityRisk > 0 && (
                              <span className='mono red' style={{fontSize:'0.65rem'}}>
                                Stability risk: −{act.stabilityRisk}
                              </span>
                            )}
                          </div>

                          {actDone && (
                            <>
                              <div className={styles.actReveals}>
                                <span className={styles.revLabel}>What you learned</span>
                                <p>{act.reveals}</p>
                              </div>
                              {act.complications?.length > 0 && (
                                <div className={styles.comps}>
                                  <span className={styles.compLabel}>Complications encountered</span>
                                  <ul className={styles.compList}>
                                    {act.complications.map((c,i)=>(
                                      <li key={i}>{c}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Possible endings */}
              <div className='rule' />
              <div className={styles.endings}>
                <span className={styles.endLabel}>Possible Conclusions</span>
                <div className={styles.endingList}>
                  {current.endings.map(e=>{
                    const achieved = progress[current.id]?.ending === e.id;
                    return (
                      <div key={e.id} className={`${styles.ending} ${achieved?styles.achieved:''}`}>
                        <span className={styles.endName}>{e.label}</span>
                        {achieved && <span className='badge badge-gold'>Achieved</span>}
                        <p className={styles.endDesc}>{e.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
