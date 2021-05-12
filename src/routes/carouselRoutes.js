const express= require('express');
const router= express.Router();
const {Carousel} = require('../models/carousel');
const { Category } = require('../models/category');
const formidable = require("formidable");
const fs = require("fs");

router.get('/show',async (req, res) => {
  console.log('HI');
    const carousel = await Carousel.find();
    res.render('showCarousel.ejs', {
        type: "carousel",
        title: "Carousel Images",
        photo: "",
        label: "Category : ",
        array: carousel,
    });
});

router.get('/photos/:id/' , async (req, res, next) => {
  const carousel = await Carousel.findById( req.params.id );
  if (carousel.photo.data) {
    res.set("Content-Type", carousel.photo.contentType);
    return res.send( carousel.photo.data);
  }
  res.send("not found");
});

router.get('/addImg' , async(req,res)=>{
    let categories = await Category.find().select('-_id , name');
    res.render('carousel.ejs', {
        link: '/carousel/newImg',
        photo: "",
        label: "Choose Category",
        title: "Add Carousel Image",
        array: categories,
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
      console.log('Fields');
      console.log(fields);

      //destructure the fields
      const { inbody } = fields;

      if (!inbody) {
        return res.status(400).json({
          error: "Please include all fields",
        });
      }
      let carousel = new Carousel(fields);
      //handle file here
      if (file.photo) {
        if (file.photo.size > 100000) {
          return res.status(400).json({
            error: "File size too big!",
          });
        }
        carousel.photo.data = fs.readFileSync(file.photo.path);
        carousel.photo.contentType = file.photo.type;
      }
      carousel.category = inbody ;
      //save to the DB
      carousel.save((err, carousel) => {
        if (err) {
          res.status(400).json({
            error: "Saving product in DB failed",
          });
        }
        res.redirect("/carousel/show");
      });
    });
});

router.post('/delete/:id', async (req,res)=>{
    
    const remove= await Carousel.deleteOne({_id:req.params.id});
    if(!remove)
        return res.status(404).send("Given ID was not found");//404 is error not found
    
    res.redirect('/carousel/show');
});

module.exports= router;
