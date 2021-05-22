const express= require('express');
const router= express.Router();
const bcrypt = require('bcrypt');

const {User}= require('../models/user');
const {Cart}= require('../models/cart');

router.get('/', async function(req,res){
    const users= await User.find();
    res.send(users);
});

router.get('/show', async function(req,res){
    const users = await User.find();

    res.render("user.ejs", { 
        array: users,
        type:'user',
        // text: 'Add Sub Cate',
        // link:'subCateg',
        title: 'Users'
    });
});

router.post('/signUp',async (req,res)=>{

    const uniqueUser = await User.findOne({email:req.body.email})

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

    res.end();
});

router.patch('/profile/:id',async(req,res)=>{
    console.log(req.body);
    let user = await User.findByIdAndUpdate(req.params.id, req.body,{new:true});
    console.log(user);
    await user.save();
    res.send(req.body);
});

router.post('/login',async(req,res)=>{
    const user = await User.findOne({email:req.body.email}).populate(
        {
            path: "orders",
            populate:{
                path:"products.product"
            },
            options: { 
                sort: { 
                    'dateOfPurchase': -1 
                } 
            }
        }
    );
    console.log(user);
    if(!user)
        return res.status(404).send("Email or Password doesn't match");
    
    const checkPassword= bcrypt.compareSync(req.body.password, user.password);
    
    if(!checkPassword)
        return res.status(404).send("Email or Password doesn't match");

    res.send({_id:user._id,name: user.name,email: user.email,cart:user.cart,orders:user.orders,contact:user.contact,address:user.address});
});

router.put('/editPass',async(req,res)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user)
        return res.status(404).send("Email or Password doesn't match");
    
    const checkPassword = bcrypt.compareSync(req.body.password, user.password);
    
    if(!checkPassword)
        return res.status(404).send("Incorrect Password");

    user.password = bcrypt.hashSync(req.body.newPassword, 10); 
    await user.save();
    res.send(true);
});

router.patch('/edit/:id',async (req,res)=>{

    let user = await User.findByIdAndUpdate(req.params.id, req.body,{ new: true });
    await user.save();
    res.end();
});

router.post('/delete/:id', async (req,res)=>{
    
    const remove= await User.deleteOne({_id:req.params.id});
    if(!remove)
        return res.status(404).send("Given ID was not found");//404 is error not found
    
    res.redirect('/user/show');
}); 

module.exports= router;