'use strict';

var template = require('url-template');

function parseXample(spec, uri, method, xample) {
  var uriTemplate = template.parse(uri);
  var expandedUri = uriTemplate.expand(xample.request.params);
  xample.request.method = method;
  xample.request.uri = "http://localhost:9000" + expandedUri;

  return {
    description: xample.description || method + ' ' + uri,
    request: xample.request,
    response: xample.response.status
  };
}

function parse(spec, options) {
  var totalRoutes = 0;
  var routesTested = 0;
  
  options = options || {};
  
  var xamples = [];
  
  Object.keys(spec.paths || {}).forEach(function (uri) {
    var path = spec.paths[uri];
    Object.keys(path).forEach(function (method) {
      totalRoutes++;
      var operation = path[method];
      if (operation['x-amples']) {
        operation['x-amples'].forEach(function (xample) {
          routesTested++;
          xamples.push(parseXample(spec, uri, method, xample));
        });
      } 
    });
  });
  console.log(`Total routes: ${totalRoutes}, routes tested: ${routesTested}`);
  return xamples;
}

module.exports.parse = parse;
