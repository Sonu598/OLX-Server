const jwt=require('jsonwebtoken')
const { UserModel } = require('../models/user.model')
const { BlackModel } = require('../models/blacklist.model')

const auth= async(req,res,next)=>{
    try {
        const token=req.cookies.token
        const isBlaklisted= await BlackModel.findOne({token})
        if (isBlaklisted) {
            return res.status(401).send('Token is Blacklisted')
        } else {
            const decode=jwt.verify(token,'secrete');
            const {userID}=decode
            const user=await UserModel.findById(userID)
            if (!user) {
                return res.status(401).send('Please login to continue')
            }
            req.user=user
            next()
        }
        
    } catch (err) {
        return res.status(401).send(err.message)
    }
}

module.exports={
    auth
}