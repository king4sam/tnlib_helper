'use strict';
document.addEventListener("keydown",keydowne,true);

function cleartext(){
	$('input[type=text]').each(function(a,e){e.value = ''});
}

function keydowne(event){
	var x = event.which || event.keyCode;
	switch(x){
		case 67://c
			//TransitItemsToBeReceived
			if($('#closemeplease')[0] !== undefined){
				event.preventDefault();
				// event.stopPropagation();
				alert('closemeplease');
				$('#closemeplease')[0].click();
				// cleartext();
			}
			//close print
			else if($('#closeHoldSlipPrint')[0] !== undefined ){
				event.preventDefault();
				// event.stopPropagation();
				$('#closeHoldSlipPrint')[0].click();
				// cleartext();
			}

			//attached fined
			else if($('#content-buttons a')[1] !== undefined){
				event.preventDefault();
				// event.stopPropagation();
				$('#content-buttons a')[1].click();
				// cleartext();
			}
			//preserved
			else if($('#HoldsListDialog_content a')[0] !== undefined){
				event.preventDefault();
				// event.stopPropagation();
				$('#HoldsListDialog_content a')[0].click();
				// cleartext();
			}
			//origin
			else if($('#TinreadMessageDialog_content a')[0] !== undefined){
				event.preventDefault();
				// event.stopPropagation();
				$('#TinreadMessageDialog_content a')[0].click();
				// cleartext();
			}
			break;
		case 89://y
			//attached fined
			if($('#content-buttons a')[0] !== undefined){
				event.preventDefault();
				// event.stopPropagation();
				$('#content-buttons a')[0].click();
				document.getElementById("itemNumberField").value = '';
				// cleartext();
			}
			break;
		case 80://p
			if($('#HoldSlipDialog_content a')[0] !== undefined){
				event.preventDefault();
				// event.stopPropagation();
				$('#HoldSlipDialog_content a')[0].click();
				document.getElementById("itemNumberField").value = '';
				// cleartext();
			}
			break;
		case 221://]
			if(document.getElementById("cardNumberField") ){
				event.preventDefault();
				// event.stopPropagation();
				document.getElementById("cardNumberField").focus();
				// cleartext();
			}
			break;
		case 222://'
			event.preventDefault();
				// event.stopPropagation();
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