const ProjectPage = (function() {

	const container = document.querySelector(".project-page");
	const projectTitle = document.querySelector(".project-title");
	const projectEditors = document.querySelector(".project-editors");
	const btnNewFile = document.querySelector(".button-new-file");
	const editors = [];
	let activeEditor;
	let activeProject;
	let files;
	let loadedFiles = {};
	
	btnNewFile.addEventListener("click", newBlankFile);

	XI.listen(["navigate","userLogin"], payloads => {
		let uriParts = payloads[0];
		if(uriParts[0]==='project') {
			container.show();
			const projectId = uriParts[1];
			console.log("Load project", projectId);
			openProject(projectId);
			loadProjectFiles(projectId);
		} else {
			container.hide();
			console.log("no project active");
		}
	}, true);

	function loadProjectFiles(projectId) {
		ProjectHandler.getProjectFiles(projectId).then(fileList => {
			files = fileList;
			XI.fire("projectFilesUpdated", files);
			console.log("Files", files);
		});
	}


	function openProject(projectId) {
		ProjectHandler.load(projectId).then(project => {
			if(project) {
				projectTitle.textContent = project.name;
				activeProject = project;
				XI.fire("projectLoaded", project);
			} else {
				console.warn("No project found");
			}
		});
	}

	function newBlankFile() {
		console.log("NEW FILE!!");
		if(!activeEditor) {
			let editor = new Editor(projectEditors);
			editors.push(editor);
			activeEditor = editor;
		}
		activeEditor.newFile();
	}

	function openFile(uri) {
		console.log("OPEN FILE!!");
		if(loadedFiles[uri]) {
			let file = loadedFiles[uri];
			activeEditor = file.editor;
			activeEditor.openFile(file);
			console.log("already open... show");
		} else {
			console.log("need to open...");
			FileHandler.open(uri, activeProject.id).then(data => {
				console.log("Open callback", data.file);
				if(!activeEditor) {
					let editor = new Editor(projectEditors);
					editors.push(editor);
					activeEditor = editor;
				}
				data.file.editor = activeEditor;
				loadedFiles[data.file.uri] = data.file;
				activeEditor.openFile(data.file);
			});
		}


	}

	function getActiveProject() {
		return activeProject;
	}


	return {
		getActiveProject: getActiveProject,
		openFile: openFile
	}
}());