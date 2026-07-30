# PK Fashion Sales Dashboard

A real-time sales dashboard for Pakistani clothing brands. Scrapes and displays discounted items from top fashion retailers in Pakistan.

## Features

✨ **Real-Time Scraping** - Automatically fetches latest sales data from Pakistani fashion sites
🔍 **Advanced Filtering** - Filter by brand, discount percentage, and search by name
📊 **Smart Sorting** - Sort by discount, price, and more
🛍️ **Direct Links** - Quick links to buy on original retailer sites
📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
💾 **Data Caching** - Efficient caching to reduce server load

## Supported Brands

- **Sapphire** - https://pk.sapphireonline.pk/
- **Gul Ahmed** - https://www.gulahmedshop.com/

## Tech Stack

**Backend:**
- Node.js with Express
- Cheerio for web scraping
- Axios for HTTP requests

**Frontend:**
- React 18
- Vite
- CSS3 with modern layout techniques

## Installation

1. **Clone or navigate to the project:**
```bash
cd /Users/mujahid.rashid/Personal/sales-dashboard
```

2. **Install root dependencies:**
```bash
npm install
```

3. **Install client dependencies:**
```bash
cd client && npm install && cd ..
```

## Running the Project

### Development Mode

Start both the backend server and React dev server:

```bash
npm run dev
```

This will start:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

### Production Build

```bash
npm run build
```

## API Endpoints

### Get Sales Data
```
GET /api/sales
```
Returns array of all currently discounted products.

### Trigger Scraping
```
POST /api/scrape
```
Manually trigger a scrape of all configured sites. Returns the newly scraped products.

### Get Statistics
```
GET /api/stats
```
Returns dashboard statistics:
- Total products count
- Available brands
- Average discount percentage
- Last update timestamp

## Data Structure

Each product contains:
```javascript
{
  id: string,
  name: string,
  brand: string,
  currentPrice: string,
  originalPrice: string,
  discount: number,           // percentage
  image: string,              // URL
  link: string,               // Product link
  category: string,
  scrapedAt: string           // ISO timestamp
}
```

## Configuration

### Adding New Brands

Edit `scrapers/index.js` and add a new scraper function:

```javascript
async function scrapeNewBrand() {
  const html = await fetchPage('https://example.com');
  // Extract product data
  return products;
}

async function scrapeAllSites() {
  return [
    ...(await scrapeSapphire()),
    ...(await scrapeGulAhmed()),
    ...(await scrapeNewBrand())  // Add here
  ];
}
```

### Updating Selectors

If a website's HTML structure changes, update the CSS selectors in the corresponding scraper function in `scrapers/index.js`.

## Usage Tips

1. **Initial Load** - The app starts with demo/mock data. Click "🔄 Refresh Sales" to fetch real data.
2. **Filtering** - Use multiple filters together for more precise results.
3. **Sorting** - Highest Discount is the default sort option.
4. **Mobile** - The dashboard is fully responsive and mobile-friendly.

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
```bash
# Change port in server.js
PORT=5001 npm run server

# Or in client/vite.config.js
# Change server.port to 3001
```

### Scraping Fails
- Check internet connection
- Verify websites are accessible
- Website structure may have changed - update selectors in `scrapers/index.js`

### Empty Results
- Click "🔄 Refresh Sales" to trigger scraping
- Check browser console for errors
- Verify API is running at `http://localhost:5000`

## Performance

- Dashboard displays up to 100 products at a time
- Client-side filtering and sorting for instant response
- Server caches scraped data to reduce requests
- Mock data is used on first load for instant display

## Future Enhancements

- [ ] Add price history tracking
- [ ] Email notifications for specific discounts
- [ ] Wishlist and favorites sync
- [ ] Multiple language support
- [ ] Mobile app version
- [ ] Add more Pakistani brands (Al-Karam, Outfitters, etc.)

## License

MIT
