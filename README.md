# AGENTS.md

## Ringkasan Proyek

Proyek ini adalah situs tools kolektif untuk `tools.kazuyatech.id` yang dibangun dengan Astro, React, dan Tailwind CSS. Fokus utama proyek adalah membuat berbagai utility tools yang ringan, cepat, SEO-friendly, dan siap dipublikasikan dalam bahasa Indonesia sekaligus multi-bahasa.

Tujuan utama:
- menampilkan kumpulan utility tools seperti encoder/decoder, formatter, generator, extractor, dan builder
- menjaga performa dan aksesibilitas tinggi
- menjaga konsistensi visual dengan design system yang terinspirasi dari Wise
- menyiapkan halaman SEO dengan metadata, canonical URL, dan structured data

## Stack Teknologi

- Astro 6.x
- `@astrojs/react` dengan React 19 + JSX
- Tailwind CSS 4.x via `@tailwindcss/vite` (bukan PostCSS)
- Iconify MDI dan Carbon
- `astro-icon` untuk rendering ikon di `.astro` dan React
- pnpm sebagai package manager
- Node >= 22.12.0

## Perintah Utama

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

Keterangan:
- `pnpm dev` menjalankan server lokal di `localhost:4321`
- `pnpm build` menghasilkan build produksi di folder `dist/`
- `pnpm preview` untuk menampilkan hasil build produksi lokal

## Struktur Repository

```text
.
├── .agents/
│   ├── DESIGN.md
│   └── prd.md
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── og-image.png
│   ├── robots.txt
│   └── site.webmanifest
├── src/
│   ├── components/
│   │   ├── ads/
│   │   │   └── AdBanner.jsx
│   │   ├── base64-codec/
│   │   ├── case-converter/
│   │   ├── cover-letter/
│   │   ├── cv-builder/
│   │   ├── daget-hunter/
│   │   ├── extract-phone/
│   │   ├── extract-url/
│   │   ├── json-formatter/
│   │   ├── layout/
│   │   │   ├── Footer.astro
│   │   │   ├── Header.astro
│   │   │   ├── SeoHead.astro
│   │   │   └── ToolContent.astro
│   │   ├── lorem-ipsum/
│   │   ├── password-generator/
│   │   ├── repeater-text/
│   │   ├── replace-text/
│   │   ├── ui/
│   │   │   ├── Icon.jsx
│   │   │   ├── icons-data.js
│   │   │   └── index.jsx
│   │   └── word-counter/
│   ├── i18n/
│   │   ├── en.js
│   │   ├── hi.js
│   │   ├── id.js
│   │   ├── index.js
│   │   ├── ja.js
│   │   ├── locales.js
│   │   ├── ms.js
│   │   ├── pt.js
│   │   ├── ru.js
│   │   ├── tl.js
│   │   ├── tools.js
│   │   └── zh.js
│   ├── pages/
│   │   ├── 404.astro
│   │   ├── [lang]/
│   │   │   ├── 404.astro
│   │   │   ├── index.astro
│   │   │   └── tools/
│   │   │       └── [slug].astro
│   │   └── index.astro
│   ├── styles/
│   │   └── global.css
│   └── icons/
│       └── .gitkeep
├── AGENTS.md
├── README.md
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
└── agent.md
```

## Aturan Membuat Tool Baru

Untuk menambahkan tool baru, ikuti pola berikut:

1. Buat file React component di `src/components/<tool-name>/index.jsx`
2. Buat halaman Astro di `src/pages/tools/<tool-name>.astro` atau gunakan pola routing terlokalisasi di `src/pages/[lang]/tools/[slug].astro`
3. Tambahkan link / card ke homepage atau halaman daftar tools
4. Gunakan `client:load` untuk komponen React yang perlu dihydrate
5. Pastikan komponen bersifat functional component (tanpa class component)

Contoh pola yang umum digunakan:
- `useState` untuk input/output
- `useMemo` atau perhitungan sederhana untuk hasil transformasi data
- UI dengan Tailwind utility classes
- ukuran container default: `max-w-[680px] mx-auto`

## Pola Komponen dan UI

Setiap tool biasanya dibuat sebagai komponen mandiri di folder masing-masing, dengan struktur yang terisolasi.

Prinsip utama:
- tiap tool berdiri sendiri
- input dan output dikelola dengan state
- layout mengikuti design system yang terdefinisi di `.agents/DESIGN.md`
- ikon menggunakan shared `Icon` component

Untuk `.astro` file:

```astro
<Icon name="mdi:content-copy" />
```

Untuk React component:

```jsx
import Icon from '../ui/Icon';

<Icon name="mdi:content-copy" />
```

Icon names mengikuti Iconify full name, misalnya:
- `mdi:content-copy`
- `carbon:language`
- `mdi:shield-lock`

