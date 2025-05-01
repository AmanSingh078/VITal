const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/student_community', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Student Schema
const Student = mongoose.model('Student', new mongoose.Schema({
  name: String,
  branch: String,
  batch: String,
  bio: String,
  connections: [String] // IDs of connected students
}));

// Register a student
app.post('/api/students', async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.send(student);
});

// Get all or filtered students
app.get('/api/students', async (req, res) => {
  const { branch, batch } = req.query;
  const filter = {};
  if (branch) filter.branch = branch;
  if (batch) filter.batch = batch;
  const students = await Student.find(filter);
  res.send(students);
});

// Connect students
app.post('/api/connect', async (req, res) => {
  const { fromId, toId } = req.body;
  const student = await Student.findById(fromId);
  if (!student.connections.includes(toId)) {
    student.connections.push(toId);
    await student.save();
  }
  res.send(student);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
