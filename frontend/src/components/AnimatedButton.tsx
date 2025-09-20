"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import Link from "next/link";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  href?: string;
}

export default function AnimatedButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  href,
}: AnimatedButtonProps) {
  const baseClasses = `
    relative inline-flex items-center justify-center font-semibold 
    rounded-lg transition-all duration-300 overflow-hidden group
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600 to-purple-600 text-white
      hover:from-blue-700 hover:to-purple-700
      focus:ring-blue-500 shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-gradient-to-r from-gray-600 to-gray-700 text-white
      hover:from-gray-700 hover:to-gray-800
      focus:ring-gray-500 shadow-lg hover:shadow-xl
    `,
    outline: `
      border-2 border-blue-600 text-blue-600 bg-transparent
      hover:bg-blue-50 focus:ring-blue-500
    `,
  };

  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;

  const ButtonContent = () => (
    <>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ease-out" />

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500 scale-110" />

      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      </div>

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={buttonClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <ButtonContent />
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <ButtonContent />
    </motion.button>
  );
}

// Preset button variants for common use cases
export function PrimaryButton({
  children,
  ...props
}: Omit<AnimatedButtonProps, "variant">) {
  return (
    <AnimatedButton variant="primary" {...props}>
      {children}
    </AnimatedButton>
  );
}

export function SecondaryButton({
  children,
  ...props
}: Omit<AnimatedButtonProps, "variant">) {
  return (
    <AnimatedButton variant="secondary" {...props}>
      {children}
    </AnimatedButton>
  );
}

export function OutlineButton({
  children,
  ...props
}: Omit<AnimatedButtonProps, "variant">) {
  return (
    <AnimatedButton variant="outline" {...props}>
      {children}
    </AnimatedButton>
  );
}

// Special gradient buttons with unique effects
export function GradientButton({
  children,
  gradient = "from-blue-500 to-purple-600",
  href,
  ...props
}: AnimatedButtonProps & { gradient?: string }) {
  const buttonClasses = `
    relative inline-flex items-center justify-center px-8 py-3 
    font-semibold text-white rounded-lg transition-all duration-300 
    overflow-hidden group focus:outline-none focus:ring-2 
    focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-2xl
    bg-gradient-to-r ${gradient}
    ${props.className || ""}
  `;

  const ButtonContent = () => (
    <>
      {/* Animated overlay gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.3 }}
        transition={{ duration: 0.5 }}
      />

      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} blur-xl`}
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 0.4, scale: 1.1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Shimmer animation */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </>
  );

  // If href is provided, use Link for navigation
  if (href) {
    return (
      <Link href={href}>
        <motion.a
          className={buttonClasses}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <ButtonContent />
        </motion.a>
      </Link>
    );
  }

  // Otherwise, use button for click handling
  return (
    <motion.button
      onClick={props.onClick}
      disabled={props.disabled}
      className={buttonClasses}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <ButtonContent />
    </motion.button>
  );
}
