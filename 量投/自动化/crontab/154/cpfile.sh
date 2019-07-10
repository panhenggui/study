#!/bin/bash
#export LD_LIBRARY_PATH=.
#export PATH=$PATH:/home/web/crontab:/home/web

curdate2=`date +%Y%m%d`
cmdpath=$HOME/crontab
logfile=$HOME/crontab/autoRun-dayclose.Log
jettypath=/home/web/jetty-distribution-9.2.14.v20151106/webapps
htmlpath=/usr/local/nginx/html
libpath=/home/web/LYJF/lib
ipaddr=192.168.12.152:/root/upgrade
curdate=`date +%Y%m%d%H%M%s`

>>$logfile
#备份html文件
echo "备份html文件是否成功" | tee -a $logfile
cp -rf $htmlpath $htmlpath.$curdate/
if [ $? == 0 ];then
   echo -e "\033[32;1mhtml复制完成\033[0m"
else
   echo -e "\033[31;1mERR html复制失败\033[0m"
   exit 1
fi

#传输build文件
echo "删除build文件是否成功" | tee -a $logfile
shopt -s extglob
cd $htmlpath/build && rm -rf !(qrCode_url.js)
if [ $? == 0 ];then
   echo -e "\033[32;1mbuild删除完成\033[0m"
else
   echo -e "\033[31;1mERR build删除失败\033[0m"
   exit 1
fi
cd
echo "远程传输build文件是否成功" | tee -a $logfile
scp -r root@$ipaddr/build.$curdate2/* $htmlpath/build/ | tee -a $logfile
if [ $? != 0 ];then
   echo -e "\033[31;1m ERR build文件传输失败\033[0m" | tee -a $logfile
   exit 1
fi
echo -e "\033[32;1mbuild文件传输完成\033[0m" | tee -a $logfile

##传输app文件
#echo "删除app文件是否成功" | tee -a $logfile
#cd $htmlpath/app && rm -rf !(baseurl.js)
#if [ $? == 0 ];then
#   echo -e "\033[32;1mapp删除完成\033[0m"
#else
#   echo -e "\033[31;1mERR app删除失败\033[0m"
#   exit 1
#fi
#cd
#echo "远程传输app文件是否成功" | tee -a $logfile
#scp -r root@$ipaddr/app.$curdate2/* $htmlpath/app | tee -a $logfile
#if [ $? != 0 ];then
#   echo -e "\033[31;1m ERR app文件传输失败\033[0m" | tee -a $logfile
#   exit 1
#fi
#echo -e "\033[32;1mapp文件传输完成\033[0m" | tee -a $logfile
#
##传输app1文件
#echo "删除app1文件是否成功" | tee -a $logfile
#cd $htmlpath/app1 && rm -rf !(baseurl.js)
#if [ $? == 0 ];then
#   echo -e "\033[32;1mapp1删除完成\033[0m"
#else
#   echo -e "\033[31;1mERR app1删除失败\033[0m"
#   exit 1
#fi
#cd
#
#echo "远程传输app1文件是否成功" | tee -a $logfile
#scp -r root@$ipaddr/app1.$curdate2/* $htmlpath/app1 | tee -a $logfile
#if [ $? != 0 ];then
#   echo -e "\033[31;1m ERR app1文件传输失败\033[0m" | tee -a $logfile
#   exit 1
#fi
#echo -e "\033[32;1mapp1文件传输完成\033[0m" | tee -a $logfile

#备份lib文件
echo "备份lib文件是否成功"  | tee -a $logfile
cp -rf $libpath $libpath.$curdate
if [ $? == 0 ];then
   echo -e "\033[32;1mlib复制完成\033[0m"
else
   echo -e "\033[31;1mERR lib复制失败\033[0m"
   exit 1
fi

#传输lib文件
echo "删除lib文件是否成功" | tee -a $logfile
rm -rf $libpath/*
if [ $? == 0 ];then
   echo -e "\033[32;1mlib删除完成\033[0m"
else
   echo -e "\033[31;1mERR lib删除失败\033[0m"
   exit 1
fi

echo "lib 文件传输是否成" | tee -a $logfile
scp root@$ipaddr/lib.$curdate2/* $libpath | tee -a $logfile
if [ $? != 0 ];then
   echo -e "\033[31;1mERR lid文件传输失败\033[0m" | tee -a $logfile
   exit 1
fi
echo -e "\033[32;1mlib 文件传输完成\033[0m" | tee -a $logfile

echo "lib 文件修改权限是否成功" | tee -a $logfile

#修改权限
chown web:web $libpath/*
if [ $? != 0 ];then
   echo -e "\033[31;1mERR lid文件修改权限失败\033[0m" | tee -a $logfile
   exit 1
fi
echo -e "\033[32;1mlib 文件修改权限完成\033[0m" | tee -a $logfile

#chown web:web -R $htmlpath/*
#if [ $? != 0 ];then
#   echo -e "\033[31;1mERR html文件修改权限失败\033[0m" | tee -a $logfile
#   exit 1
#fi
#echo -e "\033[32;1mhtml 文件修改权限完成\033[0m" | tee -a $logfile

date +%Y%m%d%H%M%S | tee -a $logfile
