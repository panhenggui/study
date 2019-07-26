#!/bin/bash
path=/home/crontab
Log=$path/qupgrade.log

main()
{
    >$Log

    
    echo "==========>$0   ½áÊø" | tee -a $Log
    date | tee -a $Log
}
main $@;
