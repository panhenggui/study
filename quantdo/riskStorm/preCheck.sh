#!/bin/bash

hostname="127.0.0.1"
port="3306"
dbname="qdam"
username="qdam"
password="qdam"
checkSqlPath="/home/risk/riskStorm/preCheck.sql"

##########生成check数据##########
mysql -h ${hostname} -P ${port} -u${username} -p${password} ${dbname} <${checkSqlPath}


##########读取check结果##########
read result < <(mysql -h ${hostname} -P ${port} -u${username} -p${password} ${dbname} -e "
select count(1) from t_risk_storm_status where type='1'; " --skip-column-names)

if [ $result -eq 0 ] 
then
	echo "Success: All Data is ready successfully!"
elif [ $result -gt 0 ] 
then
	echo "Error: There are "$result" error record do not have ready."
else
	echo "Error: Unkonwn error"
fi

##########输出错误列表##########
command="mysql -h ${hostname} -P ${port} -u${username} -p${password} ${dbname}"
while read a b
do
echo "${a}  ${b}  ${c}" 
done< <(echo "SELECT kindname,remark,updatetime FROM t_risk_storm_status where type='1';" | ${command})