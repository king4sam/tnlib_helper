'use strict';

chrome.declarativeContent.onPageChanged.removeRules( undefined, function() {
  chrome.declarativeContent.onPageChanged.addRules( [{
    conditions: [new chrome.declarativeContent.PageStateMatcher( {
      pageUrl: {hostEquals: '163.26.71.106'},
    } ),
    new chrome.declarativeContent.PageStateMatcher( {
      pageUrl: {hostEquals: '163.26.71.107'},
    } ),
    new chrome.declarativeContent.PageStateMatcher( {
      pageUrl: {hostEquals: 'anding-lib.tainan.gov.tw'},
    } ),
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()],
  }] );
} );

chrome.runtime.onInstalled.addListener( function() {
  console.log( 'onInstalled' );
  let namecodemap = [
    {name: '取消、關閉、否', code: 99},
    {name: '是、確定', code: 121},
    {name: '列印', code: 112},
    {name: '聚焦證號欄', code: 93},
    {name: '借還書作業', code: 39},
    {name: '移轉寄送', code: 59},
  ];
  let selects = {status: 'release'};
  chrome.storage.local.set( {'hotkeys': namecodemap} );
  chrome.storage.local.set( {'selects': selects} );
} );

chrome.runtime.onStartup.addListener( function() {
  console.log( 'I started up!' );
  chrome.storage.local.get( 'hotkeys', function( results ) {
    if ( chrome.runtime.lastError ) {
      console.log( 'storage local err' );
    } else if ( undefined === results.hotkeys ) {
      console.log( 'local reset' );
      let namecodemap = [
        {name: '取消、關閉、否', code: 99},
        {name: '是、確定', code: 121},
        {name: '列印', code: 112},
        {name: '聚焦證號欄', code: 93},
        {name: '借還書作業', code: 39},
        {name: '移轉寄送', code: 59},
      ];
      chrome.storage.local.set( {'hotkeys': namecodemap} );
    } else {
      console.log( results.hotkeys );
    }
  } );
} );
