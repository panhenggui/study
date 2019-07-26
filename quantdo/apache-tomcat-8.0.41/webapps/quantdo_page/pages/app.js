'use strict';

const systemName = "全球交易系统";

var myapp = angular.module('myApp', ['ngRoute', 'ngFileUpload', 'ngAJAXTabs','controllers']);
myapp.controller('indexController', function ($scope, $http,$rootScope,$timeout) {
	
	$(".navbar-container .navbar-header .icon-logo").parent().html("<span class='icon-logo'></span>   " + systemName);
	$("title").html(systemName);
	
	//判断是否为空
	$rootScope.isNullOrBlanck = function(value){
		if(value == undefined || value == null || value == "")
			return true;
		else return false;
	}
	//创建表格的公共方法(传入表名，列数组，数据集，特殊属性（相同会覆盖），表格创建完成后的回调函数，一般在创建表格时传入空数据，在回调函数里查询数据，并加载数据集)
	$rootScope.initDataTable_new = function(tableID,columns,datas,attArr,callback){
    	var attObj = {
        		"data":datas,
        		"columns":columns,
        		"destroy":true,
    	        "retrieve": true,
                "paging": true,
                "stateSave":true,
                "ordering": true,
                "scrollCollapse":false, 
                "info":true
        	};
    	//用attArr覆盖arrObj
    	for(var k in attArr){
    		attObj[k] = attArr[k];
    	}
    	//生成表格
    	var table = $('#'+tableID).DataTable(attObj);
    	var index = [];
    	//控制表格列是否显示
    	for(var i=0;i<columns.length;i++){
    		table.column( i ).visible( true );
    		if(!columns[i].visible) index.push(i);
    	}
    	for(var i=0;i<index.length;i++){
    		table.column( index[i] ).visible( false );
    	}
    	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    	//回调函数
    	if(typeof callback == "function") callback();
	}
	// 用户名
	$scope.userName = "";
	$scope.userName = localStorage.getItem("userName");
	// 机构名称
	$scope.instShortName="";
    $scope.queryMenu = "";
	queryInstShortName(function (result) {
        $scope.instShortName = result;
    });
	
  $scope.initMenu = new com.quantdo.orgClear.service.InitMenusService();
  // 获取所有子菜单
  $scope.lastMenus = function(){
    var lastmenus = new Array();
    for(var i=0;i<$scope.menuEntitys.length;i++){
      for(var j=0;j<$scope.menuEntitys[i].submenus.length;j++){
        if($scope.menuEntitys[i].submenus[j].controller !== undefined && $scope.menuEntitys[i].submenus[j].controller !== ""){
          lastmenus.push({"title":$scope.menuEntitys[i].submenus[j].title,"titleShort":$scope.menuEntitys[i].submenus[j].titleShort,
            "controller":$scope.menuEntitys[i].submenus[j].controller,"url":$scope.menuEntitys[i].submenus[j].url,"topMenu":$scope.menuEntitys[i].title,"subMenu":""});
        }
        else{
          for(var k=0;k<$scope.menuEntitys[i].submenus[j].lastmenus.length;k++){
            lastmenus.push({"title":$scope.menuEntitys[i].submenus[j].lastmenus[k].title,"titleShort":$scope.menuEntitys[i].submenus[j].lastmenus[k].titleShort,
              "controller":$scope.menuEntitys[i].submenus[j].lastmenus[k].controller,"url":$scope.menuEntitys[i].submenus[j].lastmenus[k].url,
              "topMenu":$scope.menuEntitys[i].title,"subMenu":$scope.menuEntitys[i].submenus[j].title});
          }
        }
      }
    }
    return lastmenus;
  };

  // 左边菜单栏获取json内容
  $scope.getJsonData = function(){
    $http.get("index.json").success(function(response){
      $scope.menuEntitys = new Array();
      $scope.menuEntitystmp =response.menus;
      // 搜索框自动填充
      $scope.initMenu.getMenus(function(result){
    	  var roleMenus = result.menus;
    	  // 所有目录
    	  for(var x in $scope.menuEntitystmp){
    		  var menuFlag = true;
    		  for(var y in roleMenus){
    			  if($scope.menuEntitystmp[x].ngShow == roleMenus[y].url){
    				  menuFlag = false;
    				  break;
    			  }
    		  }
    		  // 2级
    		  var submenus = new Array();
    		  for(var m in $scope.menuEntitystmp[x].submenus){
    			  var tmp = $scope.menuEntitystmp[x].submenus;
    			  var submenuFlag = true;
    			  for(var k in roleMenus){
        			  if(tmp[m].ngShow == roleMenus[k].url){
        				  // 3级
                		  var lastmenus = new Array();
            			  for(var t = 0;t<tmp[m].lastmenus.length;t++){
            				  var lastmenuFlag = true; 
            				  for(var g in roleMenus){
            					  if(tmp[m].lastmenus[t].ngShow == roleMenus[g].url){
            						  lastmenuFlag = false;
            						  break;
            					  } 
            				  }
            				  if(lastmenuFlag){
            					  lastmenus.push(t);
                			  }  
            			  }
            			  for(var i = lastmenus.length-1;i>=0;i--){
            				  $scope.menuEntitystmp[x].submenus[m].lastmenus.splice(lastmenus[i], 1);
            			  }
        				  submenuFlag = false;
        				  break;
        			  }
    			  }
    			  if(submenuFlag){
    				  submenus.push(m);
	    		  }    		  
    		  } 

    		  for(var i =  submenus.length-1;i>=0;i--){
                  $scope.menuEntitystmp[x].submenus.splice(submenus[i], 1);
    		  }
			  
    		  if(!menuFlag){
    			  $scope.menuEntitys.push($scope.menuEntitystmp[x]);
    		  }
    		  
    	  }
    	  // 查找按钮权限
    	  $scope.buttonsArray = new Array(); 
    	  for(var z in roleMenus){
    		  var menu = roleMenus[z].url;
    		  // 判断是否有button
    		  if(menu.indexOf("button") !=-1){
    			  $scope.buttonsArray.push(roleMenus[z].url);
    		  }
    	  }
          // 先清空buttons里的数据
          localStorage.removeItem("buttons");
          // 在添加
    	  localStorage.setItem("buttons",JSON.stringify($scope.buttonsArray));
          var allUrlMenus =  $scope.lastMenus();
          $("#menuSearch").autocomplete(allUrlMenus, {
            minChars: 0,
            width: 130,
            max:10,
            scrollHeight: 160,   // 提示的高度，溢出显示滚动条
            matchContains: false,
            autoFill: true,
            selectFirst: true,
            formatItem: function(row, i, max) {
              return row.titleShort+' '+row.title;
            },
            formatResult: function(row, i, max) {
              return row.titleShort+' '+row.title;
            }
          });
          $scope.$apply();
      });
    }).error(function(){

    })
  };
  $scope.getJsonData();

  $scope.clearSearchContext = function(){
    $scope.queryMenu = "";
    $("#btn-search")[0].style.display = "block";
    $("#icon-close")[0].style.display = "none";
    $("#menuSearch").focus();
  };
  // 搜索栏过滤
  $scope.indexKeyDown = function(e){
    $("#btn-search")[0].style.display = "none";
    $("#icon-close")[0].style.display = "block";
    var menuSearch = document.getElementById("menuSearch").value;
    var keycode = window.event?e.keyCode:e.which;
    if(keycode == 13){
      $scope.getURLMenus = $scope.lastMenus();
      for(var i=0;i<$scope.getURLMenus.length;i++){
        if(menuSearch.split(" ")[0].toUpperCase() === $scope.getURLMenus[i].titleShort.toUpperCase()){
          $scope.queryMenu = $scope.getURLMenus[i].titleShort;
          $rootScope.addPane($scope.getURLMenus[i].subMenu,$scope.getURLMenus[i].topMenu,$scope.getURLMenus[i].title,$scope.getURLMenus[i].controller,$scope.getURLMenus[i].url);
          $scope.toggleTree($scope.getURLMenus[i].topMenu);
          break;
        }
      }
    }


  };
  $scope.toggleTree = function(searchValue){
    var navLists = document.getElementsByClassName("nav-list")[0].children;
    for(var i=0;i<navLists.length;i++){
      if(navLists[i].nodeName == "LI" && navLists[i].innerText.indexOf(searchValue) > -1){
        if(!$(navLists[i]).hasClass("open")){
          $(navLists[i]).addClass("open");
        }
      }
      else{
        $(navLists[i]).removeClass("open");
      }
    }
  };

  // 点击搜索按钮触发过滤事件
  $scope.serachMenu = function(){
    var menuSearch = document.getElementById("menuSearch").value;
    for(var i=0;i<$scope.menuEntitys.length;i++){
      for(var j=0;j<$scope.menuEntitys[i].submenus.length;j++){
        if(menuSearch === $scope.menuEntitys[i].submenus[j].titleShort){
          $scope.queryMenu = $scope.menuEntitys[i].submenus[j].titleShort;
          $rootScope.addPane("","",$scope.menuEntitys[i].submenus[j].title,$scope.menuEntitys[i].submenus[j].controller,$scope.menuEntitys[i].submenus[j].url);
        }
      }
    }
  };

  // 切换页面的皮肤
  $scope.changeSkin = function(){
    var disable = document.getElementById("light-skin");
    if(disable.disabled){
      disable.disabled = false;
    }
    else{
      disable.disabled = true;
    }
  };
  
  
  
  
  ///old index.js
  $scope.checkPwd ="";
  
  checkPassword(function(result){
		$scope.checkPwd = result;
		$scope.$apply();
  });
  
  var id = document.getElementById('passStrengthind');
  var div = document.createElement('div');
  var strong = document.createElement('strong');
  $scope.oStrengthind = id.appendChild(div);
  $scope.oStrengthTxtind = id.parentNode.appendChild(strong);
  
  var idag = document.getElementById('passStrengthindag');
  var divag = document.createElement('div');
  var strongag = document.createElement('strong');
  $scope.oStrengthindag = idag.appendChild(divag);
  $scope.oStrengthTxtindag = idag.parentNode.appendChild(strongag);
  
  
  var idtwo = document.getElementById('passStrengthindtwo');
  var divtwo = document.createElement('div');
  var strongtwo = document.createElement('strong');
  $scope.oStrengthindtwo = idtwo.appendChild(divtwo);
  $scope.oStrengthTxtindtwo = idtwo.parentNode.appendChild(strongtwo);
  
//  $scope.instShortName="";
//  queryInstShortName(function (result) {
//      $scope.instShortName="";
//      $scope.instShortName = result;
//      if( $scope.instShortName==undefined){
//      	// 资管柜台放开      $scope.instShortName="主经纪商";
//      	 $scope.qdamName="量投快速柜台";
//      	 
//      }else{
//      	 $scope.qdamName="全球交易系统";
//      }
//      $scope.$apply();
//  });
  /*
  $scope.amType = '';
  queryAmType(function (result) {
      $scope.amType = result;
      $scope.$apply();
  });
  
  $scope.userName = '';
  getUserName(function (result) {
      $scope.userName = result;
      $scope.$apply();
  });*/

	 $scope.isAllowIndexSub = true;
   // 获取账户设置系统设置
/*   getSystemConfig("indexSub", function (result) {
  	
  	if (result != undefined ){
  		
  		$scope.isAllowIndexSub = false;
  	}else{
  		
  		$scope.isAllowIndexSub = true;
  	}
  	
  	$scope.$apply();
  })*/
  
  
	$scope.pwdBlank = true;
	
	$scope.changePwd = function(){
		  $scope.modalEntity = {};
		  $scope.oStrengthindtwo.className = 'strengthLv0';
	      $scope.oStrengthTxtindtwo.innerHTML ='';
	   	  $scope.oStrengthind.className = 'strengthLv0';
	      $scope.oStrengthTxtind.innerHTML ='';
	      $scope.oStrengthindag.className = 'strengthLv0';
	      $scope.oStrengthTxtindag.innerHTML ='';
	      validCodeLoad();
		  document.getElementById("indexPwdResetValidcode").value=""; 
		  $scope.indexPwdChangeForm.password.$setPristine();
		  $scope.indexPwdChangeForm.newPassword.$setPristine();
		  $scope.indexPwdChangeForm.pwdag.$setPristine();
	};
	
	// 修改密码初始化
	$scope.index_pass_init = function(){
		  $scope.changePwd();
	};
	
   //判断密码框是否为空或者空格
	$scope.isBlank = function (entity){
		if(entity.password == undefined || entity.password.trim() == "" || 
				entity.pwdag == undefined || entity.pwdag.trim() == "" || 
				entity.newPassword == undefined || entity.newPassword.trim() == ""){
			$scope.pwdBlank = true;
		}else{
			$scope.pwdBlank = false;
		}
	};
   
	$scope.savePwd = function(entity){
		var oldPwd = entity.password.trim();
		var pwd1 = entity.newPassword.trim();
		var pwd2 = entity.pwdag.trim();
		var validcode = document.getElementById("indexPwdResetValidcode").value;
		
	    if(pwd1 == oldPwd ){
			layer.msg("新旧密码不可相同，请重新输入", {
				icon : 2,
				time : 2000
			});
			validCodeLoad();
			document.getElementById("indexPwdResetValidcode").value=""; 
			return false;
		}
	    
		if (pwd1 != pwd2) {
			layer.msg("两次密码输入不一致，请重新输入", {icon : 2});
			validCodeLoad();
			document.getElementById("indexPwdResetValidcode").value=""; 
			return false;
		}else{
			var lv = matchLatt(pwd1);
			if(lv == 1) {
		       layer.confirm('密码强度较弱，是否保存该密码？', {icon: 3}, function (count) {
		        	  layer.close(count);
		        	  indexChangePwd(function(result){
		  				if(result != null && result == 0){
		  					layer.msg("密码修改成功，请重新登录",{icon : 1});
		  					$("#indexPwdChangeModal").modal("hide");
		  					$timeout(function() {
		  					    if(window.localStorage.getItem("ipadress")){
                                    // const electron = window.require('electron');
                                    // const {ipcRenderer} = electron;
                                    // ipcRenderer.send("closeMainWindow",localStorage.getItem("loginWindowId"));
                                    // ipcRenderer.send("showWindow",localStorage.getItem("loginWindowId"));
                                }else{
                                    window.location.href = "login/login.html";
                                }
		  		            }, 1000);
		  				}else if(result != null && result == 1){
		  					validCodeLoad();
						    document.getElementById("indexPwdResetValidcode").value=""; 
		  				}
		  			},entity.password.trim(),pwd1,validcode);
		        });
	    	}else {
	    		indexChangePwd(function(result){
					if(result != null && result == 0){
						layer.msg("密码修改成功，请重新登录",{icon : 1});
						$("#indexPwdChangeModal").modal("hide");
						$timeout(function() {
                            if(window.localStorage.getItem("ipadress")){
                                // const electron = window.require('electron');
                                // const {ipcRenderer} = electron;
                                // ipcRenderer.send("closeMainWindow",localStorage.getItem("loginWindowId"));
                                // ipcRenderer.send("showWindow",localStorage.getItem("loginWindowId"));
                            }else{
                                window.location.href = "login/login.html";
                            }
			            }, 1000);
					}else if(result != null && result == 1){
	  					validCodeLoad();
					    document.getElementById("indexPwdResetValidcode").value=""; 
	  				}
				},entity.password.trim(),pwd1,validcode);
	    	}
		}
	};

	//隐藏菜单栏
	$scope.hideSidebar = function(){
		var sidebar = document.getElementById("sidebar");
		var maincontent = document.getElementById("main-content");
		var hideSideBar = document.getElementById("hideSideBar");
		var footerinner = document.getElementById("footer-inner");
		sidebar.style.display = "none";
		hideSideBar.style.display = "block";
		hideSideBar.style.left = "0";
		maincontent.style.marginLeft = "30px";
		footerinner.style.left = "15px";
        $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	};

	//展示菜单栏
	$scope.showSidebar = function(){
		var sidebar = document.getElementById("sidebar");
		var maincontent = document.getElementById("main-content");
		var hideSideBar = document.getElementById("hideSideBar");
		var footerinner = document.getElementById("footer-inner");
		hideSideBar.style.display = "none";
		maincontent.style.marginLeft = "185px";
		sidebar.style.display = "block";
		footerinner.style.left = "190px";
        $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	};
	
   $scope.showIndLow =function(oldPassword){
  	 var aLvTxt = ['','弱','中','强'];
       var lv = matchLatt(oldPassword);
       $scope.oStrengthind.className = 'strengthLv' + lv;
       $scope.oStrengthTxtind.innerHTML = aLvTxt[lv];
   };
  $scope.showIndLowag =function(password){
  	 var aLvTxt = ['','弱','中','强'];
       var lv = matchLatt(password);
       $scope.oStrengthindag.className = 'strengthLv' + lv;
       $scope.oStrengthTxtindag.innerHTML = aLvTxt[lv];
  };
  $scope.showIndLowtwo =function(rePassword){
  	 var aLvTxt = ['','弱','中','强'];
       var lv = matchLatt(rePassword);
       $scope.oStrengthindtwo.className = 'strengthLv' + lv;
       $scope.oStrengthTxtindtwo.innerHTML = aLvTxt[lv];
  };
  $scope.logonOut = function(){
    logOutInsertLog(function (resultInfo) {
      userLogout(function (result) {
        if (result) {
          console.log("hhh" + result);
        }else{
          return false;
        }
      });
    });
  };
  
  function matchLatt(val){
  	if(val != undefined && val.trim() != '' && val.length > 0){
       var lv = 0;
       if(val.match(/[a-z]/g)){lv++;}
       if(val.match(/[0-9]/g)){lv++;}
       if(val.match(/(.[^a-z0-9])/g)){lv++;}
       if(val.length < 6){lv=1;}
       if(lv > 3){lv=3;}
       return lv;
	    } else {
	       return 0;	
	    }
  }
  $('#indexPwdResetValidImg').on('click', function(e) {
      validCodeLoad();
  });
  //加载验证码
  function validCodeLoad() {
    	var o = framework.internal.getFullUrl('/captcha?d='+new Date().getTime());
    	if(document.getElementById("indexPwdResetValidImg") != null){
    		document.getElementById("indexPwdResetValidImg").src = o;
    	}
  }
});
// 为angularjs ng-repeat 添加循环结束完成的事件
myapp.directive('repeatDone', function () {
  return function (scope, element, attrs) {
    if (scope.$last) { // all are rendered
      scope.$eval(attrs.repeatDone);
    }
  }
});
var controllers = angular.module("controllers", []).run(function($rootScope) {
  $rootScope.panes = [{
    "name": "首页",
    "partial": "home.html",
    "controller": "homeCtroller",
    "topmenu":"",
    "submenu":"",
    "includedInTabView": true
  }];
  $rootScope.modelFlag ="首页";
  $rootScope.addPane = function(submenu,topmenu,name,ctrl,partial) {
    if(topmenu != ""){
      topmenu = topmenu + " >";
    }
    if(submenu != ""){
      submenu = submenu + " >";
    }
    var nav = document.getElementsByClassName("nav-list")[0].childNodes;
    var subnav = document.getElementsByClassName("submenu")[0].childNodes;
    for(var i=0;i<nav.length;i++){
      if(nav[i].nodeName == "LI"){
        for(var j=0;j<nav[i].childNodes[5].childNodes.length;j++){
          if(nav[i].childNodes[5].childNodes[j].nodeName == "LI"){
            if(nav[i].childNodes[5].childNodes[j].children[4].children.length>0){
              for(var k=0;k<nav[i].childNodes[5].childNodes[j].children[4].children.length;k++){
                if(nav[i].childNodes[5].childNodes[j].children[4].children[k].innerText.indexOf(name)>-1){
                  if(!$(nav[i].childNodes[5].childNodes[j].children[4].children[k]).hasClass("activeLI")){
                    $(nav[i].childNodes[5].childNodes[j].children[4].children[k]).addClass("activeLI");
                  }
                }
                else{
                  $(nav[i].childNodes[5].childNodes[j].children[4].children[k]).removeClass("activeLI");
                }
              }
            }


            else if(nav[i].childNodes[5].childNodes[j].innerText.indexOf(name) == 0 ){
              if(!$(nav[i].childNodes[5].childNodes[j]).hasClass("activeLI")){
                $(nav[i].childNodes[5].childNodes[j]).addClass("activeLI");
              }
            }
            else{
              $(nav[i].childNodes[5].childNodes[j]).removeClass("activeLI");
            }
          }
        }
      }
    }

    var flag = 0;
    if($rootScope.panes.length > 0){
      if("加盟商所属交易商管理" == name){
        for(var i = 0;i <$rootScope.panes.length;i++){
          if(name == $rootScope.panes[i].name){
            $rootScope.panes.splice(i,1);
          }
        }
      }
      else if("可交易商品设置" == name){
        for(var i = 0;i <$rootScope.panes.length;i++){
          if(name == $rootScope.panes[i].name){
            $rootScope.panes.splice(i,1);
          }
        }
      }
      else{
        for(var i = 0;i <$rootScope.panes.length;i++){
          if(name == $rootScope.panes[i].name){
            flag = 1;
          }
        }
      }

    }
    var closeAll = document.getElementById("closeAll");
    if($rootScope.panes.length>1){
      closeAll.style.display = "inline";
    }
    else
    {
      closeAll.style.display = "none";
    }
    if($rootScope.panes.length == 12){
      var styLeft= document.getElementById("li-before");
      var styRight = document.getElementById("li-after");
      styLeft.style.display = "inline";
      styRight.style.display = "inline";

    }
    if($rootScope.panes.length >= 20){
      flag = 1;
      alert("最多只能打开20个");
    }
    if(flag == 0){
      $rootScope.panes.push({
        "name": name,
        "partial": partial,
        "controller": ctrl,
        "topmenu":topmenu,
        "submenu":submenu,
        "includedInTabView": true
      });
    }else{
      $rootScope.modelFlag = name;
    }
  }
});

