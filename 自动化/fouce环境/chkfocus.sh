#!/bin/bash
for i in focustrade focusprice java
do
   show all|grep $i &>/dev/null
   if [ $? -ne 0 ];then
      echo -e "\033[31;1m$i��������ʧ��\033[0m"
   fi
done
for i in ���ӳɹ� ��ѯ�������ݽ���
do
   cat focus/focustrade/log/Syslog.log|grep $i &>/dev/null
   if [ $? -ne 0 ];then
      echo -e "\033[31;1m���Ҳ����ؼ���$i\033[0m"
   fi
done
for i in InitFinish "UserLogin Success"
do
   cat focus/focusprice/log/Syslog.log|grep "$i" &>/dev/null
   if [ $? -ne 0 ];then
      echo -e "\033[31;1m���Ҳ����ؼ���$i\033[0m"
   fi
done 
