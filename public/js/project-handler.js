let ProjectHandler = (function() {
	

	function getAll() {
		Api.get("projects").then(data => {
			XI.fire("projectsLoaded", data.projects);
		});
	}

	function createNew(name) {
		const data = {name};
		return Api.post("projects", data).then(data => data.project);
	}


	return {
		getAll: getAll,
		createNew: createNew
	};
}());