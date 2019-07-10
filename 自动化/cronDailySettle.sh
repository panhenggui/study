#!/bin/bash
ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`
#����������
CurrDate=`date "+%Y%m%d"`
#��һ������
TradingDate=`mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "select full_date from t_sys_calendar where '${CurrDate}' < full_date and is_trade = 1;" | head -n 1`

echo "��һ��������"$TradingDate

ret=`curl http://${DatabaseHost}:8080/quantdo/restfulservice/dailySettleService/dailySettleAutoHaveDate?settleDate=${CurrDate}\&nextSettleDate=${TradingDate}` 1>/dev/null 2>/dev/null
if [ -z $ret ];then
    echo "[ERR] ���ս���ʧ�ܣ������̨����"
    exit 1
else
    ret=`echo $ret | awk -F "," '{print $2}' | awk -F ":" '{print $2}'` 
    if [ $ret == 0 ];then
        echo "[OK] ���ս���ɹ�"
    else
        echo "[ERR] ���ս���ʧ�ܣ������̨����"
        exit 1
    fi
fi
exit 0
