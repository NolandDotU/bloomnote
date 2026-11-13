import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readContent } from "@/lib/content";
import { GiftViewer } from "@/components/viewer/GiftViewer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const gift = await readContent();
  return { title: `${gift.letter.title} · Bloomnote`, robots: { index: false, follow: false } };
}

export default async function GiftPage() {
  const gift = await readContent();
  if (!gift) notFound();
  return <GiftViewer gift={gift} />;
}
