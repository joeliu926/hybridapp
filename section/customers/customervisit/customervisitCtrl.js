define(function (require) {
    var app = require('../../../js/common/app.js');
     
    app.controller('customervisitCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {

        var startdateform = document.querySelector("input[name=startdate]");
        var enddateform = document.querySelector("input[name=enddate]");
        var currentdate = new Date();
        startdateform.value = app.configs.message.defaultdate;
        enddateform.value = currentdate.dateInfo();

        if (typeof app.configs.listenLock.customervisit == 'function') {
            document.removeEventListener("plusscrollbottom", app.configs.listenLock.customervisit, false);
        }

        //分页数据请求
        $scope.custimervisitinit = function () {
            
            var currentpage = 1;
            var jsonarr = new Array();
            $scope.visitlist = {};
            $scope.visit = {};
            $scope.visit.totalpage = 1;
            $scope.visit.startdate = startdateform.value;
            $scope.visit.enddate = enddateform.value;

            app.configs.listenLock.customervisit = function (e) {
                //如是其它页则删除此监听
                if ($state.current.name != 'customervisit') {
                    document.removeEventListener("plusscrollbottom", app.configs.listenLock.customervisit, false);
                    return false;
                }
                var state = currentpage > $scope.visit.totalpage;
                if (!state) {
                    var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
                    $scope.visit.currentpage = currentpage++;
                    $http({ method: 'POST', url: app.configs.customer.visitlist, data: $scope.visit }).
                    success(function (data) {
                        if (data) {
                            if (data.Item && data.Item.length > 0) {
                                var list = data.Item;
                                for (var i in list) {
                                    jsonarr.push(list[i]);
                                }
                                $scope.visit.totalpage = data.Page.TotalPage;
                                wt.close();
                            } else {
                                if (data.error) {
                                    wt.close();
                                    plus.nativeUI.toast(data.error, { duration: "short" });
                                }
                            }
                            $scope.visitlist = jsonarr;
                        }
                    }).
                    error(function (data) {
                        wt.close();
                        plus.nativeUI.toast(data, { duration: "short" });
                    });
                } else {
                    plus.nativeUI.toast(app.configs.message.emptymsg, { duration: "short" });
                }
            }
            app.configs.listenLock.customervisit();
            document.removeEventListener("plusscrollbottom", app.configs.listenLock.customervisit, false);
            document.addEventListener("plusscrollbottom", app.configs.listenLock.customervisit, false);
          
        };

        //日期选择搜索
        $scope.pickDate = function (when) {
            plus.nativeUI.pickDate(function (e) {
                var d = e.date;
                if (when == 'start') {
                    $scope.visit.startdate = d.dateInfo("yyyy-MM-dd");
                    startdateform.value = $scope.visit.startdate;
                    startdateform.blur();
                } else if(when == 'end') {
                    $scope.visit.enddate = d.dateInfo("yyyy-MM-dd");
                    enddateform.value = $scope.visit.enddate;
                    enddateform.blur();
                }
            }, function (e) {
                plus.nativeUI.toast("未选择日期：" + e.message, { duration: "short" });
            });
        };



    }]);



});
