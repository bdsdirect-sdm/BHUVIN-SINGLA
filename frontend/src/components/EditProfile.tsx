import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { Local } from '../environment/env';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';

const token = localStorage.getItem('token');

const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    // If user is not available, show an error or redirect
    if (!user) {
        return <div>Error: User data not found!</div>;
    }

    const updateUser = async (data: any) => {
        try {
            const response = await api.put(`${Local.UPDATE_USER}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'An error occurred';
            toast.error(`Error: ${errorMessage}`);
        }
    };

    const updateUserMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            toast.success('Profile updated successfully');
            navigate('/profile');
        },
    });

    // Validation schema
    const validationSchema = Yup.object().shape({
        firstname: Yup.string().required('First name is required'),
        lastname: Yup.string().required('Last name is required'),
        gender: Yup.string().required('Gender is required'),
        phone: Yup.string().required('Phone number is required')
            .min(10, 'Phone number must be 10 digits')
            .max(10, 'Phone number must be 10 digits'),
        street: Yup.string().required('Street is required'),
        district: Yup.string().required('District is required'),
        state: Yup.string().required('State is required'),
        city: Yup.string().required('City is required'),
        pincode: Yup.string().required('Pincode is required')
            .min(6, 'Pincode must be 6 digits')
            .max(6, 'Pincode must be 6 digits'),
    });

    const handleFormSubmit = (values: any) => {
        updateUserMutation.mutate(values);
    };

    return (
        <div className="edit-profile-container">
            <h3>Edit Profile</h3>
            <Formik
                initialValues={{
                    firstname: user.firstname || '',
                    lastname: user.lastname || '',
                    gender: user.gender || '',
                    phone: user.phone || '',
                    street: user.address?.[0]?.street || '',
                    district: user.address?.[0]?.district || '',
                    state: user.address?.[0]?.state || '',
                    city: user.address?.[0]?.city || '',
                    pincode: user.address?.[0]?.pincode || '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
            >
                {() => (
                    <Form>
                        {/* Profile Details */}
                        <div className="form-group">
                            <label>First Name</label>
                            <Field type="text" name="firstname" className="form-control" />
                            <ErrorMessage name="firstname" component="div" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <Field type="text" name="lastname" className="form-control" />
                            <ErrorMessage name="lastname" component="div" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label>Gender</label>
                            <Field as="select" name="gender" className="form-control">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Field>
                            <ErrorMessage name="gender" component="div" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <Field type="text" name="phone" className="form-control" maxLength={10} />
                            <ErrorMessage name="phone" component="div" className="text-danger" />
                        </div>

                        {/* Address Details */}
                        <div className="form-group">
                            <label>Address Line 1</label>
                            <Field type="text" name="street" className="form-control" />
                            <ErrorMessage name="street" component="div" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label>Address Line 2</label>
                            <Field type="text" name="district" className="form-control" />
                            <ErrorMessage name="district" component="div" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label>State</label>
                            <Field type="text" name="state" className="form-control" />
                            <ErrorMessage name="state" component="div" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <Field type="text" name="city" className="form-control" />
                            <ErrorMessage name="city" component="div" className="text-danger" />
                        </div>

                        <div className="form-group">
                            <label>Pincode</label>
                            <Field type="text" name="pincode" className="form-control" maxLength={6} />
                            <ErrorMessage name="pincode" component="div" className="text-danger" />
                        </div>

                        <button type="submit" className="btn btn-outline-dark">Save Details</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditProfile;
