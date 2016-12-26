const router = require('express').Router({mergeParams: true});
const handler = require('../handler/file-handler');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const config = require('../config');
const path = require('path');

		
router.post('/', jsonParser, function(req, res) {
	const filename = req.body.filename;
	const content = req.body.content;
	const projectId = req.params.projectId;
	const overwrite = req.body.overwrite;

	const uri = path.join(config.projectsFolder, projectId, filename);

	const exists = handler.fileExists(uri);


	if(!exists || overwrite) {
		handler.save(uri, content).then(data => {
			res.status = 201;
			res.json({status: "File created"});
		});
	} else {
		res.json({status: "File exists"});
	}
});

router.put('/:filename', jsonParser, function(req, res) {
	const projectId = req.params.projectId;
	const filename = req.params.filename;
	const content = req.body.content;
	const uri = path.join(config.projectsFolder, projectId, filename);
	const exists = handler.fileExists(uri);

	if(exists) {
		handler.save(uri, content).then(data => {
			res.status = 201;
			res.json({status: "File updated"});
		});
	} else {
		res.status(404);
		res.json({status: "File does not exist", uri});
	}
});

router.get('/:filename', function(req, res) {
	const projectId = req.params.projectId;
	const filename = req.params.filename;
	const uri = path.join(config.projectsFolder, projectId, filename);

	const exists = handler.fileExists(uri);

	if(exists) {
		handler.open(uri).then(content => {
			const file = {uri: filename, content};
			res.status(200);
			res.json({status: "File loaded", file});
		});
	} else {
		res.status(404);
		res.json({status: "File does not exist", uri});
	}
});


module.exports = router;