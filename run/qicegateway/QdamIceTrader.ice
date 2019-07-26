#pragma once
#include <Ice/Identity.ice>


module QdamIceTrader
{

///响应信息
struct CIceRspInfoField
{
	///错误代码
	int	ErrorID;
	///错误信息
	string	ErrorMsg;
};

///用户登录
struct CIceUserLoginField
{
	///交易日
	string	TradingDay;
	///交易用户代码
	string	UserID;
	///经纪公司编号
	string	BrokerID;
	///密码
	string	Password;
	///用户端产品信息
	string	UserProductInfo;
	///接口端产品信息
	string	InterfaceProductInfo;
	///协议信息
	string	ProtocolInfo;
	///IP地址
	string	IPAddress;
	///Mac地址
	string	MacAddress;
	///数据中心代码
	int	DataCenterID;
	///动态密码
	string	OneTimePassword;
	///终端IP地址
	string	ClientIPAddress;
	///授权编码
	string	AuthCode;
	///自定义字段
	string	FieldContent;
	///登录成功时间
	string	LoginTime;
	///最大报单本地编号
	string	MaxOrderLocalID;
	///交易系统名称
	string	TradingSystemName;
	///用户类型
	string	UserType;
	///最大通讯量
	int	MaxCommFlux;
	///用户名称
	string	UserName;
	///会话编号
	int	SessionID;
	///前置编号
	int	FrontID;
};

///用户登录退出
struct CIceUserLogoutField
{
	///经纪公司编号
	string	BrokerID;
	///交易用户代码
	string	UserID;
};

///用户口令修改
struct CIceUserPasswordUpdateField
{
	///经纪公司编号
	string	BrokerID;
	///交易用户代码
	string	UserID;
	///旧密码
	string	OldPassword;
	///新密码
	string	NewPassword;
};

///输入报单
struct CIceInputOrderField
{
	///经纪公司编号
	string	BrokerID;
	///投资者编号
	string	InvestorID;
	///用户代码
	string	UserID;
	///用户本地报单号
	string	UserOrderLocalID;
	///用户自定义域
	string	UserCustom;
	///交易所代码
	string	ExchangeID;
	///系统报单编号
	string	OrderSysID;
	///合约代码
	string	InstrumentID;
	///报单类型
	string	OrderPriceType;
	///买卖方向
	string	Direction;
	///开平标志
	string	OffsetFlag;
	///投机套保标志
	string	HedgeFlag;
	///价格
	double	LimitPrice;
	///数量
	int	Volume;
	///有效期类型
	string	TimeCondition;
	///GTD日期
	string	GTDDate;
	///成交量类型
	string	VolumeCondition;
	///最小成交量
	int	MinVolume;
	///止损价
	double	StopPrice;
	///强平原因
	string	ForceCloseReason;
	///自动挂起标志
	int	IsAutoSuspend;
	///业务单元
	string	BusinessUnit;
	///业务类别
	string	BusinessType;
};

///报单操作
struct CIceOrderActionField
{
	///经纪公司编号
	string	BrokerID;
	///投资者编号
	string	InvestorID;
	///用户代码
	string	UserID;
	///用户本地报单号
	string	UserOrderLocalID;
	///用户自定义域
	string	UserCustom;
	///交易所代码
	string	ExchangeID;
	///报单编号
	string	OrderSysID;
	///合约代码
	string	InstrumentID;
	///本次撤单操作的本地编号
	string	UserOrderActionLocalID;
	///报单操作标志
	string	ActionFlag;
	///价格
	double	LimitPrice;
	///数量变化
	int	VolumeChange;
	///前置编号
	int	FrontID;
	///会话编号
	int	SessionID;
};

///最大可交易数量查询应答
struct CIceMaxVolumeField
{
	///经纪公司编号
	string	BrokerID;
	///用户代码
	string	UserID;
	///投资者编号
	string	InvestorID;
	///交易所代码
	string	ExchangeID;
	///合约代码
	string	InstrumentID;
	///买卖方向
	string	Direction;
	///开平标志
	string	OffsetFlag;
	///投机套保标志
	string	HedgeFlag;
	///价格
	double	LimitPrice;
	///登录经纪公司编号
	string	LogBrokerID;
	///登录用户代码
	string	LogUserID;
	///用户端接口版本
	string	ApiVersion;
	///用户端程序版本
	string	UserVersion;
	///前置编号
	int	FrontID;
	///会话编号
	int	SessionID;
	///请求编号
	int	RequestID;
	///数量
	int	Volume;
};
sequence<CIceMaxVolumeField> CIceMaxVolumeSeq;

///报单查询
struct CIceQryOrderField
{
	///经纪公司编号
	string	BrokerID;
	///用户代码
	string	UserID;
	///交易所代码
	string	ExchangeID;
	///投资者编号
	string	InvestorID;
	///报单编号
	string	OrderSysID;
	///合约代码
	string	InstrumentID;
};

///成交查询
struct CIceQryTradeField
{
	///经纪公司编号
	string	BrokerID;
	///用户代码
	string	UserID;
	///交易所代码
	string	ExchangeID;
	///投资者编号
	string	InvestorID;
	///成交编号
	string	TradeID;
	///合约代码
	string	InstrumentID;
};

///合约查询
struct CIceQryInstrumentField
{
	///交易所代码
	string	ExchangeID;
	///产品代码
	string	ProductID;
	///合约代码
	string	InstrumentID;
};

///合约
struct CIceInstrumentField
{
	///交易所代码
	string	ExchangeID;
	///品种代码
	string	ProductID;
	///品种名称
	string	ProductName;
	///合约代码
	string	InstrumentID;
	///合约名称
	string	InstrumentName;
	///交割年份
	int	DeliveryYear;
	///交割月
	int	DeliveryMonth;
	///限价单最大下单量
	int	MaxLimitOrderVolume;
	///限价单最小下单量
	int	MinLimitOrderVolume;
	///市价单最大下单量
	int	MaxMarketOrderVolume;
	///市价单最小下单量
	int	MinMarketOrderVolume;
	///数量乘数
	int	VolumeMultiple;
	///报价单位
	double	PriceTick;
	///币种
	string	Currency;
	///多头限仓
	int	LongPosLimit;
	///空头限仓
	int	ShortPosLimit;
	///跌停板价
	double	LowerLimitPrice;
	///涨停板价
	double	UpperLimitPrice;
	///昨结算
	double	PreSettlementPrice;
	///合约交易状态
	string	InstrumentStatus;
	///创建日
	string	CreateDate;
	///上市日
	string	OpenDate;
	///到期日
	string	ExpireDate;
	///开始交割日
	string	StartDelivDate;
	///最后交割日
	string	EndDelivDate;
	///挂牌基准价
	double	BasisPrice;
	///当前是否交易
	int	IsTrading;
	///基础商品代码
	string	UnderlyingInstrID;
	///基础商品乘数
	int	UnderlyingMultiple;
	///持仓类型
	string	PositionType;
	///执行价
	double	StrikePrice;
	///期权类型
	string	OptionsType;
	///汇率
	double	ExchangeRate;
	///产品类型
	string	ProductClass;
	///期权行权方式
	string	OptionsMode;
	///保证金算法类型
	string	MarginCombType;
};
sequence<CIceInstrumentField> CIceInstrumentSeq;

///投资者资金查询
struct CIceQryInvestorAccountField
{
	///经纪公司编号
	string	BrokerID;
	///用户代码
	string	UserID;
	///投资者编号
	string	InvestorID;
};

///投资者资金账户
struct CIceInvestorAccountField
{
	///经纪公司编号
	string	BrokerID;
	///投资者编号
	string	InvestorID;
	///资金帐号
	string	AccountID;
	///上次结算准备金
	double	PreBalance;
	///上日可用资金
	double	PreAvailable;
	///入金金额
	double	Deposit;
	///出金金额
	double	Withdraw;
	///占用保证金
	double	Margin;
	///期权权利金收支
	double	Premium;
	///手续费
	double	Fee;
	///冻结的保证金
	double	FrozenMargin;
	///冻结权利金
	double	FrozenPremium;
	///冻结手续费
	double	FrozenFee;
	///平仓盈亏
	double	CloseProfit;
	///持仓盈亏
	double	PositionProfit;
	///可用资金
	double	Available;
	///结算准备金
	double	Balance;
	///多头占用保证金
	double	LongMargin;
	///空头占用保证金
	double	ShortMargin;
	///多头冻结的保证金
	double	LongFrozenMargin;
	///空头冻结的保证金
	double	ShortFrozenMargin;
	///动态权益
	double	DynamicRights;
	///风险度
	double	Risk;
	///其他费用
	double	OtherFee;
	///质押金额
	double	Mortgage;
	///币种
	string	Currency;
};
sequence<CIceInvestorAccountField> CIceInvestorAccountSeq;

///可用投资者账户查询
struct CIceQryUserInvestorField
{
	///经纪公司编号
	string	BrokerID;
	///用户代码
	string	UserID;
};

///用户投资者关系
struct CIceUserInvestorField
{
	///经纪公司编号
	string	BrokerID;
	///交易用户代码
	string	UserID;
	///投资者编号
	string	InvestorID;
	///默认用户代码
	string	NextUserID;
	///是否可下单
	string	OrderMode;
	///自动或者手动
	string	RunMode;
	///工作流断线处理标示符
	string	AdviceSwitchFlag;
};
sequence<CIceUserInvestorField> CIceUserInvestorSeq;

///投资者关系
struct CIceQryInvestorRelationField
{
	///经纪公司编号
	string	BrokerID;
	///用户代码
	string	UserID;
	///投资者编号
	string	InvestorID;
};

///投资者父子关系表
struct CIceInvestorRelationField
{
	///经纪公司编号
	string	BrokerID;
	///投资者编号
	string	InvestorID;
	///父投资者编号
	string	ParentInvestorID;
	///顺序编号
	int	SpecifyNo;
};
sequence<CIceInvestorRelationField> CIceInvestorRelationSeq;

///交易所查询
struct CIceQryExchangeField
{
	///交易所代码
	string	ExchangeID;
};

///交易所应答
struct CIceExchangeField
{
	///交易日
	string	TradingDay;
	///交易所代码
	string	ExchangeID;
	///交易所名称
	string	ExchangeName;
};
sequence<CIceExchangeField> CIceExchangeSeq;

///投资者持仓请求
struct CIceQryInvestorPositionField
{
	///经纪公司编号
	string	BrokerID;
	///用户代码
	string	UserID;
	///交易所代码
	string	ExchangeID;
	///投资者编号
	string	InvestorID;
	///合约代码
	string	InstrumentID;
};

///投资者合约持仓
struct CIceInvestorPositionField
{
	///经纪公司编号
	string	BrokerID;
	///交易所代码
	string	ExchangeID;
	///投资者编号
	string	InvestorID;
	///合约代码
	string	InstrumentID;
	///买卖方向
	string	Direction;
	///投机套保标志
	string	HedgeFlag;
	///占用保证金
	double	UsedMargin;
	///总持仓量
	int	Position;
	///总持仓成本
	double	PositionCost;
	///初始昨持仓量(当日不变)
	int	YdPosition;
	///初始昨日持仓成本(当日不变)
	double	YdPositionCost;
	///冻结的保证金
	double	FrozenMargin;
	///开仓冻结持仓
	int	FrozenPosition;
	///平仓冻结持仓
	int	FrozenClosing;
	///持仓盈亏
	double	PositionProfit;
	///冻结的权利金
	double	FrozenPremium;
	///最后一笔成交编号
	string	LastTradeID;
	///最后一笔本地报单编号
	string	LastOrderLocalID;
	///总持仓可平仓数量(包括平仓冻结持仓)
	int	PositionClose;
	///昨持仓可平仓数量(包括平仓冻结持仓)
	int	YdPositionClose;
	///昨持仓平仓冻结持仓
	int	YdFrozenClosing;
	///今日开仓数量(不包括冻结)
	int	OpenVolume;
	///今日平仓数量(包括昨持仓的平仓,不包括冻结)
	int	CloseVolume;
	///平仓盈亏
	double	CloseProfit;
	///执行冻结持仓
	int	StrikeFrozenPosition;
	///放弃执行冻结持仓
	int	AbandonFrozenPosition;
	///开仓成本
	double	OpenCost;
};
sequence<CIceInvestorPositionField> CIceInvestorPositionSeq;

///用户查询
struct CIceQryUserField
{
	///交易用户代码
	string	StartUserID;
	///交易用户代码
	string	EndUserID;
};

///用户
struct CIceUserField
{
	///经纪公司编号
	string	BrokerID;
	///用户代码
	string	UserID;
	///用户登录密码
	string	Password;
	///是否活跃
	string	IsActive;
	///用户名称
	string	UserName;
	///用户类型
	string	UserType;
	///营业部
	string	Department;
	///授权功能集
	string	GrantFuncSet;
	///最大在线数
	int	MaxOnline;
	///IP地址
	string	IPAddress;
	///是否检查连接产品
	int	CheckProductInfo;
	///Mac地址
	string	MacAddress;
	///是否检查IP和MAC
	int	CheckIPMacAddr;
	///错误登陆次数限制
	int	LoginErrorLimit;
	///目前错误登陆次数
	int	LoginErrorCount;
	///硬盘序列号
	string	HDSerialID;
	///密码是否更新
	string	IsUpdate;
};
sequence<CIceUserField> CIceUserSeq;

///投资者手续费率查询
struct CIceQryInvestorFeeField
{
	///经纪公司编号
	string	BrokerID;
	///用户代码
	string	UserID;
	///投资者编号
	string	InvestorID;
	///交易所代码
	string	ExchangeID;
	///合约代码
	string	InstrumentID;
};

///投资者手续费
struct CIceInvestorFeeField
{
	///经纪公司编号
	string	BrokerID;
	///交易所代码
	string	ExchangeID;
	///投资者编码
	string	InvestorID;
	///合约代码
	string	InstrumentID;
	///开仓手续费按比例
	double	OpenFeeRate;
	///开仓手续费按手数
	double	OpenFeeAmt;
	///平仓手续费按比例
	double	OffsetFeeRate;
	///平仓手续费按手数
	double	OffsetFeeAmt;
	///平今仓手续费按比例
	double	OTFeeRate;
	///平今仓手续费按手数
	double	OTFeeAmt;
};
sequence<CIceInvestorFeeField> CIceInvestorFeeSeq;

///投资者保证金率查询
struct CIceQryInvestorMarginField
{
	///经纪公司编号
	string	BrokerID;
	///用户代码
	string	UserID;
	///投资者编号
	string	InvestorID;
	///交易所代码
	string	ExchangeID;
	///合约代码
	string	InstrumentID;
	///投机套保标志
	string	HedgeFlag;
};

///投资者保证金率
struct CIceInvestorMarginField
{
	///经纪公司编号
	string	BrokerID;
	///交易所代码
	string	ExchangeID;
	///投资者编码
	string	InvestorID;
	///合约代码
	string	InstrumentID;
	///投机套保标志
	string	HedgeFlag;
	///多头占用保证金按比例
	double	LongMarginRate;
	///多头保证金按手数
	double	LongMarginAmt;
	///空头占用保证金按比例
	double	ShortMarginRate;
	///空头保证金按手数
	double	ShortMarginAmt;
};
sequence<CIceInvestorMarginField> CIceInvestorMarginSeq;

///投资者查询
struct CIceQryInvestorField
{
	///经纪公司编号
	string	BrokerID;
	///用户代码
	string	UserID;
	///投资者编号
	string	InvestorID;
};

///投资者
struct CIceInvestorField
{
	///经纪公司编号
	string	BrokerID;
	///投资者编号
	string	InvestorID;
	///投资者名称
	string	InvestorName;
	///投资者类型
	string	InvestorType;
	///投资者组编号
	string	GroupID;
	///投资者组名
	string	GroupName;
	///别名
	string	Alias;
	///连接类型
	string	LinkType;
	///资金账户编号
	string	ParentInvestorID;
	///登录次数
	int	LoginStatus;
	///是否使用净持仓报单,投顾账户有效
	string	PositionType;
	///自成交处理方式,资金账户有效
	string	SelfTradeAvoidType;
	///交易权限
	string	TradingRight;
	///是否检查资金
	int	CheckAccount;
	///是否检查持仓
	int	CheckPosition;
	///报单是否报警
	int	OrderWarning;
	///资金持仓是否上查
	int	QryUpAccPosi;
	///投顾选择资金账户类型
	string	DistributeType;
};
sequence<CIceInvestorField> CIceInvestorSeq;

///投资者风险账户查询
struct CIceQryAccountRiskField
{
	///经纪公司编号
	string	BrokerID;
	///用户代码
	string	UserID;
	///投资者编号
	string	InvestorID;
};

///风控表
struct CIceAccountRiskField
{
	///经纪公司编号
	string	BrokerID;
	///投资者编号
	string	InvestorID;
	///资金帐号
	string	AccountID;
	///设置准备金
	double	SetBalance;
	///开仓红线
	double	OpenAvailable;
	///平仓红线
	double	OffsetAvailable;
	///账户状态
	string	AccountStatus;
	///动态权益
	double	DynamicRights;
	///账户权限
	string	TradingRight;
};
sequence<CIceAccountRiskField> CIceAccountRiskSeq;

///最大可交易数量查询请求
struct CIceQryMaxVolumeField
{
	///经纪公司编号
	string	BrokerID;
	///用户代码
	string	UserID;
	///投资者编号
	string	InvestorID;
	///交易所代码
	string	ExchangeID;
	///合约代码
	string	InstrumentID;
	///买卖方向
	string	Direction;
	///开平标志
	string	OffsetFlag;
	///投机套保标志
	string	HedgeFlag;
	///价格
	double	LimitPrice;
	///登录经纪公司编号
	string	LogBrokerID;
	///登录用户代码
	string	LogUserID;
	///用户端接口版本
	string	ApiVersion;
	///用户端程序版本
	string	UserVersion;
	///前置编号
	int	FrontID;
	///会话编号
	int	SessionID;
	///请求编号
	int	RequestID;
};

///成交
struct CIceTradeField
{
	///交易日
	string	TradingDay;
	///经纪公司编号
	string	BrokerID;
	///投资者编号
	string	InvestorID;
	///用户代码
	string	UserID;
	///用户本地报单号
	string	UserOrderLocalID;
	///用户自定义域
	string	UserCustom;
	///交易所代码
	string	ExchangeID;
	///成交编号
	string	TradeID;
	///报单编号
	string	OrderSysID;
	///合约代码
	string	InstrumentID;
	///买卖方向
	string	Direction;
	///开平标志
	string	OffsetFlag;
	///投机套保标志
	string	HedgeFlag;
	///成交价格
	double	TradePrice;
	///成交数量
	int	TradeVolume;
	///成交时间
	string	TradeTime;
	///清算会员编号
	string	ClearingPartID;
	///成交金额
	double	TradeAmnt;
	///交易类型
	string	TradeType;
	///营业部代码
	string	BranchID;
	///营业部名称
	string	BranchName;
};
sequence<CIceTradeField> CIceTradeSeq;

///报单
struct CIceOrderField
{
	///经纪公司编号
	string	BrokerID;
	///投资者编号
	string	InvestorID;
	///用户代码
	string	UserID;
	///用户本地报单号
	string	UserOrderLocalID;
	///用户自定义域
	string	UserCustom;
	///交易所代码
	string	ExchangeID;
	///系统报单编号
	string	OrderSysID;
	///合约代码
	string	InstrumentID;
	///报单类型
	string	OrderPriceType;
	///买卖方向
	string	Direction;
	///开平标志
	string	OffsetFlag;
	///投机套保标志
	string	HedgeFlag;
	///价格
	double	LimitPrice;
	///数量
	int	Volume;
	///有效期类型
	string	TimeCondition;
	///GTD日期
	string	GTDDate;
	///成交量类型
	string	VolumeCondition;
	///最小成交量
	int	MinVolume;
	///止损价
	double	StopPrice;
	///强平原因
	string	ForceCloseReason;
	///自动挂起标志
	int	IsAutoSuspend;
	///业务单元
	string	BusinessUnit;
	///业务类别
	string	BusinessType;
	///交易日
	string	TradingDay;
	///插入时间
	string	InsertTime;
	///报单来源
	string	OrderSource;
	///报单状态
	string	OrderStatus;
	///撤销时间
	string	CancelTime;
	///撤单用户编号
	string	CancelUserID;
	///已经成交数量
	int	VolumeTraded;
	///队列剩余数量
	int	VolumeRemain;
	///已经撤单数量
	int	VolumeCancled;
	///错误代码
	int	ErrorID;
	///错误信息
	string	ErrorMsg;
	///比上次增加的撤单数量
	int	VolumeIncCancled;
	///比上次增加的成交数量
	int	VolumeIncTraded;
	///资金帐号
	string	AccountID;
	///前置编号
	int	FrontID;
	///会话编号
	int	SessionID;
	///请求编号
	int	RequestID;
	///每手手续费
	double	EachFee;
	///每手保证金
	double	EachMargin;
	///每手期权权利金收支
	double	EachPremium;
	///下单IP地址
	string	IPAddress;
	///下单MAC地址
	string	MacAddress;
	///营业部代码
	string	BranchID;
	///记录编号
	int	RecNum;
	///硬盘序列号
	string	HDSerialID;
	///营业部名称
	string	BranchName;
};
sequence<CIceOrderField> CIceOrderSeq;

///出入金回报通知
struct CIceInvestorAccountDepositNtfField
{
	///经纪公司编号
	string	BrokerID;
	///投资者编号
	string	InvestorID;
	///资金帐号
	string	AccountID;
	///资金流水号
	string	AccountSeqNo;
	///金额
	double	Amount;
	///出入金方向
	string	AmountDirection;
	///可用资金
	double	Available;
	///结算准备金
	double	Balance;
	///用户代码
	string	UserID;
};

///警告消息通知
struct CIceMessageNotifyField
{
	///经纪公司编号
	string	BrokerID;
	///修改用户编号
	string	UserID;
	///投资者编号
	string	InvestorID;
	///累加次数
	int	Nums;
	///警告级别
	string	WarnLevel;
	///警告编号
	int	WarnID;
	///警告信息
	string	WarnMsg;
	///警告时间
	string	WarnTime;
};


///无效会话异常
exception SessionError {};

interface QdamIceTraderSpi
{

