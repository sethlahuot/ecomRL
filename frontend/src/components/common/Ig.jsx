import React from 'react'
import insta1 from '../../assets/tem/img/instagram/insta-1.jpg'
import insta2 from '../../assets/tem/img/instagram/insta-2.jpg'
import insta3 from '../../assets/tem/img/instagram/insta-3.jpg'
import insta4 from '../../assets/tem/img/instagram/insta-4.jpg'
import insta5 from '../../assets/tem/img/instagram/insta-5.jpg'
import insta6 from '../../assets/tem/img/instagram/insta-6.jpg'
const Ig = () => {
  return (
        // <!-- Instagram Begin -->
        <div class="instagram">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-2 col-md-4 col-sm-4 p-0">
                    <div class="instagram__item set-bg" style={{ backgroundImage: `url(${insta1})` }}>
                        <div class="instagram__text">
                            <i class="fa fa-instagram"></i>
                            <a href="#">@ ashion_shop</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-sm-4 p-0">
                    <div class="instagram__item set-bg" style={{ backgroundImage: `url(${insta2})` }}>
                        <div class="instagram__text">
                            <i class="fa fa-instagram"></i>
                            <a href="#">@ ashion_shop</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-sm-4 p-0">
                    <div class="instagram__item set-bg" style={{ backgroundImage: `url(${insta3})` }}>
                        <div class="instagram__text">
                            <i class="fa fa-instagram"></i>
                            <a href="#">@ ashion_shop</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-sm-4 p-0">
                    <div class="instagram__item set-bg" style={{ backgroundImage: `url(${insta4})` }}>
                        <div class="instagram__text">
                            <i class="fa fa-instagram"></i>
                            <a href="#">@ ashion_shop</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-sm-4 p-0">
                    <div class="instagram__item set-bg" style={{ backgroundImage: `url(${insta5})` }}>
                        <div class="instagram__text">
                            <i class="fa fa-instagram"></i>
                            <a href="#">@ ashion_shop</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4 col-sm-4 p-0">
                    <div class="instagram__item set-bg" style={{ backgroundImage: `url(${insta6})` }}>
                        <div class="instagram__text">
                            <i class="fa fa-instagram"></i>
                            <a href="#">@ ashion_shop</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    // <!-- Instagram End -->
  )
}

export default Ig