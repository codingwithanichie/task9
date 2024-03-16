const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const dbConnectionString = process.env.DB_CONNECTION_STRING;

const RoomType = require('./models/roomType.js');
const Room = require('./models/room.js');

app.use(express.json());

mongoose.connect(dbConnectionString).then(() => {
  console.log('Connected to MongoDB!');
}).catch((err) => {
  console.log(err);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.post('/api/v1/room-types', async (req, res) => {
  try {
    const { name } = req.body;
    const roomType = new RoomType({ name });
    await roomType.save();
    res.json(roomType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/v1/room-types', async (req, res) => {
  try {
    const roomTypes = await RoomType.find();
    res.json(roomTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/v1/rooms', async (req, res) => {
  try {
    const { name, roomType, price } = req.body;
    const room = new Room({ name, roomType, price });
    await room.save();
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/v1/rooms', async (req, res) => {
  try {
    let query = {};
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.roomType) {
      query.roomType = req.query.roomType;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseInt(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseInt(req.query.maxPrice);
      } else {
        query.price.$gte = 0;
      }
    }
    const rooms = await Room.find(query);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/v1/rooms/:roomId', async (req, res) => {
  try {
    const { name, roomType, price } = req.body;
    await Room.findByIdAndUpdate(req.params.roomId, { name, roomType, price });
    res.json({ message: 'Room updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/v1/rooms/:roomId', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.roomId);
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/v1/rooms/:roomId', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});