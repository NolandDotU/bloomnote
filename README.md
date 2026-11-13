# Bloomnote

Bloomnote is a private, animated digital gift: a sender combines a letter, memories, music, and a place into one shareable link.

## Milestone 1

This scaffold includes:

- Next.js 15 App Router + TypeScript + Tailwind CSS v4
- A mobile-first marketing shell at `/`
- Seed-backed public viewer at `/g/demo-bloom`
- Opening card, reduced-motion support, animated world backdrop, draggable photo bubbles, paper letter, keepsake links, and photo lightbox
- Supabase schema with owner-only RLS policies
- Optional server-side Supabase lookup for published gifts (the `owner_id` is never returned)

## Setup

```bash
cd bloomnote
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000/g/demo-bloom`. The demo works without Supabase credentials. To read published gifts, fill in `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, then run `supabase/migrations/0001_bloomnote_init.sql` in the Supabase SQL editor.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. The public viewer performs its lookup on the server and only maps public gift fields into the `PublicGift` DTO.

## Planned milestones

1. Scaffold, schema, and seed-backed viewer (current)
2. Authenticated five-step composer and draft persistence
3. Presigned, versioned media uploads and image processing
4. Publishing, QR generation, dashboard, i18n, map, and production CSP

Paid services are intentionally not added in this milestone. Cloudflare R2, if selected for milestone 3, will be added only after confirmation.
