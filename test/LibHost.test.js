import LibHost from 'script/LibHost.js';
var sandbox = require('sinon').createSandbox();
var sinon = require('sinon');


describe("LibHost.js", () => {
  let libhost;
  beforeEach(() => {
    libhost = new LibHost('http://163.26.71.106/toread/');
  })

  afterEach(function() {
    // completely restore all fakes created through the sandbox
    sandbox.restore();
  });


  it("should create a libhost", () => {
    expect(libhost.host).toBe('http://163.26.71.106/toread/');
  })

  it("should return location.href", () => {
    expect(libhost.getlocation()).toBe('http://localhost:9876/context.html');
  })

})