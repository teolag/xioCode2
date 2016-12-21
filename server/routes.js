const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');



router.get('/login/google', passport.authenticate('google', {scope: ['profile','email']}), function(req, res){});


router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(passport.initialize());
router.use(passport.session());


router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});



router.get('/login/google/callback', passport.authenticate('google', {
	successRedirect: '/',
	failureRedirect: '/',
	failureFlash: true 
}));

router.get("/auth", (req, res) => {
	const out = {};
	if(req.isAuthenticated()) {
		out.status = 'authorized';
		out.user = req.user;
	} else {
		out.status = 'unauthorized';
	}
	out.error = req.flash('error');
	res.json(out);
});

router.use('/api', require('./api'));


module.exports = router