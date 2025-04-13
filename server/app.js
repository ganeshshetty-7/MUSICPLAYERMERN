const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const musicRouter = require('./router/router')

const PORT = process.env.PORT || 8080;


app.use('/', musicRouter);

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.DEV_MODE} mode on PORT NO: ${PORT}`);
})