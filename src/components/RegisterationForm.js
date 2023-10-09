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


function RegistrationForm() {

  const{setLogin, isLogin} = useGenerationStore()
  const recommendedStates = ["Gujarat", "Maharashtra", "Karnataka"];


  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Alphabets only')
      .required('Name is required'),
    email: Yup.string().email("Invalid email Address")
      .required('Email is required'),
    phone: Yup.string()
        .matches(/^[0-9]+$/, 'Numbers only')
        .min(10).max(10)
      .required('Phone is required'),
    gender: Yup.string().required('Gender is required'),
    sources: Yup.array().min(1, 'At least one source is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
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
      name: '',
      email: '',
      phone: '',
      gender: 'Male',
      sources: [],
      city: 'Mumbai',
      state: '',
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
        const res = await axios.post(`${baseapi}/register`, values)
        if(res.status === 201){
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
    <div className="container mt-2 p-2 bg-dark text-white">
      <Toast />
      <h2 className='text-decoration-underline'>Registration Form -</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-danger">{formik.errors.name}</div>
          ) : null}
        </div>

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

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
          />
          {formik.touched.phone && formik.errors.phone ? (
            <div className="text-danger">{formik.errors.phone}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="male"
              name="gender"
              value="Male"
              checked={formik.values.gender === 'Male'}
              onChange={formik.handleChange}
            />
            <label className="form-check-label" htmlFor="male">Male</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="female"
              name="gender"
              value="Female"
              checked={formik.values.gender === 'Female'}
              onChange={formik.handleChange}
            />
            <label className="form-check-label" htmlFor="female">Female</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="others"
              name="gender"
              value="Others"
              checked={formik.values.gender === 'Others'}
              onChange={formik.handleChange}
            />
            <label className="form-check-label" htmlFor="others">Others</label>
          </div>
          {formik.touched.gender && formik.errors.gender ? (
            <div className="text-danger">{formik.errors.gender}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label>How did you hear about this?</label>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="linkedin"
              name="sources"
              value="LinkedIn"
              checked={formik.values.sources.includes('LinkedIn')}
              onChange={formik.handleChange}
            />
            <label className="form-check-label" htmlFor="linkedin">LinkedIn</label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="friends"
              name="sources"
              value="Friends"
              checked={formik.values.sources.includes('Friends')}
              onChange={formik.handleChange}
            />
            <label className="form-check-label" htmlFor="friends">Friends</label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="jobportal"
              name="sources"
              value="Job Portal"
              checked={formik.values.sources.includes('Job Portal')}
              onChange={formik.handleChange}
            />
            <label className="form-check-label" htmlFor="jobportal">Job Portal</label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="others-source"
              name="sources"
              value="Others"
              checked={formik.values.sources.includes('Others')}
              onChange={formik.handleChange}
            />
            <label className="form-check-label" htmlFor="others-source">Others</label>
          </div>
          {formik.touched.sources && formik.errors.sources ? (
            <div className="text-danger">{formik.errors.sources}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="city">City:</label>
          <select
            className="form-control"
            id="city"
            name="city"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.city}
          >
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
            <option value="Ahmedabad">Ahmedabad</option>
          </select>
          {formik.touched.city && formik.errors.city ? (
            <div className="text-danger">{formik.errors.city}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="state">State:</label>
          <input
            type="text"
            className="form-control"
            id="state"
            name="state"
            list="stateSuggestions"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.state}
          />
          {formik.touched.state && formik.errors.state ? (
            <div className="text-danger">{formik.errors.state}</div>
          ) : null}

          {/* Define the datalist */}
          <datalist id="stateSuggestions">
            {recommendedStates.map((state) => (
              <option key={state} value={state} />
            ))}
          </datalist>
        </div>

        <button type="submit" className="btn btn-outline-light mt-3">Save</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
