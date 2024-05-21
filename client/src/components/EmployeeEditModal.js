import React, { useState, useEffect } from 'react';

import axios from 'axios';

const EmployeeEditModal = ({ showModal, handleClose, employeeId, fetchEmployees }) => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    course: [],
    image: ''
  });

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId]);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('user')}` }
      });
      setEmployeeData(response.data);
    } catch (error) {
      console.error('Fetch employee error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handleCourseChange = (e) => {
    setEmployeeData({ ...employeeData, course: e.target.value.split(',') });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/employees/${employeeId}`, employeeData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('user')}` }
      });
      fetchEmployees();
      handleClose();
    } catch (error) {
      console.error('Update employee error:', error);
    }
  };

  return (
    <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Employee</h5>
          </div>
          <button type="button" className="close" aria-label="Close" onClick={handleClose}>
              <span aria-hidden="true">&times;</span>
          </button>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" name="name" value={employeeData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" name="email" value={employeeData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Mobile</label>
                <input type="text" className="form-control" name="mobile" value={employeeData.mobile} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input type="text" className="form-control" name="designation" value={employeeData.designation} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select className="form-control" name="gender" value={employeeData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Course</label>
                <input type="text" className="form-control" name="course" value={Array.isArray(employeeData.course) ? employeeData.course.join(', ') : employeeData.course} onChange={handleCourseChange} />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input type="text" className="form-control" name="image" value={employeeData.image} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary">Save changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeEditModal;
