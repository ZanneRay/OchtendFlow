const julia = 'Julia Reppel';
const tom = 'Tom Merrick';
const clips = {
  5: [
    ['-YqsrEW3G2Q', 'Rustig wakker worden', 'FSR.HEALTH', '5:31', 'Rustig beginnen en het hele lichaam losmaken.'],
    ['gbX2C4PUEcw', 'Een korte ochtendstretch', 'Move with Tiina', '4:39', 'Een korte reeks stretches voor je hele lichaam.'],
    ['cacwri2wio4', 'Squat, draai en strek', tom, '6:51', 'Combineer rustige squats met rotaties en stretches.'],
    ['XRurT9aJQxs', 'Snelle mobiliteitsroutine', 'Chanon Finley', '6:04', 'Maak je gewrichten los met een korte reeks oefeningen.'],
    ['vD5zKJ6ZTDU', 'Soepel in vijf minuten', 'Primal Mobility', '6:46', 'Beweeg rustig mee met deze korte mobiliteitsroutine.'],
    ['HONl-zpieGI', 'Korte ochtendreset', julia, '6:53', 'Een korte reset voor je schouders, rug en heupen.'],
    ['03TbLlZZwYU', 'Mobiliteit vanuit bed', julia, '6:56', 'Een rustige routine die je liggend kunt volgen.'],
    ['VlB2bJToTVg', 'Korte flow voor het hele lichaam', 'Project YOU', '5:57', 'Een korte ochtendflow met mobiliteit en stretches.']
  ],
  10: [
    ['0VrLgzwTmTg', 'Rek je rustig wakker', tom, '12:22', 'Open je borst, rug en heupen met rustige bewegingen.'],
    ['aRVFt79LqCM', 'Ochtendflow voor je hele lichaam', julia, '10:56', 'Maak je rug, schouders en heupen los met een rustige follow-along.'],
    ['1tLFG1t8MJo', 'Full-body stretch & mobiliteit', 'Juice & Toya', '10:40', 'Combineer rekken en mobiliteit in één full-body routine.'],
    ['bR0djYf0hkg', 'Ochtendflow aan zee', julia, '10:40', 'Volg een korte ochtendroutine voor je hele lichaam met uitzicht op zee.'],
    ['4Bvjol_deks', 'Rustige ochtendmobiliteit', julia, '11:02', 'Beweeg van gewricht naar gewricht in een rustige flow zonder gesproken uitleg.'],
    ['3-j00VEs3xA', 'Dagelijkse mobiliteitsflow', julia, '11:54', 'Beweeg je wervelkolom, schouders, heupen, enkels en polsen.'],
    ['ALBIeYfWhVI', 'Maak je lichaam wakker', julia, '12:38', 'Volg een full-body ochtendroutine zonder gesproken uitleg.'],
    ['S9xgUK-scaE', 'Losse heupen en schouders', julia, '11:40', 'Een allround routine voor heupen, schouders en andere grote gewrichten.'],
    ['YcyvzXJ8RUo', 'Mobiliteit van top tot teen', julia, '11:54', 'Een mix van mobiliteitsoefeningen voor je hele lichaam.'],
    ['t3kzleGEa70', 'Ochtendflow met variaties', julia, '11:04', 'Een routine zonder gesproken uitleg met aanpassingen voor de oefeningen.']
  ],
  15: [
    ['pbuMziassuo', 'Rustige full-body flow', julia, '15:14', 'Begin rustig met een mobiliteitsflow voor je hele lichaam.'],
    ['yDOImN60yhQ', 'Bewegen en ademen', julia, '15:54', 'Dynamische mobiliteit voor schouders, rug en heupen, met tijd om na te ademen.'],
    ['5abdqQztF7M', 'Flexibiliteit in de ochtend', tom, '16:00', 'Open je borst en beweeg je heupen en hamstrings door hun bewegingsbereik.'],
    ['sRT6qIqYxLg', 'Zachte ochtendbeweging', julia, '15:32', 'Maak je rug, schouders, polsen, heupen en enkels rustig los.'],
    ['XjFOuV9mB7I', 'Ochtendflow met aanpassingen', julia, '15:43', 'Volg de stille flow en kies waar nodig een lichtere variant.'],
    ['KrxM_0WOf6I', 'Mobiliteit voor elk niveau', julia, '15:40', 'Een rustige dagelijkse routine voor de belangrijkste gewrichten.'],
    ['z_rl9PAOzGE', 'Mobiliteit aan het meer', julia, '16:17', 'Een full-body ochtendflow in de buitenlucht met een ademhalingsoefening.'],
    ['X0JkIpEH17c', 'Vier vloeiende reeksen', julia, '15:32', 'Oefeningen bouwen stap voor stap op tot vier korte flows.']
  ],
  20: [
    ['8fipKUJzcuk', 'Ochtendmobiliteit van top tot teen', julia, '20:21', 'Beweeg je rug, bovenlichaam en onderlichaam in drie delen.'],
    ['W11BdXtscj8', 'Langzame mobiliteit en stretch', julia, '21:42', 'Wissel rustige beweging af met statische stretches.'],
    ['lPKRiU9u_Hc', 'Uitgebreide flexibiliteitsroutine', tom, '20:24', 'Een follow-along met onder andere rugrotaties, lunges en stretches.'],
    ['SmAUCoHxEyM', 'Ochtendflow met ademhaling', julia, '21:10', 'Rustige beweging voor je hele lichaam, gevolgd door een adempauze.'],
    ['mTAf9FFHKmo', 'Mobiliteit met aandacht voor je core', julia, '20:21', 'Een full-body circuit met nadruk op bovenlichaam en romp.'],
    ['zLCHc7x38RY', 'Dynamische animal flow', 'growingannanas & Julia Reppel', '20:50', 'Beweeg dicht bij de grond in een dynamisch mobiliteitscircuit.'],
    ['gYJblsdebRo', 'Mobiliteit en rompstabiliteit', julia, '21:05', 'Een flow die gewrichtsmobiliteit combineert met rompoefeningen.'],
    ['wSlLsRRdAjA', 'Lange ochtendflow aan zee', julia, '22:35', 'Dynamische beweging en stretches, met een ademhalingsdeel aan het eind.']
  ]
};

