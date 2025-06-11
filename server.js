const express = require('express');
const path = require('path');
const app = express();
const port = 5500;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

// Main routes
app.get('/', (req, res) => {
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
app.get('/test/mulai', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/test/soal.html'));
});

// API endpoints
app.post('/api/profile/update', (req, res) => {
    res.json({ success: true });
});

app.post('/api/profile/upload-photo', (req, res) => {
    res.json({ success: true });
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'src/pages/404.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});