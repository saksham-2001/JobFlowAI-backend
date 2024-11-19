const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {  // no need to declare Id field MONGODB gives it by default
        // username: {
        //     type: String,
        //     required: true,
        //     unique: true,
        //     lowercase: true,
        //     trim: true,
        //     index: true  // This field is used for fast retrieval of user records.
        // },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },


       

        password: {
            type: String,
            reuired: [true, 'Password is required']  //custom message to display

        },

        refreshToken: {
            type: String 

        }


    },
    {

        timestamps: true        // for createdAt and updatedAt fields
    }
);


const User = mongoose.model("User", userSchema);
module.exports = User  
/* Standard practice to create a model "User" with a capital first letter and singular, 
 This model would be saved as "users" in MONGODB */