#!/bin/bash
ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`
#����������
CurrDate=`date "+%Y%m%d"`
#��һ��Ȼ��
NextDate=`date -d"tomorrow" "+%Y%m%d"`
#��һ������
NextTradingDate=`mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "select full_date from t_sys_calendar where '${CurrDate}' < full_date and is_trade = 1;" | head -n 1`

echo "��ǰ��������"$CurrDate
echo "��һ��Ȼ����"$NextDate
echo "��һ��������"$NextTradingDate

#������Ʒ��ǿƽʱ���޸�

# SHFE/au
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${NextTradingDate}' where forced_liquidation_time = '14:55';"
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${CurrDate}' where forced_liquidation_time = '23:20';"
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${NextDate}' where forced_liquidation_time = '02:20';"
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${NextDate}' where forced_liquidation_time = '00:50';"
mysql -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} -D${DatabaseName} -Nse "update t_product_risk_rule_force set forced_liquidation_date = '${CurrDate}' where forced_liquidation_time = '22:50';"

echo "��Ӯ����  ǿƽʱ���޸����!"
exit 0
