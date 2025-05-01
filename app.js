const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/campusCycle', { useNewUrlParser: true, useUnifiedTopology: true });

// Define schema and model for cycles
const cycleSchema = new mongoose.Schema({
  name: String,
  description: String,
  condition: String,
  rentalPrice: Number,
  imageUrl: String
});

const Cycle = mongoose.model('Cycle', cycleSchema);

// Setup file storage for images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Route to list a cycle
app.post('listcycle', upload.single('imageUrl'), async (req, res) => {
  const { name, description, condition, rentalPrice } = req.body;
  const imageUrl = '/uploads/' + req.file.filename;

  const newCycle = new Cycle({
    name,
    description,
    condition,
    rentalPrice,
    imageUrl
  });

  try {
    await newCycle.save();
    res.status(200).json({ message: 'Cycle listed successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to list cycle.' });
  }
});

// Route to get all listed cycles for "Find a Cycle" page
app.get('findcycle', async (req, res) => {
  try {
    const cycles = await Cycle.find();
    res.status(200).json(cycles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve cycles.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
