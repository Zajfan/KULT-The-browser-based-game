export function getTimePhase(hour) {
  if (hour >= 21 || hour < 5)  return 'night';
  if (hour >= 5  && hour < 9)  return 'dawn';
  if (hour >= 9  && hour < 18) return 'day';
  return 'dusk';
}

export function getTimeDescription(hour) {
  const lines = [
    'The hours between midnight and three exist outside the Illusion\'s maintenance schedule.',
    'At 1 AM the city\'s janitors move through empty streets, erasing evidence of the day.',
    'The Illusion runs its diagnostics in the small hours. You can hear it, almost.',
    'Three in the morning. The entities are most active now. Stay alert.',
    'The last hour of deep night. Something always changes between four and five.',
    'Pre-dawn. The Illusion reconstitutes itself. You can nearly see the seams.',
    'Thin morning light. The city pretends to wake up.',
    'Seven AM. The performance of normalcy begins in earnest.',
    'Morning. Lictors prefer daylight. They are less subtle about it than they think.',
    'Mid-morning. The Illusion is at its most convincing now.',
    'Ten AM. You almost believe it yourself, sometimes.',
    'The long morning. Watch the faces of people you pass.',
    'Noon. The sun is a prop. The shadows are not.',
    'The afternoon. Power moves through this city in patterns you are only beginning to read.',
    'Two PM. The archive closes early on days like this. No one explains why.',
    'The slow hours. Lictors are active but unhurried. They have time.',
    'Late afternoon. Something shifts in the quality of the light.',
    'The transition hour. Things visible only at dusk become briefly apparent.',
    'Six PM. The city exhales. Its second nature surfaces after dark.',
    'Evening. The backrooms are opening. The useful people are waking up.',
    'Eight PM. Purgatory opens its real doors now.',
    'The city at night is a different city.',
    'Ten PM. Most of what matters in this world happens after ten.',
    'Late. The streets belong to the Awakened and what hunts them.',
  ];
  return lines[hour] || 'The city continues its performance.';
}

export function formatTime(hour) {
  const h12 = hour % 12 || 12;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${String(h12).padStart(2,'0')}:00 ${ampm}`;
}
