myapp.controller('Userriskparameter', function ($scope, $timeout) {

    $scope.subCapitalAccountService =  new com.quantdo.orgClear.service.SubCapitalAccountService();
    $scope.subAccountRiskParamService =  new com.quantdo.orgClear.service.SubAccountRiskParamService();
    $scope.subAccounts = {};
    $scope.QuerySubAccount = {};
    $scope.entitys = [];
    $scope.canClick=false;
    $scope.listEntitys = [];
    $scope.ModalEntity = {};	//风险参数
    $scope.degreeEntity = {};	//风险度
    $scope.complianceEntitys = [];	//账号品种交易合规列表
    $scope.accountTradeComplianceEntity = {};	//账号合规参数
    $scope.exchangeDatas = [];	//全部交易所信息
    $scope.productDatas = [];	//全部品种信息
    $scope.productListDatas = [];	//多选交易所对应品种列表
    $scope.products = [];		//联动下拉框品种信息
    $scope.multiItems = []; 	//多选交易所
    $scope.multiProductItems = [];	//多选品种
    $scope.subAccount = {};
    $scope.isInsert = true; // 是否新增 true：新增 false：不新增
    $scope.isChange = "0"; // 是否切换 0：切换 1：不切换
    $scope.isList = [];		//交易合规界面list是否可以编辑
    $scope.isInvalid = false;	//合规参数是否合法
    $scope.canNotInsert = true;	//是否允许批量增加
    $scope.tmpComplianceEntitys = [];
    $scope.multiOptions1 = {
		scrollableHeight: '250px',
	    scrollable: true,
	    displayProp: 'exchName', idProp: 'exchID',externalIdProp: 'exchID'
    };
    $scope.defaultText1 = {buttonDefaultText: '请选择交易所'};
    $scope.multiOptions2 = {
    		scrollableHeight: '250px',
    	    scrollable: true,
    	    enableSearch: true,
    	    displayProp: 'productName', idProp: 'productID',externalIdProp: ''
        };
        $scope.defaultText2 = {buttonDefaultText: '请选择品种'};
    
    
//    $scope.isCommit = true;
    $scope.isUpdate = true;
    
    $scope.subCapitalAccountService.findAllActive(function (result) {
        $scope.subAccountRiskParam = result;
        $scope.$apply();
    });
    
    // 初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
        $scope.$apply();
    });
    
    // 按照产品类型获取产品信息
	findProductEntity(function(result) {
		$scope.productDatas = result;
		$scope.$apply();
	}, {});
    
    // table默认查询显示
    $scope.subCapitalAccountService.findSubById(function(result){
        $scope.listEntitys = result;
        $scope.$apply();
    },null);
    
    /*$scope.del = function(){
    	if(undefined == $scope.entitys || $scope.entitys.length == 0){
    		layer.msg("请选择批量删除目标",{icon:2});
    		return;
    	}
    	layer.confirm("确定删除风险参数？",{icon:3},function(){
            $scope.subAccountRiskParamService.deletes(function (result) {
                layer.msg("风险参数删除成功",{icon:1});
                $scope.listEntitys = {};
                $scope.subCapitalAccountService.find(function(result){
                    $scope.listEntitys = result;
                    $scope.$apply();
                },null);
                
                $scope.subCapitalAccountService.findAllActiveRisParam(function(result){
                	$scope.subAccountRiskParam = result;
                	$scope.$apply();
                });
                
                $scope.isSelected = false;
                $scope.entitys = [];
            },$scope.entitys);
        });
    }*/
    
    /*$scope.allCheckedAdd = function(flag){
    	//全选
    	if(flag){
    		$scope.isSelected = true;
    		$scope.entitys = angular.copy($scope.listEntitys);
    	} else {
    		$scope.isSelected = false;
			$scope.entitys = [];
    	}
    }*/

    $scope.find = function(subAccount){
    		 $scope.subCapitalAccountService.findSubById(function(result){
                 $scope.listEntitys = result;
                 $scope.$apply();
             },subAccount.subAccountID);
    }
    
    // 设置下拉框联动事件
    $scope.selectExchange = function (exchID) {
        $scope.products = [];
        $scope.accountTradeComplianceEntity.productID = "";
        getAllProductByConditionEntity(
            function (result) {
                if (result.length > 0) {
                    $scope.products = result;
                    $scope.accountTradeComplianceEntity.productID = $scope.products[0].productID;
                    $scope.$apply();
                }
            }, {
                exchID: exchID
            });
    };

    // 静态div中select的change事件
    $scope.findOne = function(entity){
    	$scope.initFund = null;
    	$scope.callRisk = null;
    	$scope.forceRisk = null;
    	$scope.stauts = "0";
    	if($scope.isChange == "0"){
    		query(entity);
    	}
    };
    
    // 修改编辑
    $scope.edit = function(index,entity){
    	$scope.ModalEntity = angular.copy(entity);
    	$scope.ModalEntity.recordIndex = index;
    	$scope.initFundText = "";
//    	$scope.maxMarginText = ""
    	$scope.forceRiskText = ""
    	$scope.callRiskText = ""
    	$scope.stauts = "1";
    	$scope.isInsert = false;
    	$scope.isChange = "0";
    	$scope.EditForm.initFund.$setPristine();
    	//$scope.EditForm.maxCancelAmt.$setPristine();
    	$scope.EditForm.callRisk.$setPristine();
    	$scope.EditForm.forceRisk.$setPristine();
    }
    
    // 风险度编辑
    $scope.riskDegree = function(index,entity){
    	$scope.degreeEntity = angular.copy(entity);
    	$scope.degreeEntity.recordIndex = index;
    	$scope.callRiskText = "";
    	$scope.forceRiskText = ""
    	$scope.isInsert = false;
    	$scope.degreeForm.callRisk.$setPristine();
    	$scope.degreeForm.forceRisk.$setPristine();
    }
    
    // 交易合规编辑
    $scope.tradeCompliance = function(index,entity){
    	$scope.tradeComplianceEntity = angular.copy(entity);
    	$scope.tradeComplianceEntity.recordIndex = index;
    	$scope.complianceEntitys = [];
    	$scope.tmpComplianceEntitys = [];
    	$scope.multiItems = [];
        $scope.multiProductItems = [];
    	$scope.isInsert = false;
    	$scope.tradeComplianceForm.maxPosiAmt.$setPristine();
    	$scope.tradeComplianceForm.maxCancelAmt.$setPristine();
    	findAccountTradeComplianceByAccountID(function(result){
    		if(result != undefined && result.length > 0){
    			$scope.complianceEntitys = result;
    			$scope.tmpComplianceEntitys = angular.copy($scope.complianceEntitys);
    			for(var i = 0; i < result.length;i++){
    				$scope.isList[i] = true;
    			}
    			$scope.$apply();
    		}
    	},entity.subAccountID);
    }
    
    // 账号交易合规参数新增
    $scope.insTradeCompliance = function(){
    	$scope.accountTradeComplianceEntity = {};
    	$scope.products = [];
    	$scope.accountTradeComplianceEntity.accountID = $scope.tradeComplianceEntity.subAccountID;
    	$scope.isComplianceUpdate = false;
    	$scope.accountTradeComplianceForm.exchID.$setPristine();
    	$scope.accountTradeComplianceForm.productID.$setPristine();
    	$scope.accountTradeComplianceForm.maxPosiAmt.$setPristine();
    	$scope.accountTradeComplianceForm.maxCancelAmt.$setPristine();
    }
   
    // 批量增加账号交易合规参数
    $scope.insTradeCompliances = function(){
    	angular.forEach($scope.multiProductItems, function(value,index,arrays){
//    	for(var i = 0; i < $scope.multiProductItems.length;i++){
    		var entity = {};
    		entity.accountID = $scope.tradeComplianceEntity.subAccountID;
    		entity.maxCancelAmt = $scope.tradeComplianceEntity.maxCancelAmt;
    		entity.maxPosiAmt = $scope.tradeComplianceEntity.maxPosiAmt;
    		entity.exchID = value.exchID;
    		entity.productID = value.productID;
	    	saveAccountTradeCompliance(function(result) {
				if(result != undefined){
					findProductEntity(function (productResult){
						if(productResult != undefined && productResult.length > 0){
							result.productName = productResult[0].productName;
						}
						$scope.complianceEntitys.unshift(result);
						$scope.tmpComplianceEntitys.unshift(result);
						$scope.isList[$scope.isList.length] = true;
						if(index == ($scope.multiProductItems.length - 1)){
							$scope.multiProductItems = [];
					    	$scope.multiItems = [];
					    	$scope.productListDatas = [];
					    	$scope.canNotInsert = true;
					    	for(var i = 0;i < $scope.isList.length;i++){
					    		$scope.isList[i] = true;
					    	}
					    	$scope.$apply();
					    	layer.msg("操作成功",{icon: 1, time: 1500});
						}
					},{
						productID: result.productID
					});
				}else{
					layer.msg("操作失败",{icon: 2, time: 1500});
	            	return false;
				}
			}, entity);
	    });
    	
    }
    
    // 账号交易合规参数修改
    $scope.editCompliance = function(index,entity){
    	$scope.isList[index] = false;
    	$scope.accountTradeComplianceEntity = entity;
    	$scope.products = $scope.productDatas;
    	$scope.accountTradeComplianceEntity.recordIndex = index;
    	$scope.accountTradeComplianceEntity.accountID = $scope.tradeComplianceEntity.subAccountID;
    	$scope.isComplianceUpdate = true;
    	$scope.accountTradeComplianceForm.exchID.$setPristine();
    	$scope.accountTradeComplianceForm.productID.$setPristine();
    	$scope.accountTradeComplianceForm.maxPosiAmt.$setPristine();
    	$scope.accountTradeComplianceForm.maxCancelAmt.$setPristine();
    }
    
    // 账号交易合规list参数修改
    $scope.editCompliance1 = function(index,entity){
    	$scope.isList[index] = false;
    }
    
    // 新增
    $scope.insert = function(){
    	$scope.initFundText = null;
    	$scope.callRiskText = null
    	$scope.forceRiskText = null;
    	$scope.isInsert = true;
    	$scope.stauts = "0";
    	$scope.isChange = "1";
    	$scope.ModalEntity = {};
    	$scope.subAccountID = {};
        $scope.ModalEntity = {};
        $scope.isCommit = true;
        formValidateReset();
    }
    
    //重置表单验证信息
    function formValidateReset(){
    	$scope.EditForm.initFund.$setPristine();
    	$scope.EditForm.forceRisk.$setPristine();
    	$scope.EditForm.callRisk.$setPristine();
    	
    }
    
    $scope.subCapitalAccountService.findAll(function(result){
    	$scope.tmpResult = [];
    	for(var i = 0; i < result.length; i++){
    		if(result[i].isActive == "1"){
    			$scope.tmpResult.push(result[i]);
    		}
    	}
        $scope.subAccounts = $scope.tmpResult;
        $scope.$apply();
    });
    
    // 查询风险参数
    function query(entity){
    	$scope.subAccountID = {};
    	$scope.subAccountID = entity.subAccountID;
    	$scope.subAccountRiskParamService.findOne(function(result){
            $scope.ModalEntity = result;
            $scope.$apply();
        },entity.subAccountID);
    	
    }

    $scope.delete = function(entity) {
        layer.confirm("确定删除风险参数？",{icon:3},function(){
            $scope.subAccountRiskParamService.delete(function (result) {
                layer.msg("风险参数删除成功",{icon:1});
                $scope.subCapitalAccountService.findSubById(function(result){
                    $scope.listEntitys = result;
                    $scope.$apply();
                },null);
                
                $scope.subCapitalAccountService.findAllActiveRisParam(function(result){
                	$scope.subAccountRiskParam = result;
                	$scope.$apply();
                });
                
               /* $scope.subAccountRiskParamService.findAll(function(result){
                	$scope.subAccountRiskParam = result;
                	$scope.$apply();
                	// table默认查询显示
                    $scope.subCapitalAccountService.find(function(result){
                        $scope.listEntitys = result;
                        $scope.$apply();
                    },null);
                });*/
                
            }, entity.subAccountID);
        });
    }
    
    // 风险信息保存
    $scope.save = function(ModalEntity){
    	$scope.canClick=true;
        var index = ModalEntity.recordIndex;
        if(undefined == ModalEntity.subAccountID || null == ModalEntity.subAccountID || "" ==ModalEntity.subAccountID.trim()){
        	$scope.canClick=false;
        	layer.msg("请选择资产单元",{icon:2});
            return ;
        }
        
        $scope.subAccountRiskParamService.save(function(result){
            if(undefined != result && null != result){
                layer.msg("操作成功",{icon: 1, time: 1500});
                findSubCapitalEntity(function(subCapital){
                	if(subCapital.length > 0){
                		result.subAccountName = subCapital[0].subAccountName;
                	}
                	if(index != undefined){
                		$scope.listEntitys.splice(index, 1, result);
                	}else{
                		 $scope.subCapitalAccountService.findSubById(function(result){
                             $scope.listEntitys = result;
                             $scope.$apply();
                         },$scope.QuerySubAccount.subAccountID);
                	}
                	
            		$scope.$apply();
                   
                },{
                	subAccountID: ModalEntity.subAccountID
                });
//                $scope.subCapitalAccountService.find(function(result){
//                    $scope.listEntitys = result;
//                    $scope.$apply();
//                },null);
//                
//                $scope.subCapitalAccountService.findAllActiveRisParam(function(result){
//                	$scope.subAccountRiskParam = result;
//                	$scope.$apply();
//                });
                
                /*$scope.subAccountRiskParamService.findAll(function(result){
                	$scope.subAccountRiskParam = result;
                	$scope.$apply();
                	 // table默认查询显示
                    $scope.subCapitalAccountService.find(function(result){
                        $scope.listEntitys = result;
                        $scope.subAccountRiskParam = result;
                        $scope.$apply();
                    },null);
                	
                });*/
                $("#userriskparameterEditModal").modal("hide");
                $timeout(function() {
		            $scope.canClick = false;
		        }, 1000); 
            }else{
            	$scope.canClick=false;
            	layer.msg("操作失败",{icon: 2, time: 1500});
            	return false;
            }
        },ModalEntity,$scope.isInsert);
        $timeout(function() {
            $scope.canClick = false;
        }, 3000); 
    };
    
    // 风险度保存
    $scope.saveDegree = function(entity){
    	var index = entity.recordIndex;
        $scope.subAccountRiskParamService.save(function(result){
            if(undefined != result && null != result){
                layer.msg("操作成功",{icon: 1, time: 1500});
                findSubCapitalEntity(function(subCapital){
                	if(subCapital.length > 0){
                		result.subAccountName = subCapital[0].subAccountName;
                	}
                	$scope.listEntitys.splice(index, 1, result);
            		$scope.$apply();
                    $("#userriskparameterDegreeModal").modal("hide");
                },{
                	subAccountID: entity.subAccountID
                });
            }else{
            	layer.msg("操作失败",{icon: 2, time: 1500});
            	return false;
            }
        },entity,$scope.isInsert);
    };
    
    // 交易合规账号合规参数list修改保存
    $scope.updateCompliance = function(index,entity){
//    	var index = entity.recordIndex;
    	if(entity.maxCancelAmt == '0' && entity.maxPosiAmt == '0'){
        	layer.msg("最大持仓上限和当日最大撤单次数不能同时为空",{icon: 2, time :1500});
        	return false;
        }
    	updateAccountTradeCompliance(function(result) {
        	$scope.isList[index] = true;
        	$scope.$apply();
    		layer.msg("操作成功",{icon: 1, time: 1500});
    	}, entity);
    };
    
    // 交易合规账号合规参数list修改取消
    $scope.cancelUpdateCompliance = function(index,entity){
//    	var index = entity.recordIndex;
    	entity.maxPosiAmt = $scope.tmpComplianceEntitys[index].maxPosiAmt;
    	entity.maxCancelAmt = $scope.tmpComplianceEntitys[index].maxCancelAmt;
    	$scope.isList[index] = true;
    	$scope.isInvalid = false;
    };
    
    // 交易合规保存
    $scope.saveTradeCompliance = function(entity){
    	var index = entity.recordIndex;
        $scope.subAccountRiskParamService.save(function(result){
            if(undefined != result && null != result){
                layer.msg("操作成功",{icon: 1, time: 1500});
                findSubCapitalEntity(function(subCapital){
                	if(subCapital.length > 0){
                		result.subAccountName = subCapital[0].subAccountName;
                	}
                	$scope.listEntitys.splice(index, 1, result);
            		$scope.$apply();
                    $("#tradeComplianceModal").modal("hide");
                },{
                	subAccountID: entity.subAccountID
                });
            }else{
            	layer.msg("操作失败",{icon: 2, time: 1500});
            	return false;
            }
        },entity,$scope.isInsert);
    };
    
    // 账号合规参数保存
	$scope.saveAccountTradeCompliance = function(entity) {
		var index = entity.recordIndex;
		if (index != undefined) {
			// 修改
			updateAccountTradeCompliance(function(result) {
				if(result != undefined){
					findProductEntity(function (productResult){
						if(productResult != undefined && productResult.length > 0){
							result.productName = productResult[0].productName;
						}
						$scope.complianceEntitys.splice(index, 1, result);
						$scope.tmpComplianceEntitys.splice(index, 1, result);
						$scope.$apply();
						$("#accountTradeComplianceModal").modal("hide");
						layer.msg("操作成功",{icon: 1, time: 1500});
					},{
						productID: result.productID
					});
				}else{
					layer.msg("操作失败",{icon: 2, time: 1500});
	            	return false;
				}
			}, entity);
		} else {
			// 新增
			findAccountTradeCompliance(function(result) {
				if (result.length > 0) {
					layer.msg('该账号交易合规参数已设置，请重新填写', {icon : 2});
				} else {
					saveAccountTradeCompliance(function(result) {
						if(result != undefined){
							findProductEntity(function (productResult){
								if(productResult != undefined && productResult.length > 0){
									result.productName = productResult[0].productName;
								}
								$scope.complianceEntitys.unshift(result);
								$scope.tmpComplianceEntitys.unshift(result);
								$scope.isList[$scope.isList.length] = true;
								$scope.$apply();
								$("#accountTradeComplianceModal").modal("hide");
								layer.msg("操作成功",{icon: 1, time: 1500});
							},{
								productID: result.productID
							});
						}else{
							layer.msg("操作失败",{icon: 2, time: 1500});
			            	return false;
						}
					}, entity);
				}
			}, {
				productID: entity.productID,
				exchID:	entity.exchID,
				accountID: entity.accountID
			});
		}
	};
    
    // 删除账号合规参数
    $scope.delCompliance = function (index, entity) {
        // 使用内置Index
        layer.confirm('确定删除', {icon: 3}, function (count) {
        	$scope.complianceEntitys.splice(index, 1);
        	$scope.tmpComplianceEntitys.splice(index, 1);
            layer.close(count);
            $scope.$apply();
        	deleteAccountTradeCompliance(entity.id);
        });
    };
    
    $scope.checkAdd = function(flag,entity){
    	if(flag) {
    		 $scope.entitys.push(entity);
		} else {
			var index = $scope.entitys.indexOf(entity);
			 $scope.entitys.splice(index, 1);
		}
    }
    
    //检验交易合规修改是否有效
    $scope.checkUppdateValue = function(entity){
    	var g = /^[0-9]*[0-9][0-9]*$/;
        if(g.test(entity.maxCancelAmt) && g.test(entity.maxPosiAmt)){
        	$scope.isInvalid = false;
        }else{
        	$scope.isInvalid = true;
        }
    };
    
    //检验是否可以批量新增
    $scope.canBatchInsert = function(){
    	if($scope.multiProductItems != null && $scope.multiProductItems.length > 0){
			$scope.canNotInsert = false;
    	}else{
    		$scope.canNotInsert = true;
    	}
    }
    /*$scope.changed = function(subAccountID){
    	if(undefined == subAccountID || "" == subAccountID){
    		$scope.isCommit = true;	
    	} else {
    		$scope.isCommit = false;
    	}	
    }*/
    
    // 根据多选的交易所获取多选品种待选列表
    $scope.getProductList = function(){
    	$scope.productListDatas = [];
    	findUndoProductItems(function(result){
    		$scope.productListDatas = result;
    		$scope.$apply();
    	},$scope.multiItems,$scope.tradeComplianceEntity.subAccountID)
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
    			$scope.initFundText = "";
    			break;
    		case 1:
    			$scope.callRiskText = "";
    			break;
    		case 2:
    			$scope.forceRiskText = "";
    			break;
    		case 3:
    			$scope.maxMarginText = "";
    			break;
    		}
    		$scope.initFund = null;
        	$scope.callRisk = null;
        	$scope.forceRisk = null;
        	$scope.maxMargin = null;
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
    			$scope.maxMarginText =text;
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
