#!/bin/bash
#该脚本为Linux下启动java程序的通用脚本。即可以作为开机自启动service脚本被调用， 
#也可以作为启动java程序的独立脚本来使用。 
# 
# 
# 
# 
################################### 
#环境变量及程序执行参数 
#需要根据实际环境以及Java程序名称来修改这些参数 
################################### 
#JDK所在路径 
JAVA_HOME=/usr/local/java/jdk1.8.0_60
echo $JAVA_HOME 


RUNNING_USER=root

#Java程序所在的目录（classes的上一级目录），使用绝对路径
APP_HOME=/home/web/apache-tomcat-8.0.24/webapps/quantdo/WEB-INF

#需要启动的Java主程序（main方法类） 
APP_MAINCLASS=com.quantdo.orgClear.service.impl.HSDPService

#java虚拟机启动参数 
JAVA_OPTS="-d64 -server -Xms2048m -Xmx2048m -Dfile.encoding=UTF-8 -Duser.country=CN -Duser.language=zh -XX:+AggressiveOpts -XX:+UseBiasedLocking -XX:+DisableExplicitGC -XX:+UseParNewGC -XX:+UseConcMarkSweepGC -XX:+CMSParallelRemarkEnabled -XX:+UseFastAccessorMethods -XX:+UseCMSInitiatingOccupancyOnly -XX:CMSInitiatingOccupancyFraction=70" 

#拼凑完整的classpath参数，包括指定lib目录下所有的jar 
CLASSPATH=$APP_HOME

echo $CLASSPATH

#for i in "$APP_HOME"/frameworklib/*Core*.*; do
#CLASSPATH="$CLASSPATH":"$i" 
#done

#for i in "$APP_HOME"/frameworklib/*Service*.*; do
#CLASSPATH="$CLASSPATH":"$i" 
#done

#for i in "$APP_HOME"/frameworklib/*Jpa*.*; do
#CLASSPATH="$CLASSPATH":"$i" 
#done

#for i in "$APP_HOME"/lib/common/*.*; do 
#CLASSPATH="$CLASSPATH":"$i" 
#done 

#for i in "$APP_HOME"/lib/office/*.*; do 
#CLASSPATH="$CLASSPATH":"$i" 
#done 

#for i in "$APP_HOME"/lib/jpa/*.*; do
#CLASSPATH="$CLASSPATH":"$i" 
#done 

#for i in "$APP_HOME"/lib/web/*.*; do 
#CLASSPATH="$CLASSPATH":"$i" 
#done 

#for i in "$APP_HOME"/lib/sso/*.*; do 
#CLASSPATH="$CLASSPATH":"$i" 
#done 

#for i in "$APP_HOME"/lib/rpc/*.*; do 
#CLASSPATH="$CLASSPATH":"$i" 
#done

#for i in "$APP_HOME"/bin/*.*; do 
#CLASSPATH="$CLASSPATH":"$i" 
#done

