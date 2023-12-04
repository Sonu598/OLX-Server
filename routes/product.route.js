const express=require('express')
const { productModel } = require('../models/product.model')

const productRoute=express.Router()


productRoute.post('/create',async (req,res)=>{
    const {name, description, category, image, location, price}=req.body;
    try {
        const product=new productModel({name, description, category, image, location, price})
        await product.save()
        res.send('New product has been Added')
    } catch (err) {
        res.send(err.message)
    }
})

productRoute.get('/all',async(req,res)=>{
    const product=await productModel.find()
    res.send(product)
})

productRoute.get('/filter',async(req,res)=>{
    try {
        let query = {};
        const { category, sortBy, search, page } = req.query;
        if (category) {
            query.category = category;
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
    
        const pageSize = 4;
        const currentPage = page || 1;
        const skip = (currentPage - 1) * pageSize;
    
        let sortOptions = { postedAt: -1 };
        if (sortBy === 'oldest') {
            sortOptions = { postedAt: 1 };
        }
    
        const totalproduct = await productModel.countDocuments(query);
        const totalPages = Math.ceil(totalproduct / pageSize);
    
        const product = await productModel.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);
        res.status(200).json({ product, totalPages });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

productRoute.put('/edit/:id',async(req,res)=>{
    const { id } = req.params;
    const { name, description, category, image, location, price } = req.body;
    try {
        const updatedproduct = await productModel.findByIdAndUpdate(id, {
            name,
            description,
            category,
            image,
            location,
            price,
        });
        res.status(200).json({ message: 'Product updated successfully', updatedproduct });
    } catch (err) {
        res.send(err.message);
    }
})

productRoute.put('/delete/:id',async(req,res)=>{
    const { id } = req.params;
    try {
        await productModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.send(err.message);
    }
})

module.exports={
    productRoute
}