function tableOption(DTOptionsBuilder) {
  return DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
      // .withDOM('frt')
      // .withScroller()
      // .withOption('scrollY', 384);
}
// tab页面切换回调函数
// 调用方法引入$rootScope并加入下面2行代码
// $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
// $scope.tabCallBackFunc = tabCallBackFunc(paneScope,event);
function tabCallBackFunc(paneScope,event){
  // alert(paneScope.dtInstance.dataTable);
  if(event == "add"){// 新增tab 暂不使用

  }else if(event == "out"){// 切出tab
	  clearInterval(paneScope.timer);
  }else if(event == "enter"){// 切入tab
	  if(paneScope.isStart == true){
		  setTimeout(function() {
			  paneScope.listEntitys = [];
			  if(paneScope.tabFlag == "operAssetSummary"){
				  var st = paneScope.timeSet *1000;
			      if(st < 5000){
			    	  st = 5000;
			      }
			      if(paneScope.searchType == '2'){		//mom
			    	  exportAllOperAssetMOMSummary(function (result) {
				          paneScope.listEntitys = result;
				          paneScope.$apply();
				      });
				      paneScope.timer = setInterval(function (){
				    	  exportAllOperAssetMOMSummary(function (result) {
				              paneScope.listEntitys = result;
				              paneScope.$apply();
				          });
				      },st.toString());
			      }else if(paneScope.searchType == '0' || paneScope.searchType == '1'){
			    	  exportAllOperAssetFOFSummary(function (result) {
				          paneScope.listEntitys = result;
				          paneScope.$apply();
				      },{
				    	  accountID: paneScope.searchID,
				    	  instClientID: paneScope.instClientID
				        },paneScope.searchType);
				      paneScope.timer = setInterval(function (){
				    	  exportAllOperAssetFOFSummary(function (result) {
				              paneScope.listEntitys = result;
				              paneScope.$apply();
				          },{
				        	  accountID: paneScope.searchID,
				        	  instClientID: paneScope.instClientID
					        },paneScope.searchType);
				      },st.toString());
			      }
			  }else if(paneScope.tabFlag == "riskControl"){
				  paneScope.start();
			  }else if(paneScope.tabFlag == "mortgage"){
				  paneScope.mortgageService.findByQuery(function(result){
					  paneScope.listEntitys = result;
					  paneScope.$apply();
			        },paneScope.tmpQuery,paneScope.tmpQuery.beginDate,paneScope.tmpQuery.endDate);
			        
				  paneScope.timer = setInterval(function(){
					  paneScope.mortgageService.findByQuery(function(result){
						  paneScope.listEntitys = result;
						  paneScope.$apply();
			            },paneScope.tmpQuery,paneScope.tmpQuery.beginDate,paneScope.tmpQuery.endDate);
			        },5000);
			  }else if(paneScope.tabFlag == "flowQuery"){
				  paneScope.find(paneScope.queryEntity);
			  }
	  	}, 5000);
	  }
    setTimeout(function(){
      $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    });
  }else if(event == "close"){// 关闭tab
	  clearInterval(paneScope.timer);
  }
}
function multiselect(selectId){
  $(selectId).multiselect({
    noneSelectedText: "==请选择==",
    checkAllText: "全选",
    uncheckAllText: '全不选',
// selectedList:4
  });
}
function myKeyup(e, o) {
  if (e.keyCode == 13) {
    var tag = getTagByTab(parseInt(o.getAttribute("tab")) + 1);
    if (tag) {
      tag.focus();
      if (tag.tagName == "INPUT") {
        tag.select();
      }
      return false;
    }
  }
  if (e.keyCode == 40) {
    var tag = getTagByTab(parseInt(o.getAttribute("tab")) + 1);
    if (tag) {
      tag.focus();
      if (tag.tagName == "INPUT") {
        tag.select();
      }
      return false;
    }
  }
  if (e.keyCode == 38) {
    var tag = getTagByTab(parseInt(o.getAttribute("tab")) - 1);
    if (tag) {
      tag.focus();
      if (tag.tagName == "INPUT") {
        tag.select();
      }
      return false;
    }
  }
}
function initDataTables(table_id, table_titles, table_data, callback){
	for (var i=0;i<table_data.length;i++)
	{
		for (var j=0;j<table_titles.length;j++)
		{
			table_data[i][j] = table_data[i][j]+"";
			table_data[i][j] = table_data[i][j].replace(/</g, "&lt;");
			table_data[i][j] = table_data[i][j].replace(/>/g, "&gt;");
		}
	}
	return $("#" + table_id).DataTable({
		data : table_data,
		columns :table_titles,
		dom: 'rt<"bottom"ipl>',
		ordering:false,
		bFilter: false,
		colReorder: {
			fixedColumnsLeft: 3
		},
		footerCallback: callback
	});
}

