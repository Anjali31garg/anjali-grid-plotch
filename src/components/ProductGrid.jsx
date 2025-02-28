import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ src, alt }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // If the image is intersecting with the viewport
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Stop observing the current image
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // Trigger when image starts to become visible
        threshold: 0,
        // Start loading when image is close to viewport
        rootMargin: '200px 0px'
      }
    );

    // Start observing the image
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    // Cleanup observer
    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={imageRef} 
      style={{ 
        height: '300px', 
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {isVisible ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      ) : (
        <div style={{ color: '#888' }}>Loading...</div>
      )}
    </div>
  );
};

const ProductGrid = ({ initialData }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const productsPerPage = 15; // Increased to 15 images per page

  // Fetch products for current page
  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Calculate start and end indices
      const startIndex = (page - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;

      // Slice products for the current page
      const pageProducts = initialData.record.slice(startIndex, endIndex);

      // Update state
      setProducts(pageProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Fetch products when page changes
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(initialData.record.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button 
          key={i} 
          onClick={() => paginate(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="product-grid-container">
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div 
            className="product-grid"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(5, 1fr)', 
              gap: '20px', 
              padding: '20px' 
            }}
          >
            {products.map((product, index) => (
              <div key={index} className="product-card">
                <LazyImage 
                  src={product.imageUrl} 
                  alt={product.productName}
                />
                <div className="product-details">
                  <h3>{product.productName}</h3>
                  <p>Price: ${product.productPrice}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pagination">
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {renderPageNumbers()}
            
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductGrid;