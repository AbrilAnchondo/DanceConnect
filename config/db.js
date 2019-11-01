
//this file contains the mongoDB connection, using mongoose to connect
const mongoose = require('mongoose');

//bring config to use mongoURI
const config = require('config');

//to get any value in that json file
const db = config.get('mongoURI');

//connecting mongoDB, we need to call within server.js
//wrap it in try - catch block  to catch any error
const connectDB = async () => {
    try {
        await  mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('MongoDB Connected...');
    } catch(err) {
       console.log(err.message);
       //Exit process with failure
       process.exit(1);
    }
}

module.exports = connectDB;