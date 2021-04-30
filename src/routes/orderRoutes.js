const express= require('express');
const router= express.Router();
const {Order}= require('../models/order');
const {Product } = require('../models/product');
const { User } = require('../models/user');
const { Cart } = require('../models/cart');

router.get('/', async function(req,res){
    const orders = await Order.find().populate(['products.product']);
    res.send(orders);
});

router.post('/:userId', async function(req,res){

    const order = new Order(req.body);   
    await order.save();

    const user= await User.findByIdAndUpdate(req.params.userId, {
        $push:{
            orders: order._id
        }
    }  ,{new:true});

    const cart= await Cart.findByIdAndUpdate(user.cart, {
        product: []
    }  ,{new:true});

    await user.save();

    await cart.save();

    const orderInfo= await Order.findById(order._id).populate(['products.product'])

    console.log(orderInfo);

    res.send(orderInfo);
});

module.exports= router;