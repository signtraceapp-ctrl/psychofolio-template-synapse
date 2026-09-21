"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const BrainScene = dynamic(
  () => import("./brain-scene").then((mod) => mod.BrainScene),
  { ssr: false },
);

interface LazyBrainSceneProps {
  progressRef?: React.RefObject<number>;
}

export function LazyBrainScene({ progressRef }: LazyBrainSceneProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (reducedMotion) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(123,108,240,0.18), transparent 65%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return <BrainScene progressRef={progressRef} />;
}
