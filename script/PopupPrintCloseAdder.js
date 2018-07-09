import LibHost from './LibHost.js';

// add close button to
// TransitItemsToBeReceived popup windows
export default class PopupPrintCloseAdder extends LibHost {
  constructor(host) {
    super(host);
    this.popupprint = 'circulation/exttransit/TransitItemsToBeReceived,popupComponent.*';
  }

  addCloseButton() {
    const TransitItemsToBeReceived = new RegExp(this.popupprint);
    if (TransitItemsToBeReceived.test(this.getlocation())) {
      const closebtn = document.createElement('a');
      closebtn.id = 'closemeplease';
      closebtn.classList.add('dialog');
      closebtn.appendChild(document.createTextNode('close'));
      closebtn.onclick = function () { window.close(); };
      document.querySelector('table tr td').append(closebtn);
    }
  }
}
