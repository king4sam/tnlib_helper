const testContext = require.context(".", true, /\.test$/);

testContext.keys().forEach(testContext);