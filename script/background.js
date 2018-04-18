'use strict';

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: '163.26.71.107'}
      }),
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'anding-lib.tainan.gov.tw'}
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

