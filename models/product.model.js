const mongoose=require('mongoose')

const productSchema=mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true },
    postedAt: { type: Date, default: Date.now },
    price: { type: Number, required: true },
})

const productModel=mongoose.model('employee',productSchema)

module.exports={
    productModel
}