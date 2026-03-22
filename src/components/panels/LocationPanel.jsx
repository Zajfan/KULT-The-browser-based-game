import { useState } from 'react';
import { LOCATIONS, LOCATION_GROUPS, ACTION_LABELS } from '../../data/locations.js';
import styles from './LocationPanel.module.css';

const DANGER_LABELS = ['Safe', 'Low', 'Moderate', 'Elevated', 'High', '', '', '', 'Extreme', 'Lethal'];
const DANGER_COLORS = ['var(--green-vivid)', 'var(--green-bright)', '#c8a96e', '#b87333', 'var(--red-accent)', '', '', '', 'var(--red-vivid)', '#ff0000'];

export default function LocationPanel({ character, onTravel, onAction }) {
  const [confirming, setConfirming] = useState(null);

  const currentLoc = LOCATIONS[character.location];

  const handleAction = (actionId) => {
    const loc = LOCATIONS[character.location];
    const apCost = loc.apCost[actionId] || 10;
    if (character.ap < apCost) return;
    onAction(actionId);
    setConfirming(null);
  };

  return (
    <div className={styles.wrapper}>
      {/* Current location hero */}
      <div className={styles.locationHero}>
        <div className={styles.heroIcon}>{currentLoc?.icon}</div>
        <div className={styles.heroInfo}>
          <div className={styles.heroName}>{currentLoc?.name}</div>
          <div className={styles.heroSub}>{currentLoc?.subtitle}</div>
          <p className={styles.heroDesc}>{currentLoc?.description}</p>
          <div className={styles.heroDanger}>
            <span className={styles.dangerLabel}>Threat Level:</span>
            <span style={{ color: DANGER_COLORS[currentLoc?.danger || 0], fontFamily: 'var(--font-display)', fontSize: '0.75rem' }}>
              {DANGER_LABELS[currentLoc?.danger || 0]}
            </span>
          </div>
        </div>
      </div>

      {/* Actions at current location */}
      <div className={styles.actionsSection}>
        <div className={styles.sectionTitle}>Available Actions</div>
        <div className={styles.actionsGrid}>
          {currentLoc?.actions.map(actionId => {
            const cost = currentLoc.apCost[actionId] || 10;
            const canAfford = character.ap >= cost;
            return (
              <button
                key={actionId}
                className={`${styles.actionBtn} ${!canAfford ? styles.actionDisabled : ''}`}
                onClick={() => canAfford && handleAction(actionId)}
                disabled={!canAfford}
              >
                <span className={styles.actionName}>{ACTION_LABELS[actionId] || actionId}</span>
                <span className={styles.actionCost}>{cost} AP</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.divider} />

      {/* City map / travel */}
      <div className={styles.travelSection}>
        <div className={styles.sectionTitle}>Travel — City of Chains</div>
        {LOCATION_GROUPS.map(group => (
          <div key={group.label} className={styles.locationGroup}>
            <div className={styles.groupLabel}>{group.label}</div>
            <div className={styles.locationList}>
              {group.locations.map(locId => {
                const loc = LOCATIONS[locId];
                if (!loc) return null;
                const isHere = character.location === locId;
                const locked = loc.unlockInsight > character.insight;
                return (
                  <button
                    key={locId}
                    className={`${styles.locationBtn} ${isHere ? styles.locationHere : ''} ${locked ? styles.locationLocked : ''}`}
                    onClick={() => !isHere && !locked && onTravel(locId)}
                    disabled={isHere || locked}
                    title={locked ? `Requires Insight ${loc.unlockInsight}` : loc.description}
                  >
                    <span className={styles.locIcon}>{loc.icon}</span>
                    <span className={styles.locName}>{loc.name}</span>
                    {locked && <span className={styles.locLock}>🔒 {loc.unlockInsight}</span>}
                    {isHere && <span className={styles.locHere}>HERE</span>}
                    {!locked && !isHere && (
                      <span className={styles.locDanger} style={{ color: DANGER_COLORS[loc.danger] }}>
                        {'▲'.repeat(Math.min(loc.danger, 3))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
