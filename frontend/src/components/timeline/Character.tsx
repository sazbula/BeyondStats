import { useEffect, useState } from "react";

interface CharacterProps {
  isWalking: boolean;
  era: "past" | "early" | "mid" | "modern";
}

const Character = ({ isWalking, era }: CharacterProps) => {
  const [legPhase, setLegPhase] = useState(0);
  
  useEffect(() => {
    if (!isWalking) return;
    
    const interval = setInterval(() => {
      setLegPhase(p => (p + 1) % 4);
    }, 150);
    
    return () => clearInterval(interval);
  }, [isWalking]);

  // Era-based outfit colors
  const outfitColors = {
    past: { primary: "#8B7355", secondary: "#D4C4B0" },
    early: { primary: "#9B7B8E", secondary: "#E8D5DC" },
    mid: { primary: "#6B8E7B", secondary: "#C5D8CE" },
    modern: { primary: "#5B7B9B", secondary: "#C5D5E8" },
  };

  const colors = outfitColors[era];
  
  // Leg positions for walking animation
  const legPositions = [
    { left: -2, right: 2 },
    { left: 0, right: 0 },
    { left: 2, right: -2 },
    { left: 0, right: 0 },
  ];
  
  const currentLeg = legPositions[legPhase];

  return (
    <svg
      width="32"
      height="48"
      viewBox="0 0 32 48"
      className={`character ${isWalking ? "character-walking" : ""}`}
    >
      {/* Shadow */}
      <ellipse
        cx="16"
        cy="46"
        rx="8"
        ry="2"
        fill="rgba(0,0,0,0.15)"
      />
      
      {/* Left leg */}
      <rect
        x={11 + currentLeg.left}
        y="32"
        width="4"
        height="12"
        rx="2"
        fill={colors.primary}
      />
      
      {/* Right leg */}
      <rect
        x={17 + currentLeg.right}
        y="32"
        width="4"
        height="12"
        rx="2"
        fill={colors.primary}
      />
      
      {/* Body */}
      <rect
        x="9"
        y="18"
        width="14"
        height="16"
        rx="4"
        fill={colors.secondary}
      />
      
      {/* Arms */}
      <rect
        x="5"
        y="20"
        width="4"
        height="10"
        rx="2"
        fill={colors.primary}
        style={{
          transform: `rotate(${isWalking ? (legPhase % 2 === 0 ? -15 : 15) : 0}deg)`,
          transformOrigin: "7px 20px",
        }}
      />
      <rect
        x="23"
        y="20"
        width="4"
        height="10"
        rx="2"
        fill={colors.primary}
        style={{
          transform: `rotate(${isWalking ? (legPhase % 2 === 0 ? 15 : -15) : 0}deg)`,
          transformOrigin: "25px 20px",
        }}
      />
      
      {/* Head */}
      <circle
        cx="16"
        cy="10"
        r="8"
        fill="#F5E6D3"
      />
      
      {/* Hair */}
      <ellipse
        cx="16"
        cy="6"
        rx="7"
        ry="4"
        fill="#5C4033"
      />
      
      {/* Eyes */}
      <circle cx="13" cy="10" r="1.5" fill="#3D2914" />
      <circle cx="19" cy="10" r="1.5" fill="#3D2914" />
      
      {/* Smile */}
      <path
        d="M13 13 Q16 15 19 13"
        stroke="#3D2914"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Character;