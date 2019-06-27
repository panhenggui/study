#!/bin/bash
su - web <<EOF
if [ $? != 0 ];then
   echo -e "\033[31;1mEER 切换用户失败\033[0m" 
   exit 1
fi
echo "切换用户成功" 

echo "停止进程" 
/home/web/LYJF/stop_impl.sh
/home/web/LYJF/stop_rest.sh
sleep 1

echo "检查进程是否停止" 
/home/web/crontab/chk_proc.sh 2 
if [ $? != 0 ];then
   echo  "ERR 进程停止失败" 
   exit 1
fi
echo "进程已停止" 
exit
EOF
