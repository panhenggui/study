#!/bin/bash
diff ~/test.txt ~/test2.txt >diff.txt
grep "^[0-9]\{1,13\},[0-9]\{1,13\}c[0-9]\{1,13\},[0-9]\{1,13\}$" diff.txt >c
#awk -F[,c] '{print $1,$2}' ~/c >a
mun=`awk '{print NR}' c|tail -n1`
if [ -n mun ];then	
   for i in $(seq 1 $mun)
   do 
       mun1=`awk -F[,c] 'NR=="'$i'"{print $1}' c`
       mun2=`awk -F[,c] 'NR=="'$i'"{print $2}' c`
       mun3=`awk -F[,c] 'NR=="'$i'"{print $3}' c`
       mun4=`awk -F[,c] 'NR=="'$i'"{print $4}' c`
       for i in `seq $mun1 $mun2`
       do
            sed -i "${mun3}c '@`sed -n ${i}p ~/test.txt`'@" ~/test2.txt
            sed -i "s/'@//g" ~/test2.txt
            let mun3=$mun3+1
       done
   done
fi
grep "^[0-9]\{1,13\}c[0-9]\{1,13\}$" diff.txt >c
mun=`awk '{print NR}' c|tail -n1`  
if [ -n mun ];then
   for i in $(seq 1 $mun)
   do
       mun1=`awk -F[,c] 'NR=="'$i'"{print $1}' c`
       mun2=`awk -F[,c] 'NR=="'$i'"{print $2}' c`
       sed -i "${mun2}c '@`sed -n ${mun1}p ~/test.txt`'@" ~/test2.txt
       sed -i "s/'@//g" ~/test2.txt
   done
fi
