import React, { useEffect, useState, useContext } from 'react'
import Layout from './common/Layout'
import { Link, useSearchParams } from 'react-router-dom';
import { apiUrl } from './common/http';
import Loader from './common/Loader';
import { CartContext } from './context/Cart';
import { toast } from 'react-toastify';
import Ig from './common/Ig';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Product added to cart successfully");
  };

  // Get filter values from URL
  const selectedCategories = searchParams.get('category')?.split(',').filter(Boolean).map(Number) || [];
  const selectedBrands = searchParams.get('brand')?.split(',').filter(Boolean).map(Number) || [];

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/get-products`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const result = await res.json();
      if (result.status === 200) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiUrl}/get-categories`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const result = await res.json();
      if (result.status === 200) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${apiUrl}/get-brands`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const result = await res.json();
      if (result.status === 200) {
        setBrands(result.data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const handleCategoryChange = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    updateFilters(newCategories, selectedBrands);
  };

  const handleBrandChange = (brandId) => {
    const newBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter(id => id !== brandId)
      : [...selectedBrands, brandId];
    
    updateFilters(selectedCategories, newBrands);
  };

  const updateFilters = (categories, brands) => {
    const params = new URLSearchParams();
    
    if (categories.length > 0) {
      params.set('category', categories.join(','));
    }
    
    if (brands.length > 0) {
      params.set('brand', brands.join(','));
    }
    
    setSearchParams(params);
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category_id);
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand_id);
    return categoryMatch && brandMatch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <section className="shop spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3">
              <div className="shop__sidebar">
                <div className="sidebar__categories">
                  <div className="section-title">
                    <h4>Categories</h4>
                  </div>
                  <div className="size__list">
                    {categories.map(category => (
                      <label key={category.id} htmlFor={`category-${category.id}`} className="d-block mb-2">
                        <input 
                          type="checkbox" 
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                        />
                        <span className="checkmark"></span>
                        {category.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="sidebar__filter">
                  <div className="section-title">
                    <h4>Brands</h4>
                  </div>
                  <div className="size__list">
                    {brands.map(brand => (
                      <label key={brand.id} htmlFor={`brand-${brand.id}`} className="d-block mb-2">
                        <input 
                          type="checkbox" 
                          id={`brand-${brand.id}`}
                          checked={selectedBrands.includes(brand.id)}
                          onChange={() => handleBrandChange(brand.id)}
                        />
                        <span className="checkmark"></span>
                        {brand.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-9 col-md-9">
              <div className="row">
                {loading ? (
                  <div className="col-12 text-center">
                    <Loader />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="col-12 text-center">
                    <p>No products found</p>
                  </div>
                ) : (
                  currentProducts.map(product => (
                    <div className="col-lg-4 col-md-6" key={product.id}>
                      <div className="product__item">
                        <div className="product__item__pic" style={{ height: '300px', overflow: 'hidden' }}>
                          <Link to={`/product/${product.id}`}>
                            <img 
                              src={product.image_url} 
                              alt={product.title} 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }} 
                            />
                          </Link>
                          {product.compare_price && (
                            <div className="label">Sale</div>
                          )}
                          <ul className="product__hover">
                            <li>
                              <Link to={`/product/${product.id}`}>
                                <span className="arrow_expand"></span>
                              </Link>
                            </li>
                            <li>
                              <a href="" onClick={(e) => { 
                                e.preventDefault(); 
                                handleAddToCart(product); 
                              }}>
                                <span className="icon_bag_alt"></span>
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="product__item__text">
                          <h6>
                            <Link to={`/product/${product.id}`}>{product.title}</Link>
                          </h6>
                          <div className="product__price">
                            ${product.price}
                            {product.compare_price && (
                              <span>${product.compare_price}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {!loading && filteredProducts.length > 0 && (
                <div className="col-lg-12 text-center">
                  <div className="pagination__option">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <a 
                        key={pageNumber}
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNumber);
                        }}
                        className={currentPage === pageNumber ? 'active' : ''}
                      >
                        {pageNumber}
                      </a>
                    ))}
                    {currentPage < totalPages && (
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }}
                      >
                        <i className="fa fa-angle-right"></i>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Ig />
    </Layout>
  )
}

export default Shop