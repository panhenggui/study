/**
 * Created by lihj on 2015/7/31.
 *   
 * add js namespace
 * modify by marshal.liu on 2015/8/17.
 */
Namespace.register("com.quantdo.orgClear.constant");
com.quantdo.orgClear.constant.ClearConstants = function(){	
	//树结构菜单id
	this.treeDictID = {
						  productRisk:"10400",          //净值分档占比设置
						  positionProportion:"10700",    //持仓占比设置
						  unitNetvalueStop:"10601",     //单位净值止损
						  riskDayStopLoss:"10602",      //日内最大回撤止损比例
						  futureVarietiesRestriction:"10202",    //期货交易品种限制
						  userriskparameterfof:"20001",    //资产单元风控参数设置
						  riskAccountFutureVariety:"20002",  //资产单元期货交易品种设置
						  riskAccountStockVariety:"20003",   //资产单元证券交易品种设置
						  tradeAuthorityManage:"30001",       //交易权限管理
						  stockTradingVarietiesRestriction:"10201", //证券交易品种限制
						  marketProportionSet:"10500",  //市场占比设置
						  portfolioRiskControl:"10800", //资产组合风控设置
						  exchangeOrderControl:"10101",	//交易所报单频率控制  
						  futureVolumeControl:"10102", //期货数量控制
						  directionControl:"10103", //同向反向控制
						  riskAccountExchOrderControl:"20004",//资产单元交易所报单频率控制
						  riskAccountFutureVolumeControl:"20005",//资产单元期货数量控制  
						  riskOperLogQuery :"40001",//风控参数变更流水查询
						  riskWarnResultCount:"40002",//风控预警情况统计  
						  riskAccountPositionCheck:"40003"//资产单元持仓核对
					  };

    //执行类型
    this.actionType = [
        {text: '执行', key: '1'},
        {text: '放弃', key: '2'}
    ];

    //执行后自动对冲期货持仓
    this.closeFlag = [
        {text: '自动平仓', key: '0'},
        {text: '免于自动平仓', key: '1'}
    ];

    //执行结果
    this.execResultType = [
        {text: '没有执行', key: 'n'},
        {text: '已经取消', key: 'c'},
        {text: '执行成功', key: '0'},
        {text: '期权持仓不够', key: '1'},
        {text: '资金不够', key: '2'},
        {text: '会员不存在', key: '3'},
        {text: '客户不存在', key: '4'},
        {text: '合约不存在', key: '6'},
        {text: '没有执行权限', key: '7'},
        {text: '不合理的数量', key: '8'},
        {text: '没有足够的历史成交', key: '9'},
        {text: '未知', key: 'a'},
    ];

    //执行类型
    this.optSelfCloseFlag = [
        {text: '自对冲期权仓位', key: '1'},
        {text: '保留期权仓位', key: '2'},
        {text: '自对冲卖方履约后的期货仓位', key: '3'}
    ];

	//状态
    this.status = [
        {text: '开启', key: '1'},
        {text: '关闭', key: '0'}
    ];

    //席位是否连接
    this.seatIsConnect = [
        {text: '连接成功', key: '1'},
        {text: '连接失败', key: '0'}
    ];

    // 杠杆计算器指令状态
    this.leverageCalculatorOrderStatus = [
        {text: '未分发', key: '0'},
        {text: '已分发未推送', key: '1'},
        {text: '已推送未执行', key: '2'},
        {text: '已推送已执行', key: '3'}
    ];
    
    //杠杆计算器减仓方式
	this.lcSubType = [
        {text: '优先级', key: '0'},
        {text: '倍数', key: '1'}
    ];
    
    //状态
    this.partitionStatus = [
        {text: '启用', key: '1'},
        {text: '停用', key: '0'}
    ]; 
    
    // 下单通道
    this.tradeSrcs = [
        {text: '批量维护', key: '1'},
	    {text: '手工录入', key: '2'}
	]; 
    
    // 资产单元成交单数据检查查询维度
    this.tradeSearchTypes = [
        {text: '全部补单', key: '1'},
	    {text: '一级有二级无（FOF）', key: '2'},
	    {text: '一级有二级无（MOM）', key: '3'},
	    {text: '二级有一级无', key: '4'},
	    {text: '全部显示', key: '5'}
	]; 
    
    // 资产单元成交单数据检查查询维度
    this.tradeAllocationStatus = [
        {text: '未分配', key: '0'},
	    {text: '已分配', key: '1'},
	    {text: '部分分配', key: '2'}
	]; 
    
    //资金账号顺序
    this.parentInvestorOrders = [
        {text: '自选顺序', key: '1'},
        {text: '指定顺序', key: '2'}
    ]; 
    
    //风控参数设置
    this.limitOptions = [
        {text: '限仓', key: '1'},
        {text: '限额', key: '2'},
        {text: '报撤单比例', key: '3'}
    ]; 
    
    //开平仓优先顺序
    this.sequenceTypes = [
        {text: '优先平今', key: '0'},
        {text: '避免平今', key: '1'}
    ];
    
    this.searchTypes = [
        {text: '资产单元', key: '2'},
    	//{text: '业务组', key: '0'},
        {text: '交易员', key: '1'}
    ]; 
    
    /*this.limitOptions = [
        {text: '限仓', key: '1'},
        {text: '限额', key: '2'},
        {text: '报撤单比例', key: '3'}
    ]; */
    
    /*this.sequenceTypes = [
        {text: '优先平今', key: '1'},
        {text: '避免平今', key: '2'}
    ];*/
    
	//新增/重置/保存/修改
	this.buttonName ={
			setPara:"   重  置   ",
			resetPara:"   取  消   ",
			saveData: "   保  存   ",
			updateData:"保存修改"};
    //是否
    this.isNotDatas = [
        {text: '是', key: '1'},
        {text: '否', key: '0'}
    ];
    //产品类型
    this.productTypes = [
        //{text: '默认类型', key: '0'},
        {text: '期货', key: '1'},
        {text: '期权', key: '2'},
        {text: '组合', key: '3'},
        {text: '即期', key: '4'},
        {text: '期转现', key: '5'},
        {text: '未知类型', key: '6'},
        {text: '证券', key: '7'},
        {text: '股票期权', key: '8'},
        {text: '金交所现货', key: '9'},
        {text: '金交所递延', key: 'a'},
        {text: '金交所远期', key: 'b'}
    ];

    this.position_productTypes = [
        //{text: '默认类型', key: '0'},
        {text: '期货', key: '1'},
        {text: '期权', key: '2'},
        //{text: '组合', key: '3'},
        {text: '即期', key: '4'},
        {text: '期转现', key: '5'},
        {text: '未知类型', key: '6'},
        {text: '证券', key: '7'},
        {text: '股票期权', key: '8'},
        {text: '金交所现货', key: '9'},
        {text: '金交所递延', key: 'a'},
        {text: '金交所远期', key: 'b'}
    ];

    //费率产品类型
    this.productTypeforfee = [
        {text: '期货', key: '1'},
        {text: '期权', key: '2'}
    ];

    //允许商品期权
    this.productOptions = [
       {text: '大商所', key: 'DCE'},
       {text: '郑商所', key: 'CZCE'},
       {text: '中金所', key: 'CFFEX'},
       {text: '上期所', key: 'SHFE'}
   ];

    //操作类型
    this.operTypes = [
        {text: '新增', key: '1'},
        {text: '修改', key: '2'},
        {text: '删除', key: '3'},
        {text: '登入', key: '4'},
        {text: '登出', key: '5'},
        {text: '其他', key: '99'}
    ];

    //在线状态  2在线、1正常、0冻结
    this.onlineActives = [
       {text: '冻结', key: '0'},
       {text: '正常', key: '1'},
       {text: '在线', key: '2'}
   ];

    //报单类型
    this.orderPriceTypes = [
        {text: '任意价', key: '1'},
        {text: '限价', key: '2'},
        {text: '最优价', key: '3'},
        {text: '五档价', key: '4'}
    ];

    //收取方式：1：相对默认收取 ,2：绝对收取 ，3倍数收取
    this.receiveTypes=[
       {text: '相对默认收取', key: '1'},
       {text: '绝对收取', key: '2'},
       {text: '倍数收取', key: '3'}
    ];

    //机构账号类型（资管模式）
    this.amTypes=[
       {text: 'FOF', key: '1'},
       {text: 'MOM', key: '2'}
    ];
    
    //投顾性质
    this.traderTypes = [ {
		text : '个人',
		key : '0'
	}, {
		text : '机构',
		key : '1'
	} ];
    
    //交易权限
    this.tradeRights= [
	   {text: '允许开仓', key: '0'},
	   {text: '只可平仓', key: '1'},
	   {text: '禁止交易', key: '2'}
	];
    //证件类型
    this.idTypeSelects = [ {
		text : '身份证',
		key : '1'
	}, {
		text : '营业执照',
		key : '4'
	}, {
		text : '组织机构代码',
		key : '5'
	}, {
		text : '税务登记证号',
		key : '6'
	}, {
		text : '其他证件',
		key : '9'
	} ];
    
    //通道系统
    this.seatSystems=[
   	   {text: 'QDP', key: '0'},
	   {text: 'CTP', key: '1'},
	   {text: '飞马', key: '2'},
	   /*{text: '交易所', key: '3'}*/
	   {text: '易盛外盘', key: '4'},
	   {text: '证券', key: '5'},
	   {text: 'PATS', key: '6'},
	   {text: 'TT', key: '7'},
	   {text: 'CQG', key: '8'},
	   {text: '无锡不锈钢', key: '9'},
	   {text: '金仕达黄金', key: '10'},
	   {text: '直达', key: '11'},
	   {text: 'FIX', key: '12'},
	   {text: '中金', key: '13'},
	   {text: '光大', key: '14'},
	   {text: 'QDIAM', key: '15'},
	   {text: 'CTP_个股期权', key: '16'},
	   {text: 'Rithmic', key: '17'},
	   {text: 'QDP外盘', key: '18'},
	   {text: '彭博', key: '19'},
	   {text: '直达证券', key: '20'}
	];
    //通道类型
    this.apiLinkTypes=[
	   {text: '交易所', key: '1'},
	   {text: '经纪商', key: '2'}
	];
    
    
    //通道类型
    this.apiLinkTypess=[
	   {text: '是', key: 'j'},
	   {text: '否', key: 't'}
	];
    //报盘链接类型
    this.linkManagerTypes=[
	   {text: '默认', key: '1'},
	   {text: '间接接入', key: '2'}
	];
    
    //是否是国内交易所
    this.isDomestic = [
	   {text: '国外', key: '0'},
	   {text: '国内', key: '1'}
   ];

    //币种
    this.currenys = [
        {text: '人民币', key: 'CNY' },
        {text: '离岸人民币', key: 'CNH' },
        {text: '美元', key: 'USD' },
        {text: '美分', key: 'CENT' },
        {text: '日元', key: 'JPY'},
        {text: '澳元', key: 'AUD'},
        {text: '英镑', key: 'GBP'},
        {text: '港币', key: 'HKD'},
        {text: '韩元', key: 'KRW'},
        {text: '欧元', key: 'EUR'},
        {text: '新加坡元', key: 'SGD'},
        {text: '林吉特', key: 'MYR'},
        {text: '加元', key: 'CAD'}
    ];

    //产品状态
    this.productStatus = [
        {text: '正常', key: '1'},
        {text: '无效', key: '0'}
    ];
    //持仓类型
    this.positionTypes = [
        {text: '净持仓', key: '1'},
        {text: '混合持仓', key: '2'}
    ];

    //交割方式
    this.delivModes = [
        {text: '现金', key: '1'},
        {text: '实物', key: '2'}
    ];

    //交割类型
    this.delivTypes = [
        {text: '滚动交割', key: '1'},
        {text: '集中交割', key: '2'}
    ];
    //行权类型
    this.executeTypes = [
        {text: '美式', key: '1'},
        {text: '欧式', key: '2'}
    ];
    //合约状态
    this.instrumentStatus = [
        {text: '未上市', key: '0'},
        {text: '上市', key: '1'},
        {text: '停牌', key: '2'},
        {text: '下市', key: '3'},
        {text: '终止', key: '4'}
    ];
    //交易类型
    this.tradeTypes = [
        {text: '投机', key: '1'},
        {text: '套利', key: '2'},
        {text: '套保', key: '3'}
    ];
    //开平
    this.offsetFlag = [
       {text: '开仓', key: '0'},
       {text: '平仓', key: '1'},
       {text: '强平', key: '2'},
       {text: '平今', key: '3'},
       {text: '平昨', key: '4'}
   ];
    //买卖方向
    this.tradeDirection = [
        {text: '买', key: '0'},
        {text: '卖', key: '1'}
    ];
    
    
    

    //递延方向      0是多付空、1是空付多、2是方向未定
    this.deferredDirection = [
        {text: '多付空', key: '0'},
        {text: '空付多', key: '1'},
        {text: '方向未定', key: '2'}
    ];
    this.OptionTypes = [
        {text: '非期权', key: '0'},
        {text: '看涨期权', key: '1'},
        {text: '看跌期权', key: '2'}
    ];

    //银行代码
    this.bankIDDatas = [
        {text: '工商银行', key: '01'},
        {text: '农业银行', key: '02'},
        {text: '中国银行', key: '03'},
        {text: '建设银行', key: '04'},
        {text: '交通银行', key: '05'},
        {text: '浦发银行', key: '06'},
        {text: '兴业银行', key: '07'},
        {text: '汇丰银行', key: '08'},
        {text: '光大银行', key: '09'},
        {text: '招商银行', key: '10'},
        {text: '中信银行', key: '11'},
        {text: '民生银行', key: '12'},
        {text: '其他银行', key: '99'}
    ];  
    
    //资金类型
    this.moneyTypeDatas = [
        {text: '转账', key: '1'},
        {text: '支票', key: '2'},
        {text: '银行存款', key: '3'},
        {text: '公司调整', key: '4'}
    ];

    this.tradeUserTypes = [
       {text: '超级管理员', key: '1'},
       {text: '机构管理员', key: '2'},
       {text: '运维岗', key: '3'},
       {text: '结算岗', key: '4'},
       {text: '风控员', key: '5'},
       {text: '投资顾问', key: '6'},
       {text: '投资助理', key: '7'},
       {text: '投资经理', key: '8'},
       {text: '交易员', key: '9'},
       {text: '超级风控员', key: '11'}
   ];

    
    //实时持仓查询的查询方式
    this.operClientPositon_searchType = [
	   {text: '资金账号', key: '1'},
	   {text: '资产单元', key: '2'}
	];
    
    //日盈亏报表的查询方式
    this.dailyProfitloss_searchType = [
	   {text: '资产单元', key: '1'},
	   {text: '策略代码', key: '2'},
	   {text: '策略批次', key: '3'}
	];
    
  //日盈亏报表的查询方式
    this.hisPositionReport_searchType = [
	   {text: '机构合计', key: '1'},
	   {text: '资产单元', key: '2'},
	   {text: '品种代码', key: '3'}
	];
    
    //日账单-结算类型
    this.jsTypes = [
        {text: '逐日盯市', key: '1'},
        {text: '逐笔对冲', key: '2'}
    ];
    
    //报单状态
    this.orderStatus = [
	    {text: '全部成交', key: '0'},
		{text: '部分成交还在队列中', key: '1'},
		{text: '部分成交不在队列中', key: '2'},
		{text: '未成交还在队列中', key: '3'},
		{text: '未成交不在队列中', key: '4'},
		{text: '撤单(不在队列中)', key: '5'},
		{text: '订单已报入交易所未应答', key: '6'},
		{text: '部分撤单还在队列中', key: '7'},
		{text: '部分成交部分撤单还在队列中', key: '8'},
		{text: '待报入', key: '9'},
		{text: '未知类型', key: 'a'}
    ];
    
    //资金账户级、资产单元级
    this.linkAccountType = [
        {text: '资金账户级', key: '1'},
        {text: '资产单元级', key: '2'}
    ];
    
    //投资者类型
    this.investorType = [
        {text: '一级投资者', key: '1'},
        {text: '二级投资者', key: '2'}
    ];
    
    //产品类型
    this.fundProductType = [
        {text: '管理型', key: '0'},
        {text: '结构型', key: '1'}
    ];
    
    //允许交易市场类型（0-期货、1-证券、2-外盘、3-信用）
    this.marketType = [
        {text: '期货', key: '0'},
        {text: '证券', key: '1'},
        {text: '外盘', key: '2'},
        {text: '信用', key: '3'},
        {text: '黄金', key: '4'},
        {text: '证券期权', key: '5'},
        {text: '现货', key: '6'},
        {text: '无锡不锈钢', key: '7'}
    ];
    
    //允许交易市场类型（0-管理、2-风控、1-交易）
    this.userType = [
        {text: '管理', key: '0'},
        {text: '交易', key: '1'},
        {text: '风控', key: '2'}
    ];
    
    //权益类型
    this.incomeTypes = [
        //权益类型0 其他调整 ，不可随意更改 --后台及显示与其他类型的逻辑不同
        {text: '其他调整', key: '0'},
        {text: '管理费', key: '1'},
        {text: '托管费', key: '2'},
        {text: '外包费', key: '3'}
      
    ];
    
    // 指令状态
    this.adviceOrderStatus = [
			{text: '全部成交', key: '0'},
			{text: '撤单(不在队列中)', key: '5'},
			{text: '投顾报单', key: 'B'},
			{text: '投资经理驳回', key: 'C'},
			{text: '投资经理通过', key: 'D'},
			{text: '交易员已报入', key: 'E'},
			{text: '交易员驳回', key: 'F'},
			{text: '投资经理报单', key: 'G'}
      ];
    
    //产品固收状态:1为正常、2停息保留余额，3-了结清除余额
    this.fixedIncomeStates = [
        {text: '停止计息保留余额', key: '2'},
        {text: '了结清除余额', key: '3'}
    ];
    
    //产品级风控指标--沈伟
    this.riskTypes = [
        {text: '单位净值', key: '1'},
        {text: '交割期', key: '2'}
    ];
    

	 //成交开平
   this.offsetFlagss = [
      {text: '开仓', key: '0'},
      {text: '平仓', key: '1'},
      {text: '平今', key: '3'},
      {text: '平昨', key: '4'}
  ];
   
   //成交开平
   this.offsetFlagssss = [
      {text: '开仓', key: '0'},
      {text: '平仓', key: '1'}
  ];
   
   //开平
   this.offsetFlagAddOption = [
      {text: '开仓', key: '0'},
      {text: '平仓', key: '1'},
      {text: '强平', key: '2'},
      {text: '平今', key: '3'},
      {text: '平昨', key: '4'}
  ];
    
    //产品级风控指标--风控-异常提示
    this.riskTypesRiskStrom = [
        {text: '单位净值', key: '1'},
        {text: '交割期', key: '2'},
        {text: '黑白名单', key: '3'},
        {text: '市场占比', key: '4'},
        {text: '持仓占比', key: '5'},
        {text: '日内最大回撤止损', key: '6'},
        {text: '资产单元风险参数', key: '11'},
        {text: '资产组合风控指标', key: '12'}
    ];
    
    //权益类型
    this.incomeTypes = [
        //权益类型0 其他调整 ，不可随意更改 --后台及显示与其他类型的逻辑不同
        {text: '其他调整', key: '0'},
        {text: '管理费', key: '1'},
        {text: '托管费', key: '2'},
        {text: '外包费', key: '3'}
      
    ];
    
    //风控方式
    this.riskWay = [
        {text: '控制权限', key: '1'},
       // {text: '清仓', key: '2'},
        {text: '预警', key: '3'}
    ];

    this.isFundOrRiskAccount = [
                   {text: '资产单元',key: '11'}
                   ]
    //处理状态
    this.changeStates = [
        {text: '未处理', key: '0'},
        {text: '已处理', key: '1'}
    ];

    //比较符
    this.compareFlag = [
        {text: '<', key: '<'},
//        {text: '>', key: '>'},
        {text: '=', key: '='},
        {text: '<=', key: '<='}
//        {text: '>=', key: '>='}
    ];

    //是否恢复
    this.isRecovery = [
        {text:'是',key:'1'},
        {text:'否',key:'0'}
    ];
    
    //资金账户级风控指标
    this.capRiskType = [
//        {text: '监管', key: '0'},
        {text: '黑白名单', key: '1'}
    ];
    
    //限制类型
    this.limitType = [
        {text: '黑名单', key: '0'},
        {text: '白名单', key: '1'}
    ];
    
    //黑白名单类别
    this.bwProductType = [
        {text: '全部', key: '0'},
        {text: '品种', key: '1'},
        {text: '合约', key: '2'}
    ];

    //指标ID对应页面
    this.indexPageFlag = {page1:'1',page2:'2',page3:'3'};

    //风险等级
    this.riskLevels = [
        {text: '联合持仓风控', key: '3'},
        {text: '单净值风控', key: '2'}
    ];
    
    //杠杆（内外盘）
    this.leverageTypes = [
        {text: '内盘', key: '1'},
        {text: '外盘', key: '0'}
    ];
    
    //工作流类型
    this.modelTypes = [
        {text: '标准三工作流', key: '1'},
        {text: '标准二工作流', key: '2'}
    ];
    
    //流程节点（工作流）
    this.workFlowProcedures = [
        {text: '投资顾问->投资经理->投资交易员', key: '1'},
        {text: '投资经理->投资交易员', key: '2'}
    ];
    
    //默认方式（工作流）
    this.defaultModes = [
        {text: '在线快速审批', key: '1'},
        {text: '手动', key: '2'}
    ];
    
//    产品类型
    this.contractType = [
        {text: '股票', key: '1'},
        {text: '期货', key: '2'},
        {text: '基金', key: '3'},
        {text: '债券', key: '4'}
    ];

    //资产分组管理产品类型
    this.assetContractType = [
        {text: '期货', key: '2'},
        {text: '证券', key: '1'}
    ];
   // 1：股票，2：期货，3：基金 4：债券 5：期权
    this.assetContractType2 = [
	      {text: '期货', key: '2'},
	      {text: '期权', key: '5'},
	      {text: '股票', key: '1'},
	      {text: '基金', key: '3'},
	      {text: '债券', key: '4'},
	      {text: '黄金现货', key: '7'},
	      {text: '黄金递延', key: '8'},
	    /*  {text: '黄金远期', key: '9'},*/
	      {text: '无锡不锈钢', key: 'a'}
	  ];

    //    数据来源
    this.dataSource = [
        //{text: '系统', key: '1'},
        {text: '万德', key: '2'},
        {text: '申万', key: '3'},
        {text: '自定义', key: '4'}
    ];

    //成交维护类型
    this.tradeMaintainType = [
        {key:'7',text:'股票'},
        {key:'c',text:'汇率远期'}
    ];

    this.dataBrokeSource = [
        {text: '万德', key: '2'},
        {text: '申万', key: '3'}
    ];

    this.dataOtherSource = [
        {text: '自定义', key: '4'}
    ];

    
    //  资产指标
    this.assetIndicators = [
        {text: '成本', key: '0'},
        /*{text: '买成本', key: '3'},
        {text: '卖成本', key: '4'},*/
        {text: '市值', key: '1'},
        {text: '多头市值', key: '5'},
        {text: '空头市值', key: '6'},
        {text: '保证金', key: '2'},
        {text: '多头保证金', key: '7'},
        {text: '空头保证金', key: '8'}
        
    ];
    
    //运算符号1
    this.calcuTagLeft = [
                      {text: '', key: ''},
                      {text: 'ABS(', key: 'ABS('}
    ];
    //运算符号2
    this.calcuTagRight = [
                      {text: '', key: ''},
                      {text: ')', key: ')'}
    ];
    
  //风控节点状态类型
    this.risknodestatusTypes = [
        {text: '异常', key: '-1'},
        {text: '初始', key: '0'},
        {text: '正常', key: '1'}
    ];
    
    //风控节点信息更新方式
    this.risknodeupdateStyle = [
          {text: '每日', key: '0'},
          {text: '实时', key: '1'}
    ];
    
    //风控节点数据权限类型
    this.risknodedatarightTypes = [
         {text: '持仓数据', key: '0'},
         {text: '成交数据', key: '1'},
         {text: '委托数据', key: '2'},
         {text: '资金汇总', key: '3'},
         {text: '风控参数', key: '4'},
         {text: '风控结果', key: '5'},
         {text:'产品基本信息',key:'6'}
    ];
    
    //风控子节点配置，方式
    this.refreshTypes = [
          {text: '数据库', key: '0'},
          {text: '目录', key: '1'}
    ];
    
    //产品组净值风控预警类别
    this.fundGroupRiskWarnTypes = [
          {text: '单位净值预警', key: '1'},
          {text: '单位净值跌幅预警', key: '2'},
          {text: '日内最大回撤预警', key: '3'},
          {text: '历史最高净值回撤预警', key: '4'}
    ];
    
    //产品组类别
    this.fundGroupTypes = [
          {text: '内部', key: '0'},
          {text: '外部', key: '1'}
    ];
    
    //产品组风控，风控档位对应等级
    this.fundGroupRiskGrades = [
          {text: '一级', key: '1'},
          {text: '二级', key: '2'},
          {text: '三级', key: '3'},
          {text: '四级', key: '4'}
    ];
    
    //产品组预警状态
    this.fundGroupStatus = [
       {key:'0',text:'恢复'},
       {key:'1',text:'启动'}
    ];
    
    //资产单元参数类型
    this.accParameTypes = [
		{key:'0',text:'按金额'},
		{key:'1',text:'按比例'}               
	]; 
    
    //是否检查
    this.isCheck = [
    	{key:'0',text:'否'},
    	{key:'1',text:'是'}               
    ];
    
    //组合保证金类型
    this.marginCombTypes = [
        {key:'1',text:'大边保证金'},
        {key:'4',text:'先套利再对锁'},
        {key:'5',text:'先套利再双边'}
    ];
    
    //组合类型
    this.combTradeTypes = [
        {key:'1',text:'单腿'},
        {key:'2',text:'组合'}
    ];

    //现货合同类型
    this.spotContractTypes = [
        {key:'0',text:'采购'},
        {key:'1',text:'销售'}
    ];
    
    //现货 货、票、点、保、资状态
    this.spotValidateStatus = [
        {key:'1',text:'非校验'},
        {key:'2',text:'校验'},
        {key:'3',text:'不确定'}
    ];
    
    //现货库存状态
    this.spotStorageStatus = [
        {key:'1',text:'仓储库存'}
    ];
    
    //抵押品类别
    this.mortgageTypes = [
    	{key:'1',text:'仓单'},
    	{key:'3',text:'股票'}               
    ]; 
    
    //抵押状态
    this.mortgageStatus = [
    	{key:'1',text:'正常'},
    	{key:'2',text:'到期'}               
    ]; 
    
    //币种
    this.currencys = [
    	{key:'CNY',text:'人民币'},
    	{key:'USD',text:'美元'}               
    ]; 
    
    //分仓算法
    this.arithmetics = [
        {text: '量投分仓算法', key: '1'},
        {text: '综合持仓分仓算法', key: '2'}
    ];

    //加仓减仓
    this.addorsubs = [
        {text:'加仓', key:'1'},
        {text:'减仓', key:'2'}
    ];
    
    this.formatDate = function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + "" + formatTen(month) + "" + formatTen(day);
    };

    this.formatStringyyyyMMddToyyyy_MM_dd = function (value) {
        if (value.length == 8) {
            return value.substring(0, 4) + "-" + value.substring(4, 6) + "-" + value.substring(6, 8);
        } else if (value.length == 6) {
            return value.substring(0, 4) + "-" + value.substring(4, 6);
        } else {
            return value;
        }
    };

    function formatTen(num) {
        return num > 9 ? (num + "") : ("0" + num);
    };

    this.currentTime = function () {
        var d = new Date()
        var h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
        var m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        var se = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
        return h+":"+m+":"+se;
    };
    this.trade_src_1 = "1";
    this.trade_src_2 = "2";
    this.setOperator = function(entity,operId)
    {
        entity.operatorID = operId;
        entity.operateDate = this.formatDate(new Date());
        entity.operateTime = this.currentTime();
    };

    this.convertData = function(value){
        if(value==undefined)
        {
            return "";
        }else{
            return value;
        }
    }
    
};

