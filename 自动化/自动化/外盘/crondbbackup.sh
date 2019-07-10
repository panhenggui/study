#!/bin/bash
echo "------备份数据开始-------"
curdate=`date "+%Y%m%d-%H:%M:%S"`
echo "当前时间" $curdate

ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`
DatabaseUser=`cat $ListDB | awk '{print $3}'`
DatabasePwd=`cat $ListDB | awk '{print $4}'`
DatabaseName=`cat $ListDB | awk '{print $5}'`
DataSsoUser="sso"
DataSsoPwd="sso"
DataSsoName="sso"
DataQdallocationssoUser="qdallocationsso"
DataQdallocationssoPwd="qdallocationsso"
DataQdallocationssoName="qdallocationsso"
DataQdallocationUser="qdallocation"
DataQdallocationPwd="qdallocation"
DataQdallocationName="qdallocation"
backup_dir="$HOME/dbbackup"

if [ ! -d $backup_dir ];then
    mkdir -p $backup_dir
fi
cd $backup_dir
Now=$(date +"%Y-%m-%d--%H%M%S")
File1="backup-gts"$Now".sql"
File2="backup-sso"$Now".sql"
File3="backup-qda"$Now".sql"
File4="backup-qdasso"$Now".sql"

echo "备份路径: $backup_dir/$File.tar.gz"
mysqldump -h${DatabaseHost} -u${DatabaseUser} -p${DatabasePwd} ${DatabaseName} > $File1
mysqldump -h${DatabaseHost} -u${DataSsoUser} -p${DataSsoPwd} ${DataSsoName} > $File2
mysqldump -h${DatabaseHost} -u${DataQdallocationUser} -p${DataQdallocationPwd} ${DataQdallocationName} > $File3
mysqldump -h${DatabaseHost} -u${DataQdallocationssoUser} -p${DataQdallocationssoPwd} ${DataQdallocationssoName} > $File4
if [ $? != 0 ];then
    echo "[ERR] 数据备份失败"
	echo "------备份数据结束-------"
    exit 1
else 
    echo "[OK] 数据备份成功"
	tar -czvf $Now.tar.gz $File1 $File2 $File3 $File4
	rm -rf $File1 $File2 $File3 $File4
	echo "------备份数据结束-------"
	exit 0
fi

