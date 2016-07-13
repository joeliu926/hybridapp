define(function (require, exports, module) {
    var angular = require('angular');
    var asyncLoader = require('angular-async-loader');
    require('angular-ui-router');
    var app = angular.module('app', ['ui.router']);
    app.configs = require('/Mobile/js/common/config.js');
    asyncLoader.configure(app);
    module.exports = app;
   
});