const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const dbConnectionString = process.env.DB_CONNECTION_STRING;

app.use(express.json());

// mongoose.connect(dbConnectionString, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
  
// });
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});