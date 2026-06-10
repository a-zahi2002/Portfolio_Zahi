// Cyber Terminal — HUD Corners
// Reusable corner bracket component for panels and cards.

import React from 'react';

export const HudCorners: React.FC = () => {
  return (
    <div className="hud-corners absolute inset-0 pointer-events-none z-30">
      <div className="hud-corner tl" />
      <div className="hud-corner tr" />
      <div className="hud-corner bl" />
      <div className="hud-corner br" />
    </div>
  );
};
