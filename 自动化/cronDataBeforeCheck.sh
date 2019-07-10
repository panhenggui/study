#!/bin/bash
echo "------�����ϳ�У�鿪ʼ-------"
curdate=`date "+%Y%m%d-%H:%M:%S"`
echo "��ǰʱ��" $curdate

ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`

ret=`curl http://${DatabaseHost}:8080/quantdo/restfulservice/dataToTradeService/anonymousCheckDataToTrade` 1>/dev/null 2>/dev/null
#ret=`curl -k https://${DatabaseHost}/quantdo/restfulservice/busAuditService/anonymousAuditAfterToTrade` 1>/dev/null 2>/dev/null
if [ -z $ret ];then
    echo "[ERR] ����У��ʧ�ܣ������̨����"
	echo "------�����ϳ�У�����-------"
    exit 1
else
    sFalse=`echo $ret | grep false` 
    if [ -z $sFalse ];then
        echo "[OK] ����У��ɹ�"
		echo "------�����ϳ�У�����-------"
		exit 0
    else
        echo "============================================================="
        echo "У������"$ret
        echo "============================================================="
        echo "[ERR] ����У��ʧ�ܣ������̨����"
		echo "------�����ϳ�У�����-------"
        exit 1
    fi
fi

