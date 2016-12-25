const router = require('express').Router();
const handler = require('../handler/file-handler');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const config = require('../config');
const path = require('path');

		
router.post('/', jsonParser, function(req, res) {
	const filename = req.body.filename;
	const content = req.body.content;
	const projectId = req.body.projectId;
	const overwrite = req.body.overwrite;

	console.log("join", config.projectsFolder, projectId, filename);
	const filePath = path.join(config.projectsFolder, projectId, filename);
	console.log("FilePath:", filePath);

	const exists = handler.fileExists(filePath);


	if(!exists || overwrite) {
		handler.save(filePath, content).then(data => {
			res.json({status: "File saved"});
		});
	} else {
		res.json({status: "File exists"});
	}
});


module.exports = router;