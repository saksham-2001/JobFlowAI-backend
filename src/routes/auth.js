const express = require('express');
require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require("../models/user.model");
const jwt = require('jsonwebtoken');
const OAuthRouter =require("./OAuth.js")
const MfaRouter = require("./MFA.js");

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;


router.use('/google', OAuthRouter);
router.use('/mfa',  MfaRouter);


/* '/login' route Logic*/



// Step1: middleware to validate credentials
const login = async function (req, res, next) {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(404).json({ message: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        else {

            next();


        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }

}

//Step2: Middleware to check if user is MFA registered, If yes then return, else next()

const checkMFAregsitered= async function (req, res, next){
const {email} = req.body;

try {
    // Query the user by email
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.json({ success: false, message: 'User not found' });
    }

    // Check the MFAverified field
    if (user.MFAregistered) {
       return res.json({  isMFARegistered: true, message: 'User is registered for MFA' });
       console.log("all g");
    } else {
        //return { success: true, isMFARegistered: false, message: 'User is not registered for MFA' };
        next();    
    }
} catch (error) {
    console.error('Error checking MFA status:', error);
    return res.json({ success: false, message: 'An error occurred while checking MFA status' });
}
}


// Step3: Validation complete. Middleware to create session
const createSession = function (req, res) {
    const { email, password } = req.body;

    const sessiontoken = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

    res.cookie('session', sessiontoken, {

        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3600000 //1hr in ms

    }).send({ success: true, message: "Cookie is set" });
}

router.post('/login', [login, checkMFAregsitered, createSession]
);




/*'/logout' request handle */

router.get('/logout', async (req, res) => {
    //const sessioncookie = req.cookies['session'];
    res.clearCookie('session', { 
        httpOnly: true,
        secure: true,
        sameSite: 'none', 
        path: '/' });
        res.send({ success: true, message: "Cookie Cleared" })
})







/* '/signup' request handle*/


router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {


        const user = await User.findOne({ email });
        if (user) {
            res.json({ success: false,  message: "User already exists. please login" });
        }
        else {
            const hashedpassword = await bcrypt.hash(password, 10);

            const user = await User.create({ name, email, password: hashedpassword });
            res.json({ success: true, message: "Signed up successfully. Please login." });
        }

    } catch (err) {
        res.json(err);
    }
});






/* '/isauth' request handle */
router.get('/isauth', async (req, res) => {

    const sessiontoken = req.cookies['session'];

    if (sessiontoken) {

        try {
            const decoded = jwt.verify(sessiontoken, SECRET_KEY); // Decode the token
            const email = decoded.email; // Extract email from payload
        
            const user = await User.findOne({ email: email }); // Query the database
            if (!user) {
                return res.status(404).send({ success: false, message: "User not found" });
            }
        
            return res.status(200).send({
                name: user.name,
                isregistered: user.MFAregistered,
                success: true,
                message: "The user is in session"
            });
        } catch (error) {
            return res.status(401).send({ success: false, message: "Invalid session token", error: error.message });
        }
        
       
    }
    else {
        return res.send({ success: false, message: "The user is out of session" });
    }

});





module.exports = router;