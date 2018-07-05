import LibHost from 'script/PopupPrintCloseAdder.js';
const chrome = require('sinon-chrome/extensions');
var sinon = require('sinon');

// var sandbox = require('sinon').createSandbox();

describe("PopupPrintCloseAdder.js", () => {
  let libhost, target, querySelectorstub, locationstub;
  beforeEach(() => {
    libhost = new LibHost('http://163.26.71.106/toread/');

    target = document.createElement('td');

    querySelectorstub = sinon.stub(document, "querySelector");
    querySelectorstub.withArgs('table tr td').returns(target);

    locationstub = sinon.stub(libhost, "getlocation");
    locationstub.returns('http://163.26.71.106/toread/circulation/exttransit/TransitItemsToBeReceived,popupComponent.hiddenPopupButton.html');
  })

  afterEach(() => {
    querySelectorstub.restore();
    locationstub.restore();
  })

  it("should add close button", () => {
    libhost.addCloseButton();

    expect(querySelectorstub.calledOnce).toBeTruthy()
  });

})