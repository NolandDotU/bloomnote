import Image from "next/image";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { readContent } from "@/lib/content";
import { logout, removeAsset, saveGift, uploadAsset } from "./actions";

export const dynamic = "force-dynamic";

const field = "w-full rounded border border-[#b9aa91] bg-[#fffdf8] px-3 py-2 text-sm text-[#2e3028]";
const label = "block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#716957]";
const card = "rounded-lg border border-[#b9aa91] bg-[#f7f1e7] p-5 shadow-[3px_4px_0_#c7bca9]";
const btn = "rounded bg-[#2e3028] px-4 py-2 text-sm font-semibold text-[#f5efe3] hover:bg-[#4b4a3f]";

function Text({ name, title, value, area }: { name: string; title: string; value: string; area?: boolean }) {
  return (
    <label className="block">
      <span className={label}>{title}</span>
      {area ? (
        <textarea name={name} defaultValue={value} rows={5} className={`${field} mt-1`} />
      ) : (
        <input name={name} defaultValue={value} className={`${field} mt-1`} />
      )}
    </label>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const gift = await readContent();
  const { status } = await searchParams;
  const message =
    status === "saved" ? "All changes saved." :
    status === "uploaded" ? "Media uploaded and added." :
    status === "removed" ? "Media removed." :
    null;

  return (
    <main className="min-h-screen bg-[#e8dfcf] px-4 py-8 text-[#2e3028] md:px-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[#8d806c]/60 pb-4">
          <div>
            <h1 className="font-serif text-3xl">Aku ngubahnya disini sayang</h1>
            <p className="mt-1 text-sm text-[#716957]">This is where i edit the content.</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={`/g/${gift.slug}`} className={btn}>View gift</a>
            <form action={logout}>
              <button type="submit" className="rounded border border-[#8d806c] px-4 py-2 text-sm font-semibold text-[#716957] hover:bg-[#e8dfcf]">Log out</button>
            </form>
          </div>
        </header>

        {message && (
          <p role="status" className="rounded border border-[#82956f] bg-[#edf3e6] px-4 py-3 text-sm text-[#49603d]">
            {message}
          </p>
        )}

        <form action={saveGift} className="space-y-6">
          <section className={card}>
            <h2 className="mb-4 font-serif text-xl">Letter</h2>
            <div className="space-y-3">
              <Text name="letterTitle" title="Title" value={gift.letter.title} />
              <Text name="letterBody" title="Body" value={gift.letter.body} area />
              <Text name="letterSignature" title="Signature" value={gift.letter.signature} />
            </div>
          </section>

          <section className={card}>
            <h2 className="mb-4 font-serif text-xl">Page copy</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Text name="heroKicker" title="Hero kicker" value={gift.copy.heroKicker} />
              <Text name="heroTitle" title="Hero title" value={gift.copy.heroTitle} />
              <Text name="heroAside" title="Hero aside" value={gift.copy.heroAside} area />
              <Text name="volume" title="Volume line" value={gift.copy.volume} />
              <Text name="dedication" title="Dedication" value={gift.copy.dedication} />
              <Text name="galleryHeading" title="Gallery heading" value={gift.copy.galleryHeading} />
              <Text name="editorLabel" title="Editor label" value={gift.copy.editorLabel} />
              <Text name="keepsakesLabel" title="Keepsakes label" value={gift.copy.keepsakesLabel} />
              <Text name="coordinatesLabel" title="Coordinates label" value={gift.copy.coordinatesLabel} />
              <Text name="footerLeft" title="Footer left" value={gift.copy.footerLeft} />
              <Text name="footerRight" title="Footer right" value={gift.copy.footerRight} />
            </div>
          </section>

          <section className={card}>
            <h2 className="mb-4 font-serif text-xl">Photos</h2>
            <div className="space-y-3">
              {gift.bouquet.photos.map((photo) => (
                <div key={photo.id} className="flex flex-wrap items-end gap-3 border-b border-dotted border-[#b9aa91] pb-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-[#b9aa91]">
                    <Image src={photo.url} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-40 flex-1">
                    <Text name={`caption-${photo.id}`} title="Caption" value={photo.caption} />
                  </div>
                  <div className="w-40">
                    <Text name={`takenAt-${photo.id}`} title="Taken at" value={photo.takenAt ?? ""} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={card}>
            <h2 className="mb-4 font-serif text-xl">Songs</h2>
            <div className="space-y-3">
              {gift.songs.map((song) => (
                <div key={song.id} className="grid gap-3 border-b border-dotted border-[#b9aa91] pb-3 sm:grid-cols-2">
                  <Text name={`songTitle-${song.id}`} title="Song title" value={song.title} />
                  <Text name={`songArtist-${song.id}`} title="Artist" value={song.artist} />
                </div>
              ))}
            </div>
          </section>

          <section className={card}>
            <h2 className="mb-4 font-serif text-xl">Videos</h2>
            <div className="space-y-3">
              {gift.videos.map((video) => (
                <Text key={video.id} name={`videoTitle-${video.id}`} title="Video title" value={video.title} />
              ))}
            </div>
          </section>

          <section className={card}>
            <h2 className="mb-4 font-serif text-xl">Artwork paths</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <Text name="coverImage" title="Notebook cover" value={gift.copy.coverImage} />
              <Text name="vinylImage" title="Vinyl image" value={gift.copy.vinylImage} />
              <Text name="songCover" title="Song cover" value={gift.copy.songCover} />
            </div>
          </section>

          <button type="submit" className={`${btn} w-full sm:w-auto`}>Save all changes</button>
        </form>

        <section className={card}>
          <h2 className="mb-4 font-serif text-xl">Uploads</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { kind: "photo", title: "Add photo", accept: "image/*" },
              { kind: "video", title: "Add video", accept: "video/*" },
              { kind: "song", title: "Add song", accept: "audio/*" },
              { kind: "cover", title: "Replace notebook cover", accept: "image/*" },
              { kind: "vinyl", title: "Replace vinyl", accept: "image/*" },
              { kind: "songCover", title: "Replace song cover", accept: "image/*" }
            ].map((item) => (
              <form key={item.kind} action={uploadAsset} className="space-y-2 rounded border border-dotted border-[#b9aa91] p-3">
                <input type="hidden" name="kind" value={item.kind} />
                <p className={label}>{item.title}</p>
                <input type="file" name="file" accept={item.accept} required className="w-full text-xs" />
                <button type="submit" className={btn}>Upload</button>
              </form>
            ))}
          </div>
        </section>

        <section className={card}>
          <h2 className="mb-4 font-serif text-xl">Remove media</h2>
          <div className="space-y-2">
            {[...gift.bouquet.photos.map((p) => ({ kind: "photo", id: p.id, name: p.caption })), ...gift.videos.map((v) => ({ kind: "video", id: v.id, name: v.title })), ...gift.songs.map((s) => ({ kind: "song", id: s.id, name: s.title }))].map((item) => (
              <form key={`${item.kind}-${item.id}`} action={removeAsset} className="flex items-center justify-between gap-3 border-b border-dotted border-[#b9aa91] pb-2">
                <input type="hidden" name="kind" value={item.kind} />
                <input type="hidden" name="id" value={item.id} />
                <span className="truncate text-sm">{item.kind} · {item.name}</span>
                <button type="submit" className="shrink-0 rounded border border-[#9b5b4e] px-3 py-1 text-xs font-semibold text-[#9b5b4e]">Remove</button>
              </form>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
