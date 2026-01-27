'use strict';

const path = require('path');
const express = require('express');
const convert = require('../src/index');

const app = express();
const PORT = process.env.PORT || 4173;

// Allow reasonably large Lottie files.
app.use(express.json({ limit: '25mb' }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/convert', async (req, res) => {
  try {
    const animation = req.body;
    if (!animation || typeof animation !== 'object') {
      return res.status(400).json({ error: 'Request body must be a Lottie JSON object.' });
    }

    const xml = await convert(animation);
    res.json({ xml });
  } catch (err) {
    const message = err && err.message ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, port: PORT });
});

app.listen(PORT, () => {
  // Keep this log short and useful in a terminal.
  console.log(`Web UI running at http://localhost:${PORT}`);
});
