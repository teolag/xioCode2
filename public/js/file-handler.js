const FileHandler = (function() {
	
	function saveAs(file, projectId) {
		const getName = () => {
			return new Promise((resolve, reject) => {
				if(!file.filename) {
					XioPop.prompt({title: "Enter filename", onSubmit: name => {
						if(!name) resolve(false);
						resolve(name);
					}});
				}
			});
		};

		return getName().then(name => {
			if(!name) return false;
			const data = {filename: name, content: file.content, projectId};
			return Api.post("file", data);
		});
	}

	return {
		saveAs: saveAs
	};
}());