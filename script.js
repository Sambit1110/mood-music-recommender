function recommendMusic() {
  const mood = document.getElementById("mood").value;
  const result = document.getElementById("result");

  let recommendation = "";

  switch (mood) {
    case "happy":
      recommendation = "🎶 Pop & Dance playlist to boost your happiness!";
      break;
    case "sad":
      recommendation = "🎶 Soft Acoustic & Indie tracks for your mood.";
      break;
    case "angry":
      recommendation = "🎶 Rock & Metal music to release stress.";
      break;
    case "relaxed":
      recommendation = "🎶 Lo-Fi & Jazz for relaxation.";
      break;
    case "energetic":
      recommendation = "🎶 EDM & Workout tracks to keep you moving!";
      break;
    default:
      recommendation = "⚠️ Please select a mood!";
  }

  result.innerText = recommendation;
}
