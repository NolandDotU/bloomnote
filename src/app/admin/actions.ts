"use server";

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminClient } from "@/lib/supabase/admin";
import { isAdmin, signIn, signOut } from "@/lib/auth";
import { readContent, writeContent, type GiftContent } from "@/lib/content";

const BUCKET = "uploads";

async function saveUpload(file: File | null): Promise<string | null> {
  if (!file || !file.size) return null;
  const safe = file.name.replace(/[^\w.\-]+/g, "_");
  const name = `${Date.now()}-${safe}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const supabase = getAdminClient();

  if (!supabase) {
    // ponytail: local dev fallback writes into public/uploads; production needs Supabase Storage.
    const dir = path.join(process.cwd(), "public", "uploads");
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, name), bytes);
    return `/uploads/${name}`;
  }

  const { error } = await supabase.storage.from(BUCKET).upload(name, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: false
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
}

function refresh() {
  revalidatePath("/g/[slug]", "page");
  revalidatePath("/admin");
}

function done(status: "saved" | "uploaded" | "removed"): never {
  redirect(`/admin?status=${status}`);
}

function fail(message: string): never {
  redirect(`/admin?status=error&message=${encodeURIComponent(message)}`);
}

async function guard() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function login(formData: FormData) {
  const ok = await signIn(String(formData.get("password") ?? ""));
  redirect(ok ? "/admin" : "/admin/login?error=1");
}

export async function logout() {
  await signOut();
  redirect("/admin/login");
}

export async function saveGift(formData: FormData) {
  await guard();
  const current = await readContent();
  const str = (key: string, fallback: string) => String(formData.get(key) ?? fallback);

  const next: GiftContent = {
    ...current,
    letter: {
      title: str("letterTitle", current.letter.title),
      body: str("letterBody", current.letter.body),
      signature: str("letterSignature", current.letter.signature)
    },
    bouquet: {
      photos: current.bouquet.photos.map((photo) => ({
        ...photo,
        caption: str(`caption-${photo.id}`, photo.caption),
        takenAt: str(`takenAt-${photo.id}`, photo.takenAt ?? "") || null
      }))
    },
    songs: current.songs.map((song) => ({
      ...song,
      title: str(`songTitle-${song.id}`, song.title),
      artist: str(`songArtist-${song.id}`, song.artist)
    })),
    videos: current.videos.map((video) => ({
      ...video,
      title: str(`videoTitle-${video.id}`, video.title)
    })),
    copy: {
      heroKicker: str("heroKicker", current.copy.heroKicker),
      heroTitle: str("heroTitle", current.copy.heroTitle),
      heroAside: str("heroAside", current.copy.heroAside),
      volume: str("volume", current.copy.volume),
      dedication: str("dedication", current.copy.dedication),
      galleryHeading: str("galleryHeading", current.copy.galleryHeading),
      editorLabel: str("editorLabel", current.copy.editorLabel),
      keepsakesLabel: str("keepsakesLabel", current.copy.keepsakesLabel),
      coordinatesLabel: str("coordinatesLabel", current.copy.coordinatesLabel),
      footerLeft: str("footerLeft", current.copy.footerLeft),
      footerRight: str("footerRight", current.copy.footerRight),
      coverImage: str("coverImage", current.copy.coverImage),
      vinylImage: str("vinylImage", current.copy.vinylImage),
      songCover: str("songCover", current.copy.songCover)
    }
  };

  await writeContent(next);
  refresh();
  done("saved");
}
export async function uploadAsset(formData: FormData) {
  await guard();
  const kind = String(formData.get("kind") ?? "");
  if (!["photo", "video", "song", "cover", "vinyl", "songCover"].includes(kind)) {
    fail("Unsupported upload type.");
  }
  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) {
    fail("Choose a file before uploading.");
  }
  let url: string | null = null;
  try {
    url = await saveUpload(file);
  } catch (error) {
    fail(error instanceof Error ? error.message : "Upload failed.");
  }
  if (!url) fail("Upload failed.");

  const current = await readContent();
  const next: GiftContent = { ...current };

  if (kind === "photo") {
    next.bouquet = { photos: [...current.bouquet.photos, { id: `photo-${Date.now()}`, url, caption: "A memory kept close", takenAt: null }] };
  } else if (kind === "video") {
    next.videos = [...current.videos, { id: `video-${Date.now()}`, url, title: "A little film for you" }];
  } else if (kind === "song") {
    next.songs = [...current.songs, { id: `song-${Date.now()}`, url, title: "A song for you", artist: "Bloomnote sessions" }];
  } else if (kind === "cover") {
    next.copy = { ...current.copy, coverImage: url };
  } else if (kind === "vinyl") {
    next.copy = { ...current.copy, vinylImage: url };
  } else if (kind === "songCover") {
    next.copy = { ...current.copy, songCover: url };
  }

  await writeContent(next);
  refresh();
  done("uploaded");
}

export async function removeAsset(formData: FormData) {
  await guard();
  const kind = String(formData.get("kind") ?? "");
  const id = String(formData.get("id") ?? "");
  const current = await readContent();
  const next: GiftContent = { ...current };

  if (kind === "photo") next.bouquet = { photos: current.bouquet.photos.filter((item) => item.id !== id) };
  if (kind === "video") next.videos = current.videos.filter((item) => item.id !== id);
  if (kind === "song") next.songs = current.songs.filter((item) => item.id !== id);

  await writeContent(next);
  refresh();
  done("removed");
}
