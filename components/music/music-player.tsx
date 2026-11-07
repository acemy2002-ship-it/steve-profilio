import { MusicPlayer, Track } from "../ui/music-player";
import { MorphoTextFlip } from "@/components/ui/morphotextflip";

const queue: Track[] = [
  {
    id: "1",
    title: "Soledad",
    artist: "Westlife",
    album: "",
    artwork: "/assets/soledad.jpg",
    duration: 219,
    url: "/assets/soledad.mp3",
  },
  {
    id: "2",
    title: "Thành Phố Phía Đông",
    artist: "Vương Bình",
    album: "Evolve",
    artwork: "/assets/tppd.jpg",
    duration: 222,
    url: "/assets/tppd.mp3",
  },
   {
    id: "3",
    title: "Cause I Love You",
    artist: "Noo Phước Thịnh",
    album: "",
    artwork: "/assets/causeiloveu.jpg",
    duration: 285,
    url: "/assets/Causeiloveu.mp3",
  },
];

export default function RealAudio() {
  return (
    <section className="flex flex-col items-center justify-center gap-20 px-2">
      <div className="flex flex-col items-center justify-center gap-3">
        <h2 className="text-foreground font-serif text-[2.5rem] leading-[1.05] font-medium tracking-tight md:text-[3rem] lg:text-[3.5rem]">
          Music make me feel
        </h2>
        <MorphoTextFlip
          words={["alive", "relax", "focus", "happy"]}
          textClassName="text-4xl md:text-5xl text-foreground font-bold"
          animationType="flipY"
        />
      </div>
      <MusicPlayer
        currentTrack={queue[0]!}
        queue={queue}
        currentIndex={0}
        autoPlay={false}
        className="rounded-xl"
      />
    </section>
  );
}
