import React, { useContext, useState, useEffect } from 'react'
import Layout from './common/Layout'
import { Link, Navigate } from 'react-router-dom'
import UserSildebar from './common/UserSildebar'
import { AuthContext } from './context/Auth'
import { apiUrl } from './common/http'
import { toast } from 'react-toastify'

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!user || !user.token) {
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${apiUrl}/user-info`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const result = await res.json();
        if (result.status === 200) {
          setUserInfo(result.data);
        } else {
          toast.error(result.message || 'Failed to fetch user information');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        toast.error('An error occurred while fetching user information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  if (!user) {
    return <Navigate to="/account/login" />;
  }

  return (
    <Layout>
        <div className="container">
            <div className="row">
                <div className="d-flex justify-content-between mt-5 pb-3">
                    <h4 className='h4 pb-0 mb-0'>My Account</h4>
                    <div>
                        <Link to="/account/change-password" className="btn btn-primary me-2">
                            Change Password
                        </Link>
                        <Link to="/account/edit" className="btn btn-outline-primary">
                            Edit Profile
                        </Link>
                    </div>
                </div>
                <div className="col-md-3">
                    <UserSildebar />
                </div>
                <div className="col-md-9">
                    <div className='card shadow'>
                        <div className='card-body p-4'>
                            {isLoading ? (
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : userInfo ? (
                                <div>
                                    <h5 className="mb-4">Profile Information</h5>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <strong>Name:</strong>
                                        </div>
                                        <div className="col-md-9">
                                            {userInfo.name}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <strong>Email:</strong>
                                        </div>
                                        <div className="col-md-9">
                                            {userInfo.email}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-3">
                                            <strong>Created At:</strong>
                                        </div>
                                        <div className="col-md-9">
                                            {new Date(userInfo.created_at).toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p>No user information available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Profile