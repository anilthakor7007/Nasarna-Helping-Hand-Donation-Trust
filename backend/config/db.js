//connectiong to MongoDB
const mongoose = require('mongoose');

const connectDB = async ()=> {
    try{
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to mongoDB");
    }catch(err){
        console.error('Error Connectin to MongoDB: ', err.message);
        process.exit(1);//exit the process with faliure
    }
};

module.exports = connectDB;