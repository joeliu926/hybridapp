define(function (require) {
    var app = require('/Mobile/js/common/app.js');

    var wcb = null;
    function plusReady() {
        if (wcb != null) {
            return;
        }
        wcb = plus.webview.currentWebview();
        wcb.setStyle({
            scrollIndicator: 'none'
        });
    }
    if (window.plus) {
        plusReady();
    } else {
        document.addEventListener('plusready', plusReady, false);
    } 

    app.controller('loginCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {
        $scope.time = (new Date()).getTime();
        var img = document.querySelector("#validate");
        var imgsrc = app.configs.user.VerifyImage + (new Date()).getTime();
        img.setAttribute("src", imgsrc);

        $scope.cgVcode = function () {
            //$scope.time = (new Date()).getTime();
            var vcode = document.querySelector("#vcode");
            vcode.value = "";
       
           imgsrc= app.configs.user.VerifyImage + (new Date()).getTime();
           img.setAttribute("src", imgsrc);
        };
        $scope.logindata={};
        $scope.login = function () {         
            var purl = app.configs.user.loginsb;
            $http.post(purl, $scope.logindata).success(function (data) {
                if (data == "OK") {
                    plus.nativeUI.toast(app.configs.message.loginsucess, { duration: "long" });
                    plus.nativeUI.showWaiting();
                    setTimeout(function () {
                        $state.go('home');
                        plus.nativeUI.closeWaiting();
                    }, 300);
                } else {
                    plus.nativeUI.alert(data, function (e) { 
                        $scope.cgVcode();
                    }, app.configs.message.loginfaild, app.configs.message.close);
                }
           
            }).error(function (data) {
                alert(data);
            });
        };
    }]);
});