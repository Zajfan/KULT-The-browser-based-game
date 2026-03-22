import styles from './DayNightOverlay.module.css';

const PHASE_CONFIG = {
  night:   { label: 'Night',   icon: '🌑', css: styles.night   },
  dawn:    { label: 'Dawn',    icon: '🌅', css: styles.dawn    },
  day:     { label: 'Day',     icon: '☀',  css: styles.day     },
  dusk:    { label: 'Dusk',    icon: '🌆', css: styles.dusk    },
};

export function getTimePhase(hour) {
  if (hour >= 21 || hour < 5)  return 'night';
  if (hour >= 5  && hour < 9)  return 'dawn';
  if (hour >= 9  && hour < 18) return 'day';
  return 'dusk';
}

export function getTimeDescription(hour) {
  if (hour >= 0  && hour < 3)  return 'The city is at its most honest at 2 AM. Everyone still awake has a reason.';
  if (hour >= 3  && hour < 5)  return 'The hours between 3 and 5 are not for the living. The entities move freely.';
  if (hour >= 5  && hour < 7)  return 'Before sunrise, the Illusion reconstitutes itself. You can almost see the seams.';
  if (hour >= 7  && hour < 10) return 'Morning. The city performs normalcy with its usual conviction.';
  if (hour >= 10 && hour < 14) return 'The Illusion is at its most persuasive in the afternoon. Stay alert.';
  if (hour >= 14 && hour < 17) return 'The long afternoon. Lictors prefer daylight for surveillance.';
  if (hour >= 17 && hour < 20) return 'The transition hour. Some things become visible at dusk that the day hides.';
  if (hour >= 20 && hour < 22) return 'The city changes character after dark. Both safer and more dangerous.';
  return 'Deep night. You should not be out here.';
}

export default function DayNightOverlay({ hour }) {
  const phase = getTimePhase(hour);
  const config = PHASE_CONFIG[phase];
  return <div className={`${styles.overlay} ${config.css}`} aria-hidden="true" />;
}
