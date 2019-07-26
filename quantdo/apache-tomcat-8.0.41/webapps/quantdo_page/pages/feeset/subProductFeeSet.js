myapp.controller('SubProductFeeSetController', function ($scope, $timeout,$rootScope) {
	
    //初始化页面信息
    getAllSubProductFeeSetEntity(function (result) {
        $scope.listEntitys = result;
        $scope.$apply();
    });
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;

    $scope.queryEntity = {};
    $scope.ModalEntity = {};
    $scope.subAccounts = new Array();
    $scope.productDatas = {};
    $scope.exchangeDatas = {};
    $scope.entitys = [];
    
    $scope.srcEntity = {};
    $scope.desEntity = {};
    
	$scope.subProductFeeSet_query = isShow("subProductFeeSet_query");
	$scope.subProductFeeSet_outexcel = isShow("subProductFeeSet_outexcel");
	$scope.subProductFeeSet_add = isShow("subProductFeeSet_add");
	$scope.subProductFeeSet_batchdelete = isShow("subProductFeeSet_batchdelete");
	$scope.subProductFeeSet_copy = isShow("subProductFeeSet_copy");
	$scope.subProductFeeSet_in = isShow("subProductFeeSet_in");
	$scope.subProductFeeSet_update = isShow("subProductFeeSet_update");
	$scope.subProductFeeSet_delete = isShow("subProductFeeSet_delete");
    
    $scope.SubProductFeeSetDataset = [];
    
    //粒度(区分品种、合约)
    $scope.gradings = [
        {text: '品种', key: '1'},
        {text: '合约', key: '2'}
    ];
    
    $scope.gradingIsAll = true;
   /* $timeout(function() {
    	$scope.queryEntity.grading = $scope.gradings[0].key;
    },500);
    */
    //$scope.productTypes = clearConstant.productTypes;
    
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
    
/*    $scope.changeProductType = function (exchId) {
        //根据交易所ID查询产品信息
        $scope.ModalEntity.productID = "";
        $scope.products=[];
        getProductByExchID(function (result) {
        	if (result.length > 0) {
                $scope.products = result;
                $scope.ModalEntity.productID = $scope.products[0].productID;
                $scope.$apply();
            }

        }, {'exchID': exchId, 'productID': '', 'productStatus': ''});
    };*/
    
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
  //定义固定列头
    $scope.SubProductFeeFxSet_column = [
           {title:"<a class='click-choice-all'></a>"},
           {title:"id",visible:false},
           {title: "资产单元"},
           {title: "资产单元名称"},
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
           {title: "操作员"},
           {title: "操作日期"},
           {title: "操作时间"},
 	  	   {title: "操作"}      
     ]
    
    //定义固定列头
    $scope.SubProductFeeZjSet_column = [
           {title:"<a class='click-choice-all'></a>"},
           {title:"id",visible:false},
           {title: "资金账户"},
           {title: "资金账户名称"},
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
           {title: "操作员"},
           {title: "操作日期"},
           {title: "操作时间"},
 	  	   {title: "操作"}  
     ]
    
    //初始化交易所信息
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
        $scope.$apply();
    });
    
	//查询是否属于机构
    queryInstClientID(function (result) {
        if(result != undefined ){
        	$scope.typeName = "资产单元";
            // 初始化资产单元下拉列表
        	findSubCapitalEntity(function (result){
            	$scope.subCapitalDatas = result;
            	$scope.$apply();
            },{
            	isActive: '1'
            });
        }else{
        	$scope.typeName = "资金账号";
        	findCapitalByBrokId(function (result) {
        		pushEntitys(result);
        		$scope.$apply();
            });
        }
    });
    
    function pushEntitys(s){
		$scope.subCapitalDatas = [];
		angular.forEach(s, function (value, index, arrays) {
			$scope.tmpEntitys = {};
			$scope.tmpEntitys.subAccountID = value.innerAccountID;
			$scope.tmpEntitys.subAccountName = value.accountName;
			 $scope.subCapitalDatas.push($scope.tmpEntitys);
		});
		$scope.$apply();
	}
    
    //初始化所有产品信息并默人选中第一项
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
    
