#!/bin/bash
echo "------ϵͳֹͣ��ʼ-------"
curdate=`date "+%Y%m%d-%H:%M:%S"`
echo "��ǰʱ��" $curdate

export PATH=$PATH:.:$HOME/bin
export LD_LIBRARY_PATH=/lib:/usr/lib:.
pwd 1>/dev/null 2>/dev/null
stopall
sleep 2
ret=`$HOME/crontab/qEvnChk.sh 2`
if [ $? == 0 ];then
	echo "[OK]System stop success"
	echo "------ϵͳֹͣ����-------"
	exit 0
else
	echo "[ERR]System stop failed"
	echo "------ϵͳֹͣ����-------"
	exit 1
fi


