// JARVIS-OS THEME — animation only
// HudFrame.tsx — Fixed decorative HUD corner elements.
// Renders 4 corner brackets, live clock, section name, scroll %, audio toggle.
// All elements: pointer-events: none except audio toggle.
// Mobile: only top-left + audio toggle visible.

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { JarvisAudio } from '../lib/JarvisAudio';

// Corner SVG bracket shapes
const CornerBracket: React.FC<{
  position: 'tl' | 'tr' | 'bl' | 'br';
  size?: number;
}> = ({ position, size = 16 }) => {
  const lineProps = {
    stroke: 'var(--j-cyan)',
    strokeWidth: 1.5,
    fill: 'none',
  };

  const paths: Record<string, string> = {
    tl: `M ${size} 0 L 0 0 L 0 ${size}`,
    tr: `M 0 0 L ${size} 0 L ${size} ${size}`,
    bl: `M 0 0 L 0 ${size} L ${size} ${size}`,
    br: `M 0 ${size} L ${size} ${size} L ${size} 0`,
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <path d={paths[position]} {...lineProps} />
    </svg>
  );
};

// Live clock — HH:MM:SS
const LiveClock: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        [
          String(now.getHours()).padStart(2, '0'),
          String(now.getMinutes()).padStart(2, '0'),
          String(now.getSeconds()).padStart(2, '0'),
        ].join(':')
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span>{time}</span>;
};

const monoStyle: React.CSSProperties = {
  fontFamily: 'var(--j-font-mono)',
  fontSize: 9,
  letterSpacing: '0.08em',
  lineHeight: 1.6,
};

interface HudFrameProps {
  isVisible: boolean;
}

const HudFrame: React.FC<HudFrameProps> = ({ isVisible }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentSection, setCurrentSection] = useState('MODULE_01');
  const [currentProtocol, setCurrentProtocol] = useState('IDENTITY_SCAN');
  const [scrollPct, setScrollPct] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Mobile detection
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Fade in after preloader
  useEffect(() => {
    if (!frameRef.current) return;
    if (isVisible) {
      frameRef.current.style.opacity = '1';
      frameRef.current.style.transition = 'opacity 0.6s ease';
    }
  }, [isVisible]);

  // Listen for module:active events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ moduleId: string; protocolName: string }>).detail;
      if (detail) {
        setCurrentSection(detail.moduleId);
        setCurrentProtocol(detail.protocolName);
      }
    };
    document.addEventListener('module:active', handler);
    return () => document.removeEventListener('module:active', handler);
  }, []);

  // Scroll percentage
  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) return;
      setScrollPct(Math.round((window.scrollY / docH) * 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAudioToggle = useCallback(() => {
    const nowMuted = JarvisAudio.toggle();
    setAudioMuted(nowMuted);
  }, []);

  const cornerBase: React.CSSProperties = {
    position: 'fixed',
    zIndex: 100,
    opacity: isVisible ? 0.75 : 0,
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    transition: 'opacity 0.6s ease',
  };

  const labelStyle: React.CSSProperties = {
    ...monoStyle,
    color: 'var(--j-text-dim)',
  };

  const cyanStyle: React.CSSProperties = {
    ...monoStyle,
    color: 'var(--j-cyan)',
    opacity: 0.7,
  };

  return (
    <div ref={frameRef} style={{ opacity: 0 }} aria-hidden="true">
      {/* ── TOP-LEFT — J.A.R.V.I.S OS + Clock ─────────────────── */}
      <div style={{ ...cornerBase, top: 20, left: 20 }}>
        <CornerBracket position="tl" />
        <span style={labelStyle}>J.A.R.V.I.S OS</span>
        <span style={cyanStyle}>
          <LiveClock />
        </span>
      </div>

      {/* ── TOP-RIGHT — Section name + scroll % ─────────────────── */}
      {!isMobile && (
        <div style={{ ...cornerBase, top: 20, right: 20, alignItems: 'flex-end' }}>
          <CornerBracket position="tr" />
          <span style={labelStyle}>{currentSection}</span>
          <span style={cyanStyle}>SCROLL: {String(scrollPct).padStart(3, '0')}%</span>
        </div>
      )}

      {/* ── BOTTOM-LEFT — SYS NOMINAL + heartbeat ───────────────── */}
      {!isMobile && (
        <div style={{ ...cornerBase, bottom: 20, left: 20 }}>
          <span style={{ ...monoStyle, color: 'var(--j-green)' }}>SYS: NOMINAL</span>
          <div className="j-heartbeat" />
          <CornerBracket position="bl" />
        </div>
      )}

      {/* ── BOTTOM-RIGHT — Audio toggle + version ───────────────── */}
      <div
        style={{
          ...cornerBase,
          bottom: 20,
          right: 20,
          alignItems: 'flex-end',
          pointerEvents: 'auto', // audio toggle is interactive
        }}
      >
        <button
          onClick={handleAudioToggle}
          style={{
            ...monoStyle,
            color: audioMuted ? 'var(--j-text-dim)' : 'var(--j-cyan)',
            background: 'none',
            border: '1px solid var(--j-border)',
            padding: '3px 8px',
            cursor: 'pointer',
            fontFamily: 'var(--j-font-mono)',
            fontSize: 9,
            letterSpacing: '0.08em',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          aria-label={audioMuted ? 'Enable audio' : 'Mute audio'}
        >
          {audioMuted ? '[ AUDIO: OFF ]' : '[ AUDIO: ON ]'}
        </button>
        <span style={labelStyle}>v2.1.0</span>
        {!isMobile && <CornerBracket position="br" />}
      </div>

      {/* ── CENTER-TOP — Thin line + protocol name ─────────────── */}
      {!isMobile && (
        <div
          style={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            opacity: isVisible ? 0.75 : 0,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            transition: 'opacity 0.6s ease',
          }}
        >
          <div
            style={{
              width: '30vw',
              height: 1,
              background: 'var(--j-border)',
            }}
          />
          <span style={{ ...monoStyle, color: 'var(--j-text-dim)', fontSize: 10 }}>
            RUNNING PROTOCOL: {currentProtocol}
          </span>
        </div>
      )}
    </div>
  );
};

export default HudFrame;
