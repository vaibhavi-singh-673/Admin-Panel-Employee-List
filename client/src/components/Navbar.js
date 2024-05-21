// Navbar.js

import React from 'react'
import { Link, Navigate,useNavigate } from 'react-router-dom';



const Navbar = () => {


  const token = localStorage.getItem('user');

  const navigate=useNavigate();
  const handleLogOut=()=>{
    localStorage.removeItem('user');
    navigate('/login');
  }
  return (
    <nav>
      <ul>
        <li><Link to="/">Employee List</Link></li>
      </ul>

        {token && <button  className="logout-button" onClick={handleLogOut}>LogOut</button>}

     
    </nav>
    
  );
};

export default Navbar;
