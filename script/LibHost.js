export default class LibHost {
  constructor(host) {
    this.host = host;
  }

  getlocation() {
    return window.location.href;
  }
}
