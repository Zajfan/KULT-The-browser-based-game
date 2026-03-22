import { useState } from 'react';
import { getScenariosForInsight } from '../../data/scenarios.js';
import { getExtendedScenariosForInsight } from '../../data/scenarios_extended.js';
import { getSideCasesForInsight } from '../../data/side_cases.js';
import styles from './ScenarioView.module.css';

const APPROACH_LABELS = {
  investigation:'Investigation', social:'Social', infiltration:'Infiltration',
  research:'Research', negotiation:'Negotiation', confrontation:'Confrontation',
  surveillance:'Surveillance', exploration:'Exploration', communication:'Communication',
  personal:'Personal',
};
const LENGTH_COLOR = { Long:'var(--red-lit)', Medium:'var(--gold)', Short:'var(--vital-lit)', 'One Session':'var(--veil-vivid)' };

const TABS = ['All','Core','Extended','Side Cases'];

export default function ScenarioView({ character }) {
  const [tab,        setTab]        = useState('All');
  const [activeId,   setActive]     = useState(null);
  const [expandAct,  setExpandAct]  = useState(null);

  const core     = getScenariosForInsight(character.insight);
  const extended = getExtendedScenariosForInsight(character.insight);
  const sides    = getSideCasesForInsight(character.insight);
  const allFull  = [...core, ...extended];

  const shown = tab === 'All'        ? allFull
              : tab === 'Core'       ? core
              : tab === 'Extended'   ? extended
              : sides;

  const progress = character.scenarioProgress || {};

  const getActsDone = (id) => progress[id]?.actIdx || 0;
  const isComplete  = (id) => progress[id]?.completed || false;

  const current = allFull.find(s => s.id === activeId);
  const currentSide = sides.find(s => s.id === activeId);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Cases & Investigations</h2>
      <p className={styles.sub}>
        {core.length + extended.length} full investigations · {sides.length} side cases available at your current Insight.
      </p>

      <div className={styles.tabRow}>
        {TABS.map(t => (
          <button key={t} className={`${styles.tabBtn} ${tab===t?styles.tabOn:''}`}
            onClick={() => { setTab(t); setActive(null); }}>
            {t}
            {t==='All'        && <span className={styles.count}>{allFull.length}</span>}
            {t==='Core'       && <span className={styles.count}>{core.length}</span>}
            {t==='Extended'   && <span className={styles.count}>{extended.length}</span>}
            {t==='Side Cases' && <span className={styles.count}>{sides.length}</span>}
          </button>
        ))}
      </div>

      <hr className='rule-blood' />

      {/* Side Cases tab */}
      {tab === 'Side Cases' && (
        <div className={styles.sideList}>
          {sides.map(c => (
            <div key={c.id}
              className={`${styles.sideCard} ${activeId===c.id?styles.sideOn:''}`}
              onClick={() => setActive(activeId===c.id?null:c.id)}>
              <div className={styles.sideHead}>
                <span className={styles.sideName}>{c.name}</span>
                <div className={styles.sideTags}>
                  <span style={{color: LENGTH_COLOR[c.estimatedLength]}} className='badge badge-dim'>{c.estimatedLength}</span>
                  <span className='badge badge-dim'>{c.theme}</span>
                  {c.insightRequired > 0 && <span className='badge badge-veil'>Insight {c.insightRequired}+</span>}
                </div>
              </div>
              {activeId === c.id && (
                <div className={styles.sideBody}>
                  <p className={styles.sideHook}>{c.hook}</p>
                  <div className={styles.sideResolution}>
                    <span className={styles.resLabel}>Resolution Direction</span>
                    <p>{c.resolution}</p>
                  </div>
                  <div className={styles.sideRewards}>
                    {c.reward?.thalers > 0  && <span className='badge badge-gold'>₮{c.reward.thalers}</span>}
                    {c.reward?.insight > 0  && <span className='badge badge-gold'>Insight +{c.reward.insight}</span>}
                    {c.reward?.stability > 0 && <span className='badge badge-vital'>Stability +{c.reward.stability}</span>}
                    {c.reward?.stabilityLoss > 0 && <span className='badge badge-red'>Stability −{c.reward.stabilityLoss}</span>}
                    {c.reward?.factionReward && <span className='badge badge-veil'>Faction +{c.reward.factionReward.amount}</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Full scenario tabs */}
      {tab !== 'Side Cases' && (
        <div className={styles.layout}>
          {/* Index */}
          <aside className={styles.index}>
            {shown.map(s => {
              const done  = getActsDone(s.id);
              const total = s.acts?.length || 0;
              const done_ = isComplete(s.id);
              return (
                <button key={s.id}
                  className={`${styles.scenBtn} ${activeId===s.id?styles.scenOn:''} ${done_?styles.scenDone:''}`}
                  onClick={() => setActive(activeId===s.id?null:s.id)}>
                  <div className={styles.scenName}>{s.name}</div>
                  <div className={styles.scenMeta}>
                    <span style={{color: LENGTH_COLOR[s.estimatedLength], fontSize:'0.65rem'}}>{s.estimatedLength}</span>
                    {total > 0 && <span className='mono dim' style={{fontSize:'0.6rem'}}>{done}/{total}</span>}
                  </div>
                  {total > 0 && (
                    <div className={styles.scenPips}>
                      {s.acts.map((_,i)=>(
                        <div key={i} className={`${styles.scenPip} ${i<done?styles.pipDone:i===done&&!done_?styles.pipNow:''}`}/>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </aside>

          {/* Detail */}
          <main className={styles.body}>
            {current ? (
              <div className={styles.scenario}>
                <div className={styles.scenHeader}>
                  <div>
                    <div className={styles.scenTitle}>{current.name}</div>
                    <div className={styles.scenSub}>{current.subtitle}</div>
                  </div>
                  <div className={styles.scenTags}>
                    <span style={{color: LENGTH_COLOR[current.estimatedLength]}} className='badge badge-dim'>{current.estimatedLength}</span>
                    <span className='badge badge-dim'>{current.edition}</span>
                    <span className='badge badge-dim'>Insight {current.insightRequired}+</span>
                  </div>
                </div>

                <p className={styles.synopsis}>{current.synopsis}</p>

                <div className={styles.themes}>
                  {current.themes?.map(t=>(
                    <span key={t} className='badge badge-veil'>{t}</span>
                  ))}
                </div>

                <hr className='rule' />

                <div className={styles.acts}>
                  {current.acts?.map((act, idx) => {
                    const done_    = idx < getActsDone(current.id);
                    const current_ = idx === getActsDone(current.id) && !isComplete(current.id);
                    const locked   = idx > getActsDone(current.id) || isComplete(current.id) && idx >= current.acts.length;
                    return (
                      <div key={act.id}
                        className={`${styles.act} ${done_?styles.actDone:current_?styles.actNow:locked?styles.actLocked:''}`}
                        onClick={() => !locked && setExpandAct(expandAct===act.id?null:act.id)}>
                        <div className={styles.actHeader}>
                          <span className={styles.actNum}>Act {act.num}</span>
                          <span className={styles.actTitle}>{act.title}</span>
                          <span className='badge badge-dim'>{APPROACH_LABELS[act.approach]||act.approach}</span>
                          {act.isConclusion && <span className='badge badge-gold'>Conclusion</span>}
                          {locked && <span className={styles.actLock}>Locked</span>}
                        </div>

                        {expandAct === act.id && !locked && (
                          <div className={styles.actBody}>
                            <p className={styles.actDesc}>{act.description}</p>
                            <div className={styles.actObjective}>
                              <span className={styles.objLabel}>Objective</span>
                              <p>{act.objective}</p>
                            </div>
                            <div className={styles.actMeta}>
                              <span className='mono dim' style={{fontSize:'0.65rem'}}>
                                Location: <span className='gold'>{act.location?.replace(/_/g,' ')}</span>
                                {act.trigger && ` · ${act.trigger.action?.replace(/_/g,' ')} ×${act.trigger.count}`}
                              </span>
                              {act.stabilityRisk > 0 && (
                                <span className='mono red' style={{fontSize:'0.65rem'}}>Stability −{act.stabilityRisk}</span>
                              )}
                            </div>
                            {done_ && (
                              <>
                                <div className={styles.actReveals}>
                                  <span className={styles.revLabel}>What you learned</span>
                                  <p>{act.reveals}</p>
                                </div>
                                {act.complications?.length > 0 && (
                                  <div className={styles.comps}>
                                    <span className={styles.compLabel}>Complications</span>
                                    <ul>{act.complications.map((c,i)=><li key={i}>{c}</li>)}</ul>
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

                <hr className='rule' />
                <div className={styles.endings}>
                  <span className={styles.endLabel}>Possible Conclusions</span>
                  {current.endings?.map(e => (
                    <div key={e.id} className={`${styles.ending} ${progress[current.id]?.ending===e.id?styles.achieved:''}`}>
                      <div className={styles.endHead}>
                        <span className={styles.endName}>{e.label}</span>
                        {progress[current.id]?.ending===e.id && <span className='badge badge-gold'>Achieved</span>}
                      </div>
                      <p className={styles.endDesc}>{e.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.empty}>
                <p className='italic dim'>Select an investigation from the index.</p>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
