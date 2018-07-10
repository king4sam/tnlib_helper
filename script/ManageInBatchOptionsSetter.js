import LibHost from './LibHost.js';

export default class ManageInBatchOptionsSetter extends LibHost {
  constructor(host) {
    super(host);
    this.manageinbatchPath = 'internaltranzit/manage_in_batch';
  }

  ManageInBatchOptionsInit() {
    const manageinbatchReg = new RegExp(this.manageinbatchPath);
    if (manageinbatchReg.test(this.getlocation())) {
      const InputClear = function() {
        try {
          const listfiled = document.getElementById('listField');
          listfiled.value = '';
        } catch (e) {
          console.log('no listField');
        }
      };

      const AssignedReportsObserver = new MutationObserver(InputClear);
      AssignedReportsObserver.observe(document.getElementById('results'), { subtree: true, childList: true });

      const editorExtensionId = document.getElementById('extensionid').innerText;
      // Make a simple request:
      chrome.runtime.sendMessage(
        editorExtensionId, { request: 'selects' },
        (response) => {
          console.log(response);
          if (response.selects.status === 'lock') {
            document.getElementById('PropertySelection_0').value = response.selects.setting.PropertySelection_0;
            document.getElementById('itemCurrentStatusSelection').value = response.selects.setting.itemCurrentStatusSelection;
            document.getElementById("elementName").value = response.selects.setting.selected.text;
            document.getElementById("selectedElement").value = response.selects.setting.selected.value;
          }
        },
      );
    }
  }
}