#!/bin/bash
echo "------������ˮ��ʼ-------"
if [ ! -d $HOME/qdambackup ];then
    mkdir -p $HOME/qdambackup
fi
curdate=`date "+%Y%m%d-%H%M%S"`
echo "��ǰʱ��" $curdate
File="backup-"$curdate""
Deltime=`date -d "30 day ago" +%Y%m%d-%H%M%S`
DelFile="backup-"$Deltime""
#echo $File
cd $HOME
tar -czf $File.tar.gz ./qtrade/flow/* ./qtrade/dump/* ./qtrade/bin/Syslog.log ./qsdb/bin/Syslog.log
if [ -s ${File}.tar.gz ];then
    mv ${File}.tar.gz $HOME/qdambackup
	rm -rf $HOME/qdambackup/$DelFile.tar.gz
    echo "[OK] ������ˮ�ɹ�"
	echo "------������ˮ����-------"
    exit 0;
else
    echo "[ERR] ������ˮʧ��"
    echo "------������ˮ����-------"
    exit 1;
fi
