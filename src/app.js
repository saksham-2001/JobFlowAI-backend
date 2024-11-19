
const express = require('express');
const User = require("./models/user.model");
const cors = require("cors")
const app = express();

app.use(express.json());
app.use(cors())
app.post('/signup', (req, res) => {

    User.create(req.body)
        .then(Users => res.join(Users))
        .catch(err => res.json(err))

});

app.post('/login', (req,res)=>{
  const{email, password} =req.body;
  User.findOne({email : email})
  .then(user =>{
   if(user){
    if(user.password == password){
        res.json("Success")
    }else{
        res.json("Incorrect password")
   }
}
else{
    res.json("No response existed");
}

  })

})

module.exports = app;