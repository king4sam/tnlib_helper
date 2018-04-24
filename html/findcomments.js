document.getElementById('closebtn1').addEventListener('click', function() { window.close() });
document.getElementById('fileConfirm-btn1').addEventListener('click', file_viewer_load1);

function file_viewer_load1(event) {
	document.getElementById('fileForUpload')
	var file = document.getElementById('fileForUpload1').files[0]
	if (file) {
		document.getElementById('fileForUpload1')
		var reader = new FileReader();
		reader.readAsText(file, "big5");
		reader.onload = function(evt) {
			var arys = Papa.parse(evt.target.result)
			var results = arys.data.slice(6).map(function(e) { return [e[6],e[8]] }).filter(function(e){return e[0] !== undefined  && e[0].length !== 0});
			Promise.all(
			// Map our array of chapter urls to
			// an array of chapter json promises
				results.map(function(e){
					return get(e)
				})
			).then(function(results){
				console.log('getdone');
				// return Promise.all(
				return Promise.all(
					results.map(function(page) {
						var parser = new DOMParser();
						var htmlDoc =parser.parseFromString(page.response, "text/html");
						var link = htmlDoc.getElementById('autolink').href;
						return getlc('http:\/\/163.26.71.106\/webpac\/' + link.substring(57),page.book);
					})
				);
			}).then(function(pages){
				console.log('getlcdone');
				return Promise.all(
					pages.map(function(page) {
						var parser = new DOMParser();
						var htmlDoc =parser.parseFromString(page.response, "text/html");
						if(htmlDoc.getElementById("holdingLocations") === null){
							console.log('err' + page.responseURL);
						}
						else{
							var holdingLocations = htmlDoc.getElementById("holdingLocations");
							var vals = Array.apply(null, holdingLocations).filter( e=> e.innerText.includes('安定') );
							var lc = vals[0].value
							return getcomments(page.responseURL + '&lc=' + lc, page.book);
						}
					})
				)
			}).then(function(pages){
				pages.forEach(function(page){
					var parser = new DOMParser();
					var htmlDoc =parser.parseFromString(page.response, "text/html");
					// console.log(htmlDoc.querySelector('#rdk_content_1 >table > tbody > tr'));
					var tr =  Array.apply(null, htmlDoc.querySelectorAll('#rdk_content_1 >table > tbody > tr')).filter(function(e){return e.children[0].innerText.trim() == page.book[0]});
					if(tr.length == 0){
						console.log('ERR ' + page.responseURL);
					}
					else if(tr[0].children[8].innerText.trim().length > 0){
						$('#commenttable>tbody tr:last').after('<tr><th scope="row">'+page.book[0]+'</th><td>'+page.book[1]+'</td><td>'+tr[0].children[8].innerText.trim()+'</td></tr>')
						// document.getElementById("fileContents1").innerHTML = document.getElementById("fileContents1").innerHTML + tr[0].children[0].innerText.trim() + tr[0].children[8].innerText.trim() + '</br>';
					}
					
				});	
				document.getElementById('fileConfirm-btn1').remove();
				document.getElementById('fileForUpload1').remove();
				document.getElementById('closebtn1').style.display = 'inline';
				document.getElementById('commenttable').style.display = 'inline';
			});
		}
		reader.onerror = function(evt) {
			document.getElementById("fileContents").innerHTML = "上傳失敗";
		}
	}
}

function getcomments(url,book) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.setRequestHeader('Accept','	text/html')
    req.book = book;

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      var parser = new DOMParser();
	  var htmlDoc =parser.parseFromString(req.response, "text/html");
      if (req.status == 200 ) {
      	var tr =  Array.apply(null, htmlDoc.querySelectorAll('#rdk_content_1 >table > tbody > tr'));//.filter(function(e){return e.children[0].innerText.trim() == req.book[0]});
      	if(tr.length !== 0){
			resolve(req);
		}
		else{
	        resolve(getcomments(url, book))
	    }
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error('Network Error'));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

function getlc(url,book) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.setRequestHeader('Accept','	text/html')
    req.book =  book;

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      var parser = new DOMParser();
	  var htmlDoc =parser.parseFromString(req.response, "text/html");
      if (req.status == 200 ) {
      	if(htmlDoc.getElementById("holdingLocations") !== null){
			resolve(req);
		}
		else{
			console.log('nolocation');
	        resolve(getlc(url, book))
	    }
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error('Network Error'));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

function get(book) {
  const host = 'http:\/\/163.26.71.106\/';
  const search = 'webpac\/search.cfm'
  const par1 = '?m=ss&k0=';
  const par2 = '&t0=k&c0=and';
  // var book = book;
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.book = book;
    req.open('GET', host + search + par1 + book[0] + par2);
    req.setRequestHeader('Accept','	text/html')
    

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      var parser = new DOMParser();
	  var htmlDoc =parser.parseFromString(req.response, "text/html");
	  var autolink = htmlDoc.getElementById('autolink');
      if (req.status == 200 ) {
      	// console.log('200')
        // Resolve the promise with the response text
        if(autolink !== null){
        	resolve(req);	
        }
        else{
        	// console.log(url);
        	console.log('noautolink');
        	resolve(get(book))
        }
        
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error('Network Error'));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

