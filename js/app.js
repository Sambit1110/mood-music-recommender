import { MOODS, MOOD_KEYS, spotifyUrl, embedUrl, nearestMood } from "./moods.js";
import { detectMood } from "./detect-text.js";
import { suggestForTime, suggestForWeather } from "./weather.js";

const $ = (id) => document.getElementById(id);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const INK = { dark: "#17131f", light: "#ffffff" };

// ---------- storage (can throw in private mode) ----------
const store = {
  get(k, d) { try { const v = localStorage.getItem("moodmusic." + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("moodmusic." + k, JSON.stringify(v)); } catch {} },
};

let current = null; // { mood, p }

// ---------- theming ----------
function paint(key) {
  const m = MOODS[key];
  const root = document.documentElement.style;
  root.setProperty("--c1", m.colors[0]);
  root.setProperty("--c2", m.colors[1]);
  root.setProperty("--c3", m.colors[2]);
  root.setProperty("--ink", INK[m.ink]);
  root.setProperty("--paper", m.ink === "dark" ? "#ffffff" : "#17131f");
  document.querySelector('meta[name="theme-color"]').setAttribute("content", m.colors[0]);
}
const moodVars = (m) => `--m1:${m.colors[0]};--m2:${m.colors[1]};--m-ink:${INK[m.ink]}`;

// ---------- apply a mood ----------
function applyMood(key, { source = "Your mood", p = null, scroll = true } = {}) {
  const m = MOODS[key];
  if (!m) return;
  const idx = p != null && m.playlists[p] ? p : Math.floor(Math.random() * m.playlists.length);
  const changed = !current || current.mood !== key;
  current = { mood: key, p: idx };

  paint(key);
  document.body.dataset.mood = key;
  if (changed && !reduceMotion) { document.body.classList.remove("pulse"); void document.body.offsetWidth; document.body.classList.add("pulse"); }

  // hero word
  const hero = $("heroMood");
  hero.classList.add("swap");
  setTimeout(() => {
    $("heroLead").textContent = "You're feeling";
    hero.textContent = `${m.feel} ${m.emoji}`;
    hero.classList.remove("swap");
  }, reduceMotion ? 0 : 220);

  // grid + map selection
  for (const b of document.querySelectorAll(".mood")) {
    const on = b.dataset.mood === key;
    b.setAttribute("aria-checked", String(on));
    b.tabIndex = on ? 0 : -1;
  }

  // result header
  $("result").hidden = false;
  $("rEmoji").textContent = m.emoji;
  $("rEmoji").style.animation = "none"; void $("rEmoji").offsetWidth; $("rEmoji").style.animation = "";
  $("rTitle").textContent = m.label;
  $("rLine").textContent = m.line;
  $("rSource").textContent = source;

  renderPills();
  loadPlaylist();
  addRecent(key);
  if (scroll) setTimeout(() => $("result").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }), 80);
}

function renderPills() {
  const m = MOODS[current.mood];
  const box = $("playlistPills");
  box.textContent = "";
  m.playlists.forEach((pl, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pill";
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", String(i === current.p));
    b.textContent = pl.name;
    b.addEventListener("click", () => { current.p = i; renderPills(); loadPlaylist(); });
    box.append(b);
  });
}

function loadPlaylist() {
  const pl = MOODS[current.mood].playlists[current.p];
  $("player").src = embedUrl(pl.id);
  $("player").title = `Spotify player: ${pl.name}`;
  $("openBtn").href = spotifyUrl(pl.id);
  $("openBtn").setAttribute("aria-label", `Open ${pl.name} in Spotify (new tab)`);
  syncFav();
  const url = new URL(location.href);
  url.searchParams.set("mood", current.mood);
  url.searchParams.set("p", String(current.p));
  history.replaceState(null, "", url);
}

// ---------- toast ----------
let toastTimer;
function toast(msg) {
  $("toast").textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $("toast").textContent = ""; }, 2600);
}

