define(function (require) {
    var app = require('../../../js/common/app.js');

    app.controller('orderdetailcurCtrl', ['$scope', '$state', '$http', '$stateParams', function ($scope, $state, $http, $stateParams) {

        //详情数据请求
        //id 订单ID uid userid cid 客户档案ID
        if ((angular.isUndefined($stateParams.id) || $stateParams.id == -1)
            || (angular.isUndefined($stateParams.cid) || $stateParams.cid == -1)
            || (angular.isUndefined($stateParams.uid) || $stateParams.uid == -1)) {
            plus.nativeUI.alert("获取客户ID或者订单ID或者客户档案ID失败!", function () {
                if ($stateParams.cid != -1 && $stateParams.uid != -1) {
                    $state.go('customerorderscur', { id: $stateParams.cid, uid: $stateParams.uid });
                }else{
                    $state.go('customerorders');
                }
            }, "警告", "返回上一页");
            return false;
        }

        $scope.uid = $stateParams.uid;
        $scope.cid = $stateParams.cid;
        $scope.currentname = $stateParams.name;

        $scope.detail = {};
        var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
        $http({ method: 'POST', url: app.configs.orders.orderDetail, data: { orderid: $stateParams.id } }).
        success(function (data, status, headers, config) {
            if (data) {
                if (data.OrderDetail.OrderID) {
                    $scope.detail = data.OrderDetail;
                    wt.close();
                } else {
                    wt.close();
                    plus.nativeUI.alert(app.configs.message.errormsg, function () {
                        if ($stateParams.cid != -1 && $stateParams.uid != -1) {
                            $state.go('customerorderscur', { id: cid, uid: uid });
                        } else {
                            $state.go('customerorders');
                        }
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
