define(function (require) {
    var app = require('../../../js/common/app.js');

    app.controller('commissionordersCtrl', ['$scope', '$state', '$http','$stateParams', function ($scope, $state, $http,$stateParams) {
        var date = $stateParams.date;
        var iswithdraw = $stateParams.iswithdraw;

        if ((date == null || date == undefined || date == '') || (iswithdraw == -1 || iswithdraw == null || iswithdraw == undefined)) {
            plus.nativeUI.alert("获取订单失败!", function () {
                $state.go('mycommission');
            }, "警告", "返回上一页");
            return false;
        }

        //分页数据请求
        $scope.commissionordersinit = function () {
            var currentpage = 1;
            var jsonarr = new Array();
            $scope.orderslist = {};
            $scope.orders = {};
            $scope.orders.totalpage = 1;
            $scope.orders.date = date;
            $scope.orders.iswithdraw = iswithdraw;

            app.configs.listenLock.commissionorders = function (e) {
                //如是其它页则删除此监听
                if ($state.current.name != 'commissionorders') {
                    document.removeEventListener("plusscrollbottom", app.configs.listenLock.commissionorders, false);
                    return false;
                }
                var state = currentpage > $scope.orders.totalpage;
                if (!state) {
                    var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
                    $scope.orders.currentpage = currentpage++;
                    $http({ method: 'POST', url: app.configs.orders.commissionorder, data: $scope.orders }).
                    success(function (data) {
                        if (data) {
                            if (data.OrderList && data.OrderList.length > 0) {
                                var list = data.OrderList;
                                for (var i in list) {
                                    jsonarr.push(list[i]);
                                }
                                $scope.orders.totalpage = data.TotalPage;
                                wt.close();
                            } else {
                                wt.close();
                                plus.nativeUI.toast(app.configs.message.emptymsg, { duration: "short" });
                            }
                            $scope.orderslist = jsonarr;
                        } else {
                            wt.close();
                        }
                    }).
                    error(function (data) {
                        wt.close();
                        plus.nativeUI.toast(data, { duration: "short" });
                    });
                }
            }
            app.configs.listenLock.commissionorders();
            document.removeEventListener("plusscrollbottom", app.configs.listenLock.commissionorders, false);
            document.addEventListener("plusscrollbottom", app.configs.listenLock.commissionorders, false);
        };

        //详情
        $scope.showorderdetail = function (orderid) {
            $state.go('commorderdetail', { date: date, iswithdraw: iswithdraw,id:orderid });
        };

    }]);

});