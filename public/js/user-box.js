let UserBox = (function() {
	const box = document.querySelector(".userbox");
	const username = document.querySelector(".user-name");
	const useremail = document.querySelector(".user-email");

	XI.listen('userLogin', userLogin, true);
	XI.listen('userLogout', userLogout, true);

	function userLogout(payload) {
		box.hide();
	}
	function userLogin(payload) {
		box.show();
		let user = payload[0];
		username.textContent = user.name;
		useremail.textContent = user.email;
	}

	return {
		
	}

}());