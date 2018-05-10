const max_Retry = 10;
const host = 'http:\/\/163.26.71.106\/';
const webpac = 'webpac\/';
const search = 'webpac\/search.cfm'
const par1 = '?m=ss&k0=';
const par2 = '&t0=k&c0=and';
const searchengin_host = 'http://163.26.71.106';

Object.defineProperty(Promise, 'retry', {
	configurable: true,
	writable: true,
	value: function retry(retries, executor) {
		// console.log(`${retries} retries left!`)

		if (typeof retries !== 'number') {
			throw new TypeError('retries is not a number')
		}

		const promise = new Promise(executor)

		if (retries > 0) {
			return promise.catch(error => Promise.retry(--retries, executor))
		}

		return promise
	}
})

var tnlib_xmlget_init = function(url, book) {
	var req = new XMLHttpRequest();
	req.open('GET', url);
	req.setRequestHeader('Accept', '	text/html');
	req.setRequestHeader('Access-Control-Allow-Origin', searchengin_host);
	req.book = book;
	return req;
}

var autolink_promise = function(res) {
	return Promise.retry(max_Retry, function(resolve, reject) {
		var parser = new DOMParser();
		var htmlDoc = parser.parseFromString(res.target.response, "text/html");
		var holdingLocations = htmlDoc.getElementById("holdingLocations");
		var vals = Array.apply(null, holdingLocations).filter(e => e.innerText.includes('安定'));
		var lc = vals[0].value

		var req = tnlib_xmlget_init(res.target.responseURL + '&lc=' + lc, res.target.book);
		var bookpage_response_handler = function(res) {
			var parser = new DOMParser();
			var htmlDoc = parser.parseFromString(res.target.response, "text/html");
			if (res.target.status == 200) {
				var tr = Array.apply(null, htmlDoc.querySelectorAll('#rdk_content_1 >table > tbody > tr')); //.filter(function(e){return e.children[0].innerText.trim() == req.book[0]});
				if (tr.length !== 0) {
					resolve(res.target);
				} else {
					console.log(res.target);
					console.log(res);
					console.log('tr=0');
					// reject('tr=0');
					resolve(get_bookpage(res.target.book))
				}
			} else {
				reject(Error('Network Error'));
			}
		}
		req.onload = bookpage_response_handler;

		req.onerror = function() {
			reject(Error("Network Error"));
		};

		req.send();
	})
}

var search_promise = function(res) {
	return Promise.retry(max_Retry, function(resolve, reject) {
		var parser = new DOMParser();
		var htmlDoc = parser.parseFromString(res.target.response, "text/html");
		var autolink = htmlDoc.getElementById('autolink');

		var req = tnlib_xmlget_init(host + webpac + autolink.getAttribute('href'), res.target.book);
		req.onerror = function() {
			reject(Error("Network Error"));
		};

		var autolink_response_handler = function(res) {
			if (res.target.status == 200) {
				var parser = new DOMParser();
				var htmlDoc = parser.parseFromString(res.target.response, "text/html");
				var holdingLocations = htmlDoc.getElementById("holdingLocations");
				if (holdingLocations !== null) {
					resolve(autolink_promise(res));
				} else {
					console.log('nolocation');
					// reject('nolocation')
					resolve(get_bookpage(res.target.book))
				}
			} else {
				reject(Error('Network Error'));
			}
		}

		req.onload = autolink_response_handler;
		req.send();
	})
}

var get_bookpage = function(book) {
	if (book[0].substr(0, 2) === 'ED') {
		return Promise.retry(max_Retry, function(resolve, reject) {

			var search_response_handler = function(res) {
				var parser = new DOMParser();
				var htmlDoc = parser.parseFromString(res.target.response, "text/html");
				var autolink = htmlDoc.getElementById('autolink');
				if (res.target.status == 200) {
					// Resolve the promise with the response text
					if (autolink !== null) {
						resolve(search_promise(res));
					} else {
						reject('noautolink');
						// resolve(get_bookpage(res.target.book));
					}

				} else {
					reject(Error('Network Error'));
				}
			}
			var req = tnlib_xmlget_init(host + search + par1 + book[0] + par2, book);
			req.onload = search_response_handler;

			req.onerror = function() {
				reject(Error("Network Error"));
			};

			req.send();
		});
	} else {
		return Promise.retry(max_Retry, function(resolve, reject) {

			var autolink_response_handler = function(res) {
				if (res.target.status == 200) {
					var parser = new DOMParser();
					var htmlDoc = parser.parseFromString(res.target.response, "text/html");
					var bookname = htmlDoc.getElementsByTagName('h2')[1];
					if (undefined !== bookname) {
						resolve(res.target);
					} else {
						reject('nobookname');
					}
				} else {
					reject(Error('Network Error'));
				}
			}

			var search_response_handler = function(res) {
				var parser = new DOMParser();
				var htmlDoc = parser.parseFromString(res.target.response, "text/html");
				var autolink = htmlDoc.getElementById('autolink');
				if (res.target.status == 200) {
					if (autolink !== null) {
						// resolve(req);
						var req = new XMLHttpRequest();
						req.open('GET', host + webpac + autolink.getAttribute('href'));
						req.setRequestHeader('Accept', 'text/html');
						req.setRequestHeader('Access-Control-Allow-Origin', searchengin_host);
						req.book = res.target.book;
						req.onload = autolink_response_handler;

						req.onerror = function() {
							reject(Error("Network Error"));
						};

						req.send();
					} else {
						// resolve(get_bookpage(res.target.book));
						reject('noautolink');
					}

				} else {
					reject(Error('Network Error'));
				}
			}
			var req = tnlib_xmlget_init(host + search + par1 + book[0] + par2, book);
			req.onload = search_response_handler;

			req.onerror = function() {
				reject(Error("Network Error"));
			};

			req.send();
		});
	}

}