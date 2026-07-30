import './FilterBar.css';

function FilterBar({ filters, onFilterChange, brands }) {
  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="text"
          placeholder="Search by name, brand..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="brand">Brand</label>
        <select
          id="brand"
          value={filters.brand}
          onChange={(e) => handleChange('brand', e.target.value)}
          className="filter-select"
        >
          <option value="all">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="minDiscount">Min Discount</label>
        <select
          id="minDiscount"
          value={filters.minDiscount}
          onChange={(e) => handleChange('minDiscount', parseInt(e.target.value))}
          className="filter-select"
        >
          <option value={0}>Any</option>
          <option value={20}>20%+</option>
          <option value={30}>30%+</option>
          <option value={40}>40%+</option>
          <option value={50}>50%+</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sortBy">Sort By</label>
        <select
          id="sortBy"
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          className="filter-select"
        >
          <option value="discount-desc">Highest Discount</option>
          <option value="discount-asc">Lowest Discount</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
