'use strict';

document.addEventListener("keydown", keydowne, true);
var host = 'http:\/\/163\.26\.71\.107\/toread\/';

function keydowne(event) {
	var x = event.which || event.keyCode;
	switch (x) {
		case 67: //c
			//TransitItemsToBeReceived
			if ($('#closemeplease')[0] !== undefined) {
				event.preventDefault();
				$('#closemeplease')[0].click();
			}
			//close print
			else if ($('#closeHoldSlipPrint')[0] !== undefined) {
				event.preventDefault();
				$('#closeHoldSlipPrint')[0].click();
			}

			//attached fined
			else if ($('#content-buttons a')[1] !== undefined) {
				event.preventDefault();
				$('#content-buttons a')[1].click();
			}
			//preserved
			else if ($('#HoldsListDialog_content a')[0] !== undefined) {
				event.preventDefault();
				$('#HoldsListDialog_content a')[0].click();
			}
			//origin
			else if ($('#TinreadMessageDialog_content a')[0] !== undefined) {
				event.preventDefault();
				$('#TinreadMessageDialog_content a')[0].click();
			}
			break;
		case 89: //y
			//attached fined
			if ($('#content-buttons a')[0] !== undefined) {
				event.preventDefault();
				$('#content-buttons a')[0].click();
				document.getElementById("itemNumberField").value = '';
			}
			break;
		case 80: //p
			if ($('#HoldSlipDialog_content a')[0] !== undefined) {
				event.preventDefault();
				$('#HoldSlipDialog_content a')[0].click();
				document.getElementById("itemNumberField").value = '';
			}
			break;
		case 88: //x
			if ($('#closePopupTop')[0] !== undefined) {
				$('#closePopupTop')[0].click();
			}
			break;
		case 221: //]
			if (document.getElementById("cardNumberField")) {
				event.preventDefault();
				document.getElementById("cardNumberField").focus();
			}
			break;
		case 222: //'
			event.preventDefault();
			window.location = '/toread/circulation/pages/loan_desk';
			break;
		case 186: //;
			var TransitItemsToBesend = new RegExp(host + 'circulation\/exttransit\/transit_items_to_send');
			if (TransitItemsToBesend.test(location.href)) {
				$('#TransferOperation > a')[1].click();
			}
			else{
				window.location = '/toread/circulation/exttransit/transit_items_to_send';	
			}
			event.preventDefault();
			break;
	}
}

//add close button to 
//TransitItemsToBeReceived popup windows
(function(document) {
	var TransitItemsToBeReceived = new RegExp(host + 'circulation\/exttransit\/TransitItemsToBeReceived,popupComponent.*');
	if (TransitItemsToBeReceived.test(location.href)) {
		var closebtn = document.createElement('a');
		closebtn.id = 'closemeplease';
		closebtn.classList.add("dialog")
		closebtn.appendChild(document.createTextNode("close"));
		closebtn.onclick = function(e) { window.close() };
		$('table tr td').append(closebtn);
	}
}(document));

//AssignedReports
//select default value setup
(function(document) {
	function AssignedReportsSetDefault() {
		try {
			document.getElementById('PropertySelection_6').selectedIndex = '1';
			document.getElementById('PropertySelection_7').selectedIndex = '2';
		} catch (e) {
			console.log('no AssignedReports');
		}
	}
	var exttransit_url = new RegExp(host + 'circulation\/exttransit\/required_from_ext_transit*');
	if (exttransit_url.test(location.href) && document.getElementById('AssignedReports') !== null) {
		var AssignedReportsObserber = new MutationObserver(AssignedReportsSetDefault);
		AssignedReportsObserber.observe(document.getElementById('AssignedReports'), { 'subtree': true, 'childList': true, 'characterData': true });
	}
}(document));

//search_transactionsReports
//select default value setup
(function(document) {
	function AssignedReportsSetDefault() {
		try {
			document.getElementById('PropertySelection_7').selectedIndex = '1';
			document.getElementById('PropertySelection_8').selectedIndex = '2';
		} catch (e) {
			console.log('no AssignedReports');
		}
	}
	var exttransit_url = new RegExp(host + 'circulation\/pages\/search_transactions*');
	if (exttransit_url.test(location.href) && document.getElementById('AssignedReports') !== null) {
		var AssignedReportsObserber = new MutationObserver(AssignedReportsSetDefault);
		AssignedReportsObserber.observe(document.getElementById('AssignedReports'), { 'subtree': true, 'childList': true, 'characterData': true });
	}
}(document));

//add today borrow count field
// in PatronDetails
(function(document, location, $) {
	var loan_desk_url = new RegExp(host + 'circulation\/pages\/loan_desk*');
	if (loan_desk_url.test(location.href)) {
		document.borrowcount = function(e) {
			//fetch records of book
			var a = $('#If_43 tr').toArray();
			a.shift();

			var now = new Date();

			function sameday(a, b) {
				return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
			}

			function Sum(total, num) {
				return total + num;
			}

			function istoday(e) {
				var t = new Date(e.children[9].innerText);
				return sameday(t, now) === true ? 1 : 0;
			}

			return a.map(istoday).reduce(Sum, 0);
		};

		var add_row_of_borrowcount = function(records) {
			var position_of_borrowcount = '#viewPatronDetailsComponent> tbody> tr> td >table >tbody> tr> td >table >tbody:last-child';
			var reader = $(position_of_borrowcount)
			if (reader.length !== 0) {
				reader.append(
					'<tr id = "todayborrowcount"><td><b>今日借書:</b>' +
					'<font color="#2952A3" style="font-weight: bold;">' +
					document.borrowcount() +
					'</font></td></tr>'
				);
			}
		};

		var modify_borrowcount = function(records) {
			$('#todayborrowcount font').innerText = document.borrowcount();
		};

		//listen to panel change
		var PatronObserber = new MutationObserver(add_row_of_borrowcount);
		var TransactionsObserber = new MutationObserver(modify_borrowcount);
		PatronObserber.observe(document.getElementById('PatronItemDetails'), { 'childList': true, 'characterData': true });
		TransactionsObserber.observe(document.getElementById('TransactionsContent'), { 'subtree': true, 'childList': true, 'characterData': true });
	}
}(document, location, $));

// print view modify
(function(document, $){
	console.log('hi');
	var modify_printview = function(records) {
		console.log('yo');
		if($('#HoldSlipPrintContent').length !== 0){
			console.log('change');
			$('#HoldSlipPrintContent > p:nth-child(2) > span').css('font-size', "large");
			$('#HoldSlipPrintContent strong').css('font-size', "medium");
			$('#HoldSlipPrintContent')[0].innerHTML = $('#HoldSlipPrintContent')[0].innerHTML.replace(/<br>\s*<br>/g, "<br>")
			$('#HoldSlipPrintContent > p:nth-child(2)').css('line-height', '2em')
			$('#HoldSlipPrintContent > p:nth-child(2)')[0].innerHTML = $('#HoldSlipPrintContent > p:nth-child(2)')[0].innerHTML.replace(/<span/g, "<div").replace(/<\/span/g, "<\/div");
			$('#HoldSlipPrintContent > p:nth-child(2) > br').remove();
		}
	};
	var PrintContentObserber = new MutationObserver(modify_printview);
	var obtarget = document.getElementById('TransactionsContent') || document.getElementById('TransactionsDesk');
	PrintContentObserber.observe(obtarget, {'childList': true});
}(document, $))
