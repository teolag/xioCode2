const router = require('express').Router();
const handler = require('../model/project-handler');
		
router.get('/', function(req, res) {
	let projects = handler.getAll();

	res.json({status: "All projects", projects});
});

router.post('/', function(req, res) {
	let name = req.body.name;

	handler.create(name, req.user).then(project => {
		res.json({status: "new project created", project});
	});
});


router.get('/:id', function(req, res) {
	res.json({ id: req.params.id, name: "Mitt trevlige project" });
});

module.exports = router;