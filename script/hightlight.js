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
			var popover_content_ary = [];
			var trs = $("table[class='tab1'] tr").toArray().slice(1, -1);
			while ((matches = regex.exec(this.responseText)) !== null) {
				// This is necessary to avoid infinite loops with zero-width matches
				if (matches.index === regex.lastIndex) {
					regex.lastIndex++;
				}

				//if the books was arrived, hightlight the row in table
				var barcode = matches[BarcodeGroupNumber];

				if (items['reservedbooks'].indexOf(barcode) !== -1) {
					// popover_content_ary.push({'barcode' : barcode, 'status': '預約保留'});
					get_bookpage([barcode])
						.then(function(page) {
							var parser = new DOMParser();
							var htmlDoc = parser.parseFromString(page.response, "text/html");
							var bookname = htmlDoc.getElementsByTagName('h2')[1].innerText.slice(0, -1).trim();
							popover_content_ary.push({ 'bookname': bookname, 'barcode': barcode, 'status': '預約保留' });
							console.log('預約保留');
						});
				} else if (anding.test(barcode)) {
					console.log('hay ED');
					get_bookpage([barcode])
						.then(function(page) {
							var parser = new DOMParser();
							var htmlDoc = parser.parseFromString(page.response, "text/html");
							var tr = Array.apply(null, htmlDoc.querySelectorAll('#rdk_content_1 >table > tbody > tr')).filter(function(e) { return e.children[0].innerText.trim() == page.book[0] });
							var bookname = htmlDoc.getElementsByTagName('h2')[1].innerText.slice(0, -1).trim();
							console.log('bookname' + bookname);
							if (tr.length !== 0 && tr[0].children[statuscol].innerText.trim() == '在架') {
								popover_content_ary.push({ 'bookname': bookname, 'barcode': barcode, 'status': '在架' });
								console.log('在架');
							}
						});
				}
			}

			if (popover_content_ary.length > 0) {
				trs[req.target.index].children[IndexofCheckcol].style.backgroundColor = '#fbff0075';
				var tdele = trs[req.target.index].children[IndexofCheckcol]
				$(tdele).popover({
					toggle: 'popover',
					html: true,
					trigger: 'hover',
					container: 'body',
					placement: 'bottom',
					content: function() {
						return '<table>' + 
						popover_content_ary.reduce(function(a, c) { 
							return a + "<tr><td>" + c['bookname'] + '</td><td>' + c['barcode'] + "</td><td>" + c['status'] + "</td></tr>" }
							, "") 
						+ '</table>';
					}
				});
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