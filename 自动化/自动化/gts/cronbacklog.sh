#!/bin/bash
username=`whoami`
HOMEB=/home/$username
echo "------备份流水开始-------"
if [ ! -d $HOMEB/qdambackup ];then
    mkdir -p $HOMEB/qdambackup
fi
curdate=`date "+%Y%m%d-%H%M%S"`
echo "当前时间" $curdate
File="backup-"$curdate""
Deltime=`date -d "30 day ago" +%Y%m%d-%H%M%S`
DelFile="backup-"$Deltime""
#echo $File
cd $HOMEB
tar -czf $File.tar.gz ./qtrade/flow/* ./qtrade/dump/* ./qtrade/bin/Syslog.log ./qdata/bin/Syslog.log ./qdata/flow/* ./qmdb/bin/Syslog.log ./qmdb/flow/* ./qquery/bin/Syslog.log ./qsdb/bin/Syslog.log ./qsdb/flow/*
if [ -s ${File}.tar.gz ];then
    mv ${File}.tar.gz $HOMEB/qdambackup
	rm -rf $HOMEB/qdambackup/$DelFile.tar.gz
    echo "[OK] 备份流水成功"
	echo "------备份流水结束-------"
    exit 0;
else
    echo "[ERR] 备份流水失败"
    echo "------备份流水结束-------"
    exit 1;
fi
