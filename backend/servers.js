const express = require('express');
const path = require('path');  // Add this line
require('dotenv').config();
const connectDB = require('./config/db');
const authRoute = require('./routes/auth');  
const signUpRoute = require('./routes/signUp');
const profileRoute = require('./routes/getProfile');
const seanceRouter = require('./routes/seance');
const getSeanceRouter = require('./routes/getSeance');
const ajouterExerciceRouter = require('./routes/ajouterExercieRouter');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use('/images', express.static(path.join(__dirname, 'images')));


// Connexion à MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes de test
app.post('/karim', (req, res) => {
  res.json({ message: 'Hello bro, how are you karm?' });
});
app.get('/person', (req, res) => {
  res.json({ message: 'Hello bro, how are you?' });
});

app.use('/api', authRoute);
app.use('/api', signUpRoute);
app.use('/api', profileRoute); 
app.use('/api', seanceRouter);
app.use('/api', getSeanceRouter);
app.use('/api', ajouterExerciceRouter);
app.use('/api', require('./routes/exercises'));  // Your exercise route here

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
