define(function (require) {
    var app = require('../../../js/common/app.js');

    app.controller('commorderdetailCtrl', ['$scope', '$state', '$http', '$stateParams', function ($scope, $state, $http, $stateParams) {
        //参数判断
        if ((angular.isUndefined($stateParams.date) || $stateParams.date == "")
         || (angular.isUndefined($stateParams.iswithdraw) || $stateParams.iswithdraw == -1)
         || (angular.isUndefined($stateParams.id) || $stateParams.id == -1) ) {
            plus.nativeUI.alert("获取数据失败!", function () {
                if (!(angular.isUndefined($stateParams.date) || $stateParams.date == "")
                                            &&
                    (angular.isUndefined($stateParams.iswithdraw) || $stateParams.iswithdraw == -1)) {
                    $state.go('commissionorders', { date: $stateParams.date, iswithdraw: $stateParams.iswithdraw });
                } else {
                    $state.go('mycommission');
                }
            }, "警告", "确定");
            return false;
        }
        //详情
        $scope.date = $stateParams.date;
        $scope.iswithdraw = $stateParams.iswithdraw;

        $scope.detail = {};
        var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
        $http({ method: 'POST', url: app.configs.orders.orderDetail, data: { orderid: $stateParams.id } }).
        success(function (data) {
            if (data) {
                if (data.OrderDetail.OrderID) {
                    $scope.detail = data.OrderDetail;
                    wt.close();
                } else {
                    wt.close();
                    plus.nativeUI.alert("获取数据失败!", function () {
                        if (!(angular.isUndefined($stateParams.date) || $stateParams.date == "")
                                                    &&
                            (angular.isUndefined($stateParams.iswithdraw) || $stateParams.iswithdraw == -1)) {
                            $state.go('commissionorders', { date: $stateParams.date, iswithdraw: $stateParams.iswithdraw });
                        } else {
                            $state.go('mycommission');
                        }
                    }, "警告", "确定");
                }
            } else {
                wt.close();
            }
        }).
        error(function (data) {
            wt.close();
        });

    }]);

});