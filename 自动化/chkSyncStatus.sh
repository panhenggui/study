#! /bin/bash
ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`
#����������
CurrDate=`date "+%Y%m%d"`

#��һ������
TradingDate=`mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "select full_date from t_sys_calendar where '${CurrDate}' < full_date and is_trade = 1;" | head -n 1`

SyncDate=`mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "SELECT t.tradingday FROM t_sync_systemstatus t;"`

if [ ${SyncDate} != ${TradingDate} ]; then
	echo "��δ�ϳ�!"
	exit 1
else
	echo "�ϳ����."
fi
