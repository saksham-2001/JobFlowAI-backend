const express = require('express');
// const passport = require('passport');
// const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require("../models/user.model");

let sessionID=[];

const router = express.Router();


const login = async function (req,res,next) {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        else{
        
            next();
            //return res.json( 'Success' );
         
        }

        

    
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
    
}

const createSession= function(req,res){
    const{email, password}= req.body;
    let sessionkey=crypto.randomBytes(16).toString('hex');
    let newsessionID = {
        key: sessionkey,
        value: email
    };
    sessionID.push(newsessionID);
    res.json({success: true, newsessionID, message:'Success'});
    
    }


router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {


        const user = await User.findOne({ email });
        if(user){
            res.json({success:false, message: "User already exists. please login"});
        }
        else{
        const hashedpassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password:hashedpassword });
        res.json({success:true,  message:"Signed up successfully. Please login."});
        }

    } catch (err) {
        res.json(err);
    }
});


router.post('/login', [login,createSession]
);




module.exports = router;