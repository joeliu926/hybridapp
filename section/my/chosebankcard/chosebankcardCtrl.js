define(function (require) {
    var app = require('../../../js/common/app.js');

    app.controller('chosebankcardCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {
        
        //设置银行卡
        $scope.choseCard = function (iname, status) {
            status = Number(status);
            if (status != 1) {
                var msg = '在验证中';
                switch (status) {
                    case 2:
                        msg = '已禁用';
                        break;
                    case 4: break;
                        msg = '绑定失败';
                    case 5:
                    default:
                        break;
                }
                plus.nativeUI.toast('您的银行卡' + msg + ',不能设置为默认!');
                return false;
            }
            var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
            $http({ method: 'POST', url: app.configs.my.chosecard, data: { id: iname } }).
            success(function (data) {
                wt.close();
                if (data) {
                    plus.nativeUI.toast(data.ResultMessage);
                    if (data.Result == true) {
                        var cardlist = document.querySelectorAll("div.chitem");
                        for (var i = 0, cardlength = cardlist.length; i < cardlength; i++) {
                            if (cardlist[i].className.indexOf("bgfilter") < 0) {
                                cardlist[i].className = cardlist[i].className + " bgfilter";
                            }
                            var attrname = cardlist[i].getAttribute("cardname");
                            if (attrname == iname) {
                                cardlist[i].className = cardlist[i].className.replace(/bgfilter/g, "");
                            }
                        }
                        $state.go("mycommission");
                    }
                }
            }).
            error(function (data) {
                wt.close();
                plus.nativeUI.toast(data, { duration: "short" });
            });    
        };

        //银行卡列表
        $scope.items = {};
        $scope.cardlist = function () {
            var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
            var searchurl = app.configs.my.cardlist;
            $http.post(searchurl).success(function (data) {
                if (data && data.Item && data.Item.length > 0) {
                    $scope.items = data.Item;
                }
                wt.close();
            }).error(function (data) {
                wt.close();
                plus.nativeUI.toast(data, { duration: "short" });
            });
        };

    }]);

});