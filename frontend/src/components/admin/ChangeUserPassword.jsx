import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiUrl } from '../common/http';
import { toast } from 'react-toastify';
import { adminToken } from '../common/http';

const ChangeUserPassword = ({ userId, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const res = await fetch(`${apiUrl}/users/${userId}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.status === 200) {
                toast.success(result.message);
                reset();
                onClose();
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
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Change User Password</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
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

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Changing Password...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeUserPassword; 