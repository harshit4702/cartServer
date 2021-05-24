const express= require('express');
const router= express.Router();
const {Offer} = require('../models/offer');
const {SubCategory} = require('../models/subCategory');
const formidable = require("formidable");
const fs = require("fs");
const authAdmin = require('../middleware/authAdmin');

router.get('/',async (req, res) => {
  const offers = await Offer.find().populate('photo.subCategory');
  res.send(offers);
});

router.get('/show',authAdmin,async (req, res) => {
    const offers = await Offer.find().populate('photo.subCategory');
    res.render('showOffer.ejs', {
      type: "offer",
      title: "Offer Images",
      link: "",
      photo: "",
      label: "Subcategory : ",
      array: offers,
    });
});

router.get('/createForm' , authAdmin,async(req,res)=>{
    let subCategories = await SubCategory.find();
    res.render('offerForm.ejs', {
        link: '/offer/newImg',
        photo: "",
        // label: "Choose Subcategory",
        title: "Add Offer Image",
        array: subCategories,
        inbody: ""
    });
});

router.post('/newImg',authAdmin,async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, async (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image",
        });
      }
      // console.log(fields , file);

      //destructure the fields
      const { subCategory1 ,subCategory2,subCategory3  } = fields;
      if (!subCategory1 || !subCategory2 || !subCategory3) {
        return res.status(400).json({
          error: "Please include all fields",
        });
      }
      var subCategories = [subCategory1 , subCategory2 , subCategory3];
      let offer = new Offer({});
      
      var files = Object.values(file);
      //handle file here
      for(j = 0; j< 3; j++){
        if (files[j]) {
            if (files[j].size > 500000) {
              return res.status(400).json({
                error: "File size too big!",
              });
            }
            offer.photo.push({
              src:{
                data: fs.readFileSync(files[j].path),
                contentType: files[j].type
              },
              subCategory: subCategories[j]
            });
          }
      }
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

router.post('/delete/:id', authAdmin,async (req,res)=>{
    
    const remove= await Offer.deleteOne({_id:req.params.id});
    if(!remove)
        return res.status(404).send("Given ID was not found");//404 is error not found
    
    res.redirect('/offer/show');
});

router.get('/photos/:id/:index' ,async (req, res) => {
  const offer = await Offer.findById( req.params.id );
  if (offer.photo[req.params.index].src.data) {
    res.set("Content-Type", offer.photo[req.params.index].src.contentType);
    return res.send( offer.photo[req.params.index].src.data);
  }
  res.send("not found");
});

module.exports= router;