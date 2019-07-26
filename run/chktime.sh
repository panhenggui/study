#chktime: 检查当前时间是否允许启动程序
#	  检查的方式是直接判定当前时间
#	  是否为07:40:00 到08:10:00,如果
#	  启动时间不在此范围之内，则要求
#	  确认输入。

curtime_org=`date | awk '{print $5}'`
curtime=`echo $curtime_org|awk -F: '{print $1$2$3}'`
timeok=0
if [ $curtime -ge 070000 ]
then
	if [ $curtime -le 080000 ]
	then
		timeok=1
	fi
fi
echo $timeok $curtime_org
