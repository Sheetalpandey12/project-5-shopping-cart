const express = require('express')
const router = express.Router()
const {createUser,loginUser,getUser} = require("../controller/userController")
const {authentication} = require("../middleware/auth")


router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authentication,getUser)


router.all('/*', function(req,res){
    res.status(400).send({status: false, message: "Invalid request"});
  })


module.exports = router;  