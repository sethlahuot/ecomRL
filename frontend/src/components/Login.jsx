import React, { useContext, useState } from 'react'
import Layout from './common/Layout'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiUrl } from './common/http';
import { AuthContext } from './context/Auth';


const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const {login} = useContext(AuthContext);

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const res = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await res.json();
            
            if (result.status === 200) {
                const userInfo = {
                    token: result.token,
                    id: result.id,
                    name: result.name
                }
                localStorage.setItem('userInfo', JSON.stringify(userInfo))
                login(userInfo)
                navigate('/account')
            } else {
                toast.error(result.message || 'Login failed');
            }
        } catch (error) {
            toast.error('An error occurred during login');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    }


  return (
    <Layout>
        <div className="container d-flex justify-content-center py-5">
        <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card shadow border-0 login">
                    <div className="card-body p-4">
                        <h3 className='border-bottom pb-2 mb-3'>Login</h3>
                        
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
                        <button className='btn btn-secondary w-100' disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                        <div className='d-flex justify-content-center pt-4 pd-2'>
                            Don't have an account? &nbsp; <Link to="/account/register">Register</Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </Layout>
  )
}

export default Login