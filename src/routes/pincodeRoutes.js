const express= require('express');
const router= express.Router();
const {Pincode}= require('../models/pincode');
const authAdmin = require('../middleware/authAdmin');

router.get('/', async function(req,res){
    const pincodes= await Pincode.find();
    res.send(pincodes);
});

router.get('/show',authAdmin ,async (req, res) => {
    const pincodes = await Pincode.find();
    res.render('showPincode.ejs', {
        type: "pincode",
        title: "Pincodes",
        array: pincodes,
    });
  });

router.get('/createForm' ,authAdmin,async(req , res)=>{
    console.log('ad djdn sd');
    res.render('pincodeForm.ejs', {
        link: `/pincode`,
        pin:''
    });
});

router.get('/:id', async function(req,res){
    const pincode= await Pincode.findById(req.params.id);
    res.send(pincode);
});

router.get('/editForm/:id' ,authAdmin,async(req , res)=>{
    const pincode = await Pincode.findById(req.params.id);
    res.render('pincodeForm.ejs', {
        link: `/pincode/edit/${pincode._id}`,
        pin: pincode.pin
    });
});

router.post('/',async (req,res)=>{

    if(req.body.pin.length!=6)
        return res.status(404).send('Pincode is not of valid length');

    const pincode = new Pincode(req.body);

    await pincode.save();

    res.redirect('/pincode/createForm');
});

router.post('/edit/:id', authAdmin,async (req,res)=>{
    let pincode = await Pincode.findByIdAndUpdate(req.params.id, req.body,{new:true});

    console.log(pincode);

    res.redirect('/pincode/show');
});

router.post('/delete/:id', authAdmin ,async (req,res)=>{

    const pincode = await Pincode.findByIdAndDelete(req.params.id);

    if(!pincode)
        return res.status(404).send("Given ID was not found");//404 is error not found
  
    res.redirect('/pincode/show');
});

module.exports= router;