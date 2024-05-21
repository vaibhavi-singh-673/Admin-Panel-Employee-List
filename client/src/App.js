// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import {Toaster} from 'sonner';
import Navbar from './components/Navbar';
import EmployeeListPage from './components/EmployeeListPage'; // Import your employee list page component
import LoginPage from './components/LoginPage';
import CreateEmployeePage from './components/CreateEmployeePage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <Router>
      <div>
        <Toaster richColors/>
        <Navbar />
        <Routes>
          <Route path="/"
            element ={<EmployeeListPage token={token} />}  
          />
          <Route path ="/login"
          element = {<LoginPage setToken={setToken}/>}
          />
          <Route path="/create-employee"
            element={<CreateEmployeePage />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
