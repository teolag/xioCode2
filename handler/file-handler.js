const config = require('../config');
const mkdir = require("mkdir-promise");
const fs = require('fs');
const path = require('path');


module.exports = (function() {
	
	function save(filePath, content) {
		return new Promise((resolve, reject) => {
			fs.writeFile(filePath, content, function (err) {
			    if(err) reject("Error creating file: " + err);
			    resolve(true);
			});
		});
	}

	function fileExists(filePath) {
		return fs.existsSync(filePath);
	}
	
	return {
		save: save,
		fileExists: fileExists
	}
}())