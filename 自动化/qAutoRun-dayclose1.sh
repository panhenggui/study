#!/bin/bash
export LD_LIBRARY_PATH=.
export PATH=$PATH:/home/qdam/crontab:/home/qdam:/home/qdam/bin

CmdPath=$HOME/crontab
logFile=$HOME/crontab/autoRun-dayclose1.Log
errFile=$HOME/crontab/error-dayclose1.Log

main()
{
    >$logFile
    >$errFile
    # ����ڴ�����
    echo "����ڴ�����" | tee -a $logFile
	$CmdPath/qEvnChk.sh 1 1 1>>$logFile 2>>$errFile 
    if [ $? == 0 ];then
	   echo "[OK] ��ʼ����ڴ�����" | tee -a $logFile
       $CmdPath/crondump.sh 2>>$errFile
    fi
    echo "����ڴ��������" | tee -a $logFile
    sleep 2

	# ͣϵͳ����
    echo "ͣϵͳ����" | tee -a $logFile
	stopall 1>>$logFile 2>>$errFile
    echo "ϵͳֹͣ���" | tee -a $logFile
    sleep 2
    
	# ���ϵͳ״̬�Ƿ�ֹͣ
    echo "���ϵͳ״̬�Ƿ�ֹͣ" | tee -a $logFile
    $CmdPath/qEvnChk.sh 2 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then
        echo "[ERR] ϵͳ״̬δֹͣ!!!" | tee -a $errFile
        exit 1 
    fi
    echo "[OK] ϵͳ״̬��ֹͣ" | tee -a $logFile
    sleep 2
    
	# ������ˮ, �����ˮ�����Ƿ�ɹ�
    echo "������ˮ, �����ˮ�����Ƿ�ɹ�" | tee -a $logFile
    $CmdPath/cronbacklog.sh
    if [ $? == 1 ];then 
        echo "[ERR] ������ˮʧ��!!!" | tee -a $errFile
        exit 1 
    fi
    echo "[OK] ������ˮ���" | tee -a $logFile
    sleep 2
    
	# �������ݿ�, ��������Ƿ񱸷ݳɹ�
    echo "�������ݿ�, ��������Ƿ񱸷ݳɹ�" | tee -a $logFile
    $CmdPath/crondbbackup.sh
    if [ $? != 0 ];then
        echo "[ERR] ��������ʧ��!!!" | tee -a $errFile
        exit 1 
    fi
    echo "[OK] �������ݿ����" | tee -a $logFile
    sleep 2

        # ��ȡ�����
    echo "��ȡ�����..." | tee -a $logFile
    $CmdPath/cronSettlePrice.sh
    if [ $? != 0 ];then
        echo "[ERR] ��ȡ�����ʧ��!!!" | tee -a $errFile
        exit 1
    fi
    echo "[OK] ��ȡ��������" | tee -a $logFile
    sleep 2

            # ���ϵͳ״̬�Ƿ�δ����
    echo "���ϵͳ״̬�Ƿ�δ����" | tee -a $logFile
    $CmdPath/qEvnChk.sh 2 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then
        echo "[ERR] ϵͳ״̬������!!!" | tee -a $errFile
        exit 1
    fi
    echo "[OK] ϵͳ״̬δ����" | tee -a $logFile
    sleep 2

        # ���ս���
    echo "��ʼ����..." | tee -a $logFile
    $CmdPath/cronDailySettle.sh
    if [ $? != 0 ];then
        echo "[ERR] ���ս���ʧ��!!!" | tee -a $errFile
        exit 1
    fi
    echo "[OK] ���ս������" | tee -a $logFile
    sleep 2

        # ��Ӷ����
    echo "��ʼ��Ӷ����..." | tee -a $logFile
    $CmdPath/cronCrmSettle.sh
    if [ $? != 0 ];then
        echo "[ERR] ��Ӷ����ʧ��!!!" | tee -a $errFile
        exit 1
    fi
    echo "[OK] ��Ӷ�������" | tee -a $logFile
    sleep 2

     # ���ս���
   # echo "��ʼ����..." | tee -a $logFile
   # $CmdPath/cronDailySettle.sh
   # if [ $? != 0 ];then
   #     echo "[ERR] ���ս���ʧ��!!!" | tee -a $errFile
   #     exit 1
   # fi
   # echo "[OK] ���ս������" | tee -a $logFile
   # sleep 2
    
	# �����ϳ�
   # echo "��ʼ�����ϳ�..." | tee -a $logFile
   # $CmdPath/cronDataReadly.sh
   # if [ $? == 1 ];then
   #     echo "[ERR] �����ϳ�ʧ��!!!" | tee -a $errFile
   #     exit 1 
   # fi
   # echo "[OK] �����ϳ����" | tee -a $logFile
   # sleep 2
    
	# ���ݼ��(����)
    # echo "��ʼ���ݻ���..." | tee -a $logFile
    # $CmdPath/cronDataCheck.sh
    # if [ $? == 1 ];then
    #     echo "[ERR] ���ݻ���ʧ��!!!" | tee -a $errFile
    #     exit 1 
    # fi
    # echo "[OK] ���ݻ������" | tee -a $logFile
    # sleep 2

    # ����ˮ
   # echo "����ˮ..." | tee -a $logFile
   # clearall
   # echo "����ˮ���" | tee -a $logFile
   # sleep 2
    
	# �����ˮ�������ɹ�
   # echo "����Ƿ������ɹ�..." | tee -a $logFile
   # $CmdPath/qEvnChk.sh 3 1 1>>$logFile 2>>$errFile
   # if [ $? == 1 ];then 
   #     echo "[ERR] ����ʧ��!!!" | tee -a $errFile
   #     exit 1 
   # fi
   # echo "[OK] �����ɹ�" | tee -a $logFile
   # sleep 2
       
	# �����³���
   # echo "�����³���..." | tee -a $logFile
   # $CmdPath/cronclearoperDB.sh 1>>$logFile 2>>$errFile
   # echo "�����³������" | tee -a $logFile
   # sleep 2
    
	# ����³����Ƿ�����ɹ�
   # echo "����³����Ƿ�����ɹ�..." | tee -a $logFile
   #	$CmdPath/qEvnChk.sh 4 1 1>>$logFile 2>>$errFile
   # if [ $? == 1 ];then 
   #     echo "[ERR] �³�������ʧ��!!!" | tee -a $errFile
   #     exit 1 
   # fi
   # echo "[OK] �³�������ɹ�" | tee -a $logFile
    
    #end
   # sleep 2
   echo "====>$0 ����"
}

main $@;
