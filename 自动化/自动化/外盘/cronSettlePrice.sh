#!/bin/bash
echo "------��ȡ����ۿ�ʼ-------"
curdate=`date "+%Y%m%d-%H%M%S"`
echo "��ǰʱ��" $curdate
ListDB=$HOME/list/list.db
DatabaseHost=`cat $ListDB | awk '{print $2}'`

ret=`curl http://${DatabaseHost}:8080/quantdo/restfulservice/settlePriceService/setCurrSettlePriceAuto?settlePriceFlag=false` 1>/dev/null 2>/dev/null

if [ -z $ret ];then
    echo "[ERR] ��ȡ�����ʧ�ܣ������̨����"
	echo "------��ȡ����۽���-------"
    exit 1
else
    sFalse=`echo $ret | grep false` 
    if [ -z $sFalse ];then
        echo "[OK] ��ȡ����۳ɹ�"
    else
        echo "============================================================="
        echo "��ȡ����۽����"$ret
        echo "============================================================="
        echo "[ERR] ��ȡ�����ʧ�ܣ������̨����"
		echo "------��ȡ����۽���-------"
        exit 1
    fi
fi
	echo "------��ȡ����۽���-------"
exit 0

