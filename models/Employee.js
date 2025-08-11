const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: String,
  location: String,
  salary: Number
});

module.exports = mongoose.model('employees', employeeSchema);
