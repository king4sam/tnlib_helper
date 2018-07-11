import LibHost from './LibHost.js';

// AssignedReports
// select default value setup
export default class ReportsOptionSetter extends LibHost {
  constructor(host) {
    super(host);
    this.exttransit = 'circulation/exttransit/required_from_ext_transit|/RequiredFromExtTransit';
    this.search = 'circulation/pages/search_transactions|/circulation/pages/SearchTransactions';
    this.ps5 = 'PropertySelection_5';
    this.ps6 = 'PropertySelection_6';
    this.ps7 = 'PropertySelection_7';
    this.ps8 = 'PropertySelection_8';
  }

  setExttransitReportsOptions(eles) {
    return function() {
        try {
          document.getElementById(eles.ps5).selectedIndex = '1';
          document.getElementById(eles.ps6).selectedIndex = '2';
          document.getElementById(eles.ps7).selectedIndex = '3';
        } catch (e) {
          console.log('no AssignedReports');
        }
    }

  }

  setSearchReportsOptions(eles) {
    return function(){
          try {
          document.getElementById(eles.ps7).selectedIndex = '1';
          document.getElementById(eles.ps8).selectedIndex = '2';
        } catch (e) {
          console.log('no AssignedReports');
        }
    }

  }

  setReportsSetterToObserver() {
    const exttransitUrl = new RegExp(this.exttransit);
    const searchUrl = new RegExp(this.search);
    const options = { subtree: true, childList: true, characterData: true };
    if (exttransitUrl.test(this.getlocation()) && document.getElementById('AssignedReports') !== null) {
      var eles = {ps5 : this.ps5, ps6 : this.ps6, ps7 : this.ps7};
      const exttransitReportsObserver = new MutationObserver(this.setExttransitReportsOptions(eles));
      exttransitReportsObserver.observe(document.getElementById('AssignedReports'), options);
    } else if (searchUrl.test(this.getlocation()) && document.getElementById('AssignedReports') !== null) {
      var eles = {ps7 : this.ps7, ps8 : this.ps8};
      const searchReportsObserver = new MutationObserver(this.setSearchReportsOptions(eles));
      searchReportsObserver.observe(document.getElementById('AssignedReports'), options);
    }
  }
}
