import { getAvailableQuests, getQuestProgress } from '../../data/quests.js';
import { getSideCasesForInsight } from '../../data/side_cases.js';
import styles from './QuestView.module.css';

export default function QuestView({ character }) {
  const quests = getAvailableQuests(character);
  const sideCases = getSideCasesForInsight(character.insight ?? 0);

  // Sort: intro quest first, then incomplete, then done
  const sorted = [...quests].sort((a, b) => {
    if (a.isIntro && !b.isIntro) return -1;
    if (!a.isIntro && b.isIntro) return 1;
    const pa = getQuestProgress(character, a.id);
    const pb = getQuestProgress(character, b.id);
    if (pa.completed && !pb.completed) return 1;
    if (!pa.completed && pb.completed) return -1;
    return 0;
  });

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Investigations</h2>
      <p className={styles.sub}>Threads you are pulling. Things that are pulling back.</p>
      <div className='rule-blood' />
      {quests.length === 0 && <p className='italic dim' style={{marginTop:20}}>No active investigations. Explore the city and its inhabitants.</p>}
      <div className={styles.list}>
        {sorted.map(quest => {
          const p = getQuestProgress(character, quest.id);
          const stage = quest.stages[p.stageIdx];
          const done = p.completed;
          return (
            <div key={quest.id} className={`${styles.quest} ${done?styles.done:''} ${quest.isIntro&&!done?styles.introQuest:''}`}>
              <div className={styles.qHead}>
                <span className={styles.qName}>
                  {quest.isIntro && !done && <span className={styles.introTag}>★ Start Here</span>}
                  {quest.name}
                </span>
                <div className={styles.pips}>
                  {quest.stages.map((_,i)=>(
                    <div key={i} className={`${styles.pip} ${i<p.stageIdx?styles.pipDone:i===p.stageIdx&&!done?styles.pipNow:''}`}/>
                  ))}
                </div>
              </div>
              <p className={styles.qDesc}>{quest.description}</p>
              {!done && stage && (
                <div className={styles.stage}>
                  <div className={styles.stageTitle}><span className='mono dim' style={{fontSize:'0.65rem'}}>Stage {p.stageIdx+1}/{quest.stages.length}</span> — <span className={styles.stageName}>{stage.title}</span></div>
                  <p className={styles.stageDesc}>{stage.description}</p>
                  <div className={styles.obj}>
                    <span className='gold' style={{fontSize:'0.68rem',fontFamily:'var(--display)',textTransform:'uppercase',letterSpacing:'0.1em'}}>Objective</span>
                    <span style={{fontSize:'0.78rem',color:'var(--ink)'}}>{stage.objective}</span>
                  </div>
                  {(p.actionCount||0)>0 && (
                    <div className={styles.progress}>
                      <div className={styles.progFill} style={{width:`${Math.min((p.actionCount/stage.count)*100,100)}%`}}/>
                      <span className={styles.progText}>{p.actionCount}/{stage.count}</span>
                    </div>
                  )}
                </div>
              )}
              {done && <p className='italic' style={{fontSize:'0.75rem',color:'var(--gold)',marginTop:4}}>◈ Investigation concluded.</p>}
            </div>
          );
        })}
      </div>

      {/* Side Cases */}
      {sideCases.length > 0 && (
        <>
          <hr className='rule' style={{margin:'28px 0 16px'}} />
          <h3 className={styles.sideCasesTitle}>Side Cases</h3>
          <p className={styles.sub}>Shorter threads. One session each. Can be pursued alongside anything else.</p>
          <div className={styles.sideCaseList}>
            {sideCases.map(c => (
              <div key={c.id} className={styles.sideCase}>
                <div className={styles.scHead}>
                  <span className={styles.scName}>{c.name}</span>
                  <span className={styles.scTheme}>{c.theme}</span>
                </div>
                <p className={styles.scHook}>{c.hook}</p>
                <div className={styles.scMeta}>
                  <span className='mono dim' style={{fontSize:'0.62rem'}}>{c.estimatedLength}</span>
                  {c.insightRequired > 0 && (
                    <span className='mono dim' style={{fontSize:'0.62rem'}}>Insight {c.insightRequired}+ required</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
