import axios from 'axios';
import * as cheerio from 'cheerio';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function fetchPage(url) {
  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

function calculateDiscount(currentPrice, originalPrice) {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

function formatPrice(priceInCents) {
  return `Rs. ${(priceInCents / 100).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
}

async function scrapeGulAhmed() {
  console.log('Scraping Gul Ahmed...');
  const html = await fetchPage('https://www.gulahmedshop.com/');
  if (!html) return [];

  const $ = cheerio.load(html);
  const products = [];

  $('[data-json-product]').each((i, el) => {
    try {
      const jsonStr = $(el).attr('data-json-product');
      if (!jsonStr) return;

      const productData = JSON.parse(jsonStr.replace(/&quot;/g, '"'));
      if (!productData.variants || !productData.variants[0]) return;

      const variant = productData.variants[0];
      const currentPrice = variant.price;
      const originalPrice = variant.compare_at_price;

      if (!currentPrice) return;

      const discount = calculateDiscount(currentPrice, originalPrice);
      if (discount <= 0) return;

      const productName = (productData.title || variant.name || 'Product').substring(0, 80);

      // Extract image from the product element itself
      let image = null;
      const $el = $(el);
      const imgSrcset = $el.find('img[data-srcset]').first().attr('data-srcset');

      if (imgSrcset) {
        // Extract first URL from srcset
        const imageUrl = imgSrcset.split(' ')[0].trim();
        image = imageUrl.startsWith('http') ? imageUrl : `https:${imageUrl}`;
      }

      products.push({
        id: `gulahmed-${i}`,
        name: productName,
        brand: 'Gul Ahmed',
        currentPrice: formatPrice(currentPrice),
        originalPrice: originalPrice ? formatPrice(originalPrice) : formatPrice(currentPrice),
        discount,
        image: image || `https://via.placeholder.com/400x500?text=${encodeURIComponent(productName.substring(0, 20))}`,
        link: productData.url ? `https://www.gulahmedshop.com${productData.url}` : `https://www.gulahmedshop.com/products/${productData.handle}`,
        category: 'Women',
        scrapedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Parse error:', err.message);
    }
  });

  return products.slice(0, 100);
}

async function scrapeSapphire() {
  console.log('Scraping Sapphire...');
  const html = await fetchPage('https://pk.sapphireonline.pk/');
  if (!html) return [];

  const $ = cheerio.load(html);
  const products = [];

  $('[data-json-product]').each((i, el) => {
    try {
      const jsonStr = $(el).attr('data-json-product');
      if (!jsonStr) return;

      const productData = JSON.parse(jsonStr.replace(/&quot;/g, '"'));
      if (!productData.variants || !productData.variants[0]) return;

      const variant = productData.variants[0];
      const currentPrice = variant.price;
      const originalPrice = variant.compare_at_price;

      if (!currentPrice) return;

      const discount = calculateDiscount(currentPrice, originalPrice);
      if (discount <= 0) return;

      const productName = (productData.title || variant.name || 'Product').substring(0, 80);

      // Extract image from the product element itself
      let image = null;
      const $el = $(el);
      const imgSrcset = $el.find('img[data-srcset]').first().attr('data-srcset');

      if (imgSrcset) {
        // Extract first URL from srcset
        const imageUrl = imgSrcset.split(' ')[0].trim();
        image = imageUrl.startsWith('http') ? imageUrl : `https:${imageUrl}`;
      }

      products.push({
        id: `sapphire-${i}`,
        name: productName,
        brand: 'Sapphire',
        currentPrice: formatPrice(currentPrice),
        originalPrice: originalPrice ? formatPrice(originalPrice) : formatPrice(currentPrice),
        discount,
        image: image || `https://via.placeholder.com/400x500?text=${encodeURIComponent(productName.substring(0, 20))}`,
        link: productData.url ? `https://pk.sapphireonline.pk${productData.url}` : `https://pk.sapphireonline.pk/products/${productData.handle}`,
        category: 'Women',
        scrapedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Parse error:', err.message);
    }
  });

  return products.slice(0, 100);
}

async function scrapeAllSites() {
  const all = [
    ...(await scrapeSapphire()),
    ...(await scrapeGulAhmed())
  ];

  // Filter only discounted items and remove duplicates
  return all
    .filter(p => p.discount > 0)
    .filter((p, i, arr) => arr.findIndex(x => x.name === p.name && x.brand === p.brand) === i)
    .sort((a, b) => b.discount - a.discount);
}

export default scrapeAllSites;
