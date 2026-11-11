import { MusicPlayer, Track } from "../ui/music-player";
import { MorphoTextFlip } from "@/components/ui/morphotextflip";
import AnimatedContent from "../AnimatedContent";

const queue: Track[] = [
  {
    id: "1",
    title: "Mùa Mưa Âý",
    artist: "Vũ",
    album: "",
    artwork: "/assets/muamuaay.jpg",
    duration: 228,
    url: "/assets/Muamuaay.mp3",
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
    url: "/assets/Cause-i-love-u.mp3",
  },
  {
    id: "4",
    title: "Soledad",
    artist: "Westlife",
    album: "",
    artwork: "/assets/soledad.jpg",
    duration: 219,
    url: "/assets/Soledad.mp3",
  },
  {
    id: "5",
    title: "In Another Life",
    artist: "Katy Perry",
    album: "The One That You Got Away",
    artwork: "/assets/in-another-life.jpg",
    duration: 219,
    url: "/assets/In-another-life.mp3",
  },
];

export default function RealAudio() {
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
    </AnimatedContent>
  );
}
