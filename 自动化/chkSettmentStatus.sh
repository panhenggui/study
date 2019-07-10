#! /bin/bash
ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`

#服务器日期
CurrDate=`date "+%Y%m%d"`
#上一交易日
TradingDate=`mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "select full_date from t_sys_calendar where '${CurrDate}' > full_date and is_trade = 1;" | tail -n 1`

echo "上一交易日是"$TradingDate

#SETTLE_STATUS=`mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "SELECT t.settle_status FROM t_settle_status t WHERE t.settle_date=(SELECT tradingday FROM t_sync_systemstatus LIMIT 1) ORDER BY t.settle_status DESC LIMIT 1"`

SETTLE_STATUS=`mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "SELECT t.settle_status FROM t_settle_status t WHERE t.settle_date=(SELECT full_date FROM t_sys_calendar WHERE '${CurrDate}' > full_date AND is_trade = 1 ORDER BY full_date DESC LIMIT 1) ORDER BY t.settle_status DESC LIMIT 1"`

if [[ ${SETTLE_STATUS} != '3' ]]; then
	echo "Please wait for settlement."
	exit 1
else
	echo "All settled."
fi
