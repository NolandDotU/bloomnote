export type Opening = "notebook" | "envelope" | "music-box";
export type World = "underwater" | "night-garden" | "paper-meadow";
export type LockKind = "none" | "hold" | "countdown" | "question";

export type Photo = { id: string; url: string; caption: string; takenAt: string | null };
export type Video = { id: string; url: string; title: string; poster?: string };
export type Song = { id: string; url: string; title: string; artist: string };

export type PublicGift = {
  id: string;
  slug: string;
  opening: Opening;
  lock: {
    kind: LockKind;
    unlockAt?: string;
    question?: string;
    answer?: string;
  };
  world: World;
  letter: {
    title: string;
    body: string;
    signature: string;
  };
  bouquet: { photos: Photo[] };
  songs: Song[];
  videos: Video[];
  voice: { url: string; title: string } | null;
  pins: Array<{ id: string; lat: number; lng: number; title: string }>;
  createdAt: string;
};
