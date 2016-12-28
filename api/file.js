const router = require('express').Router({mergeParams: true});
const handler = require('../handler/file-handler');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const config = require('../config');
const path = require('path');

		
router.post('/', jsonParser, function(req, res) {
	const uri = req.body.uri;
	const content = req.body.content;
	const projectId = req.params.projectId;
	const overwrite = req.body.overwrite;

	const fullURI = path.join(config.projectsFolder, projectId, uri);

	const exists = handler.fileExists(fullURI);


	if(!exists || overwrite) {
		handler.save(fullURI, content).then(data => {
			res.status = 201;
			res.json({status: "File created", uri});
		});
	} else {
		res.json({status: "File exists"});
	}
});

router.put('/:uri', jsonParser, function(req, res) {
	const projectId = req.params.projectId;
	const uri = req.params.uri;
	const content = req.body.content;
	const fullURI = path.join(config.projectsFolder, projectId, uri);
	const exists = handler.fileExists(fullURI);

	if(exists) {
		handler.save(fullURI, content).then(data => {
			res.status = 200;
			res.json({status: "File updated", uri});
		});
	} else {
		res.status(404);
		res.json({status: "File does not exist", uri});
	}
});

router.get('/:uri', function(req, res) {
	const projectId = req.params.projectId;
	const uri = req.params.uri;
	const fullURI = path.join(config.projectsFolder, projectId, uri);

	const exists = handler.fileExists(fullURI);

	if(exists) {
		handler.open(fullURI).then(content => {
			const file = {uri: uri, content};
			res.status(200);
			res.json({status: "File loaded", file});
		});
	} else {
		res.status(404);
		res.json({status: "File does not exist", uri});
	}
});


module.exports = router;