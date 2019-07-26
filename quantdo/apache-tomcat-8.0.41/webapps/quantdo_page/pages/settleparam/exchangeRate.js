myapp.controller('ExchangeRateController', function ($scope, $timeout,$rootScope) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
    //初始化页面信息
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});		
	// 按钮权限
	$scope.exchangeRate_query = isShow("exchangeRate_query");
	$scope.exchangeRate_add = isShow("exchangeRate_add");
	$scope.exchangeRate_import = isShow("exchangeRate_import");
	$scope.exchangeRate_batchDelete = isShow("exchangeRate_batchDelete");
	$scope.exchangeRate_update = isShow("exchangeRate_update");
	$scope.exchangeRate_delete = isShow("exchangeRate_delete");

	
	$scope.ModalEntity = {};
	$scope.UploadEntity = {};
	$scope.delLists = [];	//批量删除列表
	$scope.isSelected = false;	//是否勾选删除
	
    getAllExchangeRateEntity(function (result) {
        $scope.listEntitys = result;
        $scope.$apply();
    });
    $scope.currenys = clearConstant.currenys;
    
    $scope.transCurrencys = function(key){
    	for(var i = 0;i < $scope.currenys.length;i++){
    		if($scope.currenys[i].key == key){
    			return $scope.currenys[i].text;
    		}
    	}
    }

    //checkbox个别选择事件
	$scope.changeSelected = function(x,entity){
		if(x){
			$scope.delLists.push(entity);
		}else{
			var index = $scope.delLists.indexOf(entity);
			$scope.delLists.splice(index, 1);
		}
	};
    
	//全选按钮事件
	$scope.chooseAll = function(){
		if($scope.isSelected == false){
			$scope.isSelected = true;
			$scope.delLists = angular.copy($scope.listEntitys);
		}else{
			$scope.isSelected = false;
			$scope.delLists = [];
		}
	};
    //$scope.queryEntity = {'currency': $scope.currenys[0].key, 'exchangeCurrency': $scope.currenys[0].key};

    $scope.Accounts = {};
    //初始化内部账户下拉列表
    getAllAccounts(function (result) {
        $scope.Accounts = result;
    });

    //查询