File `src/components/ui/icons-data.js` berisi subset ikon yang diizinkan. Saat menambahkan icon baru, pastikan daftar ikon di `astro.config.mjs` juga diperbarui agar kompatibel dengan `astro-icon`.

## Design System

Design system mengacu pada dokumentasi di `.agents/DESIGN.md`, dengan inspirasi dari Wise.

### Warna utama
- Near Black: `#0e0f0c`
- Wise Green: `#9fe870`
- Dark Green: `#163300`
- Light Mint: `#e2f6d5`

### Gaya UI
- tombol berbentuk pill dengan radius `9999px`
- hover: `scale(1.05)`
- active: `scale(0.95)`
- kartu: radius `30px`
- border: `1px solid rgba(14,15,12,0.12)`
- heading: font-weight 900, line-height 0.85
- body text: Inter semibold 600
- `font-feature-settings` / OpenType `"calt"` pada semua teks

### Layout
- default container: `max-w-[680px] mx-auto`
- prioritize clean, readable, and high contrast layout

## SEO & Metadata (Wajib)

Semua halaman harus memenuhi standar SEO yang tinggi:

- `<title>` wajib ada
- `<meta name="description">` wajib ada
- OG tags wajib ada
- Twitter Card wajib ada
- canonical URL wajib ada
- `robots: index, follow`
- `lang="id-ID"` atau bahasa yang sesuai
- menggunakan structured data JSON-LD bila relevan

Halaman dibuat untuk bahasa Indonesia secara default, tetapi juga terdapat multi-locale routing.

## Konfigurasi Astro & Routing

Project ini menggunakan konfigurasi Astro dengan i18n dan sitemap:

- `site: "https://tools.kazuyatech.id"`
- `output: "static"`
- routing default locale: `id`
- locales aktif: `id`, `en`, `ru`, `zh-CN`, `ms`, `tl`, `ja`, `pt-BR`, `hi`

File `src/pages/index.astro` saat ini redirect ke `/id/`, sehingga semua halaman utama terarah ke route default bahasa Indonesia.

Terdapat redirect untuk beberapa tool legacy path, misalnya:
- `/tools/daget-hunter` → `/id/tools/daget-hunter/`
- `/tools/repeater-text` → `/id/tools/repeater-text/`
- `/tools/extract-url` → `/id/tools/extract-url/`
- dan seterusnya

## Ad Integration

Komponen iklan ada di `src/components/ads/AdBanner.jsx`.

Pola yang digunakan:
- `AdBanner adKey={KEY} width={728} height={90}`
- `AdNative src={SRC} containerId={ID}`

Catatan penting:
- popunder hanya aman dipakai di halaman homepage atau encode page
- disarankan dimatikan di halaman yang sensitif atau decode-focused

## I18n dan Konten

Project ini memiliki folder `src/i18n` untuk teks terlokalisasi.

File yang relevan:
- `src/i18n/id.js`
- `src/i18n/en.js`
- `src/i18n/ru.js`
- `src/i18n/zh.js`
- `src/i18n/ms.js`
- `src/i18n/tl.js`
- `src/i18n/ja.js`
- `src/i18n/pt.js`
- `src/i18n/hi.js`

Semua konten UI yang bersifat user-facing sebaiknya mengikuti Bahasa Indonesia, sesuai arahan proyek.

## Konvensi Penulisan Kode

- file dan folder gunakan kebab-case
- React components dibuat functional-only
- tidak menambahkan komentar di kode kecuali diminta secara eksplisit
- gunakan Astro/React pola yang konsisten dengan tool lain di repo
- buat halaman yang ringan, cepat, dan mudah dipahami

## Panduan Singkat untuk Agent / Contributor

Saat mengerjakan proyek ini:

- selalu mengikuti pola tool yang sudah ada
- jangan mengubah stack tanpa alasan yang jelas
- gunakan Tailwind utility classes, bukan custom CSS yang berlebihan
- Pastikan metadata SEO dan aksesibilitas tidak diabaikan
- utamakan pengalaman pengguna yang jelas dan cepat
- sesuai desain: bersih, berani, modern, dengan aksen hijau khas Wise

## Catatan Tambahan

Proyek ini memiliki dokumentasi product dan design di folder `.agents/`:
- `.agents/DESIGN.md` → sistem desain visual
- `.agents/prd.md` → PRD awal proyek

Dokumen ini berperan sebagai panduan operasional untuk contributor dan AI assistant agar konsisten dengan arsitektur proyek, style, dan target produk.

## Final Rule

Jangan mengubah struktur atau gaya inti proyek tanpa mempertimbangkan:
- performa
- SEO
- aksesibilitas
- konsistensi desain
- keterbacaan bahasa Indonesia

Semua keputusan implementasi harus mengutamakan kualitas produk untuk website utility tools publik.
