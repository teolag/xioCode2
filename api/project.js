const router = require('express').Router();
const handler = require('../handler/project-handler');
		
router.get('/:projectId', function(req, res) {
	const project = handler.get(req.params.projectId);
	if(project) {
		res.json({status: "Project loaded", project});
	} else {
		res.status(404);
		res.json({status: "Project not found", projectId: req.params.projectId});
	}
});

router.get('/:projectId/files', function(req, res) {
	const files = handler.getProjectFiles(req.params.projectId);
	res.json({status: "Project file tree", files});
});

module.exports = router;