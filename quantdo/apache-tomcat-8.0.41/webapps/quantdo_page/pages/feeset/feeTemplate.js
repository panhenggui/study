myapp.controller('FeeTemplateController', function($scope, $timeout,$rootScope) {
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.queryFeeTemplateEntity = {};
	$scope.queryFeeTemplateEntitys = [];
	$scope.queryFeeTemplateProductEntity = {};
	$scope.queryFeeTemplateProductEntitys = [];

	$scope.feeTemplateListEntity = {};
	$scope.feeTemplateListEntitys = [];
	$scope.feeTemplateProductListEntity = {};
	$scope.feeTemplateProductListEntitys = [];

	$scope.modalFeeTemplateEntity = {};
	$scope.modalFeeTemplateProductEntity = {};

	$scope.tempEntity1 = {};
	$scope.tempEntity2 = {};
	$scope.allExchanges = {};
	$scope.allProducts = {};
	$scope.queryExchanges = {};
	$scope.productDatas = {};
	$scope.modalExchanges = {};
	$scope.modalProducts = {};
	$scope.delLists = new Array();
	$scope.allReceiveType = clearConstant.receiveTypes;
	
	$scope.tmpProductID = "";
	$scope.notGetTemplateID = true;
	$scope.isSelected = false;
	$scope.selectedTemplateName = null;
	
	$scope.feeTemplate_temp_query = isShow("feeTemplate_temp_query");
	$scope.feeTemplate_temp_add = isShow("feeTemplate_temp_add");
	$scope.feeTemplate_temp_outExcel = isShow("feeTemplate_temp_outExcel");
	$scope.feeTemplate_temp_copy = isShow("feeTemplate_temp_copy");
	$scope.feeTemplate_temp_in = isShow("feeTemplate_temp_in");
	$scope.feeTemplate_temp_update = isShow("feeTemplate_temp_update");
	$scope.feeTemplate_temp_delete = isShow("feeTemplate_temp_delete");
	$scope.feeTemplate_fee_query = isShow("feeTemplate_fee_query");
	$scope.feeTemplate_fee_add = isShow("feeTemplate_fee_add");
	$scope.feeTemplate_fee_batchdelete = isShow("feeTemplate_fee_batchdelete");
	$scope.feeTemplate_fee_update = isShow("feeTemplate_fee_update");
	$scope.feeTemplate_fee_delete = isShow("feeTemplate_fee_delete");
	
	
	 //定义固定列头
    $scope.feeTemplate_columns = [
		{title: "序号"},
		{title: "id",visible:false},
		{title:"templateID",visible:false},
		{title: "模板名称"},
		{title: "操作"}                              
    ]
    
    $scope.feeTemplateProduct_columns = [
            {title:"<a class='click-choice-all'></a>"},
            {title: "id",visible:false},
			{title: "模板代码"},
			{title: "模板名称"},
			{title: "交易所"},
			{title: "是否为期权"},
			{title: "品种/合约代码"},
			{title: "收取方式"},
			{title: "开仓按金额"},
			{title: "开仓按手数"},
			{title: "平仓按金额"},
			{title: "平仓按手数"},
			{title: "平今按金额"},
			{title: "平今按手数"},
			{title: "行权按金额"},
			{title: "行权按手数"},
			{title: "操作"}                           
	]
	
	// 初始化页面记录
	//全选按钮事件
	$scope.chooseAll = function(){
		if($scope.isSelected == false){
			$scope.isSelected = true;
			$scope.delLists = angular.copy($scope.feeTemplateProductListEntitys);
		}else{
			$scope.isSelected = false;
			$scope.delLists = [];
		}
	};
	
	//checkbox个别选择事件
	$scope.changeSelected = function(x,entity){
		if(x){
			$scope.delLists.push(entity);
		}else{
			var index = $scope.delLists.indexOf(entity);
			$scope.delLists.splice(index, 1);
		}
	};
	
	//选中模板高亮展示
	$scope.selectedThis =function(flag){
		$scope.selectedTemplateName = flag.templateName;
		   angular.forEach($scope.feeTemplateListEntitys, function(trad) {
		      trad.flag = 0;
		   });
		   angular.forEach($scope.feeTemplateListEntitys, function(trad1) {
		      if(trad1.templateID == flag.templateID){
		         trad1.flag = 1;
		      }
		   });
	};
	
	// 所有手续费模板
	getAllFeeTemplateEntity(function(result) {
		$scope.feeTemplateListEntitys = result;
		$scope.queryFeeTemplateEntitys = angular.copy($scope.feeTemplateListEntitys);
		for(var i=0;i<$scope.feeTemplateListEntitys.length;i++){
			$scope.feeTemplateListEntitys.index = i+1;
		}
		$scope.$apply();
	});

	// 按手续费模板获取所有手续费模板品种
	$scope.getFeeTemplateProduct = function(templateID) {
		$scope.templateID =templateID;
		findFeeTemplateProduct(function(result) {
			$scope.feeTemplateProductListEntitys = result;
			$scope.queryFeeTemplateProductEntitys = angular
					.copy($scope.feeTemplateProductListEntity);
			$scope.$apply();
		}, {
			templateID : templateID
		});
		$scope.notGetTemplateID = false;
		find2({templateID:$scope.templateID});
	};

	// 所有交易所信息
	getAllExchanges(function(result) {
		$scope.allExchanges = result;
		$scope.queryExchanges = result;
	});

	// 所有品种信息
	getAllProductEntity(function(result) {
		$scope.allProducts = result;
		//$scope.productDatas = result;
		$scope.productDatasAdd = result;
	});
	
	//初始化查询所有产品合约信息
    getProductByExchID(function (resultp) {
		getInstrumentByExchID(function (resulti) {
			$scope.productDatas = {};
            if(resultp !=undefined && resultp.length>0){
            	$scope.productDatas = resultp;
            }
            if(resulti !=undefined && resulti.length>0){
            	for(var i=0;i<resulti.length;i++){
            		resulti[i].productID = resulti[i].instrumentID;
            		resulti[i].productName = resulti[i].instrumentName;
            		if(resulti[i].productType != "2"){ //将非期权的productclass转化成1
            			resulti[i].productType = "1";
            		}
            		$scope.productDatas.push(resulti[i]);
            	}
                $scope.$apply();
            }
            $scope.gradingIsAll = true;
            $scope.isInstrumentAll = false;
            $scope.isInstrument= false;
		}, {'exchID': '', 'instrumentID': '', 'productType': '', 'productStatus': ''});
	}, {'exchID': '', 'productID': '', 'productType': '', 'productStatus': ''});

    //粒度(区分品种、合约)
    $scope.gradings = [
        {text: '品种', key: '1'},
        {text: '合约', key: '2'}
    ];
    
    $scope.gradingIsAll = true;
    /*$timeout(function() {
    	$scope.queryFeeTemplateProductEntity.grading = $scope.gradings[0].key;
    },500);*/
    
    //$scope.productTypes = clearConstant.productTypes;
    
    //是否为期权
    $scope.ifOptions = [
        {text: '否', key: '1'},
        {text: '是', key: '2'}
    ];
    /*$timeout(function() {
        $scope.queryFeeTemplateProductEntity.productType = $scope.ifOptions[0].key; 
    },500);*/
    
    $scope.isInstrument = false;
    $scope.isInstrumentAll = false;
    $scope.isSGE = false;
    
  //根据交易所信息以及粒度初始化产品代码
    $scope.changeProductTypeForQuery = function (entity) {
    	if(entity.exchID == "SGE"){
    		$scope.isSGE = true;
    		$scope.queryFeeTemplateProductEntity.grading = $scope.gradings[0].key;
    	}else{
    		$scope.isSGE = false;
    	}
    	if(entity.grading == "1"){
	        getProductByExchID(function (result) {
	            $scope.productDatas = {};
	            if(result !=undefined && result.length>0){
	            	$scope.productDatas = result;
	                $scope.$apply();
	            }
	            $scope.gradingIsAll = false;
	            $scope.isInstrumentAll = false;
	            $scope.isInstrument= false;
	            //$scope.queryFeeTemplateProductEntity.productType = $scope.ifOptions[0].key; 
	            $scope.$apply();
	        }, {'exchID': entity.exchID, 'productID': '', 'productType': '', 'productStatus': ''});
    	}else if(entity.grading == "2"){
    		getInstrumentByExchID(function (result) {
	            $scope.productDatas = {};
	            if(result !=undefined && result.length>0){
	            	for(var i=0;i<result.length;i++){
	            		result[i].productID = result[i].instrumentID;
	            		result[i].productName = result[i].instrumentName;
	            		if(result[i].productType != "2"){ //将非期权的productclass转化成1
	            			result[i].productType = "1";
	            		}
	            	}
	            	$scope.productDatas = result;
	                $scope.$apply();
	            }
	            $scope.gradingIsAll = false;
	            $scope.isInstrumentAll = false;
	            $scope.isInstrument= true;
	            $scope.$apply();  
	        }, {'exchID': entity.exchID, 'instrumentID': '', 'productType': '', 'productStatus': ''});
    	}else if(entity.grading == "" || entity.grading == null){
    		getProductByExchID(function (resultp) {
    			getInstrumentByExchID(function (resulti) {
    				$scope.productDatas = {};
    	            if(resultp !=undefined && resultp.length>0){
    	            	$scope.productDatas = resultp;
    	            }
    	            if(resulti !=undefined && resulti.length>0){
    	            	for(var i=0;i<resulti.length;i++){
    	            		resulti[i].productID = resulti[i].instrumentID;
    	            		resulti[i].productName = resulti[i].instrumentName;
    	            		if(resulti[i].productType != "2"){ //将非期权的productclass转化成1
    	            			resulti[i].productType = "1";
    	            		}
    	            		$scope.productDatas.push(resulti[i]);
    	            	}
    	                $scope.$apply();
    	            }
    	            $scope.gradingIsAll = true;
    	            $scope.isInstrumentAll = false;
    	            $scope.isInstrument= false;
    	            $scope.$apply();
    			}, {'exchID': entity.exchID, 'instrumentID': '', 'productType': '', 'productStatus': ''});
    		}, {'exchID': entity.exchID, 'productID': '', 'productType': '', 'productStatus': ''});
    	}
    };
    
    //根据交易所信息以及粒度初始化产品代码并修改是否为期权
    $scope.changeProductForQuery = function (entity) {
    	if(entity.grading == "1"){
	        getProductByExchID(function (result) {
	            $scope.productDatas = {};
	            if(result !=undefined && result.length>0){
	            	$scope.productDatas = result;
	                $scope.$apply();
	            }
	            $scope.gradingIsAll = false;
	            $scope.isInstrumentAll = false;
	            $scope.isInstrument= false;
	            //$scope.queryFeeTemplateProductEntity.productType = $scope.ifOptions[0].key; 
	            $scope.$apply();
	        }, {'exchID': entity.exchID, 'productID': '', 'productType': '', 'productStatus': ''});       
    	}else if(entity.grading == "2"){
    		getInstrumentByExchID(function (result) {
	            $scope.productDatas = {};
	            if(result !=undefined && result.length>0){
	            	for(var i=0;i<result.length;i++){
	            		result[i].productID = result[i].instrumentID;
	            		result[i].productName = result[i].instrumentName;
	            		if(result[i].productType != "2"){ //将非期权的productclass转化成1
	            			result[i].productType = "1";
	            		}
	            	}
	            	$scope.productDatas = result;
	                $scope.$apply();
	            }
	            $scope.gradingIsAll = false;
	            $scope.isInstrumentAll = false;
	            $scope.isInstrument= true;
	            $scope.$apply();    
	        }, {'exchID': entity.exchID, 'instrumentID': '', 'productType': '', 'productStat0us': ''});
    	}else if(entity.grading == "" || entity.grading == null){
    		getProductByExchID(function (resultp) {
    			getInstrumentByExchID(function (resulti) {
    				$scope.productDatas = {};
    	            if(resultp !=undefined && resultp.length>0){
    	            	$scope.productDatas = resultp;
    	            }
    	            if(resulti !=undefined && resulti.length>0){
    	            	for(var i=0;i<resulti.length;i++){
    	            		resulti[i].productID = resulti[i].instrumentID;
    	            		resulti[i].productName = resulti[i].instrumentName;
    	            		if(resulti[i].productType != "2"){ //将非期权的productclass转化成1
    	            			resulti[i].productType = "1";
    	            		}
    	            		$scope.productDatas.push(resulti[i]);
    	            	}
    	                $scope.$apply();
    	            }
    	            $scope.gradingIsAll = true;
    	            $scope.isInstrumentAll = false;
    	            $scope.isInstrument= false;
    	            $scope.$apply();
    			}, {'exchID': entity.exchID, 'instrumentID': '', 'productType': '', 'productStatus': ''});
    		}, {'exchID': entity.exchID, 'productID': '', 'productType': '', 'productStatus': ''});
    	}
    };
    
    $scope.changeProductTypeByIDForQuery = function(productID){
    	//控制是否为期权是否允许被修改
    	if(productID != "全部" && productID != null){
    		$scope.isInstrumentAll = true;
    	}else if(productID == "全部" || productID == null){
    		$scope.isInstrumentAll = false;
    	}
    	//为是否为期权赋值
    	if($scope.isInstrument == true || $scope.gradingIsAll == true){
    		for(var i=0;i<$scope.productDatas.length;i++){
    			if($scope.productDatas[i].productID == productID ){
    				if($scope.productDatas[i].productType == undefined || $scope.productDatas[i].productType == null || $scope.productDatas[i].productType == ""){
    					$scope.isInstrumentAll = false;
    					break;
    				}else{
    					$scope.queryFeeTemplateProductEntity.productType = $scope.productDatas[i].productType; 
    					break;
    				}
    			}
    		}
    	}
    }; 
    

    $scope.isOption = false;
    $scope.isInstrumentAdd = false;
    $scope.isSGEAdd = false;
    
    //根据交易所信息以及粒度初始化产品代码
    $scope.changeProductTypeForAdd = function (entity) {
    	if(entity.exchID == "SGE"){
    		$scope.isSGEAdd = true;
    		$scope.modalFeeTemplateProductEntity.grading = $scope.gradings[0].key;
    	}else{
    		$scope.isSGEAdd = false;
    	}
    	if(entity.grading == "1"){
	        getProductByExchID(function (result) {
	            $scope.productDatasAdd = {};
	            if(result !=undefined && result.length>0){
	            	$scope.productDatasAdd = result;
	            	$scope.modalFeeTemplateProductEntity.productID = $scope.productDatasAdd[0].productID;
	                $scope.$apply();
	            }
	            $scope.isInstrumentAdd= false;
	            $scope.modalFeeTemplateProductEntity.productType = $scope.ifOptions[0].key; 
	            $scope.$apply();
	        }, {'exchID': entity.exchID, 'productID': '', 'productType': '', 'productStatus': ''});
    	}else if(entity.grading == "2"){
    		getInstrumentByExchID(function (result) {
	            $scope.productDatasAdd = {};
	            if(result !=undefined && result.length>0){
	            	for(var i=0;i<result.length;i++){
	            		result[i].productID = result[i].instrumentID;
	            		result[i].productName = result[i].instrumentName;
	            		if(result[i].productType != "2"){ //将非期权的productclass转化成1
	            			result[i].productType = "1";
	            		}
	            	}
	            	$scope.productDatasAdd = result;
	            	$scope.modalFeeTemplateProductEntity.productID = $scope.productDatasAdd[0].productID;
		            $scope.modalFeeTemplateProductEntity.productType = $scope.productDatasAdd[0].productType;
		            if($scope.modalFeeTemplateProductEntity.productType == "2"){
		        		$scope.isOption= true;
		        	}else {
		        		$scope.isOption= false;
		        	}
	                $scope.$apply();
	            }          
	            $scope.isInstrumentAdd= true;
	            $scope.$apply();  
	        }, {'exchID': entity.exchID, 'instrumentID': '', 'productType': '', 'productStatus': ''});
    	}
    };
    
    //根据交易所信息以及粒度初始化产品代码并修改是否为期权
    $scope.changeProductForAdd = function (entity) {
    	if(entity.grading == "1"){
	        getProductByExchID(function (result) {
	            $scope.productDatasAdd = {};
	            if(result !=undefined && result.length>0){
	            	$scope.productDatasAdd = result;
	            	$scope.modalFeeTemplateProductEntity.productID = $scope.productDatasAdd[0].productID;
	               
	            }
	            $scope.isInstrumentAdd= false;
	            $scope.modalFeeTemplateProductEntity.productType = $scope.ifOptions[0].key; 
	            $scope.$apply();
	        }, {'exchID': entity.exchID, 'productID': '', 'productType': '', 'productStatus': ''});       
    	}else if(entity.grading == "2"){
    		getInstrumentByExchID(function (result) {
	            $scope.productDatasAdd = {};
	            if(result !=undefined && result.length>0){
	            	for(var i=0;i<result.length;i++){
	            		result[i].productID = result[i].instrumentID;
	            		result[i].productName = result[i].instrumentName;
	            		if(result[i].productType != "2"){ //将非期权的productclass转化成1
	            			result[i].productType = "1";
	            		}
	            	}
	            	$scope.productDatasAdd = result;
	            	$scope.modalFeeTemplateProductEntity.productID = $scope.productDatasAdd[0].productID;
		            $scope.modalFeeTemplateProductEntity.productType = $scope.productDatasAdd[0].productType;
		            if($scope.modalFeeTemplateProductEntity.productType == "2"){
		        		$scope.isOption= true;
		        	}else {
		        		$scope.isOption= false;
		        	}
	                $scope.$apply();
	            }
	            $scope.isInstrumentAdd= true;
	            $scope.$apply();    
	        }, {'exchID': entity.exchID, 'instrumentID': '', 'productType': '', 'productStat0us': ''});
    	}
    };
    
    $scope.changeProductTypeByIDForAdd = function(productID){
    	//为是否为期权赋值
    	if($scope.isInstrumentAdd == true){
    		for(var i=0;i<$scope.productDatasAdd.length;i++){
    			if($scope.productDatasAdd[i].productID == productID){
        			$scope.modalFeeTemplateProductEntity.productType = $scope.productDatasAdd[i].productType; 
    			}
    		}
    	}
    	if($scope.modalFeeTemplateProductEntity.productType == "2"){
    		$scope.isOption= true;
    	}else {
    		$scope.isOption= false;
    	}
    }; 
    
    $scope.changeProductTypes = function (productType) {
        //根据交易所ID查询产品信息
    	if(productType == "2"){
    		$scope.isOption= true;
    	}else {
    		$scope.isOption= false;
    	}
      
    };
    
	/*// modal根据所选交易所代码配置品种下拉列表
	$scope.setModalProductList = function() {
		$scope.modalProducts = [];
			var t=0;
			for(var i = 0; i < $scope.allProducts.length; i++){	//根据所选项获取品种列表数据
				if($scope.modalFeeTemplateProductEntity.exchID == $scope.allProducts[i].exchID){
					$scope.modalProducts[t] = angular.copy($scope.allProducts[i]);
					t=t+1;
				}
			}
			if(t > 0){
				$scope.modalFeeTemplateProductEntity.productID = $scope.modalProducts[0].productID;
			}else{
				$scope.tmpEntity = {};
				$scope.tmpEntity.productName = "无对应数据";
				$scope.tmpEntity.productID = "";
				$scope.modalProducts.push($scope.tmpEntity);
				$scope.modalFeeTemplateProductEntity.productID = $scope.modalProducts[0].productID;
			}
	};*/

	
	//转换交易所ID为名字
	function transExchName(text) {
		var count = $scope.allExchanges.length;
		for (var i = 0; i < count; i++) {
			if ($scope.allExchanges[i].exchID == text) {
				return $scope.allExchanges[i].exchName;
			}
		}
	}
	
	//转换模板ID为名字
	$scope.transTemplateName = function (text){
		var count = $scope.feeTemplateListEntitys.length;
		for (var i = 0; i < count; i++) {
			if ($scope.feeTemplateListEntitys[i].templateID == text) {
				return $scope.feeTemplateListEntitys[i].templateName;
			}
		}
	};
	
	//转换收取方式
	$scope.transReceiveType = function (key){
		var count = $scope.allReceiveType.length;
		for (var i = 0; i < count; i++) {
			if ($scope.allReceiveType[i].key == key) {
				return $scope.allReceiveType[i].text;
			}
		}
	};
	
	// 重置表单验证信息
	function formValidateReset1() {
		$scope.myForm1.templateName.$setPristine();
	}

	function formValidateReset2() {
		$scope.myForm2.exchID.$setPristine();
		$scope.myForm2.productID.$setPristine();
		$scope.myForm2.receiveType.$setPristine();
		$scope.myForm2.tradeFeeRate.$setPristine();
		$scope.myForm2.tradeFeeAmt.$setPristine();
		$scope.myForm2.offsetFeeRate.$setPristine();
		$scope.myForm2.offsetFeeAmt.$setPristine();
		$scope.myForm2.otFeeRate.$setPristine();
		$scope.myForm2.otFeeAmt.$setPristine();
	}
	
	// 新增modal
	$scope.initFeeTemplateParameter = function() {
		// 设置默认选中
		$scope.modalFeeTemplateEntity = {};
		formValidateReset1();
		$scope.isUpdate1 = false;
		getMaxFeeTemplateID(function(result){
			$scope.modalFeeTemplateEntity.templateID = result + 1;
		});
	};

	$scope.initFeeTemplateProductParameter = function(){
		$scope.modalFeeTemplateProductEntity = {};
		$scope.modalFeeTemplateProductEntity.exchID = $scope.queryExchanges[0].exchID;
        $scope.modalFeeTemplateProductEntity.grading = $scope.gradings[0].key;
        $scope.changeProductTypeForAdd({exchID:$scope.modalFeeTemplateProductEntity.exchID,grading:$scope.modalFeeTemplateProductEntity.grading});
		$scope.modalExchanges = $scope.allExchanges;
		$scope.modalProducts = [];
		formValidateReset2();
		$scope.modalFeeTemplateProductEntity.receiveType = $scope.allReceiveType[1].key;
		$scope.showMessages= "最终手续费率=设置值";
		$scope.showFlage="%%";
	    $scope.showAmt="";
		$scope.modalFeeTemplateProductEntity.saveType= false;
	    $scope.timesSelected = false;
		setDefaultValue();
		$scope.isUpdate2 = false;
		
	};
	
	// 修改modal
	$scope.initUpdateFeeTemplateParam = function(index, entity) {
		$scope.tempEntity1 = angular.copy(entity);
		$scope.tempEntity1.recordIndex = index;
		$scope.modalFeeTemplateEntity = angular.copy($scope.tempEntity1);
		formValidateReset1();
	
		$scope.isUpdate1 = true;
	};

	$scope.initUpdateFeeTemplateProductParam = function(index, entity) {
		
		CheckTemplateFeeByProductId(function(result){
			if(result == 1){
				getProductByExchID(function (result) {
		            $scope.productDatasAdd = {};
		            if(result !=undefined && result.length>0){
		            	$scope.productDatasAdd = result;
		                $scope.$apply();
		            }
		            $scope.isInstrumentAdd= false;
		            $scope.$apply(); 
		            $scope.tempEntity2 = angular.copy(entity);
		    		
		            //修改时，精度处理
		           
		            $scope.changeReceiveType($scope.tempEntity2.receiveType);
		            if($scope.tempEntity2.receiveType != "3"){
		            	 $scope.tempEntity2.tradeFeeRate = accMul($scope.tempEntity2.tradeFeeRate,10000).toFixed(4);
		            	 $scope.tempEntity2.offsetFeeRate = accMul($scope.tempEntity2.offsetFeeRate,10000).toFixed(4);
		                 $scope.tempEntity2.otFeeRate = accMul($scope.tempEntity2.otFeeRate,10000).toFixed(4);
		            	 $scope.tempEntity2.strikeFeeRate = accMul($scope.tempEntity2.strikeFeeRate,10000).toFixed(4);
		            }
		           
		            
		    		$scope.tempEntity2.recordIndex = index;
		    		$scope.modalExchanges = $scope.allExchanges;
		    		$scope.modalProducts = [];
		    		
		    		
		    		/*angular.forEach($scope.productDatasAdd, function(data, index, array) {
		    			if (data.exchID == entity.exchID) {
		    				$scope.modalProducts.push(array[index]);
		    			}
		    		});*/
		    		var productType =entity.productType;
		    		if(productType == 2){
		        		$scope.isOption= true;
		        	}else {
		        		$scope.isOption= false;
		        	}
		    		/* getProductByExchID(function (result) {
		    	        	if (result.length > 0) {
		    	                $scope.modalProducts = result;
		    	                $scope.$apply();
		    	            }

		    	        }, {'exchID': entity.exchId, 'productID': '', 'productType': productType, 'productStatus': ''});*/
		    		
		    		
		    		$scope.modalFeeTemplateProductEntity = angular.copy($scope.tempEntity2);
		    		$scope.modalFeeTemplateProductEntity.saveType= false;
		    	    $scope.timesSelected = false;
		    		formValidateReset2();
		    		$scope.isUpdate2 = true;
		    		$scope.$apply(); 
		        }, {'exchID': entity.exchID, 'productID': '', 'productType': '', 'productStatus': ''});
			}else if(result == 2){
				getInstrumentByExchID(function (result) {
		            $scope.productDatasAdd = {};
		            if(result !=undefined && result.length>0){
		            	for(var i=0;i<result.length;i++){
		            		result[i].productID = result[i].instrumentID;
		            		result[i].productName = result[i].instrumentName;
		            		if(result[i].productType != "2"){ //将非期权的productclass转化成1
		            			result[i].productType = "1";
		            		}
		            	}
		            	$scope.productDatasAdd = result;
		                $scope.$apply();
		            }          
		            $scope.isInstrumentAdd= true;
		            $scope.$apply();  
		            $scope.tempEntity2 = angular.copy(entity);
		    		
		            //修改时，精度处理
		           
		            $scope.changeReceiveType($scope.tempEntity2.receiveType);
		            if($scope.tempEntity2.receiveType != "3"){
		            	 $scope.tempEntity2.tradeFeeRate = accMul($scope.tempEntity2.tradeFeeRate,10000).toFixed(4);
		            	 $scope.tempEntity2.offsetFeeRate = accMul($scope.tempEntity2.offsetFeeRate,10000).toFixed(4);
		                 $scope.tempEntity2.otFeeRate = accMul($scope.tempEntity2.otFeeRate,10000).toFixed(4);
		            	 $scope.tempEntity2.strikeFeeRate = accMul($scope.tempEntity2.strikeFeeRate,10000).toFixed(4);
		            }
		           
		            
		    		$scope.tempEntity2.recordIndex = index;
		    		$scope.modalExchanges = $scope.allExchanges;
		    		$scope.modalProducts = [];
		    		
		    		
		    		/*angular.forEach($scope.productDatasAdd, function(data, index, array) {
		    			if (data.exchID == entity.exchID) {
		    				$scope.modalProducts.push(array[index]);
		    			}
		    		});*/
		    		var productType =entity.productType;
		    		if(productType == 2){
		        		$scope.isOption= true;
		        	}else {
		        		$scope.isOption= false;
		        	}
		    		/* getProductByExchID(function (result) {
		    	        	if (result.length > 0) {
		    	                $scope.modalProducts = result;
		    	                $scope.$apply();
		    	            }

		    	        }, {'exchID': entity.exchId, 'productID': '', 'productType': productType, 'productStatus': ''});*/
		    		
		    		
		    		$scope.modalFeeTemplateProductEntity = angular.copy($scope.tempEntity2);
		    		$scope.modalFeeTemplateProductEntity.saveType= false;
		    	    $scope.timesSelected = false;
		    		formValidateReset2();
		    		$scope.isUpdate2 = true;
		    		$scope.$apply(); 
		        }, {'exchID': entity.exchID, 'instrumentID': '', 'productType': '', 'productStatus': ''});
			}
		},entity);
		
	};
	/**
     * 设置默认值
     */
    function setDefaultValue() {
        $scope.modalFeeTemplateProductEntity.tradeFeeRate=0;
        $scope.modalFeeTemplateProductEntity.tradeFeeAmt=0;
        $scope.modalFeeTemplateProductEntity.offsetFeeRate=0;
        $scope.modalFeeTemplateProductEntity.offsetFeeAmt=0;
        $scope.modalFeeTemplateProductEntity.otFeeRate=0;
        $scope.modalFeeTemplateProductEntity.otFeeAmt=0;
        $scope.modalFeeTemplateProductEntity.strikeFeeRate=0;
        $scope.modalFeeTemplateProductEntity.strikeFeeAmt=0;
    }

	
	// 新增模板信息
	$scope.saveFeeTemplate = function(entity) {
		var index = entity.recordIndex;
		var tableIndex = entity.index;
		// 增加
		if (index == undefined) {
			// 判断模板名称是否重复
			checkFeeTemplate(function(fresult) {
				if (fresult != null && fresult.length > 0) {
					layer.msg("模板名称已存在，请重新输入", {
						icon : 2,
						time : 3000
					});
					return false;
				} else {
					saveFeeTemplate(function(result) {
						if(result != null){
							layer.msg("新增成功",{icon: 1});
							$scope.feeTemplateListEntitys.unshift(result);
							$scope.queryFeeTemplateEntitys = angular
									.copy($scope.feeTemplateListEntitys);
							$scope.find1({});
							$scope.$apply();
							// 关闭窗口
							$("#feeTemplateModal").modal("hide");
						}else{
							layer.msg("新增失败",{icon: 2});
						}
					}, entity);
				}
			}, {
				templateName : entity.templateName
			});
			// 修改
		} else {
			checkFeeTemplate(function(fresult) {
				if (fresult != null && fresult.length > 0 && 
						fresult[0].templateName != $scope.feeTemplateListEntitys[tableIndex-1].templateName) {
					layer.msg("模板名称已存在，请重新输入", {
						icon : 2,
						time : 3000
					});
					return false;
				}else{
					updateFeeTemplate(function(result) {
						if(result != null){
							
							result.index = tableIndex;
			        		$scope.feeTemplateListEntitys.splice(tableIndex-1, 1, result); 
			        		
			        		$scope.feeTemplateTable.cells().every( function () {
			                    if((tableIndex-1) == this[0][0].row){
			                        if(this[0][0].column == 3){
			                            this.data(entity.templateName);
			                            $scope.$apply();
			                        }
			                    }

			        		});
							//$scope.$apply();
							//$scope.find1({});
							// 关闭窗口
							$("#feeTemplateModal").modal("hide");
							layer.msg("修改成功",{icon: 1});
						}else{
							layer.msg("修改失败",{icon: 2});
						}
					}, entity);
				}
			}, {
				templateName : entity.templateName
			});
		}
	};
	
	
	// 新增手续费模板品种
	$scope.saveFeeTemplateProduct = function(entity) {
		var index = entity.recordIndex;
		var tableIndex = entity.index;
		entity.templateID = $scope.templateID;
		
        $scope.tmpSaveEntity = {};
        $scope.tmpSaveEntity = angular.copy(entity);
        
        //精度处理
        if($scope.tmpSaveEntity.receiveType !="3"){
        	 $scope.tmpSaveEntity.tradeFeeRate = accDiv($scope.tmpSaveEntity.tradeFeeRate,10000).toString();
        	 $scope.tmpSaveEntity.offsetFeeRate = accDiv($scope.tmpSaveEntity.offsetFeeRate,10000).toString();
             $scope.tmpSaveEntity.otFeeRate = accDiv($scope.tmpSaveEntity.otFeeRate,10000).toString();
        	 $scope.tmpSaveEntity.strikeFeeRate = accDiv($scope.tmpSaveEntity.strikeFeeRate,10000).toString();
        }
		// 增加
		if (index == undefined) {
			// 判断模板代码是否重复
			findFeeTemplateProduct(function(result) {
				if (result.length > 0) {
					layer.msg("交易所代码与品种代码已存在，请重新选择", {
						icon : 2,
						time : 3000
					});
					return false;
				} else {
					$scope.tmpSaveEntity.settleFeeRate="0";
					$scope.tmpSaveEntity.settleFeeAmt="0";
					$scope.tmpSaveEntity.delivFeeRate="0";
					$scope.tmpSaveEntity.delivFeeAmt="0";
					if( $scope.tmpSaveEntity.productType == 1){
						$scope.tmpSaveEntity.strikeFeeRate="0";
						$scope.tmpSaveEntity.strikeFeeAmt="0";
					}
					saveFeeTemplateProduct(function(result) {
						if(result != undefined){
							$scope.feeTemplateProductListEntitys.unshift(result);
							$scope.queryFeeTemplateProductEntitys = angular
									.copy($scope.feeTemplateProductListEntitys);
							$scope.$apply();
							$scope.find2({templateID: entity.templateID, productType: $scope.queryFeeTemplateProductEntity.productType, grading: $scope.queryFeeTemplateProductEntity.grading,
						    	exchID: $scope.queryFeeTemplateProductEntity.exchID, productID: $scope.queryFeeTemplateProductEntity.productID});
							// 关闭窗口
							$("#feeTemplateProductModal").modal("hide");
						}

					}, $scope.tmpSaveEntity);
				}
			}, {
				exchID : $scope.tmpSaveEntity.exchID,
				productID: $scope.tmpSaveEntity.productID,
				productType: $scope.tmpSaveEntity.productType,
				templateID: $scope.tmpSaveEntity.templateID
			});
			// 修改
		} else {
			updateFeeTemplateProduct(function(result) {
				if(result != null){
					result.index = tableIndex;
	        		$scope.feeTemplateProductListEntitys.splice(tableIndex-1, 1, result); 
					
					$scope.feeTemplateProductTable.cells().every( function () {
	                    if((tableIndex-1) == this[0][0].row){
	                        if(this[0][0].column == 3){
	                            this.data($scope.transTemplateName(entity.templateID));
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 8){
	                            this.data(scientificToNumber($scope.tmpSaveEntity.tradeFeeRate));
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 9){
	                            this.data((+entity.tradeFeeAmt).toFixed(3));
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 10){
	                            this.data(scientificToNumber($scope.tmpSaveEntity.offsetFeeRate));
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 11){
	                            this.data((+entity.offsetFeeAmt).toFixed(3));
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 12){
	                            this.data(scientificToNumber($scope.tmpSaveEntity.otFeeRate));
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 13){
	                            this.data((+entity.otFeeAmt).toFixed(3));
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 14){
	                            this.data(scientificToNumber($scope.tmpSaveEntity.strikeFeeRate));
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 15){
	                            this.data((+entity.strikeFeeAmt).toFixed(3));
	                            $scope.$apply();
	                        }
	                    }

					});
					//$scope.$apply();
					//$scope.find2({});
					// 关闭窗口
					$("#feeTemplateProductModal").modal("hide");
					layer.msg("修改成功",{icon: 1});
				}else{
					layer.msg("修改失败",{icon: 2});
				}
			}, $scope.tmpSaveEntity);
		}
	};

	// 删除模板记录
	$scope.removeFeeTemplate = function(index, entity) {
		// 使用内置Index
		// 校验是否存在客户资金账号对应此模板代码
		
		findSubAccountTemplateByCondition(function (satResult) {
			if (satResult.length > 0) {
				layer.confirm('存在账号对应此模板，是否确定删除？', {
					icon : 3
				}, function(count) {
					deleteFeeTemplate(function(result) {
						findFeeTemplateProduct(function (product){
							deleteFeeTemplateProductListByTID(product);
							deleteSubAccountTemplateItem(satResult);
							$scope.feeTemplateListEntitys = result;
							layer.close(count);
							$scope.find1({});
							$scope.queryFeeTemplateEntitys = angular
									.copy($scope.feeTemplateListEntitys);
							$scope.feeTemplateProductListEntitys = [];
							$scope.notGetTemplateID = true;
							$timeout(function() {
								$scope.find1({});
							    $scope.find2({templateID: entity.templateID});$scope.find();//对应方法
						     }, 500);
							layer.msg("删除成功",{icon: 1});
							$scope.$apply();
						},{
							templateID: entity.templateID
						});
					}, entity);
				});
			}else{
				layer.confirm('确定删除？', {
					icon : 3
				}, function(count) {
					deleteFeeTemplate(function(result) {
						findFeeTemplateProduct(function (product){
							deleteFeeTemplateProductListByTID(product);
							$scope.feeTemplateListEntitys = result;
							layer.close(count);
							$scope.queryFeeTemplateEntitys = angular.copy($scope.feeTemplateListEntitys);
							$scope.feeTemplateProductListEntitys = [];
							$scope.notGetTemplateID = true;
							layer.msg("删除成功",{icon: 1});
							$timeout(function() {
								$scope.find1({});
							    $scope.find2({templateID: entity.templateID});$scope.find();//对应方法
						     }, 500);
							$scope.$apply();
						},{
							templateID: entity.templateID
						});
					}, entity);
				});
			}
		},{
			templateID: entity.templateID,
			templateType: "2"
			});
	};

	//删除模板品种手续费
	$scope.removeFeeTemplateProduct = function(index, entity) {
		// 使用内置Index
		// 校验是否存在客户资金账号对应此模板代码
		$scope.tmpArray = new Array();
		$scope.tmpArray.push(entity);
		layer.confirm('确定删除？', {
			icon : 3
		}, function(count) {
			deleteFeeTemplateProductList(function(result) {
				$scope.feeTemplateProductListEntitys = result;
				layer.close(count);
				$scope.find2({templateID: entity.templateID, productType: $scope.queryFeeTemplateProductEntity.productType, grading: $scope.queryFeeTemplateProductEntity.grading,
			    	exchID: $scope.queryFeeTemplateProductEntity.exchID, productID: $scope.queryFeeTemplateProductEntity.productID});
				layer.msg("删除成功",{icon: 1});
				$scope.queryFeeTemplateProductEntitys = angular
						.copy($scope.feeTemplateProductListEntitys);
				$scope.$apply();
			}, $scope.tmpArray);
		});
	};
	
	//批量删除模板品种手续费
	$scope.delProductList = function() {
		
		$scope.delLists = $scope.getRemoveEntitys();
		// 使用内置Index
		// 校验是否存在客户资金账号对应此模板代码
		if($scope.delLists.length > 0){
			layer.confirm('确定批量删除？', {
				icon : 3
			}, function(count) {
				deleteFeeTemplateProductList(function(result) {
					$scope.feeTemplateProductListEntitys = result;
					layer.close(count);
					$scope.queryFeeTemplateProductEntitys = angular
							.copy($scope.feeTemplateProductListEntitys);
					layer.msg("删除信息成功", {
						icon : 1
					});
					$scope.find2({templateID: $scope.templateID, productType: $scope.queryFeeTemplateProductEntity.productType, grading: $scope.queryFeeTemplateProductEntity.grading,
				    	exchID: $scope.queryFeeTemplateProductEntity.exchID, productID: $scope.queryFeeTemplateProductEntity.productID});
					$scope.delLists = [];
					$scope.isSelected = false;
					$scope.$apply();
				}, $scope.delLists);
			});
		}else{
			layer.msg('请选择要删除的手续费模板品种信息', {
				icon : 2
			});
		}
	};
	
	    /*$scope.changeProductTypeForQuery = function (exchId) {  	
	    	$scope.queryProducts = {};
	        getProductByExchID(function (result) {
	            $scope.queryProducts = {};
	            if(result !=undefined && result.length>0){
	            	$scope.queryProducts = result;
	                $scope.$apply();
	            }

	        }, {'exchID': exchId, 'productID': '', 'productType': '', 'productStatus': ''});
	    };*/
	    /*$scope.changeProductType = function (exchId) {
	        //根据交易所ID查询产品信息

	        $scope.modalFeeTemplateProductEntity.productID = "";
	        $scope.modalProducts=[];
	        getProductByExchID(function (result) {
	        	if (result.length > 0) {
	                $scope.modalProducts = result;
	                $scope.modalFeeTemplateProductEntity.productID = $scope.modalProducts[0].productID;
	                $scope.$apply();
	            }

	        }, {'exchID': exchId, 'productID': '', 'productStatus': ''});
	    };*/
	    /*$scope.changeProductTypes = function (productType) {
	        //根据交易所ID查询产品信息
	    	if(productType == 2){
	    		$scope.isOption= true;
	    	}else {
	    		$scope.isOption= false;
	    	}
	    };*/
	    
	    /*	// 根据页面条件查询
	$scope.find1 = function(object) {
		$scope.isQuery = true;
		$scope.feeTemplateListEntitys = {};
		findFeeTemplate(function(result) {
			$scope.feeTemplateListEntitys = result;
			$timeout(function() {
				$scope.isQuery = false;
			}, 1000);
		}, object);
	};*/
	    
/*    //表格中修改的单击事件
    $("body").delegate("#feeTemplate-table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.feeTemplateTable.row(mytr).data();
    	$scope.selectedTemplateName = tempArr[0];
        $scope.notGetTemplateID = false;
        $scope.$apply();
    })*/    
	$("body").undelegate("#feeTemplate-table_wrapper tr","click");  
    $("body").delegate("#feeTemplate-table_wrapper tr","click",function(){
    	var mytr = $(this);
        var td = mytr.find("td");//找到td元素
        $scope.selectedTemplateName = td[1].innerHTML; //alert(td[0].innerHTML);//指定下标即可
        $scope.notGetTemplateID = false; 
        $scope.templateID = $scope.getTemplateID($scope.selectedTemplateName);
        $scope.find2({templateID:$scope.templateID});
        $scope.$apply();
    })
    
    //获取templateID
    $scope.getTemplateID = function(templateName){
    	var result = "";
        for(var i = 0;i<$scope.feeTemplateListEntitys.length;i++){
        	if(templateName==$scope.feeTemplateListEntitys[i].templateName){
        		result = $scope.feeTemplateListEntitys[i].templateID;
        	}
        }
        return result;
    }
    $("body").undelegate("#feeTemplate-table td .update-row","click");
    //表格中修改的单击事件
    $("body").delegate("#feeTemplate-table td .update-row","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.feeTemplateTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.feeTemplateListEntitys.length;i++){
        	if(id==$scope.feeTemplateListEntitys[i].id){
        		$scope.modalEntity = $scope.feeTemplateListEntitys[i];
        	}
        }
        $scope.initUpdateFeeTemplateParam(id,$scope.modalEntity);
        $scope.$apply();
    });
    $("body").undelegate("#feeTemplate-table td .delete-row","click");
    //表格中删除的单击事件
    $("body").delegate("#feeTemplate-table td .delete-row","click",function(){
    	$scope.modalEntity = {};
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.feeTemplateTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.feeTemplateListEntitys.length;i++){
        	if(id==$scope.feeTemplateListEntitys[i].id){
        		$scope.modalEntity = $scope.feeTemplateListEntitys[i];
        	}
        }
        $scope.removeFeeTemplate(id,$scope.modalEntity);
    });
    
	    
	    
	// 查询(前台分页)
    $scope.find1 = function(result){
    	$scope.notGetTemplateID = true;
    	$scope.removeTable2({});
    	$scope.isQuery = true;
		$scope.feeTemplateListEntitys = {};
    	//更新表格对应的数据集
		findFeeTemplate(function (result) {
    		//将数据集赋值为空
	    	$scope.feeTemplateDataset = [];
    		$scope.feeTemplateListEntitys = result;
    		var con = result;
            for(var i = 0; i<con.length;i++){
            	var operate1 = $scope.getTempUpdate($scope.feeTemplate_temp_update);
            	var operate2 = $scope.getTempDelete($scope.feeTemplate_temp_delete);
                var tempArr = [(i+1),con[i].id,con[i].templateID,con[i].templateName,operate1+operate2];
	            $scope.feeTemplateDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.feeTemplateListEntitys = con;
        	//重新绘表
            $scope.feeTemplateTable.clear().draw();
            $scope.feeTemplateTable.rows.add($scope.feeTemplateDataset).draw();
            $timeout(function() {
				$scope.isQuery = false;
			}, 1000);
        }, result);  	
    }
    
    $timeout(function() {
    	$scope.find1($scope.queryFeeTemplateEntity);
    }, 1000);
    
    $scope.getTempUpdate = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='update-row' data-toggle='modal' data-target='#feeTemplateModal'>修改</a>";
    	}
    	return result;
    }
    
    $scope.getTempDelete = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='delete-row'>删除</a>";
    	}
    	return result;
    }
    
