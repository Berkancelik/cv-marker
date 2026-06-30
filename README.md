# CV Marker

Modern, açık temalı bir **CV / özgeçmiş oluşturucu**. Kullanıcı 120+ profesyonel şablon arasından seçer, bilgilerini doldurur, canlı önizlemeyi görür ve tek tıkla PDF olarak indirir. Arayüz ve CV içeriği **Türkçe / İngilizce** desteklidir.

## Özellikler

- 🎨 **120+ profesyonel şablon** — 12 düzen motoru (kenar çubuğu, kenar başlık, banner, üst şerit, ince çizgi, kutu başlık, zaman çizelgesi, minimal, klasik, zarif serif, iki sütun) × renk paleti × başlık stilleri (alt çizgi / sol bar / hap / blok / sade)
- 🔎 **Kategori filtresi + arama** — galeride şablonları kategoriye göre süz veya isimle ara (önizlemeler görünüme girince tembel yüklenir)
- 👀 **Canlı önizleme** — yazdıkça anında A4 önizleme
- 🌍 **TR / EN** — hem arayüz hem CV içeriği için iki dil
- 🎚️ **Vurgu rengi** — hazır paletten veya özel renk seçiciyle her şablonu kişiselleştir
- 📄 **PDF indir** — tarayıcı yazdırma diyaloğundan "PDF olarak kaydet"
- 📸 **Fotoğraf yükleme** — yuvarlak profil fotoğrafı (yoksa baş harfleri gösterilir)
- 💾 **Otomatik kayıt** — tüm veriler tarayıcıda `localStorage`'da saklanır, hiçbir yere gönderilmez
- 🧩 Bölümler: Kişisel bilgiler, özet, iş deneyimi, eğitim, projeler, yetenekler (seviye barları), diller, sertifikalar

## Teknolojiler

- [Next.js 14](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS (açık tema)
- Zustand (durum yönetimi + kalıcılık)
- lucide-react (ikonlar)

> Not: Uygulama tamamen istemci taraflıdır; ayrı bir backend/veritabanı gerektirmez.

## Kurulum

```bash
npm install
npm run dev      # http://localhost:3000
```

Üretim derlemesi:

```bash
npm run build
npm start
```

## PDF olarak indirme

Editör sağ üstteki **PDF indir** düğmesi tarayıcının yazdırma penceresini açar. Hedef olarak **"PDF olarak kaydet"** seçilir. Yazdırma stilleri yalnızca CV sayfasını (A4, kenarlıksız) bastıracak şekilde ayarlanmıştır.

## Proje yapısı

```
src/
  app/
    page.tsx           # Açılış sayfası + şablon galerisi
    editor/page.tsx    # Editör (form + canlı önizleme + araç çubuğu)
    layout.tsx, globals.css
  components/
    cv/
      CVRenderer.tsx   # Düzen motoru (8 layout türü)
      blocks.tsx       # Paylaşılan CV bölüm blokları
    editor/EditorForm.tsx
    TemplateThumb.tsx  # Galeri önizlemeleri
    ui.tsx             # Ortak form/dil bileşenleri
  lib/
    templates.ts       # 20 şablon tanımı
    store.ts           # Zustand store (localStorage)
    i18n.ts            # TR/EN sözlük
    types.ts, sampleData.ts
```

## Yeni şablon ekleme

`src/lib/templates.ts` — el yapımı şablonlar `CURATED` dizisinde; geniş katalog ise `generate(100)` ile `FAMILIES × PALETTES × HEADINGS` kombinasyonundan otomatik üretilir. Tek bir el yapımı şablon eklemek için `CURATED`'a ekle:

```ts
{ id: "yeni", name: "Yeni", layout: "sidebar-left", accent: "#3366ff", font: "sans", showPhoto: true, accentBg: true }
```

`layout` değerleri: `classic`, `sidebar-left`, `sidebar-right`, `sidebar-header`, `header-banner`, `top-band`, `left-rail`, `boxed-header`, `timeline`, `minimal`, `compact-two-col`, `elegant-serif`.
`headingStyle` değerleri: `underline`, `bar`, `pill`, `block`, `plain`. Üretilen şablon sayısını artırmak için `generate(100)` çağrısındaki sayıyı değiştir.
