const Api = require("./api");

const FileHandler = (function() {
	
	function saveAs(content, projectId) {
		const getName = () => {
			return new Promise((resolve, reject) => {
				XioPop.prompt({title: "Enter filename", onSubmit: name => {
					if(!name) resolve(false);
					resolve(name);
				}});
			});
		};

		return getName().then(uri => {
			if(!uri) return false;
			const data = {uri, content};
			return Api.post(`project/${projectId}/file`, data);
		});
	}

	function save(uri, content, projectId) {
		const data = {content};
		return Api.put(`project/${projectId}/file/${uri}`, data);
	}

	function open(uri, projectId) {
		return Api.get(`project/${projectId}/file/${uri}`);
	}


	function createFolder() {
		return Api.post("folder", data);
	}

	return {
		saveAs: saveAs,
		save: save,
		open: open
	};
}());

module.exports = FileHandler;