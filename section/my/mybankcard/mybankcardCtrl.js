define(function (require) {
    var app = require('../../../js/common/app.js');

    //卡类型过滤器
    app.filter("mySubstr", function () {
        return function (input, sep, bool) {
            sep = sep || "";
            input = input || "";
            if (sep == undefined || sep == "" || sep == null) {
                return input;
            }
            var start = input.indexOf(sep);
            if (start != -1) {
                if (bool) {
                    return input.substring(0, start);
                }
                return input.substr(start + 1);
            }
            return input;
        }
    });

    //卡图片过滤器
    app.filter("myImgsrc", function () {
        return function (input) {
            var name = ['工商','农业','建设','中国','交行','交通','光大','中信','招商','浦发','民生','华夏','北京','浙商','兴业'];
            var src =
            [
                'img/bank/gongshang.png', 'img/bank/nongye.png', 'img/bank/jianshe.png', 'img/bank/zhongguo.png', 'img/bank/jiaotong.png','img/bank/jiaotong.png', 'img/bank/guangda.png', 'img/bank/zhongxin.png',
                'img/bank/zhaoshang.png', 'img/bank/pufa.png', 'img/bank/minsheng.png', 'img/bank/huaxia.png', 'img/bank/beijin.png', 'img/bank/zheshang.png', 'img/bank/xingye.png'
            ];
            var out = "";
            if (name.length == src.length) {
                for (var i = 0; i < name.length; i++) {
                    var start = input.indexOf(name[i]);
                    if (start != -1) {
                        out = src[i];
                        break;
                    }
                }
            }
            return out;
        }
    });

    //卡背景过滤器
    app.filter("myBackGround", function () {
        return function (input) {
            var name = ['工商', '农业', '建设', '中国', '交行','交通', '光大', '中信', '招商', '浦发', '民生', '华夏', '北京', '浙商', '兴业'];
            var src =
            [
                '#e85376', '#15cbc2', '#1c69c8', '#f93d44', '#3b41ff', '#3b41ff', '#c28d04', '#ff2b3b', '#f23c49', '#3c7ecf', '#41af64', '#f3515d', '#e30c1c', '#dbb10b', '#0e68c7'
            ];
            var out = "#06A3E3";
            if (name.length == src.length) {
                for (var i = 0; i < name.length; i++) {
                    var start = input.indexOf(name[i]);
                    if (start != -1) {
                        out = src[i];
                        break;
                    }
                }
            }
            return out;
        }
    });

    //控制器
    app.controller('mybankcardCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {

        if (typeof app.configs.listenLock.mybankcard == 'function') {
            document.removeEventListener("plusscrollbottom", app.configs.listenLock.mybankcard, false);
        }

        //分页数据请求
        $scope.mybankcardinit = function () {
            var currentpage = 1;
            var jsonarr = new Array();
            $scope.bankcardlist = {};
            $scope.mybank = {};
            $scope.mybank.totalpage = 1;
            $scope.mybank.startdate = "";
            $scope.mybank.enddate = "";

            app.configs.listenLock.mybankcard = function (e) {
                //如是其它页则删除此监听
                if ($state.current.name != 'mybankcard') {
                    document.removeEventListener("plusscrollbottom", app.configs.listenLock.mybankcard, false);
                    return false;
                }
                var state = currentpage > $scope.mybank.totalpage;
                if (!state) {
                    var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
                    $scope.mybank.currentpage = currentpage++;
                    $http({ method: 'POST', url: app.configs.my.bankcardList, data: $scope.mybank }).
                    success(function (data) {
                        wt.close();
                        if (data) {
                            if (data.Item && data.Item.length > 0) {
                                var list = data.Item;
                                for (var i in list) {
                                    jsonarr.push(list[i]);
                                }
                                $scope.mybank.totalpage = data.Page.TotalPage;
                            } else {
                                plus.nativeUI.toast(app.configs.message.emptymsg, { duration: "short" });
                            }
                            $scope.bankcardlist = jsonarr;
                        }
                    }).
                    error(function (data) {
                        wt.close();
                        plus.nativeUI.toast(data, { duration: "short" });
                    });
                }
            }
            app.configs.listenLock.mybankcard();
            document.removeEventListener("plusscrollbottom", app.configs.listenLock.mybankcard, false);
            document.addEventListener("plusscrollbottom", app.configs.listenLock.mybankcard, false);
        };

        //点击删除
        $scope.deleteItem = function (number,id) {
            var bts = [{ title: "删除银行卡" }];
            plus.nativeUI.actionSheet({ title: "银行卡操作", cancel: "取消", buttons: bts },
                function (e) {
                    switch (e.index) {
                        case 0:
                            break;
                        case 1:
                            var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
                            $http({ method: 'POST', url: app.configs.my.delcard, data: { id: id } }).
                            success(function (data) {
                                wt.close();
                                if (data) {
                                    plus.nativeUI.toast(data.ResultMessage, { duration: "short" });
                                    if (data.Result == true) {
                                        $scope.bankcardlist.splice(number, 1);
                                        $scope.$apply();
                                    }
                                }
                            }).
                            error(function (data) {
                                wt.close();
                                plus.nativeUI.toast(data, { duration: "short" });
                            });
                            break;
                    }
                }
            );
        };
      

    }]);

});