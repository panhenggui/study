#!/bin/bash
hostname="127.0.0.1"
port="3306"
dbname="qdam"
username="qdam"
password="qdam"
ssodbname="sso"
ssousername="sso"
ssopassword="sso"
backup_dir="$HOME/dbbackup"
if [ ! -d $backup_dir ];then
    mkdir -p $backup_dir
fi
cd $backup_dir
echo "Begin: Database $dbname backup"
Now=$(date +"%Y-%m-%d--%H%M%S")
echo $Now
File="backup-"$Now".sql"
mysqldump -h${hostname} -u${ssousername} -p${ssopassword} ${ssodbname} > $File
mysqldump -h${hostname} -u${username} -p${password} ${dbname} >> $File
if [ $? != 0 ];then
    echo "[ERR] Database ${dbname} backup failed"
    exit 1
 else
echo "End: Database ${dbname} backup success"
   tar -czvf $File.tar.gz $File
   rm -rf $File
   exit 0
fi

