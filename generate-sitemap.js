const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');
const path = require('path');

// Domain utama website
const DOMAIN = 'https://onlinetest-toefl-dpw.vercel.app'; // Ganti dengan domain aktual

// Daftar halaman yang akan dimasukkan ke sitemap
const pages = [
  // Halaman utama
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/home', changefreq: 'weekly', priority: 1.0 },
  
  // Halaman auth
  { url: '/auth/login', changefreq: 'monthly', priority: 0.7 },
  { url: '/auth/register', changefreq: 'monthly', priority: 0.7 },
  
  // Halaman dashboard
  { url: '/dashboard', changefreq: 'weekly', priority: 0.9 },
  { url: '/dashboard/profile-edit', changefreq: 'monthly', priority: 0.6 },
  { url: '/dashboard/riwayat-tes', changefreq: 'weekly', priority: 0.8 },
  
  // Halaman test
  { url: '/test', changefreq: 'weekly', priority: 0.9 },
  { url: '/test/mulai', changefreq: 'weekly', priority: 0.9 },
  { url: '/test/soal', changefreq: 'monthly', priority: 0.8 },
  { url: '/test/soal-listening', changefreq: 'monthly', priority: 0.8 },
  { url: '/test/soal-structure', changefreq: 'monthly', priority: 0.8 },
  { url: '/test/soal-reading', changefreq: 'monthly', priority: 0.8 },
  { url: '/test/soal-full', changefreq: 'monthly', priority: 0.8 },
  { url: '/test/hasil', changefreq: 'monthly', priority: 0.6 },
  { url: '/test/hasil-listening', changefreq: 'monthly', priority: 0.6 },
  { url: '/test/hasil-structure', changefreq: 'monthly', priority: 0.6 },
  { url: '/test/hasil-reading', changefreq: 'monthly', priority: 0.6 },
  { url: '/test/hasil-full', changefreq: 'monthly', priority: 0.6 }
];

async function generateSitemap() {
  try {
    const sitemap = new SitemapStream({ 
      hostname: DOMAIN,
      cacheTime: 600000, // 600 sec - cache purge period
    });

    // Tambahkan semua halaman ke sitemap
    pages.forEach(page => {
      sitemap.write({
        url: page.url,
        changefreq: page.changefreq,
        priority: page.priority,
        lastmod: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
      });
    });

    sitemap.end();

    // Konversi stream ke string
    const sitemapXML = await streamToPromise(sitemap);
    
    // Simpan sitemap ke file
    const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
    
    // Pastikan folder public ada
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(sitemapPath, sitemapXML.toString());
    
    console.log('✅ Sitemap berhasil dibuat di:', sitemapPath);
    console.log('📊 Total halaman:', pages.length);
    console.log('🌐 Domain:', DOMAIN);
    console.log('📝 Anda dapat mengakses sitemap di: ' + DOMAIN + '/sitemap.xml');
    
    return sitemapXML.toString();
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    throw error;
  }
}

// Jika file ini dijalankan langsung
if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap, pages, DOMAIN };
