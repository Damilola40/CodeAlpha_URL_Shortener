const express = require('express');
const {nanoid} = require('nanoid');
const db = require('./database');
const {URL} = require('url');

const app = express();
app.use(express.json());
app.use(express.static('public')); // serves the HTML/CSS

const PORT = 3000;

app.post('/api/shorten', (req, res) => {
    const { originalUrl } = req.body;

    // Validate URL
    try {
        new URL(originalUrl);
    } catch (error){
        return res.status(400).json({ error: 'Invalid URL' });
    }

    // Generate short code
    const shortCode = nanoid(6);
    console.log(`Creating: ${shortCode} → ${originalUrl}`); // ✅ debug log

    // Save to database
    try {
        const result = db.prepare('INSERT INTO urls (short_code, original_url) VALUES (?, ?)').run(shortCode, originalUrl);
        console.log(`Inserted successfully:`, result); // ✅ debug log
        res.json({ shortUrl: `http://localhost:${PORT}/${shortCode}` });
    } catch {
        console.error('Insert error:', error); // ✅ debug log
        res.status(500).json({ error: 'Error creating short URL' });
    }
});

// GET endpoint to redirect
app.get('/:shortCode', (req, res) => {
    console.log('GET params:', req.params);
    const { shortCode } = req.params;
    console.log(`Looking for shortCode: ${shortCode}`); // ✅ debug

    const row = db.prepare('SELECT original_url FROM urls WHERE short_code = ?').get(shortCode);
    console.log(`Found row:`, row);

    if (!row) {
        return res.status(404).json({ error: 'Short URL not found' });
    }

    res.redirect(row.ORIGINAL_URL);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});