import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';
import * as Yup from 'yup';
import React, { useEffect } from 'react';


const Verify:React.FC = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        if(!localStorage.getItem('OTP')){
            navigate('/login')
        }else{
            toast.info("OTP sent Successfully");
        }

        return ()=>{
            localStorage.removeItem('OTP');
        }
    });

    const OTP:any = localStorage.getItem("OTP");
    const email:any = localStorage.getItem("email");

    const verifyUser = async() => {
        const resposne  =  await api.put(`${Local.VERIFY_USER}`, {email});
        return resposne;
    }
    
    const validationSchema = Yup.object().shape({
        otp: Yup.string().required("OTP is required").test("OTP Matched", "OTP Mismatch", (value:string)=>{
            return value === OTP;
        })
    })

    const verifyMutation = useMutation({
        mutationFn: verifyUser
    })

    const  handleSubmit = (values: any) => {
        // console.log(values);
        if (values.otp === OTP){
            toast.success("OTP Matched");
            verifyMutation.mutate(email)
            navigate('/Login');
        }
        else{
            toast.error("Invalid OTP");
        }
    }

  return (
    <div>
        <Formik
        initialValues={{
            otp: ''
            }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
            {() => (
                <Form>
                    <div className="form-group">
                        <label>OTP</label>
                        <Field type="text" name="otp" className="form-control" />
                        <ErrorMessage name="otp" component="div" className="text-danger" />
                    </div>
                    <br />
                        <button type="submit" className='btn btn-outline-dark' >Submit</button>
                </Form>
            )}
        </Formik>

    </div>
  )
}

export default Verify
