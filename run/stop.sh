for param in qmarket
do
	echo "Stop $param ..."
	ps -ef | grep $param | grep -v grep | awk '{print $2}' | xargs kill -9 1>/dev/null 2>/dev/null
done