function getTagByTab(t) {
// var inputs = document.getElementsByTagName("input");
// for (var i = 0; i < inputs.length; i++) {
// if (inputs[i].getAttribute("tab") == t)
// return inputs[i];
// }
// var selects = document.getElementsByTagName("select");
// for (var i = 0; i < selects.length; i++) {
// if (selects[i].getAttribute("tab") == t)
// return selects[i];
// }
// return false;

  var spans = document.getElementsByTagName("span");
  for (var j = 0; j < spans.length; j++) {
    if (spans[j].getAttribute("tab") == t)
      return spans[j];
  }

  var inputs = $(":input");
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].getAttribute("tab") == t)
      return inputs[i];
  }
  return false;
}

// 图片上传初始化
function initUpload(id, url, onSuccessFunction){
	$("#" + id).uploadFile({
    	dragdropWidth: 125,
        uploadStr:"点击上传",
        dragDropStr: "",
        dragDropContainerClass:"",
        url: url,
        fileName: "file",// 名字不能改
        onSuccess: onSuccessFunction,
        onSelect: function (files) {
            var file = files[0];
            var fileName = file.name;
            var suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
            if(suffix == "jpg" || suffix == "jpeg" || suffix == "png" || suffix == "JPG" || suffix == "JPEG"
                || suffix == "PNG" || suffix == "gif"){
                return true;
            } else {
                layer.msg('上传文件必须为图片格式，例如：jpg、jpeg、gif', {icon: 2}, 3000);
                return false;
            }
        }
    });
}

