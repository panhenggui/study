#chktime: ��鵱ǰʱ���Ƿ�������������
#	  ���ķ�ʽ��ֱ���ж���ǰʱ��
#	  �Ƿ�Ϊ07:40:00 ��08:10:00,���
#	  ����ʱ�䲻�ڴ˷�Χ֮�ڣ���Ҫ��
#	  ȷ�����롣

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
