#!/bin/bash
ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`

#下一交易日
TradingDate=`mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "select tradingday from t_sync_systemstatus;"`

echo "结算日是"$TradingDate

ret=`curl -d "" http://${DatabaseHost}:8080/QDAllocationFund/service/portalControllerService/CommissionSettleAuto` 1>/dev/null 2>/dev/null
echo $ret
if [ -z $ret ];then
    echo "[ERR] 日终结算失败，请检查后台数据"
    exit 1
else
    ret=`echo $ret | awk -F "," '{print $2}' | awk -F ":" '{print $2}'` 
    if [ $ret == 0 ];then
        echo "[OK] 返佣结算成功"
    else
        echo "[ERR] 返佣结算失败，请检查后台数据"
        exit 1
    fi
fi
exit 0
