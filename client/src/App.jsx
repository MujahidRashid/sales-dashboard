import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ProductCard from './components/ProductCard';
import FilterBar from './components/FilterBar';
import Stats from './components/Stats';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [isMockData, setIsMockData] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    brand: 'all',
    minDiscount: 0,
    sortBy: 'discount-desc'
  });

  useEffect(() => {
    fetchSales();
    fetchStats();
    checkDataSource();
  }, []);

  const checkDataSource = async () => {
    try {
      const response = await axios.get('/api/data-source');
      setIsMockData(response.data.isMock);
    } catch (error) {
      console.error('Error checking data source:', error);
      setIsMockData(true);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/sales');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setProducts(mockData);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleScrape = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/scrape');
      setProducts(response.data.data.products);
      fetchStats();
      checkDataSource();
      alert(`Scraped ${response.data.count} products!`);
    } catch (error) {
      console.error('Error scraping:', error);
      alert('Failed to scrape data. Using mock data for demo.');
      setProducts(mockData);
      setIsMockData(true);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search)
      );
    }

    if (filters.brand !== 'all') {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }

    filtered = filtered.filter(p => p.discount >= filters.minDiscount);

    if (filters.sortBy === 'discount-desc') {
      filtered.sort((a, b) => b.discount - a.discount);
    } else if (filters.sortBy === 'discount-asc') {
      filtered.sort((a, b) => a.discount - b.discount);
    } else if (filters.sortBy === 'price-asc') {
      filtered.sort((a, b) => parsePrice(a.currentPrice) - parsePrice(b.currentPrice));
    } else if (filters.sortBy === 'price-desc') {
      filtered.sort((a, b) => parsePrice(b.currentPrice) - parsePrice(a.currentPrice));
    }

    setFilteredProducts(filtered);
  };

  const parsePrice = (priceStr) => {
    const match = priceStr.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🛍️ PK Fashion Sales</h1>
          <p>Discover amazing deals from your favorite Pakistani brands</p>
        </div>
      </header>

      {stats && <Stats stats={stats} />}

      <div className="container">
        <div className="controls">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            brands={['Sapphire', 'Gul Ahmed']}
          />
          <div className="controls-right">
            {isMockData && (
              <div className="mock-data-badge">
                📝 Demo Data
              </div>
            )}
            <button
              className="scrape-btn"
              onClick={handleScrape}
              disabled={loading}
            >
              {loading ? '⏳ Refreshing...' : '🔄 Refresh Sales'}
            </button>
          </div>
        </div>

        <div className="stats-row">
          <p className="result-count">
            Found <strong>{filteredProducts.length}</strong> products
          </p>
        </div>

        {loading && <div className="loading">Loading sales data...</div>}

        {!loading && filteredProducts.length === 0 && (
          <div className="no-results">
            <p>No products found matching your filters</p>
          </div>
        )}

        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <footer className="footer">
        <p>Last updated: {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'}</p>
      </footer>
    </div>
  );
}

const mockData = [
  {
    id: 'demo-1',
    name: 'Luxury Lawn Collection - Summer 2024',
    brand: 'Sapphire',
    currentPrice: 'Rs. 3,500',
    originalPrice: 'Rs. 5,999',
    discount: 42,
    image: 'https://via.placeholder.com/300x400?text=Sapphire+Lawn',
    link: 'https://pk.sapphireonline.pk/',
    category: 'Women'
  },
  {
    id: 'demo-2',
    name: 'Digital Print Unstitched Suit',
    brand: 'Gul Ahmed',
    currentPrice: 'Rs. 2,800',
    originalPrice: 'Rs. 4,500',
    discount: 38,
    image: 'https://via.placeholder.com/300x400?text=Gul+Ahmed+Suit',
    link: 'https://www.gulahmedshop.com/',
    category: 'Women'
  },
  {
    id: 'demo-3',
    name: 'Premium Silk Embroidered Dupatta',
    brand: 'Sapphire',
    currentPrice: 'Rs. 1,200',
    originalPrice: 'Rs. 2,500',
    discount: 52,
    image: 'https://via.placeholder.com/300x400?text=Sapphire+Dupatta',
    link: 'https://pk.sapphireonline.pk/',
    category: 'Women'
  },
  {
    id: 'demo-4',
    name: 'Casual Printed Kameez',
    brand: 'Gul Ahmed',
    currentPrice: 'Rs. 1,900',
    originalPrice: 'Rs. 3,200',
    discount: 41,
    image: 'https://via.placeholder.com/300x400?text=Gul+Ahmed+Kameez',
    link: 'https://www.gulahmedshop.com/',
    category: 'Women'
  }
];

export default App;
