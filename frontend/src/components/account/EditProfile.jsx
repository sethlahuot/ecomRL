import React, { useContext, useState, useEffect } from 'react';
import Layout from '../common/Layout';
import { useForm } from 'react-hook-form';
import { apiUrl } from '../common/http';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/Auth';
import { useNavigate } from 'react-router-dom';
import UserSildebar from '../common/UserSildebar';

const EditProfile = () => {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await fetch(`${apiUrl}/user-info`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const result = await res.json();
                if (result.status === 200) {
                    reset({
                        name: result.data.name,
                        email: result.data.email
                    });
                }
            } catch (error) {
                toast.error('Failed to fetch user information');
            }
        };

        if (user) {
            fetchUserInfo();
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const res = await fetch(`${apiUrl}/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.status === 200) {
                // Update the user context with new information
                const updatedUserInfo = {
                    ...user,
                    name: data.name
                };
                login(updatedUserInfo);
                toast.success('Profile updated successfully');
                navigate('/account');
            } else {
                if (result.errors) {
                    Object.values(result.errors).forEach(error => {
                        toast.error(error[0]);
                    });
                } else {
                    toast.error(result.message || 'Failed to update profile');
                }
            }
        } catch (error) {
            toast.error('An error occurred while updating profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="d-flex justify-content-between mt-5 pb-3">
                        <h4 className='h4 pb-0 mb-0'>Edit Profile</h4>
                    </div>
                    <div className="col-md-3">
                        <UserSildebar />
                    </div>
                    <div className="col-md-9">
                        <div className='card shadow'>
                            <div className='card-body p-4'>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            {...register('name', {
                                                required: 'Name is required'
                                            })}
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback">
                                                {errors.name.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address'
                                                }
                                            })}
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                {errors.email.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-between">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => navigate('/account')}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Updating...
                                                </>
                                            ) : (
                                                'Update Profile'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EditProfile; 