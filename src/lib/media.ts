import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";

const PUBLIC = path.join(process.cwd(), "public");

const PHOTO_EXT = /\.(jpe?g|png|webp|avif)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;
const AUDIO_EXT = /\.(mp3|m4a|wav|ogg|opus)$/i;

function listFiles(dir: string, pattern: RegExp) {
  const full = path.join(PUBLIC, dir);
  if (!existsSync(full)) return [];
  return readdirSync(full)
    .filter((name) => pattern.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function readJson<T>(file: string, fallback: T): T {
  const full = path.join(PUBLIC, file);
  if (!existsSync(full)) return fallback;
  try {
    return JSON.parse(readFileSync(full, "utf8")) as T;
  } catch {
    return fallback;
  }
}

export type PhotoEntry = { id: string; url: string; caption: string; takenAt: string | null };
export type VideoEntry = { id: string; url: string; title: string; poster?: string };
export type SongEntry = { id: string; url: string; title: string; artist: string };

type CaptionMap = Record<string, { caption?: string; takenAt?: string }>;

/** Drop files into public/foto and they appear. Captions live in public/foto/captions.json. */
export function listPhotos(): PhotoEntry[] {
  const captions = readJson<CaptionMap>("foto/captions.json", {});
  return listFiles("foto", PHOTO_EXT).map((file, index) => ({
    id: `photo-${index + 1}`,
    url: `/foto/${file}`,
    caption: captions[file]?.caption ?? "A memory kept close",
    takenAt: captions[file]?.takenAt ?? null
  }));
}

/** Drop files into public/video and they all render. Titles live in public/video/titles.json. */
export function listVideos(): VideoEntry[] {
  const titles = readJson<Record<string, string>>("video/titles.json", {});
  return listFiles("video", VIDEO_EXT).map((file, index) => ({
    id: `video-${index + 1}`,
    url: `/video/${file}`,
    title: titles[file] ?? "A little film for you"
  }));
}

/** Drop files into public/music and they become a playlist. Titles live in public/music/titles.json. */
export function listSongs(): SongEntry[] {
  const meta = readJson<Record<string, { title?: string; artist?: string }>>("music/titles.json", {});
  return listFiles("music", AUDIO_EXT).map((file, index) => ({
    id: `song-${index + 1}`,
    url: `/music/${file}`,
    title: meta[file]?.title ?? file.replace(AUDIO_EXT, "").replace(/[_-]+/g, " "),
    artist: meta[file]?.artist ?? "Thaathaa · Bloomnote sessions"
  }));
}
