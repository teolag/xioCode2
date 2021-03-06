const Nav = (function() {

	if(!location.hash) {
		history.replaceState(null, "", location.pathname + location.search);
	}
	
	addEventListener("popstate", popState);
	
	function popState(e) {
		console.log("POPstate", e);
		parseURI();
	}

	function goto(uri) {
		const obj = title = null;
		history.pushState(obj, title, uri);
		parseURI();
	}

	function parseURI() {
		const uri = location.pathname.substr(1);
		XI.fire("navigate", uri.split('/'));
		console.log("Location", uri);
	}

	return {
		goto: goto,
		parseURI: parseURI
	}
}());

module.exports = Nav;