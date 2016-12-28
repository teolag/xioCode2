const Api = require("./api");

const ProjectHandler = (function() {
	

	function getAll() {
		Api.get("projects").then(data => {
			XI.fire("projectsLoaded", data.projects);
		});
	}

	function createNew(name) {
		const data = {name};
		return Api.post("projects", data).then(data => data.project);
	}

	function load(projectId) {
		return Api.get(`project/${projectId}`).then(data => data.project);
	}

	function getProjectFiles(projectId) {
		return Api.get(`project/${projectId}/files`).then(data => data.files);
	}


	return {
		getAll: getAll,
		getProjectFiles: getProjectFiles,
		createNew: createNew,
		load: load
	};
}());

module.exports = ProjectHandler;