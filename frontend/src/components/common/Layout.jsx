import React from 'react'
import Header from './Header'
import Fooder from './Fooder'

const Layout = ({children}) => {
  return (
    <>
        <Header />
        {children}
        <Fooder />
    </>
  )
}

export default Layout