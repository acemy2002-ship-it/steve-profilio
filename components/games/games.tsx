import { ArrowRight, Smartphone, Monitor } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { Image } from "@unpic/react";
import Link from "next/link";
import { OrbButton } from "@/components/ui/orb-button";

import { FadeIn } from "@/components/ui/motion-primitives";
import FlipCard from "../FlipCard";
import AnimatedContent from "../AnimatedContent";

type Game = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  iconLabel: string;
  image: string;
  clickLabel: string;
  link: string;
  imageAlt: string;
  status: string;
};

const GAMES: Game[] = [
  {
    id: "valorant",
    icon: Monitor,
    iconLabel: "VALORANT",
    image:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794409231/39dc66a4fbaa85dcd12a49f216b60ead.avif",

    clickLabel: "View",
    link: "/game/valorant",
    imageAlt: "Loom AI writing companion mockup",
    status: "Currently Playing",
  },
  {
    id: "cs2",
    icon: Monitor,
    iconLabel: "Counter strike 2",
    image:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794409229/5c7218fb96e67ec06e225ca60bdb8d46.avif",

    clickLabel: "View",
    link: "https://store.steampowered.com/app/730/CounterStrike_2/",
    imageAlt: "Atlas Studio brand and product sprint mockup",
    status: "Currently Playing",
  },
  {
    id: "rok",
    icon: Smartphone,
    iconLabel: "Rise of Kingdoms",
    image:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794409228/ac24847dc3fae188318672675d1a19da.avif",

    clickLabel: "View",
    link: "https://play.google.com/store/apps/details?id=com.king.rok",
    imageAlt: "Rhythm calm analytics mockup",
    status: "Currently Playing",
  },
  {
    id: "gtasa",
    icon: Monitor,
    iconLabel: "GTA San Andreas",
    image:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794409226/558ac9f78ff06ec64cf754bfaded5acb.avif",
    clickLabel: "View",
    link: "https://www.rockstargames.com/sanandreas",
    imageAlt: "GTA San Andreas game mockup",

    status: "A long time ago",
  },
  {
    id: "gtavc",
    icon: Monitor,
    iconLabel: "GTA Vice City",
    image:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794409225/5fd5a9740371ea143057ceba4e8e5518.avif",
    clickLabel: "View",
    link: "https://www.rockstargames.com/vicecity",
    imageAlt: "GTA Vice City game mockup",
    status: "A long time ago",
  },
  {
    id: "codm",
    icon: Smartphone,
    iconLabel: "Call of Duty: Mobile",
    image:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794409222/6312976df17ebf1e990bcc45adc13b51.avif",
    clickLabel: "View",
    link: "https://www.callofduty.com/mobile",
    imageAlt: "Call of Duty: Mobile game mockup",
    status: "A long time ago",
  },
  {
    id: "rdr2",
    icon: Monitor,
    iconLabel: "Red Dead Redemption 2",
    image:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794409221/d1139b1ee12965f315652a3eb970aa28.avif",
    clickLabel: "View",
    link: "https://www.rockstargames.com/rdr2",
    imageAlt: "Red Dead Redemption 2 game mockup",
    status: "A long time ago",
  },
  {
    id: "aov",
    icon: Smartphone,
    iconLabel: "Arena of Valor",
    image:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794409219/80538e693a09a3efe93a42adf6f5d36d.avif",
    clickLabel: "View",
    link: "https://www.rockstargames.com/rdr2",
    imageAlt: "Red Dead Redemption 2 game mockup",
    status: "A long time ago",
  },
  {
    id: "fh5",
    icon: Monitor,
    iconLabel: "Froza Horizon 5",
    image:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794409217/cb6fe35de2c4cdbf039ed2cb56ca58ad.avif",
    clickLabel: "View",
    link: "https://www.rockstargames.com/rdr2",
    imageAlt: "Red Dead Redemption 2 game mockup",
    status: "A long time ago",
  },
];

export type GamesProps = {
  withHeadline?: boolean;
  viewMoreVisible?: boolean;
};

export function Games({ withHeadline = false }: GamesProps): ReactNode {
  const items = GAMES;

  return (
    <AnimatedContent
      distance={0}
      direction="vertical"
      duration={0.9}
      ease="expo"
      delay={0.3}
      once={false}
      wipe="up"
      blur={6}
      stagger={0.08}
      threshold={0.1}
    >
      <section className="relative w-full">
        <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
          {withHeadline && (
            <FadeIn className="flex flex-col items-center gap-5 pt-12 pb-10 text-center sm:pt-20 sm:pb-14">
              <h2 className="text-foreground font-serif text-[2.5rem] leading-[1.05] font-medium tracking-tight md:text-[3rem] lg:text-[3.5rem]">
                I&apos;m currently playing fps games, but here are a few of my
                favorite games.
              </h2>

              <p className="text-foreground/65 max-w-[40ch] text-[18px] leading-[1.45] tracking-tight sm:text-[20px]">
                From playful experiments to many games, a look at the
                achievements that have shaped my journey.
              </p>
            </FadeIn>
          )}

          <div className="columns-1 gap-6 md:columns-2 md:gap-7 lg:columns-3">
            {items.map((game, index) => {
              const Icon = game.icon;

              return (
                <FadeIn
                  key={game.id}
                  delay={index * 0.08}
                  className="mb-6 break-inside-avoid px-2 md:mb-7"
                >
                  <FlipCard
                    front={
                      <div className="relative h-full w-full overflow-hidden">
                        <Image
                          src={game.image}
                          alt={game.imageAlt}
                          layout="fullWidth"
                          className="absolute inset-0 h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/20" />

                        <div className="absolute top-5 left-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-white backdrop-blur-md">
                          <Icon className="h-4 w-4" />
                        </div>

                        <div className="absolute right-5 bottom-5 left-5">
                          <p className="mb-2 text-[10px] font-medium tracking-[0.2em] text-white/65 uppercase">
                            {game.status}
                          </p>

                          <h3 className="text-xl font-semibold text-white capitalize sm:text-2xl">
                            {game.iconLabel}
                          </h3>
                        </div>

                        <div className="absolute top-5 right-5 text-white/70">
                          <ArrowRight className="h-4 w-4 rotate-45" />
                        </div>
                      </div>
                    }
                    axis="y"
                    flipOnClick={false}
                    draggable={false}
                    dragDistance={0}
                    tilt
                    tiltMax={8}
                    glare
                    glareOpacity={0.15}
                    hoverScale={1.02}
                    perspective={1100}
                    stiffness={170}
                    damping={20}
                    width={500}
                    height={400}
                    radius={20}
                    background="#27272a"
                    color="#171717"
                    shadow
                    shadowColor="#00F"
                    shadowOpacity={0.22}
                  />

                  {game.clickLabel && (
                    <Link href={game.link}>
                      <OrbButton size="sm" className="mt-2">
                        {game.clickLabel}
                      </OrbButton>
                    </Link>
                  )}
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </AnimatedContent>
  );
}
