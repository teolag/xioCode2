const UserBox = (function() {
	const box = document.querySelector(".user-box");
	const username = document.querySelector(".user-name");
	const useremail = document.querySelector(".user-email");
	const photo = document.querySelector(".user-photo");
	let closeTimer;

	XI.listen('userLogin', userLogin, true);
	XI.listen('userLogout', userLogout, true);
	photo.addEventListener("click", e => box.classList.toggle("open"));

	box.addEventListener("mouseout", e => {
		if(!box.contains(e.toElement) && box.classList.contains("open")) {
			console.log("mouseout", e);
			closeTimer = setTimeout(() => box.classList.remove("open"), 2000);
		}
	});
	box.addEventListener("mouseenter", e => clearTimeout(closeTimer));

	function userLogout(payload) {

	}
	
	function userLogin(payload) {
		let user = payload[0];
		username.textContent = user.name;
		useremail.textContent = user.email;
		photo.src = user.photo.replace(/sz=\d+/, 'sz=100');
	}

	return {
		
	}

}());

module.exports = UserBox;