#!/bin/bash
echo "------清理场下库开始-------"
curdate=`date "+%Y%m%d-%H:%M:%S"`
echo "当前时间" $curdate

ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`
countall=0

mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "show tables from ${DatabaseName} where tables_in_${DatabaseName} like 't_oper\_%' or tables_in_${DatabaseName} like 't_s\_%';" >db.sql
echo "共`cat db.sql | wc -l`张表"
while read table 
do
    mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "truncate $table;"
    eachcount=`mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "select count(*) from $table;"`
    printf "%-40s$eachcount\n" $table
    countall=`expr $countall + $eachcount`
done < db.sql
echo "countall: "$countall
if [ $countall == 0 ];then
	echo "[OK] 场下表清理成功"
	echo "------清理场下库结束-------"
	exit 0
else
	echo "[ERR] 场下表清理失败"
	echo "------清理场下库结束-------"
	exit 1
fi

