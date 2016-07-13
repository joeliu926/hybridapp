define(function (require) {
    var app = require('../../../js/common/app.js');

    app.controller('addlinkmanCtrl', ['$scope', '$state', '$stateParams', '$window', '$http', function ($scope, $state, $stateParams, $window, $http) {
        var cid = $stateParams.id;
        var cname = $stateParams.cname;
        var linkmanid = $stateParams.linkmanid;
        $scope.addlinktitle = "添加联系人";
        $scope.iwCustomerLinkman = {};
        $scope.iwCustomerLinkman.CustomerId = cid;
        $scope.iwCustomerLinkman.CustomerName = cname;
       
        $scope.iwCustomerLinkman.Sex = 0;

        $scope.Initlinkadd = function () {
            if (linkmanid == "") {
                return false;
            }
            $scope.addlinktitle = "编辑联系人";
            plus.nativeUI.showWaiting();
            var purl = app.configs.customer.linkmanDetail; //"/Customer/LinkmanDetail";// // //
            $http.post(purl, { linkmanid: linkmanid }).success(function (data) {
                plus.nativeUI.closeWaiting();
                if (data == "") {
                    return false;
                }
                $scope.iwCustomerLinkman = data;

            }).error(function (data) {
                alert(data);
                plus.nativeUI.closeWaiting();
            });
        }

        $scope.LinkmanCommit = function () {
            $scope.iwCustomerLinkman.linkmanid = linkmanid;
            plus.nativeUI.showWaiting();
            var purl = app.configs.customer.addlinkman;// "/Customer/AddLinkman"
            $http.post(purl, $scope.iwCustomerLinkman).success(function (data) {
                plus.nativeUI.closeWaiting();
                if (data == "OK") {
                    //$state.go('mycustomer');
                    $scope.goback();
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
                $window.history.back();
            }
        };
    }]);

});