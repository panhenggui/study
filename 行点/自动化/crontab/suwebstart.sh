#!/bin/bash
su - web <<EOF
if [ $? != 0 ];then
   echo -e "\033[31;1mEER 切换用户失败\033[0m" 
   exit 1
fi
echo "切换用户成功" 

echo "停止进程" 
#/home/web/LYJF/start_impl.sh
#/home/web/LYJF/start_rest.sh
sleep 1

echo "检查进程是否启动" 
/home/web/crontab/chk_proc.sh 1 
if [ $? != 0 ];then
   echo  "ERR 进程启动失败" 
   exit 1
fi
echo "进程已启动" 
exit
EOF
