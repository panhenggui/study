myapp.controller('SubCombPositionDetailController', function ($scope,$rootScope) {
	$scope.queryEntity = {};//查询条件
	$scope.queryEntity.settleDate = clearConstant.formatDate(new Date());
	$scope.queryEntity.endDate = clearConstant.formatDate(new Date());

	$scope.subCombPositionDetailService = new com.quantdo.orgClear.service.SubCombPositionDetailService();
	$scope.subCombPositionDetail_query = isShow("subCombPositionDetail_query");
	$scope.isInstClient = true;//无论是查询条件，还是modal框，机构都是默认为当前机构，不可修改
	$scope.queryInstClients = {};//机构下拉框数据
	$scope.subAccountIDEntitys = {};//资金账号
	$scope.isQuery = false;
	//获得机构下拉框数据
	//机构（默认是当前机构，而且此页面只有机构用户可以使用（ps:项目一般不靠谱，估计以后要改成支持多机构））
	$scope.subCombPositionDetailService.findInstClient(function(result){
		$scope.queryInstClients = [];
		$scope.isInstClient = false;
		if(result && result.length>0){

            for (var i = 0 ; i< result.length ; i++) {
                if(result[i].amType == "2"){
                    $scope.queryInstClients.push(result[i]);
                }
            }

			//$scope.queryInstClients = result;

			if(result.length==1){
				$scope.queryEntity.instClientID = $scope.queryInstClients[0].instClientID;
				$scope.isInstClient = true;
			}
			$scope.queryChangeInclient();
			$scope.$apply();
		}
	});
	
	//初始化交易所信息并默人选中第一个
	$scope.subCombPositionDetailService.getAllExchanges(function (result) {
		$scope.queryExchangeDatas = result;
        $scope.$apply();
    });
	
	$scope.transBlank = function(key){
    	if(key == "" || key == undefined){
    		key = null;
    	}
    	return key;
    };
    
  //资金账号
    $scope.subAccountIDEntitys = {};//资金账号
    $scope.queryChangeInclient = function(){
		//查询资产单元
    	$scope.subCombPositionDetailService.findInnerAccount({"instClientID":$scope.queryEntity.instClientID}, function(result){
    		if(result){
				$scope.subAccountIDEntitys = angular.copy(result);;
			}
			$scope.$apply();
		});
	};
	
	$scope.transInstClientID = function(instClientID){
		for(var i=0;i<$scope.queryInstClients.length;i++){
			if($scope.queryInstClients[i].instClientID == instClientID){
				return $scope.queryInstClients[i].instClientAbbrName;
			}
		}
	};
	
	$scope.transHedgeFlag = function(key){
		if(key=="1"){
			return "投机";
		}else if(key=="2"){
			return "套利";
		}else if(key=="3"){
			return "套保";
		}else{
			return "";
		}
	};
	
	$scope.transDirection = function(key){
		if(key=="0"){
			return "买";
		}else if(key=="1"){
			return "卖";
		}else{
			return "";
		}
	};
	
	$scope.combInstrumentIDS = [
		{key: '0' , test: '备兑看涨期权组合'},
	    {key: '1' , test: '备兑看跌期权组合'}
	];
	
	$scope.transcombInstrumentIDS = function(key){
		if(key == "0"){
			key = '备兑看涨期权组合';
		}else if(key == "1"){
			key = '备兑看跌期权组合';
		}else{
			key = '';
		}
		return key;
	}
	/*******************生成表格，数据查询************************/
	$(document).ready(function() {
	   	 // 限仓表列头
	   	$scope.subCombPositionDetailTable_column = [
	   		{title:"序号"},
	   	    {title:"id",visible:false},
	   	    {"title":"结算日期"},
	   	    {"title":"所属机构"},
	   	    {"title":"交易所"},
	   	    {"title":"资产单元"},
		    {"title":"期货合约"},
		    {"title":"期货买卖方向"},
		    {"title":"期权合约"},
		    {"title":"期权买卖方向"},
		    {"title":"数量"},
		   	{"title":"组合类型"},
		    {"title":"组合保证金"}
	   	]
	   	//会话列表初始化
	   	$scope.subCombPositionDetailTable = $('#subCombPositionDetail_dynamic_table').DataTable( {
		    data : $scope.subCombPositionDetailDataset,
		    columns :$scope.subCombPositionDetailTable_column,
		    dom: 'rt<"bottom"ipl>',
		    fixedColumns:   {
		       leftColumns: 0,
		        rightColumns: 1
		    }
	    });
	});


	//根据页面条件查询
	$scope.find = function () {
		$scope.isQuery = true;
		$scope.subCombPositionDetailDataset = [];
		$scope.listEntitys = [];
		$scope.tmpQuery = angular.copy($scope.queryEntity);
        if($scope.tmpQuery.subAccountID != null){
        	var subAccountEntity = angular.copy($scope.tmpQuery.subAccountID);
            delete $scope.tmpQuery.subAccountID;
            $scope.tmpQuery.subAccountID = subAccountEntity.subAccountID;
        }
		//根据指定主键查询
		$scope.subCombPositionDetailService.findByQuery($scope.tmpQuery,function(result){			
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var index = i+1;
				if(con[i].direction1 == '0'){
					con[i].combInstrumentID = '0';
				}else if(con[i].direction1 == '1'){
					con[i].combInstrumentID = '1';
				}else{
					con[i].combInstrumentID = '-1';
				}
				var tempArr = [index,con[i].id,con[i].settleDate,$scope.transInstClientID(con[i].instClientID),con[i].exchID,con[i].subAccountID,con[i].instrumentID1,
				               $scope.transDirection(con[i].direction1),con[i].instrumentID2,$scope.transDirection(con[i].direction2),con[i].position,
				               $scope.transcombInstrumentIDS(con[i].combInstrumentID),parseFloat(con[i].margin).toFixed(2)]
				$scope.subCombPositionDetailDataset.push(tempArr);
				con[i].index = index;
	    	
			}
		$scope.listEntitys = con;
		//重新绘表
	    $scope.subCombPositionDetailTable.clear().draw();
        $scope.subCombPositionDetailTable.rows.add($scope.subCombPositionDetailDataset ).draw();
        $scope.isQuery = false;
		$scope.$apply();
		});
	};
	setTimeout(function(){
		$scope.find();
	},1000)
  
});


