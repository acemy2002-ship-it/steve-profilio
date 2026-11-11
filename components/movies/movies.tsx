import type { ReactNode } from "react";
import { MorphoTextFlip } from "@/components/ui/morphotextflip";
import { MediaCard, MediaCardItem } from "../ui/media-card";
import AnimatedContent from "../AnimatedContent";

type Movie = {
  id: number;
  alt: string;
  name: string;
  type: string;
  defaultSrc: string;
};

const MOVIES: Movie[] = [
  {
    id: 1,
    name: "Game of Thrones",
    alt: "got",
    type: "Sci-Fi & Fantasy, Drama, and Action & Adventure",
    defaultSrc:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794410608/121361-4.avif",
  },
  {
    id: 2,
    name: "Stranger Things ",
    alt: "st",
    type: "Action & Adventure, Mystery, and Sci-Fi & Fantasy",
    defaultSrc:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794410607/305288-4.avif",
  },
  {
    id: 3,
    name: "All of Us Are Dead ",
    alt: "aoud",
    type: "Action & Adventure, Drama, and Sci-Fi & Fantasy",
    defaultSrc:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794410605/61ed2bad7e051.avif",
  },
  {
    id: 4,
    name: "The Last of Us ",
    alt: "tlou",
    type: "Drama",
    defaultSrc:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794410604/6362e8b41ca10.avif",
  },
  {
    id: 5,
    name: "The Boys",
    alt: "tb",
    type: "Sci-Fi & Fantasy and Action & Adventure",
    defaultSrc:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794410600/5c5c402b075cc.avif",
  },
  {
    id: 6,
    name: "Marvel's The Punisher ",
    alt: "mp",
    type: "Action & Adventure, Crime, and Drama",
    defaultSrc:
      "https://res.cloudinary.com/uyecgpkd/image/upload/v1794410602/331980-3.avif",
  },
];

export function Movies(): ReactNode {
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
      {" "}
      <section className="flex flex-col items-center justify-center gap-20 px-2">
        <div className="flex flex-col items-center justify-center gap-3">
          <h2 className="text-foreground font-serif text-[2.5rem] leading-[1.05] font-medium tracking-tight md:text-[3rem] lg:text-[3.5rem]">
            I aslo like watching
          </h2>
          <MorphoTextFlip
            words={[
              "action",
              "adventure",
              "horror",
              "school",
              "science fiction",
            ]}
            textClassName="text-4xl md:text-5xl text-foreground font-bold"
            animationType="flipY"
          />
          <h2 className="text-foreground font-serif text-[2.5rem] leading-[1.05] font-medium tracking-tight md:text-[3rem] lg:text-[3.5rem]">
            Movies
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-5 self-center">
          {MOVIES.map((movie) => (
            <div key={movie.id} className="flex flex-col gap-3">
              <MediaCard marqueeClassName="bg-background/50 text-white">
                <MediaCardItem
                  src={movie.defaultSrc}
                  alt={movie.alt}
                  title={movie.type}
                  type="image"
                  className="w-full max-w-sm md:max-w-xs"
                />
              </MediaCard>
              <div>
                <h3 className="text-2xl font-bold">{movie.name}</h3>
                <p className="text-muted-foreground text-sm">{movie.type}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AnimatedContent>
  );
}
