tar -cf $1.tar ./qtrade/flow/* ./qtrade/dump/* ./qtrade/bin/Syslog.log ./qdata/bin/Syslog.log ./qdata/flow/* ./qmdb/bin/Syslog.log ./qmdb/flow/* ./qquery/bin/Syslog.log ./qsdb/bin/Syslog.log ./qsdb/flow/* 
gzip $1.tar
