exec 8<>/dev/tcp/127.0.0.1/8962    #使用文件描述符8以<>(<读>写)方式，打开127.0.0.1的tcp11211端口
ls -l /proc/self/fd                #查看打开的连接8
echo -e "dump" >&8                 #向socket写入数据
cat <&8                            #从socket读入数据
exec 8<&-                          #关闭socket读
exec 8>&-                          #关闭socket写