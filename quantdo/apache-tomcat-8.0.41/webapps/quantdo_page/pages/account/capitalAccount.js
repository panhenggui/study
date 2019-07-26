myapp.controller('capitalAccountController', function ($scope,$timeout,$rootScope) {
	
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	$scope.fundWorkFlowService = new com.quantdo.orgClear.service.FundWorkFlowService();
	$scope.capitalService = new com.quantdo.orgClear.service.CapitalAccountService();
    $scope.seatUserService = new com.quantdo.orgClear.service.SeatUserService();
    $scope.dictionaryService = new com.quantdo.orgClear.service.dictionaryService();
	
    $scope.rightSelects = clearConstant.tradeRights;
    $scope.linkAccountTypes=clearConstant.linkAccountType;
    $scope.capitalAccountEntitys = [];
    $scope.seatEntitys = [];
    $scope.selectSeatEntitys = [];
    $scope.capitalEntity = {};
    $scope.queryEntity = {};
    $scope.ModalEntity = {};
    $scope.brokerages = new Array();
    $scope.accountGroupEntitys = [];
    $scope.accountGroupEntityTems = [];
    
    $scope.fundProducts = new Array();
    $scope.modalShow = "";
    $scope.canSet = true;
    $scope.canSetSeat = true;
    
    $scope.checkbox = {};
    $scope.instClientlistEntitys=[];
    $scope.positionTypes = clearConstant.positionTypes;
    $scope.currencys = clearConstant.currenys;
    $scope.marketTypes = clearConstant.marketType;
    $scope.isOption = false;
    $scope.isNotDatas = clearConstant.isNotDatas;
	$scope.capitalAccountDataset = [];
    $scope.capitalAccount_query = isShow("capitalAccount_query");
    $scope.capitalAccount_add = isShow("capitalAccount_add");
    $scope.capitalAccount_update = isShow("capitalAccount_update");
    $scope.capitalAccount_start = isShow("capitalAccount_start");
    $scope.capitalAccount_rigth = isShow("capitalAccount_rigth");
    $scope.capitalAccount_password = isShow("capitalAccount_password");
    $scope.capitalAccount_check = isShow("capitalAccount_check");
    $scope.capitalAccount_connect = isShow("capitalAccount_connect");
	
	//定义固定列头
    $scope.capitalAccount_columns = [
        {title:"<a class='click-choice-all'></a>"},
        {title: "序号"},
        {title: "id",visible:false},
        {title: "资金账号"},
        {title: "账户名称"},
        {title: "经纪公司名称"},
        {title: "投资者代码"},
        {title: "所属机构"},
        {title: "基金产品名称"},
        {title: "持仓类型",visible:false},
        {title: "资金账号组"},
        {title: "基础币种"}, 
        {title: "允许交易市场"},
        {title: "账号状态"},
        {title: "席位用户代码"},
        {title: "席位连接状态"},
        {title: "有效性"},
        {title: "营业部"},
		{title: "操作"},
		{title: "productOption",visible:false},
		{title: "交易所权限",visible:false}
	]
    
    $scope.hideFundProduct = false;
    isHideFundProduct(function(result){
    	$scope.hideFundProduct = result;
    	if(result == true){
    		//定义固定列头
    	    $scope.capitalAccount_columns = [
                {title:"<a class='click-choice-all'></a>"},
    	        {title: "序号"},
    	        {title: "id",visible:false},
    	        {title: "资金账号"},
    	        {title: "账户名称"},
    	        {title: "经纪公司名称"},
    	        {title: "投资者代码"},
    	        {title: "所属机构"},
    	        {title: "基金产品名称",visible:false},
    	        {title: "持仓类型",visible:false},
                {title: "资金账号组"},
    	        {title: "基础币种"}, 
    	        {title: "允许交易市场"},
    	        {title: "账号状态"},
    	        {title: "席位用户代码"},
                {title: "席位连接状态"},
    	        {title: "有效性"},
    	        {title: "营业部"},
    			{title: "操作"},
    			{title: "productOption",visible:false},
    			{title: "交易所权限",visible:false}
    		];
    	}
    	
    	$scope.capitalAccountTable = $('#capitalAccount_dynamic_table').DataTable( {
    		data : $scope.capitalAccountDataset,
        	columns :$scope.capitalAccount_columns,
        	ordering:false,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 2
            },
			buttons: [
			]
        });
    	
    	$scope.$apply();
    	$scope.find();
    });
    
    //新增账号密码
    var id = document.getElementById('capitalAccount_passStrength');
    var div = document.createElement('div');
    var strong = document.createElement('strong');
    $scope.oStrengthca = id.appendChild(div);
    $scope.oStrengthTxtca = id.parentNode.appendChild(strong);
    
    var idag = document.getElementById('capitalAccount_passStrengthag');
    var divag = document.createElement('div');
    var strongag = document.createElement('strong');
    $scope.oStrengthcaag = idag.appendChild(divag);
    $scope.oStrengthTxtcaag = idag.parentNode.appendChild(strongag);
    
    //修改密码
    var idtwo = document.getElementById('capitalAccount_passStrengthtwo');
    var divtwo = document.createElement('div');
    var strongtwo = document.createElement('strong');
    $scope.oStrengthcatwo = idtwo.appendChild(divtwo);
    $scope.oStrengthTxtcatwo = idtwo.parentNode.appendChild(strongtwo);
    
    var idtwoag = document.getElementById('capitalAccount_passStrengthtwoag');
    var divtwoag = document.createElement('div');
    var strongtwoag = document.createElement('strong');
    $scope.oStrengthcatwoag = idtwoag.appendChild(divtwoag);
    $scope.oStrengthTxtcatwoag = idtwoag.parentNode.appendChild(strongtwoag);
    
    
   // 席位用户密码 
    var idthr = document.getElementById('capitalAccount_passStrengththr');
    var divthr = document.createElement('div');
    var strongthr = document.createElement('strong');
    $scope.oStrengthcathr = idthr.appendChild(divthr);
    $scope.oStrengthTxtcathr = idthr.parentNode.appendChild(strongthr);
    
    var idthrag = document.getElementById('capitalAccount_passStrengththrag');
    var divthrag = document.createElement('div');
    var strongthrag = document.createElement('strong');
    $scope.oStrengthcathrag = idthrag.appendChild(divthrag);
    $scope.oStrengthTxtcathrag = idthrag.parentNode.appendChild(strongthrag);
    $scope.isAllowInstClient = true;
    
    
    getAllFundProductEntity(function (result) {
        $scope.fundProducts = result;
        $scope.$apply();
    });

    //初始化机构信息
    $scope.queryinstClientlists =[];
    $scope.instClientService.findByQuery(function (result) {
        $scope.instClientlistEntitys = result;
        $scope.queryinstClientlists = result;
        $scope.$apply();
    },{});
    

    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientlistEntitys.length; i++){
    		if($scope.instClientlistEntitys[i].instClientID == instClientID){
    			return $scope.instClientlistEntitys[i].instClientAbbrName;
    		}
    	}
    }
    
    // 获取账户设置系统设置
    getSystemConfig("account", function (result) {
    	
    	if (result != undefined ){
    		
    		$scope.isAllowInstClient = false;
    	}else{
    		
    		$scope.isAllowInstClient = true;
    	}
    	
    	$scope.$apply();
    })
    
    // 
	getAccountGroupsByInstClientId(function (result){
    	$scope.accountGroupEntitys = result;
    	$scope.$apply();
    },null);
    
    $scope.instClientID = '';
    queryInstClientID(function (result) {
        $scope.instClientID = result;
        $scope.queryEntity={};
        if($scope.instClientID != undefined ){
        	$scope.isInstClient = true;
        	 $scope.queryEntity.instClientID=$scope.instClientID;
        }else{
        	$scope.isInstClient = false;
        }
        
        $scope.$apply();
    });
    
    getAllSeatEntity(function (result){
    	$scope.seatEntitys = result;
        $scope.$apply();
    });
    
    $scope.branchs=[];
    getAllBranchs(function (result){
    	$scope.branchs = result;
        $scope.$apply();
    });
    $scope.allSeatEntitys=[];
  	 findSeatEntity(function(result){
       	$scope.selectSeatEntitys = result;
    	$scope.allSeatEntitys = result;
       	$scope.$apply();
       },{});
    
    // 查询所有经济公司代码
    getAllBrokerageFirmEntity(function (result) {
        $scope.brokerages = result;
        $scope.$apply();
    })

    $scope.brokerageSelect = function (brokerageFirmID) {
    	$scope.selectSeatEntitys =[];
    	 var count = $scope.brokerages.length;
         for (var i = 0; i < count; i++) {
             if ($scope.brokerages[i].brokerageFirmID == brokerageFirmID) {
            	 if($scope.brokerages[i].isMainBroker==1){
            		 $scope.canSetSeat = false;
            		 $scope.capitalEntity.seatID=null;
            	 } else {
                	 $scope.canSetSeat = true;
                	 findSeatEntity(function(result){
                      	$scope.selectSeatEntitys = result;
                      	if($scope.selectSeatEntitys.length>0 && $scope.checkbox.selected == true){
                      		$scope.capitalEntity.seatID=$scope.selectSeatEntitys[0].seatID;
                      	}
                          $scope.$apply();
                      },{brokerageFirmID :brokerageFirmID});
                 }
             }
         }
         if($scope.capitalEntity.brokerageFirmID != undefined){
        	 $scope.capitalEntity.innerAccountID=$scope.capitalEntity.brokerageFirmID+$scope.capitalEntity.accountID;
         }
    };
    
    
    $scope.capSelect = function (brokerageFirmID) {
         if($scope.capitalEntity.brokerageFirmID != undefined){
        	 $scope.capitalEntity.innerAccountID=$scope.capitalEntity.brokerageFirmID+$scope.capitalEntity.accountID;
         }
    };
    // 页面经济公司名称转换
    $scope.trans = function (text) {
        var count = $scope.brokerages.length;
        for (var i = 0; i < count; i++) {
            if ($scope.brokerages[i].brokerageFirmID == text) {
                return $scope.brokerages[i].brokerageFirmName;
            }
        }
    };
    
    // 页面基金产品名称转换
    $scope.transFundProduct = function (text,instClientID) {
        var count = $scope.fundProducts.length;
        for (var i = 0; i < count; i++) {
            if ($scope.fundProducts[i].fundProductID == text && $scope.fundProducts[i].instClientID ==instClientID) {
                return $scope.fundProducts[i].shortProductName;
            }
        }
    };
    
    // 页面营业部门名称转换
    $scope.transBranch = function (branchId) {
        var result=  "";
        if(branchId!=null&&branchId!=undefined){
        	for (var i = 0; i < $scope.branchs.length; i++) {
                if ($scope.branchs[i].branchID == branchId) {
                    result =branchId +"-"+ $scope.branchs[i].branchName;
                }
            }
        }
        return result;
        
    };
    
    // 持仓类型名称转换
    $scope.transPositionType = function (key) {
    	for(var i = 0;i < $scope.positionTypes.length; i++){
    		if($scope.positionTypes[i].key == key){
    			return $scope.positionTypes[i].text;
    		}
    	}
    }
    
    // 账号分组名称转换
    $scope.transAccountGroup = function (accountGroupID,isActive) {
	    var count = $scope.accountGroupEntitys.length;
		for (var i = 0; i < count; i++){
			if($scope.accountGroupEntitys[i].accountGroupID == accountGroupID){
				return $scope.accountGroupEntitys[i].accountGroupName;
			}
		}
		if(isActive == "1"){
            return "不参与分组";
        }else{
            return "";
        }

    };
    
    // 转换交易通道
    $scope.transSeats = function (text){
    	var count = $scope.seatEntitys.length;
        for (var i = 0; i < count; i++) {
            if ($scope.seatEntitys[i].seatID == text) {
                return $scope.seatEntitys[i].seatName;
            }
        }
    }
    
    // 转换交易权限
    $scope.transTradeRights = function (text){
    	var count = $scope.rightSelects.length;
        for (var i = 0; i < count; i++) {
            if ($scope.rightSelects[i].key == text) {
                return $scope.rightSelects[i].text;
            }
        }
    }
    
    // 转换允许交易市场类型
    $scope.transMarketTypes = function (text){
    	var count = $scope.marketTypes.length;
        for (var i = 0; i < count; i++) {
            if ($scope.marketTypes[i].key == text) {
                return $scope.marketTypes[i].text;
            }
        }
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
    
    //交易通道复选框事件
/*    $scope.changeState = function(){
    	if($scope.checkbox.selected == true){
    		$scope.canSet = false;
     		$scope.capitalEntity.seatID = $scope.seatEntitys[0].seatID;
     		
    	}else{
    		$scope.canSet = true;
    		$scope.capitalEntity.seatID = null;
    
    	}
    }*/
    
    $scope.changeSeat = function(seatId){
    	if(seatId == undefined || seatId == null || seatId=="" ){
    		$scope.isNotCTP=false;
    	}else {
        	var count = $scope.selectSeatEntitys.length;
            for (var i = 0; i < count; i++) {
                if ($scope.selectSeatEntitys[i].seatID == seatId) {
                	 if($scope.selectSeatEntitys[i].seatSystem == 0 ||
                		$scope.selectSeatEntitys[i].seatSystem == 2 ||
                		$scope.selectSeatEntitys[i].seatSystem == 6 ||
                		$scope.selectSeatEntitys[i].seatSystem == 8 ||
                		$scope.selectSeatEntitys[i].seatSystem == 15 ||
                		$scope.selectSeatEntitys[i].seatSystem == 17 ||
                		$scope.selectSeatEntitys[i].seatSystem == 18 ||
                		$scope.selectSeatEntitys[i].seatSystem == 19 ||
                		$scope.selectSeatEntitys[i].seatSystem == 20){
                    	 $scope.isNotCTP=true;
                      	 findSeatUsers();
                     }else {
                    	 $scope.isNotCTP=false;
                     }
                }
            }
    	}
    }

    $scope.capitalService.findPageInfoByQuery(function(result){
    	$scope.capitalAccountEntitys = angular.copy(result);
    	$scope.$apply();
    },{});
    
    // 重置表单验证信息
    function formValidateReset() {
        $scope.capitalAccountForm.accountID.$setPristine();
        $scope.capitalAccountForm.accountName.$setPristine();
        $scope.capitalAccountForm.brokerageFirmID.$setPristine();
//        $scope.capitalAccountForm.tradeRight.$setPristine();
        //$scope.capitalAccountForm.positionType.$setPristine();
        $scope.capitalAccountForm.currency.$setPristine();
        $scope.capitalAccountForm.password.$setPristine();
        $scope.capitalAccountForm.rePassword.$setPristine();
        $scope.capitalAccountForm.innerAccountID.$setPristine();
    }

    // 初始化页面参数
    $scope.initParameter = function () {
        // 设置默认选中
    	$scope.isUpdate = false;
        $scope.showPass = true;
        $scope.canSetSeat = true;

     	
     	$scope.isNotCTP=false;
    	$scope.capitalEntity = {};
        $scope.capitalEntity.tradeRight =$scope.rightSelects[0].key;
        $scope.capitalEntity.selfTradeAvoidType = $scope.isNotDatas[1].key;
    	$scope.capitalEntity.seatID = "";
        var count = $scope.brokerages.length;
        if(count ==0){
        	layer.msg("无经纪公司信息，请先设置经纪公司信息", {
				icon : 2,
				time : 2000
			});
			return false;	
        }
        $scope.capitalEntity.brokerageFirmID = $scope.brokerages[0].brokerageFirmID;
        for (var i = 0; i < count; i++) {
            if ($scope.brokerages[i].brokerageFirmID == $scope.capitalEntity.brokerageFirmID ) {
            	if($scope.brokerages[i].isMainBroker==1){
            		$scope.canSetSeat = false;
            	} else {
               	    $scope.canSetSeat = true;
                }
            }
        } 
        
        $scope.capitalEntity.positionType = $scope.positionTypes[1].key;
        $scope.capitalEntity.currency = $scope.currencys[0].key;
        $scope.capitalEntity.market = $scope.marketTypes[0].key;
        
        if($scope.instClientID != undefined ){
        	$scope.isInstClient = true;
        	$scope.capitalEntity.instClientID =$scope.instClientID;
        }else{
        	$scope.capitalEntity.instClientID = $scope.instClientlistEntitys[0].instClientID;
        	$scope.isInstClient = false;
        }
        
        if ($scope.capitalEntity.instClientID != undefined ){
            $scope.isInstClientSelect($scope.capitalEntity.instClientID);
        }

        $scope.selectSeatEntitys =[];
        findSeatEntity(function(result){
        	$scope.selectSeatEntitys = result;
            $scope.$apply();
        },{brokerageFirmID : $scope.capitalEntity.brokerageFirmID});
        
        if(!$scope.isInstClient || ($scope.isInstClient && $scope.isAllowInstClient)){
        	//$scope.capitalEntity = {};
        	$("#capitalAccountModal").modal("show");
        }  
        $("#capitalAccountModal").modal("show");
        $scope.oStrengthca.className = 'strengthLv0';
        $scope.oStrengthTxtca.innerHTML ='';
    	$scope.oStrengthcaag.className = 'strengthLv0';
        $scope.oStrengthTxtcaag.innerHTML ='';
        formValidateReset();
        validCodeLoad();
	    document.getElementById("capitalAccountValidcode").value=""; 
        
    };

    // 修改
    $scope.initUpdateParam = function (index, entity) {
    	if(entity.isActive == 0){
    		$scope.capitalAccountUpdateTarget = "";
    		layer.msg("此资金账号已停用,不允许修改",{icon: 2, time: 2000});
    	}else{
    		
    		$scope.tempEntity = angular.copy(entity);
            $scope.tempEntity.recordIndex = index;
            $scope.brokId="";
            $scope.brokId = $scope.tempEntity.brokerageFirmID;
            $scope.capitalEntity = angular.copy($scope.tempEntity);
            
	       	var count = $scope.brokerages.length;
	        $scope.canSetSeat = false;
	        for (var i = 0; i < count; i++) {
	            if ($scope.brokerages[i].brokerageFirmID == $scope.capitalEntity.brokerageFirmID) {
	            	if($scope.brokerages[i].isMainBroker==1){
	            		$scope.canSetSeat = false;
	            	} else {
	               	    $scope.canSetSeat = true;
	                }
	            }
	        }  
	        $scope.isNotCTP=false;
            //if($scope.capitalEntity.seatID != undefined){
        		$scope.selectSeatEntitys =[];
                findSeatEntity(function(result){
	               	$scope.selectSeatEntitys = angular.copy(result);
	               	$scope.capitalEntity.seatID = entity.seatID;
	                $scope.changeSeat($scope.capitalEntity.seatID);
	                $scope.capitalEntity.seatUserID = entity.seatUserID;
	               	$scope.$apply();
               },{brokerageFirmID : $scope.capitalEntity.brokerageFirmID});
            //}  
           /* $scope.selectSeatEntitys =[];
            findSeatEntity(function(result){
            	$scope.selectSeatEntitys = result;
                $scope.$apply();
            },{brokerageFirmID : $scope.capitalEntity.brokerageFirmID});*/
          
            findFundProduct(function (result) {
            	$scope.fundProductTems=result;
            	$scope.$apply();
            },{instClientID:entity.instClientID,linkAccountType:$scope.linkAccountTypes[0].key});
            getAccountGroupsByInstClientId(function (result){
            	$scope.accountGroupEntityTems = result;
            	$scope.$apply();
            },entity.instClientID);
            
        	$scope.capitalEntity.rePassword=$scope.capitalEntity.password;
            //formValidateReset();
            $scope.isUpdate = true;
            $scope.showPass = false;
            $timeout(function() {
            	$scope.capitalEntity.seatUserID = entity.seatUserID;
               	$scope.$apply();
            	$("#capitalAccountModal").modal("show");
            }, 2000);
          
    	}
    };

    // 新增账户信息
    $scope.save = function (entity) {
       	var accountID= entity.accountID;
		//密码验证
		var pwd1 = entity.password;
		var pwd2 = entity.rePassword;
		var validcode = document.getElementById("capitalAccountValidcode").value;
		if(pwd1 != pwd2 ){
			if(pwd1 != undefined && pwd1.trim().length==0  && pwd2 == undefined ){
				
			} else if(pwd2 != undefined && pwd2.trim().length==0  && pwd1 == undefined ){
				
			}else {
				layer.msg("两次密码输入不一致，请重新输入", {
					icon : 2,
					time : 2000
				});
				return false;
			}

		}
		var seatUserID =  entity.seatUserID;
		if($scope.isNotCTP){
			if(seatUserID =undefined  || seatUserID == null){
				layer.msg("多席位的通道类型时候必须绑定席位用户。", {
					icon : 2,
					time : 2000
				});
				return false;
			}
			
		}else{
			 entity.seatUserID = entity.accountID;
			if( pwd1 == undefined || pwd2 == undefined ){
				layer.msg("非多席位的通道类型时候密码为必输项。", {
					icon : 2,
					time : 2000
				});
				return false;
			}
		}
		
		
		
		var mark = entity.market;
		if(mark ==1 || mark ==3 || mark==5 ){
			var branchID = entity.branchID;
			if(branchID == undefined || branchID.length<1){
				layer.msg("当允许交易的市场为证券、信用、证券期权时，营业部必填", {
					icon : 2,
					time : 2000
				});
				return false;
			}
		}

        var index = entity.recordIndex;
        var tableIndex = entity.index;
       // entity.innerAccountID = entity.brokerageFirmID + "" + entity.accountID;
		        var brokerageFirmName;
		    	var count = $scope.brokerages.length;
		        for (var i = 0; i < count; i++) {
		            if ($scope.brokerages[i].brokerageFirmID == entity.brokerageFirmID) {
		            	brokerageFirmName = $scope.brokerages[i].brokerageFirmName;
		            }
		        }
		    
		        // 增加
		        if (index == undefined) {
		       /* 	if(pwd1 != undefined && pwd1 != undefined){
		    			if(pwd1.trim() == accountID.trim()){
		    				layer.msg("密码不能跟资金账号相同，请重新输入", {
		    					icon : 2,
		    					time : 2000
		    				});
		    				validCodeLoad();
		        		    document.getElementById("capitalAccountValidcode").value=""; 
		    				return false;
		    			}
		    		}*/
		        	checkCapAccByPrKey(function (result) {
		        		if(result){
		    				layer.msg("该账号所在经纪公司下的交易市场信息已存在，请重新输入", {
		    					icon : 2,
		    					time : 2000
		    				});
		    				validCodeLoad();
		        		    document.getElementById("capitalAccountValidcode").value=""; 
		    				return false;
		    			}else {
				        	var lv =2;
				        	if(entity.password != undefined && entity.password.trim().length>0){
				        		 lv = matchLatt(entity.password.trim());
				        	}
				        	if(lv == 1) {
				    	       layer.confirm('密码强度较弱，是否保存该密码？', {icon: 3}, function (count) {
				    	    	   	layer.close(count);
						            // 判断经济公司下是否存在资金账号
						        	findCapAccByInnerAccountID(function (result) {
						        		if(result == 1){
						        			validCodeLoad();
						        		    document.getElementById("capitalAccountValidcode").value=""; 
						        		}else if (result.length > 0) {
						                	 layer.msg(entity.innerAccountID+"投资者代码已存在,请重新输入！", {icon: 2, time: 3000});
						                     return false;
						                } else {
						                	entity.isActive = '1';
						                	entity.tradeRight =$scope.rightSelects[0].key;
						                	entity.selfTradeAvoidType = $scope.isNotDatas[1].key;
						                    saveCapitalAccount(function (result) {
						                    	$scope.capitalService.findPageInfoByQuery(function(r){
						                    		if(r.length > 0){
						                    			$scope.capitalAccountEntitys.unshift(r[0]);
								                        $scope.$apply();
								                        layer.msg("新增成功",{icon: 1});
								                        $scope.find();
								                        // 关闭窗口
								                        $("#capitalAccountModal").modal("hide");
						                    		}else{
						                    			layer.msg("该机构下资金账号已达上限，新增失败",{icon: 2});
						                    			return false;
						                    		}
						                    	},{
						                    		instClientID:entity.instClientID,
						                    		innerAccountID:entity.innerAccountID
						                    	});
						                    }, entity);
						                }
						            }, entity.innerAccountID,validcode);
				    	        });
				        	}else {
					            // 判断经济公司下是否存在资金账号
					        	findCapAccByInnerAccountID(function (result) {
					        		if(result == 1){
					        			validCodeLoad();
					        		    document.getElementById("capitalAccountValidcode").value=""; 
					        		}else if (result.length > 0) {
					                	 layer.msg(entity.innerAccountID+"投资者代码已存在,请重新输入！", {icon: 2, time: 3000});
					                     return false;
					                } else {
					                	entity.isActive = '1';
					                	entity.tradeRight =$scope.rightSelects[0].key;
					                	entity.selfTradeAvoidType = $scope.isNotDatas[1].key;
					                    saveCapitalAccount(function (result) {
					                    	$scope.capitalService.findPageInfoByQuery(function(r){
					                    		if(r.length > 0){
					                    			$scope.capitalAccountEntitys.unshift(r[0]);
							                        $scope.$apply();
							                        $scope.find();
							                        layer.msg("新增成功",{icon: 1});
							                        // 关闭窗口
							                        $("#capitalAccountModal").modal("hide");
					                    		}else{
					                    			layer.msg("该机构下资金账号已达上限，新增失败",{icon: 2});
					                    			return false;
					                    		}
					                    	},{
					                    		instClientID:entity.instClientID,
					                    		innerAccountID:entity.innerAccountID
					                    	});
					                    }, entity);
					                }
					            }, entity.innerAccountID,validcode);
				        	}
		    			}
			        }, entity);

		            // 修改
		        } else {
	        		if($scope.brokId == entity.brokerageFirmID){
	        			updateCapitalAccount(function (result) {
	        				$scope.capitalService.findPageInfoByQuery(function(r){
	        					
	                    		if(r.length > 0){
	                    			r[0].index = tableIndex;
	                    			$scope.capitalAccountEntitys.splice(tableIndex-1, 1, r[0]);
	                    			$scope.capitalAccountTable.cells().every( function () {
	            	                    if((tableIndex-1) == this[0][0].row){
	            	                        if(this[0][0].column == 4){
	            	                            this.data(entity.accountName);
	            	                            $scope.$apply();
	            	                        }
	            	                        if(this[0][0].column == 5){
	            	                            this.data(entity.brokerName);
	            	                            $scope.$apply();
	            	                        }
	            	                        if(this[0][0].column == 7){
	            	                            this.data(entity.instName);
	            	                            $scope.$apply();
	            	                        }
	            	                        if(this[0][0].column == 8){
	            	                            this.data(r[0].fundName);
	            	                            $scope.$apply();
	            	                        }
	            	                        if(this[0][0].column == 9){
	            	                            this.data($scope.transPositionType(entity.positionType));
	            	                            $scope.$apply();
	            	                        }
                                            if(this[0][0].column == 10){
                                                this.data($scope.transAccountGroup(entity.accountGroupID,entity.isActive));
                                                $scope.$apply();
                                            }
	            	                        if(this[0][0].column == 11){
	            	                            this.data($scope.transCurrencys(entity.currency));
	            	                            $scope.$apply();
	            	                        }
	            	                        if(this[0][0].column == 12){
	            	                            this.data($scope.transMarketTypes(entity.market));
	            	                            $scope.$apply();
	            	                        }
	            	                        if(this[0][0].column == 13){
	            	                            this.data($scope.transIsActive(entity.isActive));
	            	                            $scope.$apply();
	            	                        }
	            	                        if(this[0][0].column == 14){
	            	                            this.data(entity.seatUserID);
	            	                            $scope.$apply();
	            	                        }
	            	                        if(this[0][0].column == 16){
	            	                            this.data($scope.transBranch(entity.branchID));
	            	                            $scope.$apply();
	            	                        }
	            	                    }

	                    			} );
					        	    //$scope.find();
					        		// 关闭窗口
					                $("#capitalAccountModal").modal("hide");
					                if(result.info == ""){
                                        layer.msg("修改成功" + result.info,{icon: 1});
                                    }else {
                                        layer.confirm("修改成功，" + result.info, {icon:1,btn:['关闭']});
                                    }
	                    		}else{
	                    			layer.msg("修改失败",{icon: 2});
	                    			return false;
	                    		}
	                    	},{
	                    		instClientID:entity.instClientID,
	                    		innerAccountID:entity.innerAccountID
	                    	});
			        	}, entity);
	        		}else {
	        			findCapAccByInnerAccountID(function (result) {
	        				 if (result.length > 0) {
		            			layer.msg(entity.brokerageFirmID+"_"+brokerageFirmName+"_"+entity.accountID+"资金帐号已存在，不允许重复", {icon: 2, time: 3000});
		            			return false;
		            		}else{
					        	updateCapitalAccount(function (result) {
					        		$scope.capitalService.findPageInfoByQuery(function(r){
					        			r[0].index = tableIndex;
			                    		if(r.length > 0){
			                    			$scope.capitalAccountEntitys.splice(index, 1, r[0]);
			                    			$scope.capitalAccountTable.cells().every( function () {
			            	                    if((tableIndex-1) == this[0][0].row){
			            	                        if(this[0][0].column == 4){
			            	                            this.data(entity.accountName);
			            	                            $scope.$apply();
			            	                        }
			            	                        if(this[0][0].column == 5){
			            	                            this.data(entity.brokerName);
			            	                            $scope.$apply();
			            	                        }
			            	                        if(this[0][0].column == 7){
			            	                            this.data(entity.instName);
			            	                            $scope.$apply();
			            	                        }
			            	                        if(this[0][0].column == 8){
			            	                            this.data(r[0].fundName);
			            	                            $scope.$apply();
			            	                        }
			            	                        if(this[0][0].column == 9){
			            	                            this.data($scope.transPositionType(entity.positionType));
			            	                            $scope.$apply();
			            	                        }
                                                    if(this[0][0].column == 10){
                                                        this.data($scope.transAccountGroup(entity.accountGroupID,entity.isActive));
                                                        $scope.$apply();
                                                    }
			            	                        if(this[0][0].column == 11){
			            	                            this.data($scope.transCurrencys(entity.currency));
			            	                            $scope.$apply();
			            	                        }
			            	                        if(this[0][0].column == 12){
			            	                            this.data($scope.transMarketTypes(entity.market));
			            	                            $scope.$apply();
			            	                        }
			            	                        if(this[0][0].column == 13){
			            	                            this.data($scope.transIsActive(entity.isActive));
			            	                            $scope.$apply();
			            	                        }
			            	                        if(this[0][0].column == 14){
			            	                            this.data(entity.seatUserID);
			            	                            $scope.$apply();
			            	                        }
			            	                        if(this[0][0].column == 17){
			            	                            this.data($scope.transBranch(entity.branchID));
			            	                            $scope.$apply();
			            	                        }
			            	                    }

			                    			});
							        	    //$scope.find();
							        		// 关闭窗口
							                $("#capitalAccountModal").modal("hide");
                                            if(result.info == ""){
                                                layer.msg("修改成功" + result.info,{icon: 1});
                                            }else {
                                                layer.confirm("修改成功，" + result.info, {icon:1,btn:['关闭']});
                                            }
			                    		}else{
			                    			layer.msg("修改失败",{icon: 2});
			                    			return false;
			                    		}
			                    	},{
			                    		instClientID:entity.instClientID,
			                    		innerAccountID:entity.innerAccountID
			                    	});
					        	}, entity);
		            		}
			           }, entity.innerAccountID);
	        		}
		         
		        }
    };
    
    $scope.saveRigth = function (entity) {
    	var productOptions = $("#productOption").multiselect("getChecked").map(function(){
 	   	   return this.value;    
 	   	}).get();

        if (productOptions != null && productOptions.length>0){
        	var productOption= productOptions[0];
        	for (var i = 1; i < productOptions.length; i++) {
        		productOption = productOption+","+productOptions[i]

 			}
    		entity.productOption=productOption;
        }
         
        var exchRights = $("#exchRight").multiselect("getChecked").map(function(){
   	   		return this.value;    
   	   	}).get();

        if (exchRights != null && exchRights.length>0){
        	var exchRight= exchRights[0];
          	for (var i = 1; i < exchRights.length; i++) {
          		exchRight = exchRight+","+exchRights[i]

   			}
      		entity.exchRight=exchRight;
        }

        var notAllowProducts = $("#notAllowProduct").multiselect("getChecked").map(function(){
            return this.value;
        }).get();

        if (notAllowProducts != null && notAllowProducts.length>0){
            var notAllowProduct= notAllowProducts[0];
            for (var i = 1; i < notAllowProducts.length; i++) {
                notAllowProduct = notAllowProduct+","+notAllowProducts[i]

            }
            entity.notAllowProduct=notAllowProduct;
        }

        updateCapitalAccount(function (result) {
			$scope.capitalService.findPageInfoByQuery(function(r){
	    		if(r.length > 0){
	        	    $scope.find();
	        		// 关闭窗口
	                $("#capitalRigthModal").modal("hide");
	                layer.msg("修改成功",{icon: 1});
	    		}else{
	    			layer.msg("修改失败",{icon: 2});
	    			return false;
	    		}
	    	},{
	    		instClientID:entity.instClientID,
	    		innerAccountID:entity.innerAccountID
	    	});
		}, entity);
    };



    // 停用
    $scope.remove = function (capital, index) {
        // 使用内置Index
        // 查询资金账户下是否有资产单元
        capital.traderID = "";
        var tableIndex = capital.index;
        // 校验资金账号是否有对应工作流配置
        $scope.fundWorkFlowService.validateLinkAccount(function(result){
			if(result != null && result.length > 0){
				layer.msg("该资金账号有对应工作流配置，无法停用",{icon : 2});
				return false;
			}else{
				//layer.confirm('资金账号停用后不可交易，请确认是否执行？', {icon: 3}, function (count) {
			        //1.	校验资金账号资金情况
			       // findInvestorAccountByBroAndAccountID (function (result) {
				     //   if(result.length > 0){
				        //	  layer.msg("资金账号权益不为0，不允许停用", {icon: 2, time: 3000});
				            //  return false;
				       // }else {
				            //2.	校验资金账号持仓情况
				        	 //findByBroAndAccountID(function (result) {
			        	        //  if(result.length > 0){
			        	        	 // layer.msg("资金账号还有持仓，不允许停用", {icon: 2, time: 3000});
			        	             // return false;
			        	         // }else {
			                        	/*if( $scope.amType =="2"){*/
			                        		 //3.	校验与之对应的资产单元状态不为销户
			              	              checkSubAccount(function (result) {
			              	                  if (result) {
			              	                      layer.msg("对应资产单元未销户，不允许停用", {icon: 2, time: 3000});
			              	                      return false;
			              	                  } else {
			              	                	  // 检查是否有与资产单元关联accountRelation
			              	                	checkAccountRelation(function(result){
			              	                		if(result.length > 0){
			              	                			layer.msg("对应资产单元未销户，不允许停用", {icon: 2, time: 3000});
					              	                    return false;
			              	                		}else{
			              	                			layer.confirm('资金账号停用后不可交易，请确认是否执行？', {icon: 3}, function (count) {
				              	                		  //1）	删除资金账户与用户的对应关系
					              	                	  deleUserAccByInnAccId(function (resultInt) {
					              	                		 capital.isActive='0';
					              	                          updateCapitalAccount(function (result) {
					              	                        	$scope.capitalService.findPageInfoByQuery(function(r){
					        			                    		if(r.length > 0){
					        			                    			/*r[0].index = tableIndex;
					        			                    			$scope.capitalAccountEntitys.splice(tableIndex-1, 1, r[0]);
					        			                    			$scope.capitalAccountTable.cells().every( function () {
					        			            	                    if((tableIndex-1) == this[0][0].row){
					        			            	                        if(this[0][0].column == 12){
					        			            	                            this.data($scope.transIsActive(capital.isActive));
					        			            	                            $scope.$apply();
					        			            	                        }
					        			            	                        
					        			            	                    }

					        			                    			} );*/
					        			                    			$scope.capitalAccountEntitys.splice(index, 1, r[0]);
					        			                    			$scope.$apply();
					        							        	    $scope.find();
					        							        		// 关闭窗口
					        							                $("#capitalAccountModal").modal("hide");
					        					                        layer.msg("停用成功",{icon: 1});
					        			                    		}else{
					        			                    			layer.msg("停用失败",{icon: 2});
					        			                    			return false;
					        			                    		}
					        			                    	},{
					        			                    		instClientID:capital.instClientID,
					        			                    		innerAccountID:capital.innerAccountID
					        			                    	});
					              	                          }, capital);
				              	                          }, capital);
			              	                			});
			              	                		}
			              	                	},{
			              	                		instClientID : capital.instClientID,
			              	                		innerAccountID: capital.innerAccountID
			              	                	});
			              	                 }
			              	              }, {
			              	              	innerAccountID: capital.innerAccountID,isActive: "1",instClientID : capital.instClientID
			              	              });
			                        	/*}else{
			                        		//1）	删除资金账户与用户的对应关系
		            	                	  deleUserAccByInnAccId(function (resultInt) {
		            	                		 capital.isActive='0';
		            	                          updateCapitalAccount(function (result) {
		            	                              $scope.capitalAccountEntitys.splice(index, 1, result);
		            	                              layer.close(count);
		            	                              $scope.$apply();
		            	                          }, capital);
		        	                          }, capital);
			                        		
			                        	}*/
			        	         // }
				        	// },{
				            //   	accountID: capital.innerAccountID
				            // });
				       // }	
			        //},{
			         // 	accountID: capital.innerAccountID
			        //});
		       // });
			}
		},{
			instClientID: capital.instClientID,
			innerAccountID: capital.innerAccountID
		});
        
    };


    // 启用
    $scope.rebuild = function (capital, index) {
        // 使用内置Index
        // 查询资金账户下是否有资产单元
    	var tableIndex = capital.index;
        capital.traderID = "";
        layer.confirm('确定重新启用此账户？', {icon: 3}, function (count) {
            capital.isActive = '1';
            layer.close(count);
            updateCapitalAccount(function (result) {
            	$scope.capitalService.findPageInfoByQuery(function(r){
            		if(r.length > 0){
            			/*r[0].index = tableIndex;
            			$scope.capitalAccountEntitys.splice(tableIndex-1, 1, r[0]);
            			$scope.capitalAccountTable.cells().every( function () {
    	                    if((tableIndex-1) == this[0][0].row){
    	                        if(this[0][0].column == 12){
    	                            this.data($scope.transIsActive(capital.isActive));
    	                            $scope.$apply();
    	                        }
    	                        
    	                    }

            			} );*/
            			$scope.capitalAccountEntitys.splice(index, 1, r[0]);
            			$scope.$apply();
		        	    $scope.find();
		        		// 关闭窗口
		                $("#capitalAccountModal").modal("hide");
                        layer.msg("启用成功",{icon: 1});
            		}else{
            			layer.msg("启用失败",{icon: 2});
            			return false;
            		}
            	},{
            		instClientID:capital.instClientID,
            		innerAccountID:capital.innerAccountID
            	});
            }, capital);
        });
    };
    
    $("body").undelegate("#capitalAccount_dynamic_table_wrapper td .update-row-new","click");
    //表格修改事件
    $("body").delegate("#capitalAccount_dynamic_table_wrapper td .update-row-new","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.capitalAccountTable.row(mytr).data();
        var id = tempArr[2];
        for(var i = 0;i<$scope.capitalAccountEntitys.length;i++){
        	if(id==$scope.capitalAccountEntitys[i].id){
        		$scope.modalEntity = $scope.capitalAccountEntitys[i];
        	}
        }
        $scope.initUpdateParam(id,$scope.modalEntity);
    });
    $("body").undelegate("#capitalAccount_dynamic_table_wrapper td .fobid-operation","click");
    //表格停用事件
    $("body").delegate("#capitalAccount_dynamic_table_wrapper td .fobid-operation","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.capitalAccountTable.row(mytr).data();
        var id = tempArr[2];
        for(var i = 0;i<$scope.capitalAccountEntitys.length;i++){
        	if(id==$scope.capitalAccountEntitys[i].id){
        		$scope.modalEntity = $scope.capitalAccountEntitys[i];
        	}
        }
        $scope.remove($scope.modalEntity,id);
    });
    $("body").undelegate("#capitalAccount_dynamic_table_wrapper td .starts-row","click");
     //表格启用事件
    $("body").delegate("#capitalAccount_dynamic_table_wrapper td .starts-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.capitalAccountTable.row(mytr).data();
        var id = tempArr[2];
        for(var i = 0;i<$scope.capitalAccountEntitys.length;i++){
        	if(id==$scope.capitalAccountEntitys[i].id){
        		$scope.modalEntity = $scope.capitalAccountEntitys[i];
        	}
        }
        $scope.rebuild($scope.modalEntity,id);
    });
    $("body").undelegate("#capitalAccount_dynamic_table_wrapper td .capitalAccount-update-row2","click");
    //表格重置密码事件
    $("body").delegate("#capitalAccount_dynamic_table_wrapper td .capitalAccount-update-row2","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.capitalAccountTable.row(mytr).data();
        var id = tempArr[2];
        for(var i = 0;i<$scope.capitalAccountEntitys.length;i++){
        	if(id==$scope.capitalAccountEntitys[i].id){
        		$scope.modalEntity = $scope.capitalAccountEntitys[i];
        	}
        }
        $scope.pwdReset($scope.modalEntity);
    });
    
    
    // 修改权限
    $scope.capitalRigthEntity={};
    $scope.productOptions = clearConstant.productOptions;
    $scope.initUpdateRigthParam = function (index, entity) {
    	if(entity.isActive == 0){
    		$scope.capitalAccountUpdateTarget = "";
    		layer.msg("此资金账号已停用,不允许修改权限",{icon: 2, time: 2000});
    	}else{
    		
    		$scope.tempEntity = angular.copy(entity);
            $scope.tempEntity.recordIndex = index;
            $scope.brokId="";
            $scope.brokId = $scope.tempEntity.brokerageFirmID;
            $scope.capitalRigthEntity = angular.copy($scope.tempEntity);
        	$scope.capitalRigthEntity.rePassword=$scope.capitalRigthEntity.password;
        	$scope.isOption = false;
        	if($scope.capitalRigthEntity.market == "0"){
        		$scope.isOption = true;
        	}
        	var tmp ="";
        	$("#productOption").html("");
			for(var i = 0;i < $scope.productOptions.length;i++){
				$("#productOption").append("<option value='"+$scope.productOptions[i].key+"'>"+$scope.productOptions[i].key+
						'_'+$scope.productOptions[i].text+"</option>");
			}
		    //

			
			if($scope.capitalRigthEntity.productOption != null && $scope.capitalRigthEntity.productOption.length>0 && $scope.isOption == true){
				var options =$scope.capitalRigthEntity.productOption;
				if(options.indexOf(",")>=0){
					tmp = options.split(",");
				}else {
					tmp = options;
				}
			}
			
    		$("#productOption").val(tmp);
    		$("#productOption").multiselect("refresh");
            
            $scope.capitalService.findExch(function(result){
            	var exchID ="";
            	$("#exchRight").html("");
    			for(var i = 0;i < result.length;i++){
    				$("#exchRight").append("<option value='"+result[i].exchID+"'>"+result[i].exchID+
    						'_'+result[i].exchName+"</option>");
    			}
    		    //

    			if($scope.capitalRigthEntity.exchRight != null){
    				var options =$scope.capitalRigthEntity.exchRight;
    				if(options.indexOf(",")>=0){
    					exchID = options.split(",");
    				}else {
    					exchID = options;
    				}
    			}
    			
        		$("#exchRight").val(exchID);
        		$("#exchRight").multiselect("refresh");

            },$scope.capitalRigthEntity);

            var tmp = []
            tmp.push({type:"capitalAccountNotAllowProduct"});
            $scope.dictionaryService.findByQuery(function (result) {

                $("#notAllowProduct").html("");
                for(var i = 0;i < result.length;i++){
                    $("#notAllowProduct").append("<option value='"+result[i].key+"'>"+result[i].key+
                        '_'+result[i].text+"</option>");
                }

                if($scope.capitalRigthEntity.notAllowProduct != null && $scope.isOption == true){
                    var notAllowProduct =$scope.capitalRigthEntity.notAllowProduct;
                    if(notAllowProduct.indexOf(",")>=0){
                        tmp = notAllowProduct.split(",");
                    }else {
                        tmp = notAllowProduct;
                    }
                }

                $("#notAllowProduct").val(tmp);
                $("#notAllowProduct").multiselect("refresh");

                $timeout(function() {
                    $("#capitalRigthModal").modal("show");
                }, 1000);
            },tmp)
    	}
    };
    
    $("#productOption").multiselect({ 
    	checkAllText: '全选',
    	uncheckAllText:'全不选',
    	noneSelectedText:'',
    	selectedList : true,
    	classes : ''
    });
    
    $("#exchRight").multiselect({ 
    	checkAllText: '全选',
    	uncheckAllText:'全不选',
    	noneSelectedText:'',
    	selectedList : true,
    	classes : ''
    });

    $("#notAllowProduct").multiselect({
        checkAllText: '全选',
        uncheckAllText:'全不选',
        noneSelectedText:'',
        selectedList : true,
        classes : ''
    });

    $("body").undelegate("#capitalAccount_dynamic_table_wrapper td .right-row","click");
     //表格权限事件
    $("body").delegate("#capitalAccount_dynamic_table_wrapper td .right-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.capitalAccountTable.row(mytr).data();
        var id = tempArr[2];
        for(var i = 0;i<$scope.capitalAccountEntitys.length;i++){
        	if(id==$scope.capitalAccountEntitys[i].id){
        		$scope.modalEntity = $scope.capitalAccountEntitys[i];
        	}
        }
        $scope.initUpdateRigthParam(id,$scope.modalEntity);
    });

    // 根据页面条件查询
    $scope.find = function () {  	
    	$scope.isQuery = true;
		$scope.capitalAccountDataset = [];
		$scope.capitalService.findPageInfoByQuery(function(result){			
			$scope.capitalAccountEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var isCTP=true;
				var count = $scope.allSeatEntitys.length;
	            for (var j = 0; j < count; j++) {
	                if ($scope.allSeatEntitys[j].seatID == con[i].seatID) {
	                	 if($scope.allSeatEntitys[j].seatSystem == 0 ||
	                		$scope.allSeatEntitys[j].seatSystem == 2 ||
	                		$scope.allSeatEntitys[j].seatSystem == 6 ||
	                		$scope.allSeatEntitys[j].seatSystem == 8 ||
	                		$scope.allSeatEntitys[j].seatSystem == 15 ||
	                		$scope.allSeatEntitys[j].seatSystem == 17 ||
	                		$scope.allSeatEntitys[j].seatSystem == 18 ||
	                		$scope.allSeatEntitys[j].seatSystem == 19 ||
	                		$scope.allSeatEntitys[j].seatSystem == 20){
	                    	isCTP=false;
	                     }else {
	                    	 isCTP=true;
	                     }
	                }
	            }

				var operator =$scope.transOper($scope.capitalAccount_rigth);
				var operator1 = $scope.transOper1(!$scope.isInstClient || ($scope.isInstClient && $scope.isAllowInstClient),$scope.capitalAccount_update);
				var operator2 = $scope.transOper2(con[i].isActive,!$scope.isInstClient || ($scope.isInstClient && $scope.isAllowInstClient),$scope.capitalAccount_start);
				var operator3 = $scope.transOper3($scope.capitalAccount_password,isCTP);
				var operator4 = $scope.getConnectPermision($scope.capitalAccount_connect,con[i].isActive,con[i].seatIsConnect);
		    	var tempArr = ["<a class='click-choice-one multiple-choice'>",(i+1),con[i].id,con[i].accountID,con[i].accountName,con[i].brokerName,con[i].innerAccountID,con[i].instName,con[i].fundName
		    			    	,$scope.transPositionType(con[i].positionType),$scope.transAccountGroup(con[i].accountGroupID,con[i].isActive),$scope.transCurrencys(con[i].currency),$scope.transMarketTypes(con[i].market)
		    			    	,$scope.transIsActive(con[i].isActive),con[i].seatUserID,$scope.transSeatIsConnect(con[i].seatIsConnect),"",$scope.transBranch(con[i].branchID),operator+operator1+operator4+operator2+operator3,con[i].productOption,con[i].exchRight]
		    	con[i].index = tempArr[1];
		    	$scope.capitalAccountDataset.push(tempArr);   		   
	        }
			$scope.capitalAccountEntitys = con;
			//重新绘表
	        $scope.capitalAccountTable.clear().draw();
	        $scope.capitalAccountTable.rows.add($scope.capitalAccountDataset).draw();
	        $scope.checkCapitalAccountEntitys = [];
    		$(".dataTables_scrollHeadInner th a").removeClass("clicked-choice-all");
    		$(".dataTables_scrollHeadInner th a").addClass("click-choice-all");
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		},$scope.queryEntity);
    };

    $scope.seatIsConnects = clearConstant.seatIsConnect;
    // 席位连接状态
    $scope.transSeatIsConnect = function (key) {
        var count = $scope.seatIsConnects.length;
        for (var i = 0; i < count; i++) {
            if ($scope.seatIsConnects[i].key == key) {
                return $scope.seatIsConnects[i].text;
            }
        }
        return "";
    };

    $("body").undelegate("#capitalAccount_dynamic_table_wrapper td .capitalAccount-connect-row2","click");
    //表格权限事件
    $("body").delegate("#capitalAccount_dynamic_table_wrapper td .capitalAccount-connect-row2","click",function(){
        var mytr = $(this).parents("tr");
        var tempArr = $scope.capitalAccountTable.row(mytr).data();
        var id = tempArr[2];
        for(var i = 0;i<$scope.capitalAccountEntitys.length;i++){
            if(id==$scope.capitalAccountEntitys[i].id){
                $scope.modalEntity = $scope.capitalAccountEntitys[i];
            }
        }
        $scope.changeSeatIsConnect($scope.modalEntity,this.innerHTML);
    });

    $scope.changeSeatIsConnect = function(entity,text){
        if(text == "断开"){
            var flag = "1";
        }else{
            var flag = "0";
        }
        layer.load(2, {
            shade: [0.5,'#fff'] //0.1透明度的白色背景
        });
        $scope.seatUserService.changeSeatIsConnect(function (result) {
            if(result == 0){
                layer.closeAll('loading');
                if(text == "断开"){
                    layer.msg("席位断开成功",{icon:1});
                }else{
                    layer.msg("席位连接成功",{icon:1});
                }
            }else if(result == 2){
                layer.closeAll('loading');
                layer.msg("席位不存在",{icon:2});
            }else{
                layer.closeAll('loading');
                layer.msg("席位用户未上场或者未绑定资金账号",{icon:2});
            }
        },entity,flag);
    }

    //获取连接权限
    $scope.getConnectPermision = function(flag,isActive,seatIsConnect){
        var result = "";
        if(flag){
            if(seatIsConnect == 0 || seatIsConnect == null){
                if(isActive == 1){
                    result = "<a class='capitalAccount-connect-row2'>连接</a>";
                }else {
                    result = "<a class='capitalAccount-connect-row2' style='visibility: hidden;'>连接</a>";
                }
            }else{
                if(isActive == 1){
                    result = "<a class='capitalAccount-connect-row2'>断开</a>";
                }else {
                    result = "<a class='capitalAccount-connect-row2' style='visibility: hidden;'>断开</a>";
                }
            }

        }
        return result;
    }
    
    //$scope.find();
    
    $scope.transOper = function(flag){
    	var result = '';
    	if(flag){
    		result = "<a class='row-operation-distance right-row'>权限</a>";
    	}
    	return result;
    }
    
    
    $scope.transOper1 = function(flag,perFlag){
    	var result = '';
    	if(flag&&perFlag){
    		result = "<a class='row-operation-distance reset-operation update-row-new'>修改</a>";
    	}
    	return result;
    }
    $scope.transOper2 = function(isActive,flag,perFlag){
    	var result = '';
    	if(flag&&perFlag){
    		if(isActive==1){
    			result = "<a class='row-operation-distance fobid-operation'>停用</a>";
    		}else if(isActive==0){
    			result = "<a class='row-operation-distance reset-operation starts-row'>启用</a>";
    		}
    	}
    	return result;
    }
    

    $scope.transIsActive = function(isActive){
    	var result = '';

		if(isActive==1){
			result = "启用";
		}else if(isActive==0){
			result = "停用";
		}
    	return result;
    }
    
    $scope.transOper3 = function(flag,isCTP){
    	var result = '';
    	if(flag){
    		if(isCTP){
    			result = "<a class='reset-row capitalAccount-update-row2' data-target='"+$scope.pwdUpdateTarget+"' data-toggle='modal'>重置密码</a>";
    		}else{
    			result = "<a class='reset-row capitalAccount-update-row2 capShow ' data-target='"+$scope.pwdUpdateTarget+"' data-toggle='modal'>重置密码</a>";
    		}
    		
    	}
    	return result;
    }
    

	 //修改密码
    $scope.updateResetPwd = function (entity) {
    	var validcode = document.getElementById("capitalAccountPwdResetValidcode").value;
    	var accountID= entity.accountID;
        if(entity.password.trim() != entity.reSeatPassword.trim()){
            layer.msg("2次输入的密码不一致。",{icon:2});
            validCodeLoad();
		    document.getElementById("capitalAccountPwdResetValidcode").value="";
            return ;
        }
        if(entity.password.trim().length==0 || entity.reSeatPassword.trim().length==0){
			layer.msg("密码不能为空，请重新输入", {
				icon : 2,
				time : 2000
			});
			validCodeLoad();
		    document.getElementById("capitalAccountPwdResetValidcode").value="";
			return false;
		}
/*        if(entity.password.trim() == accountID.trim()){
			layer.msg("密码不能跟资金账号相同，请重新输入", {
				icon : 2,
				time : 2000
			});
			validCodeLoad();
		    document.getElementById("capitalAccountPwdResetValidcode").value="";
			return false;
		}*/
		var lv = matchLatt(entity.password.trim());
		if(lv == 1) {
		   layer.confirm('密码强度较弱，是否保存该密码？', {icon: 3}, function (count) {
			   	layer.close(count);
				updatePwd(function(result) {
					if(result == 1){
						validCodeLoad();
					    document.getElementById("capitalAccountPwdResetValidcode").value=""; 
					}else{
					    layer.msg("修改成功",{icon:1});
					    $scope.ModalPwdEntity = {}; 
					    $scope.find();
					    $("#capAccPwdReset").modal("hide");
					    
					    $scope.checkCapitalAccountEntitys = [];
					    $scope.checkCapitalAccountEntitys.push(result);
					    var entitys = $scope.checkCapitalAccountEntitys;
				    	$scope.capitalService.checkSeat(function(resu){
				    		saveCheckSeat(resu);
				    		$scope.checkCapitalAccountEntitys = [];
				    		$(".dataTables_scrollHeadInner th a").removeClass("clicked-choice-all");
				    		$(".dataTables_scrollHeadInner th a").addClass("click-choice-all");
				    	},entitys);
					}
				}, entity,validcode);
		    });
		}else {
			updatePwd(function(result) {
				if(result == 1){
					validCodeLoad();
				    document.getElementById("capitalAccountPwdResetValidcode").value=""; 
				}else{
			        layer.msg("修改成功",{icon:1});
			        $scope.ModalPwdEntity = {}; 
			        $scope.find();
			        $("#capAccPwdReset").modal("hide");
			        
			        $scope.checkCapitalAccountEntitys = [];
				    $scope.checkCapitalAccountEntitys.push(result);
				    var entitys = $scope.checkCapitalAccountEntitys;
			    	$scope.capitalService.checkSeat(function(result){
			    		saveCheckSeat(result);
			    		$scope.checkCapitalAccountEntitys = [];
			    		$(".dataTables_scrollHeadInner th a").removeClass("clicked-choice-all");
			    		$(".dataTables_scrollHeadInner th a").addClass("click-choice-all");
			    	},entitys);
				}
		    }, entity,validcode);
		}
    };
    //密码重置
    $scope.pwdReset = function(entity){
    	if(entity.isActive == 0){
    		$scope.pwdUpdateTarget = "";
    		layer.msg("此资金账号已停用,不允许修改密码",{icon: 2, time: 2000});
    		return false;
    	}else{
		    $scope.ModalTemPwdEntity= angular.copy(entity); 
	        $scope.ModalPwdEntity = $scope.ModalTemPwdEntity;
	        $scope.ModalPwdEntity.password = "";
	        $scope.ModalPwdEntity.reSeatPassword = "";
	        
	        $scope.oStrengthcatwo.className = 'strengthLv0';
	        $scope.oStrengthTxtcatwo.innerHTML ='';
	    	$scope.oStrengthcatwoag.className = 'strengthLv0';
	        $scope.oStrengthTxtcatwoag.innerHTML ='';
			$scope.capitalAccountUpdateTarget = "#capAccPwdReset";
			formValidatePasswordReset();
			validCodeLoad();
		    document.getElementById("capitalAccountPwdResetValidcode").value=""; 
	        $("#capAccPwdReset").modal("show");
	        $scope.$apply();
    	}

    };
    
    function formValidatePasswordReset(){
    	$scope.capitalAccountFormPwdReset.validcode.$setPristine();
    	$scope.capitalAccountFormPwdReset.isTrade.$setPristine();
    	$scope.capitalAccountFormPwdReset.password.$setPristine();
        $scope.capitalAccountFormPwdReset.reSeatPassword.$setPristine();
    }
    
    $scope.fundProductTems=[];
    $scope.isInstClientSelect = function (instClientId) {
    	$scope.fundProductTems=[];
    	findFundProduct(function (result) {
        	$scope.fundProductTems=result;
        	$scope.$apply();
            // 根据机构代码查询所属账号组
        	getAccountGroupsByInstClientId(function (result){
            	$scope.accountGroupEntityTems = result;
            	$scope.$apply();
            },instClientId);
        },{instClientID:instClientId,linkAccountType:$scope.linkAccountTypes[0].key});
    };
    
    $scope.showLow =function(password){
    	 var aLvTxt = ['','弱','中','强'];
    	 var lv = matchLatt(password);
         $scope.oStrengthca.className = 'strengthLv' + lv;
         $scope.oStrengthTxtca.innerHTML = aLvTxt[lv];
    };
    $scope.showLowag =function(rePassword){
    	 var lv = matchLatt(rePassword);
    	 var aLvTxt = ['','弱','中','强'];
         $scope.oStrengthcaag.className = 'strengthLv' + lv;
         $scope.oStrengthTxtcaag.innerHTML = aLvTxt[lv];
    };
    $scope.showLowtwo =function(password){
    	 var aLvTxt = ['','弱','中','强'];
    	 var lv = matchLatt(password);
         $scope.oStrengthcatwo.className = 'strengthLv' + lv;
         $scope.oStrengthTxtcatwo.innerHTML = aLvTxt[lv];
    };
    $scope.showLowtwoag =function(passwordag){
    	 var aLvTxt = ['','弱','中','强'];
    	 var lv = matchLatt(passwordag);
         $scope.oStrengthcatwoag.className = 'strengthLv' + lv;
         $scope.oStrengthTxtcatwoag.innerHTML = aLvTxt[lv];
    };
    //席位用户密码
    $scope.showLowthr =function(password){
   	 var aLvTxt = ['','弱','中','强'];
   	 var lv = matchLatt(password);
        $scope.oStrengthcathr.className = 'strengthLv' + lv;
        $scope.oStrengthTxtcathr.innerHTML = aLvTxt[lv];
   };
   $scope.showLowthrag =function(passwordag){
   	 var aLvTxt = ['','弱','中','强'];
   	 var lv = matchLatt(passwordag);
        $scope.oStrengthcathrag.className = 'strengthLv' + lv;
        $scope.oStrengthTxtcathrag.innerHTML = aLvTxt[lv];
   };
    
    function matchLatt(val){
    	if(val != undefined && val.trim() != '' && val.length > 0){
         var lv = 0;
         if(val.match(/[a-z]/g)){lv++;}
         if(val.match(/[0-9]/g)){lv++;}
         if(val.match(/(.[^a-z0-9])/g)){lv++;}
         if(val.length < 6){lv=1;}
         if(lv > 3){lv=3;}
         return lv;
	    } else {
	       return 0;	
	    }
    }
    
    $('#capitalAccountValidImg').on('click', function(e) {
        validCodeLoad();
    });
    $('#capitalAccountPwdResetValidImg').on('click', function(e) {
        validCodeLoad();
    });
    
    $('#capSeatUserValidImg').on('click', function(e) {
        validCodeLoad();
    });
    //加载验证码
    function validCodeLoad() {
      	var o = framework.internal.getFullUrl('/captcha?d='+new Date().getTime());
      	if(document.getElementById("capitalAccountValidImg") != null){
      		document.getElementById("capitalAccountValidImg").src = o;
      	}
      	if(document.getElementById("capitalAccountPwdResetValidImg") != null){
      		document.getElementById("capitalAccountPwdResetValidImg").src = o;
      	}
    	if(document.getElementById("capSeatUserValidImg") != null){
      		document.getElementById("capSeatUserValidImg").src = o;
      	}
    }
    //席位用户   ---------------------------
    // 初始化页面参数
    $scope.initSeatUserParameter = function () {
        // 设置默认选中
    	
        $scope.modalAddSeatUserModalEntity={};
   
        $scope.oStrengthcathr.className = 'strengthLv0';
        $scope.oStrengthTxtcathr.innerHTML ='';
    	$scope.oStrengthcathrag.className = 'strengthLv0';
        $scope.oStrengthTxtcathrag.innerHTML ='';
		$scope.capitalAccountUpdateTarget = "#capAccPwdReset";
        validCodeLoad();
        formValidateSeatUserReset();
	    document.getElementById("capSeatUserValidcode").value=""; 
	    $("#modalAddSeatUserModal").modal("show");
    };
    
    function formValidateSeatUserReset(){
    	$scope.modalAddSeatUserModal.validcode.$setPristine();
    	$scope.modalAddSeatUserModal.seatUserID.$setPristine();
    	$scope.modalAddSeatUserModal.password.$setPristine();
        $scope.modalAddSeatUserModal.reSeatPassword.$setPristine();
    }
    
    $scope.initAddSeatUserParameter = function () {
        // 设置默认选中
    	 findSeatUsers();
    	 $("#modalInsertSeatUserModal").modal("show");
		 $timeout(function() {
			if($scope.seatUserLists.length>0){
	    		 $scope.capitalEntity.seatUserID = $scope.seatUserLists[0].seatUserID;
	    		 $scope.$apply();
	    	 }
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		}, 200);
    };
    
    $scope.saveSeatModal = function () {
        // 设置默认选中
    	$("#modalInsertSeatUserModal").modal("hide");
    };
    
    

    //新增席位用户
    $scope.insertSeatUser = function (entity) {
    	entity.instClientID =$scope.capitalEntity.instClientID;
    	var validcode = document.getElementById("capSeatUserValidcode").value;
    	var accountID= entity.accountID;
        if(entity.password.trim() != entity.reSeatPassword.trim()){
            layer.msg("2次输入的密码不一致。",{icon:2});
            validCodeLoad();
		    document.getElementById("capSeatUserValidcode").value="";
            return ;
        }
        if(entity.password.trim().length==0 || entity.reSeatPassword.trim().length==0){
			layer.msg("密码不能为空，请重新输入", {
				icon : 2,
				time : 2000
			});
			validCodeLoad();
		    document.getElementById("capSeatUserValidcode").value="";
			return false;
		}
		var lv = matchLatt(entity.password.trim());
		if(lv == 1) {
		   layer.confirm('密码强度较弱，是否保存该密码？', {icon: 3}, function (count) {
			   	layer.close(count);
			   	findSeatUser(function(result) {
					if(result != null && result.length>0){
					    layer.msg("已存在该席位用户信息，请更改席位用户代码",{icon:2});
			            validCodeLoad();
					    document.getElementById("capSeatUserValidcode").value="";
			            return ;
					}else{
						insertSeatUser(function(result) {
							if(result == 1){
								validCodeLoad();
							    document.getElementById("capSeatUserValidcode").value=""; 
							}else{
						        layer.msg("该席位用户信息新增成功",{icon:1});
						        $scope.ModalPwdEntity = {}; 
						        findSeatUsers();
						        $("#modalAddSeatUserModal").modal("hide");
							}
					    }, entity, $scope.capitalEntity.seatID,$scope.capitalEntity.instClientID,validcode);
					}
				}, entity, $scope.capitalEntity.seatID,"2");
		    });
		}else {
			findSeatUser(function(result) {
				if(result != null && result.length>0){
				    layer.msg("已存在该席位用户信息，请更改席位用户代码",{icon:2});
		            validCodeLoad();
				    document.getElementById("capSeatUserValidcode").value="";
		            return ;
				}else{
					insertSeatUser(function(result) {
						if(result == 1){
							validCodeLoad();
						    document.getElementById("capSeatUserValidcode").value=""; 
						}else{
					        layer.msg("该席位用户信息新增成功",{icon:1});
					        $scope.ModalPwdEntity = {}; 
					        findSeatUsers();
					      
					        $("#modalAddSeatUserModal").modal("hide");
						}
				    }, entity, $scope.capitalEntity.seatID,$scope.capitalEntity.instClientID,validcode);
				}
			}, entity, $scope.capitalEntity.seatID,"2");
		}
    };
    
    
    
	//用户席位列表
    $scope.cap_seat_user_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "席位用户代码"},
		{title: "操作"}
	]
	$scope.seatUsers = [];
    // 查询(前台分页)

    function findSeatUsers(){
    	$scope.seatUserLists =[];
        findSeatUser(function(result) {
        $scope.seatUserLists = result;
	    $scope.$apply();
    	}, {instClientID: $scope.capitalEntity.instClientID}, $scope.capitalEntity.seatID,"1");
    }
    
 
