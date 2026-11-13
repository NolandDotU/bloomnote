import { redirect } from "next/navigation";
import { seedGift } from "@/lib/seed-data";

export default function Home() {
  redirect(`/g/${seedGift.slug}`);
}