	///成交通知
	void OnRtnTrade(int SequenceNo, CIceTradeField Trade);

	///报单通知
	void OnRtnOrder(int SequenceNo, CIceOrderField Order);

	///报单录入错误通知
	void OnErrRtnOrderInsert(int SequenceNo, CIceInputOrderField InputOrder, CIceRspInfoField RspInfo);

	///报单操作错误通知
	void OnErrRtnOrderAction(int SequenceNo, CIceOrderActionField OrderAction, CIceRspInfoField RspInfo);

	///合约交易状态改变通知
	void OnRtnInstrumentStatusUpdate(int SequenceNo, CIceInstrumentField Instrument);

	///出入金回报通知
	void OnRtnInvestorAccountDeposit(int SequenceNo, CIceInvestorAccountDepositNtfField InvestorAccountDepositNtf);

	///警告消息通知
	void OnRtnMessageNotify(int SequenceNo, CIceMessageNotifyField MessageNotify);
};

interface QdamIceTraderApi
{
	///用户登录请求
	["amd"] void ReqUserLogin(CIceUserLoginField ReqUserLogin, Ice::Identity ident, int MaxSequenceNo, out CIceUserLoginField LoginRspInfo, out CIceRspInfoField RspInfo, out int SessionID)throws SessionError;

