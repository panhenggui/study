#!/bin/bash
tar -xvf $1
if [ $? -eq 0 ];then
   echo -e "\033[32;1msuccess\033[0m"
else
   echo -e "\033[31;1mfalse\033[0m"
   exit
fi
  
for i in $(ls /home/quantdo/dbbackup/*.sql)
do
    sed -i '/Table structure for table `t_his_adviceorder`/,/Table structure for table `t_import_futures_hold`/d' $i
    sed -i '/-- Host: 127.0.0.1    Database: sso/a\use sso;' $i
    sed -i '/-- Host: 127.0.0.1    Database: qdam/a\use qdam;' $i
done  
#a=$1
#a=${a%.*.*}

#sed -i '/Table structure for table `t_his_adviceorder`/,/Table structure for table `t_import_futures_hold`/d' $a

mysql -uroot  <<EOF
source $i
EOF
if [ $? -eq 0 ];then
   echo -e "\033[32;1minsert data success\033[0m"
else
   echo -e "\033[31;1minsert data false\033[0m"
fi  

