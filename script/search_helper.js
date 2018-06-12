export default class SearchHelper {
  constructor(host) {
    // console.log(this)
    this.Maxretry = 10;
    this.Webpac = 'webpac/';
    this.Search = 'webpac/search.cfm';
    this.Par1 = '?m=ss&k0=';
    this.Par2 = '&t0=k&c0=and';
    this.Host = host;
    this.tnlibxmlgetinit = this.tnlibxmlgetinit.bind(this);
    this.nextpagepromise = this.nextpagepromise.bind(this);
    this.NormalSearchPromise = this.NormalSearchPromise.bind(this);
    this.NormalAutolinkPromise = this.NormalAutolinkPromise.bind(this);
    this.getbookpage = this.getbookpage.bind(this);
    Object.defineProperty(Promise, 'retry', {
      configurable: true,
      writable: true,
      value: function retry(retries, executor) {
        // console.log(`${retries} retries left!`)

        if (typeof retries !== 'number') {
          throw new TypeError('retries is not a number');
        }

        const promise = new Promise(executor);

        if (retries > 0) {
          return promise.catch(() => Promise.retry(retries - 1, executor));
        }

        return promise;
      },
    });
  }

  static getbooktrs(htmlDoc, book) {
    if (htmlDoc.querySelectorAll('#rdk_content_1 >table > tbody > tr').length === 0) {
      return null;
    }
    return Array.from(htmlDoc.querySelectorAll('#rdk_content_1 >table > tbody > tr'))
      .filter(e => e.children[0].innerText.trim() === book[0]);
  }

  static iserrpage(htmlDoc) {
    const err = htmlDoc.querySelectorAll('img[alt="error_refresh"]');
    if (err.length > 0) {
      console.log('pageerr');
      return true;
    }
    return false;
  }

  static tnlibxmlgetinit(url, book) {
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.setRequestHeader('Accept', 'text/html');
    req.setRequestHeader('Access-Control-Allow-Origin', '*');
    req.book = book;
    return req;
  }

  nextpagepromise(link, book) {
    const helper = this;
    console.log(link);
    return new Promise(((resolve, reject) => {
      if (link === '#') {
        console.log(`booknotfound: ${book[0]}`);

        // console.log('notfound');
        resolve('booknotfound');
      } else {
        const req = helper.tnlibxmlgetinit(helper.Host + helper.Webpac + link, book);
        req.onerror = function () {
          reject(Error('Network Error'));
        };
        const NextpageResponseHandler = function (res) {
          if (res.target.status === 200) {
            const htmlDoc = new DOMParser().parseFromString(res.target.response, 'text/html');
            const links = htmlDoc.querySelectorAll('div[class="page_Num chg_page"]:nth-of-type(3) > a');
            if (helper.iserrpage(htmlDoc)) {
              // reject(Error('errpage'));
              console.log('errpage');
              console.log(res.target.responseURL);
              reject(Error('errpage'));
            }

            const nextlink = links[links.length - 1].getAttribute('href');
            const tr = helper.getbooktrs(htmlDoc, res.target.book);
            if (tr.length !== 0) {
              resolve(res.target);
            } else {
              resolve(helper.nextpagepromise(nextlink, book));
            }
          }
        };

        req.onload = NextpageResponseHandler;
        req.send();
      }
    }));
  }

  NormalAutolinkPromise(res) {
    const helper = this;
    return Promise.retry(10, (resolve, reject) => {
      if (res.target.status === 200) {
        const htmlDoc = new DOMParser().parseFromString(res.target.response, 'text/html');
        if (helper.iserrpage(htmlDoc)) {
          // reject(Error('errpage'));
          // console.log('errpage');
          // console.log(res.target.responseURL)
          reject(Error('errpage'));
        }
        const links = htmlDoc.querySelectorAll('div[class="page_Num chg_page"]:nth-of-type(3) > a');
        const tr = helper.getbooktrs(htmlDoc, res.target.book);
        // let bookname = htmlDoc.getElementsByTagName( 'h2' )[1];
        const nextlink = links[links.length - 1].getAttribute('href');
        console.log(nextlink);
        if (tr.length !== 0) {
          resolve(res.target);
        } else {
          resolve(helper.nextpagepromise(nextlink, res.target.book));
        }
      } else {
        reject(Error('Network Error'));
      }
    });
  }

  NormalSearchPromise(res) {
    const helper = this;
    return Promise.retry(10, (resolve, reject) => {
      // console.log(helper);
      const htmlDoc = new DOMParser().parseFromString(res.target.response, 'text/html');
      const autolink = htmlDoc.getElementById('autolink');

      const req = helper.tnlibxmlgetinit(helper.Host + helper.Webpac + autolink.getAttribute('href'), res.target.book);
      req.onerror = function () {
        reject(Error('Network Error'));
      };

      const AutolinkResponseHandler = function (AutolinkResponse) {
        if (AutolinkResponse.target.status === 200) {
          const reshtmlDoc = new DOMParser().parseFromString(AutolinkResponse.target.response, 'text/html');
          if (helper.iserrpage(reshtmlDoc)) {
            // reject(Error('errpage'));
            console.log('errpage');
            console.log(AutolinkResponse.target.responseURL);
          }
          resolve(AutolinkResponse);
        } else {
          reject(Error('Network Error'));
        }
      };
      req.onload = AutolinkResponseHandler;
      req.send();
    });
  }

  getbookpage(book) {
    const helper = this;
    return Promise.retry(10, (resolve, reject) => {
      const SearchResponseHandler = function (res) {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(res.target.response, 'text/html');
        const autolink = htmlDoc.getElementById('autolink');
        if (res.target.status === 200) {
          if (helper.iserrpage(htmlDoc) || autolink === null) {
            // reject(Error('errpage'));
            // console.log('errpage');
            // console.log(res.target.responseURL);
            reject('noautolink');
          } else {
            resolve(res);
          }

          // Resolve the promise with the response text
        } else {
          reject(Error('Network Error'));
        }
      };
      const url = helper.Host + helper.Search + helper.Par1 + book[0] + helper.Par2;
      const req = helper.tnlibxmlgetinit(url, book);
      req.onload = SearchResponseHandler;

      req.onerror = function (err) {
        console.log(err);
        reject(Error('Network Error on error'));
      };

      req.send();
    }).then(helper.NormalSearchPromise)
      .then(helper.NormalAutolinkPromise)
      .catch((err) => {
        // console.log('caught ') ;
        console.log(err);
        return 'errpage';
      });
  }
}
