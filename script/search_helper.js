const max_Retry = 3;
const host = 'http:\/\/163.26.71.106\/';
const webpac = 'webpac\/';
const search = 'webpac\/search.cfm'
const par1 = '?m=ss&k0=';
const par2 = '&t0=k&c0=and';
const searchengin_host = 'http://163.26.71.106';

var checkerrpage = function(htmlDoc){
	var err = htmlDoc.querySelectorAll('img[alt="error_refresh"]');
	if(err.length > 0){
		console.log('pageerr')
		return false;
	}
	else{
		return true;
	}
}

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

var nextpage_promise = function(link,book){
	// console.log(link);
	return new Promise(function(resolve,reject){
		if(link == '#'){
			console.log('booknotfound: ' + book[0]);
			// console.log('notfound');
			resolve('booknotfound');
		}else{
			var req = tnlib_xmlget_init(host + webpac + link, book);
			req.onerror = function() {
				reject(Error("Network Error"));
			};
			var nextpage_response_handler = function(res){
				if (res.target.status == 200) {
					var htmlDoc = new DOMParser().parseFromString(res.target.response, "text/html");
					var links = htmlDoc.querySelectorAll('div[class="page_Num chg_page"]:nth-of-type(3) > a');
					if(checkerrpage(htmlDoc)){
						// reject(Error('errpage'));
						console.log('errpage')
						console.log(res.target.responseURL)
					}
					if(links.length === 0){
						reject(Error('nolinks'));
					}
					var nextlink = links[links.length-1].getAttribute('href');
					var tr = get_booktrs(htmlDoc,res.target.book);
					if (tr.length !== 0) {
						resolve(res.target);
					}else {
						resolve(nextpage_promise(nextlink,book));
					}
				}
			}

			req.onload = nextpage_response_handler;
			req.send();
		}
	})
}

var get_booktrs = function(htmlDoc, book){
	if( htmlDoc.querySelectorAll('#rdk_content_1 >table > tbody > tr').length === 0)
		return null;
	else{
		return Array.from(htmlDoc.querySelectorAll('#rdk_content_1 >table > tbody > tr'))
			.filter(function(e){
				return e.children[0].innerText.trim() == book[0]
			});
	}
}

var normalautolink_promise = function(res) {
	return new Promise(function(resolve, reject) {
		if (res.target.status == 200) {
			var htmlDoc = new DOMParser().parseFromString(res.target.response, "text/html");
			if(checkerrpage(htmlDoc)){
				// reject(Error('errpage'));
						console.log('errpage');
						console.log(res.target.responseURL)
			}
			var links = htmlDoc.querySelectorAll('div[class="page_Num chg_page"]:nth-of-type(3) > a');
			var tr = get_booktrs(htmlDoc,res.target.book);
			var bookname = htmlDoc.getElementsByTagName('h2')[1];
			var nextlink = links[links.length-1].getAttribute('href');
			if (tr.length !== 0) {
				resolve(res.target);
			} else {
				resolve(nextpage_promise(nextlink,res.target.book));
			}
		} else {
			reject(Error('Network Error'));
		}
	})
}

var normalsearch_promise = function(res) {
	return Promise.retry(max_Retry, function(resolve, reject) {
		var htmlDoc = new DOMParser().parseFromString(res.target.response, "text/html");
		var autolink = htmlDoc.getElementById('autolink');

		var req = tnlib_xmlget_init(host + webpac + autolink.getAttribute('href'), res.target.book);
		req.onerror = function() {
			reject(Error("Network Error"));
		};

		var autolink_response_handler = function(res) {
			if (res.target.status == 200) {
				var htmlDoc = new DOMParser().parseFromString(res.target.response, "text/html");
				if(checkerrpage(htmlDoc)){
					// reject(Error('errpage'));
						console.log('errpage');
						console.log(res.target.responseURL)
				}
				resolve(normalautolink_promise(res));
			} else {
				reject(Error('Network Error'));
			}
		}

		req.onload = autolink_response_handler;
		req.send();
	})
}

var get_bookpage = function(book) {
	return Promise.retry(max_Retry, function(resolve, reject) {
		var search_response_handler = function(res) {
			var parser = new DOMParser();
			var htmlDoc = parser.parseFromString(res.target.response, "text/html");
			var autolink = htmlDoc.getElementById('autolink');
			if (res.target.status == 200) {
				// Resolve the promise with the response text
				if (autolink !== null) {
					resolve(normalsearch_promise(res));
				} else {
					console.log('no autolink');
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
}