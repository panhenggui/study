/**
 * Created by Quantdo on 2016/07/18
 */
myapp.controller('positionProportionSetController',function($scope,$rootScope) {
	
	//初始化接口
    $scope.positionMarketProportionSetService = new com.quantdo.orgClear.service.PositionMarketProportionSetService();
   
    //设置按钮的名称
	var constant_temp = new com.quantdo.orgClear.constant.ClearConstants();
	$scope.portfolioRiskControlSet_buttonName_detail_save = constant_temp.buttonName.setPara;
	$scope.portfolioRiskControlSet_buttonName_detail_update = constant_temp.buttonName.resetPara;
	$scope.updateOrSavaContent_save = constant_temp.buttonName.saveData;
	$scope.updateOrSavaContent_update = constant_temp.buttonName.updateData;
	$scope.positionProportionSetShow = false;
	$scope.positionProportionSetEdit = true;
	
	//点击新增
	$scope.showDetail = function(){
		$scope.positionProportionSetShow = true;
		$scope.positionProportionSetEdit = true;
		$scope.addPostionSet();
	}
	//点击取消修改
	$scope.giveUpUpdate = function(){
		$scope.positionProportionSetShow = false;
		$scope.addPostionSet();
	}
    $scope.paramType = "";
    //初始化合约类型
    $scope.contractTypes = clearConstant.contractType;
    //当前页面为持仓占比，初始化页面标示
    $scope.pageProper = "1";
    //股票
    $scope.STOCK = "1";
    $scope.stockList = [];
    //期货   
    $scope.FUTURES = "2";
    $scope.futuresList = [];
    //基金   
    $scope.FUND = "3";
    $scope.fundList = [];
    //债券   
    $scope.BOND = "4";
    $scope.bondList = [];
    
    //资产类型
    $scope.riskgroup = [];
    
    //	统计粒度
    $scope.statistics = [];
    
    //	分子
    $scope.molecule = [];
    
    //	分母
    $scope.denominator = [];
    
    //  新增或者删除
    $scope.addOrUpdateFlag = true;
    
    // 初始化radio
    $scope.initRadio = $scope.contractTypes[0].key;
    //数据初始化下拉框信息
    $scope.positionMarketProportionSetService.queryRiskGropAndDic($scope.pageProper,sessionStorage.listBrokerID,function(result){
    	if(result){
    		
    		$scope.stockList = result.STOCK;

    		$scope.futuresList = result.FUTURES;
    		
    		$scope.fundList = result.FUND;
    		
    		$scope.bondList = result.BOND;
    		
    		
   	 	    $scope.initSelect();
    	}else{
    		layer.alert("后台发生故障");
    	}
    	$scope.$apply();
    });
//  保存信息实体
    $scope.entity = {};
    
    $scope.initSelect = function(){
    	$scope.statistics = [];
    	$scope.molecule = [];
    	$scope.denominator = [];
    	$scope.riskgroup = [];
    	$("input[name=positionProportion_contractType]:checked").each(function(){
    		 
    		if(this.value == $scope.STOCK){
    			//股票
    			Array.prototype.push.apply($scope.riskgroup, $scope.stockList.RISKGROUP);
    			$scope.entity.market = "1";
    			Array.prototype.push.apply($scope.statistics, $scope.stockList.STATISTICS); 
        		Array.prototype.push.apply($scope.molecule, $scope.stockList.MOLECULE); 
        		Array.prototype.push.apply($scope.denominator, $scope.stockList.DENOMINATOR);
    		}
    		else if(this.value == $scope.FUTURES){
//    			期货
    			Array.prototype.push.apply($scope.riskgroup, $scope.futuresList.RISKGROUP);
    			$scope.entity.market = "2";
    			Array.prototype.push.apply($scope.statistics, $scope.futuresList.STATISTICS); 
        		Array.prototype.push.apply($scope.molecule, $scope.futuresList.MOLECULE); 
        		Array.prototype.push.apply($scope.denominator, $scope.futuresList.DENOMINATOR); 
    		}
    		else if(this.value == $scope.FUND){
//    			基金
    			Array.prototype.push.apply($scope.riskgroup, $scope.fundList.RISKGROUP);
				$scope.entity.market = "3";
				Array.prototype.push.apply($scope.statistics, $scope.fundList.STATISTICS); 
	    		Array.prototype.push.apply($scope.molecule, $scope.fundList.MOLECULE); 
	    		Array.prototype.push.apply($scope.denominator, $scope.fundList.DENOMINATOR); 		
    		}
    		else if(this.value == $scope.BOND){
//				债券
    			Array.prototype.push.apply($scope.riskgroup, $scope.bondList.RISKGROUP);
				$scope.entity.market = "4";
				Array.prototype.push.apply($scope.statistics, $scope.bondList.STATISTICS); 
	    		Array.prototype.push.apply($scope.molecule, $scope.bondList.MOLECULE); 
	    		Array.prototype.push.apply($scope.denominator, $scope.bondList.DENOMINATOR); 
			}
    		
    		$scope.descr = "";
			if($scope.riskgroup.length>0){
				$scope.entity.groupID = $scope.riskgroup[0].groupID;
			}
			if($scope.statistics.length>0){
				$scope.entity.particlesize = $scope.statistics[0].dictId;
			}
			if($scope.molecule.length>0){
				$scope.entity.numerator = $scope.molecule[0].dictId;
			}
			if($scope.denominator.length>0){
				$scope.entity.denominator = $scope.denominator[0].dictId;
			}
//			【所有股票】的【单个债券】的【单个债券】的【发行量】的比例不超过1%
			/*if($scope.riskgroup.length>0 && $scope.statistics.length>0
					&&$scope.molecule.length>0 && $scope.denominator.length>0){
				
			}*/
			var gropuNameTmp = "";
			if($scope.riskgroup != undefined && $scope.riskgroup != null && $scope.riskgroup.length>0){
				gropuNameTmp = $scope.riskgroup[0].groupName;
			} 
			$scope.descr = "【"+gropuNameTmp+"】的"+
			"【"+$scope.statistics[0].dictName+"】"+
			"【"+$scope.molecule[0].dictName+"】占该"+
			"【"+$scope.denominator[0].dictName+"】的比例不超过";
			if($scope.entity.threshold){
//          	   tempArr.push(parseFloat($scope.entity.threshold).toFixed(2) + "%");

	    		$scope.descr += parseFloat($scope.entity.threshold).toFixed(2) + "%";
	    	}
//			$scope.$apply();
      	});
    }
    
    //存储表格中的数据
    $scope.dataset = [];
    //数据初始化
    $scope.positionProAddButtonIsShow = false;
    $scope.tplID = '9';
    $scope.initTableData = function(isControl){
    	$scope.positionMarketProportionSetService.findRiskFundProductByProductID($scope.tplID,sessionStorage.listFundID,sessionStorage.listBrokerID,function(result){
    		if(result){
    			$scope.dataset = [];
//    			destroyDatatable("positionProportionSet_table");
                var con = result;
                for(var i=0;i<con.length;i++){
                	var tmpmarket = "";
             	   	for(var x in $scope.contractTypes){
             	   		if($scope.contractTypes[x].key == con[i].market){
             	   			tmpmarket = $scope.contractTypes[x].text;
             	   			break;
             	   		}
             	   	}
//             	   tempArr.push(parseFloat(con[i].threshold).toFixed(2) + "%");
                	var tempArr = [i+1,tmpmarket,con[i].groupName,con[i].particlesizeName,
                	               con[i].numeratorName,con[i].denominatorName,parseFloat(con[i].threshold).toFixed(2),con[i].descr,
                	               "<a style='cursor:pointer;' name='PositionMarketProportionSetService.update' class='backFilter position_updateIndex'>[修改]</a> " +
                	               "<a style='cursor:pointer;' name='PositionMarketProportionSetService.delete' class='backFilter position_deleteIndex'>[删除]</a> ",
                	               con[i].id,con[i].groupID,con[i].particlesize,con[i].numerator,con[i].denominator,con[i].market];
                    $scope.dataset.push(tempArr);
                }
                $scope.getTable();
    		}else{
    			layer.alert("后台遇到未知错误！");
    		}
    		
    		if(isControl){
    			var myfilter = document.getElementsByClassName("backFilter");
    	 	    hideAfterFilter($rootScope.filterEntity,myfilter);
    	 	    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    		}
    		$scope.positionProAddButtonIsShow = true;
     		$scope.$apply();
    	});
    }
    
    //console.log($scope.contractTypes);
    //初始化持仓占比表格
    $scope.getTable = function() {
    	var columns_array = [
             {title: "序号"},
             {title: "市场"},
             {title: "资产类型"},
             {title: "统计粒度"},
             {title: "分子"},
             {title: "分母"},
             {title: "阈值(%)"},
             {title: "设置描述"},
             {title: "操作"},
             {title: "id", visible:false },
             {title: "groupID", visible:false },
             {title: "particlesize", visible:false },
             {title: "numerator", visible:false },
             {title: "denominator", visible:false },
             {title: "market", visible:false }
         ];
       	var table = $("#positionProportionSet_table").DataTable({
            data : $scope.dataset,
            columns :columns_array,
            //scrollCollapse:true,
            //paging: false,
            scrollX: true,
            dom : 'rt<"bottom"ipl>',
            "aoColumnDefs": [
                             { "sWidth": "40%", "aTargets": [ 7 ] }
            ],
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
//        var table = initDataTables("positionProportionSet_table", columns_array, $scope.dataset,120);
    };
    
//    定义保存方法
    $scope.positionSave = function(){
//    	设置持仓占比属性值
    	$scope.entity.tplID = "9";
    	if(sessionStorage.listFundID){
    		$scope.entity.fundId = sessionStorage.listFundID;
    	}else{
    		$scope.entity.fundId = "";
    	}
    	layer.load(2, {
		    shade: [0.5,'#fff'] //0.1透明度的白色背景
		});
    	$scope.positionMarketProportionSetService.save($scope.entity,sessionStorage.listBrokerID,function(result){
    		if(result){
    			layer.alert(result.errMessage);
    			var mytable = document.getElementById("innerPositionTable");
	            var outerContainer = document.getElementById("outPositionDiv");
	            outerContainer.removeChild(mytable);
	            var newContainer = document.createElement("div");
	            newContainer.id = "innerPositionTable";
	            newContainer.innerHTML = "<table id='positionProportionSet_table' class='cell-border stripe' cellspacing='0' width='100%'></table>";
	            outerContainer.appendChild(newContainer);
    			//destroyDatatable("positionProportionSet_table");
    			$scope.initTableData(false);
    			$scope.addPostionSet();
    			$scope.positionProportionSetShow = false;
    			$scope.$apply();
    		}else{
    			layer.alet("遇到未知问题!");
    		}
			layer.closeAll('loading');
    	});
    };
    
    $scope.initTableData(true);
    
    $('#positionProportionSet_table').on( 'page.dt', function () {
       	setTimeout(function(){
       		var myfilter = document.getElementsByClassName("backFilter");
           	hideAfterFilter($rootScope.filterEntity,myfilter);
       	})
       }); 
       
       $("body").delegate('#positionProportionSet_table_length div').on('change', 'select[name="positionProportionSet_table_length"]', function () {
       	setTimeout(function(){
       		var myfilter = document.getElementsByClassName("backFilter");
           	hideAfterFilter($rootScope.filterEntity,myfilter);
       	})
       });
   /* $(document).ready(function(){
 	   $scope.initTableData();
 	   setTimeout(function(){
 		   var myfilter = document.getElementsByClassName("backFilter");
 	       hideAfterFilter($rootScope.filterEntity,myfilter);
 	   },"100")
 	 setTimeout(function(){
 		$scope.positionProAddShow = true;
 		$scope.$apply();
	   },"100")
    });*/
//    删除
    $scope.delteFlag = false;
    localStorage.lastname="aa";
    $("body").delegate("#positionProportionSet_table td .position_deleteIndex","click",function(event){
    	event.stopPropagation();
    	if(localStorage.lastname == "aa"){
    		$scope.delteFlag = true;
    	}
    	var table = $("#positionProportionSet_table").DataTable();
		$scope.entity.threshold = "";
        if($scope.delteFlag)
        	{
	        	var mytr = $(this).parents('tr');
	        	localStorage.lastname = mytr[0].nodeName;
	            var tempArr = table.row(mytr).data();
	            var delId = tempArr[9];
	            layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
	            	table.row(mytr).remove().draw(false);
	            	$scope.positionMarketProportionSetService.deletePostionOrMarket(delId,function(result){
	            		if(result){
	            			layer.alert(result.errMessage);
	            			var mytable = document.getElementById("innerPositionTable");
	        	            var outerContainer = document.getElementById("outPositionDiv");
	        	            outerContainer.removeChild(mytable);
	        	            var newContainer = document.createElement("div");
	        	            newContainer.id = "innerPositionTable";
	        	            newContainer.innerHTML = "<table id='positionProportionSet_table' class='cell-border stripe' cellspacing='0' width='100%'></table>";
	        	            outerContainer.appendChild(newContainer);
	            			//destroyDatatable("positionProportionSet_table");
	            			$scope.initTableData(false);
	            			$scope.initRadio = $scope.contractTypes[0].key;
	            			$scope.initSelect();
	            			$scope.addPostionSet();
	            			$scope.positionProportionSetShow = false;
	            			$scope.$apply();
	            		}else{
	            			layer.alert("遇到未知问题!");
	            		}
	            	});
	            });
        	}
        
    });
/*    $("body").delegate("#positionProportionSet_table tbody tr", "click", function (){
   	 //为选中的行设置选中色
          if($(this).hasClass("selected")){
              $(this).removeClass("selected");
          }
          else{
              $("tr.selected").removeClass("selected");
              $(this).addClass("selected");
          }
   	   $scope.statistics = [];
      	   $scope.molecule = [];
      	   $scope.denominator = [];
      	   $scope.riskgroup = [];
          $scope.entity = {};
      	   $scope.initRadio = "";
   	   $scope.positionProportion_radionFlag = true;
          var table = $("#positionProportionSet_table").DataTable();
          var tempArr = table.row($(this)).data();
          $scope.entity.id = tempArr[9];
          $scope.entity.groupID = tempArr[10];
          $scope.entity.particlesize = tempArr[11];
          $scope.entity.numerator = tempArr[12];
          $scope.entity.denominator = tempArr[13];
          $scope.entity.threshold = parseFloat(tempArr[6]);
          $scope.entity.descr = tempArr[7];
          $scope.entity.market = tempArr[14];
          $scope.initRadio = $scope.entity.market;
          if($scope.riskgroup){
          	if($scope.riskgroup.length<=0){
          		Array.prototype.push.apply($scope.riskgroup, $scope.stockList.RISKGROUP); 
          	}
          }else{
          	Array.prototype.push.apply($scope.riskgroup, $scope.stockList.RISKGROUP); 
          }

          
          if($scope.entity.market == "1"){
   			//股票
   			Array.prototype.push.apply($scope.statistics, $scope.stockList.STATISTICS); 
      		Array.prototype.push.apply($scope.molecule, $scope.stockList.MOLECULE); 
      		Array.prototype.push.apply($scope.denominator, $scope.stockList.DENOMINATOR);
   		}
   		else if($scope.entity.market == "2"){
//   				期货
   			Array.prototype.push.apply($scope.statistics, $scope.futuresList.STATISTICS); 
      		Array.prototype.push.apply($scope.molecule, $scope.futuresList.MOLECULE); 
      		Array.prototype.push.apply($scope.denominator, $scope.futuresList.DENOMINATOR); 
   		}
   		else if($scope.entity.market == "3"){
//   				基金
   			Array.prototype.push.apply($scope.statistics, $scope.fundList.STATISTICS); 
      		Array.prototype.push.apply($scope.molecule, $scope.fundList.MOLECULE); 
      		Array.prototype.push.apply($scope.denominator, $scope.fundList.DENOMINATOR); 		
   		}
   		else if($scope.entity.market == "4"){
//   				债券
   			Array.prototype.push.apply($scope.statistics, $scope.bondList.STATISTICS); 
      		Array.prototype.push.apply($scope.molecule, $scope.bondList.MOLECULE); 
      		Array.prototype.push.apply($scope.denominator, $scope.bondList.DENOMINATOR); 
   		}
          $scope.selctChange();
          $scope.$apply();
      });*/
    
    
    $scope.SaveOrupdate = function(){
//    	修改状态 让 radio 无法选择
    	if(!$scope.entity.threshold){
    		layer.alert("阈值范围为0.01%~1000.00%");
    		return false;
    	}else{
   			var num = $scope.entity.threshold+"";
   	        if(!isNaN(num)){
   	            var dot = num.indexOf(".");
   	            if(dot != -1){
   	                var dotCnt = num.substring(dot+1,num.length);
   	                if(dotCnt.length > 2){
   	                	layer.alert("小数位已超过2位！");
   	                    return false;
   	                }
   	            }
   	        }else{
   	        	layer.alert("数字不合法！");
   	        	return false;
   	        }
   		}
    	if(!$scope.entity.groupID){
    		layer.alert("资产类型不能为空");
    		return false;
    	}
    	if(!$scope.entity.particlesize){
    		layer.alert("统计粒度不能为空");
    		return false;
    	}
    	if(!$scope.entity.numerator){
    		layer.alert("分子不能为空");
    		return false;
    	}
    	if(!$scope.entity.denominator){
    		layer.alert("分母不能为空");
    		return false;
    	}
    	$scope.entity.descr = $scope.descr;
    	if($scope.entity.id){
    		$scope.update();
    	}else{
    		$scope.positionSave();
    	}
    }
    
    
    $scope.update = function(){
    	layer.load(2, {
		    shade: [0.5,'#fff'] //0.1透明度的白色背景
		});
    	$scope.positionMarketProportionSetService.updatePostionOrMarket($scope.entity,sessionStorage.listBrokerID,function(result){
    		if(result){
    			var mytable = document.getElementById("innerPositionTable");
	            var outerContainer = document.getElementById("outPositionDiv");
	            outerContainer.removeChild(mytable);
	            var newContainer = document.createElement("div");
	            newContainer.id = "innerPositionTable";
	            newContainer.innerHTML = "<table id='positionProportionSet_table' class='cell-border stripe' cellspacing='0' width='100%'></table>";
	            outerContainer.appendChild(newContainer);
    			//destroyDatatable("positionProportionSet_table");
    			$scope.initTableData(false);
    			layer.alert(result.errMessage);
    			$scope.addPostionSet();
    			$scope.positionProportionSetShow = false;
    			$scope.$apply();
    		}else{
    			layer.alert("后台遇到未知错误");
    		}
    		layer.closeAll('loading');
    	});
    	
    }
    $scope.positionProportion_radionFlag = false;
//    修改按钮点击事件
    $("body").delegate("#positionProportionSet_table td .position_updateIndex","click",function(){
    	$scope.positionProportionSetShow = true;
    	$scope.positionProportionSetEdit = false;
    	//为选中的行设置选中色
        if($(this).closest('tr').hasClass("selected")){
            $(this).closest('tr').removeClass("selected");
        }
        else{
            $("tr.selected").removeClass("selected");
            $(this).closest('tr').addClass("selected");
        }
 	   $scope.statistics = [];
    	   $scope.molecule = [];
    	   $scope.denominator = [];
    	   $scope.riskgroup = [];
        $scope.entity = {};
    	   $scope.initRadio = "";
 	   $scope.positionProportion_radionFlag = true;
 	   
 	  var table = $("#positionProportionSet_table").DataTable();
      var tr = $(this).closest('tr');
      var tempArr = table.row(tr).data();
        $scope.entity.id = tempArr[9];
        $scope.entity.groupID = tempArr[10];
        $scope.entity.particlesize = tempArr[11];
        $scope.entity.numerator = tempArr[12];
        $scope.entity.denominator = tempArr[13];
        $scope.entity.threshold = parseFloat(tempArr[6]);
        $scope.entity.descr = tempArr[7];
        $scope.entity.market = tempArr[14];
        $scope.initRadio = $scope.entity.market;
        if($scope.entity.market == "1"){
 			//股票
        	 if($scope.riskgroup){
             	if($scope.riskgroup.length<=0){
             		Array.prototype.push.apply($scope.riskgroup, $scope.stockList.RISKGROUP); 
             	}
             }else{
             	Array.prototype.push.apply($scope.riskgroup, $scope.stockList.RISKGROUP); 
             }
 			Array.prototype.push.apply($scope.statistics, $scope.stockList.STATISTICS); 
    		Array.prototype.push.apply($scope.molecule, $scope.stockList.MOLECULE); 
    		Array.prototype.push.apply($scope.denominator, $scope.stockList.DENOMINATOR);
 		}
 		else if($scope.entity.market == "2"){
// 				期货
 			 if($scope.riskgroup){
 	        	if($scope.riskgroup.length<=0){
 	        		Array.prototype.push.apply($scope.riskgroup, $scope.futuresList.RISKGROUP); 
 	        	}
 	        }else{
 	        	Array.prototype.push.apply($scope.riskgroup, $scope.futuresList.RISKGROUP); 
 	        }
 			Array.prototype.push.apply($scope.statistics, $scope.futuresList.STATISTICS); 
    		Array.prototype.push.apply($scope.molecule, $scope.futuresList.MOLECULE); 
    		Array.prototype.push.apply($scope.denominator, $scope.futuresList.DENOMINATOR); 
 		}
 		else if($scope.entity.market == "3"){
// 				基金
 			 if($scope.riskgroup){
 	        	if($scope.riskgroup.length<=0){
 	        		Array.prototype.push.apply($scope.riskgroup, $scope.fundList.RISKGROUP); 
 	        	}
 	        }else{
 	        	Array.prototype.push.apply($scope.riskgroup, $scope.fundList.RISKGROUP); 
 	        }
 			Array.prototype.push.apply($scope.statistics, $scope.fundList.STATISTICS); 
    		Array.prototype.push.apply($scope.molecule, $scope.fundList.MOLECULE); 
    		Array.prototype.push.apply($scope.denominator, $scope.fundList.DENOMINATOR); 		
 		}
 		else if($scope.entity.market == "4"){
// 				债券
 			 if($scope.riskgroup){
 	        	if($scope.riskgroup.length<=0){
 	        		Array.prototype.push.apply($scope.riskgroup, $scope.bondList.RISKGROUP); 
 	        	}
 	        }else{
 	        	Array.prototype.push.apply($scope.riskgroup, $scope.bondList.RISKGROUP); 
 	        }
 			Array.prototype.push.apply($scope.statistics, $scope.bondList.STATISTICS); 
    		Array.prototype.push.apply($scope.molecule, $scope.bondList.MOLECULE); 
    		Array.prototype.push.apply($scope.denominator, $scope.bondList.DENOMINATOR); 
 		}
        $scope.selctChange();
        $scope.$apply();
        
    });

    //新增按钮点击事件
    $scope.addPostionSet = function(){
    	$scope.entity = {};
        $scope.initRadio = $scope.contractTypes[0].key;
    	$scope.descr="";
        $scope.positionProportion_radionFlag = false;
        //初始化数据
        $(".positionProportion_contractType").attr("checked",false); 
        $(".positionProportion_contractType").attr("checked","checked"); 
        $scope.statistics = [];
    	$scope.molecule = [];
    	$scope.denominator = [];
    	$scope.riskgroup = [];
    	if($scope.initRadio == $scope.STOCK){
   			//股票
   			Array.prototype.push.apply($scope.riskgroup, $scope.stockList.RISKGROUP); 
   			$scope.entity.market = "1";
   			Array.prototype.push.apply($scope.statistics, $scope.stockList.STATISTICS); 
       		Array.prototype.push.apply($scope.molecule, $scope.stockList.MOLECULE); 
       		Array.prototype.push.apply($scope.denominator, $scope.stockList.DENOMINATOR);
   		}
   		else if($scope.initRadio == $scope.FUTURES){
   			//期货
   			Array.prototype.push.apply($scope.riskgroup, $scope.futuresList.RISKGROUP); 
   			$scope.entity.market = "2";
   			Array.prototype.push.apply($scope.statistics, $scope.futuresList.STATISTICS); 
       		Array.prototype.push.apply($scope.molecule, $scope.futuresList.MOLECULE); 
       		Array.prototype.push.apply($scope.denominator, $scope.futuresList.DENOMINATOR); 
   		}
   		else if($scope.initRadio == $scope.FUND){
   			//基金
   			Array.prototype.push.apply($scope.riskgroup, $scope.fundList.RISKGROUP); 
				$scope.entity.market = "3";
				Array.prototype.push.apply($scope.statistics, $scope.fundList.STATISTICS); 
	    		Array.prototype.push.apply($scope.molecule, $scope.fundList.MOLECULE); 
	    		Array.prototype.push.apply($scope.denominator, $scope.fundList.DENOMINATOR); 		
   		}
   		else if($scope.initRadio == $scope.BOND){
   			//债券
   			Array.prototype.push.apply($scope.riskgroup, $scope.bondList.RISKGROUP); 
				$scope.entity.market = "4";
				Array.prototype.push.apply($scope.statistics, $scope.bondList.STATISTICS); 
	    		Array.prototype.push.apply($scope.molecule, $scope.bondList.MOLECULE); 
	    		Array.prototype.push.apply($scope.denominator, $scope.bondList.DENOMINATOR); 
			}
		if($scope.riskgroup.length>0){
			$scope.entity.groupID = $scope.riskgroup[0].groupID;
		}
		if($scope.statistics.length>0){
			$scope.entity.particlesize = $scope.statistics[0].dictId;
		}
		if($scope.molecule.length>0){
			$scope.entity.numerator = $scope.molecule[0].dictId;
		}
		if($scope.denominator.length>0){
			$scope.entity.denominator = $scope.denominator[0].dictId;
		}
		var gropuNameTmp = "";
		if($scope.riskgroup != undefined && $scope.riskgroup != null && $scope.riskgroup.length>0){
			gropuNameTmp = $scope.riskgroup[0].groupName;
		} 
		$scope.descr = "【"+gropuNameTmp+"】的"+
		"【"+$scope.statistics[0].dictName+"】"+
		"【"+$scope.molecule[0].dictName+"】占该"+
		"【"+$scope.statistics[0].dictName+"】"+
		"【"+$scope.denominator[0].dictName+"】的比例不超过";
		if($scope.entity.threshold){
			$scope.descr += parseFloat($scope.entity.threshold).toFixed(2) + "%";
		}
    }
    
    $scope.descr = "";
//    选择框选择事件
    $scope.selctChange = function(){
    	$scope.descr = "";
//    	所用范围
    	for(var x in $scope.riskgroup){
    		if($scope.riskgroup[x].groupID == $scope.entity.groupID){
    			$scope.descr += "【"+$scope.riskgroup[x].groupName+"】的";
    			break;
    		}
    	}
    	
    	for(var x in $scope.statistics){
    		if($scope.statistics[x].dictId == $scope.entity.particlesize){
    			$scope.descr += "【"+$scope.statistics[x].dictName+"】";
    			break;
    		}
    	}
    	for(var x in $scope.molecule){
    		if($scope.molecule[x].dictId == $scope.entity.numerator){
    			$scope.descr += "【"+$scope.molecule[x].dictName+"】占该";
    			break;
    		}
    	}
    	/*for(var x in $scope.statistics){
    		if($scope.statistics[x].dictId == $scope.entity.particlesize){
    			$scope.descr += "【"+$scope.statistics[x].dictName+"】的";
    			break;
    		}
    	}*/
    	for(var x in $scope.denominator){
    		if($scope.denominator[x].dictId == $scope.entity.denominator){
    			$scope.descr += "【"+$scope.denominator[x].dictName+"】的比例不超过";
    			break;
    		}
    	}
    	if($scope.entity.threshold){
//      	   tempArr.push();

    		$scope.descr += parseFloat($scope.entity.threshold).toFixed(2) + "%";
    	}

//    	$scope.$apply();
    }
    
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc; 
    
    
})