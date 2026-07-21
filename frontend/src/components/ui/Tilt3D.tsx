"use client";

import { useRef, useState, type ReactNode, type CSSProperties } from "react";

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees */
  max?: number;
  /** Show a moving light glare that follows the cursor */
  glare?: boolean;
  style?: CSSProperties;
}

/**
 * Interactive 3D tilt wrapper. Tilts its children toward the cursor with a
 * subtle lift + optional light glare. Pointer-driven, so it stays idle
 * (zero cost) until hovered, and resets smoothly on leave.
 */
export default function Tilt3D({ children, className, max = 12, glare = false, style }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)");
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, o: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rotY = (px - 0.5) * max * 2;
    const rotX = (0.5 - py) * max * 2;
    setTransform(`perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.03)`);
    if (glare) setGlarePos({ x: px * 100, y: py * 100, o: 0.28 });
  };

  const handleLeave = () => {
    setTransform("perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)");
    setGlarePos((g) => ({ ...g, o: 0 }));
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform,
        transformStyle: "preserve-3d",
        transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform",
        position: "relative",
        ...style,
      }}
    >
      {children}
      {glare && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.5), transparent 45%)`,
            opacity: glarePos.o,
            transition: "opacity 0.3s ease",
            mixBlendMode: "soft-light",
            zIndex: 3,
          }}
        />
      )}
    </div>
  );
}
