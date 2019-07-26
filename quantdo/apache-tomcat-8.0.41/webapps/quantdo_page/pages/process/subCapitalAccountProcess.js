myapp.controller('SubCapitalAccountProcessController', function ($scope,$rootScope, $timeout) {
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
	$scope.subCapitalAccountProcessService = new com.quantdo.orgClear.service.subCapitalAccountProcessService();
    $scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    $scope.businessGroupService = new com.quantdo.orgClear.service.BusinessGroupManageService();
    $scope.CapitalAccountService = new com.quantdo.orgClear.service.CapitalAccountService();
    $scope.TradeUserService = new com.quantdo.orgClear.service.TradeUserService();
    $scope.fundWorkFlowService = new com.quantdo.orgClear.service.FundWorkFlowService();

    $scope.listEntitys = [];
    $scope.queryEntity = {};
    $scope.modalEntity = {};
    $scope.subCapitalAccountProcessDataset = [];
    $scope.currencys = clearConstant.currenys;
    $scope.marketTypes = clearConstant.marketType;
    $scope.arithmetics = clearConstant.arithmetics;
    $scope.parentInvestorOrders = clearConstant.parentInvestorOrders;
    $scope.tradeTypes = clearConstant.tradeTypes;
    $scope.ifOptions = [
        {text: '否', key: '1'},
        {text: '是', key: '2'}
    ];
    
    $scope.subCapitalAccountProcess_add = isShow("subCapitalAccountProcess_add");
    $scope.subCapitalAccountProcess_query = isShow("subCapitalAccountProcess_query");
    $scope.subCapitalAccountProcess_update = isShow("subCapitalAccountProcess_update");
    $scope.subCapitalAccountProcess_delete = isShow("subCapitalAccountProcess_delete");

    // 获取session中机构信息
    $scope.instClientID = "";
    $scope.arithmetic = "";
    $scope.subCapitalAccountProcessService.queryInstClientID(function(result){
        $scope.instClientID = result;

        // 初始化机构信息
        $scope.instClientlists =[];
        $scope.instClientService.findByQuery(function (result) {
            $scope.instClientlists = result;
            for(var i=0;i<result.length;i++){
                if(result[i].instClientID == $scope.instClientID){
                    $scope.arithmetic = result[i].arithmetic;
                }
            }
            $scope.$apply();

            $scope.find();
        },{});

        // 获取资金账户组信息
        $scope.accountGroupIDs = [];
        $scope.getAccountGroup();
    });

    $scope.getAccountGroup = function () {
        getActiveAccountGroupsByInstClientId(function(result){
            $scope.accountGroupIDs = result;
            $scope.$apply();
        },$scope.instClientID);
    }



    // 查询资产单元
	findBySubCapitalAccountInfo({"instClientID":""}, function(result){
		$scope.queryAccountEntitys = result;
		$scope.$apply();
	});

    // 获取交易用户信息
    $scope.tradeUserList = [];
    $scope.tradeUserSelectList = [];
    $scope.TradeUserService.findByUserType(function(result){
        $scope.tradeUserList = result;
        for(var i=0;i<result.length;i++){
            $scope.tradeUserSelectList.push({id:result[i].userID,text:result[i].userID + "_" + result[i].userName})
        }
        $scope.$apply();
        $("#tradeUserID").select2({
            data:$scope.tradeUserSelectList,
            minimumResultsForSearch: -1//去掉搜索框
        });
    },"1");

    // 获取风控用户信息
    $scope.riskUserList = [];
    $scope.riskUserSelectList = [];
    $scope.TradeUserService.findByUserType(function(result){
        $scope.riskUserList = result;
        for(var i=0;i<result.length;i++){
            $scope.riskUserSelectList.push({id:result[i].userID,text:result[i].userID + "_" + result[i].userName})
        }
        $scope.$apply();
        $("#riskUserID").select2({
            data:$scope.riskUserSelectList,
            minimumResultsForSearch: -1//去掉搜索框
        });
    },"2");

    // 获取业务组信息
    $scope.subAccountGroupIDs = [];
    $scope.businessGroupService.getBusinessGroup(function(result){
        for(var i=0;i<result.length;i++){
            var text = result[i].text;
            text = text.slice(text.indexOf("_")+1);
            result[i].name = text;
        }
        $scope.subAccountGroupIDs = result;
        $scope.$apply();
    });

    $scope.getAllMarginTemplate = function () {
        //获取保证金模板信息
        getAllMarginTemplate(function (result){
            $scope.marginTemplateEntitys = result;
            $scope.$apply();
        });
    }
    $scope.getAllMarginTemplate();

    $scope.getAllFeeTemplateEntity = function () {
        //获取手续费模板信息
        getAllFeeTemplateEntity(function (result){
            $scope.feeTemplateEntitys = result;
            $scope.$apply();
        });
    }
    $scope.getAllFeeTemplateEntity();

    // 重置表单验证信息
    function formValidateReset() {
        $scope.myForm.subAccountID.$setPristine();
        $scope.myForm.subAccountName.$setPristine();
    }

    // 初始化页面参数
    $scope.initParameter = function () {
        if($scope.instClientID == "" || $scope.instClientID == null){
            layer.msg("非机构用户不可新增", {icon: 2, time: 3000});
            return false;
        }
    	$scope.modalEntity = {};
        $scope.rCapEntitys = [];
        $scope.arrayGroupMapsTem=[];
        formValidateReset();
        $scope.modalTitle = "设置资产单元信息";
        $scope.isUpdate = false;
        $scope.setBaseInfo = true;
        $scope.setMarginFeeInfo = false;
        $scope.modalEntity.instClientID = $scope.instClientID;
        $scope.modalEntity.arithmetic = $scope.arithmetic;
        $scope.modalEntity.currency = $scope.currencys[0].key;
        //$scope.modalEntity.parentInvestorOrder = $scope.parentInvestorOrders[0].key;
        $("#tradeUserID").val([]).select2({minimumResultsForSearch: -1});
        $("#riskUserID").val([]).select2({minimumResultsForSearch: -1});
        $("#subCapitalAccountProcessModal").modal("show");

    };

    $scope.rCapEntitys = [];
    $scope.getCapitalAccountByAccountGroup = function (accountGroupID) {
        $scope.arrayGroupMapsTem=[];
        if(accountGroupID != "" && accountGroupID != null){
            $scope.CapitalAccountService.getCapitalAccountByAccountGroup(function (result) {
                $scope.rCapEntitys = result;
                for(var i=0; i<$scope.rCapEntitys.length;i++){
                    $scope.rCapEntitys[i].sequenceNumber = i+1;
                }
                $scope.$apply();
            },$scope.instClientID,accountGroupID);
        }else{
            $scope.rCapEntitys = [];
            $scope.$apply();
        }
    };

    $scope.changeParentInvestorOrder = function () {
        $scope.arrayGroupMapsTem=[];
        for(var i = 0;i < $scope.rCapEntitys.length;i++) {
            $scope.rCapEntitys[i].isSelectActive = false;
        }
    };

    // 转换允许交易市场类型
    $scope.transMarketTypes = function (text){
        var count = $scope.marketTypes.length;
        for (var i = 0; i < count; i++) {
            if ($scope.marketTypes[i].key == text) {
                return $scope.marketTypes[i].text;
            }
        }
    }

    $scope.changeStates = function(rEntity){
        //是去除还是添加
        if(rEntity.followAccount){
            //是否是第一个账号的
            if($scope.rCapEntitys.length>1){
                var accountList =[];
                for(var j = 0;j < $scope.rCapEntitys.length;j++){
                    if($scope.rCapEntitys[j].followAccount == true){
                        accountList.push($scope.rCapEntitys[j].innerAccountID);
                    }
                }

                //如果accountList >1 需要判断市场
                if(accountList.length > 1){
                    //如果同一个市场，不允许勾选，同时提示
                    //rEntity.innerAccountID 属于哪个市场
                    var market ="";
                    for(var i = 0;i < $scope.rCapEntitys.length;i++){
                        if(rEntity.innerAccountID == $scope.rCapEntitys[i].innerAccountID){
                            market = $scope.rCapEntitys[i].market;
                        }
                    }
                    //再次遍历accountList
                    for(var i = 0;i <accountList.length;i++){
                        var innerAccountID = accountList[i];
                        if(rEntity.innerAccountID != innerAccountID){
                            for(var ii = 0;ii < $scope.rCapEntitys.length;ii++){
                                if(innerAccountID == $scope.rCapEntitys[ii].innerAccountID){
                                    var marketTwo = $scope.rCapEntitys[ii].market;
                                    if(marketTwo == market){
                                        rEntity.followAccount = false;
                                        layer.msg("同一个市场不允许勾选多个！",{icon: 2});
                                        //$($(".checkbox_followAccount")[num]).removeAttr("checked");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    //添加组选择
    $scope.arrayGroupMapsTem=[];
    $scope.addGroupSelect = function(index,rEntity){
        if(	rEntity.isSelectActive==false || rEntity.isSelectActive == undefined){
            $scope.arrayGroupMapsTem.push(rEntity.sequenceNumber);
            rEntity.isSelectActive=true;
        }else{
            var i = $scope.arrayGroupMapsTem.indexOf(rEntity.sequenceNumber);
            $scope.arrayGroupMapsTem.splice(i, 1);
            rEntity.isSelectActive=false;
        }
    }

    $scope.upSelectGroupEntity = function(){
        $scope.arrayGroupMapsTem.sort();
        if($scope.arrayGroupMapsTem[0] == 1){
            layer.msg("顺序第一的资金账号不可再提升顺序！", {icon: 2, time: 3000});
            return false;
        }
        for(var i=0;i<$scope.arrayGroupMapsTem.length;i++){
            upEntity($scope.arrayGroupMapsTem[i]);
            $scope.arrayGroupMapsTem[i] = +$scope.arrayGroupMapsTem[i] - 1;
        }
    }

    function upEntity(index){
        var tmpAccountGroupEntity = {};
        $scope.rCapEntitys[index-1].sequenceNumber = +$scope.rCapEntitys[index-1].sequenceNumber - 1;
        $scope.rCapEntitys[index-2].sequenceNumber = +$scope.rCapEntitys[index-2].sequenceNumber + 1;
        tmpAccountGroupEntity = $scope.rCapEntitys[index-2];
        $scope.rCapEntitys[index-2] = $scope.rCapEntitys[index-1];
        $scope.rCapEntitys[index-1] = tmpAccountGroupEntity;
    }

    $scope.downSelectGroupEntity = function(){
        $scope.arrayGroupMapsTem.sort();
        $scope.arrayGroupMapsTem.reverse();
        if($scope.arrayGroupMapsTem[0] == $scope.rCapEntitys.length){
            layer.msg("顺序最后的资金账号不可再降低顺序！", {icon: 2, time: 3000});
            return false;
        }
        for(var i=0;i<$scope.arrayGroupMapsTem.length;i++){
            downEntity($scope.arrayGroupMapsTem[i]);
            $scope.arrayGroupMapsTem[i] = +$scope.arrayGroupMapsTem[i] + 1;
        }
    }

    function downEntity(index){
        var tmpAccountGroupEntity = {};
        $scope.rCapEntitys[index].sequenceNumber = +$scope.rCapEntitys[index].sequenceNumber - 1;
        $scope.rCapEntitys[index-1].sequenceNumber = +$scope.rCapEntitys[index-1].sequenceNumber + 1;
        tmpAccountGroupEntity = $scope.rCapEntitys[index];
        $scope.rCapEntitys[index] = $scope.rCapEntitys[index-1];
        $scope.rCapEntitys[index-1] = tmpAccountGroupEntity;
    }

    // 下一步
    $scope.nextStep = function (entity) {
        if($scope.setBaseInfo == true){
            if(entity.instClientID == "" || entity.instClientID == null){
                layer.msg("机构代码不可为空！",{icon: 2});
                return false;
            }

            if(entity.subAccountID == "" || entity.subAccountID == null){
                layer.msg("资产单元不可为空！",{icon: 2});
                return false;
            }

            if(entity.subAccountName == "" || entity.subAccountName == null){
                layer.msg("资产单元名称不可为空！",{icon: 2});
                return false;
            }

            if(entity.currency == "" || entity.currency == null){
                layer.msg("基础币种不可为空！",{icon: 2});
                return false;
            }

            if(entity.accountGroupID == "" || entity.accountGroupID == null){
                layer.msg("资金账户组不可为空！",{icon: 2});
                return false;
            }

            if($scope.rCapEntitys == null || $scope.rCapEntitys.length == 0){
                layer.msg("不可绑定资金账户为空的账户组！",{icon: 2});
                return false;
            }

            $scope.setBaseInfo = false;
            $scope.setMarginFeeInfo = true;
            $scope.modalTitle = "设置资产单元费率信息";
        }
    }

    // 上一步
    $scope.previousStep = function () {
        if($scope.setMarginFeeInfo == true){
            $scope.setBaseInfo = true;
            $scope.setMarginFeeInfo = false;
            $scope.modalTitle = "设置资产单元信息";
        }
    }

    $scope.addMarginTemplatePanel = function () {
        $rootScope.addPane("费率管理","费率模板管理","保证金模板","MarginTemplateController","marginset/marginTemplate.html");
    };

    $scope.addFeeTemplatePanel = function () {
        $rootScope.addPane("费率管理","费率模板管理","手续费模板","FeeTemplateController","feeset/feeTemplate.html");
    };

    $scope.addSubProductMarginPanel = function () {
        $rootScope.addPane("费率管理","账户费率管理","品种保证金率","SubProductMarginSetController","marginset/subProductMarginSet.html");
    };

    $scope.addSubInstrumentMarginPanel = function () {
        $rootScope.addPane("费率管理","账户费率管理","合约保证金率","SubInstrumentMarginSetController","marginset/subInstrumentMarginSet.html");
    };

    $scope.addSubProductFeePanel = function () {
        $rootScope.addPane("费率管理","账户费率管理","账户客户手续费","SubProductFeeSetController","feeset/subProductFeeSet.html");
    };

    $scope.isReBuild = false;
    // 修改
    $scope.initUpdateParam = function (entity,index) {
        if(entity.isActive == 0 && $scope.isReBuild == false){
            layer.msg("此资产单元已销户，不允许修改",{icon: 2, time: 2000});
            return false;
        }
        formValidateReset();
        $scope.modalTitle = "设置资产单元信息";
        $scope.setBaseInfo = true;
        $scope.setMarginFeeInfo = false;
    	$scope.modalEntity = {};
		$scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.modalEntity = angular.copy($scope.tempEntity);
        $scope.modalEntity.arithmetic = $scope.arithmetic;
        $("#tradeUserID").val(entity.tradeUserID.split(",")).select2({minimumResultsForSearch: -1});
        $("#riskUserID").val(entity.riskUserID.split(",")).select2({minimumResultsForSearch: -1});
        $scope.arrayGroupMapsTem=[];
        $scope.rCapEntitys = [];
        $scope.CapitalAccountService.getCapitalAccountByAccountGroup(function (result) {
            if($scope.modalEntity.parentInvestorOrder == "2"){
                var index = 1;
                var capitalAccountSequenceList = $scope.modalEntity.capitalAccountSequenceList;
                for(var i=0;i<capitalAccountSequenceList.length;i++){
                    for(var j=0;j<result.length;j++){
                        if(result[j].innerAccountID == capitalAccountSequenceList[i].innerAccountID){
                            result[j].sequenceNumber = capitalAccountSequenceList[i].sequenceNumber;
                            $scope.rCapEntitys.push(result[j]);
                            index = index +1;
                            break;
                        }
                    }
                }
                // 插入账户组新增的关系
                for(var i=0;i<result.length;i++){
                    var flag = false;
                    for(var j=0;j<$scope.rCapEntitys.length;j++){
                        if($scope.rCapEntitys[j].innerAccountID == result[i].innerAccountID){
                            flag = true;
                            break;
                        }
                    }

                    if(!flag){
                        result[i].sequenceNumber = index;
                        $scope.rCapEntitys.push(result[i]);
                        index = index + 1;
                    }
                }
            }else{
                $scope.rCapEntitys = result;
                for(var i=0; i<$scope.rCapEntitys.length;i++){
                    $scope.rCapEntitys[i].sequenceNumber = i+1;
                }
            }
            // 填写跟随信息
            var followAccountList = $scope.modalEntity.followAccountList;
            for(var i=0;i<followAccountList.length;i++){
                for(var j=0;j<$scope.rCapEntitys.length;j++){
                    if($scope.rCapEntitys[j].innerAccountID == followAccountList[i]){
                        $scope.rCapEntitys[j].followAccount = true;
                        break;
                    }
                }
            }
            $scope.$apply();
            $("#subCapitalAccountProcessModal").modal("show");
        },$scope.instClientID,$scope.modalEntity.accountGroupID);
        //$scope.getCapitalAccountByAccountGroup($scope.modalEntity.accountGroupID);
		//$scope.modalEntity.remark = htmlDecodeJQ($scope.modalEntity.remark);
        $scope.isUpdate = true;
        $scope.$apply();
    };

    // 新增账户信息
    $scope.save = function (entity) {
        var index = entity.id;
        var tableIndex = entity.index;

        //获得交易用户
        var tradeUserIDArr = $("#tradeUserID").val();
        var tradeUserID = "";
        if(tradeUserIDArr != undefined && tradeUserIDArr != null && tradeUserIDArr != "" ){
            for(var k=0;k < tradeUserIDArr.length;k++){
                tradeUserID = tradeUserID == "" ? tradeUserIDArr[k] : tradeUserID + "," + tradeUserIDArr[k];
            }
        }
        entity.tradeUserID = tradeUserID;

        //获得风控用户
        var riskUserIDArr = $("#riskUserID").val();
        var riskUserID = "";
        if(riskUserIDArr != undefined && riskUserIDArr != null && riskUserIDArr != "" ){
            for(var k=0;k < riskUserIDArr.length;k++){
                riskUserID = riskUserID == "" ? riskUserIDArr[k] : riskUserID + "," + riskUserIDArr[k];
            }
        }
        entity.riskUserID = riskUserID;
        entity.isActive = '1';

        // 增加
        if (index == undefined) {
            findSubCapitalEntity(function(result){
                if (result != null && result.length > 0) {
                    layer.msg("该机构下资产单元已存在，新增失败", {icon: 2});
                    return false;
                }else{
                    $scope.subCapitalAccountProcessService.add(function (result) {
                        if(result.status == "success"){
                            layer.msg("资产单元开户成功",{icon: 1});
                            $("#subCapitalAccountProcessModal").modal("hide");
                            // 重新获取资产单元
                            findBySubCapitalAccountInfo({"instClientID":""}, function(result){
                                $scope.queryAccountEntitys = result;
                                $scope.$apply();
                                $scope.find();
                            });
                        }else if(result.status == "errorMain"){
                            layer.msg(result.errorMsg, {icon: 2});
                            return false;
                        }else{
                            layer.msg(result.errorMsg, {icon: 2});
                            $("#subCapitalAccountProcessModal").modal("hide");
                            findBySubCapitalAccountInfo({"instClientID":""}, function(result){
                                $scope.queryAccountEntitys = result;
                                $scope.$apply();
                                $scope.find();
                            });
                        }
                    },entity,$scope.rCapEntitys);
                }
            },{
                instClientID: entity.instClientID,
                subAccountID: entity.subAccountID
            });

        } else {
            if($scope.isReBuild){ // 启用
                $scope.subCapitalAccountProcessService.rebuild(function (result){
                    if(result.status == "success"){
                        layer.msg("资产单元启用成功",{icon: 1});
                        $("#subCapitalAccountProcessModal").modal("hide");
                        $scope.$apply();
                        $scope.find();
                    }else if(result.status == "errorMain"){
                        layer.msg(result.errorMsg, {icon: 2});
                        return false;
                    }else{
                        layer.msg(result.errorMsg, {icon: 2});
                        $("#subCapitalAccountProcessModal").modal("hide");
                        $scope.$apply();
                        $scope.find();
                    }
                },entity,$scope.rCapEntitys);
            }else{ // 修改
                $scope.subCapitalAccountProcessService.update(function (result) {
                    if(result.status == "errorMain"){
                        layer.msg(result.errorMsg, {icon: 2});
                        return false;
                    }else{
                        if(result.status == "success"){
                            layer.msg("资产单元修改成功",{icon: 1});
                            $("#subCapitalAccountProcessModal").modal("hide");
                        }else{
                            layer.msg(result.errorMsg, {icon: 2});
                            $("#subCapitalAccountProcessModal").modal("hide");
                        }
                        // 重新获取资产单元
                        findBySubCapitalAccountInfo({"instClientID":""}, function(result){
                            $scope.queryAccountEntitys = result;
                            $scope.$apply();
                        });

                        $scope.subCapitalAccountProcessService.findByQuery(function (resu) {
                            resu[0].index = tableIndex;
                            $scope.listEntitys.splice(tableIndex-1, 1, resu[0]);
                        },{instClientID:entity.instClientID,subAccountID:entity.subAccountID});

                        $scope.subCapitalAccountProcessTable.cells().every( function () {
                            if((tableIndex-1) == this[0][0].row){
                                if(this[0][0].column == 4){
                                    this.data(entity.subAccountName);
                                    $scope.$apply();
                                }
                                if(this[0][0].column == 5){
                                    this.data($scope.transCurrencys(entity.currency));
                                    $scope.$apply();
                                }
                                if(this[0][0].column == 6){
                                    this.data($scope.transSubAccountGroupID(entity.subAccountGroupID));
                                    $scope.$apply();
                                }
                                if(this[0][0].column == 7){
                                    this.data(entity.tradeUserID);
                                    $scope.$apply();
                                }
                                if(this[0][0].column == 8){
                                    this.data(entity.riskUserID);
                                    $scope.$apply();
                                }
                                if(this[0][0].column == 9){
                                    var innerAccountID = "";
                                    for(var i=0;i<$scope.rCapEntitys.length;i++){
                                        if(innerAccountID == ""){
                                            innerAccountID = innerAccountID + $scope.rCapEntitys[i].innerAccountID;
                                        }else{
                                            innerAccountID = innerAccountID + "," + $scope.rCapEntitys[i].innerAccountID;
                                        }
                                    }
                                    this.data(innerAccountID);
                                    $scope.$apply();
                                }
                                if(this[0][0].column == 10){
                                    this.data($scope.transParentInvestorOrder(entity.parentInvestorOrder));
                                    $scope.$apply();
                                }
                                /*if(this[0][0].column == 11){
                                    this.data($scope.transMarginTemplateID(entity.marginTemplateID));
                                    $scope.$apply();
                                }
                                if(this[0][0].column == 12){
                                    this.data($scope.transFeeTemplateID(entity.feeTemplateID));
                                    $scope.$apply();
                                }*/
                                if(this[0][0].column == 13){
                                    this.data(entity.remark);
                                    $scope.$apply();
                                }
                            }
                        });
                        $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
                    }
                },entity,$scope.rCapEntitys);
            }
        }
    };

    // 注销
    $scope.cancel = function (index, entity) {
        $scope.fundWorkFlowService.validateLinkAccount(function (result) {
            if (result != null && result.length > 0) {
                layer.msg("该资产单元有对应工作流配置，无法注销", {icon: 2});
                return false;
            } else {
                layer.confirm('确定注销此资产单元？', {icon: 3}, function (count) {
                    //1.	校验资金账号资金情况
                    findInvestorAccountByBroAndAccountID(function (result) {
                        if (result.length > 0) {
                            layer.msg("资产单元权益不为0，不允许注销", {icon: 2, time: 3000});
                            return false;
                        } else {
                            //2.	校验资金账号持仓情况
                            findByBroAndAccountID(function (result) {
                                if (result.length > 0) {
                                    layer.msg("资产单元还有持仓，不允许注销", {icon: 2, time: 3000});
                                    return false;
                                } else {
                                    $scope.subCapitalAccountProcessService.cancel(function (result) {
                                        if(result.status == "success"){
                                            layer.msg("资产单元注销成功",{icon: 1});
                                            layer.close(count);
                                            // 重新获取资产单元
                                            findBySubCapitalAccountInfo({"instClientID":""}, function(result){
                                                $scope.queryAccountEntitys = result;
                                                $scope.$apply();
                                                $scope.find();
                                            });
                                        }
                                    },entity);
                                }
                            }, {
                                accountID: entity.subAccountID
                            });
                        }
                    }, {
                        accountID: entity.subAccountID
                    });
                });
            }
        }, {
            innerAccountID: entity.subAccountID
        });
    }

    $scope.rebuild = function (index, entity) {
        layer.confirm('确定重新启用该账户？', {icon: 3}, function (count) {
            layer.close(count);
            $scope.initUpdateParam(entity, index);
        });
    };

    $scope.isQuery = false;
	// 查询(前台分页)
    $scope.find = function(){
        $scope.isQuery = true;
        $scope.queryEntity.instClientID = null;
    	//将数据集赋值为空
    	$scope.subCapitalAccountProcessDataset = [];
    	//更新表格对应的数据集
    	$scope.subCapitalAccountProcessService.findByQuery(function (result) {
    		var con = result;
            var operate1 = "";
            var operate2 = "";
    		$scope.listEntitys = result;
            for(var i = 0; i<con.length;i++){
                operate1 = "";
                operate2 = "";
                operate1 = $scope.getUpdatePermision($scope.subCapitalAccountProcess_update);
            	operate2 = $scope.getDeletePermision($scope.subCapitalAccountProcess_delete,con[i].isActive);
                var tempArr = [(i+1),con[i].id,$scope.transInstClientID(con[i].instClientID),con[i].subAccountID,con[i].subAccountName,$scope.transCurrencys(con[i].currency),$scope.transSubAccountGroupID(con[i].subAccountGroupID),
                    con[i].tradeUserID,con[i].riskUserID,con[i].innerAccountID,$scope.transParentInvestorOrder(con[i].parentInvestorOrder),"<a class='get-margin'>查看</a>",
                    "<a class='get-fee'>查看</a>",con[i].remark,$scope.transActive(con[i].isActive),operate1+operate2];
	            $scope.subCapitalAccountProcessDataset.push(tempArr);
	            con[i].index = tempArr[0];
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.subCapitalAccountProcessTable.clear().draw();
            $scope.subCapitalAccountProcessTable.rows.add($scope.subCapitalAccountProcessDataset).draw();
            $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            $scope.isQuery = false;
            $scope.$apply();
        }, $scope.queryEntity);
    }
    
    $scope.transInstClientID = function(instClientID){
    	for(var i=0;i<$scope.instClientlists.length;i++){
			if($scope.instClientlists[i].instClientID == instClientID){
				return $scope.instClientlists[i].instClientName;
			}
		}
		return "";
    }

    $scope.transSubAccountGroupID = function(subAccountGroupID){
        for(var i=0;i<$scope.subAccountGroupIDs.length;i++){
            if($scope.subAccountGroupIDs[i].id == subAccountGroupID){
                return $scope.subAccountGroupIDs[i].name;
            }
        }
        return "";
    }

    $scope.transAccountGroupID = function(accountGroupID){
        for(var i=0;i<$scope.accountGroupIDs.length;i++){
            if($scope.accountGroupIDs[i].accountGroupID == accountGroupID){
                return $scope.accountGroupIDs[i].accountGroupName;
            }
        }
        return "";
    }

    $scope.transMarginTemplateID = function(marginTemplateID){
        for(var i=0;i<$scope.marginTemplateEntitys.length;i++){
            if($scope.marginTemplateEntitys[i].templateID == marginTemplateID){
                return $scope.marginTemplateEntitys[i].templateName;
            }
        }
        return "";
    }

    $scope.transFeeTemplateID = function(feeTemplateID){
        for(var i=0;i<$scope.feeTemplateEntitys.length;i++){
            if($scope.feeTemplateEntitys[i].templateID == feeTemplateID){
                return $scope.feeTemplateEntitys[i].templateName;
            }
        }
        return "";
    }

    //改变状态显示
    $scope.transActive = function(isActive){
        var result = "";
        if(isActive==0){
            result = "注销";
        }else if(isActive==1){
            result = "启用";
        }
        return result;
    }

    // 转换币种
    $scope.transCurrencys = function (key){
        var count = $scope.currencys.length;
        for (var i = 0; i < count; i++) {
            if ($scope.currencys[i].key == key) {
                return $scope.currencys[i].text;
            }
        }
    }

    // 转换资金账号顺序
    $scope.transParentInvestorOrder = function(parentInvestorOrder){
        for(var i=0;i<$scope.parentInvestorOrders.length;i++){
            if($scope.parentInvestorOrders[i].key == parentInvestorOrder){
                return $scope.parentInvestorOrders[i].text;
            }
        }
        return "";
    }
    
    $("body").undelegate("#subCapitalAccountProcess_dynamic_table_wrapper td .update-row","click");
    //表格中修改的单击事件
    $("body").delegate("#subCapitalAccountProcess_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.subCapitalAccountProcessTable.row(mytr).data();
        var id = tempArr[0];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].index){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        formValidateReset();
        $scope.isUpdate = true;
        if($scope.instClientID == "" || $scope.instClientID == null){
            layer.msg("非机构用户不可修改", {icon: 2, time: 3000});
            return false;
        }
        $scope.initUpdateParam($scope.modalEntity,id);
        $scope.isReBuild = false;
        $scope.$apply();
    });
    
    $("body").undelegate("#subCapitalAccountProcess_dynamic_table_wrapper td .delete-row","click");
    //表格中注销的单击事件
    $("body").delegate("#subCapitalAccountProcess_dynamic_table_wrapper td .delete-row","click",function(){
	var mytr = $(this).parents("tr");
	    var tempArr = $scope.subCapitalAccountProcessTable.row(mytr).data();
	    var id = tempArr[0];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].index){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        if($scope.instClientID == "" || $scope.instClientID == null){
            layer.msg("非机构用户不可注销", {icon: 2, time: 3000});
            return false;
        }
        $scope.cancel(id,$scope.modalEntity);
	});

    $("body").undelegate("#subCapitalAccountProcess_dynamic_table_wrapper td .start-row","click");
    //表格中启用的单击事件
    $("body").delegate("#subCapitalAccountProcess_dynamic_table_wrapper td .start-row","click",function(){
        var mytr = $(this).parents("tr");
        var tempArr = $scope.subCapitalAccountProcessTable.row(mytr).data();
        var id = tempArr[0];
        for(var i = 0;i<$scope.listEntitys.length;i++){
            if(id==$scope.listEntitys[i].index){
                $scope.modalEntity = $scope.listEntitys[i];
            }
        }
        $scope.isReBuild = true;
        if($scope.instClientID == "" || $scope.instClientID == null){
            layer.msg("非机构用户不可启用", {icon: 2, time: 3000});
            return false;
        }
        $scope.rebuild(id,$scope.modalEntity);
    });
    
    //获取修改权限
    $scope.getUpdatePermision = function(flag){
    	  var result = "";
	  	  if(flag){
	  		  result = "<a class='update-row' data-toggle='modal'>修改</a>";
	  	  }
	  	  return result;
    }

    //获取删除权限
    $scope.getDeletePermision = function(flag,isActive){
    	  var result = "";
    	  if(flag){
    	      if(isActive == "1"){
                  result = "<a class='delete-row'>注销</a>";
    	      }else{
                  result = "<a class='start-row'>启用</a>";
              }

          }
    	  return result;
    };

    $scope.queryMarginEntity = {};
    $scope.queryFeeEntity = {};
    // 初始化交易所信息
    getAllExchanges(function(result) {
        $scope.exchangeDatas = result;
        $scope.$apply();
    });
    // 交易所下拉框联动
    $scope.selectQueryExchange = function (entity) {
        $scope.queryMarginEntity.productID = "";
        $scope.queryFeeEntity.productID = "";
        getAllProductByConditionEntity(function (result) {
            $scope.queryProductDatas = result;
            $scope.setQueryInstruments(entity);
            $scope.$apply();
        }, {exchID: entity.exchID, productID: '', productType:"", productStatus: ''});
    };
    // 品种下拉框联动
    $scope.setQueryInstruments = function (entity){
        $scope.queryMarginEntity.instrumentID = "";
        $scope.queryFeeEntity.instrumentID = "";
        findInstrumentEntity(function (result){
            $scope.queryInstruments = result;
            $scope.$apply();
        },{productID: entity.productID,exchID:entity.exchID,productType:entity.productType});
    };

    $("body").undelegate("#subCapitalAccountProcess_dynamic_table_wrapper td .get-margin","click");
    //表格中保证金查看的单击事件
    $("body").delegate("#subCapitalAccountProcess_dynamic_table_wrapper td .get-margin","click",function(){
        var mytr = $(this).parents("tr");
        var tempArr = $scope.subCapitalAccountProcessTable.row(mytr).data();
        var id = tempArr[0];
        for(var i = 0;i<$scope.listEntitys.length;i++){
            if(id==$scope.listEntitys[i].index){
                $scope.modalEntity = $scope.listEntitys[i];
            }
        }
        if($scope.instClientID == "" || $scope.instClientID == null){
            layer.msg("非机构用户不可查看", {icon: 2, time: 3000});
            return false;
        }
        $scope.initMargin($scope.modalEntity);
        $scope.$apply();
    });

    $scope.initMargin = function (entity) {
        $scope.queryMarginEntity = {};
        $scope.queryMarginEntity.subAccountID = entity.subAccountID;
        $scope.selectQueryExchange({});
        // 清空表格
        $scope.marginDataset = [];
        $scope.marginTable.clear().draw();
        $scope.marginTable.rows.add($scope.marginDataset).draw();
        $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
        $timeout(function () {
            $("#marginModal").modal("show");
        },1000)
    }

    $scope.findMargin = function (entity) {
        entity.instClientID = $scope.instClientID;
        $scope.marginDataset = [];
        //更新表格对应的数据集
        $scope.subCapitalAccountProcessService.findMargin(function (result) {
            var con = result;
            $scope.marginEntitys = result;
            for(var i = 0; i<con.length;i++){
                var tempArr = [$scope.transInstClientID(con[i].instClientID),con[i].subAccountID,con[i].exchID,con[i].productID,con[i].instrumentID,
                    $scope.transTradeType(con[i].tradeType),con[i].longMarginRateStr,con[i].longMarginAmt,con[i].shortMarginRateStr,con[i].shortMarginAmt];
                $scope.marginDataset.push(tempArr);
            }
            //重新绘表
            $scope.marginTable.clear().draw();
            $scope.marginTable.rows.add($scope.marginDataset).draw();
            $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            $scope.isQuery = false;
            $scope.$apply();
        }, entity);
    };

    $scope.transTradeType = function (text) {
        var count = $scope.tradeTypes.length;
        for (var i = 0; i < count; i++) {
            if ($scope.tradeTypes[i].key == text) {
                return $scope.tradeTypes[i].text;
            }
        }
    };

    $("body").undelegate("#subCapitalAccountProcess_dynamic_table_wrapper td .get-fee","click");
    //表格中手续费查看的单击事件
    $("body").delegate("#subCapitalAccountProcess_dynamic_table_wrapper td .get-fee","click",function(){
        var mytr = $(this).parents("tr");
        var tempArr = $scope.subCapitalAccountProcessTable.row(mytr).data();
        var id = tempArr[0];
        for(var i = 0;i<$scope.listEntitys.length;i++){
            if(id==$scope.listEntitys[i].index){
                $scope.modalEntity = $scope.listEntitys[i];
            }
        }
        if($scope.instClientID == "" || $scope.instClientID == null){
            layer.msg("非机构用户不可查看", {icon: 2, time: 3000});
            return false;
        }
        $scope.initFee($scope.modalEntity);
        $scope.$apply();
    });

    $scope.initFee = function (entity) {
        $scope.queryFeeEntity = {};
        $scope.queryFeeEntity.subAccountID = entity.subAccountID;
        $scope.selectQueryExchange({});
        // 清空表格
        $scope.feeDataset = [];
        $scope.feeTable.clear().draw();
        $scope.feeTable.rows.add($scope.feeDataset).draw();
        $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
        $timeout(function () {
            $("#feeModal").modal("show");
        },1000)
    }

    $scope.findFee = function (entity) {
        entity.instClientID = $scope.instClientID;
        $scope.feeDataset = [];
        //更新表格对应的数据集
        $scope.subCapitalAccountProcessService.findFee(function (result) {
            var con = result;
            $scope.feeEntitys = result;
            for(var i = 0; i<con.length;i++){
                var tempArr = [$scope.transInstClientID(con[i].instClientID),con[i].subAccountID,con[i].exchID,$scope.transProductType(con[i].productType),con[i].productID,con[i].instrumentID,
                    con[i].tradeFeeRateStr,con[i].tradeFeeAmt,con[i].offsetFeeRateStr,con[i].offsetFeeAmt,con[i].otFeeRateStr,con[i].otFeeAmt,con[i].strikeFeeRateStr,con[i].strikeFeeAmt];
                $scope.feeDataset.push(tempArr);
            }
            //重新绘表
            $scope.feeTable.clear().draw();
            $scope.feeTable.rows.add($scope.feeDataset).draw();
            $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            $scope.isQuery = false;
            $scope.$apply();
        }, entity);
    };

    $scope.transProductType  = function (tradeType){
        for(var i = 0;i < $scope.ifOptions.length;i++){
            if($scope.ifOptions[i].key == tradeType){
                return $scope.ifOptions[i].text;
            }
        }
    }

    //定义资产单元开户流程表的固定列头
    $scope.subCapitalAccountProcess_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "所属机构"},
        {title: "资产单元"},
        {title: "资产单元名称"},
        {title: "基础币种"},
        {title: "业务组"},
        {title: "交易用户"},
        {title: "风控用户"},
        {title: "资金账户组"},
        {title: "资金账户顺序"},
        {title: "保证金率"},
        {title: "手续费率"},
        {title: "备注"},
        {title: "状态"},
        {title: "操作"}
    ];

    //定义资产单元保证金表的固定列头
    $scope.margin_columns = [
        {title: "所属机构"},
        {title: "资产单元"},
        {title: "交易所代码"},
        {title: "品种代码"},
        {title: "合约代码"},
        {title: "投保标志"},
        {title: "多头按金额"},
        {title: "多头按手数"},
        {title: "空头按金额"},
        {title: "空头按手数"}
    ];

    //定义资产单元保证金表的固定列头
    $scope.fee_columns = [
        {title: "所属机构"},
        {title: "资产单元"},
        {title: "交易所代码"},
        {title: "是否为期权"},
        {title: "品种代码"},
        {title: "合约代码"},
        {title: "开仓按金额"},
        {title: "开仓按手数"},
        {title: "平仓按金额"},
        {title: "平仓按手数"},
        {title: "平今按金额"},
        {title: "平今按手数"},
        {title: "行权按金额"},
        {title: "行权按手数"}
    ];

    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.subCapitalAccountProcessTable = $('#subCapitalAccountProcess_dynamic_table').DataTable( {
            data : $scope.subCapitalAccountProcessDataset,
            columns :$scope.subCapitalAccountProcess_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
            buttons: []
        });

        $scope.marginTable = $('#margin_dynamic_table').DataTable( {
            data : $scope.marginDataset,
            columns :$scope.margin_columns,
            "aaSorting" : [[2, "asc"],[3, "asc"],[4, "asc"],[5, "asc"]],
            dom: 'rt<"bottom"iplB>',
            buttons: []
        });

        $scope.feeTable = $('#fee_dynamic_table').DataTable( {
            data : $scope.feeDataset,
            columns :$scope.fee_columns,
            "aaSorting" : [[2, "asc"],[3, "asc"],[4, "asc"],[5, "asc"]],
            dom: 'rt<"bottom"iplB>',
            buttons: []
        });
    });
    
});