// 上传图片（一张图片加载预览）
function loadOneImageView(id, result){
	var url = framework.internal.getFullUrl('/download/' + "memberFileUploadService" + '/' + "downloadFile");
	url += '?params=[' + result +']&fileName='+Math.ceil(Math.random()*1000000)+'.jpg';
	
	var html="<img src='" + url + "' style=\"max-height:100%; max-width:100%;\">"
	var $image = $(html);
	$("#" + id + " img").remove();
	$("#" + id).append($image)
}

function loadOneImageTempView(id, result){
	var url = framework.internal.getFullUrl('/download/' + "memberFileUploadService" + '/' + "downloadTempFile");
	url += '?params=["' + result +'"]&fileName='+Math.ceil(Math.random()*1000000)+'.jpg';
	
	var html="<img src='" + url + "' style=\"max-height:100%; max-width:100%;\">"
	var $image = $(html);
	$("#" + id + " img").remove();
	$("#" + id).append($image)
}


/**
 * 报表经纪商树形列表（查询条件使用）
 * 
 * @param id
 * @param checkIds
 * @param type(0:获取经纪商代码，1：获取经纪商名称)
 */
function drawTree(id,checkIds) {
	// 设置文本框内容选中
	var checkedIds = new Array();
	if(checkIds != null && checkIds != ""){
		checkedIds = checkIds.split(",");
	}else{
		checkedIds = null;
	}
	// 获取所有经纪商
	var memberBrokerCapitalReportService = new com.quantdo.customer.service.MemberBrokerCapitalReportService();
	memberBrokerCapitalReportService.getMemberBrokerListForTree(function (result) {
	    var setting = {
	        check: {
	    		enable: true,
	    		chkStyle: "checkbox",
	    		chkboxType: { "Y": "s", "N": "s" }
	    	},
	        data: {
	            simpleData: {
	                enable: true,
	                autoCheckTrigger: false
	            }
	        },
	        view: {
	    		showIcon: false
			}
	    };
	    var treeObj =null;
	    $.fn.zTree.init($("#"+id), setting, result);
	    treeObj = $.fn.zTree.getZTreeObj(id);
	    if(treeObj != null){
	    	treeObj.expandAll(true); 
	    }
	    // 设置之前已选的为选中状态
		angular.forEach(checkedIds, function (value, index, arrays) {
			var node = treeObj.getNodeByParam("id", value);
	        if (node != null) {
	            treeObj.checkNode(node, true, true);
	        }
		});
	}); 
}

