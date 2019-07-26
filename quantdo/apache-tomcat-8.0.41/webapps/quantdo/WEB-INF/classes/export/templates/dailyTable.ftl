<html>
<head>
<title></title>
<style type="text/css">
body {
	margin-left: 45px;
	margin-right: 45px;
	font-family: Arial Unicode MS;
	font-size: 10px;
}

table {
	margin: auto;
	width: 100%;
	border-collapse: collapse;
	border: 1px solid #444444;
}

th {
	text-align: center;
}

th,td {
	border: 1px solid #444444;
	font-size: 10px;
	margin-left: 5px;
}

.logo {
	text-align: center;
}

.title {
	text-align: center;
	font-weight: bold;
	font-size: 20px;
}

.notes {
	font-weight: normal;
	margin-left: 5px;
	margin-right: 5px;
	line-height: 18px;
}

.text_content {
	margin-left: 5px;
	margin-right: 5px;
	line-height: 18px;
}

.title_right {
	width: 100%;
	margin: 0 auto;
}

.title_right p {
	text-align: left;
	margin: 0;
	margin-left: 50%;
	padding: 0;
}

@page {
	size: 8.5in 11in;
	@
	bottom-center
	{
	content
	:
	"page "
	counter(
	page
	)
	" of  "
	counter(
	pages
	);
}

</style>
</head>
<body>
	<div>
		<div class="title">
			${params.title}
		</div>
		
		<div>
			<table cellpadding="0" cellspacing="0"
				width="100%" style="table-layout:fixed;">
				<tr>
					<td colspan="11" style="text-align:center">${data[7].title}</td>
				</tr>
				<tr>
					<td style="text-align:center">${params.dicMap["title"]["9"]}</td>
					<td style="text-align:center">${data[7].instClientID}</td>
					<td style="text-align:center">${params.dicMap["title"]["6"]}</td>
					<td colspan="2" style="text-align:center">${data[7].subAccountID}</td>
					<td style="text-align:center">${params.dicMap["title"]["7"]}</td>
					<td colspan="2" style="text-align:center">${data[7].subAccountName}</td>
					<td style="text-align:center">${params.dicMap["title"]["8"]}</td>
					<td colspan="2" style="text-align:center">${data[7].tradeDate}</td>
				</tr>
				
			</table>
		</div>
		
		<div>
			<#list data[0] as entity>
				<table cellpadding="0" cellspacing="0"
					width="100%" style="table-layout:fixed;">
					<tr>
						<td colspan="3" style="text-align:center">${params.dicMap["title"]["0"]}</td>
						<td colspan="3" style="text-align:center">${params.dicMap["subAccountCapital"]["8"]}${params.dicMap["currency"][entity.currency]}</td>
					</tr>
					
					<tr>
						<td style="text-align:center">${params.dicMap["subAccountCapital"]["0"]}</td>
						<td style="text-align:center">${entity.lastInterest}</td>
						<td style="text-align:center">${params.dicMap["subAccountCapital"]["3"]}</td>
						<td style="text-align:center">${entity.profitloss}</td>
						<td style="text-align:center">${params.dicMap["subAccountCapital"]["6"]}</td>
						<td style="text-align:center">${entity.available}</td>
					</tr>
					<tr>
						<td style="text-align:center">${params.dicMap["subAccountCapital"]["1"]}</td>
						<td style="text-align:center">${entity.subMoney}</td>
						<td style="text-align:center">${params.dicMap["subAccountCapital"]["4"]}</td>
						<td style="text-align:center">${entity.finalInterest}</td>
						<td style="text-align:center">${params.dicMap["subAccountCapital"]["7"]}</td>
						<td style="text-align:center">${entity.riskValue}</td>
					</tr>
					<tr>
						<td style="text-align:center">${params.dicMap["subAccountCapital"]["2"]}</td>
						<td style="text-align:center">${entity.tradeFee}</td>
						<td style="text-align:center">${params.dicMap["subAccountCapital"]["5"]}</td>
						<td style="text-align:center">${entity.totalMargin}</td>
						<td style="text-align:center">${params.dicMap["subAccountCapital"]["9"]}</td>
						<td style="text-align:center">${entity.totalPremium}</td>
					</tr>
							
				</table>
			</#list>	
		</div>
		
		<div>
			<table cellpadding="0" cellspacing="0"
				width="100%" style="table-layout:fixed;">
				<tr>
					<th colspan="5" style="text-align:center">${params.dicMap["title"]["1"]}</th>
				</tr>
				
				<tr>
					<th style="text-align:center">${params.dicMap["subMoneyIO"]["0"]}</th>
					<th style="text-align:center">${params.dicMap["subMoneyIO"]["1"]}</th>
					<th style="text-align:center">${params.dicMap["subMoneyIO"]["2"]}</th>
					<th style="text-align:center">${params.dicMap["subMoneyIO"]["3"]}</th>
					<th style="text-align:center">${params.dicMap["subMoneyIO"]["4"]}</th>
				</tr>
				
				<#list data[1] as entity>
					<tr>
						<td style="text-align:center">${entity.settleDate}</td>
						<td style="text-align:center">${entity.direction}</td>
						<td style="text-align:center">${entity.subMoney}</td>
						<td style="text-align:center">${params.dicMap["currency"][entity.currency]}</td>
						<td style="text-align:center">${entity.remark!}</td>
					</tr>
				</#list>
			</table>
		</div>
		
		<div>
			<table cellpadding="0" cellspacing="0"
				width="100%" style="table-layout:fixed;">
				<tr>
					<th colspan="8" style="text-align:center">${params.dicMap["title"]["2"]}</th>
				</tr>
				
				<tr>
					<th style="text-align:center">${params.dicMap["tradeQuery"]["0"]}</th>
					<th style="text-align:center">${params.dicMap["tradeQuery"]["1"]}</th>
					<th style="text-align:center">${params.dicMap["tradeQuery"]["2"]}</th>
					<th style="text-align:center">${params.dicMap["tradeQuery"]["3"]}</th>
					<th style="text-align:center">${params.dicMap["tradeQuery"]["4"]}</th>
					<th style="text-align:center">${params.dicMap["tradeQuery"]["5"]}</th>
					<th style="text-align:center">${params.dicMap["tradeQuery"]["6"]}</th>
					<th style="text-align:center">${params.dicMap["tradeQuery"]["7"]}</th>
				</tr>
				
				<#list data[2] as entity>
					<tr>
						<td style="text-align:center">${entity.instrumentId}</td>
						<td style="text-align:center">${params.dicMap["direction"][entity.direction]}</td>
						<td style="text-align:center">${params.dicMap["offsetFlag"][entity.offsetFlag!"blank"]}</td>
						<td style="text-align:center">${params.dicMap["tradeType"][entity.hedgeFlag!"blank"]}</td>
						<td style="text-align:center">${entity.tradePrice}</td>
						<td style="text-align:center">${entity.volume}</td>
						<td style="text-align:center">${entity.tradeMoney}</td>
						<td style="text-align:center">${entity.tradeFee}</td>
					</tr>
				</#list>
				<tr>
					<td style="text-align:center">${params.dicMap["title"]["5"]}</td>
					<td style="text-align:center"></td>
					<td style="text-align:center"></td>
					<td style="text-align:center"></td>
					<td style="text-align:center"></td>
					<td style="text-align:center">${data[5].volume!0}</td>
					<td style="text-align:center">${data[5].tradeMoney!0}</td>
					<td style="text-align:center">${data[5].tradeFee!0}</td>
				</tr>
			</table>
		</div>
		
		<div>
			<table cellpadding="0" cellspacing="0"
				width="100%" style="table-layout:fixed;">
				<tr>
					<th colspan="8" style="text-align:center">${params.dicMap["title"]["4"]}</th>
				</tr>
				
				<tr>
					<th style="text-align:center">${params.dicMap["subOffSet"]["0"]}</th>
					<th style="text-align:center">${params.dicMap["subOffSet"]["1"]}</th>
					<th style="text-align:center">${params.dicMap["subOffSet"]["2"]}</th>
					<th style="text-align:center">${params.dicMap["subOffSet"]["3"]}</th>
					<th style="text-align:center">${params.dicMap["subOffSet"]["4"]}</th>
					<th style="text-align:center">${params.dicMap["subOffSet"]["5"]}</th>
					<th style="text-align:center">${params.dicMap["subOffSet"]["6"]}</th>
					<th style="text-align:center">${params.dicMap["subOffSet"]["7"]}</th>
					<th style="text-align:center">${params.dicMap["subOffSet"]["8"]}</th>
				</tr>
				
				<#list data[4] as entity>
					<tr>
						<td style="text-align:center">${entity.instrumentID}</td>
						<td style="text-align:center">${entity.direction}</td>
						<td style="text-align:center">${entity.tradePrice}</td>
						<td style="text-align:center">${entity.openPrice}</td>
						<td style="text-align:center">${entity.volume}</td>
						<td style="text-align:center">${entity.lastSettlePrice}</td>
						<td style="text-align:center">${entity.profitlossByDate}</td>
				        <td style="text-align:center">${params.dicMap["tradeType"][entity.tradeType!"blank"]}</td>
						<td style="text-align:center">${params.dicMap["currency"][entity.currency]}</td>
					</tr>
				</#list>

                <tr>
                    <td style="text-align:center">${params.dicMap["title"]["5"]}</td>
                    <td style="text-align:center"></td>
                    <td style="text-align:center"></td>
                    <td style="text-align:center"></td>
                    <td style="text-align:center">${data[8].tradeVolume!0}</td>
                    <td style="text-align:center"></td>
                    <td style="text-align:center">${data[8].totleProfitloss!0}</td>
                    <td style="text-align:center"></td>
                    <td style="text-align:center"></td>
                </tr>

			</table>
		</div>



		<div>
			<table cellpadding="0" cellspacing="0"
				width="100%" style="table-layout:fixed;">
				<tr>
					<th colspan="10" style="text-align:center">${params.dicMap["title"]["3"]}</th>
				</tr>
				
				<tr>
					<th style="text-align:center">${params.dicMap["subPosition"]["0"]}</th>
					<th style="text-align:center">${params.dicMap["subPosition"]["1"]}</th>
					<th style="text-align:center">${params.dicMap["subPosition"]["2"]}</th>
					<th style="text-align:center">${params.dicMap["subPosition"]["3"]}</th>
					<th style="text-align:center">${params.dicMap["subPosition"]["4"]}</th>
					<th style="text-align:center">${params.dicMap["subPosition"]["5"]}</th>
					<th style="text-align:center">${params.dicMap["subPosition"]["6"]}</th>
					<th style="text-align:center">${params.dicMap["subPosition"]["7"]}</th>
					<th style="text-align:center">${params.dicMap["subPosition"]["8"]}</th>
					<th style="text-align:center">${params.dicMap["subPosition"]["9"]}</th>
				</tr>
				
				<#list data[3] as entity>
					<tr>
						<td style="text-align:center">${entity.instrumentID}</td>
						<#if !entity.inPositionPrice?exists>
							<td style="text-align:center">-</td>
						<#elseif entity.inPositionPrice = 0>
							<td style="text-align:center">-</td>
						<#else>
							<td style="text-align:center">${entity.inPositionPrice!}</td>
						</#if>
						
						<#if !entity.inPosition?exists>
							<td style="text-align:center">-</td>
						<#elseif entity.inPosition = 0>
							<td style="text-align:center">-</td>
						<#else>
							<td style="text-align:center">${entity.inPosition!}</td>
						</#if>
						
						<#if !entity.outPositionPrice?exists>
							<td style="text-align:center">-</td>
						<#elseif entity.outPositionPrice = 0>
							<td style="text-align:center">-</td>
						<#else>
							<td style="text-align:center">${entity.outPositionPrice!}</td>
						</#if>
						
						<#if !entity.outPosition?exists>
							<td style="text-align:center">-</td>
						<#elseif entity.outPosition = 0>
							<td style="text-align:center">-</td>
						<#else>
							<td style="text-align:center">${entity.outPosition!}</td>
						</#if>
						
						<td style="text-align:center">${entity.lastSettlePrice}</td>
						<td style="text-align:center">${entity.settlePrice}</td>
						<td style="text-align:center">${entity.profitlossByDate}</td>
						<td style="text-align:center">${entity.margin}</td>
						<td style="text-align:center">${params.dicMap["tradeType"][entity.tradeType!"blank"]}</td>
					</tr>
				</#list>
				<tr>
					<td style="text-align:center">${params.dicMap["title"]["5"]}</td>
					<td style="text-align:center"></td>
					<td style="text-align:center">${data[6].inPosition!0}</td>
					<td style="text-align:center"></td>
					<td style="text-align:center">${data[6].outPosition!0}</td>
					<td style="text-align:center"></td>
					<td style="text-align:center"></td>
					<td style="text-align:center"></td>
					<td style="text-align:center">${data[6].margin!0}</td>
					<td style="text-align:center"></td>
				</tr>
			</table>
		</div>
		
	</div>
</body>
</html>
