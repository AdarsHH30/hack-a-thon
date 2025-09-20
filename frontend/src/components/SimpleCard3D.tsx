"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SimpleCard3DProps {
  children: ReactNode;
  className?: string;
}

export default function SimpleCard3D({
  children,
  className = "",
}: SimpleCard3DProps) {
  return (
    <div style={{ perspective: "1000px" }}>
      <motion.div
        className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer ${className}`}
        initial={{
          rotateX: 0,
          rotateY: 0,
          scale: 1,
        }}
        whileHover={{
          rotateX: -10,
          rotateY: 10,
          scale: 1.05,
          transition: {
            duration: 0.3,
            ease: "easeOut",
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
          transformOrigin: "center center",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
