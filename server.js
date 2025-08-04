const express = require('express');
const path = require('path');
const { generateSitemap, pages } = require('./generate-sitemap');
const { generateFallbackSitemap, generateMinimalSitemap } = require('./sitemap-fallback');
const app = express();
const port = process.env.PORT || 5500;

// Dynamic endpoints (must be before static middleware)
// Sitemap endpoint dengan multiple fallback
app.get('/sitemap.xml', async (req, res) => {
    const hostname = req.protocol + '://' + req.get('host');
    
    try {
        // Try method 1: Using sitemap package
        const sitemap = await generateSitemap(hostname);
        res.set('Content-Type', 'application/xml');
        res.send(sitemap);
        console.log('✅ Sitemap generated successfully using sitemap package');
    } catch (error1) {
        console.warn('⚠️ Sitemap package failed, trying fallback method:', error1.message);
        
        try {
            // Try method 2: Manual XML generation with pages
            const fallbackSitemap = generateFallbackSitemap(hostname, pages);
            res.set('Content-Type', 'application/xml');
            res.send(fallbackSitemap);
            console.log('✅ Sitemap generated successfully using fallback method');
        } catch (error2) {
            console.warn('⚠️ Fallback method failed, using minimal sitemap:', error2.message);
            
            try {
                // Try method 3: Minimal hardcoded sitemap
                const minimalSitemap = generateMinimalSitemap(hostname);
                res.set('Content-Type', 'application/xml');
                res.send(minimalSitemap);
                console.log('✅ Minimal sitemap generated successfully');
            } catch (error3) {
                console.error('❌ All sitemap methods failed:', error3.message);
                res.status(500).set('Content-Type', 'text/plain')
                   .send('Error generating sitemap. All methods failed.');
            }
        }
    }
});

// Debug endpoint untuk sitemap
app.get('/sitemap-debug', async (req, res) => {
    try {
        const hostname = req.protocol + '://' + req.get('host');
        const { pages } = require('./generate-sitemap');
        res.json({
            status: 'OK',
            hostname: hostname,
            totalPages: pages.length,
            pages: pages,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            error: error.message,
            stack: error.stack
        });
    }
});

// Robots.txt endpoint
app.get('/robots.txt', (req, res) => {
    const domain = req.protocol + '://' + req.get('host');
    const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${domain}/sitemap.xml

# Disallow test result pages for better SEO
Disallow: /test/hasil*
Disallow: /dashboard/profile-edit
Disallow: /api/

# Allow important pages
Allow: /
Allow: /home
Allow: /auth/
Allow: /dashboard
Allow: /test/

# Crawl-delay
Crawl-delay: 1`;
    
    res.set('Content-Type', 'text/plain');
    res.send(robotsTxt);
});

// Serve static files from public directory (for images, favicon, etc)
app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from src (for CSS, JS, etc)
app.use(express.static(path.join(__dirname, 'src')));
// Serve favicon files from toelfavico directory (backup)
app.use('/toelfavico', express.static(path.join(__dirname, 'toelfavico')));

// Main routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/index.html'));
});

// Auth routes
app.get('/auth/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/auth/login.html'));
});

app.get('/auth/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/auth/register.html'));
});

// Dashboard routes
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/dashboard/dashboard.html'));
});

app.get('/dashboard/profile-edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/dashboard/profile-edit.html'));
});

app.get('/dashboard/riwayat-tes', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/dashboard/riwayat-tes.html'));
});

// Test routes
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/test/index.html'));
});

app.get('/test/mulai', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/test/index.html'));
});

app.get('/test/soal', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/test/soal.html'));
});
app.get('/test/soal-listening', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/test/soal-listening.html'));
});
app.get('/test/soal-structure', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/test/soal-structure.html'));
});
app.get('/test/soal-reading', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/test/soal-reading.html'));
});
app.get('/test/soal-full', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/test/soal-full.html'));
});
app.get('/test/hasil', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/test/hasil.html'));
});
app.get('/test/hasil-listening', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/test/hasil-listening.html'));
});
app.get('/test/hasil-structure', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/test/hasil-structure.html'));
});
app.get('/test/hasil-reading', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/test/hasil-reading.html'));
});
app.get('/test/hasil-full', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/test/hasil-full.html'));
});

// API endpoints
app.post('/api/profile/update', (req, res) => {
    res.json({ success: true });
});

app.post('/api/profile/upload-photo', (req, res) => {
    res.json({ success: true });
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'src/pages/404.html'));
});

// For local development only
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

// Export the app for Vercel
module.exports = app;
