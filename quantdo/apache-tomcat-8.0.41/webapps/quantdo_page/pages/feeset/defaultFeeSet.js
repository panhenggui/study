myapp.controller('DefaultFeeSetController', function ($scope, $timeout,$rootScope) {
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //初始化页面信息
    getAllDefaultFeeSetEntity(function (result) {
        $scope.listEntitys = result;
    	$scope.$apply();
    });

    $scope.queryEntity = {};
    $scope.ModalEntity = {};
    $scope.canClick=false;
	$scope.DefaultFeeSetDataset = [];
	
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	
	$scope.defaultFeeSet_query = isShow("defaultFeeSet_query");
	$scope.defaultFeeSet_outexcel = isShow("defaultFeeSet_outexcel");
	$scope.defaultFeeSet_add = isShow("defaultFeeSet_add");
	$scope.defaultFeeSet_in = isShow("defaultFeeSet_in");
	$scope.defaultFeeSet_update = isShow("defaultFeeSet_update");
	$scope.defaultFeeSet_delete = isShow("defaultFeeSet_delete");
	
	
	//定义固定列头
    $scope.DefaultFeeSet_columns = [
        {title: "序号"},
        {title:"id",visible:false},
        {title: "交易所代码"},
        {title: "是否为期权"},
        {title: "品种/合约代码"},
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
    
    
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    	$scope.$apply();
    });

    //初始化新增时所有产品信息并默人选中第一项
    getAllProductEntity(function (result) {
        //$scope.productDatas = result;
        $scope.productDatasAdd = result;
    	$scope.$apply();
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
    /*$timeout(function() {
    	$scope.queryEntity.grading = $scope.gradings[0].key;
    },500);*/
    
    //$scope.productTypes = clearConstant.productTypes;
    $scope.gradingIsAll = true;
    //是否为期权
    $scope.ifOptions = [
        {text: '否', key: '1'},
        {text: '是', key: '2'}
    ];
    /*$timeout(function() {
        $scope.queryEntity.productType = $scope.ifOptions[0].key; 
    },500);*/
    
    $scope.isInstrument = false;
    $scope.isInstrumentAll = false;
    $scope.isSGE = false;
    
    //根据交易所信息以及粒度初始化产品代码
    $scope.changeProductTypeForQuery = function (entity) {
    	if(entity.exchID == "SGE"){
    		$scope.isSGE = true;
    		$scope.queryEntity.grading = $scope.gradings[0].key;
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
	            //$scope.queryEntity.productType = $scope.ifOptions[0].key; 
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
	            //$scope.queryEntity.productType = $scope.ifOptions[0].key; 
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
    	if(productID != "全部" && productID != null ){
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
    					$scope.queryEntity.productType = $scope.productDatas[i].productType; 
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
    		$scope.ModalEntity.grading = $scope.gradings[0].key;
    	}else{
    		$scope.isSGEAdd = false;
    	}
    	if(entity.grading == "1"){
	        getProductByExchID(function (result) {
	            $scope.productDatasAdd = {};
	            if(result !=undefined && result.length>0){
	            	$scope.productDatasAdd = result;
	            	$scope.ModalEntity.productID = $scope.productDatasAdd[0].productID;
	                $scope.$apply();
	            }
	            $scope.isInstrumentAdd= false;
	            $scope.ModalEntity.productType = $scope.ifOptions[0].key; 
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
	            	$scope.ModalEntity.productID = $scope.productDatasAdd[0].productID;
		            $scope.ModalEntity.productType = $scope.productDatasAdd[0].productType;
		            if($scope.ModalEntity.productType == "2"){
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
	            	$scope.ModalEntity.productID = $scope.productDatasAdd[0].productID;
	                $scope.$apply();
	            }
	            $scope.isInstrumentAdd= false;
	            $scope.ModalEntity.productType = $scope.ifOptions[0].key; 
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
	            	$scope.ModalEntity.productID = $scope.productDatasAdd[0].productID;
		            $scope.ModalEntity.productType = $scope.productDatasAdd[0].productType;
		            if($scope.ModalEntity.productType == "2"){
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
        			$scope.ModalEntity.productType = $scope.productDatasAdd[i].productType; 
    			}
    		}
    	}
    	if($scope.ModalEntity.productType == "2"){
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

    /*$scope.changeProductTypeForQueryId = function (exchId,productID) {
    	
        getProductByExchID(function (result) {
            $scope.oldProductDatas = $scope.productDatas;
            $scope.productDatas = {};
            $scope.productTypes = [];
            var productTypesArr = new Array();
            if(result !=undefined && result.length>0){
            	$scope.productDatas = result;
            	for(var i=0;i<result.length;i++){
            		if(productTypesArr.indexOf($scope.productDatas[i].productType)==-1){
            			productTypesArr.push($scope.productDatas[i].productType);
            		}else{
            			continue;
            		}
            	}
            	var hasProductType1 = false;
            	for(var i=0;i<productTypesArr.length;i++){
            		var a = +productTypesArr[i]-1;
            		if(a == 0){
            			$scope.productTypes[i]=clearConstant.productTypes[0];
            			hasProductType1 = true;
            		}else{
            			$scope.productTypes[i]=clearConstant.productTypes[a];
            		}		
            	}
            	if(hasProductType1 == true){
            		$scope.productTypes.push(clearConstant.productTypes[1])
            	}
            	$scope.productDatas = $scope.oldProductDatas;
                $scope.$apply();
            }

        }, {'exchID': exchId, 'productID': productID, 'productType': '', 'productStatus': ''});
    };*/
    /*$scope.changeProductType = function (exchId,productType) {
        //根据交易所ID查询产品信息
    	if(productType == 2){
    		$scope.isOption= true;
    	}else {
    		$scope.isOption= false;
    	}
        $scope.ModalEntity.productID = "";
        $scope.products=[];
        getProductByExchID(function (result) {
        	if (result.length > 0) {
                $scope.products = result;
                $scope.ModalEntity.productID = $scope.products[0].productID;
                $scope.$apply();
            }

        }, {'exchID': exchId, 'productID': '', 'productType': productType, 'productStatus': ''});
    };
    */
    
    
/*    //查询
    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};
        $scope.isQuery = true;
        var tempEntity = {
            exchID: '',
            productID: ''
        };
        tempEntity = angular.copy(queryEntity);
        findDefaultFeeSetEntity(function (result) {
            $scope.listEntitys = result;
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, tempEntity);
    };*/
    
    $("body").undelegate("#DefaultFeeSet_dynamic_table_wrapper td .update-row","click");
  //表格修改事件
    $("body").delegate("#DefaultFeeSet_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.DefaultFeeSetTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $timeout(function() {
        	$scope.initUpdateParam(id,$scope.modalEntity);
        }, 500);
    });
    $("body").undelegate("#DefaultFeeSet_dynamic_table_wrapper td .delete-row","click");
    //表格删除事件
    $("body").delegate("#DefaultFeeSet_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.DefaultFeeSetTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
       $scope.remove(id,$scope.modalEntity);
    });

    // 根据页面条件查询
    $scope.find = function (queryEntity) {  	
    	$scope.isQuery = true;
		$scope.DefaultFeeSetDataset = [];
		$scope.listEntitys = [];
		findDefaultFeeSetEntity(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator1 = $scope.getUpdate($scope.defaultFeeSet_update);
				var operator2 = $scope.getDelete($scope.defaultFeeSet_delete);
		    	var tempArr = [(i+1),con[i].id,con[i].exchID, $scope.transProductType(con[i].productType),con[i].productID,con[i].tradeFeeRateStr,con[i].tradeFeeAmt,con[i].offsetFeeRateStr,con[i].offsetFeeAmt,con[i].otFeeRateStr
		    					        ,con[i].otFeeAmt,con[i].strikeFeeRateStr,con[i].strikeFeeAmt,operator1+operator2]
		    	$scope.DefaultFeeSetDataset.push(tempArr); 
		    	con[i].index = i+1; 
			}
			$scope.listEntitys = con;
			//重新绘表
	        $scope.DefaultFeeSetTable.clear().draw();
	        $scope.DefaultFeeSetTable.rows.add($scope.DefaultFeeSetDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		},queryEntity);
    };
    $timeout(function() {
   	 	$scope.find($scope.queryEntity);
    },500); 
    
    $scope.getUpdate = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='update-row' data-toggle='modal' data-target='#defaultFeeSetModal'>修改</a>"; 
    	}
    	return result;
    }

    $scope.getDelete = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='delete-row'>删除</a>";
    	}
    	return result;
    }
    

    $scope.ModalTypes = [
        {text: '交易类型1', key: '1'},
        {text: '交易类型2', key: '2'}
    ];
    function formValidateReset(){
    	$scope.myForm.exchID.$setPristine();
    	$scope.myForm.productID.$setPristine();
    	$scope.myForm.tradeFeeRate.$setPristine();
    	$scope.myForm.tradeFeeAmt.$setPristine();
    	$scope.myForm.offsetFeeRate.$setPristine();
    	$scope.myForm.offsetFeeAmt.$setPristine();
    	$scope.myForm.otFeeRate.$setPristine();
    	$scope.myForm.otFeeAmt.$setPristine();
    	$scope.myForm.strikeFeeRate.$setPristine();
    	$scope.myForm.strikeFeeAmt.$setPristine();
    }
    $scope.initParameter = function () {
    	$scope.isUpdate = false;
    	$scope.isOption= false;
        $scope.ModalEntity = {};
        $scope.ModalEntity.exchID = $scope.exchangeDatas[0].exchID;
        $scope.ModalEntity.grading = $scope.gradings[0].key;
        $scope.changeProductTypeForAdd({exchID:$scope.ModalEntity.exchID,grading:$scope.ModalEntity.grading});
        setDefaultValue();
        formValidateReset();
    };

  //显示默认值
    function setDefaultValue() {
        $scope.ModalEntity.tradeFeeRate=0;
        $scope.ModalEntity.tradeFeeAmt=0;
        $scope.ModalEntity.offsetFeeRate=0;
        $scope.ModalEntity.offsetFeeAmt=0;
        $scope.ModalEntity.otFeeRate=0;
        $scope.ModalEntity.otFeeAmt=0;
        $scope.ModalEntity.strikeFeeRate=0;
        $scope.ModalEntity.strikeFeeAmt=0;
    }
    //修改
    $scope.initUpdateParam = function (index, entity) {
    	$scope.isUpdate = true;
    	$scope.products = [];
    	angular.forEach($scope.productDatasAdd, function(data, index, array) {
			if (data.exchID == entity.exchID) {
				$scope.products.push(array[index]);
			}
		});
    	CheckDefaultFeeByProductId(function(result){
    		 if(result == 1){
    			 $scope.isInstrumentAdd = false;
    			 getProductByExchID(function (result) {
    	 	            $scope.productDatasAdd = {};
    	 	            if(result !=undefined && result.length>0){
    	 	            	$scope.productDatasAdd = result;
    	 	            }
    	 	            $scope.isInstrumentAdd= false;
    	 	            $scope.$apply();
    	 	            $scope.tempEntity = angular.copy(entity);
    	 	    	     
    	 	    	     //修改时，精度处理
    	 	    	     $scope.tempEntity.tradeFeeRate=accMul($scope.tempEntity.tradeFeeRate,10000).toFixed(4);
    	 	    	     $scope.tempEntity.offsetFeeRate=accMul($scope.tempEntity.offsetFeeRate,10000).toFixed(4);
    	 	    	     $scope.tempEntity.otFeeRate=accMul($scope.tempEntity.otFeeRate,10000).toFixed(4);
    	 	             $scope.tempEntity.strikeFeeRate=accMul($scope.tempEntity.strikeFeeRate,10000).toFixed(4);
    	 	             var productType =$scope.tempEntity.productType;
    	 	    	     if(productType == 2){
    	 	    	    	 $scope.isOption= true;
    	 	    	     }else {
    	 	    	    	 $scope.isOption= false;
    	 	    	     }
    	 	    	     $scope.tempEntity.recordIndex = index;
    	 	    	     $scope.ModalEntity = angular.copy($scope.tempEntity);
    	 	    	     $scope.$apply();
    	 	    	     formValidateReset();
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
    		            $scope.tempEntity = angular.copy(entity);
    		    	     
    		    	     //修改时，精度处理
    		    	     $scope.tempEntity.tradeFeeRate=accMul($scope.tempEntity.tradeFeeRate,10000).toFixed(4);
    		    	     $scope.tempEntity.offsetFeeRate=accMul($scope.tempEntity.offsetFeeRate,10000).toFixed(4);
    		    	     $scope.tempEntity.otFeeRate=accMul($scope.tempEntity.otFeeRate,10000).toFixed(4);
    		             $scope.tempEntity.strikeFeeRate=accMul($scope.tempEntity.strikeFeeRate,10000).toFixed(4);
    		             var productType =$scope.tempEntity.productType;
    		    	     if(productType == 2){
    		    	    	 $scope.isOption= true;
    		    	     }else {
    		    	    	 $scope.isOption= false;
    		    	     }
    		    	     $scope.tempEntity.recordIndex = index;
    		    	     $scope.ModalEntity = angular.copy($scope.tempEntity);
    		    	     $scope.$apply();
    		    	     formValidateReset();
    		        }, {'exchID': entity.exchID, 'instrumentID': '', 'productType': '', 'productStatus': ''});
    		 }
    	},entity);
       
    };
    
    $scope.transProductType  = function (tradeType){
    	for(var i = 0;i < $scope.ifOptions.length;i++){
			if($scope.ifOptions[i].key == tradeType){
				return $scope.ifOptions[i].text;
			}
		}
    }

    $scope.save = function (entity) {
    	$scope.canClick=true;
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        
        $scope.tmpSaveEntity = {};
        $scope.tmpSaveEntity = angular.copy(entity);
        
        //精度处理
        $scope.tmpSaveEntity.tradeFeeRate = accDiv($scope.tmpSaveEntity.tradeFeeRate,10000).toString();
        $scope.tmpSaveEntity.offsetFeeRate = accDiv($scope.tmpSaveEntity.offsetFeeRate,10000).toString();
        $scope.tmpSaveEntity.otFeeRate = accDiv($scope.tmpSaveEntity.otFeeRate,10000).toString();
        $scope.tmpSaveEntity.strikeFeeRate = accDiv($scope.tmpSaveEntity.strikeFeeRate,10000).toString();
        //增加
        if (index == undefined) {
        	findDefaultFeeSetEntity(function (result){
        		if(result.length > 0){
        			$scope.canClick=false;
        			layer.msg("新增失败，不可重复", {
						icon : 2,
						time : 3000
					});
        		}else{
        			$scope.tmpSaveEntity.settleFeeRate="0";
    	       		$scope.tmpSaveEntity.settleFeeAmt="0";
    	   			$scope.tmpSaveEntity.delivFeeRate="0";
          			$scope.tmpSaveEntity.delivFeeAmt="0";
          			saveDefaultFeeSetEntity(function (addResult){
          				if(addResult != undefined){
	          				$scope.listEntitys.unshift(addResult);
		    	        	$scope.$apply();
		    	        	$scope.find($scope.queryEntity);
		    	        	//关闭窗口
		    	       		$("#defaultFeeSetModal").modal("hide");
          				}
    	        	},$scope.tmpSaveEntity);
            	}
        	},$scope.tmpSaveEntity);
            //修改
        } else {
            updateDefaultFeeSetEntity($scope.tmpSaveEntity);
    		$scope.tmpSaveEntity.tradeFeeRateStr=entity.tradeFeeRate;
    		$scope.tmpSaveEntity.otFeeRateStr=entity.otFeeRate;
    		$scope.tmpSaveEntity.index = tableIndex;
    		$scope.listEntitys.splice(tableIndex-1, 1, $scope.tmpSaveEntity); 
            
            $scope.DefaultFeeSetTable.cells().every( function () {
                if((tableIndex-1) == this[0][0].row){
                    if(this[0][0].column == 5){
                        this.data(scientificToNumber($scope.tmpSaveEntity.tradeFeeRate));
                    }
                    if(this[0][0].column == 6){
                        this.data(entity.tradeFeeAmt);
                    }
                    if(this[0][0].column == 7){
                        this.data(scientificToNumber($scope.tmpSaveEntity.offsetFeeRate));
                    }
                    if(this[0][0].column == 8){
                        this.data(entity.offsetFeeAmt);
                    }
                    if(this[0][0].column == 9){
                        this.data(scientificToNumber($scope.tmpSaveEntity.otFeeRate));
                    }
                    if(this[0][0].column == 10){
                        this.data(entity.otFeeAmt);
                    }
                    if(this[0][0].column == 11){
                        this.data(scientificToNumber($scope.tmpSaveEntity.strikeFeeRate));
                    }
                    if(this[0][0].column == 12){
                        this.data(entity.strikeFeeAmt);
                    }
                }

            });
            /*$timeout(function() {
            	$scope.find();
            }, 500); */
          //关闭窗口
            $("#defaultFeeSetModal").modal("hide");
        }
        $timeout(function() {
            $scope.canClick = false;
        }, 2000); 
    };

    //删除
    $scope.remove = function (index, entity) {
    	layer.confirm('确定删除？', {icon: 3}, function (count) {
	        deleteDefaultFeeSetEntity(entity.id);
	        $scope.listEntitys.splice(index, 1);
	        $timeout(function() {
	        	$scope.find($scope.queryEntity);//对应方法
	        }, 500);
	        layer.close(count);
            $scope.$apply();
    	});
    };
    
  //---------------------
    //设置事件方法
    $scope.products = new Array();
    $scope.selectExchange = function (exchID) {
        $scope.products = new Array();
        $scope.ModalEntity.productID = "";
        getAllProductByConditionEntity(
            function (result) {
                if (result.length > 0) {
                    $scope.products = result;
                    $scope.ModalEntity.productID = $scope.products[0].productID;
                    $scope.$apply();
                }
            }, {
                exchID: exchID,
                productID: '',
                productType: '',
                productStatus: ''
            });
    };
    //------------------------
    //导出excel
    $scope.exportExcel = function (queryEntity) {
    	$scope.tmpExportQuery = angular.copy(queryEntity);
    	framework.file.export("默认手续费率查询.xls",'excel',{ 
			entityKey:['exchID','productType','productID','tradeFeeRateStr','tradeFeeAmt','offsetFeeRateStr','offsetFeeAmt','otFeeRateStr','otFeeAmt','strikeFeeRateStr','strikeFeeAmt'],
			headerKey:['交易所代码','是否为期权','品种/合约代码','开仓按金额','开仓按手数','平仓按金额','平仓按手数','平今按金额','平今按手数','行权按金额','行权按手数'],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
			title:"默认手续费率导出数据",
			dicMap:{productType:{'1':"否",'2':"是"}}
		},"defaultFeeSetService", "queryByConOnProTyp", $scope.tmpExportQuery.exchID, $scope.tmpExportQuery.productType, 
		$scope.tmpExportQuery.productID, $scope.tmpExportQuery.tradeType, $scope.tmpExportQuery.grading);
    };
    
    //导入
    $("#defaultFeeSetUploader").uploadFile({
    	  dragdropWidth: 125,
          uploadStr:"Excel导入",
          dragDropStr: "",
          showAbort: false,
          dragDropContainerClass:"",
        url: framework.file.uploadUrl("defaultFeeSetService", "uploadExcel", [null]),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(errCode != 0) {
                    layer.msg(errMsg,{icon: 2});
                } else {
                	if(result != null){
                		if(result.code == '1'){
                			layer.msg("成功导入"+result.info+"条记录！", {icon: 1, time: 1500});
                			getAllDefaultFeeSetEntity(function (result) {
                	            $scope.listEntitys = result;
                	            $scope.find($scope.queryEntity);
                	            $scope.$apply();
                	            $("#defaultFeeSetUploadModal").modal("hide");
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
            return true;
        }
    });
    
    //初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.DefaultFeeSetTable = $('#DefaultFeeSet_dynamic_table').DataTable( {
			    		data : $scope.DefaultFeeSetDataset,
			        	columns :$scope.DefaultFeeSet_columns,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
      });
    
});

