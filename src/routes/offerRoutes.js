const express= require('express');
const router= express.Router();
const {Offer} = require('../models/offers');
const {SubCategory} = require('../models/subCategory');
const formidable = require("formidable");
const fs = require("fs");

router.get('/show',async (req, res) => {
    const offer = await Offer.find();
    res.render('showCarousel.ejs', {
      type: "offer",
      title: "Offer Images",
      link: "",
      photo: "",
      label: "Subcategory : ",
      array: offer,
    });
});

router.get('/photos/:id/' , async (req, res, next) => {
  const offer = await Offer.findById( req.params.id );
  if (offer.photo.data) {
    res.set("Content-Type", offer.photo.contentType);
    return res.send( offer.photo.data);
  }
  res.send("not found");
});

router.get('/addImg' , async(req,res)=>{
    let subcategories = await SubCategory.find().select('-_id , name');
    res.render('carousel.ejs', {
        link: '/offer/newImg',
        photo: "",
        label: "Choose Subcategory",
        title: "Add Offer Image",
        array: subcategories,
        inbody: ""
    });
});

router.post('/newImg',async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, async (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image",
        });
      }
      //destructure the fields
      const { inbody } = fields;
      console.log(`In body ${inbody} `);
      if (!inbody) {
        return res.status(400).json({
          error: "Please include all fields",
        });
      }
      let offer = new Offer(fields);
      //handle file here
      if (file.photo) {
        if (file.photo.size > 100000) {
          return res.status(400).json({
            error: "File size too big!",
          });
        }
        offer.photo.data = fs.readFileSync(file.photo.path);
        offer.photo.contentType = file.photo.type;
      }
      offer.subcategory = inbody ;
      
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

router.post('/delete/:id', async (req,res)=>{
    
    const remove= await Offer.deleteOne({_id:req.params.id});
    if(!remove)
        return res.status(404).send("Given ID was not found");//404 is error not found
    
    res.redirect('/offer/show');
});

module.exports= router;
