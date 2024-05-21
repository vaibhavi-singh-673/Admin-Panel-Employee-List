// EmployeeListPage.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {toast} from 'sonner';
import EmployeeEditModal from './EmployeeEditModal';

const EmployeeListPage = ({ token }) => {
  const navigate=useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(()=>{
    const token = localStorage.getItem('user');
    // console.log(token);
    if(!token){
      // console.log("chala");
      navigate('/login');
    }else{
      fetchEmployeeData();
    }
  },[searchQuery, token]);

  // Modify fetchData function to include search query parameter
  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees', {
        params: {
          searchQuery: searchQuery // Include search query parameter
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmployees(response.data);
      // console.log(response.data)
    } catch (error) {
      console.error('Fetch employees error:', error);
    }
  };

    // Handle changes in search input
  const handleSearchInputChange = (e) => {
      setSearchQuery(e.target.value);
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(employees.filter(employee => employee._id !== id));
      toast.success('Employee Deleted');
    } catch (error) {
      console.error('Delete employee error:', error);
    }
  };

  const handleEditClick = (id) => {
    setSelectedEmployeeId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployeeId(null);
  };

  return (
    <div className="employee-list-container">
    <h2>Employee-List</h2>
    <div className="button-container">
    <Link to="/create-employee"><button>Create Employee</button></Link>
      <div>
        <h4 className='search-input'>Search Employee: <input type="text" value={searchQuery} onChange={handleSearchInputChange}/></h4>
      </div>
    </div>
    <table>
         <thead>
           <tr>
             <th>S.No</th>
             <th>Image</th>
             <th>Name</th>
             <th>Email</th>
             <th>Mobile No</th>
             <th>Designation</th>
             <th>Gender</th>
             <th>Course</th>
             <th>Date Added</th>
            <th>Action</th>
           </tr>
         </thead>
         <tbody>
            {employees.map((employee, index) => (
              <tr key={employee._id}>
                <td>{index + 1}</td>
                <td><img src={`/uploads/${employee.image}`} alt="Employee" /></td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.mobile}</td>
                <td>{employee.designation}</td>
                <td>{employee.gender}</td>
                <td>{Array.isArray(employee.course) ? employee.course.join(', ') : employee.course}</td>
                <td>{new Date(employee.dateAdded).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEditClick(employee._id)}>Edit</button>
                  <button onClick={() => handleDelete(employee._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
    </table>
    {showModal && (
        <EmployeeEditModal
          showModal={showModal}
          handleClose={handleCloseModal}
          employeeId={selectedEmployeeId}
          fetchEmployees={fetchEmployeeData}
        />
    )}
  </div>
  );
};

export default EmployeeListPage;
