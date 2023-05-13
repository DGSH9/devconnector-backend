const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true });
        console.log("connected mongoDB");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;