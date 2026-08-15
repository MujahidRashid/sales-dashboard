import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import scrapeAllSites from './scrapers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = './data/sales.json';

app.use(cors());
app.use(express.json());

// Serve static files from client build
const distPath = path.join(__dirname, 'client/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Ensure data directory exists
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data', { recursive: true });
}

// Initialize with sample data if file doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  const sampleData = {
    lastUpdated: new Date().toISOString(),
    products: []
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(sampleData, null, 2));
}

// Get all sales (with mode support)
app.get('/api/sales', (req, res) => {
  const mode = req.query.mode || 'mock'; // default to mock

  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    if (mode === 'real') {
      // Real data from scraper (may be empty if scraper hasn't run)
      res.json(data.products);
    } else {
      // Return all available data (mock + any real if present)
      res.json(data.products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read sales data' });
  }
});

// Trigger scraping
app.post('/api/scrape', async (req, res) => {
  try {
    const products = await scrapeAllSites();
    const data = {
      lastUpdated: new Date().toISOString(),
      products
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, count: products.length, data });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape data', details: error.message });
  }
});

// Get data source info
app.get('/api/data-source', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const isMockData = data.products.some(p => p.id && p.id.startsWith('sample-'));

    res.json({
      isMock: isMockData,
      lastUpdated: data.lastUpdated,
      productCount: data.products.length
    });
  } catch (error) {
    res.status(500).json({ isMock: true, error: 'Failed to determine data source' });
  }
});

// Get stats
app.get('/api/stats', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const products = data.products;
    const brands = new Set(products.map(p => p.brand));
    const avgDiscount = products.length > 0
      ? (products.reduce((sum, p) => sum + (p.discount || 0), 0) / products.length).toFixed(1)
      : 0;

    res.json({
      totalProducts: products.length,
      brands: Array.from(brands),
      averageDiscount: avgDiscount,
      lastUpdated: data.lastUpdated
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// SPA fallback - serve index.html for non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'client/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Frontend not built' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('POST /api/scrape to fetch latest sales data');
});
