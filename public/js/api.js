const Api = (function() {
	
	function get(command) {
		return fetch(`/api/${command}`, {credentials: 'same-origin'})
			.then(blob => blob.json());
	}

	function post(command, data) {
		const options = {
			credentials: 'same-origin',
			method: 'post',
			body: JSON.stringify(data),
			headers: new Headers({ "Content-Type": "application/json" })
		}
		return fetch(`/api/${command}`, options)
			.then(blob => blob.json())
			.catch(err => console.error("Error fetching", err));
	}


	return {
		get: get,
		post: post
	}
}());