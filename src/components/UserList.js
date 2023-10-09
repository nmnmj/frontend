import axios from 'axios'
import React, { useEffect, useState } from 'react'
import baseapi from '../utils/baseapi'
import { useGenerationStore2 } from '../utils/zustand'
import { getLUsers, getToken, searchBykeyword, setLUsers, updateLUsers } from '../utils/common'
import nodatafound from '../images/nodatafound.jpg'
import { toast } from 'react-toastify'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {RiDeleteBin6Fill} from 'react-icons/ri'
import {BiSolidCommentEdit} from 'react-icons/bi'
import isOnline from '../utils/checkNet'

const UserList = ({susers, setSusers}) => {
    const {users, setUsers}= useGenerationStore2()
    // const[susers, setSusers] = useState(JSON.parse(getLUsers()) || users)
    

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await axios.get(`${baseapi}/get-all-users`, {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            });
            // Assuming the response data structure has a 'users' field
            setUsers(response.data.users);
            setLUsers(response.data.users)
          } catch (error) {
            toast.error("Error Fetching users")
          }
        };
    
        fetchUsers();
    }, []); 

    const[viewUser, setViewUser] = useState({})

    const handleViewUser = (e, user)=>{
        e.preventDefault()
        setViewUser(user)
    }

    const handleUserDelete = async (e, user)=>{
        e.preventDefault()
        if(!isOnline){
            return
        }
        try {
            const res = await axios.post(`${baseapi}/delete-user`, {email: user.email}, {
                headers:{
                    Authorization: `Bearer ${getToken()}`
                }
            })
            if(res.status === 204){
                const fetchUsers = async () => {
                    try {
                      const response = await axios.get(`${baseapi}/get-all-users`, {
                        headers: {
                          Authorization: `Bearer ${getToken()}`,
                        },
                      });
                      // Assuming the response data structure has a 'users' field
                      setUsers(response.data.users);
                      setLUsers(response.data.users)
                      setSusers(response.data.users)
                    } catch (error) {
                      toast.error("Error Fetching users")
                    }
                  };
              
                  fetchUsers();
                toast.success("Successfully Deleted")
            }
            else{
                toast.error("Error on deletion")
            }
        } catch (error) {
            toast.error("Please try again")
        }
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string()
          .matches(/^[A-Za-z\s]+$/, 'Alphabets only')
          .required('Name is required'),
   
        phone: Yup.string()
            .matches(/^[0-9]+$/, 'Numbers only')
            .min(10).max(10)
          .required('Phone is required'),
       
        });

        const formik = useFormik({
            initialValues: {
              name: '',
              phone: '',
           
            },
            validationSchema,
            onSubmit: async (values, {resetForm}) => {
              // Handle form submission here
              values.email = viewUser.email
                if(!isOnline){
                    toast.info("Turn on Internet connection")
                    return
                }
              try {
                const res = await axios.post(`${baseapi}/update-user`, values, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                })
                if(res.status === 200){
                    toast.success(res.data.message)
                    setSusers(JSON.parse(updateLUsers(values)))
                  }
                else{
                  toast.error(res.data.message)
                }
               
              } catch (error) {
                toast.error("Please try again Later.") 
              }
            },
          });


        const handleSelectChange = (e) => {
            e.preventDefault()
            if(e.target.value === "asc"){
                function sortByNameAscending(arr) {
                    return arr.sort((a, b) => {
                      const nameA = a.name.toLowerCase();
                      const nameB = b.name.toLowerCase();
                  
                      if (nameA < nameB) {
                        return -1;
                      } else if (nameA > nameB) {
                        return 1;
                      } else {
                        return 0;
                      }
                    });
                }
                const sortedUsers = sortByNameAscending(susers);
                setSusers([...sortedUsers]);
                setLUsers([...sortedUsers])
                setUsers([...sortedUsers])
            }
            else if(e.target.value === "desc"){
                function sortByNameDescending(arr) {
                    return arr.sort((a, b) => {
                      const nameA = a.name.toLowerCase();
                      const nameB = b.name.toLowerCase();
                  
                      if (nameA > nameB) {
                        return -1;
                      } else if (nameA < nameB) {
                        return 1;
                      } else {
                        return 0;
                      }
                    });
                }
                const sortedUsers = sortByNameDescending(susers);
                setSusers([...sortedUsers]);
                setLUsers([...sortedUsers])
                setUsers([...sortedUsers])
            }
            else if(e.target.value === "lm"){
                function sortByUpdatedAtDescending(arr) {
                    return arr.sort((a, b) => {
                      const dateA = new Date(a.updatedAt);
                      const dateB = new Date(b.updatedAt);
                  
                      return dateB - dateA;
                    });
                  }
                  const sortedUsers = sortByUpdatedAtDescending(susers);
                  setSusers([...sortedUsers]);
                  setLUsers([...sortedUsers])  
                  setUsers([...sortedUsers])
            }
            else if(e.target.value === "li"){
                function sortByInsertedAtAscending(arr) {
                    return arr.sort((a, b) => {
                      const dateA = new Date(a.createdAt);
                      const dateB = new Date(b.createdAt);
                  
                      return dateA - dateB;
                    });
                  }
                  const sortedUsers = sortByInsertedAtAscending(susers);
                  setSusers([...sortedUsers]);
                  setLUsers([...sortedUsers])  
                  setUsers([...sortedUsers])
            }
        };
    
    const[searchinput, setSearchinput] = useState("")
    const[searchBy, setSearchBy] = useState("name")

    const handleSearchByChange=(e)=>{
        setSearchBy(e.target.value)
    }

    const handleSearch = (e)=>{
        e.preventDefault()
        setSearchinput(e.target.value)
        if(searchBy === "name"){
            const filteredData = JSON.parse(getLUsers()).filter(obj => obj.name.includes(e.target.value));
            setSusers(filteredData)
        }
        else if(searchBy==='phone'){
            const filteredData = JSON.parse(getLUsers()).filter(obj => obj.phone.includes(e.target.value));
            setSusers(filteredData)
        }
        else if(searchBy==='email'){
            const filteredData = JSON.parse(getLUsers()).filter(obj => obj.email.includes(e.target.value));
            setSusers(filteredData)
        }
    }

  return (
    <div>

        <div className='bg-dark text-light p-2'>
            <h5>Searching Tools</h5>
            <input
                type="text"
                className="me-2"
                id="search"
                name="seach"
                onChange={handleSearch}
                value={searchinput}
            />
            <select onChange={handleSearchByChange}>
                <option value="name">Name</option>
                <option value="phone">Mobile</option>
                <option value="email">Email</option>
            </select>
        </div>

        <div className='d-flex justify-content-center'>
            <span className='me-2 fw-bold'>
            Sort By:-
            </span>
            <select className="form-select-sm " aria-label=".form-select-sm example"
            onChange={handleSelectChange}
            >
                <option selected>Select sorting</option>
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
                <option value="lm">Last Modified</option>
                <option value="li">Last Inserted</option>
            </select>
        </div>
        
        {
            Array.isArray(susers) &&
            susers.length > 0 ?
            <>
            <div className='container bg-dark text-white pb-4 mt-2'>
                <div className='row '>
                {
                    susers.map((user, i)=>{
                        return <>
                        <div className='col-sm-4 mt-4' key={i} onClick={(e)=>handleViewUser(e, user)}>
                            <div className="card" style={{width: "18rem"}}>
                            <div className="card-body">
                                <h5 className="card-title text-uppercase pointer" data-bs-toggle="modal" data-bs-target="#usermodal">
                                    {user.name}
                                </h5>
                                <h6 className="card-subtitle mb-2 text-muted">{user.email}</h6>
                                <p className="card-text">Mobile:- {user.phone}</p>
                                <button className='btn text-dark'  data-bs-toggle="modal" data-bs-target="#editusermodal">
                                    <BiSolidCommentEdit />
                                </button>
                                <button className='btn text-danger ms-2' onClick={(e)=>handleUserDelete(e, user)} >
                                    <RiDeleteBin6Fill />
                                </button>
                            </div>
                            </div>
                            
                        </div>
                        </>
                    })
                }
                </div>
            </div>

            </>
            :
            <>  
                <img className='background-image-container' src={nodatafound} alt="no data found"  />
            </>
        }

        <div className="modal fade " id="usermodal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content bg-dark text-white">
            <div className="modal-header">
                <h2 className="modal-title text-uppercase" id="exampleModalLabel">{viewUser.name}</h2>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <h5>Email:- {viewUser.email}</h5>
                <h5>Phone:- {viewUser.phone}</h5>
                <h5>State:- {viewUser.state}</h5>
                <h5>City:- {viewUser.city}</h5>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
        </div>

        {/* edit user */}
        <div className="modal fade" id="editusermodal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                    Edit <span className='text-uppercase'>{viewUser.name}</span>'s details
                </h5>
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
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
            </div>
            </form>
            </div>
        </div>
        </div>
    </div>
  )
}

export default UserList