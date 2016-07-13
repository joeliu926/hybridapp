define(function (require) {
    var app = require('../../js/common/app.js'); 

    app.controller('usersCtrl', ['$scope', function ($scope) {
        $scope.userList = app.get('usersService').list();
    }]);

});
