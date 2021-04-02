const express= require('express');
const router= express.Router();
const {Cart}= require('../models/cart');
const { Product } = require('../models/product');
const { User } = require('../models/user');

router.get('/', async function(req,res){

    const carts= await Cart.find();
    res.send(carts);
});

router.post('/',async (req,res)=>{

    const product = Product.findById(req.body.product).populate('product');
    const user = User.findById(req.body.user).populate('user');
    const cart = new Cart(req.body);
    
    await cart.save();

    res.end();
});

router.patch('/:id',async (req,res)=>{

    console.log('hello');

    let cart = await Cart.findByIdAndUpdate(req.params.id, req.body,{new:true});
    
    await cart.save();

    res.end();
});

router.delete('/:id', async (req,res)=>{
    
    const remove= await Cart.deleteOne({_id:req.params.id});
    if(!remove)
        return res.status(404).send("Given ID was not found");//404 is error not found
    
    res.end();
});

module.exports= router;