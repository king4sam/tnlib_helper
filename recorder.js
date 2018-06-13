var SearchHelper = require('./script/search_helper.js');

var VCR = require('vcr');

var sh = new SearchHelper("http://163.26.71.106/");

sh.getbookpage(["ED0105559"]);

// VCR.configure(function(c) {
//   c.hookInto = XMLHttpRequest;
// });

// VCR.useCassette('test', function(v) {
//   XMLHttpRequest = v.XMLHttpRequest;
// });