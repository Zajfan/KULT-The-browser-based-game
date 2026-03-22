import { useState, useEffect } from 'react';
import { LOCATIONS, LOCATION_GROUPS, ACTION_LABELS } from '../../data/locations.js';
import { getTrainingForLocation } from '../../data/training.js';
import { getEnemiesForLocation } from '../../data/enemies.js';
import styles from './CityView.module.css';

const DANGER_WORD  = ['None','Low','Moderate','Elevated','High','','','','Extreme','Lethal'];
const DANGER_COLOR = ['var(--vital-lit)','var(--vital-lit)','var(--gold)','var(--gold)','var(--red-lit)','','','','var(--red-vivid)','var(--red-vivid)'];

// Time-of-day flavor for current location
function getLocationAtmosphere(locId, hour) {
  const isNight = hour >= 21 || hour < 5;
  const isDusk  = hour >= 18 && hour < 21;
  const isDawn  = hour >= 5  && hour < 9;

  const atm = {
    residential: {
      night: 'The identical apartment windows are lit at intervals that suggest programming rather than habit. One window has been lit without variation for eleven days.',
      day:   'Morning performance in progress. The Illusion is at its most persuasive here.',
      dusk:  'The street empties with unusual speed as the light fails. People who live here know something without knowing that they know it.',
    },
    downtown: {
      night: 'The glass towers are lit but empty. Something moves between the floors of the Meridian building that is not the elevator.',
      day:   'Foot traffic at full performance. Faces indistinguishable from the last time you passed through. Which might be coincidence.',
      dusk:  'The last of the suited figures are leaving. Whatever runs downtown at night is already in position.',
    },
    slums: {
      night: 'At this hour the slums belong to the things that use the slums as cover. Proceed carefully.',
      day:   'The damage here is honest, at least. What the Illusion cannot maintain, it simply ignores.',
      dusk:  'The transition hour is dangerous here. The things that prefer darkness are positioning.',
    },
    industrial: {
      night: 'The factories are operating. They have been operating every night for the past thirty years. No one knows what they produce.',
      day:   'A shift is underway. Workers with unfocused eyes move between buildings. None of them appear to be breathing.',
      dusk:  'The industrial quarter changes management at dusk. You would rather not know what the incoming management looks like.',
    },
    hospital: {
      night: 'The night staff is different from the day staff. Not just different faces — a different quality of presence.',
      day:   'The waiting room contains exactly the right amount of distress. Calibrated.',
      dusk:  'Shift change at St. Aurum. The transition period is when the hospital is most itself.',
    },
    purgatory: {
      night: 'Purgatory operates. The music adapts to who is listening. Nobody knows exactly how.',
      day:   'Closed, nominally. The door is unlocked for those who know why they are here.',
      dusk:  'The real clientele arrives after dark. You are welcome. Some of the other regulars are harder to categorize.',
    },
    archives: {
      night: 'The archives lock at eight. Something continues to use them.',
      day:   'The legitimate archives are open. The significant ones require different credentials.',
      dusk:  'Closing time approaches. If you want access to what the night staff manages, now is the transition window.',
    },
    black_market: {
      night: 'At peak operation. The location changes. You know how to find it.',
      day:   'Technically closed. Technically.',
      dusk:  'Opening for business.',
    },
    asylum: {
      night: 'Visiting hours ended at six. The interesting conversations happen after visiting hours.',
      day:   'Supervised, managed, observed. Everything that happens here is documented. Most of the documentation is inaccurate.',
      dusk:  'The evening medication round. After which certain patients become temporarily more communicative.',
    },
    beyond_veil: {
      night: 'The Veil is thinnest at night. What lies beyond it is closest to you now.',
      day:   'Daylight does not protect you here. The Illusion merely provides better camouflage.',
      dusk:  'Transition hours are dangerous at the Veil. The entities are most active during transitions.',
    },
    labyrinth: {
      night: 'The living do not belong here. You are here anyway.',
      day:   'There is no day here. There is only depth.',
      dusk:  'You found the entrance again. It moves, but it recognizes you.',
    },
  };

  const profile = atm[locId] || {};
  if (isNight) return profile.night || '';
  if (isDusk || isDawn) return profile.dusk || '';
  return profile.day || '';
}

