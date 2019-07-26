#!/bin/bash

hostname="127.0.0.1"
port="3306"
dbname="qdam"
username="qdam"
password="qdam"


##########读取check结果##########
read result < <(mysql -h ${hostname} -P ${port} -u${username} -p${password} ${dbname} -e "
select count(1) from t_risk_storm_status where type='2'; " --skip-column-names)

if [ $result -eq 0 ] 
then
	echo "Error: There are no record, please check riskStorm status!"
fi

##########输出状态列表##########
command="mysql -h ${hostname} -P ${port} -u${username} -p${password} ${dbname}"
while read a b
do
echo "${a}  ${b}  ${c}" 
done< <(echo "SELECT kindname,updatetime,remark FROM t_risk_storm_status where type='2';" | ${command})