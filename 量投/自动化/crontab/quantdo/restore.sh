#!/bin/bash
urldate=`date +%Y%m%d`
path=/home/qdam
rm -rf $path/run $path/tools
mv $path/run.$urldate $path/run
if [ $? != 0 ];then
    echo -e "\033[31;1m[Failed] run还原失败！！！\033[0m" 
    exit 1
fi
echo -e "\033[32;1m[OK] run还原传输成功。\033[0m"
mv $path/tools.$urldate $path/tools
if [ $? != 0 ];then
    echo -e "\033[31;1m[Failed] tools还原传输失败！！！\033[0m" 
    exit 1
fi
echo -e "\033[32;1m[OK] tools还原成功。\033[0m"
