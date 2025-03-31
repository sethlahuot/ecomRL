import React, { useEffect, useState } from 'react'
import ProductImg1 from '../../assets/images/Mens/eight.jpg';
import {apiUrl} from '../common/http'

const LatesProducts = () => {
    const [products, setProducts] = useState([]);

    const LatestProducts = async () => {
        await fetch(apiUrl+'/get-latest-Products',{
            method : 'GET',
            headers: {
                'Content-type' : 'application/json',
                'Accept' : 'application/json',
            }
        }).then(res => res.json())
        .then(result => {
            setProducts(result.data)
        });
    }
    useEffect(() => {
        LatestProducts()
    })
  return (
    <section className='section-2 pt-5'>
        <div className='container'>
            <h2>New Arrivals</h2>
            <div className='row mt-4'>
                {
                    products && products.map(product => {
                        return (
                            <div className='col-md-3 col-6' key={`product-${product.id}`}>
                                <div className='product card border-0'>
                                    <div className='card-img'>
                                        <img src={product.image_url} alt="" className='w-100'/>
                                    </div>
                                    <div className='card-body pt-3'>
                                        <a href="">{product.title}</a>
                                        <div className='price'>
                                            ${product.price} &nbsp;
                                            {
                                                <span className='text-decoration-line-through'>${product.compare_price}</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                
            </div>
        </div>
    </section>
  )
}

export default LatesProducts