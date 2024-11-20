import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';
import logo from '../Assets/3716f6b2e790fb345b25.png';
import './Login.css';  // Ensure this CSS file is in the same folder

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const authUser = async (loginData: any) => {
    try {
      const response: any = await api.post(`${Local.LOGIN_USER}`, loginData);
      console.log("Hello", response);
      if (response.status === 200) {
        if (response.data.user.is_verified) {
          // Store user data in localStorage
          localStorage.setItem("doctype", response.data.user.doctype);
          localStorage.setItem("token", response.data.token);

          // Save firstname and lastname to localStorage
          localStorage.setItem("user_firstname", response.data.user.firstname);
          localStorage.setItem("user_lastname", response.data.user.lastname);

          toast.success("Login Successfully");
          navigate('/dashboard');
        } else {
          localStorage.setItem("email", response?.data?.user?.email);
          localStorage.setItem("OTP", response.data.OTP);
          toast.warn("User not Verified");
          navigate("/Verify");
        }
        return response;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      return;
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, "Password must be at least 8 characters long").required("Password is required")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, "Password must contain at least one special Character")
  });

  const loginMutate = useMutation({
    mutationFn: authUser,
  });

  const loginSubmit = async (values: any) => {
    loginMutate.mutate(values);
  }

  return (
    <div className="login-container">
      <div className="left-section">
        {/* <img src="your-logo.png" alt="Your Logo" className="signup-image" /> */}
        <img src={logo} alt="EyeRefer" className='signup-image' />
      </div>

      <div className="right-section">
        <h2 className='main-heading'>Eye Refer</h2><br />
        <h2 className='heading-signin'>Sign in</h2>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={loginSubmit}>
          {() => (
            <Form>
              <div className="form-group">
                <label>Enter your username or email address</label>
                <Field name="email" type="email" placeholder="Username or email address" className="form-control" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label>Enter your password</label>
                <Field name="password" type="password" placeholder="Password" className="form-control" />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </div>
              <br />
              <button type="submit" className='btn btn-outline-dark'>Login</button>
            </Form>
          )}
        </Formik>

        <Link to={'/'}>Don't have an Account? <span className="login">Sign Up</span></Link>
      </div>
    </div>
  )
}

export default Login;
