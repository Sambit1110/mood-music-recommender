function recommendMusic() {
  const mood = document.getElementById("mood").value;
  const result = document.getElementById("result");

  let message = "";
  let link = "";

  switch (mood) {
    case "happy":
      message = "😊 Feeling happy? Enjoy this upbeat playlist!";
      link = "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC";
      break;

    case "sad":
      message = "😔 Here's a soothing playlist for your mood.";
      link = "https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1";
      break;

    case "angry":
      message = "😡 Let it out with some powerful tracks!";
      link = "https://open.spotify.com/playlist/37i9dQZF1DWYxwmBaMqxsl";
      break;

    case "relaxed":
      message = "😌 Time to relax with lo-fi & chill vibes.";
      link = "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO";
      break;

    case "energetic":
      message = "⚡ Boost your energy with this playlist!";
      link = "https://open.spotify.com/playlist/37i9dQZF1DX8FwnYE6PRvL";
      break;

    default:
      result.innerHTML = "⚠️ Please select a mood!";
      return;
  }

  result.innerHTML = `
    <p>${message}</p>
    <a href="${link}" target="_blank" class="spotify-btn">
      🎵 Open on Spotify
    </a>
  `;
}