	///用户退出请求
	["amd"] void ReqUserLogout(int SessionID, CIceUserLogoutField UserLogout, out CIceRspInfoField RspInfo)throws SessionError;
	
	///用户密码修改请求
	["amd"] void ReqUserPasswordUpdate(int SessionID, CIceUserPasswordUpdateField UserPasswordUpdate, out CIceRspInfoField RspInfo)throws SessionError;
	
	///报单录入请求
	["amd"] void ReqOrderInsert(int SessionID, CIceInputOrderField InputOrder, out CIceRspInfoField RspInfo)throws SessionError;
	
	///报单操作请求
	["amd"] void ReqOrderAction(int SessionID, CIceOrderActionField OrderAction, out CIceRspInfoField RspInfo)throws SessionError;
	
	///投资者资金查询请求
	["amd"] void ReqQryInvestorAccount(int SessionID, CIceQryInvestorAccountField QryInvestorAccount, out CIceInvestorAccountSeq InvestorAccounts, out CIceRspInfoField RspInfo)throws SessionError;

	///报单查询请求
	["amd"] void ReqQryOrder(int SessionID, CIceQryOrderField QryOrder, out CIceOrderSeq Orders, out CIceRspInfoField RspInfo)throws SessionError;

	///成交单查询请求
	["amd"] void ReqQryTrade(int SessionID, CIceQryTradeField QryTrade, out CIceTradeSeq Trades, out CIceRspInfoField RspInfo)throws SessionError;

	///投资者查询请求
	["amd"] void ReqQryInvestor(int SessionID, CIceQryInvestorField QryInvestor, out CIceInvestorSeq Investors, out CIceRspInfoField RspInfo)throws SessionError;

	///合约查询请求
	["amd"] void ReqQryInstrument(int SessionID, CIceQryInstrumentField QryInstrument, out CIceInstrumentSeq Instruments, out CIceRspInfoField RspInfo)throws SessionError;

	///用户查询请求
	["amd"] void ReqQryUser(int SessionID, CIceQryUserField QryUser, out CIceUserSeq Users, out CIceRspInfoField RspInfo)throws SessionError;

	///交易所查询请求
	["amd"] void ReqQryExchange(int SessionID, CIceQryExchangeField QryExchange, out CIceExchangeSeq Exchanges, out CIceRspInfoField RspInfo)throws SessionError;

	///可用投资者账户查询请求
	["amd"] void ReqQryUserInvestor(int SessionID, CIceQryUserInvestorField QryUserInvestor, out CIceUserInvestorSeq UserInvestors, out CIceRspInfoField RspInfo)throws SessionError;

	///投资者持仓查询请求
	["amd"] void ReqQryInvestorPosition(int SessionID, CIceQryInvestorPositionField QryInvestorPosition, out CIceInvestorPositionSeq InvestorPositions, out CIceRspInfoField RspInfo)throws SessionError;

	///投资者手续费率查询请求
	["amd"] void ReqQryInvestorFee(int SessionID, CIceQryInvestorFeeField QryInvestorFee, out CIceInvestorFeeSeq InvestorFees, out CIceRspInfoField RspInfo)throws SessionError;

	///投资者保证金率查询请求
	["amd"] void ReqQryInvestorMargin(int SessionID, CIceQryInvestorMarginField QryInvestorMargin, out CIceInvestorMarginSeq InvestorMargins, out CIceRspInfoField RspInfo)throws SessionError;

	///投资者关系查询请求
	["amd"] void ReqQryInvestorRelation(int SessionID, CIceQryInvestorRelationField QryInvestorRelation, out CIceInvestorRelationSeq InvestorRelations, out CIceRspInfoField RspInfo)throws SessionError;

	///账号风险状况查询请求
	["amd"] void ReqQryAccountRisk(int SessionID, CIceQryAccountRiskField QryAccountRisk, out CIceAccountRiskSeq AccountRisks, out CIceRspInfoField RspInfo)throws SessionError;

	///最大可交易数量查询请求
	["amd"] void ReqQryMaxVolume(int SessionID, CIceQryMaxVolumeField QryMaxVolume, out CIceMaxVolumeSeq MaxVolumes, out CIceRspInfoField RspInfo)throws SessionError;

	///心跳
	bool HeartBeat(int SessionID) throws SessionError;
};


};
