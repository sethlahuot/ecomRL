import React from 'react'
import Layout from './common/Layout'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiUrl } from './common/http';


const Register = () => {
    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    
    const onSubmit = async (data) => {
        try {
            const res = await fetch(`${apiUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await res.json();
            
            if (result.status === 200) {
                toast.success(result.message);
                navigate('/account/login');
            } else {
                const formErrors = result.errors;
                Object.keys(formErrors).forEach((field) => {
                    setError(field, { message: formErrors[field][0] });
                });
                toast.error('Registration failed. Please check the form for errors.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('An error occurred during registration. Please try again.');
        }
    }

  return (
    <Layout>
        <div className="container d-flex justify-content-center py-5">
        <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card shadow border-0 login">
                    <div className="card-body p-4">
                        <h3 className='border-bottom pb-2 mb-3'>Register</h3>
                        <div className="mb-3">
                            <label htmlFor="" className='form-label'>Name</label>
                            <input 
                            {
                                ...register('name',{
                                    required: "The name field is required",
                                }) 
                            }
                            type="text" 
                            className={`form-control ${errors.name && 'is-invalid'}`} 
                            placeholder='Name' />
                            {
                                errors.name && <p className='invalid-feedback'>{errors.name?.message}</p>
                            }
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className='form-label'>Email</label>
                            <input 
                            {
                                ...register('email',{
                                    required: "The email field is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    } 
                                }) 
                            }
                            type="text" 
                            className={`form-control ${errors.email && 'is-invalid'}`} 
                            placeholder='Email' />
                            {
                                errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>
                            }
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className='form-label'>Password</label>
                            <input 
                            {
                                ...register("password",{
                                    required: "The password field is required!!"
                                })
                            }
                            type="password" 
                            className={`form-control ${errors.password && 'is-invalid'}`} 
                            placeholder='Password' />
                            {
                                errors.password && <p className='invalid-feedback'>{errors.password?.message}</p>
                            }
                        </div>
                        <button className='btn btn-secondary w-100'>Register</button>
                        <div className='d-flex justify-content-center pt-4 pd-2'>
                            Already have an account? &nbsp; <Link to="/account/login">Login</Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </Layout>
    )
}

export default Register