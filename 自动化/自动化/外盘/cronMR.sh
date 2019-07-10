#!/bin/bash
echo "------�޸����ݿ�Ȩ��-------"
curdate=`date "+%Y%m%d-%H:%M:%S"`
echo "��ǰʱ��" $curdate

ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`
countall=0

mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "UPDATE t_sync_investortradingright SET tradingright = 0 WHERE exchangeid <> 'default';"
if [ $? -ne 0 ]:then
    echo "�޸����ݿ�Ȩ��  [faled]"
    exit 1
echo "�޸����ݿ�Ȩ�޳ɹ� �[OK]" 

