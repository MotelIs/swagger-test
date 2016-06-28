'use strict';

var template = require('url-template');

function parseXample(spec, uri, method, xample, statusString, host) {
  var uriTemplate = template.parse(uri),
      expandedUri = uriTemplate.expand(xample.request.params),
      status = parseInt(statusString) || 200;
      
  xample.request.method = method;
  xample.request.uri = `http://${host}${expandedUri}`;

  return {
    description: xample.description || method + ' ' + uri,
    request: xample.request,
    response: status
  };
}

function parse(spec, options) {
  var totalRoutes = 0,
      routesTested = 0;
  
  options = options || {};
  
  var xamples = [],
      host = spec.host;
  
  Object.keys(spec.paths || {}).forEach(function (uri) {
    var path = spec.paths[uri];
    Object.keys(path).forEach(function (method) {
      totalRoutes++;
      var operation = path[method];
      if (operation['x-amples']) {
        operation['x-amples'].forEach(function (xample) {
          routesTested++;
          Object.keys(operation.responses || {}).forEach(function (statusString) {
            xamples.push(parseXample(spec, uri, method, xample, statusString, host));
          });
        });
      } 
    });
  });
  console.log(`Total routes: ${totalRoutes}, routes tested: ${routesTested}`);
  return xamples;
}

module.exports.parse = parse;
