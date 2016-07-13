define(function (require) {
    var app = require('/Mobile/js/common/app.js');

    app.run(['$state', '$stateParams', '$rootScope', function ($state, $stateParams, $rootScope) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/Mobile/section/home');

        $stateProvider
            //登录
            .state('login', {
                url: '/Mobile/section/setups/login',
                templateUrl: '/Mobile/section/setups/login/login.html',
                controllerUrl: '/Mobile/section/setups/login/loginCtrl.js',
                controller: 'loginCtrl'
            })
             //注册
            .state('register', {
                url: '/Mobile/section/setups/register',
                templateUrl: '/Mobile/section/setups/register/register.html',
                controllerUrl: '/Mobile/section/setups/register/registerCtrl.js',
                controller: 'registerCtrl'
            })
            //找回密码
            .state('retrievepwd', {
                url: '/Mobile/section/setups/retrievepwd',
                templateUrl: '/Mobile/section/setups/retrievepwd/retrievepwd.html',
                controllerUrl: '/Mobile/section/setups/retrievepwd/retrievepwdCtrl.js',
                controller: 'retrievepwdCtrl'
            })
            //修改密码
            .state('chgpwd', {
                url: '/Mobile/section/setups/chgpwd',
                templateUrl: '/Mobile/section/setups/chgpwd/chgpwd.html',
                controllerUrl: '/Mobile/section/setups/chgpwd/chgpwdCtrl.js',
                controller: 'chgpwdCtrl'
            })
            //设置
            .state('setup', {
                url: '/Mobile/section/setups/setup',
                templateUrl: '/Mobile/section/setups/setup/setup.html',
                controllerUrl: '/Mobile/section/setups/setup/setupCtrl.js',
                controller: 'setupCtrl'
            })
            //主页面
            .state('home', {
                url: '/Mobile/section/home',
                templateUrl: '/Mobile/section/home/home.html',
                controllerUrl: '/Mobile/section/home/homeCtrl.js',
                controller: 'homeCtrl'
            })
               //我的客户
            .state('mycustomer', {
                url: '/Mobile/section/customers/mycustomer',
                cache: 'false',
                templateUrl: '/Mobile/section/customers/mycustomer/mycustomer.html',
                controllerUrl: '/Mobile/section/customers/mycustomer/mycustomerCtrl.js',
                controller: 'mycustomerCtrl',
                params: { id: -1}
            })//我的客户添加
           .state('addcustomer', {
               url: '/Mobile/section/customers/addcustomer',
               templateUrl: '/Mobile/section/customers/addcustomer/addcustomer.html',
               controllerUrl: '/Mobile/section/customers/addcustomer/addcustomerCtrl.js',
               controller: 'addcustomerCtrl',
               params: { id:"",isdetail: 0}
           })//添加联系人
              .state('addlinkman', {
                  url: '/Mobile/section/customers/addlinkman',
                  templateUrl: '/Mobile/section/customers/addlinkman/addlinkman.html',
                  controllerUrl: '/Mobile/section/customers/addlinkman/addlinkmanCtrl.js',
                  controller: 'addlinkmanCtrl',
                  params: { id: -1,cname:"",linkmanid:"",isdetail: 0 }
              })
            //所有客户拜访列表
            .state('customervisit', {
                url: '/Mobile/section/customers/customervisit',
                templateUrl: '/Mobile/section/customers/customervisit/customervisit.html',
                controllerUrl: '/Mobile/section/customers/customervisit/customervisitCtrl.js',
                controller: 'customervisitCtrl'
            })
            //当前客户拜访列表
            .state('customervisitcur', {
                url: '/Mobile/section/customers/customervisitcur',
                templateUrl: '/Mobile/section/customers/customervisitcur/customervisitcur.html',
                controllerUrl: '/Mobile/section/customers/customervisitcur/customervisitcurCtrl.js',
                controller: 'customervisitcurCtrl',
                params: { id: -1, name: "" }
            })
            //客户详情
            .state('customerdetail', {
                url: '/Mobile/section/customers/customerdetail',
                templateUrl: '/Mobile/section/customers/customerdetail/customerdetail.html',
                controllerUrl: '/Mobile/section/customers/customerdetail/customerdetailCtrl.js',
                controller: 'customerdetailCtrl',
                params: { id: -1, isvisited: "再次拜访" }
            })
            //新增拜访
            .state('customeradd', {
                url: '/Mobile/section/customers/customeradd',
                templateUrl: '/Mobile/section/customers/customeradd/customeradd.html',
                controllerUrl: '/Mobile/section/customers/customeradd/customeraddCtrl.js',
                controller: 'customeraddCtrl',
                params: { id: -1, isdetail: 0 }
            })
            //拜访详情
            .state('visitdetail', {
                url: '/Mobile/section/customers/visitdetail',
                templateUrl: '/Mobile/section/customers/visitdetail/visitdetail.html',
                controllerUrl: '/Mobile/section/customers/visitdetail/visitdetailCtrl.js',
                controller: 'visitdetailCtrl',
                params: { id: -1}
            })
            //当前客户拜访详情
            .state('visitdetailcur', {
                url: '/Mobile/section/customers/visitdetailcur',
                templateUrl: '/Mobile/section/customers/visitdetailcur/visitdetailcur.html',
                controllerUrl: '/Mobile/section/customers/visitdetailcur/visitdetailcurCtrl.js',
                controller: 'visitdetailcurCtrl',
                params: { id: -1,cusid:-1 ,name:""}
            })
            //所有客户订单
            .state('customerorders', {
                url: '/Mobile/section/orders/customerorders',
                templateUrl: '/Mobile/section/orders/customerorders/customerorders.html',
                controllerUrl: '/Mobile/section/orders/customerorders/customerordersCtrl.js',
                controller: 'customerordersCtrl'
            })
            //当前客户订单列表
            .state('customerorderscur', {
                url: '/Mobile/section/orders/customerorderscur',
                templateUrl: '/Mobile/section/orders/customerorderscur/customerorderscur.html',
                controllerUrl: '/Mobile/section/orders/customerorderscur/customerorderscurCtrl.js',
                controller: 'customerorderscurCtrl',
                params: { id: -1 ,name:"",uid:-1}
            })
            //订单详情
            .state('orderdetail', {
                url: '/Mobile/section/orders/orderdetail',
                templateUrl: '/Mobile/section/orders/orderdetail/orderdetail.html',
                controllerUrl: '/Mobile/section/orders/orderdetail/orderdetailCtrl.js',
                controller: 'orderdetailCtrl',
                params: {id:-1}
            })
             //当前订单详情
            .state('orderdetailcur', {
                url: '/Mobile/section/orders/orderdetailcur',
                templateUrl: '/Mobile/section/orders/orderdetailcur/orderdetailcur.html',
                controllerUrl: '/Mobile/section/orders/orderdetailcur/orderdetailcurCtrl.js',
                controller: 'orderdetailcurCtrl',
                params: { id: -1, uid: -1, cid: -1, name: ""}
            })
            //当前销售指定日期提现订单记录
            .state('commissionorders', {
                url: '/Mobile/section/orders/commissionorders',
                templateUrl: '/Mobile/section/orders/commissionorders/commissionorders.html',
                controllerUrl: '/Mobile/section/orders/commissionorders/commissionordersCtrl.js',
                controller: 'commissionordersCtrl',
                params: { date:"",iswithdraw:-1 }
            })
             //当前销售指定日期提现订单详情
            .state('commorderdetail', {
                url: '/Mobile/section/orders/commorderdetail',
                templateUrl: '/Mobile/section/orders/commorderdetail/commorderdetail.html',
                controllerUrl: '/Mobile/section/orders/commorderdetail/commorderdetailCtrl.js',
                controller: 'commorderdetailCtrl',
                params: { date:"",iswithdraw:-1,id:-1 }
            })
            //消息信息
            .state('msglist', {
                url: '/Mobile/section/message/msglist',
                templateUrl: '/Mobile/section/message/msglist/msglist.html',
                controllerUrl: '/Mobile/section/message/msglist/msglistCtrl.js',
                cache: 'false',
                controller: 'msglistCtrl'
              
            })
            //消息详情
             .state('msgdetail', {
                 url: '/Mobile/section/message/msgdetail',
                 templateUrl: '/Mobile/section/message/msgdetail/msgdetail.html',
                 controllerUrl: '/Mobile/section/message/msgdetail/msgdetailCtrl.js',
                 controller: 'msgdetailCtrl',
                 params: { Id: -1,Status:0 }
             }).state('mylist', { //我的
                 url: '/Mobile/section/my/mylist',
                 templateUrl: '/Mobile/section/my/mylist/mylist.html',
                 controllerUrl: '/Mobile/section/my/mylist/mylistCtrl.js',
                 controller: 'mylistCtrl',
                 params: { Id: -1, Status: 0 }
             }).state('mybankcard', {//我的银行卡
                 url: '/Mobile/section/my/mybankcard',
                 templateUrl: '/Mobile/section/my/mybankcard/mybankcard.html',
                 controllerUrl: '/Mobile/section/my/mybankcard/mybankcardCtrl.js',
                 controller: 'mybankcardCtrl',
                 params: { Id: -1, Status: 0 }
             }).state('bankcardadd', { //添加银行卡
                 url: '/Mobile/section/my/bankcardadd',
                 templateUrl: '/Mobile/section/my/bankcardadd/bankcardadd.html',
                 controllerUrl: '/Mobile/section/my/bankcardadd/bankcardaddCtrl.js',
                 controller: 'bankcardaddCtrl',
                 params: { Id: -1, Status: 0 }
             }).state('mycommission', {  //我的佣金
                 url: '/Mobile/section/my/mycommission',
                 templateUrl: '/Mobile/section/my/mycommission/mycommission.html',
                 controllerUrl: '/Mobile/section/my/mycommission/mycommissionCtrl.js',
                 controller: 'mycommissionCtrl',
                 params: { Id: -1, Status: 0 }
             }).state('chosebankcard', {  //选择银行卡
                 url: '/Mobile/section/my/chosebankcard',
                 templateUrl: '/Mobile/section/my/chosebankcard/chosebankcard.html',
                 controllerUrl: '/Mobile/section/my/chosebankcard/chosebankcardCtrl.js',
                 controller: 'chosebankcardCtrl',
                 params: { Id: -1, Status: 0 }
             })
            //用户页面
            .state('users', {
                url: '/Mobile/section/users',
                templateUrl: '/Mobile/section/users/users.html',
                controllerUrl: '/Mobile/section/users/usersCtrl.js',
                controller: 'usersCtrl',
                dependencies: ['/Mobile/section/services/usersService.js']
            });
    }]);
});
