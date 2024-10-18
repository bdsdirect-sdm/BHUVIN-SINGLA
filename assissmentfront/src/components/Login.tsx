//Login.tsx

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { createLoginSchema } from '../utilities/validators';
import { useDispatch } from 'react-redux';
import { useLoginContext } from '../services/operations/userAPI';
import { useState } from 'react';


const Login = () => {
  const [stay, setStay] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useLoginContext(dispatch, navigate, stay)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">Login</h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={createLoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await mutate(values as any);
            } catch (error) {
              console.error("Login failed:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
                <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              {isPending && <p className="text-blue-600 mb-3">Loading...</p>}
              {isError && <p className="text-red-600 mb-3">Error: {error?.message}</p>}

              <div>
                <label htmlFor='stay_login'>Stay Sign in</label>
                <input name="stay_login" type='checkbox' onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const checked = e.target.checked;
                  if (checked) {
                    setStay(true)
                  }
                  else {
                    setStay(false);
                  }
                }} />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button><br /><br />
              {/* <Link to="/"><button>Already an user ?  Register</button></Link> */}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
