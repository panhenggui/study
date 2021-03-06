#!/bin/bash
ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`
#服务器日期
CurrDate=`date "+%Y%m%d"`
#下一自然日
NextDate=`date -d"tomorrow" "+%Y%m%d"`
#下一交易日
NextTradingDate=`mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "select full_date from t_sys_calendar where '${CurrDate}' < full_date and is_trade = 1;" | head -n 1`

echo "当前交易日是"$CurrDate
echo "下一自然日是"$NextDate
echo "下一交易日是"$NextTradingDate

#品种强平时间修改

mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${NextTradingDate}' where forced_liquidation_time = '14:55';"
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${CurrDate}' where forced_liquidation_time = '23:25';"
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${NextDate}' where forced_liquidation_time = '02:25';"
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${NextDate}' where forced_liquidation_time = '00:55';"
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${CurrDate}' where forced_liquidation_time = '22:55';"

echo -e "\033[32;1m信富测试-强平时间修改完毕!\033[0m"
exit 0
