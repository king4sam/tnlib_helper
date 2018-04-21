chrome.storage.sync.get("reservedbooks", function(items) {
	if (chrome.runtime.lastError) {
		console.log('no reservedbooks')
	} else {
		function reqListener() {
			var regex = /(條碼：(.+))，/g;
			const BarcodeGroupNumber = 2;
			const IndexofCheckcol = 7;
			var matches;
			while ((matches = regex.exec(this.responseText)) !== null) {
				// This is necessary to avoid infinite loops with zero-width matches
				if (matches.index === regex.lastIndex) {
					regex.lastIndex++;
				}

				//if the books was arrived, hightlight the row in table
				var barcode = matches[BarcodeGroupNumber];
				if (items['reservedbooks'].indexOf(barcode) !== -1) {
					var trs = $("table[class='tab1'] tr").toArray().slice(1, -1);
					trs[this.index].children[IndexofCheckcol].style.backgroundColor = '#fbff0075';
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
			xhr.addEventListener("load", reqListener);
			xhr.send();
		});
	}
});