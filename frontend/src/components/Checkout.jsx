import React, { useState, useContext, useEffect } from 'react'
import Layout from './common/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { CartContext } from './context/Cart'
import { useForm } from 'react-hook-form'
import { apiUrl, userToken } from './common/http'
import { toast } from 'react-toastify'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const CheckoutContent = () => {
    const { cartData, setCartData } = useContext(CartContext);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [shippingCost, setShippingCost] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${apiUrl}/get-shipping-front`,{
            method: 'GET',
            headers: {
                'Content-type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${userToken()}`
            }
        })
        .then(res => res.json())
        .then(result => {
            if(result.status == 200){
                setShippingCost(result.data.shipping_charge)
            } else {
                setShippingCost(0)
                console.log("Something error !!!!!");
            }
        })
    }, []);

    const handlePaymentMethod = (e) => {
        setPaymentMethod(e.target.value);
    }
    const calculateSubtotal = () => {
        return cartData.reduce((total, item) => total + (item.price * item.qty), 0);
    };

    const calculateShipping = () => {
        return cartData.reduce((total, item) => total + (item.qty * shippingCost), 0);
    };

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
    } = useForm();

    const handlePayPalSuccess = (details, formData) => {
        // Add payment details to the form data
        const paymentData = {
            ...formData,
            payment_id: details.id,
            payment_method: 'paypal',
            payment_details: JSON.stringify(details)
        };
        
        // Save the order with payment status as 'paid'
        saveOrder(paymentData, 'paid');
        
        // Show success message
        toast.success('Payment successful! Your order has been placed.');
    };

    const processOrder = (data) => {
        if (paymentMethod === 'cod') {
            saveOrder(data, 'not paid');
        } else if (paymentMethod === 'stripe') {
            // For stripe, we would typically redirect to a stripe payment page
            // or handle the payment through a stripe element
            toast.info('Stripe payment processing is not implemented yet');
        } else if (paymentMethod === 'paypal') {
            // PayPal is handled separately through the PayPalButtons component
            // No need to do anything here
        }
    };

    const saveOrder = (formData, paymentStatus) => {
        const newFormData = {
            ...formData, 
            grand_total: grandTotal, 
            sub_total: subTotal, 
            shipping: shippingAmount,
            discount: 0,
            payment_status: paymentStatus,
            status: 'pending', 
            cart: cartData
        }

        fetch(`${apiUrl}/save_order`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`
            },
            body: JSON.stringify(newFormData)
        })
        .then(res => res.json())
        .then(result => {
            if(result.status === 200) {
                localStorage.removeItem('cart');
                setCartData([]);
                navigate(`/order/confirmation/${result.id}`)
            } else {
                toast.error(result.message)
            }
        })
        .catch(error => {
            console.error('Order submission error:', error);
            toast.error('An error occurred while processing your order')
        })
    }

    const subTotal = calculateSubtotal();
    const shippingAmount = calculateShipping();
    const grandTotal = subTotal + shippingAmount;

  return (
    <Layout>
        <div className="container">
            <div className="row">
                <div className='col-md-12'>
                    <nav aria-label="breadcrumb" className='py-4'>
                        <ol className='breadcrumb'>
                            <li className='breadcrumb-item'><Link to="/">Home</Link></li>
                            <li className='breadcrumb-item active' aria-current="page">Checkout</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <form onSubmit={handleSubmit(processOrder)}>
            <div className="row">
                    <div className="col-md-7">
                        <h3 className='border-bottom pb-3'><strong>Billing Details</strong></h3>
                        <div className="row pt-3">
                            <div className="col-md-6">
                                <div className='mb-3'>
                                    <input 
                                    {
                                        ...register('name',{
                                            required : "The name field is required."
                                        })
                                    }
                                    type="text" 
                                    className={`form-control ${errors.name && 'is-invalid'}`} 
                                    placeholder='Name' />
                                    {
                                        errors.name && <p className='invalid-feedback'>{errors.name?.message}</p>
                                    }
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className='mb-3'>
                                    <input 
                                    {
                                        ...register('email',{
                                            required : "The email field is required.",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            } 
                                        })
                                    }
                                    type="text" 
                                    className={`form-control ${errors.email && 'is-invalid'}`} 
                                    placeholder='Email' />
                                    {
                                        errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>
                                    }
                                </div>
                            </div>
                            
                                <div className='mb-3'>
                                    <textarea 
                                    {
                                        ...register('address',{
                                            required : "The address field is required."
                                        })
                                    }
                                    className={`form-control ${errors.address && 'is-invalid'}`} 
                                    rows={3} placeholder='Address'></textarea>
                                    {
                                        errors.address && <p className='invalid-feedback'>{errors.address?.message}</p>
                                    }
                                </div>

                            <div className="col-md-6">
                                <div className='mb-3'>
                                    <input 
                                    {
                                        ...register('city',{
                                            required : "The city field is required."
                                        })
                                    }
                                    type="text" 
                                    className={`form-control ${errors.city && 'is-invalid'}`} 
                                    placeholder='City' />
                                    {
                                        errors.city && <p className='invalid-feedback'>{errors.city?.message}</p>
                                    }
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className='mb-3'>
                                    <input 
                                    {
                                        ...register('state',{
                                            required : "The state field is required."
                                        })
                                    }
                                    type="text" 
                                    className={`form-control ${errors.state && 'is-invalid'}`}  
                                    placeholder='State' />
                                    {
                                        errors.state && <p className='invalid-feedback'>{errors.state?.message}</p>
                                    }
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className='mb-3'>
                                    <input 
                                    {
                                        ...register('zip',{
                                            required : "The zip field is required."
                                        })
                                    }
                                    type="text" 
                                    className={`form-control ${errors.zip && 'is-invalid'}`}  
                                    placeholder='Zip' />
                                    {
                                        errors.zip && <p className='invalid-feedback'>{errors.zip?.message}</p>
                                    }
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className='mb-3'>
                                    <input 
                                    {
                                        ...register('mobile', {
                                            required: "The phone number field is required."
                                        })
                                    }
                                    type="text" 
                                    className={`form-control ${errors.mobile && 'is-invalid'}`}  
                                    placeholder='Phone' />
                                    {
                                        errors.mobile && <p className='invalid-feedback'>{errors.mobile?.message}</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <h3 className='border-bottom pb-3'><strong>Items</strong></h3>
                        <table className='table'> 
                            <tbody>
                                {
                                cartData &&cartData.map(item => (
                                    <tr key={`cart-${item.id}`}>
                                        <td width={100}>
                                            <img 
                                                src={item.image_url} 
                                                width={80} 
                                                alt={item.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                        </td>
                                        <td width={600}>
                                            <div>{item.title}</div>
                                            <div className='d-flex align-items-center pt-3'>
                                                <span>${(item.price * item.qty).toFixed(2)}</span>
                                                
                                                <div className='ps-5'>X {item.qty}</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='d-flex  justify-content-between border-bottom pb-2'>
                                    <div>Subtotal</div>
                                    <div>${subTotal.toFixed(2)}</div>
                                </div>
                                <div className='d-flex  justify-content-between border-bottom pb-2'>
                                    <div>Tax</div>
                                    <div>${shippingAmount.toFixed(2)}</div>
                                </div>
                                <div className='d-flex  justify-content-between border-bottom py-2'>
                                    <div><strong>Total</strong></div>
                                    <div>${grandTotal.toFixed(2)}</div>
                                </div>
                                
                            </div>
                        </div>
                        <h3 className='border-bottom pt-4 pb-3'><strong>Payment Method</strong></h3>
                        <div className='pt-2'>
                            <input type="radio" 
                            onChange={handlePaymentMethod}
                            checked={paymentMethod === 'stripe'} 
                            value="stripe"
                            name="paymentMethod" />
                            <label htmlFor="stripe" className='form-label ps-2'>Stripe</label>
                            
                            <input type="radio" 
                            onChange={handlePaymentMethod}
                            checked={paymentMethod === 'cod'} 
                            value="cod" 
                            name="paymentMethod"
                            className='ms-3' />
                            <label htmlFor="cod" className='form-label ps-2'>COD</label>

                            <input type="radio" 
                            onChange={handlePaymentMethod}
                            checked={paymentMethod === 'paypal'} 
                            value="paypal" 
                            name="paymentMethod"
                            className='ms-3' />
                            <label htmlFor="paypal" className='form-label ps-2'>PayPal</label>
                        </div>
                        <div className='d-flex py-3'>
                            {paymentMethod === 'paypal' ? (
                                <PayPalButtons
                                    style={{ layout: "horizontal" }}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: grandTotal.toFixed(2)
                                                    },
                                                },
                                            ],
                                        });
                                    }}
                                    onApprove={async (data, actions) => {
                                        try {
                                            const details = await actions.order.capture();
                                            const formData = {
                                                name: watch('name'),
                                                email: watch('email'),
                                                address: watch('address'),
                                                city: watch('city'),
                                                state: watch('state'),
                                                zip: watch('zip'),
                                                mobile: watch('mobile')
                                            };
                                            
                                            if (!formData.name || !formData.email || !formData.address) {
                                                toast.error('Please fill in all required fields before proceeding with payment');
                                                return;
                                            }
                                            
                                            handlePayPalSuccess(details, formData);
                                        } catch (error) {
                                            console.error('PayPal payment error:', error);
                                            toast.error('Payment failed. Please try again.');
                                        }
                                    }}
                                    onError={(err) => {
                                        console.error('PayPal error:', err);
                                        toast.error('Payment failed. Please try again.');
                                    }}
                                    onCancel={() => {
                                        toast.info('Payment cancelled');
                                    }}
                                />
                            ) : (
                                <button type="submit" className='btn btn-primary'>Pay Now</button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </Layout>
  )
}

const Checkout = () => {
    return (
        <PayPalScriptProvider options={{ 
            "client-id": "AdAFOX0e1v_C2uEkFOtrooBbBvfoOr71TPgb0vA1E03j2_RRxRyYxcxRSpeVRktz8-xGzYT31xx--jgP",
            currency: "USD"
        }}>
            <CheckoutContent />
        </PayPalScriptProvider>
    );
}

export default Checkout