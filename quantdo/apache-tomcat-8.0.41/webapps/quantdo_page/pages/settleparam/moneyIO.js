myapp.controller('MoneyIOController', function ($scope, $timeout,$rootScope) {
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;

	//1、实例化服务接口
	//1.1、 实例化出入金服务接口
	$scope.service = new com.quantdo.orgClear.service.MoneyIOService();
	$scope.subMoneyIOService = new com.quantdo.orgClear.service.SubMoneyIOService();
	//1.2、 实例化内部资金服务接口
	$scope.capitalAccountService = new com.quantdo.orgClear.service.CapitalAccountService();
	
	
	//2、定义页面数据模型
    $scope.queryEntity = {"isRecheck":"0"};
    $scope.tempEntity={};
    $scope.modalEntity = {};
    $scope.moneyIO_query = isShow("moneyIO_query");

    //2.1、是否
    $scope.isNotDatas = clearConstant.isNotDatas;
    //2.2、 银行代码
    $scope.bankIDDatas = clearConstant.bankIDDatas;
    //2.3、 资源类型
    $scope.moneyTypeDatas = clearConstant.moneyTypeDatas;
    
    $scope.MoneyIODataset = [];  
    //定义固定列头
    $scope.MoneyIO_column = [
           {title:"序号"},
           {title: "id",visible:false},
           {title: "发生日期"},
           {title: "资金账号"},
           {title: "出金"},
           {title: "入金"},
           {title: "出入金类型"},
           {title: "备注"},
           {title: "操作员"},
           {title: "操作日期"},
           {title: "操作时间"}
     ]
    
    //子资金账号
/*    $scope.QuerySubAccounts = {};
    getAllSubAccounts(function(result){
        $scope.QuerySubAccounts = result;
        $scope.$apply();
    });*/
    
    //3、定义方法
    //3.1、查询出入金
/*    $scope.find = function (queryEntity) {
        $scope.listEntitys = {}; 
        $scope.isQuery = true;
        $scope.service.findByCondition(queryEntity,function (result) {
            $scope.listEntitys = result;
            $timeout(function() {
            	$scope.isQuery = false;
            	$scope.$apply();
              }, 1500);
        });
    };   */
    
    // 根据页面条件查询
    $scope.find = function () {  	
    	$scope.isQuery = true;
		$scope.MoneyIODataset = [];
		$scope.listEntitys = [];
		$scope.service.findByCondition($scope.queryEntity,function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
		    	var tempArr = [(i+1),con[i].id,con[i].settleDate,con[i].innerAccountID,con[i].moneyOut,con[i].moneyIn,$scope.transMoneyType(con[i].moneyType)
		    	               ,con[i].remark,con[i].operatorID,con[i].operateDate,con[i].operateTime]
		    	$scope.MoneyIODataset.push(tempArr);
			}
			//重新绘表
		    $scope.MoneyIOTable.clear().draw();
	        $scope.MoneyIOTable.rows.add($scope.MoneyIODataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		});
    };
    $timeout(function() {
    	  $scope.find();
    }, 1000);
    
    //4、数据初始化        
    //4.1、进入页面时调用查询方法
    $scope.find($scope.queryEntity);
    //4.2 日历控件
    $("[forType='date']").datepicker({
        language: 'zh-CN',
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: 'yyyymmdd'
    });
   //4.3 初始化内部账户下拉列表
    findActiveCapitalByBrokId(function (result) {
		 $scope.accountDatas = result;
		$scope.$apply();
   });
    
    //页面出入金类型转换
    $scope.transMoneyType = function (key) {
        var count = $scope.moneyTypeDatas.length;
        for (var i = 0; i < count; i++) {
            if ($scope.moneyTypeDatas[i].key == key) {
                return $scope.moneyTypeDatas[i].text;
            }
        }
    }
    
  //初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.MoneyIOTable = $('#MoneyIO_dynamic_table').DataTable( {
			    		data : $scope.MoneyIODataset,
			        	columns :$scope.MoneyIO_column,
			            dom: 'rt<"bottom"iplB>',
			            
						buttons: []
		        } );
      });
});

