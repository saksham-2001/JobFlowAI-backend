require('dotenv').config();
const app  = require("./app")
const  dbConnect  = require("./db/db")
const PORT =process.env.PORT || 3001;
async function runServer(){
try{
await dbConnect();
app.listen(PORT,()=>{
console.log(`Server is running at Port ${PORT}`)})
}
catch(err){
    console.log(err,"DB Connection failed");
}
}
runServer();