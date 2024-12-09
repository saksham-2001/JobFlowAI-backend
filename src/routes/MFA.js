const express = require("express");
const otplib = require("otplib");
const qrcode = require("qrcode");
const User = require("../models/user.model");
const Router = express.Router();

Router.get('/mfasetup', async (req, res, next) => {

   
    try {

        const sessiontoken = req.cookies['session'];

        const decoded = jwt.verify(sessiontoken, SECRET_KEY); // Decode the token
        const email = decoded.email; // Extract email from payload
        
         


        const secret = otplib.authenticator.generateSecret();
        await User.updateOne(
            { _id: email },
            { $set: { MFAsecret: secret, MFAregistered: true, } },
        );

        qrcode.toDataURL(
            otplib.authenticator.keyuri(username, "JobFlowApp", secret),
            (err, imageUrl) => {
                if (err) {
                    return res.status(500).send("Error generating QR code");
                }
                return res.send({ success: true, secret, imageUrl });
            },
        );


    }
    catch (err) {
        return res.status(404).json(err);
    }


});

Router.get('/mfaverify', async (req, res, next) => {

    const { email, otp } = req.body;
    const user = await User.find({ email });
    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
    }
    else {
        const isValid = otplib.authenticator.check(otp, user.MFAsecret);
        if (isValid) {
            return res.status(200).json({ success: true, message: "User verified" });
        }
        else {
            return res.status(404).json({ success: false, message: "Invaild OTP" });
        }


    }
});

module.exports = Router;