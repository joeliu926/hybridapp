define(function (require) {
    var app = require('../../../js/common/app.js');

    app.controller('mylistCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {

        $scope.mylist = {};

        //获取真实姓名
        $scope.getrealname = function () {
            var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
            $http({ method: 'POST', url: app.configs.my.userrealname }).
            success(function (data) {
                wt.close();
                if (data) {
                    $scope.mylist.username = data;
                }
            }).
            error(function (data) {
                wt.close();
                plus.nativeUI.toast(data, { duration: "short" });
            });
        };
        $scope.getrealname();

    }]);

});