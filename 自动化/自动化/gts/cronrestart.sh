#!/bin/bash
username=`whoami`
HOMEB=/home/$username
echo "------系统带流启动开始-------"
curdate=`date "+%Y%m%d-%H:%M:%S"`
echo "当前时间" $curdate

export PATH=$PATH:.:$HOMEB/bin
export LD_LIBRARY_PATH=/lib:/usr/lib:.
pwd 1>/dev/null 2>/dev/null
restartall
sleep 2
ret=`$HOMEB/crontab/qEvnChk.sh 1`
if [ $? == 0 ];then
	echo "[OK]System restart success"
	echo "------系统启动结束-----------"
	exit 0
else
	echo "[ERR]System restart failed"
	echo "------系统启动结束-----------"
	exit 1
fi

