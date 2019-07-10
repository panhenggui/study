#! /bin/bash
ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`
#����������
CurrDate=`date "+%Y%m%d"`

#��һ������
SyncDate=`mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "SELECT t.tradingday FROM t_sync_systemstatus t;"`
if [[ ${SyncDate} != ${CurrDate} ]]; then
	echo "��δ�ϳ�!"
	exit 1
else
	echo "�ϳ����."
fi
