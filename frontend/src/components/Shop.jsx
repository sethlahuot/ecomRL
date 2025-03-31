import React, { useEffect, useState } from 'react'
import Layout from './common/Layout'
import { Link, useSearchParams } from 'react-router-dom';
import { apiUrl } from './common/http';
import Loader from './common/Loader';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Layout>
      <div className="container">
        <nav aria-label="breadcrumb" className='py-4'>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Shop</li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-md-3">
            <div className="card shadow border-0 mb-3">
              <div className="card-body p-4">
                <h3 className='mb-3'>Categories</h3>
                <ul>
                  {categories.map(category => (
                    <li className='mb-2' key={category.id}>
                      <input 
                        type='checkbox' 
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                      />
                      <label className='ps-2'>{category.name}</label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="card shadow border-0 mb-3">
              <div className="card-body p-4">
                <h3 className='mb-3'>Brands</h3>
                <ul>
                  {brands.map(brand => (
                    <li className='mb-2' key={brand.id}>
                      <input 
                        type='checkbox' 
                        checked={selectedBrands.includes(brand.id)}
                        onChange={() => handleBrandChange(brand.id)}
                      />
                      <label className='ps-2'>{brand.name}</label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="row pb-5">
              {loading ? (
                <div className="col-12 text-center">
                  <Loader />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-12 text-center">
                  <p>No products found</p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <div className='col-md-4 col-6' key={product.id}>
                    <div className='product card border-0'>
                      <div className='card-img'>
                        <Link to={`/product/${product.id}`}>
                          <img src={product.image_url} alt={product.title} className='w-100'/>
                        </Link>
                      </div>
                      <div className='card-body pt-3'>
                        <Link to={`/product/${product.id}`}>{product.title}</Link>
                        <div className='price'>
                          ${product.price}
                          {product.compare_price && (
                            <span className='text-decoration-line-through'>${product.compare_price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Shop