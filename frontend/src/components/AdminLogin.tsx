import React, { useState } from 'react';
import '../styling/sidebar.css';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import Local from '../environment/env';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';
import Button from '../common/components/CommonButton';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [passType, setPassType] = useState('password');
    const [passVisible, setPassVisible] = useState(0);

    const loginAdmin = async (formData: any) => {
        try {
            const response = await api.post(`${Local.AUTH_ADMIN_USER}`, formData);
            toast.success(response.data.message);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate('admin/app/dashboard');
        } catch (err: any) {
            toast.error(`${err.response.data.message}`);
            console.error(err);
        }
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required")
    });

    const loginMutation = useMutation({
        mutationFn: loginAdmin,
    });

    const submitHandler = (values: any) => {
        loginMutation.mutate(values);
    };

    return (
        <div className='h-100'>
            <div className='position-absolute p-4 ms-5 mt-5'>
                <div className='mt-5 mb-5'>
                    <h1 className='text-3xl text-center position-absolute top-0 pb-0 ms-5'>Admin Login</h1>
                    <hr className='opacity-100 rounded ms-5 pt-0 mt-0' />
                </div>

                <div className='ms-5'>
                    <Formik
                        initialValues={{
                            email: '',
                            password: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={submitHandler}
                    >
                        {() => (
                            <Form>
                                <div className='row mb-3'>
                                    <div className='col'>
                                        <label className='form-label'>Email</label>
                                        <Field type="email" name="email" className="form-control" placeholder="admin@example.com" />
                                        <ErrorMessage name="email" component="div" className="text-danger" />
                                    </div>
                                </div>
                                <div className='row mb-3'>
                                    <div className='col'>
                                        <label className='form-label'>Password</label>
                                        <div className='form-control p-0 d-flex'>
                                            <Field type={passType} name="password" className="form-control border-0 w-100" placeholder="*********" />
                                            {passVisible === 1 ? (
                                                <i className="bi bi-eye me-3 pt-1 text-secondary" onClick={() => {
                                                    setPassVisible(0);
                                                    setPassType('password');
                                                }}></i>
                                            ) : (
                                                <i className="bi bi-eye-slash me-3 pt-1 text-secondary" onClick={() => {
                                                    setPassVisible(1);
                                                    setPassType('text');
                                                }}></i>
                                            )}
                                        </div>
                                        <ErrorMessage name="password" component="div" className="text-danger" />
                                    </div>
                                </div>
                                <div className='mb-4'>
                                    <Link className='Link' to='/admin/register'>Don't have an account? Register</Link>
                                </div>
                                <Button text="LOGIN" type="submit" />
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
