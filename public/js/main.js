const Nav = require("./nav");
const ProjectPage = require("./project-page");
const UserBox = require("./user-box");
const projectPages = {};
const ProjectLauncher = require("./project-launcher");


var activeProjectPage;

Element.prototype.hide = function() {
	this.style.display = 'none';	
};

Element.prototype.show = function() {
	this.style.display = '';	
};


Nav.parseURI();

XI.listen(["navigate","userLogin"], payloads => {
	let uriParts = payloads[0];
	if(uriParts[0]==='project') {
		const projectId = uriParts[1];
		console.log("Load project", projectId);

		if(projectPages[projectId]) {
			activeProjectPage = projectPages[projectId];
		} else {
			activeProjectPage = new ProjectPage(projectId);
			projectPages[projectId] = activeProjectPage;
		}
		activeProjectPage.show();
		ProjectLauncher.hide();
	} else {
		console.log("No project... show launcher");
		ProjectLauncher.show();
	}
}, true);


const loginPage = document.querySelector(".login-page");
const header = document.querySelector("header");
const pageTitle = header.querySelector(".page-title");

pageTitle.addEventListener("click", e => ProjectLauncher.show());

fetch('/auth', {credentials: 'same-origin'})
	.then(blob => blob.json())
	.then(data => {
		if(data.status === 'authorized') {
			XI.fire("userLogin", data.user);
			header.show();
			loginPage.hide();
		} else {
			header.hide();
			loginPage.show();
		}
	});



