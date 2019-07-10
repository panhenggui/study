#!/bin/bash
#给CTP订阅合约列表用

username=`whoami`
HOMEB=/home/$username
. $HOMEB/crontab/sql/sqlinfo.cfg

cmdmysql=mysql
SQLPATH=${HOMEB}/crontab/sql

#Copy Ctp instrument
copyctp()
{
	${cmdmysql} -N -h$1 -P$5 -u$2 -p$3 -D$4< $SQLPATH/insctp.sql > $InstrumentInfo/CtpInstrumentfile.file
	echo  "" >> $InstrumentInfo/CtpInstrumentfile.file
	${cmdmysql} -N -h$1 -P$5 -u$2 -p$3 -D$4< $SQLPATH/insctpexchangid.sql > $InstrumentInfo/InstrumentExchangIDtmp.file
	#
	sed 's/\t/,/g' $InstrumentInfo/InstrumentExchangIDtmp.file  > $InstrumentInfo/InstrumentExchangID.file
	echo  "" >> $InstrumentInfo/InstrumentExchangID.file
	rm -rf $InstrumentInfo/InstrumentExchangIDtmp.file
	echo "success"
}

#Copy ES  instrument
copyes()
{
	for (( c=1; c<=$5; c++ ))
	do
	     ${cmdmysql} -N -h$1 -P$6 -u$2 -p$3 -D$4< $SQLPATH/inses$c.sql > $InstrumentInfo/symbol$c.csv_tmp
		 sed 's/\t/,/g' $InstrumentInfo/symbol$c.csv_tmp  > $InstrumentInfo/symbol$c.file
         echo  "" >> $InstrumentInfo/symbol$c.file
		 rm -rf $InstrumentInfo/symbol$c.csv_tmp
	done
	echo "success"
}


#CTP Set SqlInfo
copyctp $CTPHOST $CTPUSER $CTPPASSWD $CTPDBASE $CTPPORT

#CTP Set SqlInfo
copyes $ESHOST $ESUSER $ESPASSWD $ESDBASE $ESLINKNUM $ESPORT

#instrumentfile count 
CTPCOUNT=`cat $InstrumentInfo/InstrumentExchangID.file  | wc -l`
if [ $CTPCOUNT -eq 1 ]
then
  echo "InstrumentExchangID Is Null"
else
#copy CTP instrument
 while read line1 line2 line3 line4 line5  
 do
        QmarketPath=${HOMEB}/$line1/bin

        #file copy
        cp -pr $InstrumentInfo/InstrumentExchangID.file $QmarketPath/
        cp -pr $InstrumentInfo/CtpInstrumentfile.file $QmarketPath/

        echo "copyinstrument file to $QmarketPath!"

  done <  $HOMEB/list/list.run
fi


#instrumentfile count
CTPCOUNT=`cat $InstrumentInfo/*.csv  | wc -l`
if [ $CTPCOUNT -eq 1 ]
then
  echo "ES Is Null"
else
 #copy CTP instrument
 while read line1 line2 line3 line4 line5  
 do
        QmarketPath=${HOMEB}/$line1/bin

        Num=$ESLINKNUM
        #copy ES instrument
        for (( c=1; c <= Num ; c++ ))
        do
                #instrumentfile count
                CTPCOUNT=`cat $InstrumentInfo/symbol${c}.file  | wc -l`
                if (( CTPCOUNT > Num ))
                then
                  cp -pr $InstrumentInfo/symbol${c}.file $QmarketPath/
                fi
        done

        echo "copyinstrument file to $QmarketPath!"

 done <  $HOMEB/list/list.run
fi

