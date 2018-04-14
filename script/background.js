'use strict';

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: '163.26.71.106'}
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

