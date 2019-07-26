Namespace.register("com.quantdo.orgClear.service");

	function transferOldRiskParamToNewParamA(instClientID,FundProductId,callback) {
	    framework.service.request('riskStromDataService', 'transferOldRiskParamToNewParamById',instClientID,FundProductId, function (errCode, errMsg, result) {
	        if (errCode > 0) {
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
	        }
	        if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}

//查询产品风控设置，FundProductId（资金产品账号）
function getFundRiskIndexList(FundProductId, callback) {
    framework.service.request('riskStromDataService', 'getFundRiskIndexList',FundProductId, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//获取所有的基金产品id和指标模板id
function getRiskFundProductAndIndexObject(callback) {
    framework.service.request('riskStromDataService', 'getRiskFundProductAndIndexObject',function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//添加数据
function addRiskStromDataFundAndIndex(entity,callback) {
	//更改的代码
	var back = true;
	for(var i=0;i<entity.myParameters.length;i++){
		if(entity.myParameters[i].threshold==null||entity.myParameters[i].threshold==undefined||entity.myParameters[i].threshold.length==0){
			back=false;
			layer.msg("阈值不能为空");
		}
	}
	if(back){
		 framework.service.request('riskStromDataService', 'addRiskStromDataFundAndIndex',entity,function (errCode, errMsg, result) {
		    	if (errCode > 0) {
		            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
		        }
		        if (callback !== undefined || callback != null) {
		            callback(errCode);
		        }
		    });
	}
	/*//原本代码
	//debugger;
    framework.service.request('riskStromDataService', 'addRiskStromDataFundAndIndex',entity,function (errCode, errMsg, result) {
    	if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(errCode);
        }
    });*/
}

//删除（显示界面上删除，需要传来的fundid,startDate,satrtTime,endDate,endTime,statusObject）
function deleteRiskStromDataFromDesplay(entity,callback) {
	//debugger;
    framework.service.request('riskStromDataService', 'deleteRiskStromDataFromDesplay',entity,function (errCode, errMsg, result) {
    	if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(errCode);
        }
    });
}

//删除（添加界面上删除，需要传来的指标id,赋给id，基金产品id,赋给fundid）
function deleteRiskStromDataIndexFundObject(entity,callback) {
	//debugger;
    framework.service.request('riskStromDataService', 'deleteRiskStromDataIndexFundObject',entity,function (errCode, errMsg, result) {
    	if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//点击修改时,(需要传递：基金产品id,开始日期，开始时间，结束日期，结束时间，状态)
function modifyRiskStromData(entity,callback) {
	//debugger;
    framework.service.request('riskStromDataService', 'modifyRiskStromData',entity,function (errCode, errMsg, result) {
    	if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//修改数据,点击确定时
function updateRiskStromDataFundAndIndex(entity,callback) {
	//debugger;
    framework.service.request('riskStromDataService', 'updateRiskStromDataFundAndIndex',entity,function (errCode, errMsg, result) {
    	if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//查询账户总持仓
function getOperClientPositionSum(callback) {
    framework.service.request('riskStromDataService', 'getOperClientPositionSum',function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//查询资金账户分组
function getOperInvestorAccountGroup(callback) {
    var dtd = $.Deferred();
    var mytables = sessionStorage.mytables.split(",");
    if(sessionStorage.initFlag){
        framework.service.request('riskStromDataService', 'getOperInvestorAccountGroup',function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                dtd.reject(errCode,errMsg);
            }
            //if (callback !== undefined || callback != null) {
            //    callback(result);
            //}
            dtd.resolve(result);
        });
        return dtd;
    }

    for(var i=0;i<mytables.length;i++) {
        if ("#capitalAccountGroup_table" == mytables[i]) {
            framework.service.request('riskStromDataService', 'getOperInvestorAccountGroup',function (errCode, errMsg, result) {
                if (errCode > 0) {
                    layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                    dtd.reject(errCode,errMsg);
                }
                //if (callback !== undefined || callback != null) {
                //    callback(result);
                //}
                dtd.resolve(result);
            });
            return dtd;
        }
    }

}

//查询基金产品风控结果
function getRiskFundNetResult(callback) {
    var dtd = $.Deferred();
    var mytables = sessionStorage.mytables.split(",");
    if(sessionStorage.initFlag){
        framework.service.request('riskStromDataService', 'getRiskFundNetResult',function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                dtd.reject(errCode,errMsg);
            }
            dtd.resolve(result);

        });
        return dtd;
    }
    for(var i=0;i<mytables.length;i++){
        if("#getRiskFundNetResult_table" == mytables[i]){
            framework.service.request('riskStromDataService', 'getRiskFundNetResult',function (errCode, errMsg, result) {
                if (errCode > 0) {
                    layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                    dtd.reject(errCode,errMsg);
                }
                dtd.resolve(result);

            });
            return dtd;
        }
    }


}

//根据基金净值当前行筛选资金账户
function findBySubAccountIdAndAccountIdOfRiskByFundId(fundProductID) {
    var dtd = $.Deferred();
    var mytables = sessionStorage.mytables.split(",");
    if(sessionStorage.initFlag){
        framework.service.request('operInvestorAccountService', 'findBySubAccountIdAndAccountIdOfRiskByFundId',fundProductID,function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                dtd.reject(errCode,errMsg);
            }
            dtd.resolve(result);
            //if (callback !== undefined || callback != null) {
            //    callback(result);
            //}

        });
        return dtd;
    }

    for(var i=0;i<mytables.length;i++){
        if("#capitalAccount_table" == mytables[i]){
            framework.service.request('operInvestorAccountService', 'findBySubAccountIdAndAccountIdOfRiskByFundId',fundProductID,function (errCode, errMsg, result) {
                if (errCode > 0) {
                    layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                    dtd.reject(errCode,errMsg);
                }
                dtd.resolve(result);
                //if (callback !== undefined || callback != null) {
                //    callback(result);
                //}

            });
            return dtd;
        }
    }

}


//根据基金净值当前行筛选资金账户总持仓
function getOperClientPositionSumByFundId(fundProductID,brokerID) {
    var dtd = $.Deferred();
    var mytables = sessionStorage.mytables.split(",");
    if(sessionStorage.initFlag){
        framework.service.request('riskStromDataService', 'getOperClientPositionSumByFundId',fundProductID,brokerID,function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                dtd.reject(errCode,errMsg);
            }
            dtd.resolve(result);
            //if (callback !== undefined || callback != null) {
            //    callback(result);
            //}
        });
        return dtd;
    }
    for(var i=0;i<mytables.length;i++) {
        if ("#capitalAccountSum_table" == mytables[i]) {
            framework.service.request('riskStromDataService', 'getOperClientPositionSumByFundId',fundProductID,brokerID,function (errCode, errMsg, result) {
                if (errCode > 0) {
                    layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                    dtd.reject(errCode,errMsg);
                }
                dtd.resolve(result);
                //if (callback !== undefined || callback != null) {
                //    callback(result);
                //}
            });
            return dtd;
        }
    }

}

//查询风控异常提示结果
function getRiskWarnResult() {
    var dtd = $.Deferred();
    var mytables = sessionStorage.mytables.split(",");
    if(sessionStorage.initFlag){
        framework.service.request('riskStromDataService', 'getRiskWarnResult',function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                dtd.reject(errCode,errMsg);
            }
            dtd.resolve(result);
            //if (callback !== undefined || callback != null) {
            //    callback(result);
            //}
        });
        return dtd;
    }
    for(var i=0;i<mytables.length;i++) {
        if ("#exceptionInformation_table" == mytables[i]) {
            framework.service.request('riskStromDataService', 'getRiskWarnResult',function (errCode, errMsg, result) {
                if (errCode > 0) {
                    layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                    dtd.reject(errCode,errMsg);
                }
                dtd.resolve(result);
                //if (callback !== undefined || callback != null) {
                //    callback(result);
                //}
            });
            return dtd;
        }
    }

}

//投顾账号
function getRiskAccount(fundId) {
    var dtd = $.Deferred();
    var mytables = sessionStorage.mytables.split(",");
    if(sessionStorage.initFlag){
        framework.service.request('riskStromDataService', 'getRiskAccount',fundId,function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                dtd.reject(errCode,errMsg);
            }
            dtd.resolve(result);
        });
        return dtd;
    }
    for(var i=0;i<mytables.length;i++) {
        if ("#riskAccount_table" == mytables[i]) {
            framework.service.request('riskStromDataService', 'getRiskAccount',fundId,function (errCode, errMsg, result) {
                if (errCode > 0) {
                    layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                    dtd.reject(errCode,errMsg);
                }
                dtd.resolve(result);
            });
            return dtd;
        }
    }

}

//投顾账号总持仓
function getRiskAccountSum(fundId) {
    var dtd = $.Deferred();
    var mytables = sessionStorage.mytables.split(",");
    if(sessionStorage.initFlag){
        framework.service.request('riskStromDataService', 'getRiskAccountSum',fundId,function (errCode, errMsg, result) {
            if (errCode > 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                dtd.reject(errCode,errMsg);
            }
            dtd.resolve(result);
        });
        return dtd;
    }

    for(var i=0;i<mytables.length;i++) {
        if ("#riskAccountSum_table" == mytables[i]) {
            framework.service.request('riskStromDataService', 'getRiskAccountSum',fundId,function (errCode, errMsg, result) {
                if (errCode > 0) {
                    layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                    dtd.reject(errCode,errMsg);
                }
                dtd.resolve(result);
            });
            return dtd;
        }
    }

}


//产品风控设置--净值分档占比设置--查询(传入基金产品id，brokerID)
function getProductRiskDataByFundId(fundId,brokerID,callback) {
    framework.service.request('riskStromDataService', 'getProductRiskDataByFundId',fundId,brokerID,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//产品风控设置--净值分档占比设置--添加
function addProductRiskDataIndexData(entity,brokerID,callback) {
    framework.service.request('riskStromDataService', 'addProductRiskDataIndexData',entity,brokerID,function (errCode, errMsg, result) {
       /* if (errCode > 0) {
        	//layer.msg(errMsg);
        	layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }*/
        if (callback !== undefined || callback != null) {
            callback(errCode,errMsg);
        }
    });
}

//产品风控设置--净值分档占比设置--删除
function deleteProductRiskDataIndexData(entity,brokerID,isDelete,callback) {
    framework.service.request('riskStromDataService', 'deleteProductRiskDataIndexData',entity,brokerID,isDelete,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(errCode);
        }
    });
}

//产品风控设置--净值分档占比设置--获取下拉信息
function getProductRiskDataPublicDataByFundId(brokerID,fundId,callback) {
    framework.service.request('riskStromDataService', 'getProductRiskDataPublicDataByFundId',brokerID,fundId,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//产品风控设置--获取主页面数据
function getProductRiskMainScreenData(fundId,callback) {
    framework.service.request('riskStromDataService', 'getProductRiskMainScreenData',fundId,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//产品风控设置--主页面保存
function saveFundIDAndSetData(entity,callback) {
    framework.service.request('riskStromDataService', 'saveFundIDAndSetData',entity,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(errCode);
        }
    });
}

/*//资产分类管理--excel导入成功后回调该方法
function giveCapitalTypeAnddataSource(entity,callback) {
    framework.service.request('riskStromDataService', 'giveCapitalTypeAnddataSource',entity,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(errCode);
        }
    });
}*/

//资产分类管理--主页面，获取下拉列表数据
function getSortScreenPullDownData(brokerID,callback) {
    framework.service.request('riskStromDataService', 'getSortScreenPullDownData',brokerID,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//资产分类管理--分组主页面，查寻功能
function getTmpProductRiskSortQuery(entity,callback) {
    framework.service.request('riskStromDataService', 'getTmpProductRiskSortQuery',entity,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//资产分类管理--分组主页面，删除功能
function deleteTmpProductRiskSortQuery(entity,callback) {
    framework.service.request('riskStromDataService', 'deleteTmpProductRiskSortQuery',entity,function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(errCode, errMsg);
        }
    });
}

//资产分类管理--明细分类搜索功能
function findOperInstrumentByinstrumenID(entity,callback) {
    framework.service.request('riskStromDataService', 'findOperInstrumentByinstrumenID',entity,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//资产分类管理--明细分类保存功能
function saveDetailSortData(entity,callback) {
    framework.service.request('riskStromDataService', 'saveDetailSortData',entity,function (errCode, errMsg, result) {
        if (errCode > 0) {
        	callback(errCode,errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(errCode,errMsg);
        }
    });
}

//资产分类管理--组合分类保存功能
function saveCombineSortData(entity,callback) {
    framework.service.request('riskStromDataService', 'saveCombineSortData',entity,function (errCode, errMsg, result) {
        if (errCode > 0) {
        	callback(errCode,errMsg);
        }
        if (callback !== undefined || callback != null) {
            callback(errCode,errMsg);
        }
    });
}

//资产分类管理--点击明细 按钮时（明细分类和动态分类）
function toachDetailButton(entity,callback) {
    framework.service.request('riskStromDataService', 'toachDetailButton',entity,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//资产分类管理--组合分类,下拉框数据(返回明细分类的名称，id)
function getsortName(capitalTypeID,brokerID,callback) {
    framework.service.request('riskStromDataService', 'getsortName',capitalTypeID,brokerID,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//资产分类管理--组合分类,下拉框数据(返回明细分类的名称，id)获取指定的资产类型组合（by孔令奇）
function getSortNameByCapitalID(brokerID,capitalID,callback) {
    framework.service.request('riskStromDataService', 'getSortNameByCapitalID',brokerID,capitalID,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//确认导入
function saveRealUpLoadExcelData(entity,callback) {
    framework.service.request('riskStromDataService', 'saveRealUpLoadExcelData',entity,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(errCode);
        }
    });
}

//资产分类管理--获得导入的数据
function getProductRiskDataUpLoadTmpEntity(callback) {
    framework.service.request('riskStromDataService', 'getProductRiskDataUpLoadTmpEntity',function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//资产分类管理--上传页面，点退出和X时调用该方法，清楚临时上边表中的数据
function deleteRiskDataUpLoadTmpEntity(callback) {
    framework.service.request('riskStromDataService', 'deleteRiskDataUpLoadTmpEntity',function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//资产分类管理--返回brokerID和名称
function getBrokerIDAndBrokerName(callback) {
    framework.service.request('riskStromDataService', 'getBrokerIDAndBrokerName',function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//资产分类管理--点击修改 按钮时(组合分类)
function toachDetailButtonForCombine(entity,callback) {
    framework.service.request('riskStromDataService', 'toachDetailButtonForCombine',entity,function (errCode, errMsg, result) {
    	 if (errCode > 0) {
             layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
         }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//资产分类管理--点击组合分类的明细按钮时
function toachCombineRealDetailButton(entity,callback) {
    framework.service.request('riskStromDataService', 'toachCombineRealDetailButton',entity,function (errCode, errMsg, result) {
    	 if (errCode > 0) {
             layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
         }
        if (callback !== undefined || callback != null) {
        	callback(result);
        }
    });
}
//资产分类管理--返回版本号
function getAllRiskVersionData(callback) {
    framework.service.request('riskStromDataService', 'getAllRiskVersionData',function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
//过滤
function findPermission(callback) {
    framework.service.request('globalService', 'findPermission',function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
