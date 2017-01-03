const ProjectHandler = require("./project-handler");
const Nav = require("./nav");

const ProjectLauncher = (function() {
	let projects = [];
	const btnNewProject = document.querySelector(".button-new-project");
	const projectLauncher = document.querySelector(".project-launcher");
	const projectList = document.querySelector(".project-list");
	const textSearch = document.querySelector(".project-launcher-search");
	let lastSearch = "";

	projectLauncher.addEventListener("click", e => {
		if(e.target === projectLauncher) hide();
	});

	projectList.addEventListener("click", e => {
		const projectId = e.target.dataset.id;
		if(!projectId) return;

		Nav.goto(`/project/${projectId}`);
	});


	textSearch.addEventListener('keyup', e => {
		if(textSearch.value === lastSearch) return;
		lastSearch = textSearch.value;
		updateProjectList();
	});
	textSearch.addEventListener('keydown', e => {
		if(e.keyCode === 40) {
			console.log("DOWN");
			e.preventDefault();
			selectNextItem();
		} else if(e.keyCode === 38) {
			console.log("UP");
			e.preventDefault();
			selectNextItem(true);
		} else if(e.keyCode === 13) {
			const selected = projectList.querySelector('.selected');
			if(!selected) return;
			const projectId = selected.dataset.id;
			Nav.goto(`/project/${projectId}`);
			e.preventDefault();
		}

		function selectNextItem(reverse) {
			const selected = projectList.querySelector('.selected');
			if(!selected) return;
			const newSelected = selected[(reverse ? 'previous' : 'next') + 'ElementSibling'];
			if(!newSelected) return;
			selected.classList.remove("selected");
			newSelected.classList.add("selected");
		}	
	});
	

	XI.listen("userLogin", payload => {
		ProjectHandler.getAll();
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
		console.log("Update project list");
		let html = projects
			.filter(filterBySearch)
			.sort(sortByProjectName)
			.map(createListItem)
			.join("");
		projectList.innerHTML = html;

		const firstItem = projectList.children[0];
		if(firstItem) {
			firstItem.classList.add("selected");
		}
	}

	function filterBySearch(project) {
		const filterText = textSearch.value;
		return project.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
	}

	function createListItem(project) {
		return `<li data-id='${project.id}'>${project.name}</li>`;
	}

	function sortByProjectName(a, b) {
		if(a.name > b.name) return 1;
		return -1;
	}

	function show() {
		projectLauncher.show();
		textSearch.focus();
	}

	function hide() {
		projectLauncher.hide();
	}

	return {
		show: show,
		hide: hide
	}

}());

module.exports = ProjectLauncher;