/*	$scope.find2 = function(object) {
		$scope.isQuery = true;
		$scope.feeTemplateProductListEntitys = [];
		object.templateID = $scope.templateID;
		findFeeTemplateProduct(function(result) {
			$scope.feeTemplateProductListEntitys = result;
			$timeout(function() {
				$scope.isQuery = false;
			}, 1000);
		}, object);
	};*/
    $("body").undelegate("#feeTemplateProduct-table td .my-update","click");
    //表格中修改的单击事件
    $("body").delegate("#feeTemplateProduct-table td .my-update","click",function(){
    	var mytr = $(this).parents("tr");
    	$scope.modalEntity = {};
        var tempArr = $scope.feeTemplateProductTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.feeTemplateProductListEntitys.length;i++){
        	if(id==$scope.feeTemplateProductListEntitys[i].id){
        		$scope.modalEntity = $scope.feeTemplateProductListEntitys[i];
        	}
        }
        $scope.isUpdate = true;
        $scope.initUpdateFeeTemplateProductParam(id,$scope.modalEntity);
        $scope.$apply();
    });
    $("body").undelegate("#feeTemplateProduct-table td .my-set","click");
    //表格中删除的单击事件
    $("body").delegate("#feeTemplateProduct-table td .my-set","click",function(){
    	var mytr = $(this).parents("tr");
    	$scope.modalEntity = {};
        var tempArr = $scope.feeTemplateProductTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.feeTemplateProductListEntitys.length;i++){
        	if(id==$scope.feeTemplateProductListEntitys[i].id){
        		$scope.modalEntity = $scope.feeTemplateProductListEntitys[i];
        	}
        }
        $scope.isUpdate = true;
        $scope.removeFeeTemplateProduct(id,$scope.modalEntity);
    });
    
    //  全选与反选  angularjs table 
    $scope.selectAll = function(){
 	   if($("#memberBroker_SelectAll").is(':checked')){
 		   $("#feeTemplateProduct-table input[type='checkbox']").each( function() {
 			   $(this).prop('checked', true);
 			  }); 
 	   }else{
           $("#feeTemplateProduct-table input[type='checkbox']").each( function() {
               $(this).prop('checked', false);
           });
       }
    };
    $("body").undelegate("#feeTemplateProduct-table .sorting_1 a","click");
    $("body").delegate("#feeTemplateProduct-table .sorting_1 a","click",function(){
        debugger
        if($(this).hasClass("click-choice-one")){
            $(this).removeClass("click-choice-one");
            $(this).addClass("clicked-choice-one");
        }
        else{
            $(this).addClass("click-choice-one");
            $(this).removeClass("clicked-choice-one");
        }

    });
    $("body").undelegate(".dataTables_scrollHeadInner th a","click");
    $("body").delegate(".dataTables_scrollHeadInner th a","click",function(){
        debugger
        if($(this).hasClass("click-choice-all")){
            $(this).removeClass("click-choice-all");
            $(this).addClass("clicked-choice-all");
            for(var i=0;i<$(".dataTables_scrollBody td a").length;i++){
                if($($(".dataTables_scrollBody td a")[i]).hasClass("click-choice-one")){
                    $($(".dataTables_scrollBody td a")[i]).removeClass("click-choice-one");
                    $($(".dataTables_scrollBody td a")[i]).addClass("clicked-choice-one");
                }
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
        }

    });
    
    //获取需要删除的集合
	$scope.getRemoveEntitys = function(){
			var tmpEntitys = [];
			//复选框选中列ID
	  	  	$scope.ids = new Array();
	  	  	$("#feeTemplateProduct-table a").each(function(){
	  	  		var flag = $(this).hasClass("clicked-choice-one");
			  	  		if(flag){
				  	  		var mytr = $(this).parents("tr");
					        var tempArr = $scope.feeTemplateProductTable.row(mytr).data();
					        var id = tempArr[1];//获取该行对应的id
					  	  	$scope.ids.push(id);
			  	  	    }
	          });
	  	      for(var i=0;i<$scope.feeTemplateProductListEntitys.length;i++){
					for(var j=0;j<$scope.ids.length;j++){
						if($scope.feeTemplateProductListEntitys[i].id==$scope.ids[j]){
							tmpEntitys.push($scope.feeTemplateProductListEntitys[i]);
						}
					}
			  }		
			  return tmpEntitys;
	}
    
    
    $scope.find2 = function(result){
    	$scope.isQuery = true;
		$scope.feeTemplateProductListEntitys = [];
		result.templateID = $scope.templateID;
    	//更新表格对应的数据集
		findFeeTemplateProduct(function (result) {
    		//将数据集赋值为空
	    	$scope.feeTemplateProductDataset = [];
    		var con = result;
    		$scope.feeTemplateProductListEntitys = result;
            for(var i = 0; i<con.length;i++){
            	var value = "";
            	if(con[i].incomeType != 0){
            		value =con[i].setValue;
            	}
            	var operate1 = $scope.getFeeUpdate($scope.feeTemplate_fee_update);
            	var operate2 = $scope.getFeeDelete($scope.feeTemplate_fee_delete);
                var tempArr = ["<a class='click-choice-one'>",con[i].id,con[i].templateID,$scope.transTemplateName(con[i].templateID),con[i].exchID,$scope.transProductType(con[i].productType)
                              	,con[i].productID,$scope.transReceiveType(con[i].receiveType),con[i].tradeFeeRateStr,con[i].tradeFeeAmt.toFixed(3),con[i].offsetFeeRateStr,con[i].offsetFeeAmt.toFixed(3)
                            	,con[i].otFeeRateStr,con[i].otFeeAmt.toFixed(3),con[i].strikeFeeRateStr,con[i].strikeFeeAmt.toFixed(3),operate1+operate2];
	            $scope.feeTemplateProductDataset.push(tempArr);
	            con[i].index = i+1;
            }
        	//重新绘表
            $scope.feeTemplateProductListEntitys = con;
            $scope.feeTemplateProductTable.clear().draw();
            $scope.feeTemplateProductTable.rows.add($scope.feeTemplateProductDataset).draw();
            $timeout(function() {
				$scope.isQuery = false;
			}, 1000);
		}, result);  	
    }
    $scope.removeTable2 = function(result){
		findFeeTemplateProduct(function (result) {
    		
            $scope.feeTemplateProductTable.clear().draw();
           
		}, result);  	
    }
    $scope.getFeeUpdate = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='my-update' data-toggle='modal' data-target='#feeTemplateProductModal'>修改</a>";
    	}
    	return result;
    }
    
    $scope.getFeeDelete = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='my-set'>删除</a>";
    	}
    	return result;
    }
    
    $scope.find1({});
	    
	    $scope.showFlage="%%";
	    $scope.showAmt="";
		$scope.timesSelected=false;
	    $scope.changeReceiveType = function (receiveType) {
	    	if(receiveType == 3){
	    		$scope.timesSelected=true;
	    		$scope.showFlage = "倍";
	    		$scope.showAmt = "倍";
	    		$scope.showMessages= "最终手续费率=默认手续费率*设置值";
	    	} else if(receiveType == 2) {
	    		$scope.showFlage="%%";
	    	    $scope.showAmt="";
	    	    $scope.timesSelected=false;
	    	    $scope.showMessages= "最终手续费率=设置值";
	    	} else if(receiveType == 1) {
		    		$scope.showFlage="%%";
		    	    $scope.showAmt="";
		    	    $scope.timesSelected=false;
		    	    $scope.showMessages= "最终手续费率=默认手续费率+设置值";
		    	}
	    };

