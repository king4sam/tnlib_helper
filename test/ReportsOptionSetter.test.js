import ReportsOptionSetter from 'script/ReportsOptionSetter.js';
const chrome = require('sinon-chrome/extensions');
var sinon = require('sinon');

// var sandbox = require('sinon').createSandbox();

describe("ReportsOptionSetter.js", () => {
  let libhost,selectList,selectstub,locationstub;

  beforeEach(function () {
    libhost = new ReportsOptionSetter('http://163.26.71.106/toread/');

    selectList = document.createElement('selects');
    [1,2,3,4,5].forEach(e=>{
      var option = document.createElement("option");
      option.value = e;
      option.text = e;
      selectList.appendChild(option);
    })

    selectstub = sinon.stub(document, "getElementById");
    selectstub.withArgs('PropertySelection_5').returns(selectList);
    selectstub.withArgs('PropertySelection_6').returns(selectList);
    selectstub.withArgs('PropertySelection_7').returns(selectList);
    selectstub.withArgs('PropertySelection_8').returns(selectList);

    locationstub = sinon.stub(libhost, "getlocation");
    locationstub.returns('http://163.26.71.106/toreadcirculation/exttransit/required_from_ext_transit');

  });

  afterEach(()=>{
    selectstub.restore();
    locationstub.restore();
  })


  it("should set selectedIndex on ExttransitReport", () => {
    libhost.setExttransitReportsOptions();
    expect(selectstub.callCount).toBe(3);
  });

  it("should set selectedIndex on SearchReport", () => {
    libhost.setSearchReportsOptions();
    expect(selectstub.callCount).toBe(2);
  });

})