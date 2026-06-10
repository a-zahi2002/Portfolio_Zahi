// Cyber Terminal — Audio System
// Provides global audio context with mute toggle and sound effects.
// Audio is MUTED by default — opt-in only.

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface AudioContextValue {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playHover: () => void;
  playSection: () => void;
}

const AudioCtx = createContext<AudioContextValue>({
  isMuted: true,
  toggleMute: () => {},
  playClick: () => {},
  playHover: () => {},
  playSection: () => {},
});

export const useAudio = () => useContext(AudioCtx);

// Tiny synthesized sounds using Web Audio API — no external files needed
function createAudioContext(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (!audioCtx) audioCtx = createAudioContext();
  return audioCtx;
}

function synthClick() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.type = 'sine';
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
}

function synthHover() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(2400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.04);
  gain.gain.setValueAtTime(0.02, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  osc.type = 'sine';
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
}

function synthSection() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  osc.type = 'sine';
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

const STORAGE_KEY = 'ct-audio-pref';

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === 'undefined') return true;
    const pref = localStorage.getItem(STORAGE_KEY);
    return pref !== 'unmuted'; // Default: muted
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, isMuted ? 'muted' : 'unmuted');
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    // Resume audio context on first unmute (browser autoplay policy)
    if (isMuted) {
      const ctx = getAudioCtx();
      if (ctx && ctx.state === 'suspended') ctx.resume();
    }
  }, [isMuted]);

  const playClick = useCallback(() => {
    if (!isMuted) synthClick();
  }, [isMuted]);

  const playHover = useCallback(() => {
    if (!isMuted) synthHover();
  }, [isMuted]);

  const playSection = useCallback(() => {
    if (!isMuted) synthSection();
  }, [isMuted]);

  return (
    <AudioCtx.Provider value={{ isMuted, toggleMute, playClick, playHover, playSection }}>
      {children}
    </AudioCtx.Provider>
  );
};