for i in "$APP_HOME"/lib/*.*; do
    if [ "$i" != "$APP_HOME/lib/FrameworkWeb-1.0.0.jar" ]; then
        CLASSPATH="$CLASSPATH":"$i"
    fi
done

CLASSPATH="$CLASSPATH":"$APP_HOME/bin":"$APP_HOME/classes"

cd $APP_HOME

################################### 
#(函数)判断程序是否已启动 
# 
#说明： 
#使用JDK自带的JPS命令及grep命令组合，准确查找pid 
#jps 加 l 参数，表示显示java的完整包路径 
#使用awk，分割出pid ($1部分)，及Java程序名称($2部分) 
################################### 
#初始化psid变量（全局） 
psid=0 

checkpid() { 
javaps=`$JAVA_HOME/bin/jps -l | grep $APP_MAINCLASS` 

if [ -n "$javaps" ]; then 
psid=`echo $javaps | awk '{print $1}'` 
else 
psid=0 
fi 
} 

################################### 
#(函数)启动程序 
# 
#说明： 
#1. 首先调用checkpid函数，刷新$psid全局变量 
#2. 如果程序已经启动（$psid不等于0），则提示程序已启动 
#3. 如果程序没有被启动，则执行启动命令行 
#4. 启动命令执行后，再次调用checkpid函数 
#5. 如果步骤4的结果能够确认程序的pid,则打印[OK]，否则打印[Failed] 
#注意：echo -n 表示打印字符后，不换行 
#注意: "nohup 某命令 >/dev/null 2>&1 &" 的用法 
################################### 
start() { 
checkpid 

if [ $psid -ne 0 ]; then 
echo "================================" 
echo "warn: $APP_MAINCLASS already started! (pid=$psid)" 
echo "================================" 
else 
echo -n "Starting $APP_MAINCLASS ..." 
JAVA_CMD="nohup $JAVA_HOME/bin/java $JAVA_OPTS -classpath $CLASSPATH $APP_MAINCLASS >/dev/null 2>&1 &"
#su - $RUNNING_USER -c "$JAVA_CMD" 
echo "$JAVA_HOME/bin/java $JAVA_OPTS -classpath $CLASSPATH $APP_MAINCLASS $1 $2"
$JAVA_HOME/bin/java $JAVA_OPTS -classpath $CLASSPATH $APP_MAINCLASS $1 $2
checkpid 
if [ $psid -ne 0 ]; then 
echo "(pid=$psid) [OK]" 
else 
echo "[Failed]" 
fi 
fi 
} 

################################### 
#(函数)停止程序 
# 
#说明： 
#1. 首先调用checkpid函数，刷新$psid全局变量 
#2. 如果程序已经启动（$psid不等于0），则开始执行停止，否则，提示程序未运行 
#3. 使用kill -9 pid命令进行强制杀死进程 
#4. 执行kill命令行紧接其后，马上查看上一句命令的返回值: $? 
#5. 如果步骤4的结果$?等于0,则打印[OK]，否则打印[Failed] 
#6. 为了防止java程序被启动多次，这里增加反复检查进程，反复杀死的处理（递归调用stop）。 
#注意：echo -n 表示打印字符后，不换行 
#注意: 在shell编程中，"$?" 表示上一句命令或者一个函数的返回值 
################################### 
stop() { 
checkpid 

if [ $psid -ne 0 ]; then 
echo -n "Stopping $APP_MAINCLASS ...(pid=$psid) " 
#su - $RUNNING_USER -c "kill -9 $psid" 
kill $psid
if [ $? -eq 0 ]; then 
echo "[OK]" 
else 
echo "[Failed]" 
fi 

checkpid 
if [ $psid -ne 0 ]; then 
stop 
fi 
else 
echo "================================" 
echo "warn: $APP_MAINCLASS is not running" 
echo "================================" 
fi 
} 

################################### 
#(函数)检查程序运行状态 
# 
#说明： 
#1. 首先调用checkpid函数，刷新$psid全局变量 
#2. 如果程序已经启动（$psid不等于0），则提示正在运行并表示出pid 
#3. 否则，提示程序未运行 
################################### 
status() { 
checkpid 

if [ $psid -ne 0 ]; then 
echo "$APP_MAINCLASS is running! (pid=$psid)" 
else 
echo "$APP_MAINCLASS is not running" 
fi 
} 

################################### 
#(函数)打印系统环境参数 
################################### 
info() { 
echo "System Information:" 
echo "****************************" 
echo `head -n 1 /etc/issue` 
echo `uname -a` 
echo 
echo "JAVA_HOME=$JAVA_HOME" 
echo `$JAVA_HOME/bin/java -version` 
echo 
echo "APP_HOME=$APP_HOME" 
echo "APP_MAINCLASS=$APP_MAINCLASS" 
echo "****************************" 
} 

################################### 
#读取脚本的第一个参数($1)，进行判断 
#参数取值范围：{start|stop|restart|status|info} 
#如参数不在指定范围之内，则打印帮助信息 
################################### 
case "$1" in 
'start') 
start $2 $3 
;; 
'stop') 
stop 
;; 
'restart') 
stop 
start 
;; 
'status') 
status 
;; 
'info') 
info 
;; 
*) 
echo "Usage: $0 {start|stop|restart|status|info}" 
exit 1 
esac 
exit 0