// ---------- shuffle / favourites / share ----------
$("shuffleBtn").addEventListener("click", () => {
  const n = MOODS[current.mood].playlists.length;
  if (n < 2) return toast("Only one playlist for this mood.");
  let i;
  do { i = Math.floor(Math.random() * n); } while (i === current.p);
  current.p = i;
  renderPills();
  loadPlaylist();
  toast(`Shuffled to ${MOODS[current.mood].playlists[i].name}`);
});

const favKey = (f) => `${f.mood}:${f.id}`;
function favs() { return store.get("favs", []); }
function syncFav() {
  const pl = MOODS[current.mood].playlists[current.p];
  const on = favs().some((f) => f.id === pl.id && f.mood === current.mood);
  $("favBtn").setAttribute("aria-pressed", String(on));
  $("favBtn").textContent = on ? "♥" : "♡";
  $("favBtn").setAttribute("aria-label", on ? "Remove from saved" : "Save this playlist");
}
$("favBtn").addEventListener("click", () => {
  const pl = MOODS[current.mood].playlists[current.p];
  let list = favs();
  const k = favKey({ mood: current.mood, id: pl.id });
  if (list.some((f) => favKey(f) === k)) { list = list.filter((f) => favKey(f) !== k); toast("Removed from saved."); }
  else { list.unshift({ mood: current.mood, id: pl.id, name: pl.name }); toast("Saved ♥"); $("favBtn").classList.remove("pop"); void $("favBtn").offsetWidth; $("favBtn").classList.add("pop"); }
  store.set("favs", list.slice(0, 24));
  syncFav();
  renderSaved();
});
$("shareBtn").addEventListener("click", async () => {
  const m = MOODS[current.mood];
  const pl = m.playlists[current.p];
  const url = location.href;
  const text = `Feeling ${m.label.toLowerCase()} ${m.emoji}: listening to "${pl.name}" on Mood Music`;
  try {
    if (navigator.share && matchMedia("(pointer: coarse)").matches) { await navigator.share({ title: "Mood Music", text, url }); return; }
    await navigator.clipboard.writeText(url);
    toast("Link copied. Send it to a friend!");
  } catch (e) {
    if (e?.name !== "AbortError") toast("Couldn't copy. You can copy the address bar instead.");
  }
});

// ---------- saved + recent ----------
function addRecent(key) {
  const list = [key, ...store.get("recent", []).filter((k) => k !== key)].slice(0, 8);
  store.set("recent", list);
  renderSaved();
}
function renderSaved() {
  const fl = $("favList");
  fl.textContent = "";
  const list = favs().filter((f) => MOODS[f.mood]);
  $("favEmpty").hidden = list.length > 0;
  for (const f of list) {
    const m = MOODS[f.mood];
    const wrap = document.createElement("div");
    wrap.className = "fav-wrap";
    const b = document.createElement("button");
    b.type = "button";
    b.className = "fav";
    b.style.cssText = moodVars(m);
    b.innerHTML = `<span class="e" aria-hidden="true">${m.emoji}</span><span><b></b><small>${m.label}</small></span>`;
    b.querySelector("b").textContent = f.name;
    b.addEventListener("click", () => {
      const p = m.playlists.findIndex((pl) => pl.id === f.id);
      applyMood(f.mood, { source: "From your saved vibes", p: p < 0 ? 0 : p });
    });
    const x = document.createElement("button");
    x.type = "button";
    x.className = "fav-remove";
    x.setAttribute("aria-label", `Remove ${f.name} from saved`);
    x.textContent = "✕";
    x.addEventListener("click", () => {
      store.set("favs", favs().filter((g) => favKey(g) !== favKey(f)));
      renderSaved();
      if (current) syncFav();
    });
    wrap.append(b, x);
    fl.append(wrap);
  }
  const rl = $("recentList");
  rl.textContent = "";
  const recent = store.get("recent", []).filter((k) => MOODS[k]);
  $("recentEmpty").hidden = recent.length > 0;
  for (const k of recent) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "recent";
    b.textContent = `${MOODS[k].emoji} ${MOODS[k].label}`;
    b.addEventListener("click", () => applyMood(k, { source: "From your recent moods" }));
    rl.append(b);
  }
}

