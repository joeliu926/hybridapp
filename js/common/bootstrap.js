require.config({
    baseUrl: '/Mobile/libraries/',
    paths: {
        'angular': 'angular.min',
        'angular-ui-router': 'route-ui/angular-ui-router.min',
        'angular-async-loader': 'async_loader/angular-async-loader.min'
    },
    shim: {
        'angular': { exports: 'angular' },
        'angular-ui-router': { deps: ['angular'] }
    }
});

require(['angular', '/Mobile/js/common/app-routes.js', '/Mobile/libraries/datehandle.js'], function (angular) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
    });
});
