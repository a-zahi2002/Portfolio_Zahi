// JARVIS-OS THEME — animation only
// JarvisAudio.ts — Singleton Web Audio API sound synthesizer.
// All sounds are synthesized in code — no external audio files.
// AudioContext is created once and suspended until first user gesture.

class JarvisAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private _isMuted = false;
  private _unlocked = false;
  private _delegationAttached = false;
  // Track scan beep cooldowns per element
  private _scanCooldowns = new WeakMap<Element, number>();

  /** Lazily create AudioContext on first call */
  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this._isMuted ? 0 : 1;
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  /** Resume AudioContext — must be called from a user gesture handler */
  private async resume(): Promise<void> {
    const ctx = this.getCtx();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    this._unlocked = true;
  }

  /** Helper: create an oscillator connected through master gain */
  private makeOsc(
    type: OscillatorType,
    freq: number,
    gainVal: number,
    startTime: number,
    endTime: number,
    ctx: AudioContext
  ): { osc: OscillatorNode; gain: GainNode } {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = gainVal;
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(startTime);
    osc.stop(endTime);
    // Cleanup after done
    osc.onended = () => {
      try { osc.disconnect(); gain.disconnect(); } catch {}
    };
    return { osc, gain };
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /** Deep resonant power-on sound. ~2.5s */
  systemBoot(): void {
    if (this._isMuted) return;
    const ctx = this.getCtx();
    const now = ctx.currentTime;

    // Layer 1: sine sweep 40→100 Hz (warm low-end rumble)
    const { osc: osc1, gain: g1 } = this.makeOsc('sine', 40, 0, now, now + 2.5, ctx);
    osc1.frequency.exponentialRampToValueAtTime(100, now + 1.0);
    g1.gain.setValueAtTime(0, now);
    g1.gain.linearRampToValueAtTime(0.06, now + 0.05);
    g1.gain.setValueAtTime(0.06, now + 2.0);
    g1.gain.linearRampToValueAtTime(0, now + 2.5);

    // Lowpass filter on layer 1 (muffle any harmonics)
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 300;
    osc1.disconnect();
    osc1.connect(filter1);
    filter1.connect(this.masterGain!);

    // Layer 2: sine sweep 60→160 Hz (smooth mid-low sweep)
    const { osc: osc2, gain: g2 } = this.makeOsc('sine', 60, 0, now, now + 2.5, ctx);
    osc2.frequency.exponentialRampToValueAtTime(160, now + 1.0);
    g2.gain.setValueAtTime(0, now);
    g2.gain.linearRampToValueAtTime(0.04, now + 0.05);
    g2.gain.setValueAtTime(0.04, now + 2.0);
    g2.gain.linearRampToValueAtTime(0, now + 2.5);

    // Soft warm completion chime at t=2.0s — sine 600 Hz, short
    const { gain: pingGain } = this.makeOsc('sine', 600, 0, now + 2.0, now + 2.12, ctx);
    pingGain.gain.setValueAtTime(0, now + 2.0);
    pingGain.gain.linearRampToValueAtTime(0.02, now + 2.02);
    pingGain.gain.linearRampToValueAtTime(0, now + 2.12);
  }

  /** Quick system chirp. ~0.15s */
  moduleInitialize(): void {
    if (this._isMuted) return;
    const ctx = this.getCtx();
    const now = ctx.currentTime;

    // Soft triangle sweep 320→640Hz (lower pitch, gentler than square)
    const { osc, gain } = this.makeOsc('triangle', 320, 0, now, now + 0.15, ctx);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.1);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 0.01);
    gain.gain.linearRampToValueAtTime(0, now + 0.15);
  }

  /** Rapid data processing tones. ~0.4s */
  dataStream(): void {
    if (this._isMuted) return;
    const ctx = this.getCtx();
    const now = ctx.currentTime;
    // Lower pitched, fewer tones (3 instead of 6), slower spread
    const freqs = [500, 700, 600];

    freqs.forEach((freq, i) => {
      const t = now + i * 0.1;
      const { gain } = this.makeOsc('sine', freq + Math.random() * 50, 0, t, t + 0.08, ctx);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.02, t + 0.01);
      gain.gain.linearRampToValueAtTime(0, t + 0.08);
    });
  }

  /** Metallic soft tick. ~0.06s */
  uiClick(): void {
    if (this._isMuted) return;
    const ctx = this.getCtx();
    const now = ctx.currentTime;

    // Sine wave 600Hz (much softer than triangle 1200Hz)
    const { gain } = this.makeOsc('sine', 600, 0, now, now + 0.04, ctx);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.04);
  }

  /** Soft hover tick. ~0.04s */
  uiHover(): void {
    if (this._isMuted) return;
    const ctx = this.getCtx();
    const now = ctx.currentTime;

    // Barely audible 300Hz sine wave pulse
    const { gain } = this.makeOsc('sine', 300, 0, now, now + 0.03, ctx);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.03);
  }

  /** Radar-like scan beep. ~0.3s */
  scanBeep(): void {
    if (this._isMuted) return;
    const ctx = this.getCtx();
    const now = ctx.currentTime;

    // Softer 500Hz sine beep
    const { gain } = this.makeOsc('sine', 500, 0, now, now + 0.25, ctx);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.1);
    gain.gain.linearRampToValueAtTime(0, now + 0.25);
  }

  /** Descending standby hum. ~1.2s */
  transmissionEnd(): void {
    if (this._isMuted) return;
    const ctx = this.getCtx();
    const now = ctx.currentTime;

    // Sine sweep (softer than sawtooth)
    const { osc, gain } = this.makeOsc('sine', 150, 0, now, now + 1.2, ctx);
    osc.frequency.exponentialRampToValueAtTime(60, now + 1.0);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    osc.disconnect();
    osc.connect(filter);
    filter.connect(this.masterGain!);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 0.05);
    gain.gain.linearRampToValueAtTime(0, now + 1.2);
  }

  /** Toggle mute state */
  toggle(): boolean {
    this._isMuted = !this._isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this._isMuted ? 0 : 1,
        this.getCtx().currentTime,
        0.05
      );
    }
    return this._isMuted;
  }

  get isMuted(): boolean {
    return this._isMuted;
  }

  /**
   * Unlock AudioContext and attach global event delegation.
   * Call once from a top-level component (e.g. App.tsx useEffect).
   * Uses capture-phase listeners so we intercept before React's handlers.
   */
  attachGlobalDelegation(): () => void {
    if (this._delegationAttached) return () => {};
    this._delegationAttached = true;

    // Unlock on first gesture
    const unlock = async () => {
      if (!this._unlocked) await this.resume();
    };

    // uiHover — mouseenter on a/button (capture phase)
    const onEnter = (e: MouseEvent) => {
      unlock();
      const target = e.target as Element;
      if (target.closest('a, button')) {
        this.uiHover();
      }
    };

    // uiClick — mousedown on a/button (capture phase)
    const onDown = (e: MouseEvent) => {
      unlock();
      const target = e.target as Element;
      if (target.closest('a, button')) {
        this.uiClick();
      }
    };

    document.addEventListener('mouseenter', onEnter, true);
    document.addEventListener('mousedown', onDown, true);

    return () => {
      document.removeEventListener('mouseenter', onEnter, true);
      document.removeEventListener('mousedown', onDown, true);
      this._delegationAttached = false;
    };
  }

  /**
   * Scan beep with per-element 1s cooldown (for project cards).
   */
  scanBeepCooled(el: Element): void {
    const now = Date.now();
    const last = this._scanCooldowns.get(el) ?? 0;
    if (now - last < 1000) return;
    this._scanCooldowns.set(el, now);
    this.scanBeep();
  }
}

// Singleton export
export const JarvisAudio = new JarvisAudioEngine();
