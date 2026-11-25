// Cross-platform Audio Engine & Image Asset Data URIs for Multimedia (Enterm)

type SfxListener = (eventLabel: string, count: number) => void;

let sfxCount = 0;
let lastSfxLabel = 'Ready (Tap any button)';
const listeners: Set<SfxListener> = new Set();

let bgmInterval: ReturnType<typeof setInterval> | null = null;
let bgmPlaying = false;
let audioCtx: AudioContext | null = null;

function getWebAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }
  if (!audioCtx) {
    try {
      audioCtx = new AudioContextClass();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function subscribeSfxEvents(listener: SfxListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSfxStatus(): { label: string; count: number } {
  return { label: lastSfxLabel, count: sfxCount };
}

/**
 * Plays a short, crisp dual-tone chime sound effect when a button is tapped.
 */
export function playTapSoundEffect(actionName = 'Button Tap'): {
  label: string;
  count: number;
} {
  sfxCount += 1;
  lastSfxLabel = `${actionName} Chime (880Hz) #${sfxCount}`;

  const ctx = getWebAudioContext();
  if (ctx) {
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.09); // A5

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore audio context restrictions in headless environments
    }
  }

  listeners.forEach((fn) => fn(lastSfxLabel, sfxCount));
  return { label: lastSfxLabel, count: sfxCount };
}

/**
 * Toggles looping ambient background study music on or off.
 */
export function toggleBackgroundMusic(shouldPlay?: boolean): boolean {
  const nextState = shouldPlay !== undefined ? shouldPlay : !bgmPlaying;
  bgmPlaying = nextState;

  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }

  if (bgmPlaying) {
    const notes = [261.63, 329.63, 392.0, 493.88, 523.25, 392.0, 329.63, 293.66];
    let step = 0;

    const playNote = () => {
      if (!bgmPlaying) return;
      const ctx = getWebAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(notes[step % notes.length], now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
        step += 1;
      } catch {
        // Ignore audio errors
      }
    };

    playNote();
    bgmInterval = setInterval(playNote, 480);
  }

  return bgmPlaying;
}

export function isBackgroundMusicPlaying(): boolean {
  return bgmPlaying;
}

// High-resolution SVG Data URI for the Image-Based UI Campus Banner
const BANNER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="240" viewBox="0 0 800 240">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="48%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#7E22CE"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <linearGradient id="emerald" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <rect width="800" height="240" rx="22" fill="url(#bg)"/>
  <circle cx="710" cy="45" r="110" fill="#FFFFFF" fill-opacity="0.08"/>
  <circle cx="640" cy="195" r="85" fill="#F59E0B" fill-opacity="0.14"/>
  <circle cx="110" cy="210" r="95" fill="#38BDF8" fill-opacity="0.12"/>
  <!-- Illustrated Campus Building & Academic Crest on Right -->
  <g transform="translate(535, 34)">
    <rect x="20" y="65" width="180" height="115" rx="10" fill="#FFFFFF" fill-opacity="0.16" stroke="#93C5FD" stroke-width="2"/>
    <polygon points="110,12 10,65 210,65" fill="url(#gold)"/>
    <rect x="42" y="85" width="22" height="65" rx="4" fill="#E0F2FE" fill-opacity="0.85"/>
    <rect x="78" y="85" width="22" height="65" rx="4" fill="#E0F2FE" fill-opacity="0.85"/>
    <rect x="120" y="85" width="22" height="65" rx="4" fill="#E0F2FE" fill-opacity="0.85"/>
    <rect x="156" y="85" width="22" height="65" rx="4" fill="#E0F2FE" fill-opacity="0.85"/>
    <rect x="10" y="155" width="200" height="14" rx="5" fill="#DBEAFE"/>
    <circle cx="110" cy="44" r="12" fill="#1E3A8A" stroke="#FEF3C7" stroke-width="2.5"/>
  </g>
  <!-- Floating Multimedia & Audio Badges -->
  <g transform="translate(32, 30)">
    <rect x="0" y="0" width="215" height="32" rx="16" fill="url(#emerald)"/>
    <text x="16" y="21" fill="#FFFFFF" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="800">★ MULTIMEDIA &amp; SQLITE HUB</text>
    <text x="0" y="76" fill="#FFFFFF" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="800">BSIS 4C Student Portal</text>
    <text x="0" y="108" fill="#DBEAFE" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="600">Image-Based UI • Audio BGM &amp; SFX • Video Player • Animations</text>
    <rect x="0" y="132" width="142" height="36" rx="10" fill="#FFFFFF" fill-opacity="0.2" stroke="#93C5FD" stroke-width="1.5"/>
    <text x="16" y="155" fill="#FFFFFF" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700">🎵 Audio Ready</text>
    <rect x="154" y="132" width="142" height="36" rx="10" fill="#FFFFFF" fill-opacity="0.2" stroke="#FCD34D" stroke-width="1.5"/>
    <text x="170" y="155" fill="#FEF3C7" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700">🎬 HD Video Clip</text>
    <rect x="308" y="132" width="148" height="36" rx="10" fill="#FFFFFF" fill-opacity="0.2" stroke="#6EE7B7" stroke-width="1.5"/>
    <text x="324" y="155" fill="#D1FAE5" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700">✨ Live Animations</text>
  </g>
</svg>`;

export const CAMPUS_BANNER_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  BANNER_SVG
)}`;

function makeButtonImageUri(bg1: string, bg2: string, symbol: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}"/>
        <stop offset="100%" stop-color="${bg2}"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="18" fill="url(#g)"/>
    <circle cx="32" cy="32" r="24" fill="#FFFFFF" fill-opacity="0.16"/>
    <text x="32" y="41" text-anchor="middle" fill="#FFFFFF" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="800">${symbol}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const IMAGE_BUTTON_ICONS = {
  bgmPlay: makeButtonImageUri('#3B82F6', '#1D4ED8', '♫'),
  bgmPause: makeButtonImageUri('#F59E0B', '#D97706', '❚❚'),
  sfxBell: makeButtonImageUri('#10B981', '#047857', '🔊'),
  animBounce: makeButtonImageUri('#A855F7', '#7E22CE', '✨'),
  animFade: makeButtonImageUri('#3B82F6', '#1D4ED8', '◐'),
  animSlide: makeButtonImageUri('#F59E0B', '#B45309', '➔'),
};
