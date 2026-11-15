"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { PublicGift } from "@/types/gift";
import type { GiftCopy } from "@/lib/content";

function LocalSongPlayer({ title, artist, url, cover, vinyl }: { title: string; artist: string; url: string; cover?: string; vinyl: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  function toggle() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    void audioRef.current.play().then(() => setPlaying(true)).catch(() => setAvailable(false));
  }

  function seek(value: number) {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrent(value);
  }

  const elapsed = duration ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div className="border-b border-dotted border-[#b9aa91] pb-4">
      <audio
        ref={audioRef}
        src={url || undefined}
        preload="metadata"
        onEnded={() => setPlaying(false)}
        onError={() => setAvailable(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
      />
      <div className="flex items-center gap-4">
        <div className="relative h-28 w-28 shrink-0">
          <div className="absolute left-0 top-0 h-24 w-24 overflow-hidden rounded-md border border-[#b9aa91] bg-[#e8dfcf] shadow-[0_2px_0_#a99d87,2px_4px_10px_rgba(70,60,45,.18)]">
            {cover ? (
              <Image src={cover} alt="" fill sizes="96px" className="object-cover" aria-hidden />
            ) : (
              <Image src="/elements/flower-peony-red.png" alt="" fill sizes="96px" className="object-cover p-2" aria-hidden />
            )}
          </div>
          <div
            className="absolute bottom-0 right-0 h-20 w-20"
            style={{ animation: playing ? "vinyl-spin 3.2s linear infinite" : "none" }}
            aria-hidden
          >
            <Image src={vinyl} alt="" fill sizes="80px" className="object-contain drop-shadow-[0_4px_10px_rgba(70,60,45,.3)]" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[#2e3028]">{title}</p>
          <p className="truncate text-[11px] text-[#716957]">{artist}</p>
          <button
            type="button"
            onClick={toggle}
            disabled={!available}
            className="mt-2 grid h-10 w-10 place-items-center rounded-full bg-[#2e3028] text-[#f5efe3] transition-colors hover:bg-[#4b4a3f] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={available ? `${playing ? "Pause" : "Play"} ${title}` : "Song not added yet"}
          >
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden><rect x="1" y="1" width="3" height="10" rx="1" /><rect x="8" y="1" width="3" height="10" rx="1" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden><path d="M2 1.5v9l8-4.5z" /></svg>
            )}
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={current}
          onChange={(event) => seek(Number(event.target.value))}
          disabled={!available || !duration}
          aria-label="Song progress"
          className="song-range w-full cursor-pointer disabled:cursor-not-allowed"
          style={{ "--track": `linear-gradient(to right, #9b5b4e ${elapsed}%, #d9cdbd ${elapsed}%)` } as CSSProperties}
        />
        <span className="w-16 shrink-0 text-right text-[11px] tabular-nums text-[#716957] md:text-[10px]">
          {available ? `${formatTime(current)} / ${formatTime(duration)}` : "song soon"}
        </span>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function VideoKeepsake({ title, url, poster }: { title: string; url: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function play() {
    const video = videoRef.current;
    if (!video) return;
    void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }

  return (
    <figure className="mt-8">
      <div className="relative overflow-hidden rounded-lg border border-[#b9aa91] bg-[#2e3028] shadow-[0_2px_0_#a99d87]">
        <video
          ref={videoRef}
          src={url}
          poster={poster}
          controls={playing}
          playsInline
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          className="aspect-video w-full object-cover"
          aria-label={title}
        />
        {!playing && (
          <button
            type="button"
            onClick={play}
            className="absolute inset-0 grid place-items-center bg-[#2e3028]/25 transition-colors hover:bg-[#2e3028]/15"
            aria-label={`Play ${title}`}
          >
            <span className="grid h-14 w-14 place-items-center rounded-full border border-[#f5efe3]/70 bg-[#2e3028]/70 text-[#f5efe3] backdrop-blur-sm">
              <svg width="18" height="18" viewBox="0 0 12 12" fill="currentColor" aria-hidden><path d="M2 1.5v9l8-4.5z" /></svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 flex justify-between text-[11px] tracking-[0.08em] text-[#716957] md:text-[10px]">
        <span>02 / Moving image</span>
        <span>{title}</span>
      </figcaption>
    </figure>
  );
}

const SWARM = [
  "Untitled-1.png",
  "Untitled-1-2-Layer 2.png",
  "Untitled-1-3-Layer 3.png",
  "Untitled-1-4-Layer 4.png",
  "Untitled-1-5-Layer 5.png",
  "Untitled-1-6-Layer 6.png",
  "Untitled-1-7-Layer 7.png",
  "Untitled-1-8-Layer 8.png",
  "Untitled-1-9-Layer 9.png",
  "Untitled-1-10-Layer 10.png",
  "Untitled-1-11-Layer 11.png",
  "Untitled-1-12-Layer 12.png",
  "Untitled-1-13-Layer 13.png"
].map((name) => `/realElements/${encodeURIComponent(name)}`);

const SWARM_RINGS = 3;

function Swarm({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div className="pointer-events-none fixed inset-0 z-20 grid place-items-center overflow-hidden" aria-hidden="true" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          {Array.from({ length: SWARM.length * SWARM_RINGS }).map((_, index) => {
            const src = SWARM[index % SWARM.length];
            const ring = Math.floor(index / SWARM.length);
            const slot = index % SWARM.length;
            const angle = (slot / SWARM.length) * Math.PI * 2 + ring * 0.18;
            const distance = 200 + ring * 170 + (slot % 3) * 45;
            return (
              <motion.div
                key={`${src}-${ring}`}
                className="absolute w-32 md:w-48"
                initial={{ x: 0, y: 0, scale: 0.15, opacity: 0, rotate: 0 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance - 40,
                  scale: [0.15, 1.15, 1],
                  opacity: [0, 1, 1, 0],
                  rotate: index % 2 ? 160 : -160
                }}
                transition={{ duration: 2.2, ease: "easeOut", delay: ring * 0.12 + (slot % 6) * 0.04, times: [0, 0.25, 0.7, 1] }}
              >
                <Image src={src} alt="" width={260} height={260} className="h-auto w-full drop-shadow-[0_6px_14px_rgba(70,60,45,.25)]" />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const PETALS = [
  "/elements/flower-rose-pink.png",
  "/elements/flower-peony-red.png",
  "/elements/flower-daisy-yellow.png",
  "/elements/flower-lavender-purple.png",
  "/elements/leaf.png"
];

function VintageFlowers({ reduceMotion }: { reduceMotion: boolean | null }) {
  const flowers = [
    { src: "/elements/flower-peony-red.png", className: "left-[-4%] top-[6%] w-24 md:w-36", rotate: -8 },
    { src: "/elements/flower-rose-pink.png", className: "right-[-5%] top-[14%] w-20 md:w-32", rotate: 10 },
    { src: "/elements/flower-daisy-yellow.png", className: "left-[4%] bottom-[-5%] w-20 md:w-28", rotate: 6 },
    { src: "/elements/flower-lavender-purple.png", className: "right-[6%] bottom-[-7%] w-24 md:w-36", rotate: -6 },
    { src: "/elements/leaf.png", className: "left-[44%] top-[-4%] w-14 md:w-20", rotate: 14 },
    { src: "/elements/butterfly-yellow.png", className: "right-[24%] top-[44%] w-10 md:w-14", rotate: -4 }
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {flowers.map((flower, index) => (
        <motion.div
          key={flower.src}
          className={`absolute ${flower.className}`}
          initial={{ opacity: 0, rotate: flower.rotate }}
          animate={reduceMotion ? { opacity: 0.85 } : { opacity: 0.85, rotate: [flower.rotate - 2, flower.rotate + 2, flower.rotate - 2], y: [0, -6, 0] }}
          transition={{ duration: 7 + index, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut", delay: index * 0.4 }}
        >
          <Image src={flower.src} alt="" width={220} height={220} className="h-auto w-full" />
        </motion.div>
      ))}
      {!reduceMotion && Array.from({ length: 9 }).map((_, index) => (
        <motion.div
          key={`petal-${index}`}
          className="absolute w-5 md:w-7"
          style={{ left: `${6 + (index * 11) % 88}%`, top: "-8%" }}
          animate={{ y: ["0vh", "112vh"], x: [0, index % 2 ? 26 : -26, 0], rotate: [0, index % 2 ? 180 : -180] }}
          transition={{ duration: 16 + (index % 5) * 3, repeat: Infinity, delay: index * 1.4, ease: "linear" }}
        >
          <Image src={PETALS[index % PETALS.length]} alt="" width={60} height={60} className="h-auto w-full opacity-70" />
        </motion.div>
      ))}
    </div>
  );
}

function World({ world }: { world: PublicGift["world"] }) {
  const palettes = {
    underwater: "from-[#1b5064] via-[#174151] to-[#0d2438]",
    "night-garden": "from-[#263c45] via-[#243842] to-[#121d2c]",
    "paper-meadow": "from-[#b7c8a9] via-[#dce0bb] to-[#f2d5a6]"
  };
  return (
    <div className={`absolute inset-0 overflow-hidden bg-gradient-to-br ${palettes[world]}`} aria-hidden="true">
      {world === "underwater" ? (
        <>
          <motion.div className="absolute left-[5%] top-[24%] w-20 opacity-90 md:w-28" animate={{ x: [0, 24, 0], y: [0, -8, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
            <Image src="/elements/fish-orange.png" alt="" width={180} height={180} />
          </motion.div>
          <motion.div className="absolute right-[8%] top-[16%] w-16 opacity-80 md:w-24" animate={{ x: [0, -18, 0], y: [0, 12, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}>
            <Image src="/elements/fish-blue.png" alt="" width={180} height={180} />
          </motion.div>
          <Image className="absolute bottom-[8%] left-[12%] w-20 opacity-60 md:w-28" src="/elements/bubble.png" alt="" width={180} height={180} />
          <Image className="absolute bottom-[20%] right-[12%] w-14 opacity-50 md:w-20" src="/elements/bubble.png" alt="" width={180} height={180} />
        </>
      ) : (
        <>
          <motion.div className="absolute left-[4%] top-[13%] w-16 md:w-24" animate={{ y: [0, -14, 0], rotate: [-5, 5, -5] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
            <Image src="/elements/butterfly-lavender.png" alt="" width={180} height={180} />
          </motion.div>
          <motion.div className="absolute right-[4%] top-[20%] w-14 md:w-20" animate={{ y: [0, 12, 0], rotate: [5, -4, 5] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
            <Image src="/elements/butterfly-rose.png" alt="" width={180} height={180} />
          </motion.div>
          <Image className="absolute bottom-[-3%] left-[-2%] w-36 opacity-90 md:w-52" src="/elements/flower-peony-red.png" alt="" width={240} height={240} />
          <Image className="absolute bottom-[-4%] right-[-2%] w-32 opacity-90 md:w-48" src="/elements/flower-rose-pink.png" alt="" width={240} height={240} />
          <Image className="absolute bottom-[2%] left-[38%] w-20 opacity-80 md:w-28" src="/elements/leaf.png" alt="" width={180} height={180} />
        </>
      )}
      <div className="absolute left-[12%] top-[15%] h-2 w-2 rounded-full bg-white/70" />
      <div className="absolute right-[19%] top-[30%] h-2 w-2 rounded-full bg-[#f7d58d]" />
      <div className="absolute -left-12 top-1/3 h-40 w-40 rounded-full border border-white/10" />
      <div className="absolute -right-16 top-1/2 h-52 w-52 rounded-full border border-white/10" />
      {Array.from({ length: 10 }).map((_, index) => (
        <motion.span key={index} className="absolute h-1.5 w-1.5 rounded-full bg-white/35" style={{ left: `${8 + (index * 19) % 87}%`, top: `${10 + (index * 31) % 75}%` }} animate={{ y: [0, -18, 0], opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 4 + index % 3, repeat: Infinity, delay: index * 0.2 }} />
      ))}
    </div>
  );
}

export function GiftViewer({ gift }: { gift: PublicGift & { copy: GiftCopy } }) {
  const copy = gift.copy;
  const reduceMotion = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [burst, setBurst] = useState(false);
  const [canDrag, setCanDrag] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PublicGift["bouquet"]["photos"][number] | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanDrag(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!selectedPhoto) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedPhoto]);

  function openGift() {
    if (reduceMotion) {
      setOpened(true);
      return;
    }
    setOpening(true);
    setBurst(true);
    window.setTimeout(() => setOpened(true), 900);
    window.setTimeout(() => setBurst(false), 3000);
  }

  return (
    <main className="paper-texture relative min-h-[100svh] overflow-hidden bg-[#e8dfcf] text-[#2e3028]">
      <Swarm active={burst} />
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.section key="opening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.5 }} className="relative z-10 flex min-h-[100svh] items-center justify-center px-6">
            <div className="relative" style={{ perspective: 1600 }}>
              <button
                type="button"
                onClick={openGift}
                disabled={opening}
                className="group relative block aspect-[634/870] w-56 outline-offset-8 md:w-72"
                aria-label="Open your Bloomnote"
              >
                <span className="absolute inset-0 translate-x-2 translate-y-2 rounded-r-lg rounded-l-sm bg-[#cbbfa8] shadow-[0_18px_40px_rgba(70,60,45,.28)]" aria-hidden />
                <span className="absolute inset-y-1 left-1 right-0 rounded-r-md bg-[#f7f1e7]" aria-hidden />
                <motion.span
                  className="paper-grain absolute inset-0 origin-left overflow-hidden rounded-r-md bg-[#f7f1e7]"
                  animate={opening ? { rotateY: -14 } : { rotateY: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.4 }}
                  aria-hidden
                />
                <motion.span
                  className="absolute inset-0 origin-left overflow-hidden rounded-r-md rounded-l-sm"
                  animate={opening ? { rotateY: -168 } : { rotateY: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.22, 0.61, 0.36, 1] }}
                  style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                >
                  <Image src={copy.coverImage} alt="" fill sizes="(max-width: 768px) 224px, 288px" className="object-cover drop-shadow-[6px_8px_0_rgba(197,183,158,.9)]" priority />
                </motion.span>
              </button>
            </div>
          </motion.section>
        ) : (
          <motion.section key="world" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 min-h-[100svh] overflow-hidden">
            <div className="relative h-[54svh] min-h-[320px] w-full overflow-hidden">
              <World world={gift.world} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0d1a24]/25 via-transparent to-[#e8dfcf]" />
              <div className="absolute inset-x-0 bottom-0 px-4 pb-5 md:px-10 md:pb-8">
                <div className="mx-auto flex max-w-5xl items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-[#f5efe3]/85">{copy.heroKicker}</p>
                    <h2 className="mt-1.5 font-serif text-[1.75rem] italic leading-tight tracking-tight text-[#f5efe3] sm:text-3xl md:text-5xl">{copy.heroTitle}</h2>
                  </div>
                  <span className="hidden shrink-0 whitespace-pre-line pb-1 text-right text-xs leading-5 text-[#f5efe3]/80 md:block">{copy.heroAside}</span>
                </div>
              </div>
            </div>
            <div className="relative px-4 pb-6 pt-7 md:px-10 md:pb-10 md:pt-10">
            <VintageFlowers reduceMotion={reduceMotion} />
            <div className="relative mx-auto max-w-5xl">
              <div className="flex items-center justify-between border-y border-[#8d806c]/60 py-2.5 text-[11px] font-semibold tracking-[0.12em] text-[#5e584b] md:py-3 md:text-[10px]">
                <span className="truncate">{copy.volume}</span>
                <span className="shrink-0">{copy.dedication}</span>
              </div>
              <div className="mt-7 grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
                <section aria-labelledby="gallery-heading" className="order-2 lg:order-1">
                  <div className="mb-4 flex items-center justify-between border-b border-[#8d806c]/50 pb-2 text-[11px] font-semibold tracking-[0.12em] text-[#716957] md:text-[10px]">
                    <h3 id="gallery-heading">{copy.galleryHeading}</h3>
                    <span>{gift.bouquet.photos.length} photographs</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3">
                    {gift.bouquet.photos.length === 0 && (
                      <p className="col-span-full rounded border border-dashed border-[#b9aa91] px-4 py-8 text-center text-sm text-[#716957]">
                        No photographs yet. Add them in the studio.
                      </p>
                    )}
                    {gift.bouquet.photos.map((photo, index) => (
                      <motion.figure key={photo.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="group">
                        <motion.button drag={canDrag && !reduceMotion} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedPhoto(photo)} className="relative block aspect-[4/5] w-full touch-manipulation overflow-hidden border-[7px] border-[#f5efe3] bg-[#f5efe3] shadow-[0_2px_0_#a99d87,3px_6px_12px_rgba(70,60,45,.16)]" aria-label={`Open photo: ${photo.caption}`}>
                          <Image src={photo.url} alt={photo.caption} fill sizes="(max-width: 640px) 45vw, 240px" className="object-cover grayscale-[18%] sepia-[12%] transition duration-500 group-hover:scale-105" />
                        </motion.button>
                        <figcaption className="mt-2 flex gap-2 text-[11px] leading-4 text-[#625c4e] md:text-[10px]">
                          <span className="font-semibold text-[#9b5b4e]">No. {String(index + 1).padStart(2, "0")}</span>
                          <span>{photo.caption}</span>
                        </figcaption>
                      </motion.figure>
                    ))}
                  </div>
                </section>
                <article className="paper-grain order-1 border border-[#b9aa91] bg-[#f5efe3] p-5 shadow-[4px_6px_0_#c7bca9,10px_16px_30px_rgba(70,60,45,.12)] sm:p-6 md:p-8 lg:order-2">
                  <p className="border-b border-[#b9aa91] pb-3 text-[11px] font-semibold tracking-[0.12em] text-[#9b5b4e] md:text-[10px]">{copy.editorLabel}</p>
                  <h1 className="mt-5 font-serif text-3xl leading-tight text-[#2e3028]">{gift.letter.title}</h1>
                  <p className="mt-5 whitespace-pre-line text-[1.02rem] leading-8 text-[#595649]">{gift.letter.body}</p>
                  <p className="mt-8 font-serif text-xl italic text-[#9b5b4e]">{gift.letter.signature}</p>
                  <div className="mt-9 border-t border-[#b9aa91] pt-5">
                    <p className="mb-3 text-[11px] font-semibold tracking-[0.12em] text-[#716957] md:text-[10px]">{copy.keepsakesLabel}</p>
                    <div className="space-y-2 text-sm text-[#595649]">
                      {gift.songs[0] ? (
                        <LocalSongPlayer title={gift.songs[0].title} artist={gift.songs[0].artist} url={gift.songs[0].url} cover={copy.songCover || gift.bouquet.photos[0]?.url} vinyl={copy.vinylImage} />
                      ) : (
                        <p className="border-b border-dotted border-[#b9aa91] pb-4 text-[#716957]">A song is on its way.</p>
                      )}
                      {gift.pins.length > 0 && <span className="flex justify-between"><span>{copy.coordinatesLabel}</span><span>{gift.pins[0].title}</span></span>}
                    </div>
                  </div>
                  {gift.videos.map((video) => (
                    <VideoKeepsake key={video.id} title={video.title} url={video.url} poster={video.poster ?? gift.bouquet.photos[0]?.url} />
                  ))}
                </article>
              </div>
              <footer className="mt-10 flex justify-between border-t border-[#8d806c]/60 pt-3 pb-5 text-[11px] tracking-[0.12em] text-[#716957] md:text-[10px]">
                <span>{copy.footerLeft}</span>
                <span>{copy.footerRight}</span>
              </footer>
            </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div className="fixed inset-0 z-30 grid place-items-center bg-[#08151d]/80 p-6 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Photo detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPhoto(null)}>
            <motion.div initial={{ scale: 0.9, y: 12 }} animate={{ scale: 1, y: 0 }} className="max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-3xl bg-[#f7f1e7] shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="relative aspect-square"><Image src={selectedPhoto.url} alt={selectedPhoto.caption} fill sizes="(max-width: 640px) 90vw, 384px" className="object-cover" /></div>
              <div className="p-5"><p className="font-serif text-xl">{selectedPhoto.caption}</p><p className="mt-2 text-sm text-[#68766b]">{selectedPhoto.takenAt}</p><button type="button" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[#c8786f]" onClick={() => setSelectedPhoto(null)}>Close</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
