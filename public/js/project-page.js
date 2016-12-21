const ProjectPage = (function() {

	const projectFiles = document.querySelector(".project-files");
	const projectTitle = document.querySelector(".project-title");
	const btnNewFile = document.querySelector(".button-new-file");
	
	btnNewFile.addEventListener("click", createNewFile);

	XI.listen("navigate", payloads => {
		let uriParts = payloads[0];
		if(uriParts[0]==='project') {
			const projectId = uriParts[1];
			console.log("Load project", projectId);
			openProject(projectId);
		} else {
			console.log("no project active");
		}
	}, true);


	function openProject(projectId) {
		ProjectHandler.load(projectId).then(project => {
			projectTitle.textContent = project.name;
		});
		//FileHandler.loadProjectFiles(projectId);
	}


	function createNewFile() {
		console.log("NEW FILE!!");
	}


	return {

	}
}());