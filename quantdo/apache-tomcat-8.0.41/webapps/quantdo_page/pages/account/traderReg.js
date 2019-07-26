myapp.controller('traderRegController', function($scope, $timeout,$rootScope) {
	
	//表单对象
	$scope.traderInfo = {};	//联系电话、备注
	$scope.trader = {};		//风险、名称
	$scope.tradeUser = {};	//密码
	$scope.userTrader = {};	//
	$scope.subCapitalAccount = {};	//持仓类型
	$scope.tmpTraderUser = {};		//确认密码
	$scope.tmpSubCapitalAccount = {};	//资产单元对应信息
	$scope.subAccountRiskParam = {};	//风险信息
	$scope.subAccountTemplate = {};		//对应费率
	$scope.subAccountTemplateReg = [];	//对应费率实际存储列表
	$scope.radio = "1";		//资产单元radio
	//表单用于判断的变量
	$scope.isCreateTraderLoginInfoFlag = 0;
	$scope.pwdBlank = true;
	//下拉框列表数组
	$scope.positionTypes = clearConstant.positionTypes;
    $scope.currencys = clearConstant.currenys;
	$scope.subCapitalAccount.positionType = $scope.positionTypes[0].key;
	$scope.subCapitalAccount.currency = $scope.currencys[0].key;
	$scope.capitalAccountEntitys = [];
	$scope.accountGroupEntitys = [];
	$scope.marginTemplateEntitys = [];
	$scope.feeTemplateEntitys = [];
	
	$scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService();
	//控制组件是否disabled
	$scope.traderPwdFlag = true;
	$scope.isSelected1 = false;
	$scope.isSelected2 =true;
    $scope.isSelected3 = true;
    $scope.isSelected4 = true;
    //checkbox值
    $scope.x = false;
    $scope.y = false;
	
	//获取页面加载时所需数据集合
	findActiveCapitalAccount(function (result) {
    	if(result.length > 0){
    		$scope.capitalAccountEntitys = result;
            $scope.tmpSubCapitalAccount.innerAccountID = $scope.capitalAccountEntitys[0].innerAccountID;
            $scope.$apply();
    	}
    });
	
	getAllAccountGroupsEntity(function (result) {
        $scope.accountGroupEntitys = result;
        $scope.tmpSubCapitalAccount.accountGroupID = $scope.accountGroupEntitys[0].accountGroupID;
        $scope.$apply();
    });
	
	getAllFeeTemplateEntity(function (result){
		$scope.feeTemplateEntitys =result;
		if(result.length > 0){
			$scope.subAccountTemplate.feeTemplateID = $scope.feeTemplateEntitys[0].templateID;
		}
        $scope.$apply();
	});
	
	getAllMarginTemplate(function (result){
		$scope.marginTemplateEntitys =result;
		if(result.length > 0){
			$scope.subAccountTemplate.marginTemplateID = $scope.marginTemplateEntitys[0].templateID;
		}
        $scope.$apply();
	});
	
	//判断密码框是否为空或者空格
	$scope.isBlank = function (pwd,pwdAg){
		if($scope.isCreateTraderLoginInfoFlag == 1){
			$scope.pwdBlank = true;
			if(pwd == undefined || pwd.trim() == "" ||pwdAg == undefined || pwdAg.trim() == ""){
				$scope.pwdBlank = true;
			}else{
				$scope.pwdBlank = false;
			}
		}else{
			$scope.pwdBlank = false;
		}
	}
	
	// 是否同步生成登录交易员代码checkbox变化事件
	$scope.changeIsCreateTraderLoginInfoFlag = function (isCreateTraderLoginInfoFlag){
		if(isCreateTraderLoginInfoFlag == 0){
			$scope.traderPwdFlag = true;
			$scope.tradeUser.password = "";
			$scope.tmpTraderUser.pwdAg = "";
		}else{
			$scope.traderPwdFlag = false;
			$scope.pwdBlank = true;
		}
	};
	
	//资产单元对应信息radio事件
	$scope.changeState = function (){
		if($scope.radio == "1"){
			$scope.isSelected2 = true;
			$scope.isSelected1 = false;
		}
		if($scope.radio == "2"){
			$scope.isSelected1 = true;
			$scope.isSelected2 = false;
		}
	}
	
	//费率设置checkbox事件
	$scope.isMargin = function (x){
		if(x==true){
			if($scope.subAccountTemplate.marginTemplateID == undefined ||
					$scope.subAccountTemplate.marginTemplateID == ""){
				layer.msg("对应保证金率模板为空，不能选择该项", {
					icon : 2,
					time : 2000
				});
				$scope.x=false;
				$scope.isSelected3=true;
			}else{
				$scope.isSelected3=false;
			}
		}else{
			$scope.isSelected3=true;
		}
	}
	
	$scope.isFee = function (y){
		if(y==true){
			if($scope.subAccountTemplate.feeTemplateID == undefined ||
					$scope.subAccountTemplate.feeTemplateID == ""){
				layer.msg("对应手续费率模板为空，不能选择该项", {
					icon : 2,
					time : 2000
				});
				$scope.y=false;
				$scope.isSelected4=true;
			}else{
				$scope.isSelected4=false;
			}
		}else{
			$scope.isSelected4=true;
		}
	}
	
	// 完成
	$scope.finish = function(trader, traderInfo, tradeUser,subCapitalAccount,subAccountRiskParam) {
		if($scope.isCreateTraderLoginInfoFlag == 1){
			var pwd1 = $scope.tradeUser.password.trim();
			var pwd2 = $scope.tmpTraderUser.pwdAg.trim();
			if (pwd1 != pwd2) {
				layer.msg("两次密码输入不一致，请重新输入", {
					icon : 2,
					time : 2000
				});
				return false;
			}
		}
		trader.isActive = '1';
		traderInfo.traderID = trader.traderID;
		tradeUser.userID = trader.traderID;
		tradeUser.userName = trader.traderName;
		tradeUser.userType = '1';
		tradeUser.isActive = '1';
		$scope.userTrader.traderID = trader.traderID;
		$scope.userTrader.userID = trader.traderID;
		subCapitalAccount.isActive = '1';
		subCapitalAccount.traderID = trader.traderID;
		subCapitalAccount.subAccountID = trader.traderID;
		subCapitalAccount.subAccountName = trader.traderName;
		subAccountRiskParam.subAccountID = trader.traderID;
		
		//资产单元对应信息
		//选择对应资金帐号
		if($scope.radio == "1"){
			subCapitalAccount.innerAccountID = $scope.tmpSubCapitalAccount.innerAccountID;
			subCapitalAccount.accountGroupID = null;
		}
		//选择对应资金帐号组
		else if($scope.radio == "2"){
			subCapitalAccount.accountGroupID = $scope.tmpSubCapitalAccount.accountGroupID;
			subCapitalAccount.innerAccountID =null;
		}
		
		//风险信息空值处理
		if(subAccountRiskParam.initFund == undefined || subAccountRiskParam.initFund == ""){
			subAccountRiskParam.initFund = 0;
		}
		if(subAccountRiskParam.callRisk == undefined || subAccountRiskParam.callRisk == ""){
			subAccountRiskParam.callRisk = 0;
		}
		if(subAccountRiskParam.forceRisk == undefined || subAccountRiskParam.forceRisk == ""){
			subAccountRiskParam.forceRisk = 0;
		}
		if(subAccountRiskParam.maxMargin == undefined || subAccountRiskParam.maxMargin == ""){
			subAccountRiskParam.maxMargin = 0;
		}
		if(subAccountRiskParam.maxPosiAmt == undefined || subAccountRiskParam.maxPosiAmt == ""){
			subAccountRiskParam.maxPosiAmt = 0;
		}
		if(subAccountRiskParam.maxCancelAmt == undefined || subAccountRiskParam.maxCancelAmt == ""){
			subAccountRiskParam.maxCancelAmt = 0;
		}
		
		//对应费率模板
		$scope.subAccountTemplateReg = [];
		if($scope.x==true){
			$scope.tmpRegEntity = {};
			$scope.tmpRegEntity.subAccountID = trader.traderID;
			$scope.tmpRegEntity.templateID = $scope.subAccountTemplate.marginTemplateID;
			$scope.tmpRegEntity.templateType = "1";
			$scope.subAccountTemplateReg.push($scope.tmpRegEntity);
		}
		if($scope.y==true){
			$scope.tmpRegEntity = {};
			$scope.tmpRegEntity.subAccountID = trader.traderID;
			$scope.tmpRegEntity.templateID = $scope.subAccountTemplate.feeTemplateID;
			$scope.tmpRegEntity.templateType = "2";
			$scope.subAccountTemplateReg.push($scope.tmpRegEntity);
		}
		var flag = false;
		if($scope.isCreateTraderLoginInfoFlag == 0){
			flag = false;
		}else{
			flag = true;
		}
		saveTraderReg(function(result){
			if(result != null){
				layer.msg("开户成功",{icon:1,time: 1500});
				$rootScope.addPane('资产单元开户','traderRegController','account/traderReg.html','reg');
			}else{
				layer.msg("开户失败",{icon:2,time: 1500});
				return false;
			}
		}, flag, trader, traderInfo, tradeUser, $scope.userTrader, subCapitalAccount, subAccountRiskParam, $scope.subAccountTemplateReg);
	}

	// 阿拉伯数字转换成中文
    $scope.toChinaNum = function(number,i){
    	toChinese(number,i);
    }
    
    $scope.inputBlur = function(number,i){
    	toChinese(number,i);
    }
    
    function toChinese(number,i){
    	if(undefined == number || "" == number){
    		switch(i){
    		case 0:
    			$scope.initFundText = null;
    			break;
    		case 1:
    			$scope.callRiskText = null;
    			break;
    		case 2:
    			$scope.forceRiskText = null;
    			break;
    		case 3:
    			$scope.maxMarginText = null;
    			break;
    		}
        	return ;
    	}
    	
    	var text = changeMoneyToChinese(number);
    	if(text != "error"){
    		switch(i){
    		case 0:
    			$scope.initFundText = text;
    			break;
    		case 1:
    			$scope.callRiskText = text;
    			break;
    		case 2:
    			$scope.forceRiskText = text;
    			break;
    		case 3:
    			$scope.maxMarginText = text;
    			break;
    		}
    	}
    }
    
    function changeMoneyToChinese( money )
    {
    var cnNums = new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"); // 汉字的数字
    var cnIntRadice = new Array("","拾","佰","仟"); // 基本单位
    var cnIntUnits = new Array("","万","亿","兆"); // 对应整数部分扩展单位
    var cnDecUnits = new Array("角","分","毫","厘"); // 对应小数部分单位
    var cnInteger = "整"; // 整数金额时后面跟的字符
    var cnIntLast = "元"; // 整型完以后的单位
    var maxNum = 999999999999999.9999; // 最大处理的数字

    var IntegerNum; // 金额整数部分
    var DecimalNum; // 金额小数部分
    var ChineseStr=""; // 输出的中文金额字符串
    var parts; // 分离金额后用的数组，预定义

    if( money == "" ){
    	return "";
    }

    money = parseFloat(money);
    if( money >= maxNum ){
    	layer.msg("超出最大处理数字",{icon:2});
    	return "";
    }
    if( money == 0 ){
    	ChineseStr = cnNums[0]+cnIntLast+cnInteger;
    	return ChineseStr;
    }
    money = money.toString(); // 转换为字符串
    if( money.indexOf(".") == -1 ){
    	IntegerNum = money;
    	DecimalNum = '';
    }else{
    	parts = money.split(".");
    	IntegerNum = parts[0];
    	DecimalNum = parts[1].substr(0,4);
    }
    if( parseInt(IntegerNum,10) > 0 ){// 获取整型部分转换
    	zeroCount = 0;
    	IntLen = IntegerNum.length;
	    for( i=0;i<IntLen;i++ ){
	    	n = IntegerNum.substr(i,1);
	    	p = IntLen - i - 1;
	    	q = p / 4;
	    	m = p % 4;
	    if( n == "0" ){
	    	zeroCount++;
	    }else{
	    	if( zeroCount > 0 ){
	    		ChineseStr += cnNums[0];
	    	}
	    	zeroCount = 0; // 归零
	    	ChineseStr += cnNums[parseInt(n)]+cnIntRadice[m];
	    }
		    if( m==0 && zeroCount<4 ){
		    	ChineseStr += cnIntUnits[q];
		    }
	    }
    ChineseStr += cnIntLast;
    // 整型部分处理完毕
    }
    if( DecimalNum!= '' ){// 小数部分
    	decLen = DecimalNum.length;
	    for( i=0; i<decLen; i++ ){
	    	n = DecimalNum.substr(i,1);
		    if( n != '0' ){
		    	ChineseStr += cnNums[Number(n)]+cnDecUnits[i];
		    }
	    }
    }
    if( ChineseStr == '' ){
    	ChineseStr += cnNums[0]+cnIntLast+cnInteger;
    }
    else if( DecimalNum == '' ){
    	ChineseStr += cnInteger;
    }
    	return ChineseStr;
    }
});
