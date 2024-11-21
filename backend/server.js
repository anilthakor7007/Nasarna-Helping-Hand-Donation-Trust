const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5006; 

// CORS configuration
app.use(cors({
    origin: "*",
    methods: 'GET,POST,PUT,DELETE',   
    allowedHeaders: ['Content-Type', 'Authorization', 'Range'], 
    exposedHeaders: ['Content-Range', 'Range'],  
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(morgan("dev")); // Logging middleware

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

//route imports
const  userRoutes = require('./routes/userRoutes');
const donorRoutes = require('./routes/donorRoutes');
const donationRoutes = require('./routes/donationRoutes');
const trusteeRoutes = require('./routes/trusteeRoutes');
const causeRoutes = require('./routes/causeRoutes'); 


// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/trustees', trusteeRoutes);
app.use('/api/causes', causeRoutes);




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
