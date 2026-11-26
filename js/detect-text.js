// "Describe your day": guess a mood from free text, entirely in the browser.
// Each mood has keywords (see moods.js). We score matches, handle simple
// negation ("not happy") and intensifiers ("so tired"), and explain the result.

import { MOODS, MOOD_KEYS } from "./moods.js";

const NEGATORS = new Set(["not", "no", "never", "dont", "don't", "isnt", "isn't", "wasnt", "wasn't", "cant", "can't", "cannot", "wont", "dont", "hardly", "barely", "without"]);
const BOOSTERS = new Set(["so", "very", "really", "super", "extremely", "totally", "too", "incredibly", "insanely", "kinda", "sooo"]);
// Where a negated feeling usually lands: "not happy" reads as down, "not stressed" as relaxed.
const NEGATED_TO = { happy: "sad", excited: "sad", relaxed: "stressed", motivated: "sad", energetic: "sleepy", sad: "relaxed", stressed: "relaxed", angry: "relaxed", sleepy: "energetic", focus: "stressed", romantic: "sad", party: "relaxed", nostalgic: "focus" };

// Word-level exceptions to the rule above: "can't sleep" is insomnia, not energy.
const NEGATED_WORD = { sleep: "sleepy", relax: "stressed", focus: "stressed", concentrate: "stressed" };

const normalize = (s) => s.toLowerCase().replace(/[’']/g, "'");

export function detectMood(text) {
  const raw = normalize(text);
  if (!raw.trim()) return null;
  const scores = Object.fromEntries(MOOD_KEYS.map((k) => [k, 0]));
  const hits = Object.fromEntries(MOOD_KEYS.map((k) => [k, []]));

  // Multi-word phrases and emoji first (matched on the whole string).
  for (const key of MOOD_KEYS) {
    for (const w of MOODS[key].words) {
      if (w.includes(" ") || /\p{Extended_Pictographic}/u.test(w)) {
        if (raw.includes(w)) { scores[key] += 1.5; hits[key].push(w); }
      }
    }
  }

  // Single words, with a small window for negation and boosters.
  const tokens = raw.match(/[\p{L}']+/gu) || [];
  const index = new Map();
  for (const key of MOOD_KEYS) for (const w of MOODS[key].words) if (!w.includes(" ")) index.set(w, [...(index.get(w) || []), key]);

  tokens.forEach((tok, i) => {
    const stem = index.has(tok) ? tok : index.has(tok.replace(/(ing|ed|s)$/, "")) ? tok.replace(/(ing|ed|s)$/, "") : null;
    if (!stem) return;
    const before = tokens.slice(Math.max(0, i - 3), i);
    const negated = before.some((t) => NEGATORS.has(t) || t.endsWith("n't"));
    const boost = before.some((t) => BOOSTERS.has(t)) ? 1.6 : 1;
    for (const key of index.get(stem)) {
      const target = negated ? NEGATED_WORD[stem] || NEGATED_TO[key] || null : key;
      if (!target) continue;
      scores[target] += boost;
      hits[target].push(negated ? `not ${tok}` : tok);
    }
  });

  // Exclamation marks nudge towards energy, lots of "..." towards low moods.
  const bangs = (raw.match(/!/g) || []).length;
  if (bangs >= 2) { scores.energetic += 0.4; scores.happy += 0.3; }
  if (/\.\.\./.test(raw)) { scores.sad += 0.3; }

  const ranked = MOOD_KEYS.map((k) => [k, scores[k]]).sort((a, b) => b[1] - a[1]);
  const [top, topScore] = ranked[0];
  if (topScore < 0.9) return { mood: null, confidence: 0, because: [] };
  const total = ranked.reduce((a, [, v]) => a + v, 0) || 1;
  return {
    mood: top,
    confidence: Math.min(0.99, topScore / total),
    because: [...new Set(hits[top])].slice(0, 4),
    runnerUp: ranked[1][1] > 0.9 ? ranked[1][0] : null,
  };
}