/*    //查询
    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};
        $scope.isQuery = true;
        var tempEntity = {
            exchID: '',
            productID: '',
//            tradeType: '',
            subAccountID: ''
//            traderID: ''
        };
        tempEntity = angular.copy(queryEntity);
        findSubProductFeeSetEntity(function (result) {
            $scope.listEntitys = result;
            $scope.$apply();
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        }, tempEntity);
    };*/
    $("body").undelegate("#SubProductFeeFxSet_dynamic_table_wrapper td .update-row","click");
	//表格修改事件
    $("body").delegate("#SubProductFeeFxSet_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.SubProductFeeFxSetTable.row(mytr).data();
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
    $("body").undelegate("#SubProductFeeZjSet_dynamic_table_wrapper td .update-row","click");
        $("body").delegate("#SubProductFeeZjSet_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.SubProductFeeZjSetTable.row(mytr).data();
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
    
     $("body").undelegate("#SubProductFeeFxSet_dynamic_table_wrapper td .delete-row","click");
    //表格删除事件
    $("body").delegate("#SubProductFeeFxSet_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.SubProductFeeFxSetTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
       $scope.remove(id,$scope.modalEntity);
    });
    $("body").undelegate("#SubProductFeeZjSet_dynamic_table_wrapper td .delete-row","click");
     $("body").delegate("#SubProductFeeZjSet_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.SubProductFeeZjSetTable.row(mytr).data();
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
		$scope.SubProductFeeSetDataset = [];
		$scope.listEntitys = [];
		findSubProductFeeSetEntity(function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator1 = $scope.getUpdate($scope.subProductFeeSet_update);
				var operator2 = $scope.getDelete($scope.subProductFeeSet_delete);
		    	var tempArr = ["<a class='click-choice-one'></a>",con[i].id,con[i].subAccountID,con[i].accountName,con[i].exchID,$scope.transProductType(con[i].productType),
		    		con[i].productID,con[i].tradeFeeRateStr,con[i].tradeFeeAmt,con[i].offsetFeeRateStr,con[i].offsetFeeAmt,con[i].otFeeRateStr,con[i].otFeeAmt,
		    		con[i].strikeFeeRateStr,con[i].strikeFeeAmt,con[i].operatorID,con[i].operateDate,con[i].operateTime,operator1+operator2]
		    	$scope.SubProductFeeSetDataset.push(tempArr);
		    	con[i].index = i+1;
			}
			$scope.listEntitys = con;
			//重新绘表
			if($scope.typeName=="资产单元"){
				$scope.isFx = true;
			    $scope.SubProductFeeFxSetTable.clear().draw();
		        $scope.SubProductFeeFxSetTable.rows.add($scope.SubProductFeeSetDataset).draw();
			}else{
				$scope.isFx = false;
			    $scope.SubProductFeeZjSetTable.clear().draw();
		        $scope.SubProductFeeZjSetTable.rows.add($scope.SubProductFeeSetDataset).draw();
			}
			$scope.$apply();
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		},queryEntity);
    };
    $timeout(function() {
    	  $scope.find($scope.queryEntity);
    }, 1000);
    

    $scope.getUpdate = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='update-row' data-toggle='modal' >修改</a>"; 
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
    

    $scope.ModalTypes = clearConstant.tradeTypes;
    function formValidateReset() {
        $scope.myForm.tradeFeeRate.$setPristine();
        $scope.myForm.tradeFeeAmt.$setPristine();
        $scope.myForm.otFeeRate.$setPristine();
        $scope.myForm.otFeeAmt.$setPristine();
        $scope.myForm.subAccountID.$setPristine();
        $scope.myForm.exchID.$setPristine();
        $scope.myForm.productID.$setPristine();
    }
    $scope.productTypes = clearConstant.productTypes;
    $scope.transProductType  = function (tradeType){
    	for(var i = 0;i < $scope.ifOptions.length;i++){
			if($scope.ifOptions[i].key == tradeType){
				return $scope.ifOptions[i].text;
			}
		}
    }

    //根据资金账号和交易员代码查询子资金账号
    $scope.getSubAccount = function (innerAccountID, traderID) {
        if (innerAccountID == "" || traderID == "") {
            return false;
        }
        findSubCapitalEntity(function (result) {
            $scope.ModalEntity.subAccountID = "";
            if (result.length != 1) {
                $scope.$apply();
                return false;
            } else {
                $scope.ModalEntity.subAccountID = result[0].subAccountID;
                $scope.$apply();
            }
        }, {innerAccountID: innerAccountID, traderID: traderID});
    };

    $scope.initParameter = function () {
        $scope.ModalEntity = {};
        $scope.ModalEntity.subAccountID = $scope.subCapitalDatas[0].subAccountID;
        $scope.ModalEntity.exchID = $scope.exchangeDatas[0].exchID;
        $scope.ModalEntity.grading = $scope.gradings[0].key;
        $scope.changeProductTypeForAdd({exchID:$scope.ModalEntity.exchID,grading:$scope.ModalEntity.grading})
        setDefaultValue();
        formValidateReset();
        $scope.isUpdate=false;
    	$scope.isOption= false;
    };

    /**
     * 设置默认值
     */
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
    	
    	CheckSubProductFeeByProductId(function(result){
    		if(result == 1){
    			getProductByExchID(function (result) {
    	            $scope.productDatasAdd = {};
    	            if(result !=undefined && result.length>0){
    	            	$scope.productDatasAdd = result;
    	                $scope.$apply();
    	            }
    	            $scope.isInstrumentAdd= false;
    	            $scope.$apply();
    	            $scope.tempEntity = angular.copy(entity);
    	            
    	            //修改时，精度处理
    	            $scope.tempEntity.tradeFeeRate=accMul($scope.tempEntity.tradeFeeRate,10000).toFixed(4);
    	            $scope.tempEntity.offsetFeeRate=accMul($scope.tempEntity.offsetFeeRate,10000).toFixed(4);
    	            $scope.tempEntity.otFeeRate=accMul($scope.tempEntity.otFeeRate,10000).toFixed(4);
    	            $scope.tempEntity.strikeFeeRate=accMul($scope.tempEntity.strikeFeeRate,10000).toFixed(4);
    	            $scope.tempEntity.recordIndex = index;
    	           
    	            $scope.isUpdate=true;

    	            $scope.products = new Array();
    	            var productType =entity.productType;
    	            var productTypeTem =productType;
    	            if(productType == 2){
    	        		$scope.isOption= true;
    	        		//1.37 期权品种类别同期货
    	        		productTypeTem=1;
    	        	}else {
    	        		$scope.isOption= false;
    	        	}
    	            $scope.ModalEntity = angular.copy($scope.tempEntity);
    	            $("#subProductFeeSetModal").modal("show");
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
    	            $scope.tempEntity = angular.copy(entity);
    	            
    	            //修改时，精度处理
    	            $scope.tempEntity.tradeFeeRate=accMul($scope.tempEntity.tradeFeeRate,10000).toFixed(4);
    	            $scope.tempEntity.offsetFeeRate=accMul($scope.tempEntity.offsetFeeRate,10000).toFixed(4);
    	            $scope.tempEntity.otFeeRate=accMul($scope.tempEntity.otFeeRate,10000).toFixed(4);
    	            $scope.tempEntity.strikeFeeRate=accMul($scope.tempEntity.strikeFeeRate,10000).toFixed(4);
    	            $scope.tempEntity.recordIndex = index;
    	           
    	            $scope.isUpdate=true;

    	            $scope.products = new Array();
    	            var productType =entity.productType;
    	            var productTypeTem =productType;
    	            if(productType == 2){
    	        		$scope.isOption= true;
    	        		//1.37 期权品种类别同期货
    	        		productTypeTem=1;
    	        	}else {
    	        		$scope.isOption= false;
    	        	}
    	            $scope.ModalEntity = angular.copy($scope.tempEntity);
    	            $("#subProductFeeSetModal").modal("show");
                    $scope.$apply();
    	        }, {'exchID': entity.exchID, 'instrumentID': '', 'productType': '', 'productStatus': ''});
    		}
    	},entity);
        
        /*getProductByExchID(function (result) {
        	if (result.length > 0) {
                $scope.products = result;
                $scope.$apply();
                $timeout(function() {
                	 $scope.ModalEntity = angular.copy($scope.tempEntity);
                	 $("#subProductFeeSetModal").modal("show");
                     $scope.$apply();
    			}, 1000);
         
            }

        }, {'exchID': entity.exchID , 'productID': '', 'productType': productTypeTem, 'productStatus': ''});*/

       
    };

    $scope.save = function (entity) {
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        
        $scope.tmpSaveEntity = {};
        $scope.tmpSaveEntity = angular.copy(entity);
        
        $scope.tmpSaveEntity.settleFeeRate="0";
    	$scope.tmpSaveEntity.settleFeeAmt="0";
    	$scope.tmpSaveEntity.delivFeeRate="0";
    	$scope.tmpSaveEntity.delivFeeAmt="0";
        
        //精度处理
        $scope.tmpSaveEntity.tradeFeeRate = accDiv($scope.tmpSaveEntity.tradeFeeRate,10000).toString();
        $scope.tmpSaveEntity.offsetFeeRate = accDiv($scope.tmpSaveEntity.offsetFeeRate,10000).toString();
        $scope.tmpSaveEntity.otFeeRate = accDiv($scope.tmpSaveEntity.otFeeRate,10000).toString();
        $scope.tmpSaveEntity.strikeFeeRate = accDiv($scope.tmpSaveEntity.strikeFeeRate,10000).toString();
        
        //增加
        if (index == undefined) {
            findSubProductFeeSetEntity(function (result) {
                if (result.length > 0) {
                    layer.msg("该手续费已存在", {icon: 2, time: 3000});
                    return false;
                } else {
                	
                	var productType =$scope.tmpSaveEntity.productType;
                    if(productType !=2 ){
                    	$scope.tmpSaveEntity.strikeFeeRate="0";
                    	$scope.tmpSaveEntity.strikeFeeAmt="0";
                    }
                    saveSubProductFeeSetEntity(function (result) {
                    	if(result != undefined){
	                    	result.accountName = $scope.transAccountName(result.subAccountID);
	                        $scope.listEntitys.unshift(result);
	                        $scope.find($scope.queryEntity);
	                        $scope.$apply();
	                      //关闭窗口
	                        $("#subProductFeeSetModal").modal("hide");
                    	}
                    }, $scope.tmpSaveEntity);
                }
            }, $scope.tmpSaveEntity);
            //修改
        } else {
            updateSubProductFeeSetEntity(function (result) {
            	result.accountName = $scope.transAccountName(result.subAccountID);
            	result.index = tableIndex;
        		$scope.listEntitys.splice(tableIndex-1, 1, result);  
                
                if($scope.typeName=="资产单元"){
    		        $scope.SubProductFeeFxSetTable.cells().every( function () {
    		        	if((tableIndex-1) == this[0][0].row){
    		        		if(this[0][0].column == 3){
                                this.data(entity.subAccountName);
                            }
    	                    if(this[0][0].column == 7){
    	                        this.data(scientificToNumber($scope.tmpSaveEntity.tradeFeeRate));
    	                    }
    	                    if(this[0][0].column == 8){
    	                        this.data(entity.tradeFeeAmt);
    	                    }
    	                    if(this[0][0].column == 9){
    	                        this.data(scientificToNumber($scope.tmpSaveEntity.offsetFeeRate));
    	                    }
    	                    if(this[0][0].column == 10){
    	                        this.data(entity.offsetFeeAmt);
    	                    }
    	                    if(this[0][0].column == 11){
    	                        this.data(scientificToNumber($scope.tmpSaveEntity.otFeeRate));
    	                    }
    	                    if(this[0][0].column == 12){
    	                        this.data(entity.otFeeAmt);
    	                    }
    	                    if(this[0][0].column == 13){
    	                        this.data(scientificToNumber($scope.tmpSaveEntity.strikeFeeRate));
    	                    }
    	                    if(this[0][0].column == 14){
    	                        this.data(entity.strikeFeeAmt);
    	                    }
    	                }

                    });
    			}else{
    		        $scope.SubProductFeeZjSetTable.cells().every( function () {
                        if((tableIndex-1) == this[0][0].row){
                        	if(this[0][0].column == 3){
                                this.data(entity.subAccountName);
                            }
                        	if(this[0][0].column == 7){
    	                        this.data(scientificToNumber($scope.tmpSaveEntity.tradeFeeRate));
    	                    }
    	                    if(this[0][0].column == 8){
    	                        this.data(entity.tradeFeeAmt);
    	                    }
    	                    if(this[0][0].column == 9){
    	                        this.data(scientificToNumber($scope.tmpSaveEntity.offsetFeeRate));
    	                    }
    	                    if(this[0][0].column == 10){
    	                        this.data(entity.offsetFeeAmt);
    	                    }
    	                    if(this[0][0].column == 11){
    	                        this.data(scientificToNumber($scope.tmpSaveEntity.otFeeRate));
    	                    }
    	                    if(this[0][0].column == 12){
    	                        this.data(entity.otFeeAmt);
    	                    }
    	                    if(this[0][0].column == 13){
    	                        this.data(scientificToNumber($scope.tmpSaveEntity.strikeFeeRate));
    	                    }
    	                    if(this[0][0].column == 14){
    	                        this.data(entity.strikeFeeAmt);
    	                    }
                        }

                    });
    			}
                /*$timeout(function() {
		        	$scope.find();//对应方法
				}, 500);*/
                
              //关闭窗口
                $("#subProductFeeSetModal").modal("hide");
            }, $scope.tmpSaveEntity);
        }
    };

    //删除
    $scope.remove = function (index, entity) {
        layer.confirm('确定删除该条记录吗？', {icon: 3}, function (count) {
            deleteSubProductFeeSetEntity(entity.id);
            $scope.listEntitys.splice(index, 1);
            $timeout(function() {
	        	$scope.find($scope.queryEntity);//对应方法
			}, 500);
            $scope.$digest();
            layer.close(count);
        });
    };
    
    // 批量删除
	$scope.removeLists = function() {
		$scope.entitys = [];
		$scope.entitys = $scope.getRemoveEntitys();
		if ($scope.entitys.length > 0) {
			layer.confirm('批量删除手续费信息，确认删除吗？', {
				icon : 3
			}, function(count) {
				deleteSubProductFeeSetLists(function (result){
					$scope.entitys = [];
				    $scope.isChecked = false;
				    $scope.listEntitys = angular.copy(result);
				    $timeout(function() {
			        	$scope.find($scope.queryEntity);//对应方法
					}, 500);
					$scope.$apply();
				},$scope.entitys);
				layer.close(count);
				layer.msg("删除手续费信息成功", {
					icon : 1
				});
				// 初始化页面信息
				
			});
		} else {
			layer.msg('请选择要删除的手续费信息', {
				icon : 2
			});
		}
	};
	
	  //获取需要删除的集合
	$scope.getRemoveEntitys = function(){
			  var tmpEntitys = [];
			  //复选框选中列ID
	  	  	  $scope.ids = new Array();
		  	  if($scope.typeName=="资产单元"){
			  	  	$("#SubProductFeeFxSet_dynamic_table a").each(function(){
			  	  		var flag = $(this).hasClass("clicked-choice-one");
					  	  		if(flag){
						  	  		var mytr = $(this).parents("tr");
							        var tempArr = $scope.SubProductFeeFxSetTable.row(mytr).data();
							        var id = tempArr[1];//获取该行对应的id
							  	  	$scope.ids.push(id);
					  	  	    }
			         });
		  	  }else{
			  	  	$("#SubProductFeeZjSet_dynamic_table a").each(function(){
				  		var flag = $(this).hasClass("clicked-choice-one");
					  	  		if(flag){
						  	  		var mytr = $(this).parents("tr");
							        var tempArr = $scope.SubProductFeeZjSetTable.row(mytr).data();
							        var id = tempArr[1];//获取该行对应的id
							  	  	$scope.ids.push(id);
					  	  	    }
			        });
		  	  }
	  	      for(var i=0;i<$scope.listEntitys.length;i++){
					for(var j=0;j<$scope.ids.length;j++){
						if($scope.listEntitys[i].id==$scope.ids[j]){
							tmpEntitys.push($scope.listEntitys[i]);
						}
					}
			  }		
			  return tmpEntitys;
	}

	

    $scope.transAccountName = function (text) {
        var count = $scope.subCapitalDatas.length;
        for (var i = 0; i < count; i++) {
            if ($scope.subCapitalDatas[i].subAccountID == text) {
                return $scope.subCapitalDatas[i].subAccountName;
            }
        }
    };
    
    // 单个选择
	$scope.recordChecked = function(x, listEntity) {
		if (x) {
			$scope.entitys.push(listEntity);
		} else {
			var index = $scope.entitys.indexOf(listEntity);
			$scope.entitys.splice(index, 1);
		}
	}

	// 全选
	$scope.isChecked = false
	$scope.addChecked = function() {
		if ($scope.isChecked == false) {
			$scope.entitys =angular.copy($scope.listEntitys);
			$scope.isChecked = true;
		} else {
			$scope.entitys = [];
			$scope.isChecked = false;
		}
	}

    $scope.products = new Array();
    $scope.selectExchange = function (exchID) {
        $scope.products = new Array();
        $scope.ModalEntity.productID = "";
        getAllProductByConditionEntity(function (result) {
            if (result.length > 0) {
                $scope.products = result;
                $scope.ModalEntity.productID = $scope.products[0].productID;
                $scope.$apply();
            }
        }, {exchID: exchID, productID: '', productType: '', productStatus: ''});
    };
    
    
    // 初始化复制内容
    $scope.copyInitParameter= function(){
    	$scope.srcEntity.subAccountID="";
    	$scope.subAccounts=[];
        $scope.desEntity.subAccountID = "";
		if($scope.subCapitalDatas != null && $scope.subCapitalDatas.length > 0){
			$scope.desEntity.subAccountID = $scope.subCapitalDatas[0].subAccountID;
		}
		findBySubProductFeeAccountID(function(result){
        	if(result != null && result.length > 0){
				$scope.subAccounts = result;
		    	$scope.srcEntity.subAccountID = $scope.subAccounts[0].subAccountID;
		    	$scope.$apply();
			}
    	
    		$timeout(function() {
    		    $("#subProductFeeSetCopyModal").modal("show");
			}, 500);
    	    $scope.$apply();
    	});
    }
    
    // 复制
	$scope.copy= function (srcEntity,desEntity){
		if(srcEntity.subAccountID ==undefined || srcEntity.subAccountID.length==0){
			layer.msg("原账号不能为空!", {icon: 2, time: 3000});
            return false;
		}
		if(desEntity.subAccountID ==undefined  || desEntity.subAccountID.length==0){
			layer.msg("目的账号不能为空!", {icon: 2, time: 3000});
            return false;
		}
			if(srcEntity.subAccountID != desEntity.subAccountID ){
				layer.confirm('复制将清除目的账号'+desEntity.subAccountID+'的原设置信息，是否继续？', {
					icon : 3
				}, function(count) {
					copySubProductFeeSetEntity(function(result){
						$scope.listEntitys = angular.copy(result);
						$timeout(function() {
				        	$scope.find($scope.queryEntity);//对应方法
						}, 500);
						$scope.$apply();
						layer.msg("复制成功", {
							icon : 1,
							time: 500
						});
						layer.close(count);
					},srcEntity.subAccountID,desEntity.subAccountID);
				});
				// 关闭窗口
		        $("#subProductFeeSetCopyModal").modal("hide");
			}else{
				if($scope.typeName == "资产单元"){
					layer.msg("源资产单元与目的资产单元不能相同!", {icon: 2, time: 3000});
				}else {
					layer.msg("源资金账号与目的资金账号不能相同!", {icon: 2, time: 3000});
				}
			}
	}
    
	$scope.transCopySubCapital = function (text) {
        var count = $scope.subCapitalDatas.length;
        for (var i = 0; i < count; i++) {
            if ($scope.subCapitalDatas[i].subAccountID == text) {
                return $scope.subCapitalDatas[i].subAccountName;
            }
        }
    };
    
    
    
    //导出excel
    $scope.exportExcel = function (queryEntity) {
    	$scope.tmpExportQuery = angular.copy(queryEntity);
    	framework.file.export("账号手续费率查询.xls",'excel',{
			entityKey:['subAccountID','accountName','exchID','productType','productID','tradeFeeRateStr','tradeFeeAmt','offsetFeeRateStr','offsetFeeAmt','otFeeRateStr','otFeeAmt','strikeFeeRateStr','strikeFeeAmt'],
			headerKey:['账号ID','账号名称','交易所代码','是否为期权','品种/合约代码','开仓按金额','开仓按手数','平仓按金额','平仓按手数','平今按金额','平今按手数','行权按金额','行权按手数'],
			styles:['plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText','plainText'],
			title:"账号手续费率导出数据",
			
			dicMap:{productType:{'1':"否",'2':"是"}}
		},"subProductFeeSetService", "findByQuery", $scope.tmpExportQuery.subAccountID,$scope.tmpExportQuery.exchID, 
		$scope.tmpExportQuery.productType, $scope.tmpExportQuery.productID, $scope.tmpExportQuery.tradeType, $scope.tmpExportQuery.grading);
    };
    
    //导入
    $("#subProductFeeSetUploader").uploadFile({
    	  dragdropWidth: 125,
          uploadStr:"Excel导入",
          dragDropStr: "",
          showAbort: false,
          dragDropContainerClass:"",
        url: framework.file.uploadUrl("subProductFeeSetService", "uploadExcel", [null]),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(errCode != 0) {
                    layer.msg(errMsg,{icon: 2});
                } else {
                	if(result != null){
                		if(result.code == '1'){
                			layer.msg("成功导入"+result.info+"条记录！", {icon: 1, time: 1500});
                			getAllSubProductFeeSetEntity(function (result) {
                	            $scope.listEntitys = result;
                	            $scope.find($scope.queryEntity);
                	            $scope.$apply();
                	            $("#subProductFeeSetUploadModal").modal("hide");
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
    
    $("body").undelegate("#SubProductFeeZjSet_dynamic_table td a","click");
    $("body").delegate("#SubProductFeeZjSet_dynamic_table td a","click",function(){
    	debugger;
        if($(this).hasClass("click-choice-one")){
            $(this).removeClass("click-choice-one");
            $(this).addClass("clicked-choice-one");
        }
        else{
            $(this).addClass("click-choice-one");
            $(this).removeClass("clicked-choice-one");
        }

    });
    $("body").undelegate("#SubProductFeeFxSet_dynamic_table td a","click");
    $("body").delegate("#SubProductFeeFxSet_dynamic_table td a","click",function(){
    	debugger;
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
    	debugger;
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
    
  //初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.SubProductFeeFxSetTable = $('#SubProductFeeFxSet_dynamic_table').DataTable( {
			    		data : $scope.SubProductFeeSetDataset,
			        	columns :$scope.SubProductFeeFxSet_column,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
		    	
		    	//会话列表初始化
		    	$scope.SubProductFeeZjSetTable = $('#SubProductFeeZjSet_dynamic_table').DataTable( {
			    		data : $scope.SubProductFeeSetDataset,
			        	columns :$scope.SubProductFeeZjSet_column,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
      });
    
});

