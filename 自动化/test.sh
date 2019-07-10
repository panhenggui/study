#!/bin/bash
export LD_LIBRARY_PATH=.
export PATH=$PATH:/home/qdam/crontab:/home/qdam:/home/qdam/bin

CmdPath=$HOME/crontab
logFile=$HOME/crontab/autoRun.Log
errFile=$HOME/crontab/error.Log

main()
{
    >$logFile
    >$errFile
    # ����ڴ�����
    echo "����ڴ�����" | tee -a $logFile
	$CmdPath/qEvnChk.sh 1 1 1>>$logFile 2>>$errFile 
    if [ $? == 0 ];then
	   echo -e "\033[32;1m[OK] ��ʼ����ڴ�����\033[0m" | tee -a $logFile
       $CmdPath/crondump.sh 2>>$errFile
	   if [ $? == 0 ];then
	      echo -e "\033[32;1mdumptool success\033[0m" | tee -a $logFile
	   fi 
	   echo -e "\033[32;1mdumptool false\033[0m" | tee -a $errFile
    fi
    

	# ͣϵͳ����
    echo "ͣϵͳ����" | tee -a $logFile
	stopall 1>>$logFile 2>>$errFile
    echo "ϵͳֹͣ���" | tee -a $logFile
    sleep 2
    
	# ���ϵͳ״̬�Ƿ�ֹͣ
    echo "���ϵͳ״̬�Ƿ�ֹͣ" | tee -a $logFile
    $CmdPath/qEvnChk.sh 2 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then
        echo -e "\033[31;1m[ERR] ϵͳ״̬δֹͣ!!!\033[0m" | tee -a $errFile
        exit 1 
    fi
    echo -e  "\033[32;1m[OK] ϵͳ״̬��ֹͣ\033[0m" | tee -a $logFile
   
    
	# ������ˮ, �����ˮ�����Ƿ�ɹ�
    echo "������ˮ, �����ˮ�����Ƿ�ɹ�" | tee -a $logFile
    $CmdPath/cronbacklog.sh
    if [ $? == 1 ];then 
        echo -e "\033[31;1m[ERR] ������ˮʧ��!!!\033[0m" | tee -a $errFile
        exit 1 
    fi
    echo -e "\033[32;1m[OK] ������ˮ���\033[0m" | tee -a $logFile

    
	# �������ݿ�, ��������Ƿ񱸷ݳɹ�
    echo "�������ݿ�, ��������Ƿ񱸷ݳɹ�" | tee -a $logFile
    $CmdPath/crondbbackup.sh
    if [ $? != 0 ];then
        echo -e "\033[31;1m[ERR] ��������ʧ��!!!\033[0m" | tee -a $errFile
        exit 1 
    fi
    echo -e "\033[32;1m[OK] �������ݿ����\033[0m" | tee -a $logFile
    

        # ��ȡ�����
    echo "��ȡ�����..." | tee -a $logFile
    $CmdPath/cronSettlePrice.sh
    if [ $? != 0 ];then
        echo -e  "\033[31;1m[ERR] ��ȡ�����ʧ��!!!\033[0m" | tee -a $errFile
        exit 1
    fi
    echo -e "\033[32;1m[OK] ��ȡ��������\033[0m" | tee -a $logFile
   

            # ���ϵͳ״̬�Ƿ�δ����
    echo "���ϵͳ״̬�Ƿ�δ����" | tee -a $logFile
    $CmdPath/qEvnChk.sh 2 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then
        echo -e "\033[31;1m[ERR] ϵͳ״̬������!!!\033[0m" | tee -a $errFile
        exit 1
    fi
    echo -e "\033[32;1m[OK] ϵͳ״̬δ����\033[0m" | tee -a $logFile
   

        # ���ս���
    echo "��ʼ����..." | tee -a $logFile
    $CmdPath/cronDailySettle.sh
    if [ $? != 0 ];then
        echo -e "\033[31;1m[ERR] ���ս���ʧ��!!!\033[0m" | tee -a $errFile
        exit 1
    fi
    echo -e "\033[32;1m[OK] ���ս������\033[0m" | tee -a $logFile
   

        # ��Ӷ����
    echo "��ʼ��Ӷ����..." | tee -a $logFile
    $CmdPath/cronCrmSettle.sh
    if [ $? != 0 ];then
        echo -e "\033[31;1m[ERR] ��Ӷ����ʧ��!!!\033[0m" | tee -a $errFile
        exit 1
    fi
    echo -e "\033[32;1m[OK] ��Ӷ�������\033[0m" | tee -a $logFile
    sleep 1
   
   	# �����ϳ�
    echo "��ʼ�����ϳ�..." | tee -a $logFile
    $CmdPath/cronDataReadly.sh
    if [ $? == 1 ];then
        echo -e "\033[31;1m[ERR] �����ϳ�ʧ��!!!\033[0m" | tee -a $errFile
        exit 1 
    fi
    echo -e "\033[31;1m[OK] �����ϳ����\033[0m" | tee -a $logFile
    sleep 1
    
	# ���ݼ��(����)
     #echo "��ʼ���ݻ���..." | tee -a $logFile
     #$CmdPath/cronDataCheck.sh
     #if [ $? == 1 ];then
     #    echo "[ERR] ���ݻ���ʧ��!!!" | tee -a $errFile
     #    exit 1 
     #fi
     #echo "[OK] ���ݻ������" | tee -a $logFile
     #sleep 2
   
       # ����ˮ
    echo "����ˮ..." | tee -a $logFile
    clearall
    echo "����ˮ���" | tee -a $logFile
  
    
	# �����ˮ�������ɹ�
    echo "����Ƿ������ɹ�..." | tee -a $logFile
    $CmdPath/qEvnChk.sh 3 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then 
        echo -e "\033[31;1m[ERR] ����ʧ��!!!\033[0m" | tee -a $errFile
        exit 1 
    fi
    echo -e "\033[32;1m[OK] �����ɹ�\033[0m" | tee -a $logFile
   
       
	# �����³���
    echo "�����³���..." | tee -a $logFile
    $CmdPath/cronclearoperDB.sh 1>>$logFile 2>>$errFile
    echo "�����³������" | tee -a $logFile
    sleep 2
    
	# ����³����Ƿ�����ɹ�
    echo "����³����Ƿ�����ɹ�..." | tee -a $logFile
	$CmdPath/qEvnChk.sh 4 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then 
        echo -e "\033[31;1m[ERR] �³�������ʧ��!!!\033[0m" | tee -a $errFile
        exit 1 
    fi
    echo -e "\033[32;1m[OK] �³�������ɹ�\033[0m" | tee -a $logFile
    
    #end
   # sleep 2
   echo "====>$0 ����"
}

main $@;
