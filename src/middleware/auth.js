const jwt = require("jsonwebtoken")



const authentication = async (req, res, next) => {
    try {
        const token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: false, message: "Token must be present" })

        jwt.verify(token, "Project5-Group12", (err, resolve) => {
            if (err) return res.status(401).send({ status: false, message: err.message })

            req['user'] = resolve.user
            next()
        })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { authentication }

