const express= require('express');
const router= express.Router();
const {Product}= require('../models/product');
const formidable = require("formidable");
const fs = require("fs");

router.get('/',async function(req,res){
    const products= await Product.find();
    res.send(products);
});

router.get('/form' ,(req , res)=>{
    console.log('Hi');
    res.render('product.ejs', {
      link: "/product/creating",
      id: null,
      name: "",
      price: "",
      description: "",
      src: [],
      discount: "",
    });
});

router.get('/edit/:id' ,async(req , res)=>{
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Given ID was not found");

    const { name, description, price, src, discount } = product;
    res.render("product", {
    link: `/product/editing/${req.params.id}`,
    id: product._id,
    name,
    description,
    price,
    src,
    discount
    });
});

router.post('/creating',async (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req, (err, fields, file) => {

      file = Object.values(file);

      if (err) {
        console.log('Error is there');
        return res.status(400).json({
          error: "problem with image",
        });
      }
      
      //destructure the fields
      const { name, price, discount , description} = fields;
  
      if (!name || !discount || !price || !description ) {
        return res.status(400).json({
          error: "Please include all fields",
        });
      }

      let product = new Product(fields);
      //handle file here

      for(j = 0; j< 4; j++){
        console.log(file[j]);
        if (file[j]) {
            if (file[j].size > 3000000) {
              return res.status(400).json({
                error: "File size too big!",
              });
            }
            product.src.push({
              data: fs.readFileSync(file[j].path),
              contentType: file[j].type
            });
          }
      }
      //save to the DB

      product.save((err, product) => {

        if (err) {
          res.status(400).json({
            error: "Saving product in DB failed",
          });
        }
        console.log('Successs');
        res.redirect('/product/form');
      });
    });
});

router.post('/editing/:id',async (req,res)=>{

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, file) => {
    file = Object.values(file);
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //destructure the fields
    const { name, description, discount, price } = fields;

    if (!name || !description || !price || !discount) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let product = await Product.findByIdAndUpdate(req.params.id, {name, description, price, discount}, {
      new: true,
    });
    if (!product) return res.status(404).send("Given ID was not found"); //404 is error not found
    
    //Clearing previous Images

    //handle file here
    for(j = 0; j< 4; j++){
      if (file[j].size !=0) {
        console.log('pres');
        if (file[j].size > 3000000) {
          return res.status(400).json({
            error: "File size too big!",
          });
        }
        product.src.splice( j , 1 , {
          data: fs.readFileSync(file[j].path),
          contentType: file[j].type
        });
        console.log(product.src[j]);
    }
  }
    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving product in DB failed",
        });
      }
      res.redirect('/product/form');
    });
  });
});

router.post('/delete/:id', async (req,res)=>{
    
    const remove= await Product.deleteOne({_id:req.params.id});
    if(!remove)
        return res.status(404).send("Given ID was not found");//404 is error not found
    
    res.redirect('/');
});

router.get('/photos/:id/:index' , async (req, res, next) => {
  const product = await Product.findById( req.params.id );

  if (product.src[req.params.index].data) {
    res.set("Content-Type", product.src[req.params.index].contentType);
    return res.send( product.src[req.params.index].data);
  }
  res.send("not found");
  
});

module.exports= router;