import React, { useContext } from 'react'
import Layout from './common/Layout'
import { Link } from 'react-router-dom'
import { CartContext } from './context/Cart'
import { toast } from 'react-toastify'

const Cart = () => {
  const { cartData, setCartData } = useContext(CartContext);

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

  const shipping = 5;
  const subtotal = calculateSubtotal();
  const total = subtotal + shipping;

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
                <div className='col-md-12'>
                    <h2 className='border-bottom py-3'>Cart</h2>
                   
                    <table className='table'> 
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Details</th>
                                <th>Quantity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartData.map((item) => (
                                <tr key={item.id}>
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
                                            <span>${item.price.toFixed(2)}</span>
                                        </div>
                                    </td>
                                    <td valign='middle'>
                                        <input 
                                            style={{ width:'100px'}} 
                                            type="number" 
                                            value={item.qty} 
                                            min="1"
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                            className='form-control' 
                                        />
                                    </td>
                                    <td valign='middle'>
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="btn btn-danger "
                                            aria-label="Remove item"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className='bi bi-trash3' viewBox="0 0 16 16">
                                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='row justify-content-end'>
                    <div className='col-md-3'>
                        <div className='d-flex justify-content-between border-bottom pb-2'>
                            <div>Subtotal</div>
                            <div>${subtotal.toFixed(2)}</div>
                        </div>
                        <div className='d-flex justify-content-between border-bottom pb-2'>
                            <div>Tax</div>
                            <div>${shipping.toFixed(2)}</div>
                        </div>
                        <div className='d-flex justify-content-between border-bottom py-2'>
                            <div><strong>Total</strong></div>
                            <div>${total.toFixed(2)}</div>
                        </div>
                        <div className='d-flex justify-content-end gap-2'>
                            <Link to="/shop" className='btn btn-primary'>Continue Shopping</Link>
                            <Link to={'/checkout'} className='btn btn-primary'>Proceed To Checkout</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  );
};

export default Cart;