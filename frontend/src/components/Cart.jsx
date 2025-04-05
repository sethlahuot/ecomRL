import React, { useContext, useEffect, useState } from 'react'
import Layout from './common/Layout'
import { Link } from 'react-router-dom'
import { CartContext } from './context/Cart'
import { toast } from 'react-toastify'
import { apiUrl, userToken } from './common/http'

const Cart = () => {
  const { cartData, setCartData } = useContext(CartContext);
  const [shippingCost, setShippingCost] = useState(0);

  const updateQuantity = (itemId, newQty) => {
    try {
      if (newQty < 1 || isNaN(newQty)) {
        toast.error('Please enter a valid quantity');
        return;
      }
      
      const updatedCart = cartData.map(item => 
        item.id === itemId ? { ...item, qty: newQty } : item
      );
      setCartData(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      toast.success('Quantity updated successfully');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = (itemId) => {
    try {
      const updatedCart = cartData.filter(item => item.id !== itemId);
      setCartData(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const calculateSubtotal = () => {
    try {
      return cartData.reduce((total, item) => total + (item.price * item.qty), 0);
    } catch (error) {
      console.error('Error calculating subtotal:', error);
      return 0;
    }
  };

  const calculateShipping = () => {
    try {
      return cartData.length > 0 ? shippingCost : 0;
    } catch (error) {
      console.error('Error calculating shipping:', error);
      return 0;
    }
  };

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

  const subtotal = calculateSubtotal();
  const shippingAmount = calculateShipping();
  const total = subtotal + shippingAmount;

  if (!cartData || cartData.length === 0) {
    return (
      <Layout>
        <div className='container pb-5'>
          <div className='row'>
            <div className='col-md-12'>
              <nav aria-label="breadcrumb" className='py-4'>
                <ol className='breadcrumb'>
                  <li className='breadcrumb-item'><Link to="/">Home</Link></li>
                  <li className='breadcrumb-item active' aria-current="page">Cart</li>
                </ol>
              </nav>
            </div>
            <div className='col-md-12 text-center py-5'>
              <h2>Your cart is empty</h2>
              <p className='text-muted'>Add some products to your cart to see them here</p>
              <Link to="/shop" className='btn btn-primary mt-3'>Continue Shopping</Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="shop-cart spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="shop__cart__table">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartData.map((item) => (
                      <tr key={item.id}>
                        <td className="cart__product__item">
                          <img 
                            src={item.image_url} 
                            width={80}
                            alt={item.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-image.jpg';
                            }}
                          />
                          <div className="cart__product__item__title">
                            <h6>{item.title}</h6>
                          </div>
                        </td>
                        <td className="cart__price">${item.price.toFixed(2)}</td>
                        <td className="cart__quantity">
                          <div className="pro-qty">
                            <input 
                              type="number" 
                              value={item.qty} 
                              min="1"
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            />
                          </div>
                        </td>
                        <td className="cart__total">${(item.price * item.qty).toFixed(2)}</td>
                        <td className="cart__close">
                          <span 
                            className="icon_close"
                            onClick={() => removeFromCart(item.id)}
                            style={{ cursor: 'pointer' }}
                          ></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="cart__btn">
                <Link to="/shop">Continue Shopping</Link>
              </div>
            </div>
            
          </div>
          <div className="row">
            <div className="col-lg-4 offset-lg-8">
              <div className="cart__total__procced">
                <h6>Cart total</h6>
                <ul>
                  <li>Subtotal <span>${subtotal.toFixed(2)}</span></li>
                  <li>Tax <span>${shippingAmount.toFixed(2)}</span></li>
                  <li>Total <span>${total.toFixed(2)}</span></li>
                </ul>
                <Link to="/checkout" className="primary-btn">Proceed to checkout</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;