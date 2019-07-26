myapp.controller('userRiskparameterController', function ($scope, $timeout,$rootScope) {

    $scope.subCapitalAccountService =  new com.quantdo.orgClear.service.SubCapitalAccountService();
    $scope.subAccountRiskParamService =  new com.quantdo.orgClear.service.SubAccountRiskParamService();
    $scope.riskAccountFutureVarietySetService = new com.quantdo.orgClear.service.RiskAccountFutureVarietySetService();
    $scope.subAccounts = [];
    $scope.entitys = [];
    $scope.listEntitys = [];
    $scope.subAccountRiskParam = [];
    $scope.ModalEntity = {};
    $scope.subAccount = {};
    $scope.isInsert = true; // 是否新增 true：新增 false：不新增
    $scope.isChange = "0"; // 是否切换 0：切换 1：不切换
    $scope.isCommit = true;
    $scope.isUpdate = true;
    $scope.allChecked = false;
    $scope.QuerySubAccount = {};
    $scope.accParameTypes = clearConstant.accParameTypes;//资产单元参数类型
    $scope.isShowAMT = false;
    $scope.isShowRatio = false;    
    //设置按钮的名称
    $scope.buttonEdit = true;
    $scope.ModalEntity.accParamType = "";
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"userRiskParameters_tabCallBackFunc");
	$scope.userRiskParameters_tabCallBackFunc = tabCallBackFunc;
    $scope.getMyTableModel = function(table_id,table_columns,table_data,height,orderFlag) {
        return $("#" + table_id).DataTable({
            columns: table_columns,
            data: table_data,
            scrollY: height,
            scrollCollapse:true,
            scrollX: true,
            dom: 'rt<"bottom"ipl>',
            ordering: orderFlag,
            order: [[ 1, "asc" ]],
            //paging:   false,
            //pagingType: "full_numbers",
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
        })
    };
    
  
    
    $scope.dynamic_table_dataset = [];
    $scope.dynamic_table_column_Array = [
                                             {title:'<a><input type="checkbox" class="allCheckButton" ng-model="allChecked" ng-checked="isSelected"/></a>',visible:false},
                                             {title:"序号"},
                                             {title:"机构代码",visible:false},
                                             {title:"机构"},
                                             {title:"资产单元",visible:false},
                                             {title:"资产单元"},
                                             {title:"初始资金"},
                                             {title:"追保风险度"},
                                             {title:"强平风险度"},
                                             {title:"最大撤单次数",visible:false},
                                             {title:"设置类型"},
                                             {title:"操作"}
                                        ];
    
   
    //获得资产单元下拉框数据
    $scope.getPullDownList = function(){
    	$scope.subCapitalAccountService.findSubById(function(result1){
    	    //获得主页面下拉框数据
    		$scope.riskAccountFutureVarietySetService.querySubAccount(function(result){
    	    	$scope.subAccountRiskParam = result;//主页面
    	        $scope.$apply();
    	    });
    	
    		var temp = [];
    		for(var i=0;i<$scope.subAccountRiskParam.length;i++){
    			temp.push($scope.subAccountRiskParam[i]);
    		}
    		if(result1!=undefined && result1!=null){
    			for(var j=0;j<result1.length;j++){
    				for(var k=0;k<temp.length;k++){
    					if(result1[j].subAccountID==temp[k].subAccountID.split(":")[1]){
    						temp.splice(k,1);
    					}
    				}
    			}
    		}
    		$scope.subAccounts = temp;
    		$scope.$apply();
        },null,null);
    }
    $scope.changeStr = function(key,value){
    	if(key == 0) return value.toFixed(2);
    	if(key == 1) return value.toFixed(2)+"%";
    }
    
   /* //进入页面自动查询数据并显示
    var myTable = "";
	$scope.subCapitalAccountService.findSubById(function(result){
    	//更新表结构
    	$scope.dynamic_table_dataset = [];
    	var con = result;
    	if(con != undefined){
        	for(var i = 0;i<con.length;i++){
        		var tempArr = ["<input type='checkbox' ng-model='flag' ng-click='checkAdd(flag,listEntity)' ng-checked='isSelected'></input>",i+1,con[i].brokerID,con[i].brokerName,
        		               con[i].subAccountID,con[i].subAccountName,con[i].initFund,$scope.changeStr(con[i].accParamType,con[i].callRisk),$scope.changeStr(con[i].accParamType,con[i].forceRisk),con[i].maxCancelAmt,
        		               $rootScope.getShowValue($scope.accParameTypes,con[i].accParamType),
        		               "<a style='cursor:pointer;' class='updateButton' data-toggle='modal' data-target='#userriskparameterMyModalfof'>[修改]</a> <a style='cursor:pointer;' data-target='#del' class='deleteButton'>[删除]</a>"
        		               ];
        		$scope.dynamic_table_dataset.push(tempArr);
        	}
    	}
    	myTable = $scope.getMyTableModel("dynamic_table",$scope.dynamic_table_column_Array,$scope.dynamic_table_dataset,300,true);
    	$scope.$apply();
	},null,null);*/
    var myTable = "";
	 //$(document).ready(function(){
		 //进入页面自动查询数据并显示
    $scope.userRIksParameterFofAddShow = false;
	$scope.subCapitalAccountService.findSubById(function(result){
    	//更新表结构
    	$scope.dynamic_table_dataset = [];
    	var con = result;
    	if(con != undefined){
        	for(var i = 0;i<con.length;i++){
        		var tempArr = ["<input type='checkbox' ng-model='flag' ng-click='checkAdd(flag,listEntity)' ng-checked='isSelected'></input>",i+1,con[i].brokerID,con[i].brokerName,
        		               con[i].subAccountID,con[i].subAccountName,con[i].initFund.toFixed(2),$scope.changeStr(con[i].accParamType,con[i].callRisk),$scope.changeStr(con[i].accParamType,con[i].forceRisk),con[i].maxCancelAmt,
        		               $rootScope.getShowValue($scope.accParameTypes,con[i].accParamType),
        		               "<a style='cursor:pointer;' name = 'RiskAccountExchangeOrderControlService.saveRiskAccountExchangeOrderControl' class='updateButton backFilter' data-toggle='modal' data-target='#userriskparameterMyModalfof'>[修改]</a> <a style='cursor:pointer;' data-target='#del' name = 'RiskAccountExchangeOrderControlService.saveRiskAccountExchangeOrderControl' class='deleteButton backFilter'>[删除]</a>"
        		               ];
        		$scope.dynamic_table_dataset.push(tempArr);
        	}
    	}
    	myTable = $scope.getMyTableModel("dynamic_table",$scope.dynamic_table_column_Array,$scope.dynamic_table_dataset,300,true);
    	var myfilter = document.getElementsByClassName("backFilter");
        hideAfterFilter($rootScope.filterEntity,myfilter);
        $scope.userRIksParameterFofAddShow = true;
	    $scope.$apply();
	},null,null);
	
	$('#dynamic_table').on( 'page.dt', function () {
    	setTimeout(function(){
    		var myfilter = document.getElementsByClassName("backFilter");
        	hideAfterFilter($rootScope.filterEntity,myfilter);
    	})
    }); 
    
    $("body").delegate('#dynamic_table_length div').undelegate("change").on('change', 'select[name="dynamic_table_length"]', function () {
    	setTimeout(function(){
    		var myfilter = document.getElementsByClassName("backFilter");
        	hideAfterFilter($rootScope.filterEntity,myfilter);
    	})
    });
		  /* setTimeout(function(){
			   var myfilter = document.getElementsByClassName("backFilter");
		       hideAfterFilter($rootScope.filterEntity,myfilter);
		   },"100")
		   setTimeout(function(){
			   $scope.userRIksParameterFofAddShow = true;
			   $scope.$apply();
		   },"100")*/
	   //});
   $scope.getPullDownList();
	
   $scope.getMyTable = function(myParam1,myParam2){
	 $scope.subCapitalAccountService.findSubById(function(result){
		//更新表结构
     	$scope.dynamic_table_dataset = [];
     	var con = result;
     	if(con != undefined){
         	for(var i = 0;i<con.length;i++){
         		var tempArr = ["<input type='checkbox' ng-model='flag' ng-click='checkAdd(flag,listEntity)' ng-checked='isSelected'></input>",i+1,con[i].brokerID,con[i].brokerName,
         		               con[i].subAccountID,con[i].subAccountName,con[i].initFund.toFixed(2),$scope.changeStr(con[i].accParamType,con[i].callRisk),$scope.changeStr(con[i].accParamType,con[i].forceRisk),con[i].maxCancelAmt,
         		               $rootScope.getShowValue($scope.accParameTypes,con[i].accParamType),
         		              "<a style='cursor:pointer;' name = 'RiskAccountExchangeOrderControlService.saveRiskAccountExchangeOrderControl' class='updateButton backFilter' data-toggle='modal' data-target='#userriskparameterMyModalfof'>[修改]</a> <a style='cursor:pointer;' data-target='#del' name = 'RiskAccountExchangeOrderControlService.saveRiskAccountExchangeOrderControl' class='deleteButton backFilter'>[删除]</a>"
         		               ];
         		$rootScope.getShowValue($scope.accParameTypes,con[i].accParamType)
         		$scope.dynamic_table_dataset.push(tempArr);
         	}
     	}
     	myTable.destroy();
     	myTable = $scope.getMyTableModel("dynamic_table",$scope.dynamic_table_column_Array,$scope.dynamic_table_dataset,300,true);
     	var myfilter = document.getElementsByClassName("backFilter");
        hideAfterFilter($rootScope.filterEntity,myfilter);
        $scope.userRIksParameterFofAddShow = true;
	    $scope.$apply();
     },myParam1,myParam2);
   }
    //保存按钮
    $scope.save = function(ModalEntity,subAccountID){
        ModalEntity.subAccountID = subAccountID.split(":")[1];
        ModalEntity.instClientID = subAccountID.split(":")[0];
        ModalEntity.maxMargin = 0;
        ModalEntity.maxPosiAmt = 0;
        ModalEntity.maxCancelAmt = 0;//这些值内有从页面进行设置，在这里默认为0
        if(undefined == ModalEntity.subAccountID || null == ModalEntity.subAccountID || "" ==ModalEntity.subAccountID.trim()){
            //layer.msg("请选择资产单元",{icon:2});
            layer.alert("请选择资产单元");
            return false ;
        }
        if($scope.isShowAMT == true){
        	if(ModalEntity.forceRisk - ModalEntity.callRisk>=0){
        		layer.alert("追保风险度需要大于强平风险度");
        		return false;
        	}
        }else if($scope.isShowRatio == true){
        	if(ModalEntity.callRiskRatio - ModalEntity.forceRiskRatio>=0){
        		layer.alert("追保风险度需要小于强平风险度");
        		return false;
        	}
        	ModalEntity.forceRisk = ModalEntity.forceRiskRatio;
        	ModalEntity.callRisk = ModalEntity.callRiskRatio;
        }
        
        $scope.subAccountRiskParamService.save(function(result){
            if(undefined != result){
            		 $("#userriskparameterMyModalfof").modal("hide");
                	 $scope.$apply();
            	
                //layer.msg("保存成功",{icon:1});
            	if($scope.isInsert==true){
            		 layer.alert("新增成功");
            	}else if($scope.isInsert==false){
            		 layer.alert("修改成功");
            	}
               
            	 $scope.getMyTable(null,null);
            	 $scope.getPullDownList();
            }
        },ModalEntity,$scope.isInsert);
    };
    
    $("body").undelegate("#dynamic_table td .deleteButton","click");
    //删除按钮
    $("body").delegate("#dynamic_table td .deleteButton","click",function(){
    	var subAccountID = myTable.row($(this).parents('tr')).data()[4];
    	var brokerID = myTable.row($(this).parents('tr')).data()[2];
        layer.confirm("确定删除风险参数？",{icon:3},function(){
            $scope.subAccountRiskParamService.delete(function (result) {
            		 //layer.msg("删除成功",{icon:1});
            		 layer.alert("删除成功");
                     //删除成功后重绘表格

                	 $scope.getMyTable(null,null);
                	 $scope.getPullDownList();
              },subAccountID,brokerID);
         });
    }); 
    $("body").undelegate("#dynamic_table td .updateButton","click");
    //点击修改按钮
    $("body").delegate("#dynamic_table td .updateButton","click",function(){
    	formValidateReset();
    	//初始化Model框操作
    	$scope.buttonEdit = false;
    	$scope.initFundText = null;
    	$scope.callRiskText = null
    	$scope.forceRiskText = null;
    	$scope.stauts = "1";
    	$scope.isInsert = false;
    	$scope.isChange = "0";
    	$scope.isCommit = false;
    	var brokerID = myTable.row($(this).parents('tr')).data()[2];
    	var brokerName = myTable.row($(this).parents('tr')).data()[3];
    	var subAccountID = myTable.row($(this).parents('tr')).data()[4];
    	var subAccountName = myTable.row($(this).parents('tr')).data()[5];
    	var initFund = myTable.row($(this).parents('tr')).data()[6];
    	var callRisk = myTable.row($(this).parents('tr')).data()[7];
    	var forceRisk = myTable.row($(this).parents('tr')).data()[8];
    	var paramType = myTable.row($(this).parents('tr')).data()[10];
    	
    	$scope.subAccount.subAccountID = brokerID+":"+subAccountID;
    	$scope.subAccount.subAccountName = brokerName+"_"+subAccountName;
    	$scope.subAccounts.push($scope.subAccount);
    	
    	$scope.subAccountID = brokerID+":"+subAccountID;
    	$scope.ModalEntity.initFund = initFund;
    	
    	$scope.ModalEntity.callRisk = "";
    	$scope.ModalEntity.forceRisk = "";
    	$scope.ModalEntity.callRiskRatio ="";
    	$scope.ModalEntity.forceRiskRatio = "";
    	
    	if("按金额" == paramType){
    		$scope.accParamType = "0";
    		$scope.ModalEntity.callRisk = callRisk;
        	$scope.ModalEntity.forceRisk = forceRisk;
    	}else if("按比例" == paramType){
    		$scope.accParamType = "1";
    		$scope.ModalEntity.callRiskRatio =callRisk.replace("%","");
        	$scope.ModalEntity.forceRiskRatio = forceRisk.replace("%","");
    	}
    	$scope.changedType($scope.accParamType);
    	
    	/*$scope.myForm.callRisk.$setPristine();
    	$scope.myForm.forceRisk.$setPristine();
    	$scope.myForm.initFund.$setPristine();*/
    	
    	$scope.$apply();
    });
    
  //查询
  $scope.find = function(QuerySubAccount){
	  var subAccount = null;
	  var brokerID = null;
	  if($scope.QuerySubAccount.subAccountID!=""&&$scope.QuerySubAccount.subAccountID!=null&&$scope.QuerySubAccount.subAccountID!=undefined){
		  var subAccount = $scope.QuerySubAccount.subAccountID.split(":")[1];
		  var brokerID = $scope.QuerySubAccount.subAccountID.split(":")[0];
	  }
    
    if(undefined == subAccount){

   	 $scope.getMyTable(null,null);
   	 $scope.getPullDownList();
    } else {

   	 $scope.getMyTable(subAccount,brokerID);
   	 $scope.getPullDownList();
    	}
    }
    
  /*  //点击标题复选框，进行全选
    $scope.allCheckedAdd = function (){
    	//全选
    	debuger;
    	if(flag){
    		$scope.isSelected = true;
    		myTable.clear().draw();
    		$scope.getMyTable();
    		 $scope.$apply();
    	} else {
    		$scope.isSelected = false;
    		myTable.clear().draw();
    		$scope.getMyTable();
    		 $scope.$apply();
    	}
    };*/
    
  /*  //批量删除
    $scope.del = function(){
    	if(undefined == $scope.entitys || $scope.entitys.length == 0){
    		layer.msg("请选择批量删除目标",{icon:2});
    		return;
    	}
    	layer.confirm("确定删除风险参数？",{icon:3},function(){
            $scope.subAccountRiskParamService.deletes(function (result) {
                layer.msg("风险参数删除成功",{icon:1});
                $scope.listEntitys = [];
                $scope.subCapitalAccountService.find(function(result){
                    $scope.listEntitys = result;
                    if(result != null && result.length > 0){
                    	for(var i = 0;i < $scope.listEntitys.length;i++){
                        	$scope.listEntitys[i].subAccountID = $scope.listEntitys[i].innerAccountID;
                        }
                        $scope.$apply();
                    }
                },null);
                
                $scope.subCapitalAccountService.findAllActiveRisParam(function(result){
                	$scope.subAccountRiskParam = result;
                	$scope.$apply();
                });
                
                $scope.isSelected = false;
                $scope.entitys = [];
            },$scope.entitys);
        });
    }*/
    
  

    

    //当改变MOdel框中的资金账号时，将其他的输入框清空
    $scope.findOne = function(entity){
    	$scope.initFund = null;
    	$scope.callRisk = null;
    	$scope.forceRisk = null;
    	$scope.stauts = "0";
    	if($scope.isChange == "0"){
    		query(entity);
    	}
    };
    
 /*   // 点击修改按钮
    $scope.edit = function(entity){
    	$scope.initFundText = null;
    	$scope.callRiskText = null
    	$scope.forceRiskText = null;
    	$scope.stauts = "1";
    	$scope.isInsert = false;
    	$scope.isChange = "0";
    	$scope.isCommit = false;
    	query(entity);
    	formValidateReset();
    }*/
    
    // 点击新增按钮
    $scope.insert = function(){
    	$scope.buttonEdit = true;
    	 $scope.getPullDownList();
    	
    	$scope.initFundText = null;
    	$scope.callRiskText = null
    	$scope.forceRiskText = null;
    	$scope.isInsert = true;
    	$scope.stauts = "0";
    	$scope.isChange = "1";
    	$scope.subAccountID = {};
        $scope.ModalEntity = {};
        $scope.isCommit = true;
        $scope.accParamType="";
        $scope.isShowAMT = false;
        $scope.isShowRatio = false;    
        formValidateReset();
    }
    
    //重置表单验证信息
    function formValidateReset(){
    	$scope.myForm.callRisk.$setPristine();
    	$scope.myForm.forceRisk.$setPristine();
    	$scope.myForm.callRiskRatio.$setPristine();
    	$scope.myForm.forceRiskRatio.$setPristine();
    	$scope.myForm.initFund.$setPristine();
    	//$scope.myForm.maxCancelAmt.$setPristine();
    	//$scope.myForm.accParamType.$setPristine();
    }
    
    // 查询风险参数
    function query(entity){
    	$scope.subAccountID = {};
    	$scope.subAccountID = entity.innerAccountID;
    	$scope.subAccountRiskParamService.findOne(function(result){
            $scope.ModalEntity = result;
            $scope.$apply();
        },entity.innerAccountID);
    };

   

   
    
  /*  $scope.checkAdd = function(flag,entity){
    	if(flag) {
    		 $scope.entitys.push(entity);
		} else {
			var index = $scope.entitys.indexOf(entity);
			 $scope.entitys.splice(index, 1);
		}
    }*/
    
    $scope.changed = function(subAccountID){
    	if(undefined == subAccountID || "" == subAccountID){
    		$scope.isCommit = true;	
    	} else {
    		$scope.isCommit = false;
    	}	
    };
    
    //选择设置类型
    $scope.changedType = function(accParamType){
    	$scope.ModalEntity.accParamType = accParamType;
    	if("" == accParamType || undefined == accParamType){
    		$scope.isShowAMT = false; 
    		$scope.isShowRatio = false;
    	} else if("0" == accParamType){
    		$scope.isShowAMT = true;
    		$scope.isShowRatio = false;
    	} else if("1" == accParamType){
    		$scope.isShowRatio = true; 
    		$scope.isShowAMT = false; 
    	}	
    };
    
    // 阿拉伯数字转换成中文
    $scope.toChinaNum = function(number,i){
    	toChinese(number,i);
    }
    
    $scope.inputBlur = function(number,i){
    	toChinese(number,i);
    }
    
    function toChinese(number,i){
    	if(undefined == number || "" == number){
    		$scope.initFund = null;
        	$scope.callRisk = null;
        	$scope.forceRisk = null;
        	$scope.callRiskRatio = null;
        	$scope.forceRiskRatio = null;
        	return ;
    	}
    	
    	var text = changeMoneyToChinese(number);
    	if(text != "error"){
    		switch(i){
    		case 0:
    			$scope.initFundText = text;
    			break;
    		case 1:
    			$scope.callRiskText = text;
    			break;
    		case 2:
    			$scope.forceRiskText = text;
    			break;
    		}
    	}
    }
    
    function changeMoneyToChinese( money )
    {
    var cnNums = new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"); // 汉字的数字
    var cnIntRadice = new Array("","拾","佰","仟"); // 基本单位
    var cnIntUnits = new Array("","万","亿","兆"); // 对应整数部分扩展单位
    var cnDecUnits = new Array("角","分","毫","厘"); // 对应小数部分单位
    var cnInteger = "整"; // 整数金额时后面跟的字符
    var cnIntLast = "元"; // 整型完以后的单位
    var maxNum = 999999999999999.9999; // 最大处理的数字

    var IntegerNum; // 金额整数部分
    var DecimalNum; // 金额小数部分
    var ChineseStr=""; // 输出的中文金额字符串
    var parts; // 分离金额后用的数组，预定义

    if( money == "" ){
    	return "";
    }

    money = parseFloat(money);
    if( money >= maxNum ){
    	layer.msg("超出最大处理数字",{icon:2});
    	return "";
    }
    if( money == 0 ){
    	ChineseStr = cnNums[0]+cnIntLast+cnInteger;
    	return ChineseStr;
    }
    money = money.toString(); // 转换为字符串
    if( money.indexOf(".") == -1 ){
    	IntegerNum = money;
    	DecimalNum = '';
    }else{
    	parts = money.split(".");
    	IntegerNum = parts[0];
    	DecimalNum = parts[1].substr(0,4);
    }
    if( parseInt(IntegerNum,10) > 0 ){// 获取整型部分转换
    	zeroCount = 0;
    	IntLen = IntegerNum.length;
	    for( i=0;i<IntLen;i++ ){
	    	n = IntegerNum.substr(i,1);
	    	p = IntLen - i - 1;
	    	q = p / 4;
	    	m = p % 4;
	    if( n == "0" ){
	    	zeroCount++;
	    }else{
	    	if( zeroCount > 0 ){
	    		ChineseStr += cnNums[0];
	    	}
	    	zeroCount = 0; // 归零
	    	ChineseStr += cnNums[parseInt(n)]+cnIntRadice[m];
	    }
		    if( m==0 && zeroCount<4 ){
		    	ChineseStr += cnIntUnits[q];
		    }
	    }
    ChineseStr += cnIntLast;
    // 整型部分处理完毕
    }
    if( DecimalNum!= '' ){// 小数部分
    	decLen = DecimalNum.length;
	    for( i=0; i<decLen; i++ ){
	    	n = DecimalNum.substr(i,1);
		    if( n != '0' ){
		    	ChineseStr += cnNums[Number(n)]+cnDecUnits[i];
		    }
	    }
    }
    if( ChineseStr == '' ){
    	ChineseStr += cnNums[0]+cnIntLast+cnInteger;
    }
    else if( DecimalNum == '' ){
    	ChineseStr += cnInteger;
    }
    	return ChineseStr;
    }
});
