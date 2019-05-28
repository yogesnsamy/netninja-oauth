const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;
const CALLBACK_URL = '/ibm/cloud/appid/callback';

passport.serializeUser((user, done) => {
  //called when user is authenticated from the callback func
  //it will call another func and stuff the user.id into a cookie after encryption
  //call next stage
  done(null, user.id);
});

//id is what's stored in a cookie, so when deserialize we knows who's logged in now and we serve their info accordingly
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    //call next stage, will attach it to the request handler
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    //credentials for the google strategy
    {
      callbackURL: '/auth/google/redirect',
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    //callback function, trigerred after second call to passport.authenticate (when CODE is received from the first call to passport.authenticate)
    // async (accessToken, refreshToken, params, profile, cb) => {
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      //once CODE is exchanged with profile info from google, check if it exists on our db, if yes dont add to db as duplicate entry
      User.findOne({ googleId: profile.id }).then(profileFound => {
        //profile found
        if (profileFound) {
          // console.log(`profile exists: ${profileFound}`);
          //user exists, go on to the next phase, null for the error - means no error
          done(null, profileFound);
        } else {
          //profile doesnt exist in our db, so create new then display success msg
          new User({
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile._json.picture
          })
            .save()
            .then(newUser => {
              // console.log(`new user created: ${newUser}`);
              //user created, go on to the next phase, null for the error - means no error
              done(null, newUser);
            });
        }
      });
    }
  )
);

// passport.use(
//   new WebAppStrategy({
//     tenantId: 'a0018f1e-7392-4afc-96f9-8997e3b7b9c9',
//     clientId: 'ddb596e4-8ef1-4532-b959-031f2ea544ea',
//     secret: 'MGYwNzhlNWMtODc1NS00MDQyLTg3NzYtMjE1MTg4ZGEwNWMw',
//     oauthServerUrl:
//       'https://us-south.appid.cloud.ibm.com/oauth/v4/a0018f1e-7392-4afc-96f9-8997e3b7b9c9',
//     redirectUri: CALLBACK_URL
//   })
// );

// passport.use(
//   new GoogleStrategy(
//     {
//       callbackURL: '/auth/google/redirect',
//       clientID:
//         '1060856770145-p0vsrvtnaq6sgvclm5qoff4sc36rbhdu.apps.googleusercontent.com',
//       clientSecret: 'upl3aqLtE6uDRScahH5vZWKI'
//     },
//     async (accessToken, refreshTokem, params, profile, done) => {
//       console.log('in passport setup');
//     }
//   )
// );
