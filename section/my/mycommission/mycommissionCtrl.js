define(function (require) {
    var app = require('../../../js/common/app.js');

    //卡类型过滤器
    app.filter("mySubstr", function () {
        return function (input, sep, bool) {  
            sep = sep || "";
            input = input ||"";
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
            input = input || "";
            var name = ['工商', '农业', '建设', '中国', '交行','交通', '光大', '中信', '招商', '浦发', '民生', '华夏', '北京', '浙商', '兴业'];
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
                '#e85376', '#15cbc2', '#1c69c8', '#f93d44', '#3b41ff','#3b41ff', '#c28d04', '#ff2b3b','#f23c49', '#3c7ecf', '#41af64', '#f3515d', '#e30c1c', '#dbb10b', '#0e68c7'
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
    app.controller('mycommissionCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {

        $scope.commissioncommit = {};
        $scope.commission = {};
        $scope.commission.totalprice = $scope.commission.withdrawalpercent = $scope.commission.withdrawalprice = $scope.commission.haswithdrawalprice = $scope.commission.issalesmanwithdraw = 0;

        var startdateform = document.querySelector("input[name=startdate]");
        var enddateform = document.querySelector("input[name=enddate]");
        var currentdate = new Date();
        startdateform.value = app.configs.message.defaultdate;
        enddateform.value = currentdate.dateInfo();

        //获取默认银行卡
        $scope.getdefaultcard = function () {
            var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
            $http({ method: 'POST', url: app.configs.my.defaultcard }).
            success(function (data) {
                wt.close();
                if (data) {
                    if (data.error) {
                        plus.nativeUI.toast(data.error, { duration: "short" });
                    } else {
                        $scope.commissioncommit.bankname = data.BankName;
                        $scope.commissioncommit.cardnumber = data.CardNumber;
                        $scope.commissioncommit.cardid = data.Id;
                    }
                }
            }).
            error(function (data) {
                wt.close();
                plus.nativeUI.toast(data, { duration: "short" });
            });
        };
        $scope.getdefaultcard();

        if (typeof app.configs.listenLock.mycommission == 'function') {
            document.removeEventListener("plusscrollbottom", app.configs.listenLock.mycommission, false);
        }

        //佣金列表
        $scope.searchCommission = function () {
            
            var currentpage = 1;
            var jsonarr = new Array();
            $scope.commissionlist = {};
            $scope.commission.totalpage = 1;
            $scope.commission.startdate = startdateform.value;
            $scope.commission.enddate = enddateform.value;
            var state = $scope.commission.currentprice = 0;
            app.configs.listenLock.mycommission = function (e) {
                //如是其它页则删除此监听
                if ($state.current.name != 'mycommission') {
                    document.removeEventListener("plusscrollbottom", app.configs.listenLock.mycommission, false);
                    return false;
                }
                state = currentpage > $scope.commission.totalpage;
                if (!state) {
                    var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
                    $scope.commission.currentpage = currentpage++;
                    var param =
                    {
                        startdate:$scope.commission.startdate,
                        enddate:$scope.commission.enddate,
                        currentpage:$scope.commission.currentpage,
                        issalesmanwithdraw: $scope.commission.issalesmanwithdraw
                    };
                    $http({ method: 'POST', url: app.configs.my.scommission, data: param}).
                    success(function (data) {
                        if (data) {
                            if (data.Item && data.Item.length > 0) {
                                var list = data.Item;
                                for (var i in list) {
                                    jsonarr.push(list[i]);
                                }
                                $scope.commission.totalpage = data.Page.TotalPage;
                                $scope.commission.totalprice = data.TotalPrice;
                                $scope.commission.withdrawalpercent = data.WithdrawalPercent;
                                $scope.commission.withdrawalprice = data.WithdrawalPrice;
                                $scope.commission.haswithdrawalprice = data.HasWithdrawalPrice;
                                wt.close();
                            } else {
                                wt.close();
                                //plus.nativeUI.toast(app.configs.message.emptymsg, { duration: "short" });
                            }
                            $scope.commissionlist = jsonarr;
                        } else {
                            wt.close();
                        }
                    }).
                    error(function (data) {
                        wt.close();
                        plus.nativeUI.toast(data, { duration: "short" });
                    });
                }
                else {
                    //plus.nativeUI.toast(app.configs.message.emptymsg, { duration: "short" });
                }
            }
            app.configs.listenLock.mycommission();
            document.removeEventListener("plusscrollbottom", app.configs.listenLock.mycommission, false);
            document.addEventListener("plusscrollbottom", app.configs.listenLock.mycommission, false);

        };

        //开始日期选择搜索
        startdate.addEventListener("click", function (e) {
            plus.nativeUI.pickDate(function (e) {
                var d = e.date;
                $scope.commission.startdate = d.dateInfo("yyyy-MM-dd");
                startdateform.value = $scope.commission.startdate;
                startdateform.blur();
            }, function (e) {
                $scope.commission.startdate = "";
                startdateform.value = $scope.commission.startdate;
                plus.nativeUI.toast("未选择日期：" + e.message, { duration: "short" });
            }, {
                title: "请选择起始日期",
                date: new Date(startdateform.value),
                maxDate: new Date(enddateform.value)
            });
        });

        //结束日期选择搜索
        enddate.addEventListener("click", function () {
            plus.nativeUI.pickDate(function (e) {
                var d = e.date;
                $scope.commission.enddate = d.dateInfo("yyyy-MM-dd");
                enddateform.value = $scope.commission.enddate;
                enddateform.blur();
            }, function (e) {
                $scope.commission.enddate = "";
                enddateform.value = $scope.commission.enddate;
                plus.nativeUI.toast("未选择日期：" + e.message, { duration: "short" });
            }, {
                title: "请选择结束日期",
                date: new Date(enddateform.value),
                minDate: new Date(startdateform.value),
                maxDate: new Date(enddateform.value)
            });
        });

        /*
        //全选
        $scope.selectAll = function () {
            var self = document.querySelector("#checkboxFourInput");
            var checkboxes = document.querySelectorAll("input[type=checkbox].citem");
            if (self.checked) {
                selectForeach(checkboxes, true);
            } else {
                selectForeach(checkboxes,false);
            }
            function selectForeach(checkboxes, isselected) {
                var arr = [];
                var price = 0;
                for (var i = 0, clength = checkboxes.length; i < clength; i++) {
                    if (isselected) {
                        checkboxes[i].checked = true;
                        arr.push(checkboxes[i].getAttribute("data-summarydate"));
                        price += parseFloat(checkboxes[i].getAttribute("data-commprice"));
                    } else {
                        checkboxes[i].checked = false;
                    }
                }
                $scope.commission.withdrawdates = arr.join('|');
                $scope.commission.currentprice = price;
            }
        };
        */

        //按状态显示
        $scope.sellectStatus = function (status) {
            switch (status) {
                case 0:
                    $scope.commission.issalesmanwithdraw = 0;
                    break;
                case 1:
                    $scope.commission.issalesmanwithdraw = 1;
                    break;
                case 2:
                    $scope.commission.issalesmanwithdraw = 2;
                    break;
                default:
                    $scope.commission.issalesmanwithdraw = 0;
            }
            $scope.searchCommission();
        };

        //分次选择
        $scope.checkchoice = function (item) {
            var checkboxes = document.querySelectorAll("input[type=checkbox].citem");
            var checkcount = price = 0;
            var arr = [];
            for (var i = 0, clength = checkboxes.length; i < clength; i++) {
                if (checkboxes[i].checked) {
                    arr.push(checkboxes[i].getAttribute("data-summarydate"));
                    price += parseFloat(checkboxes[i].getAttribute("data-commprice"));
                    checkcount++;
                }
            }
            $scope.commission.withdrawdates = arr.join('|');
            $scope.commission.currentprice = price;
        };

        //提现
        $scope.extractCommission = function () {


            //只有周一到周五早九晚六可以提现,国庆不能提现
            var myDate = new Date();
            var week = myDate.getDay();
            var month = myDate.getMonth();
            var house = myDate.getHours();

            if (week == 0 || week == 6 || house < 9 || house >= 18) {
                plus.nativeUI.alert("抱歉,周六日不能提现!\n提现时间满足:\n1.非节假日\n2.周一至周五(09:00-18:00)", function () {
                    return false;
                }, "提示", "确认");
                return false;
            }

            if (month == 9) {
                var mindate = 1, maxdate = 7;
                var date = myDate.getDate();
                if (date >= mindate && date <= maxdate) {
                    plus.nativeUI.alert("抱歉,国庆期间不能提现!\n提现时间满足:\n1.非节假日\n2.周一至周五(09:00-18:00)", function () {
                        return false;
                    }, "提示", "确认");
                    return false;
                }
            }


            //必须有默认银行卡
            if (angular.isUndefined($scope.commissioncommit.bankname) || angular.isUndefined($scope.commissioncommit.cardnumber) || angular.isUndefined($scope.commissioncommit.cardid)) {
                plus.nativeUI.toast(app.configs.message.carddefaulttips, { duration: "short" });
                return false;
            }

            //提现金额小于可提现金额
 
            if (parseFloat($scope.commission.currentprice.toFixed(1)) > parseFloat($scope.commission.withdrawalprice.toFixed(1))) {
                plus.nativeUI.toast(app.configs.message.commpriceerror, { duration: "short" });
                return false;
            }

            //必须选择佣金项
            var str = $scope.commission.withdrawdates || "";
            if (str == "" || str == undefined || str == null) {
                plus.nativeUI.alert("请选择提现佣金项", function () {
                    return false;
                }, "提示", "确认");
                return false;
            }




            //提现日期至少一天前
            var datesArr = str.split("|");
            for (var i = 0, length = datesArr.length; i < length; i++) {
                var commissiontime = new Date(datesArr[i].replace(/-/g, "/"));
                var currentdate = new Date();
                var days = currentdate.getTime() - commissiontime.getTime();
                var times = parseInt(days / (1000 * 60 * 60 * 24));
                if (times < 1) {
                    plus.nativeUI.alert("日期为[" + datesArr[i] + "]的佣金不能提取,您只能提现至少一天前的佣金", function () {
                        return false;
                    }, "提示", "确认");
                    return false;
                }
            }
            //输入备注提交
            plus.nativeUI.prompt(app.configs.message.commremark, function (e) {
                if (e.index == 0) {
                    var remark = e.value;
                    if (remark == "" || remark == undefined || remark == null) {
                        plus.nativeUI.toast(app.configs.message.commremark, { duration: "short" });
                        return false;
                    } else {
                        var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
                        var param =
                        {
                            cardid: $scope.commissioncommit.cardid,
                            cardnumber: $scope.commissioncommit.cardnumber,
                            remark: remark,
                            withdrawdates: $scope.commission.withdrawdates
                        };
                        var extracturl = app.configs.my.ecommission;
                        $http.post(extracturl, param).success(function (data) {
                            wt.close();
                            if (data) {
                                if (!angular.isUndefined(data.error)) {
                                    plus.nativeUI.toast(data.error, { duration: "short" });
                                } else {
                                    var str = data.ResultMessage;
                                    var arr = str.split("|");
                                    //plus.nativeUI.toast("订单总天数:"+arr[0]+"\n提现成功天数:"+arr[1]+"\n提现失败天数:"+arr[2], { duration: "short" });
                                    plus.nativeUI.toast("恭喜您，提现成功！", { duration: "short" });
                                    if (data.Result == true) {
                                        $scope.searchCommission();
                                    }
                                }
                            }
                        }).error(function (data) {
                            wt.close();
                            alert(data);
                        });
                    }
                }
            }, "提示", "请输入提现备注", ["提现", "取消"]);
        };

        //订单详情
        $scope.showroder = function (orderdate) {
            $state.go('commissionorders', { date: orderdate, iswithdraw: $scope.commission.issalesmanwithdraw });
        };

    }]);

});