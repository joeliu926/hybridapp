define(function (require) {
    var app = require('../../../js/common/app.js');

    app.controller('visitdetailCtrl', ['$scope', '$state', '$http', '$stateParams', function ($scope, $state, $http, $stateParams) {
        //详情数据请求
        if (angular.isUndefined($stateParams.id) || $stateParams.id == -1) {
            plus.nativeUI.alert("获取拜访ID失败!", function () {
                $state.go('customervisit');
            }, "警告", "返回上一页");
            return false;
        }
        $scope.detail = {};
        var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
        $http({ method: 'POST', url: app.configs.customer.visitDetail, data: { id: $stateParams.id } }).
        success(function (data, status, headers, config) {
            if (data) {
                if (data.Id) {
                    $scope.detail = data;
                    wt.close();
                } else {
                    wt.close();
                    plus.nativeUI.alert(app.configs.message.errormsg, function () {
                        $state.go("customervisit");
                    }, "错误提示", "确认");
                }
            }
        }).
        error(function (data, status, headers, config) {
            wt.close();
            plus.nativeUI.toast(data, { duration: "short" });
        });

    }]);

});