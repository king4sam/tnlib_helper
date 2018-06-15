import LibHost from './LibHost.js';

export default class ManageInBatchOptionsSetter extends LibHost {
  constructor(host) {
    super(host);
    this.manageinbatch = 'internaltranzit\/manage_in_batch*';
  }

  ManageInBatchOptionsInit() {
    var manage_in_batch = new RegExp(this.host + this.manageinbatch);
    if (manage_in_batch.test(location.href)) {
      var editorExtensionId = "oegakhbdmepmdfpeeanopebbglbfpgkp";

      // Make a simple request:
      chrome.runtime.sendMessage(editorExtensionId, { request: 'selects' },
        function(response) {
          if (response['selects']['status'] === 'lock') {
            console.log("lock");
            document.getElementById("PropertySelection_0").value = response['selects']['setting']['PropertySelection_0'];
            document.getElementById("itemCurrentStatusSelection").value = response['selects']['setting']['itemCurrentStatusSelection']
          }
        }
      );
    }
  }
}