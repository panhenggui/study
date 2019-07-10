#!/bin/bash
username=`whoami`
HOMEB=/home/$username
export LD_LIBRARY_PATH=.
export PATH=$PATH:$HOMEB/crontab:$HOMEB:$HOMEB/bin

CmdPath=$HOMEB/crontab
logFile=$HOMEB/crontab/autoRun-dayopen1.Log
errFile=$HOMEB/crontab/error-dayopen1.Log
main()
{
    >$logFile
    >$errFile
    date "+%F-%H:%M:%N" | tee -a $logFile
         # ���ϵͳ״̬�Ƿ�δ����
    echo "���ϵͳ״̬�Ƿ�δ����" | tee -a $logFile
    $CmdPath/qEvnChk.sh 2 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then
        echo "[ERR] ϵͳ״̬������!!!" | tee -a $errFile
        exit 1 
    fi
    echo "[OK] ϵͳ״̬δ����" | tee -a $logFile
    sleep 2

         # У���ϳ�״̬
    echo "����ϳ�״̬�Ƿ�ɹ�" | tee -a $logFile
    $CmdPath/chkSyncStatus.sh
    if [ $? == 1 ];then
        echo "[ERR] �ϳ�״̬���ʧ��!!!" | tee -a $errFile
        exit 1
    fi
    echo "[OK] �ϳ�״̬������" | tee -a $logFile
    sleep 2

         # �����ˮ�������ɹ�
    echo "����Ƿ������ɹ�..." | tee -a $logFile
    $CmdPath/qEvnChk.sh 3 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then
        echo "[ERR] ����ʧ��!!!" | tee -a $errFile
        exit 1
    fi
    echo "[OK] �����ɹ�" | tee -a $logFile
    sleep 2

          # ����³����Ƿ�����ɹ�
    echo "����³����Ƿ�����ɹ�..." | tee -a $logFile
    $CmdPath/qEvnChk.sh 4 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then
        echo "[ERR] �³�������ʧ��!!!" | tee -a $errFile
        exit 1
    fi
    echo "[OK] �³�������ɹ�" | tee -a $logFile
    sleep 2
    
	# ��ϵͳ����startall
    echo "��ϵͳ����" | tee -a $logFilestartall 1>>$logFile 2>>$errFile
    startall 1>>$logFile 2>>$errFile
    echo "ϵͳ�������" | tee -a $logFile
    sleep 2
    
	# ���ϵͳ״̬�Ƿ�����
    echo "���ϵͳ״̬�Ƿ�����" | tee -a $logFile
    $CmdPath/qEvnChk.sh 1 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then
        echo "[ERR] ϵͳ״̬δ����!!!" | tee -a $errFile
        exit 1 
    fi
    echo "[OK] ϵͳ״̬������" | tee -a $logFile
    
    #end
#    sleep 2
    echo "====>$0 ����"
    date "+%F-%H:%M:%N" | tee -a $logFile
}

main $@;
