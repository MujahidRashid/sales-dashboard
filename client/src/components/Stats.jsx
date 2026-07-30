import './Stats.css';

function Stats({ stats }) {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-icon">📦</div>
        <div className="stat-content">
          <div className="stat-number">{stats.totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🏷️</div>
        <div className="stat-content">
          <div className="stat-number">{stats.brands.length}</div>
          <div className="stat-label">Brands</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <div className="stat-number">{stats.averageDiscount}%</div>
          <div className="stat-label">Avg Discount</div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
