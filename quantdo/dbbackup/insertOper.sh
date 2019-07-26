#!/bin/bash
tar -xvf $1
if [ $? -eq 0 ];then
   echo -e "\033[32;1msuccess\033[0m"
else
   echo -e "\033[31;1mfalse\033[0m"
   exit
fi
for i in $(ls *.sql)
do
   echo "use $2;" > input.sql
   grep -iE "INSERT INTO \`t_oper" $i >> input.sql
done
#cd /tmp
#touch /tmp/input.sql
#echo "" > /tmp/input.sql

#grep -iE "INSERT INTO \`t_oper" clearing.sql > input.sql
#grep -iE "INSERT INTO \`t_oper" clearing.sql | tee input.sql

#grep -i 'INSERT INTO `t_order_fee`' clearing.sql >> input.sql
#grep -i 'INSERT INTO `t_order_fee_actual`' clearing.sql >> input.sql
#grep -i 'INSERT INTO `t_order_fee_repeat_actual`' clearing.sql >> input.sql

cmd="select CONCAT('truncate TABLE ',table_schema,'.',TABLE_NAME, ';') from INFORMATION_SCHEMA.TABLES where table_schema in ('$2') and TABLE_NAME LIKE 't_oper%'"  
cnt=$(mysql -uroot -p123456 -s -e "${cmd}")  
echo "Current count is : ${cnt}"

echo "truncate the table"
mysql -uroot -p123456 <<EOF
use $2
${cnt}
EOF

echo "insert the data"
mysql -uroot -p123456 <<EOF
use $2
source input.sql
EOF



