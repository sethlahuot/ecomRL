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
        return shippingCost;
    };

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
    } = useForm();

    const handlePayPalSuccess = (details, formData) => {
        const paymentData = {
            ...formData,
            payment_id: details.id,
            payment_method: 'paypal',
            payment_details: JSON.stringify(details)
        };

        saveOrder(paymentData, 'paid');
        toast.success('Payment successful! Your order has been placed.');
    };

    const processOrder = (data) => {
        if (paymentMethod === 'cod') {
            saveOrder(data, 'not paid');
        } else if (paymentMethod === 'stripe') {
            toast.info('Stripe payment processing is not implemented yet');
        } else if (paymentMethod === 'paypal') {
            // PayPal is handled separately through the PayPalButtons component
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
            <section className="checkout spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h6 className="coupon__link">
                                <span className="icon_tag_alt"></span> 
                                <a href="#">Have a coupon?</a> Click here to enter your code.
                            </h6>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(processOrder)} className="checkout__form">
                        <div className="row">
                            <div className="col-lg-8">
                                <h5>Billing detail</h5>
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="checkout__form__input">
                                            <p>Name <span>*</span></p>
                                            <input 
                                                type="text"
                                                {...register('name', { required: "The name field is required." })}
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            />
                                            {errors.name && <p className="invalid-feedback">{errors.name.message}</p>}
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="checkout__form__input">
                                            <p>Email <span>*</span></p>
                                            <input 
                                                type="text"
                                                {...register('email', {
                                                    required: "The email field is required.",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address"
                                                    }
                                                })}
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            />
                                            {errors.email && <p className="invalid-feedback">{errors.email.message}</p>}
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="checkout__form__input">
                                            <p>Address <span>*</span></p>
                                            <textarea 
                                                {...register('address', { required: "The address field is required." })}
                                                className={`form-control w-100 ${errors.address ? 'is-invalid' : ''}`}
                                                rows={3}
                                            ></textarea>
                                            {errors.address && <p className="invalid-feedback">{errors.address.message}</p>}
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="checkout__form__input">
                                            <p>City <span>*</span></p>
                                            <input 
                                                type="text"
                                                {...register('city', { required: "The city field is required." })}
                                                className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                            />
                                            {errors.city && <p className="invalid-feedback">{errors.city.message}</p>}
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="checkout__form__input">
                                            <p>State <span>*</span></p>
                                            <input 
                                                type="text"
                                                {...register('state', { required: "The state field is required." })}
                                                className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                            />
                                            {errors.state && <p className="invalid-feedback">{errors.state.message}</p>}
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="checkout__form__input">
                                            <p>Zip Code <span>*</span></p>
                                            <input 
                                                type="text"
                                                {...register('zip', { required: "The zip field is required." })}
                                                className={`form-control ${errors.zip ? 'is-invalid' : ''}`}
                                            />
                                            {errors.zip && <p className="invalid-feedback">{errors.zip.message}</p>}
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="checkout__form__input">
                                            <p>Phone <span>*</span></p>
                                            <input 
                                                type="text"
                                                {...register('mobile', { required: "The phone number field is required." })}
                                                className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                                            />
                                            {errors.mobile && <p className="invalid-feedback">{errors.mobile.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="checkout__order">
                                    <h5>Your order</h5>
                                    <div className="checkout__order__product">
                                        <ul>
                                            <li>
                                                <span className="top__text">Product</span>
                                                <span className="top__text__right">Total</span>
                                            </li>
                                            {cartData.map(item => (
                                                <li key={`cart-${item.id}`}>
                                                    {item.title} <span>${(item.price * item.qty).toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="checkout__order__total">
                                        <ul>
                                            <li>Subtotal <span>${subTotal.toFixed(2)}</span></li>
                                            <li>Tax <span>${shippingAmount.toFixed(2)}</span></li>
                                            <li>Total <span>${grandTotal.toFixed(2)}</span></li>
                                        </ul>
                                    </div>
                                    <div className="checkout__order__widget">
                                        <label>
                                            <input 
                                                type="radio" 
                                                value="stripe"
                                                checked={paymentMethod === 'stripe'}
                                                onChange={handlePaymentMethod}
                                            />
                                            <span className="checkmark"></span>
                                            Stripe
                                        </label>
                                        <label>
                                            <input 
                                                type="radio" 
                                                value="cod"
                                                checked={paymentMethod === 'cod'}
                                                onChange={handlePaymentMethod}
                                            />
                                            <span className="checkmark"></span>
                                            Cash on Delivery
                                        </label>
                                        <label>
                                            <input 
                                                type="radio" 
                                                value="paypal"
                                                checked={paymentMethod === 'paypal'}
                                                onChange={handlePaymentMethod}
                                            />
                                            <span className="checkmark"></span>
                                            PayPal
                                        </label>
                                    </div>
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
                                        <button type="submit" className="site-btn">Place order</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </Layout>
    );
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

export default Checkout;