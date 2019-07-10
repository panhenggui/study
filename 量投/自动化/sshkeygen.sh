#!/bin/bash
#Author:LIncyou
#-t指定SSH密钥的算法为RSA算法，-N设置密码为空，-f指定生成的密钥文件存放位置

#rm -rf ~/.ssh/{known_hosts,id_rsa*}       
ssh-keygen -t rsa -n '' -f ~/.ssh/id_rsa    #//生成密钥

yum -y install expect                             #  //安装expect预期交互

expect << EOF
spawn ssh-copy-id 192.168.12.152               
expect "(yes/no)?" {send "yes\r"}
expect "password:" {send "Wedotting325\r"}
expect "#" {send "exit\r"}
EOF
mkdir ~/crontab /home/web/crontab
scp root@192.168.12.152:/root/crontab/155/* ~/crontab
chmod +x ~/crontab/*
scp root@192.168.12.152:~/crontab/web/* /home/web/crontab/
chown web:web /home/web/crontab/ -R
chmod +x /home/web/crontab/chk_proc.sh
