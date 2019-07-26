/**
 * Created by Quantdo on 2016/6/14.
 */
myapp.controller('controlIndexController',function($scope,$rootScope){
    $("[forType='date']").datepicker({
        language:  'zh-CN',
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: 'yyyymmdd'
    });

    $scope.fundRiskParamService = new com.quantdo.orgClear.service.FundProductRiskParamService();

    $scope.subCapitalAccountTradingLimitService = new com.quantdo.orgClear.service.SubCapitalAccountTradingLimitService();

    //初始化比较符
    $scope.compareFlag = [{sign:'<',value:'<'},{sign:'>',value:'>'},{sign:'=',value:'='},{sign:'<=',value:'<='},{sign:'>=',value:'>='}];

    //初始化需要比较的值
    $scope.compareValue = {condfield1:''};

    //初始化动作值
    $scope.compareAction = [{sign:'预警',value:'3'},{sign:'只可平仓',value:'1'},{sign:'清仓',value:'2'}];

    //存储表格ID
    $scope.myID="#controlIndex_table";

    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    //存储表格中的数据
    $scope.controlIndex_dataset = [];

    //存储所有基金ID，简称
    $scope.fundProductList = [];

    //存储阈值
    $scope.thresholdList = [];

    //存储动作
    $scope.actionCodeList = [];

    //存储资金账号信息
    $scope.captailAccounts = [];

    //存储交易所信息
    $scope.exchs = [];

    $scope.bwProductType = clearConstant.bwProductType;		//黑白名单类别

    $scope.indexPageFlag = clearConstant.indexPageFlag;		//指标ID对应页面

    //存储所有指标ID，指标名称
    $scope.indexList = [];

    //存储当前行所对应需要修改的数据
    $scope.indexUpdate = [];

    $scope.indexID = '';

    $scope.myParameter_dataset = [];

    $scope.myParameter = {};

    $scope.myParemeters = {lcontag1:'<=',condfield1:'',rcontag1:'<',actionCode:'1',condfield1:''};
    $scope.saveParemeters = [];

    $scope.mycheckID = [];//存储指标ID

    //标识是添加还是修改
    $scope.recordIndex = "";

    //标识进入哪个页面
    $scope.indexType = "";

    //获取所有基金ID，简称；指标ID，指标名称
    getRiskFundProductAndIndexObject(function(result){
        $scope.fundProductList = result.fundProductList;
        $scope.indexList = result.indexList;
        //$scope.compareValue = $scope.indexList[0].condfieldList1;
        //$scope.myParemeters.condfield1 = $scope.compareValue[0].shortName;
        //$scope.indexEntity.fundId = $scope.fundProductList[0].fundId;
        //$scope.indexList.$apply;
    })

    //初始化页面信息
    $scope.indexEntity = {fundId:"",statusObject:'0',tradeRight:'0',subAccountID:'',limitType:'0',exchID:'',productID:$scope.bwProductType[0].key};

    $scope.updateParameter = []

    //获取比较符及需要比较的值每个元素所对应的键值
    $scope.getMyValue = function(strArr,value){
        for(var i=0;i<strArr.length;i++){
            if(value == strArr[i].value){
                return strArr[i].sign;
            }
        }
        return null;
    }

    $scope.getMyCondfield1n = function(strArr,shortName){
        for(var i=0;i<strArr.length;i++){
            if(shortName == strArr[i].shortName){
                return strArr[i].paramName;
            }
        }
        return null;
    }

    //获取比较符及需要比较的值存储的值
    $scope.getMyShortName = function(strArr,paramName){
        for(var i=0;i<strArr.length;i++){
            if(paramName == strArr[i].paramName){
                return strArr[i].shortName;
            }
        }
        return null;
    }

    //获取比较符及需要比较的值存储的值
    $scope.getMySign = function(strArr,sign){
        for(var i=0;i<strArr.length;i++){
            if(sign == strArr[i].sign){
                return strArr[i].value;
            }
        }
        return null;
    }

    // 查询有效资金账号
    findActiveCapitalAccount(function (result) {
        $scope.captailAccounts = result;
        $scope.indexEntity.subAccountID = $scope.captailAccounts[0].innerAccountID;
    });

    //查询所有交易所
    getAllExchanges(function(result){
        $scope.exchs = result;
        $scope.indexEntity.exchID = $scope.exchs[0].exchID;
    });

    //初始化界面
    function formValidateReset(){
        $scope.myForm.startDate.$setPristine();
        $scope.myForm.endDate.$setPristine();
        $scope.myForm.startTime.$setPristine();
        $scope.myForm.endTime.$setPristine();
        $scope.myForm.lconval1.$setPristine();
        $scope.myForm.rconval1.$setPristine();
        $scope.myForm.threshold.$setPristine();
        $scope.myForm.beforeDelivMonths.$setPristine();
        $scope.myForm.productID.$setPristine();
        $scope.myForm.instrumentID.$setPristine();
    }

    //初始化风控指标管理新增模态框
    $scope.initControlIndex = function(){
        $scope.indexEntity = {};
        $scope.indexEntity = {fundId:$scope.fundProductList[0].fundId,statusObject:'0',tradeRight:'0',subAccountID:'',limitType:'0',exchID:'',productID:$scope.bwProductType[0].key};
        $("input[type=checkbox]").attr("checked",false);
        formValidateReset();
        destroyDatatable("myParameter_table");
        $scope.myParameter_dataset = [];
        $scope.getMyParameterTable();
    }


    $scope.showTable = function () {
        $('#table-div').removeClass("hidden");
        $('#table-div').addClass("show");
    };

    $scope.hideTable = function () {
        $('#table-div').removeClass("show");
        $('#table-div').addClass("hidden");
    };
    //调用接口获得所有风控指标管理所有信息
    getFundRiskIndexList('',function(result){
        var con = result;
        for(var i=0;i<con.length;i++){
            if("1" ==con[i].updateTag)
            {
                var tempArr = [con[i].fundId,con[i].shortProductName,con[i].startDate,con[i].realStartDate,con[i].realEndDate,con[i].realStartTime,con[i].realEndTime,con[i].startTime,con[i].status,
                    con[i].condition,con[i].tplId1NameOrValue,con[i].tplId2NameOrValue,con[i].tplId3NameOrValue,con[i].tplId4NameOrValue,
                    con[i].tplId5NameOrValue,con[i].tplId6NameOrValue,'<a data-toggle="modal" data-target="#myModal" class="updateIndex">[修改]</a><a class="deleteIndex">[删除]</a>'];
            }
            else{
                var tempArr = [con[i].fundId,con[i].shortProductName,con[i].startDate,con[i].realStartDate,con[i].realEndDate,con[i].realStartTime,con[i].realEndTime,con[i].startTime,con[i].status,
                    con[i].condition,con[i].tplId1NameOrValue,con[i].tplId2NameOrValue,con[i].tplId3NameOrValue,con[i].tplId4NameOrValue,
                    con[i].tplId5NameOrValue,con[i].tplId6NameOrValue,""];
            }
            $scope.controlIndex_dataset.push(tempArr);
        }
        $scope.getTable();

    });
    //clearTimeout($scope.mytimer);
    $("body").delegate('#controlIndex_table .updateIndex', 'click', function(){
        $scope.mycheckID = [];
        var table = $('#controlIndex_table').DataTable();
        var mytr = $(this).parents('tr');
        var tempArr = table.row(mytr).data();
        //tempArr[8] = "1";
        //$("input[type=checkbox]").attr("checked",false);
        var entity = {};
        entity.fundId = tempArr[0];
        entity.startDate = tempArr[3];
        entity.endDate = tempArr[4];
        entity.startTime = tempArr[5];
        entity.endTime = tempArr[6];
        entity.statusObject = tempArr[8];
        modifyRiskStromData(entity,function(result){
            $scope.indexUpdate = result;
            angular.forEach($scope.indexList,function(indexdata,index){
                $scope.indexList[index].checkIndex = false;
                var flag = false;
                angular.forEach($scope.indexUpdate,function(updatedata,updateindex){
                    if(indexdata.indexId == updatedata.indexId){
                        $scope.mycheckID.push(updatedata.indexId);
                        flag = true;
                    }
                })
                if(flag){
                    $scope.indexList[index].checkIndex = true;
                }else{
                    $scope.indexList[index].checkIndex = false;
                }
            })
            $scope.$apply();
        })

    })

    //点击删除按钮，删除当前行所对应的数据
    $("body").delegate('#controlIndex_table .deleteIndex', 'click',function(){
        var table = $('#controlIndex_table').DataTable();
        var mytr = $(this).parents('tr');
        var tempArr = table.row(mytr).data();
        var entity = {};
        entity.fundId = tempArr[0];
        entity.startDate = tempArr[3];
        entity.endDate = tempArr[4];
        entity.startTime = tempArr[5];
        entity.endTime = tempArr[6];
        entity.statusObject = tempArr[8];
        layer.confirm('确定删除该条信息？', {icon: 3}, function (count) {
            deleteRiskStromDataFromDesplay(entity,function(errCode){
                if(errCode == 0){
                    layer.msg("删除成功",{icon: 1});
                    destroyDatatable("controlIndex_table");
                    getFundRiskIndexList('',function(result){
                        $scope.controlIndex_dataset = [];
                        var con = result;
                        for(var i=0;i<con.length;i++){
                            if("1" ==con[i].updateTag)
                            {
                                var tempArr = [con[i].fundId,con[i].shortProductName,con[i].startDate,con[i].realStartDate,con[i].realEndDate,con[i].realStartTime,con[i].realEndTime,con[i].startTime,con[i].status,
                                    con[i].condition,con[i].tplId1NameOrValue,con[i].tplId2NameOrValue,con[i].tplId3NameOrValue,con[i].tplId4NameOrValue,
                                    con[i].tplId5NameOrValue,con[i].tplId6NameOrValue,'<a data-toggle="modal" data-target="#myModal" class="updateIndex">[修改]</a><a class="deleteIndex">[删除]</a>'];
                            }
                            else{
                                var tempArr = [con[i].fundId,con[i].shortProductName,con[i].startDate,con[i].realStartDate,con[i].realEndDate,con[i].realStartTime,con[i].realEndTime,con[i].startTime,con[i].status,
                                    con[i].condition,con[i].tplId1NameOrValue,con[i].tplId2NameOrValue,con[i].tplId3NameOrValue,con[i].tplId4NameOrValue,
                                    con[i].tplId5NameOrValue,con[i].tplId6NameOrValue,""];
                            }
                            $scope.controlIndex_dataset.push(tempArr);
                        }
                        $scope.getTable();

                    });
                    //table.row(mytr).remove().draw(false);
                    //location.reload();
                    //return false;
                }else{
                    layer.msg("删除失败",{icon: 2});
                    $scope.$apply();
                }
                layer.close(count);
            });
        });

    })

    //初始化参数设置表格
    $scope.getMyParameterTable = function(){
        var columns_array = [
            { title: "参数范围"},
            { title: "阈值"},
            { title: "动作"},
            { title: "操作"}
            ];
        var table = initDataTables("myParameter_table",columns_array,$scope.myParameter_dataset);
    }
    $scope.getMyParameterTable();

    $scope.height= document.body.offsetHeight;
    //初始化风控指标管理表格
    $scope.getTable = function(){
        //记录表格中表头列的信息
        var columns_array = [
            { title: "基金产品编号"},
            { title: "基金产品简称"},
            { title: "生效日期"},
            { title: "开始日期",
              visible: false
            },
            { title: "结束日期",
                visible: false
            },
            { title: "开始时间",
                visible: false
            },
            { title: "结束时间",
                visible: false
            },
            { title: "生效时间"},
            { title: "状态"},
            { title: "风控条件"},
            { title: "指标阈值1"},
            { title: "指标阈值2"},
            { title: "指标阈值3"},
            { title: "指标阈值4"},
            { title: "指标阈值5"},
            { title: "指标阈值6"},
            { title: "操作"}
        ];
        //var table = $("#controlIndex_table").DataTable({
        //    data: $scope.controlIndex_dataset,
        //    columns: columns_array,
        //    //scrollY: height,
        //    //paging: false,
        //    //scrollX: true,
        //    dom: 'rt<"bottom"ipl>',
        //    ordering: false,
        //    //paging:   false,
        //    //pagingType: "full_numbers",
        //    language: {
        //        emptyTable: "没有符合条件的记录",
        //        info: "显示 _START_ 条到 _END_ 条 共 _TOTAL_ 条记录",
        //        infoEmpty: "显示 0 条到 0 条 共 0 条记录",
        //        lengthMenu: "显示 _MENU_ 条 记录",
        //        paginate: {
        //            first: "首页",
        //            last: "末页",
        //            next: "下一页",
        //            previous: "上一页"
        //        }
        //    }
        //});

        var table = initDataTables("controlIndex_table",columns_array,$scope.controlIndex_dataset,210,true);
    };

    $scope.myselect = function(id,type){
        if($("#control_index_select_"+id).is(':checked')){
            $scope.indexID = id;
            $scope.indexType = type;
        }
    }

    //保存当前点击所对应的指标ID
    $scope.addNewLink = function(id,indexType){
        if($("#control_index_select_"+id).is(':checked')){
            $scope.indexID = id;
            $scope.indexType = indexType;
            if($scope.indexUpdate.length>0){
                $scope.saveParemeters  = [];
                $scope.recordIndex = "1";
                for(var i=0; i < $scope.indexUpdate.length;i++){
                    if(id == $scope.indexUpdate[i].indexId){
                        $scope.indexEntity = $scope.indexUpdate[i];
                        //$scope.myParemeters = {lcontag1:'<=',condfield1:$scope.compareValue[0].shortName,rcontag1:'<',actionCode:'1'};
                        $scope.saveParemeters = angular.copy($scope.indexEntity.myParameters);
                        destroyDatatable("myParameter_table");

                        $scope.myParameter_dataset = [];
                        angular.forEach($scope.saveParemeters,function(data,index){
                            if(data.lconval1 == undefined){
                                var tempArr = [ $scope.getMyCondfield1n($scope.compareValue,data.condfield1) +" "+
                                $scope.getMyValue($scope.compareFlag,data.rcontag1) + " " + data.rconval1 ,data.threshold, $scope.getMyValue($scope.compareAction,data.actionCode),
                                    '<a data-toggle="modal" data-target="#myParameterModal"><i class="icon-update"></i></a><a><i class="icon-delete"></i></a>'];
                            }
                            else if(data.rconval1 == undefined){
                                var tempArr = [data.lconval1+" "+ $scope.getMyValue($scope.compareFlag,data.lcontag1) + " " + $scope.getMyCondfield1n($scope.compareValue,data.condfield1),data.threshold, $scope.getMyValue($scope.compareAction,data.actionCode),
                                    '<a data-toggle="modal" data-target="#myParameterModal"><i class="icon-update"></i></a><a><i class="icon-delete"></i></a>'];
                            }
                            else if(data.lconval1 == undefined && data.rconval1 == undefined){
                                var tempArr = ["","","",""];
                            }
                            else{
                                var tempArr = [data.lconval1+" "+ $scope.getMyValue($scope.compareFlag,data.lcontag1) + " " + $scope.getMyCondfield1n($scope.compareValue,data.condfield1) +" "+
                                $scope.getMyValue($scope.compareFlag,data.rcontag1) + " " + data.rconval1 ,data.threshold, $scope.getMyValue($scope.compareAction,data.actionCode),
                                    '<a data-toggle="modal" data-target="#myParameterModal"><i class="icon-update"></i></a><a><i class="icon-delete"></i></a>'];
                            }
                            $scope.myParameter_dataset.push(tempArr);
                        })

                        $scope.getMyParameterTable();
                        //点击修改按钮 修改当前行所对应的数据
                        $("#myParameter_table td").on("click",".icon-update",function(){
                            var table = $('#myParameter_table').DataTable();
                            var mytr = $(this).parents('tr');
                            var tempArr = table.row(mytr).data();
                            var range = tempArr[0].split(/\s+/);
                            $scope.myParameter = {};
                            $scope.myParameter.threshold = tempArr[1];
                            angular.forEach($scope.compareValue,function(data){
                                if(range[0] == data.paramName){
                                    $scope.myParameter.condfield1 = $scope.getMyShortName($scope.compareValue,range[0]);
                                    $scope.myParameter.rcontag1 = $scope.getMySign($scope.compareFlag,range[1]);
                                    $scope.myParameter.rconval1 = range[2];
                                }
                                else{
                                    $scope.myParameter.lconval1 = range[0];
                                    $scope.myParameter.lcontag1 = $scope.getMySign($scope.compareFlag,range[1]);
                                    $scope.myParameter.condfield1 = $scope.getMyShortName($scope.compareValue,range[2]);
                                    $scope.myParameter.rcontag1 = $scope.getMySign($scope.compareFlag,range[3]);
                                    $scope.myParameter.rconval1 = range[4];
                                }
                            })
                            $scope.myParameter.actionCode = $scope.getMySign($scope.compareAction,tempArr[2]);
                            $scope.myParameter.rowID = mytr[0].rowIndex;
                            $scope.beforeUpdate = {};
                            $scope.beforeUpdate = angular.copy($scope.myParameter);
                            //$scope.myParameter.$apply;
                        })

                        //点击删除按钮 删除当前行所对应的数据
                        $("#myParameter_table td").on("click",".icon-delete",function(){
                            var table = $('#myParameter_table').DataTable();
                            var mytr = $(this).parents('tr');
                            var tempArr = table.row(mytr).data();
                            var range = tempArr[0].split(/\s+/);
                            $scope.beforeUpdate = {};
                            $scope.beforeUpdate.threshold = tempArr[1];
                            angular.forEach($scope.compareValue,function(data){
                                if(range[0] == data.paramName){
                                    $scope.beforeUpdate.condfield1 = $scope.getMyShortName($scope.compareValue,range[0]);
                                    $scope.beforeUpdate.rcontag1 = $scope.getMySign($scope.compareFlag,range[1]);
                                    $scope.beforeUpdate.rconval1 = range[2];
                                }
                                else{
                                    $scope.beforeUpdate.lconval1 = range[0];
                                    $scope.beforeUpdate.lcontag1 = $scope.getMySign($scope.compareFlag,range[1]);
                                    $scope.beforeUpdate.condfield1 = $scope.getMyShortName($scope.compareValue,range[2]);
                                    $scope.beforeUpdate.rcontag1 = $scope.getMySign($scope.compareFlag,range[3]);
                                    $scope.beforeUpdate.rconval1 = range[4];
                                }
                            })
                            $scope.beforeUpdate.actionCode = $scope.getMySign($scope.compareAction,tempArr[2]);
                            table.row($(this).parents('tr'))
                                .remove().draw(false);
                            angular.forEach($scope.saveParemeters,function(data,index){
                                $scope.validateFlag = false;
                                if($scope.beforeUpdate.lcontag1 == null){
                                    $scope.validateFlag = data.actionCode == $scope.beforeUpdate.actionCode && data.condfield1 == $scope.beforeUpdate.condfield1
                                        && data.lconval1 == $scope.beforeUpdate.lconval1 && data.rcontag1 == $scope.beforeUpdate.rcontag1
                                        && data.rconval1 == $scope.beforeUpdate.rconval1 && data.threshold == $scope.beforeUpdate.threshold;
                                }
                                else if($scope.beforeUpdate.rcontag1 == null){
                                    $scope.validateFlag = data.actionCode == $scope.beforeUpdate.actionCode && data.condfield1 == $scope.beforeUpdate.condfield1
                                        && data.lcontag1 == $scope.beforeUpdate.lcontag1
                                        && data.lconval1 == $scope.beforeUpdate.lconval1
                                        && data.rconval1 == $scope.beforeUpdate.rconval1 && data.threshold == $scope.beforeUpdate.threshold;
                                }
                                else{
                                    $scope.validateFlag = data.actionCode == $scope.beforeUpdate.actionCode && data.condfield1 == $scope.beforeUpdate.condfield1 && data.lcontag1 == $scope.beforeUpdate.lcontag1
                                        && data.lconval1 == $scope.beforeUpdate.lconval1 && data.rcontag1 == $scope.beforeUpdate.rcontag1
                                        && data.rconval1 == $scope.beforeUpdate.rconval1 && data.threshold == $scope.beforeUpdate.threshold;
                                }
                                if($scope.validateFlag){
                                    $scope.saveParemeters.splice(index,1);
                                }
                            })
                        })
                        break;
                    }
                    else{
                        $scope.saveParemeters = [];
                        destroyDatatable("myParameter_table");
                        $scope.myParameter_dataset = [];
                        $scope.getMyParameterTable();

                    }
                }
            }
            else{
                $scope.saveParemeters = [];
                destroyDatatable("myParameter_table");
                $scope.myParameter_dataset = [];
                $scope.getMyParameterTable();
            }
        }
        //for(var i=0;i<$scope.mycheckID.length;i++){
        //    if(id !=)
        //}
        //angular.forEach($scope.mycheckID,function(data){
        //    if(id != data){
        //        destroyDatatable("myParameter_table");
        //        $scope.myParameter_dataset = [];
        //        $scope.getMyParameterTable();
        //    }
        //});

    }

    $scope.delete = function(index){
        $scope.saveParemeters.splice(index,1);
    }

    //添加多条参数设置信息
    $scope.addManyParemeters = function(){
        //angular.forEach($scope.saveParemeters,function(data){
        //    $scope.saveParemeters.push(data);
        //})
        $scope.saveParemeters.push($scope.myParemeters);
        $scope.myParemeters = {};
        $scope.myParemeters = {lcontag1:'<=',condfield1:$scope.compareValue[0].shortName,rcontag1:'<',actionCode:'1'};

        //if($scope.saveParemeters.length>1){
            destroyDatatable("myParameter_table");
        //}

        $scope.myParameter_dataset = [];

        angular.forEach($scope.saveParemeters,function(data,index){
            if(data.threshold == undefined){
                data.threshold = "";
            }
            if(data.lconval1 == undefined){
                var tempArr = [ $scope.getMyCondfield1n($scope.compareValue,data.condfield1) +" "+
                        $scope.getMyValue($scope.compareFlag,data.rcontag1) + " " + data.rconval1 ,data.threshold, $scope.getMyValue($scope.compareAction,data.actionCode),
                     '<a data-toggle="modal" data-target="#myParameterModal"><i class="icon-update"></i></a><a><i class="icon-delete"></i></a>'];
            }
            else if(data.rconval1 == undefined){
                var tempArr = [data.lconval1+" "+ $scope.getMyValue($scope.compareFlag,data.lcontag1) + " " + $scope.getMyCondfield1n($scope.compareValue,data.condfield1),data.threshold, $scope.getMyValue($scope.compareAction,data.actionCode),
                    '<a data-toggle="modal" data-target="#myParameterModal"><i class="icon-update"></i></a><a><i class="icon-delete"></i></a>'];
            }
            else if(data.lconval1 == undefined && data.rconval1 == undefined){
                var tempArr = ["","","",""];
            }
            else{
                var tempArr = [data.lconval1+" "+ $scope.getMyValue($scope.compareFlag,data.lcontag1) + " " + $scope.getMyCondfield1n($scope.compareValue,data.condfield1) +" "+
                $scope.getMyValue($scope.compareFlag,data.rcontag1) + " " + data.rconval1 ,data.threshold, $scope.getMyValue($scope.compareAction,data.actionCode),
                    '<a data-toggle="modal" data-target="#myParameterModal"><i class="icon-update"></i></a><a><i class="icon-delete"></i></a>'];
            }
            $scope.myParameter_dataset.push(tempArr);
        })

        $scope.getMyParameterTable();

        //点击修改按钮 修改当前行所对应的数据
        $("#myParameter_table td").on("click",".icon-update",function(){
            var table = $('#myParameter_table').DataTable();
            var mytr = $(this).parents('tr');
            var tempArr = table.row(mytr).data();
            var range = tempArr[0].split(/\s+/);
            $scope.myParameter = {};
            $scope.myParemeters = {lcontag1:'<=',condfield1:$scope.compareValue[0].shortName,rcontag1:'<',actionCode:'1'};
            angular.forEach($scope.compareValue,function(data){
                if(range[0] == data.paramName){
                    $scope.myParameter.condfield1 = $scope.getMyShortName($scope.compareValue,range[0]);
                    $scope.myParameter.rcontag1 = $scope.getMySign($scope.compareFlag,range[1]);
                    $scope.myParameter.rconval1 = range[2];
                }
                else{
                    $scope.myParameter.lconval1 = range[0];
                    $scope.myParameter.lcontag1 = $scope.getMySign($scope.compareFlag,range[1]);
                    $scope.myParameter.condfield1 = $scope.getMyShortName($scope.compareValue,range[2]);
                    $scope.myParameter.rcontag1 = $scope.getMySign($scope.compareFlag,range[3]);
                    $scope.myParameter.rconval1 = range[4];
                }
            })
            $scope.myParameter.threshold = tempArr[1];
            $scope.myParameter.actionCode = $scope.getMySign($scope.compareAction,tempArr[2]);
            $scope.myParameter.rowID = mytr[0].rowIndex;
            $scope.beforeUpdate = {};
            $scope.beforeUpdate = angular.copy($scope.myParameter);
            //$scope.myParameter.$apply;
        })

        //点击删除按钮 删除当前行所对应的数据
        $("#myParameter_table td").on("click",".icon-delete",function(){
            var table = $('#myParameter_table').DataTable();
            var mytr = $(this).parents('tr');
            var tempArr = table.row(mytr).data();
            var range = tempArr[0].split(/\s+/);
            $scope.beforeUpdate = {};
            $scope.beforeUpdate.threshold = tempArr[1];
            angular.forEach($scope.compareValue,function(data){
                if(range[0] == data.paramName){
                    $scope.beforeUpdate.condfield1 = $scope.getMyShortName($scope.compareValue,range[0]);
                    $scope.beforeUpdate.rcontag1 = $scope.getMySign($scope.compareFlag,range[1]);
                    $scope.beforeUpdate.rconval1 = range[2];
                }
                else{
                    $scope.beforeUpdate.lconval1 = range[0];
                    $scope.beforeUpdate.lcontag1 = $scope.getMySign($scope.compareFlag,range[1]);
                    $scope.beforeUpdate.condfield1 = $scope.getMyShortName($scope.compareValue,range[2]);
                    $scope.beforeUpdate.rcontag1 = $scope.getMySign($scope.compareFlag,range[3]);
                    $scope.beforeUpdate.rconval1 = range[4];
                }
            })
            $scope.beforeUpdate.actionCode = $scope.getMySign($scope.compareAction,tempArr[2]);
            table.row($(this).parents('tr'))
                .remove().draw(false);
            angular.forEach($scope.saveParemeters,function(data,index){
                $scope.validateFlag = false;
                if($scope.beforeUpdate.lcontag1 == null){
                    $scope.validateFlag = data.actionCode == $scope.beforeUpdate.actionCode && data.condfield1 == $scope.beforeUpdate.condfield1
                        && data.lconval1 == $scope.beforeUpdate.lconval1 && data.rcontag1 == $scope.beforeUpdate.rcontag1
                        && data.rconval1 == $scope.beforeUpdate.rconval1 && data.threshold == $scope.beforeUpdate.threshold;
                }
                else if($scope.beforeUpdate.rcontag1 == null){
                    $scope.validateFlag = data.actionCode == $scope.beforeUpdate.actionCode && data.condfield1 == $scope.beforeUpdate.condfield1
                        && data.lcontag1 == $scope.beforeUpdate.lcontag1
                        && data.lconval1 == $scope.beforeUpdate.lconval1
                        && data.rconval1 == $scope.beforeUpdate.rconval1 && data.threshold == $scope.beforeUpdate.threshold;
                }
                else{
                    $scope.validateFlag = data.actionCode == $scope.beforeUpdate.actionCode && data.condfield1 == $scope.beforeUpdate.condfield1 && data.lcontag1 == $scope.beforeUpdate.lcontag1
                        && data.lconval1 == $scope.beforeUpdate.lconval1 && data.rcontag1 == $scope.beforeUpdate.rcontag1
                        && data.rconval1 == $scope.beforeUpdate.rconval1 && data.threshold == $scope.beforeUpdate.threshold;
                }
                if($scope.validateFlag){
                    $scope.saveParemeters.splice(index,1);
                }
            })
            //var deleteRowIndex = mytr[0].rowIndex;
            //table.row($(this).parents('tr'))
            //    .remove().draw(false);
        })

    };

    //修改参数设置表格
    $scope.updateMyParameter = function(object){
        //销毁原有参数设置表格
        destroyDatatable("myParameter_table");
        angular.forEach($scope.saveParemeters,function(data,index){
            $scope.validateFlag = false;
            if($scope.beforeUpdate.lcontag1 == null){
                $scope.validateFlag = data.actionCode == $scope.beforeUpdate.actionCode && data.condfield1 == $scope.beforeUpdate.condfield1
                    && data.lconval1 == $scope.beforeUpdate.lconval1 && data.rcontag1 == $scope.beforeUpdate.rcontag1
                    && data.rconval1 == $scope.beforeUpdate.rconval1 && data.threshold == $scope.beforeUpdate.threshold;
            }
            else if($scope.beforeUpdate.rcontag1 == null){
                $scope.validateFlag = data.actionCode == $scope.beforeUpdate.actionCode && data.condfield1 == $scope.beforeUpdate.condfield1
                    && data.lcontag1 == $scope.beforeUpdate.lcontag1
                    && data.lconval1 == $scope.beforeUpdate.lconval1
                    && data.rconval1 == $scope.beforeUpdate.rconval1 && data.threshold == $scope.beforeUpdate.threshold;
            }
            else{
                $scope.validateFlag = data.actionCode == $scope.beforeUpdate.actionCode && data.condfield1 == $scope.beforeUpdate.condfield1 && data.lcontag1 == $scope.beforeUpdate.lcontag1
                    && data.lconval1 == $scope.beforeUpdate.lconval1 && data.rcontag1 == $scope.beforeUpdate.rcontag1
                    && data.rconval1 == $scope.beforeUpdate.rconval1 && data.threshold == $scope.beforeUpdate.threshold;
            }
            if($scope.validateFlag){
                $scope.saveParemeters.splice(index,1,object);
            }
        })

        //angular.forEach($scope.myParemeter_data,function(data){
        //    $scope.saveParemeters.push(data);
        //})
        $scope.myParameter_dataset = [];
        angular.forEach($scope.saveParemeters,function(data,index){
            if(data.lconval1 == undefined){
                var tempArr = [ $scope.getMyCondfield1n($scope.compareValue,data.condfield1) +" "+
                $scope.getMyValue($scope.compareFlag,data.rcontag1) + " " + data.rconval1 ,data.threshold, $scope.getMyValue($scope.compareAction,data.actionCode),
                    '<a data-toggle="modal" data-target="#myParameterModal"><i class="icon-update"></i></a><a><i class="icon-delete"></i></a>'];
            }
            else if(data.rconval1 == undefined){
                var tempArr = [data.lconval1+" "+ $scope.getMyValue($scope.compareFlag,data.lcontag1) + " " + $scope.getMyCondfield1n($scope.compareValue,data.condfield1),data.threshold, $scope.getMyValue($scope.compareAction,data.actionCode),
                    '<a data-toggle="modal" data-target="#myParameterModal"><i class="icon-update"></i></a><a><i class="icon-delete"></i></a>'];
            }
            else if(data.lconval1 == undefined && data.rconval1 == undefined){
                var tempArr = ["","","",""];
            }
            else{
                var tempArr = [data.lconval1+" "+ $scope.getMyValue($scope.compareFlag,data.lcontag1) + " " + $scope.getMyCondfield1n($scope.compareValue,data.condfield1) +" "+
                $scope.getMyValue($scope.compareFlag,data.rcontag1) + " " + data.rconval1 ,data.threshold, $scope.getMyValue($scope.compareAction,data.actionCode),
                    '<a data-toggle="modal" data-target="#myParameterModal"><i class="icon-update"></i></a><a><i class="icon-delete"></i></a>'];
            }
            $scope.myParameter_dataset.push(tempArr);
        })

        $scope.getMyParameterTable();
        layer.msg("修改成功",{icon: 1});
        $("#myParameterModal").modal("hide");

        //点击修改按钮 修改当前行所对应的数据
        $("#myParameter_table td").on("click",".icon-update",function(){
            var table = $('#myParameter_table').DataTable();
            var mytr = $(this).parents('tr');
            var tempArr = table.row(mytr).data();
            var range = tempArr[0].split(/\s+/);
            $scope.myParameter = {};
            $scope.myParameter.threshold = tempArr[1];
            angular.forEach($scope.compareValue,function(data){
                if(range[0] == data.paramName){
                    $scope.myParameter.condfield1 = $scope.getMyShortName($scope.compareValue,range[0]);
                    $scope.myParameter.rcontag1 = $scope.getMySign($scope.compareFlag,range[1]);
                    $scope.myParameter.rconval1 = range[2];
                }
                else{
                    $scope.myParameter.lconval1 = range[0];
                    $scope.myParameter.lcontag1 = $scope.getMySign($scope.compareFlag,range[1]);
                    $scope.myParameter.condfield1 = $scope.getMyShortName($scope.compareValue,range[2]);
                    $scope.myParameter.rcontag1 = $scope.getMySign($scope.compareFlag,range[3]);
                    $scope.myParameter.rconval1 = range[4];
                }
            })
            $scope.myParameter.threshold = tempArr[1];
            $scope.myParameter.actionCode = $scope.getMySign($scope.compareAction,tempArr[2]);
            $scope.myParameter.rowID = mytr[0].rowIndex;
            $scope.beforeUpdate = {};
            $scope.beforeUpdate = angular.copy($scope.myParameter);
            //$scope.myParameter.$apply;
        })

        //点击删除按钮 删除当前行所对应的数据
        $("#myParameter_table td").on("click",".icon-delete",function(){
            var table = $('#myParameter_table').DataTable();
            var mytr = $(this).parents('tr');
            var tempArr = table.row(mytr).data();
            var range = tempArr[0].split(/\s+/);
            $scope.beforeUpdate = {};
            $scope.beforeUpdate.threshold = tempArr[1];
            angular.forEach($scope.compareValue,function(data){
                if(range[0] == data.paramName){
                    $scope.beforeUpdate.condfield1 = $scope.getMyShortName($scope.compareValue,range[0]);
                    $scope.beforeUpdate.rcontag1 = $scope.getMySign($scope.compareFlag,range[1]);
                    $scope.beforeUpdate.rconval1 = range[2];
                }
                else{
                    $scope.beforeUpdate.lconval1 = range[0];
                    $scope.beforeUpdate.lcontag1 = $scope.getMySign($scope.compareFlag,range[1]);
                    $scope.beforeUpdate.condfield1 = $scope.getMyShortName($scope.compareValue,range[2]);
                    $scope.beforeUpdate.rcontag1 = $scope.getMySign($scope.compareFlag,range[3]);
                    $scope.beforeUpdate.rconval1 = range[4];
                }
            })
            $scope.beforeUpdate.actionCode = $scope.getMySign($scope.compareAction,tempArr[2]);
            //var deleteRowIndex = mytr[0].rowIndex;
            //$scope.beforeUpdate = {};
            table.row($(this).parents('tr'))
                .remove().draw(false);

            angular.forEach($scope.saveParemeters,function(data,index){
                $scope.validateFlag = false;
                if($scope.beforeUpdate.lcontag1 == null){
                    $scope.validateFlag = data.actionCode == $scope.beforeUpdate.actionCode && data.condfield1 == $scope.beforeUpdate.condfield1
                        && data.lconval1 == $scope.beforeUpdate.lconval1 && data.rcontag1 == $scope.beforeUpdate.rcontag1
                        && data.rconval1 == $scope.beforeUpdate.rconval1 && data.threshold == $scope.beforeUpdate.threshold;
                }
                else if($scope.beforeUpdate.rcontag1 == null){
                    $scope.validateFlag = data.actionCode == $scope.beforeUpdate.actionCode && data.condfield1 == $scope.beforeUpdate.condfield1
                        && data.lcontag1 == $scope.beforeUpdate.lcontag1
                        && data.lconval1 == $scope.beforeUpdate.lconval1
                        && data.rconval1 == $scope.beforeUpdate.rconval1 && data.threshold == $scope.beforeUpdate.threshold;
                }
                else{
                    $scope.validateFlag = data.actionCode == $scope.beforeUpdate.actionCode && data.condfield1 == $scope.beforeUpdate.condfield1 && data.lcontag1 == $scope.beforeUpdate.lcontag1
                        && data.lconval1 == $scope.beforeUpdate.lconval1 && data.rcontag1 == $scope.beforeUpdate.rcontag1
                        && data.rconval1 == $scope.beforeUpdate.rconval1 && data.threshold == $scope.beforeUpdate.threshold;
                }
                if($scope.validateFlag){
                    $scope.saveParemeters.splice(index,1);
                }
            })

        })
    }

    //保存新增加的风控指标管理信息
    $scope.save = function(entity){
        //获取开始时间和结束时间
        entity.startTime = document.getElementById("startTime").value;
        entity.endTime = document.getElementById("endTime").value;

        //获取参数设置集合
        entity.myParameters = $scope.saveParemeters;

        entity.indexId = $scope.indexID;

        for(var i=0;i<$scope.mycheckID.length;i++){
            if($scope.mycheckID[i] == entity.indexId){
                $scope.recordIndex = "1";
                break;
            }
            else{
                $scope.recordIndex = "";
            }
        }

        var index = $scope.recordIndex;
        if (index == "") {
            entity.id = 0;
            //调用后台保存数据接口
            if($scope.indexPageFlag.page1 == $scope.indexType){//进入第一类页面
                addRiskStromDataFundAndIndex(entity,function(errCode){
                    if(errCode == 0){
                        layer.msg("新增成功",{icon: 1});
                        destroyDatatable("controlIndex_table");
                        getFundRiskIndexList('',function(result){
                            $scope.controlIndex_dataset = [];
                            var con = result;
                            for(var i=0;i<con.length;i++){
                                if("1" ==con[i].updateTag)
                                {
                                    var tempArr = [con[i].fundId,con[i].shortProductName,con[i].startDate,con[i].realStartDate,con[i].realEndDate,con[i].realStartTime,con[i].realEndTime,con[i].startTime,con[i].status,
                                        con[i].condition,con[i].tplId1NameOrValue,con[i].tplId2NameOrValue,con[i].tplId3NameOrValue,con[i].tplId4NameOrValue,
                                        con[i].tplId5NameOrValue,con[i].tplId6NameOrValue,'<a data-toggle="modal" data-target="#myModal" class="updateIndex">[修改]</a><a class="deleteIndex">[删除]</a>'];
                                }
                                else{
                                    var tempArr = [con[i].fundId,con[i].shortProductName,con[i].startDate,con[i].realStartDate,con[i].realEndDate,con[i].realStartTime,con[i].realEndTime,con[i].startTime,con[i].status,
                                        con[i].condition,con[i].tplId1NameOrValue,con[i].tplId2NameOrValue,con[i].tplId3NameOrValue,con[i].tplId4NameOrValue,
                                        con[i].tplId5NameOrValue,con[i].tplId6NameOrValue,""];
                                }
                                $scope.controlIndex_dataset.push(tempArr);
                            }
                            $scope.getTable();

                        });
                        //location.reload();
                       //window.navigator("controlIndex.html")
                        //$("#myModal").modal("hide");
                    }else{
                        layer.msg("新增失败",{icon: 2});
                    }
                });
            }
            if($scope.indexPageFlag.page2 == $scope.indexType){//进入第二类页面
                //添加交割期
                $scope.fundRiskParamService.addDelivEntitys(function(result){
                    if(result != null){
                        layer.msg("新增成功",{icon: 1});
                        //$("#myModal").modal("hide");
                    }else{
                        layer.msg("新增失败",{icon: 2});
                    }
                },entity);
            }
            if($scope.indexPageFlag.page3 == $scope.indexType){//进入第三类页面
                //添加黑白名单
                $scope.subCapitalAccountTradingLimitService.addCapBwEntitys(function(result){
                    if(result != null){
                        layer.msg("新增成功",{icon: 1});
                        //$("#myModal").modal("hide");
                    }else{
                        layer.msg("新增失败",{icon: 2});
                    }
                },entity);

            }

        }
        else{
            updateRiskStromDataFundAndIndex(entity,function(result){
                if(result != null){
                    layer.msg("修改成功",{icon: 1});
                    destroyDatatable("controlIndex_table");
                    getFundRiskIndexList('',function(result){
                        $scope.controlIndex_dataset = [];
                        var con = result;
                        for(var i=0;i<con.length;i++){
                            if("1" ==con[i].updateTag)
                            {
                                var tempArr = [con[i].fundId,con[i].shortProductName,con[i].startDate,con[i].realStartDate,con[i].realEndDate,con[i].realStartTime,con[i].realEndTime,con[i].startTime,con[i].status,
                                    con[i].condition,con[i].tplId1NameOrValue,con[i].tplId2NameOrValue,con[i].tplId3NameOrValue,con[i].tplId4NameOrValue,
                                    con[i].tplId5NameOrValue,con[i].tplId6NameOrValue,'<a data-toggle="modal" data-target="#myModal" class="updateIndex">[修改]</a><a class="deleteIndex">[删除]</a>'];
                            }
                            else{
                                var tempArr = [con[i].fundId,con[i].shortProductName,con[i].startDate,con[i].realStartDate,con[i].realEndDate,con[i].realStartTime,con[i].realEndTime,con[i].startTime,con[i].status,
                                    con[i].condition,con[i].tplId1NameOrValue,con[i].tplId2NameOrValue,con[i].tplId3NameOrValue,con[i].tplId4NameOrValue,
                                    con[i].tplId5NameOrValue,con[i].tplId6NameOrValue,""];
                            }
                            $scope.controlIndex_dataset.push(tempArr);
                        }
                        $scope.getTable();

                    });
                    //$scope.indexEntity.splice(index, 1, result);
                    //$scope.$apply();
                    //$("#myModal").modal("hide");
                }else{
                    layer.msg("修改失败",{icon: 2});
                }
            })
        }


    }
})