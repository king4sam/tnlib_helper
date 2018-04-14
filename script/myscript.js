'use strict';
document.addEventListener("keydown",keydowne,true);

function keydowne(event){
	var x = event.which || event.keyCode;
	switch(x){
		case 67://c
			//TransitItemsToBeReceived
			if($('#closemeplease')[0] !== undefined){
				event.preventDefault();
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
		case 88://x
			if($('#closePopupTop')[0] !== undefined){
				$('#closePopupTop')[0].click();
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
(function(document){
	var TransitItemsToBeReceived = new RegExp('http:\/\/163\.26\.71\.107\/toread\/circulation\/exttransit\/TransitItemsToBeReceived,popupComponent.*');
	if(TransitItemsToBeReceived.test(location.href)){
		var closebtn = document.createElement('a');
		closebtn.id = 'closemeplease';
		closebtn.classList.add("dialog")
		closebtn.appendChild(document.createTextNode("close"));
		closebtn.onclick = function(e){window.close()};
		$('table tr td').append(closebtn);
	}
}(document));
