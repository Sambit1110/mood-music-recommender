// Optional webcam mood detection. Runs fully on-device with face-api
// (TensorFlow.js); no image ever leaves the browser. The library and two small
// models (~0.5 MB) are loaded only when the user asks for it.

const LIB = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/dist/face-api.esm.js";
const MODELS = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/";

// Facial expression → mood.
const MAP = { happy: "happy", sad: "sad", angry: "angry", disgusted: "angry", fearful: "stressed", surprised: "energetic", neutral: "focus" };

let faceapi = null;
async function load() {
  if (faceapi) return faceapi;
  faceapi = await import(LIB);
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODELS),
    faceapi.nets.faceExpressionNet.loadFromUri(MODELS),
  ]);
  return faceapi;
}

// Reads the face for ~2.5 seconds and averages the expressions.
// `onStatus` receives short progress messages for the UI.
export async function detectFromCamera(video, onStatus = () => {}) {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("This browser can't use the camera.");
  onStatus("Loading the face model…");
  const api = await load();
  onStatus("Waiting for camera permission…");
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 320, height: 240 }, audio: false });
  } catch (e) {
    throw new Error(e.name === "NotAllowedError" ? "Camera permission was denied." : "Couldn't start the camera.");
  }
  try {
    video.srcObject = stream;
    await video.play();
    onStatus("Look at the camera…");
    const totals = {};
    let frames = 0;
    const opts = new api.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.45 });
    const until = performance.now() + 2500;
    while (performance.now() < until) {
      const r = await api.detectSingleFace(video, opts).withFaceExpressions();
      if (r) {
        frames++;
        for (const [k, v] of Object.entries(r.expressions)) totals[k] = (totals[k] || 0) + v;
      }
      await new Promise((res) => setTimeout(res, 120));
    }
    if (!frames) throw new Error("No face found. Try better lighting and face the camera.");
    const [expr, sum] = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
    return { mood: MAP[expr] || "focus", expression: expr, confidence: sum / frames };
  } finally {
    stream.getTracks().forEach((t) => t.stop()); // camera off straight away
    video.srcObject = null;
  }
}
