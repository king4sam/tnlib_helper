const host = 'http://163.26.71.106/toread/';

const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;

const extensionid = document.createElement('div');
extensionid.id = 'extensionid';
extensionid.style.display = "none";
extensionid.append(document.createTextNode(chrome.runtime.id));
head.insertBefore(extensionid,head.lastChild);

const script = document.createElement('script');
script.setAttribute('type', 'module');
script.setAttribute('src', chrome.extension.getURL('./script/main.js'));
head.insertBefore(script, head.lastChild);


const toread = new RegExp(`/toread/`);
if (toread.test(window.location.href)) {
  var jq = document.createElement('script');
  jq.src = 'http://code.jquery.com/jquery-3.3.1.min.js';
  jq.type = 'text/javascript';
  document.getElementsByTagName('head')[0].appendChild(jq);
}


(function(document) {
  chrome.storage.sync.get('hotkeys', (results) => {
    let namecodemap;
    if (chrome.runtime.lastError || undefined === results.hotkeys) {
      console.log('storage err');
    } else {
      namecodemap = results.hotkeys;
    }

    function keydowne(event) {
      let x = event.which;
      if (x >= 65 && x <= 90) {
        x += 32;
      }
      const closeaction = function() {
        if ($('#closemeplease')[0] !== undefined) {
          event.preventDefault();
          $('#closemeplease')[0].click();
        } else if ($('#closeHoldSlipPrint')[0] !== undefined) { // close print
          event.preventDefault();
          $('#closeHoldSlipPrint')[0].click();
        } else if ($('#content-buttons a')[1] !== undefined) { // attached fined
          event.preventDefault();
          $('#content-buttons a')[1].click();
        } else if ($('#HoldsListDialog_content a')[0] !== undefined) { // preserved
          event.preventDefault();
          $('#HoldsListDialog_content a')[0].click();
        } else if ($('#TinreadMessageDialog_content a')[0] !== undefined) { // origin
          event.preventDefault();
          $('#TinreadMessageDialog_content a')[0].click();
        } else if ($('#exceptionDialogHandle')[0] !== undefined) {
          event.preventDefault();
          $('#exceptionDialogHandle')[0].click();
        }
      };
      const yesaction = function() {
        // attached fined
        if ($('#content-buttons a')[0] !== undefined) {
          event.preventDefault();
          $('#content-buttons a')[0].click();
          const inf = document.getElementById('itemNumberField');
          inf.value = '';
        }
      };
      const printaction = function() {
        if ($('#HoldSlipDialog_content a')[0] !== undefined) {
          event.preventDefault();
          $('#HoldSlipDialog_content a')[0].click();
          const inf = document.getElementById('itemNumberField');
          inf.value = '';
        }
      };
      const cardNumberFieldaction = function() {
        if (document.getElementById('cardNumberField')) {
          event.preventDefault();
          document.getElementById('cardNumberField').focus();
        }
      };
      const loandeskaction = function() {
        event.preventDefault();
        window.location = '/toread/circulation/pages/loan_desk';
      };
      const TransitItemsToBesendaction = function() {
        const TransitItemsToBesend = new RegExp(`circulation/exttransit/transit_items_to_send`);
        if (TransitItemsToBesend.test(window.location.href)) {
          $('#TransferOperation > a')[1].click();
        } else {
          window.location = '/toread/circulation/exttransit/transit_items_to_send';
        }
        event.preventDefault();
      };

      const keyconbinations = [
        { name: '取消、關閉、否', action: closeaction },
        { name: '是、確定', action: yesaction },
        { name: '列印', action: printaction },
        { name: '聚焦證號欄', action: cardNumberFieldaction },
        { name: '借還書作業', action: loandeskaction },
        { name: '移轉寄送', action: TransitItemsToBesendaction }
      ];
      const targetname = namecodemap.find(e => e.code === x);
      if (targetname) {
        console.log(targetname.name);
        const targetaction = keyconbinations.find(e => e.name === targetname.name);
        if (targetaction) {
          console.log(targetaction);
          targetaction.action();
        }
      }
    }

    $(document).keypress(keydowne);
  });
}(document));

let seletcObserver;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender.tab ?
    `from a content script:${sender.tab.url}` :
    'from the extension');

  const manageinbatch = new RegExp(`internaltranzit/manage_in_batch*`);
  if (manageinbatch.test(location.href)) {
    
    var setselect = function(cursta, proper, selected) {

      return function(records) {
        $('#itemCurrentStatusSelection')[0].value = cursta;
        $('#PropertySelection_0')[0].value = proper;
        if (selected.value !== -1) {
          document.getElementById('elementName').value = selected.text;
          document.getElementById('selectedElement').value = selected.value;
        }
        console.log(selected);
      }
    };

    var obtarget = document.getElementById('HiddenBrowse');
    if (request.query == "selects") {
      console.log("selects");
      var arys = []
      arys.push(document.getElementById("itemCurrentStatusSelection").outerHTML);
      arys.push(document.getElementById("PropertySelection_0").outerHTML);
      arys.push(document.getElementById("locationArea").outerHTML);
      sendResponse({ selects: arys });
    } else if (request.query == "lock") {
      if (seletcObserver !== undefined)
        seletcObserver.disconnect();
      seletcObserver = new MutationObserver(
        setselect(request.setting.itemCurrentStatusSelection, request.setting.PropertySelection_0, request.setting.selected)
      )
      document.getElementById("PropertySelection_0").value = request.setting.PropertySelection_0;
      document.getElementById("itemCurrentStatusSelection").value = request.setting.itemCurrentStatusSelection;
      if (request.setting.selected.value !== -1) {
        document.getElementById("elementName").value = request.setting.selected.text;
        document.getElementById("selectedElement").value = request.setting.selected.value;
      }
      seletcObserver.observe(obtarget, { 'childList': true });
      console.log("lock");
      console.log(request.setting);
      sendResponse({ status: "OK" });
    } else if (request.query == "release") {
      if (seletcObserver !== undefined)
        seletcObserver.disconnect();
      document.getElementById("PropertySelection_0").value = 0;
      document.getElementById("itemCurrentStatusSelection").value = 0;
      document.getElementById("elementName").value = '';
      document.getElementById("selectedElement").value = '';
      console.log("release");
      sendResponse({ status: "OK" });
    }
  }

  if (request.query === 'reload') {
    console.log('reload');
    window.location.reload();
  }
});