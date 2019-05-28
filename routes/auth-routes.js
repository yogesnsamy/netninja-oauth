const router = require('express').Router();
const passport = require('passport');
// const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;

router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

router.get('/logout', (req, res) => {
  //handled by passport
  req.logout();
  res.redirect('/');
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile']
  })
);

// router.get(
//   '/ibm',
//   passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
//     scope: ['profile']
//   })
// );

//add middleware, it's calling passport.authenticate again, but this time it's calling it with a CODE, so it knows it's alredi authenticated so can read the profile details
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/profile');
});

// router.get('/google/redirect', (req, res) => {
//   res.send('redirect');
// });
module.exports = router;
