import React, { useState, useEffect, useContext } from 'react'
import Layout from './common/Layout';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, FreeMode, Navigation  } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Rating } from 'react-simple-star-rating';
import { apiUrl } from './common/http';
import Loader from './common/Loader';
import { CartContext } from './context/Cart';
import { toast } from 'react-toastify';


const Product = () => {
    const { id } = useParams();
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [randomProducts, setRandomProducts] = useState([]);
    const { addToCart } = useContext(CartContext)

    const handleAddToCart = () => {
        // Check if product has sizes
        const hasSizes = product.product_size && product.product_size.length > 0;
        
        if (hasSizes && selectedSize === null) {
            toast.error("Please select a size");
            return;
        }
        
        addToCart(product, hasSizes ? selectedSize : null);
        toast.success("Product added to cart successfully");
    }

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${apiUrl}/get-product/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                    }
                });
                const result = await res.json();
                if (result.status === 200) {
                    setProduct(result.data);
                    console.log('Product Images:', result.data.product_images);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchRandomProducts = async () => {
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
                    console.log('Random Products:', result.data);
                    const shuffled = result.data.sort(() => 0.5 - Math.random());
                    const selected = shuffled.slice(0, 4);
                    setRandomProducts(selected);
                }
            } catch (error) {
                console.error('Error fetching random products:', error);
            }
        };

        fetchProduct();
        fetchRandomProducts();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="container text-center py-5">
                    <Loader />
                </div>
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout>
                <div className="container text-center py-5">
                    <h2>Product not found</h2>
                </div>
            </Layout>
        );
    }

    return (
    <Layout>
        <div className="container product-detail">
            <div className="row">
                <div className="col-md-12">
                    <nav aria-label="breadcrumb" className='py-4'>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/shop">Shop</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{product.title}</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
        <div className='row mb-5'>
             <div className="col-md-5">
                <div className="row">
                    <div className="col-2">
                    <Swiper
                        style={{
                            '--swiper-navigation-color': '#000',
                            '--swiper-pagination-color': '#000',
                            }}
                            onSwiper={setThumbsSwiper}
                            loop={true}
                            direction={`vertical`}
                            spaceBetween={10}
                            slidesPerView={6}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper mt-2"
                        >
                        {product.product_images?.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className='content'>
                                    <img 
                                        src={image.image_url} 
                                        alt={product.title} 
                                        height={100}
                                        className='w-100' />
                                </div>                                     
                            </SwiperSlide>
                        ))}
                    </Swiper>                               
                    </div>
                    <div className="col-10">
                    <Swiper
                        style={{
                        '--swiper-navigation-color': '#000',
                        '--swiper-pagination-color': '#000',
                        }}
                        loop={true}
                        spaceBetween={0}
                        navigation={true}
                        thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper2"
                    >
                        {product.product_images?.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className='content'>
                                    <img 
                                        src={image.image_url} 
                                        alt={product.title} 
                                        className='w-100' />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    </div>
                </div>
            </div>
            <div className='col-md-7'>
                <h2>{product.title}</h2>
                <div className='d-flex'>
                    <Rating 
                        size={20}
                        readonly
                        initialValue={4}
                    />
                    <span className='pt-1 ps-2'>10 Reviews</span>
                </div>
                <div className='price h3 py-3'>
                    ${product.price}
                    {product.compare_price && (
                        <span className='text-decoration-line-through ms-2'>${product.compare_price}</span>
                    )}
                </div>
                <div>
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
                {product.product_size && product.product_size.length > 0 ? (
                    <div className='pt-3'>
                        <strong>Select Size</strong>
                        <div className="sizes pt-2">
                            {product.product_size.map((size) => (
                                <button 
                                    key={size.id}
                                    className={`btn btn-size ms-1 ${selectedSize === size.id ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(size.id)}
                                >
                                    {size.size.name}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : null}
                <div className="add-to-cart my-3">
                    <button 
                    onClick={() => handleAddToCart()}
                    className="btn btn-primary text-uppercase">
                        Add To Cart
                    </button>
                    <hr />
                    <div style={{ padding: '15px 0', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            backgroundColor: '#f8f9fa', 
                            padding: '8px 12px', 
                            borderRadius: '4px', 
                            border: '1px solid #e9ecef', 
                            width: 'fit-content', 
                            whiteSpace: 'nowrap' 
                        }}>
                            <div style={{ color: '#6c757d', fontWeight: '500', fontSize: '0.9rem' }}>SKU:</div>
                            <div style={{ color: '#212529', fontFamily: 'monospace', fontSize: '0.9rem' }}>{product.sku}</div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <div className='row pb-5'>
            <div className="col-12">
                <h3 className="mb-4">You May Also Like</h3>
                <div className="row">
                    {randomProducts.map((relatedProduct) => (
                        <div className='col-md-3 col-6' key={relatedProduct.id}>
                            <div className='product card border-0'>
                                <div className='card-img'>
                                    <Link to={`/product/${relatedProduct.id}`}>
                                        <img 
                                            src={relatedProduct.image_url} 
                                            alt={relatedProduct.title} 
                                            className='w-100'
                                        />
                                    </Link>
                                </div>
                                <div className='card-body pt-3'>
                                    <Link to={`/product/${relatedProduct.id}`}>{relatedProduct.title}</Link>
                                    <div className='price'>
                                        ${relatedProduct.price}
                                        {relatedProduct.compare_price && (
                                            <span className='text-decoration-line-through'>${relatedProduct.compare_price}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Product