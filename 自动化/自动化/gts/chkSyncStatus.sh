#! /bin/bash
ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`
#服务器日期
CurrDate=`date "+%Y%m%d"`

#下一交易日
SyncDate=`mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "SELECT t.tradingday FROM t_sync_systemstatus t;"`
if [[ ${SyncDate} != ${CurrDate} ]]; then
	echo "还未上场!"
	exit 1
else
	echo "上场完毕."
fi
