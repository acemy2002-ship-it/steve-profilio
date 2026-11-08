import type { ReactNode } from "react";
import { ElectricText } from "@/components/ui/electric-text";

export default function NotFoundPage(): ReactNode {
  return (
    <main className="flex h-screen flex-1 flex-col items-center justify-center gap-6 px-4 py-8 text-center">
      <ElectricText
        color="#BB8A2C"
        showFill={false}
        speed={1}
        glowIntensity="high"
        chaos={1}
        strokeWidth={3}
        className="text-7xl font-bold"
      >
        404 Not Found
      </ElectricText>
    </main>
  );
}
