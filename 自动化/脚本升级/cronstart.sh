#!/bin/bash
echo "------ϵͳ������ʼ-------"
curdate=`date "+%Y%m%d-%H:%M:%S"`
echo "��ǰʱ��" $curdate

export PATH=$PATH:.:$HOME/bin
export LD_LIBRARY_PATH=/lib:/usr/lib:.
pwd 1>/dev/null 2>/dev/null
startall
sleep 2
ret=`$HOME/crontab/qEvnChk.sh 1`
if [ $? == 0 ];then
	echo "[OK]System restart success"
	echo "------ϵͳ��������-----------"
	exit 0
else
	echo "[ERR]System restart failed"
	echo "------ϵͳ��������-----------"
	exit 1
fi
