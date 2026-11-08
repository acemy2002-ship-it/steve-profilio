"use client";
import React, {
  useId,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Repeat,
  Repeat1,
  Shuffle,
  Volume2,
  VolumeX,
  List,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  artwork: string;
  duration: number;
  url?: string;
}

export interface MusicPlayerProps {
  currentTrack?: Track;
  queue?: Track[];
  currentIndex?: number;
  className?: string;
  autoPlay?: boolean;
  showEqualizer?: boolean;
  /**
   * Color used for "active" states — playing waveform, shuffle/repeat/queue
   * toggles, active queue row. Defaults to the theme's foreground color so it
   * stays legible in both light and dark mode. Pass a hex/hsl value (e.g. a
   * neon accent) to brand it.
   */
  accentColor?: string;
  onPlayPause?: (isPlaying: boolean) => void;
  onTimeChange?: (time: number) => void;
  onTrackEnd?: () => void;
  onTrackChange?: (track: Track, index: number) => void;
  onVolumeChange?: (volume: number) => void;
}

const defaultTrack: Track = {
  id: "default",
  title: "Sample Track",
  artist: "Sample Artist",
  artwork:
    "https://images.unsplash.com/photo-1760925897293-feeaf8165324?q=80&w=800",
  duration: 180,
};

const morphTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

// Only the @keyframes — injected once into <head> below rather than as an
// inline <style> tag, so mounting N players doesn't create N duplicate
// <style> nodes.
const waveKeyframes = `
@keyframes nyxWave0 { 0%,100%{height:4px} 25%{height:14px} 50%{height:8px} 75%{height:12px} }
@keyframes nyxWave1 { 0%,100%{height:14px} 25%{height:8px} 50%{height:12px} 75%{height:4px} }
@keyframes nyxWave2 { 0%,100%{height:8px} 25%{height:12px} 50%{height:4px} 75%{height:14px} }
@keyframes nyxWave3 { 0%,100%{height:12px} 25%{height:4px} 50%{height:14px} 75%{height:8px} }
`;

// Lets the shared-layout play button (and anything else that needs it)
// animate with layoutId/whileTap while still being a real shadcn Button.
const MotionButton = motion.create(Button);

const WaveBars = ({
  playing,
  color = "currentColor",
  height = 14,
}: {
  playing: boolean;
  color?: string;
  height?: number;
}) => (
  <div className="flex items-end gap-0.5" style={{ height }} aria-hidden="true">
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        className="w-0.5 rounded-sm"
        style={{
          backgroundColor: color,
          height,
          animation: `nyxWave${i} 1s ease-in-out infinite`,
          animationDelay: `${i * 0.2}s`,
          animationPlayState: playing ? "running" : "paused",
        }}
      />
    ))}
  </div>
);

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" + sec : sec}`;
};

