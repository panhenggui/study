echo "------系统清理流水开始-------"
curdate=`date "+%Y%m%d-%H:%M:%S"`
echo "当前时间" $curdate
cd $HOME
rm -rf */flow/*
rm -rf */bin/*.log
rm -rf */bin/*.con
rm -rf */bin/*.id
rm -rf */log/*
rm -rf */dump/*
rm -rf $HOME/qdata/bin/TBCommand.dat
rm -rf $HOME/qtrade/*.bat
    ret=`find ~/qtrade/flow -name "TradeResult.con"`
    if [ -z "$ret" ];then
	echo "[OK] Clean flow success"
	echo "------系统清理流水结束-------"
        exit 0
    else
	echo "[ERR] Clean flow failed"
	echo "------系统清理流水结束-------"
	    exit 1
	fi