// ---------- tabs (with arrow-key navigation) ----------
const tabs = [...document.querySelectorAll(".tab")];
function selectTab(tab, focus = false) {
  for (const t of tabs) {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    $(t.getAttribute("aria-controls")).hidden = !on;
  }
  if (focus) tab.focus();
  if (tab.id === "tab-map") { mapNear = null; layoutMap(); }
  else restoreColors(); // drop the map's live colour preview
}
function restoreColors() {
  if (current) { paint(current.mood); return; }
  const root = document.documentElement.style;
  ["--c1", "--c2", "--c3", "--ink", "--paper"].forEach((v) => root.removeProperty(v));
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => selectTab(t));
  t.addEventListener("keydown", (e) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (d) { e.preventDefault(); selectTab(tabs[(i + d + tabs.length) % tabs.length], true); }
  });
});

// ---------- mood grid ----------
const grid = $("moodGrid");
MOOD_KEYS.forEach((key, i) => {
  const m = MOODS[key];
  const b = document.createElement("button");
  b.type = "button";
  b.className = "mood";
  b.dataset.mood = key;
  b.setAttribute("role", "radio");
  b.setAttribute("aria-checked", "false");
  b.tabIndex = i === 0 ? 0 : -1;
  b.style.cssText = moodVars(m);
  b.innerHTML = `<span class="e" aria-hidden="true">${m.emoji}</span><span>${m.label}</span>`;
  b.addEventListener("click", () => applyMood(key, { source: "You picked" }));
  grid.append(b);
});
grid.addEventListener("keydown", (e) => {
  const btns = [...grid.querySelectorAll(".mood")];
  const i = btns.indexOf(document.activeElement);
  if (i < 0) return;
  const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
  const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[e.key];
  if (!d) return;
  e.preventDefault();
  const next = btns[(i + d + btns.length) % btns.length];
  btns.forEach((b) => (b.tabIndex = -1));
  next.tabIndex = 0;
  next.focus();
});

// ---------- mood map ----------
const map = $("moodMap"), puck = $("puck");
let mapPos = { x: 0, y: 0 }, mapNear = null;
for (const key of MOOD_KEYS) {
  const m = MOODS[key];
  const s = document.createElement("span");
  s.className = "map-dot";
  s.dataset.mood = key;
  s.textContent = m.emoji;
  s.style.left = `${((m.x + 1) / 2) * 100}%`;
  s.style.top = `${((1 - m.y) / 2) * 100}%`;
  map.append(s);
}
function layoutMap() {
  puck.style.left = `${((mapPos.x + 1) / 2) * 100}%`;
  puck.style.top = `${((1 - mapPos.y) / 2) * 100}%`;
  const near = nearestMood(mapPos.x, mapPos.y);
  if (near !== mapNear) {
    mapNear = near;
    map.querySelectorAll(".map-dot").forEach((d) => d.classList.toggle("near", d.dataset.mood === near));
    $("mapMood").textContent = `${MOODS[near].emoji} ${MOODS[near].label}`;
    map.setAttribute("aria-valuetext", MOODS[near].label);
    paint(near); // live preview of the colours while you drag
  }
}
function mapFromEvent(e) {
  const r = map.getBoundingClientRect();
  mapPos = {
    x: Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)),
    y: Math.max(-1, Math.min(1, 1 - ((e.clientY - r.top) / r.height) * 2)),
  };
  layoutMap();
}
map.addEventListener("pointerdown", (e) => { map.setPointerCapture(e.pointerId); mapFromEvent(e); });
map.addEventListener("pointermove", (e) => { if (map.hasPointerCapture(e.pointerId)) mapFromEvent(e); });
map.addEventListener("keydown", (e) => {
  const step = e.shiftKey ? 0.25 : 0.1;
  const d = { ArrowRight: [step, 0], ArrowLeft: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key];
  if (e.key === "Enter") { e.preventDefault(); $("mapGo").click(); return; }
  if (!d) return;
  e.preventDefault();
  mapPos = { x: Math.max(-1, Math.min(1, mapPos.x + d[0])), y: Math.max(-1, Math.min(1, mapPos.y + d[1])) };
  layoutMap();
});
$("mapGo").addEventListener("click", () => applyMood(mapNear || nearestMood(mapPos.x, mapPos.y), { source: "From the mood map" }));

