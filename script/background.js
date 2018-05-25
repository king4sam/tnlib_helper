'use strict';

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
	chrome.declarativeContent.onPageChanged.addRules([{
		conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: { hostEquals: '163.26.71.106' }
			}),
			new chrome.declarativeContent.PageStateMatcher({
				pageUrl: { hostEquals: '163.26.71.107' }
			}),
			new chrome.declarativeContent.PageStateMatcher({
				pageUrl: { hostEquals: 'anding-lib.tainan.gov.tw' }
			})
		],
		actions: [new chrome.declarativeContent.ShowPageAction()]
	}]);
});

 chrome.runtime.onInstalled.addListener(function(){
	console.log("firsttime");
	var namecodemap = [
		{ name: "取消、關閉、否", code: 99 },
		{ name: "是、確定", code: 121 },
		{ name: "列印", code: 112 },
		{ name: "聚焦證號欄", code: 93 },
		{ name: "借還書作業", code: 39 },
		{ name: "移轉寄送", code: 59 },
		// { name: "關閉", code: 120 }
	]
	chrome.storage.local.set({ "hotkeys": namecodemap });
})