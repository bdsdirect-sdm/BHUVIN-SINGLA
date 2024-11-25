import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';
// import './AddPatient.css';

const AddPatient: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Redirect unauthorized users to login
  useEffect(() => {
    if (!token) navigate('/login');
    if (localStorage.getItem('doctype') === '1') navigate('/dashboard');
  }, [navigate, token]);

  // Fetch the list of doctors
  const fetchDocs = async () => {
    const response = await api.get(`${Local.GET_DOC_LIST}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const { data: MDList, isLoading, isError, error } = useQuery({
    queryKey: ['MDList'],
    queryFn: fetchDocs,
  });

  // Mutation to handle patient addition
  const patientMutate = useMutation({
    mutationFn: async (values: any) => {
      const response = await api.post(`${Local.ADD_PATIENT}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (_data) => {
      toast.success('Patient referred successfully');
      navigate('/dashboard');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error occurred while adding patient');
    },
  });

  // Form validation schema
  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    disease: Yup.string().required('Disease is required'),
    referedto: Yup.string().required('Please select a doctor'),
    address: Yup.string().required('Please select an address'),
    referback: Yup.string().required('Please select an option'),
  });

  const handleFormSubmit = (values: any) => {
    patientMutate.mutate(values);
  };

  if (isLoading) {
    return (
      <div>
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error?.message || 'Error loading data'}</div>;
  }

  return (
    <div>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          disease: '',
          referedto: '',
          address: '',
          referback: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values }) => (
          <Form>
            <div className="form-group">
              <label>First Name:</label>
              <Field
                type="text"
                name="firstname"
                placeholder="Enter First Name"
                className="form-control"
              />
              <ErrorMessage name="firstname" component="div" className="text-danger" />
            </div>
            <br />

            <div className="form-group">
              <label>Last Name:</label>
              <Field
                type="text"
                name="lastname"
                placeholder="Enter Last Name"
                className="form-control"
              />
              <ErrorMessage name="lastname" component="div" className="text-danger" />
            </div>
            <br />

            <div className="form-group">
              <label>Disease:</label>
              <Field as="select" name="disease" className="form-select">
                <option value="" disabled>
                  Choose Disease
                </option>
                {['Disease 1', 'Disease 2', 'Disease 3', 'Disease 4', 'Disease 5'].map(
                  (disease) => (
                    <option key={disease} value={disease}>
                      {disease}
                    </option>
                  )
                )}
              </Field>
              <ErrorMessage name="disease" component="div" className="text-danger" />
            </div>
            <br />

            <div className="form-group">
              <label>Doctor:</label>
              <Field as="select" name="referedto" className="form-select">
                <option value="" disabled>
                  Choose Doctor
                </option>
                {MDList?.docList?.map((md: any) => (
                  <option key={md.uuid} value={md.uuid}>
                    {md.firstname} {md.lastname}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="referedto" component="div" className="text-danger" />
            </div>
            <br />

            <div className="form-group">
              <label>Address:</label>
              <Field as="select" name="address" className="form-select">
                <option value="" disabled>
                  Choose Address
                </option>
                {values.referedto &&
                  MDList.docList
                    .find((md: any) => md.uuid === values.referedto)
                    ?.Addresses.map((address: any) => (
                      <option key={address.uuid} value={address.uuid}>
                        {address.street}, {address.city}, {address.state}
                      </option>
                    ))}
              </Field>
              <ErrorMessage name="address" component="div" className="text-danger" />
            </div>
            <br />

            <div className="form-group">
              <label>Return back to referer:</label>
              <div>
                <label>
                  <Field type="radio" name="referback" value="1" /> Yes
                </label>
                <label className="ms-3">
                  <Field type="radio" name="referback" value="0" /> No
                </label>
              </div>
              <ErrorMessage name="referback" component="div" className="text-danger" />
            </div>
            <br />

            <button type="submit" className="btn btn-outline-primary">
              Add Referral
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddPatient;
