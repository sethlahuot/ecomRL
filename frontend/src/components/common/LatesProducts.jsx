import React, { useEffect, useState, useContext } from 'react'
import {apiUrl} from '../common/http'
import { CartContext } from '../context/Cart'
import { toast } from 'react-toastify'

const LatesProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = (product) => {
        addToCart(product);
        toast.success("Product added to cart successfully");
    }
    const fetchCategories = async () => {
        try {
            const response = await fetch(apiUrl+'/get-categories', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            const result = await response.json();
            setCategories(result.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }
    const fetchProducts = async () => {
        try {
            const response = await fetch(apiUrl+'/get-latest-Products', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            const result = await response.json();
            setProducts(result.data.slice(0, 4));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    return (
        <section className="product spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-4">
                        <div className="section-title">
                            <h4>New Products</h4>
                        </div>
                    </div>
                    <div className="col-lg-8 col-md-8">
                        <ul className="filter__controls">
                            <li 
                                className={selectedCategory === 'all' ? 'active' : ''} 
                                onClick={() => setSelectedCategory('all')}
                            >
                                All
                            </li>
                            {categories.map((category) => (
                                <li 
                                    key={category.id}
                                    className={selectedCategory === category.id ? 'active' : ''}
                                    onClick={() => setSelectedCategory(category.id)}
                                >
                                    {category.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="row property__gallery">
                    {products.map((product) => (
                        <div className="col-lg-3 col-md-4 col-sm-6" key={product.id}>
                            <div className="product__item">
                                <div className="product__item__pic">
                                    <a href={`/product/${product.id}`}>
                                        <img src={product.image_url} alt={product.title} className="w-100" style={{ objectFit: 'cover' }} />
                                        <ul className="product__hover">
                                            <li><a href="" onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}><span className="icon_bag_alt"></span></a></li>
                                        </ul>
                                    </a>
                                </div>
                                <div className="product__item__text">
                                    <h6><a href="#">{product.title}</a></h6>
                                    <div className="product__price">
                                        ${product.price}
                                        {product.compare_price && (
                                            <span>${product.compare_price}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default LatesProducts