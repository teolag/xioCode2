class Editor {
	
	constructor(parent) {
		this.openedFiles = [];
		this.activeFile = null;

		const template = document.getElementById("tplEditor");
		const editor = document.importNode(template.content, true);

		this.textarea = editor.querySelector(".editor-textarea");
		this.tabBar = editor.querySelector(".editor-opened-files");
		this.tabBar.addEventListener("click", this._tabClick.bind(this));
		this.saveButton = editor.querySelector(".editor-save");
		this.saveButton.addEventListener("click", this.saveFile.bind(this));

		parent.appendChild(editor);
	}

	newFile() {
		const file = {dirty: false};
		this.openedFiles.push(file);
		this.activeFile = file;

		this.openedFiles.push(file);
		updateTabBar();
	}

	saveFile() {
		if(!this.activeFile) return;
		this.activeFile.content = this.textarea.value;
		const project = ProjectPage.getActiveProject();
		if(!project) return;

		if(!this.activeFile.uri) {
			this.saveFileAs();
		} else {
			FileHandler.save(this.activeFile.uri, this.activeFile.content, project.id).then(data => {
				console.log("Save callback", data);
			})
		}
		console.log("save file", this.activeFile);
	}
	
	saveFileAs() {
		if(!this.activeFile) return;
		this.activeFile.content = this.textarea.value;
		const project = ProjectPage.getActiveProject();
		if(!project) return;

		FileHandler.saveAs(this.activeFile.content, project.id).then(data => {
			console.log("SaveAs callback", data);
		});
	}

	openFile(file) {
		this.activeFile = file;
		if(!this.openedFiles.find(f => f.uri===file.uri)) {
			this.openedFiles.push(file);
		}
		this.textarea.value = file.content;
		this.updateTabBar();
	}

	updateTabBar() {
		this.tabBar.innerHTML = this.openedFiles
			.map(file => `<li data-uri='${file.uri}' class='${file===this.activeFile ? "active" : ""}'>${file.uri}</li>`)
			.join('');
	}

	_tabClick(e) {
		const uri = e.target.dataset.uri;
		if(!uri) return;

		ProjectPage.openFile(uri);
	}
}