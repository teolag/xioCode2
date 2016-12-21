const router = require('express').Router();
const handler = require('../handler/project-handler');
//const bodyParser = require('body-parser');
//const jsonParser = bodyParser.json();
		
router.get('/:projectId', function(req, res) {
	const project = handler.get(req.params.projectId);
	res.json({status: "Project loaded", project});
});


module.exports = router;