import React from 'react'
import Logo1 from '../../assets/tem/img/logo.png'
import Payment1 from '../../assets/tem/img/payment/payment-1.png'
import Payment2 from '../../assets/tem/img/payment/payment-2.png'
import Payment3 from '../../assets/tem/img/payment/payment-3.png'
import Payment4 from '../../assets/tem/img/payment/payment-4.png'
import Payment5 from '../../assets/tem/img/payment/payment-5.png'
const Footer = () => {

  return (
    <footer className="footer">
      <hr />
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-7">
            <div className="footer__about">
              <div className="footer__logo">
                <a href="/"><img src={Logo1} alt="Logo"/></a>
              </div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
              cilisis.</p>
              <div className="footer__payment">
                <a href="/checkout"><img src={Payment1} alt="Payment 1"/></a>
                <a href="/checkout"><img src={Payment2} alt="Payment 2"/></a>
                <a href="/checkout"><img src={Payment3} alt="Payment 3"/></a>
                <a href="/checkout"><img src={Payment4} alt="Payment 4"/></a>
                <a href="/checkout"><img src={Payment5} alt="Payment 5"/></a>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-3 col-sm-5">
            <div className="footer__widget">
              <h6>Quick links</h6>
              <ul>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/contact">Contact US</a></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2 col-md-3 col-sm-4">
            <div className="footer__widget">
              <h6>Account</h6>
              <ul>
                <li><a href="/account">My Account</a></li>
                <li><a href="/account/orders">Orders Tracking</a></li>
                <li><a href="/checkout">Checkout</a></li>
                
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-8 col-sm-8">
            <div className="footer__newslatter">
              <h6>NEWSLETTER</h6>
              <form action="#">
                <input type="text" placeholder="Email" />
                <button type="submit" className="site-btn">Subscribe</button>
              </form>
              <div className="footer__social">
                <a href="#"><i className="fa fa-facebook"></i></a>
                <a href="#"><i className="fa fa-twitter"></i></a>
                <a href="#"><i className="fa fa-youtube-play"></i></a>
                <a href="#"><i className="fa fa-instagram"></i></a>
                <a href="#"><i className="fa fa-pinterest"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="footer__copyright__text">
              <p>Copyright &copy; {new Date().getFullYear()} All rights reserved | This template is made with <i className="fa fa-heart" aria-hidden="true"></i> by <a href="#" target="_blank" rel="noopener noreferrer">Hout Hengsela</a></p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="search-model">
        <div className="h-100 d-flex align-items-center justify-content-center">
          <div className="search-close-switch">+</div>
          <form className="search-model-form">
            <input type="text" id="search-input" placeholder="Search here....." />
          </form>
        </div>
      </div>
    </footer>
  )
}

export default Footer