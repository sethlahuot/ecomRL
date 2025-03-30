import React from 'react'
import LatesProducts from './common/LatesProducts';
import FeaturedProducts from './common/FeaturedProducts';
import Hero from './common/Hero';
import Layout from './common/Layout';
const Home = () => {
  return (
    <>
      <Layout>
        <Hero />
        <LatesProducts />
        <FeaturedProducts />
      </Layout>
    </>
  )
}

export default Home