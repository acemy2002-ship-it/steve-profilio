import { ArrowRight, Smartphone, Monitor, EyeIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import StarBorder from "../StarBorder";

import { FadeIn } from "@/components/ui/motion-primitives";
import FlipCard from "../FlipCard";

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
      "https://i.pinimg.com/1200x/39/dc/66/39dc66a4fbaa85dcd12a49f216b60ead.jpg",

    clickLabel: "View",
    link: "https://playvalorant.com",
    imageAlt: "Loom AI writing companion mockup",
    status: "Currently Playing",
  },
  {
    id: "cs2",
    icon: Monitor,
    iconLabel: "COUNTER-STRIKE 2",
    image:
      "https://i.pinimg.com/1200x/5c/72/18/5c7218fb96e67ec06e225ca60bdb8d46.jpg",

    clickLabel: "View",
    link: "https://store.steampowered.com/app/730/CounterStrike_2/",
    imageAlt: "Atlas Studio brand and product sprint mockup",
    status: "Currently Playing",
  },
  {
    id: "rok",
    icon: Smartphone,
    iconLabel: "RISE OF KINGDOMS",
    image:
      "https://i.pinimg.com/1200x/3b/95/98/3b959897675e562433683b54f0a83f95.jpg",

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
      "https://i.pinimg.com/1200x/55/8a/c9/558ac9f78ff06ec64cf754bfaded5acb.jpg",
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
      "https://i.pinimg.com/736x/5f/d5/a9/5fd5a9740371ea143057ceba4e8e5518.jpg",
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
      "https://i.pinimg.com/1200x/62/73/86/6273861b81193778439d68dae7a26e71.jpg",
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
      "https://i.pinimg.com/736x/d1/13/9b/d1139b1ee12965f315652a3eb970aa28.jpg",
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
      "https://i.pinimg.com/736x/80/53/8e/80538e693a09a3efe93a42adf6f5d36d.jpg",
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
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {withHeadline && (
          <FadeIn className="flex flex-col items-center gap-5 pt-12 pb-10 text-center sm:pt-20 sm:pb-14">
            <h2 className="text-foreground font-serif text-[2.5rem] leading-[1.05] font-medium tracking-tight md:text-[3rem] lg:text-[3.5rem]">
              I&apos;m currently playing fps games, but here are a few of my
              favorite games.
            </h2>

            <p className="text-foreground/65 max-w-[40ch] text-[18px] leading-[1.45] tracking-tight sm:text-[20px]">
              From playful experiments to many games, a look at the achievements
              that have shaped my journey.
            </p>
          </FadeIn>
        )}

        <div className="columns-1 gap-6 md:columns-2 md:gap-7">
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
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-fill"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/20" />

                      <div className="absolute top-5 left-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-white backdrop-blur-md">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="absolute right-5 bottom-5 left-5">
                        <p className="mb-2 text-[10px] font-medium tracking-[0.2em] text-white/65 uppercase">
                          {game.status}
                        </p>

                        <h3 className="text-2xl font-semibold text-white capitalize sm:text-3xl">
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
                  shadowColor="#000000"
                  shadowOpacity={0.2}
                />

                {game.clickLabel && (
                  <Link
                    href={game.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <StarBorder
                      color="#ffcf8a"
                      trailColor="#ff4d2e"
                      duration={12}
                      direction="clockwise"
                      stars={2}
                      trailLength={0.45}
                      thickness={1}
                      radius={30}
                      glow={0.8}
                      hover="none"
                      sparkle
                      clickPulse={false}
                      theme="dark"
                      className="my-2"
                    > <EyeIcon className="h-4 w-4" />{game.clickLabel}</StarBorder>
                  </Link>
                )}
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
