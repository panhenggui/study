myapp.controller('InstrumentController', function ($scope, $timeout,$rootScope) {
    $("[forType='date']").datepicker({
        language: 'zh-CN',
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: 'yyyymmdd'
    });
    //定义页面查询对象
    $scope.queryEntity = {
        exchID: "",//交易所
        productID: "",//产品
        instrumentID: "",//合约
        productType:""//品种类别
//        optionSeriesID: ""//期权系列
    };
    
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;

    $scope.OptionSeriesQuery = {
        exchID: "",
        productID: ""
//        optionSeriesID: ""
    };
    $scope.OptionServes = {};
    $scope.ModalEntity = {};
    $scope.listEntitysIndex = new Array();
    $scope.listEntitys = {};
    $scope.OptionS = {};
    $scope.products = {};
    $scope.instrument_add = isShow("instrument_add");
    $scope.instrument_query = isShow("instrument_query");
    $scope.instrument_update = isShow("instrument_update");
    $scope.instrument_delete = isShow("instrument_delete");

    //初始化页面信息
/*    getAllInstrumentEntity(function (result) {
        $scope.listEntitys = result;
    });*/
    $scope.productTypes = clearConstant.productTypes;
    $scope.optionTypes = clearConstant.OptionTypes;
    $scope.exchangeDatas = [];

    //初始化交易所信息并默人选中第一个
    getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
        $scope.$apply();
    });

    $scope.productDatas = {};
    //初始化所有产品信息并默人选中第一个
    getAllValidProductEntity(function (result) {
        $scope.productDatas = result;
        $scope.products = angular.copy($scope.productDatas);
        $scope.$apply();
    });
    
    //交易所级联查询品种代码
    $scope.changeProductID = function(){
    	  var entity = $scope.queryEntity;
          //根据交易所ID和品种类别查询产品信息
          getProductByExchID(function (result) {
        	  $scope.productDatas = [];
              if(result !=undefined && result.length>0){
                  $scope.productDatas = result;
                  $scope.$apply();
              }

          }, {'exchID': entity.exchID, 'productID': '', 'productType': '', 'productStatus': ''});
    }

    //初始化所有期权系列并默人选中第一个
    getAllOptionSeries(function (result) {
        $scope.OptionServes = result;
        $scope.OptionS = angular.copy($scope.OptionServes);
    }, $scope.OptionSeriesQuery);

    var instrumentService =new com.quantdo.orgClear.service.InstrumentService();
	 $scope.otcApplyQuery = function ( opts ) {
	        return function ( request, drawCallback, settings ) {        	
	            var ajax          = false;
	            var requestStart  = request.start;
	            var drawStart     = request.start;
	            var requestLength = request.length;
	            var requestEnd    = requestStart + requestLength;
	            var page = drawStart/requestLength + 1;
	            // 获取settings中默认排序内容
	            $scope.orderType = settings.aaSorting[0][0];
	            var orderT = settings.aaSorting[0][1];
	            
	            if(orderT == "asc"){
	                $scope.orderWay = 1;
	            }else{
	                $scope.orderWay = 2;
	            }
	                request.start = requestStart;
	                var requestParams = {
	                    "pageNo":page,
	                    "pageSize":requestLength
	                }
	                instrumentService.queryAllInstrument($scope.queryEntity, requestParams, $scope.orderType, $scope.orderWay, function(result){
	                    var con = result.content;
	                    $scope.result = con;
	                    var tempArray = new Array();
	                    $scope.listEntitysIndex.splice(0,$scope.listEntitysIndex.length);
	                    for(var i = 0; i<con.length;i++){
	                    	if (con[i].delivDate == undefined || con[i].delivDate == null || con[i].delivDate.length < 1){
	                    		con[i].delivDate = "";
	                    	} else if(con[i].delivDate.length == 5){
	                    		con[i].delivDate = con[i].delivDate.slice(0,4).concat("0").concat(con[i].delivDate.slice(4));
	                    	}else if(con[i].delivDate.length == 2){
	                    		con[i].delivDate = "";
	                    	}
	                    	$scope.temEntity=con[i];
	                    	$scope.temIndex=i;
	                    	
	                    	var operate1 = $scope.getUpdatePermision($scope.instrument_update); 
	                    	var operate2 = $scope.getDeletePermision($scope.instrument_delete);

	                        // 状态
		                	for(var x in $scope.productTypes){
		                		if($scope.productTypes[x].key ==con[i].productType){
		                			con[i].productType = $scope.productTypes[x].text;
		                		}
		                	}
		                	// 持仓
		                	for(var x in $scope.positionTypes){
		                		if($scope.positionTypes[x].key ==con[i].positionType){
		                			con[i].positionType = $scope.positionTypes[x].text;
		                		}
		                	}
		                	//合约状态
		                	for(var x in $scope.instrumentStatus){
		                		if($scope.instrumentStatus[x].key ==con[i].instrumentStatus){
		                			con[i].instrumentStatus = $scope.instrumentStatus[x].text;
		                		}
		                	}
		                	var tempArr = [con[i].exchID,con[i].productID,con[i].instrumentID,con[i].instrumentName,con[i].delivDate,
		                                   con[i].productType,con[i].openDate, con[i].endTradeDate, con[i].volumeMultiple,
		                                   con[i].qtyUnit, con[i].positionType,con[i].tick, con[i].instrumentStatus, operate1+operate2,con[i].id,con[i].strikePrice];
		                    tempArray.push(tempArr);
		                    con[i].index = i+1;
		                    $scope.listEntitysIndex[i] = con[i].id;
	                    }
	                    $scope.listEntitys = con;
	                    var json = {
	                        "draw":request.draw,
	                        "recordsTotal":result.totalRecord,
	                        "recordsFiltered":result.totalRecord,
	                        "data":tempArray,
	                        "column":[13]
	                    }
	                    drawCallback( json );
	                });
	        }
	    };
	    
	    //获取修改权限
	    $scope.getUpdatePermision = function(flag){
	    	  var result = "";
	    	  if(flag){
	    		  result = "<a class='update-row' data-toggle='modal' data-target='#instClientModal'>修改</a>";
	    	  }
	    	  return result;
	    }
	    //获取删除权限
	    $scope.getDeletePermision = function(flag){
	    	  var result = "";
	    	  if(flag){
	    		  result = "<a class='delete-row' >删除</a>";
	    	  }
	    	  return result;
	    }
	    
	
	 //初始化
   $(document).ready(function() {
   	initPage();
   });
   
   function initPage(){
   	//会话列表初始化
   	$scope.InstrumentTable = $('#instrument_table').DataTable( {
       	columns :[
     				{ title: "交易所代码" },
     				{ title: "品种代码" },
     				{ title: "合约代码" },
     				{ title: "合约名称" },
     				{ title: "交割期" },
     				{ title: "合约类别" },
     				{ title: "上市日" },
     				{ title: "最后交易日" },
     				{ title: "合约乘数" },
     				{ title: "报价单位" },
     				{ title: "持仓类型" },
     				{ title: "最小变动价位" },
     				{ title: "合约状态" },
     				{ title: "操作" },	
     				{ title: "" },
     				{ title: "行权价",visible:false}
     			
     		],
           "processing": true,
           "serverSide": true,
           "bFilter": false,
           dom: 'rt<"bottom"iplB>',
			buttons: [
			],
			fixedColumns:   {
                leftColumns: 0,
                rightColumns: 3
            },
           "aaSorting" : [[2, "asc"]], // 默认的排序方式，按日期降序
           "aoColumnDefs": [
               { "bSortable": false, "aTargets": [] },
               {
                   "aTargets": [1],
                   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                       
                   }
               },
 		      {
 		          "targets": [ 14 ],
 		          "visible": false
 		        }                
           ],
           "ajax": $scope.otcApplyQuery({}),
/*           "scrollY": 360,
           "scrollCollapse":true,*/
			"scrollX": true
   } );
   }
	
