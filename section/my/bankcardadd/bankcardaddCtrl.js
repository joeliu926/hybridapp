define(function (require) {
    var app = require('../../../js/common/app.js');
    var countdown = 60;
    app.controller('bankcardaddCtrl', ['$scope', '$state', '$http', '$timeout', function ($scope, $state, $http, $timeout) {

        $scope.bankcard = {};
        $scope.verifytext = "获取验证码";
        $scope.isdisabled = false;
        $scope.committext = "确认";

        //获取真实姓名
        $scope.getrealname = function () {
            var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
            $http({ method: 'POST', url: app.configs.my.userrealname }).
            success(function (data) {
                wt.close();
                if (data) {
                    $scope.bankcard.name = data;
                }
            }).
            error(function (data) {
                wt.close();
                plus.nativeUI.toast(data, { duration: "short" });
            });
        };

        $scope.getrealname();

        //获取卡类型
        $scope.getcardtype = function () {
            var regular = new RegExp(/^(\d{16}|\d{17}|\d{18}|\d{19})$/);
            if (!regular.test($scope.bankcard.cardnumber)) {
                var cardnumberDom = document.querySelector("input[name=cardnumber]");
                cardnumberDom.focus();
                plus.nativeUI.toast(app.configs.message.cardtype, { duration: "short" });
                return false;
            }

            var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
            $http({ method: 'POST', url: app.configs.my.cardtype, data: { code: $scope.bankcard.cardnumber } }).
            success(function (data) {
                wt.close();
                if (data.Code) {
                    $scope.bankcard.cardtype = data.Name;
                } else {
                    plus.nativeUI.toast(app.configs.message.cardtypeerr, { duration: "short" });
                }
            }).
            error(function (data) {
                plus.nativeUI.toast(data, { duration: "short" });
                wt.close();
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
            if ($scope.bankcard.phonenumber == '' || $scope.bankcard.phonenumber == null || $scope.bankcard.phonenumber == 'undefined') {
                plus.nativeUI.toast(app.configs.message.phoneempty);
                return false;
            }
            $scope.settime();
            var param = { phonenumber: $scope.bankcard.phonenumber };
            $http({ method: 'POST', url: app.configs.my.msgCode, data: param }).
            success(function (data) {
                if (data) {
                    var msg = "";
                    msg = angular.isUndefined(data.error) ? data.ResultMessage : data.error;
                    plus.nativeUI.toast(msg);
                }
            }).
            error(function (data) {
                plus.nativeUI.toast(data);
            });
        };

        //地址选择
        $scope.selectaddress = function (parentid, flag) {
            if (flag) {
                $scope.addressreadonly = $scope.bankcard.address = "";
            }
            var bts = [];
            var param = { pid: parentid };
            $http({ method: 'POST', url: app.configs.user.address, data: param }).
            success(function (data) {
                if (data) {
                    if (data.length > 0) {
                        if (data[0].code.length <= 6) {
                            angular.forEach(data, function (item, index, array) {
                                var temp = {};
                                temp.title = item.name;
                                temp.code = item.code;
                                bts.push(temp);
                            });
                            plus.nativeUI.actionSheet({ title: "选择区域", cancel: "取消", buttons: bts },
                               function (e) {
                                   if (e.index > 0) {
                                       $scope.bankcard.address += (bts[e.index - 1].title + "-" + bts[e.index - 1].code + ",");
                                       $scope.addressreadonly += bts[e.index - 1].title;
                                       $scope.selectaddress(bts[e.index - 1].code, false);
                                   }
                               }
                           );
                        }
                    }
                }
            }).
            error(function (data) {
                plus.nativeUI.toast(data);
            });

        };

        //提交
        $scope.commit = function () {

            var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
            $http({ method: 'POST', url: app.configs.my.cardadd, data: $scope.bankcard }).
             success(function (data) {
                 wt.close();
                 if (data) {
                     if (angular.isUndefined(data.error)) {
                         plus.nativeUI.toast(data.ResultMessage);
                         if (data.Result == true) {
                             $state.go('mybankcard');
                         }
                     } else {
                         plus.nativeUI.toast(data.error);
                     }
                 }
             }).
             error(function (data) {
                 wt.close();
                 plus.nativeUI.toast(data, { duration: "short" });
             });
        };

    }]);//end controller

});