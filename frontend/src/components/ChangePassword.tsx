import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import { AxiosResponse } from 'axios';

const ChangePassword: React.FC = () => {
    const navigate = useNavigate();

    // Function to send the password update request
    const updatePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
        const response: AxiosResponse = await api.put('/change-password', passwordData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response; // Return the response so that it's properly handled by useMutation
    };

    // Correctly typed mutation
    const passwordMutation: UseMutationResult<
        AxiosResponse<any>, // Correct response type
        Error, // Error type
        { currentPassword: string; newPassword: string }, // Variables for mutation
        unknown // Context or additional type (if needed)
    > = useMutation({
        mutationFn: updatePassword,
        onSuccess: () => {
            toast.success('Password updated successfully');
            navigate('/profile');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update password');
        },
    });

    // Form validation schema
    const validationSchema = Yup.object().shape({
        currentPassword: Yup.string().required('Current password is required'),
        newPassword: Yup.string()
            .min(8, 'Password must be at least 8 characters long')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/\d/, 'Password must contain at least one number')
            .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, 'Password must contain at least one special character')
            .required('New password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword')], 'Passwords must match')
            .required('Confirm password is required'),
    });

    const handleSubmit = (values: { currentPassword: string; newPassword: string }) => {
        passwordMutation.mutate(values);
    };

    return (
        <div>
            <h3>Change Password</h3>
            <Formik
                initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form>
                        <div className="form-group">
                            <label>Current Password</label>
                            <Field name="currentPassword" type="password" className="form-control" />
                            <ErrorMessage name="currentPassword" component="div" className="text-danger" />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <Field name="newPassword" type="password" className="form-control" />
                            <ErrorMessage name="newPassword" component="div" className="text-danger" />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <Field name="confirmPassword" type="password" className="form-control" />
                            <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                        </div>
                        <br />
                        <button type="submit" className="btn btn-outline-dark" disabled={passwordMutation.isPending}>
                            {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ChangePassword;