//精确除法
function accDiv(arg1,arg2){
	var t1 = 0,t2 = 0, r1, r2;
	try{
		t1 = arg1.toString().split(".")[1].length;	// 被除数小数位数
	}catch(e){
			
	}
	try{
		t2 = arg2.toString().split(".")[1].length;	// 除数小数位数
	}catch(e){
			
	}
	// 俩数分别乘以10的其中小数位最多的位数的次方，转换为整数
	r1 = accMul(Number(arg1.toString()), Math.pow(10, Math.max(t1,t2)));
	r2 = accMul(Number(arg2.toString()), Math.pow(10, Math.max(t1,t2)));
	return r1 / r2;
}

// 精确乘法
function accMul(arg1,arg2){
	var m = 0,s1 = arg1.toString(),s2 = arg2.toString();
	try{
		m += getFraction(s1);
	}catch(e){
		
	}
	try{
		m += getFraction(s2);
	}catch(e){
		
	}
	// 俩数转为整数相乘再除以10的小数位和的次方
	var mul1,mul2;
	
	if(s1.split('e').length > 1){
		mul1 = s1.split('e')[0];
	}else{
		mul1 = s1.replace(".","");
	}
	
	if(s2.split('e').length > 1){
		mul2 = s2.split('e')[0];
	}else{
		mul2 = s2.replace(".","");
	}
	
	return Number(mul1) * Number(mul2) / Math.pow(10,m);
}

// 精确加减法
function accAdd(arg1,arg2){
	var r1,r2,m;
	try{
		r1 = arg1.toString().split(".")[1].length;	// 被加数小数位数
	}catch(e){
		r1 = 0;
	}
	try{
		r2 = arg2.toString().split(".")[1].length;	// 加数小数位数
	}catch(e){
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1,r2));	// 俩数中位数最长的位数，作为归整乘数
	return (arg1 * m + arg2 * m) / m;	// 将两数转为整数后再除以归整乘数
}

// 取得小数位数
function getFraction(arg){
	if(arg.toString().split('e').length > 1){	//科学计数法
		if(parseInt(arg.toString().split('e')[1],10) < 0){
			return parseInt(arg.toString().split('e')[1],10)*(-1);
		}else{
			return 0;
		}
	}else{
		return arg.toString().split('.')[1].length;
	}
}


var clearConstant = new com.quantdo.orgClear.constant.ClearConstants();






