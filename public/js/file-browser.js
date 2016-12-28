const FileHandler = require("./file-handler");
//const ProjectPage = require("./project-page");

class FileBrowser {

	constructor(parentProjectPage) {
		this.parentProjectPage = parentProjectPage;
		this.list = parentProjectPage.container.querySelector(".files");
		this.btnNewFolder = parentProjectPage.container.querySelector(".button-new-folder");
		
		this.btnNewFolder.addEventListener("click", this.createNewFolder.bind(this));
		this.list.addEventListener("click", this.fileClick.bind(this));
		

		XI.listen("projectFilesUpdated", payloads => {
			let files = payloads[0];
			this.updateFileList(files);
		}, true);
	}

	updateFileList(files) {
		this.list.innerHTML = files.map(file => {
			return `<li data-uri='${file}'>${file}</li>`;
		}).join('');
	}

	createNewFolder() {
		console.log("NEW FOLDER!!");
		FileHandler.createFolder();
	}

	fileClick(e) {
		const uri = e.target.dataset.uri;
		if(!uri) return;
		this.parentProjectPage.openFile(uri);
	}
};

module.exports = FileBrowser;