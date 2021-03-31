const express= require('express');
const router= express.Router();
const {User}= require('../models/user');

router.get('/', async function(req,res){

    const users= await User.find();
    res.send(users);
});

router.post('/',async (req,res)=>{

    const user = new User(req.body);
     
    await user.save();

    res.end();
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