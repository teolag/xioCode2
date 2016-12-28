const FileHandler = require("./file-handler");

require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');
const CodeMirror = require('codemirror/lib/codemirror');

class Editor {
	
	constructor(parentProjectPage) {
		this.parentProjectPage = parentProjectPage;
		this.openedFiles = [];
		this.activeFile = null;

		const parent = document.querySelector(".project-editors");
		const template = document.getElementById("tplEditor");
		const editor = document.importNode(template.content, true);

		this.tabBar = editor.querySelector(".editor-opened-files");
		this.tabBar.addEventListener("click", this._tabClick.bind(this));
		this.saveButton = editor.querySelector(".editor-save");
		this.saveButton.addEventListener("click", this.saveFile.bind(this));
		this.codeMirror = new CodeMirror(editor, {
			lineNumbers: true,
			extraKeys: {
				"Cmd-S"		: "shortcutSave",
				"Ctrl-S"	: "shortcutSave"
			}
		});
		this.codeMirror.editor = this;

		parent.appendChild(editor);
	}

	newFile() {
		const file = {dirty: false};
		this.openedFiles.push(file);
		this.activeFile = file;
		file.doc = CodeMirror.Doc("");
		this.codeMirror.swapDoc(file.doc);
		this.openedFiles.push(file);
		updateTabBar();
	}

	saveFile() {
		if(!this.activeFile) return;
		const projectId = this.parentProjectPage.project.id;
		if(!projectId) return;

		if(!this.activeFile.uri) {
			this.saveFileAs();
		} else {
			FileHandler.save(this.activeFile.uri, this.activeFile.doc.getValue(), projectId).then(data => {
				console.log("Save callback", data);
			})
		}
		console.log("save file", this.activeFile);
	}
	
	saveFileAs() {
		if(!this.activeFile) return;
		const projectId = this.parentProjectPage.project.id;
		if(!projectId) return;

		FileHandler.saveAs(this.activeFile.doc.getValue(), projectId).then(data => {
			console.log("SaveAs callback", data);
		});
	}

	openFile(file) {
		this.activeFile = file;
		if(!this.openedFiles.find(f => f.uri===file.uri)) {
			this.openedFiles.push(file);
			file.doc = CodeMirror.Doc(file.content);
			delete file.content;
		}
		this.codeMirror.swapDoc(file.doc);
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

		this.parentProjectPage.openFile(uri);
	}
}

module.exports = Editor;





CodeMirror.commands.shortcutSave = function(instance) {
	console.log("Ctrl/Cmd+s pressed", instance);
	instance.editor.saveFile();
};