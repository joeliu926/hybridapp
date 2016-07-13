define(function (require) {
    var app = require('../../../js/common/app.js');

    app.controller('addcustomerCtrl', ['$scope', '$state', '$http', '$stateParams', function ($scope, $state, $http,$stateParams) {
        var custid = $stateParams.id;
        $scope.addtitle = "添加客户";
        $scope.iwCustomer = {};
        if (custid !="") {
            $scope.addtitle = "编辑客户";
        }
        $scope.isshow = "disabled";
        $scope.Initadd = function () {
            plus.nativeUI.showWaiting();
            var purl = app.configs.customer.editCustomer;
            var param ={ cusid: custid };
            $http({ method: 'POST', url: app.configs.customer.editCustomer, data: param }).success(function (data) {
                plus.nativeUI.closeWaiting();
                if (data == "") {
                    return false;
                }
                $scope.iwCustomer = data;
                
                if ($scope.iwCustomer.UserName != "" && $scope.iwCustomer.UserName!=null) {
                    $scope.isshow = "";
                    $scope.iwCustomer.hasName = data.UserName;
                }
         
            }).error(function (data) {
                alert(data);
                plus.nativeUI.closeWaiting();
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
                    };
                    plus.geolocation.getCurrentPosition(function (psn) {
                        $scope.$apply(function () {
                        $scope.iwCustomer.CustomerAddress = psn.addresses;
                        $scope.iwCustomer.CustomerAddress_x = psn.coords.latitude;
                        $scope.iwCustomer.CustomerAddress_y = psn.coords.longitude;
                        });
                    }, function (e) {
                        plus.nativeUI.alert("获取定位位置信息失败：" + e.message);
                    }, { geocode: true, provider: 'baidu' });

                    //记录当前拍着位置
                    var url = app.configs.home.signed;
                    var param = { address: $scope.iwCustomer.CustomerAddress, lat: $scope.iwCustomer.CustomerAddress_x, longt: $scope.iwCustomer.CustomerAddress_y };
                    $http({ method: 'POST', url: url, data: param }).
                    success(function (data, status, headers, config) {
                        if (data) {
                            if (angular.isUndefined(data.error)) {
                           
                            } else {
                                plus.nativeUI.toast(data.error);
                            }
                        }
                    }).
                    error(function (data, status, headers, config) {
                    });

                }
                
            );
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
            }, function (error) {
                plus.nativeUI.toast("摄像头拍照错误: " + error.message);
            }, {
                resolution: res,
                format: fmt
            });
        };

        //上传操作
        $scope.uploadAction = function (p) {
            var wt = plus.nativeUI.showWaiting(app.configs.message.waiting);
            $http({ method: 'POST', url: app.configs.customer.upload }).
            success(function (data, status, headers, config) {
                if (data) {
                    var task = plus.uploader.createUpload(app.configs.customer.upserver,
		                { method: "POST", contenttype: "application/x-www-form-urlencoded" },
		                function (t, status) {
		                    //上传完成
		                    if (status != 404) {
		                        var img = document.querySelector("#uploadpic");
		                        $scope.iwCustomer.ImageId = data.ImageGuid;
		                        img.src = app.configs.customer.uproot + data.ImageGuid;
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
                        width: "30%",
                        height: "30%"
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
      
        $scope.addCommit = function () {
            $scope.iwCustomer.cid = custid;
            plus.nativeUI.showWaiting();
            var purl = app.configs.customer.addcustomer;
            $http.post(purl, $scope.iwCustomer).success(function (data) {
                plus.nativeUI.closeWaiting();
                if (data == "OK") {
                    $state.go('mycustomer',{id: $stateParams.id}, { reload: true });
                } else {
                    plus.nativeUI.alert(data, function () { }, "操作失败", "关闭");
                }

            }).error(function (data) {
                plus.nativeUI.alert(data, function () { }, "操作失败", "关闭");
                plus.nativeUI.closeWaiting();
            });
        };
        //后退
        $scope.goback = function () {
            if (!(angular.isUndefined($stateParams.id) || $stateParams.id == -1) && $stateParams.isdetail == 1) {
                $state.go('customerdetail', { id: $stateParams.id });
            } else {
                $state.go('mycustomer');
            }
        };
    }]);

});