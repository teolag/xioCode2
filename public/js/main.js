const Nav = require("./nav");
const ProjectPage = require("./project-page");
const projectPages = {};
require("./projects");

let activeProjectPage = null;

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
	}
}, true);


const loginbox = document.querySelector(".loginbox");


fetch('/auth', {credentials: 'same-origin'})
	.then(blob => blob.json())
	.then(data => {
		if(data.status === 'authorized') {
			XI.fire("userLogin", data.user);
		} else {
			loginbox.show();
		}
	});



