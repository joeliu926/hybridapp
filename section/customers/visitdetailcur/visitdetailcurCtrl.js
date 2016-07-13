define(function (require) {
    var app = require('../../../js/common/app.js');
    if (window.plus) {
        plusReady();
    } else {
        document.addEventListener('plusready', plusReady, false);
    }
    function plusReady() {
        //两次点击返回
        var first = null;
        plus.key.addEventListener('backbutton', function () {
            //首次按键
            if (!first) {
                first = new Date().getTime();
                plus.nativeUI.toast("再按一次退出");
                setTimeout(function () {
                    first = null;
                }, 1000);
            } else {
                if (new Date().getTime() - first < 1000) {
                    plus.runtime.quit();
                }
            }
        }, false);
    };
    app.controller('visitdetailcurCtrl', ['$scope', '$state', '$http', '$stateParams', function ($scope, $state, $http, $stateParams) {
        //详情数据请求
        if ((angular.isUndefined($stateParams.id) || $stateParams.id == -1) || (angular.isUndefined($stateParams.cusid) || $stateParams.cusid == -1)) {
            plus.nativeUI.alert("获取拜访ID或者客户ID失败!", function () {
                if (angular.isUndefined($stateParams.cusid) && $stateParams.cusid != -1) {
                    $state.go('customervisitcur', { id: $stateParams.cusid });
                } else {
                    $state.go("customervisit");
                }
            }, "警告", "返回上一页");
            return false;
        }

        $scope.backid = $stateParams.cusid;
        $scope.currentname = $stateParams.name;
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
                        if (angular.isUndefined($stateParams.cusid) && $stateParams.cusid != -1) {
                            $state.go('customervisitcur', { id: $stateParams.cusid });
                        } else {
                            $state.go("customervisit");
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