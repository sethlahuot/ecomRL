import React, { useEffect, useState } from 'react'
import Layout from './common/Layout'
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiUrl, userToken } from './common/http';

const Confirmation = () => {
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState(true);
    const params = useParams()

    const fetchorder = () => {
        fetch(`${apiUrl}/get-order-details/${params.id}`,{
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`
            }
        })
        .then(res => res.json())
        .then(result => {
            setLoading(false)
            if(result.status === 200) {
                setOrder(result.data)
                setItems(result.data.items)
            } else {
                toast.error(result.message)
            }
        })
    }
    useEffect(() => {
        fetchorder();
        
    })
  return (
    <Layout>
    <div className="container py-5">
        {
            loading == true &&
            <div className='text-center py-5'>
                <div className="spinner-border" role='status'>
                    <span className='visually-hidden'>Loading...</span>
                </div>
            </div>
        }
        {
                loading == false && order &&
        <div>
            <div className="row">
                <h1 className='text-center fw-bold text-success'>Thank you!</h1>
                <p className='text-muted text-center'>Your Order has been Successfully placed.</p>
            </div>
            <div className="card shadow">
                <div className="card-body">
                    <h3 className="fw-bold">Order summary</h3>
                    <hr/>
                    <div className="row">
                        <div className="col-6">
                            <p><strong>Order ID:</strong> #{order.id}</p>
                            <p><strong>Data:</strong>{order.created_at}</p>
                            <p><strong>Status:</strong> 
                            {
                                order.status == 'panding' && <span className='badge bg-warning'>Pending</span>
                            }
                            {
                                order.status == 'shipped' && <span className='badge bg-warning'>Shipped</span>
                            }
                            {
                                order.status == 'delivered' && <span className='badge bg-success'>Delivered</span>
                            }
                            {
                                order.status == 'cancelled' && <span className='badge bg-danger'>Cancelled</span>
                            }
                            
                            </p>
                            <p><strong>PayMent Menthod:</strong>COD</p>
                        </div>
                        <div className="col-6">
                            <p><strong>Customer:</strong>{order.name}</p>
                            <p><strong>Address:</strong>{order.address}, {order.city}, {order.state},{order.zip}</p>
                            <p><strong>Contact:</strong>{order.mobile}</p>
                            
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table-striped table-bordered table">
                                <thead className='bg-light'>
                                    <tr>
                                        <th>Item</th>
                                        <th>Quantity</th>
                                        <th width="150">Price</th>
                                        <th width="150">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                        {
                                            items.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.name}</td>
                                                    <td>{item.qty}</td>
                                                    <td>${item.unit_price}</td> 
                                                    <td>${item.price}</td> 
                                                </tr>
                                            ))
                                        }
                                </tbody>
                                <tfoot>
                            <tr>
                                <td className='text-end fw-bold' colSpan={3}>Subtotal</td>
                                <td>${order.subtotal}</td>
                            </tr>
                            <tr>
                                <td className='text-end fw-bold' colSpan={3}>Tax</td>
                                <td>${order.shipping}</td>
                            </tr>
                            <tr>
                                <td className='text-end fw-bold' colSpan={3}>Total</td>
                                <td>${order.grand_total}</td>
                            </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className='text-center'>
                            <Link to={`/account/orders/details/${order.id}`} className='btn btn-primary'>View Order Details</Link>
                            <Link to={'/shop'} className='btn btn-outline-secondary ms-2'>Continune Shopping</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        }
        {
            loading == false && !order &&
            <div className="row">
                <h1 className='text-center fw-bold text-muted'>Order Not found!!!</h1>
            </div>
        }
    </div>
</Layout>
  )
}

export default Confirmation