/**
 * 设置经纪商查询条件（经纪商代码，经纪商名称，所属经纪商段）
 * 
 * @param divId
 * @param treeId
 * @returns {Array}
 */
function setBrokerInfo(divId,treeId){
	var resultEntity = new Array();
	var idsEntity = new Array();
	var namesEntity = new Array();
	var belongsEntity = new Array();
  var treeObj = $.fn.zTree.getZTreeObj(treeId);
  if(treeObj != null){
  	var nodes = treeObj.getCheckedNodes(true);
  	angular.forEach(nodes, function (node, index, array) {
  		idsEntity.push(node.id);
  		namesEntity.push(node.name);
  		if(node.pId != null && node.pId != ""){
  			belongsEntity.push(node.pId);
  		}
  	});
  	resultEntity.push(idsEntity.join(","));
  	resultEntity.push(belongsEntity.join(","));
  }
  $("#"+divId).modal("hide");
  return resultEntity;
}

function isShow(button){
	 var flag = false;
	 var arr = JSON.parse(localStorage.getItem("buttons"));
	 for(var i in arr){
		 if(arr[i].indexOf(button) !=-1){
			 flag = true;
			 break;
		 }
	 }
	 return flag;
}


/**
 * 分割url
 * @returns {Array}
 */
function splitWindowUrl(){
  var url = window.location.href;
  let itemStr = url.split("?")[1];
  return itemStr.split("=")[1];
}

