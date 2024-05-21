import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {toast} from 'sonner';
import { Navigate, useNavigate } from 'react-router-dom';

const CreateEmployeePage = (token) => {
  const navigate=useNavigate();
  useEffect(()=>{
    const token = localStorage.getItem('user');
    console.log(token);
    if(!token){
      console.log("chala");
      navigate('/login');
    }
  },[]
  )

    const [newEmployeeData, setNewEmployeeData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: '',
        image: '' // Add image field
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployeeData({
      ...newEmployeeData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       const response = await axios.post(
        'http://localhost:5000/api/employees',
        newEmployeeData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.status);
      // Fetch data again to update the employee list
      // fetchData();
      // Clear the form fields after successful creation
      setNewEmployeeData({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: '',
        image: '' // Reset image field
      });
      // Redirect to employee list page
      // window.location.href = '/employee-list';

      if (response.status ===201){
        console.log("ok");
        toast.success('Employee Created Successful')
        navigate('/');
      }
      else{
        console.error('Create employee error');
      }
    } catch (error) {
      console.error('Create employee error:', error);
    }
  };

  return (
    <div className="create-employee-container">
      <h2>Create Employee</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={newEmployeeData.name} onChange={handleInputChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={newEmployeeData.email} onChange={handleInputChange} />
        </div>
        <div>
          <label>Mobile:</label>
          <input type="text" name="mobile" value={newEmployeeData.mobile} onChange={handleInputChange} />
        </div>
        <div>
          <label>Designation:</label>
          <input type="text" name="designation" value={newEmployeeData.designation} onChange={handleInputChange} />
        </div>
        <div>
          <label>Gender:</label>
          <input type="text" name="gender" value={newEmployeeData.gender} onChange={handleInputChange} />
        </div>
        <div>
          <label>Course:</label>
          <input type="text" name="course" value={newEmployeeData.course} onChange={handleInputChange} />
        </div>
        <div>
          <label>Image:</label>
          <input type="File-Upload" name="image" value={newEmployeeData.image} onChange={handleInputChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateEmployeePage;
