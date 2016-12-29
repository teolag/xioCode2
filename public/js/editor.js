const FileHandler = require("./file-handler");

require('codemirror/mode/meta');
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');
const CodeMirror = require('codemirror/lib/codemirror');
CodeMirror.modeInfo.find(m => m.name === "XML").ext.push("svg");

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
			indentWithTabs: true,
			tabSize: 4,
			indentUnit: 4,
			extraKeys: {
				"Cmd-S"		: "shortcutSave",
				"Ctrl-S"	: "shortcutSave"
			}
		});
		this.codeMirror.editor = this;
		this.unsavedId = 1;

		parent.appendChild(editor);
	}

	newFile() {
		const file = {unsaved: true, uri: `unsaved${this.unsavedId++}`};
		this.activeFile = file;
		file.doc = CodeMirror.Doc("");
		this.codeMirror.swapDoc(file.doc);
		this.openedFiles.push(file);
		this.updateTabBar();
	}

	saveFile() {
		const file = this.activeFile;
		if(!file) return;
		const projectId = this.parentProjectPage.project.id;
		if(!projectId) return;

		if(!file.uri===undefined || file.unsaved) {
			this.saveFileAs();
		} else {
			this.codeMirror.execCommand("removeTrailingSpaces");
			FileHandler.save(file.uri, file.doc.getValue(), projectId).then(data => {
				console.log("Save callback", data);
			});
		}
		console.log("save file", file);
	}
	
	saveFileAs() {
		const file = this.activeFile;
		if(!file) return;
		const projectId = this.parentProjectPage.project.id;
		if(!projectId) return;

		this.codeMirror.execCommand("removeTrailingSpaces");
		FileHandler.saveAs(file.doc.getValue(), projectId).then(data => {
			console.log("SaveAs callback", data);
			file.uri = data.uri;
			delete file.unsaved;
			this.codeMirror.setOption("mode", getMimeByUri(file.uri));
			this.updateTabBar();
		});
	}

	openFile(file) {
		this.activeFile = file;
		if(!this.openedFiles.find(f => f.uri===file.uri)) {
			this.openedFiles.push(file);
			file.doc = CodeMirror.Doc(file.content, getMimeByUri(file.uri));
			delete file.content;
		}
		this.codeMirror.swapDoc(file.doc);
		console.log("Swap to %s, with mode %s", file.uri, file.doc.getMode().name);
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
		let openedFile = this.openedFiles.find(f => f.uri===uri);
		if(openedFile) {
			this.openFile(openedFile);
		} else {
			this.parentProjectPage.openFile(uri);
		}
	}
}

module.exports = Editor;


function getMimeByUri(uri) {
	const info = CodeMirror.findModeByFileName(uri);
	return info ? info.mode : "none";
}


CodeMirror.commands.shortcutSave = function(instance) {
	console.log("Ctrl/Cmd+s pressed", instance);
	instance.editor.saveFile();
};

CodeMirror.commands.removeTrailingSpaces = function(editor) {
	editor.doc.eachLine(function(line) {
		line.text = line.text.replace(/\s+$/,"");
   	});
	editor.refresh();
};