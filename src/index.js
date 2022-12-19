const express = require('express')
const mongoose = require('mongoose')
const route = require('./routes/route')
const app = express()

app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://yashrajsinh09:yashraj2727@assignment.lhpfmud.mongodb.net/group12Database",{useNewUrlParser: true})
.then(() => console.log("MongoDB is connected"))
.catch(err => console.log(err))

app.use("/",route);

app.use((req,res) => {
    return res.status(400).status({status: false, message: "Invalid URL"})
});

app.listen(3000, () => console.log("Express app is running on port 3000"));