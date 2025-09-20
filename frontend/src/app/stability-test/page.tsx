"use client";

import Hero from "@/components/Hero";

export default function StabilityTest() {
  return (
    <div>
      <h1 className="text-center p-4 text-2xl font-bold">
        Hero Component Stability Test
      </h1>
      <p className="text-center p-2 text-gray-600">
        This page tests the Hero component for stable animations and no random
        re-renders
      </p>
      <Hero />
    </div>
  );
}
