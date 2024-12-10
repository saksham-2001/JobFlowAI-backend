
const express = require('express');
const cors = require("cors")
const authRoutes =require("./routes/auth.js");
const app = express();
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Client's URL
    
    //origin: "https://16f0-49-178-113-21.ngrok-free.app",
   // origin: 'https://saksham-2001.github.io',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));
app.use('/auth', authRoutes);
app.get('/', (req, res)=>{
res.send('<h1>JobOverFlowAI</h1>');
});
module.exports = app;