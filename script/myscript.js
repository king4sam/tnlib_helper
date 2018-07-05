const host = 'http://163.26.71.106/toread/';

const script = document.createElement('script');
script.setAttribute('type', 'module');
script.setAttribute('src', chrome.extension.getURL('./script/main.js'));
const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
head.insertBefore(script, head.lastChild);

(function(document) {
  chrome.storage.local.get('hotkeys', (results) => {
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
        const TransitItemsToBesend = new RegExp(`${host}circulation/exttransit/transit_items_to_send`);
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender.tab ?
    `from a content script:${sender.tab.url}` :
    'from the extension');

  const manageinbatch = new RegExp(`${host}internaltranzit/manage_in_batch*`);
  if (manageinbatch.test(window.location.href)) {
    let seletcObserver;
    const setselect = function(cursta, proper) {
      return function() {
        $('#itemCurrentStatusSelection')[0].value = cursta;
        $('#PropertySelection_0')[0].value = proper;
      };
    };

    const obtarget = document.getElementById('HiddenBrowse');
    if (request.query === 'selects') {
      console.log('selects');
      const arys = [];
      arys.push(document.getElementById('itemCurrentStatusSelection').outerHTML);
      arys.push(document.getElementById('PropertySelection_0').outerHTML);
      sendResponse({ selects: arys });
    } else if (request.query === 'lock') {
      if (seletcObserver !== undefined) {
        seletcObserver.disconnect();
      }
      const ic = request.setting.itemCurrentStatusSelection;
      const ps = request.setting.PropertySelection_0;
      const observeHandler = setselect(ic, ps);
      seletcObserver = new MutationObserver(observeHandler);
      document.getElementById('PropertySelection_0').value = request.setting.PropertySelection_0;
      document.getElementById('itemCurrentStatusSelection').value = request.setting.itemCurrentStatusSelection;
      seletcObserver.observe(obtarget, { childList: true });
      console.log('lock');
      console.log(request.setting);
      sendResponse({ status: 'OK' });
    } else if (request.query === 'release') {
      if (seletcObserver !== undefined) {
        seletcObserver.disconnect();
      }
      document.getElementById('PropertySelection_0').value = 0;
      document.getElementById('itemCurrentStatusSelection').value = 0;
      console.log('release');
      sendResponse({ status: 'OK' });
    }
  }

  if (request.query === 'reload') {
    console.log('reload');
    window.location.reload();
  }
});