import React, { useEffect, useState } from 'react'
import Layout from '../common/Layout'
import Sidebar from '../common/Sidebar'
import { apiUrl, adminToken } from '../common/http'
import Loader from '../common/Loader'

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    categories: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Fetch users
      const usersRes = await fetch(`${apiUrl}/users`, {
        headers: {
          'Authorization': `Bearer ${adminToken()}`
        }
      });
      const usersData = await usersRes.json();
      
      // Fetch orders
      const ordersRes = await fetch(`${apiUrl}/orders`, {
        headers: {
          'Authorization': `Bearer ${adminToken()}`
        }
      });
      const ordersData = await ordersRes.json();
      
      // Fetch products
      const productsRes = await fetch(`${apiUrl}/products`, {
        headers: {
          'Authorization': `Bearer ${adminToken()}`
        }
      });
      const productsData = await productsRes.json();
      
      // Fetch categories
      const categoriesRes = await fetch(`${apiUrl}/categories`, {
        headers: {
          'Authorization': `Bearer ${adminToken()}`
        }
      });
      const categoriesData = await categoriesRes.json();

      // Calculate total sales from orders
      const totalSales = ordersData.data.reduce((sum, order) => sum + parseFloat(order.grand_total), 0);

      setStats({
        users: usersData.data?.length || 0,
        orders: ordersData.data?.length || 0,
        products: productsData.data?.length || 0,
        categories: categoriesData.data?.length || 0,
        totalSales: totalSales.toFixed(2)
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout>
        <div className="container">
            <div className="row">
                <div className="d-flex justify-content-between mt-5 pb-3">
                    <h4 className='h4 pb-0 mb-0'>
                        Dashboard
                    </h4>
                </div>
                <div className="col-md-3">
                    <Sidebar/>
                </div>
                <div className="col-md-9">
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="row">
                            <div className="col-md-4 mb-4">
                                <div className="card shadow">
                                    <div className='card-body'>
                                        <h2>{stats.users}</h2>
                                        <span>Users</span>
                                    </div>
                                    <div className='card-footer'>
                                        <a href="/admin/users">View Users</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-4">
                                <div className="card shadow">
                                    <div className='card-body'>
                                        <h2>{stats.orders}</h2>
                                        <span>Orders</span>
                                    </div>
                                    <div className='card-footer'>
                                        <a href="/admin/orders">View Orders</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-4">
                                <div className="card shadow">
                                    <div className='card-body'>
                                        <h2>{stats.products}</h2>
                                        <span>Products</span>
                                    </div>
                                    <div className='card-footer'>
                                        <a href="/admin/products">View Products</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-4">
                                <div className="card shadow">
                                    <div className='card-body'>
                                        <h2>{stats.categories}</h2>
                                        <span>Categories</span>
                                    </div>
                                    <div className='card-footer'>
                                        <a href="/admin/categories">View Categories</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-4">
                                <div className="card shadow">
                                    <div className='card-body'>
                                        <h2>${stats.totalSales}</h2>
                                        <span>Total Sales</span>
                                    </div>
                                    <div className='card-footer'>
                                        <a href="/admin/orders">View Details</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Dashboard