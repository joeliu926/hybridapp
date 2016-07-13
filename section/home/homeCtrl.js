define(function (require) {
    var app = require('/Mobile/js/common/app.js');

    var address = null, currentAdr = null, addComp = null, adrObj = null;
    var lat = 0, longt = 0, diff = 18;
    var diffres;
    var timer = null;
 

    if (window.plus) {
        plusReady();
    } else {
        document.addEventListener('plusready', plusReady, false);
    }
    function plusReady() {
        //两次点击返回
        var first = null; 

        plus.key.addEventListener('backbutton', function () {
            var currenturl = location.href;
            if (currenturl.indexOf("customeradd") > -1) {
                return false;
            }
            //if (currenturl.indexOf("home") + currenturl.indexOf("customerorders") + currenturl.indexOf("msglist") + currenturl.indexOf("mycustomer") + currenturl.indexOf("customervisit") < -4)
            //{
            //    history.go(-1);
            //    return false;
            //}

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
    app.service("homeservice", function () {
        this.update = function (h, v) {
            var ch = 0, cv = 0;
            if (h > 90) {
                h = 180 - h;
            } else if (h < -90) {
                h = -180 - h;
            }
            if (v > 90) {
                v = 180 - v;
            } else if (v < -90) {
                v = -180 - v;
            }
            h = h.toFixed(1);
            v = v.toFixed(1);

            ch = Math.abs(h);
            cv = Math.abs(v);
            return { "ch": ch, "cv": cv };
        }
    });

    app.controller('homeCtrl', ['$scope', '$http', '$state', '$window', '$stateParams', 'homeservice', function ($scope, $http, $state, $window, $stateParams, homeservice) {
        if (app.configs.listenLock.checkedversion == null)
        {
            app.configs.listenLock.checkedversion = "checked";
            $http({ method: 'Get', url: app.configs.user.versionpath}).
            success(function (data) {
                if (data) {
                    if (plus.os.name == "Android") {
                        //安桌升级处理
                        if (plus.runtime.version != data.Andiord) {
                            if(confirm("系统检测到新版是否安装？"))
                            {
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
                    }
                    if (plus.os.name == "iOS") {
                        //IOS升级处理
                        if (plus.runtime.version != data.Ios) {
                            if (confirm("系统检测到新版是否安装？")) { 
                                plus.runtime.openURL(data.Iosurl);
                            }
                        }
                    }
                }
            }).error(function (data) { plus.nativeUI.toast("版本检测错误"); });

        }
        if (!app.configs.isLogin()) {
            plus.nativeUI.toast(app.configs.message.logininfo);
            $state.go('login');
            return false;
        }; 
 
        //app.configs.listenLock.homeaudio = plus.audio.createPlayer(app.configs.home.playerpath);
        //app.configs.listenLock.homeaudio.play();

        //if (plus.os.name == "iOS")
        //{
        //    function audtioplay() {
        //        app.configs.listenLock.keepliveaudio = plus.audio.createPlayer(app.configs.home.playerkeep);
        //        app.configs.listenLock.keepliveaudio.play();
        //    }
        //    setInterval(audtioplay, 50);
        //}

        //可提现金额
        var spanhasprice = document.getElementById('spanhasprice');
        var spanwithprice = document.getElementById('spanwithprice');
        //计算机效果
        var drawprotects = 0;
        function drawprotect() { 
            var randseed = 0; 
            if (drawprotects < 4)
            {
                randseed = 10;
            }else if (drawprotects < 7) {
                randseed = 100;
            } else if (drawprotects <10) {
                randseed = 1000;
            }
            else if (drawprotects < 13) {
                randseed = 10000;
            } else {
                randseed = 10000;
            } 
            var randomnumwith = Math.random() * (randseed > 10 ? randseed / 10 : randseed);
            var randomnumhas = Math.random() * randseed;
           spanhasprice.innerHTML = parseInt(randomnumwith);
           spanwithprice.innerHTML = parseInt(randomnumhas);
            drawprotects += 1;
            if (drawprotects > 300) {
                clearInterval(drawtimer);
            }
        }

        drawtimer = setInterval(drawprotect, 50);

        //每隔五分钟签到一次
        function timerProc() {
            if ($state.current.name == 'home') {
                var mdt = new Date();
                if (mdt.getMinutes() % 5 == 0 && mdt.getSeconds() < 2) {
                    baidumapreush();
                }
            }
            else { clearInterval(timer); }
        }

        //app.configs.listenLock.maplock = function () {
        //    if ($state.current.name == 'home') {
        //        timer = setInterval(timerProc, 1000);
        //    }
        //    else {
        //        document.removeEventListener("pause", app.configs.listenLock.maplock, false);
        //    }
        //};


        //每隔五分钟签到一次IOS处理
        //if ('iOS' == plus.os.name) {
        //    document.addEventListener('pause', function () {
        //        timer = setInterval(timerProc, 1000);
        //    });
        //}

        //每隔五分钟签到一次IOS处理
        //if ('iOS' == plus.os.name) {
        //    if (typeof app.configs.listenLock.maplock != 'function') {
        //        document.addEventListener('pause', app.configs.listenLock.maplock);
        //    }
        //} 

            //五分钟自动签到一次
            timer = setInterval(timerProc, 1000);
           //首次进来自动签到
            baidumapreush();

             //获取可提现金额
            var param = { startdate: '2012-06-01', enddate: '2018-06-02', currentpage: 1, issalesmanwithdraw: 0 };
            $http({ method: 'POST', url: app.configs.my.scommission, data: param }).
            success(function (data) {
                if (data) { 
                        clearInterval(drawtimer); 
                        $scope.withdrawalprice = (data.WithdrawalPrice + data.HasWithdrawalPrice).toFixed(2);;
                        $scope.haswithdrawalprice = data.HasWithdrawalPrice.toFixed(2);
                }
            }).error(function (data) { plus.nativeUI.toast(data, { duration: "short" }); });


            //横竖屏检测
            //plus.orientation.watchOrientation(function (r) {
            //    diffres = homeservice.update(-r.gamma, -r.beta);
            //    //横屏处理
            //    if ((diffres.ch > diffres.cv) && (diffres.ch - diffres.cv > diff) && ($scope.ishide != "none")) {
            //        $scope.$apply(function () {
            //            $scope.ishide = "none";
            //        });
            //    } else {
            //        if (!($scope == "block")) {
            //            $scope.$apply(function () {
            //                $scope.ishide = "block";
            //            });
            //        }
            //    }
            //}, function (e) {
            //}, {
            //    frequency: 100
            //});

            $scope.alertstring = "签  到";
            //签到提交
            $scope.signed = function () {
                $scope.inuser = "gray";
                baidumapreush();
                plus.nativeUI.toast(app.configs.message.signsuccess);
          
            };


            //百度地图
            function baiduMap(address, longt, lat) {
                var map = new BMap.Map("baiduMap");
                var point = new BMap.Point(longt, lat);
                map.centerAndZoom(point, 13);
                map.enableScrollWheelZoom(true);
                var marker = new BMap.Marker(point);  // 创建标注
                map.addOverlay(marker);              // 将标注添加到地图中
                map.panTo(point);
                var opts = {
                    width: 100,
                    height: 50,
                    title: "当前位置：",
                    enableMessage: true,
                    message: ""
                }
                var gc = new BMap.Geocoder();
                gc.getLocation(point, function (rs) {
                    addComp = rs.addressComponents;
                    currentAdr = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                    adrObj = new BMap.InfoWindow("位于: " + currentAdr);        //创建信息窗口，点击标注时显示标注对应的车牌号码以及当前地址
                    map.openInfoWindow(adrObj, point); 
                    //开启信息窗口
                });
            }


            function baidumapreush() { 

              var postions= plus.geolocation.getCurrentPosition(function (position) {
                    address = position.addresses;
                    lat = position.coords.latitude;//获取到当前位置的纬度；
                    longt = position.coords.longitude;//获取到当前位置的经度
                    baiduMap(address, longt, lat);
                    plus.geolocation.clearWatch(postions);
                    var url = app.configs.home.signed;
                    var param = { address: currentAdr, lat: lat, longt: longt };
                    $http({ method: 'POST', url: url, data: param }).
                    success(function (data, status, headers, config) {
                        if (data) {
                            if (angular.isUndefined(data.error)) {
                                $scope.inuser = "#008AD4";
                                //$scope.signed = null;
                                //$scope.alertstring = "已  签  到"; 
                            } else {
                                plus.nativeUI.toast(data.error);
                            }
                        }
                    }).
                    error(function (data, status, headers, config) { 
                    });
                }, function (e) {
                    //outSet("获取定位位置信息失败：" + e.message);
                    plus.geolocation.clearWatch(postions);
                    plus.nativeUI.alert("获取定位位置信息失败：" + e.message);
                    baidumapreush();
                }, {
                    geocode: true,
                    provider: 'baidu',
                    // 指示浏览器获取高精度的位置，默认为false  
                    enableHighAcuracy: false,
                    // 指定获取地理位置的超时时间，默认不限时，单位为毫秒  
                    timeout: 3000,
                    // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。  
                    maximumAge: 3000
                });
            }
        }]);
  

    });