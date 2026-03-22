// The Daily Transmission — city news feed generated each in-game day.
// Mix of mundane news (maintaining the Illusion) and subtle supernatural leakage.

export const TRANSMISSION_MUNDANE = [
  'City council approves rezoning of the old industrial waterfront. Development to begin Q3.',
  'Municipal water authority issues advisory: discolouration in pipes serving the north district. Cause under investigation.',
  'Three reported missing from the Residential District this week. Police have no suspects.',
  'The Harken University library will close its east reading room for renovation through the end of the month.',
  'A 40-year-old man was found in Kleist Park at 4 AM, unresponsive. He cannot account for the past three days.',
  'Planning permission denied for demolition of the Heilenberg building, citing "historical significance."',
  'Weather service issues a grey advisory through Thursday. Unusual electromagnetic readings attributed to seasonal interference.',
  'Local restaurant Fontaine closed permanently after 22 years. Owner declined to comment.',
  'Police report a spike in reports of "unusual activity" in the industrial quarter. Patrols increased.',
  'City records show no permit filed for the construction on Voss Street. The workers have not been identified.',
  'The transit authority reports a recurring fault on the line that passes through the old quarter — doors opening between stations.',
  'A local blogger\'s account of "anomalous architecture" in the financial district has been deleted. The author is unreachable.',
  'Demolition of the former post office on Arch Street paused — contractors discovered sub-basement levels not on any blueprint.',
  'Three residents of the Goldner Apartments report hearing the same music playing from an apartment that has been vacant for four years.',
  'A court-ordered psychiatric evaluation found the defendant "of sound mind but suffering from a distinctive pattern of perception errors."',
];

export const TRANSMISSION_SUPERNATURAL = [
  'A witness reports seeing a figure in a grey suit standing at the corner of Altman and Voss streets for six hours without moving. Police found no one when they investigated. The witness has since changed their statement.',
  'Photographs taken at the St. Aurum Hospital charity gala include a figure in the background that none of the 142 attendees can identify or remember seeing.',
  'The latest census data for the Residential District shows the same household listed at three separate addresses, with the same seven residents, in three separate buildings. The census office has flagged this as a data error.',
  'The security footage from the Archives on Tuesday night shows a door opening in the east reading room. The door has not existed since the 1987 renovation. The footage is being reviewed.',
  'Maintenance workers in the Labyrinth tunnels report that graffiti they cleared last week has reappeared, identical, with a date six months from now.',
  'A patient at Heilenberg Asylum has filed a formal complaint alleging that staff have been "replacing themselves with approximations." The complaint is under review by the ethics board.',
  'The lights in the industrial district failed on Tuesday between 2 and 5 AM. Records show normal power supply throughout this period. The failure was not electrical.',
  'A real estate listing for a property in the Slums has been up for three years. Every buyer who has made an offer has withdrawn it within 24 hours. None have given the same reason.',
];

export function getTransmission(day, insight) {
  const mundaneCount = 3 + Math.floor(Math.random() * 2);
  const supernaturalCount = insight >= 2 ? 1 + Math.floor(Math.random() * 2) : 0;

  const mundane = shuffled(TRANSMISSION_MUNDANE).slice(0, mundaneCount);
  const supernatural = insight >= 2
    ? shuffled(TRANSMISSION_SUPERNATURAL).slice(0, supernaturalCount)
    : [];

  return { day, mundane, supernatural };
}

function shuffled(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
