exec 8<>/dev/tcp/127.0.0.1/8962    #ʹ���ļ�������8��<>(<��>д)��ʽ����127.0.0.1��tcp11211�˿�
ls -l /proc/self/fd                #�鿴�򿪵�����8
echo -e "dump" >&8                 #��socketд������
cat <&8                            #��socket��������
exec 8<&-                          #�ر�socket��
exec 8>&-                          #�ر�socketд