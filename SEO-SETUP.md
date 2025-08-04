# SEO Setup untuk TOEL.id

## ✅ Fitur SEO yang Sudah Diimplementasikan

### 1. **Sitemap.xml**

- **File**: `generate-sitemap.js`
- **Endpoint**: `/sitemap.xml`
- **Akses**: https://domain-anda.com/sitemap.xml
- **Jumlah halaman**: 19 halaman utama
- **Update otomatis**: Ya, setiap kali endpoint diakses

### 2. **Robots.txt**

- **Endpoint**: `/robots.txt`
- **Akses**: https://domain-anda.com/robots.txt
- **Fitur**:
  - Mengizinkan semua crawler
  - Mengarahkan ke sitemap.xml
  - Memblokir halaman hasil tes (privacy)
  - Domain dinamis (localhost untuk dev, production untuk live)

### 3. **Web App Manifest**

- **File**: `site.webmanifest`
- **Fitur**: PWA support, app icons, theme colors

## 🚀 Cara Menggunakan

### Generate Sitemap Manual

```bash
npm run generate-sitemap
```

### Submit ke Google Search Console

1. Buka [Google Search Console](https://search.google.com/search-console)
2. Tambahkan domain website Anda
3. Verifikasi kepemilikan domain
4. Masuk ke menu "Sitemaps"
5. Submit sitemap: `https://domain-anda.com/sitemap.xml`

### Submit ke Bing Webmaster Tools

1. Buka [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Tambahkan website Anda
3. Submit sitemap di bagian "Sitemaps"

## 📊 Struktur Prioritas Halaman

| Halaman        | Priority | Change Frequency | Keterangan           |
| -------------- | -------- | ---------------- | -------------------- |
| `/` (Home)     | 1.0      | weekly           | Halaman utama        |
| `/dashboard`   | 0.9      | weekly           | Dashboard utama      |
| `/test/*`      | 0.8-0.9  | weekly/monthly   | Halaman tes          |
| `/auth/*`      | 0.7      | monthly          | Login/Register       |
| `/test/hasil*` | 0.6      | monthly          | Hasil tes (dibatasi) |

## 🔧 Konfigurasi Domain

**PENTING**: Ubah domain di file `generate-sitemap.js`:

```javascript
const DOMAIN = "https://domain-anda.com"; // Ganti dengan domain aktual
```

## 📝 Script NPM Tersedia

```json
{
  "generate-sitemap": "node generate-sitemap.js",
  "build:sitemap": "npm run generate-sitemap"
}
```

## 🎯 Tips SEO Tambahan

1. **Meta Tags**: Pastikan setiap halaman memiliki title dan description yang unik
2. **Open Graph**: Tambahkan meta tags untuk social media sharing
3. **Schema Markup**: Pertimbangkan menambahkan structured data
4. **Page Speed**: Optimisasi loading time dengan lazy loading dan compression
5. **Mobile-First**: Pastikan semua halaman responsive

## 🔍 Monitoring

- **Google Search Console**: Monitor indexing status dan search performance
- **Google Analytics**: Track user behavior dan traffic
- **Core Web Vitals**: Monitor page experience metrics

## 📞 Support

Jika ada masalah dengan SEO setup, periksa:

1. Server berjalan dengan benar
2. Endpoint `/sitemap.xml` dan `/robots.txt` dapat diakses
3. Domain sudah dikonfigurasi dengan benar
4. Sitemap berhasil di-generate tanpa error

---

_Generated for TOEL.id - Online TOEFL Test Platform_
