import React from 'react';

interface TowerIconProps {
  color?: string; // '#F16F52' or '#173D35'
  size?: number;
  className?: string;
  beacon?: boolean;
}

export const TowerIcon: React.FC<TowerIconProps> = ({
  color = '#F16F52',
  size = 48,
  className = '',
  beacon = true,
}) => {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 40 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none flex-shrink-0 ${className}`}
    >
      {/* Radio Wave Ripples */}
      <path
        d="M14 6 A 8 8 0 0 0 14 14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M26 6 A 8 8 0 0 1 26 14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M10 3 A 13 13 0 0 0 10 17"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
      <path
        d="M30 3 A 13 13 0 0 1 30 17"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />

      {/* Flashing Beacon on top */}
      {beacon && <circle cx="20" cy="8" r="2.2" fill={color} />}

      {/* Spire */}
      <line x1="20" y1="8" x2="20" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />

      {/* Upper Cross Arm */}
      <line x1="13" y1="17" x2="27" y2="17" stroke={color} strokeWidth="1.6" strokeLinecap="round" />

      {/* Main Mast Legs */}
      <line x1="20" y1="15" x2="9" y2="50" stroke={color} strokeWidth="1.8" />
      <line x1="20" y1="15" x2="31" y2="50" stroke={color} strokeWidth="1.8" />

      {/* Horizontal Struts */}
      <line x1="17" y1="23" x2="23" y2="23" stroke={color} strokeWidth="1.2" />
      <line x1="15" y1="31" x2="25" y2="31" stroke={color} strokeWidth="1.3" />
      <line x1="12" y1="40" x2="28" y2="40" stroke={color} strokeWidth="1.4" />
      <line x1="9.5" y1="49" x2="30.5" y2="49" stroke={color} strokeWidth="1.5" />

      {/* Cross Bracing X */}
      <line x1="17" y1="23" x2="25" y2="31" stroke={color} strokeWidth="1" />
      <line x1="23" y1="23" x2="15" y2="31" stroke={color} strokeWidth="1" />
      <line x1="15" y1="31" x2="28" y2="40" stroke={color} strokeWidth="1" />
      <line x1="25" y1="31" x2="12" y2="40" stroke={color} strokeWidth="1" />
      <line x1="12" y1="40" x2="30.5" y2="49" stroke={color} strokeWidth="1" />
      <line x1="28" y1="40" x2="9.5" y2="49" stroke={color} strokeWidth="1" />
    </svg>
  );
};
