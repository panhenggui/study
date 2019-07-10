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
         # 检查系统状态是否未启动
    echo "检查系统状态是否未启动" | tee -a $logFile
    $CmdPath/qEvnChk.sh 2 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then
        echo "[ERR] 系统状态已启动!!!" | tee -a $errFile
        exit 1 
    fi
    echo "[OK] 系统状态未启动" | tee -a $logFile
    sleep 2

         # 校验上场状态
    echo "检查上场状态是否成功" | tee -a $logFile
    $CmdPath/chkSyncStatus.sh
    if [ $? == 1 ];then
        echo "[ERR] 上场状态检查失败!!!" | tee -a $errFile
        exit 1
    fi
    echo "[OK] 上场状态检查完成" | tee -a $logFile
    sleep 2

         # 检查流水是清流成功
    echo "检查是否清流成功..." | tee -a $logFile
    $CmdPath/qEvnChk.sh 3 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then
        echo "[ERR] 清流失败!!!" | tee -a $errFile
        exit 1
    fi
    echo "[OK] 清流成功" | tee -a $logFile
    sleep 2

          # 检查下场表是否清理成功
    echo "检查下场表是否清理成功..." | tee -a $logFile
    $CmdPath/qEvnChk.sh 4 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then
        echo "[ERR] 下场表清理失败!!!" | tee -a $errFile
        exit 1
    fi
    echo "[OK] 下场表清理成功" | tee -a $logFile
    sleep 2
    
	# 启系统进程startall
    echo "启系统进程" | tee -a $logFilestartall 1>>$logFile 2>>$errFile
    startall 1>>$logFile 2>>$errFile
    echo "系统启动完成" | tee -a $logFile
    sleep 2
    
	# 检查系统状态是否启动
    echo "检查系统状态是否启动" | tee -a $logFile
    $CmdPath/qEvnChk.sh 1 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then
        echo "[ERR] 系统状态未启动!!!" | tee -a $errFile
        exit 1 
    fi
    echo "[OK] 系统状态已启动" | tee -a $logFile
    
    #end
#    sleep 2
    echo "====>$0 结束"
    date "+%F-%H:%M:%N" | tee -a $logFile
}

main $@;
