const express= require('express');
const router= express.Router();
const {Offer} = require('../models/offer');
const {SubCategory} = require('../models/subCategory');
const formidable = require("formidable");
const fs = require("fs");
const auth = require('../middleware/auth');


router.get('/show',async (req, res) => {
    const offer = await Offer.find().populate('subCategory');
    res.render('showCarousel.ejs', {
      type: "offer",
      title: "Offer Images",
      link: "",
      photo: "",
      label: "Subcategory : ",
      array: offer,
    });
});

router.get('/photos/:id/' , auth ,async (req, res, next) => {
  const offer = await Offer.findById( req.params.id );
  if (offer.photo.data) {
    res.set("Content-Type", offer.photo.contentType);
    return res.send( offer.photo.data);
  }
  res.send("not found");
});


router.get('/addImg' , async(req,res)=>{
    let subCategories = await SubCategory.find();
    res.render('offerForm.ejs', {
        link: '/offer/newImg',
        photo: "",
        label: "Choose Subcategory",
        title: "Add Offer Image",
        array: subCategories,
        inbody: ""
    });
});

router.post('/newImg',auth,async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, async (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image",
        });
      }
      //destructure the fields
      const { subCategory } = fields;
      console.log(`In body ${subCategory} `);
      if (!subCategory) {
        return res.status(400).json({
          error: "Please include all fields",
        });
      }
      let offer = new Offer(fields);
      //handle file here
      if (file.photo) {
        if (file.photo.size > 500000) {
          return res.status(400).json({
            error: "File size too big!",
          });
        }
        offer.photo.data = fs.readFileSync(file.photo.path);
        offer.photo.contentType = file.photo.type;
      }
      offer.subCategory = subCategory ;
      
      //save to the DB
      offer.save((err, offer) => {
        if (err) {
          res.status(400).json({
            error: "Saving product in DB failed",
          });
        }
        res.redirect("/offer/show");
      });
    });
});

router.post('/delete/:id', auth,async (req,res)=>{
    
    const remove= await Offer.deleteOne({_id:req.params.id});
    if(!remove)
        return res.status(404).send("Given ID was not found");//404 is error not found
    
    res.redirect('/offer/show');
});

module.exports= router;
