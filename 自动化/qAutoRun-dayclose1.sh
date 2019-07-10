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
    # 落地内存数据
    echo "落地内存数据" | tee -a $logFile
	$CmdPath/qEvnChk.sh 1 1 1>>$logFile 2>>$errFile 
    if [ $? == 0 ];then
	   echo "[OK] 开始落地内存数据" | tee -a $logFile
       $CmdPath/crondump.sh 2>>$errFile
    fi
    echo "落地内存数据完成" | tee -a $logFile
    sleep 2

	# 停系统进程
    echo "停系统进程" | tee -a $logFile
	stopall 1>>$logFile 2>>$errFile
    echo "系统停止完成" | tee -a $logFile
    sleep 2
    
	# 检查系统状态是否停止
    echo "检查系统状态是否停止" | tee -a $logFile
    $CmdPath/qEvnChk.sh 2 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then
        echo "[ERR] 系统状态未停止!!!" | tee -a $errFile
        exit 1 
    fi
    echo "[OK] 系统状态已停止" | tee -a $logFile
    sleep 2
    
	# 备份流水, 检查流水备份是否成功
    echo "备份流水, 检查流水备份是否成功" | tee -a $logFile
    $CmdPath/cronbacklog.sh
    if [ $? == 1 ];then 
        echo "[ERR] 备份流水失败!!!" | tee -a $errFile
        exit 1 
    fi
    echo "[OK] 备份流水完成" | tee -a $logFile
    sleep 2
    
	# 备份数据库, 检查数据是否备份成功
    echo "备份数据库, 检查数据是否备份成功" | tee -a $logFile
    $CmdPath/crondbbackup.sh
    if [ $? != 0 ];then
        echo "[ERR] 备份数据失败!!!" | tee -a $errFile
        exit 1 
    fi
    echo "[OK] 备份数据库完成" | tee -a $logFile
    sleep 2

        # 获取结算价
    echo "获取结算价..." | tee -a $logFile
    $CmdPath/cronSettlePrice.sh
    if [ $? != 0 ];then
        echo "[ERR] 获取结算价失败!!!" | tee -a $errFile
        exit 1
    fi
    echo "[OK] 获取结算价完成" | tee -a $logFile
    sleep 2

            # 检查系统状态是否未启动
    echo "检查系统状态是否未启动" | tee -a $logFile
    $CmdPath/qEvnChk.sh 2 1 1>>$logFile 2>>$errFile
    if [ $? == 1 ];then
        echo "[ERR] 系统状态已启动!!!" | tee -a $errFile
        exit 1
    fi
    echo "[OK] 系统状态未启动" | tee -a $logFile
    sleep 2

        # 日终结算
    echo "开始结算..." | tee -a $logFile
    $CmdPath/cronDailySettle.sh
    if [ $? != 0 ];then
        echo "[ERR] 日终结算失败!!!" | tee -a $errFile
        exit 1
    fi
    echo "[OK] 日终结算完成" | tee -a $logFile
    sleep 2

        # 返佣结算
    echo "开始返佣结算..." | tee -a $logFile
    $CmdPath/cronCrmSettle.sh
    if [ $? != 0 ];then
        echo "[ERR] 返佣结算失败!!!" | tee -a $errFile
        exit 1
    fi
    echo "[OK] 返佣结算完成" | tee -a $logFile
    sleep 2

     # 日终结算
   # echo "开始结算..." | tee -a $logFile
   # $CmdPath/cronDailySettle.sh
   # if [ $? != 0 ];then
   #     echo "[ERR] 日终结算失败!!!" | tee -a $errFile
   #     exit 1
   # fi
   # echo "[OK] 日终结算完成" | tee -a $logFile
   # sleep 2
    
	# 数据上场
   # echo "开始数据上场..." | tee -a $logFile
   # $CmdPath/cronDataReadly.sh
   # if [ $? == 1 ];then
   #     echo "[ERR] 数据上场失败!!!" | tee -a $errFile
   #     exit 1 
   # fi
   # echo "[OK] 数据上场完成" | tee -a $logFile
   # sleep 2
    
	# 数据检查(稽核)
    # echo "开始数据稽核..." | tee -a $logFile
    # $CmdPath/cronDataCheck.sh
    # if [ $? == 1 ];then
    #     echo "[ERR] 数据稽核失败!!!" | tee -a $errFile
    #     exit 1 
    # fi
    # echo "[OK] 数据稽核完成" | tee -a $logFile
    # sleep 2

    # 清流水
   # echo "清流水..." | tee -a $logFile
   # clearall
   # echo "清流水完成" | tee -a $logFile
   # sleep 2
    
	# 检查流水是清流成功
   # echo "检查是否清流成功..." | tee -a $logFile
   # $CmdPath/qEvnChk.sh 3 1 1>>$logFile 2>>$errFile
   # if [ $? == 1 ];then 
   #     echo "[ERR] 清流失败!!!" | tee -a $errFile
   #     exit 1 
   # fi
   # echo "[OK] 清流成功" | tee -a $logFile
   # sleep 2
       
	# 清理下场表
   # echo "清理下场表..." | tee -a $logFile
   # $CmdPath/cronclearoperDB.sh 1>>$logFile 2>>$errFile
   # echo "清理下场表完成" | tee -a $logFile
   # sleep 2
    
	# 检查下场表是否清理成功
   # echo "检查下场表是否清理成功..." | tee -a $logFile
   #	$CmdPath/qEvnChk.sh 4 1 1>>$logFile 2>>$errFile
   # if [ $? == 1 ];then 
   #     echo "[ERR] 下场表清理失败!!!" | tee -a $errFile
   #     exit 1 
   # fi
   # echo "[OK] 下场表清理成功" | tee -a $logFile
    
    #end
   # sleep 2
   echo "====>$0 结束"
}

main $@;
