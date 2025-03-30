import React from 'react'
import ProductImg1 from '../../assets/images/Mens/eleven.jpg';

const FeaturedProducts = () => {
  return (
     <section className='section-2 py-5'>
        <div className='container'>
            <h2>Featured Product</h2> 
            <div className='row mt-4'>
                <div className='col-md-3 col-6'>
                    <div className='product card border-0'>
                        <div className='card-img'>
                            <img src={ProductImg1} alt="" className='w-100'/>
                        </div>
                        <div className='card-body pt-3'>
                            <a href="">Red Check Shirt for Men</a>
                            <div className='price'>
                            50$  <span className='text-decoration-line-through'>$80</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-3 col-6'>
                    <div className='product card border-0'>
                        <div className='card-img'>
                            <img src={ProductImg1} alt="" className='w-100'/>
                        </div>
                        <div className='card-body pt-3'>
                            <a href="">Red Check Shirt for Men</a>
                            <div className='price'>
                            50$  <span className='text-decoration-line-through'>$80</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-3 col-6'>
                    <div className='product card border-0'>
                        <div className='card-img'>
                            <img src={ProductImg1} alt="" className='w-100'/>
                        </div>
                        <div className='card-body pt-3'>
                            <a href="">Red Check Shirt for Men</a>
                            <div className='price'>
                            50$  <span className='text-decoration-line-through'>$80</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-3 col-6'>
                    <div className='product card border-0'>
                        <div className='card-img'>
                            <img src={ProductImg1} alt="" className='w-100'/>
                        </div>
                        <div className='card-body pt-3'>
                            <a href="">Red Check Shirt for Men</a>
                            <div className='price'>
                            50$  <span className='text-decoration-line-through'>$80</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default FeaturedProducts