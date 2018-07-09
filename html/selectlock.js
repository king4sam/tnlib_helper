const sendMessagetoActiveTab = function (msg, cb) {
  if ((cb !== null || cb !== undefined) && typeof (cb) === 'function') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, msg, cb);
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  }
};

const switchonchange = function (opacele, statusele, elename) {
  return function() {
    if (this.checked === true) {
      console.log('switch on');
      var selected = elename.selectedOptions[0];

      var setting = {
        PropertySelection_0: opacele.value,
        itemCurrentStatusSelection: statusele.value,
        selected: {value : selected.value, text: selected.innerText}
      }
      sendMessagetoActiveTab({ query: "lock", setting: setting });
      opacele.disabled = true;
      statusele.disabled = true;
      elename.disabled = true;
      console.log(setting);
      var selects = { status: "lock", setting: setting }
      chrome.storage.sync.set({ "selects": selects }, function() {
        console.log('set');
      });

    } else {
      console.log('switch off');
      sendMessagetoActiveTab({ query: "release" });
      opacele.disabled = false;
      statusele.disabled = false;
      elename.disabled = false;
      var selects = { status: "release" }
      chrome.storage.sync.set({ "selects": selects }, function() {
        console.log('set');
      });
    }
  }
};

$('#selectlocker').bootstrapToggle('off');
chrome.storage.sync.get('selects', (results) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log(tabs[0]);

    chrome.tabs.sendMessage(tabs[0].id, { query: 'selects' }, (response) => {
      console.log(response);
      if (undefined !== response) {
        response.selects.forEach((e) => {
          const html = $.parseHTML(e);
          switch (html[0].id) {
            case 'PropertySelection_0':
              $('#selects').append(`${'<div display = \'block\'><label for="PropertySelection_0">在opac顯示</label>'}${html[0].outerHTML}</div>`);
              break;

            case 'itemCurrentStatusSelection':
              $('#selects').append(`${'<div display = \'block\'><label for="itemCurrentStatusSelection">館藏狀態</label>'}${html[0].outerHTML}</div>`);
              break;
            case "locationArea":
              var nodes = $( html[0] ).find( ".dTreeNode a.node" ).toArray();
              $('#selects').append("<div display = 'block'>" + '<label for="itemCurrentStatusSelection">館藏地:</label>' + `<select name="elementName" id="elementName">`+ `<input type="text" name="selectedElement" value="" id="selectedElement" style="display: none;">` + "</div>");
              $("#elementName").append($("<option></option>").attr("value",-1).text(""));
              nodes.forEach(e=>{
                $("#elementName").append($("<option></option>").attr("value", e.href.split(',')[1].trim()).text(e.innerText));
              })
              break;
            default:
              console.log('unexpected element');
              break;
          }
        })
        var opacele = document.getElementById("PropertySelection_0");
        var statusele = document.getElementById("itemCurrentStatusSelection");
        var elename = document.getElementById("elementName");
        // var selected = $("#elementName option:selected")[0];
        if (chrome.runtime.lastError || undefined === results['selects']) {
          console.log('no selects');
        } else if (results['selects']['status'] === 'lock') {
          opacele.value = results['selects']['setting']['PropertySelection_0'];
          statusele.value = results['selects']['setting']['itemCurrentStatusSelection'];
          elename.value = results['selects']['setting']['selected'].value;
        }
        document.getElementById('selectlocker').onchange = switchonchange(opacele, statusele, elename);
        if (results['selects']['status'] === 'lock') {
          $('#selectlocker').bootstrapToggle('on');
        }
      }
    });
  });
});
