define(function (require) {
    var app = require('../../../js/common/app.js');

    app.controller('msgdetailCtrl', ['$scope', '$state', '$http', '$stateParams', function ($scope, $state, $http, $stateParams) {
        $scope.userList = "fffffffffff";
        var msgid = $stateParams.Id;
        var status = $stateParams.Status;
        $scope.searchcondition = {};
        $scope.detailinfo = {};
        $scope.msgdetail = function () {
            plus.nativeUI.showWaiting();
            $scope.searchcondition.id = msgid;
            $scope.searchcondition.status = status;
            var purl = app.configs.msgifgo.msddetail;// "/Message/GetAllMsg";//
            $http.post(purl, $scope.searchcondition).success(function (data) {
                $scope.detailinfo = data;
                plus.nativeUI.closeWaiting();

            }).error(function (data) {
                alert(data);
                plus.nativeUI.closeWaiting();
            });
        };
    }]);

});