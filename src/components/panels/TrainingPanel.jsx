import { getTrainingForLocation } from '../../data/training.js';
import { rollCheck } from '../../utils/dice.js';
import styles from './TrainingPanel.module.css';

const ATTR_LABELS = { reason: 'Reason', intuition: 'Intuition', perception: 'Perception', coolness: 'Coolness', violence: 'Violence', soul: 'Soul', willpower: 'Willpower', fortitude: 'Fortitude', reflexes: 'Reflexes' };

export default function TrainingPanel({ character, locationId, onTrain, onClose }) {
  const facilities = getTrainingForLocation(locationId);

  if (!facilities.length) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>📈</span>
        <span>Training Facilities</span>
      </div>
      {facilities.map(fac => {
        const canAffordAP = character.ap >= fac.apCost;
        const canAffordThalers = character.thalers >= fac.thalerCost;
        const meetsInsight = character.insight >= fac.insightRequired;
        const canTrain = canAffordAP && canAffordThalers && meetsInsight;

        return (
          <div key={fac.id} className={`${styles.facilityCard} ${!canTrain ? styles.disabled : ''}`}>
            <div className={styles.facHeader}>
              <span className={styles.facIcon}>{fac.icon}</span>
              <div className={styles.facInfo}>
                <div className={styles.facName}>{fac.name}</div>
                <p className={styles.facDesc}>{fac.description}</p>
              </div>
            </div>

            <div className={styles.facMeta}>
              <div className={styles.trains}>
                {fac.trains.map(attr => (
                  <span key={attr} className='tag tag-gold'>{ATTR_LABELS[attr]} +{fac.successBonus.toFixed(0) === '0' ? '<1' : fac.successBonus}</span>
                ))}
              </div>
              <div className={styles.costs}>
                <span className={`${!canAffordAP ? 'red' : ''}`}>{fac.apCost} AP</span>
                {fac.thalerCost > 0 && <span className={`${!canAffordThalers ? 'red' : ''}`}>₮{fac.thalerCost}</span>}
                {fac.insightRequired > 0 && <span className={`${!meetsInsight ? 'red' : 'dim'}`}>Insight {fac.insightRequired}+</span>}
                {fac.woundRisk && <span className='red'>⚠ Wound Risk</span>}
              </div>
            </div>

            <button className='btn btn-gold btn-sm' onClick={() => onTrain(fac)} disabled={!canTrain}>
              Train Here
            </button>
          </div>
        );
      })}
    </div>
  );
}
