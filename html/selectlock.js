let sendMessagetoActiveTab = function(msg, cb) {
  if (cb !== null || cb != undefined && typeof(cb) === 'function') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, msg, cb);
    });
  } else {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  }
};

let switchonchange = function(opacele, statusele) {
  return function() {
    if (this.checked === true) {
      console.log('switch on');
      let setting = {
        PropertySelection_0: opacele.value,
        itemCurrentStatusSelection: statusele.value,
      };
      sendMessagetoActiveTab({query: 'lock', setting: setting});
      opacele.disabled = true;
      statusele.disabled = true;
      let selects = {status: 'lock', setting: setting};
      chrome.storage.local.set({'selects': selects}, function() {
        console.log('set');
      });
    } else {
      console.log('switch off');
      sendMessagetoActiveTab({query: 'release'});
      opacele.disabled = false;
      statusele.disabled = false;
      let selects = {status: 'release'};
      chrome.storage.local.set({'selects': selects}, function() {
        console.log('set');
      });
    }
  };
};

$('#selectlocker').bootstrapToggle('off');
chrome.storage.local.get('selects', function(results) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log(tabs[0]);

    chrome.tabs.sendMessage(tabs[0].id, {query: 'selects'}, function(response) {
      console.log(response);
      if (undefined !== response) {
        response.selects.forEach((e) => {
          html = $.parseHTML(e);
          switch (html[0].id) {
            case 'PropertySelection_0':
              $('#selects').append('<div display = \'block\'>' + '<label for="PropertySelection_0">在opac顯示</label>' + html[0].outerHTML + '</div>');
              break;

            case 'itemCurrentStatusSelection':
              $('#selects').append('<div display = \'block\'>' + '<label for="itemCurrentStatusSelection">館藏狀態</label>' + html[0].outerHTML + '</div>');
              break;
          }
        });
        let opacele = document.getElementById('PropertySelection_0');
        let statusele = document.getElementById('itemCurrentStatusSelection');
        if (chrome.runtime.lastError || undefined === results['selects']) {
          console.log('no selects');
        } else if (results['selects']['status'] === 'lock') {
          opacele.value = results['selects']['setting']['PropertySelection_0'];
          statusele.value = results['selects']['setting']['itemCurrentStatusSelection'];
        }
        document.getElementById('selectlocker').onchange = switchonchange(opacele, statusele);
        if (results['selects']['status'] === 'lock') {
          $('#selectlocker').bootstrapToggle('on');
        }
      }
    });
  });
});
