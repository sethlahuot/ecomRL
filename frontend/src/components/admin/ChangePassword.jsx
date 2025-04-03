import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import { useForm } from 'react-hook-form';
import { apiUrl } from '../common/http';
import { toast } from 'react-toastify';
import { adminToken } from '../common/http';

const ChangePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [adminEmail, setAdminEmail] = useState('');
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm();

    useEffect(() => {
        const fetchAdminInfo = async () => {
            try {
                const res = await fetch(`${apiUrl}/admin/user-info`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken()}`
                    }
                });
                
                const result = await res.json();
                
                if (result.status === 200) {
                    setAdminEmail(result.data.email);
                }
            } catch (error) {
                console.error('Error fetching admin info:', error);
            }
        };
        
        fetchAdminInfo();
    }, []);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            console.log('Submitting password change request:', data);
            const res = await fetch(`${apiUrl}/admin/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            console.log('Password change response:', result);

            if (result.status === 200) {
                toast.success(result.message);
                reset();
            } else {
                toast.error(result.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Password change error:', error);
            toast.error('An error occurred while changing password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <h3 className="mb-4">Change Password</h3>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {adminEmail && (
                                        <div className="mb-3">
                                            <label className="form-label">Your Email</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={adminEmail}
                                                disabled
                                            />
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <label className="form-label">Current Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.current_password ? 'is-invalid' : ''}`}
                                            {...register('current_password', {
                                                required: 'Current password is required'
                                            })}
                                        />
                                        {errors.current_password && (
                                            <div className="invalid-feedback">
                                                {errors.current_password.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.new_password ? 'is-invalid' : ''}`}
                                            {...register('new_password', {
                                                required: 'New password is required',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Password must be at least 6 characters'
                                                }
                                            })}
                                        />
                                        {errors.new_password && (
                                            <div className="invalid-feedback">
                                                {errors.new_password.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}
                                            {...register('confirm_password', {
                                                required: 'Please confirm your password',
                                                validate: value =>
                                                    value === watch('new_password') || 'Passwords do not match'
                                            })}
                                        />
                                        {errors.confirm_password && (
                                            <div className="invalid-feedback">
                                                {errors.confirm_password.message}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Changing Password...' : 'Change Password'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ChangePassword; 