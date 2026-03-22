import { useState } from 'react';
import { LOCATIONS, LOCATION_GROUPS, ACTION_LABELS } from '../../data/locations.js';
import { getTrainingForLocation } from '../../data/training.js';
import styles from './CityView.module.css';

const DANGER_WORD = ['None','Low','Moderate','Elevated','High','','','','Extreme','Lethal'];
const DANGER_COLOR= ['var(--vital-lit)','var(--vital-lit)','var(--gold)','var(--gold)','var(--red-lit)','','','','var(--red-vivid)','var(--red-vivid)'];

export default function CityView({ character, onTravel, onAction, onTrain, addToast }) {
  const loc = LOCATIONS[character.location];
  const [trainOpen, setTrainOpen] = useState(false);
  const training = getTrainingForLocation(character.location);

  const canAfford = (apCost) => character.ap >= apCost;

  return (
    <div className={styles.page}>
      {/* Location header */}
      <div className={styles.locHeader}>
        <div className={styles.locName}>{loc?.name}</div>
        <div className={styles.locSub}>{loc?.subtitle}</div>
        <div className={styles.locDanger}>
          Threat: <span style={{color: DANGER_COLOR[loc?.danger||0]}}>{DANGER_WORD[loc?.danger||0]}</span>
        </div>
      </div>

      <div className={styles.locDesc}>{loc?.description}</div>
      <div className='rule-gold' />

      {/* Actions */}
      <section className={styles.section}>
        <h3 className={styles.sectionHead}>What will you do here?</h3>
        <div className={styles.actionList}>
          {loc?.actions.map(id => {
            const cost = loc.apCost[id] || 10;
            const ok   = canAfford(cost);
            return (
              <button key={id} className={`act ${!ok ? '' : ''}`} onClick={() => ok && onAction(id)} disabled={!ok}>
                {ACTION_LABELS[id] || id}
                <span className={`mono dim`} style={{fontSize:'0.65rem', marginLeft:4}}>{cost} AP</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Training facilities */}
      {training.length > 0 && (
        <>
          <div className='rule-gold' />
          <section className={styles.section}>
            <button className={styles.trainToggle} onClick={() => setTrainOpen(o=>!o)}>
              {trainOpen ? '▾' : '▸'} Training Facilities
            </button>
            {trainOpen && (
              <div className={styles.trainList}>
                {training.map(fac => {
                  const ok = character.ap >= fac.apCost && character.thalers >= fac.thalerCost && character.insight >= fac.insightRequired;
                  return (
                    <div key={fac.id} className={styles.trainCard}>
                      <div className={styles.trainHeader}>
                        <span className={styles.trainName}>{fac.icon} {fac.name}</span>
                        <span className='dim' style={{fontSize:'0.72rem'}}>Trains: {fac.trains.join(', ')}</span>
                      </div>
                      <p className={styles.trainDesc}>{fac.description}</p>
                      <div className={styles.trainMeta}>
                        <span className='mono dim' style={{fontSize:'0.68rem'}}>{fac.apCost} AP{fac.thalerCost > 0 ? ` · ₮${fac.thalerCost}` : ''}{fac.insightRequired > 0 ? ` · Insight ${fac.insightRequired}+` : ''}{fac.woundRisk ? ' · ⚠ injury risk' : ''}</span>
                        <button className='act act-gold act-sm' onClick={() => ok && onTrain(fac)} disabled={!ok}>Train</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      <div className='rule-blood' />

      {/* Travel */}
      <section className={styles.section}>
        <h3 className={styles.sectionHead}>Move through the city</h3>
        {LOCATION_GROUPS.map(group => (
          <div key={group.label} className={styles.travelGroup}>
            <div className={styles.travelGroupLabel}>{group.label}</div>
            <div className={styles.travelLinks}>
              {group.locations.map(locId => {
                const l       = LOCATIONS[locId];
                const here    = character.location === locId;
                const locked  = l.unlockInsight > character.insight;
                return (
                  <span key={locId} className={`${styles.travelLink} ${here?styles.here:''} ${locked?styles.locked:''}`}
                    onClick={() => !here && !locked && onTravel(locId)}
                    title={locked ? `Requires Insight ${l.unlockInsight}` : l.subtitle}>
                    {l.icon} {l.name}
                    {here   && <span className={styles.hereTag}> ← you are here</span>}
                    {locked && <span className={styles.lockTag}> [Insight {l.unlockInsight}]</span>}
                    {!here && !locked && <span style={{color:'var(--ink-dim)',fontSize:'0.65rem',marginLeft:4,fontStyle:'italic'}}> / {l.subtitle}</span>}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
