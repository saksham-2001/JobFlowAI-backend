require('dotenv').config();
const express = require("express");
const jwt = require('jsonwebtoken');
const User = require("../models/user.model");
const UserProfile = require("../models/userprofile.model")
const Router = express.Router();

Router.post("/create", async (req, res, next) => {
    try {
        const { formData, email } = req.body;
        console.log(email);
        console.log(formData);
        const user = await User.findOne({ email });
        if (!user) {
            console.log(email);
            console.log("User not found");
            return res.status(404).json({ success: false, message: "User not found" })
          

        }
        console.log("user found");




        console.log("profile does not exist");
        console.log(user._id);
        //Code does not execute from here and throws error
        profile = await UserProfile.findOneAndUpdate({
            user: user._id
        }, // Use the  User ObjectId here, created automaticallyby MONGODB
            {
                professionalSummary: formData.professionalSummary || "",
                education: formData.education || [],
                experience: formData.experience || [],
                projects: formData.projects || [],
                skills: formData.skills || [],
                certifications: formData.certifications || [],
                references: formData.references || [],
                languages: formData.languages || [],
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );


        // This method does not work and data validation error is being thrown.
        // profile = await UserProfile.create({
        //     user: user._id,
        //     professionalSummary: formData.professionalSummary || "",
        //     education: formData.education && formData.education.length > 0 ? formData.education : [],
        //     experience: formData.experience && formData.experience.length > 0 ? formData.experience : [],
        //     projects: formData.projects && formData.projects.length > 0 ? formData.projects : [],
        //     skills: formData.skills && formData.skills.length > 0 ? formData.skills : [],
        //     certifications: formData.certifications && formData.certifications.length > 0 ? formData.certifications : [],
        //     references: formData.references && formData.references.length > 0 ? formData.references : [],
        //     languages: formData.languages && formData.languages.length > 0 ? formData.languages : [],
        // });


        res.status(200).json({ success: true, message: "Profile Updated successfully", profile });
        console.log("Profile Updated Successfully");
    }



    catch (err) {
        res.status(500).json({ success: false, message: "An error occured", err })



    }

})

Router.post("/fetch", async (req, res) => {
    try {
        const { email } = req.body;

        console.log(email);
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
        }
        const profiledata = await UserProfile.findOne({ user: user._id });
        if (!profiledata) {
            res.json({ success: false, message: "The user does not have a profile" })
        }
        res.status(200).json({ success: true, message: "Profile data fetched", profiledata });
    }
    catch (err) {
        res.status(404).json({ success: false, err })
    }
})

module.exports = Router;