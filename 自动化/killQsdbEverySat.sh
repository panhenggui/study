#!/bin/bash 
export LD_LIBRARY_PATH=.
export PATH=$PATH:/home/qdam/crontab:/home/qdam:/home/qdam/bin
send=`date '+%Y-%m-%d-%H:%M:%S'`
stopall qsdb

