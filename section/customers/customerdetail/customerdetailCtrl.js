define(function (require) {
    var app = require('../../../js/common/app.js');

    app.controller('customerdetailCtrl', ['$scope', '$state', '$http', '$stateParams', function ($scope, $state, $http, $stateParams) {
        //var isvisited = $stateParams.isvisited;
        //$scope.isvisited = isvisited;
        //$scope.isvisitedshow = true;
        //if (isvisited == "再次拜访"){
        //    $scope.isvisitedshow = false;
        //}

        //详情数据请求
        if (angular.isUndefined($stateParams.id) || $stateParams.id == -1) {
            plus.nativeUI.alert("获取客户ID失败!", function () {
                $state.go('mycustomer');
            }, "警告", "返回上一页");
            return false;
        }
        $scope.detail = {};
        var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
        $http({ method: 'POST', url: app.configs.customer.cusDetail, data: { id: $stateParams.id } }).
        success(function (data, status, headers, config) {
            if (data) {
                if (data.Id) {
                    $scope.detail = data;
                    wt.close();
                } else {
                    wt.close();
                    plus.nativeUI.alert(app.configs.message.errormsg, function () {
                        $state.go('mycustomer');
                    }, "错误提示", "确认");
                }
            }
        }).
        error(function (data, status, headers, config) {
            plus.nativeUI.toast(data, { duration: "short" });
        });
    }]);

});