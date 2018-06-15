import LibHost from './LibHost.js';

export default class TodayCountAppender extends LibHost{
	constructor(host){
		super(host);
		this.loan_desk = 'circulation\/pages\/loan_desk*';
	};

	getBorrowCount() {
		//fetch records of book
		// console.log($('#If_43 tr'));
		var a = window.$('#If_43 tr').get();
		a.shift();

		var now = new Date();

		function sameday(a, b) {
			return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
		}

		function Sum(total, num) {
			return total + num;
		}

		function istoday(e) {
			var t = new Date(e.children[9].innerText);
			return sameday(t, now) === true ? 1 : 0;
		}

		return a.map(istoday).reduce(Sum, 0);
	};

	add_row_of_borrowcount(count) {
		return function(records){
			var position_of_borrowcount = '#viewPatronDetailsComponent> tbody> tr> td >table >tbody> tr> td >table >tbody:last-child';
			var reader = $(position_of_borrowcount)
			if (reader.length !== 0) {
				reader.append(
					'<tr id = "todayborrowcount"><td><b>今日借書:</b>' +
					'<font color="#2952A3" style="font-weight: bold;">' +
					count() +
					'</font></td></tr>'
				);
			}
		}
	};

	modify_borrowcount (count) {
		return function(records){
			$('#todayborrowcount font').innerText = count();
		}
	};

	addTodayBorrowField(){
		// console.log( this.getBorrowCount() );
		var loan_desk_url = new RegExp(this.host + this.loan_desk);
		if (loan_desk_url.test(location.href)) {
			var PatronObserver = new MutationObserver(this.add_row_of_borrowcount(this.getBorrowCount));
			var TransactionsObserver = new MutationObserver(this.modify_borrowcount(this.getBorrowCount));
			PatronObserver.observe(document.getElementById('PatronItemDetails'), { 'childList': true, 'characterData': true });
			TransactionsObserver.observe(document.getElementById('TransactionsContent'), { 'subtree': true, 'childList': true, 'characterData': true });
		}
	}
}