export const MusicPlayer = ({
  currentTrack,
  queue = [],
  currentIndex = 0,
  className = "",
  autoPlay = false,
  showEqualizer = true,
  accentColor = "var(--foreground)",
  onPlayPause,
  onTimeChange,
  onTrackEnd,
  onTrackChange,
  onVolumeChange,
}: MusicPlayerProps) => {
  const uid = useId();
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [mounted, setMounted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simTimeRef = useRef(0);
  const isDraggingProgressRef = useRef(false);
  const isDraggingVolumeRef = useRef(false);

  const track =
    queue.length > 0
      ? (queue[activeIndex] ?? currentTrack ?? defaultTrack)
      : (currentTrack ?? defaultTrack);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Inject the waveform keyframes once globally, regardless of how many
  // <MusicPlayer /> instances end up on the page.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("nyx-music-player-keyframes")) return;
    const style = document.createElement("style");
    style.id = "nyx-music-player-keyframes";
    style.textContent = waveKeyframes;
    document.head.appendChild(style);
  }, []);

  const hasAudio = !!track.url;
  const audioUrl = track.url;

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (audio && track.url) {
      if (audio.paused) {
        audio.play().catch(() => {});
        setIsPlaying(true);
        onPlayPause?.(true);
      } else {
        audio.pause();
        setIsPlaying(false);
        onPlayPause?.(false);
      }
    } else {
      setIsPlaying((p) => {
        onPlayPause?.(!p);
        return !p;
      });
    }
  }, [onPlayPause, track.url]);

  const resetTime = useCallback(() => {
    simTimeRef.current = 0;
    setCurrentTime(0);
  }, []);

  const handleTrackEnd = useCallback(() => {
    if (repeatMode === "one") {
      const audio = audioRef.current;
      if (audio && track.url) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
      resetTime();
      return;
    }
    if (repeatMode === "all" || activeIndex < queue.length - 1) {
      const next = activeIndex + 1 >= queue.length ? 0 : activeIndex + 1;
      setActiveIndex(next);
      resetTime();
      const nextTrack = queue[next];
      if (nextTrack) {
        onTrackChange?.(nextTrack, next);
      }
    } else {
      setIsPlaying(false);
    }
    onTrackEnd?.();
  }, [
    repeatMode,
    activeIndex,
    queue,
    track.url,
    onTrackChange,
    onTrackEnd,
    resetTime,
  ]);

  // Sync real audio element events when url-based playback is used
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const onTimeUpdate = () => {
      // Keep simTimeRef paired with currentTime everywhere — future logic
      // must never read one while the other is stale.
      simTimeRef.current = audio.currentTime;
      setCurrentTime(audio.currentTime);
      onTimeChange?.(audio.currentTime);
    };
    const onEnded = () => handleTrackEnd();
    const onLoadedMetadata = () => {
      if (isPlaying) audio.play().catch(() => {});
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [audioUrl, isPlaying, onTimeChange, handleTrackEnd]);

  // Sync volume to audio element
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      const ev = isMuted ? 0 : volume;
      audioRef.current.volume = ev / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted, audioUrl]);

  // Reset time when track changes
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.currentTime = 0;
    }
    if (!audioUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetTime();
    }
  }, [audioUrl, resetTime]);

  // Keyboard shortcuts — only active while the player itself has focus, so
  // the page can still scroll and text fields can still receive keys.
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      )
        return;
      const container = containerRef.current;
      if (
        !container ||
        !(target instanceof Node) ||
        !(container === target || container.contains(target))
      )
        return;
      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          setCurrentTime((p) => {
            const t = Math.max(0, p - 10);
            simTimeRef.current = t;
            if (audioRef.current && track.url) audioRef.current.currentTime = t;
            return t;
          });
          break;
        case "ArrowRight":
          e.preventDefault();
          setCurrentTime((p) => {
            const t = Math.min(track.duration, p + 10);
            simTimeRef.current = t;
            if (audioRef.current && track.url) audioRef.current.currentTime = t;
            return t;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume((p) => Math.min(100, p + 10));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume((p) => Math.max(0, p - 10));
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [track.duration, track.url, togglePlay]);

  // Time progression (only for simulated playback — real audio uses timeupdate event)
  useEffect(() => {
    if (!isPlaying || hasAudio) return;
    const interval = setInterval(() => {
      // Side effects (callbacks + track-end handling) stay outside the state
      // updater — updaters must be pure and StrictMode would double-run them.
      const next = simTimeRef.current + 1;
      if (simTimeRef.current >= track.duration) {
        handleTrackEnd();
        return;
      }
      simTimeRef.current = next;
      setCurrentTime(next);
      onTimeChange?.(next);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, hasAudio, track.duration, onTimeChange, handleTrackEnd]);

  const seekTo = useCallback(
    (clientX: number) => {
      if (!progressRef.current) return;
      const { left, width } = progressRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - left) / width));
      const t = Math.floor(track.duration * pct);
      simTimeRef.current = t;
      setCurrentTime(t);
      if (audioRef.current && track.url) {
        audioRef.current.currentTime = t;
      }
      onTimeChange?.(t);
    },
    [track.duration, track.url, onTimeChange]
  );

  // Pointer events (not click/mousemove) so scrubbing works with mouse,
  // touch, and pen alike, and so the thumb can actually be dragged instead
  // of only jumping to click position.
  const handleProgressPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingProgressRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    seekTo(e.clientX);
  };

  const handleProgressPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const { left, width } = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - left) / width));
    setHoverTime(Math.floor(track.duration * pct));
    if (isDraggingProgressRef.current) seekTo(e.clientX);
  };

  const handleProgressPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingProgressRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const toggleMute = () => {
    setIsMuted((m) => {
      onVolumeChange?.(m ? volume : 0);
      return !m;
    });
  };

  const seekVolumeFromClientY = useCallback(
    (clientY: number) => {
      if (!volumeRef.current) return;
      const { top, height } = volumeRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, 1 - (clientY - top) / height));
      const v = Math.round(pct * 100);
      setVolume(v);
      setIsMuted(v === 0);
      onVolumeChange?.(v);
    },
    [onVolumeChange]
  );

  const handleVolumePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingVolumeRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    seekVolumeFromClientY(e.clientY);
  };

  const handleVolumePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingVolumeRef.current) seekVolumeFromClientY(e.clientY);
  };

  const handleVolumePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingVolumeRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const toggleRepeat = () => {
    const modes: ("off" | "all" | "one")[] = ["off", "all", "one"];
    setRepeatMode(
      modes[(modes.indexOf(repeatMode) + 1) % modes.length] ?? "off"
    );
  };

  const skipTrack = (dir: "next" | "prev") => {
    if (!queue.length) return;
    let next: number;
    if (isShuffled && queue.length > 1) {
      // Exclude the current track so shuffle can't immediately repeat it.
      const candidates = queue
        .map((_, i) => i)
        .filter((i) => i !== activeIndex);
      next =
        candidates[Math.floor(Math.random() * candidates.length)] ??
        activeIndex;
    } else if (dir === "next") {
      next = (activeIndex + 1) % queue.length;
    } else {
      next = activeIndex === 0 ? queue.length - 1 : activeIndex - 1;
    }
    setActiveIndex(next);
    resetTime();
    onTrackChange?.(queue[next]!, next);
  };

  const selectFromQueue = (t: Track, i: number) => {
    setActiveIndex(i);
    resetTime();
    onTrackChange?.(t, i);
    setShowQueue(false);
  };

  const progress = useMemo(
    () => (track.duration ? (currentTime / track.duration) * 100 : 0),
    [currentTime, track.duration]
  );

  if (!mounted) return null;

  const effectiveVolume = isMuted ? 0 : volume;
  const repeatLabel =
    repeatMode === "one"
      ? "Repeat one"
      : repeatMode === "all"
        ? "Repeat all"
        : "Repeat off";

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Music player"
      tabIndex={0}
      className={cn("relative w-full max-w-120", className)}
    >
      {track.url && (
        <audio
          ref={audioRef}
          src={track.url}
          preload="metadata"
          className="hidden"
        />
      )}

      <MotionConfig transition={morphTransition}>
        <motion.div className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
            {isCollapsed ? (
              /* ===== Collapsed: compact pill bar ===== */
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                className="bg-card ring-border overflow-hidden rounded-2xl ring-1 backdrop-blur-2xl"
              >
                <div className="flex md:flex-row items-center gap-3 p-2.5">
                  {/* Thumbnail — morphs into artwork (wrapper fixes img layoutId distortion) */}
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setIsCollapsed(false)}
                    aria-label="Expand player"
                    className="ring-border relative h-12 w-12 shrink-0 overflow-hidden rounded-lg ring-1"
                  >
                    <motion.div
                      layoutId={`artwork-${uid}`}
                      transition={morphTransition}
                      className="absolute inset-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={track.artwork}
                        alt={track.title}
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  </motion.button>

                  {/* Title + artist — morphs into track info */}
                  <motion.button
                    layoutId={`track-info-${uid}`}
                    transition={morphTransition}
                    onClick={() => setIsCollapsed(false)}
                    aria-label="Expand player"
                    className="flex min-w-0 flex-1 flex-col text-left"
                  >
                    <span className="text-foreground flex items-center gap-2 truncate text-sm font-semibold">
                      <span className="truncate">{track.title}</span>
                      {isPlaying && showEqualizer && (
                        <span className="shrink-0">
                          <WaveBars
                            playing={isPlaying}
                            color={accentColor}
                            height={10}
                          />
                        </span>
                      )}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {track.artist}
                    </span>
                  </motion.button>

                  {/* Mini progress */}
                  <div className="flex items-center gap-2" aria-hidden="true">
                    <span className="text-muted-foreground/60 text-[10px] tabular-nums">
                      {formatTime(currentTime)}
                    </span>
                    <div className="bg-muted-foreground/15 h-1 w-12 overflow-hidden rounded-full">
                      <div
                        className="bg-foreground h-full rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Play/pause — morphs into dock play button */}
                  <MotionButton
                    layoutId={`play-btn-${uid}`}
                    transition={morphTransition}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    variant="ghost"
                    size="icon"
                    className="bg-primary-foreground text-primary ring-border hover:bg-primary-foreground/90 h-9 w-9 shrink-0 rounded-full ring-1"
                  >
                    {isPlaying ? (
                      <Pause className="fill-primary h-4 w-4" />
                    ) : (
                      <Play className="fill-primary ml-0.5 h-4 w-4" />
                    )}
                  </MotionButton>

                  {/* Expand */}
                  <MotionButton
                    whileTap={{ scale: 0.9 }}
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(false)}
                    aria-label="Expand player"
                    className="text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground h-8 w-8 shrink-0 rounded-full"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </MotionButton>
                </div>
              </motion.div>
            ) : (
              /* ===== Expanded: immersive card ===== */
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className="bg-background ring-border overflow-hidden rounded-4xl p-3 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] ring-1">
                  {/* ===== Artwork — image appears fully ===== */}
                  <div
                    className="relative aspect-square w-full overflow-hidden rounded-3xl"
                    style={{
                      boxShadow:
                        "rgba(255, 255, 255, 0.1) 0px 0px 0.1px 0px inset, rgba(255, 255, 255, 0.11) 0px 1px 1px 0px inset, rgb(0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.31) 0px 1px 2px 0px",
                    }}
                  >
                    <motion.div
                      layoutId={`artwork-${uid}`}
                      transition={morphTransition}
                      className="absolute inset-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={track.artwork}
                        alt={`${track.title} by ${track.artist}`}
                        className="h-full w-full object-cover"
                      />
                    </motion.div>

                    {/* Bottom scrim for text legibility */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/80 to-transparent" />

                    {/* Top bar: collapse + volume */}
                    <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
                      <MotionButton
                        whileTap={{ scale: 0.9 }}
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(true)}
                        aria-label="Collapse player"
                        className="h-8 w-8 rounded-full bg-black dark:bg-background text-white ring-1 ring-white/20 backdrop-blur-md hover:bg-white/20"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </MotionButton>

                      {/* Volume trigger + popover */}
                      <Popover
                        open={showVolumeSlider}
                        onOpenChange={setShowVolumeSlider}
                      >
                        <PopoverTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Adjust volume"
                              className="h-8 w-8 rounded-full bg-black dark:bg-background  text-white ring-1 ring-white/20 backdrop-blur-md hover:bg-white/20"
                            />
                          }
                        >
                          {effectiveVolume === 0 ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </PopoverTrigger>
                        <PopoverContent
                          side="bottom"
                          align="end"
                          className="border-border bg-black/30 z-40 w-auto rounded-2xl p-3 backdrop-blur-2xl"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-background text-xs tabular-nums">
                              {effectiveVolume}
                            </span>
                            <div
                              ref={volumeRef}
                              role="slider"
                              tabIndex={0}
                              aria-label="Volume"
                              aria-orientation="vertical"
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={effectiveVolume}
                              onPointerDown={handleVolumePointerDown}
                              onPointerMove={handleVolumePointerMove}
                              onPointerUp={handleVolumePointerUp}
                              className="bg-background/20 relative h-24 w-2 cursor-pointer touch-none rounded-full"
                            >
                              <div
                                className="bg-background absolute bottom-0 w-full rounded-full"
                                style={{ height: `${effectiveVolume}%` }}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={toggleMute}
                              aria-label={isMuted ? "Unmute" : "Mute"}
                              className="text-background h-6 w-6 hover:bg-white/10"
                            >
                              {effectiveVolume === 0 ? (
                                <VolumeX className="h-3.5 w-3.5" />
                              ) : (
                                <Volume2 className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Track info — overlaid on cover */}
                    <motion.div
                      layoutId={`track-info-${uid}`}
                      transition={morphTransition}
                      aria-live="polite"
                      aria-atomic="true"
                      className="absolute right-4 bottom-4 left-4"
                    >
                      <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white drop-shadow-lg">
                        <span className="truncate">{track.title}</span>
                        {isPlaying && showEqualizer && (
                          <span className="shrink-0">
                            <WaveBars
                              playing={isPlaying}
                              color={accentColor}
                              height={12}
                            />
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-sm text-white/70 drop-shadow-md">
                        {track.album
                          ? `${track.artist} • ${track.album}`
                          : track.artist}
                      </p>
                    </motion.div>
                  </div>

                  {/* ===== Bottom section: seek + controls ===== */}
                  <div className="bg-muted/30 mt-1 rounded-3xl px-3 pt-3 pb-1">
                    {/* Seek bar as divider */}
                    <div
                      ref={progressRef}
                      role="slider"
                      tabIndex={0}
                      aria-label="Seek"
                      aria-valuemin={0}
                      aria-valuemax={Math.round(track.duration)}
                      aria-valuenow={Math.round(currentTime)}
                      aria-valuetext={`${formatTime(currentTime)} of ${formatTime(track.duration)}`}
                      className="group bg-muted-foreground/15 relative h-1 w-full cursor-pointer touch-none rounded-full"
                      onPointerDown={handleProgressPointerDown}
                      onPointerMove={handleProgressPointerMove}
                      onPointerUp={handleProgressPointerUp}
                      onPointerLeave={() =>
                        !isDraggingProgressRef.current && setHoverTime(null)
                      }
                    >
                      <div
                        className="bg-foreground absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                      <div
                        className="bg-foreground absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                        style={{ left: `${progress}%`, marginLeft: "-6px" }}
                      />
                      {hoverTime !== null && (
                        <div
                          className="bg-primary text-primary-foreground ring-border pointer-events-none absolute -top-8 rounded-md px-1.5 py-0.5 text-[10px] ring-1"
                          style={{
                            left: `${(hoverTime / track.duration) * 100}%`,
                            transform: "translateX(-50%)",
                          }}
                        >
                          {formatTime(hoverTime)}
                        </div>
                      )}
                    </div>
                    {/* Time labels */}
                    <div className="text-muted-foreground/60 mt-1.5 flex justify-between text-[10px] font-medium tabular-nums">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(track.duration)}</span>
                    </div>

                    {/* Controls dock */}
                    <div className="mt-2 flex items-center justify-center gap-3">
                      {/* Like */}
                      <MotionButton
                        whileTap={{ scale: 0.8 }}
                        variant="ghost"
                        size="icon"
                        onClick={() => setLiked(!liked)}
                        aria-label={
                          liked
                            ? "Remove from Liked Songs"
                            : "Add to Liked Songs"
                        }
                        aria-pressed={liked}
                        className="bg-muted/40 text-foreground ring-border hover:bg-muted/60 h-10 w-10 shrink-0 rounded-full ring-1 backdrop-blur-2xl"
                      >
                        <motion.span
                          animate={
                            liked ? { scale: [1, 1.35, 1] } : { scale: 1 }
                          }
                          transition={{ duration: 0.35 }}
                          className="block"
                        >
                          <Heart
                            className={cn(
                              "h-3.5 w-3.5",
                              liked
                                ? "fill-rose-500 text-rose-500"
                                : "text-foreground"
                            )}
                          />
                        </motion.span>
                      </MotionButton>

                      {/* Glass control dock */}
                      <div className="bg-muted/40 ring-border flex items-center gap-0.5 rounded-full p-1 ring-1 backdrop-blur-2xl">
                        <MotionButton
                          whileTap={{ scale: 0.85 }}
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsShuffled(!isShuffled)}
                          aria-label="Toggle shuffle"
                          aria-pressed={isShuffled}
                          {...(isShuffled
                            ? { style: { color: accentColor } }
                            : {})}
                          className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-full hover:bg-transparent"
                        >
                          <Shuffle className="h-3 w-3" />
                        </MotionButton>
                        <MotionButton
                          whileTap={{ scale: 0.85 }}
                          variant="ghost"
                          size="icon"
                          onClick={() => skipTrack("prev")}
                          disabled={queue.length === 0}
                          aria-label="Previous track"
                          className="text-foreground hover:bg-muted-foreground/10 h-8 w-8 rounded-full"
                        >
                          <SkipBack className="h-3.5 w-3.5 fill-current" />
                        </MotionButton>

                        {/* Play/pause — morphs from collapsed play button */}
                        <MotionButton
                          layoutId={`play-btn-${uid}`}
                          transition={morphTransition}
                          whileTap={{ scale: 0.9 }}
                          onClick={togglePlay}
                          aria-label={isPlaying ? "Pause" : "Play"}
                          variant="ghost"
                          size="icon"
                          className="text-primary bg-background ring-border h-10 w-10 rounded-full ring-1"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isPlaying ? (
                              <motion.span
                                key="pause"
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.4, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Pause className="fill-primary h-3.5 w-3.5" />
                              </motion.span>
                            ) : (
                              <motion.span
                                key="play"
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.4, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Play className="fill-primary ml-0.5 h-3.5 w-3.5" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </MotionButton>

                        <MotionButton
                          whileTap={{ scale: 0.85 }}
                          variant="ghost"
                          size="icon"
                          onClick={() => skipTrack("next")}
                          disabled={queue.length === 0}
                          aria-label="Next track"
                          className="text-foreground hover:bg-muted-foreground/10 h-8 w-8 rounded-full"
                        >
                          <SkipForward className="h-3.5 w-3.5 fill-current" />
                        </MotionButton>
                        <MotionButton
                          whileTap={{ scale: 0.85 }}
                          variant="ghost"
                          size="icon"
                          onClick={toggleRepeat}
                          aria-label={repeatLabel}
                          {...(repeatMode !== "off"
                            ? { style: { color: accentColor } }
                            : {})}
                          className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-full hover:bg-transparent"
                        >
                          {repeatMode === "one" ? (
                            <Repeat1 className="h-3 w-3" />
                          ) : (
                            <Repeat className="h-3 w-3" />
                          )}
                        </MotionButton>
                      </div>

                      {/* Queue toggle */}
                      <MotionButton
                        whileTap={{ scale: 0.9 }}
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowQueue(!showQueue)}
                        disabled={queue.length === 0}
                        aria-label={showQueue ? "Hide queue" : "Show queue"}
                        aria-pressed={showQueue}
                        aria-expanded={showQueue}
                        {...(showQueue
                          ? { style: { color: accentColor } }
                          : {})}
                        className="bg-muted/40 text-foreground ring-border hover:bg-muted/60 h-10 w-10 shrink-0 rounded-full ring-1 backdrop-blur-2xl"
                      >
                        <List className="h-3.5 w-3.5" />
                      </MotionButton>
                    </div>
                  </div>
                </div>

                {/* Queue panel */}
                <AnimatePresence>
                  {showQueue && queue.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="border-border bg-background/50 mt-3 overflow-hidden rounded-3xl border backdrop-blur-2xl"
                    >
                      <div className="p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-foreground text-sm font-semibold">
                            Up Next · {queue.length}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowQueue(false)}
                            aria-label="Close queue"
                            className="text-muted-foreground hover:bg-muted hover:text-foreground h-7 w-7 rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <ScrollArea className="max-h-64 pr-1">
                          <div className="space-y-1">
                            {queue.map((qt, index) => {
                              const active = index === activeIndex;
                              return (
                                <motion.button
                                  key={qt.id}
                                  onClick={() => selectFromQueue(qt, index)}
                                  whileTap={{ scale: 0.98 }}
                                  aria-current={active ? "true" : undefined}
                                  aria-label={`Play ${qt.title} by ${qt.artist}`}
                                  className={cn(
                                    "hover:bg-muted/50 flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors",
                                    active && "bg-muted"
                                  )}
                                >
                                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={qt.artwork}
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                    {active && isPlaying && showEqualizer && (
                                      <div className="bg-primary/50 absolute inset-0 flex items-end justify-center pb-1.5">
                                        <WaveBars
                                          playing={isPlaying}
                                          color={accentColor}
                                          height={12}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p
                                      className="truncate text-sm"
                                      style={{
                                        color: active ? accentColor : undefined,
                                      }}
                                    >
                                      <span
                                        className={cn(
                                          !active && "text-muted-foreground"
                                        )}
                                      >
                                        {qt.title}
                                      </span>
                                    </p>
                                    <p className="text-muted-foreground/60 truncate text-xs">
                                      {qt.artist}
                                    </p>
                                  </div>
                                  <span className="text-muted-foreground/60 shrink-0 text-xs tabular-nums">
                                    {formatTime(qt.duration)}
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </MotionConfig>
    </div>
  );
};

export default MusicPlayer;
