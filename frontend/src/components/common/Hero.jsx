import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import c1 from '../../assets/tem/img/categories/category-1.jpg';
import c2 from '../../assets/tem/img/categories/category-2.jpg';
import c3 from '../../assets/tem/img/categories/category-3.jpg';
import c4 from '../../assets/tem/img/categories/category-4.jpg';
import c5 from '../../assets/tem/img/categories/category-5.jpg';

const Hero = () => {
  return (
    // <!-- Categories Section Begin -->
    <section className="categories">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-6 p-0">
                        <div className="categories__item categories__large__item" 
                        style={{ backgroundImage: `url(${c1})` }}>
                        <div className="categories__text">
                            <h1>Women's fashion</h1>
                            <p>Sitamet, consectetur adipiscing elit, sed do eiusmod tempor incidid-unt labore
                            edolore magna aliquapendisse ultrices gravida.</p>
                            <a href="/shop">Shop now</a>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                            <div className="categories__item" style={{ backgroundImage: `url(${c2})` }}>
                                <div className="categories__text">
                                    <h4>Men's fashion</h4>
                                    <p>358 items</p>
                                    <a href="/shop">Shop now</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                            <div className="categories__item" style={{ backgroundImage: `url(${c3})` }}>
                                <div className="categories__text">
                                    <h4>Kid's fashion</h4>
                                    <p>273 items</p>
                                    <a href="/shop">Shop now</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                            <div className="categories__item" style={{ backgroundImage: `url(${c4})` }}>
                                <div className="categories__text">
                                    <h4>Cosmetics</h4>
                                    <p>159 items</p>
                                    <a href="/shop">Shop now</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 p-0">
                            <div className="categories__item" style={{ backgroundImage: `url(${c5})` }}>
                                <div className="categories__text">
                                    <h4>Accessories</h4>
                                    <p>792 items</p>
                                    <a href="/shop">Shop now</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    // <!-- Categories Section End -->
  )
}

export default Hero