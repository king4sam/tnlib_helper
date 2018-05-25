'use strict';

var host = 'http:\/\/163\.26\.71\.107\/toread\/';

(function(document) {
	let seletcObserver;
	var manage_in_batch = new RegExp(host + 'internaltranzit\/manage_in_batch*');
	if (manage_in_batch.test(location.href)) {
		chrome.storage.local.get("selects", function(results) {
			if (chrome.runtime.lastError || undefined === results['selects']) {
				console.log('no selects');
			} else if (results['selects']['status'] === 'lock') {
				console.log("lock");
				document.getElementById("PropertySelection_0").value = results['selects']['setting']['PropertySelection_0'];
				document.getElementById("itemCurrentStatusSelection").value = results['selects']['setting']['itemCurrentStatusSelection']
			} else {
				console.log('release');
			}
		});

		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
				console.log(sender.tab ?
					"from a content script:" + sender.tab.url :
					"from the extension");
				var setselect = function(cursta, proper) {
					return function(records) {
						$('#itemCurrentStatusSelection')[0].value = cursta;
						$('#PropertySelection_0')[0].value = proper;
					}
				};

				var obtarget = document.getElementById('HiddenBrowse');
				if (request.query == "selects") {
					console.log("selects");
					var arys = []
					arys.push(document.getElementById("itemCurrentStatusSelection").outerHTML);
					arys.push(document.getElementById("PropertySelection_0").outerHTML);
					sendResponse({ selects: arys });
				} else if (request.query == "lock") {
					if (seletcObserver !== undefined)
						seletcObserver.disconnect();
					seletcObserver = new MutationObserver(
						setselect(request.setting.itemCurrentStatusSelection, request.setting.PropertySelection_0)
					)
					document.getElementById("PropertySelection_0").value = request.setting.PropertySelection_0;
					document.getElementById("itemCurrentStatusSelection").value = request.setting.itemCurrentStatusSelection;
					seletcObserver.observe(obtarget, { 'childList': true });
					console.log("lock");
					console.log(request.setting);
					sendResponse({ status: "OK" });
				} else if (request.query == "release") {
					if (seletcObserver !== undefined)
						seletcObserver.disconnect();
					document.getElementById("PropertySelection_0").value = 0;
					document.getElementById("itemCurrentStatusSelection").value = 0;
					console.log("release");
					sendResponse({ status: "OK" });
				}
			}
		);
	}
}(document));

(function(document) {
	chrome.storage.local.get("hotkeys", function(results) {
		var namecodemap;
		if (chrome.runtime.lastError || undefined === results['hotkeys']) {} else {
			namecodemap = results['hotkeys'];
		}
		$(document).keypress(keydowne);

		function keydowne(event) {
			var x = event.which;
			if (x >= 65 && x <= 90) {
				x += 32;
			}
			console.log(x);
			var closeaction = function() {
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
			}
			var yesaction = function() {
				//attached fined
				if ($('#content-buttons a')[0] !== undefined) {
					event.preventDefault();
					$('#content-buttons a')[0].click();
					document.getElementById("itemNumberField").value = '';
				}
			}
			var printaction = function() {
				if ($('#HoldSlipDialog_content a')[0] !== undefined) {
					event.preventDefault();
					$('#HoldSlipDialog_content a')[0].click();
					document.getElementById("itemNumberField").value = '';
				}
			}
			var cardNumberFieldaction = function() {
				if (document.getElementById("cardNumberField")) {
					event.preventDefault();
					document.getElementById("cardNumberField").focus();
				}
			}
			var loan_deskaction = function() {
				event.preventDefault();
				window.location = '/toread/circulation/pages/loan_desk';
			}
			var TransitItemsToBesendaction = function() {
				var TransitItemsToBesend = new RegExp(host + 'circulation\/exttransit\/transit_items_to_send');
				if (TransitItemsToBesend.test(location.href)) {
					$('#TransferOperation > a')[1].click();
				} else {
					window.location = '/toread/circulation/exttransit/transit_items_to_send';
				}
				event.preventDefault();
			}
			var managecloseaction = function() {
				if ($('#closePopupTop')[0] !== undefined) {
					$('#closePopupTop')[0].click();
				}
			}

			var keyconbinations = [
				{ name: "取消、關閉、否", action: closeaction },
				{ name: "是、確定", action: yesaction },
				{ name: "列印", action: printaction },
				{ name: "聚焦證號欄", action: cardNumberFieldaction },
				{ name: "借還書作業", action: loan_deskaction },
				{ name: "移轉寄送", action: TransitItemsToBesendaction },
			]
			var targetname = namecodemap.find(e => { return e.code === x });
			console.log(targetname);
			if (targetname) {
				var targetaction = keyconbinations.find(e => { return e.name === targetname.name });
				if (targetaction) {
					targetaction.action();
				}
			}
		}
	});
}(document));

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
		var AssignedReportsObserver = new MutationObserver(AssignedReportsSetDefault);
		AssignedReportsObserver.observe(document.getElementById('AssignedReports'), { 'subtree': true, 'childList': true, 'characterData': true });
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
		var AssignedReportsObserver = new MutationObserver(AssignedReportsSetDefault);
		AssignedReportsObserver.observe(document.getElementById('AssignedReports'), { 'subtree': true, 'childList': true, 'characterData': true });
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
		var PatronObserver = new MutationObserver(add_row_of_borrowcount);
		var TransactionsObserver = new MutationObserver(modify_borrowcount);
		PatronObserver.observe(document.getElementById('PatronItemDetails'), { 'childList': true, 'characterData': true });
		TransactionsObserver.observe(document.getElementById('TransactionsContent'), { 'subtree': true, 'childList': true, 'characterData': true });
	}
}(document, location, $));

// print view modify
(function(document, $) {
	console.log('hi');
	var modify_printview = function(records) {
		console.log('yo');
		if ($('#HoldSlipPrintContent').length !== 0) {
			console.log($('#HoldSlipPrintContent'));
			$('#HoldSlipPrintContent > p:nth-child(2) > span').css('font-size', "large");
			$('#HoldSlipPrintContent strong').css('font-size', "small");
			$('#HoldSlipPrintContent')[0].innerHTML = $('#HoldSlipPrintContent')[0].innerHTML.replace(/<br.*>(\s*<br>)*/g, "<br>");
			$('#HoldSlipPrintContent')[0].innerHTML = $('#HoldSlipPrintContent')[0].innerHTML.replace(/<p>&nbsp;<\/p>/g, "");
			$('#HoldSlipPrintContent > p:nth-child(2)').css('line-height', '1.9em');
			$('#HoldSlipPrintContent > p:nth-child(2) > span:nth-child(2)').remove();
		}
	};
	var PrintContentObserver = new MutationObserver(modify_printview);
	var obtarget = document.getElementById('TransactionsContent') || document.getElementById('TransactionsDesk');
	if (null !== obtarget) {
		PrintContentObserver.observe(obtarget, { 'childList': true });
	}
}(document, $))