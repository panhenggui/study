#!/bin/bash
echo "------�޸����ݿ�settlementprice-------"
curdate=`date "+%Y%m%d-%H:%M:%S"`
echo "��ǰʱ��" $curdate

ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`
countall=0

mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "UPDATE t_oper_marketdata SET settlementprice = lastprice WHERE settlementprice IS NULL AND lastprice <> '0' AND lastprice IS NOT NULL;"
if [ $? -ne 0 ]:then
    echo "�޸����ݿ�settlementprice  [faled]"
    exit 1
echo "�޸����ݿ�settlementprice [OK]" 

