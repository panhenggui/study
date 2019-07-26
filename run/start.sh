for param in qmarket
do
	echo "Start $param ..."
	cd $param/bin
	pwd 1>/dev/null 2>/dev/null
	if [ $param == "qdata" ]
	then
		nohup ./$param -d 20150101 1>/dev/null 2>/dev/null &
	else
		nohup ./$param  1>/dev/null 2>/dev/null &
	fi
	cd ../../
	pwd 1>/dev/null 2>/dev/null
done
