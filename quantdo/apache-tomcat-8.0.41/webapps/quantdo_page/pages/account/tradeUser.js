myapp.controller('TradeUserController', function ($scope, $timeout) {
    //1、实例化交易用户服务接口
    $scope.tradeUserService = new com.quantdo.orgClear.service.TradeUserService();

    $scope.userTraderService = new com.quantdo.orgClear.service.UserTraderService();

    //2、定义页面数据模型
    $scope.queryEntity = {};
    $scope.tempEntity = {};
    $scope.modalEntity = {};
    $scope.queryIDs = new Array();
    $scope.queryUsers = new Array();
    //2.1、是否活跃
    $scope.isActiveArray = clearConstant.isNotDatas;

    //初始化交易员信息
    getAllTraderEntity(function (result) {
        $scope.queryIDs = result;
    });
    //3、定义方法
    //3.1、查询交易用户
    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};
        $scope.isQuery = true;
        $scope.tradeUserService.findByCondition(queryEntity, function (result) {
            $scope.listEntitys = result;
            $scope.$apply();
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
        });
    };
    //3.2、保存交易用户
    $scope.save = function (entity) {
        var index = entity.recordIndex;
        //增加
        if (index == undefined) {
            //1、查询交易员与用户关系表，是否已经建立用户与交易员关系
            $scope.userTraderService.query(entity, function (result) {
                if (result.id != null) {
                    layer.msg("交易员与用户关系已经建立，不能重复创建", {icon: 2, time: 3000});
                    return false;
                } else {
                	$scope.tradeUserService.findByKey(entity, function (result) {
                        if (null != result) {
                            layer.msg("用户已存在，不能重复创建", {icon: 2, time: 3000});
                            return false;
                        } else {
                        	//判断交易员与用户关系是否已建立
                            $scope.tradeUserService.add(entity, function (result) {
                                $scope.listEntitys.push(result);
                                $scope.queryUsers = angular.copy($scope.listEntitys);
                                $scope.$apply();
                                queryUserTrade(function (result) {
                                    $scope.userTraders = result;
                                    $scope.$apply();
                                });
                            });
                        }
                	});
                }
            });
            //修改
        } else {
            $scope.tradeUserService.update(entity, function (result) {
                $scope.listEntitys.splice(index, 1, entity);
                $scope.queryUsers = angular.copy($scope.listEntitys);
                $scope.$apply();
            });
        }
        //关闭窗口
        $("#myModal").modal("hide");
    };
    //3.3、删除交易用户
    $scope.remove = function (entity, index) {
        //使用内置Index
        layer.confirm('确定解除该交易员与用户的对应关系？', {icon: 3}, function (count) {
            //1、删除用户与交易员关系表中记录
//           $scope.userTraderService.deleteByCondition(entity,function(){
                //2、交易用户表状态更新
                entity.isActive="0";
                $scope.tradeUserService.update(entity, function (result) {
                    $scope.listEntitys.splice(index, 1, entity);
                    $scope.$apply();
                });
//            });
            layer.close(count);
        });
    };

    $scope.rebuild = function (entity, index) {
    	layer.confirm('确定重新启用该交易员与用户的对应关系？', {icon: 3}, function (count) {
        	//1、交易用户表状态更新
            entity.isActive = "1";
            $scope.tradeUserService.update(entity, function (result) {
                $scope.listEntitys.splice(index, 1, entity);
                $scope.$apply();
            });
            layer.close(count);
        });
    };


    //3.4、初始化新增页面的参数
    $scope.initAddParam = function () {
        $scope.modalEntity = {};
        $scope.modalEntity.isActive = $scope.isActiveArray[0].key;
        $scope.modalEntity.traderID = $scope.queryIDs[0].traderID;
        $scope.isUpdate = false;
        $scope.formValidateReset();
    };
    //3.5、初始化个性页面的参数
    $scope.initUpdateParam = function (entity, index) {
        $scope.tempEntity = angular.copy(entity);
        $scope.tempEntity.recordIndex = index;
        $scope.modalEntity = angular.copy($scope.tempEntity);
        $scope.isUpdate = true;
        $scope.formValidateReset();
    };
    //3.6、表单校验信息重置
    $scope.formValidateReset = function () {
        $scope.myForm.userID.$setPristine();
        $scope.myForm.userName.$setPristine();
        $scope.myForm.password.$setPristine();
    };
    //4、数据初始化        
    //4.1、进入页面时调用查询方法
    $scope.tradeUserService.findByCondition({}, function (result) {
        $scope.listEntitys = result;
        $scope.queryUsers = angular.copy($scope.listEntitys);
        $scope.$apply();
    });

    $scope.userTraders = new Array();
    //所有交易员与用户关系
    queryUserTrade(function (result) {
        $scope.userTraders = result;
        $scope.$apply();
    });

    $scope.getTradeID = function (text) {
        var count = $scope.userTraders.length;
        for (var i = 0; i < count; i++) {
            if ($scope.userTraders[i].userID == text) {
                return $scope.userTraders[i].traderID;
            }
        }
    };
});

