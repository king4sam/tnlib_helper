const host = 'http://163.26.71.107/toread/';

(function (document) {
  const InputClear = function () {
    console.log('InputClear');
    try {
      const listfiled = document.getElementById('listField');
      listfiled.value = '';
    } catch (e) {
      console.log('no listField');
    }
  };
  const manageinbatch = new RegExp(`${host}internaltranzit/manage_in_batch*`);
  if (manageinbatch.test(window.location.href)) {
    const AssignedReportsObserver = new MutationObserver(InputClear);
    AssignedReportsObserver.observe(document.getElementById('results'), { subtree: true, childList: true });
    chrome.storage.local.get('selects', (results) => {
      if (chrome.runtime.lastError || undefined === results.selects) {
        console.log('no selects');
      } else if (results.selects.status === 'lock') {
        console.log('lock');
        const ps0 = document.getElementById('PropertySelection_0');
        ps0.value = results.selects.setting.PropertySelection_0;
        const icss = document.getElementById('itemCurrentStatusSelection');
        icss.value = results.selects.setting.itemCurrentStatusSelection;
      } else {
        console.log('release');
      }
    });
  }
}(document));

(function (document) {
  chrome.storage.local.get('hotkeys', (results) => {
    let namecodemap;
    if (chrome.runtime.lastError || undefined === results.hotkeys) {
      console.log('storage err');
    } else {
      namecodemap = results.hotkeys;
    }

    function keydowne(event) {
      console.log(event.which);
      console.log(event.keyCode);
      let x = event.which;
      if (x >= 65 && x <= 90) {
        x += 32;
      }
      console.log(x);
      const closeaction = function () {
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
      const yesaction = function () {
        // attached fined
        if ($('#content-buttons a')[0] !== undefined) {
          event.preventDefault();
          $('#content-buttons a')[0].click();
          const inf = document.getElementById('itemNumberField');
          inf.value = '';
        }
      };
      const printaction = function () {
        if ($('#HoldSlipDialog_content a')[0] !== undefined) {
          event.preventDefault();
          $('#HoldSlipDialog_content a')[0].click();
          const inf = document.getElementById('itemNumberField');
          inf.value = '';
        }
      };
      const cardNumberFieldaction = function () {
        if (document.getElementById('cardNumberField')) {
          event.preventDefault();
          document.getElementById('cardNumberField').focus();
        }
      };
      const loandeskaction = function () {
        event.preventDefault();
        window.location = '/toread/circulation/pages/loan_desk';
      };
      const TransitItemsToBesendaction = function () {
        const TransitItemsToBesend = new RegExp(`${host}circulation/exttransit/transit_items_to_send`);
        if (TransitItemsToBesend.test(window.location.href)) {
          $('#TransferOperation > a')[1].click();
        } else {
          window.location = '/toread/circulation/exttransit/transit_items_to_send';
        }
        event.preventDefault();
      };
      const managecloseaction = function () {
        if ($('#closePopupTop')[0] !== undefined) {
          $('#closePopupTop')[0].click();
        }
      };

      const keyconbinations = [
        { name: '取消、關閉、否', action: closeaction },
        { name: '是、確定', action: yesaction },
        { name: '列印', action: printaction },
        { name: '聚焦證號欄', action: cardNumberFieldaction },
        { name: '借還書作業', action: loandeskaction },
        { name: '移轉寄送', action: TransitItemsToBesendaction },
        { name: '關閉', action: managecloseaction },
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
    const setselect = function (cursta, proper) {
      return function () {
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

// add close button to
// TransitItemsToBeReceived popup windows
(function (document) {
  const TransitItemsToBeReceived = new RegExp(`${host}circulation/exttransit/TransitItemsToBeReceived,popupComponent.*`);
  if (TransitItemsToBeReceived.test(window.location.href)) {
    const closebtn = document.createElement('a');
    closebtn.id = 'closemeplease';
    closebtn.classList.add('dialog');
    closebtn.appendChild(document.createTextNode('close'));
    closebtn.onclick = function () {
      window.close();
    };
    $('table tr td').append(closebtn);
  }
}(document));

// AssignedReports
// select default value setup
(function (document) {
  function AssignedReportsSetDefault() {
    try {
      const ps6 = document.getElementById('PropertySelection_6');
      ps6.selectedIndex = '1';
      const ps7 = document.getElementById('PropertySelection_7');
      ps7.selectedIndex = '2';
    } catch (e) {
      console.log('no AssignedReports');
    }
  }
  const exttransiturl = new RegExp(`${host}circulation/exttransit/required_from_ext_transit*`);
  if (exttransiturl.test(window.location.href) && document.getElementById('AssignedReports') !== null) {
    const AssignedReportsObserver = new MutationObserver(AssignedReportsSetDefault);
    AssignedReportsObserver.observe(document.getElementById('AssignedReports'), { subtree: true, childList: true, characterData: true });
  }
}(document));

// search_transactionsReports
// select default value setup
(function (document) {
  function AssignedReportsSetDefault() {
    try {
      const ps7 = document.getElementById('PropertySelection_7');
      ps7.selectedIndex = '1';
      const ps8 = document.getElementById('PropertySelection_8');
      ps8.selectedIndex = '2';
    } catch (e) {
      console.log('no AssignedReports');
    }
  }
  const exttransiturl = new RegExp(`${host}circulation/pages/search_transactions*`);
  if (exttransiturl.test(window.location.href) && document.getElementById('AssignedReports') !== null) {
    const AssignedReportsObserver = new MutationObserver(AssignedReportsSetDefault);
    AssignedReportsObserver.observe(document.getElementById('AssignedReports'), { subtree: true, childList: true, characterData: true });
  }
}(document));

// add today borrow count field
// in PatronDetails
(function (document, window, $) {
  const loandeskurl = new RegExp(`${host}circulation/pages/loan_desk*`);
  if (loandeskurl.test(window.location.href)) {
    const borrowcount = function () {
      // fetch records of book
      const books = $('#If_43 tr').toArray();
      books.shift();

      const now = new Date();

      function sameday(a, b) {
        return a.getDate() === b.getDate()
            && a.getMonth() === b.getMonth()
            && a.getFullYear() === b.getFullYear();
      }

      function Sum(total, num) {
        return total + num;
      }

      function istoday(e) {
        const t = new Date(e.children[9].innerText);
        return sameday(t, now) === true ? 1 : 0;
      }

      return books.map(istoday).reduce(Sum, 0);
    };

    const addborrowcount = function () {
      const borrowcountposition = '#viewPatronDetailsComponent> tbody> tr> td >table >tbody> tr> td >table >tbody:last-child';
      const reader = $(borrowcountposition);
      if (reader.length !== 0) {
        reader.append(`<tr id = "todayborrowcount"><td><b>今日借書:</b>
          <font color="#2952A3" style="font-weight: bold;">
          ${borrowcount()}
          </font></td></tr>`);
      }
    };

    const modifyborrowcount = function () {
      const tbc = $('#todayborrowcount font');
      tbc.innerText = borrowcount();
    };

    // listen to panel change
    const PatronObserver = new MutationObserver(addborrowcount);
    const TransactionsObserver = new MutationObserver(modifyborrowcount);
    PatronObserver.observe(document.getElementById('PatronItemDetails'), { childList: true, characterData: true });
    TransactionsObserver.observe(document.getElementById('TransactionsContent'), { subtree: true, childList: true, characterData: true });
  }
}(document, window, $));

// print view modify
(function (document, $) {
  console.log('hi');
  const modifyprintview = function () {
    console.log('yo');
    if ($('#HoldSlipPrintContent').length !== 0) {
      console.log($('#HoldSlipPrintContent'));
      $('#HoldSlipPrintContent > p:nth-child(2) > span').css('font-size', 'large');
      $('#HoldSlipPrintContent strong').css('font-size', 'small');
      const hspc = $('#HoldSlipPrintContent')[0];
      hspc.innerHTML = $('#HoldSlipPrintContent')[0].innerHTML.replace(/<br.*>(\s*<br>)*/g, '<br>');
      hspc.innerHTML = $('#HoldSlipPrintContent')[0].innerHTML.replace(/<p>&nbsp;<\/p>/g, '');
      $('#HoldSlipPrintContent > p:nth-child(2)').css('line-height', '1.9em');
      $('#HoldSlipPrintContent > p:nth-child(2) > span:nth-child(2)').remove();
    }
  };
  const PrintContentObserver = new MutationObserver(modifyprintview);
  const obtarget = document.getElementById('TransactionsContent') || document.getElementById('TransactionsDesk');
  if (obtarget !== null) {
    PrintContentObserver.observe(obtarget, { childList: true });
  }
}(document, $));
