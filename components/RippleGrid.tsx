import React from 'react';

interface RippleGridProps {
  enableRainbow?: boolean;
  gridColor?: string;
  rippleIntensity?: number;
  gridSize?: number;
  gridThickness?: number;
  mouseInteraction?: boolean;
  mouseInteractionRadius?: number;
  opacity?: number;
}

const RippleGrid: React.FC<RippleGridProps> = ({ children }) => {
  return <div className="w-full h-full absolute inset-0 bg-black/50 z-0">{children}</div>;
};

export default RippleGrid;
