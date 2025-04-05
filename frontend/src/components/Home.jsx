import React from 'react'
import LatesProducts from './common/LatesProducts';
import FeaturedProducts from './common/FeaturedProducts';
import Hero from './common/Hero';
import Layout from './common/Layout';
import Banner from './common/Banner';
import Ig from './common/Ig';
const Home = () => {
  return (
    <>
      <Layout>
        <Hero />
        <LatesProducts />
        <Banner />
        <FeaturedProducts />
        <Ig />
      </Layout>
    </>
  )
}

export default Home