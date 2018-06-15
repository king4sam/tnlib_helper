import LibHost from './LibHost.js';

//add close button to 
//TransitItemsToBeReceived popup windows
export default class PopupPrintCloseAdder extends LibHost{
	constructor(host){
		super(host);
		this.popupprint = 'circulation\/exttransit\/TransitItemsToBeReceived,popupComponent.*';
	};

	addCloseButton(){
		var TransitItemsToBeReceived = new RegExp(this.host + this.popupprint);
		if (TransitItemsToBeReceived.test(location.href)) {
			var closebtn = document.createElement('a');
			closebtn.id = 'closemeplease';
			closebtn.classList.add("dialog")
			closebtn.appendChild(document.createTextNode("close"));
			closebtn.onclick = function(e) { window.close() };
			$('table tr td').append(closebtn);
		}
	}
}