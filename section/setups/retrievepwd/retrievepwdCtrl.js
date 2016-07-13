define(function (require) {
    var app = require('../../../js/common/app.js');
    var countdown = 60;

    function plusReady() {}
    if (window.plus) {
        plusReady();
    } else {
        document.addEventListener('plusready', plusReady, false);
    }

    app.controller('retrievepwdCtrl', ['$scope', '$http', '$timeout', '$state', function ($scope, $http, $timeout, $state) {

        $scope.retrievepwd = {};
        $scope.verifytext = "获取验证码";
        $scope.isdisabled = false;
        
        //验证码计数
        $scope.settime = function () {
            if (countdown == 0) {
                $scope.isdisabled = false;
                $scope.verifytext = "获取确认码";
                countdown = 60;
            } else {
                $scope.isdisabled = true;
                $scope.verifytext = "重新发送(" + countdown + ")";
                countdown--;
                $timeout(function () {
                    $scope.settime();
                }, 1000);
            }
        };
        //获取验证码
        $scope.getverifycode = function () {

            /*
            var phone = document.querySelector("input[name=phonenum]");
            if (phone.value == '' || phone.value == null || phone.value == 'undefined') {
                plus.nativeUI.toast(app.configs.message.phoneempty);
                return false;
            }
            */

            if ($scope.retrievepwd.phonenum == '' || $scope.retrievepwd.phonenum == null || $scope.retrievepwd.phonenum == 'undefined') {
                plus.nativeUI.toast(app.configs.message.phoneempty);
                return false;
            }
            $scope.settime();

            var param = { phonenum: $scope.retrievepwd.phonenum };
            $http({ method: 'POST', url: app.configs.user.messageCode, data: param }).
            success(function (data, status, headers, config) {
                if (data) {
                    if (angular.isUndefined(data.error)) {
                        plus.nativeUI.toast(data.ResultMessage);
                    } else {
                        plus.nativeUI.toast(data.error);
                    }
                }
            }).
            error(function (data, status, headers, config) {

            });
        };
        /*
        //非空验证
        $scope.vilidate = function () { 
            //for (var item in $scope.retrievepwd) {
            //    alert(item);
            //}
            angular.forEach($scope.retrievepwd, function (item) {
                alert(item)
            });
        };
        */

        //提交
        $scope.committext = "确   定";
        $scope.commit = function () {
            /*
            if ($scope.retrievepwd.pwd == '' || $scope.retrievepwd.pwd == null || $scope.retrievepwd.pwd == 'undefined') {
                plus.nativeUI.toast(app.configs.message.pwdempty);
                return false;
            }
            */
            if ($scope.retrievepwd.pwd.length < 6) {
                plus.nativeUI.toast(app.configs.message.pwdlength);
                return false;
            }
            if ($scope.retrievepwd.pwdconfirm != $scope.retrievepwd.pwd) {
                plus.nativeUI.toast(app.configs.message.pwdconfirm);
                return false;
            }
            $http({ method: 'POST', url: app.configs.user.findPassword, data: $scope.retrievepwd }).
             success(function (data, status, headers, config) {
                 if (data) {
                     if (angular.isUndefined(data.error)) {
                         plus.nativeUI.toast(data.ResultMessage);
                         if (data.Result == true) {
                             $state.go('login');
                         }
                     } else {
                         plus.nativeUI.toast(data.error);
                     }
                 }
             }).
             error(function (data, status, headers, config) {

             });
        };


    //控制器结束
    }]);




});