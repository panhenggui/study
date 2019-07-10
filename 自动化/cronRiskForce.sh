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

#上期所品种强平时间修改

# SHFE/au
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${NextTradingDate}' where forced_liquidation_time = '14:55';"
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${CurrDate}' where forced_liquidation_time = '23:20';"
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${NextDate}' where forced_liquidation_time = '02:20';"
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${NextDate}' where forced_liquidation_time = '00:50';"
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${CurrDate}' where forced_liquidation_time = '22:50';"

echo "多赢策略  强平时间修改完毕!"
exit 0
