define(function (require) {
    var app = require('../../../js/common/app.js');

    app.controller('mycustomerCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {
        $scope.customerinfo = {};
        $scope.customerinfo.isvisited = "拜访";
        
        var startdateform = document.querySelector("input[name=startdate]");
        var enddateform = document.querySelector("input[name=enddate]");
        var currentdate = new Date();
        startdateform.value = app.configs.message.defaultdate;
        var nextDate = new Date(currentdate.getTime() + 24 * 60 * 60 * 1000);
        enddateform.value = nextDate.dateInfo();

        if (typeof app.configs.listenLock.mycustomer == 'function') { 
        document.removeEventListener("plusscrollbottom", app.configs.listenLock.mycustomer, false);
        }
        $scope.customerlist = {};
        //分页数据请求
        $scope.mycustomerinit = function () { 

            var currentpage = 1;
            var jsonarr = new Array();
            $scope.mycus = {};
            $scope.mycus.totalpage = 1;
            $scope.mycus.startdate = startdateform.value;
            $scope.mycus.enddate = enddateform.value;
            var state = 0;
            app.configs.listenLock.mycustomer = function (e) {
                //如是其它页则删除此监听
                if ($state.current.name != 'mycustomer')
                {
                    document.removeEventListener("plusscrollbottom", app.configs.listenLock.mycustomer, false);
                    return false;
                }
                state = currentpage > $scope.mycus.totalpage; 
                if (!state) {
                    var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
                    $scope.mycus.currentpage = currentpage++;
                    app.configs.customer.cusList = app.configs.customer.cusList + "?s=" + (Math.random() * 1000);
                    $http({ method: 'POST', url: app.configs.customer.cusList, data: $scope.mycus }).
                    success(function (data) {
                        if (data) {
                            if (data.Item && data.Item.length > 0) {
                                var list = data.Item;
                                for (var i in list) {
                                    jsonarr.push(list[i]);
                                }
                                $scope.mycus.totalpage = data.Page.TotalPage;
                                wt.close();
                            } else {
                                wt.close();
                                plus.nativeUI.toast(app.configs.message.emptymsg, { duration: "short" });
                            }
                            $scope.customerlist = jsonarr;
                           // $scope.$apply();
                        }
                    }).
                    error(function (data) {
                        wt.close();
                        plus.nativeUI.toast(data, { duration: "short" });
                    });
                }
                else {
                    plus.nativeUI.toast(app.configs.message.emptymsg, { duration: "short" });
                }
            }
            app.configs.listenLock.mycustomer();
            document.removeEventListener("plusscrollbottom", app.configs.listenLock.mycustomer, false);
            document.addEventListener("plusscrollbottom", app.configs.listenLock.mycustomer, false); 
        };

   

        //日期选择搜索
        $scope.pickDate = function (when) {
            /*
            var Context = plus.android.importClass("android.content.Context");
            var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
            var main = plus.android.runtimeMainActivity();
            var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.hideSoftInputFromWindow(0, InputMethodManager.HIDE_NOT_ALWAYS);
            alert('dd');
            //((InputMethodManager)getSystemService(INPUT_METHOD_SERVICE)).hideSoftInputFromWindow(WidgetSearchActivity.this.getCurrentFocus().getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS);  
            */
            plus.nativeUI.pickDate(function (e) {
                var d = e.date;
                if (when == 'start') {
                    $scope.mycus.startdate = d.dateInfo("yyyy-MM-dd");
                    startdateform.value = $scope.mycus.startdate;
                    startdateform.blur();
                } else if (when == 'end') {
                    $scope.mycus.enddate = d.dateInfo("yyyy-MM-dd");
                    enddateform.value = $scope.mycus.enddate;
                    enddateform.blur();
                }
            }, function (e) {
                plus.nativeUI.toast("未选择日期：" + e.message, { duration: "short" });
            });
        };


    }]);

});