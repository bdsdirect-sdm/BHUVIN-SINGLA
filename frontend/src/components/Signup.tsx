import {Formik, Form, Field, ErrorMessage} from 'formik'
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Local } from '../environment/env';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import * as Yup from 'yup';

// Error Message for Existing User is pending....

const Signup:React.FC = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem('token')){
          navigate('/dashboard')
        }
      },[]);

    const addUser = async(formData:any) => {
        try{
            const response = await api.post(`${Local.CREATE_USER}`, formData);
            console.log("Response--->", response.data);
            localStorage.setItem("email", formData.email);
            localStorage.setItem("OTP", response.data.OTP);
            toast.success(response.data.message);
            return response;
        }
        catch(err:any){
            toast.error(err?.response?.data?.message);
            return err;
        }
    }
    
    const  validationSchema = Yup.object().shape({
        firstname: Yup.string().required('First name is required'),
        lastname: Yup.string().required('Last name is required'),
        doctype: Yup.number().required("Select Doctor Type"),
        email: Yup.string().email("Invalid Email").required("Email is required"),
        password: Yup.string().min(8, "Password must be atleast 8 characters long").required("Password is required")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[`~!@#$%^&*()"?<>|:{}(),.]/, "Password must contain at least one special Character"),
        confirmPass:  Yup.string().required("Confirm Password is required")
        .oneOf([Yup.ref('password')], 'Passwords must match')
    });

    const signupMutation = useMutation({
        mutationFn: addUser,
        onSuccess: ()=>{navigate("/Verify");}

    });

    const signupHandler = (values: any) => {
        const {confirmPass, ...data} = values
        signupMutation.mutate(data);
        
    }

  return (
    <div>
        <Formik 
        initialValues={{
            firstname: '',
            lastname: '',
            doctype: '',
            email: '',
            password: '',
            confirmPass: ''
            }}
            validationSchema={validationSchema}
            onSubmit={signupHandler}>
            {()=>(
                <>
                <Form>
                    <div className="form-group">
                        <label>First Name:</label>
                        <Field type="text" name="firstname" minLength={3} className="form-control"/>
                        <ErrorMessage name="firstname" component="div" className="text-danger"/>
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Last Name:</label>
                        <Field type="text" name="lastname" minLength={3} className="form-control"/>
                        <ErrorMessage name="lastname" component="div" className="text-danger"/>
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Doctor Type:</label>
                        <Field as="select" name="doctype" className="form-control">
                            <option value="" defaultChecked disabled>Select Doctor Type</option>
                            <option value="1">MD</option>
                            <option value="2">OD</option>
                        </Field>
                        <ErrorMessage name="doctype" component="div" className="text-danger"/>
                    </div>
                    <br />
                    
                    <div className="form-group">
                        <label>Email:</label>
                        <Field type="email" name="email" className="form-control"/>
                        <ErrorMessage name="email" component="div" className="text-danger"/>
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Password:</label>
                        <Field type="password" name="password" minLength={8} className="form-control"/>
                        <ErrorMessage name="password" component="div" className="text-danger"/>
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <Field type="password" name="confirmPass" minLength={8} className="form-control"/>
                        <ErrorMessage name='confirmPass' component="div" className='text-danger' />
                    </div>
                    <br />
                    <button type='submit' className='btn btn-outline-primary'>Submit</button>
                </Form>
                </>
            )}
        </Formik>
            <Link to={'/Login'} >Already have an Account</Link>
    </div>
  )
}

export default Signup
