define(function (require) {
    var app = require('../../../js/common/app.js');
    var countdown = 60;

    function plusReady() { }
    if (window.plus) {
        plusReady();
    } else {
        document.addEventListener('plusready', plusReady, false);
    }

    //AngularJs控制器
    app.controller('registerCtrl', ['$scope', '$http','$timeout', '$state', function ($scope, $http,$timeout, $state) {

        $scope.committext = $scope.registertext = "注册";
        $scope.verifytext = "获取验证码";
        $scope.isdisabled = false;
        $scope.register = {};
        $scope.addressreadonly = "";

        //注册提交
        $scope.commit = function(){
            if ($scope.register.pwd.length < 6) {
                plus.nativeUI.toast(app.configs.message.pwdlength);
                return false;
            }
            if ($scope.register.pwdconfirm != $scope.register.pwd) {
                plus.nativeUI.toast(app.configs.message.pwdconfirm);
                return false;
            }
            var addressStr = $scope.register.address;
            var addressArr = addressStr.split(",");
            addressArr.splice(addressArr.length - 1,1);
            if (addressArr.length < 4) {
                plus.nativeUI.toast(app.configs.message.address);
                return false;
            }

            var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
            $http({ method: 'POST', url: app.configs.user.register, data: $scope.register }).
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
                 wt.close();
             }).
             error(function (data, status, headers, config) {
                 plus.nativeUI.toast(data, { duration: "short" });
                 wt.close();
             });
        };

        //地址选择
        $scope.selectaddress = function (parentid, flag) {
            if (flag) {
                $scope.addressreadonly = $scope.register.address = "";
            }
            var bts = [];
            var param = { pid: parentid };
            $http({ method: 'POST', url: app.configs.user.address, data: param }).
            success(function (data, status, headers, config) {
                if (data) {
                    if (data.length > 0) {
                        angular.forEach(data, function (item, index, array) {
                            var temp = {};
                            temp.title = item.name;
                            temp.code = item.code;
                            bts.push(temp);
                        });
                        plus.nativeUI.actionSheet({ title: "选择区域", cancel: "取消", buttons: bts },
                           function (e) {
                               if (e.index > 0) {
                                   $scope.register.address += (bts[e.index - 1].title + "-" + bts[e.index - 1].code + ",");
                                   $scope.addressreadonly += bts[e.index - 1].title;
                                   $scope.selectaddress(bts[e.index - 1].code, false);
                               }
                           }
                       );
                    }
                }
            }).
            error(function (data, status, headers, config) {
                plus.nativeUI.toast(data);
            });

        };

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

            if ($scope.register.phonenum == '' || $scope.register.phonenum == null || $scope.register.phonenum == 'undefined') {
                plus.nativeUI.toast(app.configs.message.phoneempty);
                return false;
            }
            $scope.settime();

            var param = { phonenum: $scope.register.phonenum };
            $http({ method: 'POST', url: app.configs.user.messageCode, data: param }).
            success(function (data, status, headers, config) {
                if (data) {
                    var msg = "";
                    msg = angular.isUndefined(data.error) ? data.ResultMessage : data.error;
                    plus.nativeUI.toast(msg);
                }
            }).
            error(function (data, status, headers, config) {
                plus.nativeUI.toast(data);
            });
        };



        //控制器end
    }]);




});