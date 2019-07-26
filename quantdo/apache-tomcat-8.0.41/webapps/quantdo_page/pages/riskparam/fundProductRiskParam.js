myapp.controller('fundProductRiskParamController', function ($scope, $timeout) {
	
    $scope.riskTypes = clearConstant.riskTypes;	//风险指标
    $scope.isNotDatas = clearConstant.isNotDatas;	//是否
    $scope.riskWay = clearConstant.riskWay;		//风控方式
    $scope.tradeRights = clearConstant.tradeRights;	//交易权限
    $scope.riskLevels = clearConstant.riskLevels;	//风险等级
    $scope.listEntitys = [];
    $scope.listEntity = {};
    $scope.queryEntity = {};
    $scope.netEntity = {};		//净值对象
    $scope.fundNetDetail = {};	//净值明细对象
    $scope.delivEntity = {};	//交割期对象
    $scope.fundProducts = [];
    $scope.chosenRiskTypeEntity = {};
    $scope.fundNetRisks = [];	//净值明细列表
    
    $scope.fundRiskParamService = new com.quantdo.orgClear.service.FundProductRiskParamService();
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
    //初始化机构信息
    $scope.instClientService.findByQuery(function (result) {
        $scope.instClientlistEntitys = result;
        $scope.$apply();
    },{});
    
    $scope.instClientID = '';
    queryInstClientID(function (result) {
        $scope.instClientID = result;
        $scope.queryEntity={};
        if($scope.instClientID != undefined ){
        	$scope.isInstClient = true;
        	$scope.queryEntity.instClientID=$scope.instClientID;
    		$scope.isInstClientSelect($scope.queryEntity.instClientID);
        }else{
        	$scope.isInstClient = false;

        }
        $scope.fundRiskParamService.findMainRiskByCondition(function(result){
        	$scope.listEntitys = angular.copy(result);
        	$scope.$apply();
        },$scope.queryEntity);

    });
	
    //机构名称转换
    $scope.transInstClient = function (instClientID) {
    	for(var i = 0;i < $scope.instClientlistEntitys.length; i++){
    		if($scope.instClientlistEntitys[i].instClientID == instClientID){
    			return $scope.instClientlistEntitys[i].instClientAbbrName;
    		}
    	}
    }
    
    var d = new Date();
	var currentDate = d.getFullYear() + "" + (d.getMonth() + 1) + "" + (d.getDate() + 1);
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,
	    autoclose: true,
	    clearBtn: true,
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});
    
    getAllFundProductEntity(function (result) {
        $scope.fundProducts = angular.copy(result);
        $scope.$apply();
    });
    
    $scope.fundProductTems=[];
    $scope.isInstClientSelect = function (instClientId) {
    	$scope.fundProductTems=[];
    	findFundProduct(function (result) {
        	$scope.fundProductTems=result;
        	$scope.$apply();
        },{instClientID:instClientId});
    };
    
    
    // 转换风控指标
    $scope.transRiskTypes = function(key){
    	for(var i = 0;i < $scope.riskTypes.length;i++){
    		if($scope.riskTypes[i].key == key){
    			return $scope.riskTypes[i].text;
    		}
    	}
    }
    
    // 转换风控方式
    $scope.transRiskWay = function(key){
    	for(var i = 0;i < $scope.riskWay.length;i++){
    		if($scope.riskWay[i].key == key){
    			return $scope.riskWay[i].text;
    		}
    	}
    }
    
    // 转换是否自动恢复
    $scope.transIsNotDatas = function(key){
    	for(var i = 0;i < $scope.isNotDatas.length;i++){
    		if($scope.isNotDatas[i].key == key){
    			return $scope.isNotDatas[i].text;
    		}
    	}
    }
    
    // 初始化新增选择
    $scope.initRiskTypeParameter = function (entity) {
    	$scope.chosenRiskTypeEntity.riskType = $scope.riskTypes[0].key;
    };
    
    // 选择风控指标后判断跳转,初始化对应新增界面
    $scope.chooseRiskType = function (entity) {
    	
    	if(entity.riskType == $scope.riskTypes[0].key){		//初始化净值
    		$scope.fundRiskAddModal = "#fundNetRiskModal";
    		$("#chooseRiskTypeModal").modal("hide");
    		$scope.isUpdate = false;
    		$scope.netEntity = {};
    		$scope.fundNetRisks = [];
    		if($scope.instClientID != undefined ){
   	            $scope.isInstClient = true;
   	            $scope.netEntity.instClientID=$scope.instClientID;

   	        }else{
   	            $scope.netEntity.instClientID=$scope.instClientlistEntitys[0].instClientID;
   	        }
    		$scope.isInstClientSelect($scope.netEntity.instClientID);
    		$scope.netEntity.startDate = '';
    		$scope.netEntity.endDate = '';
    		$scope.netEntity.lowerUnitNet = '';
    		$scope.netEntity.upperUnitNet = '';
    		$scope.netEntity.selectedDate = false;
    		$scope.netEntity.selectedtime = false;
    		$scope.dateNotEdit = true;
    		$scope.timeNotEdit = true;
    		$scope.netEntity.startTime = '';
    		$scope.netEntity.endTime = '';

    		document.getElementById("netEntityStartTime").value = '';
    		document.getElementById("netEntityEndTime").value = '';
    	}else{												//初始化交割期
    		$scope.fundRiskAddModal = "#fundDelivModal";
    		$("#chooseRiskTypeModal").modal("hide");
    		$scope.isUpdate = false;
    		$scope.fundDeliv = {};
        	$scope.fundDelivForm.productID.$setPristine();
        	$scope.fundDelivForm.beforeDelivMonths.$setPristine();
        	$scope.fundDelivForm.instClientID.$setPristine();
        	$scope.fundDelivForm.tradeRight.$setPristine();
        	if($scope.instClientID != undefined ){
   	            $scope.isInstClient = true;
   	            $scope.fundDeliv.instClientID=$scope.instClientID;
   	         
   	        }else{
   	         $scope.fundDeliv.instClientID=$scope.instClientlistEntitys[0].instClientID;
   	        }
        	$scope.isInstClientSelect($scope.fundDeliv.instClientID);
    		$scope.fundDeliv.tradeRight = $scope.tradeRights[1].key;
    	}
    };
    
    // 勾选生效日期，判断日期是否可操作
    $scope.changeDateState = function(){
    	if($scope.netEntity.selectedDate == true){
    		$scope.netEntity.selectedTime = true;
    		$scope.dateNotEdit = false;
    		$scope.timeNotEdit = false;
    	}else{
    		$scope.dateNotEdit = true;
    		$scope.netEntity.startDate = '';
    		$scope.netEntity.endDate = '';
    	}
    }

    // 勾选生效时间，判断时间是否可操作
    $scope.changeTimeState = function(){
    	if($scope.netEntity.selectedTime == true && $scope.netEntity.selectedDate == false){
    		$scope.timeNotEdit = false;
    	}else if($scope.netEntity.selectedTime == false && $scope.netEntity.selectedDate == true){
    		$scope.netEntity.selectedTime = true;
    	}else{
    		$scope.timeNotEdit = true;
    		$scope.netEntity.startTime = '';
    		document.getElementById("netEntityStartTime").value = '';
    		document.getElementById("netEntityEndTime").value = '';
    		$scope.netEntity.endTime = '';
    	}
    }
    
    // 主页面，点击修改
    $scope.initUpdateParam = function (index, entity) {
    	$scope.isInstClientSelect(entity.instClientID);
    	if(entity.type == 1){	//净值
    		$scope.fundProductRiskParamUpdateTarget = "#fundNetRiskModal";
        	$scope.isUpdate = true;
        	$scope.fundRiskParamService.findFundNetRiskByFundNetRiskID(function(fundRiskResult){
        		$scope.netEntity = angular.copy(fundRiskResult);
        		$scope.netEntity.recordIndex = index;
        		if(fundRiskResult.startDate == null){
        			$scope.netEntity.selectedDate = false;
        			$scope.dateNotEdit = true;
        		}else{
        			$scope.netEntity.selectedDate = true;
        			$scope.dateNotEdit = false;
        			document.getElementById("netEntityStartTime").value = fundRiskResult.startTime;
            		document.getElementById("netEntityEndTime").value = fundRiskResult.endTime;
        		}
        		if(fundRiskResult.startTime == null){
        			$scope.netEntity.selectedTime = false;
        			$scope.timeNotEdit = true;
        		}else{
        			$scope.netEntity.selectedTime = true;
        			$scope.timeNotEdit = false;
        		}
        		$scope.netEntity.riskWay = $scope.riskWay[0].key;
        		$scope.netEntity.isRecovery = $scope.isNotDatas[0].key;
        		$scope.fundNetRiskForm.$setPristine();
        		$scope.fundRiskParamService.findUnitNetRisksByFundNetRiskID(function(netRiskResult){
        			$scope.fundNetRisks = angular.copy(netRiskResult);
        			$scope.$apply();
        		},entity.fundNetRiskID);
        	},entity.fundNetRiskID);
    	}else{			//交割期
        	$scope.fundProductRiskParamUpdateTarget = "#fundDelivModal";
        	$scope.isUpdate = true;
        	$scope.fundRiskParamService.findDelivById(function(result){
        		$scope.fundDeliv = angular.copy(result);
            	$scope.fundDeliv.recordIndex = index;
            	$scope.fundDelivForm.productID.$setPristine();
            	$scope.fundDelivForm.beforeDelivMonths.$setPristine();
            	$scope.fundDelivForm.instClientID.$setPristine();
            	$scope.fundDelivForm.tradeRight.$setPristine();
            	$scope.$apply();
        	},entity.delivRiskID);
    	}
    };
    
    // 主页面，删除
    $scope.remove = function (entity, index) {
    	if(entity.type == 1){	//净值
    		layer.confirm("确定删除这条记录？",{icon:3},function(count){
          		 $scope.fundRiskParamService.deleteFundNetRiskEntity(function(){
          	              layer.msg("删除成功！",{icon:1});
          	              $scope.listEntitys.splice(index, 1);
          	              layer.close(count);
          	              $scope.$apply();
          	        },entity.fundNetRiskID);
              });
    	}else{		//交割期
        	layer.confirm("确定删除这条记录？",{icon:3},function(count){
       		 $scope.fundRiskParamService.deleteDelivEntity(function(){
       	              layer.msg("删除成功！",{icon:1});
       	              $scope.listEntitys.splice(index, 1);
       	              layer.close(count);
       	              $scope.$apply();
       	        },entity.delivRiskID);
           });
    	}
    };

    // 新增单位净值风控明细初始化
    $scope.initNetRiskParameter = function(entity){
    	if((entity.lowerUnitNet != null && entity.lowerUnitNet.trim() != '') && 
    			(entity.upperUnitNet != null && entity.upperUnitNet.trim() != '') &&
    			parseFloat(entity.lowerUnitNet) > parseFloat(entity.upperUnitNet)){
    		layer.msg("净值上限不能比下限小",{icon: 2});
    		$scope.fundNetDetailTarget = "";
    	}else{
    		$scope.fundNetDetailTarget = "#fundNetDetailModal";
    	}
    	$scope.fundDelivForm.$setPristine();
     	$scope.fundDelivForm.instClientID.$setPristine();
    	$scope.fundNetDetail = {};
    	$scope.fundNetDetail.lowerUnitNet = '';
    	$scope.fundNetDetail.upperUnitNet = '';
    	$scope.fundNetDetail.marginRatio = '';
    	$scope.fundNetDetail.netMarginRatio = '';
    	$scope.fundNetDetail.singleMarginRatio = '';
    	$scope.fundNetDetail.productGroupMarginRatio = '';
    	$scope.fundNetDetail.positionCostRatio = '';
    	$scope.fundNetDetail.netPosCostRatio = '';
    	$scope.fundNetDetail.riskWay = $scope.riskWay[0].key;
		$scope.fundNetDetail.isRecovery = $scope.isNotDatas[0].key;
    	$scope.fundNetDetail.riskLevel = "0";
    }
    
    // 修改单位净值风控明细初始化
    $scope.initFundNetRiskUpdateParam = function(index,entity){
    	$scope.fundNetDetail = angular.copy(entity);
    	$scope.fundNetDetail.recordIndex = index;
    	$scope.fundDelivForm.$setPristine();
    }
    
    // 删除单位净值风控明细
    $scope.removeFundNetRisk = function(entity,index){
    	layer.confirm("确定删除这条记录？",{icon:3},function(count){
              layer.msg("删除成功！",{icon:1});
              $scope.fundNetRisks.splice(index, 1);
              layer.close(count);
              $scope.$apply();
          });
    }
    
    // 保存单位净值风控
    $scope.saveFundNetRisk = function(entity){
    	if($scope.fundNetRisks == null || $scope.fundNetRisks == undefined || $scope.fundNetRisks.length == 0){
    		layer.msg("单位净值参数不能为空",{icon: 2});
    		return false;
    	}
    	entity.startTime = document.getElementById("netEntityStartTime").value;
    	entity.endTime = document.getElementById("netEntityEndTime").value;
    	if(!$scope.dateNotEdit && (
    			(entity.startDate == null || entity.startDate.trim() == '') || 
        		(entity.endDate == null || entity.endDate.trim() == ''))){
        	layer.msg("日期范围不可为空",{icon: 2});
    		return false;
        }
    	if(!$scope.timeNotEdit && (
    			(entity.startTime == null || entity.startTime.trim() == '') || 
        		(entity.endTime == null || entity.endTime.trim() == ''))){
        	layer.msg("时间范围不可为空",{icon: 2});
    		return false;
        }
    	if((entity.startDate != null && entity.startDate.trim() != '') && 
    			(entity.endDate != null && entity.endDate.trim() != '') &&
    			entity.startDate > entity.endDate){
    		layer.msg("结束日期不能比开始日期小",{icon: 2});
    		return false;
    	}
    	if((entity.startTime != null && entity.startTime.trim() != '') && 
    			(entity.endTime != null && entity.endTime.trim() != '') &&
    			entity.startTime >= entity.endTime){
    		layer.msg("结束时间不能比开始时间小",{icon: 2});
    		return false;
    	}
    	var index = entity.recordIndex;
    	// 新增
    	if(index == undefined){
    		$scope.fundRiskParamService.addFundNetRiskEntity(function(result){
    			if(result != null){
    				layer.msg("新增成功",{icon: 1});
    				$scope.fundRiskParamService.findMainRiskByCondition(function(result){
    			    	$scope.listEntitys = angular.copy(result);
    			    	$scope.$apply();
    			    	$("#fundNetRiskModal").modal("hide");
    			    },$scope.queryEntity);
    			}else{
    				layer.msg("新增失败",{icon: 2});
    			}
    		},entity,$scope.fundNetRisks);
    	}else{		// 修改
    		$scope.fundRiskParamService.updateFundNetRiskEntity(function(result){
    			if(result != null){
    				layer.msg("修改成功",{icon: 1});
    				$scope.fundRiskParamService.findMainRiskByCondition(function(result){
    			    	$scope.listEntitys = angular.copy(result);
    			    	$scope.$apply();
    			    	$("#fundNetRiskModal").modal("hide");
    			    },$scope.queryEntity);
    			}else{
    				layer.msg("修改失败",{icon: 2});
    			}
    		},entity,$scope.fundNetRisks);
    	}
    	
    };
    
    // 保存单位净值风控明细
    $scope.saveFundNetDetail = function(entity){
    	var index = entity.recordIndex;
        $scope.tempNetEntity = angular.copy(entity);
        if((entity.lowerUnitNet == null || entity.lowerUnitNet.toString().trim() == '') && 
        		(entity.upperUnitNet == null || entity.upperUnitNet.toString().trim() == '')){
        	layer.msg("净值范围不可为空",{icon: 2});
    		return false;
        }
        if((entity.lowerUnitNet != null && entity.lowerUnitNet.toString().trim() != '') && 
    			(entity.upperUnitNet != null && entity.upperUnitNet.toString().trim() != '') &&
    			parseFloat(entity.lowerUnitNet) >= parseFloat(entity.upperUnitNet)){
    		layer.msg("净值上限不能比下限小",{icon: 2});
    		return false;
    	}
        if(entity.marginRatio == undefined || entity.marginRatio.toString().trim() == ''){
        	entity.marginRatio = null;
        }else{
        	entity.marginRatio = parseFloat(entity.marginRatio);
        }
        if(entity.netMarginRatio == undefined || entity.netMarginRatio.toString().trim() == ''){
        	entity.netMarginRatio = null;
        }else{
        	entity.netMarginRatio = parseFloat(entity.netMarginRatio);
        }
        if(entity.singleMarginRatio == undefined || entity.singleMarginRatio.toString().trim() == ''){
        	entity.singleMarginRatio = null;
        }else{
        	entity.singleMarginRatio = parseFloat(entity.singleMarginRatio);
        }
        if(entity.productGroupMarginRatio == undefined || entity.productGroupMarginRatio.toString().trim() == ''){
        	entity.productGroupMarginRatio = null;
        }else{
        	entity.productGroupMarginRatio = parseFloat(entity.productGroupMarginRatio);
        }
        if(entity.positionCostRatio == undefined || entity.positionCostRatio.toString().trim() == ''){
        	entity.positionCostRatio = null;
        }else{
        	entity.positionCostRatio = parseFloat(entity.positionCostRatio);
        }
        if(entity.netPosCostRatio == undefined || entity.netPosCostRatio.toString().trim() == ''){
        	entity.netPosCostRatio = null;
        }else{
        	entity.netPosCostRatio = parseFloat(entity.netPosCostRatio);
        }
        
        var tmpList = angular.copy($scope.fundNetRisks);
        if(index != undefined){
        	tmpList.splice(index,1);
        }
        
     // 判断净值范围是否重叠
        for(var i =0;i < tmpList.length;i++){
    		if(tmpList[i].upperUnitNet == undefined || tmpList[i].upperUnitNet == ''){
        		if(entity.upperUnitNet == undefined || entity.upperUnitNet.toString().trim() =='' || 
        				parseFloat(entity.upperUnitNet) > tmpList[i].lowerUnitNet){
        			layer.msg("净值范围重叠，请重新设置",{icon: 2});
            		return false;
        		}
        	}else if(tmpList[i].lowerUnitNet == undefined || tmpList[i].lowerUnitNet == ''){
        		if(entity.lowerUnitNet == undefined || entity.lowerUnitNet.toString().trim() =='' || 
        				parseFloat(entity.lowerUnitNet) < tmpList[i].upperUnitNet){
        			layer.msg("净值范围重叠，请重新设置",{icon: 2});
            		return false;
        		}
        	}else{
        		if(entity.lowerUnitNet == undefined || entity.lowerUnitNet.toString().trim() ==''){
        			if(parseFloat(entity.upperUnitNet) > tmpList[i].lowerUnitNet){
            			layer.msg("净值范围重叠，请重新设置",{icon: 2});
                		return false;
        			}
        		}else if(entity.upperUnitNet == undefined || entity.upperUnitNet.toString().trim() ==''){
        			if(parseFloat(entity.lowerUnitNet) < tmpList[i].upperUnitNet){
						layer.msg("净值范围重叠，请重新设置",{icon: 2});
						return false;
        			} 
        		}else{
        			if(parseFloat(entity.lowerUnitNet) < tmpList[i].upperUnitNet && parseFloat(entity.upperUnitNet) > tmpList[i].lowerUnitNet){
        				layer.msg("净值范围重叠，请重新设置",{icon: 2});
                		return false;
        			}
        		}
        	}
        }
        if(entity.upperUnitNet == undefined || entity.upperUnitNet.toString().trim() == ''){
        	entity.upperUnitNet = null;
        }else{
        	entity.upperUnitNet = parseFloat(entity.upperUnitNet);
        }
        if(entity.lowerUnitNet == undefined || entity.lowerUnitNet.toString().trim() == ''){
        	entity.lowerUnitNet = null;
        }else{
        	entity.lowerUnitNet = parseFloat(entity.lowerUnitNet);
        }
        
        //增加
        if (index == undefined) {
        	$scope.fundNetRisks.unshift(entity);
        	layer.msg("操作成功",{icon: 1});
        	$("#fundNetDetailModal").modal("hide");
        }else{	//修改
        	$scope.fundNetRisks.splice(index,1,entity);
        	layer.msg("操作成功",{icon: 1});
        	$("#fundNetDetailModal").modal("hide");
        	
        }
    };
    
    // 保存交割期风控参数
    $scope.saveFundDeliv = function(entity){
    	var index = entity.recordIndex;
        $scope.tempEntity = angular.copy(entity);
        $scope.delivInsertList = [];
        if($scope.tempEntity.productID == undefined || $scope.tempEntity.productID.trim() == ''){
        	var tmpOne = {
        		id: entity.id,
        		fundProductID: entity.fundProductID,
        		productID: 'default',
        		beforeDelivMonths: entity.beforeDelivMonths,
        		tradeRight: entity.tradeRight
        	};
        	$scope.delivInsertList.push(tmpOne);
        }else{
        	var productList = [];
        	productList = $scope.tempEntity.productID.split(',');
        	angular.forEach(productList,function(data,index,list){
        		if(data.trim() != ''){
        			var tmpEntity = angular.copy($scope.tempEntity);
            		tmpEntity.productID = data.trim();
            		$scope.delivInsertList.push(tmpEntity);
        		}
        	});
        }
    	
        //增加
        if (index == undefined) {
        	$scope.fundRiskParamService.addDelivEntitys(function(results){
        		if(results != null && results.length > 0){
			    	$scope.listEntitys = results;
			        $scope.$apply();
        			layer.msg("新增成功",{icon: 1});
        			$("#fundDelivModal").modal("hide");
        		}else{
        			layer.msg("新增失败",{icon: 2});
        		}
        	},$scope.delivInsertList);
            //修改
        } else {
        	if($scope.delivInsertList.length == 1){			//非批量级修改
        		$scope.fundRiskParamService.findDelivByFundIDAndProductID(function (result){
        			if(result.length > 0 ){
        				if(result[0].productID == 'default'){
        					result[0].productID = '';
        				}
        				if(result[0].productID == $scope.listEntitys[index].productID){		//修改前后品种不变
        					$scope.fundRiskParamService.updateDelivEntity(function (updateResult){
    		    				if(updateResult != null){
    		            			layer.msg("修改成功",{icon: 1});
    		            			$scope.fundRiskParamService.findMainRiskByCondition(function(result){
    		            		    	$scope.listEntitys = angular.copy(result);
    		            		    	$scope.$apply();
    		            		    	//关闭窗口
    		            		    	$("#fundDelivModal").modal("hide");
    		            		    },$scope.queryEntity);
    		    				}else{
    		    					layer.msg("修改"+$scope.delivInsertList[0].productID+"失败",{icon: 2});
    		    					return false;
    		    				}
    		    			},$scope.delivInsertList[0]);
        				}else{				//修改前后品种变化
//        					if(result[0].productID == ''){
//        						layer.msg("已设置对应产品所有品种限制", {
//            						icon : 2
//            					});
//        					}else{
//        						layer.msg("品种"+$scope.delivInsertList[0].productID+"限制已存在", {
//            						icon : 2
//            					});
//        					}
//                			return false;
        					$scope.fundRiskParamService.updateDelivEntity(function (updateResult){
    		    				if(updateResult != null){
    		            			layer.msg("修改成功",{icon: 1});
    		            			$scope.fundRiskParamService.findMainRiskByCondition(function(result){
    		            		    	$scope.listEntitys = angular.copy(result);
    		            		    	$scope.$apply();
    		            		    	//关闭窗口
    		            		    	$("#fundDelivModal").modal("hide");
    		            		    },$scope.queryEntity);
    		    				}else{
    		    					layer.msg("修改"+$scope.delivInsertList[0].productID+"失败",{icon: 2});
    		    					return false;
    		    				}
    		    			},$scope.delivInsertList[0]);
        				}
            		}else{
		        		$scope.fundRiskParamService.updateDelivEntity(function (updateResult){
		    				if(updateResult != null){
		            			layer.msg("修改成功",{icon: 1});
		            			$scope.fundRiskParamService.findMainRiskByCondition(function(result){
		            		    	$scope.listEntitys = angular.copy(result);
		            		    	$scope.$apply();
		            		    	//关闭窗口
		            		    	$("#fundDelivModal").modal("hide");
		            		    },$scope.queryEntity);
		    				}else{
		    					layer.msg("修改"+$scope.delivInsertList[0].productID+"失败",{icon: 2});
		    					return false;
		    				}
		    			},$scope.delivInsertList[0]);
            		}
        		},$scope.delivInsertList[0]);
        	}else{
        		for(var i = 0;i < $scope.delivInsertList.length;i++){
        			delete $scope.delivInsertList[i].id;
        		}
    			$scope.fundRiskParamService.updateDelivEntitys(function(results){
            		if(results != null && results.length > 0){
            			$scope.listEntitys = results;
    			        $scope.$apply();
            			layer.msg("操作成功",{icon: 1});
            			$("#fundDelivModal").modal("hide");
            		}else{
            			layer.msg("操作失败",{icon: 2});
            		}
            	},$scope.delivInsertList,$scope.listEntitys[index]);
        	}
        }
    };

    // 根据页面条件查询
    $scope.find = function (object) {
        $scope.isQuery = true;
        $scope.listEntitys = [];
        $scope.fundRiskParamService.findMainRiskByCondition(function (result) {
            $scope.listEntitys = angular.copy(result);
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, object);
    };

});

