export default class SearchHelper {

  constructor (host) {
    // console.log(this)
    this.Maxretry = 10;
    this.Webpac = 'webpac\/';
    this.Search = 'webpac\/search.cfm';
    this.Par1 = '?m=ss&k0=';
    this.Par2 = '&t0=k&c0=and';
    this.Host = host;
    this.tnlibxmlgetinit = this.tnlibxmlgetinit.bind(this);
    this.nextpagepromise = this.nextpagepromise.bind(this);
    this.NormalSearchPromise = this.NormalSearchPromise.bind(this);
    this.NormalAutolinkPromise = this.NormalAutolinkPromise.bind(this);
    this.getbookpage = this.getbookpage.bind(this);
    Object.defineProperty( Promise, 'retry', {
      configurable: true,
      writable: true,
      value: function retry( retries, executor ) {
        // console.log(`${retries} retries left!`)

        if ( typeof retries !== 'number' ) {
          throw new TypeError( 'retries is not a number' );
        }

        const promise = new Promise( executor );

        if ( retries > 0 ) {
          return promise.catch( ( error ) => Promise.retry( --retries, executor ) );
        }

        return promise;
      },
    } );
  }

  iserrpage (htmlDoc) {
    let err = htmlDoc.querySelectorAll( 'img[alt="error_refresh"]' );
    if ( err.length > 0 ) {
      console.log( 'pageerr' );
      return true;
    } else {
      return false;
    }
  }

  tnlibxmlgetinit ( url, book ) {
    let req = new XMLHttpRequest();
    req.open( 'GET', url );
    req.setRequestHeader( 'Accept', 'text/html' );
    // req.setRequestHeader('User-Agent', "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36")
    req.setRequestHeader( 'Access-Control-Allow-Origin', "*" );
    req.book = book;
    return req;
  }

  nextpagepromise( link, book ) {
    let helper = this;
    console.log( link );
    return new Promise( function( resolve, reject ) {
      if ( link == '#' ) {
        console.log( 'booknotfound: ' + book[0] );

        // console.log('notfound');
        resolve( 'booknotfound' );
      } else {
        let req = helper.tnlibxmlgetinit( helper.Host + helper.Webpac + link, book );
        req.onerror = function() {
          reject( Error( 'Network Error' ) );
        };
        let NextpageResponseHandler = function( res ) {
          if ( res.target.status == 200 ) {
            let htmlDoc = new DOMParser().parseFromString( res.target.response, 'text/html' );
            let links = htmlDoc.querySelectorAll( 'div[class="page_Num chg_page"]:nth-of-type(3) > a' );
            if ( helper.iserrpage( htmlDoc ) ) {
              // reject(Error('errpage'));
              console.log( 'errpage' );
              console.log( res.target.responseURL );
              reject( Error( 'errpage' ) );
            }

            let nextlink = links[links.length - 1].getAttribute( 'href' );
            let tr = helper.getbooktrs( htmlDoc, res.target.book );
            if ( tr.length !== 0 ) {
              resolve( res.target );
            } else {
              resolve( helper.nextpagepromise( nextlink, book ) );
            }
          }
        };

        req.onload = NextpageResponseHandler;
        req.send();
      }
    } );
  }

  getbooktrs ( htmlDoc, book ) {
    if ( htmlDoc.querySelectorAll( '#rdk_content_1 >table > tbody > tr' ).length === 0 ) {
      return null;
    } else {
      return Array.from( htmlDoc.querySelectorAll( '#rdk_content_1 >table > tbody > tr' ) )
        .filter( function( e ) {
          return e.children[0].innerText.trim() == book[0];
        } );
    }
  }

  NormalAutolinkPromise( res ) {
    let helper = this;
    return Promise.retry( 10, function( resolve, reject ) {
      if ( res.target.status == 200 ) {
        let htmlDoc = new DOMParser().parseFromString( res.target.response, 'text/html' );
        if ( helper.iserrpage( htmlDoc ) ) {
          // reject(Error('errpage'));
          // console.log('errpage');
          // console.log(res.target.responseURL)
          reject( Error( 'errpage' ) );
        }
        let links = htmlDoc.querySelectorAll( 'div[class="page_Num chg_page"]:nth-of-type(3) > a' );
        let tr = helper.getbooktrs( htmlDoc, res.target.book );
        // let bookname = htmlDoc.getElementsByTagName( 'h2' )[1];
        let nextlink = links[links.length - 1].getAttribute( 'href' );
        console.log( nextlink );
        if ( tr.length !== 0 ) {
          resolve( res.target );
        } else {
          resolve( helper.nextpagepromise( nextlink, res.target.book ) );
        }
      } else {
        reject( Error( 'Network Error' ) );
      }
    } );
  }

  NormalSearchPromise ( res ) {
    let helper = this;
    return Promise.retry( 10, function( resolve, reject ) {
      // console.log(helper);
      let htmlDoc = new DOMParser().parseFromString( res.target.response, 'text/html' );
      let autolink = htmlDoc.getElementById( 'autolink' );

      let req = helper.tnlibxmlgetinit( helper.Host + helper.Webpac + autolink.getAttribute( 'href' ), res.target.book );
      req.onerror = function() {
        reject( Error( 'Network Error' ) );
      };

      let AutolinkResponseHandler = function( res ) {
        if ( res.target.status == 200 ) {
          let htmlDoc = new DOMParser().parseFromString( res.target.response, 'text/html' );
          if ( helper.iserrpage( htmlDoc ) ) {
            // reject(Error('errpage'));
            console.log( 'errpage' );
            console.log( res.target.responseURL );
          }
          resolve( res );
        } else {
          reject( Error( 'Network Error' ) );
        }
      };
      req.onload = AutolinkResponseHandler;
      req.send();
    } );
  }

  getbookpage ( book ) {
    let helper = this;
    return Promise.retry( 10, function( resolve, reject ) {
      let SearchResponseHandler = function( res ) {
        let parser = new DOMParser();
        let htmlDoc = parser.parseFromString( res.target.response, 'text/html' );
        let autolink = htmlDoc.getElementById( 'autolink' );
        if ( res.target.status == 200 ) {
          if ( helper.iserrpage( htmlDoc ) || autolink === null ) {
            // reject(Error('errpage'));
            // console.log('errpage');
            // console.log(res.target.responseURL);
            reject( 'noautolink' );
          } else {
            resolve( res );
          }

          // Resolve the promise with the response text
        } else {
          reject( Error( 'Network Error' ) );
        }
      };
      let req = helper.tnlibxmlgetinit( helper.Host + helper.Search + helper.Par1 + book[0] + helper.Par2, book );
      req.onload = SearchResponseHandler;

      req.onerror = function(err) {
        console.log(err);
        reject( Error( 'Network Error on error' ) );
      };

      req.send();
    } ).then( helper.NormalSearchPromise )
      .then( helper.NormalAutolinkPromise )
      .catch( ( err ) => {
        // console.log('caught ') ;
        console.log(err);
        return 'errpage';
      } );
  }
}
