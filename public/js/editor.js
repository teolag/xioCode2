class Editor {
	
	constructor(parent) {
		this.openedFiles = [];
		this.activeFile = null;

		const template = document.getElementById("tplEditor");
		const editor = document.importNode(template.content, true);

		this.textarea = editor.querySelector(".editor-textarea");
		this.tabBar = editor.querySelector(".editor-opened-files");
		this.saveButton = editor.querySelector(".editor-save");
		this.saveButton.addEventListener("click", this.saveFile.bind(this));

		parent.appendChild(editor);
	}

	newFile() {
		const file = {dirty: false};
		this.openedFiles.push(file);
		this.activeFile = file;

		const tab = document.createElement("li");
		tab.textContent = "unsaved";
		this.tabBar.appendChild(tab);
	}

	saveFile() {
		if(!this.activeFile) return;

		this.activeFile.content = this.textarea.value;
		const project = ProjectPage.getActiveProject()
		if(!project) return;

		if(!this.activeFile.filename) {
			//Unsaved file
			FileHandler.saveAs(this.activeFile, project.id).then(data => {
				console.log("SaveAs callback", data);
			});
		}
		console.log("save file", this.activeFile);


	}
	
}