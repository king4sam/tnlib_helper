import LibHost from './LibHost.js';

// AssignedReports
// select default value setup
export default class ReportsOptionSetter extends LibHost {
  constructor(host) {
    super(host);
    this.exttransit = 'circulation/exttransit/required_from_ext_transit*';
    this.search = 'circulation/pages/search_transactions*';
    this.ps5 = 'PropertySelection_5';
    this.ps6 = 'PropertySelection_6';
    this.ps7 = 'PropertySelection_7';
    this.ps8 = 'PropertySelection_8';
  }

  setExttransitReportsOptions() {
    try {
      document.getElementById(this.ps5).selectedIndex = '1';
      document.getElementById(this.ps6).selectedIndex = '2';
      document.getElementById(this.ps7).selectedIndex = '3';
    } catch (e) {
      console.log('no AssignedReports');
    }
  }

  setSearchReportsOptions() {
    try {
      document.getElementById(this.ps7).selectedIndex = '1';
      document.getElementById(this.ps8).selectedIndex = '2';
    } catch (e) {
      console.log('no AssignedReports');
    }
  }

  setReportsSetterToObserver() {
    const exttransitUrl = new RegExp(this.host + this.exttransit);
    const searchUrl = new RegExp(this.host + this.search);
    const options = { subtree: true, childList: true, characterData: true };
    if (exttransitUrl.test(this.getlocation()) && document.getElementById('AssignedReports') !== null) {
      const exttransitReportsObserver = new MutationObserver(this.setExttransitReportsOptions);
      exttransitReportsObserver.observe(document.getElementById('AssignedReports'), options);
    } else if (searchUrl.test(this.getlocation()) && document.getElementById('AssignedReports') !== null) {
      const searchReportsObserver = new MutationObserver(this.setSearchReportsOptions);
      searchReportsObserver.observe(document.getElementById('AssignedReports'), options);
    }
  }
}
