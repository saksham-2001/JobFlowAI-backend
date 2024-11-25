const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require("../models/user.model");

let sessionID = [];

const router = express.Router();






//middleware to handle login
const login = async function (req, res, next) {
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
        else {

            next();


        }




    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }

}


//middleware to create session
const createSession = function (req, res) {
    const { email, password } = req.body;
    let sessionkey = crypto.randomBytes(16).toString('hex');
    let newsessionID = {
        key: sessionkey,
        value: email
    };
    sessionID.push(newsessionID);


    res.cookie('session', sessionkey, {

        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 3600000 // Cookie expiration in milliseconds (1 hour)


    }).send({ success: true, message: "Cookie is set" });
}

// '/signup' request handle
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {


        const user = await User.findOne({ email });
        if (user) {
            res.json({ success: false, message: "User already exists. please login" });
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

// '/login request handle'
router.post('/login', [login, createSession]
);

//'/isauth' request handle
router.get('/isauth', async (req, res) => {

    const sessioncookie = req.cookies['session'];
    const sessionObj=sessionID.find(item => item.key === sessioncookie)
    if (sessionObj) {
          
      
        try{
         const user=await User.findOne({email: sessionObj.value});
        
         return res.status(200).send({ name:user.name, success: true, message: "userexists" });
        }
        catch(error){
          throw error;
        }
    }
    else{
        return res.send({success:false, message:"The user does not exist"});
    }

});

// '/logout' request handle

router.get('/logout', async(req, res)=>{
    const sessioncookie = req.cookies['session'];
    res.clearCookie('session', {path: '/'});
  sessionID =sessionID.filter(item=> item.key !==sessioncookie );
   

    res.send({success:true, message:"Cookie Cleared"})
})



module.exports = router;