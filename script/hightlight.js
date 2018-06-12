chrome.storage.local.get('reservedbooks', (items) => {
  if (chrome.runtime.lastError) {
    console.log('no reservedbooks');
  } else {
    function reqListener(req) {
      const index = req.target.index;
      const regex = /(條碼：(.+))，/g;
      const BarcodeGroupNumber = 2;
      const IndexofCheckcol = 7;
      const statuscol = 3;
      let matches;
      const anding = /^ED\d{7}/g;
      const barcodes = [];
      const targettrs = $('table[class=\'tab1\'] tr').toArray().slice(1, -1);
      //
      while ((matches = regex.exec(this.responseText)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (matches.index === regex.lastIndex) {
          regex.lastIndex += 1;
        }

        // if the books was arrived, hightlight the row in table
        barcodes.push(matches[BarcodeGroupNumber]);
      }
      const bookrequests = barcodes.map(barcode => getbookpage([barcode]));
      Promise.all(bookrequests)
        .then((ress) => {
          const PopoverContentAry = [];
          console.log(ress);
          const FoundPages = ress.filter(p => p !== 'booknotfound' && p !== 'errpage');
          console.log(FoundPages);
          FoundPages.forEach((e) => {
            console.log(e);
            const barcode = e.book[0];
            const htmlDoc = new DOMParser().parseFromString(e.response, 'text/html');
            const trs = Array(...htmlDoc.querySelectorAll('#rdk_content_1 >table > tbody > tr'))
              .filter(tr => tr.children[0].innerText.trim() === e.book[0]);
            const bookname = htmlDoc.getElementsByTagName('h2')[1].innerText.slice(0, -1).trim();
            if (anding.test(barcode)) {
              if (trs.length !== 0 && trs[0].children[statuscol].innerText.trim() === '在架') {
                trs.push({ bookname, barcode, status: '在架' });
              } else if (trs.length !== 0 && trs[0].children[statuscol].innerText.trim() === '預約保留') {
                PopoverContentAry.push({ bookname, barcode, status: '預約保留' });
              } else {
                PopoverContentAry.push({ bookname, barcode, status: '未到' });
              }
            } else if (trs.length !== 0 && trs[0].children[statuscol].innerText.trim() === '預約保留') {
              PopoverContentAry.push({ bookname, barcode, status: '預約保留' });
            } else {
              PopoverContentAry.push({ bookname, barcode, status: '未到' });
            }
          });
          return PopoverContentAry;
        })
        .then((PopoverContentAry) => {
          if (PopoverContentAry.filter(e => e.status !== '未到').length > 0) {
            // console.log(trs);
            // console.log(index);
            targettrs[index].children[IndexofCheckcol - 1].style.backgroundColor = '#fbff0075';
          }
          const tdele = targettrs[index].children[IndexofCheckcol - 1];
          $(tdele).popover({
            toggle: 'popover',
            html: true,
            trigger: 'click',
            container: 'body',
            placement: 'bottom',
            content() {
              return `<table>${
                PopoverContentAry.reduce(
                  (a, c) => `${a}<tr><td>${c.bookname}</td><td>${c.barcode}</td><td>${c.status}</td></tr>`
                  , '',
                )
              }</table>`;
            },
          });
        });
    }

    // parse urls for reservations
    const urls = $('table[class=tab1] tr td a').toArray().slice(0, -4).map(e => e.href);

    // fetch page to get barcode of books
    urls.forEach((e, i) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', e);
      xhr.index = i;
      xhr.withCredentials = true;
      xhr.onload = reqListener;
      xhr.send();
    });
  }
});
