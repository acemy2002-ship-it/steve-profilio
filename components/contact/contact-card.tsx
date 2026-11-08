import type { ReactNode } from "react";
import { SocialIcon } from "react-social-icons";
import { ContactCardCtas } from "./contact-card-ctas";
import { FadeIn } from "@/components/ui/motion-primitives";
import { ShaderFlow } from "../shaders/shader-flow";

const CARD_FADE_MASK =
  "radial-gradient(ellipse 90% 110% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0.15) 100%)";

export function ContactCard(): ReactNode {
  return (
    <section className="mx-auto my-12 w-full max-w-275 px-6 sm:my-20 sm:px-10">
      <FadeIn>
        <div className="border-foreground/8 bg-background relative w-full overflow-hidden rounded-4xl border p-1.5 shadow-sm">
          <div className="relative w-full overflow-hidden rounded-[1.6rem]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-45 dark:opacity-25"
              style={{
                WebkitMaskImage: CARD_FADE_MASK,
                maskImage: CARD_FADE_MASK,
              }}
            >
              <ShaderFlow scale={3} brightness={3} />
            </div>

            <div className="relative grid gap-8 p-6 sm:gap-10 sm:p-7 md:grid-cols-[1.2fr_1fr] md:items-stretch md:gap-6 md:p-6">
              <div className="flex flex-col gap-5">
                <h2 className="text-foreground font-serif text-[2.25rem] leading-[1.05] font-medium tracking-tight sm:text-[2.75rem] lg:text-[3.25rem]">
                  Let&rsquo;s connect
                </h2>
                <p className="text-foreground/65 mb-6 max-w-[29ch] text-[18px] leading-[1.4] tracking-tight sm:text-[22px]">
                  I&rsquo;m always open to discussing new projects, creative
                  ideas, or opportunities to be part of your visions. Just reach
                  out!
                </p>
                <ContactCardCtas />
              </div>

              <div className="border-foreground/8 bg-background flex flex-col items-center justify-center gap-6 rounded-[1.1rem] border p-6 sm:p-8">
                <div className="flex items-center gap-3 opacity-75">
                  <SocialIcon
                    network="github"
                    url="https://github.com/acemy2002-ship-it"
                  />
                  <SocialIcon
                    network="facebook"
                    url="https://www.facebook.com/mai.steve.36/"
                  />
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="text-foreground/70 text-[13px] tracking-tight">
                    2026 &copy; Built with Next.js
                  </p>
                  <p className="text-foreground/45 text-[12px] tracking-tight">
                    By AceMy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
