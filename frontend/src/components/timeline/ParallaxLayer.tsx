import { ReactNode } from "react";

interface ParallaxLayerProps {
  offset: number;
  className?: string;
  children: ReactNode;
}

const ParallaxLayer = ({ offset, className = "", children }: ParallaxLayerProps) => {
  return (
    <div
      className={className}
      style={{
        transform: `translateX(${offset}px)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxLayer;