const express= require('express');
const router = express.Router();
const {Category , validate} = require('../models/category');

router.get('/', async function(req,res){
    const categories = await Category.find();
    res.send(categories);
});

router.get('/form' ,(req , res)=>{
    res.render('createcat.ejs', {
      link: "/category/creating",
      formname: 'Create Category',
      id: null,
      label: 'Enter category name',
      name: "",
      category: "",
      prevcat: ""
    });
});

router.get('/edit/:id' ,async(req , res)=>{
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).send("Given ID was not found");

  const { name } = category;

  res.render('createcat.ejs', {
    link: `/category/editing/${req.params.id}`,
    formname: 'Create Category',
    label: 'Enter new category name',
    id: product._id,
    name,
    prevcat: "",
    category: ""
  });
});

router.post('/creating',async (req,res)=>{
    const { error } = validate(req.body) ;
    if(error) return res.status(400).send(error.details[0].message) ;

    const category = new Category({
        name: req.body.name,
     });
    await category.save();
    res.redirect('/category/form');
    
});

router.post('/editing/:id',async (req,res)=>{
    const { error } = validate(req.body) ;
    if(error) return res.status(400).send(error.details[0].message) ;
    
    let category = await Category.findByIdAndUpdate(req.params.id, req.body,{new:true});
    await category.save();
    res.redirect('/category/form');
});

router.delete('/delete/:id', async (req,res)=>{
    const remove = await Category.deleteOne({_id:req.params.id});
    if(!remove)
        return res.status(404).send("Given ID was not found");//404 is error not found
    res.end();
});

module.exports= router;