
Element.prototype.hide = function() {
	this.style.display = 'none';	
};

Element.prototype.show = function() {
	this.style.display = '';	
};




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



