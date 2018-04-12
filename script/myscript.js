'use strict';
document.addEventListener("keydown",keydowne);

function keydowne(event){
	var x = event.which || event.keyCode;
	switch(x){
		case 67://c
			//TransitItemsToBeReceived
			if($('#closemeplease')[0] !== undefined){
				event.preventDefault();
				event.stopPropagation();
				alert('closemeplease');
				$('#closemeplease')[0].click();
			}
			//close print
			else if($('#closeHoldSlipPrint')[0] !== undefined ){
				event.preventDefault();
				$('#closeHoldSlipPrint')[0].click();
			}

			//attached fined
			else if($('#content-buttons a')[1] !== undefined){
				event.preventDefault();
				$('#content-buttons a')[1].click();
			}
			//preserved
			else if($('#HoldsListDialog_content a')[0] !== undefined){
				event.preventDefault();
				$('#HoldsListDialog_content a')[0].click();
			}
			//origin
			else if($('#TinreadMessageDialog_content a')[0] !== undefined){
				event.preventDefault();
				$('#TinreadMessageDialog_content a')[0].click();
			}
			break;
		case 89://y
			//attached fined
			if($('#content-buttons a')[0] !== undefined){
				event.preventDefault();
				$('#content-buttons a')[0].click();
				document.getElementById("itemNumberField").value = '';
			}
			break;
		case 80://p
			if($('#HoldSlipDialog_content a')[0] !== undefined){
				event.preventDefault();
				$('#HoldSlipDialog_content a')[0].click();
				document.getElementById("itemNumberField").value = '';
			}
			break;
		case 221://]
			if(document.getElementById("cardNumberField") ){
				event.preventDefault();
				document.getElementById("cardNumberField").focus();
			}
			break;
		case 222://'
			event.preventDefault();
			window.location = '/toread/circulation/pages/loan_desk';
			break;
	}
}

//add close button to 
//TransitItemsToBeReceived popup windows
var patt = new RegExp('http:\/\/163\.26\.71\.107\/toread\/circulation\/exttransit\/TransitItemsToBeReceived,popupComponent.*');
console.log('whether url match?' + patt.test(location.href));
if(patt.test(location.href)){
	var t = document.createElement('a');
	t.id = 'closemeplease';
	t.classList.add("dialog")
	t.appendChild(document.createTextNode("close"));
	t.onclick = function(e){window.close()};
	$('table tr td').append(t);
}