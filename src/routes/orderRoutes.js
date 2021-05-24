const express= require('express');
const router= express.Router();
const {Order}= require('../models/order');
const {Product } = require('../models/product');
const { User } = require('../models/user');
const { Cart } = require('../models/cart');

router.get('/', async function(req,res){
    const orders = await Order.find().sort({dateOfPurchase:-1}).populate(['products.product']);
    res.send(orders);
});

router.get('/:email', async function(req,res){

    if(req.params.id=="null")
        return res.send(null);

    const orders = await Order.find({emailOfUser: req.params.email}).sort({dateOfPurchase:-1}).populate(['products.product']);
    res.send(orders);
});

router.get('/show',  async (req, res) => {
    const orders = await Order.find().sort({'dateOfPurchase':-1});
    res.render("orders", { orders: orders });
});

router.get('/products/:id',  async (req, res) => {
    const order = await Order.findById(req.params.id).populate('products.product');
    const products= order.products;
    const enumValues= Order.schema.path('products.status').enumValues;
    console.log(enumValues);
    res.render("orderDetails", { orderId: order._id, products: products,enumValues: enumValues});
});

router.post('/searchByEmail',  async (req, res) => {
    const order = await Order.find({ emailOfUser: req.body.email });
    res.render("orders", { orders: order });
});


router.post('/cart/:userId', async function(req,res){

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

router.post('/buyNow/:userId', async function(req,res){

    console.log(req.body);
    const order = new Order(req.body);   
    await order.save();

    const user= await User.findByIdAndUpdate(req.params.userId, {
        $push:{
            orders: order._id
        }
    }  ,{new:true});

    await user.save();

    const orderInfo= await Order.findById(order._id).populate(['products.product'])

    console.log(orderInfo);

    res.send(orderInfo);
});

router.post('/:productId/:id',  async (req, res) => {

    let order = await Order.findByIdAndUpdate(req.params.id, {
        $set: {
            "products.$[filter].status": req.body.status 
        } 
    },{ 
        arrayFilters: [{ "filter.product": req.params.productId }],
        new: true
    });
    
    console.log(order);

    res.redirect(`/order/products/${req.params.id}`);
});

module.exports= router;