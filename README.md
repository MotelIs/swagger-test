# Specification-driven REST API testing

[![Build Status](https://travis-ci.org/earldouglas/swagger-test.svg?branch=master)](https://travis-ci.org/earldouglas/swagger-test) [![Coverage Status](https://coveralls.io/repos/earldouglas/swagger-test/badge.svg)](https://coveralls.io/r/earldouglas/swagger-test)

## Specific to Motel fork

We do not use any indirect test specifications; instead, either the test is direclty specified with a `x-amples` json array in the route method to be tested, or it is not tested at all. At the moment the fork differs from the original library in that it specifies the headers
```
{
  "x-device-platform": "manage",
  "Authorization": "Token token=\"w6IZDZ4ZaoM4UCygfCQGB2hM\""
}
```
as well as hardcodes the root uri as `http://localhost:9000`. The fork also implements `test/api/swagger_test.js` slightly differently:
```
var swaggerTest = require('swagger-test');
var swaggerSpec = require('../../api/swagger/swagger.json');
var xamples = swaggerTest.parse(swaggerSpec);

var preq = require('preq');
var assert = require('assert');

describe('specification-driven tests', function () {
  xamples.forEach(function (xample) {
    it(xample.description, function() {
      return preq[xample.request.method]({uri: xample.request.uri, headers: xample.request.headers})
      .then(function (response) {
        assert.deepEqual(response.status, xample.response);
      });
    });
  });
});
```
This ensures that the headers is included in the request.

## Quick start

Load the npm module:

```javascript
var swaggerTest = require('swagger-test');
```

Parse a Swagger specification (e.g. from a Web URL, or the local file system):

```javascript
var swaggerSpec = // load a Swagger specification as a JavaScript object
var xamples = swaggerTest.parse(swaggerSpec);
```

The `xamples` array contains a sequence of request/response pairs.  Test them against your service:

```javascript
var preq = require('preq');

describe('specification-driven tests', function () {
  xamples.forEach(function (xample) {
    it(xample.description, function() {
      return preq[xample.request.method](xample.request)
      .then(function (response) {
        assert.deepEqual(response, xample.response);
      });
    });
  });
});
```

## Usage

Tests are generated in one of two ways:

1. Directly from the the `x-amples` extension to the Swagger specification
1. Indirectly by inferring examples from the Swagger specification

### Direct test specification

The `x-amples` extension allows explicit specification of request/response pairs:

```javascript
"/pets/{id}": {
  "get": {
  ...
  "x-amples": [
    {
      "description": "short description of example; it's used as testcase description"
      "request": {
        "params": {
          "id": "fido4"
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "content-type": "application/json"
        }
      }
    }
  ]
}
```

These can be specified for any operation.

### Indirect test inference

For cases where an explicit examples don't need to be specified, they are inferred directly from the Swagger operation's specification.

```javascript
"get": {
  "produces": [ "application/json" ],
  "responses": {
    "200": {
      "description": "Returns all the pets"
    }
  }
}
```

To enable indirect test inference, set `inferXamples` to `true` in the `options` argument to `parse()`:

```javascript
var xamples = swaggerTest.parse(spec, { inferXamples: true });
```
