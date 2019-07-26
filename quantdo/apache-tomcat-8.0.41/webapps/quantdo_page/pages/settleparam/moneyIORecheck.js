myapp.controller('MoneyIORecheckController', function ($scope, $timeout,$rootScope) {
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	//1、实例化服务接口
	//1.1、 实例化出入金服务接口
	$scope.service = new com.quantdo.orgClear.service.TmpMoneyIOService();
	//1.2、 实例化内部资金服务接口
	$scope.capitalAccountService = new com.quantdo.orgClear.service.CapitalAccountService();
	
	
	//2、定义页面数据模型
    $scope.queryEntity = {"isRecheck":"0"};
    $scope.tempEntity={};
    $scope.modalEntity = {};
    $scope.moneyIORecheck_query = isShow("moneyIORecheck_query");
    $scope.moneyIORecheck_recheck = isShow("moneyIORecheck_recheck");
    
    //2.1、是否
    $scope.isNotDatas = clearConstant.isNotDatas;
    //2.2、 银行代码
    $scope.bankIDDatas = clearConstant.bankIDDatas;
    //2.3、 资源类型
    $scope.moneyTypeDatas = clearConstant.moneyTypeDatas;
    
    $scope.MoneyIORecheckDataset = [];  
    //定义固定列头
    $scope.MoneyIORecheck_column = [
           {title:"序号"},
           {title: "id",visible:false},
           {title: "结算日期"},
           {title: "资金账号"},
           {title: "银行代码"},
           {title: "银行账号"},
           {title: "出金"},
           {title: "入金"},
           {title: "资金类型"},
           {title: "备注"},
           {title: "操作日期"},
           {title: "操作时间"},
           {title: "是否复核"},
           {title: "复核员"},
           {title: "复核日期"},
           {title: "复核时间"},
 	  	   {title: "操作"}
     ]
    
    getAllBackAccountEntity(function (result) {
        $scope.bankAccounts = result;
    });
    
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
    };    */ 
    $("body").undelegate("#MoneyIORecheck_dynamic_table_wrapper td .update-row","click");
    //表格修改事件
    $("body").delegate("#MoneyIORecheck_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.MoneyIORecheckTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $timeout(function() {
        	$scope.initUpdateParam($scope.modalEntity,id);
        }, 500);
    });
    
    // 根据页面条件查询
    $scope.find = function () {  	
    	$scope.isQuery = true;
		$scope.MoneyIORecheckDataset = [];
		$scope.listEntitys = [];
		 $scope.service.findByCondition($scope.queryEntity,function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator = $scope.getRecheck($scope.moneyIORecheck_recheck);
		    	var tempArr = [(i+1),con[i].id,con[i].settleDate,con[i].innerAccountID,con[i].bankID,con[i].bankAccount,con[i].moneyOut,con[i].moneyIn
		    	               ,$scope.transMoneyType(con[i].moneyType),con[i].remark,con[i].operateDate,con[i].operateTime,$scope.getIsRecheck(con[i].isRecheck)
		    	               ,con[i].recheckerID,con[i].recheckDate,con[i].recheckTime,operator]
		    	$scope.MoneyIORecheckDataset.push(tempArr);
			}
			//重新绘表
		    $scope.MoneyIORecheckTable.clear().draw();
	        $scope.MoneyIORecheckTable.rows.add($scope.MoneyIORecheckDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		});
    };
    $timeout(function() {
    	  $scope.find();
    }, 1000);
    

    $scope.getRecheck = function(flag){
    	var result = "";
    	if(flag){
    		result = "<a class='update-row' data-toggle='modal' data-target='#myModal'>复核</a>"; 
    	}
    	return result;
    }
    
   
    $scope.getIsRecheck = function(isRecheck){
    	 var result = '';
    	 if(isRecheck==0){
    		 result = '否';
    	 }else if(isRecheck==1){
    		 result = '是';
    	 }
    	 return result;
    }
    
    //3.2、保存出入金
    $scope.rechecker = function (entity) {    	
        var index = entity.recordIndex;        
    	$scope.service.rechecker(entity.id,function (result) {
    		$scope.listEntitys.splice(index, 1);  
    		$scope.find();
    		$scope.$apply();        		
            layer.msg("出入金信息复核成功!",{icon: 1, time: 2000});
    	});  
        //关闭窗口
        $("#myModal").modal("hide");
    };    
    //3.3、删除出入金
    $scope.remove = function (entity,index) {
        //使用内置Index        
    	$scope.service.remove(entity.id,function (result) {
        	$scope.listEntitys.splice(index, 1);
    		$scope.$apply();    
    		$scope.find();
            layer.msg("出入金信息记录删除成功!",{icon: 1, time: 2000});
    	});       
    };         
    //3.4、初始化个性页面的参数
     $scope.initUpdateParam = function (entity,index) {         
         $scope.tempEntity = angular.copy(entity);
         $scope.tempEntity.recordIndex = index;        
         $scope.modalEntity = angular.copy($scope.tempEntity);
         if($scope.modalEntity.moneyIn>0){
        	 $scope.modalEntity.operType = 1;
         }else{
        	 $scope.modalEntity.operType = 2;
         }
         $scope.isUpdate = true;         
     };
      
    
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
		    	$scope.MoneyIORecheckTable = $('#MoneyIORecheck_dynamic_table').DataTable( {
			    		data : $scope.MoneyIORecheckDataset,
			        	columns :$scope.MoneyIORecheck_column,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
      });
});

