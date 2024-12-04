require('dotenv').config();
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const cookieSession = require('cookie-session');
const User = require("../models/user.model");
const axios = require('axios');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const SECRET_KEY = process.env.SECRET_KEY;
const OAuthRouter = express.Router();
const jwt = require('jsonwebtoken');
const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

OAuthRouter.get('/Callback', async (req, res) => {
  const { code } = req.query;  // auth code sent by google OAuth Consent Page

  if (!code) {
    return res.status(400).send('No Authorization Code found');

  }

  try {
      
    // post reuest to google API to get tokens in exchange for the authorization code
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URL,
      grant_type: 'authorization_code',
    });

    const { access_token, id_token, refresh_token, expires_in } = response.data;

    if (!access_token || !id_token) {
      return res.status(400).send('Failed to retrieve tokens');
    }
    console.log('Access Token:', access_token);
    console.log('ID Token:', id_token);
    console.log('Refresh Token:', refresh_token);
    console.log('Expires In:', expires_in);

    //get request to Google API to get User Profile with the tokens obtained
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const Googleuser = userInfoResponse.data;
    const email = Googleuser.email;
    const name = Googleuser.name;
    const user = await User.findOne({ email });
    if (!user) {
      const user = await User.create({ name, email });

    }
    const sessiontoken = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

    // res.cookie('session', sessiontoken, {

    //   httpOnly: true,
    //   secure: false,
    //   samesite: 'none',

    // }).send({ success: true, message: "Cookie is set" });
    res.cookie('session', sessiontoken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    }).send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="0;url=http://localhost:3000">
        </head>
        <body>
          Redirecting...
        </body>
      </html>
    `);
    //res.json({ success: true, message: "Signed up successfully. Please login." });


  }
  catch (error) {
    console.error('OAuth Callback Error:', error.response?.data || error.message);
  return res.status(500).json({ 
    success: false, 
    message: 'Authentication failed',
    error: error.response?.data || error.message 
  });
  }

})

module.exports = OAuthRouter;