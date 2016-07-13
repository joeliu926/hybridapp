define(function (require) {
    var app = require('../../../js/common/app.js');

    app.controller('customerorderscurCtrl', ['$scope', '$state', '$http', '$stateParams', function ($scope, $state, $http, $stateParams) {
        $scope.currentname = $stateParams.name;
        $scope.backid = $stateParams.id;

        var startdateform = document.querySelector("input[name=startdate]");
        var enddateform = document.querySelector("input[name=enddate]");
        var currentdate = new Date();
        startdateform.value = app.configs.message.defaultdate;
        enddateform.value = currentdate.dateInfo();

        if (typeof app.configs.listenLock.customerorderscur == 'function') {
            document.removeEventListener("plusscrollbottom", app.configs.listenLock.customerorderscur, false);
        }

        //分页数据请求
        $scope.customerordersinit = function () {
            if ((angular.isUndefined($stateParams.uid) || $stateParams.uid == -1) || (angular.isUndefined($stateParams.id) || $stateParams.id == -1)) {
                plus.nativeUI.alert("获取客户档案ID或者USERID失败!", function () {
                    $state.go('customerdetail', { id: $stateParams.id });
                }, "警告", "返回上一页");
                return false;
            }
            var currentpage = 1;
            var jsonarr = new Array();
            $scope.orderslist = {};
            $scope.orders = {};
            $scope.orders.totalpage = 1;
            $scope.orders.startdate = startdateform.value;
            $scope.orders.enddate = enddateform.value;
            $scope.orders.buyerid = $stateParams.uid;

            app.configs.listenLock.customerorderscur = function (e) {
                //如是其它页则删除此监听
                if ($state.current.name != 'customerorderscur') {
                    document.removeEventListener("plusscrollbottom", app.configs.listenLock.customerorderscur, false);
                    return false;
                }
                var state = currentpage > $scope.orders.totalpage;
                if (!state) {
                    var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
                    $scope.orders.currentpage = currentpage++;
                    $http({ method: 'POST', url: app.configs.orders.cusorderlist, data: $scope.orders }).
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
                        }
                    }).
                    error(function (data) {
                        wt.close();
                        plus.nativeUI.toast(data, { duration: "short" });
                    });
                }
            }
            app.configs.listenLock.customerorderscur();
            document.removeEventListener("plusscrollbottom", app.configs.listenLock.customerorderscur, false);
            document.addEventListener("plusscrollbottom", app.configs.listenLock.customerorderscur, false);
        };


        //开始日期选择搜索
        $scope.pickDate = function (when) {
            plus.nativeUI.pickDate(function (e) {
                var d = e.date;
                if (when == 'start') {
                    $scope.orders.startdate = d.dateInfo("yyyy-MM-dd");
                    startdateform.value = $scope.orders.startdate;
                    startdateform.blur();
                } else if (when == 'end') {
                    $scope.orders.enddate = d.dateInfo("yyyy-MM-dd");
                    enddateform.value = $scope.orders.enddate;
                    enddateform.blur();
                }
            }, function (e) {
                plus.nativeUI.toast("未选择日期：" + e.message, { duration: "short" });
            });
        };


        //跳转详情
        $scope.showorderdetailcur = function (orderid) {
            $state.go('orderdetailcur', { id: orderid, uid: $stateParams.uid, cid: $stateParams.id, name: $scope.currentname });
        };


    }]);

});