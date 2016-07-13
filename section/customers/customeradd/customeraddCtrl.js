define(function (require) {
    var app = require('../../../js/common/app.js');

    function plusReady() { 
    }
    if (window.plus) {
        plusReady();
    } else {
        document.addEventListener('plusready', plusReady, false);
    }
 

    //控制器
    app.controller('customeraddCtrl', ['$scope', '$http', '$stateParams', '$window', '$state', function ($scope, $http, $stateParams, $window, $state) {
        var resourseurl = $stateParams.resourseurl;
        $scope.resourseurl = resourseurl;
        $scope.customer = {};
        $scope.localaddress = "";
 
        
        if (!(angular.isUndefined($stateParams.id) || $stateParams.id == -1)) {
            $scope.customer.customerid = $stateParams.id;
            var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
            $http({ method: 'POST', url: app.configs.customer.cusDetail, data: { id: $stateParams.id } }).
            success(function (data, status, headers, config) {
                if (data) {
                    if (data.Id) {
                        $scope.customer.name = data.Name;
                        $scope.customer.cusname = data.Name;
                        $scope.customer.tel = data.OfficialTel;
          
                        plus.geolocation.getCurrentPosition(function (psn) {
                            //document.getElementById("address").value = psn.addresses;
                            //$scope.customer.address = psn.addresses;
                            $scope.$apply(function () {
                                $scope.customer.address = psn.addresses;
                            });
                        }, function (e) {
                            plus.nativeUI.alert("获取定位位置信息失败：" + e.message);
                        }, { geocode: true, provider: 'baidu' });

                        wt.close();
                    } else {
                        wt.close();
                        plus.nativeUI.alert(app.configs.message.errormsg, function () {
                            $state.go(resourseurl);
                        }, "错误提示", "确认");
                    }
                }
            }).
            error(function (data, status, headers, config) {
                plus.nativeUI.toast(data, { duration: "short" });
            });
        }

  
        
        $scope.uploadpic = function () {
            var bts = [{ title: "我要拍照" }, { title: "系统相册" }];
            plus.nativeUI.actionSheet({ title: "上传照片", cancel: "取消", buttons: bts },
                function (e) {
                    switch (e.index) {
                        case 0:
                            break;
                        case 1:
                            $scope.appendByCamera();
                            break;
                        case 2:
                            $scope.appendByGallery();
                            break;
                    }
                }
            );
        };

        //上传操作
        $scope.uploadAction = function (p) {

            var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
            $http({ method: 'POST', url: app.configs.customer.upload }).
            success(function (data, status, headers, config) {
                if (data) {
                    var task = plus.uploader.createUpload(app.configs.customer.upserver,
		                { method: "POST", contenttype: "application/x-www-form-urlencoded"},
		                function (t, status) { 
		                    if (status != 404) { 
		                        var img = document.querySelector("#uploadpic");
		                        $scope.customer.pic = data.ImageGuid;
		                        img.src = app.configs.customer.uproot + data.ImageGuid;
		                        console.log(img.src);
		                        wt.close();
		                    } else { 
		                        alert("上传失败：" + status);
		                        wt.close();
		                    }
		                }
	                );
                    var guidpng = $scope.getUid();
                    task.addData("UserId", data.UserId);
                    task.addData("Token", data.Token);
                    task.addData("Ip", data.Ip);
                    task.addData("ImageGuid", data.ImageGuid);
                    task.addData("hidUrl", "");
                    plus.zip.compressImage({
                        src: p,
                        dst: "_doc/" + guidpng + ".png",
                        format: "png",
                        quality: 50,
                        width: "20%",
                        height:"20%"
                    },
                    function () { 
                        var uppath = plus.io.convertLocalFileSystemURL("_doc/" + guidpng + ".png"); 
                        task.addFile("file://" + uppath, { key: guidpng });
                        task.start();

                    }, function (error) {
                        alert("Compress error!");
                    }); 
                }
            }).
            error(function (data, status, headers, config) {

            });
        
         
        };

        // 产生一个随机数
        $scope.getUid = function () {
            return Math.floor(Math.random() * 100000000 + 10000000).toString();
        };

        //相册选择
        $scope.appendByGallery = function () {
            plus.gallery.pick(function (path) {
                $scope.uploadAction(path);
            }, function (e) {
                plus.nativeUI.toast("取消选择图片");
            }, { filter: "image" });
        };
        
        //摄像头拍照
        $scope.appendByCamera = function () {
            var cmr = plus.camera.getCamera();
            var res = cmr.supportedImageResolutions[0];
            var fmt = cmr.supportedImageFormats[0];
            cmr.captureImage(function (p) {
                plus.io.resolveLocalFileSystemURL(p, function (entry) {
                    var path = entry.toLocalURL();
                    $scope.uploadAction(path);
                }, function (e) {
                    plus.nativeUI.toast("读取图片文件错误：" + e.message);
                });
            },function (error) {
                plus.nativeUI.toast("摄像头拍照错误: " + error.message);
		    },{
		        resolution: res,
		        format: fmt
		    });

        };

        //保存
        $scope.save = function () {
            var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
            $http({ method: 'POST', url: app.configs.customer.add, data: $scope.customer }).
            success(function (data, status, headers, config) {
                if (data) {
                    var msg = "";
                    msg = (angular.isUndefined(data.error)) ? data.ResultMessage : data.error;
                    plus.nativeUI.toast(msg);
                    wt.close();
                }
            }).
            error(function (data, status, headers, config) {
                wt.close();
                plus.nativeUI.toast(data);
            });
        };


        //后退
        $scope.goback = function () {
            if (!(angular.isUndefined($stateParams.id) || $stateParams.id == -1) && $stateParams.isdetail == 1) {
                $state.go('customerdetail', { id: $stateParams.id });
            } else {
                $window.history.back();
            }           
        };

    }]);



});
