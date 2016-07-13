define(function (require) {
    var app = require('../../../js/common/app.js');
  
    app.controller('orderdetailCtrl', ['$scope', '$state', '$http', '$stateParams', function ($scope, $state, $http, $stateParams) {
        var id = $stateParams.id;
       
        //详情数据请求
        if (id == "undefined") {
            plus.nativeUI.alert("获取订单ID失败!", function () {
                $state.go('customerorders');
            }, "警告", "返回上一页");
            return false;
        }
        $scope.detail = {};
        var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
        $http({ method: 'POST', url: app.configs.orders.orderDetail, data: { orderid: id } }).
        success(function (data, status, headers, config) {
            if (data) {
                if (data.OrderDetail.OrderID) {
                    $scope.detail = data.OrderDetail;
                    wt.close();
                } else {
                    wt.close();
                    plus.nativeUI.alert(app.configs.message.errormsg, function () {
                        $state.go('customerorders');
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
