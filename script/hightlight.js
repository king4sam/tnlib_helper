chrome.storage.sync.get("reservedbooks", function(items) {
	if (chrome.runtime.lastError) {
		console.log('no reservedbooks')
	} else {
		function reqListener(req) {
			var regex = /(條碼：(.+))，/g;
			const BarcodeGroupNumber = 2;
			const IndexofCheckcol = 7;
			const statuscol = 3;
			var matches;
			var anding = /^ED\d{7}/g;
			while ((matches = regex.exec(this.responseText)) !== null) {
				// This is necessary to avoid infinite loops with zero-width matches
				if (matches.index === regex.lastIndex) {
					regex.lastIndex++;
				}

				//if the books was arrived, hightlight the row in table
				var barcode = matches[BarcodeGroupNumber];
				var trs = $("table[class='tab1'] tr").toArray().slice(1, -1);
				if (items['reservedbooks'].indexOf(barcode) !== -1) {
					trs[req.target.index].children[IndexofCheckcol].style.backgroundColor = '#fbff0075';
				}else if(anding.test(barcode)){
					console.log('hay ED');
					get_bookpage([barcode],'')
					.then(function(page){
						var parser = new DOMParser();
						var htmlDoc =parser.parseFromString(page.response, "text/html");
						var tr =  Array.apply(null, htmlDoc.querySelectorAll('#rdk_content_1 >table > tbody > tr')).filter(function(e){return e.children[0].innerText.trim() == page.book[0]});
						if(tr.length !== 0 && tr[0].children[statuscol].innerText.trim() == '在架'){
							trs[req.target.index].children[IndexofCheckcol].style.backgroundColor = '#fbff0075';
						}
					});
				}
			}
		}

		//parse urls for reservations
		var urls = $('table[class=tab1] tr td a').toArray().slice(0, -4).map(function(e) { return e.href });

		//fetch page to get barcode of books
		urls.forEach(function(e, i) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', e);
			xhr.index = i;
			xhr.withCredentials = true;
			xhr.onload = reqListener;
			xhr.send();
		});
	}
});