export default function CityView({ character, onTravel, onAction, onTrain }) {
  const loc      = LOCATIONS[character.location];
  const hour     = character.gameTime?.hour ?? 8;
  const atm      = getLocationAtmosphere(character.location, hour);
  const training = getTrainingForLocation(character.location);
  const enemies  = getEnemiesForLocation(character.location);
  const [trainOpen, setTrain] = useState(false);
  const [threatOpen, setThreat] = useState(false);

  return (
    <div className={styles.page}>
      {/* Location header */}
      <div className={styles.locHeader}>
        <div className={styles.locName}>{loc?.name}</div>
        <div className={styles.locMeta}>
          <span className={styles.locSub}>{loc?.subtitle}</span>
          <span className={styles.locDanger} style={{color:DANGER_COLOR[loc?.danger||0]}}>
            {DANGER_WORD[loc?.danger||0]} threat
          </span>
        </div>
      </div>

      {/* Static description */}
      <div className={styles.locDesc}>{loc?.description}</div>

      {/* Time-of-day atmosphere */}
      {atm && (
        <div className={styles.atmosphere}>
          <span className={styles.atmSep}>—</span>
          <span>{atm}</span>
        </div>
      )}

      <hr className='rule' />

      {/* Actions */}
      <section className={styles.section}>
        <h3 className={styles.sh}>What will you do?</h3>
        <div className={styles.actionGrid}>
          {loc?.actions.map(id => {
            const cost = loc.apCost[id] || 10;
            const ok   = character.ap >= cost;
            return (
              <button key={id} className={`act ${!ok?'':'act-gold'}`}
                onClick={() => ok && onAction(id)} disabled={!ok}>
                {ACTION_LABELS[id] || id}
                <span className='mono' style={{fontSize:'0.62rem',opacity:0.6,marginLeft:4}}>{cost}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Training */}
      {training.length > 0 && (
        <>
          <hr className='rule' />
          <section className={styles.section}>
            <button className={styles.toggle} onClick={() => setTrain(o=>!o)}>
              {trainOpen ? '▾' : '▸'} Training Facilities ({training.length})
            </button>
            {trainOpen && (
              <div className={styles.trainList}>
                {training.map(fac => {
                  const ok = character.ap >= fac.apCost && character.thalers >= fac.thalerCost && character.insight >= fac.insightRequired;
                  return (
                    <div key={fac.id} className={styles.trainCard}>
                      <div className={styles.trainRow}>
                        <span className={styles.trainName}>{fac.icon} {fac.name}</span>
                        <span className='mono dim' style={{fontSize:'0.65rem'}}>
                          trains: <span className='gold'>{fac.trains.join(', ')}</span>
                        </span>
                      </div>
                      <p className={styles.trainDesc}>{fac.description}</p>
                      <div className={styles.trainFoot}>
                        <span className='mono dim' style={{fontSize:'0.65rem'}}>
                          {fac.apCost} AP{fac.thalerCost > 0 ? ` · ₮${fac.thalerCost}` : ''}{fac.insightRequired > 0 ? ` · Insight ${fac.insightRequired}+` : ''}{fac.woundRisk ? ' · ⚠ injury risk' : ''}
                        </span>
                        <button className='act act-gold act-sm' onClick={() => ok && onTrain(fac)} disabled={!ok}>
                          Train
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {/* Threats */}
      {enemies.length > 0 && (
        <>
          <hr className='rule' />
          <section className={styles.section}>
            <button className={styles.toggle} onClick={() => setThreat(o=>!o)}>
              {threatOpen ? '▾' : '▸'} Known threats here ({enemies.length})
            </button>
            {threatOpen && (
              <div className={styles.threatList}>
                {enemies.map(e => (
                  <div key={e.id} className={styles.threat}>
                    <span className={styles.threatIcon}>{e.icon}</span>
                    <div>
                      <span className={styles.threatName}>{e.name}</span>
                      {e.supernatural && <span className='badge badge-veil' style={{marginLeft:6}}>Supernatural</span>}
                      <p className={styles.threatDesc}>{e.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <hr className='rule-blood' />

      {/* Travel */}
      <section className={styles.section}>
        <h3 className={styles.sh}>Move through the city</h3>
        {LOCATION_GROUPS.map(group => (
          <div key={group.label} className={styles.travelGroup}>
            <div className={styles.groupLabel}>{group.label}</div>
            <div className={styles.travelLinks}>
              {group.locations.map(locId => {
                const l      = LOCATIONS[locId];
                const here   = character.location === locId;
                const locked = l.unlockInsight > character.insight;
                return (
                  <span key={locId}
                    className={`${styles.tLink} ${here?styles.here:''} ${locked?styles.locked:''}`}
                    onClick={() => !here && !locked && onTravel(locId)}>
                    {l.icon} {l.name}
                    {here   && <span className={styles.hereTag}> — you are here</span>}
                    {locked && <span className={styles.lockTag}> [Insight {l.unlockInsight} required]</span>}
                    {!here && !locked && <span className={styles.subTag}> / {l.subtitle}</span>}
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
