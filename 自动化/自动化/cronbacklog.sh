#!/bin/bash
echo "------备份流水开始-------"
if [ ! -d $HOME/qdambackup ];then
    mkdir -p $HOME/qdambackup
fi
curdate=`date "+%Y%m%d-%H%M%S"`
echo "当前时间" $curdate
File="backup-"$curdate""
Deltime=`date -d "30 day ago" +%Y%m%d-%H%M%S`
DelFile="backup-"$Deltime""
#echo $File
cd $HOME
tar -czf $File.tar.gz ./qtrade/flow/* ./qtrade/dump/* ./qtrade/bin/Syslog.log ./qsdb/bin/Syslog.log
if [ -s ${File}.tar.gz ];then
    mv ${File}.tar.gz $HOME/qdambackup
	rm -rf $HOME/qdambackup/$DelFile.tar.gz
    echo "[OK] 备份流水成功"
	echo "------备份流水结束-------"
    exit 0;
else
    echo "[ERR] 备份流水失败"
    echo "------备份流水结束-------"
    exit 1;
fi
