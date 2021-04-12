const express= require('express');
const router= express.Router();
const {Subcategory , validate} = require('../models/subcategory');
const { Category } = require('../models/category');

router.get('/', async function(req,res){
    const subcategory= await Subcategory.find();
    res.send(subcategory);
});

router.get('/form' ,async(req , res)=>{
    const category = await Category.find();
    res.render('createcat.ejs', {
      link: "/subcategory/creating",
      formname: 'Create Subcategory',
      id: null,
      label: 'Enter subcategory name',
      name: "",
      category,
      prevcat: ""
    });
});
  
router.get('/edit/:id' ,async(req , res)=>{
    const category = await Category.find();
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) return res.status(404).send("Given ID was not found");
    var name = subcategory.name;
    var prevcat = subcategory.category;
    res.render('createcat.ejs', {
        link: `/subcategory/editing/${req.params.id}`,
        label: 'Enter new subcategory name',
        formname: 'Edit Subcategory',
        id: subcategory._id,
        name,
        category,
        prevcat
    });
});
  
router.post('/creating',async (req,res)=>{
    console.log('Here is error');
    console.log(req.body);
    const { error } = validate(req.body) ;
    if(error) return res.status(400).send(error.details[0].message) ;
    
    const subcategory = new Subcategory({
        name: req.body.name,
        category: req.body.category
    });
    await subcategory.save();
    res.redirect('/subcategory/form');
});

router.post('/editing/:id',async (req,res)=>{
    const { error } = validate(req.body) ;
    if(error) return res.status(400).send(error.details[0].message) ;

    let subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body,{new:true});
    await subcategory.save();
    res.redirect('/subcategory/form');
});

router.delete('/:id', async (req,res)=>{
    
    const remove = await Subcategory.deleteOne({_id:req.params.id});
    if(!remove)
        return res.status(404).send("Given ID was not found");//404 is error not found
    res.end();
});

module.exports= router;