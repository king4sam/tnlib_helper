import LibHost from './LibHost.js';

export default class ManageInBatchOptionsSetter extends LibHost {
  constructor(host) {
    super(host);
    this.manageinbatchPath = 'internaltranzit/manage_in_batch';
  }

  ManageInBatchOptionsInit() {
    const manageinbatchReg = new RegExp(this.host + this.manageinbatchPath);
    if (manageinbatchReg.test(this.getlocation())) {
      const editorExtensionId = 'oegakhbdmepmdfpeeanopebbglbfpgkp';
      // Make a simple request:
      chrome.runtime.sendMessage(
        editorExtensionId, { request: 'selects' },
        (response) => {
          if (response.selects.status === 'lock') {
            document.getElementById('PropertySelection_0').value = response.selects.setting.PropertySelection_0;
            document.getElementById('itemCurrentStatusSelection').value = response.selects.setting.itemCurrentStatusSelection;
          }
        },
      );
    }
  }
}
