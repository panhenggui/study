cd apache-tomcat-8.0.41/bin/
./startup.sh 
cd ../logs
ll
tail -f catalina.out
cd
ll
cd apache-tomcat-8.0.41/bin/
./shutdown.sh 
cd
ps -ef|grep tomcat
cd apache-tomcat-8.0.41/bin/
ll
cd lib/
ll
chmod +w jqdamuserapi.so libqdamuserapi.so 
ll
cd linux_x64/
ll
cd ..
ll
cd linux
ll
cd linux_x64/
ll
ps -ef | grep tomcat
ll
cd
ll
cd apache-tomcat-8.0.41/
cd
vi .bash_profile 
java -version
cd
cd apache-tomcat-8.0.41/
cd bin
ll
cd ..
ll
cd logs/
ll
tail -f catalina.out 
view catalina.out 
cd
cd apache-tomcat-8.0.41/
cd webapps/
cd quantdo
ll
cd WEB-INF/
ll
cd classes/
ll
vi configure.properties 
cd
ps -ef|grep tomcat
cd apache-tomcat-8.0.41/bin/
./startup.sh 
cd ../logs
ll
tail -f catalina.out
history 
cd
ll
cd apache-tomcat-8.0.41/bin/
ll
cd 
cd apache-tomcat-8.0.41/webapps/quantdo/WEB-INF/
ll
cd classes/
ll
vim frameworkConfig.properties 
vim configure.properties 
cat c3p0-config.xml 
ll
cd
cd apache-tomcat-8.0.41/webapps/
ll
cd quantdo/WEB-INF/
ll
cd classes/
ll
cat configure.properties 
free -mh
cd
cd apache-tomcat-8.0.41/bin/
ps -ef |grep tomcat
./startup.sh 
cd ../logs/
tail -f catalina.out 
ps -ef 
ps -ef |grep tomcat
cd apache-tomcat-8.0.41/bin/
./shutdown.sh 
cd apache-tomcat-8.0.41/bin/
ps -ef|grep tomcat
./startup.sh 
cd ../logs/
tail -f catalina.out 
cd .
cd ../bin/
./shutdown.sh 
ps -ef |grep tomcat
./startup.sh 
cd ../logs/
tail -f catalina.out 
ps -ef|grep tomcat
cd
cd KeyGenerator/
java -jar keygenerator.jar 
ll
cd Public/
ll
vim 1.sh
sh 1.sh 
vim 1.sh
sh 1.sh 
vim 1.sh
sh 1.sh 
vim 2.sh
sh 2.sh 
vim 3.sh
sh 3.sh 
vim test.sh
sh test.sh 
vim test.sh
sh test.sh 
vim test.sh
sh test.sh 
vim test.sh
sh test.sh 
cd
cd 
ll
vim apache-tomcat-8.0.41/bin/
cd apache-tomcat-8.0.41/bin/
ll
cd
cd apache-tomcat-8.0.41/
ll
cd webapps/
ll
quantdo
cd quantdo
ll
cd WEB-INF/
ll
cat web.xml 
ll
cd classes/
ll
vim c3p0-config.xml 
vim frameworkConfig.properties 
vim configure.properties 
cd 
ll'
'
ll
cd riskStorm/
ll
cd shell/
ll
vim run.
ll
vim run.sh 
cd ../resources/
ll
vim c3p0-config.xml 
vim IceConfig.ini 
vim configure.properties 
cd
vim .bash_profile 
cd apache-tomcat-8.0.41/
cd bin/
ll
./startup.sh 
cd ../logs/
tail -f catalina.out 
cd
cd riskStorm/
cd shell/
ll
./run.sh start
ll
cd ../
ll
tail -f nohup.out 
cd 
ll
vim riskStorm/
cd riskStorm/
ll
cd shell/
vim run.sh 
cd
ll
cd riskStorm/
ll
rm -rf *
ll
tar -xvf riskStorm.tar.gz 
ll
vim shell/run.sh 
vim resources/c3p0-config.xml 
vim resources/IceConfig.ini 
vim resources/configure.properties 
cd
cd riskStorm/shell/
ll
./run.sh start
ll
vim run.log 
vim vim run.sh 
vim run.sh 
cd ../
vim resources/c3p0-config.xml 
vim resources/IceConfig.ini 
vim resources/configure.properties 
cd
source .bash_profile 
cd riskStorm/shell/
./run.sh start
vim run.sh 
./run.sh info
./run.sh stop
./run.sh start
ps -ef |grep risk
ps -ef |grep riskStorm
cd ..
ll
cd shell/
ll
vi run.sh 
free -mh
ii 
ll
vi run.sh 
./run.sh start
ps -ef |grep riskStorm
ll
cd
ll
cd Public/
ll
mv 3.sh ~
ll
vim test.sh 
sh test.sh 
cd
cd riskStorm/
cd shell/
ll
vim run.sh 
cd
cd riskStorm/
ll
mv riskStorm.tar.gz ../Public/
cd
cd Public/
ll
mkdir test 
mv riskStorm.tar.gz test
cd test/
ll
tar -xvf riskStorm.tar.gz 
ll
cd shell/
ll
vim run.sh 
cd
cd riskStorm/shell/
vim run.sh 
cd
cd Public/
ll
rm -rf test
ll
free -mh
cd 
vim riskStorm/nohup.out 
tail -f riskStorm/nohup.out 
cd riskStorm/
cd shell/
ll
./run.sh stop
ps -ef|grep risk
ps -ef |grep tomcat
cd
cd apache-tomcat-8.0.41/bin/
ll
cd Public/
ll
l
ll
cd
ll
cd dbbackup/
ll
tar -xvf backup-2018-11-26--172451.sql.tar.gz 
ll
ps -ef |grep tomcat
ps -ef |grep tomct
cd dbbackup/
ll
vim backup-2018-11-27--150204.sql
grep -iE 
grep -iE "insert into" backup-2018-11-27--150204.sql > qdam.sql
vim qdam.sql 
vim backup-2018-11-27--150204.sql
df -h
vim qdam.sql 
ll
vim backup-2018-11-27--150204.sql
sed -n '/Table structure for table `t_his_adviceorder`/,/Table structure for table `t_import_futures_hold`/p' backup-2018-11-27--150204.sql > qdam2.sql
ll
vim qdam2.sql 
sed -n '/Table structure for table `t_his_adviceorder`/,/Table structure for table `t_import_futures_hold`/d' backup-2018-11-27--150204.sql > qdam3.sql
vim qdam3.sql 
vim backup-2018-11-27--150204.sql
sed -i '/Table structure for table `t_his_adviceorder`/,/Table structure for table `t_import_futures_hold`/d' backup-2018-11-27--150204.sql
vim backup-2018-11-27--150204.sql
vim restor.sh
ll
rm -f qdam*
ll
vim backup-2018-11-27--150204.sql
rm -f backup-2018-11-27--150204.sql
ll
tar -xvf backup-2018-11-27--150204.sql.tar.gz 
rm -f backup-2018-11-27--150204.sql
ll
tar -xvf backup-2018-11-27--150204.sql.tar.gz 
cp backup-2018-11-27--150204.sql backup.sql
ll
sh restor.sh 
ll
tar -xvf backup-2018-11-27--160346.sql.tar.gz 
rm -f backup.sql 
cp backup-2018-11-27--160346.sql backup.sql
ll
sh restor.sh 
tar backup-2018-11-27--160346.sql.tar.gz ./1.sql
tar backup-2018-11-27--160346.sql.tar.gz 1.sql
a = backup-2018-11-27--160346.sql.tar.gz 
a=backup-2018-11-27--160346.sql.tar.gz 
echo $a
a=${a#*:}
echo $a
a=${a#*.}
echo $a
a=backup-2018-11-27--160346.sql.tar.gz 
b={a%%.*}
echo $b
b=${a%%.*}
echo $b
b=${a##.*}
echo $b
b=${a%.*}
echo $b
b=${a%.*.*}
echo $b
ll
vim restor.sh 
vim 1.sh
sh 1.sh backup-2018-11-27--160346.sql.tar.gz 
vim 1.sh
sh 1.sh backup-2018-11-27--160346.sql.tar.gz 
vim 1.sh
vim restor.sh 
sh restor.sh backup-2018-11-27--160346.sql.tar.gz 
vim restor.sh 
sh restor.sh 1.tar.gz
df -h
vim restor.sh 
cd dbbackup/
ll
tar -xvf backup-2018-11-27--145037.sql.tar.gz 
ll
grep -v 't_his_' backup-2018-11-27--145037.sql > qdam.sql
ll
vim qdam.sql 
vim backup-2018-11-27--145037.sql
vim qdam.sql 
ll
rm *
cd
cd dbbackup/
ll
tar -xvf backup-2018-11-27--150204.sql.tar.gz 
ll
grep -v 't_his_' backup-2018-11-27--150204.sql > qdam.sql
vim backup-2018-11-27--150204.sql
vim qdam.sql 
grep -v 'INSERT INTO `t_his_' backup-2018-11-27--150204.sql > qdam1.sql
ll
vim qdam1.sql 
vim backup-2018-11-27--150204.sql
rm -f backup-2018-11-27--160346.sql
ll
rm -f backup-2018-11-27--150204.sql
ll
rm -f backup.sql 
ll
a = tar -xvf backup-2018-11-27--160346.sql.tar.gz 
a = (tar -xvf backup-2018-11-27--160346.sql.tar.gz) 
a = 'tar -xvf backup-2018-11-27--160346.sql.tar.gz'
ps -ef |grep tomcat
df -h
ps -ef
cd
ps -ef
cd apache-tomcat-8.0.41/bin/
./startup.sh 
cd ../logs/
tail -f catalina.out
cd
cd dbbackup/
ll
tar -xvf backup-2018-11-27--160346.sql.tar.gz -C ~/1.sql
ll
vim re
vim restor.sh 
rm backup-2018-11-27--160346.sql 
ll
sh restor.sh backup-2018-11-27--160346.sql.tar.gz 
ll
vim backup-2018-11-27--160346.sql
ll
cd dbbackup/
ll
vim 1.sh 
vim insert.sh
vim restor.sh 
tar -xvf backup-2018-11-27--150204.sql.tar.gz 
ll
mv backup-2018-11-27--150204.sql 1.txt
ll
sh restor.sh backup-2018-11-27--150204.sql.tar.gz 
vim re
vim restor.sh 
ls /home/quantdo/*.sql
vim restor.sh 
sh restor.sh backup-2018-11-27--150204.sql.tar.gz 
ll
vim restor.sh 
sh restor.sh backup-2018-11-27--150204.sql.tar.gz 
vim restor.sh 
echo $(ls /home/quantdo/*.sql)
sh restor.sh backup-2018-11-27--150204.sql.tar.gz 
ll
vim re
vim restor.sh 
rm backup-2018-11-27--150204.sql
ll
sh restor.sh backup-2018-11-27--150204.sql.tar.gz 
ll
echo $(ls /home/quantdo/dbbackup/*.sql)
vim restor.sh 
rm backup-2018-11-27--150204.sql
sh restor.sh backup-2018-11-27--150204.sql.tar.gz 
vim restor.sh 
ll
vim backup-2018-11-27--150204.sql
vim backup-2018-11-27--160346.sql
vim restor.sh 
vim backup-2018-11-27--160346.sql
vim restor.sh 
mv restor.sh restorQdam.sh 
rm -f *.sql
ll
rm -f 1.*
ll
sh backup-2018-11-27--160346.sql.tar.gz 
vim restorQdam.sh 
ll
sh restorQdam.sh backup-2018-11-27--160346.sql.tar.gz 
ll
vim backup-2018-11-27--160346.sql
vim restorQdam.sh 
rm -f *.sql
ll
sh restorQdam.sh backup-2018-11-27--160346.sql.tar.gz 
:l
ll
vim backup-2018-11-27--160346.sql
vim restorQdam.sh 
rm -f *.sql
ll
sh restorQdam.sh backup-2018-11-27--160346.sql.tar.gz 
vim backup-2018-11-27--160346.sql
vim restorQdam.sh 
rm -f *.sql
ll
sh restorQdam.sh backup-2018-11-27--160346.sql.tar.gz 
vim backup-2018-11-27--160346.sql
ll
vim backup-2018-11-27--160346.sql
ll -a
rm .backup-2018-11-27--160346.sql.swp 
ll
vim backup-2018-11-27--1
vim backup-2018-11-27--160346.sql
sh restorQdam.sh backup-2018-11-27--160346.sql.tar.gz 
ll
rm -f backup-2018-11-27--160346.sql
ll
sh restorQdam.sh backup-2018-11-27--160346.sql.tar.gz 
vim backup-2018-11-27--160346.sql
vim restorQdam.sh 
rm backup-2018-11-27--160346.sql
ll
sh restorQdam.sh backup-2018-11-27--160346.sql.tar.gz 
vim re
vim restorQdam.sh 
cd dbbackup/
vim backup-2018-11-27--160346.sql
cd dbbackup/
ll
ps -ef |grep tomcat
cd
cd apache-tomcat-8.0.41/bin/
./shutdown.sh 
cd
cd riskStorm/shell/
l
ll
ps -ef |grep risk
ll
c
cd
cd apache-tomcat-8.0.41/bin/
l
ll
./startup.sh 
cd ../logs/
tail catalina.out 
tail -f catalina.out 
cd ../bin/
ll
./shutdown.sh 
ps -ef |grep tomcat
./startup.sh 
cd ../logs/
tail -f catalina.out 
cd ../bin/
./shutdown.sh 
./startup.sh 
cd ../logs/
tail -f catalina.out 
cd
cd apache-tomcat-8.0.41/bin/
ps -ef|grep tomcat
./shutdown.sh 
./startup.sh 
cd ../logs/
tail -f catalina.out 
cd
cd apache-tomcat-8.0.41/
c dwe
cd webapps/
ll
cd we
cd quantdo
cd WEB-INF/
ll
vi web.xml 
cd classes/
ll
vi c3p0-config.xml 
cd
cd apache-tomcat-8.0.41/bin/
./shutdown.sh 
./startup.sh 
cd ../logs/
tail -f catalina.out 
cd
cd KeyGenerator/
ll
java -jar keygenerator.jar 
cd
cd KeyGenerator/
java -jar keygenerator.jar 
ps -ef |grep tomcat
ps -ef|grep tomcat
ps -ef |grep riskStorm
free -mg\h
free -mh
./riskStorm/shell/run.sh start
tail -f riskStorm/logs/logFile.2018-12-17.log 
cd
cd riskStorm/logs/
ll
tail -f logFile.2018-12-17.log 
cd
cd riskStorm/
ll
vim shell/run.sh 
vim resources/c3p0-config.xml 
vim resources/IceConfig.ini 
vim resources/configure.properties 
cd
vim .bash_profile 
source .bash_profile 
ll
cd riskStorm/
ll
cd
cd KeyGenerator/
ll
cd
ll
df -h
free -mh
echo 3 > /proc/sys/vm/drop_caches 
ps -ef |grep riskStorm
./riskStorm/shell/run.sh start
ps -ef|grep riskStorm
./riskStorm/shell/run.sh stop
cd riskStorm/logs/
ll
rm -f *
ll
cd
ps -ef|grep riskStorm
./riskStorm/shell/run.sh start
tail -f riskStorm/logs/logFile.2018-12-17.log 
cd
cd riskStorm/logs/
ll
vim logFile.2018-12-17.log 
cd ../bin/
ll
pwd
cd ../shell/
ll
vim run.log 
cd ../logs/
vim logFile.2018-12-17.log 
cd 
vim riskStorm/shell/run.sh 
vim riskStorm/logs/logFile.2018-12-17.log 
vim riskStorm/shell/run.sh 
ps -ef|grep riskStorm
cd
cd riskStorm/logs/
ll
vim logFile.2018-12-17.log 
ll
cd
ps -ef|grep riskStorm/
cd riskStorm/
cd resources/
ll
vim c3p0-config.xml 
cd ../logs/
ll
cd ..
ll
cd shell/
ll
vim run.sh 
cd
cd riskStorm/
ll
tail -f nohup.out 
ll
ll -h
vim nohup.out 
cd
cd riskStorm/
ll
cd logs/
ll
cd ../shell/
ll
./run.sh stop
cd
ps -ef|grep riskStorm/
ps -ef|grep riskStorm
cd riskStorm/shell/
./run.sh start
cd ../logs/
ll
cd
cd riskStorm/
ll
tail -f nohup.out 
ps -ef |grep risk
cd
ll
cd riskStorm/
cd shell/
ll
./run.sh stop
./run.sh start 
vim ../nohup.out 
ps -ef|grep riskStorm
./riskStorm/shell/run.sh stop
ps -ef|grep riskStorm
ps -ef|grep tomcat
./apache-tomcat-8.0.41/bin/shutdown.sh 
ps -ef|grep tomcat
ps -ef |grep tomcat
./apache-tomcat-8.0.41/bin/startup.sh 
tail -f apache-tomcat-8.0.41/logs/catalina.out 
cd dbbackup/
ll
cd test/
ll
vim clearing.sql 
ps -ef|grep riskStorm
vim riskStorm/logs/logFile.2018-12-18.log 
mysql -uroot -p
cd dbbackup/
ll
tar -xvf 2018-12-17--164152.tar.gz 
ll
ls *.sql
ls *.sql|wc -l
count=`ls *.sql|wc -l`
echo $count 
ls *.sql
cp backup-gts-2018-12-17--164152.sql clearing.sql
mkdir test
ll
mv clearing.sql test/
cd test/
ll
mv insert.sh.bak insert.sh
ll
vim insert.sh 
sh insert.sh 
ll
vim insert.sh 
sh insert.sh 
vim insert.sh 
sh insert.sh 
vim insert.sh 
sh insert.sh 
vim insert.sh 
sh insert.sh 
ll
select CONCAT('truncate TABLE ',table_schema,'.',TABLE_NAME, ';') from INFORMATION_SCHEMA.TABLES where table_schema in ('clearing') and TABLE_NAME LIKE 't_oper%'
vim input.sql 
vim clearing.sql 
df -h
fdisk -l
free -h
ps -ef|grep riskStorm
./riskStorm/shell/run.sh start
tail -f riskStorm/nohup.out 
cd
cd KeyGenerator/
java -jar keygenerator.jar 
cd
ps -ef |grep riskStorm
./riskStorm/shell/run.sh stop
ps -ef|grep tomcat
./apache-tomcat-8.0.41/bin/shutdown.sh 
cd apache-tomcat-8.0.41/logs/
ll
rm *
ps  -ef|grep tomcat
./../bin/startup.sh 
tail -f catalina.out 
cd
cd dbbackup/
ll
rm -f *.sql
ll
vim insert.sh 
ll
rm -f *.sql
ll
sh insert.sh 2018-12-17--164152.tar.gz 
ll
vim insert.sh 
sh insert.sh 2018-12-17--164152.tar.gz 
vim insert.sh 
sh insert.sh 2018-12-17--164152.tar.gz 
vim insert.sh 
sh insert.sh 2018-12-17--164152.tar.gz 
ll
rm -f *.sql
ll
cd dbbackup/
ll
cd test/
ll
vim insert.sh 
select CONCAT('truncate TABLE ',table_schema,'.',TABLE_NAME, ';') from INFORMATION_SCHEMA.TABLES where table_schema in ('clearing.sql') and TABLE_NAME LIKE 't_oper%'
select CONCAT('truncate TABLE ',table_schema,'.',TABLE_NAME, ';') from INFORMATION_SCHEMA.TABLES where table_schema in clearing.sql and TABLE_NAME LIKE 't_oper%'
select CONCAT('truncate TABLE ',table_schema,'.',TABLE_NAME, ';') from INFORMATION_SCHEMA.TABLES where table_schema in clearing and TABLE_NAME LIKE 't_oper%'
select CONCAT('truncate TABLE ',table_schema,'.',TABLE_NAME, ';') from INFORMATION_SCHEMA.TABLES
ll
mv insert .sh.bak insert2.sh
ll
rm insert .sh.bak
ll
mv insert.sh.bak insert2.sh
ll
rm input.sql 
ll
vim insert2.sh 
sh insert2.sh 
ll
vim input.sql 
rm input.sql 
vim insert2.sh 
sh insert2.sh 
vim insert2.sh 
rm input.sql 
sh insert2.sh 
vim insert2.sh 
sh insert2.sh 
vim insert2.sh 
sh insert2.sh 
vim insert2.sh 
cd ..
ll
rm 2018-12-17--164152.tar.gz 
ll
cd test/
ll
vim input.sql 
vim insert2.sh 
mv insert2.sh ../
ll
mv insert.sh ../
ll
cd ../
ll
rm backup-2018-11-27--150204.sql.tar.gz 
ll
rm -rf test/
ll
tar -xvf backup-2018-11-27--160346.sql.tar.gz 
ll
mv backup-2018-11-27--160346.sql clearing.sql
ll
sh insert2.sh 
pwd
mv clearing.sql /tmp/
ll
mv insert2.sh /tmp/
ll
rm input.sql 
cd dbbackup/
ll
vim restorQdam.sh 
cd dbbackup/
ll
ivm insert.sh 
vim insert.sh 
vim restorQdam.sh 
vim insert.sh 
ll
sh insert.sh backup-2018-11-27--160346.sql.tar.gz qdam
ll
vim input.sql 
vim insert.sh 
sh insert.sh backup-2018-11-27--160346.sql.tar.gz qdam
ll
rm input.sql 
ll
rm backup-2018-11-27--160346.sql
ll
mv insert.sh insertOper.sh 
ll
sh backup-2018-11-27--160346.sql.tar.gz qdam
sh insertOper.sh backup-2018-11-27--160346.sql.tar.gz qdam
mysql -uroot -p123456
ll
vim insertOper.sh 
rm *.sql
ll
sh insertOper.sh backup-2018-11-27--160346.sql.tar.gz qdam
ll
vim insertOper.sh 
rm *.sql
ll
sh insertOper.sh backup-2018-11-27--160346.sql.tar.gz qdam
rm *.sql
vim insertOper.sh 
ll
sh insertOper.sh backup-2018-11-27--160346.sql.tar.gz qdam
mysql -uroot -p123456
vim insertOper.sh 
ll
rm *.sql
ll
sh insertOper.sh backup-2018-11-27--160346.sql.tar.gz qdam
ll
rm *.sql
ll
vim restorQdam.sh 
ll
ps -ef|grep tomcat
cd apache-tomcat-8.0.41/bin/
ll
./shutdown.sh 
cd
vim apache-tomcat-8.0.41/webapps/quantdo/WEB-INF/classes/c3p0-config.xml 
vim apache-tomcat-8.0.41/webapps/quantdo/WEB-INF/classes/frameworkConfig.properties 
vim apache-tomcat-8.0.41/webapps/quantdo/WEB-INF/classes/configure.properties 
cd apache-tomcat-8.0.41/bin/
./startup.sh 
tail -f ../logs/catalina.out 
cd riskStorm/
cd shell/
ll
./run.sh start 
cd ../
tail nohup.out 
cd logs/
tail -f logFile.2018-12-19.log 
cd apache-tomcat-8.0.41/
cd ..
ll
cd apache-tomcat-8.0.41/
ll
cd webapps/
ll
cd quantdo_page/
ll
cd ..
cd quantdo
ll
cd WEB-INF/
ll
cd classes/
ll
cd ..
cd lib/
ll
cd
cd apache-tomcat-8.0.41/webapps/quantdo/
ll
cd WEB-INF/
ll
cd spring/
ll
cd ../views/
ll
cd ../../
ll
cd ../
cd quantdo_page/
ll
cd apache-tomcat-8.0.41/webapps/quantdo/WEB-INF/classes/
ll
vim c3p0-config.xml 
ps -ef |grep tomcat
cd
cd apache-tomcat-8.0.41/bin/
./shutdown.sh 
ll
cd
cd lo
cd apache-tomcat-8.0.41/
ll
du -sh
cd logs/
ll
rm *
ll
cd ..
ll
du -sh *
mysql -uroot -p
vim webapps/quantdo/WEB-INF/classes/
cd webapps/quantdo/WEB-INF/classes/
ll
vim c3p0-config.xml 
vim configure.properties 
vim frameworkConfig.properties 
cd dbbackup/
ll
cd apache-tomcat-8.0.41/
ll
cd logs/
ll
cd ../bin/
ll
./startup.sh 
cd ../logs/
l
ll
tailf catalina.out 
free -h
df -h
cd ../bin/
ll
./shutdown.sh 
cd ../logs/
ll
rm *
ll
df -h
cd
du -sh
