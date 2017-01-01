const config = require('../config');
const mkdir = require("mkdir-promise");
const fs = require('fs');
const path = require('path');


module.exports = (function() {
	
	function create(name, creator) {
		let project = {
			name, 
			creator: {name: creator.name, googleId: creator.googleId}, 
			created: new Date()
		};
		let projectId = name2id(name);
		return createFolder(projectId)
			.then(() => createJSONfile(projectId, project));		
	}

	function getProjectPath(projectId) {
		return path.join(config.projectsFolder, projectId);
	}

	function getJSONfilePath(projectId) {
		return path.join(getProjectPath(projectId), 'xioCode.json');
	}


	function createFolder(projectId) {
		let projectPath = getProjectPath(projectId);
		return mkdir(projectPath).catch(err => {
			console.error("Error creating folder", projectPath, err);
		});
	}

	function createJSONfile(projectId, project) {
		let projectFile = getJSONfilePath(projectId);
		let data = {
			name: project.name, 
			created: project.created, 
			creator: project.creator
		};
		return new Promise((resolve, reject) => {
			fs.writeFile(projectFile, JSON.stringify(data), function (err) {
			    if(err) reject("Error creating file: " + err);
			    project.id = projectId;
			    resolve(project);
			});
		});
	}

	function get(projectId) {
		let projectPath = getProjectPath(projectId);
		if(!fs.existsSync(projectPath)) return;
		let projectFile = getJSONfilePath(projectId);
		let project;
		if(!fs.existsSync(projectFile)) {
			project = {name: projectId};
			createJSONfile(projectId, project);
		} else {
			let contents = fs.readFileSync(projectFile);
			project = JSON.parse(contents);
		}
		project.id = projectId;
		return project;
	}


	function getAll() {
		let projectsFolder = config.projectsFolder;

		if(fs.existsSync(projectsFolder)) {
			return fs.readdirSync(projectsFolder)
				.filter(file => fs.statSync(getProjectPath(file)).isDirectory())
				.map(folder => get(folder))
			;
		} else {
			return [];
		}
	}

	function getProjectFiles(projectId) {
		return fs.readdirSync(getProjectPath(projectId));
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