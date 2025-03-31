import React from 'react'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { Link } from 'react-router-dom'


const Create = () => {
  return (
    <Layout>
        <div className="container">
            <div className="row">
                <div className="d-flex justify-content-between mt-5 pb-3">
                    <h4 className='h4 pb-0 mb-0'>Product</h4>
                    <Link to="/admin/products" className='btn btn-primary'>back</Link>
                </div>
                <div className="col-md-3">
                    <Sidebar/>
                </div>
                <div className="col-md-9">
                    <div className='card shadow'>
                        <div className='card-body p-4'>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Create