// 查询(后台分页)
   $scope.find = function(queryEntity){
   	 $scope.isQuery = true;
        $scope.queryEntity=angular.copy(queryEntity);
   	var table = $('#instrument_table').DataTable();
       table.draw();
       $timeout(function() {
       	  $scope.isQuery = false;
		}, 500);
   }
// 删除
   $scope.delteFlag = false;
   localStorage.lastname="aa";
   $("body").undelegate("#instrument_table_wrapper td .delete-row","click");
   $("body").delegate("#instrument_table_wrapper td .delete-row","click",function(event){
   	event.stopPropagation();
   	if(localStorage.lastname == "aa"){
   		$scope.delteFlag = true;
   	}
   	var table = $("#instrument_table").DataTable();
       if($scope.delteFlag)
       	{
	        	var mytr = $(this).parents('tr');
	        	localStorage.lastname = mytr[0].nodeName;
	            var tempArr = table.row(mytr).data();
	            var delId = tempArr[14];
	            layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
	            	table.row(mytr).remove().draw(false);
	            	 deleteInstrumentEntity(function () {
	            		 $scope.find($scope.queryEntity);
	            		 $scope.$apply();
	                 }, delId);
	            	 layer.close(count);
	            });
       	}
       
   });
   
   
    
    
    

  /*  //查询
    $scope.find = function (queryEntity) {
        //clear
        $scope.listEntitys = {};
        $scope.isQuery = true;
        findInstrumentEntity(function (result) {
            $scope.listEntitys = result;
            $timeout(function() {
            	$scope.isQuery = false;
            	$scope.$apply();
              }, 1500);
        }, queryEntity);
    };

    //删除
    $scope.remove = function (index, entity) {
        layer.confirm('确定删除此合约吗？', {icon: 3}, function (count) {
            deleteInstrumentEntity(function () {
                $scope.listEntitys.splice(index, 1);
                $scope.$apply();
            }, entity.id);
            layer.close(count);
        });
    };*/

    //持仓方式
    $scope.positionTypes = clearConstant.positionTypes;
    //交割方式
    $scope.delivModes = clearConstant.delivModes;
    //交割类型
    $scope.delivTypes = clearConstant.delivTypes;
    //行权类型
    $scope.executeTypes = clearConstant.executeTypes;
    //合约状态
    $scope.instrumentStatus = clearConstant.instrumentStatus;

    //重置表单验证信息
    function formValidateReset() {
    	$scope.myForm.exchID.$setPristine();
        $scope.myForm.instrumentID.$setPristine();
        $scope.myForm.instrumentName.$setPristine();
        $scope.myForm.productID.$setPristine();
        $scope.myForm.endTradeDate.$setPristine();
//        $scope.myForm.strikePrice.$setPristine();
        $scope.myForm.delivDate.$setPristine();
    }

    //初始化模态窗
    $scope.initParameter = function () {
        $scope.ModalEntity = {};
        $scope.isShow = true;
        $scope.isUpdate = false;
        $scope.products = angular.copy($scope.productDatas);
        $scope.OptionS = angular.copy($scope.OptionServes);
        $scope.ModalEntity.productType = $scope.productTypes[0].key;
        $scope.ModalEntity.optionType = $scope.optionTypes[0].key;
        $scope.ModalEntity.instrumentStatus = $scope.instrumentStatus[1].key;
        $scope.OptionS = {};
        $scope.productChange($scope.products[0].productID);
        formValidateReset();
    };

    $scope.productChange = function (productID) {
        for (var i = 0; i < $scope.productDatas.length; i++) {
            if ($scope.productDatas[i].productID == productID) {
                $scope.ModalSelectedProduct = $scope.productDatas[i];
                break;
            }
        }
        angular.forEach($scope.products, function (data, index, array) {
            if (productID == data.productID) {
                $scope.ModalEntity.volumeMultiple = data.volumeMultiple;
                $scope.ModalEntity.tick = data.tickStr;
                $scope.ModalEntity.positionType = data.positionType;
                $scope.ModalEntity.delivMode = data.delivMode;
//                $scope.ModalEntity.delivRemindDate = data.delivRemindDate;
            }
        });
        $scope.getOptionSeriesByProduct(productID);
    };

    //根据产品代码查询期权合约信息
    $scope.getOptionSeriesByProduct = function (productID) {
//        $scope.ModalEntity.optionSeriesID = "";
        $scope.OptionS = {};
        findOptionSeriesEntity(function (result) {
            if(result.length>0){
                $scope.OptionS = result;
//                $scope.ModalEntity.optionSeriesID = $scope.OptionS[0].optionSeriesID;
                $scope.$apply();
            }
        }, {exchID: "", productID: productID })
    };

    //根据交易所下拉列表初始化产品信息
    $scope.changeExch = function (exchId) {
        //根据交易所ID查询产品信息
        $scope.ModalEntity.productID = "";
//        $scope.ModalEntity.optionSeriesID = "";
        $scope.OptionS = {};

        if ("SGE" == exchId) {
        	 $scope.ModalEntity.delivDate = "--------";
             $scope.ModalEntity.endTradeDate = "--------";
             $scope.notTouch = true;
        }else{
        	 $scope.ModalEntity.delivDate = "";
             $scope.ModalEntity.endTradeDate ="" ;
             $scope.notTouch = false;
        }
    };
    $scope.changeProductType = function (exchId,productType) {
        //根据交易所ID查询产品信息
        $scope.ModalEntity.productID = "";
        $scope.ModalEntity.instrumentID = "";
        $scope.ModalEntity.instrumentName = "";
//        $scope.ModalEntity.optionSeriesID = "";
        $scope.OptionS = {};
       
            getProductByExchID(function (result) {
                $scope.products = {};
                if(result !=undefined && result.length>0){
                    $scope.products = result;
                    $scope.ModalEntity.productID = $scope.products[0].productID;
                    $scope.productChange($scope.ModalEntity.productID);
                    if(productType!='3'){
                    	$scope.createInstrumentID($scope.ModalEntity.productID,$scope.ModalEntity.delivDate);
                        $scope.changeInstrumentName($scope.ModalSelectedProduct);
                    }
                    $scope.$apply();
                }
            }, {'exchID': exchId, 'productID': '', 'productType': productType, 'productStatus': ''});
    };
    
    $scope.changeInstrumentName = function (ModalSelectedProduct) {
        var productName = ModalSelectedProduct.productName;
        var delivDate = $scope.ModalEntity.delivDate;
        if (productName == undefined) {
            productName = "";
        }
        if (delivDate == undefined) {
            delivDate = "";
        }
        var exchID = $scope.ModalEntity.exchID;
        var tempDate = delivDate;
        if(exchID!='LME')
        {
            tempDate = delivDate.substring(2,6);
        }
        if (tempDate =="----") {
            $scope.ModalEntity.instrumentName = productName;
        }else {
            $scope.ModalEntity.instrumentName = productName + "" + tempDate;
        }

    }
    
    
    
    

    //修改
    $scope.initUpdateParam = function (index, entity) {
        $scope.isShow = false;
        $scope.isUpdate = true;
        $scope.products = angular.copy($scope.productDatas);
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.ModalEntity = {};
        $scope.ModalEntity = angular.copy($scope.tempEntity);
        $scope.productChange($scope.ModalEntity.productID);
        formValidateReset();
    };
    // 保存操作记录
    $scope.save = function (entity) {
    	var index = entity.id;
    	for(var i=0;i<$scope.listEntitysIndex.length;i++){
    		if($scope.listEntitysIndex[i] == index){
    			var tableIndex = i+1;
    			break;
    		}
    	}
        //增加
        if (index == undefined) {
        	findByInstrumentID(function (result) {
                if (result.length > 0) {
                    layer.msg("合约已存在，不能重复添加", {icon: 2, time: 3000});
                    return false;
                } else {
                    saveInstrumentEntity(function (result) {
                    	 $scope.find($scope.queryEntity);
                      //关闭窗口
                        $("#instrumentModal").modal("hide");
                    }, entity);
                }
            }, entity);
            //修改
        } else {
        	findByInstrumentID(function (result) {
                if (result.length > 0 && result[0].instrumentID != entity.instrumentID) {
                    layer.msg("合约已存在，不能重复添加", {icon: 2, time: 3000});
                    return false;
                } else {
                	updateInstrumentEntity(function (result) {
                		result.index = tableIndex;
                		$scope.listEntitys.splice(tableIndex-1, 1, result);  
                		      		
                		$scope.InstrumentTable.cells().every( function () {
        	                    if((tableIndex-1) == this[0][0].row){
        	                        if(this[0][0].column == 3){
        	                            this.data(entity.instrumentName);
        	                            $scope.$apply();
        	                        }
        	                        if(this[0][0].column == 12){
        	                        	for(var x in $scope.instrumentStatus){
        			                		if($scope.instrumentStatus[x].key ==entity.instrumentStatus){
        			                			entity.instrumentStatus = $scope.instrumentStatus[x].text;
        			                		}
        			                	}
        	                            this.data(entity.instrumentStatus);
        	                            $scope.$apply();
        	                        }
        	                        
        	                    }

        	            });
                      //关闭窗口
                        $("#instrumentModal").modal("hide");
                    }, entity);
                }
            }, entity);
        }
    };

    $scope.continueSaveIns = function (entity) {
        //判断增加的信息是否重复
    	findByInstrumentID(function (result) {
            if (result.length > 0) {
                layer.msg("合约已存在，不能重复添加", {icon: 2, time: 3000});
                return false;
            } else {
                saveInstrumentEntity(function (result) {
                    $scope.find();
                    $scope.ModalEntity.delivDate = "";
                    $scope.$apply();
                }, entity);
            }
        }, entity);
    };

    /**
     * 根据产品代码和交割期生成合约代码
     */
    $scope.createInstrumentID = function (productID, delivDate) {
        if (productID == undefined) {
            productID = "";
        }
        if (delivDate == undefined) {
            delivDate = "";
        }
        if($scope.ModalEntity.productType=='3'){
        	return false;
        }
        //根据交易所格式化日期
        var exchID = $scope.ModalEntity.exchID;
        var tempDate = delivDate;
        if(exchID!='LME')
        {
            tempDate = delivDate.substring(2,6);
        }if (tempDate =="----"){
            $scope.ModalEntity.instrumentID = productID
        }else {
            $scope.ModalEntity.instrumentID = productID + "" + tempDate;
        }

    };


    $scope.createInstrumentName = function (object) {
        var productName = object.ModalSelectedProduct.productName;
        var delivDate = $scope.ModalEntity.delivDate;
        if($scope.ModalEntity.productType=='3'){
        	return false;
        }       
        if (productName == undefined) {
            productName = "";
        }
        if (delivDate == undefined) {
            delivDate = "";
        }
        var exchID = $scope.ModalEntity.exchID;
        var tempDate = delivDate;
        if(exchID!='LME')
        {
            tempDate = delivDate.substring(2,6);
        }
        if (tempDate == "----" ){
            $scope.ModalEntity.instrumentName = productName;
        } else{
            $scope.ModalEntity.instrumentName = productName+ "" + tempDate;
        }


    }
    
    $("body").undelegate("#instrument_table_wrapper td .update-row","click");