/*
    $("body").undelegate("#cap_seat_user_dynamic_table_wrapper td .fobid-operation","click");
    //表格停用事件
    $("body").delegate("#cap_seat_user_dynamic_table_wrapper td .fobid-operation","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.seatUserTable.row(mytr).data();
        var id = tempArr[2];
        for(var i = 0;i<$scope.seatUserLists.length;i++){
        	if(id==$scope.seatUserLists[i].id){
        		$scope.modalSeatUserEntity = $scope.seatUserLists[i];
        	}
        }
        $scope.removeSeatUser($scope.modalSeatUserEntity,id);
    });
    */

/*    // 停用
    $scope.removeSeatUser = function (seatUser, index) {
        // 校验资金账号是否有对应工作流配置
        validateAccountSeatUserInfo(function(result){
			if(result != null && result.length > 0){
				layer.msg("该席位用户有对应账号绑定，无法删除",{icon : 2});
				return false;
			}else{
				deleteSeatUser(function(result) {
			        layer.msg("该席位用户信息删除成功",{icon:1});
			        findSeatUsers();
			    }, seatUser);
			}
		},seatUser);
        
    };*/
    
    // 席位用户 end  ---------
    
    $scope.checkCapitalAccountEntitys = [];
    $("body").undelegate("#capitalAccount_dynamic_table a.multiple-choice","click");
    $("body").delegate("#capitalAccount_dynamic_table a.multiple-choice","click",function(){
        if($(this).hasClass("click-choice-one")){
            $(this).removeClass("click-choice-one");
            $(this).addClass("clicked-choice-one");
            
            var mytr = $(this).parents("tr");
            var tempArr = $scope.capitalAccountTable.row(mytr).data();
            var id = tempArr[2];
            for(var i = 0;i<$scope.capitalAccountEntitys.length;i++){
            	if(id==$scope.capitalAccountEntitys[i].id){
            		$scope.checkCapitalAccountEntitys.push($scope.capitalAccountEntitys[i]);
            		break;
            	}
            }
            
            if($scope.checkCapitalAccountEntitys.length == $scope.capitalAccountEntitys.length){
            	$(".dataTables_scrollHeadInner th a").addClass("clicked-choice-all");
                $(".dataTables_scrollHeadInner th a").removeClass("click-choice-all");
            }
        }
        else{
            $(this).addClass("click-choice-one");
            $(this).removeClass("clicked-choice-one");
            
            $(".dataTables_scrollHeadInner th a").addClass("click-choice-all");
            $(".dataTables_scrollHeadInner th a").removeClass("clicked-choice-all");
            
            var mytr = $(this).parents("tr");
            var tempArr = $scope.capitalAccountTable.row(mytr).data();
            var id = tempArr[2];
            for(var i = 0;i<$scope.capitalAccountEntitys.length;i++){
            	if(id==$scope.capitalAccountEntitys[i].id){
            		var index = $scope.checkCapitalAccountEntitys.indexOf($scope.capitalAccountEntitys[i]);
            		if(index != -1){
            			$scope.checkCapitalAccountEntitys.splice(index,1);
            		}
            		break;
            	}
            }
        }

    });
    
    $("body").undelegate(".dataTables_scrollHeadInner th a","click");
    $("body").delegate(".dataTables_scrollHeadInner th a","click",function(){
        if($(this).hasClass("click-choice-all")){
            $(this).removeClass("click-choice-all");
            $(this).addClass("clicked-choice-all");
            for(var i=0;i<$(".dataTables_scrollBody td a").length;i++){
                if($($(".dataTables_scrollBody td a")[i]).hasClass("click-choice-one")){
                    $($(".dataTables_scrollBody td a")[i]).removeClass("click-choice-one");
                    $($(".dataTables_scrollBody td a")[i]).addClass("clicked-choice-one");
                }
            }
            
            $scope.checkCapitalAccountEntitys = [];
            for(var i = 0;i<$scope.capitalAccountEntitys.length;i++){
            	$scope.checkCapitalAccountEntitys.push($scope.capitalAccountEntitys[i]);
            }
        }
        else{
            $(this).addClass("click-choice-all");
            $(this).removeClass("clicked-choice-all");
            for(var i=0;i<$(".dataTables_scrollBody td a").length;i++){
                if($($(".dataTables_scrollBody td a")[i]).hasClass("clicked-choice-one")){
                    $($(".dataTables_scrollBody td a")[i]).removeClass("clicked-choice-one");
                    $($(".dataTables_scrollBody td a")[i]).addClass("click-choice-one");
                }
            }
            
            $scope.checkCapitalAccountEntitys = [];
        }

    });
    
    
    $('#capitalAccount_dynamic_table').on( 'page.dt', function () {
    	$timeout(function() {
    		if($(".dataTables_scrollHeadInner th a").hasClass("clicked-choice-all")){
        		for(var i=0;i<$(".dataTables_scrollBody td a").length;i++){
        			if($($(".dataTables_scrollBody td a")[i]).hasClass("click-choice-one")){
                        $($(".dataTables_scrollBody td a")[i]).removeClass("click-choice-one");
                        $($(".dataTables_scrollBody td a")[i]).addClass("clicked-choice-one");
                    }
                }
        	}else{
        		var aList = $(".dataTables_scrollBody tr td:nth-child(1) a");
        		for(var i=0;i<aList.length;i++){
        			if($(aList[i]).hasClass("click-choice-all")){
        				continue;
        			}
        			var mytr = $(aList[i]).parents("tr");
        	        var tempArr = $scope.capitalAccountTable.row(mytr).data();
        	        var id = tempArr[2];
        	        for(var j = 0;j<$scope.capitalAccountEntitys.length;j++){
	        	        if(id==$scope.capitalAccountEntitys[j].id){
	        	        	if($scope.checkCapitalAccountEntitys.indexOf($scope.capitalAccountEntitys[j]) == -1){
	        	        		$(aList[i]).removeClass("clicked-choice-one");
	        	        		$(aList[i]).addClass("click-choice-one");
	        	        		break;
	        	        	}
	        	        }
	        		}
        	    }
        	}
        }, 100);
    })
    
    $scope.isChecked = false;
    $scope.checkSeat = function(){
    	if($scope.checkCapitalAccountEntitys.length == 0){
    		layer.msg("未选择资金账号进行有效性校验！",{icon: 2, time: 2000});
    		return false;
    	}
    	$scope.isChecked = true;
    	var entitys = $scope.checkCapitalAccountEntitys;
    	$scope.capitalService.checkSeat(function(result){
    		saveCheckSeat(result);
    		$scope.checkCapitalAccountEntitys = [];
    		$(".dataTables_scrollHeadInner th a").removeClass("clicked-choice-all");
    		$(".dataTables_scrollHeadInner th a").addClass("click-choice-all");
    		$scope.isChecked = false;
    		$scope.$apply();
    	},entitys);
    }
    
    function saveCheckSeat(result){
    	var entitys = angular.copy($scope.capitalAccountEntitys);
    	for(var i=0;i<result.length;i++){
			for(var j=0;j<entitys.length;j++){
				if(result[i].accountID == entitys[j].id){
					entitys[j].resultCode = result[i].resultCode;
					break;
				}
			}
		}
		
    	$scope.capitalAccountDataset = [];
		var con = entitys;
		for(var i = 0; i<con.length;i++){
			var isCTP=true;
			var count = $scope.allSeatEntitys.length;
            for (var j = 0; j < count; j++) {
                if ($scope.allSeatEntitys[j].seatID == con[i].seatID) {
                	 if($scope.allSeatEntitys[j].seatSystem == 0 ||
                		$scope.allSeatEntitys[j].seatSystem == 2 ||
                		$scope.allSeatEntitys[j].seatSystem == 6 ||
                		$scope.allSeatEntitys[j].seatSystem == 8 ||
                		$scope.allSeatEntitys[j].seatSystem == 15 ||
                		$scope.allSeatEntitys[j].seatSystem == 17 ||
                		$scope.allSeatEntitys[j].seatSystem == 18 ||
                		$scope.allSeatEntitys[j].seatSystem == 19 ||
                		$scope.allSeatEntitys[j].seatSystem == 20){
                    	isCTP=false;
                     }else {
                    	 isCTP=true;
                     }
                }
            }

			var operator =$scope.transOper($scope.capitalAccount_rigth);
			var operator1 = $scope.transOper1(!$scope.isInstClient || ($scope.isInstClient && $scope.isAllowInstClient),$scope.capitalAccount_update);
			var operator2 = $scope.transOper2(con[i].isActive,!$scope.isInstClient || ($scope.isInstClient && $scope.isAllowInstClient),$scope.capitalAccount_start);
			var operator3 = $scope.transOper3($scope.capitalAccount_password,isCTP);
            var operator4 = $scope.getConnectPermision($scope.capitalAccount_connect,con[i].isActive,con[i].seatIsConnect);
	    	var tempArr = ["<a class='click-choice-one multiple-choice'>",(i+1),con[i].id,con[i].accountID,con[i].accountName,con[i].brokerName,con[i].innerAccountID,con[i].instName,con[i].fundName
	    			    	,$scope.transPositionType(con[i].positionType),$scope.transAccountGroup(con[i].accountGroupID,con[i].isActive),$scope.transCurrencys(con[i].currency),$scope.transMarketTypes(con[i].market)
	    			    	,$scope.transIsActive(con[i].isActive),con[i].seatUserID,$scope.transSeatIsConnect(con[i].seatIsConnect),$scope.transResultCode(con[i].resultCode),$scope.transBranch(con[i].branchID)
                            ,operator+operator1+operator4+operator2+operator3,con[i].productOption,con[i].exchRight]
	    	con[i].index = tempArr[0];
	    	$scope.capitalAccountDataset.push(tempArr);   		   
        }
		//重新绘表
        $scope.capitalAccountTable.clear().draw();
        $scope.capitalAccountTable.rows.add($scope.capitalAccountDataset).draw();
		$scope.$apply();
    }
    
    $scope.transResultCode = function(resultCode){
    	if(resultCode == "0"){
    		return "有效";
    	}else if(resultCode == "1"){
    		return "交易通道地址错误";
    	}else if(resultCode == "2"){
    		return "账户或账户密码有误";
    	}else if(resultCode == "3"){
    		return "授权码错误";
    	}else if(resultCode == "9"){
    		return "交易所系统错误";
    	}else if(resultCode == "10"){
    		return "未连接交易通道";
    	}else if(resultCode == "100"){
    		return "超时";
    	}else if(resultCode == "99" || resultCode == "4" || resultCode == "5" || resultCode == "6" || resultCode == "7" || resultCode == "8"){
    		return "系统错误，请重新校验";
    	}else{
    		return "";
    	}
    }
    
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	/*$scope.capitalAccountTable = $('#capitalAccount_dynamic_table').DataTable( {
    		data : $scope.capitalAccountDataset,
        	columns :$scope.capitalAccount_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 2
            },
			buttons: [
			],
			"aoColumnDefs": [ { "bSortable": false, "aTargets": [ 0 ] }]
        } );*/
/*    	//会话列表初始化
    	$scope.seatUserTable = $('#cap_seat_user_dynamic_table').DataTable( {
    		data : $scope.seatUsers,
        	columns :$scope.cap_seat_user_columns,
        	"bScrollCollapse" : true,
            dom: 'rt<"bottom"iplB>',
			buttons: [
			]
        } );*/
    });
});

