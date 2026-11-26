// Time- and weather-aware suggestions.
// Time of day works offline. Weather is optional: it asks for location only
// when the user clicks, rounds it to ~10 km, and calls the free, keyless
// Open-Meteo API (https://open-meteo.com).

export function suggestForTime(date = new Date()) {
  const h = date.getHours();
  const day = date.getDay(); // 0 Sun … 6 Sat
  const weekend = day === 0 || day === 6;
  if (h < 5) return { mood: "sleepy", why: "It's the middle of the night" };
  if (h < 9) return { mood: weekend ? "relaxed" : "motivated", why: weekend ? "Slow weekend morning" : "Early start" };
  if (h < 12) return { mood: weekend ? "happy" : "focus", why: weekend ? "Weekend morning" : "Morning work hours" };
  if (h < 14) return { mood: "happy", why: "Lunchtime" };
  if (h < 18) return { mood: weekend ? "happy" : "focus", why: weekend ? "Weekend afternoon" : "Afternoon push" };
  if (h < 21) return { mood: (day === 5 || day === 6) ? "party" : "relaxed", why: (day === 5 || day === 6) ? "It's the weekend tonight" : "Winding down for the evening" };
  return { mood: "sleepy", why: "Getting late" };
}

// WMO weather codes → description and a fitting mood.
function fromCode(code, isDay, temp) {
  if ([95, 96, 99].includes(code)) return { desc: "stormy", mood: "energetic" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { desc: "snowy", mood: "nostalgic" };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { desc: "rainy", mood: isDay ? "relaxed" : "sleepy" };
  if ([45, 48].includes(code)) return { desc: "foggy", mood: "nostalgic" };
  if ([2, 3].includes(code)) return { desc: "cloudy", mood: "focus" };
  // clear
  if (!isDay) return { desc: "clear and starry", mood: "romantic" };
  if (temp >= 28) return { desc: "hot and sunny", mood: "party" };
  return { desc: "sunny", mood: "happy" };
}

export function getLocation() {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) return reject(new Error("Location isn't available in this browser."));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
      (e) => reject(new Error(e.code === 1 ? "Location permission was denied." : "Couldn't get your location.")),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 30 * 60 * 1000 },
    );
  });
}

export async function suggestForWeather() {
  const { lat, lon } = await getLocation();
  // Round to one decimal (~10 km): plenty for weather, kinder to privacy.
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(1)}&longitude=${lon.toFixed(1)}&current=temperature_2m,weather_code,is_day`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("The weather service didn't respond. Try again later.");
  const { current } = await res.json();
  const temp = Math.round(current.temperature_2m);
  const { desc, mood } = fromCode(current.weather_code, current.is_day === 1, temp);
  return { mood, why: `It's ${temp}° and ${desc} where you are`, temp, desc };
}
