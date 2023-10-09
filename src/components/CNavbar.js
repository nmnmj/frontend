import { toast } from "react-toastify";
import { getToken, removeLUsers, removeToken, setLUsers } from "../utils/common";
import { useGenerationStore, useGenerationStore2 } from "../utils/zustand";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import isOnline from "../utils/checkNet";
import baseapi from "../utils/baseapi";
import Toast from "./Toast";

function CNavbar({susers, setSusers}) {

  const{setLogin, isLogin} = useGenerationStore()
  const {users, setUsers}= useGenerationStore2()

  const handleLogout = ()=>{
    removeToken()
    removeLUsers()
    toast.success("Logged out successfully")
    setLogin(false)
  }

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
   
    });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
   
    },
    validationSchema,
    onSubmit: async (values, {resetForm}) => {
      // Handle form submission here
        if(!isOnline){
            toast.info("Turn on Internet Connection")
            return
        }
      try {
        const res = await axios.post(`${baseapi}/register`, values)
        if(res.status === 201){
            toast.success(res.data.message)
            const fetchUsers = async () => {
              try {
                const response = await axios.get(`${baseapi}/get-all-users`, {
                  headers: {
                    Authorization: `Bearer ${getToken()}`,
                  },
                });

                setLUsers(response.data.users)
                setUsers(response.data.users);
                setSusers(response.data.users)
              } catch (error) {
                toast.error(res.data.message)
              }
            }
            fetchUsers()
          }
        else{
          toast.error(res.data.message)
        }
       
      } catch (error) {
        toast.error("Please try again Later.") 
      }
    },
  });

  return (
    <>
    <nav className="navbar navbar-dark bg-dark">
      <Toast />
      <div className="container-fluid">
        <span className="navbar-brand btn btn-outline-light bg-secondary p-2 mb-0 h1">Dashboard</span>
        {
          getToken() &&
          <div>
            <button className="btn btn-outline-light me-3" data-bs-toggle="modal" data-bs-target="#exampleModal" >New User +</button>
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
          </div>
        }
      </div>
      
    </nav>
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Add User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
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
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
            </div>
            </form>
          </div>
        </div>
      </div>
    </>
    
  );
}

export default CNavbar;