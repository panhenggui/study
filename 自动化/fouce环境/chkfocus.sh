#!/bin/bash
for i in focustrade focusprice java
do
   show all|grep $i &>/dev/null
   if [ $? -ne 0 ];then
      echo -e "\033[31;1m$i进程启动失败\033[0m"
   fi
done
for i in 连接成功 查询基础数据结束
do
   cat focus/focustrade/log/Syslog.log|grep $i &>/dev/null
   if [ $? -ne 0 ];then
      echo -e "\033[31;1m查找不到关键字$i\033[0m"
   fi
done
for i in InitFinish "UserLogin Success"
do
   cat focus/focusprice/log/Syslog.log|grep "$i" &>/dev/null
   if [ $? -ne 0 ];then
      echo -e "\033[31;1m查找不到关键字$i\033[0m"
   fi
done 
