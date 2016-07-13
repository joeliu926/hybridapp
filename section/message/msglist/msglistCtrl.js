define(function (require) {
    var app = require('../../../js/common/app.js');
    app.controller('msglistCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {

        var startdate = document.querySelector("#startdate");
        var enddate = document.querySelector("#enddate");
        startdate.addEventListener("click", function (e) {
            plus.nativeUI.pickDate(function (e) {
                var d = e.date;
                startdate.value = d.dateInfo("yyyy-MM-dd");
                startdate.blur();
            }, function (e) {
                plus.nativeUI.alert("未选择起始日期：" + e.message, function () {
                    startdate.value = "";
                }, "选择错误", "关闭")
            }, {
                title: "请选择起始日期",
                date: new Date(startdate.value),
                maxDate: new Date(enddate.value)
            });
        });
    
        enddate.addEventListener("click", function () {
            plus.nativeUI.pickDate(function (e) {
                var d = e.date;
                enddate.value = d.dateInfo("yyyy-MM-dd");
                enddate.blur();
            }, function (e) {
                plus.nativeUI.alert("未选择结束日期：" + e.message, function () {
                    enddate.value = "";
                }, "选择错误", "关闭")
            }, {
                title: "请选择结束日期",
                date: new Date(enddate.value),
                minDate: new Date(startdate.value)
            });
        });
        $scope.msgList = {};
        $scope.searchcondition = {};
        var currentdate = new Date();
        startdate.value = app.configs.message.defaultdate;   
        enddate.value = currentdate.dateInfo();
        /////////////////////////下拉刷新start////////////////////////////////////

        if (typeof app.configs.listenLock.msglist == 'function') {
            document.removeEventListener("plusscrollbottom", app.configs.listenLock.msglist, false);
        }

        $scope.iniloaddata = function () {
            var ccount = 1;
            var jsonarr = new Array();
            $scope.msgList = {};
            $scope.searchcondition = {};
            $scope.searchcondition.TotalPage = 1;
            $scope.searchcondition.startdate = startdate.value;
            $scope.searchcondition.enddate = enddate.value;

            app.configs.listenLock.msglist = function (e) {
                //如是其它页则删除此监听
                if ($state.current.name != 'msglist') {
                    document.removeEventListener("plusscrollbottom", app.configs.listenLock.msglist, false);
                    return false;
                }
               var state = ccount > $scope.searchcondition.TotalPage;
               if (!state) {
                   $scope.searchcondition.CurrentPage = ccount++;
                       plus.nativeUI.showWaiting();
                        var purl = app.configs.msgifgo.msglist;
                        $http.post(purl, $scope.searchcondition).success(function (data) {
                            if (data.Item && data.Item.length > 0) {
                                var jlist = data.Item;
                                for (var i in jlist) {
                                    jsonarr.push(jlist[i]);
                                }
                                $scope.searchcondition.TotalPage = data.Page.TotalPage;
                            } else {
                                plus.nativeUI.toast(app.configs.message.emptymsg, { duration: "short" });
                            }
                            $scope.msgList = jsonarr;
                            plus.nativeUI.closeWaiting();
                        }).error(function (data) {
                            alert(data);
                           plus.nativeUI.closeWaiting();
                        });
                } else {
                    plus.nativeUI.toast(app.configs.message.emptymsg, { duration: "short" });
                }
            }
            app.configs.listenLock.msglist();
            document.removeEventListener("plusscrollbottom", app.configs.listenLock.msglist, false);
            document.addEventListener("plusscrollbottom", app.configs.listenLock.msglist, false);
        };

        /////////////////////////下拉刷新end////////////////////////////////////
    }]);

});
