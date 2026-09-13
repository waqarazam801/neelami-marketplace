/**
 * Synthesizes authentic auction sounds using Web Audio API (zero external assets needed)
 */

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    return new AudioContextClass();
  } catch {
    return null;
  }
}

/**
 * Single wooden tap strike with resonant soundboard decay
 */
function synthesizeWoodTap(ctx: AudioContext, time: number, intensity: number = 0.4) {
  // 1. Low body resonance (wooden sound block)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(140, time);
  osc.frequency.exponentialRampToValueAtTime(32, time + 0.12);

  gain.gain.setValueAtTime(intensity, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + 0.18);

  // 2. High snap / transient click (hammer hitting wood block)
  const snapOsc = ctx.createOscillator();
  const snapGain = ctx.createGain();

  snapOsc.type = 'sine';
  snapOsc.frequency.setValueAtTime(750, time);
  snapOsc.frequency.exponentialRampToValueAtTime(120, time + 0.04);

  snapGain.gain.setValueAtTime(intensity * 0.7, time);
  snapGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

  snapOsc.connect(snapGain);
  snapGain.connect(ctx.destination);

  snapOsc.start(time);
  snapOsc.stop(time + 0.05);
}

/**
 * Authentic double gavel strike: "Bang! ... Knock!"
 */
export function playAuthenticGavel() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const t0 = ctx.currentTime;
    // Primary strike
    synthesizeWoodTap(ctx, t0, 0.45);
    // Secondary rebound strike (classic auctioneer double-tap)
    synthesizeWoodTap(ctx, t0 + 0.16, 0.32);
  } catch {
    // Autoplay policy fallback
  }
}

/**
 * Backward compatibility alias for single gavel strike
 */
export function playGavelStrike() {
  playAuthenticGavel();
}

/**
 * Dramatic Outbid Warning Alert Chime (descending minor urgency)
 */
export function playOutbidAlert() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;
    const notes = [659.25, 523.25]; // E5 -> C5

    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.18, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.35);
    });
  } catch {
    // Autoplay fallback
  }
}

/**
 * Urgent metronome tick for final 60 seconds anti-sniping zone
 */
export function playUrgencyTick() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.04);
  } catch {
    // Autoplay fallback
  }
}

/**
 * Ascending harmonic chime for confirmed bids
 */
export function playBidChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;
    const chord = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

    chord.forEach((freq, idx) => {
      const noteTime = t + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.12, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.45);
    });
  } catch {
    // Autoplay fallback
  }
}

