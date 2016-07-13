define(function (require) {
    var app = require('../../../js/common/app.js');

    app.controller('setupCtrl', ['$scope', '$state', '$http', '$timeout', function ($scope, $state, $http, $timeout) {
         
        if (!app.configs.isLogin()) {
            plus.nativeUI.toast(app.configs.message.logininfo);
            $state.go('login');
            return false;
        };
      
        $scope.version = "当前版本：[" + plus.runtime.version + "]";

        $scope.clearcache = function () {
            var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
            plus.cache.clear(function () {
                $timeout(function () {
                    wt.close();
                    plus.nativeUI.toast(app.configs.message.clearcache, { duration: "short" });
                }, 1000);
            });
        };

        $scope.cexit = function () {
            var purl = app.configs.user.logout;
            plus.nativeUI.confirm(app.configs.message.logoutmsg, function (e) {
                if (e.index == 1) {
                    $http.post(purl).success(function (data) {
                        //plus.runtime.quit();
                        plus.cache.clear(function () { });
                        $state.go('login');
                    });
                    //if ('iOS' == plus.os.name) {
                    //    plus.nativeUI.toast(app.configs.message.quittips, { duration: "short" });
                    //}
                };
            }, app.configs.message.logout, [app.configs.message.cancel, app.configs.message.ensure]);
        };


        $scope.checkversion = function () {

            $http({ method: 'Get', url: app.configs.user.versionpath }).
            success(function (data) {
                if (data) {
                    if (plus.os.name == "Android") {
                        //安桌升级处理
                        if (plus.runtime.version != data.Andiord) {
                            if (confirm("系统检测到新版是否安装？")) {
                             
                                var url = data.Andiordurl; // 下载文件地址
                                var dtask = plus.downloader.createDownload(url, {}, function (d, status) {
                                    if (status == 200) { // 下载成功
                                        var path = d.filename;
                                        plus.runtime.install(path);

                                    } else {//下载失败
                                        alert("Download failed: " + status);
                                    }
                                });
                                dtask.start();
                            }
                        }
                        else { alert("当前版本已是最新版本！"); }
                    }
                    if (plus.os.name == "iOS") {
                        //IOS升级处理
                        if (plus.runtime.version != data.Ios) {
                            if (confirm("系统检测到新版是否安装？")) {
                                var url = data.Iosurl; // 下载文件地址
                                plus.runtime.openURL(url);
                            }
                        }
                        else { alert("当前版本已是最新版本！"); }
                    }
                }
            }).error(function (data) { plus.nativeUI.toast("版本检测错误"); });
        }
    }]);

});