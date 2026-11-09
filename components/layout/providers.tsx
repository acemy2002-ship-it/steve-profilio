"use client";

import { ReducedMotionProvider } from "@/lib/motion";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { useRef } from "react";
import Crosshair from "../Crosshair";


export function Providers({ children }: { children: ReactNode }): ReactNode {
  const containerRef = useRef(null);
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReducedMotionProvider>
        <SmoothScroll>
          <div
            ref={containerRef}
            className="relative z-0 min-h-screen overflow-x-hidden"
          >
            <Crosshair
              containerRef={containerRef}
              color="#00F"
              targetEffect="lock"
              thickness={0.3}
              opacity={0.85}
              smoothing={0.35}
              showCoordinates={false}
              lineStyle="solid"
              blendMode="normal"
              gap={0}
              fade={0}
              clickPulse
              hideCursor={false}
            />
            {children}
          </div>
        </SmoothScroll>
      </ReducedMotionProvider>
    </ThemeProvider>
  );
}
