import LibHost from './LibHost.js';

export default class PrintViewModifier extends LibHost {
	constructor(host){
		super(host);
	}

	modify_printview(records) {
		if ($('#HoldSlipPrintContent').length !== 0) {
			$('#HoldSlipPrintContent > p:nth-child(2) > span').css('font-size', "large");
			$('#HoldSlipPrintContent strong').css('font-size', "small");
			$('#HoldSlipPrintContent')[0].innerHTML = $('#HoldSlipPrintContent')[0].innerHTML.replace(/<br.*>(\s*<br>)*/g, "<br>");
			$('#HoldSlipPrintContent')[0].innerHTML = $('#HoldSlipPrintContent')[0].innerHTML.replace(/<p>&nbsp;<\/p>/g, "");
			$('#HoldSlipPrintContent > p:nth-child(2)').css('line-height', '1.9em');
			$('#HoldSlipPrintContent > p:nth-child(2) > span:nth-child(2)').remove();
		}
	};

	setModifierToObserver(){
		var PrintContentObserver = new MutationObserver(this.modify_printview);
		var obtarget = document.getElementById('TransactionsContent') || document.getElementById('TransactionsDesk');
		if (null !== obtarget) {
			PrintContentObserver.observe(obtarget, { 'childList': true });
		}
	}
}
