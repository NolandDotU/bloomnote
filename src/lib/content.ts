import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { seedGift } from "@/lib/seed-data";
import { getAdminClient } from "@/lib/supabase/admin";
import type { PublicGift } from "@/types/gift";

export type GiftCopy = {
  heroKicker: string;
  heroTitle: string;
  heroAside: string;
  volume: string;
  dedication: string;
  galleryHeading: string;
  editorLabel: string;
  keepsakesLabel: string;
  coordinatesLabel: string;
  footerLeft: string;
  footerRight: string;
  coverImage: string;
  vinylImage: string;
  songCover: string;
};

export type GiftContent = PublicGift & { copy: GiftCopy };

const ROW_ID = "main";
const FILE = path.join(process.cwd(), "data", "gift.json");

export const defaultCopy: GiftCopy = {
  heroKicker: "Bloomnote / private collection",
  heroTitle: "A little world, kept close",
  heroAside: "A catalogue of\ntender things",
  volume: "Vol. 01 · 2026",
  dedication: "For Thaathaa",
  galleryHeading: "Plate studies",
  editorLabel: "Editor's note / 01",
  keepsakesLabel: "Index of keepsakes",
  coordinatesLabel: "03 / Coordinates",
  footerLeft: "Made with care",
  footerRight: "Turn the page slowly",
  coverImage: "/elements/notebook-cover.png",
  vinylImage: "/elements/spinningVinyl.png",
  songCover: ""
};

export function defaultContent(): GiftContent {
  return { ...seedGift, copy: { ...defaultCopy } };
}

function merge(parsed: Partial<GiftContent>): GiftContent {
  return { ...defaultContent(), ...parsed, copy: { ...defaultCopy, ...(parsed.copy ?? {}) } };
}

export async function readContent(): Promise<GiftContent> {
  const supabase = getAdminClient();
  if (supabase) {
    const { data, error } = await supabase.from("gift_content").select("data").eq("id", ROW_ID).maybeSingle();
    if (error) throw new Error(`Content load failed: ${error.message}`);
    if (data?.data) return merge(data.data as Partial<GiftContent>);
    return defaultContent();
  }
  if (!existsSync(FILE)) return defaultContent();
  try {
    return merge(JSON.parse(readFileSync(FILE, "utf8")) as Partial<GiftContent>);
  } catch {
    return defaultContent();
  }
}

export async function writeContent(content: GiftContent) {
  const supabase = getAdminClient();
  if (supabase) {
    const { error } = await supabase.from("gift_content").upsert({ id: ROW_ID, data: content, updated_at: new Date().toISOString() });
    if (error) throw new Error(`Save failed: ${error.message}`);
    return;
  }
  mkdirSync(path.dirname(FILE), { recursive: true });
  writeFileSync(FILE, JSON.stringify(content, null, 2), "utf8");
}
