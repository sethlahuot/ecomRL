import React from 'react'
import banner1 from '../../assets/tem/img/banner/banner-1.jpg'
const Banner = () => {
  return (
    // <!-- Banner Section Begin -->
    <section className="banner set-bg" style={{ backgroundImage: `url(${banner1})` }}>
        <div className="container">
            <div className="row">
                <div className="col-xl-7 col-lg-8 m-auto">
                    <div className="banner__item">
                        <div className="banner__text text-center mt-5 py-5">
                            <span>The Chloe Collection</span>
                            <h1>The Project Jacket</h1>
                            <a href="/shop">Shop now</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    // <!-- Banner Section End -->
  )
}

export default Banner