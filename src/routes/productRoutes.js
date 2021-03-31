const express= require('express');
const router= express.Router();
const {Product}= require('../models/product');

router.get('/',async function(req,res){

    const products= await Product.find();
    res.send(products);
});

router.post('/',async (req,res)=>{

    const product = new Product(req.body);
    
    await product.save();

    res.end();
});

router.put('/:id',async (req,res)=>{

    let product = await Product.findByIdAndUpdate(req.params.id, req.body,{new:true});
    
    await product.save();

    res.end();
});

router.delete('/:id', async (req,res)=>{
    
    const remove= await Product.deleteOne({_id:req.params.id});
    if(!remove)
        return res.status(404).send("Given ID was not found");//404 is error not found
    
    res.end();
});

module.exports= router;