//  修改按钮点击事件
    $("body").delegate("#instrument_table_wrapper td .update-row","click",function(event){
        event.stopPropagation();
    	$scope.entity = {};
        var table = $("#instrument_table").DataTable();
        var mytr = $(this).parents('tr');
        var tempArr = table.row(mytr).data();
//        $scope.myradio1 = tempArr[1];
        $scope.entity.id = tempArr[14];
        $scope.entity.exchID = tempArr[0];
        $scope.entity.productID = tempArr[1];
        $scope.entity.instrumentID = tempArr[2];
        $scope.entity.instrumentName = tempArr[3];
        $scope.entity.delivDate = tempArr[4];
        $scope.entity.productType = tempArr[5];
        $scope.entity.openDate = tempArr[6];
        $scope.entity.endTradeDate = tempArr[7];
        $scope.entity.volumeMultiple = tempArr[8];
        $scope.entity.qtyUnit = tempArr[9];
        $scope.entity.positionType = tempArr[10];
        $scope.entity.tick = tempArr[11];
        $scope.entity.instrumentStatus = tempArr[12];
        if($scope.entity.productType=="期权"){
        	$scope.entity.strikePrice = tempArr[15];
        }	
       
       
        
        
        // 状态
    	for(var x in $scope.productTypes){
    		if($scope.productTypes[x].text ==$scope.entity.productType){
    			$scope.entity.productType = $scope.productTypes[x].key;
    		}
    	}

    	// 持仓
    	for(var x in $scope.positionTypes){
    		if($scope.positionTypes[x].text ==$scope.entity.positionType){
    			$scope.entity.positionType = $scope.positionTypes[x].key;
    		}
    	}

    	//合约状态
    	for(var x in $scope.instrumentStatus){
    		if($scope.instrumentStatus[x].text ==$scope.entity.instrumentStatus){
    			$scope.entity.instrumentStatus = $scope.instrumentStatus[x].key;
    		}
    	}
    	// 点击修改时重新去查，更新$scope.products
    	$scope.products = [];
        getAllValidProductEntity(function (result) {
            $scope.productDatas = result;
            $scope.products = angular.copy($scope.productDatas);
            $scope.isShow = false;
            $scope.isUpdate = true;
            $scope.ModalEntity = {};
            $scope.ModalEntity = angular.copy($scope.entity);
            $scope.productChange($scope.ModalEntity.productID);
            formValidateReset();
            
       	    $("#instrumentModal").modal("show");
            $scope.$apply();
        });
    });


});

