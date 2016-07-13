define(function (require, exports, module) {
    return {
        user: {
            loginsb: "/Login/loginSubmit",
            logout:"/Login/LogOut",
            VerifyImage: "/Login/GetValidateCode?time=",
            messageCode: "/Login/GetMsgCode",
            findPassword: "/Login/FindPassword",
            register: "/Login/Register",
            address: "/Login/GetAddress",
            versionpath: "/Login/Getversion"
        },
        msgifgo: {
            msglist: "/Message/GetAllMsg",
            msddetail: "/Message/GetDetail"
        },
        home: {
            signed: "/Index/Signed",
            playerpath: "_www/audio/5411.mp3",
            playerkeep: "_www/audio/shake.wav"
          
        },
        chgpwd: {
            changepwd: "/Login/ChangePwd"
        },
        customer:{
            add: "/Customer/AddVisitRecord",
            visitlist: "/Customer/VisitList",
            visitDetail: "/Customer/VisitRecordDetail",
            upload: "/Customer/Upload",
            uproot: "http://image.lianduan.com.cn/",
            upserver: "http://image.lianduan.com.cn/Image/Upload",
            //uproot: "http://10.0.30.34:8094/",
            //upserver: "http://10.0.30.34:8094/Image/Upload",
            cusList: "/Customer/MyCustomerList",
            cusDetail: "/Customer/MyCustomerDetail",
            addcustomer: "/Customer/AddCustomer",
            addlinkman: "/Customer/AddLinkman",
            editCustomer: "/Customer/EditCustomer",
            linkmanDetail: "/Customer/LinkmanDetail"
        },
        orders:{
            orderlist: "/Order/OrderListSaleGet",
            orderDetail: "/Order/OrderItemGetByID",
            cusorderlist: "/Order/OrdersUserGet",
            commissionorder: "/Order/CommissionOrderSearch"
        },
        my:{
            userrealname: "/BankCard/UsersDetail",
            cardtype: "/BankCard/CardTypeByCode",
            cardadd: "/BankCard/CardAdd",
            msgCode: "/BankCard/GetMsgCode",
            bankcardList: "/BankCard/UsersCardList",
            delcard: "/BankCard/UsersCardDel",
            ecommission: "/Commission/ExtractCommission",
            scommission: "/Commission/SearchCommission",
            chosecard: "/Commission/ChoseCard",
            cardlist: "/Commission/Cardlist",
            defaultcard: "/Commission/DefaultCardGet"
        },
        cookieInfo: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
            }
            return "";
        },
        isLogin: function () {
            var uinfo = this.cookieInfo("UserInfo");
            if (uinfo == "") {
                return false;
            }
            return true;
        },
        message: {
            loginsucess: "登录成功!",
            loginfaild: "登录失败!",
            close: "关闭",
            phoneempty: "手机号码不能为空",
            virifyempty: "验证码不能为空!",
            pwdempty: "密码不能为空!",
            pwdlength: "密码长度大于6位!",
            pwdconfirm: "两次输入的密码不匹配!",
            changesuccess: "修改成功，请重新登录!",
            changefaild: "修改失败!",
            signsuccess: "恭喜您，签到成功！",
            logininfo: "请先登录！",
            logout: "退出登录",
            logoutmsg:"确定要退出吗？",
            ensure: "确定",
            cancel: "取消",
            address: "请正确选择地址",
            waiting: "处理中，请稍等...",
            clearcache: "清除缓存成功!",
            emptymsg: "没有更多数据了",
            errormsg: "获取数据失败!",
            cardtype: "请输入正确的银行卡!",
            cardtypeerr:"获取银行卡类型失败!",
            quittips: "此平台不支持关闭客户端，请按Home键切换应用",
            carddefault:"当前银行卡已经是默认银行卡",
            delsuccess: "删除成功!",
            commpriceerror: "提现金额不满足可提现金额要求!",
            commremark: "请输入你的提现备注",
            carddefaulttips:"请绑定默认银行卡",
            defaultdate: "2015-01-15 13:16:57"
        },
        listenLock: {
            mycustomer: null,
            mycommission: null,
            customervisit: null,
            customervisitcur: null,
            msglist: null,
            mybankcard: null,
            customerorders: null,
            customerorderscur: null,
            maplock: null,
            commissionorders: null,
            homeaudio: null,
            keepliveaudio: null,
            checkedversion:null
        }
    };

 
});