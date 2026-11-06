import type { ReactNode } from "react";
import FuzzyText from "@/components/FuzzyText";

export default function NotFoundPage(): ReactNode {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8 text-center h-screen">
      <FuzzyText
        colorSplit={0}
        trigger="hover"
        direction="horizontal"
        baseIntensity={0.2}
        hoverIntensity={0.5}
        fuzzRange={30}
        sliceSize={1}
        fps={60}
        transitionDuration={0}
        intro
        introDuration={1400}
        letterSpacing={0}
        enableHover
        clickEffect={false}
        glitchMode={false}
        glitchInterval={2000}
        glitchDuration={200}
      >
        404 Not Found
      </FuzzyText>
    </main>
  );
}
