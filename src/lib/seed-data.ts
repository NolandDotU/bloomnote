import type { PublicGift } from "@/types/gift";

// Media starts empty on purpose: photos, videos and songs are added through /admin.
export const seedGift: PublicGift = {
  id: "seed-gift",
  slug: "demo-bloom",
  opening: "notebook",
  lock: { kind: "none" },
  world: "night-garden",
  letter: {
    title: "For my Thaathaa",
    body: "Thaathaa, I gathered a few little memories for you: photos, a song, and this note for whenever you need a gentle reminder that you are loved. Thank you for always being patient with me, even when I make your mood bad. I hope this small world makes you smile, sayaangg.",
    signature: "Byy, sayaangg"
  },
  bouquet: { photos: [] },
  songs: [],
  videos: [],
  voice: null,
  pins: [{ id: "seed-pin-1", lat: -6.1754, lng: 106.8272, title: "Where the city hums" }],
  createdAt: "2025-04-12T10:00:00.000Z"
};
