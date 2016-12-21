const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/login/google', (req, res, next) => {
	console.log("innan login", req.headers.referer);
	req.session.beforeLogin = req.headers.referer;
	next();
}, passport.authenticate('google', {scope: ['profile','email']}), function(req, res){});


router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/login/google/callback', passport.authenticate('google'), (req, res, next) => {
	console.log("Auth successful", req.user);
	res.redirect(req.session.beforeLogin);
});

router.get("/auth", passport.session(), (req, res) => {
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

router.use('/api', passport.session(), require('./api'));


router.use(express.static('public'));

router.get('*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});



module.exports = router