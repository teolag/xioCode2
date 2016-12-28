const ProjectHandler = require("./project-handler");
const FileHandler = require("./file-handler");
const Editor = require("./editor");
const FileBrowser = require('./file-browser');

class ProjectPage {
	constructor(projectId) {
		const parent = document.querySelector(".project-pages");
		const template = document.getElementById("tplProjectPage");
		const page = document.importNode(template.content, true);

		this.container = page.querySelector(".project-page");
		this.projectTitle = page.querySelector(".project-title");
		this.btnNewFile = page.querySelector(".button-new-file");
		this.editors = [];
		this.fileBrowser = new FileBrowser(this);
		this.activeEditor;
		this.files;
		this.loadedFiles = {};
		this.project;

		this.openProject(projectId);
		this.loadProjectFiles(projectId);
		
		this.btnNewFile.addEventListener("click", this.newBlankFile.bind(this));

		parent.appendChild(page);
	}

	loadProjectFiles(projectId) {
		ProjectHandler.getProjectFiles(projectId).then(fileList => {
			this.files = fileList;
			this.fileBrowser.updateFileList(fileList);
			console.log("Files", this.files);
		});
	}


	openProject(projectId) {
		ProjectHandler.load(projectId).then(project => {
			if(project) {
				this.projectTitle.textContent = project.name;
				this.project = project;
				XI.fire("projectLoaded", project);
			} else {
				console.warn("No project found");
			}
		});
	}

	newBlankFile() {
		console.log("NEW FILE!!");
		if(!this.activeEditor) {
			let editor = new Editor(this);
			this.editors.push(editor);
			this.activeEditor = editor;
		}
		this.activeEditor.newFile();
	}

	openFile(uri) {
		console.log("OPEN FILE!!");
		if(this.loadedFiles[uri]) {
			let file = this.loadedFiles[uri];
			this.activeEditor = file.editor;
			this.activeEditor.openFile(file);
			console.log("already open... show");
		} else {
			console.log("need to open...");
			FileHandler.open(uri, this.project.id).then(data => {
				console.log("Open callback", data.file);
				if(!this.activeEditor) {
					let editor = new Editor(this);
					this.editors.push(editor);
					this.activeEditor = editor;
				}
				data.file.editor = this.activeEditor;
				this.loadedFiles[data.file.uri] = data.file;
				this.activeEditor.openFile(data.file);
			});
		}


	}

	getProject() {
		return this.project;
	}

	show() {
		this.container.show();
	}

}


module.exports = ProjectPage;