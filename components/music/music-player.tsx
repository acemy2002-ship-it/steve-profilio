import { MusicPlayer, Track } from "../ui/music-player";

const sampleTrack: Track = {
  id: "1",
  title: "Blinding Lights",
  artist: "The Weeknd",
  artwork: "/path/to/artwork.jpg",
  duration: 200,
  url: "/Untitled.mp3", // local or remote URL
};

export default function RealAudio() {
  return <MusicPlayer currentTrack={sampleTrack} />;
}
