const Api = (function() {
	
	function get(command) {
		const options = {
			credentials: 'same-origin'
		};
		return _send(command, options);
	}

	function deletee(command) {
		const options = {
			method: 'delete',
			credentials: 'same-origin'
		};
		return _send(command, options);
	}

	function post(command, data) {
		const options = {
			credentials: 'same-origin',
			method: 'post',
			body: JSON.stringify(data),
			headers: new Headers({ "Content-Type": "application/json" })
		};
		return _send(command, options);
	}

	function put(command, data) {
		const options = {
			credentials: 'same-origin',
			method: 'put',
			body: JSON.stringify(data),
			headers: new Headers({ "Content-Type": "application/json" })
		};
		return _send(command, options);
	}

	function _send(command, options) {
		return fetch(`/api/${command}`, options)
			.then(blob => blob.json())
			.catch(err => console.error("Error fetching", err));
	}


	return {
		get: get,
		delete: deletee,
		post: post,
		put: put
	}
}());

module.exports = Api;