//    $scope.find = function (queryEntity) {
//        //clear
//        $scope.listEntitys = {}; 
//        $scope.isQuery = true;
//        findExchangeRateEntity(function (result) {
//            $scope.listEntitys = result;
//            $timeout(function() {
//            	$scope.isQuery = false;
//            	$scope.$apply();
//              }, 1500);
//        }, queryEntity);
//    };

    //删除
    $scope.remove = function (index, entity) {
    	layer.confirm("确定删除该条数据",{icon: 3},function(count){
    		deleteExchangeRateEntity(function(result){
    			$scope.listEntitys.splice(index, 1);
                $scope.$apply();
                layer.close(count);
                // 查询
                $scope.find();
    		},entity);
    	});
        
    };
    
    //批量删除
	$scope.delExchangeRateList = function() {
		// 批量删除
		$scope.delLists = $scope.getRemoveEntitys();
		if($scope.delLists.length > 0){
			layer.confirm('确定批量删除？', {
				icon : 3
			}, function(count) {
				angular.forEach($scope.delLists,function(value,index,list){
					deleteExchangeRateEntity(function(result){
						if(index == list.length - 1){
							getAllExchangeRateEntity(function (result) {
						        $scope.listEntitys = result;
						        layer.msg("删除信息成功", {
									icon : 1
								});
						        $scope.delLists = [];
								$scope.isSelected = false;
						        layer.close(count);
						        // 查询
		                        $scope.find();
						        $scope.$apply();
						    });
						}
					},value);
				});
			});
		}else{
			layer.msg('请选择要删除的汇率信息', {
				icon : 2
			});
		}
	};

    function formValidateReset(){
    	$scope.myForm.exchangeDate.$setPristine();
    	$scope.myForm.exchangeTime.$setPristine();
    	$scope.myForm.exchangeRate.$setPristine();
    }    
    //初始化模态窗
    $scope.initParameter = function () {
    	$scope.ModalEntity = {};
    	$scope.ModalEntity.exchangeDate = clearConstant.formatDate(new Date());
        $scope.ModalEntity.exchangeTime = clearConstant.currentTime();
    	$scope.ModalEntity.currency = $scope.currenys[0].key;
    	$scope.ModalEntity.exchangeCurrency = $scope.currenys[0].key;
    	formValidateReset();
    	$scope.isUpdate = false;
    };

    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        $scope.ModalEntity.exchangeRate = entity.exchangeRate.toFixed(6);
        formValidateReset();
        $scope.isUpdate = true;
        $scope.$apply();
    };

    // 保存操作记录
    $scope.save = function (entity) {
    	var rate =entity.exchangeRate;
    	if(rate ==0){
    		layer.msg("汇率不可为0", {icon: 2, time: 3000});
			return false;
    	}
        var index = entity.recordIndex;    
        var tableIndex = entity.index;
        //增加
        if (index == undefined) {
        	findExchangeRateWhetherRepeat(function(oresult){
        		if(oresult != null && oresult.length > 0){
        			layer.msg("当日该汇率转换信息已经设置，请勿重复新增",{icon: 2,time: 1500});
        			return false;
        		}else{
        			saveExchangeRateEntity(function(result){
                        $scope.listEntitys.unshift(result);
                        $scope.$apply();
                        //关闭窗口
                        $("#exchangeRateModal").modal("hide");
                        // 查询
                        $scope.find();
                    },entity);
        		}
        	},entity);

            //修改
        } else {
            updateExchangeRateEntity(function(result){
            	result.index = tableIndex;
        		$scope.listEntitys.splice(tableIndex-1, 1, result);  
        		entity.exchangeRate = (+entity.exchangeRate).toFixed(6);
                $scope.productTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 7){
                            this.data(entity.exchangeRate);
                            $scope.$apply();
                        }
                        
                    }
                });
                //关闭窗口
                $("#exchangeRateModal").modal("hide");
                // 查询
                //$scope.find();
            },entity);

        }
        
    };
    
    
    //Begin导入结算价----------------------------------------------------------------

    $("#exchangeRateFileuploader").uploadFile({
  	  dragdropWidth: 125,
        uploadStr:"Excel导入",
        dragDropStr: "",
        showAbort: false,
        dragDropContainerClass:"",
      url: framework.file.uploadUrl("exchangeRateService", "uploadExcel", [clearConstant.formatDate(new Date()), null]),
      fileName: "file",// 名字不能改
      onSuccess: function (files, response, xhr, pd) {
          framework.file.uploadCallback(response,function(errCode,errMsg,result) {
              if(errCode != 0) {
                  layer.msg(errMsg,{icon: 2});
              } else {
              	if(result != null){
              		if(result.code == '1'){
              			layer.msg("成功导入"+result.info+"条记录！", {icon: 1, time: 1500});
      					getAllExchangeRateEntity(function(iresult){
                              $scope.listEntitys = iresult;
                              $scope.$apply();
                              $scope.queryBrIds = angular.copy($scope.listEntitys);
                              $("#exchangeRateUploadModal").modal("hide");
                          });
              		}else if(result.code == '0'){
              			layer.msg(result.info, {icon: 2, time: 1500});
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
    //end --
    
    //定义产品基础信息的固定列头
    $scope.product_columns = [
        {title:"<a class='click-choice-all'></a>"},
        {title: "序号"},
        {title: "id",visible:false},
        {title: "汇率日期"},
        {title: "汇率时间"},
        {title: "币种"},
        {title: "转换币种"},
        {title: "汇率"},
        {title: "操作员"},
        {title: "操作日期"},
        {title: "操作时间"},
        {title: "操作"}
    ]; 
    $("body").undelegate("#exchangeRate_dynamic_table_wrapper td .update-row","click");
     $("body").delegate("#exchangeRate_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[2];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.ModalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateParam(id,$scope.ModalEntity);
    });
     $("body").undelegate("#exchangeRate_dynamic_table_wrapper td .delete-row","click");
     $("body").delegate("#exchangeRate_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.productTable.row(mytr).data();
        var id = tempArr[2];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.ModalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove(id,$scope.ModalEntity);
    });
 // 查询(前台分页)
    $scope.find = function(queryEntity){
    	//将数据集赋值为空
    	$scope.productDataset = [];
    	//更新表格对应的数据集
    	findExchangeRateEntity(function (result) {
    		var con = result;
    		$scope.listEntitys = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	// checkbox
            	var checkBox = "<a class='click-choice-one'></a>";
            	// 操作列
            	var operate = "";
            	if($scope.exchangeRate_update){
                	operate = operate.concat("<a class='update-row' data-toggle='modal' data-target='#exchangeRateModal'>修改</a>");
            	}if($scope.exchangeRate_delete){
                	operate = operate.concat( "<a class='delete-row' data-toggle='modal'>删除</a>");
            	}
        	
                var tempArr = [checkBox,(i+1),con[i].id,con[i].exchangeDate,con[i].exchangeTime,$scope.transCurrencys(con[i].currency),$scope.transCurrencys(con[i].exchangeCurrency),con[i].exchangeRate.toFixed(6),con[i].operatorID,con[i].operateDate,con[i].operateTime,
                               operate];
	            $scope.productDataset.push(tempArr);
	            con[i].index = i+1;
            }
            $scope.listEntitys = con;
            //重新绘表
            $scope.productTable.clear().draw();
            $scope.productTable.rows.add($scope.productDataset).draw();
        },queryEntity);  	
    }
    
 // 初始化
    $timeout(function() {
    	  $scope.find({});
    }, 500);
 
  //获取需要删除的集合
	$scope.getRemoveEntitys = function(){
			var tmpEntitys = [];
			//复选框选中列ID
	  	  	$scope.ids = new Array();
	  	  	$("#exchangeRate_dynamic_table a").each(function(){
	  	  		var flag = $(this).hasClass("clicked-choice-one");
			  	  		if(flag){
				  	  		var mytr = $(this).parents("tr");
					        var tempArr = $scope.productTable.row(mytr).data();
					        var id = tempArr[2];//获取该行对应的id
					  	  	$scope.ids.push(id);
			  	  	    }
	          });
	  	      for(var i=0;i<$scope.listEntitys.length;i++){
					for(var j=0;j<$scope.ids.length;j++){
						if($scope.listEntitys[i].id==$scope.ids[j]){
							tmpEntitys.push($scope.listEntitys[i]);
						}
					}
			  }		
			  return tmpEntitys;
	}
	 $("body").undelegate("#exchangeRate_dynamic_table td a","click");
    $("body").delegate("#exchangeRate_dynamic_table td a","click",function(){
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
    	$scope.productTable = $('#exchangeRate_dynamic_table').DataTable( {
    		data : $scope.productDataset,
        	columns :$scope.product_columns,
//        	scrollY: 300,
//          scrollX: true,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			   
			]
        } );
    });
});