// ---------- describe your day ----------
function runText() {
  const text = $("dayText").value;
  const note = $("textResult");
  if (!text.trim()) { note.textContent = "Write a few words about how things are going first."; return; }
  const r = detectMood(text);
  if (!r || !r.mood) {
    note.innerHTML = "Hmm, couldn't read a clear mood from that. Try a few more feeling words, or pick one in the <b>Pick</b> tab.";
    return;
  }
  const m = MOODS[r.mood];
  note.innerHTML = `Sounds like <b></b>${r.because.length ? ` (from “${r.because.map(escapeHtml).join("”, “")}”)` : ""}.`;
  note.querySelector("b").textContent = `${m.emoji} ${m.label}`;
  applyMood(r.mood, { source: "From your words" });
}
$("textGo").addEventListener("click", runText);
$("dayText").addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) runText(); });
document.querySelectorAll(".example").forEach((b) => b.addEventListener("click", () => { $("dayText").value = b.textContent; runText(); }));
function escapeHtml(s) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

// ---------- camera (module loaded only when used) ----------
$("camGo").addEventListener("click", async () => {
  const btn = $("camGo"), status = $("camStatus"), frame = document.querySelector(".cam-frame");
  btn.disabled = true;
  try {
    const { detectFromCamera } = await import("./camera.js");
    const r = await detectFromCamera($("camVideo"), (msg) => {
      status.textContent = msg;
      frame.classList.toggle("live", msg.startsWith("Look"));
    });
    const m = MOODS[r.mood];
    status.innerHTML = `Your face says <b></b> (${r.expression}, ${Math.round(r.confidence * 100)}% sure).`;
    status.querySelector("b").textContent = `${m.emoji} ${m.label}`;
    applyMood(r.mood, { source: "From your face" });
  } catch (e) {
    status.textContent = e.message || "Something went wrong with the camera.";
  } finally {
    btn.disabled = false;
    frame.classList.remove("live");
  }
});

// ---------- time + weather hints ----------
const t = suggestForTime();
$("timeHint").textContent = `🕘 ${t.why}: try ${MOODS[t.mood].emoji} ${MOODS[t.mood].label}`;
$("timeHint").addEventListener("click", () => applyMood(t.mood, { source: t.why }));
$("weatherBtn").addEventListener("click", async () => {
  const btn = $("weatherBtn"), status = $("hintStatus");
  btn.setAttribute("aria-busy", "true");
  status.textContent = "Checking the weather near you…";
  try {
    const w = await suggestForWeather();
    status.textContent = `${w.why}, so here's something ${MOODS[w.mood].label.toLowerCase()}.`;
    applyMood(w.mood, { source: w.why });
  } catch (e) {
    status.textContent = e.message || "Couldn't get the weather.";
  } finally {
    btn.removeAttribute("aria-busy");
  }
});

// ---------- start ----------
renderSaved();
layoutMap();
const params = new URLSearchParams(location.search);
const shared = params.get("mood");
if (shared && MOODS[shared]) {
  const p = parseInt(params.get("p"), 10);
  applyMood(shared, { source: "Shared with you", p: Number.isInteger(p) ? p : 0, scroll: false });
} else {
  restoreColors(); // layoutMap() above previewed a colour; go back to neutral
}
