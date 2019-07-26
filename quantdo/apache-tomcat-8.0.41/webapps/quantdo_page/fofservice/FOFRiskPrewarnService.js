/**
 *产品组信息 
 */
function getAllproductGroup(callback){
	framework.service.request('fOFRiskPreWarnService', 'findAllProductGroup', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getProductGroupByCondition(callback,productgroupEntitys){
	framework.service.request('fOFRiskPreWarnService', 'findProductGroupByCondition', productgroupEntitys, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

/**
 * 根据产品组的查找产品
 */
function getAllproduct(callback,productgroupEntitys){
	framework.service.request('fOFRiskPreWarnService', 'findproduct', productgroupEntitys,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
/*
 * 根据产品组查找资金
 * 
 */
function getAllcapital(callback,productgroupEntitys){
	framework.service.request('fOFRiskPreWarnService', 'findcapital', productgroupEntitys,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

/*
 * 根据产品组查持仓
 */
function getAllposition(callback,productgroupEntitys){
	framework.service.request('fOFRiskPreWarnService', 'findoperclientposition', productgroupEntitys,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
/*
 * 根据产品组查委托
 */
function getAlloperOrder(callback,productgroupEntitys){
	framework.service.request('fOFRiskPreWarnService', 'findoperorder', productgroupEntitys,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
/*
 * 根据产品组查成交
 */
function getAlloperTrade(callback,productgroupEntitys){
	framework.service.request('fOFRiskPreWarnService', 'findopertrade', productgroupEntitys,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
/*
 * 根据产品组查找净值
 */
function getAllNetWorth(callback,productgroupEntitys){
	framework.service.request('fOFRiskPreWarnService', 'findgroupNetworth', productgroupEntitys,function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
