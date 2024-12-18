
const express = require('express');
const cors = require("cors")
const authRoutes = require("./routes/auth.js");
const profileRoutes = require("./routes/profile.js");
const app = express();

const cookieParser = require('cookie-parser');
const { LOCAL_CLIENT_ORIGIN, PROD_CLIENT_ORIGIN } = require("./constants.js");


app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: LOCAL_CLIENT_ORIGIN, // Client's URL
  //origin: PROD_CLIENT_ORIGIN,

  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
  console.log(PROD_CLIENT_ORIGIN);
  res.send('<h1>JobOverFlowAI</h1>');
});
module.exports = app;