"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Card3DProps {
  children: ReactNode;
  className?: string;
}

export default function Card3D({ children, className = "" }: Card3DProps) {
  return (
    <div className="perspective-1000" style={{ perspective: "1000px" }}>
      <motion.div
        className={`
          bg-white rounded-xl shadow-lg p-6 cursor-pointer
          ${className}
        `}
        initial={{
          rotateX: 0,
          rotateY: 0,
          scale: 1,
        }}
        whileHover={{
          rotateX: -8,
          rotateY: 8,
          scale: 1.05,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        }}
        whileTap={{
          scale: 0.98,
          transition: {
            duration: 0.1,
          },
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Example usage component
export function ExampleCard3D() {
  return (
    <Card3D className="max-w-sm mx-auto">
      <div className="space-y-4">
        <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl font-bold">3D Card</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Interactive 3D Card
        </h3>
        <p className="text-gray-600">
          Hover over this card to see the smooth 3D rotation and scaling effect.
        </p>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Click Me
        </button>
      </div>
    </Card3D>
  );
}

// Advanced 3D card with custom tilt angles
export function AdvancedCard3D({
  children,
  className = "",
  tiltX = -10,
  tiltY = 10,
  scale = 1.08,
  duration = 0.4,
}: Card3DProps & {
  tiltX?: number;
  tiltY?: number;
  scale?: number;
  duration?: number;
}) {
  return (
    <div className="perspective-1000" style={{ perspective: "1000px" }}>
      <motion.div
        className={`
          bg-white rounded-2xl shadow-xl p-8 cursor-pointer
          border border-gray-100 relative overflow-hidden
          ${className}
        `}
        initial={{
          rotateX: 0,
          rotateY: 0,
          scale: 1,
        }}
        whileHover={{
          rotateX: tiltX,
          rotateY: tiltY,
          scale: scale,
          transition: {
            duration: duration,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        }}
        whileTap={{
          scale: 0.95,
          transition: {
            duration: 0.1,
          },
        }}
        style={{
          transformStyle: "preserve-3d",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
          }}
          whileHover={{
            opacity: 1,
            x: ["-100%", "100%"],
            transition: {
              duration: 0.6,
              ease: "easeInOut",
            },
          }}
        />

        <div className="relative z-20">{children}</div>
      </motion.div>
    </div>
  );
}
