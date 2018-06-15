'use strict';

import ReportsOptionSetter from './ReportsOptionSetter.js';
import PrintViewModifier from './PrintViewModifier.js';
import TodayCountAppender from './TodayCountAppender.js';
import PopupPrintCloseAdder from './PopupPrintCloseAdder.js'
import ManageInBatchOptionsSetter from './ManageInBatchOptionsSetter.js'
var host = 'http:\/\/163\.26\.71\.106\/toread\/';

var reportsoptionsetter = new ReportsOptionSetter(host);
var printviewmodifier = new PrintViewModifier(host);
var todaycountappender = new TodayCountAppender(host);
var popupprintcloseadder = new PopupPrintCloseAdder(host);
var manageinbatchoptionssetter = new ManageInBatchOptionsSetter(host);

printviewmodifier.setModifierToObserver();
reportsoptionsetter.setReportsSetterToObserver();
todaycountappender.addTodayBorrowField();
popupprintcloseadder.addCloseButton();
manageinbatchoptionssetter.ManageInBatchOptionsInit();