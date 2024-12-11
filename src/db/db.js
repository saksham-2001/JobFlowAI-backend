require('dotenv').config();
const mongoose = require('mongoose');
const {DB_NAME}  = require('../constants');


const dbConnect= async()=>{
    try{
        // console.log("aa    " + `${process.env.MONGODB_URI}/${DB_NAME}`);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Db connected!! ${connectionInstance.connection.host} `);
        }
        catch (error){
            console.log("MONGODB Connection Error", error);
            throw error;
            process.exit(1); //node method
        
        }

}
 
module.exports = dbConnect;