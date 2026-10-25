import React from 'react';

export const NetworkHeaderSvg: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 460 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible select-none pointer-events-none ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
          <stop offset="0%" stopColor="#F16F52" stopOpacity="0.85" />
          <stop offset="85%" stopColor="#F16F52" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#F16F52" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hillGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A6E63" />
          <stop offset="100%" stopColor="#173D35" />
        </linearGradient>
        <linearGradient id="hillGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E4D43" />
          <stop offset="100%" stopColor="#102B25" />
        </linearGradient>
      </defs>

      {/* Sun / Radiating Disc */}
      <circle cx="340" cy="62" r="34" fill="#F16F52" fillOpacity="0.85" />
      <circle cx="340" cy="62" r="46" stroke="#F16F52" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="3 3" />
      <circle cx="340" cy="62" r="58" stroke="#F16F52" strokeWidth="0.75" strokeOpacity="0.2" strokeDasharray="4 4" />

      {/* Background Soft Mountain / Hill */}
      <path
        d="M200 120 C 240 95, 300 88, 360 92 C 400 94, 430 85, 460 78 L 460 120 Z"
        fill="#8CA397"
        fillOpacity="0.55"
      />

      {/* Distant City Skyline Silhouettes */}
      <rect x="345" y="70" width="12" height="50" fill="#2E544A" />
      <rect x="360" y="58" width="16" height="62" fill="#24453D" />
      <rect x="380" y="66" width="14" height="54" fill="#1C3831" />
      <rect x="396" y="52" width="18" height="68" fill="#173D35" />
      <rect x="416" y="72" width="12" height="48" fill="#24453D" />

      {/* Skyline Antenna mast on tall building */}
      <line x1="405" y1="52" x2="405" y2="38" stroke="#173D35" strokeWidth="1.5" />
      <circle cx="405" cy="37" r="1.5" fill="#F16F52" />

      {/* City windows tiny dots */}
      <circle cx="366" cy="68" r="1" fill="#D8DCC8" fillOpacity="0.6" />
      <circle cx="372" cy="68" r="1" fill="#D8DCC8" fillOpacity="0.6" />
      <circle cx="366" cy="76" r="1" fill="#D8DCC8" fillOpacity="0.6" />
      <circle cx="372" cy="76" r="1" fill="#D8DCC8" fillOpacity="0.6" />
      <circle cx="402" cy="60" r="1" fill="#D8DCC8" fillOpacity="0.6" />
      <circle cx="408" cy="60" r="1" fill="#D8DCC8" fillOpacity="0.6" />
      <circle cx="402" cy="68" r="1" fill="#D8DCC8" fillOpacity="0.6" />
      <circle cx="408" cy="68" r="1" fill="#D8DCC8" fillOpacity="0.6" />

      {/* Rolling Foreground Hills */}
      <path
        d="M180 120 C 220 102, 260 100, 310 106 C 360 112, 410 98, 460 92 L 460 120 Z"
        fill="url(#hillGrad1)"
      />
      <path
        d="M240 120 C 280 106, 350 108, 400 114 C 430 118, 450 116, 460 115 L 460 120 Z"
        fill="url(#hillGrad2)"
      />

      {/* Small transmission poles & connecting wires in midground */}
      {/* Pole 1 */}
      <line x1="225" y1="120" x2="225" y2="88" stroke="#173D35" strokeWidth="1.5" />
      <line x1="221" y1="92" x2="229" y2="92" stroke="#173D35" strokeWidth="1.2" />
      <line x1="222" y1="96" x2="228" y2="96" stroke="#173D35" strokeWidth="1.2" />

      {/* Pole 2 */}
      <line x1="285" y1="120" x2="285" y2="82" stroke="#173D35" strokeWidth="1.5" />
      <line x1="280" y1="86" x2="290" y2="86" stroke="#173D35" strokeWidth="1.2" />
      <line x1="281" y1="90" x2="289" y2="90" stroke="#173D35" strokeWidth="1.2" />

      {/* Connecting Wires */}
      <path d="M72 38 Q 150 78, 225 92" stroke="#173D35" strokeWidth="0.8" fill="none" opacity="0.65" />
      <path d="M225 92 Q 255 96, 285 86" stroke="#173D35" strokeWidth="0.8" fill="none" opacity="0.65" />
      <path d="M285 86 Q 355 94, 435 32" stroke="#173D35" strokeWidth="0.8" fill="none" opacity="0.65" />

      {/* Transmission Tower 1 (Left Prominent Tower - ISP A theme) */}
      <g transform="translate(60, 10)">
        {/* Beacon */}
        <circle cx="12" cy="2" r="2.5" fill="#F16F52" />
        <circle cx="12" cy="2" r="5" stroke="#F16F52" strokeWidth="0.8" opacity="0.5" />
        {/* Mast tip */}
        <line x1="12" y1="4" x2="12" y2="18" stroke="#173D35" strokeWidth="2" strokeLinecap="round" />
        {/* Lattice tower body */}
        <line x1="12" y1="18" x2="0" y2="110" stroke="#173D35" strokeWidth="2" />
        <line x1="12" y1="18" x2="24" y2="110" stroke="#173D35" strokeWidth="2" />
        {/* Horizontal & Diagonal Struts */}
        <line x1="8" y1="36" x2="16" y2="36" stroke="#173D35" strokeWidth="1.2" />
        <line x1="6" y1="56" x2="18" y2="56" stroke="#173D35" strokeWidth="1.4" />
        <line x1="4" y1="78" x2="20" y2="78" stroke="#173D35" strokeWidth="1.4" />
        <line x1="1" y1="102" x2="23" y2="102" stroke="#173D35" strokeWidth="1.5" />
        {/* X braces */}
        <line x1="8" y1="36" x2="18" y2="56" stroke="#173D35" strokeWidth="1" />
        <line x1="16" y1="36" x2="6" y2="56" stroke="#173D35" strokeWidth="1" />
        <line x1="6" y1="56" x2="20" y2="78" stroke="#173D35" strokeWidth="1" />
        <line x1="18" y1="56" x2="4" y2="78" stroke="#173D35" strokeWidth="1" />
        <line x1="4" y1="78" x2="23" y2="102" stroke="#173D35" strokeWidth="1.1" />
        <line x1="20" y1="78" x2="1" y2="102" stroke="#173D35" strokeWidth="1.1" />
        {/* Cross arms */}
        <line x1="2" y1="28" x2="22" y2="28" stroke="#173D35" strokeWidth="1.6" />
        {/* Broadcast wave arcs */}
        <path d="M3 0 A 14 14 0 0 0 3 8" stroke="#F16F52" strokeWidth="1.2" fill="none" opacity="0.8" />
        <path d="M-2 -3 A 20 20 0 0 0 -2 11" stroke="#F16F52" strokeWidth="1" fill="none" opacity="0.5" />
      </g>

      {/* Transmission Tower 2 (Right Prominent Tower - ISP B theme) */}
      <g transform="translate(422, 6)">
        {/* Beacon */}
        <circle cx="12" cy="2" r="2.5" fill="#173D35" />
        <circle cx="12" cy="2" r="5" stroke="#173D35" strokeWidth="0.8" opacity="0.5" />
        {/* Mast tip */}
        <line x1="12" y1="4" x2="12" y2="20" stroke="#173D35" strokeWidth="2" strokeLinecap="round" />
        {/* Lattice tower body */}
        <line x1="12" y1="20" x2="0" y2="114" stroke="#173D35" strokeWidth="2" />
        <line x1="12" y1="20" x2="24" y2="114" stroke="#173D35" strokeWidth="2" />
        {/* Cross Struts */}
        <line x1="8" y1="38" x2="16" y2="38" stroke="#173D35" strokeWidth="1.2" />
        <line x1="6" y1="60" x2="18" y2="60" stroke="#173D35" strokeWidth="1.4" />
        <line x1="4" y1="84" x2="20" y2="84" stroke="#173D35" strokeWidth="1.4" />
        <line x1="1" y1="106" x2="23" y2="106" stroke="#173D35" strokeWidth="1.5" />
        {/* X braces */}
        <line x1="8" y1="38" x2="18" y2="60" stroke="#173D35" strokeWidth="1" />
        <line x1="16" y1="38" x2="6" y2="60" stroke="#173D35" strokeWidth="1" />
        <line x1="6" y1="60" x2="20" y2="84" stroke="#173D35" strokeWidth="1" />
        <line x1="18" y1="60" x2="4" y2="84" stroke="#173D35" strokeWidth="1" />
        <line x1="4" y1="84" x2="23" y2="106" stroke="#173D35" strokeWidth="1.1" />
        <line x1="20" y1="84" x2="1" y2="106" stroke="#173D35" strokeWidth="1.1" />
        {/* Cross arms */}
        <line x1="2" y1="30" x2="22" y2="30" stroke="#173D35" strokeWidth="1.6" />
        {/* Broadcast wave arcs */}
        <path d="M21 0 A 14 14 0 0 1 21 8" stroke="#173D35" strokeWidth="1.2" fill="none" opacity="0.8" />
        <path d="M26 -3 A 20 20 0 0 1 26 11" stroke="#173D35" strokeWidth="1" fill="none" opacity="0.5" />
      </g>
    </svg>
  );
};
