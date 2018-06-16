import LibHost from './LibHost.js';

// add close button to
// TransitItemsToBeReceived popup windows
export default class PopupPrintCloseAdder extends LibHost {
  constructor(host) {
    super(host);
    this.popupprint = 'circulation/exttransit/TransitItemsToBeReceived,popupComponent.*';
  }

  addCloseButton() {
    const TransitItemsToBeReceived = new RegExp(this.host + this.popupprint);
    if (TransitItemsToBeReceived.test(window.location.href)) {
      const closebtn = document.createElement('a');
      closebtn.id = 'closemeplease';
      closebtn.classList.add('dialog');
      closebtn.appendChild(document.createTextNode('close'));
      closebtn.onclick = function () { window.close(); };
      $('table tr td').append(closebtn);
    }
  }
}
