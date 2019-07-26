myapp.controller('uploadHoldFundController', ['$scope', 'Upload','$rootScope', function ($scope, Upload,$rootScope) {
	$scope.modalEntity = {};
	$scope.updateIndex;

	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;

    $("[forType='date']").datepicker({
        language: 'zh-CN',
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: 'yyyymmdd'
    });
    $scope.brokerID = '';
//    queryFunds(function (result) {
//        $scope.tradeEntitys = result;
//    });

    $scope.startDate = clearConstant.formatDate(new Date());

    $scope.uploadHoldFund_import = isShow("uploadHoldFund_import");
    
    // jquery upload
    $("#fileuploader").uploadFile({
        url: framework.file.uploadUrl("uploadFundService", "importFund"),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
        	framework.file.uploadCallback(response,function(errCode,errMsg,result) {
        		  if(result.errorFlg != "succ") {                	
                      layer.msg(result.errorMessages,{icon: 2});
                  } else {
              	  layer.msg("成功导入" + result.succCon +"条数据",{icon: 1});
              	  // 更新数据
				  $scope.find();
//   					  queryFunds(function (result) {
//   		                  $scope.tradeEntitys = result;
//   		                  $scope.$apply();
//   		              });
   				  }
           });
        },
        onSelect: function (files) {
            var settleDate = $("#settleDate").val();
            var fileName = files[0].name;
            if (!fileName.endWith("txt")) {
                jqueryConst.showMsg(2001);
                return false;
            }
            framework.service.request('uploadFundService', 'getDate', settleDate, function (errCode, errMsg, result) {
                if (errCode > 0) {
                    console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                }
            });
            return true;
        }
    });
    
    $("#excelImport").uploadFile({
    	  dragdropWidth: 125,
          uploadStr:"Excel导入",
          dragDropStr: "",
          dragDropContainerClass:"",
        url: framework.file.uploadUrl("uploadFundService", "readExcelFile"),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
        	framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                if(errCode != 0) {
                    console.log(errCode);
                    layer.msg(errCode + ': ' + errMsg,{icon: 2});
                } else {
                	if(result.totNum){
    					layer.msg("成功导入"+result.totNum+"条记录！", {icon: 1, time: 3000});
    					// 更新数据
    					$scope.find();
//    					queryFunds(function (result) {
//    		                $scope.tradeEntitys = result;
//    		                $scope.$apply();
//    		            });
    				}else{
    					//导入失败
    					layer.msg(result.errorMes, {icon: 2, time: 10000});
    				}
                }

            });
        },
        onSelect: function (files) {
            var file = files[0];
            var fileName = file.name;
            var suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
            if(suffix == "xlsx" || suffix == "xls" ){
           /* 	if($scope.exchStatus.exchStatus == '1'){
        			layer.msg('当前系统状态为交易准备状态，不允许导入！', {icon: 2}, 3000);
        			return false;;
        		}else if($scope.exchStatus.exchStatus == '3'){
        			layer.msg('当前系统状态为结算状态，不允许导入！', {icon: 2}, 3000);
        			return false;
        		}*/
            } else {
                layer.msg('上传文件必须为Excel文件格式，例如：xlsx、xls', {icon: 2}, 3000);
                return false;
            }
        }
    });
    
    
    // 查询所有经济公司代码
    $scope.brokerages  = [];
    getAllBrokerageFirmEntity(function (result) {
        $scope.brokerages = result;
    })
    
    //初始化资金账户信息
    $scope.capitalAccountEntitys =[];
    $scope.initParameter = function () {
        getAllCapitalAccountEntity(function (result) {
            $scope.capitalAccountEntitys = result;
            $scope.$apply();
        });
    };

    
    $scope.saveAll = function(entity){
    	var reg=/^(-?\d*)\.?\d{1,3}$/;
    	for(var i=0;i<entity.length;i++){
    		if(entity[i].preBalance!=null){
    			entity[i].preBalance=entity[i].preBalance.replace(/[^\d.]/g,'').replace(/^\./g,'').replace(/\.{2,}/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.');
    		}
    		if(entity[i].preAvailable!=null){
    			entity[i].preAvailable=entity[i].preAvailable.replace(/[^\d.]/g,'').replace(/^\./g,'').replace(/\.{2,}/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.');
    		}
    		if(entity[i].margin!=null){
    			entity[i].margin=entity[i].margin.replace(/[^\d.]/g,'').replace(/^\./g,'').replace(/\.{2,}/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.');
    		}
    		
    		if(( entity[i].preBalance!=null &&!reg.test(entity[i].preBalance) )
    				|| ( entity[i].preAvailable!=null &&!reg.test(entity[i].preAvailable) )
    				|| ( entity[i].margin!=null &&!reg.test(entity[i].margin) )){
    			layer.msg("只能输入最多三位小数", {icon: 2, time: 3000});
                return false;
            }
    		
    	}
    	
    	var flag = false;
    	for(var i=0;i<entity.length;i++){
    		if(entity[i].preBalance==null || entity[i].preAvailable==null || entity[i].margin==null){
    			flag = true;
    			break;
    		}
    	}
    	
    	if(flag){
    		layer.confirm('数据没有填写完整，是否提交？', {icon:3}, function(count){
        		layer.close(count);
        		saveAllFund(function (result) {
            		queryFunds(function (result) {
                        $scope.tradeEntitys = result;
                        $("#myFundModal").modal("hide");
                        $scope.$apply();
                    });
                },entity);
        	});
    	}else{
    		saveAllFund(function (result) {
        		queryFunds(function (result) {
                    $scope.tradeEntitys = result;
                    $("#myFundModal").modal("hide");
                    $scope.$apply();
                });
            },entity);
    	}
    };
    
    $scope.updateInit = function(index,entity){
    	$scope.modalEntity = angular.copy(entity);
    	$scope.updateIndex = index;
    };
    
    $scope.saveUpdate = function(entity){
    	entity.preBalance=entity.preBalance.toString().replace(/[^\d.]/g,'').replace(/^\./g,'').replace(/\.{2,}/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.');
    	entity.preAvailable=entity.preAvailable.toString().replace(/[^\d.]/g,'').replace(/^\./g,'').replace(/\.{2,}/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.');
    	entity.margin=entity.margin.toString().replace(/[^\d.]/g,'').replace(/^\./g,'').replace(/\.{2,}/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.');
    	
    	
    	var reg=/^(-?\d*)\.?\d{1,3}$/;
        if(!reg.test(entity.preBalance) || !reg.test(entity.preAvailable) || !reg.test(entity.margin)){
        	layer.msg("只能输入最多三位小数", {icon: 2, time: 3000});
            return false;
        }
    	
    	saveFundUpdate(function (result) {
    		if(result!=undefined){
    			$scope.tradeEntitys.splice($scope.updateIndex, 1, entity);
    			$scope.$apply();
    			//关闭窗口
    		}
    		$("#fundUpdate_myModal").modal("hide");
        },entity)
    }
    
    //列头
    $scope.product_columns = [
        {title: ""},
        {title: "id",visible:false},
        {title: "经纪公司代码"},
        {title: "资金账号"},
        {title: "结算准备金"},
        {title: "可用资金"}
    ]; 
    
    // 查询(前台分页)
    $scope.find = function(){
    	$scope.productDataset = [];
    	//更新表格对应的数据集
    	queryFunds(function (result) {
    		var con = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var tempArr = [(i+1),con[i].id,con[i].brokerageFirmID, con[i].accountID, con[i].preBalance,con[i].preAvailable
                               ];
	            $scope.productDataset.push(tempArr);
            }
            //重新绘表
            $scope.productTable.clear().draw();
            $scope.productTable.rows.add($scope.productDataset).draw();
        });  	
    }
    
   // 初始化
    $scope.find();
 
    
  //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.productTable = $('#uploadHoldFund_dynamic_table').DataTable( {
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


}]);

