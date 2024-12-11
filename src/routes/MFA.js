require('dotenv').config();
const express = require("express");
const jwt = require('jsonwebtoken');
const otplib = require("otplib");
const qrcode = require("qrcode");
const User = require("../models/user.model");
const Router = express.Router();

Router.get('/mfasetup', async (req, res, next) => {


    try {

        const sessiontoken = req.cookies['session'];
        if (!sessiontoken) {
            return res.status(401).json({ success: false, message: "Session token missing" });
        }

        const decoded = jwt.verify(sessiontoken, process.env.SECRET_KEY);
        const email = decoded.email;

        otplib.authenticator.options = {
            window: 1, // Allow slight time drift
            step: 30   // Standard 30-second time step
        };

        const secret = otplib.authenticator.generateSecret();
        const otpauth = await otplib.authenticator.keyuri(email, "JobFlowApp", secret);
        console.log(otpauth);
        return res.json({ success: true, imageUrl: otpauth, key: secret });





        // await User.updateOne(
        //     { _id: email },
        //     { $set: { MFAsecret: secret, MFAregistered: true, } },
        // );

    }
    catch (err) {
        return res.status(404).json(err);
    }


});

Router.post('/mfaregister', async (req, res) => {
    const { secret } = req.body;
    try {
        const sessiontoken = req.cookies['session'];
        if (!sessiontoken) {
            return res.status(401).json({ success: false, message: "Session token missing" });
        }

        const decoded = jwt.verify(sessiontoken, process.env.SECRET_KEY);
        const email = decoded.email;
        console.log("ALL G");
        await User.updateOne(
            { email: email },
            { $set: { MFAsecret: secret, MFAregistered: true, } },
        );
        console.log("All set")
        res.json({ success: true, message: "MFA registered for user" });
    }
    catch (err) {
        res.status(404).json({ success: false, err });
    }

});

Router.post('/mfaverify', async (req, res, next) => {

    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
        }
        else {
           
            const isValid = await otplib.authenticator.check(otp, user.MFAsecret);
          
            if (isValid) {
                console.log("corrrect otp");
               
                // return res.status(200).json({ success: true, message: "User verified" });
                const sessiontoken = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });
                
                res.cookie('session', sessiontoken, {

                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 3600000 //1hr in ms

                }).send({ success: true, message: "user verified and Cookie is set" });


            }
            else {
                console.log("wrongotp");
                return res.status(401).json({ success: false, message: "Invaild OTP" });
            }
        }
    }
    catch (err) {
        return res.status(500).json(err);
    }


});

module.exports = Router;