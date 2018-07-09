

import ReportsOptionSetter from './ReportsOptionSetter.js';
import PrintViewModifier from './PrintViewModifier.js';
import TodayCountAppender from './TodayCountAppender.js';
import PopupPrintCloseAdder from './PopupPrintCloseAdder.js';
import ManageInBatchOptionsSetter from './ManageInBatchOptionsSetter.js';

const host = 'http://163.26.71.106/toread/';

const reportsoptionsetter = new ReportsOptionSetter(host);
const printviewmodifier = new PrintViewModifier(host);
const todaycountappender = new TodayCountAppender(host);
const popupprintcloseadder = new PopupPrintCloseAdder(host);
const manageinbatchoptionssetter = new ManageInBatchOptionsSetter(host);

printviewmodifier.setModifierToObserver();
reportsoptionsetter.setReportsSetterToObserver();
todaycountappender.addTodayBorrowField();
popupprintcloseadder.addCloseButton();
manageinbatchoptionssetter.ManageInBatchOptionsInit();