export const defaults = { time: '06:45', duration: 10 };
export const durationChoices = [5, 10, 15, 20];
export const dayKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const utcDay = d => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
const epoch = Date.UTC(2026, 10, 23);
const mondayOffset = d => (d.getDay() + 6) % 7;
export const parseDay = key => new Date(`${key}T12:00:00`);
export function addDays(d, n) {
  const out = new Date(d);
  out.setDate(out.getDate()+n);
  return out;
}
export const isWorkday = d => mondayOffset(d) < 5;
export const mondayFor = d => addDays(d, isWorkday(d) ? -mondayOffset(d) : 7-mondayOffset(d));
export const weekdayWeek = d => Array.from({length:5}, (_, i) => addDays(mondayFor(d), i));
export const sessionDay = d => isWorkday(d) ? d : mondayFor(d);
export function videoFor(date, minutes) {
  if (!isWorkday(date)) return null;
  const deck = clips[minutes] ?? clips[10];
  const num = Math.floor((utcDay(date)-epoch)/604800000)*5 + mondayOffset(date);
  const [id, title, creator, length, description] = deck[((num % deck.length) + deck.length) % deck.length];
  return { id, title, creator, length, description, url: `https://www.youtube.com/watch?v=${id}` };
}
export function nextSlot(now, time, duration) {
  const [h,m] = time.split(':').map(Number);
  let start = new Date(now);
  start.setHours(h,m,0,0);
  if (start <= now) start = addDays(start, 1);
  while (!isWorkday(start)) start = addDays(start, 1);
  return {start, end:new Date(+start + duration*60000)};
}
export const recurrence = 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR';
export const tz = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Amsterdam';
const localStamp = d => dayKey(d).replaceAll('-','')+'T'+[d.getHours(),d.getMinutes(),d.getSeconds()].map(x=>String(x).padStart(2,'0')).join('');
const utcStamp = d => d.toISOString().replaceAll('-','').replaceAll(':','').replace(/\.\d+Z$/,'Z');
const description = url => `Open Ochtendflow voor de mobiliteitsvideo van vandaag: ${url}`;
export function googleEvent(now, prefs, url) {
  const {start,end}=nextSlot(now,prefs.time,prefs.duration);
  return 'https://calendar.google.com/calendar/render?'+new URLSearchParams({
    action:'TEMPLATE',text:'Ochtendflow · ochtendmobiliteit',
    dates:`${localStamp(start)}/${localStamp(end)}`,ctz:tz(),recur:recurrence,details:description(url)
  });
}
const esc = s => s.replaceAll('\\','\\\\').replaceAll('\n','\\n').replaceAll(',','\\,').replaceAll(';','\\;');
function fold(line) {
  const encoder = new TextEncoder();
  let out = '', current = '', size = 0;
  for (const ch of line) {
    const bytes = encoder.encode(ch).length;
    if (size + bytes > 75) { out += `${current}\r\n`; current = ' '; size = 1; }
    size += bytes; current += ch;
  }
  return out + current;
}
// Floating local event time keeps the routine at the same hour through DST.
// Google Calendar's web template uses an explicit IANA zone instead.
export function calendarFile(now, prefs, url) {
  const {start,end}=nextSlot(now,prefs.time,prefs.duration);
  return [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Ochtendflow//Mobiliteitsplanner//NL','CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',`UID:ochtendflow-${dayKey(start)}-${prefs.time.replace(':','')}@ochtendflow`, `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${localStamp(start)}`,`DTEND:${localStamp(end)}`,recurrence,
    'SUMMARY:Ochtendflow - ochtendmobiliteit',`DESCRIPTION:${esc(description(url))}`,
    `URL:${url}`,'BEGIN:VALARM','ACTION:DISPLAY','TRIGGER:PT0S','DESCRIPTION:Tijd voor Ochtendflow',
    'END:VALARM','END:VEVENT','END:VCALENDAR',''
  ].map(fold).join('\r\n');
}
