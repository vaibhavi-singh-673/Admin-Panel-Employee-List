// server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', (err) => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

// Employee schema
const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  designation: String,
  gender: String,
  course: {
    type: [String],
    default: []
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  image: String
});

const Employee = mongoose.model('Employee', employeeSchema);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Routes
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    // Check credentials (You need to implement your own logic here)
    if (username === 'admin' && password === '123') {
      // Generate token (You can use JWT here)
      const token = jwt.sign({ username }, 'secretkey');
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
});

app.post('/api/employees', upload.single('image'), async (req, res) => {
  // Create a new employee
  try {
    const { name, email, mobile, designation, gender, course, image } = req.body;
    // const image = req.file.filename;
    const newEmployee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      course,
      image
    });
    await newEmployee.save();
    return res.status(201).json({ message: 'Employee created successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Modify backend route to handle search functionality
app.get('/api/employees', async (req, res) => {
  try {
    const { searchQuery } = req.query;
    let employees;
    if (searchQuery) {
      // Implement search logic based on searchQuery
      employees = await Employee.find({ $or: [{ name: { $regex: searchQuery, $options: 'i' } }, { email: { $regex: searchQuery, $options: 'i' } }, { gender: { $regex: searchQuery, $options: 'i' } }, { designation: { $regex: searchQuery, $options: 'i' } }, { course: { $regex: searchQuery, $options: 'i' } }] });
    } else {
      employees = await Employee.find();
    }
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Fetch an employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.status(200).json(employee);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


app.put('/api/employees/:id', upload.single('image'), async (req, res) => {
  // Update an existing employee by ID
  try {
    const { name, email, mobile, designation, gender, course } = req.body;
    const image = req.file ? req.file.filename : undefined;
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, {
      name,
      email,
      mobile,
      designation,
      gender,
      course,
      image
    }, { new: true });
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.status(200).json({ message: 'Employee updated successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  // Delete an employee by ID
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