/*	$scope.find2 = function(object) {
		$scope.isQuery = true;
		$scope.feeTemplateProductListEntitys = [];
		object.templateID = $scope.templateID;
		findFeeTemplateProduct(function(result) {
			$scope.feeTemplateProductListEntitys = result;
			$timeout(function() {
				$scope.isQuery = false;
			}, 1000);
		}, object);
	};*/

	
    $scope.transProductType  = function (tradeType){
    	if(tradeType==null || tradeType==undefined){
    		return "";
    	}else{
    		for(var i = 0;i < $scope.ifOptions.length;i++){
    			if($scope.ifOptions[i].key == tradeType){
    				return $scope.ifOptions[i].text;
    			}
    		}	
    	}
    }
	//---------------------复制模板---------------------------------------
	$scope.newCopyTemplateName = "";	//复制的新模板名称
	// 初始化复制模态框
	$scope.initCopyFeeTemplate = function(){
		$scope.copyForm.newCopyTemplateName.$setPristine();
		$scope.newCopyTemplateName = "";
	}
	
	$scope.copy = function(newTemplateName){
		checkFeeTemplate(function(result){
			if(result != null && result.length > 0){
				layer.msg("不允许复制到已有模板",{icon: 2});
				return false;
			}else{
				// 新增模板
				getMaxFeeTemplateID(function(tempID){
					
					saveFeeTemplate(function(result) {
						if(result != null){
							$scope.feeTemplateListEntitys.unshift(result);
							$scope.queryFeeTemplateEntitys = angular.copy($scope.feeTemplateListEntitys);
							$scope.$apply();
							copyFeeTemplateProduct(function(msg){
								if(msg == 1){
									layer.msg("复制成功",{icon: 1});
									// 关闭窗口
									$scope.find1({});
									$("#feeTemplateCopyModal").modal("hide");
								}else{
									layer.msg("复制数据失败",{icon: 2});
								}
							},$scope.templateID,result.templateID);
							
						}else{
							layer.msg("建立新模板失败",{icon: 2});
							return false;
						}
					}, {
						templateID: tempID + 1,
						templateName: $scope.newCopyTemplateName
					});
				});
				
			}
		},{
			templateName: $scope.newCopyTemplateName
		});
	}
	
	$scope.tmpExportQuery = {};
    //导出excel
    $scope.exportExcel = function () {
    	$scope.tmpExportQuery.templateID = angular.copy($scope.templateID);
    	framework.file.export("手续费模板费率查询.xls",'excel',{
			entityKey:['templateName','exchID','productType','productID','receiveType','tradeFeeRateStr','tradeFeeAmt','offsetFeeRateStr','offsetFeeAmt','otFeeRateStr','otFeeAmt','strikeFeeRateStr','strikeFeeAmt'],
			headerKey:['模板名称','交易所代码','是否为期权','品种/合约代码','收取方式','开仓按金额','开仓按手数','平仓按金额','平仓按手数','平今按金额','平今按手数','行权按金额','行权按手数'],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
			title:"手续费模板费率导出数据",
			dicMap:{receiveType:{'1':"相对默认收取",'2':"绝对收取",'3':"倍数收取"},
				productType:{'1':"否",'2':"是"}
			}
		},"feeTemplateProductService", "exportByCondition", $scope.tmpExportQuery);
    };
    
    //导入
    $("#feeTemplateUploader").uploadFile({
    	  dragdropWidth: 125,
          uploadStr:"Excel导入",
          dragDropStr: "",
          showAbort: false,
          dragDropContainerClass:"",
        url: framework.file.uploadUrl("feeTemplateProductService", "uploadExcel", [null]),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(errCode != 0) {
                    layer.msg(errMsg,{icon: 2});
                } else {
                	if(result != null){
                		if(result.code == '1'){
                			layer.msg("成功导入"+result.info+"条记录！", {icon: 1, time: 1500});
                			findFeeTemplateProduct(function (result) {
                	            $scope.feeTemplateProductListEntitys = result;
                	            $scope.$apply();
                	            $scope.find2({templateID: $scope.templateID, productType: $scope.queryFeeTemplateProductEntity.productType, grading: $scope.queryFeeTemplateProductEntity.grading,
    						    	exchID: $scope.queryFeeTemplateProductEntity.exchID, productID: $scope.queryFeeTemplateProductEntity.productID});
                	            $("#feeTemplateUploadModal").modal("hide");
                	        }, {
            					templateID: $scope.templateID
            				});
                		}else if(result.code == '0'){
                			layer.msg(result.info, {icon: 2, time: 3000});
                		}
    				}else{
    					//导入失败
    					layer.msg(result.errorMes, {icon: 2, time: 1500});
    				}
                }
                $("div .ajax-file-upload-container").empty();
            });
        },
        onSelect: function (files) {
            var file = files[0];
            var fileName = file.name;
            var suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
            if(suffix != "xls" ){
                layer.msg('上传文件必须为.xls文件格式', {icon: 2}, 3000);
                return false;
            }
            this.url = framework.file.uploadUrl("feeTemplateProductService", "uploadExcel", [$scope.templateID, $scope.selectedTemplateName, null])
            return true;
        }
    });
    
    
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.feeTemplateTable = $('#feeTemplate-table').DataTable( {
    		data : $scope.feeTemplateDataset,
        	columns :$scope.feeTemplate_columns,
            dom: 'rt<"bottom"iplB>',
      /*      fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },*/
    		buttons: []
            } );
   
        $scope.feeTemplateProductTable = $('#feeTemplateProduct-table').DataTable( {
    		data : $scope.feeTemplateProductDataset,
        	columns :$scope.feeTemplateProduct_columns,
            dom: 'rt<"bottom"iplB>',
            /*fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },*/
			buttons: [
			    
			]
        } );
    });
	
});