/**
 * html转义
 */
function htmlEncodeJQ ( str ) {
  return $('<span/>').text( str ).html();
}

/**
 * html解析
 */
function htmlDecodeJQ ( str ) {
  return $('<span/>').html( str ).text();
}

/** 拖拽模态框*/ 
var dragModal={
    mouseStartPoint:{"left":0,"top":  0},
    mouseEndPoint : {"left":0,"top":  0},
    mouseDragDown : false,
    basePoint : {"left":0,"top":  0},
    moveTarget:null,
    topleng:0
}
$(document).on("mousedown",".modal-header",function(e){
    //webkit内核和火狐禁止文字被选中
    $('body').addClass('select')
    //ie浏览器禁止文字选中
    document.body.onselectstart=document.body.ondrag=function(){
        return false;
        }
    if($(e.target).hasClass("close"))//点关闭按钮不能移动对话框  
        return;  
    dragModal.mouseDragDown = true;  
    dragModal.moveTarget = $(this).parent().parent();         
    dragModal.mouseStartPoint = {"left":e.clientX,"top":  e.pageY};  
    dragModal.basePoint = dragModal.moveTarget.offset();  
    dragModal.topLeng=e.pageY-e.clientY;
});  
$(document).on("mouseup",function(e){       
    dragModal.mouseDragDown = false;  
    dragModal.moveTarget = undefined;  
    dragModal.mouseStartPoint = {"left":0,"top":  0};  
    dragModal.basePoint = {"left":0,"top":  0};  
});  
$(document).on("mousemove",function(e){  
    if(!dragModal.mouseDragDown || dragModal.moveTarget == undefined)return;          
    var mousX = e.clientX;  
    var mousY = e.pageY;  
    if(mousX < 0)mousX = 0;  
    if(mousY < 0)mousY = 25;  
    dragModal.mouseEndPoint = {"left":mousX,"top": mousY};  
    var width = dragModal.moveTarget.width();  
    var height = dragModal.moveTarget.height();
    var clientWidth=document.body.clientWidth
    var clientHeight=document.body.clientHeight;
    if(dragModal.mouseEndPoint.left<dragModal.mouseStartPoint.left - dragModal.basePoint.left){
        dragModal.mouseEndPoint.left=0;
    }
    else if(dragModal.mouseEndPoint.left>=clientWidth-width+dragModal.mouseStartPoint.left - dragModal.basePoint.left){
        dragModal.mouseEndPoint.left=clientWidth-width-38;
    }else{
        dragModal.mouseEndPoint.left =dragModal.mouseEndPoint.left-(dragModal.mouseStartPoint.left - dragModal.basePoint.left);//移动修正，更平滑  
        
    }
    if(dragModal.mouseEndPoint.top-(dragModal.mouseStartPoint.top - dragModal.basePoint.top)<dragModal.topLeng){
        dragModal.mouseEndPoint.top=dragModal.topLeng;
    }else if(dragModal.mouseEndPoint.top-dragModal.topLeng>clientHeight-height+dragModal.mouseStartPoint.top - dragModal.basePoint.top){
        dragModal.mouseEndPoint.top=clientHeight-height-38+dragModal.topLeng;
    }
    else{
        dragModal.mouseEndPoint.top = dragModal.mouseEndPoint.top - (dragModal.mouseStartPoint.top - dragModal.basePoint.top);           
    }
    dragModal.moveTarget.offset(dragModal.mouseEndPoint);  
});   
$(document).on('hidden.bs.modal','.modal',function(e){
    $('.modal-dialog').css({'top': '0px','left': '0px'})
    $('body').removeClass('select')
    document.body.onselectstart=document.body.ondrag=null;
})

