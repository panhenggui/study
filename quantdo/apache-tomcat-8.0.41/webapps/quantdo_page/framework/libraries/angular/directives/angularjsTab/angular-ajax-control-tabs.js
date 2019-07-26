/**
 * Created by Quantdo on 2016/6/1.
 */
(function(window, angular, undefined) {'use strict';

    var ngAJAXTabs = angular.module("ngAJAXTabs", []);
    var __paneScope__ = null;
    var __paneScope_enterTabFunc__ = null;

    ngAJAXTabs.directive("tabs", function() {
        return {
            restrict: "E",
            transclude: true,
            scope: {},
            controller: function($scope, $element ,$rootScope) {
                var add = "add";
                var out = "out";
                var enter = "enter";
                var close = "close";
                $scope.selectFlag = 1;//用于判断是否由select方法切换tab 0代表由select切换 1代表由侧边栏addPane切换
                //设置全局变量的值，保存页面scope和方法名称
                $rootScope.setTabPaneScope = function(scope,enterTab) {
                    //debugger;
                    __paneScope__ = scope;
                    __paneScope_enterTabFunc__ = enterTab;
                };

                $rootScope.$watch('modelFlag', function() {
                    if($scope.selectFlag == 0){
                        $scope.selectFlag = 1;
                        return;
                    }
                    if($rootScope.modelFlag == 'del'){
                        for(var i=panes.length-1;i>=0;i--){
                            $scope.delAllPane(panes[i]);
                        }
                        return;
                    }
                    for(var i=0;i<panes.length;i++){
                        var myFlagPane = panes[i].tabTitle.indexOf("[");
                        if(myFlagPane>0){
                            var myPane = panes[i].tabTitle.substring(0,myFlagPane);
                        }
                        else{
                            var myPane = panes[i].tabTitle;
                        }
                        if($rootScope.modelFlag == myPane){
                            $scope.select(panes[i]);
                        }
                    }
                });
                var panes = $scope.panes = [];

                $scope.select = function(pane) {
                    if($rootScope.modelFlag != pane.tabTitle){
                        for(var i=0;i<panes.length;i++){
                            if($rootScope.modelFlag == panes[i].tabTitle){
                                $scope.mymodelFlag = true;
                                //判断当前页面是否设置了回调方法
                                if(panes[i].enterTabFunc != undefined){
                                    panes[i].paneScope[panes[i].enterTabFunc](panes[i].paneScope,out);
                                }
                            }
                        }
                    }
                    // 判断当前选项卡是否处于选中状态
                    if(pane.selected == false){
                        //判断当前页面是否设置了回调方法
                        if(pane.enterTabFunc != undefined){
                            pane.paneScope[pane.enterTabFunc](pane.paneScope,enter,pane.paneScope.myID,pane.tabTitle,panes,$rootScope.modelFlag,$scope.mymodelFlag);
                        }
                    }
                    if(arguments[1] == 1){
                        $scope.selectFlag = 0;//用于判断是否由select方法切换tab 0代表由select切换 1代表由侧边栏addPane切换
                    }
                    $rootScope.modelFlag = pane.tabTitle;
                    angular.forEach(panes, function(pane) {
                        pane.selected = false;
                    });
                    var flag = 0;
                    for(var i=0;i<panes.length;i++){
                        if(pane.tabTitle == panes[i].tabTitle){
                            panes[i].selected = true;
                            flag = 1;
                        }
                    }
                    if(flag == 0){
                        pane.selected = true;
                    }
                };

                $scope.delAllPane = function(pane){
                    var mygetTab = "";
                    for(var m=0;m<$rootScope.riskManagements.length;m++){
                        if(pane.tabTitle == $rootScope.riskManagements[m].name){
                            mygetTab = $rootScope.riskManagements;
                            break;
                        }
                    }
                    //var mygetTab = $scope.getTab(pane);
                    for(var i=0;i<mygetTab.length;i++){
                        if(pane.tabTitle == mygetTab[i].name){
                            //判断当前页面是否设置了回调方法
                            if($scope.panes[i].enterTabFunc != undefined){
                                $scope.panes[i].paneScope[$scope.panes[i].enterTabFunc]($scope.panes[i] .paneScope,close);
                            }
                            if(mygetTab.length == 1){
                                $scope.select($scope.panes[$scope.panes.length-1]);
                            }
                            $scope.panes.splice(i,1);
                            if($scope.panes.length>=1){
                                $scope.select($scope.panes[$scope.panes.length-1]);
                            }
                            mygetTab.splice(i,1);
                            break;
                        }
                    }
                };

                $scope.delPane = function(pane){
                    sessionStorage.initPage = "aaa";
                    var mygetTab = $scope.getTab(pane);
                    var menuShow = document.getElementById("menu-show");
                    var firstLiArr = menuShow.getElementsByTagName("li");
                    var mytabTitle = "";
                    if(pane.tabTitle.indexOf("[")>0){
                        mytabTitle = pane.tabTitle.substring(0,pane.tabTitle.indexOf("["));
                    }
                    else{
                        mytabTitle = pane.tabTitle;
                    }
                    for(var i=0;i<mygetTab.length;i++){
                        if(mytabTitle == mygetTab[i].name){
                            //判断当前页面是否设置了回调方法
                            if($scope.panes[i].enterTabFunc != undefined){
                                $scope.panes[i].paneScope[$scope.panes[i].enterTabFunc]($scope.panes[i] .paneScope,close);
                            }
                            if(mygetTab.length == 1){
                                $scope.select($scope.panes[0]);
                                //$scope.select($scope.panes[$scope.panes.length-1]);
                            }
                            $scope.panes.splice(i,1);
                            if($scope.panes.length>=1){
                                $scope.select($scope.panes[0]);
                                //$scope.select($scope.panes[$scope.panes.length-1]);
                            }
                            mygetTab.splice(i,1);
                            break;
                        }
                    }
                    //关闭所有的投顾信息 资金账户占满整行
                    if($rootScope.riskPanes.length == 0){
                        $("#riskLeft").removeClass("riskLeft");
                        $("#riskLeft").addClass("dispear");
                        $("#riskRight").addClass("fullRow");
                    }

                    //关闭所有的资金账户信息 投顾信息沾满整行
                    if($rootScope.panes.length == 0){
                        $("#riskRight").removeClass("riskLeft");
                        $("#riskRight").addClass("dispear");
                        $("#riskLeft").addClass("fullRow");
                    }

                    if(mygetTab.length>0){
                        for(var j=0;j<firstLiArr.length;j++){
                            if(mytabTitle == firstLiArr[j].innerText){
                                $(firstLiArr[j].childNodes[0]).addClass("myopacity");
                            }
                            if(mygetTab[0].name == firstLiArr[j].innerText){
                                $(firstLiArr[j].childNodes[0]).removeClass("myopacity");
                            }
                        }
                    }
                    if(mygetTab.length == 0){
                        for(var j=0;j<firstLiArr.length;j++){
                            if(mytabTitle == firstLiArr[j].innerText){
                                $(firstLiArr[j].childNodes[0]).addClass("myopacity");
                                break;
                            }
                        }
                    }
                    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
                };
                //获取选中tab栏隶属于哪个菜单栏
                $scope.getTab = function(pane){
                    var myTab;//存储tab栏隶属的菜单栏
                    var flag =0;
                    var tabTitle = "";
                    if(pane.tabTitle.indexOf("[")>0){
                        tabTitle = pane.tabTitle.substring(0,pane.tabTitle.indexOf("["));
                    }
                    else{
                        tabTitle = pane.tabTitle;
                    }
                    for(var i=0;i<$rootScope.valuePane.length;i++){//在第一个菜单栏中查找
                        if(tabTitle == $rootScope.valuePane[i].name){
                            myTab = $rootScope.valuePane;
                            break;
                        }
                    }
                    for(var j=0;j<$rootScope.panes.length;j++) {//在第二个菜单栏右侧中查找
                        if (tabTitle == $rootScope.panes[j].name) {
                            myTab = $rootScope.panes;
                            flag = 1;
                            break;
                        }
                    }
                    for(var j=0;j<$rootScope.riskPanes.length;j++) {//在第二个菜单左侧中查找
                        if (tabTitle == $rootScope.riskPanes[j].name) {
                            myTab = $rootScope.riskPanes;
                            flag = 1;
                            break;
                        }
                    }
                    for(var k=0;k<$rootScope.centerPanes.length;k++){//在第三个菜单栏中查找
                        if(tabTitle == $rootScope.centerPanes[k].name){
                            myTab = $rootScope.centerPanes;
                            break;
                        }
                    }
                    for(var m=0;m<$rootScope.bottomPanes.length;m++){
                        if(tabTitle == $rootScope.bottomPanes[m].name){
                            myTab = $rootScope.bottomPanes;
                            break;
                        }
                    }
                    for(var m=0;m<$rootScope.riskManagements.length;m++){
                        if(tabTitle == $rootScope.riskManagements[m].name){
                            myTab = $rootScope.riskManagements;
                            break;
                        }
                    }
                    for(var n=0;n<$rootScope.riskAccountproductRisks.length;n++){
                    	 if(tabTitle == $rootScope.riskAccountproductRisks[n].name){
                             myTab = $rootScope.riskAccountproductRisks;
                             break;
                         }
                    }
                    for(var n=0;n<$rootScope.myTradeRightManges.length;n++){
                   	 if(tabTitle == $rootScope.myTradeRightManges[n].name){
                            myTab = $rootScope.myTradeRightManges;
                            break;
                        }
                   }
                    for(var n=0;n<$rootScope.myriskQueryCaiDan.length;n++){
                      	 if(tabTitle == $rootScope.myriskQueryCaiDan[n].name){
                               myTab = $rootScope.myriskQueryCaiDan;
                               break;
                           }
                      }
                    return myTab;
                };

                this.addPane = function(pane) {
                    pane.load();

                    if("投顾开户" == pane.tabTitle){
                        for(var i=0;i<panes.length;i++){
                            if("投顾开户" == panes[i].tabTitle){
                                $scope.panes.splice(i,1);
                            }
                        }

                    }
                    panes.push(pane);
                    //判断当前页面是否设置了回调方法
                    if(pane.enterTabFunc != undefined){
                        pane.paneScope[pane.enterTabFunc](pane.paneScope,add);
                    }
                    if(sessionStorage.initPage == ""){
                        $scope.select(panes[0]);
                    }
                    else{
                        $scope.select(pane);
                    }
                };
            },
            template:
            '<div class="tabbable">' +
            '<ul class="nav nav-tabs">' +
            '<li ng-repeat="pane in panes" class="showLi" ng-class="{active:pane.selected}" ng-click="select(pane)">'+
            '<span class="spanTab"><a href="">{{pane.tabTitle}}</a>&nbsp;<span class="closeButton" ng-click="delPane(pane,$event)"></span></span>' +
            '</li>' +'</ul>' +
            '<div class="tab-content" ng-transclude></div>' +
            '</div>',
            replace: true
        };
    });

    ngAJAXTabs.directive("pane", ["$http", "$templateCache", "$controller", "$compile", function($http, $templateCache, $controller, $compile) {
        return {
            require: "^tabs",
            restrict: "E",
            transclude: true,
            scope: { tabTitle: "@" },
            link: function(scope, element, attrs, tabsCtrl) {
                var templateCtrl, templateScope;

                if (attrs.template && attrs.controller) {
                    scope.load = function() {
                        $http.get(attrs.template, {cache: $templateCache})
                            .then(function(response) {
                                templateScope = scope.$new();
                                templateScope.isTabbedPane = true;
                                //templateCtrl = $controller(attrs.controller, {$scope: templateScope});
                                element.html(response.data);
                                element.children().data('$ngControllerController', templateCtrl);
                                $compile(element.contents())(templateScope);
                                scope.paneScope =  __paneScope__;
                                scope.enterTabFunc = __paneScope_enterTabFunc__;
                                __paneScope__ = null;
                                __paneScope_enterTabFunc__ = null;
                            });
                    };

                }

                tabsCtrl.addPane(scope);
            },
            template:
            '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
            '</div>',
            replace: true
        };
    }]);

})(window, window.angular);