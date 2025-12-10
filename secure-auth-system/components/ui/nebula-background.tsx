"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface Star {
  id: number;
  top: string;
  left: string;
  width: string;
  height: string;
  opacity: number;
  animationDuration: string;
}

export function NebulaBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Star[]>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const starsX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const starsY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);

  const cloudsX = useTransform(smoothX, [-0.5, 0.5], [-50, 50]);
  const cloudsY = useTransform(smoothY, [-0.5, 0.5], [-50, 50]);

  const spotX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const spotY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);

  useEffect(() => {
    // Increased star count to 150 for a richer galaxy feel
    const generatedStars = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 2}px`, // Keep small size for realism
      height: `${Math.random() * 2}px`,
      // Maintained requested brightness range (0.3 to 0.8)
      opacity: Math.random() * 0.5 + 0.3,
      animationDuration: `${Math.random() * 3 + 2}s`,
    }));
    setStars(generatedStars);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;

      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 w-full h-full overflow-hidden bg-[#030014] -z-50"
    >
      {/* Base Gradient Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030014] to-[#030014]" />

      {/* Layer 1: Stars */}
      <motion.div
        style={{ x: starsX, y: starsY }}
        className="absolute inset-0 opacity-70"
      >
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: star.width,
              height: star.height,
              opacity: star.opacity,
              animationDuration: star.animationDuration,
              boxShadow: `0 0 ${parseFloat(star.width) * 2}px ${
                parseFloat(star.width) / 2
              }px rgba(255, 255, 255, 0.3)`,
            }}
          />
        ))}
      </motion.div>

      {/* Layer 2: Nebula Clouds */}
      <motion.div
        style={{ x: cloudsX, y: cloudsY }}
        className="absolute inset-0"
      >
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/30 blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute top-[30%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-blue-600/30 blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute bottom-[10%] left-[30%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/30 blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
      </motion.div>

      {/* Layer 3: Interactive Spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              800px circle at ${spotX} ${spotY},
              rgba(99, 102, 241, 0.15),
              transparent 80%
            )
          `,
        }}
      />
    </div>
  );
}
