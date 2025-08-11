const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./connection');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const port = process.env.PORT || 5700;

// Connect to MongoDB
connectDB();

// Middlewares
app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('dev'));

// API routes for employees (JSON APIs)
app.use('/api/employees', employeeRoutes);

// Web routes for rendering views
const Employee = require('./models/Employee');

app.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render('index', { employees, msg: req.query.msg });
  } catch (err) {
    res.status(500).send('Error fetching employees');
  }
});

app.get('/add', (req, res) => res.render('add'));

app.post('/add', async (req, res) => {
  const { name, designation, location, salary } = req.body;
  try {
    const newEmployee = new Employee({ name, designation, location, salary: parseFloat(salary) });
    await newEmployee.save();
    res.redirect('/?msg=added');
  } catch (err) {
    res.status(500).send('Error adding employee');
  }
});

app.get('/edit/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).send('Employee not found');
    res.render('edit', { employee });
  } catch (err) {
    res.status(500).send('Error fetching employee');
  }
});

app.post('/update/:id', async (req, res) => {
  const { name, designation, location, salary } = req.body;
  try {
    await Employee.findByIdAndUpdate(req.params.id, {
      name,
      designation,
      location,
      salary: parseFloat(salary)
    });
    res.redirect('/?msg=updated');
  } catch (err) {
    res.status(500).send('Error updating employee');
  }
});

app.get('/delete/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect('/?msg=deleted');
  } catch (err) {
    res.status(500).send('Error deleting employee');
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
