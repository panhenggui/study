#!/bin/bash
export LD_LIBRARY_PATH=.
export PATH=$PATH:/home/web/crontab:/home/web

cmdpath=$HOME/crontab
logfile=$HOME/crontab/autoRun-dayclose.Log

>$logfile
echo "检查是否停止" | tee -a $logfile
$cmdpath/suwebstop.sh &>>$logfile
if [ $? != 0 ];then
   echo -e  "\033[31;1m EER 进程停止失败\033[0m"  | tee -a $logfile
   exit
fi
echo -e  "\033[32;1mOK 进程停止成功\033[0m" | tee -a $logfile
sleep 1

echo "检查复制、删除文件是否成功"  | tee -a $logfile
$cmdpath/cpfile.sh &>>$logfile
if [ $? != 0 ];then
   echo -e  "\033[31;1mERR 复制、删除文件失败\033[0m"  | tee -a $logfile
   exit
fi
echo -e  "\033[32;1mOK复制、删除文件成功\033[0m" | tee -a $logfile
sleep 1

#echo "检查是否启动" | tee -a $logfile
#$cmdpath/suwebstart.sh &>>$logfile
#if [ $? != 0 ];then
#   echo  -e  "\033[31;1m EER进程启动失败 \033[0m"  | tee -a $logfile
#   exit
#fi
#echo -e  "\033[32;1mOK进程启动成功\033[0m" | tee -a $logfile
