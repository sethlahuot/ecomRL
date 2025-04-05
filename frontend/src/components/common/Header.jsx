import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/Cart';
import { AuthContext } from '../context/Auth';
import Logo from '../../assets/tem/img/logo.png'

const Header = () => {
  const { cartData } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const cartCount = cartData ? cartData.reduce((total, item) => total + item.qty, 0) : 0;

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header>
      <div className="header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-xl-3 col-lg-2">
              <div className="header__logo">
                <Link to="/"><img src={Logo} alt="" /></Link>
              </div>
            </div>
            <div className="col-xl-6 col-lg-7">
              <nav className="header__menu d-flex justify-content-center">
                <ul className="d-flex align-items-center mb-0">
                  <li className={isActive('/') ? 'active' : ''}><Link to="/">Home</Link></li>
                  <li className={isActive('/shop') ? 'active' : ''}><Link to="/shop">Shop</Link></li>
                  <li className={isActive('/cart') ? 'active' : ''}><Link to="/cart">Cart</Link></li>
                  <li className={isActive('/checkout') ? 'active' : ''}><Link to="/checkout">Checkout</Link></li>
                  <li className={isActive('/contact') ? 'active' : ''}><Link to="/contact">Contact</Link></li>
                </ul>
              </nav>
            </div>
            <div className="col-lg-3">
              <div className="header__right">
                {!user ? (
                  <div className="header__right__auth">
                    <Link to="/account/login">Login</Link>
                    <Link to="/account/register">Register</Link>
                  </div>
                ) : null}
                <ul className="header__right__widget">
                  <li><span className="icon_search search-switch"></span></li>
                  {user && (
                    <li>
                      <Link to="/account">
                        <i className="fa fa-user-o"></i>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link to="/cart">
                      <span className="icon_bag_alt"></span>
                      {cartCount > 0 && <div className="tip">{cartCount}</div>}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="canvas__open">
            <i className="fa fa-bars"></i>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header