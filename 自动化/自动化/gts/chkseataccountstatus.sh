#!/bin/bash
ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`
echo "席位状态查询："
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "SELECT t.brokerid, t.seatid,
CASE WHEN t.seatstatus = '1' THEN 'success'
     WHEN t.seatstatus <> '1' THEN 'failed'
END AS 'login_status' FROM t_oper_seat t;"
echo "资金账号信息查询："
echo "brokerid accountid    available  balance"
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "SELECT i.brokerid brokerid,i.accountid accountid,
i.available available,i.balance balance  FROM t_oper_investoraccount i ,t_capital_account t  WHERE i.accountid=t.account_id AND t.is_active='1';"
