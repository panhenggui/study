/**
 * Created by Quantdo on 2016/7/15.
 */
myapp.controller("productRiskController",function($scope,$rootScope) {
    $("[forType='date']").datepicker({
        language:  "zh-CN",
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: "yyyymmdd"
    });

    $scope.riskGroupDictionaryService = new com.quantdo.orgClear.service.RiskGroupDictionaryService();
  //设置按钮的名称
	var constant_temp = new com.quantdo.orgClear.constant.ClearConstants();
	$scope.productRisk_buttonName_detail_save = constant_temp.buttonName.setPara;
	$scope.productRisk_buttonName_detail_update = constant_temp.buttonName.resetPara;
	$scope.productRisk_buttonName_save = constant_temp.buttonName.saveData;
	$scope.productRisk_buttonName_update = constant_temp.buttonName.updateData;
	$scope.productRiskShow = false;
	$scope.productRiskEdit = true;
	//新增
	$scope.showDetail = function(){
		$scope.productRiskActionCode = false;
		$scope.productRiskShow = true;
		$scope.productRiskEdit = true;
		$scope.addProductRisk();
		setTimeout(function(){
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		})
		
	}
	
	//取消修改
	$scope.geiveUpUpdate = function(){
		$scope.productRiskShow = false;
		$scope.addProductRisk();
	}
    //初始化日期不能点击
    $scope.dateNotEdit = true;

    //初始化时间不能点击
    $scope.timeNotEdit = true;

    //存储一行所对应的阈值
    $scope.threshold = [];

    //存储净值风控表格中的数据
    $scope.productRisk_dataset = [];

    //存储指标详情表格信息
    $scope.index_dataset = [];

    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    //比较符
    $scope.compareFlag = clearConstant.compareFlag;

    //风控方式
    $scope.riskWay = clearConstant.riskWay;

    //是否恢复
    $scope.isRecovery = clearConstant.isRecovery;

    //风险等级
    $scope.riskLevels = clearConstant.riskLevels;

    $scope.updateEntity = {brokerID: "",fundId:"",startDate:"",endDate:"",startTime: "",endTime: "",lconval1: "",lcontag1: "",rcontag1: "",rconval1: "",actionCode: "",isRecovery: ""};

    //存储表头中的资金类别信息
    //$scope.groupNameArr = [];

    //存储表头中的风险指标信息
    $scope.tplNameArr = [];

    $scope.isRecoverys = true;

    //初始化页面信息
    $scope.productRiskEntitys = {lcontag1:"<",rcontag1:"<=",riskLevel:"3",actionCode:"1"};

    //记录指标详情表头列信息
    $scope.index_columns_array = [
        {title:"序号"},
        {title:"资产类别"},
        {title:"风险指标"},
        {title:"阈值"},
        {title:"操作"}
    ];
    
  //获取买卖方向表示值
    $scope.getShowValueBack = function (tempArr,text){
    	if(text!=null&&text!=undefined&&text!=""){
    	    for(var i=0;i<tempArr.length;i++){
                if(text == tempArr[i].text){
                    return tempArr[i].key;
                }
            }
    	}else{
    		return text+"：信息异常";
    	}
    
    };

    //初始化产品风控表格
    $scope.getRiskTable = function(id,columns,data,height) {
      $("#" + id).DataTable({
            columns: columns,
            data: data,
           // scrollY: height,
           // scrollCollapse:true,
           // paging: false,
            retrieve: true,
            destroy:true,
            scrollX: true,
            dom : 'rt<"bottom"ipl>',
            //info: false,
            language: {
            	 emptyTable: "没有符合条件的记录",
                 info: " _START_ 到 _END_  共 _TOTAL_ 条",
                 infoEmpty: " 0 到 0  共 0 条",
                 lengthMenu: "显示 _MENU_ 条",
                 paginate: {
                     first: "首页",
                     last: "末页",
                     next: "下一页",
                     previous: "上一页"
                 }
            }
        });
    };

    $scope.numberControl = function(value,id){
        if(value.split(".").length>1){
            var lconval1 = value.split(".")[1];
            if(lconval1.length>4){
                lconval1 = lconval1.substring(0,4);
                if(id == 0){
                    $scope.productRiskEntitys.lconval1 = value.split(".")[0] + "." + lconval1;
                }
                else{
                    $scope.productRiskEntitys.rconval1 = value.split(".")[0] + "." + lconval1;
                }
            }
        }
    };

    //判断name是否已经在colAttr中
    $scope.findColumnName = function(colAttr,name){
        var flag = true;
        for(var i=16;i<colAttr.length;i++){
            if(name == colAttr[i].title){
                flag = false;
            }
        }
        return flag;
    }

    //获取所有产品风控信息
    $scope.productRiskAddButtonIsShow = false;
    $scope.getProductRisks = function(isControl){
        $scope.updateGroupNameArr = [];
        $scope.updateTplNameArr = [];
        getProductRiskDataByFundId(sessionStorage.listFundID,sessionStorage.listBrokerID,function(result){
            $scope.productRisk_dataset = [];
            $scope.groupNameArr = [];
            $scope.tplNameArr = [];
            //记录净值风控表头列信息
            $scope.productRisk_columns_array = [
                {title:"序号"},
                {
                    title:"基金编号",
                    visible:false
                },
                {
                    title:"左值",
                    visible:false
                },
                {
                    title:"左符号",
                    visible:false
                },
                {
                    title:"比较值",
                    visible:false
                },
                {
                    title:"右符号",
                    visible:false
                },
                {
                    title:"右值",
                    visible:false
                },
                {title:"单位净值"},
                {title:"开始日期"},
                {title:"结束日期"},
                { title:"开始时间"},
                { title:"结束时间"},
                {title:"风控方式"},
                {title:"风险等级"},
                {title:"风险等级标识",visible:false},
                {
                    title:"风控方式标识",
                    visible:false
                },
                {title:"自动恢复"},
                {
                    title:"编号",
                    visible:false
                },
                {
                    title:"基金编号",
                    visible:false
                }
            ];
            var con = result;
            //判断新加的groupName+tplName是否在显示行列，如果不在，就将其添加进去，并将groupName单独加入保存组名的数组，tplName单独加入保存指标的数组
            for(var i=0;i<con.length;i++){
                for(var j=0;j<con[i].myParameters.length;j++){
                    if(con[i].myParameters[j].tplName != "" &&
                        $scope.findColumnName($scope.productRisk_columns_array,con[i].myParameters[j].groupName + con[i].myParameters[j].tplName)){
                            $scope.productRisk_columns_array.push({title:con[i].myParameters[j].groupName + con[i].myParameters[j].tplName});
                            $scope.groupNameArr.push(con[i].myParameters[j].groupName);
                            $scope.tplNameArr.push(con[i].myParameters[j].tplName);
                        }
                    }
            }
            //将操作列，加入到最后一行。
            $scope.productRisk_columns_array.push({title:"操作"});
            
            //给每一列赋值（公共部分）
            for(var i=0;i<con.length;i++){
                var tempArr = [i+1,con[i].fundId,parseFloat(con[i].lconval1).toFixed(4),con[i].lcontag1,con[i].condfield1,con[i].rcontag1,parseFloat(con[i].rconval1).toFixed(4),
                    con[i].unitNetValue,con[i].startDate,con[i].endDate,con[i].startTime,con[i].endTime,$rootScope.getShowValue($scope.riskWay,con[i].actionCode),$rootScope.getShowValue($scope.riskLevels,con[i].riskLevel),con[i].riskLevel,con[i].actionCode,
                    $rootScope.getShowValue($scope.isRecovery,con[i].isRecovery),con[i].brokerID,con[i].fundId];
                //给指标项赋值
                for(var j=19;j<$scope.productRisk_columns_array.length-1;j++){
                    for(var m=0;m<con[i].myParameters.length;m++){
                        if($scope.productRisk_columns_array[j].title == (con[i].myParameters[m].groupName + con[i].myParameters[m].tplName)){
                            if(con[i].myParameters[m].threshold>=0&&typeof(con[i].myParameters[m].threshold)=='number'){
                                tempArr.push(parseFloat(con[i].myParameters[m].threshold).toFixed(2) + "%");
                            }
                            else{
                                tempArr.push(con[i].myParameters[m].threshold);
                            }
                            break;
                        }
                    }
                    
                    //如果某列指标没有对应的阈值，将加一个""进去
                    if(tempArr.length == j){
                        tempArr.push("");
                    }
                }
                //最后添加删除按钮
                tempArr.push("<a style='cursor:pointer;' name='RiskStromDataService.deleteProductRiskDataIndexData' class='updateIndex backFilter' >[修改]</a> <a style='cursor:pointer;' name='RiskStromDataService.deleteProductRiskDataIndexData' class='deleteIndex backFilter'>[删除]</a>");
                $scope.productRisk_dataset.push(tempArr);
            }
            //destroyDatatable("productRisk_table");
            //根据表格行集合，和数据集合，构建表格
            $scope.$apply();
            $scope.getRiskTable("productRisk_table",$scope.productRisk_columns_array,$scope.productRisk_dataset,300);

            //初始化净值风控表格//========================初始规则？？？
            destroyDatatable("indexDetail_table");
            $scope.initIndexDetail();
            $scope.initDetailSelect();
            var indexDetailTable = $("#indexDetail_table").DataTable();
            indexDetailTable.rows.add([["<a style='cursor:pointer;' class='addRow'>+</a>","","","",""]]).draw();
            $scope.$apply();
            
            if(isControl){
            	 var myfilter = document.getElementsByClassName("backFilter");
                 hideAfterFilter($rootScope.filterEntity,myfilter);
                 $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            }
            $scope.productRiskAddButtonIsShow = true;
        	$scope.$apply();
        });
    };
    
    initDataTables("indexDetail_table",$scope.index_columns_array,$scope.index_dataset,190,true);
    $scope.getProductRisks(true);
    
    $('#productRisk_table').on( 'page.dt', function () {
    	setTimeout(function(){
    		var myfilter = document.getElementsByClassName("backFilter");
        	hideAfterFilter($rootScope.filterEntity,myfilter);
    	})
    }); 
    
    $("body").delegate('#productRisk_table_length div').on('change', 'select[name="productRisk_table_length"]', function () {
    	setTimeout(function(){
    		var myfilter = document.getElementsByClassName("backFilter");
        	hideAfterFilter($rootScope.filterEntity,myfilter);
    	})
    });
    localStorage.queryproduct = "";
    $scope.queryproductFlag = false;

    //checkbox选中日期控件可点击
    $scope.changeDateState = function(){
        if($scope.dateNotEdit){
            $scope.dateNotEdit = false;
        }
        else{
            $scope.dateNotEdit = true;
            $scope.productRiskEntitys.startDate = "";
            $scope.productRiskEntitys.endDate = "";
        }
    }

    //checkbox选中时间控件可点击
    $scope.changeTimeState = function(){
        if($scope.timeNotEdit){
            $scope.timeNotEdit = false;
        }
        else{
            $scope.timeNotEdit = true;
            document.getElementById("myStartTime").value = "";
            document.getElementById("myEndTime").value = "";
        }
    };

    $scope.changeRecoveryState = function(){
        if($scope.isRecoverys){
            $scope.isRecoverys = false;
        }
        else{
            $scope.isRecoverys = true;
        }
    };

    //获取所有的资产类型（groupName）
    $scope.initDetailSelect = function(){
        getProductRiskDataPublicDataByFundId(sessionStorage.listBrokerID,"",function(result){
            $scope.idxGroup = result.idxGroup;
            $scope.idxTpl = result.idxTpl;
            $scope.$apply();
            for(var j=0;j<$scope.idxGroup.length;j++){
                if($("#indexDetail_table .myidxGroup").length == 0 || $("#indexDetail_table .myidxGroup")[0].childNodes.length != $scope.idxGroup.length){
                    $("#indexDetail_table .myidxGroup").append("<option value='"+$scope.idxGroup[j].id+"'>"+$scope.idxGroup[j].paramName+"</option>");
                }
            }

            for(var j=0;j<$scope.idxTpl.length;j++){
                if($("#indexDetail_table .myidxTpl").length == 0 || $("#indexDetail_table .myidxTpl")[0].childNodes.length != $scope.idxTpl.length){
                    $("#indexDetail_table .myidxTpl").append("<option value='"+$scope.idxTpl[j].id+"'>"+$scope.idxTpl[j].paramName+"</option>");
                }
            }
            var m=0;
            var k=0;
            if($scope.updateGroupNameArr != undefined && $scope.updateGroupNameArr.length>0){
                for(var i=0;i<$("#indexDetail_table .myidxGroup").length;i++){
                    for(var j=0;j<$("#indexDetail_table .myidxGroup")[i].length;j++){
                        if($("#indexDetail_table .myidxGroup")[i][j].text == $scope.updateGroupNameArr[m]){
                            $("#indexDetail_table .myidxGroup")[i][j].selected = true;
                            m++;
                            break;
                        }
                    }
                }
            }
            else{
                for(var i=0;i<$("#indexDetail_table .myidxGroup").length;i++){
                    for(var j=0;j<$("#indexDetail_table .myidxGroup")[i].length;j++){
                        if($("#indexDetail_table .myidxGroup")[i][j].text == $scope.groupNameArr[m]){
                            $("#indexDetail_table .myidxGroup")[i][j].selected = true;
                            m++;
                            break;
                        }
                    }
                }
            }
            if( $scope.updateTplNameArr != undefined &&  $scope.updateTplNameArr.length>0){
                for(var i=0;i<$("#indexDetail_table .myidxTpl").length;i++){
                    for(var j=0;j<$("#indexDetail_table .myidxTpl")[i].length;j++){
                        if($("#indexDetail_table .myidxTpl")[i][j].text == $scope.updateTplNameArr[k]){
                            $("#indexDetail_table .myidxTpl")[i][j].selected = true;
                            k++;
                            break;
                        }
                    }
                }
            }
            else{
                for(var i=0;i<$("#indexDetail_table .myidxTpl").length;i++){
                    for(var j=0;j<$("#indexDetail_table .myidxTpl")[i].length;j++){
                        if($("#indexDetail_table .myidxTpl")[i][j].text == $scope.tplNameArr[k]){
                            $("#indexDetail_table .myidxTpl")[i][j].selected = true;
                            k++;
                            break;
                        }
                    }
                }
            }
            $scope.$apply();

        });
    };

    //初始化指标详情表格
    $scope.initIndexDetail = function(){
        $scope.index_dataset = [];
        for(var i=0;i<$scope.productRisk_columns_array.length-20;i++){
            var tempArr = [i+1,"<select class='myidxGroup'></select>","<select class='myidxTpl'></select>&nbsp;&nbsp;&nbsp;&nbsp;<div class='formulaContainer'><img class = 'mypicture' src='../pic/riskPicture.png'/><div class='formulaContent'>公式</div></div>","<input type=text><label class='mypercent'>%</label>",
                            "<a style='cursor:pointer;' class='deleteIndex' class='backFilter deleteIndex' name='RiskStromDataService.deleteProductRiskDataIndexData'>[删除]</a>"];
            $scope.index_dataset.push(tempArr);
        }
        //初始化指标详情表格
        $("#indexDetail_table").DataTable({
            data : $scope.index_dataset,
            columns :$scope.index_columns_array,
            scrollY: 170,
            paging: false,
            scrollX: true,
            info: false,
            ordering: false,
            dom : 'rt<"bottom"ipl>',
            language: {
                emptyTable: "没有符合条件的记录"
            }
        });

    };

    $("body").delegate("#indexDetail_table tbody tr input", "keyup",function(){
        if($(this)[0].value.split(".").length == 2 && $(this)[0].value.split(".")[1].length>2){
            $(this)[0].value = $(this)[0].value.split(".")[0] + "." + $(this)[0].value.split(".")[1].substring(0,2);
        }
    })

    //添加产品风控具体信息(点击增加按钮时，初始化设置框)
    $scope.addProductRisk = function(){
    	$scope.productRiskActionCode = false;
    	$scope.productRisk_buttonName_detail = constant_temp.buttonName.setPara;
    	$scope.productRisk_buttonName_save = constant_temp.buttonName.saveData;
        $scope.productRiskEntitys.myDate = false;
        $scope.productRiskEntitys.myTime = false;
        $scope.productRiskEntitys.startDate = "";
        $scope.productRiskEntitys.endDate = "";
        $scope.dateNotEdit = true;
        $scope.timeNotEdit = true;
        document.getElementById("myStartTime").value = "";
        document.getElementById("myEndTime").value = "";
        $scope.productRiskEntitys.lconval1 = "";
        $scope.productRiskEntitys.lcontag1 = "<";
        $scope.productRiskEntitys.rcontag1 = "<=";
        $scope.productRiskEntitys.rconval1 = "";
        $scope.productRiskEntitys.riskLevel = "3";
        $scope.productRiskEntitys.actionCode = "1";
        $scope.isRecoverys = true;
        //$scope.productRiskEntitys.isRecovery = "0";
        $scope.updateEntity = {};
        $scope.updateEntity.brokerID = "";
        $scope.updateEntity.fundId = "";
        $scope.updateEntity.startDate = "";
        $scope.updateEntity.endDate = "";
        $scope.updateEntity.startTime = "";
        $scope.updateEntity.endTime = "";
        $scope.updateEntity.lconval1 = "";
        $scope.updateEntity.lcontag1 = "";
        $scope.updateEntity.rcontag1 = "";
        $scope.updateEntity.rconval1 = "";
        $scope.updateEntity.actionCode = "";
        $scope.updateEntity.isRecovery = "";
        for(var i=0;i<$("#indexDetail_table input").length;i++){
            $("#indexDetail_table input")[i].value = "";
        }
       // $scope.$apply();
    }

    //增加修改产品风控信息（点保存按钮时，传回后端的数据）
    $scope.saveProductRisk = function(entity){
    	
        entity.fundId = sessionStorage.listFundID;
        entity.startTime = document.getElementById("myStartTime").value;
        entity.endTime = document.getElementById("myEndTime").value;
        entity.condfield1 = "P";
        entity.myParameters = [];
        entity.updateEntity = $scope.updateEntity;
        entity.isRecovery = $scope.isRecoverys;
        entity.riskLevel = "3";
        var myDetailTable = $("#indexDetail_table").DataTable();
        for(var i=0;i<myDetailTable.context[0].aoData.length-1;i++){
            var myParameter = {};
            var myaddID = "#indexDetail_table .myidxGroup_" + (i+1);
            if($(myaddID).length != 0){
                var myselectID = "indexDetail_table .myidxGroup_"+(i+1);
                var mytplID = "indexDetail_table .myidxTpl_"+(i+1);
                for(var j=0;j<$("#"+myselectID)[0].length;j++){
                    if($("#"+myselectID)[0][j].selected == true){
                        myParameter.groupID = $("#"+myselectID)[0][j].value;
                        break;
                    }
                }
                for(var j=0;j<$("#"+mytplID)[0].length;j++){
                    if($("#"+mytplID)[0][j].selected == true){
                        myParameter.tplid = $("#"+mytplID)[0][j].value;
                        break;
                    }
                }
            }
            else{
                for(var j=0;j<$("#indexDetail_table .myidxGroup")[i].length;j++){
                    if($("#indexDetail_table .myidxGroup")[i][j].selected == true){
                        myParameter.groupID = $("#indexDetail_table .myidxGroup")[i][j].value;
                    }
                }
                for(var j=0;j<$("#indexDetail_table .myidxTpl")[i].length;j++){
                    if($("#indexDetail_table .myidxTpl")[i][j].selected == true){
                        myParameter.tplid = $("#indexDetail_table .myidxTpl")[i][j].value;
                    }
                }
            }
            if($("#indexDetail_table input")[i].value==null||$("#indexDetail_table input")[i].value=="")  {
            	layer.alert("阈值不能为空"); 
            	return false;
            }else if(isNaN($("#indexDetail_table input")[i].value)){
            	layer.alert("阈值不是数字"); 
            	return false;
            }else if($("#indexDetail_table input")[i].value<0.01){
            	layer.alert("阈值取值范围是：[0.01%,1000.00%]"); 
            	return false;
            }else if($("#indexDetail_table input")[i].value-1000>0){
            	layer.alert("阈值取值范围是：[0.01%,1000.00%]"); 
            	return false;
            }
            else{
            	myParameter.threshold = $("#indexDetail_table input")[i].value;
            }
          
            entity.myParameters.push(myParameter);
        }
        
      //当日期复选框选中了之后，开始日期和结束日期必须填,且开始日期必须小于等于结束日期
    	if(entity.myDate==true&&entity.startDate==""){
    		layer.alert("开始日期不能为空"); 
        	return false;
    	}
    	if(entity.myDate==true&&entity.startDate==null){
    		layer.alert("开始日期不能为空"); 
        	return false;
    	}
    	if(entity.myDate==true&&entity.startDate==undefined){
    		layer.alert("开始日期不能为空"); 
        	return false;
    	}
    	if(entity.myDate==true&&entity.endDate==""){
    		layer.alert("结束日期不能为空"); 
        	return false;
    	}
    	if(entity.myDate==true&&entity.endDate==null){
    		layer.alert("结束日期不能为空"); 
        	return false;
    	}
    	if(entity.myDate==true&&entity.endDate==undefined){
    		layer.alert("结束日期不能为空"); 
        	return false;
    	}
    	if(entity.myDate==true&&entity.startDate!=null&&entity.endDate!=null){
    		if(parseInt(entity.startDate)-parseInt(entity.endDate)>0){
    			layer.alert("结束日期不能小于开始日期"); 
            	return false;
    		}
    	}
    	if(entity.myDate==true&&entity.startDate!=""&&entity.endDate!=""){
    		if(parseInt(entity.startDate)-parseInt(entity.endDate)>0){
    			layer.alert("结束日期不能小于开始日期"); 
            	return false;
    		}
    	}
    	if(entity.myDate==true&&entity.startDate!=undefined&&entity.endDate!=undefined){
    		if(parseInt(entity.startDate)-parseInt(entity.endDate)>0){
    			layer.alert("结束日期不能小于开始日期"); 
            	return false;
    		}
    	}
    	//如果勾选了时间复选框，时间必须填，且同一天生效开始时间必须小于生效结束
    	if(entity.myTime==true&&document.getElementById("myStartTime").value==""){
    		layer.alert("开始时间不能为空"); 
        	return false;
    	}
    	if(entity.myTime==true&&document.getElementById("myStartTime").value==null){
    		layer.alert("开始时间不能为空"); 
        	return false;
    	}
    	if(entity.myTime==true&&document.getElementById("myStartTime").value==undefined){
    		layer.alert("开始时间不能为空"); 
        	return false;
    	}
    	if(entity.myTime==true&&document.getElementById("myEndTime").value==""){
    		layer.alert("结束时间不能为空"); 
        	return false;
    	}
    	if(entity.myTime==true&&document.getElementById("myEndTime").value==null){
    		layer.alert("结束时间不能为空"); 
        	return false;
    	}
    	if(entity.myTime==true&&document.getElementById("myEndTime").value==undefined){
    		layer.alert("结束时间不能为空"); 
        	return false;
    	}
    	
    	if(entity.myTime==true&&document.getElementById("myStartTime").value!=""&&document.getElementById("myStartTime").value!=null&&document.getElementById("myStartTime").value!=undefined&&
    			document.getElementById("myEndTime").value!=null&&document.getElementById("myEndTime").value!=undefined&&document.getElementById("myEndTime").value!=""){
    		var startT = document.getElementById("myStartTime").value;
   			var endT = document.getElementById("myEndTime").value;
   			startT = startT.replace(/:/g,"");
   			endT = endT.replace(/:/g,"");
   			if(startT-endT>=0){
   				layer.alert("结束时间必须大于开始时间"); 
   		       	return false;
   			}
    	}
    	
    	if(entity.myDate==true&&(entity.myTime==false||entity.myTime==undefined||entity.myTime=="")){
    		layer.alert("选择日期,必须选择时间"); 
        	return false;
    	}
    	
    	//单位净值必须在0到100之间
    	if(entity.lconval1!=null&&entity.lconval1!=""&&entity.lconval1!=undefined){
    		var point2 = entity.lconval1.length-1;
    		var point1 = entity.lconval1.indexOf(".");
    		if(point1>=0){
    			var str = entity.lconval1.substring(point1,point2);
    			if(str.length>4){
    				layer.alert("单位净值的小数位不能超过四位"); 
                	return false;
    			}
    		}
    		
    		if(entity.lconval1>100){
    			layer.alert("单位净值的取值范围是:[0.0000,100.0000]"); 
            	return false;
    		}
    	}
    	if(entity.rconval1!=null&&entity.rconval1!=""&&entity.rconval1!=undefined){
    		var point2 = entity.rconval1.length-1;
    		var point1 = entity.rconval1.indexOf(".");
    		if(point1>=0){
    			var str = entity.rconval1.substring(point1,point2);
    			if(str.length>4){
    				layer.alert("单位净值的小数位不能超过四位"); 
                	return false;
    			}
    		}
    		
    		
    		if(entity.rconval1>100){
    			layer.alert("单位净值的取值范围是:[0.0000,100.0000]"); 
            	return false;
    		}
    	}
    	if(entity.lconval1!=null&&entity.lconval1!=""&&entity.lconval1!=undefined&&entity.rconval1!=null&&entity.rconval1!=""&&entity.rconval1!=undefined&&!isNaN(entity.lconval1)&&!isNaN(entity.rconval1)){
    		
			if(entity.lconval1-entity.rconval1==0){
				if(entity.lcontag1 != "="|| entity.rcontag1 != "="){
					layer.alert("左条件值需<右条件值"); 
                	return false;
				}
    		}
			
			if(entity.lcontag1=="="&&entity.rcontag1=="="&&entity.lconval1-entity.rconval1!=0){
    			layer.alert("单位净值格式不正确"); 
            	return false;
    		}
			if(entity.lcontag1=="="&&entity.rcontag1!="="){
    			layer.alert("单位净值格式不正确"); 
            	return false;
    		}
    		
    		if(entity.lcontag1!="="&&entity.rcontag1=="="){
    			layer.alert("单位净值格式不正确"); 
            	return false;
    		}
    		if(entity.lconval1-entity.rconval1>0){
    			layer.alert("左条件值需<右条件值"); 
            	return false;
    		}
    	}
    	
    	if((entity.lconval1==""||entity.lconval1==null||entity.lconval1==undefined)&&(entity.rconval1==""||entity.rconval1==null||entity.rconval1==undefined)){
    		layer.alert("单位净值不能为空"); 
        	return false;
    	}
    	if(entity.lconval1==null&&entity.rconval1==null){
    		layer.alert("单位净值不能为空"); 
        	return false;
    	}
    	if(entity.lconval1==undefined&&entity.rconval1==undefined){
    		layer.alert("单位净值不能为空"); 
        	return false;
    	}
    	if(isNaN(entity.lconval1)&&entity.lconval1!=null){
    		layer.alert("单位净值不是数字"); 
        	return false;
    	}
    	if(entity.lconval1<0){
    		layer.alert("单位净值不能小于0"); 
        	return false;
    	}
    	if(isNaN(entity.rconval1)&&entity.rconval1!=null){
    		layer.alert("单位净值不是数字"); 
        	return false;
    	}
    	if(entity.rconval1<0){
    		layer.alert("单位净值不能小于0"); 
        	return false;
    	}
        
        if(entity.myParameters.length==0){
        	layer.alert("风控指标不能为空"); 
        	return false;
        }
        for(var i=0;i<entity.myParameters.length;i++){
            for(var j=i+1;j<entity.myParameters.length;j++){
                if(entity.myParameters[i].groupID == entity.myParameters[j].groupID&&entity.myParameters[i].tplid == entity.myParameters[j].tplid){
                    layer.alert("风控指标不能重复");
                    return false;
                }
            }
        }
        
        layer.load(2, {
    	    shade: [0.5,'#fff'] //0.1透明度的白色背景
    	});
        
        addProductRiskDataIndexData(entity,sessionStorage.listBrokerID,function(errCode,errMsg){
            if(errCode == 0) {
                if(entity.updateEntity.lconval1 != "" || entity.updateEntity.rconval1 != ""){
                    layer.alert("修改成功");
                }
                else{
                    layer.alert("新增成功");
                }
                var mytable = document.getElementById("mytable");
                var outerContainer = document.getElementById("outerContainer");
                outerContainer.removeChild(mytable);
                var newContainer = document.createElement("div");
                newContainer.id = "mytable";
                newContainer.innerHTML = "<table id='productRisk_table' class='cell-border stripe' cellspacing='0' width='100%'></table>";
                outerContainer.appendChild(newContainer);
                //destroyDatatable("productRisk_table");
                $scope.getProductRisks(false);
                $scope.addProductRisk();
                $scope.productRiskShow = false;
                $scope.$apply();
            }else if(errCode>0){
            	layer.alert(errMsg);
            }
            else{
                layer.alert("新增失败");
            }
            layer.closeAll('loading');
        });
    };

    localStorage.addDetail = "";
    $scope.addDetailFlag = false;
    //执行风控指标表格中的新增功能
    $("body").delegate("#indexDetail_table td .addRow","click",function(event){
        event.stopPropagation();
        if(localStorage.addDetail  == ""){
            $scope.addDetailFlag = true;
        }
        if($scope.addDetailFlag){
            var myDetailTable = $("#indexDetail_table").DataTable();
            myDetailTable.row($(this).parents("tr")).remove().draw();
            localStorage.addDetail = $(this);
            var myindex = myDetailTable.context[0].aoData.length+1;
            myDetailTable.rows.add([[myindex,"<select class='myidxGroup_"+myindex+"'></select>",
                "<select class='myidxTpl_"+myindex+"'></select>&nbsp;&nbsp;&nbsp;&nbsp;<div class='formulaContainer'><img class = 'mypicture' src='../pic/riskPicture.png'/><div class='formulaContent'>公式</div></div>","<input type=text class='myindex_"+myindex+"'><label class='mypercent'>%</label>",
                "<a style='cursor:pointer;' class='deleteIndex'>[删除]</a>"]]).draw();
            for(var j=0;j<$scope.idxGroup.length;j++){
                $("#indexDetail_table .myidxGroup_"+myindex).append("<option value='"+$scope.idxGroup[j].id+"'>"+$scope.idxGroup[j].paramName+"</option>");
            }

            for(var j=0;j<$scope.idxTpl.length;j++){
                $("#indexDetail_table .myidxTpl_"+myindex).append("<option value='"+$scope.idxTpl[j].id+"'>"+$scope.idxTpl[j].paramName+"</option>");
            }
            myDetailTable.rows.add([["<a style='cursor:pointer;' class='addRow'>+</a>","","","",""]]).draw();
            $("#indexDetail_table .myindex_"+myindex).focus();
        }
    });

    localStorage.myflag = "";
    $scope.delFlag = false;
    //执行风控指标表格中的删除功能
    $("body").delegate("#indexDetail_table td .deleteIndex", "click", function (event){
        event.stopPropagation();
        if(localStorage.myflag  == ""){
            $scope.delFlag = true;
        }
        var myDetailTable = $("#indexDetail_table").DataTable();
        if($scope.delFlag){
            myDetailTable.row($(this).parents('tr'))
                .remove().draw(false);
            localStorage.myflag = $(this);
        }
        /*for(var i=0;i<myDetailTable.context[0].aoData.length-1;i++){
            var index = myDetailTable.cell($(myDetailTable.context[0].aoData[i].nTr).children()[0]);
            index.data(i+1);
        }*/
        /*****************新的删除功能：删除一行之后，获得剩余行的数据，然后销毁表格重新绘制表格，并把原先行的数据对应放入*********************/
        var lastDetailTable = $("#indexDetail_table").DataTable();
        var lastDetailData = lastDetailTable.context[0].aoData;
        var myParameters = [];
        for(var i=0;i<lastDetailData.length-1;i++){
        	//alert(lastDetailData[i]._aData[0]);
        	var indexForArr = lastDetailData[i]._aData[0];
            var myParameter = {};
            var myaddID = "#indexDetail_table .myidxGroup_" + (indexForArr);
            if($(myaddID).length != 0){
                var myselectID = "indexDetail_table .myidxGroup_"+(indexForArr);
                var mytplID = "indexDetail_table .myidxTpl_"+(indexForArr);
                for(var j=0;j<$("#"+myselectID)[0].length;j++){
                    if($("#"+myselectID)[0][j].selected == true){
                        myParameter.groupID = $("#"+myselectID)[0][j].value;
                        break;
                    }
                }
                for(var j=0;j<$("#"+mytplID)[0].length;j++){
                    if($("#"+mytplID)[0][j].selected == true){
                        myParameter.tplid = $("#"+mytplID)[0][j].value;
                        break;
                    }
                }
            }
            else{
                for(var j=0;j<$("#indexDetail_table .myidxGroup")[i].length;j++){
                    if($("#indexDetail_table .myidxGroup")[i][j].selected == true){
                        myParameter.groupID = $("#indexDetail_table .myidxGroup")[i][j].value;
                    }
                }
                for(var j=0;j<$("#indexDetail_table .myidxTpl")[i].length;j++){
                    if($("#indexDetail_table .myidxTpl")[i][j].selected == true){
                        myParameter.tplid = $("#indexDetail_table .myidxTpl")[i][j].value;
                    }
                }
            }
            myParameter.threshold = $("#indexDetail_table input")[i].value;   
            myParameters.push(myParameter);
        }
        
        destroyDatatable("indexDetail_table");
        $scope.index_dataset = [];
        for(var i=0;i<myParameters.length;i++){
            var tempArr = [i+1,"<select class='myidxGroup'></select>","<select class='myidxTpl'></select>&nbsp;&nbsp;&nbsp;&nbsp;<div class='formulaContainer'><img class = 'mypicture' src='../pic/riskPicture.png'/><div class='formulaContent'>公式</div></div>","<input type=text><label class='mypercent'>%</label>",
                            "<a style='cursor:pointer;' class='deleteIndex' class='backFilter deleteIndex' name='RiskStromDataService.deleteProductRiskDataIndexData'>[删除]</a>"];
            $scope.index_dataset.push(tempArr);
        }
        $scope.index_dataset.push(["<a style='cursor:pointer;' class='addRow'>+</a>","","","",""]);
        //初始化指标详情表格
        $("#indexDetail_table").DataTable({
            data : $scope.index_dataset,
            columns :$scope.index_columns_array,
            scrollY: 170,
            paging: false,
            scrollX: true,
            info: false,
            ordering: false,
            dom : 'rt<"bottom"ipl>',
            language: {
                emptyTable: "没有符合条件的记录"
            }
        });

        for(var j=0;j<$scope.idxGroup.length;j++){
            $("#indexDetail_table .myidxGroup").append("<option value='"+$scope.idxGroup[j].id+"'>"+$scope.idxGroup[j].paramName+"</option>");
        }

        for(var j=0;j<$scope.idxTpl.length;j++){
            $("#indexDetail_table .myidxTpl").append("<option value='"+$scope.idxTpl[j].id+"'>"+$scope.idxTpl[j].paramName+"</option>");
        }
        
        var groupIDTemp = [];
        var tplIDTemp = [];
        var thresholdTemp = [];
        
        for(var i=0;i<myParameters.length;i++){
            if(myParameters[i] != null && myParameters[i] != ""){
            	if(myParameters[i].threshold == null || myParameters[i].threshold == undefined || myParameters[i].threshold == ""){
            		thresholdTemp.push("");
            	}else{
            		thresholdTemp.push(myParameters[i].threshold);
            	}
            	groupIDTemp.push(myParameters[i].groupID);
            	tplIDTemp.push(myParameters[i].tplid);
            }
        }
        
        var m=0;
        var k=0;
        if(groupIDTemp != undefined && groupIDTemp.length>0){
            for(var i=0;i<$("#indexDetail_table .myidxGroup").length;i++){
                for(var j=0;j<$("#indexDetail_table .myidxGroup")[i].length;j++){
                    if($("#indexDetail_table .myidxGroup")[i][j].value == groupIDTemp[m]){
                        $("#indexDetail_table .myidxGroup")[i][j].selected = true;
                        m++;
                        break;
                    }
                }
            }
        }
        else{
            for(var i=0;i<$("#indexDetail_table .myidxGroup").length;i++){
                for(var j=0;j<$("#indexDetail_table .myidxGroup")[i].length;j++){
                    if($("#indexDetail_table .myidxGroup")[i][j].value == groupIDTemp[m]){
                        $("#indexDetail_table .myidxGroup")[i][j].selected = true;
                        m++;
                        break;
                    }
                }
            }
        }
        if( tplIDTemp != undefined &&  tplIDTemp.length>0){
            for(var i=0;i<$("#indexDetail_table .myidxTpl").length;i++){
                for(var j=0;j<$("#indexDetail_table .myidxTpl")[i].length;j++){
                    if($("#indexDetail_table .myidxTpl")[i][j].value == tplIDTemp[k]){
                        $("#indexDetail_table .myidxTpl")[i][j].selected = true;
                        k++;
                        break;
                    }
                }
            }
        }
        else{
            for(var i=0;i<$("#indexDetail_table .myidxTpl").length;i++){
                for(var j=0;j<$("#indexDetail_table .myidxTpl")[i].length;j++){
                    if($("#indexDetail_table .myidxTpl")[i][j].value == tplIDTemp[k]){
                        $("#indexDetail_table .myidxTpl")[i][j].selected = true;
                        k++;
                        break;
                    }
                }
            }
        }
        for(var i=0;i<$("#indexDetail_table input").length;i++){
            $("#indexDetail_table input")[i].value = thresholdTemp[i];
        }
        $scope.$apply();
        setTimeout(function(){
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		})
		
    });

    localStorage.deleteProduct = "";
    $scope.delProductFlag = false;
    //执行产品风控表格中的删除功能
    $("body").delegate("#productRisk_table td .deleteIndex","click",function(){
        var table = $("#productRisk_table").DataTable();
        var mytr = $(this).parents('tr');
        var tempArr = table.row(mytr).data();
        var delEntity = {};
        delEntity.brokerID = tempArr[17];
        delEntity.fundId = tempArr[18];
        delEntity.startDate = tempArr[8];
        delEntity.endDate = tempArr[9];
        delEntity.startTime = tempArr[10];
        delEntity.endTime = tempArr[11];
        delEntity.lconval1 = tempArr[2];
        delEntity.lcontag1 = tempArr[3];
        delEntity.rcontag1 = tempArr[5];
        delEntity.rconval1 = tempArr[6];
        if(localStorage.deleteProduct == ""){
            $scope.delProductFlag = true;
        }
        if($scope.delProductFlag){
            localStorage.deleteProduct = $(this);
            layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
                deleteProductRiskDataIndexData(delEntity,sessionStorage.listBrokerID,"true",function(errCode){
                    if(errCode == 0) {
                        var b = true;
                        if(b==true){
                            var mytable = document.getElementById("mytable");
                            var outerContainer = document.getElementById("outerContainer");
                            outerContainer.removeChild(mytable);
                            var newContainer = document.createElement("div");
                            newContainer.id = "mytable";
                            newContainer.innerHTML = "<table id='productRisk_table' class='cell-border stripe' cellspacing='0' width='100%'></table>";
                            outerContainer.appendChild(newContainer);
                            //destroyDatatable("productRisk_table");
                            $scope.getProductRisks(false);
                            $scope.addProductRisk();
                            $scope.productRiskShow = false;
                            $scope.$apply();
                            b = false;
                        }
                        if(b==false){
                            layer.alert("删除成功");
//                		 table.row(mytr).remove().draw(false);
                        }
                    }
                    else{
                        layer.alert("删除失败");
                    }
                })
            })
        }

    });
    //修改
    $("body").delegate("#productRisk_table td .updateIndex","click",function(event){
        event.stopPropagation();
        $scope.productRiskActionCode = true;
        $scope.productRiskShow = true;
    	$scope.productRiskEdit = false;
        //为选中的行设置选中色
        if($(this).closest('tr').hasClass("selected")){
            $(this).closest('tr').removeClass("selected");
        }
        else{
            $("tr.selected").removeClass("selected");
            $(this).closest('tr').addClass("selected");
        }
        if(localStorage.queryproduct = ""){
            $scope.queryproductFlag = true;
        }
        //先获得选中的表格，然后获得选中的表格里的被选中的那一列
        var table = $("#productRisk_table").DataTable();
        var tr = $(this).closest('tr');
        var tempArr = table.row(tr).data();
        //将被选中的那一列的信息添加到updateEnetity中（因为选中该行之后，可能要执行修改操作，修改操作需要把选中行的公共信息回传）
        $scope.updateEntity = {};
        $scope.updateEntity.brokerID = tempArr[17];
        $scope.updateEntity.fundId = tempArr[18];
        $scope.updateEntity.startDate = tempArr[8];
        $scope.updateEntity.endDate = tempArr[9];
        $scope.updateEntity.startTime = tempArr[10];
        $scope.updateEntity.endTime = tempArr[11];
        $scope.updateEntity.lconval1 = tempArr[2];
        $scope.updateEntity.lcontag1 = tempArr[3];
        $scope.updateEntity.rcontag1 = tempArr[5];
        $scope.updateEntity.rconval1 = tempArr[6];
        $scope.updateEntity.actionCode = $scope.getShowValueBack($scope.riskWay,tempArr[12]);
        $scope.updateEntity.isRecovery =  $scope.getShowValueBack($scope.riskWay,tempArr[12]);
        document.getElementById("myStartTime").value = tempArr[10];
        document.getElementById("myEndTime").value = tempArr[11];

        $scope.threshold = [];
        //ng-checked为true，复选框为选中，设置日期，时间选项为选中
        /* $scope.productRiskEntitys.myDate = true;
         $scope.productRiskEntitys.myTime = true;*/
        //将日期，时间，风控条件，是否自动回复，风险等级，风控方式的值设置到对应项
        $scope.productRiskEntitys.startDate = tempArr[8];
        $scope.productRiskEntitys.endDate = tempArr[9];
        $scope.productRiskEntitys.startTime = tempArr[10];
        $scope.productRiskEntitys.endTime = tempArr[11];

        //让日期选项可以点击
        $scope.dateNotEdit = true;
        //让时间选项可以点击
        $scope.timeNotEdit = true;
        if(!($scope.productRiskEntitys.startDate == "" && $scope.productRiskEntitys.endDate == "")){
            $scope.productRiskEntitys.myDate = true;
            $scope.dateNotEdit = false;
        }else{
            $scope.productRiskEntitys.myDate = false;
            $scope.dateNotEdit = true;
        }
        if(!($scope.productRiskEntitys.startTime == "" && $scope.productRiskEntitys.endTime == "")){
            $scope.productRiskEntitys.myTime = true;
            $scope.timeNotEdit = false;
        }else{
            $scope.productRiskEntitys.myTime = false;
            $scope.timeNotEdit = true;
        }
        /* document.getElementById("myStartTime").value = tempArr[2];
         document.getElementById("myEndTime").value = tempArr[3];*/
        if(tempArr[2]=="NaN"){
            $scope.productRiskEntitys.lconval1 = "";
        }else{
            $scope.productRiskEntitys.lconval1 = tempArr[2];
        }

        if(tempArr[3] != ""){
            $scope.productRiskEntitys.lcontag1 = tempArr[3];
        }
        if(tempArr[5] != ""){
            $scope.productRiskEntitys.rcontag1 = tempArr[5];
        }
        if(tempArr[6]=="NaN"){
            $scope.productRiskEntitys.rconval1 = "";
        }else{
            $scope.productRiskEntitys.rconval1 = tempArr[6];
        }
        $scope.productRiskEntitys.actionCode = tempArr[15];
        $scope.productRiskEntitys.riskLevel = tempArr[14];
        $scope.isRecoverys = tempArr[16];

        if($scope.isRecoverys == "是"){
            $scope.isRecoverys = true;
        }
        else{
            $scope.isRecoverys = false;
        }
        if(localStorage.queryproduct  == ""){
            $scope.queryproductFlag = true;
        }
        //if($scope.queryproductFlag){
        var indexDetailTable = $("#indexDetail_table").DataTable();
        if(table.context[0].aoColumns[table.context[0].aoColumns.length-2].title.indexOf($scope.groupNameArr[$scope.groupNameArr.length-1]) != -1){
            $scope.updateGroupNameArr = [];
            $scope.updateTplNameArr = [];
            for(var i=19;i<tempArr.length-1;i++){
                if(tempArr[i] != null && tempArr[i] != ""){
                    $scope.threshold.push(tempArr[i]);
                    $scope.updateGroupNameArr.push($scope.groupNameArr[i-19]);
                    $scope.updateTplNameArr.push($scope.tplNameArr[i-19]);
                }
            }
        }

        indexDetailTable.clear().draw();
        for(var i=0;i<$scope.threshold.length;i++){
            indexDetailTable.rows.add([[i+1,"<select class='myidxGroup'></select>","<select class='myidxTpl'></select>&nbsp;&nbsp;&nbsp;&nbsp;<div class='formulaContainer'><img class = 'mypicture' src='../pic/riskPicture.png'/><div class='formulaContent'>公式</div></div>","<input type=text><label class='mypercent'>%</label>",
                "<a style='cursor:pointer;' class='deleteIndex' class='backFilter deleteIndex' name='RiskStromDataService.deleteProductRiskDataIndexData'>[删除]</a>"]]).draw();
        }
        //$scope.initIndexDetail();
        $scope.initDetailSelect();
        for(var i=0;i<$("#indexDetail_table input").length;i++){
            $("#indexDetail_table input")[i].value = $scope.threshold[i].substring(0,$scope.threshold[i].length-1);
        }
        indexDetailTable.rows.add([["<a style='cursor:pointer;' class='addRow'>+</a>","","","",""]]).draw();
        //    localStorage.queryproduct = $(this);
        //}
        setTimeout(function(){
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		})
        $scope.$apply();
    });
    
    //获得指标计算公式
    $scope.tlpDesc = [];
    $scope.riskGroupDictionaryService.getTpl(function(result){
    	for(var i=0;i<result.length;i++){
    		var con = result[i];
    		var tmp = {id:con.id,descr:con.descr};
    		$scope.tlpDesc.push(tmp);
    	}
    	$scope.$apply();
    })

    $("body").delegate("#indexDetail_table td .mypicture", "click", function (event){
        event.stopPropagation();
        debugger;
        var tr = $(this).closest('tr')[0];
        var value = $(tr).children()[2].children[0].selectedOptions[0].value;
        if($(tr).find(".formulaContent")[0].style.display== "block"){
        	$(tr).find(".formulaContent")[0].style.display = "none";
        }else{
        	$(tr).find(".formulaContent")[0].style.display = "block";
        }
        for(var i=0;i<$scope.tlpDesc.length;i++){
        	var con = $scope.tlpDesc[i];
        	if(value == con.id) $(tr).find(".formulaContent")[0].innerText = con.descr;
        }
    });
})