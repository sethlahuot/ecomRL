import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Shop from './components/Shop'
import Product from './components/Product'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Login from './components/admin/Login'
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './components/admin/Dashboard'
import { AdminRequireAuth } from './components/admin/AdminRequireAuth'

import {default as ShowCategories} from './components/admin/category/Show'
import {default as CreateCategory} from './components/admin/category/Create'
import {default as EditCategory} from './components/admin/category/Edit'

import {default as ShowBrands} from './components/admin/brand/Show'
import {default as CreateBrand} from './components/admin/brand/Create'
import {default as EditBrand} from './components/admin/brand/Edit'

import {default as ShowProducts} from './components/admin/product/Show'
import {default as CreateProduct} from './components/admin/product/Create'
import {default as EditProduct} from './components/admin/product/Edit'

import Register from './components/Register'
import {default as UserLogin} from './components/Login'
import Profile from './components/Profile'
import { RequireAuth } from './components/RequireAuth'
import Confirmation from './components/Confirmation'
import ShowOrders from './components/admin/orders/ShowOrders'
import OrderDetail from './components/admin/orders/OrderDetail'
import {default as UserOrderDetail} from './components/front/OrderDetail'
import MyOrders from './components/front/MyOrders'
import Shipping from './components/admin/shipping/Shipping'
import ChangePassword from './components/admin/ChangePassword'
import UserChangePassword from './components/account/ChangePassword'
import EditProfile from './components/account/EditProfile'
import Users from './pages/admin/Users'


function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* User */}
          <Route path='/' element={<Home/>} />
          <Route path='/shop' element={<Shop/>} />
          <Route path='/product/:id' element={<Product/>} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/account/register' element={<Register />} />
          <Route path='/account/login' element={<UserLogin />} />
          <Route path='/admin/login' element={<Login />} />
          
          <Route path='/account' element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }/>

          <Route path='/account/edit' element={
            <RequireAuth>
              <EditProfile />
            </RequireAuth>
          }/>

          <Route path='/account/orders' element={
            <RequireAuth>
              <MyOrders />
            </RequireAuth>
          }/>

          <Route path='/account/orders/details/:id' element={
            <RequireAuth>
              <UserOrderDetail />
            </RequireAuth>
          }/>

          <Route path='/checkout' element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }/>

          <Route path='/order/confirmation/:id' element={
            <RequireAuth>
              <Confirmation />
            </RequireAuth>
          }/>

          {/* Admin */}
          
          <Route path='/admin/dashboard' element={
            <AdminRequireAuth>
              <Dashboard />
            </AdminRequireAuth>
          }/>

          <Route path='/admin/categories' element={
            <AdminRequireAuth>
              <ShowCategories />
            </AdminRequireAuth>
          }/>

          <Route path='/admin/categories/create' element={
            <AdminRequireAuth>
              <CreateCategory />
            </AdminRequireAuth>
          }/>

          <Route path='/admin/categories/edit/:id' element={
            <AdminRequireAuth>
              <EditCategory />
            </AdminRequireAuth>
          }/>

          <Route path='/admin/brands' element={
            <AdminRequireAuth>
              <ShowBrands />
            </AdminRequireAuth>
          }/>

          <Route path='/admin/brands/create' element={
            <AdminRequireAuth>
              <CreateBrand />
            </AdminRequireAuth>
          }/>

          <Route path='/admin/brands/edit/:id' element={
            <AdminRequireAuth>
              <EditBrand />
            </AdminRequireAuth>
          }/>
          <Route path='/admin/products' element={
            <AdminRequireAuth>
              <ShowProducts />
            </AdminRequireAuth>
          }/>
          <Route path='/admin/products/create' element={
            <AdminRequireAuth>
              <CreateProduct />
            </AdminRequireAuth>
          }/>
          <Route path='/admin/products/edit/:id' element={
            <AdminRequireAuth>
              <EditProduct />
            </AdminRequireAuth>
          }/>
          <Route path='/admin/orders' element={
            <AdminRequireAuth>
              <ShowOrders />
            </AdminRequireAuth>
          }/>
          <Route path='/admin/orders/:id' element={
            <AdminRequireAuth>
              <OrderDetail />
            </AdminRequireAuth>
          }/>

          <Route path='/admin/shipping' element={
            <AdminRequireAuth>
              <Shipping />
            </AdminRequireAuth>
          }/>

          <Route path="/admin/change-password" element={
            <AdminRequireAuth>
              <ChangePassword />
            </AdminRequireAuth>} />

          <Route path="/account/change-password" element={
            <RequireAuth>
              <UserChangePassword />
            </RequireAuth>} />

          <Route path='/admin/users' element={
            <AdminRequireAuth>
              <Users />
            </AdminRequireAuth>
          }/>
          
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
