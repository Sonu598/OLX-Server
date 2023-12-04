const express=require('express')
const { UserModel } = require('../models/user.model')
const { BlackModel } = require('../models/blacklist.model')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')

const userRoute=express.Router()


userRoute.post('/signup',(req,res)=>{
    const {email,password}=req.body;
    try {
        bcrypt.hash(password,5,async function(err,hash) {
            if (err) {
                res.send(err.message)
            } else {
                const user= new UserModel({email,password:hash})
                await user.save()
                res.send('New user has been registerd')
            }
        })
    } catch (err) {
        res.send(err.message)
    }
})


userRoute.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await UserModel.find({email})
        if (user) {
            bcrypt.compare(password,user[0].password,function(err,result){
                if (result) {
                    var token=jwt.sign({userID:user[0]._id},'secrete',{expiresIn:60})
                    var refreshToken=jwt.sign({userID:user[0]._id},'secrete',{expiresIn:300})
                    res.cookie('token',token)
                    res.cookie('refreshToken',refreshToken)
                    res.send('Login Successfull')
                    res.send({'token':token,'refreshToken':refreshToken})
                } else {
                    res.send('Wrong Credentials')
                }
            })
        }
    } catch (err) {
        res.send(err.message)
    }
})

userRoute.post('/logout',async(req,res)=>{
    try {
        const token=req.cookies.token
        const blacktoken=new BlackModel({token})
        await blacktoken.save()
        res,status(200).send('Successfully Logged Out')
    } catch (err) {
        res.send(err.message)
    }
})

module.exports={
    userRoute
}