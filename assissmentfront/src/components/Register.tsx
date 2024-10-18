// Register.tsx

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import InputFeild from './InputFeild';
import { useQuery } from '@tanstack/react-query';
import { createValidationSchema } from '../utilities/validators';
import { useResisterContext } from '../services/operations/userAPI';
import './Register.css';

// Set Form Initial Data
const initialFormData = {
  firstName: '',
  lastName: '',
  email: "",
  profile_image: null,
  phoneNo: '',
  gender: "male",
  hobbies: [],
  user_type: "Job_Seeker",
  agency: "",
  resume: null
};

const Register: React.FC = () => {
  const [agencyData, setAgency] = useState([]);
  const navigate = useNavigate();

  // Fetch agency data
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4401/api/v1/getAllAgency");
      setAgency(response.data.data);
      return response;
    } catch (error) {
      console.error("Error fetching agencies:", error);
      toast.error("Failed to fetch agencies.");
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["getAgencies"],
    queryFn: fetchData,
    staleTime: 1000 * 60
  });

  const { mutate, isPending, isError, error } = useResisterContext(navigate);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="register-container">
      <h1>Register Form</h1>
      <Formik
        initialValues={initialFormData}
        validationSchema={createValidationSchema}
        onSubmit={async (values) => {
          try {
            const formData: any = new FormData();
            Object.keys(values).forEach((key) => formData.append(key, (values as any)[key]));
            await mutate(formData);
            toast.success("Registration successful!");
          } catch (error) {
            console.error("Registration error:", error);
            toast.error("Unable to upload data. Please try again.");
          }
        }}
      >
        {({ values, setFieldValue, setValues }) => (
          <Form>
            <InputFeild fieldName="firstName" label="First Name" placeHolder="Enter your First Name" />
            {values.user_type === 'Job_Seeker' && <InputFeild fieldName="lastName" label="Last Name" placeHolder="Enter your Last Name" />}
            <InputFeild fieldName="email" label="Email" placeHolder="Enter your Email" />
            <InputFeild fieldName="phoneNo" label="Phone Number" placeHolder="Enter Your Phone No" />

            <div>
              <label htmlFor="gender">Gender: </label>
              <label htmlFor="male">Male</label>
              <Field type="radio" id="male" name="gender" value="male" />
              <label htmlFor="female">Female</label>
              <Field type="radio" id="female" name="gender" value="female" />
              <label htmlFor="other">Other</label>
              <Field type="radio" id="other" name="gender" value="other" />
            </div>

            <div id="checkbox-group">Hobbies</div>
            <div role="group" aria-labelledby="checkbox-group">
              {['Singing', 'Traveling', 'Reading', 'Playing'].map((hobby) => (
                <div key={hobby}>
                  <Field type="checkbox" id={hobby} name="hobbies" value={hobby}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const checked = e.target.checked;
                      const currentHobbies = values.hobbies;
                      if (checked) {
                        setFieldValue("hobbies", [...currentHobbies, hobby]);
                      } else {
                        setFieldValue("hobbies", currentHobbies.filter((h: string) => h !== hobby));
                      }
                    }}
                  />
                  <label htmlFor={hobby}>{hobby}</label>
                </div>
              ))}
              <ErrorMessage name="hobbies" component="span" />
            </div>

            <div>
              <label htmlFor="user_type">User Type</label>
              <Field as="select" name="user_type">
                <option value="Job_Seeker">Job Seeker</option>
                <option value="Agency">Agency</option>
              </Field>
            </div>

            <div>
              <label htmlFor="profile_image">Profile Image</label>
              <input
                id="profile_image"
                name="profile_image"
                type="file"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const file = event.target.files?.[0] || null;
                  setFieldValue('profile_image', file);
                }}
              />
              <ErrorMessage name="profile_image" component="div" />
            </div>

            {values.user_type === 'Job_Seeker' && (
              <>
                <div>
                  <label htmlFor="resume">Resume</label>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const file = event.target.files?.[0] || null;
                      setFieldValue('resume', file);
                    }}
                  />
                  <ErrorMessage name="resume" component="div" />
                </div>

                <div>
                  <label htmlFor="agency">Agency</label>
                  <Field as="select" name="agency">
                    <option value="">Select Agency</option>
                    {agencyData?.map((agency: any) => (
                      <option key={agency.id} value={agency.id}>{agency.firstName}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="agency" component="div" />
                </div>
              </>
            )}

            <div>
              <button type="submit">Signup</button> &nbsp;
              {/* <Link to="/login"><button>Login</button></Link> */}
              <br /><br />
              <button type="button" onClick={() => { setValues(initialFormData) }}>Reset</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
