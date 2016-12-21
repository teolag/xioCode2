let Projects = (function() {
	let projects = [];
	const btnNewProject = document.querySelector(".btnNewProject");
	const projectLauncher = document.querySelector(".project-launcher");
	const projectList = document.querySelector(".project-list");

	

	XI.listen("userLogin", payload => {
		ProjectHandler.getAll();
		projectLauncher.show();
	}, true);

	XI.listen("projectsLoaded", payload => {
		projects = payload[0];
		console.log("Projects loaded!!", projects);
		updateProjectList();
	}, true);


	btnNewProject.addEventListener("click", e => {
		XioPop.prompt({
			title: "Name of project",
			onSubmit: newProjectNameCallback
		});
	});

	function newProjectNameCallback(name) {
		console.log("new project", name);
		if(!name) return;

		ProjectHandler.createNew(name).then(project => {
			console.log("New project created", project);
			projects.push(project);
			updateProjectList();
		});
	}

	function updateProjectList() {
		let html = projects.sort(sortByProjectName).map(createListItem).join("");
		projectList.innerHTML = html;
	}

	function createListItem(project) {
		return `<li data-id='${project.id}'>${project.name}</li>`;
	}

	function sortByProjectName(a, b) {
		if(a.name > b.name) return 1;
		return -1;
	}



}());