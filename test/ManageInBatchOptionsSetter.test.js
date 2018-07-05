import LibHost from 'script/ManageInBatchOptionsSetter.js';
const chrome = require('sinon-chrome/extensions');
var sinon = require('sinon');
global.chrome = chrome;

// var sandbox = require('sinon').createSandbox();

describe("ManageInBatchOptionsSetter.js", () => {
  let libhost, target, locationstub;
  beforeEach(() => {
    libhost = new LibHost('http://163.26.71.106/toread/');

    locationstub = sinon.stub(libhost, "getlocation");
    locationstub.returns('http://163.26.71.106/toread/internaltranzit/manage_in_batch');
  })

  afterEach(() => {
    locationstub.restore();
  })


  it("should sent chromemessgae", () => {
    chrome.runtime.sendMessage.withArgs('oegakhbdmepmdfpeeanopebbglbfpgkp', { request: 'selects' }).yields({ selects: { status: 'lock', setting: { PropertySelection_0: 0, itemCurrentStatusSelection: 1 } } });
    const property0 = new DOMParser().parseFromString(`<select name="PropertySelection_0" id="PropertySelection_0">
      <option value="0" selected="selected"></option>
      <option value="1">不在OPAC上顯示</option>
      <option value="2">在OPAC上顯示</option>
      </select>`, 'text/html');

    const curele = new DOMParser().parseFromString(`<select name="itemCurrentStatusSelection" id="itemCurrentStatusSelection" style="width: 180px;">
      <option value="0" selected="selected"></option>
      <option value="1">在架</option>
      <option value="2">尋書未獲</option>
      <option value="3">採購處理中</option>
      <option value="4">移送編目</option>
      <option value="5">編目處理中</option>
      <option value="6">移送閱覽</option>
      <option value="7">流通處理中</option>
      <option value="8">此筆盤點</option>
      <option value="9">報廢中</option>
      <option value="10">報銷找回</option>
      <option value="11">重新歸架</option>
      <option value="12">展覽用書(可外借)</option>
      <option value="13">暫時不可提供</option>
      <option value="14">推薦書</option>
      <option value="15">破損</option>
      <option value="16">尋書中</option>
      <option value="17">修補中</option>
      <option value="18">巡迴書箱服務</option>
      <option value="19">展覽用書(不外借)</option>
      <option value="20">S8報廢中</option>
      <option value="21">S8預計報廢</option>
      <option value="22">S8盤點下落不明</option>
      </select>`, 'text/html');

    let getele = sinon.stub(document, "getElementById");
    getele.withArgs('PropertySelection_0').returns(property0);
    getele.withArgs('itemCurrentStatusSelection').returns(curele);

    libhost.ManageInBatchOptionsInit();

    expect(chrome.runtime.sendMessage.calledOnce).toBeTruthy();

    getele.restore();
  })


})