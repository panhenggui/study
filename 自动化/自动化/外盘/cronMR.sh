#!/bin/bash
echo "------修改数据库权限-------"
curdate=`date "+%Y%m%d-%H:%M:%S"`
echo "当前时间" $curdate

ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`
countall=0

mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "UPDATE t_sync_investortradingright SET tradingright = 0 WHERE exchangeid <> 'default';"
if [ $? -ne 0 ]:then
    echo "修改数据库权限  [faled]"
    exit 1
echo "修改数据库权限成功 OK]" 

