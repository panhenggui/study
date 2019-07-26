/**
 * Created by Quantdo on 2016/7/15.
 */
myapp.controller("riskDayStopLossController",function($scope,$rootScope) {
	//日期控件
    $("[forType='date']").datepicker({
        language:  "zh-CN",
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: "yyyymmdd"
    });

  //设置按钮的名称
	var constant_temp = new com.quantdo.orgClear.constant.ClearConstants();
	$scope.riskDayStopLoss_buttonName_detail_save = constant_temp.buttonName.setPara;
	$scope.riskDayStopLoss_buttonName_detail_update = constant_temp.buttonName.resetPara;
	$scope.riskDayStopLoss_buttonName_save = constant_temp.buttonName.saveData;
	$scope.riskDayStopLoss_buttonName_update = constant_temp.buttonName.updateData;
	$scope.riskDayStopLossShow = false;
	$scope.riskDayStopLossButtonEdit = true;
    //初始化日期不能点击（不能添加日期）
    $scope.dateNotEdit = true;

    //初始化时间不能点击（不能添加时间）
    $scope.timeNotEdit = true;
    $scope.dayStopLossEntitys = [];

   /* //存储一行所对应的阈值
    $scope.threshold = [];*/

   /* //存储净值风控表格中的数据
    $scope.productRisk_dataset = [];*/
    //存储日内最大回撤止损表格中的数据

   /* //存储指标详情表格信息
    $scope.index_dataset = [];*/

    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"riskday_tabCallBackFunc");
    $scope.riskday_tabCallBackFunc = tabCallBackFunc;

    //比较符
    $scope.compareFlag = clearConstant.compareFlag;

    //风控方式
    $scope.riskWay = clearConstant.riskWay;

   /* //是否恢复
    $scope.isRecovery = clearConstant.isRecovery;

    //风险等级
    $scope.riskLevels = clearConstant.riskLevels;*/

    //修改时传来的entity
    $scope.updateEntity = {mID: null,idxID: null,brokerID: "",fundID:"",startDate:"",endDate:"",startTime: "",endTime: "",lconval1: "",lcontag1: "",rcontag1: "",rconval1: "",actionCode: ""};

    //存储表头中的资金类别信息
    //$scope.groupNameArr = [];

   /* //存储表头中的风险指标信息
    $scope.tplNameArr = [];

    $scope.isRecoverys = false;*/

    //初始化页面信息
    $scope.dayStopLossEntitys = {lcontag1:"<",rcontag1:"<=",actionCode:"1"};
    $scope.riskDayStopLossActionCode = false;
    //初始化产品风控表格
    $scope.getRiskDayStopLossTable = function(id,columns,data,height) {
      $("#" + id).DataTable({
            columns: columns,
            data: data,
            //scrollY: height,
            //scrollCollapse:true,
            //paging: false,
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

    //点击新增
    $scope.showDetail = function(){
    	$scope.riskDayStopLossShow = true;
    	$scope.riskDayStopLossButtonEdit = true;
    	$scope.riskDayStopLossActionCode = false;
    	$scope.addDayStopLoss()
    }
    
    //点击取消
    $scope.giveUpUpdate = function(){
    	$scope.riskDayStopLossShow = false;
    	$scope.addDayStopLoss()
    }
    //控制页面写的条件值的小数点位在四位以内
    $scope.numberControl = function(value,id){
        if(value.split(".").length>1){
            var lconval1 = value.split(".")[1];
            if(lconval1.length>4){
                lconval1 = lconval1.substring(0,4);
                if(id == 0){
                    $scope.dayStopLossEntitys.lconval1 = value.split(".")[0] + "." + lconval1;
                }
                else{
                    $scope.dayStopLossEntitys.rconval1 = value.split(".")[0] + "." + lconval1;
                }
            }
        }
    };

   //将传过来的actionCode转换成相应的中文
    $scope.changeActionCode = function(actionCode){
      if(actionCode=='1'){
    	  return "控制权限";
      }else if(actionCode=='2'){
    	  return "清仓";
      }else if(actionCode=='3'){
    	  return "预警";
      }else{
    	  return "";
      }
    };
    //将相应的中文转换成actionCode
    $scope.changeActionCodeName = function(actionCodeName){
      if(actionCodeName=="控制权限"){
    	  return "1";
      }else if(actionCodeName=="清仓"){
    	  return "2";
      }else if(actionCodeName=="预警"){
    	  return "3";
      }else{
    	  return "";
      }
    };
    
    $scope.dayStopLossMain_columns_array = [
            {
               title:"序号"
            },
            {
               title:"主表id",
               visible:false
            },
            {
               title:"明细表id",
               visible:false
           },
          
           {
               title:"机构编号",
               visible:false
           },
           {
               title:"基金编号",
               visible:false
            },
            {
               title:"开始日期"
            },
            {
               title:"结束日期"
            },
            {
               title:"开始时间"
            },
            {
               title:"结束时间"
            },
            {
               title:"回撤比例"
            },
            {
            	title:"左条件值",
            	visible:false
            },
            {
            	title:"左比较符",
            	visible:false
            },
            {
            	title:"比较字段",
            	visible:false
            },
            {
            	title:"右比较符",
            	visible:false
            },
            {
            	title:"右条件值",
            	visible:false
            },
            {
                title:"控制方式"
            },
            {
                title:"操作"
            }
            ];

    //获得数据库中已有的所有日内最大回撤止损数据
    $scope.riskDayStopLossAddButtonIsShow=false;
    $scope.getDayStopLoss = function(isControl){
        getAllRiskDayStopLossData(sessionStorage.listFundID,sessionStorage.listBrokerID,function(result){
            $scope.dayStopLossMain_dataset = [];
            var con = result;
            for(var i=0;i<con.length;i++){
            	 var tempArr = [i+1,con[i].mID,con[i].idxID,con[i].brokerID,con[i].fundID,
            	                con[i].startDate,con[i].endDate,con[i].startTime,con[i].endTime,con[i].stopLoss,
            	                con[i].lconval1,con[i].lcontag1,con[i].condfield1,con[i].rcontag1,con[i].rconval1,
            	                $scope.changeActionCode(con[i].actionCode)];
            	 //最后添加删除按钮
                 tempArr.push("<a style='cursor:pointer;' name='RiskDayStopLossService.addTmpRiskDayStopLossEntity' class='riskday_updateIndex backFilter'>[修改]</a> <a style='cursor:pointer;' name='RiskDayStopLossService.addTmpRiskDayStopLossEntity' class='riskday_deleteIndex backFilter'>[删除]</a>");
                 $scope.dayStopLossMain_dataset.push(tempArr);
              }
             //生成表格
            $scope.getRiskDayStopLossTable("riskDayStopLoss_table",$scope.dayStopLossMain_columns_array,$scope.dayStopLossMain_dataset,300);
            $scope.initDetailSelect();
            if(isControl){
            	var myfilter = document.getElementsByClassName("backFilter");
                hideAfterFilter($rootScope.filterEntity,myfilter);
                $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            }
            $scope.riskDayStopLossAddButtonIsShow=true;
        	$scope.$apply();
        });
    };
  //进入页面初始化页面（默认值和下拉表格等）
    $scope.initDetailSelect = function(){
    		$scope.dayStopLossEntitys.myDate = false;
        	$scope.dayStopLossEntitys.myTime = false;
        	$scope.dayStopLossEntitys.startDate = "";
        	$scope.dayStopLossEntitys.endDate = "";
        	//$scope.dayStopLossEntitys.startTime = "";
        	//$scope.dayStopLossEntitys.endTime = "";
        	document.getElementById("riskday_myStartTime").value = "";
        	document.getElementById("riskday_myEndTime").value = "";
            $scope.dayStopLossEntitys = {lcontag1:"<",rcontag1:"<=",actionCode:"1"};
        	$scope.dateNotEdit = true;
        	$scope.timeNotEdit = true;
        	b=true;
    	   // $scope.$apply();
    };
    
    $('#riskDayStopLoss_table').on( 'page.dt', function () {
       	setTimeout(function(){
       		var myfilter = document.getElementsByClassName("backFilter");
           	hideAfterFilter($rootScope.filterEntity,myfilter);
       	})
       }); 
       
       $("body").delegate('#riskDayStopLoss_table_length div').on('change', 'select[name="riskDayStopLoss_table_length"]', function () {
       	setTimeout(function(){
       		var myfilter = document.getElementsByClassName("backFilter");
           	hideAfterFilter($rootScope.filterEntity,myfilter);
       	})
       });
    
    //页面入口
    $(document).ready(function(){
        $scope.getDayStopLoss(true);
        $scope.initDetailSelect();
        $scope.updateEntity.mID = null;
        $scope.updateEntity.idxID = null;
        $scope.updateEntity.brokerID = "";
        $scope.updateEntity.fundID = "";
        $scope.updateEntity.startDate = "";
        $scope.updateEntity.endDate = "";
        $scope.updateEntity.startTime = "";
        $scope.updateEntity.endTime = "";
        $scope.updateEntity.lconval1 = "";
        $scope.updateEntity.lcontag1 = "";
        $scope.updateEntity.rcontag1 = "";
        $scope.updateEntity.rconval1 = "";
        $scope.updateEntity.actionCode = "";
        /*//过滤权限
        setTimeout(function(){
            var myfilter = document.getElementsByClassName("backFilter");
            hideAfterFilter($rootScope.filterEntity,myfilter);
        },"100")
        setTimeout(function(){
        	$scope.riskDayStopLossAddShow=true;
        	$scope.$apply();
        },"100")*/
    });
    
    //当改变日期控件的复选框时，调用该函数
    $scope.changeDateState = function(){
        if($scope.dateNotEdit){
            $scope.dateNotEdit = false;
        }
        else{
            $scope.dateNotEdit = true;
            $scope.dayStopLossEntitys.startDate = "";
            $scope.dayStopLossEntitys.endDate = "";
        }
    }

    //当改变时间控件的复选框时，调用该函数
    $scope.changeTimeState = function(){
        if($scope.timeNotEdit){
            $scope.timeNotEdit = false;
        }
        else{
            $scope.timeNotEdit = true;
            document.getElementById("riskday_myStartTime").value = "";
            document.getElementById("riskday_myEndTime").value = "";
        }
    };
  //点击新增回撤比例按钮时，进行初始化
   $scope.addDayStopLoss = function(){
	   $scope.riskDayStopLossActionCode = false;
	   $scope.initDetailSelect();
       $scope.updateEntity = {};
       $scope.updateEntity.idxID = null;
       $scope.updateEntity.mID = null;
       $scope.updateEntity.brokerID = "";
       $scope.updateEntity.fundID = "";
       $scope.updateEntity.startDate = "";
       $scope.updateEntity.endDate = "";
       $scope.updateEntity.startTime = "";
       $scope.updateEntity.endTime = "";
       $scope.updateEntity.lconval1 = "";
       $scope.updateEntity.lcontag1 = "";
       $scope.updateEntity.rcontag1 = "";
       $scope.updateEntity.rconval1 = "";
       $scope.updateEntity.actionCode = "";
      // $scope.$apply();
   }
   
   //点击保存按钮触发该函数（根据updateEntity中的内容来区别是新增数据还是修改数据）
   $scope.saveDayStopLoss = function(entity){
    entity.fundID = sessionStorage.listFundID;
    entity.startTime = document.getElementById("riskday_myStartTime").value;
    entity.endTime = document.getElementById("riskday_myEndTime").value;
    entity.condfield1 = "回撤比例";
    entity.updateEntity = $scope.updateEntity;
       
       
    //当日期复选框选中了之后，开始日期和结束日期必须填,且开始日期必须小于等于结束日期
   	if(entity.myDate==true&&(entity.startDate==""||entity.startDate==null||entity.startDate==undefined)){
   		layer.alert("开始日期不能为空"); 
       	return false;
   	}
   	if(entity.myDate==true&&(entity.endDate==""||entity.endDate==null||entity.endDate==undefined)){
   		layer.alert("结束日期不能为空"); 
       	return false;
   	}
   	
   	if(entity.myDate==true&&entity.startDate!=null&&entity.endDate!=null&&entity.startDate!=""&&entity.endDate!=""&&entity.startDate!=undefined&&entity.endDate!=undefined){
   		if(parseInt(entity.startDate)-parseInt(entity.endDate)>0){
   			layer.alert("结束日期不能小于开始日期"); 
           	return false;
   		}
   		if(entity.myTime==false||entity.myTime==""||entity.myTime==undefined){
   			layer.alert("选择日期,必须选择时间"); 
           	return false;
   		}
/*   		if(document.getElementById("riskday_myStartTime").value==""||document.getElementById("riskday_myStartTime").value==null||document.getElementById("riskday_myStartTime").value==undefined){
   	   		layer.alert("开始时间不能为空"); 
   	       	return false;
   	   	}
   		
   		if(document.getElementById("riskday_myEndTime").value==""||document.getElementById("riskday_myEndTime").value==null||document.getElementById("riskday_myEndTime").value==undefined){
   	   		layer.alert("结束时间不能为空"); 
   	       	return false;
   	   	}*/
   	}
   	//如果勾选了时间复选框，日期，时间必须填，且同一天生效开始时间必须小于生效结束
/*	if(entity.myTime==true&&(entity.startDate==""||entity.startDate==null||entity.startDate==undefined)){
   		layer.alert("开始日期不能为空"); 
       	return false;
   	}
	if(entity.myTime==true&&(entity.endDate==""||entity.endDate==null||entity.endDate==undefined)){
   		layer.alert("结束日期不能为空"); 
       	return false;
   	}
	if(entity.myTime==true&&entity.startDate!=null&&entity.endDate!=null&&entity.startDate!=""&&entity.endDate!=""&&entity.startDate!=undefined&&entity.endDate!=undefined){
   		if(parseInt(entity.startDate)-parseInt(entity.endDate)>0){
   			layer.alert("结束日期不能小于开始日期"); 
           	return false;
   		}
   	}*/
   	if(entity.myTime==true&&(document.getElementById("riskday_myStartTime").value==""||document.getElementById("riskday_myStartTime").value==null||document.getElementById("riskday_myStartTime").value==undefined)){
   		layer.alert("开始时间不能为空"); 
       	return false;
   	}
   	if(entity.myTime==true&&(document.getElementById("riskday_myEndTime").value==""||document.getElementById("riskday_myEndTime").value==null||document.getElementById("riskday_myEndTime").value==undefined)){
   		layer.alert("结束时间不能为空"); 
       	return false;
   	}
   	
   	if(entity.myTime==true&&document.getElementById("riskday_myStartTime").value!=""&&document.getElementById("riskday_myStartTime").value!=null&&document.getElementById("riskday_myStartTime").value!=undefined&&
   			document.getElementById("riskday_myEndTime").value!=""&&document.getElementById("riskday_myEndTime").value!=null&&document.getElementById("riskday_myEndTime").value!=undefined){
   		    //如果开始日期和结束日期相等
   			var startT = document.getElementById("riskday_myStartTime").value;
   			var endT = document.getElementById("riskday_myEndTime").value;
   			startT = startT.replace(/:/g,"");
   			endT = endT.replace(/:/g,"");
   			if(startT-endT>=0){
   				layer.alert("结束时间必须大于开始时间"); 
   		       	return false;
   			}
   	}
   	
   	
	if((entity.lconval1==""||entity.lconval1==null||entity.lconval1==undefined)&&(entity.rconval1==""||entity.rconval1==null||entity.rconval1==undefined)){
   		layer.alert("回撤比例至少有一个值"); 
       	return false;
   	}
   	
	if(entity.lconval1!=""&&entity.lconval1!=null&&entity.lconval1!=undefined){
   		if(isNaN(entity.lconval1)){
   			layer.alert("回撤比例必须是范围为:[0.0001,0.9999]的数字"); 
   	       	return false;
   		}
   		if(!isNaN(entity.lconval1)){
   			if(entity.lconval1<0){
   		   		layer.alert("回撤比例的取值范围是:[0.0001,0.9999],不能小于0"); 
   		       	return false;
   		   	}
   			if(entity.lconval1>0.9999){
   	   			layer.alert("回撤比例的取值范围是:[0.0001,0.9999],不能大于0.9999" ); 
   	           	return false;
   	   		}
   			if(entity.lconval1<0.0001){
   	   			layer.alert("回撤比例的取值范围是:[0.0001,0.9999],不能小于0.0001" ); 
   	           	return false;
   	   		}
   		}
   	}
	if(entity.rconval1!=""&&entity.rconval1!=null&&entity.rconval1!=undefined){
   		if(isNaN(entity.rconval1)){
   			layer.alert("回撤比例必须是范围为:[0.0001,0.9999]的数字"); 
   	       	return false;
   		}
   		if(!isNaN(entity.rconval1)){
   			if(entity.rconval1<0){
   		   		layer.alert("回撤比例的取值范围是:[0.0001,0.9999],不能小于0"); 
   		       	return false;
   		   	}
   			if(entity.rconval1>0.9999){
   	   			layer.alert("回撤比例的取值范围是:[0.0001,0.9999],不能大于0.9999" ); 
   	           	return false;
   	   		}
   			if(entity.rconval1<0.0001){
   	   			layer.alert("回撤比例的取值范围是:[0.0001,0.9999],不能小于0.0001" ); 
   	           	return false;
   	   		}
   		}
   	}
   	if(entity.lconval1!=null&&entity.lconval1!=""&&entity.lconval1!=undefined&&entity.rconval1!=null&&entity.rconval1!=""&&entity.rconval1!=undefined&&
   			!isNaN(entity.lconval1)&&!isNaN(entity.rconval1)&&entity.lconval1<=0.9999&&entity.lconval1>=0.0001&&entity.rconval1<=0.9999&&entity.rconval1>0.0001){
   		if(entity.lcontag1!="=" && entity.rcontag1!="=" && entity.lconval1-entity.rconval1>=0){
   			layer.alert("左条件值需<右条件值"); 
           	return false;
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
   	}
       layer.load(2, {
   	    shade: [0.5,'#fff'] //0.1透明度的白色背景
   	});
       addTmpRiskDayStopLossEntity(entity,sessionStorage.listBrokerID,function(errCode,errMsg){
           if(errCode == 0) {
               if(entity.updateEntity.lconval1 != "" || entity.updateEntity.rconval1 != ""){
                   layer.alert("修改成功");
               }
               else{
                   layer.alert("新增成功");
               }
               var mytable = document.getElementById("riskday_mytable");
               var riskday_outerContainer = document.getElementById("riskday_outerContainer");
               riskday_outerContainer.removeChild(mytable);
               var riskday_newContainer = document.createElement("div");
               riskday_newContainer.id = "riskday_mytable";
               riskday_newContainer.innerHTML = "<table id='riskDayStopLoss_table' class='cell-border stripe' cellspacing='0' width='100%'></table>";
               riskday_outerContainer.appendChild(riskday_newContainer);
               //destroyDatatable("riskDayStopLoss_table");
               $scope.getDayStopLoss(false);//调用查询函数获得最新数据
               $scope.addDayStopLoss();//初始化页面
               $scope.riskDayStopLossShow = false;
               $scope.$apply();
           }else if(errCode == 1){
        	   layer.alert(errMsg);
           }else if(errCode ==11){
        	   layer.alert(errMsg);
           }else{
        	   if(entity.updateEntity.lconval1 != "" || entity.updateEntity.rconval1 != ""){
                   layer.alert("修改失败");
               }else{
            	   layer.alert("新增失败");
               }
           }
           layer.closeAll('loading');
       });
   };
   
   
    
  /*  //当点击某一行时触发的事件
    $("body").delegate("#riskDayStopLoss_table tbody tr", "click", function (){
        //为选中的行设置选中色
        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
        }
        else{
            $("tr.selected").removeClass("selected");
            $(this).addClass("selected");
        }
        //先获得选中的表格，然后获得选中的表格里的被选中的那一列
        var table = $("#riskDayStopLoss_table").DataTable();
        var tempArr = table.row($(this)).data();
        //将被选中的那一列的信息添加到updateEnetity中（因为选中该行之后，可能要执行修改操作，修改操作需要把选中行的公共信息回传）
        $scope.updateEntity = {};
        $scope.updateEntity.mID = tempArr[1];
        $scope.updateEntity.idxID = tempArr[2];
        $scope.updateEntity.brokerID = tempArr[3];
        $scope.updateEntity.fundID = tempArr[4];
        $scope.updateEntity.startDate = tempArr[5];
        $scope.updateEntity.endDate = tempArr[6];
        $scope.updateEntity.startTime = tempArr[7];
        $scope.updateEntity.endTime = tempArr[8];
        $scope.updateEntity.lconval1 = tempArr[10];
        $scope.updateEntity.lcontag1 = tempArr[11];
        $scope.updateEntity.rcontag1 = tempArr[13];
        $scope.updateEntity.rconval1 = tempArr[14];
        $scope.updateEntity.actionCode = $scope.changeActionCodeName(tempArr[15]);

        $scope.dayStopLossEntitys.startDate = tempArr[5];
        $scope.dayStopLossEntitys.endDate = tempArr[6];
        document.getElementById("riskday_myStartTime").value = tempArr[7];
        document.getElementById("riskday_myEndTime").value = tempArr[8];
        //让日期选项不可点击
        $scope.dateNotEdit = true;
        $scope.dayStopLossEntitys.myDate = false;
        //让时间选项不可点击
        $scope.timeNotEdit = true;
        $scope.dayStopLossEntitys.myTime = false;
        
        if($scope.dayStopLossEntitys.startDate != "" && $scope.dayStopLossEntitys.endDate != ""){
            $scope.dayStopLossEntitys.myDate = true;
            $scope.dateNotEdit = false;
        }
        if( document.getElementById("riskday_myStartTime").value != "" &&  document.getElementById("riskday_myEndTime").value != ""){
            $scope.dayStopLossEntitys.myTime = true;
            $scope.timeNotEdit = false;
        }
        if(tempArr[10]=="NaN"){
        	$scope.dayStopLossEntitys.lconval1 = "";
        }else{
        	$scope.dayStopLossEntitys.lconval1 = tempArr[10];
        }
      
        if(tempArr[11] != ""){
            $scope.dayStopLossEntitys.lcontag1 = tempArr[11];
        }
        if(tempArr[13] != ""){
            $scope.dayStopLossEntitys.rcontag1 = tempArr[13];
        }
        if(tempArr[14]=="NaN"){
        	$scope.dayStopLossEntitys.rconval1 = "";
        }else{
        	$scope.dayStopLossEntitys.rconval1 = tempArr[14];
        }
        $scope.dayStopLossEntitys.actionCode = $scope.changeActionCodeName(tempArr[15]);
        
        $scope.$apply();
    });*/

   //点击修改
   $("body").delegate("#riskDayStopLoss_table td .riskday_updateIndex","click",function(){
	   $scope.riskDayStopLossShow = true;
	   $scope.riskDayStopLossButtonEdit = false;
	 //为选中的行设置选中色
       if($(this).closest('tr').hasClass("selected")){
           $(this).closest('tr').removeClass("selected");
       }
       else{
           $("tr.selected").removeClass("selected");
           $(this).closest('tr').addClass("selected");
       }
       //先获得选中的表格，然后获得选中的表格里的被选中的那一列
       var table = $("#riskDayStopLoss_table").DataTable();
       
       var tr = $(this).closest('tr');
       var tempArr = table.row(tr).data();
       
       /*var tempArr = table.row($(this)).data();*/
       //将被选中的那一列的信息添加到updateEnetity中（因为选中该行之后，可能要执行修改操作，修改操作需要把选中行的公共信息回传）
       $scope.updateEntity = {};
       $scope.updateEntity.mID = tempArr[1];
       $scope.updateEntity.idxID = tempArr[2];
       $scope.updateEntity.brokerID = tempArr[3];
       $scope.updateEntity.fundID = tempArr[4];
       $scope.updateEntity.startDate = tempArr[5];
       $scope.updateEntity.endDate = tempArr[6];
       $scope.updateEntity.startTime = tempArr[7];
       $scope.updateEntity.endTime = tempArr[8];
       $scope.updateEntity.lconval1 = tempArr[10];
       $scope.updateEntity.lcontag1 = tempArr[11];
       $scope.updateEntity.rcontag1 = tempArr[13];
       $scope.updateEntity.rconval1 = tempArr[14];
       $scope.updateEntity.actionCode = $scope.changeActionCodeName(tempArr[15]);

       $scope.dayStopLossEntitys.startDate = tempArr[5];
       $scope.dayStopLossEntitys.endDate = tempArr[6];
       document.getElementById("riskday_myStartTime").value = tempArr[7];
       document.getElementById("riskday_myEndTime").value = tempArr[8];
       //让日期选项不可点击
       $scope.dateNotEdit = true;
       $scope.dayStopLossEntitys.myDate = false;
       //让时间选项不可点击
       $scope.timeNotEdit = true;
       $scope.dayStopLossEntitys.myTime = false;
       
       if($scope.dayStopLossEntitys.startDate != "" && $scope.dayStopLossEntitys.endDate != ""){
           $scope.dayStopLossEntitys.myDate = true;
           $scope.dateNotEdit = false;
       }
       if( document.getElementById("riskday_myStartTime").value != "" &&  document.getElementById("riskday_myEndTime").value != ""){
           $scope.dayStopLossEntitys.myTime = true;
           $scope.timeNotEdit = false;
       }
       if(tempArr[10]=="NaN"){
       	$scope.dayStopLossEntitys.lconval1 = "";
       }else{
       	$scope.dayStopLossEntitys.lconval1 = tempArr[10];
       }
     
       if(tempArr[11] != ""){
           $scope.dayStopLossEntitys.lcontag1 = tempArr[11];
       }
       if(tempArr[13] != ""){
           $scope.dayStopLossEntitys.rcontag1 = tempArr[13];
       }
       if(tempArr[14]=="NaN"){
       	$scope.dayStopLossEntitys.rconval1 = "";
       }else{
       	$scope.dayStopLossEntitys.rconval1 = tempArr[14];
       }
       $scope.dayStopLossEntitys.actionCode = $scope.changeActionCodeName(tempArr[15]);
       $scope.riskDayStopLossActionCode = true;
       $scope.$apply();  
   });
   
    //点击删除按钮时
    $("body").delegate("#riskDayStopLoss_table td .riskday_deleteIndex","click",function(){
        var table = $("#riskDayStopLoss_table").DataTable();
        var mytr = $(this).parents('tr');
        var tempArr = table.row(mytr).data();
        
        //获得被删除行的信息
        $scope.delEntity = {};
        $scope.delEntity.mID = tempArr[1];
        $scope.delEntity.idxID = tempArr[2];
        $scope.delEntity.brokerID = tempArr[3];
        $scope.delEntity.fundID = tempArr[4];
        $scope.delEntity.startDate = tempArr[5];
        $scope.delEntity.endDate = tempArr[6];
        $scope.delEntity.startTime = tempArr[7];
        $scope.delEntity.endTime = tempArr[8];
        $scope.delEntity.lconval1 = tempArr[10];
        $scope.delEntity.lcontag1 = tempArr[11];
        $scope.delEntity.rcontag1 = tempArr[13];
        $scope.delEntity.rconval1 = tempArr[14];
        $scope.delEntity.actionCode = $scope.changeActionCodeName(tempArr[15]);
        
        //防止删除按钮执行两边的控件
      /*  if(localStorage.riskday_deleteProduct == ""){
            $scope.riskday_delProductFlag = true;
        }
        if($scope.riskday_delProductFlag){
            localStorage.riskday_deleteProduct = $(this);*/
            layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
            	deleteRiskDayStopLossData( $scope.delEntity,sessionStorage.listBrokerID,"true",function(errCode,errMsg){
                    if(errCode == 0) {
                        var b = true;
                        if(b==true){
                        	  var mytable = document.getElementById("riskday_mytable");
                              var riskday_outerContainer = document.getElementById("riskday_outerContainer");
                              riskday_outerContainer.removeChild(mytable);
                              var riskday_newContainer = document.createElement("div");
                              riskday_newContainer.id = "riskday_mytable";
                              riskday_newContainer.innerHTML = "<table id='riskDayStopLoss_table' class='cell-border stripe' cellspacing='0' width='100%'></table>";
                              riskday_outerContainer.appendChild(riskday_newContainer);
                        	 //destroyDatatable("riskDayStopLoss_table");
                             $scope.getDayStopLoss(false);//调用查询函数获得最新数据
                             $scope.addDayStopLoss();//初始化页面
                             $scope.riskDayStopLossShow = false;
                             $scope.$apply();
                            b = false;
                        }
                        if(b==false){
                            layer.alert("删除成功");
                        }
                    }else if(errCode==1){
                    	 layer.alert(errMsg);
                    }else if(errCode==2){
                    	layer.alert(errMsg);
                    }
                    else{
                        layer.alert("删除失败");
                    }
                })
            })
        /*}*/

    });


})