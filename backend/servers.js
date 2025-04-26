const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const cors = require('cors');

const app = express();
const PORT = 5000;
connectDB();
app.use(cors());
app.use(express.json());
app.get('/hello',(req,res)=>{
 res.json({messag:'hello bro how are u'})
//res.json({ message: 'Hello depuis Express 👋' });
})
app.use('/api', authRoutes);
// Lancement du serveur
app.listen(PORT, () => {
 console.log(`Serveur ensur http://localhost:${PORT}`);
});
