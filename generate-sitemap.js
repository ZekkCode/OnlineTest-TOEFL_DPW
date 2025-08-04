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

async function generateSitemap(hostname = DOMAIN) {
  try {
    const sitemap = new SitemapStream({ 
      hostname: hostname,
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
    
    // Hanya simpan file jika bukan di production atau jika folder bisa diakses
    if (process.env.NODE_ENV !== 'production') {
      try {
        // Simpan sitemap ke file (hanya untuk development)
        const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
        
        // Pastikan folder public ada
        const publicDir = path.join(__dirname, 'public');
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        
        fs.writeFileSync(sitemapPath, sitemapXML.toString());
        
        console.log('✅ Sitemap berhasil dibuat di:', sitemapPath);
        console.log('📊 Total halaman:', pages.length);
        console.log('🌐 Domain:', hostname);
        console.log('📝 Anda dapat mengakses sitemap di: ' + hostname + '/sitemap.xml');
      } catch (fileError) {
        console.warn('⚠️ Could not save sitemap file (continuing with memory version):', fileError.message);
      }
    }
    
    return sitemapXML.toString();
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      pages: pages.length,
      hostname: hostname
    });
    
    // Return a basic sitemap as fallback
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${hostname}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${hostname}/dashboard</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${hostname}/test</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
    
    return fallbackSitemap;
  }
}

// Jika file ini dijalankan langsung
if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap, pages, DOMAIN };
