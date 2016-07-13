define(function (require) {
    var app = require('../../../js/common/app.js');
    app.controller('chgpwdCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {
        if (!app.configs.isLogin()) {
            plus.nativeUI.toast(app.configs.message.logininfo);
            $state.go('login');
        };
        $scope.pwddata = {};
        $scope.ccommit = function () {
            var purl = app.configs.chgpwd.changepwd;// "/Login/ChangePwd";  // app.configs.chgpwd.changepwd;
            $http.post(purl, $scope.pwddata).success(function (data) {
                if (data == "OK") {
                    plus.nativeUI.toast(app.configs.message.changesuccess, { duration: "long" });
                    plus.nativeUI.showWaiting();
                    setTimeout(function () {
                        $state.go('login');
                        plus.nativeUI.closeWaiting();
                    }, 300);
                } else {
                    if (data.FALSE) {
                        plus.nativeUI.toast(data.FALSE, { duration: "short" });
                        $state.go('login');
                    } else {
                        plus.nativeUI.alert(data, function () {
                        }, app.configs.message.changefaild, app.configs.message.close);
                    }               
                }

            }).error(function (data) {
                alert(data);
            });
        };
    }]);

});