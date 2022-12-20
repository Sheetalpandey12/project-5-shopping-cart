const userModel = require("../models/userModel")
const {uploadFile} = require("../aws/aws")
const {isValidstring,isValidemail,isValidphone, isValidfile,isValidpassword,isEmpty,isValidStreet,isValidpin} = require("../util/validator")
const jwt = require("jsonwebtoken")


// <==========================================> CREATE USER <==========================================>//


const createUser = async (req,res) => {
    try{
        let data = req.body
        let files = req.files

        // ==> Validations 
          if(Object.keys(data).length == 0) return res.status(400).send({status: false, message: "All fields are manndatory"})
        let { fname, lname, email, phone, password, address , profileImage } = data 
      //if (Object.keys(data) == 0 && (!files || files.length == 0)) return res.status(400).send({ status: false, message: "Body is Empty" })
        
        if(!fname) return res.status(400).send({status: false, message: "fname is mandatory"})
        if(!isValidstring(fname)) return res.status(400).send({status: false, message:  "Enter Valid fname"})

        if(!lname) return res.status(400).send({status: false, message: "lname is mandatory"})
        if(!isValidstring(lname)) return res.status(400).send({status: false, message:  "Enter Valid lname"})

        if(!email) return res.status(400).send({status: false, message: "email is mandatory"})
        if(!isValidemail(email)) return res.status(400).send({status: false, message:  "Enter Valid email"})

        if(!phone) return res.status(400).send({status: false, message: "phone is mandatory"})
        if(!isValidphone(phone)) return res.status(400).send({status: false, message:  "Enter Valid phone"})

        let alreadyExits = await userModel.findOne({$or : [{ email: email, isDeleted: false },{ phone: phone, isDeleted: false }]})
        if (alreadyExits) {
            if(alreadyExits.email == email) return res.status(409).send({ status: false, message: `This ${email} already registered` })
            else if(alreadyExits.phone == phone) return res.status(409).send({status : false , message : `This ${phone} already registered`})
        }
        
        if (files.length === 0) return res.status(400).send({status: false, message: "profileImage is mandatory"})
        if (!isValidfile(files[0].originalname)) return res.status(400).send({ status: false, message: "ProfileImage is Invalid." })

        if(!password) return res.status(400).send({status: false, message: "password is mandatory"})
        if(!isValidpassword(password)) return res.status(400).send({status: false, message:  "Enter Valid password"})

        if(!address) return res.status(400).send({status: false, message: "Please enter address for shipping and billing purpose"})
        
        let {shipping, billing} = address

        if(!shipping) return res.status(400).send({status: false, message: "shipping is mandatory"})

        if(!isEmpty(shipping.street))  return res.status(400).send({ status: false, message: "Shipping street is required" })
        if(!isValidStreet(shipping.street)) return res.status(400).send({status: false, message:  "Enter Valid shipping street"})

        if(!isEmpty(shipping.city))  return res.status(400).send({ status: false, message: "Shipping city is required" })
        if(!isValidstring(shipping.city)) return res.status(400).send({status: false, message:  "Enter Valid shipping city"})

        if(!isEmpty(shipping.pincode))  return res.status(400).send({ status: false, message: "Shipping pincode is required" })
        if(!isValidpin(shipping.pincode)) return res.status(400).send({status: false, message:  "Enter Valid shipping pincode"})

        if(!billing) return res.status(400).send({status: false, message: "billing is mandatory"})

        if(!isEmpty(billing.street))  return res.status(400).send({ status: false, message: "Shipping street is required" })
        if(!isValidStreet(billing.street)) return res.status(400).send({status: false, message:  "Enter Valid shipping street"})

        if(!isEmpty(billing.city))  return res.status(400).send({ status: false, message: "Shipping city is required" })
        if(!isValidstring(billing.city)) return res.status(400).send({status: false, message:  "Enter Valid shipping city"})

        if(!isEmpty(billing.pincode))  return res.status(400).send({ status: false, message: "Shipping pincode is required" })
        if(!isValidpin(billing.pincode)) return res.status(400).send({status: false, message:  "Enter Valid shipping pincode"})

        let profilePic = await uploadFile(files[0])
        data.profileImage = profilePic

        let hash = bcrypt.hashSync(password, 10)  
        data.password = hash

        let saveUser = await userModel.create(data)
        return res.status(201).send({ status: true, message: "User Register Successfully", data: saveUser })
    }
    catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = {createUser}