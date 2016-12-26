const FileBrowser = (function() {
	const container = document.querySelector(".file-browser");
	const list = document.querySelector(".files");
	const btnNewFolder = document.querySelector(".button-new-folder");
	
	btnNewFolder.addEventListener("click", createNewFolder);
	list.addEventListener("click", fileClick);
	
	

	XI.listen("projectFilesUpdated", payloads => {
		let files = payloads[0];
		updateFileList(files);
	}, true);

	

	function updateFileList(files) {
		list.innerHTML = files.map(file => {
			return `<li data-uri='${file}'>${file}</li>`;
		}).join('');
	}

	function createNewFolder() {
		console.log("NEW FOLDER!!");
	}

	function fileClick(e) {
		const uri = e.target.dataset.uri;
		if(!uri) return;
		ProjectPage.openFile(uri);
	}

}());