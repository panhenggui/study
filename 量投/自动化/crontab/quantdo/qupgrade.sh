#!/bin/bash
path=/home/crontab
Log=$path/qupgrade.log

main()
{
    >$Log

    
    echo "==========>$0   ����" | tee -a $Log
    date | tee -a $Log
}
main $@;
