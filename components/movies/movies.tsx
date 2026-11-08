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
      "https://www.themoviedb.org/t/p/w600_and_h900_face/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
  },
  {
    id: 2,
    name: "Stranger Things ",
    alt: "st",
    type: "Action & Adventure, Mystery, and Sci-Fi & Fantasy",
    defaultSrc:
      "https://www.themoviedb.org/t/p/w600_and_h900_face/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
  },
  {
    id: 3,
    name: "All of Us Are Dead ",
    alt: "aoud",
    type: "Action & Adventure, Drama, and Sci-Fi & Fantasy",
    defaultSrc:
      "https://www.themoviedb.org/t/p/w600_and_h900_face/pTEFqAjLd5YTsMD6NSUxV6Dq7A6.jpg",
  },
  {
    id: 4,
    name: "The Last of Us ",
    alt: "tlou",
    type: "Drama",
    defaultSrc:
      "https://www.themoviedb.org/t/p/w600_and_h900_face/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg",
  },
  {
    id: 5,
    name: "The Boys",
    alt: "tb",
    type: "Sci-Fi & Fantasy and Action & Adventure",
    defaultSrc:
      "https://www.themoviedb.org/t/p/w600_and_h900_face/in1R2dDc421JxsoRWaIIAqVI2KE.jpg",
  },
  {
    id: 6,
    name: "Marvel's The Punisher ",
    alt: "mp",
    type: "Action & Adventure, Crime, and Drama",
    defaultSrc:
      "https://www.themoviedb.org/t/p/w600_and_h900_face/tM6xqRKXoloH9UchaJEyyRE9O1w.jpg",
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {MOVIES.map((movie) => (
            <div key={movie.id} className="flex flex-col gap-3">
              <MediaCard marqueeClassName="bg-background/50 text-white">
                <MediaCardItem
                  src={movie.defaultSrc}
                  alt={movie.alt}
                  title={movie.type}
                  type="image"
                  className="w-full max-w-sm"
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
