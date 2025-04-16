
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;
const connectDB = async () => {
    try {
        const connect = await mongoose.connect(uri);

        if (connect) {
            console.log(`Database Connected`);
        } else {
            console.log(`Not Connected`);
        }

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;