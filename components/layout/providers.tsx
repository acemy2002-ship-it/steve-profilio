"use client";

import { ReducedMotionProvider } from "@/lib/motion";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { useRef } from "react";
import Crosshair from "../Crosshair";
import LightRays from "@/components/LightRays";

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
          <div ref={containerRef} className="relative z-0 min-h-screen overflow-x-hidden">
            <Crosshair
              containerRef={containerRef}
              color="#ffffff"
              targetEffect="lock"
              thickness={1}
              opacity={0.85}
              smoothing={0.35}
              showCoordinates
              lineStyle="solid"
              blendMode="normal"
              gap={0}
              fade={0}
              clickPulse
              hideCursor={false}
            />
            {children}
            <div aria-hidden="true" className="absolute bottom-0 left-0 h-2000 w-full -z-10">
              <LightRays
                raysOrigin="bottom-center"
                raysColor="#7FE3FF"
                raysSpeed={0.5}
                lightSpread={1}
                rayLength={3}
                glow={0.6}
                haze={0.5}
                followMouse={false}
                mouseInfluence={0.1}
                rayDensity={0.8}
                tilt={0}
                raySharpness={0.5}
                atmosphere={0.7}
                intensity={1}
                fadeDistance={1}
                saturation={1}
                noiseAmount={0}
                distortion={0.12}
                pulsating={false}
                cursorShadow={false}
                clickPulse={false}
                intro={false}
                lightMode={false}
              />
            </div>
          </div>
        </SmoothScroll>
      </ReducedMotionProvider>
    </ThemeProvider>
  );
}
