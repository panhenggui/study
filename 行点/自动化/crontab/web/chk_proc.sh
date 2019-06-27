#!/bin/bash
ShowDetail=0

Chk_proc()
{
        jar_issue_pid=`ps -ef|grep -v grep | grep 'java -server -Xms4096m -Xmx4096m -jar ./lib/lyjf-issue-serviceimpl.jar '|awk '{ print $2 }'`
        jar_trade_pid=`ps -ef|grep -v grep | grep 'java -server -Xms4096m -Xmx4096m -jar ./lib/lyjf-trade-serviceimpl.jar '|awk '{ print $2 }'`
        jar_consumer_pid=`ps -ef|grep -v grep | grep 'java -server -Xms4096m -Xmx4096m -jar ./lib/lyjf-consumer-serviceimpl.jar '|awk '{ print $2 }'`
        jar_pay_pid=`ps -ef|grep -v grep | grep 'java -server -Xms4096m -Xmx4096m -jar ./lib/lyjf-pay-serviceimpl.jar '|awk '{ print $2 }'`
        #jar_check_pid=`ps -ef|grep -v grep | grep 'java -server -Xms4096m -Xmx4096m -jar ./lib/lyjf-check-serviceimpl.jar '|awk '{ print $2 }'`
        jar_task_pid=`ps -ef|grep -v grep | grep 'java -server -Xms4096m -Xmx4096m -jar ./lib/lyjf-task-serviceimpl.jar '|awk '{ print $2 }'`
        
        rest_jar_issue_pid=`ps -ef|grep -v grep | grep 'java -server -Xms4096m -Xmx4096m -jar ./lib/lyjf-issue-rest.jar '|awk '{ print $2 }'`
        rest_jar_trade_pid=`ps -ef|grep -v grep | grep 'java -server -Xms4096m -Xmx4096m -jar ./lib/lyjf-trade-rest.jar '|awk '{ print $2 }'`
        rest_jar_consumer_pid=`ps -ef|grep -v grep | grep 'java -server -Xms4096m -Xmx4096m -jar ./lib/lyjf-consumer-rest.jar '|awk '{ print $2 }'`
        rest_jar_pay_pid=`ps -ef|grep -v grep | grep 'java -server -Xms4096m -Xmx4096m -jar ./lib/lyjf-pay-rest.jar '|awk '{ print $2 }'`
        #rest_jar_check_pid=`ps -ef|grep -v grep | grep 'java -server -Xms4096m -Xmx4096m -jar ./lib/lyjf-check-rest.jar '|awk '{ print $2 }'`
        rest_jar_client_pid=`ps -ef|grep -v grep | grep 'java -server -Xms4096m -Xmx4096m -jar ./lib/client-rest-1.0.4-SNAPSHOT.jar '|awk '{ print $2 }'`
        bCheckOK=1;
        if [ $1 == "start" ];then
           for i in {$jar_issue_pid,$jar_trade_pid,$jar_consumer_pid,$jar_pay_pid,$jar_task_pid}
           do     
                if [ -z $i ];then
                    echo "[ERR] impl $i not exist, check error!!!"
                    bCheckOK=0;
                else
                    if [ $ShowDetail == 1 ];then
                        echo "[ impl ] =======> pid = [$i]" 
                    fi
                fi
           done
           for i in {$rest_jar_issue_pid,$rest_jar_trade_pid,$rest_jar_consumer_pid,$rest_jar_pay_pid,$rest_jar_client_pid}
           do     
                if [ -z $i ];then
                    echo "[ERR] rest $i not exist, check error!!!"
                    bCheckOK=0;
                else
                    if [ $ShowDetail == 1 ];then
                        echo "[ rest ] =======> pid = [$i]" 
                    fi
                fi
           done
        fi
        if [ $1 == "stop" ];then
           for i in {$jar_issue_pid,$jar_trade_pid,$jar_consumer_pid,$jar_pay_pid,$jar_task_pid}
           do
                if [ -z $i ];then
                    if [ $ShowDetail == 1 ];then
                        echo "impl $i =======> stop" 
                    fi
                else
                    echo "[ERR] impl $i exist, check error!!!"
                    bCheckOK=0;
                fi
           done
           for i in {$rest_jar_issue_pid,$rest_jar_trade_pid,$rest_jar_consumer_pid,$rest_jar_pay_pid,$rest_jar_client_pid}
           do
                if [ -z $i ];then
                    if [ $ShowDetail == 1 ];then
                        echo "rest $i =======> stop" 
                    fi
                else
                    echo "[ERR] rest $i exist, check error!!!"
                    bCheckOK=0;
                fi
           done
        fi
        if [ $bCheckOK == 1 ];then
            echo "[OK] All process is "$1"ed, check ok."
        else
            exit 1
        fi
}


EchoUsage()
{
	echo "Usage: $0 @cmdNum [@showdetail]"
		echo "  [cmdNum]:"
		echo "    1 - check process status start"
		echo "    2 - check process status stop"
		echo "  [showdetail]:"
		echo "    0 - not show detail log"
		echo "    1 - show detail log"
}

main()
{
	if [ $# == 0 ]; then
        EchoUsage;
        exit 1
	fi
    #$2=1,show detail log
        if [ $# == 2 ];then
	    if [ $2 == 1 ] ;then
	       ShowDetail=1 
	    fi
        fi
    #check process start
	if [ $1 == 1 ] ;then
	    Chk_proc "start";
	fi
    #check process stop
	if [ $1 == 2 ] ;then
	    Chk_proc "stop";
	fi
       exit 0
}

main $@;
