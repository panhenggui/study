myapp.controller('MemberController', function ($scope, $rootScope,$timeout) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	//1、实例化服务接口
	//1.1、会员服务接口
	$scope.service = new com.quantdo.orgClear.service.MemberService();
	//1.2、公用查询服务接口
	$scope.commonQueryservice = new com.quantdo.orgClear.service.CommonQueryService();	
	$scope.MemberDataset = [];
	
	// 按钮权限
	$scope.member_query = isShow("member_query");
	$scope.member_add = isShow("member_add");
	$scope.member_update = isShow("member_update");
	$scope.member_delete = isShow("member_delete");

	//定义固定列头
    $scope.Member_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "经纪公司代码"},
        {title: "交易所代码"},
        {title: "会员代码"},
        {title: "操作员"},
        {title: "操作日期"},
        {title: "操作时间"},
        {title: "操作"}
	];
	
	//2、定义页面数据模型
    $scope.queryEntity = {};
    $scope.tempEntity={};
    $scope.modalEntity = {};
    //初始化经纪公司信息
    $scope.brokerageEntitys=[];
    queryBkIdByBrkType(function (result) {
        $scope.brokerageEntitys.push(result);
        $scope.$apply();
    });
    
    
    //3、定义方法
    //3.1、查询会员
/*    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};
        $scope.isQuery = true;
        $scope.service.findByCondition(queryEntity,function (result) {
            $scope.listEntitys = result;
            $scope.$apply();
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        });
    }; */
    $("body").undelegate("#Member_dynamic_table_wrapper td .update-row","click");
    //表格修改事件
    $("body").delegate("#Member_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.MemberTable.row(mytr).data();
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
    $("body").undelegate("#Member_dynamic_table_wrapper td .delete-row","click");
    //表格删除事件
    $("body").delegate("#Member_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.MemberTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
       $scope.remove($scope.modalEntity,id);
    });

    // 根据页面条件查询
    $scope.find = function () {  	
    	$scope.isQuery = true;
		$scope.MemberDataset = [];
		$scope.listEntitys = [];
		$scope.service.findByCondition($scope.queryEntity,function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator = "";
				if($scope.member_update){
					operator = operator.concat("<a class='update-row' data-toggle='modal' data-target='#memberModal'>修改</a>");
				}if($scope.member_delete){
					operator = operator.concat("<a class='delete-row'>删除</a>");
				}
//				var operator = "<a class='update-row' data-toggle='modal' data-target='#memberModal'>修改</a><a class='delete-row'>删除</a>"
		    	var tempArr = [(i+1),con[i].id,con[i].brokerageFirmID,con[i].exchID,con[i].memberID,con[i].operatorID,con[i].operateDate
								        ,con[i].operateTime,operator]
		    	con[i].index = tempArr[0];
		    	$scope.MemberDataset.push(tempArr); 
			}
			$scope.listEntitys = con;
			//重新绘表
	        $scope.MemberTable.clear().draw();
	        $scope.MemberTable.rows.add($scope.MemberDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		});
    };
    
    //3.2、保存会员
    $scope.save = function (entity) {    	
        var index = entity.id;
        var tableIndex = entity.index;
        //增加
        if (index == undefined) {
        	 $scope.service.findByPmk(entity,function (fresult) {
        		 if(fresult.length > 0){
                  	layer.msg('此交易所会员已存在，请选择其他交易所后提交！', {
      					icon : 2
      				});
      				return false;
      			} else {
      				$scope.service.add(entity,function (result) {
      	        		$scope.listEntitys.push(result);
      	        		$scope.$apply();
      	        		
      	        		        		
      	        		layer.msg("会员信息保存成功!", {icon : 1,time : 2000});
      	                $scope.find();
      	        	});
      				 //关闭窗口
      		        $("#memberModal").modal("hide");
      			}       		 
             });
        	          	    		
            //修改
        } else {
        	$scope.service.update(entity,function (result) {
        		result.index = tableIndex;
        		$scope.listEntitys.splice(tableIndex-1, 1, result);  
        		      		
        		$scope.MemberTable.cells().every( function () {
	                    if((tableIndex-1) == this[0][0].row){
	                        if(this[0][0].column == 2){
	                            this.data(entity.brokerageFirmID);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 3){
	                            this.data(entity.exchID);
	                            $scope.$apply();
	                        }
	                        if(this[0][0].column == 4){
	                            this.data(entity.memberID);
	                            $scope.$apply();
	                        }
	                    }

	            });
        		layer.msg("会员信息保存成功!", {icon : 1,time : 2000});
        		//$scope.find();
        	});  
        	 //关闭窗口
            $("#memberModal").modal("hide");
        }
       
    };    
    
    
    //3.3、删除会员
    $scope.remove = function (entity,index) {
        //使用内置Index      
    	layer.confirm('确定删除该会员信息？', {icon: 3}, function (count) {
	    	$scope.service.remove(entity.id,function (result) {
	        	$scope.listEntitys.splice(index, 1);
	    		$scope.$apply();    		
	        	layer.msg("会员信息记录删除成功!", {icon : 1,time : 2000});
	        	$scope.find();
	    	});  
    	});
    };    
    //3.4、初始化新增页面的参数
    $scope.initAddParam = function () {
        $scope.modalEntity = {};     
        $scope.modalEntity.exchID = $scope.exchangeDatas[0].exchID;
        $scope.modalEntity.brokerageFirmID =$scope.brokerageEntitys[0].brokerageFirmID;
        $scope.isUpdate = false;
        $scope.formValidateReset();
     };    
    //3.5、初始化个性页面的参数
     $scope.initUpdateParam = function (entity,index) {         
         $scope.tempEntity = angular.copy(entity);
         $scope.tempEntity.recordIndex = index;        
         $scope.modalEntity = angular.copy($scope.tempEntity);
         $scope.isUpdate = true;
         $scope.formValidateReset();
         //$("[forType='date']").datepicker('remove');
     };
     //3.6、表单校验信息重置
     $scope.formValidateReset = function (){
    	 $scope.myForm.brokerageFirmID.$setPristine();
     	$scope.myForm.exchID.$setPristine();
     	$scope.myForm.memberID.$setPristine();
     }     
    
    //4、数据初始化        
    //4.1、进入页面时调用查询方法
    $scope.find($scope.queryEntity);
    //4.2 初始化交易所信息
    $scope.commonQueryservice.getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    });
    
    
	//初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.MemberTable = $('#Member_dynamic_table').DataTable( {
			    		data : $scope.MemberDataset,
			        	columns :$scope.Member_columns,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
      });
    
      
});

