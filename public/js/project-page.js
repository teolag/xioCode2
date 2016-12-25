const ProjectPage = (function() {

	const container = document.querySelector(".project-page");
	const projectFiles = document.querySelector(".project-files");
	const projectTitle = document.querySelector(".project-title");
	const projectEditors = document.querySelector(".project-editors");
	const btnNewFile = document.querySelector(".button-new-file");
	const files = [];
	const editors = [];
	let activeEditor;
	let activeProject;
	
	btnNewFile.addEventListener("click", createNewFile);

	XI.listen(["navigate","userLogin"], payloads => {
		let uriParts = payloads[0];
		if(uriParts[0]==='project') {
			container.show();
			const projectId = uriParts[1];
			console.log("Load project", projectId);
			openProject(projectId);
		} else {
			container.hide();
			console.log("no project active");
		}
	}, true);


	function openProject(projectId) {
		ProjectHandler.load(projectId).then(project => {
			if(project) {
				projectTitle.textContent = project.name;
				activeProject = project;
			} else {
				console.warn("No project found");
			}
		});
		ProjectHandler.getProjectFiles(projectId).then(files => {
			console.log("Files", files);
		});
	}


	function createNewFile() {
		console.log("NEW FILE!!");
		if(!activeEditor) {
			let editor = new Editor(projectEditors);
			editors.push(editor);
			activeEditor = editor;
		}
		activeEditor.newFile();
	}

	function getActiveProject() {
		return activeProject;
	}


	return {
		getActiveProject: getActiveProject
	}
}());