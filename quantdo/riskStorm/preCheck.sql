DELETE FROM t_risk_storm_status WHERE TYPE='1';

-- oper表资金账号重复
INSERT INTO t_risk_storm_status(type,kindcode,kindname,remark,tradingday,updatetime)
    SELECT '1','accRepeat','t_oper_investoraccount account repeat',CONCAT(a.brokerid,'-',a.investorid),date_format(NOW(), '%Y%m%d'),date_format(NOW(), '%Y%m%d %H:%i:%s')
      FROM t_oper_investoraccount a GROUP BY a.brokerid,a.investorid HAVING COUNT(1)>1;

-- 有账号没有oper表资金
INSERT INTO t_risk_storm_status(type,kindcode,kindname,remark,tradingday,updatetime)
  SELECT '1','accNoOperAcc','there are accounts but not have investoraccount records', CONCAT(inst_client_id,'-',account_id),date_format(NOW(), '%Y%m%d'),date_format(NOW(), '%Y%m%d %H:%i:%s')
    FROM(
	       SELECT DISTINCT a.inst_client_id,a.sub_account_id AS account_id
	         FROM t_sub_capital_account a
	        WHERE NOT EXISTS (SELECT 1 FROM t_oper_investoraccount b WHERE a.inst_client_id=b.brokerid AND a.trader_id=b.investorid) AND a.is_active='1'
	       UNION
	       SELECT DISTINCT a.inst_client_id,a.account_id
					 FROM t_capital_account a,t_oper_seat b
				  WHERE a.inst_client_id=b.brokerid AND a.account_id=b.seatid AND a.is_active='1' AND b.seatstatus<>'1'
        )m;

-- 有持仓没有oper表资金
INSERT INTO t_risk_storm_status(type,kindcode,kindname,remark,tradingday,updatetime)
 SELECT distinct '1','posiNoOperAcc','there are positions but not have investoraccount records',CONCAT(a.brokerid,'-',a.investorid) ,date_format(NOW(), '%Y%m%d'),date_format(NOW(), '%Y%m%d %H:%i:%s')
   FROM t_oper_investorposition a 
  WHERE NOT EXISTS (SELECT 1 
                     FROM t_oper_investoraccount m
                     left join t_oper_seat n ON m.brokerid=n.brokerid AND m.accountid=n.seatid 
                     where (n.seatstatus='1' OR n.seatstatus IS NULL)
                      AND a.brokerid=m.brokerid
                      AND a.accountid=m.accountid);

-- 有持仓没合约信息
INSERT INTO t_risk_storm_status(type,kindcode,kindname,remark,tradingday,updatetime)
SELECT distinct '1','posinoOperInstru','there are positions but not have instrument records',CONCAT(a.exchangeid,'-',a.instrumentid),date_format(NOW(), '%Y%m%d'),date_format(NOW(), '%Y%m%d %H:%i:%s')
  FROM t_oper_investorposition a 
 WHERE NOT EXISTS (SELECT 1 
                     FROM (SELECT exchangeid,instrumentid FROM t_oper_instrument
                            UNION
                           SELECT exchangeid,instrumentid FROM t_last_oper_instrument
                           ) b 
                    WHERE a.exchangeid=b.exchangeid AND a.instrumentid=b.instrumentid);

-- 有持仓没有行情数据
INSERT INTO t_risk_storm_status(type,kindcode,kindname,remark,tradingday,updatetime)
SELECT distinct '1','posiNoOperMkt','there are positions but not have marketdata records',CONCAT(a.exchangeid,'-',a.instrumentid),date_format(NOW(), '%Y%m%d'),date_format(NOW(), '%Y%m%d %H:%i:%s')
  FROM t_oper_investorposition a 
 WHERE NOT EXISTS (SELECT 1 
                     FROM (SELECT exchangeid,instrumentid FROM t_oper_marketdata
                            UNION
                           SELECT exchangeid,instrumentid FROM t_last_oper_marketdata
                           ) b 
                     WHERE a.exchangeid=b.exchangeid AND a.instrumentid=b.instrumentid);


-- 有持仓没有保证金参数
 INSERT INTO t_risk_storm_status(type,kindcode,kindname,remark,tradingday,updatetime)
  SELECT distinct '1','posiNoMrgn','there are positions but not have investormargin records',CONCAT(a.brokerid,'-',a.investorid,'-',a.exchangeid,'-',a.instrumentid),date_format(NOW(), '%Y%m%d'),date_format(NOW(), '%Y%m%d %H:%i:%s')
	  FROM t_oper_investorposition a
	 WHERE NOT EXISTS (SELECT 1 
	                     FROM (SELECT brokerid,investorid,exchangeid,instrumentid,hedgeflag FROM t_dh_last_investormargin
                              union
                             SELECT brokerid,investorid,exchangeid,instrumentid,hedgeflag FROM t_sync_investormargin
                              union
                             SELECT brokerid,investorid,exchangeid,instrumentid,hedgeflag FROM t_last_s_investormargin
                             ) b 
	                    WHERE a.brokerid=b.brokerid AND a.investorid=b.investorid and a.exchangeid=b.exchangeid AND (a.instrumentid=b.instrumentid OR a.productid=b.instrumentid)
                     )
		  AND NOT EXISTS (SELECT 1 FROM t_default_margin_set b WHERE a.brokerid=b.inst_client_id and a.exchangeid=b.exch_id AND a.productid=b.product_id)
			AND a.exchangeid in ('SHFE','DCE','CZCE','CFFEX');

-- 有持仓没有手续费参数
INSERT INTO t_risk_storm_status(type,kindcode,kindname,remark,tradingday,updatetime)
  SELECT distinct '1','posiNoOperFee','there are positions but not have investorfee records',CONCAT(a.exchangeid,'-',a.instrumentid),date_format(NOW(), '%Y%m%d'),date_format(NOW(), '%Y%m%d %H:%i:%s')
    FROM t_oper_investorposition a
   WHERE NOT EXISTS (SELECT 1 
                       FROM (SELECT brokerid,investorid,exchangeid,instrumentid FROM t_dh_last_investorfee
                              UNION
                             SELECT brokerid,investorid,exchangeid,instrumentid FROM t_sync_investorfee
                              UNION
                             SELECT brokerid,investorid,exchangeid,instrumentid FROM t_sync_investoroptionfee
                            ) b WHERE a.brokerid=b.brokerid AND a.investorid=b.investorid and a.exchangeid=b.exchangeid AND (a.instrumentid=b.instrumentid OR a.productid=b.instrumentid))
	   AND NOT EXISTS (SELECT 1 FROM t_default_fee_set b WHERE a.brokerid=b.inst_client_id and a.exchangeid=b.exch_id AND a.productid=b.product_id)
	   AND a.exchangeid in ('SHFE','DCE','CZCE','CFFEX');
