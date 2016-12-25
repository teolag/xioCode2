const config = require('../config');
const mkdir = require("mkdir-promise");
const fs = require('fs');
const path = require('path');


module.exports = (function() {
	
	function create(name, creator) {
		let project = {
			name, 
			creator: {name: creator.name, googleId: creator.googleId}, 
			created: new Date(), 
			id: name2id(name)
		};

		return createFolder(project)
			.then(() => createJSONfile(project));		
	}

	function getPath(projectId) {
		return path.join(config.projectsFolder, projectId);
	}

	function getJSONfile(project) {
		return path.join(getPath(project.id), 'xioCode.json');
	}


	function createFolder(project) {
		let projectPath = getPath(project.id);
		return mkdir(projectPath).catch(err => {
			console.error("Error creating folder", projectPath, err);
		});
	}

	function createJSONfile(project) {
		let projectFile = getJSONfile(project);
		let data = {
			name: project.name, 
			created: project.created, 
			creator: project.creator
		};
		return new Promise((resolve, reject) => {
			fs.writeFile(projectFile, JSON.stringify(data), function (err) {
			    if(err) reject("Error creating file: " + err);
			    resolve(project);
			});
		});
	}

	function get(id) {
		let projectsFolder = config.projectsFolder
		let projectFolder = path.join(projectsFolder, id);
		if(!fs.existsSync(projectFolder)) return;
		let projectFile = path.join(projectFolder, 'xioCode.json');
		let contents = fs.readFileSync(projectFile);
		let project = JSON.parse(contents);
		project.id = id;
		return project;
	}


	function getAll() {
		let projectsFolder = config.projectsFolder;

		if(fs.existsSync(projectsFolder)) {
			return fs.readdirSync(projectsFolder)
				.filter(file => fs.statSync(path.join(projectsFolder, file)).isDirectory())
				.map(folder => get(folder))
			;
		} else {
			return [];
		}
	}

	function getProjectFiles(projectId) {
		return fs.readdirSync(getPath(projectId));
	}

	
	return {
		create: create,
		getAll: getAll,
		getProjectFiles: getProjectFiles,
		get: get
	}

}())



function name2id(name) {
	return name
		.trim()
		.toLowerCase()
		.replace(/[\s]/g, '_')
		.replace(/[åä]/g, 'a')
		.replace(/[ö]/g, 'o')
		.replace(/[ü]/g, 'u')
		.replace(/[é]/g, 'e')
		.replace(/[^a-z0-9_-]/g, '')
		.replace(/_+/g,'_');
}