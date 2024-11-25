
const express = require('express');
const cors = require("cors")
const authRoutes =require("./routes/auth.js");
const app = express();
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Client's URL
    credentials: true,               // Allow cookies to be sent with requests
}));
app.use('/auth', authRoutes);
app.get('/', (req, res)=>{
res.send('<h1>JobOverFlowAI</h1>');
});
module.exports = app;