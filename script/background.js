chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostEquals: '163.26.71.106' },
    }),
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostEquals: '163.26.71.107' },
    }),
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostEquals: 'anding-lib.tainan.gov.tw' },
    }),
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()],
  }]);
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled');
  const namecodemap = [
    { name: '取消、關閉、否', code: 99 },
    { name: '是、確定', code: 121 },
    { name: '列印', code: 112 },
    { name: '聚焦證號欄', code: 93 },
    { name: '借還書作業', code: 39 },
    { name: '移轉寄送', code: 59 },
  ];
  const selects = { status: 'release' };
  chrome.storage.sync.set({ hotkeys: namecodemap });
  chrome.storage.sync.set({ selects });
});

chrome.runtime.onStartup.addListener(() => {
  console.log('I started up!');
  chrome.storage.sync.get('hotkeys', (results) => {
    if (chrome.runtime.lastError) {
      console.log('storage sync err');
    } else if (undefined === results.hotkeys) {
      console.log('sync reset');
      const namecodemap = [
        { name: '取消、關閉、否', code: 99 },
        { name: '是、確定', code: 121 },
        { name: '列印', code: 112 },
        { name: '聚焦證號欄', code: 93 },
        { name: '借還書作業', code: 39 },
        { name: '移轉寄送', code: 59 },
      ];
      chrome.storage.sync.set({ hotkeys: namecodemap });
    } else {
      console.log(results.hotkeys);
    }
  });
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.request === 'selects') {
    console.log('select');
    console.log(request);
    console.log(sender);
    const ps = new Promise((resolve, reject) => {
      chrome.storage.sync.get('selects', (results) => {
        console.log(results);
        if (chrome.runtime.lastError) {
          reject(Error('err'));
        } else if (undefined === results.selects) {
          console.log('undefined');
          resolve({ status: 'release' });
        } else {
          console.log('is');
          resolve(results);
        }
      });
    });
    ps.then((sm) => {
      sendResponse(sm);
    });
  }
  return true;
});
