import LibHost from './LibHost.js';

export default class TodayCountAppender extends LibHost {
  constructor(host) {
    super(host);
    this.loan_desk = 'circulation/pages/loan_desk*';
  }

  getBorrowCount() {
    // fetch records of book
    // console.log($('#If_43 tr'));
    let allBooks = Array.apply(null, document.querySelectorAll('#If_43 tr'));
    allBooks.shift();

    const now = new Date();

    function sameDay(a, b) {
      return a.getDate() === b.getDate()
          && a.getMonth() === b.getMonth()
          && a.getFullYear() === b.getFullYear();
    }

    function sum(total, num) {
      return total + num;
    }

    function isToday(e) {
      const t = new Date(e.children[9].innerText);
      return sameDay(t, now) === true ? 1 : 0;
    }

    return allBooks.map(isToday).reduce(sum, 0);
  }

  addRowOfBorrowcount(count) {
    return function (records) {
      const positionOfBorrowcount = '#viewPatronDetailsComponent> tbody> tr> td >table >tbody> tr> td >table >tbody:last-child';
      const reader = $(positionOfBorrowcount);
      if (reader.length !== 0) {
        reader.append(`<tr id = "todayborrowcount"><td><b>今日借書:</b>
          <font color="#2952A3" style="font-weight: bold;">${count()}
          </font></td></tr>`);
      }
    };
  }

  modifyBorrowcount(count) {
    return function (records) {
      $('#todayborrowcount font').innerText = count();
    };
  }

  addTodayBorrowField() {
    // console.log( this.getBorrowCount() );
    const loandeskUrl = new RegExp(this.host + this.loan_desk);
    if (loandeskUrl.test(window.location.href)) {
      const PatronObserver = new MutationObserver(this.addRowOfBorrowcount(this.getBorrowCount));
      const TransactionsObserver = new MutationObserver(this.modifyBorrowcount(this.getBorrowCount));
      PatronObserver.observe(document.getElementById('PatronItemDetails'), { childList: true, characterData: true });
      TransactionsObserver.observe(document.getElementById('TransactionsContent'), { subtree: true, childList: true, characterData: true });
    }
  }
}
