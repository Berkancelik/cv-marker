# CV Dock

Modern, açık temalı bir **CV / özgeçmiş oluşturucu**. Kullanıcı 300+ profesyonel şablon arasından seçer, bilgilerini doldurur, canlı önizlemeyi görür ve CV'sini gerçek bir PDF olarak indirir ya da mobilde doğrudan paylaşır. Arayüz ve CV içeriği **Türkçe / İngilizce** desteklidir. Kurumsal renkler (adaçayı yeşili / antrasit / krem) ve markalı bir açılış (splash) ekranıyla gelir.

## Özellikler

- 🎨 **300+ profesyonel şablon** — stil kategorileriyle taranır (Modern, Minimal, Profesyonel, Kreatif, Yönetici, Teknik, Akademik, Zarif, Klasik). 12 düzen motoru × 38 renklik kurumsal palet × 7 başlık stili (alt çizgi / sol bar / hap / blok / sade / nokta / çift çizgi) × fotoğraf biçimi (yuvarlak / squircle / kare)
- 🔎 **Kategori filtresi + arama** — galeride şablonları kategoriye göre süz veya isimle ara (önizlemeler görünüme girince tembel yüklenir)
- 👀 **Canlı önizleme** — yazdıkça anında A4 önizleme
- 🌍 **TR / EN** — hem arayüz hem CV içeriği için iki dil
- 🎚️ **Vurgu rengi** — hazır paletten veya özel renk seçiciyle her şablonu kişiselleştir
- 📄 **Gerçek PDF indir** — `jsPDF` + `html2canvas` ile A4 PDF oluşturulur; tarayıcı yazdırma diyaloğuna gerek yok
- 📤 **Mobilde paylaş** — Web Share API ile PDF'i doğrudan WhatsApp, e-posta, AirDrop vb.'ye gönder
- 📱 **Mobil uyumlu** — dokunmatik dostu form, esneyen araç çubuğu, PWA manifesti ve markalı splash ekran
- 📸 **Fotoğraf yükleme** — yuvarlak profil fotoğrafı (yoksa baş harfleri gösterilir)
- 💾 **Otomatik kayıt** — tüm veriler tarayıcıda `localStorage`'da saklanır, hiçbir yere gönderilmez
- 🧩 Bölümler: Kişisel bilgiler, özet, iş deneyimi, eğitim, projeler, yetenekler (seviye barları), diller, sertifikalar

## Teknolojiler

- [Next.js 14](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS (açık tema, kurumsal adaçayı/antrasit/krem paleti)
- Zustand (durum yönetimi + kalıcılık)
- lucide-react (ikonlar)
- jsPDF + html2canvas (istemci taraflı PDF üretimi) + Web Share API
- Ziyaretçi sayacı için tek serverless route (`/api/visits`) + Upstash Redis (opsiyonel)

> Not: CV verisi tamamen istemci taraflıdır; hiçbir yere gönderilmez. Tek istisna, opsiyonel ziyaretçi sayacıdır (aşağıya bakın) — o da yalnızca toplam bir sayıyı Upstash'te tutar.

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

## Ziyaretçi sayacı (opsiyonel, Upstash Redis)

Ayrı bir veritabanı kurmadan, footer'da canlı bir **"… ziyaretçi"** sayısı gösterilir. Sayı ücretsiz **Upstash Redis**'te tek bir anahtarda (`cvdock:visits`) tutulur; `/api/visits` route'u okur (`GET`) ve ilk oturumda artırır (`POST`). Her tarayıcı oturumu bir kez sayılır (`sessionStorage`).

**Kurulum yoksa sorun olmaz:** env değişkenleri tanımlı değilse route `configured:false` döner ve sayaç görünmez — site normal çalışır.

**Vercel'de aktifleştirme:**

1. Vercel projesi → **Storage** (veya Marketplace) → **Upstash Redis** ekle (ücretsiz plan). Vercel iki değişkeni otomatik ekler:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
2. (Alternatif) Upstash panelinden bir Redis DB açıp bu iki değeri **Settings → Environment Variables**'a elle ekle.
3. **Redeploy** et → sayaç otomatik görünür.

Yerelde denemek için proje köküne `.env.local` ekleyip aynı iki değişkeni koyman yeterli.

## PDF indirme & paylaşma

Editör sağ üstteki **PDF indir** düğmesi, CV'yi ekran dışında tam boyutta (A4) yeniden çizip `html2canvas` ile görüntüye, ardından `jsPDF` ile çok sayfalı bir PDF'e dönüştürür ve dosyayı indirir — tarayıcı yazdırma diyaloğuna ihtiyaç yoktur. Mobil cihazlarda ayrıca bir **Paylaş** düğmesi görünür; bu, Web Share API üzerinden PDF dosyasını doğrudan işletim sisteminin paylaşım sayfasına (WhatsApp, e-posta, AirDrop, vb.) verir. Web Share desteklenmiyorsa paylaş düğmesi otomatik olarak indirmeye düşer.

## Proje yapısı

```
src/
  app/
    page.tsx           # Açılış sayfası + şablon galerisi
    editor/page.tsx    # Editör (form + canlı önizleme + araç çubuğu)
    layout.tsx, globals.css
    icon.svg           # Favicon (CV Dock markası)
    manifest.ts        # PWA manifesti
  components/
    Logo.tsx           # CV Dock SVG logo (mark + lockup)
    SplashScreen.tsx   # Açılış (splash) ekranı
    cv/
      CVRenderer.tsx   # Düzen motoru (8 layout türü)
      blocks.tsx       # Paylaşılan CV bölüm blokları
    editor/
      EditorForm.tsx
      ExportMenu.tsx   # PDF indir / paylaş
      CVAnalysis.tsx
    TemplateThumb.tsx  # Galeri önizlemeleri
    ui.tsx             # Ortak form/dil bileşenleri
  lib/
    templates.ts       # 300+ şablon (52 flagship + generate)
    pdf.ts             # PDF üretimi (jsPDF + html2canvas)
    store.ts           # Zustand store (localStorage)
    i18n.ts            # TR/EN sözlük
    types.ts, sampleData.ts
```

## Yeni şablon ekleme

`src/lib/templates.ts` — 52 flagship şablon `CURATED` dizisinde (her biri açık bir stil `category`'siyle); kalan katalog ise `generate(268)` ile `FAMILIES × PALETTES × HEADINGS × PHOTO_SHAPES` kombinasyonundan otomatik üretilir ve `classify()` ile stile göre kategorilenir. Tek bir flagship şablon eklemek için `CURATED`'a ekle:

```ts
{ id: "yeni", name: "Yeni", layout: "sidebar-left", accent: "#63722f", font: "sans", showPhoto: true, accentBg: true, photoShape: "squircle", headingStyle: "double", category: "Kreatif" }
```

`layout` değerleri: `classic`, `sidebar-left`, `sidebar-right`, `sidebar-header`, `header-banner`, `top-band`, `left-rail`, `boxed-header`, `timeline`, `minimal`, `compact-two-col`, `elegant-serif`.
`headingStyle` değerleri: `underline`, `bar`, `pill`, `block`, `plain`, `dot`, `double`. `photoShape`: `round`, `squircle`, `square`. `category` (stil): `Modern`, `Minimal`, `Profesyonel`, `Kreatif`, `Yönetici`, `Teknik`, `Akademik`, `Zarif`, `Klasik`. Toplam sayıyı değiştirmek için `generate(268)` çağrısındaki sayıyı güncelle.
