// Web Audio API synthesizer for tactile student notebook sounds
// Zero external audio files required; safe for SSR and browser autoplay policies.

let audioCtx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) {
    return noiseBuffer;
  }
  const length = Math.floor(ctx.sampleRate * 0.25);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  noiseBuffer = buffer;
  return buffer;
}

export function playPencilStroke(kind: "char" | "space" | "enter" | "backspace" = "char") {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const buf = getNoiseBuffer(ctx);

  // Filtered noise burst for graphite/pen-on-paper friction
  const src = ctx.createBufferSource();
  src.buffer = buf;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";

  const gain = ctx.createGain();

  if (kind === "backspace") {
    // Softer rubber-eraser rub
    filter.frequency.setValueAtTime(1100 + Math.random() * 250, now);
    filter.Q.setValueAtTime(1.4, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.055);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(now, Math.random() * 0.05, 0.06);
  } else if (kind === "enter") {
    // Carriage return / pen lift tap
    filter.frequency.setValueAtTime(1600, now);
    filter.Q.setValueAtTime(1.8, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.045);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(now, Math.random() * 0.05, 0.05);
  } else {
    // Organic pencil/pen scratch on textured paper
    const baseFreq = kind === "space" ? 1750 : 2300 + Math.random() * 900;
    const dur = kind === "space" ? 0.022 : 0.026 + Math.random() * 0.014;
    const peak = kind === "space" ? 0.025 : 0.038 + Math.random() * 0.018;

    filter.frequency.setValueAtTime(baseFreq, now);
    filter.Q.setValueAtTime(2.2, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + dur);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(now, Math.random() * 0.1, dur + 0.005);
  }
}

export function playPageTurn() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = getNoiseBuffer(ctx);

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.setValueAtTime(1.1, now);
  filter.frequency.setValueAtTime(750, now);
  filter.frequency.exponentialRampToValueAtTime(2400, now + 0.08);
  filter.frequency.exponentialRampToValueAtTime(950, now + 0.18);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.065, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.19);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start(now, 0, 0.2);
}

export function playPinClick() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.045);

  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.055);
}
