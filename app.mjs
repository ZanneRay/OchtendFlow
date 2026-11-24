import { defaults, durationChoices, dayKey, parseDay, sessionDay, weekdayWeek, videoFor, googleEvent, calendarFile, isWorkday } from './planner.mjs';

const paths = {
  sun:'<path d="M2 18h20M4 22h16M7 15a5 5 0 0 1 10 0M12 2v3M3.5 7l2 2M20.5 7l-2 2M2 13h2m16 0h2"/>',
  download:'<path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.67 15a1.65 1.65 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.67a1.65 1.65 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  edit:'<path d="M13.5 6.5l4 4M5 19l4.3-1 10-10-3.4-3.4-10 10L5 19Z"/>',
  play:'<path d="m9 5 11 7-11 7V5Z" fill="currentColor" stroke-width="1.25"/>',
  cast:'<path d="M3 8V5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-7M3 15a4 4 0 0 1 4 4m-4-8a8 8 0 0 1 8 8m-8 0h.01"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4m-5 3h18m-13 5h1m3 0h1m3 0h1"/>',
  shuffle:'<path d="M3 6h3c4 0 6 12 10 12h5m-3-3 3 3-3 3M3 18h3c1.5 0 2.8-1.8 3.9-4.1m4.3-5.8C14.8 6.9 15.4 6 16 6h5m-3-3 3 3-3 3"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0"/>',
  chevron:'<path d="m9 18 6-6-6-6"/>',
  x:'<path d="m6 6 12 12M18 6 6 18"/>',
};
const svg = k => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[k]}</svg>`;
const $ = id => document.getElementById(id);
document.querySelectorAll('[data-icon]').forEach(node => node.innerHTML = svg(node.dataset.icon));

const state = { prefs: {...defaults}, selected: dayKey(sessionDay(new Date())), today: dayKey(new Date()) };
const shortDay = new Intl.DateTimeFormat('nl-NL', { weekday: 'short' });
const longDay = new Intl.DateTimeFormat('nl-NL', { weekday:'long' });
const fullDate = new Intl.DateTimeFormat('nl-NL', { weekday:'long', day:'numeric', month:'long' });
const monthDate = new Intl.DateTimeFormat('nl-NL', { day:'numeric', month:'long' });
const rangeDate = new Intl.DateTimeFormat('nl-NL', { day:'numeric', month:'long', year:'numeric' });
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const android = /Android/i.test(navigator.userAgent);
const standalone = matchMedia('(display-mode: standalone)').matches;
const cacheName = 'ochtendflow/preferences';
let installEvent;
let noticeTimer;
let changed = false;

function notice(message) {
  $('notice').textContent = message;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => $('notice').textContent = '', 4800);
}
async function savedPrefs(prefs) {
  try {
    const prefsURL = new URL('./.preferences', document.baseURI);
    const store = await caches.open(cacheName);
    await store.put(prefsURL, new Response(JSON.stringify(prefs), {headers:{'Content-Type':'application/json'}}));
    return true;
  } catch { return false; }
}
async function loadPrefs() {
  try {
    const prefsURL = new URL('./.preferences', document.baseURI);
    const store = await caches.open(cacheName);
    const cached = await store.match(prefsURL);
    if (!cached || changed) return;
    const {time,duration} = await cached.json();
    if (changed) return;
    if (/^([01]\d|2[0-3]):[0-5]\d$/.test(time) && durationChoices.includes(duration)) state.prefs = {time,duration};
    render();
  } catch { /* Embedded previews can disable persistent storage. */ }
}
function setText(id,value) { $(id).textContent = value; }
function updateDay(now) {
  const today = dayKey(now);
  if (today !== state.today) {
    state.today = today;
    state.selected = dayKey(sessionDay(now));
    return true;
  }
}
function render() {
  const now = new Date();
  updateDay(now);
  const {time,duration} = state.prefs;
  const dates = weekdayWeek(now);
  const selectedDate = parseDay(state.selected);
  const video = videoFor(selectedDate,duration);
  const todaySelected = dayKey(selectedDate) === state.today;
  setText('date-line',fullDate.format(now));
  setText('page-title', isWorkday(now) ? 'Goedemorgen.' : 'Fijn weekend.');
  setText('intro-copy', isWorkday(now) ? 'Begin je werkdag met een korte mobiliteitsroutine.' : 'In het weekend staat er niets gepland. Bekijk alvast de sessie voor maandag.');
  setText('schedule-time',time);
  setText('session-label',todaySelected ? 'SESSIE VAN VANDAAG' : `SESSIE VOOR ${longDay.format(selectedDate).toUpperCase()}`);
  setText('video-length',video.length);
  setText('video-title',video.title);
  setText('video-creator',video.creator);
  setText('video-description',video.description);
  $('cover-play').href = $('watch').href = video.url;
  // Android Chrome supports a user-initiated, explicit app intent and HTTPS fallback.
  const launchAndroidApp = android && window.top === window.self;
  $('cast').href = launchAndroidApp
    ? `intent://www.youtube.com/watch?v=${video.id}#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=${encodeURIComponent(video.url)};end`
    : video.url;
  $('cast').target = launchAndroidApp ? '_self' : '_blank';
  const first = dates[0], last = dates[4];
  setText('week-range',(first.getMonth()===last.getMonth() && first.getFullYear()===last.getFullYear() ? first.getDate() : monthDate.format(first)) + ' t/m ' + rangeDate.format(last));
  setText('target-length',`± ${duration} min`);
  const oldFocus = document.activeElement?.dataset?.date;
  $('week-list').replaceChildren(...dates.map(day => {
    const item = document.createElement('li');
    const date = dayKey(day), pick = videoFor(day,duration);
    const btn = document.createElement('button');
    btn.type='button'; btn.className='day'; btn.dataset.date=date;
    btn.setAttribute('aria-pressed',String(date===state.selected));
    btn.innerHTML = `<span class="day-date"><span>${shortDay.format(day).replace('.','')}</span><strong>${day.getDate()}</strong></span>
      <span class="day-details"><strong></strong><span class="day-meta">${date===state.today ? '<span class="day-today">Vandaag</span><span>·</span>' : ''}${pick.length}</span></span><span class="day-arrow">${svg('chevron')}</span>`;
    btn.querySelector('.day-details strong').textContent = pick.title;
    btn.addEventListener('click',() => {
      state.selected = date; render();
      navigate('vandaag',false);
      if (matchMedia('(max-width:720px)').matches) {
        $('video-title').focus({preventScroll:true});
        jumpToMain();
      }
    });
    item.append(btn);
    return item;
  }));
  if (oldFocus) $('week-list').querySelector(`[data-date="${oldFocus}"]`)?.focus({preventScroll:true});
  setText('reminder-copy',`Zet je routine in je agenda en krijg op werkdagen om ${time} een seintje.`);
}
function jumpToMain() { window.scrollTo({top:0,behavior:'instant'}); }
function updateNav(target) {
  for (const tab of ['today','week']) {
    const el = $(`nav-${tab}`);
    if (tab === target) el.setAttribute('aria-current','page');
    else el.removeAttribute('aria-current');
  }
}
function navigate(hash, scroll=true) {
  try { if (location.hash!==`#${hash}`) history.replaceState(null,'',`#${hash}`); } catch {}
  updateNav(hash==='week' ? 'week' : 'today');
  if (!scroll) return;
  if (hash==='week') $('week-planning').scrollIntoView({block:'start'});
  else jumpToMain();
}
for (const link of document.querySelectorAll('header a[href^="#"]')) {
  link.addEventListener('click',e=>{
    e.preventDefault();
    if (link.hash==='#vandaag') {
      state.selected=dayKey(sessionDay(new Date()));
      render();
    }
    navigate(link.hash.slice(1));
  });
}
function directURL() {
  const url = new URL(location.href);
  url.hash = '';
  if (window.top !== window.self) return null;
  return url.href;
}
function show(id) { $(id).showModal(); }
document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(el=>el.addEventListener('click', e=>{
  if (e.target !== el) return;
  const r=el.getBoundingClientRect();
  if (e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom) el.close();
}));
$('durations').innerHTML = durationChoices.map(n=>`<label><input type="radio" name="duration" value="${n}"><span>${n} min</span></label>`).join('');
function settings() {
  $('time').value=state.prefs.time;
  $('settings-form').elements.duration.value=String(state.prefs.duration);
  show('settings-dialog');
}
$('settings').addEventListener('click',settings);
$('schedule').addEventListener('click',settings);
const settingsForm = $('settings-form');
async function saveSettings() {
  if (!settingsForm.reportValidity()) return;
  const time=$('time').value, duration=Number(new FormData(settingsForm).get('duration'));
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time) || !durationChoices.includes(duration)) return;
  state.prefs={time,duration}; changed=true; render(); $('settings-dialog').close();
  const saved = await savedPrefs(state.prefs);
  notice(saved ? 'Je planning is opgeslagen.' : 'Planning bijgewerkt voor deze weergave. Open de app zelfstandig om te bewaren.');
}
settingsForm.addEventListener('submit',e=>{ e.preventDefault(); void saveSettings(); });
$('save-settings').addEventListener('click',e=>{ e.preventDefault(); void saveSettings(); });
$('time').addEventListener('keydown',e=>{
  if (e.key==='Enter') { e.preventDefault(); void saveSettings(); }
});
$('cast-help').addEventListener('click',()=>show('cast-dialog'));
$('reminder').addEventListener('click',()=>{
  setText('reminder-dialog-copy',`Plan een terugkerende afspraak voor ${state.prefs.time}. Je agenda geeft de melding, ook als Ochtendflow niet openstaat.`);
  $('google-calendar').href=googleEvent(new Date(),state.prefs,directURL() ?? document.referrer);
  show('reminder-dialog');
});
$('ics').addEventListener('click',()=>{
  const data = calendarFile(new Date(),state.prefs,directURL() ?? document.referrer);
  const blob = URL.createObjectURL(new Blob([data],{type:'text/calendar;charset=utf-8'}));
  const download = document.createElement('a');
  download.href=blob; download.download='ochtendflow-werkdagen.ics';
  document.body.append(download); download.click(); download.remove();
  setTimeout(()=>URL.revokeObjectURL(blob),3000);
});
window.addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); installEvent=e; });
window.addEventListener('appinstalled',()=>$('install').hidden=true);
$('install').hidden = standalone;
$('install').addEventListener('click',async ()=>{
  if (installEvent) {
    try { await installEvent.prompt(); installEvent=null; return; }
    catch { installEvent=null; }
  }
  show('install-dialog');
});
render(); loadPrefs();
navigate(location.hash==='#week' ? 'week' : 'vandaag',location.hash==='#week');
setInterval(()=>{ if(updateDay(new Date())) render(); },30000);
document.addEventListener('visibilitychange',()=>{ if (!document.hidden && updateDay(new Date())) render(); });
if (window.top === window.self) {
  try { navigator.serviceWorker?.register('./sw.js').catch(()=>{}); }
  catch { /* This hosting context does not permit service workers. */ }
}
