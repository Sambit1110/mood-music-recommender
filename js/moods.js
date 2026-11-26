// Every mood: display info, colours for the page, a position on the mood map
// (x = valence: -1 down … +1 up, y = energy: -1 calm … +1 energetic),
// keywords for text detection, and real Spotify playlists (titles checked).

export const MOODS = {
  happy: {
    feel: "happy", label: "Happy", emoji: "😊", x: 0.75, y: 0.4,
    colors: ["#ffd23f", "#ff8c42", "#ff5d8f"], ink: "dark",
    line: "Sunshine in your ears. Keep that grin going.",
    words: ["happy", "glad", "great", "good", "awesome", "amazing", "joy", "joyful", "cheerful", "smile", "smiling", "fun", "yay", "wonderful", "fantastic", "delighted", "grateful", "blessed", "lovely", "excited", "😊", "😄", "😁", "🙂", "😃"],
    playlists: [
      { id: "37i9dQZF1DXdPec7aLTmlC", name: "Happy Hits!" },
      { id: "37i9dQZF1DX3rxVfibe1L0", name: "Mood Booster" },
      { id: "37i9dQZF1DWYBO1MoTDhZI", name: "Good Vibes" },
      { id: "37i9dQZF1DX7KNKjOK0o75", name: "Have a Great Day!" },
    ],
  },
  sad: {
    feel: "sad", label: "Sad", emoji: "😔", x: -0.75, y: -0.45,
    colors: ["#4a6fa5", "#2b3a67", "#151b33"], ink: "light",
    line: "It's okay to feel it. These songs get it.",
    words: ["sad", "down", "depressed", "unhappy", "cry", "crying", "cried", "tears", "lonely", "alone", "heartbroken", "broken", "miss", "missing", "hurt", "blue", "gloomy", "lost", "empty", "breakup", "dumped", "😢", "😭", "😔", "💔", "☹️"],
    playlists: [
      { id: "37i9dQZF1DX7qK8ma5wgG1", name: "Sad Songs" },
      { id: "37i9dQZF1DWVV27DiNWxkR", name: "Sad Indie" },
      { id: "37i9dQZF1DWSqBruwoIXkA", name: "sad hour" },
      { id: "37i9dQZF1DX3YSRoSdA634", name: "Life Sucks" },
    ],
  },
  angry: {
    feel: "angry", label: "Angry", emoji: "😤", x: -0.7, y: 0.82,
    colors: ["#e63946", "#9d0208", "#370617"], ink: "light",
    line: "Turn it up and let it out.",
    words: ["angry", "mad", "furious", "rage", "raging", "annoyed", "irritated", "pissed", "hate", "frustrated", "frustrating", "unfair", "fed up", "livid", "argument", "fight", "fought", "😠", "😡", "🤬", "😤"],
    playlists: [
      { id: "37i9dQZF1DWTcqUzwhNmKv", name: "Kickass Metal" },
      { id: "37i9dQZF1DWWJOmJ7nRx0C", name: "VOLUME" },
      { id: "37i9dQZF1DX1tyCD9QhIWF", name: "Walk Like A Badass" },
      { id: "37i9dQZF1DX1rVvRgjX59F", name: "90s Rock Anthems" },
    ],
  },
  relaxed: {
    feel: "relaxed", label: "Relaxed", emoji: "😌", x: 0.5, y: -0.6,
    colors: ["#9be7d8", "#5fb7c9", "#3a7ca5"], ink: "dark",
    line: "Slow down. Lo-fi, jazz and easy grooves.",
    words: ["relaxed", "relax", "relaxing", "chill", "chilled", "calm", "peaceful", "easy", "lazy", "cozy", "cosy", "mellow", "content", "sunday", "weekend", "vacation", "holiday", "beach", "😌", "🧘", "☕"],
    playlists: [
      { id: "37i9dQZF1DWWQRwui0ExPn", name: "lofi beats" },
      { id: "37i9dQZF1DX0SM0LYsmbMT", name: "Jazz Vibes" },
      { id: "37i9dQZF1DX889U0CL85jj", name: "Chill Vibes" },
      { id: "37i9dQZF1DX4WYpdgoIcn6", name: "Chill Hits" },
      { id: "37i9dQZF1DX1s9knjP51Oa", name: "calm vibes" },
    ],
  },
  energetic: {
    feel: "energetic", label: "Energetic", emoji: "⚡", x: 0.45, y: 0.92,
    colors: ["#f72585", "#b5179e", "#560bad"], ink: "light",
    line: "Full power. EDM and workout fuel.",
    words: ["energetic", "energy", "pumped", "hyped", "hype", "workout", "gym", "run", "running", "lift", "lifting", "training", "cardio", "sprint", "strong", "power", "⚡", "💪", "🏃", "🔥"],
    playlists: [
      { id: "37i9dQZF1DWUVpAXiEPK8P", name: "Power Workout" },
      { id: "37i9dQZF1DX76Wlfdnj7AP", name: "Beast Mode" },
      { id: "37i9dQZF1DX4dyzvuaRJ0n", name: "mint" },
      { id: "37i9dQZF1DXe6bgV3TmZOL", name: "Heavy Workout" },
    ],
  },
  focus: {
    feel: "focused", label: "Focused", emoji: "🎯", x: 0.08, y: -0.3,
    colors: ["#2a9d8f", "#21867a", "#264653"], ink: "light",
    line: "Head down, noise out. Music that stays out of the way.",
    words: ["focus", "focused", "study", "studying", "exam", "exams", "test", "homework", "assignment", "work", "working", "coding", "code", "deadline", "project", "reading", "concentrate", "productive", "office", "📚", "💻", "🎯"],
    playlists: [
      { id: "37i9dQZF1DWZeKCadgRdKQ", name: "Deep Focus" },
      { id: "37i9dQZF1DWXLeA8Omikj7", name: "Brain Food" },
      { id: "37i9dQZF1DX9sIqqvKsjG8", name: "Instrumental Study" },
      { id: "37i9dQZF1DX8NTLI2TtZa6", name: "Intense Studying" },
    ],
  },
  party: {
    feel: "party-ready", label: "Party", emoji: "🪩", x: 0.85, y: 0.82,
    colors: ["#ff006e", "#fb5607", "#ffbe0b"], ink: "dark",
    line: "Hands up. Dance floor's open.",
    words: ["party", "partying", "dance", "dancing", "club", "friday", "saturday", "night out", "celebrate", "celebration", "birthday", "drinks", "festival", "wedding", "🎉", "🥳", "🪩", "💃", "🕺"],
    playlists: [
      { id: "37i9dQZF1DXaXB8fQg7xif", name: "Dance Party" },
      { id: "37i9dQZF1DX0BcQWzuB7ZO", name: "Dance Hits" },
      { id: "37i9dQZF1DWSf2RDTDayIx", name: "Happy Beats" },
      { id: "37i9dQZF1DWWMOmoXKqHTD", name: "Songs to Sing in the Car" },
    ],
  },
  romantic: {
    feel: "romantic", label: "Romantic", emoji: "💗", x: 0.68, y: -0.12,
    colors: ["#ffafcc", "#ff7096", "#c9184a"], ink: "dark",
    line: "Soft lights, softer songs.",
    words: ["love", "loved", "romantic", "romance", "date", "crush", "kiss", "valentine", "partner", "girlfriend", "boyfriend", "wife", "husband", "anniversary", "butterflies", "❤️", "😍", "🥰", "💕", "💗"],
    playlists: [
      { id: "37i9dQZF1DX50QitC6Oqtn", name: "Love Pop" },
      { id: "37i9dQZF1DWTwnEm1IYyoj", name: "Soft Pop Hits" },
      { id: "37i9dQZF1DWSXBu5naYCM9", name: "A Perfect Day" },
    ],
  },
  sleepy: {
    feel: "sleepy", label: "Sleepy", emoji: "🌙", x: -0.1, y: -0.92,
    colors: ["#3c3b6e", "#1d1e4a", "#0b0c2a"], ink: "light",
    line: "Lights low. Drift off.",
    words: ["sleepy", "sleep", "tired", "exhausted", "insomnia", "bed", "bedtime", "night", "late", "yawn", "drained", "nap", "dream", "😴", "🥱", "🌙", "💤"],
    playlists: [
      { id: "37i9dQZF1DWZd79rJ6a7lp", name: "Sleep" },
      { id: "37i9dQZF1DWYcDQ1hSjOpY", name: "Deep Sleep" },
      { id: "37i9dQZF1DX4sWSpwq3LiO", name: "Peaceful Piano" },
    ],
  },
  nostalgic: {
    feel: "nostalgic", label: "Nostalgic", emoji: "📼", x: -0.28, y: 0.08,
    colors: ["#e9c46a", "#d4a373", "#9c6644"], ink: "dark",
    line: "Rewind. The songs you grew up on.",
    words: ["nostalgic", "nostalgia", "memories", "memory", "remember", "throwback", "old", "childhood", "school days", "back then", "used to", "reunion", "retro", "vintage", "📼", "📸"],
    playlists: [
      { id: "37i9dQZF1DXbTxeAdrVG2l", name: "All Out 90s" },
      { id: "37i9dQZF1DX4o1oenSJRJd", name: "All Out 2000s" },
      { id: "37i9dQZF1DX4UtSsGT1Sbe", name: "All Out 80s" },
      { id: "37i9dQZF1DX5Ejj0EkURtP", name: "All Out 2010s" },
      { id: "37i9dQZF1DWXRqgorJj26U", name: "Rock Classics" },
    ],
  },
  motivated: {
    feel: "motivated", label: "Motivated", emoji: "🚀", x: 0.32, y: 0.58,
    colors: ["#fb8500", "#ffb703", "#f15bb5"], ink: "dark",
    line: "Main character energy. Go get it.",
    words: ["motivated", "motivation", "confident", "ambitious", "goal", "goals", "win", "winning", "success", "grind", "hustle", "ready", "determined", "interview", "new job", "promotion", "start", "🚀", "🏆", "💯"],
    playlists: [
      { id: "37i9dQZF1DX4fpCWaHOned", name: "Confidence Boost" },
      { id: "37i9dQZF1DX9XIFQuFvzM4", name: "Feelin' Good" },
      { id: "37i9dQZF1DX2sUQwD7tbmL", name: "Feel-Good Indie Rock" },
      { id: "37i9dQZF1DX0XUsuxWHRQd", name: "RapCaviar" },
    ],
  },
  stressed: {
    feel: "stressed", label: "Stressed", emoji: "🌧️", x: -0.5, y: 0.38,
    colors: ["#8d99ae", "#5c677d", "#2b2d42"], ink: "light",
    line: "Breathe out. Let these take the edge off.",
    words: ["stressed", "stress", "stressful", "anxious", "anxiety", "nervous", "worried", "worry", "overwhelmed", "panic", "pressure", "busy", "chaos", "overthinking", "scared", "afraid", "😰", "😟", "😬", "😩"],
    playlists: [
      { id: "37i9dQZF1DWXe9gFZP0gtP", name: "Stress Relief" },
      { id: "37i9dQZF1DWYxwmBaMqxsl", name: "Rainy Day Jazz" },
      { id: "37i9dQZF1DX6VdMW310YC7", name: "Chill Tracks" },
      { id: "37i9dQZF1DX6ziVCJnEm59", name: "Your Favorite Coffeehouse" },
    ],
  },
};

export const MOOD_KEYS = Object.keys(MOODS);

export const spotifyUrl = (id) => `https://open.spotify.com/playlist/${id}`;
export const embedUrl = (id) => `https://open.spotify.com/embed/playlist/${id}?utm_source=generator`;

// Closest mood to a point on the mood map.
export function nearestMood(x, y) {
  let best = null, bestD = Infinity;
  for (const key of MOOD_KEYS) {
    const m = MOODS[key];
    const d = (m.x - x) ** 2 + (m.y - y) ** 2;
    if (d < bestD) { bestD = d; best = key; }
  }
  return best;
}
