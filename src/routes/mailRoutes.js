const express= require('express');
const router= express.Router();
const {sendEmail} = require('../mail');

router.post("/verify", (req, res) => {
    const rand = Math.floor((Math.random() * 100) + 54);
    const host = req.get('host') ;
    sendEmail(req.body.email, "verify" , rand ,host);
    console.log('Hi');
});

router.post('/success',function(req,res){
    const host = req.get('host') ;

    if((`${req.protocol}://${host}` == `http://${host}`))
    {
        console.log("Domain is matched. Information is from Authentic email");
        if(req.body.rand)
        {
            sendEmail(req.body.email,"success",0,null);
            res.redirect(`${req.protocol}://localhost:3000`);
        }
        else
        {
            console.log("email is not verified");
        }
    }
    else
    {
        res.end("<h1>Request is from unknown source");
    }
});

module.exports = router ;