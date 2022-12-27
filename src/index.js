const express = require('express')
const mongoose = require('mongoose')
const route = require('./routes/route')
const multer = require('multer')
require('dotenv').config()
const app = express()

app.use(express.json());
app.use(multer().any())

app.use((err, req, res, next) => {
    if (err.message === "Unexpected end of JSON input" || "Unexpected string in JSON at position" ) {
        return res.status(400).send({ status: false, message: "ERROR Parsing Data, Please Provide a Valid JSON" })
    } else { next() }
});

mongoose.set('strictQuery', true);
mongoose.connect(process.env.db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB is connected"))
    .catch(err => console.log(err))

app.use("/", route);

app.listen(process.env.port, () => console.log(`Express app is running on port ${process.env.port}`)); 