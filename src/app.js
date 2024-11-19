
const express = require('express');
const cors = require("cors")
const authRoutes =require("./routes/auth.js");
const app = express();

app.use(express.json());
app.use(cors())
app.use('/auth', authRoutes);
app.get('/', (req, res)=>{
res.send('<h1>JobOverFlowAI</h1>');
});
module.exports = app;