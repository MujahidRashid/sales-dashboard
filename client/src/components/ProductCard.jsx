import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
            }}
          />
        ) : (
          <div className="product-image-placeholder">
            📷 No Image
          </div>
        )}
        <div className="discount-badge">{product.discount}% OFF</div>
      </div>

      <div className="product-content">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>

        <div className="product-prices">
          <span className="current-price">{product.currentPrice}</span>
          {product.originalPrice !== product.currentPrice && (
            <span className="original-price">{product.originalPrice}</span>
          )}
        </div>

        <div className="product-category">
          <span className="category-badge">{product.category}</span>
        </div>

        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="buy-button"
        >
          Buy Now →
        </a>
      </div>
    </div>
  );
}

export default ProductCard;
