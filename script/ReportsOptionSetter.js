import LibHost from './LibHost.js';

//AssignedReports
//select default value setup
export default class ReportsOptionSetter extends LibHost{
	constructor(host){
		super(host);
		this.exttransit = 'circulation\/exttransit\/required_from_ext_transit*';
		this.search = 'circulation\/pages\/search_transactions*';
	};

	setExttransitReportsOptions() {
		try {
			document.getElementById('PropertySelection_5').selectedIndex = '1';
			document.getElementById('PropertySelection_6').selectedIndex = '2';
			document.getElementById('PropertySelection_7').selectedIndex = '3';
		} catch (e) {
			console.log('no AssignedReports');
		}
	};

	setSearchReportsOptions() {
		try {
			document.getElementById('PropertySelection_7').selectedIndex = '1';
			document.getElementById('PropertySelection_8').selectedIndex = '2';
		} catch (e) {
			console.log('no AssignedReports');
		}
	};

	setReportsSetterToObserver(){
		var exttransit_url = new RegExp(this.host + this.exttransit);
		var search_url = new RegExp(this.host + this.search);
		if (exttransit_url.test(location.href) && document.getElementById('AssignedReports') !== null) {
			var AssignedReportsObserver = new MutationObserver(this.setExttransitReportsOptions);
			var options = { 'subtree': true, 'childList': true, 'characterData': true };
			AssignedReportsObserver.observe(document.getElementById('AssignedReports'), options);
		}else if (search_url.test(location.href) && document.getElementById('AssignedReports') !== null) {
			var AssignedReportsObserver = new MutationObserver(this.setSearchReportsOptions);
			var options = { 'subtree': true, 'childList': true, 'characterData': true };
			AssignedReportsObserver.observe(document.getElementById('AssignedReports'), options);
		}
	};
}