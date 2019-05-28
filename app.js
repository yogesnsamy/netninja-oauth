const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
//to encrypt cookie
const cookieSession = require('cookie-session');
const passport = require('passport');

const app = express();

//setup view engine - can be ejs/handlebar
app.set('view engine', 'ejs');

//cookie lasts for one day - set its value in ms
//key is used for key encryption before storing as cookie on browser
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
  })
);

//we want passport to initialize first then use cookies
app.use(passport.initialize());
//use passport session to control logging in
app.use(passport.session());

//connect to mongodb/cloudant
mongoose.connect(keys.mongodb.dbURI, () => {
  console.log('connected to mongodb');
});

//setup routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

//create home route
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

//listen on port 3000
app.listen(3000, () => {
  console.log('listening at http://localhost:3000');
});
