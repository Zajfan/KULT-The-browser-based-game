// Ambient sound engine — pure Web Audio API, no files required.
// Generates atmospheric horror soundscapes procedurally.

let ctx = null;
let masterGain = null;
let activeNodes = [];

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.18;
    masterGain.connect(ctx.destination);
  }
  return ctx;
}

// Brown noise — warmer, deeper than white noise. Foundation of the soundscape.
function createBrownNoise(gainVal = 0.08) {
  const ac = getCtx();
  const bufferSize = ac.sampleRate * 4;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }
  const source = ac.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const gain = ac.createGain();
  gain.gain.value = gainVal;
  source.connect(gain);
  gain.connect(masterGain);
  source.start();
  return { source, gain };
}

// Sub-bass drone — barely audible, felt more than heard.
function createDrone(freq = 40, gainVal = 0.06) {
  const ac = getCtx();
  const osc = ac.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;
  const gain = ac.createGain();
  gain.gain.value = gainVal;
  // Slow wobble on the frequency for unease
  const lfo = ac.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.07 + Math.random() * 0.04;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = freq * 0.012;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  lfo.start();
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start();
  return { osc, gain, lfo, lfoGain };
}

// High whisper — occasional high sine shimmer, barely perceivable.
function scheduleWhisper() {
  const ac = getCtx();
  const delay = 8000 + Math.random() * 20000;
  setTimeout(() => {
    const freq = 3000 + Math.random() * 4000;
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const gain = ac.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.015, ac.currentTime + 0.8);
    gain.gain.linearRampToValueAtTime(0, ac.currentTime + 2.5 + Math.random() * 2);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(ac.currentTime + 4);
    scheduleWhisper();
  }, delay);
}

// Single distant "knock" — impacts below 80Hz.
function scheduleLowKnock() {
  const ac = getCtx();
  const delay = 15000 + Math.random() * 40000;
  setTimeout(() => {
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 55 + Math.random() * 30;
    const gain = ac.createGain();
    gain.gain.value = 0.12;
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(ac.currentTime + 1.5);
    scheduleLowKnock();
  }, delay);
}

// Tension layer — a very slow filter sweep over noise.
function createTensionLayer() {
  const ac = getCtx();
  const bufSize = ac.sampleRate * 2;
  const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf; src.loop = true;
  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 200;
  filter.Q.value = 2;
  // Sweep filter slowly
  filter.frequency.setValueAtTime(200, ac.currentTime);
  filter.frequency.linearRampToValueAtTime(800, ac.currentTime + 30);
  filter.frequency.linearRampToValueAtTime(200, ac.currentTime + 60);
  const gain = ac.createGain();
  gain.gain.value = 0.03;
  src.connect(filter); filter.connect(gain); gain.connect(masterGain);
  src.start();
  return { src, filter, gain };
}

let started = false;

export function startAmbience() {
  if (started) return;
  try {
    started = true;
    const ac = getCtx();
    if (ac.state === 'suspended') ac.resume();

    const brown = createBrownNoise(0.06);
    const drone1 = createDrone(38, 0.05);
    const drone2 = createDrone(57, 0.03);
    const tension = createTensionLayer();
    scheduleWhisper();
    scheduleLowKnock();
    activeNodes = [brown, drone1, drone2, tension];
  } catch (e) {
    console.warn('Audio not available:', e);
  }
}

export function stopAmbience() {
  try {
    activeNodes.forEach(n => {
      try { n.source?.stop(); n.osc?.stop(); n.lfo?.stop(); n.src?.stop(); } catch(_){}
    });
    activeNodes = [];
    started = false;
  } catch(_){}
}

export function setVolume(v) {
  try { if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, v)); } catch(_){}
}

export function resumeCtx() {
  try { if (ctx?.state === 'suspended') ctx.resume(); } catch(_){}
}
