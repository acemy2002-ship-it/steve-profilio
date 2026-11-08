"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Activity,
  Circle,
  Disc3,
  Headphones,
  Loader2,
  MessageCircle,
} from "lucide-react";

const DISCORD_ID = "518680476928704527";
const API_URL = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

type DiscordStatusType = "online" | "idle" | "dnd" | "offline";

interface DiscordActivity {
  name: string;
  type: number;
  details?: string;
  state?: string;
  assets?: {
    large_image?: string;
    small_image?: string;
    large_text?: string;
    small_text?: string;
  };
}

interface DiscordData {
  discord_user: {
    id: string;
    username: string;
    display_name: string;
    avatar: string;
  };
  discord_status: DiscordStatusType;
  activities: DiscordActivity[];
  listening_to_spotify: boolean;
  spotify: {
    song: string;
    artist: string;
    album: string;
    album_art_url: string;
  } | null;
}

interface DiscordApiResponse {
  success: boolean;
  data: DiscordData;
}

const STATUS_CONFIG = {
  online: {
    label: "Online",
    color: "bg-green-500",
  },
  idle: {
    label: "Idle",
    color: "bg-yellow-500",
  },
  dnd: {
    label: "Do Not Disturb",
    color: "bg-red-500",
  },
  offline: {
    label: "Offline",
    color: "bg-zinc-500",
  },
};

export function DiscordStatus() {
  const [discord, setDiscord] = useState<DiscordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchDiscord = async () => {
      try {
        const response = await fetch(API_URL, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Discord status");
        }

        const result: DiscordApiResponse = await response.json();

        if (!result.success) {
          throw new Error("Lanyard API error");
        }

        if (mounted) {
          setDiscord(result.data);
          setError(false);
        }
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDiscord();

    const interval = setInterval(fetchDiscord, 15000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border p-4">
        <Loader2 className="size-5 animate-spin" />
        <span className="text-muted-foreground text-sm">
          Loading Discord...
        </span>
      </div>
    );
  }

  if (error || !discord) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border p-4">
        <MessageCircle className="text-muted-foreground size-5" />
        <span className="text-muted-foreground text-sm">
          Discord status unavailable
        </span>
      </div>
    );
  }

  const user = discord.discord_user;
  const status = STATUS_CONFIG[discord.discord_status];

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  const activity = discord.activities.find((item) => item.name !== "Spotify");

  return (
    <div className="border-border bg-card shadow-2xl w-full max-w-sm rounded-2xl border p-4">
      {/* User */}
      <div className="flex items-center gap-3">
        <div className="relative size-14 shrink-0">
          <Image
            src={avatarUrl}
            alt={user.username}
            fill
            unoptimized
            className="rounded-full object-cover"
            draggable={false}
          />

          <span
            className={`border-card absolute right-0 bottom-0 size-4 rounded-full border-[3px] ${status.color}`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">
            {user.display_name || user.username}
          </h3>
          <p className="text-muted-foreground truncate text-sm">
            @{user.username}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <Circle
              className={`size-2 fill-current ${
                discord.discord_status === "online"
                  ? "text-green-500"
                  : discord.discord_status === "idle"
                    ? "text-yellow-500"
                    : discord.discord_status === "dnd"
                      ? "text-red-500"
                      : "text-zinc-500"
              }`}
            />
            <span className="text-muted-foreground text-xs">
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="border-border mt-4 border-t pt-3">
        {discord.listening_to_spotify && discord.spotify ? (
          <div className="flex items-center gap-3">
            {discord.spotify.album_art_url && (
              <Image
                src={discord.spotify.album_art_url}
                alt={discord.spotify.album}
                width={48}
                height={48}
                unoptimized
                className="rounded-lg"
              />
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs text-green-500">
                <Headphones className="size-3.5" />
                Listening to Spotify
              </div>
              <p className="truncate text-sm font-medium">
                {discord.spotify.song}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {discord.spotify.artist}
              </p>
            </div>
          </div>
        ) : activity ? (
          <div className="flex items-start gap-2">
            <Activity className="text-muted-foreground mt-0.5 size-4" />
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">
                {activity.type === 0
                  ? "Playing"
                  : activity.type === 1
                    ? "Streaming"
                    : activity.type === 2
                      ? "Listening to"
                      : activity.type === 3
                        ? "Watching"
                        : activity.type === 5
                          ? "Competing in"
                          : "Activity"}
              </p>
              <p className="truncate text-sm font-medium">{activity.name}</p>
              {activity.details && (
                <p className="text-muted-foreground truncate text-xs">
                  {activity.details}
                </p>
              )}
              {activity.state && (
                <p className="text-muted-foreground truncate text-xs">
                  {activity.state}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Disc3 className="size-4" />
            <span>No current activity</span>
          </div>
        )}
      </div>
    </div>
  );
}
