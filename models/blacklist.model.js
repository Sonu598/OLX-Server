const mongoose = require("mongoose")

const blackSchema=mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    }
})

const BlackModel=mongoose.model('blacklist',blackSchema)

module.exports={
    BlackModel
}