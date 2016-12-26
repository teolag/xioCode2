const config = require('../config');
const mkdir = require("mkdir-promise");
const fs = require('fs');
const path = require('path');


module.exports = (function() {
	
	function save(uri, content) {
		return new Promise((resolve, reject) => {
			fs.writeFile(uri, content, function (err) {
			    if(err) reject("Error creating file: " + err);
			    resolve(true);
			});
		});
	}

	function fileExists(uri) {
		return fs.existsSync(uri);
	}

	function open(uri) {
		return new Promise((resolve, reject) => {
			fs.readFile(uri, 'utf8', (err, content) => {
				if(err) reject("Error open file: " + err);
				resolve(content);
			});
		});
	}
	
	return {
		save: save,
		fileExists: fileExists,
		open: open
	}
}())