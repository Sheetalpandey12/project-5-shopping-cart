const express = require('express')
const router = express.Router()
const { createUser, loginUser, getUser, updateUser } = require("../controller/userController")
const { createProduct, getProductsByQuery, getProductsById, delProductById } = require("../controller/productController")
const { authentication } = require("../middleware/auth")

// User API's
router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/user/:userId/profile", authentication, getUser)
router.put("/user/:userId/profile", authentication, updateUser)

// Product API's
router.post("/products",createProduct)
router.get("/products",getProductsByQuery)
router.get("/products/:productId",getProductsById)

router.delete("/products/:productId",delProductById)



router.all('/*', function (req, res) {
  res.status(400).send({ status: false, message: "Invalid request" });
})


module.exports = router;  