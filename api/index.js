var router = require('express').Router();


router.use('*', (req, res , next) => {
	if (req.isAuthenticated()) return next();
    else res.sendStatus(401);
});


router.use('/project', require('./project'));
router.use('/projects', require('./projects'));
//router.use('/files', require('./files'));

module.exports = router;