Number.prototype.toFixed=function (d) { 
     var s=scientificToNumber(this+""); 
     if(!d)d=0; 
     if(s.indexOf(".")==-1)s+="."; 
     s+=new Array(d+1).join("0"); 
     if(new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+(d+1)+"})?)\\d*$").test(s)){
     	var s="0"+RegExp.$2,pm=RegExp.$1,a=RegExp.$3.length,b=true;
        if(a==d+2){
            a=s.match(/\d/g); 
            if(parseInt(a[a.length-1])>4){
                for(var i=a.length-2;i>=0;i--){
                    a[i]=parseInt(a[i])+1;
                    if(a[i]==10){
                        a[i]=0;
                        b=i!=1;
                    }else break;
                }
            }
            s=a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");
        }
        if(b)s=s.substr(1); 
        return (pm+s).replace(/\.$/,"");
     }
     return this+"";
};

function scientificToNumber(num) {
    var str = num.toString();
    var reg = /^(\d+)(\.)?(\d+)?(e)([\-]?\d+)$/;
    var arr, len,
        zero = '';

    /*6e7或6e+7 都会自动转换数值*/
    if (!reg.test(str)) {
        return num;
    } else {
        /*6e-7 需要手动转换*/
        arr = reg.exec(str);
        len = Math.abs(arr[5]) - 1;
        for (var i = 0; i < len; i++) {
            zero += '0';
        }
        if(arr[3] == undefined){
        	arr[3] = "";
        }
        var tmp = zero + arr[1] + arr[3];
        while(tmp.length != 8){
        	tmp = tmp + "0";
        }
        return '0.' + tmp;
    }
}
