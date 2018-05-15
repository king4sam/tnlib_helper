chrome.storage.local.get("reservedbooks", function(items) {
	if (chrome.runtime.lastError) {
		console.log('no reservedbooks')
	} else {

		function reqListener(req) {
			let index = req.target.index;
			var regex = /(條碼：(.+))，/g;
			const BarcodeGroupNumber = 2;
			const IndexofCheckcol = 7;
			const statuscol = 3;
			var matches;
			var anding = /^ED\d{7}/g;
			var barcodes = [];
			var popover_content_ary = [];
			var trs = $("table[class='tab1'] tr").toArray().slice(1, -1);
			while ((matches = regex.exec(this.responseText)) !== null) {
				// This is necessary to avoid infinite loops with zero-width matches
				if (matches.index === regex.lastIndex) {
					regex.lastIndex++;
				}
				//if the books was arrived, hightlight the row in table
				barcodes.push(matches[BarcodeGroupNumber])
			}
			var bookrequests= barcodes.map(function(barcode){
				return get_bookpage([barcode]);
			});
			Promise.all(bookrequests)
			.then(function(ress){
				var popover_content_ary = [];
				console.log(ress);
				var found_pages = ress.filter(p=>{return p !== 'booknotfound' && p !== 'errpage'});
				console.log(found_pages);
				found_pages.forEach(e=>{
					console.log(e);
					var barcode = e.book[0];
					var htmlDoc = new DOMParser().parseFromString(e.response, "text/html");
					var tr = Array.apply(null, htmlDoc.querySelectorAll('#rdk_content_1 >table > tbody > tr'))
					.filter(function(tr) {
						return tr.children[0].innerText.trim() == e.book[0] 
					});
					var bookname = htmlDoc.getElementsByTagName('h2')[1].innerText.slice(0, -1).trim();
					if (anding.test(barcode)){
						if (tr.length !== 0 && tr[0].children[statuscol].innerText.trim() == '在架') {
							popover_content_ary.push({ 'bookname': bookname, 'barcode': barcode, 'status': '在架' });
						}
						else{
							popover_content_ary.push({ 'bookname': bookname, 'barcode': barcode, 'status': '未到' });
						}
					}
					else{
						if (tr.length !== 0 && tr[0].children[statuscol].innerText.trim() == '預約保留') {
							popover_content_ary.push({ 'bookname': bookname, 'barcode': barcode, 'status': '預約保留' });
						}
						else {
							popover_content_ary.push({ 'bookname': bookname, 'barcode': barcode, 'status': '未到' });	
						}
					}
				})
				return popover_content_ary;
			})
			.then(function(popover_content_ary){
				if (popover_content_ary.filter(function(e){
					return e['status'] !== '未到';
				}).length > 0) {
					console.log(trs);
					console.log(index);
					trs[index].children[IndexofCheckcol-1].style.backgroundColor = '#fbff0075';
				}
				var tdele = trs[index].children[IndexofCheckcol-1];
				$(tdele).popover({
					toggle: 'popover',
					html: true,
					trigger: 'click',
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
			})
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
