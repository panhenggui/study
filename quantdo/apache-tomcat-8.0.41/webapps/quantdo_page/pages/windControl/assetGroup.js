/**
 * Created by Quantdo on 2016/7/21.
 */
myapp.controller("assetGroupController",function ($scope, $rootScope){
    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    //保存资产分类管理主表格的数据
    $scope.asset_dataset = [];

    //初始化页面信息
    $scope.assetGroupEntity = [{brokerID:""},{dataSourceID:""},{capitalTypeID:""},{sortTypeID:""}];

    //保存资产分类管理主表格的表头列
    $scope.asset_column_array = [
        {title:"序号"},
        {title:"分类名称"},
        {title:"资产ID",visible:false},
        {title:"资产大类"},
        {title:"分类ID",visible:false},
        {title:"分类方式"},
        {title:"数据来源ID",visible:false},
        {title:"数据来源"},
        {title:"所属机构ID",visible:false},
        {title:"所属机构"},
        {title:"操作"}
    ];

    //类型
    $scope.assetContractType = clearConstant.assetContractType;

    //保存分类方式
    $scope.sortTypeID = [];

    $scope.isDisabled = false;

    //保存主表ID
    $scope.masterID = [];

    //保存增加明细分类表格的表头列
    $scope.unchoiceType_column_Array = [
        {title:"序号"},
        {title:"待选证券/合约代码"},
        {title:"名称"},
        {title:"交易所代码"}
    ];

    $scope.choicedType_column_Array = [
        {title:"序号"},
        {title:"已选证券/合约代码"},
        {title:"名称"},
        {title:"交易所代码"}
    ];

    //保存组合分类表格的表头列
    $scope.hasGroupType_column_Array = [
        {title:"序号"},
        {title:"选项"},
        {title:"分类名称"},
        {title:"操作"}
    ];

    $scope.needAddGroup_column_Array =[
        {title:"序号"},
        {title:"组合分类内容"},
        {title:"操作"}
    ];

    //保存增加明细分类表格的数据
    $scope.unchoiceType_dataset = [];

    $scope.choicedType_dataset = [];

    //保存动态分类中表格的数据
    $scope.exchIDchoicedType_dataset = [];

    //保存动态分类表头列
    $scope.exchIDchoicedType_column_Array = [
        {title:"序号"},
        {title:"交易所代码"},
        {title:"已选证券/合约代码"},
        {title:"名称"}
    ];

    //保存所有组合分类下拉菜单的值
    $scope.sortNames = [];

    $scope.saveCombineTabData = [];

    //数据来源
    $scope.dataSource = clearConstant.dataSource;

    getBrokerIDAndBrokerName(function(result){
        if(result.instClientID == ""){
            $scope.uploadDataSource = clearConstant.dataBrokeSource;
        }
        else{
            $scope.uploadDataSource = clearConstant.dataOtherSource;
        }
    })

    //初始化明细分类
    $scope.detailEntity = [{capitalTypeID:"",dataSourceID:""}];

    //初始化搜索框
    $scope.queryDetailByID = "";

    //初始化组合分类表格选项下拉框
    $scope.combineFlag = [{text:"且"},{text:"排除"}];

    //保存组合分类左侧表格增加的数据
    $scope.combine_dataset = [];

    //保存文件上传表格数据
    $scope.fileUpload_dataset = [];

    $scope.detailRight_dataset = [];

    var mydetailRight = {};

    //保存文件上传表头列
    $scope.fileUpload_column_Arr = [
        {title:"序号"},
        {title:"分类名称"},
        {title:"交易所"},
        {title:"待选证券/合约代码"},
        {title:"名称"}
    ];

    var assetTable = "";
    getTmpProductRiskSortQuery({},function(result){
        $scope.asset_dataset = [];
        var con = result;
        if(con != undefined){
            for(var i=0;i<con.length;i++){

                if(con[i].dataSourceID == "1"){
                    if(con[i].sortTypeID == "1" || con[i].sortTypeID == "3"){
                        var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                            con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a>"];
                    }
                    else{
                        var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                            con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [明细] </a>"];
                    }
                }
                else{
                    if(con[i].sortTypeID == "3"){
                        var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                            con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                    }
                    else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "2"){
                    	 var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                             con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                    }else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "3"){
                   	     var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                             con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                    }else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "4"){
                    	 var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                             con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [修改] </a><a class='delCombine'> [删除] </a>"];
                    }
                    else{
                        var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                            con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealDetailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [修改] </a><a class='delCombine'> [删除] </a>"];
                    }
                }
                $scope.asset_dataset.push(tempArr);
            }
            assetTable = $scope.getAssetTable("assetGroup_table",$scope.asset_column_array,$scope.asset_dataset,300);
        }
    });

    //获取主页面所有下拉列表信息
    getSortScreenPullDownData("",function(result){
        $scope.brokerIDList = result.brokerIDList;
        $scope.assetGroupEntity.brokerID = $scope.brokerIDList[0].brokerID;

        $scope.dataSourceList = result.dataSourceList;
        $scope.assetGroupEntity.dataSourceID = $scope.dataSourceList[0].dataSourceID;

        $scope.capitalTypeList = result.capitalTypeList;
        $scope.assetGroupEntity.capitalTypeID = $scope.capitalTypeList[0].capitalTypeID;

        $scope.sortTypeList = result.sortTypeList;
        $scope.assetGroupEntity.sortTypeID = $scope.sortTypeList[0].sortTypeID;

        $scope.$apply();
    });

    //根据查询条件查询
    $scope.assetQuery = function(entity){
        var queryEntity = {};
        queryEntity.brokerID = entity.brokerID;
        queryEntity.capitalTypeID = entity.capitalTypeID;
        queryEntity.dataSourceID = entity.dataSourceID;
        queryEntity.sortName = entity.sortName;
        queryEntity.sortTypeID = entity.sortTypeID;

        getTmpProductRiskSortQuery(queryEntity,function(result){
            $scope.asset_dataset = [];
            var con = result;
            if(con != undefined){
            	for(var i=0;i<con.length;i++){

                    if(con[i].dataSourceID == "1"){
                        if(con[i].sortTypeID == "1" || con[i].sortTypeID == "3"){
                            var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a>"];
                        }
                        else{
                            var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [明细] </a>"];
                        }
                    }
                    else{
                        if(con[i].sortTypeID == "3"){
                            var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                        }
                        else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "2"){
                        	 var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                 con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                        }else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "3"){
                       	     var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                 con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                        }else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "4"){
                        	 var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                 con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [修改] </a><a class='delCombine'> [删除] </a>"];
                        }
                        else{
                            var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealDetailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [修改] </a><a class='delCombine'> [删除] </a>"];
                        }
                    }
                    $scope.asset_dataset.push(tempArr);
                }
                assetTable.clear().draw();
                assetTable.rows.add($scope.asset_dataset).draw();
            }
        });
    };
    
    //点击主页面明细分类的明细按钮
    $("body").delegate("#assetGroup_table td .RealdetailConbine2","click",function(){
        var sortName = assetTable.row($(this).parents('tr')).data()[1];
        var capitalTypeID = assetTable.row($(this).parents('tr')).data()[2];
        var sortTypeID = assetTable.row($(this).parents('tr')).data()[4];
        var dataSourceID = assetTable.row($(this).parents('tr')).data()[6];
        var brokerID = assetTable.row($(this).parents('tr')).data()[8];
        sessionStorage.brokerID = brokerID;
        var detailEntity = {};
        detailEntity.sortName = sortName;
        detailEntity.capitalTypeID = capitalTypeID;
        detailEntity.sortTypeID = sortTypeID;
        detailEntity.dataSourceID = dataSourceID;
        sessionStorage.queryDataSourceID = detailEntity.dataSourceID;
        detailEntity.brokerID = brokerID;
        $scope.queryDetailByID = "";
        $scope.isDisabled = true;
        
        toachDetailButton(detailEntity,function(result){
        	/* unchoiceTable.clear().draw();
             $scope.choicedType_dataset = [];
             for(var i=0;i<result.length;i++){
                 $scope.detailEntity.sortName = result[i].sortName;
                 $scope.detailEntity.capitalTypeID = result[i].capitalTypeID;
                 $scope.choicedType_dataset.push([i+1,result[i].instrumenID,result[i].info]);
                 sessionStorage.sourceMasterID = result[i].id;
             }
             $scope.$apply();
             if(!$("#myDynamic").hasClass("hidden")){
                 $("#myDynamic").addClass("hidden");
             }
             $("#myDetail").removeClass("hidden");
             $("#mysave").removeClass("hidden");
             choicedTable.clear().draw();
             choicedTable.rows.add($scope.choicedType_dataset).draw();

                 if(!$("#search_label").hasClass("hidden")){
                     $("#search_label").addClass("hidden");
                 }
                 if(!$("#search_text").hasClass("hidden")){
                     $("#search_text").addClass("hidden");
                 }
                 if(!$("#left_table").hasClass("hidden")){
                     $("#left_table").addClass("hidden");
                 }
                 if(!$("#center_content").hasClass("hidden")){
                     $("#center_content").addClass("hidden");
                 }
                 if(!$("#mysave").hasClass("hidden")){
                     $("#mysave").addClass("hidden");
                 }
                 $("#right_table").removeClass("right-table");*/
        	
        	       $scope.exchIDchoicedType_dataset = [];
        	        if(!$("#myDetail").hasClass("hidden")){
        	           $("#myDetail").addClass("hidden");
        	        }
        	        $("#myDynamic").removeClass("hidden");
        	        if(!$("#mysave").hasClass("hidden")){
        	        $("#mysave").addClass("hidden");
        	        }
        	        dynamicTable.clear().draw();
        	        for(var i=0;i<result.length;i++){
        	        $scope.exchIDchoicedType_dataset.push([i+1,result[i].exchangeID,result[i].instrumenID,result[i].info]);
        	        }
        	        dynamicTable.clear().draw();
        	        dynamicTable.rows.add($scope.exchIDchoicedType_dataset).draw();
        })
        setTimeout(function(){
            $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
        },"500");
    });

    //点击主页面组合分类明细按钮
    $("body").delegate("#assetGroup_table td .RealDetailConbine","click",function(){
        var sortName = assetTable.row($(this).parents('tr')).data()[1];
        var capitalTypeID = assetTable.row($(this).parents('tr')).data()[2];
        var sortTypeID = assetTable.row($(this).parents('tr')).data()[4];
        var dataSourceID = assetTable.row($(this).parents('tr')).data()[6];
        var brokerID = assetTable.row($(this).parents('tr')).data()[8];
        sessionStorage.brokerID = brokerID;
        var detailEntity = {};
        detailEntity.sortName = sortName;
        detailEntity.capitalTypeID = capitalTypeID;
        detailEntity.sortTypeID = sortTypeID;
        detailEntity.dataSourceID = dataSourceID;
        sessionStorage.queryDataSourceID = detailEntity.dataSourceID;
        detailEntity.brokerID = brokerID;
        $scope.queryDetailByID = "";
        $scope.isDisabled = true;
        
        toachCombineRealDetailButton(detailEntity,function(errCode,errMsg,result){
        	
        	       $scope.exchIDchoicedType_dataset = [];
        	        if(!$("#myDetail").hasClass("hidden")){
        	           $("#myDetail").addClass("hidden");
        	        }
        	        $("#myDynamic").removeClass("hidden");
        	        if(!$("#mysave").hasClass("hidden")){
        	        $("#mysave").addClass("hidden");
        	        }
        	        dynamicTable.clear().draw();
        	if(errCode==0){
        	        for(var i=0;i<result.length;i++){
        	        $scope.exchIDchoicedType_dataset.push([i+1,result[i].exchangeID,result[i].instrumenID,result[i].info]);
        	        }
        	        dynamicTable.clear().draw();
        	        dynamicTable.rows.add($scope.exchIDchoicedType_dataset).draw();
        	}else if(errCode==1){
        		  layer.alert(errMsg);
        	}
        })
        
        setTimeout(function(){
            $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
        },"500");
    });

    //点击主页面的明细所触发的事件
    $("body").delegate("#assetGroup_table td .detailConbine","click",function(){
        $scope.saveCombineTabData = [];
        var sortName = assetTable.row($(this).parents('tr')).data()[1];
        var capitalTypeID = assetTable.row($(this).parents('tr')).data()[2];
        var sortTypeID = assetTable.row($(this).parents('tr')).data()[4];
        var dataSourceID = assetTable.row($(this).parents('tr')).data()[6];
        var brokerID = assetTable.row($(this).parents('tr')).data()[8];
        sessionStorage.brokerID = brokerID;
        var detailEntity = {};
        detailEntity.sortName = sortName;
        detailEntity.capitalTypeID = capitalTypeID;
        detailEntity.sortTypeID = sortTypeID;
        detailEntity.dataSourceID = dataSourceID;
        sessionStorage.queryDataSourceID = detailEntity.dataSourceID;
        detailEntity.brokerID = brokerID;
        $scope.queryDetailByID = "";
        $scope.isDisabled = true;
        if(detailEntity.sortTypeID == "2"){
            hasGroupTypeTable.clear().draw();
            hasGroupTypeTable.rows.add([["1","<select class='typeFlag hidden'><option value=''></option></select>","<select class='typeName'></select>",""],
                ["<a class='addRow'>+</a>","","",""]]).draw();
            $scope.getSortName();
            toachDetailButtonForCombine(detailEntity,function(result){
                $scope.needAddGroup_dataset = [];
              
                for(var i=0;i<result.length;i++){
                    var mydata = "";
                    var tableSave = [];
                	for(var j=0;j<result[i].length;j++){
                        var tableHas = {};
                        $scope.detailEntity.sortName = result[i][j].sortName;
                        $scope.detailEntity.capitalTypeID = result[i][j].capitalTypeID;
                        mydata = mydata + result[i][j].instrumenID + "【"+result[i][j].info+"】";
                        sessionStorage.sourceMasterID = result[i][j].id;
                        tableHas.exchangeID = result[i][j].exchangeID;
                        tableHas.instrumenID = result[i][j].instrumenID;
                        tableHas.info = result[i][j].info;
                        tableHas.sourceSortTypeID = result[i][j].sourceSortTypeID;
                        tableHas.sourceMasterID = result[i][j].sourceMasterID;
                        tableSave.push(tableHas);
                    }
                    $scope.saveCombineTabData.push(tableSave);
                    $scope.needAddGroup_dataset.push([i+1,mydata,"<a class='delRow'>删除</a>"]);
                     needAddGroupTable.clear().draw();
                     needAddGroupTable.rows.add($scope.needAddGroup_dataset).draw();
                     //$scope.getSortName();
                     $scope.$apply();
                }
            });
        }
        else{
            toachDetailButton(detailEntity,function(result){
                if(detailEntity.sortTypeID == "1"){
                    unchoiceTable.clear().draw();
                    $scope.choicedType_dataset = [];
                    for(var i=0;i<result.length;i++){
                        $scope.detailEntity.sortName = result[i].sortName;
                        $scope.detailEntity.capitalTypeID = result[i].capitalTypeID;
                        $scope.choicedType_dataset.push([i+1,result[i].instrumenID,result[i].info,result[i].exchangeID]);
                        sessionStorage.sourceMasterID = result[i].id;
                    }
                    $scope.$apply();
                    if(!$("#myDynamic").hasClass("hidden")){
                        $("#myDynamic").addClass("hidden");
                    }
                    $("#myDetail").removeClass("hidden");
                    $("#mysave").removeClass("hidden");
                    choicedTable.clear().draw();
                    choicedTable.rows.add($scope.choicedType_dataset).draw();

                    if(detailEntity.dataSourceID == "2" || detailEntity.dataSourceID == "3"){
                        if(!$("#search_label").hasClass("hidden")){
                            $("#search_label").addClass("hidden");
                        }
                        if(!$("#search_text").hasClass("hidden")){
                            $("#search_text").addClass("hidden");
                        }
                        if(!$("#left_table").hasClass("hidden")){
                            $("#left_table").addClass("hidden");
                        }
                        if(!$("#center_content").hasClass("hidden")){
                            $("#center_content").addClass("hidden");
                        }
                        if(!$("#mysave").hasClass("hidden")){
                            $("#mysave").addClass("hidden");
                        }
                        $("#right_table").removeClass("right-table");
                    }
                    else{
                        $("#search_label").removeClass("hidden");
                        $("#search_text").removeClass("hidden");
                        $("#left_table").removeClass("hidden");
                        $("#center_content").removeClass("hidden");
                        $("#mysave").removeClass("hidden");
                        if(!$("#right_table").hasClass("right-table")){
                            $("#right_table").addClass("right-table");
                        }
                    }
                }
                else if(detailEntity.sortTypeID == "3"){
                    $scope.exchIDchoicedType_dataset = [];
                    if(!$("#myDetail").hasClass("hidden")){
                        $("#myDetail").addClass("hidden");
                    }
                    $("#myDynamic").removeClass("hidden");
                    if(!$("#mysave").hasClass("hidden")){
                        $("#mysave").addClass("hidden");
                    }
                    dynamicTable.clear().draw();
                    for(var i=0;i<result.length;i++){
                        $scope.exchIDchoicedType_dataset.push([i+1,result[i].exchangeID,result[i].instrumenID,result[i].info,result[i].exchangeID]);
                    }
                    dynamicTable.clear().draw();
                    dynamicTable.rows.add($scope.exchIDchoicedType_dataset).draw();
                }

            })
        }

        setTimeout(function(){
            $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
        },"500");
    });

    //点击主页面的删除所触发的事件
    $("body").delegate("#assetGroup_table td .delCombine","click",function(){
        var mytr = $(this).parents("tr");
        var sortName = assetTable.row(mytr).data()[1];
        var capitalTypeID = assetTable.row(mytr).data()[2];
        var sortTypeID = assetTable.row(mytr).data()[4];
        var dataSourceID = assetTable.row(mytr).data()[6];
        var brokerID = assetTable.row(mytr).data()[8];
        var detailEntity = {};
        detailEntity.sortName = sortName;
        detailEntity.capitalTypeID = capitalTypeID;
        detailEntity.sortTypeID = sortTypeID;
        detailEntity.dataSourceID = dataSourceID;
        detailEntity.brokerID = brokerID;
        layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
            deleteTmpProductRiskSortQuery(detailEntity,function(errCode,errMsg){
                if(errCode == 0){
                    layer.msg("删除成功", {icon: 1});
//                    assetTable.row(mytr).remove().draw();
                    getTmpProductRiskSortQuery({},function(result){
                        $scope.asset_dataset = [];
                        var con = result;
                        if(con != undefined){
                        	for(var i=0;i<con.length;i++){

                                if(con[i].dataSourceID == "1"){
                                    if(con[i].sortTypeID == "1" || con[i].sortTypeID == "3"){
                                        var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                            con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a>"];
                                    }
                                    else{
                                        var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                            con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [明细] </a>"];
                                    }
                                }
                                else{
                                    if(con[i].sortTypeID == "3"){
                                        var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                            con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                                    }
                                    else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "2"){
                                    	 var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                             con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                                    }else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "3"){
                                   	     var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                             con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                                    }else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "4"){
                                    	 var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                             con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [修改] </a><a class='delCombine'> [删除] </a>"];
                                    }
                                    else{
                                        var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                            con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealDetailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [修改] </a><a class='delCombine'> [删除] </a>"];
                                    }
                                }
                                $scope.asset_dataset.push(tempArr);
                            }
                           /* for(var i=0;i<con.length;i++){
                                if(con[i].sortTypeID == "1" || con[i].sortTypeID == "3"){
                                    var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                        con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                                }
                                else{
                                    var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                        con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                                }
                                $scope.asset_dataset.push(tempArr);
                            }*/
                            assetTable.clear().draw();
                            assetTable.rows.add($scope.asset_dataset).draw();
                        }
                    })
                }else if(errCode>0){
                	layer.alert(errMsg); 
                }
                else{
                    layer.msg("删除失败", {icon: 2});
                }
            })
        })
    })

    //初始化弹出页面
    $scope.initDetailType = function(){
        $scope.detailEntity.capitalTypeID = "2";
        $scope.detailEntity.dataSourceID = "2";
        $("#myDetail").removeClass("hidden");
        if(!$("#myDynamic").hasClass("hidden")){
            $("#myDynamic").addClass("hidden");
        }
        $("#mysave").removeClass("hidden");
        sessionStorage.sourceMasterID = "";
        sessionStorage.queryDataSourceID = "";
        setTimeout(function(){
            $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
        },"500");

        //初始化明细分类弹出框
        $scope.detailEntity.sortName = "";
        $scope.queryDetailByID = "";
        $scope.isDisabled = false;

        $("#search_label").removeClass("hidden");
        $("#search_text").removeClass("hidden");
        $("#left_table").removeClass("hidden");
        $("#center_content").removeClass("hidden");

        if(!$("#right_table").hasClass("right-table")){
            $("#right_table").addClass("right-table");
        }

        unchoiceTable.clear().order( [[ 0, 'asc' ]] ).draw();
        choicedTable.clear().order( [[ 0, 'asc' ]] ).draw();
        /*unchoiceTable.destroyDatable();
        $scope.unchoiceType_dataset=[];
        var unchoiceTable =  $scope.getAssetTable("unchoiceType_table",$scope.unchoiceType_column_Array,$scope.unchoiceType_dataset,300);*/

        $scope.saveCombineTabData = [];

        $scope.detailRight_dataset = [];
        //初始化组合分类弹出框
        needAddGroupTable.clear().order( [[ 0, 'asc' ]] ).draw();

        hasGroupTypeTable.clear().draw();

        hasGroupTypeTable.rows.add([["1","<select class='typeFlag hidden'><option value=''></option></select>","<select class='typeName'></select>",""],
            /*  ,["2","<select class='typeFlag'></select>","<select class='typeName'></select>","<a class='delRow'>删除</a>"],
             ["3","<select class='typeFlag'></select>","<select class='typeName'></select>","<a class='delRow'>删除</a>"],*/
            ["<a class='addRow'>+</a>","","",""]]).draw();
        $scope.getSortName();

        //清除上传文件表格中的所有数据
        fileUpload.clear().order( [[ 0, 'asc' ]] ).draw();
    };

    //获取组合分类中所有的下拉信息
    $scope.getSortName = function(){
        getsortName("",function(result){
            $scope.sortNames = [];
            $scope.sortTypeID = [];
            $scope.masterID = [];
            for(var i=0;i<result.length;i++){
                $scope.sortNames.push(result[i].sortName);
                $scope.sortTypeID.push(result[i].sortTypeID);
                $scope.masterID.push(result[i].masterID);
            }

            for(var j=0;j<$scope.sortNames.length;j++){
                $("#hasGroupType_table .typeName").append("<option value='"+$scope.sortNames[j]+","+$scope.sortTypeID[j]+","+ $scope.masterID[j]+"'>"+$scope.sortNames[j]+"</option>");
            }
            for(var k=0;k<$scope.combineFlag.length;k++){
                $("#hasGroupType_table .typeFlag").append("<option value='"+$scope.combineFlag[k].text+"'>"+$scope.combineFlag[k].text+"</option>");
            }
        });
    };
    $scope.getSortName();

    $scope.getAssetTable = function(table_id,table_columns,table_data,height,orderFlag) {
        return $("#" + table_id).DataTable({
            columns: table_columns,
            data: table_data,
            scrollY: height,
            scrollCollapse:true,
            scrollX: true,
            retrieve: true,
            destroy:true,
            dom: 'rt<"bottom"ipl>',
            ordering: !orderFlag,
            //order: [[ 0, "desc" ]],
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

    //初始化增加明细分类表格
    var unchoiceTable =  $scope.getAssetTable("unchoiceType_table",$scope.unchoiceType_column_Array,$scope.unchoiceType_dataset,300);
    var choicedTable = $scope.getAssetTable("choicedType_table",$scope.choicedType_column_Array,$scope.choicedType_dataset,300);

    //保存组合分类表格的数据
    $scope.hasGroupType_dataset = [["1","<select class='typeFlag hidden'><option value=''></option></select>","<select class='typeName'></select>",""],
      /*  ,["2","<select class='typeFlag'></select>","<select class='typeName'></select>","<a class='delRow'>删除</a>"],
                                    ["3","<select class='typeFlag'></select>","<select class='typeName'></select>","<a class='delRow'>删除</a>"],*/
        ["<a class='addRow'>+</a>","","",""]];

    $scope.needAddGroup_dataset = [];

    //初始化组合分类表格
    var hasGroupTypeTable = $scope.getAssetTable("hasGroupType_table",$scope.hasGroupType_column_Array,$scope.hasGroupType_dataset,300,true);
    var needAddGroupTable = $scope.getAssetTable("needAddGroup_table",$scope.needAddGroup_column_Array,$scope.needAddGroup_dataset,300);

    //初始化文件上传表格
    var fileUpload = $scope.getAssetTable("fileUpload_table",$scope.fileUpload_column_Arr,$scope.fileUpload_dataset,300);

    //初始化动态分类表格
    var dynamicTable = $scope.getAssetTable("exchIDchoicedType_table",$scope.exchIDchoicedType_column_Array,$scope.exchIDchoicedType_dataset,300);

    //当搜索框内容长度大于4时执行以下操作
    $scope.findByID = function(entity){
        if(entity.capitalTypeID == "1"){
            $("#zqinformation").removeClass("hidden");
        }
        if(entity.capitalTypeID == "2"){
            $("#qhinformation").removeClass("hidden");
        }
        if($scope.queryDetailByID.length>=4 && entity.capitalTypeID == "1" || $scope.queryDetailByID.length>=1 && entity.capitalTypeID == "2"){
            if(!$("#zqinformation").hasClass("hidden")){
                $("#zqinformation").addClass("hidden");
            }
            if(!$("#qhinformation").hasClass("hidden")){
                $("#qhinformation").addClass("hidden");
            }
            var myqueryEntity = {};
            myqueryEntity.capitalTypeID = entity.capitalTypeID;
            myqueryEntity.instrumentID = $scope.queryDetailByID;
            findOperInstrumentByinstrumenID(myqueryEntity,function(result){
                if(result != undefined){
                    $scope.unchoiceType_dataset = [];
                    for(var i=0;i<result.length;i++){
                        var unchoiceArr = [i+1,result[i].instrumenID,result[i].info,result[i].exchangeID];
                        $scope.unchoiceType_dataset.push(unchoiceArr);
                    }
                    unchoiceTable.clear().draw();
                    unchoiceTable.rows.add($scope.unchoiceType_dataset).draw();
                }
            })
        }
    };

    //点击明细分类中左侧表格行所触发的事件
    $("body").delegate("#unchoiceType_table tr","click",function(){
        $scope.detailRight_dataset = [];
        $(this).toggleClass('selected');

        var tempArr = unchoiceTable.row($(this)).data();
        mydetailRight = {};
        mydetailRight.instrumenID = tempArr[1];
        mydetailRight.info = tempArr[2];
        mydetailRight.exchangeID = tempArr[3];
        for(var i=0;i<$scope.detailRight_dataset.length;i++){
            if($scope.detailRight_dataset[i].instrumenID == mydetailRight.instrumenID){
                return false;
            }
        }
        $scope.detailRight_dataset.push(mydetailRight);
    });

    $("body").delegate("#unchoiceType_table tr","dblclick",function(event){
        event.stopPropagation();
        for(var i=0;i<choicedTable.context[0].aoData.length;i++){
            for(var j=0;j<choicedTable.context[0].aoData[i]._aData.length;j++){
                if(mydetailRight.instrumenID == choicedTable.context[0].aoData[i]._aData[j]){
                    layer.alert("不能添加相同的合约信息");
                    return false;
                }
            }
        }
        for(var i=0;i<$scope.detailRight_dataset.length;i++){
            var mytrData = [choicedTable.context[0].aoData.length+1,$scope.detailRight_dataset[i].instrumenID,$scope.detailRight_dataset[i].info,$scope.detailRight_dataset[i].exchangeID]
            choicedTable.row.add(mytrData).draw();
        }

        unchoiceTable.row($(this)).remove().draw();
        for(var i=0;i<unchoiceTable.context[0].aoData.length;i++){
            var index = unchoiceTable.cell($(unchoiceTable.context[0].aoData[i].nTr).children()[0]);
            index.data(i+1);
        }
    });

    //点击明细分类中右侧表格行所触发的事件
    $("body").delegate("#choicedType_table tr","click",function(){
        //为选中的行设置选中色
        $(this).toggleClass('selected');
        $scope.myRemoveTr = $(this);
    });

    $("body").delegate("#choicedType_table tr","dblclick",function(){
        if(choicedTable.row($scope.myRemoveTr).data()[1].indexOf($scope.queryDetailByID) != -1){
            unchoiceTable.row.add([unchoiceTable.context[0].aoData.length+1,choicedTable.row($scope.myRemoveTr).data()[1],choicedTable.row($scope.myRemoveTr).data()[2],choicedTable.row($scope.myRemoveTr).data()[3]]).draw();
        }
        choicedTable.row($scope.myRemoveTr).remove().draw();
        for(var i=0;i<choicedTable.context[0].aoData.length;i++){
            var index = choicedTable.cell($(choicedTable.context[0].aoData[i].nTr).children()[0]);
            index.data(i+1);
        }
    });

    //明细分类中移动数据到右边表格中
    $scope.addTochoiced = function(){
        //for(var i=0;i<choicedTable.context[0].aoData.length;i++){
        //    for(var j=0;j<choicedTable.context[0].aoData[i]._aData.length;j++){
        //        if(mydetailRight.instrumenID == choicedTable.context[0].aoData[i]._aData[j]){
        //            layer.alert("不能添加相同的合约信息");
        //            return false;
        //        }
        //    }
        //}
        if(unchoiceTable.rows('.selected').data().length>1){
            for(var i=0;i<unchoiceTable.rows('.selected').data().length;){
                var mytrData = [choicedTable.context[0].aoData.length+1,unchoiceTable.rows('.selected').data()[i][1],unchoiceTable.rows('.selected').data()[i][2],unchoiceTable.rows('.selected').data()[i][3]];
                choicedTable.row.add(mytrData).draw();
                for(var j=0;j<unchoiceTable.context[0].aoData.length;j++){
                    if(unchoiceTable.context[0].aoData[j]._aData[0] == unchoiceTable.rows('.selected').data()[i][0]){
                        unchoiceTable.row($(unchoiceTable.context[0].aoData[j].nTr)).remove().draw();
                        break;
                    }
                }
                //}
                //else{
                //    unchoiceTable.row($(unchoiceTable.context[0].aoData[unchoiceTable.rows('.selected').data()[0][0]-1].nTr)).remove().draw();
                //}
            }
        }
        else if(unchoiceTable.rows('.selected').data().length == 1){
            for(var i=0;i<$scope.detailRight_dataset.length;i++){
                var mytrData = [choicedTable.context[0].aoData.length+1,$scope.detailRight_dataset[i].instrumenID,$scope.detailRight_dataset[i].info,$scope.detailRight_dataset[i].exchangeID];
                choicedTable.row.add(mytrData).draw();
            }
            unchoiceTable.row($(unchoiceTable.context[0].aoData[unchoiceTable.rows('.selected').data()[0][0]-1].nTr)).remove().draw();
        }

        for(var i=0;i<unchoiceTable.context[0].aoData.length;i++){
            var index = unchoiceTable.cell($(unchoiceTable.context[0].aoData[i].nTr).children()[0]);
            index.data(i+1);
        }
    };

    $scope.addAlltoChoiced = function(){
        for(var i=0;i<unchoiceTable.context[0].aoData.length;i++){
            choicedTable.row.add([choicedTable.context[0].aoData.length+1,unchoiceTable.context[0].aoData[i]._aData[1],unchoiceTable.context[0].aoData[i]._aData[2],unchoiceTable.context[0].aoData[i]._aData[3]]).draw();
        }
        unchoiceTable.clear().draw();
    };

    $scope.removeAlltoChoiced = function(){
        for(var i=0;i<choicedTable.context[0].aoData.length;i++){
            unchoiceTable.row.add([unchoiceTable.context[0].aoData.length+1,choicedTable.context[0].aoData[i]._aData[1],choicedTable.context[0].aoData[i]._aData[2],choicedTable.context[0].aoData[i]._aData[3]]).draw();
        }
        choicedTable.clear().draw();
    };

    //明细分类中移除右边表格中的数据
    $scope.removeFromhoiced = function(){
        if(choicedTable.rows('.selected').data().length>1){
            for(var i=0;i<choicedTable.rows('.selected').data().length;){
                if(choicedTable.rows('.selected').data()[i][1].indexOf($scope.queryDetailByID) != -1){
                    unchoiceTable.row.add([unchoiceTable.context[0].aoData.length+1,choicedTable.rows('.selected').data()[i][1],choicedTable.rows('.selected').data()[i][2],choicedTable.rows('.selected').data()[i][3]]).draw();
                }
                for(var j=0;j<choicedTable.context[0].aoData.length;j++){
                    if(choicedTable.rows('.selected').data()[i][0] == choicedTable.context[0].aoData[j]._aData[0]){
                        choicedTable.row($(choicedTable.context[0].aoData[j].nTr)).remove().draw();
                        break;
                    }
                }
            }
        }
       else if(choicedTable.rows('.selected').data().length == 1){
            var tempArr = choicedTable.row($scope.myRemoveTr).data();
            if(tempArr[1].indexOf($scope.queryDetailByID) != -1){
                unchoiceTable.row.add([unchoiceTable.context[0].aoData.length+1,tempArr[1],tempArr[2],tempArr[3]]).draw();
            }
            choicedTable.row($scope.myRemoveTr).remove().draw();
        }

        for(var i=0;i<choicedTable.context[0].aoData.length;i++){
            var index = choicedTable.cell($(choicedTable.context[0].aoData[i].nTr).children()[0]);
            index.data(i+1);
        }
    };

    //保存明细分类
    $scope.saveDetailData = function(entity){
        var saveEntity = {};
        saveEntity.sortName = entity.sortName;
        saveEntity.capitalTypeID = entity.capitalTypeID;
        saveEntity.id = sessionStorage.sourceMasterID;
        saveEntity.brokerID  = sessionStorage.brokerID;
        var contentDataList = [];
        for(var i=0;i<choicedTable.context[0].aoData.length;i++){
            var contentData = {};
            contentData.instrumenID = choicedTable.context[0].aoData[i]._aData[1];
            contentData.info = choicedTable.context[0].aoData[i]._aData[2];
            contentData.exchangeID = choicedTable.context[0].aoData[i]._aData[3];
            contentDataList.push(contentData);
        }
        saveEntity.contentDataList = contentDataList;

        if(sessionStorage.queryDataSourceID == "2"){
            layer.alert("来自万德的数据不能修改");
            return false;
        }
        if(sessionStorage.queryDataSourceID == "3"){
            layer.alert("来自申万的数据不能修改");
            return false;
        }
        if(saveEntity.sortName == undefined || saveEntity.sortName == ""){
            layer.alert("分类名称不能为空");
            return false;
        }
        if(saveEntity.sortName.length>200){
        	 layer.alert("分类名称最多允许由200个字符组成");
             return false;
        }
        else if(choicedTable.context[0].aoData.length<1){
            layer.alert("至少选择一条合约");
            return false;
        }
        for(var i=0;i<saveEntity.contentDataList.length;i++){
        	for(var j=i+1;j<saveEntity.contentDataList.length;j++){
        		if(saveEntity.contentDataList[i].instrumenID==saveEntity.contentDataList[j].instrumenID){
        			 layer.alert("合约不能重复");
        	            return false;
        		}
        	}
        }
        layer.load(2, {
    	    shade: [0.5,'#fff'] //0.1透明度的白色背景
    	});
        saveDetailSortData(saveEntity,function(errCode,msg){
            if(errCode == 0){
                layer.msg("新增成功", {icon: 1, time:3000});
                getTmpProductRiskSortQuery({},function(result){
                    $scope.asset_dataset = [];
                    var con = result;
                    if(con != undefined){
                    	for(var i=0;i<con.length;i++){

                            if(con[i].dataSourceID == "1"){
                                if(con[i].sortTypeID == "1" || con[i].sortTypeID == "3"){
                                    var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                        con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a>"];
                                }
                                else{
                                    var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                        con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [明细] </a>"];
                                }
                            }
                            else{
                                if(con[i].sortTypeID == "3"){
                                    var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                        con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                                }
                                else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "2"){
                                	 var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                         con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                                }else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "3"){
                               	     var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                         con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                                }else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "4"){
                                	 var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                         con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [修改] </a><a class='delCombine'> [删除] </a>"];
                                }
                                else{
                                    var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                        con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealDetailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [修改] </a><a class='delCombine'> [删除] </a>"];
                                }
                            }
                            $scope.asset_dataset.push(tempArr);
                        }
                        	
                     
                          /*  if(con[i].sortTypeID == "1" || con[i].sortTypeID == "3"){
                                var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                    con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                            }
                            else{
                                var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                    con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                            }
                            $scope.asset_dataset.push(tempArr);
                        }*/
                        assetTable.clear().draw();
                        assetTable.rows.add($scope.asset_dataset).draw();
                    }
                })
                $("#addDetailModal").modal("hide");
            }
            else if(errCode == 1){
                layer.alert(msg);
            }else if(errCode==11){
            	 layer.alert("来自系统的数据不能修改");
            }else if(errCode==21){
            	 layer.alert("来自万德的数据不能修改");
            }else if(errCode==31){
            	layer.alert("来自申万的数据不能修改");
            }
            else{
                layer.msg("新增失败",{icon: 2});
                $("#addDetailModal").modal("hide");
            }
            layer.closeAll('loading');
        });
    };

    //点击组合分类表格左侧的+所触发的事件
    $("body").delegate("#hasGroupType_table td .addRow","click",function(){
        hasGroupTypeTable.row($(this).parents("tr")).remove().draw();
        var hasGroupTypeData = [[hasGroupTypeTable.context[0].aoData.length+1,"<select class='typeFlag'></select>","<select class='typeName'></select>","<a class='delRow'>删除</a>"],
                                 ["<a class='addRow'>+</a>","","",""]];
        hasGroupTypeTable.rows.add(hasGroupTypeData).draw();
        for(var j=0;j<$scope.sortNames.length;j++){
            $("#hasGroupType_table .typeName").append("<option value='"+$scope.sortNames[j]+","+$scope.sortTypeID[j]+","+ $scope.masterID[j]+"'>"+$scope.sortNames[j]+"</option>");
        }
        for(var j=0;j<$scope.combineFlag.length;j++){
            $("#hasGroupType_table .typeFlag").append("<option value='"+$scope.combineFlag[j].text+"'>"+$scope.combineFlag[j].text+"</option>");
        }
    })

    //组合分类中移动数据到右边表格中
    $scope.addCombineToRight = function(){
        $scope.combine_dataset = [];
        $scope.combineRightData = "";
        for(var i=0;i<hasGroupTypeTable.context[0].aoData.length-1;i++){
            var contentData = {};
            contentData.exchangeID = i+1;
            for(var j=0;j<$("#hasGroupType_table .typeFlag")[i].length;j++){
                if($("#hasGroupType_table .typeFlag")[i][j].selected == true){
                    contentData.instrumenID = $("#hasGroupType_table .typeFlag")[i][j].value;
                    break;
                }
            }
            for(var j=0;j<$("#hasGroupType_table .typeName")[i].length;j++){
                if($("#hasGroupType_table .typeName")[i][j].selected == true){
                    contentData.info = $("#hasGroupType_table .typeName")[i][j].value.split(",")[0];
                    contentData.sourceSortTypeID = $("#hasGroupType_table .typeName")[i][j].value.split(",")[1];
                    contentData.sourceMasterID = $("#hasGroupType_table .typeName")[i][j].value.split(",")[2];
                    break;
                }
            }
            $scope.combine_dataset.push(contentData);
        }
        $scope.saveCombineTabData.push($scope.combine_dataset);
        for(var i=0;i<$scope.combine_dataset.length;i++){
            $scope.combineRightData = $scope.combineRightData + $scope.combine_dataset[i].instrumenID + "【" + $scope.combine_dataset[i].info +"】";
        }
        $scope.needAddGroup_dataset.push([needAddGroupTable.context[0].aoData.length+1,$scope.combineRightData,"<a class='delRow'>删除</a>"]);
        needAddGroupTable.row.add([needAddGroupTable.context[0].aoData.length+1,$scope.combineRightData,"<a class='delRow'>删除</a>"]).draw();
    };

    //保存组合分类
    $scope.saveCombineData = function(entity){
        var combineEntity = {};
        combineEntity.sortName = entity.sortName;
        combineEntity.capitalTypeID = entity.capitalTypeID;
        combineEntity.id = sessionStorage.sourceMasterID;
        combineEntity.brokerID  = sessionStorage.brokerID;
        //var contentDataList1 = [];
        //for(var i=0;i<hasGroupTypeTable.context[0].aoData.length-1;i++){
        //    var contentData = {};
        //    contentData.exchangeID = i+1;
        //    for(var j=0;j<$("#hasGroupType_table .typeFlag")[i].length;j++){
        //        if($("#hasGroupType_table .typeFlag")[i][j].selected == true){
        //            contentData.instrumenID = $("#hasGroupType_table .typeFlag")[i][j].value;
        //            break;
        //        }
        //    }
        //    for(var j=0;j<$("#hasGroupType_table .typeName")[i].length;j++){
        //        if($("#hasGroupType_table .typeName")[i][j].selected == true){
        //            contentData.info = $("#hasGroupType_table .typeName")[i][j].value.split(",")[0];
        //            contentData.sourceSortTypeID = $("#hasGroupType_table .typeName")[i][j].value.split(",")[1];
        //            contentData.sourceMasterID = $("#hasGroupType_table .typeName")[i][j].value.split(",")[2];
        //            break;
        //        }
        //    }
        //    contentDataList1.push(contentData);
        //}
        combineEntity.contentDataList1 =  $scope.saveCombineTabData;
        if(combineEntity.sortName == undefined || combineEntity.sortName  == ""){
            layer.alert("分类名称不能为空");
            return false;
        }
        if(combineEntity.sortName.length>200){
        	 layer.alert("分类名称最多允许由200个字符组成");
             return false;
        }
        else if(needAddGroupTable.context[0].aoData.length<1){
            layer.alert("至少添加一条组合分类内容");
            return false;
        }
       /* layer.load(2, {
    	    shade: [0.5,'#fff'] //0.1透明度的白色背景
    	});*/
        saveCombineSortData(combineEntity,function(errCode,errMsg){
            if(errCode == 0){
                layer.msg("新增成功", {icon: 1, time:3000});
                getTmpProductRiskSortQuery({},function(result){
                    $scope.asset_dataset = [];
                    var con = result;
                    if(con != undefined){
                    	for(var i=0;i<con.length;i++){

                            if(con[i].dataSourceID == "1"){
                                if(con[i].sortTypeID == "1" || con[i].sortTypeID == "3"){
                                    var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                        con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a>"];
                                }
                                else{
                                    var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                        con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [明细] </a>"];
                                }
                            }
                            else{
                                if(con[i].sortTypeID == "3"){
                                    var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                        con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                                }
                                else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "2"){
                                	 var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                         con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                                }else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "3"){
                               	     var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                         con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                                }else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "4"){
                                	 var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                         con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [修改] </a><a class='delCombine'> [删除] </a>"];
                                }
                                else{
                                    var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                        con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealDetailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [修改] </a><a class='delCombine'> [删除] </a>"];
                                }
                            }
                            $scope.asset_dataset.push(tempArr);
                        }
                       /* for(var i=0;i<con.length;i++){
                            if(con[i].sortTypeID == "1" || con[i].sortTypeID == "3"){
                                var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                    con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                            }
                            else{
                                var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                    con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                            }
                            $scope.asset_dataset.push(tempArr);
                        }*/
                        assetTable.clear().draw();
                        assetTable.rows.add($scope.asset_dataset).draw();
                    }
                })
                $("#addGroupModal").modal("hide");
            }
            else if(errCode == 1){
                layer.alert(errMsg);
            }else if(errCode == 2){
            	 layer.alert("组合分类内容不能重复");
            }else if(errCode == 3){
            	layer.alert("单个组合分类内容不能重复");
            }else if(errCode ==22){
            	layer.alert(errMsg);
            }
            else{
                layer.msg("新增失败",{icon: 2});
                $("#addGroupModal").modal("hide");
            }
        })
        //layer.closeAll('loading');
    };

    //删除组合分类左侧的单行数据
    $("body").delegate("#hasGroupType_table td .delRow","click",function(){
        hasGroupTypeTable.row($(this).parents("tr")).remove().draw();
        for(var i=0;i<hasGroupTypeTable.context[0].aoData.length-1;i++){
            var index = hasGroupTypeTable.cell($(hasGroupTypeTable.context[0].aoData[i].nTr).children()[0]);
            index.data(i+1);
        }
    });

    //删除组合分类右侧的单行数据
    $("body").delegate("#needAddGroup_table td .delRow","click",function(){
        $scope.needAddGroup_dataset.splice($(this).parents("tr")[0].rowIndex-1,1);
        $scope.saveCombineTabData.splice($(this).parents("tr")[0].rowIndex-1,1);
        needAddGroupTable.row($(this).parents("tr")).remove().draw();
        for(var i=0;i<needAddGroupTable.context[0].aoData.length;i++){
            var index = needAddGroupTable.cell($(needAddGroupTable.context[0].aoData[i].nTr).children()[0]);
            index.data(i+1);
        }
    })

    $("#uploadFundloader").on("click",function(){
        $scope.clearUpLoadTmpEntity();
    });

    //上传文件
    $("#uploadFundloader").uploadFile({
        url: framework.file.uploadUrl("riskStromDataService", "holdExcelImport"),
        fileName: "file",// 名字不能改
        onSuccess: function (files, response, xhr, pd) {
            framework.file.uploadCallback(response,function(errCode,errMsg,result) {
                //console.log("result:"+result);
                if(result.totNum>0){
                    layer.msg("成功导入数据"+result.totNum+"条记录！", {icon: 1, time: 3000});
                    getProductRiskDataUpLoadTmpEntity(function (result) {
                        fileUpload.clear().draw();
                        $scope.fileUpload_dataset = [];
                        for(var i=0;i<result.length;i++){
                            $scope.fileUpload_dataset.push([i+1,result[i].sortName,result[i].exchangeID,result[i].instrumentID,result[i].instrumentName]);
                        }
                        fileUpload.rows.add($scope.fileUpload_dataset).draw();
                    });
                }else if(result.totNum==0){
                	 layer.msg("导入的数据无法匹配相应的合约代码", {icon: 2, time: 10000});
                	 fileUpload.clear().draw();
                }else{
                    layer.msg("导入数据失败", {icon: 2, time: 10000});
                }
            });
        }
    });

    //保存上传的内容
    $scope.saveFileData = function(entity){
        var fileEntity = {};
        fileEntity.capitalTypeID = entity.capitalTypeID;
        fileEntity.dataSourceID = entity.dataSourceID;
        if(fileUpload.context[0].aoData.length<1){
            layer.alert("至少导入一条信息");
            return false;
        }
        layer.load(2, {
    	    shade: [0.5,'#fff'] //0.1透明度的白色背景
    	});
        saveRealUpLoadExcelData(fileEntity,function(errCode){
            if(errCode == 0){
                layer.msg("新增成功", {icon: 1, time:3000});
                getTmpProductRiskSortQuery({},function(result){
                    $scope.asset_dataset = [];
                    var con = result;
                    if(con != undefined){
                    	for(var i=0;i<con.length;i++){

                            if(con[i].dataSourceID == "1"){
                                if(con[i].sortTypeID == "1" || con[i].sortTypeID == "3"){
                                    var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                        con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a>"];
                                }
                                else{
                                    var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                        con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [明细] </a>"];
                                }
                            }
                            else{
                                if(con[i].sortTypeID == "3"){
                                    var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                        con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                                }
                                else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "2"){
                                	 var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                         con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                                }else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "3"){
                               	     var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                         con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                                }else if(con[i].sortTypeID == "1"&&con[i].dataSourceID == "4"){
                                	 var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                         con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealdetailConbine2' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [修改] </a><a class='delCombine'> [删除] </a>"];
                                }
                                else{
                                    var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                        con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='RealDetailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [修改] </a><a class='delCombine'> [删除] </a>"];
                                }
                            }
                            $scope.asset_dataset.push(tempArr);
                        }
                       /* for(var i=0;i<con.length;i++){
                            if(con[i].sortTypeID == "1" || con[i].sortTypeID == "3"){
                                var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                    con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addDetailModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                            }
                            else{
                                var tempArr = [i+1,con[i].sortName,con[i].capitalTypeID,con[i].capitalTypeName,con[i].sortTypeID,con[i].sortTypeName,con[i].dataSourceID,
                                    con[i].dataSourceName,con[i].brokerID,con[i].brokerName,"<a class='detailConbine' data-toggle='modal' data-target='#addGroupModal'> [明细] </a><a class='delCombine'> [删除] </a>"];
                            }
                            $scope.asset_dataset.push(tempArr);
                        }*/
                        assetTable.clear().draw();
                        assetTable.rows.add($scope.asset_dataset).draw();
                    }
                })
                $("#fileExportModal").modal("hide");
            }
            else{
                layer.msg("新增失败",{icon: 2});
                $("#fileExportModal").modal("hide");
            }
            layer.closeAll('loading');
        })
    }

    //点击退出按钮所触发的操作
    $scope.exitModal = function(id){
        $("#" + id).modal("hide");
        if(id == "fileExportModal"){
            $scope.clearUpLoadTmpEntity();
        }
    };

    //上传页面，点退出和X时调用该方法，清楚临时上边表中的数据
    $scope.clearUpLoadTmpEntity = function(){
        deleteRiskDataUpLoadTmpEntity(function(result){

        });
    };

})