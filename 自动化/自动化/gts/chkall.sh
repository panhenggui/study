#!/bin/bash
ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`
countall=0

mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "show tables from ${DatabaseName} where tables_in_${DatabaseName} like 't_oper\_%' or tables_in_${DatabaseName} like 't_s\_%';" > db.sql

echo "��"`cat db.sql | wc -l`"�ű�"

while read table 
do
    eachcount=`mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "select count(*) from $table;"`
    printf "%-40s$eachcount\n" $table
    countall=`expr $countall + $eachcount`
done < db.sql
echo "countall: "$countall

if [ $countall == 0 ];then
	echo "[OK] ���±�����ɹ�"
	exit 0
else
	echo "[ERR] ���±�����ʧ��"
	exit 1
fi

