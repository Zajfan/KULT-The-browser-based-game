import { QUEST_CHAINS, getAvailableQuests, getQuestProgress } from '../../data/quests.js';
import styles from './QuestLog.module.css';

export default function QuestLog({ character }) {
  const available = getAvailableQuests(character);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Investigations</h2>
        <p className={styles.subtitle}>Threads you are pulling. Things that are pulling back.</p>
      </div>

      {available.length === 0 && (
        <div className={styles.empty}>
          <span>◈</span>
          <p>No active investigations. Explore the city and interact with its inhabitants to uncover threads.</p>
        </div>
      )}

      <div className={styles.questList}>
        {available.map(quest => {
          const progress = getQuestProgress(character, quest.id);
          const currentStage = quest.stages[progress.stageIdx];
          const isComplete = progress.completed;

          return (
            <div key={quest.id} className={`${styles.questCard} ${isComplete ? styles.completed : ''}`}>
              <div className={styles.questHeader}>
                <div className={styles.questMeta}>
                  <span className={styles.questName}>{quest.name}</span>
                  {isComplete && <span className='tag tag-gold'>Complete</span>}
                  {!isComplete && <span className='tag tag-dim'>Active</span>}
                </div>
                <div className={styles.questProgress}>
                  {quest.stages.map((_, i) => (
                    <div key={i} className={`${styles.stagePip} ${i < progress.stageIdx ? styles.stageDone : i === progress.stageIdx && !isComplete ? styles.stageCurrent : ''}`} />
                  ))}
                </div>
              </div>

              <p className={styles.questDesc}>{quest.description}</p>

              {!isComplete && currentStage && (
                <div className={styles.currentStage}>
                  <div className={styles.stageTitle}>
                    <span className={styles.stageNum}>Stage {progress.stageIdx + 1}/{quest.stages.length}</span>
                    <span className={styles.stageName}>{currentStage.title}</span>
                  </div>
                  <p className={styles.stageDesc}>{currentStage.description}</p>
                  <div className={styles.stageObjective}>
                    <span className={styles.objectiveLabel}>Objective:</span>
                    <span className={styles.objectiveText}>{currentStage.objective}</span>
                  </div>
                  {(progress.actionCount || 0) > 0 && (
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${Math.min(((progress.actionCount||0) / (currentStage.count||1)) * 100, 100)}%` }}
                      />
                      <span className={styles.progressText}>{progress.actionCount||0}/{currentStage.count||1}</span>
                    </div>
                  )}
                  {currentStage.reward && (
                    <div className={styles.stageReward}>
                      <span className={styles.rewardLabel}>Reward:</span>
                      {currentStage.reward.thalers > 0 && <span className='tag tag-gold'>+₮{currentStage.reward.thalers}</span>}
                      {currentStage.reward.insight > 0 && <span className='tag tag-gold'>Insight +{currentStage.reward.insight}</span>}
                      {currentStage.reward.item && <span className='tag tag-dim'>{currentStage.reward.item}</span>}
                      {currentStage.reward.stabilityLoss > 0 && <span className='tag tag-red'>Stability −{currentStage.reward.stabilityLoss}</span>}
                    </div>
                  )}
                </div>
              )}

              {isComplete && (
                <div className={styles.completedNote}>
                  <span>◈</span>
                  <p>This investigation has reached its conclusion. The knowledge cannot be unfound.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
