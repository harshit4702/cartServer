const express= require('express');
const router= express.Router();
const bcrypt = require('bcrypt');

const {User}= require('../models/user');
const {Cart}= require('../models/cart');

router.get('/', async function(req,res){

    const users= await User.find();
    res.send(users);
});

router.post('/signUp',async (req,res)=>{

    const uniqueUser= await User.findOne({email:req.body.email})

    console.log(uniqueUser);

    if(uniqueUser)
        return res.status(404).send('User already Registered');

    const cart = new Cart({});

    await cart.save();

    console.log(cart._id);

    const hash = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        email: req.body.email,
        password: hash,
        cart: cart._id
    });
     
    await user.save();

    console.log(user);

    res.end();
});

router.post('/login',async (req,res)=>{

    const user= await User.findOne({email:req.body.email});

    console.log(user)

    if(!user)
        return res.status(404).send("Email or Password doesn't match");
    
    const checkPassword= bcrypt.compareSync(req.body.password, user.password);
    
    if(!checkPassword)
        return res.status(404).send("Email or Password doesn't match");

    console.log(user);

    res.send({_id:user._id,name: user.name,email: user.email,cart:user.cart,address:user.address});
});

router.patch('/:id',async (req,res)=>{

    let user = await User.findByIdAndUpdate(req.params.id, req.body,{new:true});
    
    await user.save();

    res.end();
});

router.delete('/:id', async (req,res)=>{
    
    const remove= await User.deleteOne({_id:req.params.id});
    if(!remove)
        return res.status(404).send("Given ID was not found");//404 is error not found
    
    res.end();
});

module.exports= router;