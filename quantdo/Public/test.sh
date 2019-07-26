#!/bin/bash
sh ./1.sh
if [ $? -eq 0 ];then
   echo -e "\033[32;1m[OK]\033[0m"
else
   echo -e "\033[31;1m[ERR]\033[0m" 
fi
sh /home/quantdo/Public/2.sh
if [ $? -eq 0 ];then
   echo -e "\033[32;1m[OK]\033[0m"
else
   echo -e "\033[31;1m[ERR]\033[0m" 
fi
sh ../3.sh
if [ $? -eq 0 ];then
   echo -e "\033[32;1m[OK]\033[0m"
else
   echo -e "\033[31;1m[ERR]\033[0m" 
fi
