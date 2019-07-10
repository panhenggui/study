#!/bin/bash
ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`

ret=`curl http://${DatabaseHost}:8080/quantdo/restfulservice/settlePriceService/setCurrSettlePriceAuto?settlePriceFlag=false` 1>/dev/null 2>/dev/null

if [ -z $ret ];then
    echo "[ERR] 获取结算价失败，请检查后台数据"
    exit 1
else
    sFalse=`echo $ret | grep false` 
    if [ -z $sFalse ];then
        echo "[OK] 获取结算价成功"
    else
        echo "============================================================="
        echo "获取结算价结果："$ret
        echo "============================================================="
        echo "[ERR] 获取结算价失败，请检查后台数据"
        exit 1
    fi
fi
exit 0

