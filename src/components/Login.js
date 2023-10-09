import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import Toast from './Toast';
import baseapi from '../utils/baseapi';
import isOnline from '../utils/checkNet';
import { setToken } from '../utils/common';
import { useGenerationStore } from '../utils/zustand';


function LoginForm() {

  const{setLogin, isLogin} = useGenerationStore()

  const validationSchema = Yup.object().shape({
   
    email: Yup.string().email("Invalid email Address")
      .required('Email is required'),
    
    password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .min(8, "Minimum length should be 8")
    .max(16, "Maximum length should be 16"),
    });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, {resetForm}) => {
      // Handle form submission here
     
        if(!isOnline){
            toast.info("no")
            return
        }
      try {
        const res = await axios.post(`${baseapi}/login`, values)
        console.log(res)
        if(res.status === 200){
            toast.success(res.data.message)
        }
        else{
            toast.error(res.data.message)
        }
        if(res.data.token){
            setToken(res.data.token)
            setLogin(true)
            resetForm()

        }
      } catch (error) {
        toast.error("Please try again Later.") 
      }
    },
  });

  return (
    <div className="container mt-2 bg-dark text-white p-2">
      <Toast />
      <h2 className='text-decoration-underline'>Login Form -</h2>
      <form onSubmit={formik.handleSubmit}>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-danger">{formik.errors.email}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-danger">{formik.errors.password}</div>
          ) : null}
        </div>

        <button type="submit" className="btn btn-outline-light mt-3">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
