import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';
import './AddStaff.css';

const AddStaff: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Redirect unauthorized users to login
  useEffect(() => {
    if (!token) navigate('/login');
  }, [navigate, token]);

  // Mutation to handle staff addition
  const staffMutate = useMutation({
    mutationFn: async (values: any) => {
      // const response = await api.post(`${Local.ADD_STAFF}`, values, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // return response.data;
    },
    onSuccess: (_data) => {
      toast.success('Staff added successfully');
      navigate('/staff-list'); // Navigate to staff list or any other page after successful addition
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error occurred while adding staff');
    },
  });

  // Form validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Staff Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    contact: Yup.string().required('Contact is required'),
    gender: Yup.string().required('Gender is required'),
  });

  const handleFormSubmit = (values: any) => {
    staffMutate.mutate(values);
  };

  return (
    <div>
      <Formik
        initialValues={{
          name: '',
          email: '',
          contact: '',
          gender: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {() => (
          <Form>
            <div className="form-group">
              <label>Staff Name:</label>
              <Field
                type="text"
                name="name"
                placeholder="Enter Staff Name"
                className="form-control"
              />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>
            <br />

            <div className="form-group">
              <label>Email:</label>
              <Field
                type="email"
                name="email"
                placeholder="Enter Email"
                className="form-control"
              />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <br />

            <div className="form-group">
              <label>Contact:</label>
              <Field
                type="text"
                name="contact"
                placeholder="Enter Contact Number"
                className="form-control"
              />
              <ErrorMessage name="contact" component="div" className="text-danger" />
            </div>
            <br />

            <div className="form-group">
              <label>Gender:</label>
              <div>
                <label>
                  <Field type="radio" name="gender" value="Male" /> Male
                </label>
                <label className="ms-3">
                  <Field type="radio" name="gender" value="Female" /> Female
                </label>
                <ErrorMessage name="gender" component="div" className="text-danger" />
              </div>
            </div>
            <br />

            <button type="submit" className="btn btn-outline-primary">
              Add Staff
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddStaff;