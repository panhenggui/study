#pragma once
#include <Ice/Identity.ice>


module QdamIceTrader
{

///��Ӧ��Ϣ
struct CIceRspInfoField
{
	///�������
	int	ErrorID;
	///������Ϣ
	string	ErrorMsg;
};

///�û���¼
struct CIceUserLoginField
{
	///������
	string	TradingDay;
	///�����û�����
	string	UserID;
	///���͹�˾���
	string	BrokerID;
	///����
	string	Password;
	///�û��˲�Ʒ��Ϣ
	string	UserProductInfo;
	///�ӿڶ˲�Ʒ��Ϣ
	string	InterfaceProductInfo;
	///Э����Ϣ
	string	ProtocolInfo;
	///IP��ַ
	string	IPAddress;
	///Mac��ַ
	string	MacAddress;
	///�������Ĵ���
	int	DataCenterID;
	///��̬����
	string	OneTimePassword;
	///�ն�IP��ַ
	string	ClientIPAddress;
	///��Ȩ����
	string	AuthCode;
	///�Զ����ֶ�
	string	FieldContent;
	///��¼�ɹ�ʱ��
	string	LoginTime;
	///��󱨵����ر��
	string	MaxOrderLocalID;
	///����ϵͳ����
	string	TradingSystemName;
	///�û�����
	string	UserType;
	///���ͨѶ��
	int	MaxCommFlux;
	///�û�����
	string	UserName;
	///�Ự���
	int	SessionID;
	///ǰ�ñ��
	int	FrontID;
};

///�û���¼�˳�
struct CIceUserLogoutField
{
	///���͹�˾���
	string	BrokerID;
	///�����û�����
	string	UserID;
};

///�û������޸�
struct CIceUserPasswordUpdateField
{
	///���͹�˾���
	string	BrokerID;
	///�����û�����
	string	UserID;
	///������
	string	OldPassword;
	///������
	string	NewPassword;
};

///���뱨��
struct CIceInputOrderField
{
	///���͹�˾���
	string	BrokerID;
	///Ͷ���߱��
	string	InvestorID;
	///�û�����
	string	UserID;
	///�û����ر�����
	string	UserOrderLocalID;
	///�û��Զ�����
	string	UserCustom;
	///����������
	string	ExchangeID;
	///ϵͳ�������
	string	OrderSysID;
	///��Լ����
	string	InstrumentID;
	///��������
	string	OrderPriceType;
	///��������
	string	Direction;
	///��ƽ��־
	string	OffsetFlag;
	///Ͷ���ױ���־
	string	HedgeFlag;
	///�۸�
	double	LimitPrice;
	///����
	int	Volume;
	///��Ч������
	string	TimeCondition;
	///GTD����
	string	GTDDate;
	///�ɽ�������
	string	VolumeCondition;
	///��С�ɽ���
	int	MinVolume;
	///ֹ���
	double	StopPrice;
	///ǿƽԭ��
	string	ForceCloseReason;
	///�Զ������־
	int	IsAutoSuspend;
	///ҵ��Ԫ
	string	BusinessUnit;
	///ҵ�����
	string	BusinessType;
};

///��������
struct CIceOrderActionField
{
	///���͹�˾���
	string	BrokerID;
	///Ͷ���߱��
	string	InvestorID;
	///�û�����
	string	UserID;
	///�û����ر�����
	string	UserOrderLocalID;
	///�û��Զ�����
	string	UserCustom;
	///����������
	string	ExchangeID;
	///�������
	string	OrderSysID;
	///��Լ����
	string	InstrumentID;
	///���γ��������ı��ر��
	string	UserOrderActionLocalID;
	///����������־
	string	ActionFlag;
	///�۸�
	double	LimitPrice;
	///�����仯
	int	VolumeChange;
	///ǰ�ñ��
	int	FrontID;
	///�Ự���
	int	SessionID;
};

///���ɽ���������ѯӦ��
struct CIceMaxVolumeField
{
	///���͹�˾���
	string	BrokerID;
	///�û�����
	string	UserID;
	///Ͷ���߱��
	string	InvestorID;
	///����������
	string	ExchangeID;
	///��Լ����
	string	InstrumentID;
	///��������
	string	Direction;
	///��ƽ��־
	string	OffsetFlag;
	///Ͷ���ױ���־
	string	HedgeFlag;
	///�۸�
	double	LimitPrice;
	///��¼���͹�˾���
	string	LogBrokerID;
	///��¼�û�����
	string	LogUserID;
	///�û��˽ӿڰ汾
	string	ApiVersion;
	///�û��˳���汾
	string	UserVersion;
	///ǰ�ñ��
	int	FrontID;
	///�Ự���
	int	SessionID;
	///������
	int	RequestID;
	///����
	int	Volume;
};
sequence<CIceMaxVolumeField> CIceMaxVolumeSeq;

///������ѯ
struct CIceQryOrderField
{
	///���͹�˾���
	string	BrokerID;
	///�û�����
	string	UserID;
	///����������
	string	ExchangeID;
	///Ͷ���߱��
	string	InvestorID;
	///�������
	string	OrderSysID;
	///��Լ����
	string	InstrumentID;
};

///�ɽ���ѯ
struct CIceQryTradeField
{
	///���͹�˾���
	string	BrokerID;
	///�û�����
	string	UserID;
	///����������
	string	ExchangeID;
	///Ͷ���߱��
	string	InvestorID;
	///�ɽ����
	string	TradeID;
	///��Լ����
	string	InstrumentID;
};

///��Լ��ѯ
struct CIceQryInstrumentField
{
	///����������
	string	ExchangeID;
	///��Ʒ����
	string	ProductID;
	///��Լ����
	string	InstrumentID;
};

///��Լ
struct CIceInstrumentField
{
	///����������
	string	ExchangeID;
	///Ʒ�ִ���
	string	ProductID;
	///Ʒ������
	string	ProductName;
	///��Լ����
	string	InstrumentID;
	///��Լ����
	string	InstrumentName;
	///�������
	int	DeliveryYear;
	///������
	int	DeliveryMonth;
	///�޼۵�����µ���
	int	MaxLimitOrderVolume;
	///�޼۵���С�µ���
	int	MinLimitOrderVolume;
	///�м۵�����µ���
	int	MaxMarketOrderVolume;
	///�м۵���С�µ���
	int	MinMarketOrderVolume;
	///��������
	int	VolumeMultiple;
	///���۵�λ
	double	PriceTick;
	///����
	string	Currency;
	///��ͷ�޲�
	int	LongPosLimit;
	///��ͷ�޲�
	int	ShortPosLimit;
	///��ͣ���
	double	LowerLimitPrice;
	///��ͣ���
	double	UpperLimitPrice;
	///�����
	double	PreSettlementPrice;
	///��Լ����״̬
	string	InstrumentStatus;
	///������
	string	CreateDate;
	///������
	string	OpenDate;
	///������
	string	ExpireDate;
	///��ʼ������
	string	StartDelivDate;
	///��󽻸���
	string	EndDelivDate;
	///���ƻ�׼��
	double	BasisPrice;
	///��ǰ�Ƿ���
	int	IsTrading;
	///������Ʒ����
	string	UnderlyingInstrID;
	///������Ʒ����
	int	UnderlyingMultiple;
	///�ֲ�����
	string	PositionType;
	///ִ�м�
	double	StrikePrice;
	///��Ȩ����
	string	OptionsType;
	///����
	double	ExchangeRate;
	///��Ʒ����
	string	ProductClass;
	///��Ȩ��Ȩ��ʽ
	string	OptionsMode;
	///��֤���㷨����
	string	MarginCombType;
};
sequence<CIceInstrumentField> CIceInstrumentSeq;

///Ͷ�����ʽ��ѯ
struct CIceQryInvestorAccountField
{
	///���͹�˾���
	string	BrokerID;
	///�û�����
	string	UserID;
	///Ͷ���߱��
	string	InvestorID;
};

///Ͷ�����ʽ��˻�
struct CIceInvestorAccountField
{
	///���͹�˾���
	string	BrokerID;
	///Ͷ���߱��
	string	InvestorID;
	///�ʽ��ʺ�
	string	AccountID;
	///�ϴν���׼����
	double	PreBalance;
	///���տ����ʽ�
	double	PreAvailable;
	///�����
	double	Deposit;
	///������
	double	Withdraw;
	///ռ�ñ�֤��
	double	Margin;
	///��ȨȨ������֧
	double	Premium;
	///������
	double	Fee;
	///����ı�֤��
	double	FrozenMargin;
	///����Ȩ����
	double	FrozenPremium;
	///����������
	double	FrozenFee;
	///ƽ��ӯ��
	double	CloseProfit;
	///�ֲ�ӯ��
	double	PositionProfit;
	///�����ʽ�
	double	Available;
	///����׼����
	double	Balance;
	///��ͷռ�ñ�֤��
	double	LongMargin;
	///��ͷռ�ñ�֤��
	double	ShortMargin;
	///��ͷ����ı�֤��
	double	LongFrozenMargin;
	///��ͷ����ı�֤��
	double	ShortFrozenMargin;
	///��̬Ȩ��
	double	DynamicRights;
	///���ն�
	double	Risk;
	///��������
	double	OtherFee;
	///��Ѻ���
	double	Mortgage;
	///����
	string	Currency;
};
sequence<CIceInvestorAccountField> CIceInvestorAccountSeq;

///����Ͷ�����˻���ѯ
struct CIceQryUserInvestorField
{
	///���͹�˾���
	string	BrokerID;
	///�û�����
	string	UserID;
};

///�û�Ͷ���߹�ϵ
struct CIceUserInvestorField
{
	///���͹�˾���
	string	BrokerID;
	///�����û�����
	string	UserID;
	///Ͷ���߱��
	string	InvestorID;
	///Ĭ���û�����
	string	NextUserID;
	///�Ƿ���µ�
	string	OrderMode;
	///�Զ������ֶ�
	string	RunMode;
	///���������ߴ����ʾ��
	string	AdviceSwitchFlag;
};
sequence<CIceUserInvestorField> CIceUserInvestorSeq;

///Ͷ���߹�ϵ
struct CIceQryInvestorRelationField
{
	///���͹�˾���
	string	BrokerID;
	///�û�����
	string	UserID;
	///Ͷ���߱��
	string	InvestorID;
};

///Ͷ���߸��ӹ�ϵ��
struct CIceInvestorRelationField
{
	///���͹�˾���
	string	BrokerID;
	///Ͷ���߱��
	string	InvestorID;
	///��Ͷ���߱��
	string	ParentInvestorID;
	///˳����
	int	SpecifyNo;
};
sequence<CIceInvestorRelationField> CIceInvestorRelationSeq;

///��������ѯ
struct CIceQryExchangeField
{
	///����������
	string	ExchangeID;
};

///������Ӧ��
struct CIceExchangeField
{
	///������
	string	TradingDay;
	///����������
	string	ExchangeID;
	///����������
	string	ExchangeName;
};
sequence<CIceExchangeField> CIceExchangeSeq;

///Ͷ���ֲ߳�����
struct CIceQryInvestorPositionField
{
	///���͹�˾���
	string	BrokerID;
	///�û�����
	string	UserID;
	///����������
	string	ExchangeID;
	///Ͷ���߱��
	string	InvestorID;
	///��Լ����
	string	InstrumentID;
};

///Ͷ���ߺ�Լ�ֲ�
struct CIceInvestorPositionField
{
	///���͹�˾���
	string	BrokerID;
	///����������
	string	ExchangeID;
	///Ͷ���߱��
	string	InvestorID;
	///��Լ����
	string	InstrumentID;
	///��������
	string	Direction;
	///Ͷ���ױ���־
	string	HedgeFlag;
	///ռ�ñ�֤��
	double	UsedMargin;
	///�ֲܳ���
	int	Position;
	///�ֲֳܳɱ�
	double	PositionCost;
	///��ʼ��ֲ���(���ղ���)
	int	YdPosition;
	///��ʼ���ճֲֳɱ�(���ղ���)
	double	YdPositionCost;
	///����ı�֤��
	double	FrozenMargin;
	///���ֶ���ֲ�
	int	FrozenPosition;
	///ƽ�ֶ���ֲ�
	int	FrozenClosing;
	///�ֲ�ӯ��
	double	PositionProfit;
	///�����Ȩ����
	double	FrozenPremium;
	///���һ�ʳɽ����
	string	LastTradeID;
	///���һ�ʱ��ر������
	string	LastOrderLocalID;
	///�ֲֿܳ�ƽ������(����ƽ�ֶ���ֲ�)
	int	PositionClose;
	///��ֲֿ�ƽ������(����ƽ�ֶ���ֲ�)
	int	YdPositionClose;
	///��ֲ�ƽ�ֶ���ֲ�
	int	YdFrozenClosing;
	///���տ�������(����������)
	int	OpenVolume;
	///����ƽ������(������ֲֵ�ƽ��,����������)
	int	CloseVolume;
	///ƽ��ӯ��
	double	CloseProfit;
	///ִ�ж���ֲ�
	int	StrikeFrozenPosition;
	///����ִ�ж���ֲ�
	int	AbandonFrozenPosition;
	///���ֳɱ�
	double	OpenCost;
};
sequence<CIceInvestorPositionField> CIceInvestorPositionSeq;

///�û���ѯ
struct CIceQryUserField
{
	///�����û�����
	string	StartUserID;
	///�����û�����
	string	EndUserID;
};

///�û�
struct CIceUserField
{
	///���͹�˾���
	string	BrokerID;
	///�û�����
	string	UserID;
	///�û���¼����
	string	Password;
	///�Ƿ��Ծ
	string	IsActive;
	///�û�����
	string	UserName;
	///�û�����
	string	UserType;
	///Ӫҵ��
	string	Department;
	///��Ȩ���ܼ�
	string	GrantFuncSet;
	///���������
	int	MaxOnline;
	///IP��ַ
	string	IPAddress;
	///�Ƿ������Ӳ�Ʒ
	int	CheckProductInfo;
	///Mac��ַ
	string	MacAddress;
	///�Ƿ���IP��MAC
	int	CheckIPMacAddr;
	///�����½��������
	int	LoginErrorLimit;
	///Ŀǰ�����½����
	int	LoginErrorCount;
	///Ӳ�����к�
	string	HDSerialID;
	///�����Ƿ����
	string	IsUpdate;
};
sequence<CIceUserField> CIceUserSeq;

///Ͷ�����������ʲ�ѯ
struct CIceQryInvestorFeeField
{
	///���͹�˾���
	string	BrokerID;
	///�û�����
	string	UserID;
	///Ͷ���߱��
	string	InvestorID;
	///����������
	string	ExchangeID;
	///��Լ����
	string	InstrumentID;
};

///Ͷ����������
struct CIceInvestorFeeField
{
	///���͹�˾���
	string	BrokerID;
	///����������
	string	ExchangeID;
	///Ͷ���߱���
	string	InvestorID;
	///��Լ����
	string	InstrumentID;
	///���������Ѱ�����
	double	OpenFeeRate;
	///���������Ѱ�����
	double	OpenFeeAmt;
	///ƽ�������Ѱ�����
	double	OffsetFeeRate;
	///ƽ�������Ѱ�����
	double	OffsetFeeAmt;
	///ƽ��������Ѱ�����
	double	OTFeeRate;
	///ƽ��������Ѱ�����
	double	OTFeeAmt;
};
sequence<CIceInvestorFeeField> CIceInvestorFeeSeq;

///Ͷ���߱�֤���ʲ�ѯ
struct CIceQryInvestorMarginField
{
	///���͹�˾���
	string	BrokerID;
	///�û�����
	string	UserID;
	///Ͷ���߱��
	string	InvestorID;
	///����������
	string	ExchangeID;
	///��Լ����
	string	InstrumentID;
	///Ͷ���ױ���־
	string	HedgeFlag;
};

///Ͷ���߱�֤����
struct CIceInvestorMarginField
{
	///���͹�˾���
	string	BrokerID;
	///����������
	string	ExchangeID;
	///Ͷ���߱���
	string	InvestorID;
	///��Լ����
	string	InstrumentID;
	///Ͷ���ױ���־
	string	HedgeFlag;
	///��ͷռ�ñ�֤�𰴱���
	double	LongMarginRate;
	///��ͷ��֤������
	double	LongMarginAmt;
	///��ͷռ�ñ�֤�𰴱���
	double	ShortMarginRate;
	///��ͷ��֤������
	double	ShortMarginAmt;
};
sequence<CIceInvestorMarginField> CIceInvestorMarginSeq;

///Ͷ���߲�ѯ
struct CIceQryInvestorField
{
	///���͹�˾���
	string	BrokerID;
	///�û�����
	string	UserID;
	///Ͷ���߱��
	string	InvestorID;
};

///Ͷ����
struct CIceInvestorField
{
	///���͹�˾���
	string	BrokerID;
	///Ͷ���߱��
	string	InvestorID;
	///Ͷ��������
	string	InvestorName;
	///Ͷ��������
	string	InvestorType;
	///Ͷ��������
	string	GroupID;
	///Ͷ��������
	string	GroupName;
	///����
	string	Alias;
	///��������
	string	LinkType;
	///�ʽ��˻����
	string	ParentInvestorID;
	///��¼����
	int	LoginStatus;
	///�Ƿ�ʹ�þ��ֱֲ���,Ͷ���˻���Ч
	string	PositionType;
	///�Գɽ�����ʽ,�ʽ��˻���Ч
	string	SelfTradeAvoidType;
	///����Ȩ��
	string	TradingRight;
	///�Ƿ����ʽ�
	int	CheckAccount;
	///�Ƿ���ֲ�
	int	CheckPosition;
	///�����Ƿ񱨾�
	int	OrderWarning;
	///�ʽ�ֲ��Ƿ��ϲ�
	int	QryUpAccPosi;
	///Ͷ��ѡ���ʽ��˻�����
	string	DistributeType;
};
sequence<CIceInvestorField> CIceInvestorSeq;

///Ͷ���߷����˻���ѯ
struct CIceQryAccountRiskField
{
	///���͹�˾���
	string	BrokerID;
	///�û�����
	string	UserID;
	///Ͷ���߱��
	string	InvestorID;
};

///��ر�
struct CIceAccountRiskField
{
	///���͹�˾���
	string	BrokerID;
	///Ͷ���߱��
	string	InvestorID;
	///�ʽ��ʺ�
	string	AccountID;
	///����׼����
	double	SetBalance;
	///���ֺ���
	double	OpenAvailable;
	///ƽ�ֺ���
	double	OffsetAvailable;
	///�˻�״̬
	string	AccountStatus;
	///��̬Ȩ��
	double	DynamicRights;
	///�˻�Ȩ��
	string	TradingRight;
};
sequence<CIceAccountRiskField> CIceAccountRiskSeq;

///���ɽ���������ѯ����
struct CIceQryMaxVolumeField
{
	///���͹�˾���
	string	BrokerID;
	///�û�����
	string	UserID;
	///Ͷ���߱��
	string	InvestorID;
	///����������
	string	ExchangeID;
	///��Լ����
	string	InstrumentID;
	///��������
	string	Direction;
	///��ƽ��־
	string	OffsetFlag;
	///Ͷ���ױ���־
	string	HedgeFlag;
	///�۸�
	double	LimitPrice;
	///��¼���͹�˾���
	string	LogBrokerID;
	///��¼�û�����
	string	LogUserID;
	///�û��˽ӿڰ汾
	string	ApiVersion;
	///�û��˳���汾
	string	UserVersion;
	///ǰ�ñ��
	int	FrontID;
	///�Ự���
	int	SessionID;
	///������
	int	RequestID;
};

///�ɽ�
struct CIceTradeField
{
	///������
	string	TradingDay;
	///���͹�˾���
	string	BrokerID;
	///Ͷ���߱��
	string	InvestorID;
	///�û�����
	string	UserID;
	///�û����ر�����
	string	UserOrderLocalID;
	///�û��Զ�����
	string	UserCustom;
	///����������
	string	ExchangeID;
	///�ɽ����
	string	TradeID;
	///�������
	string	OrderSysID;
	///��Լ����
	string	InstrumentID;
	///��������
	string	Direction;
	///��ƽ��־
	string	OffsetFlag;
	///Ͷ���ױ���־
	string	HedgeFlag;
	///�ɽ��۸�
	double	TradePrice;
	///�ɽ�����
	int	TradeVolume;
	///�ɽ�ʱ��
	string	TradeTime;
	///�����Ա���
	string	ClearingPartID;
	///�ɽ����
	double	TradeAmnt;
	///��������
	string	TradeType;
	///Ӫҵ������
	string	BranchID;
	///Ӫҵ������
	string	BranchName;
};
sequence<CIceTradeField> CIceTradeSeq;

///����
struct CIceOrderField
{
	///���͹�˾���
	string	BrokerID;
	///Ͷ���߱��
	string	InvestorID;
	///�û�����
	string	UserID;
	///�û����ر�����
	string	UserOrderLocalID;
	///�û��Զ�����
	string	UserCustom;
	///����������
	string	ExchangeID;
	///ϵͳ�������
	string	OrderSysID;
	///��Լ����
	string	InstrumentID;
	///��������
	string	OrderPriceType;
	///��������
	string	Direction;
	///��ƽ��־
	string	OffsetFlag;
	///Ͷ���ױ���־
	string	HedgeFlag;
	///�۸�
	double	LimitPrice;
	///����
	int	Volume;
	///��Ч������
	string	TimeCondition;
	///GTD����
	string	GTDDate;
	///�ɽ�������
	string	VolumeCondition;
	///��С�ɽ���
	int	MinVolume;
	///ֹ���
	double	StopPrice;
	///ǿƽԭ��
	string	ForceCloseReason;
	///�Զ������־
	int	IsAutoSuspend;
	///ҵ��Ԫ
	string	BusinessUnit;
	///ҵ�����
	string	BusinessType;
	///������
	string	TradingDay;
	///����ʱ��
	string	InsertTime;
	///������Դ
	string	OrderSource;
	///����״̬
	string	OrderStatus;
	///����ʱ��
	string	CancelTime;
	///�����û����
	string	CancelUserID;
	///�Ѿ��ɽ�����
	int	VolumeTraded;
	///����ʣ������
	int	VolumeRemain;
	///�Ѿ���������
	int	VolumeCancled;
	///�������
	int	ErrorID;
	///������Ϣ
	string	ErrorMsg;
	///���ϴ����ӵĳ�������
	int	VolumeIncCancled;
	///���ϴ����ӵĳɽ�����
	int	VolumeIncTraded;
	///�ʽ��ʺ�
	string	AccountID;
	///ǰ�ñ��
	int	FrontID;
	///�Ự���
	int	SessionID;
	///������
	int	RequestID;
	///ÿ��������
	double	EachFee;
	///ÿ�ֱ�֤��
	double	EachMargin;
	///ÿ����ȨȨ������֧
	double	EachPremium;
	///�µ�IP��ַ
	string	IPAddress;
	///�µ�MAC��ַ
	string	MacAddress;
	///Ӫҵ������
	string	BranchID;
	///��¼���
	int	RecNum;
	///Ӳ�����к�
	string	HDSerialID;
	///Ӫҵ������
	string	BranchName;
};
sequence<CIceOrderField> CIceOrderSeq;

///�����ر�֪ͨ
struct CIceInvestorAccountDepositNtfField
{
	///���͹�˾���
	string	BrokerID;
	///Ͷ���߱��
	string	InvestorID;
	///�ʽ��ʺ�
	string	AccountID;
	///�ʽ���ˮ��
	string	AccountSeqNo;
	///���
	double	Amount;
	///�������
	string	AmountDirection;
	///�����ʽ�
	double	Available;
	///����׼����
	double	Balance;
	///�û�����
	string	UserID;
};

///������Ϣ֪ͨ
struct CIceMessageNotifyField
{
	///���͹�˾���
	string	BrokerID;
	///�޸��û����
	string	UserID;
	///Ͷ���߱��
	string	InvestorID;
	///�ۼӴ���
	int	Nums;
	///���漶��
	string	WarnLevel;
	///������
	int	WarnID;
	///������Ϣ
	string	WarnMsg;
	///����ʱ��
	string	WarnTime;
};


///��Ч�Ự�쳣
exception SessionError {};

interface QdamIceTraderSpi
{

	///�ɽ�֪ͨ
	void OnRtnTrade(int SequenceNo, CIceTradeField Trade);

	///����֪ͨ
	void OnRtnOrder(int SequenceNo, CIceOrderField Order);

	///����¼�����֪ͨ
	void OnErrRtnOrderInsert(int SequenceNo, CIceInputOrderField InputOrder, CIceRspInfoField RspInfo);

	///������������֪ͨ
	void OnErrRtnOrderAction(int SequenceNo, CIceOrderActionField OrderAction, CIceRspInfoField RspInfo);

	///��Լ����״̬�ı�֪ͨ
	void OnRtnInstrumentStatusUpdate(int SequenceNo, CIceInstrumentField Instrument);

	///�����ر�֪ͨ
	void OnRtnInvestorAccountDeposit(int SequenceNo, CIceInvestorAccountDepositNtfField InvestorAccountDepositNtf);

	///������Ϣ֪ͨ
	void OnRtnMessageNotify(int SequenceNo, CIceMessageNotifyField MessageNotify);
};

interface QdamIceTraderApi
{
	///�û���¼����
	["amd"] void ReqUserLogin(CIceUserLoginField ReqUserLogin, Ice::Identity ident, int MaxSequenceNo, out CIceUserLoginField LoginRspInfo, out CIceRspInfoField RspInfo, out int SessionID)throws SessionError;

	///�û��˳�����
	["amd"] void ReqUserLogout(int SessionID, CIceUserLogoutField UserLogout, out CIceRspInfoField RspInfo)throws SessionError;
	
	///�û������޸�����
	["amd"] void ReqUserPasswordUpdate(int SessionID, CIceUserPasswordUpdateField UserPasswordUpdate, out CIceRspInfoField RspInfo)throws SessionError;
	
	///����¼������
	["amd"] void ReqOrderInsert(int SessionID, CIceInputOrderField InputOrder, out CIceRspInfoField RspInfo)throws SessionError;
	
	///������������
	["amd"] void ReqOrderAction(int SessionID, CIceOrderActionField OrderAction, out CIceRspInfoField RspInfo)throws SessionError;
	
	///Ͷ�����ʽ��ѯ����
	["amd"] void ReqQryInvestorAccount(int SessionID, CIceQryInvestorAccountField QryInvestorAccount, out CIceInvestorAccountSeq InvestorAccounts, out CIceRspInfoField RspInfo)throws SessionError;

	///������ѯ����
	["amd"] void ReqQryOrder(int SessionID, CIceQryOrderField QryOrder, out CIceOrderSeq Orders, out CIceRspInfoField RspInfo)throws SessionError;

	///�ɽ�����ѯ����
	["amd"] void ReqQryTrade(int SessionID, CIceQryTradeField QryTrade, out CIceTradeSeq Trades, out CIceRspInfoField RspInfo)throws SessionError;

	///Ͷ���߲�ѯ����
	["amd"] void ReqQryInvestor(int SessionID, CIceQryInvestorField QryInvestor, out CIceInvestorSeq Investors, out CIceRspInfoField RspInfo)throws SessionError;

	///��Լ��ѯ����
	["amd"] void ReqQryInstrument(int SessionID, CIceQryInstrumentField QryInstrument, out CIceInstrumentSeq Instruments, out CIceRspInfoField RspInfo)throws SessionError;

	///�û���ѯ����
	["amd"] void ReqQryUser(int SessionID, CIceQryUserField QryUser, out CIceUserSeq Users, out CIceRspInfoField RspInfo)throws SessionError;

	///��������ѯ����
	["amd"] void ReqQryExchange(int SessionID, CIceQryExchangeField QryExchange, out CIceExchangeSeq Exchanges, out CIceRspInfoField RspInfo)throws SessionError;

	///����Ͷ�����˻���ѯ����
	["amd"] void ReqQryUserInvestor(int SessionID, CIceQryUserInvestorField QryUserInvestor, out CIceUserInvestorSeq UserInvestors, out CIceRspInfoField RspInfo)throws SessionError;

	///Ͷ���ֲֲ߳�ѯ����
	["amd"] void ReqQryInvestorPosition(int SessionID, CIceQryInvestorPositionField QryInvestorPosition, out CIceInvestorPositionSeq InvestorPositions, out CIceRspInfoField RspInfo)throws SessionError;

	///Ͷ�����������ʲ�ѯ����
	["amd"] void ReqQryInvestorFee(int SessionID, CIceQryInvestorFeeField QryInvestorFee, out CIceInvestorFeeSeq InvestorFees, out CIceRspInfoField RspInfo)throws SessionError;

	///Ͷ���߱�֤���ʲ�ѯ����
	["amd"] void ReqQryInvestorMargin(int SessionID, CIceQryInvestorMarginField QryInvestorMargin, out CIceInvestorMarginSeq InvestorMargins, out CIceRspInfoField RspInfo)throws SessionError;

	///Ͷ���߹�ϵ��ѯ����
	["amd"] void ReqQryInvestorRelation(int SessionID, CIceQryInvestorRelationField QryInvestorRelation, out CIceInvestorRelationSeq InvestorRelations, out CIceRspInfoField RspInfo)throws SessionError;

	///�˺ŷ���״����ѯ����
	["amd"] void ReqQryAccountRisk(int SessionID, CIceQryAccountRiskField QryAccountRisk, out CIceAccountRiskSeq AccountRisks, out CIceRspInfoField RspInfo)throws SessionError;

	///���ɽ���������ѯ����
	["amd"] void ReqQryMaxVolume(int SessionID, CIceQryMaxVolumeField QryMaxVolume, out CIceMaxVolumeSeq MaxVolumes, out CIceRspInfoField RspInfo)throws SessionError;

	///����
	bool HeartBeat(int SessionID) throws SessionError;
};


};
