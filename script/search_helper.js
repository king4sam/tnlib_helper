var get_bookpage = function(book) {
	const host = 'http:\/\/163.26.71.106\/';
	const webpac = 'webpac\/';
	const search = 'webpac\/search.cfm'
	const par1 = '?m=ss&k0=';
	const par2 = '&t0=k&c0=and';
	const searchengin_host = 'http://163.26.71.106';

	var tnlib_xmlget_init = function(url,book){
		var req = new XMLHttpRequest();
		req.open('GET', url);
		req.setRequestHeader('Accept', '	text/html');
		req.setRequestHeader('Access-Control-Allow-Origin', searchengin_host);
		req.book = book;
		return req;
	}

	if (book[0].substr(0, 2) === 'ED') {
		return new Promise(function(resolve, reject) {

			var bookpage_response_handler = function(res) {
				// This is called even on 404 etc
				// so check the status
				var parser = new DOMParser();
				var htmlDoc = parser.parseFromString(res.target.response, "text/html");
				if (res.target.status == 200) {
					var tr = Array.apply(null, htmlDoc.querySelectorAll('#rdk_content_1 >table > tbody > tr')); //.filter(function(e){return e.children[0].innerText.trim() == req.book[0]});
					if (tr.length !== 0) {
						resolve(res.target);
					} else {
						resolve(get_bookpage(book))
					}
				} else {
					// Otherwise reject with the status text
					// which will hopefully be a meaningful error
					reject(Error('Network Error'));
				}
			}

			var autolink_response_handler = function(res) {
				// This is called even on 404 etc
				// so check the status
				var parser = new DOMParser();
				var htmlDoc = parser.parseFromString(res.target.response, "text/html");
				var holdingLocations = htmlDoc.getElementById("holdingLocations");
				if (res.target.status == 200) {
					if (holdingLocations !== null) {
						// resolve(req);
						var vals = Array.apply(null, holdingLocations).filter(e => e.innerText.includes('安定'));
						var lc = vals[0].value

						var req = tnlib_xmlget_init(res.target.responseURL + '&lc=' + lc,res.target.book);
						req.onload = bookpage_response_handler;

						// Handle network errors
						req.onerror = function() {
							reject(Error("Network Error"));
						};

						// Make the request
						req.send();
					} else {
						console.log('nolocation');
						resolve(get_bookpage(res.target.book))
					}
				} else {
					// Otherwise reject with the status text
					// which will hopefully be a meaningful error
					reject(Error('Network Error'));
				}
			}

			var search_response_handler = function(res) {
				// This is called even on 404 etc
				// so check the status
				var parser = new DOMParser();
				var htmlDoc = parser.parseFromString(res.target.response, "text/html");
				var autolink = htmlDoc.getElementById('autolink');
				if (res.target.status == 200) {
					// Resolve the promise with the response text
					if (autolink !== null) {
						// resolve(req);
						var req = tnlib_xmlget_init(host + webpac + autolink.getAttribute('href'),res.target.book);
						req.onload = autolink_response_handler;

						// Handle network errors
						req.onerror = function() {
							reject(Error("Network Error"));
						};

						// Make the request
						req.send();
					} else {
						console.log('noautolink');
						resolve(get_bookpage(res.target.book));
					}

				} else {
					// Otherwise reject with the status text
					// which will hopefully be a meaningful error
					reject(Error('Network Error'));
				}
			}
			// Do the usual XHR stuff
			var req = tnlib_xmlget_init(host + search + par1 + book[0] + par2,book);
			req.onload = search_response_handler;

			// Handle network errors
			req.onerror = function() {
				reject(Error("Network Error"));
			};

			// Make the request
			req.send();
		});
	} else {
		return new Promise(function(resolve, reject) {

			var autolink_response_handler = function(res) {
				if (res.target.status == 200) {
					resolve(res.target);
				} else {
					// Otherwise reject with the status text
					// which will hopefully be a meaningful error
					reject(Error('Network Error'));
				}
			}

			var search_response_handler = function(res) {
				// This is called even on 404 etc
				// so check the status
				var parser = new DOMParser();
				var htmlDoc = parser.parseFromString(res.target.response, "text/html");
				var autolink = htmlDoc.getElementById('autolink');
				if (res.target.status == 200) {
					// Resolve the promise with the response text
					if (autolink !== null) {
						// resolve(req);
						var req = new XMLHttpRequest();
						req.open('GET', host + webpac + autolink.getAttribute('href'));
						req.setRequestHeader('Accept', 'text/html');
						req.setRequestHeader('Access-Control-Allow-Origin', searchengin_host);
						req.book = res.target.book;
						req.onload = autolink_response_handler;

						// Handle network errors
						req.onerror = function() {
							reject(Error("Network Error"));
						};

						// Make the request
						req.send();
					} else {
						console.log('noautolink');
						resolve(get_bookpage(res.target.book));
					}

				} else {
					// Otherwise reject with the status text
					// which will hopefully be a meaningful error
					reject(Error('Network Error'));
				}
			}
			// Do the usual XHR stuff
			var req = tnlib_xmlget_init(host + search + par1 + book[0] + par2,book);
			req.onload = search_response_handler;

			// Handle network errors
			req.onerror = function() {
				reject(Error("Network Error"));
			};

			// Make the request
			req.send();
		});
	}

}