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
					<th style="text-align:center">${params.extendParams["n"]}</th>
					<th style="text-align:center">${params.extendParams["o"]}</th>
					<th style="text-align:center">${params.extendParams["a"]}</th>
					<th style="text-align:center">${params.extendParams["b"]}</th>
					<th style="text-align:center">${params.extendParams["c"]}</th>
					<th style="text-align:center">${params.extendParams["m"]}</th>
					<th style="text-align:center">${params.extendParams["d"]}</th>
					<th style="text-align:center">${params.extendParams["e"]}</th>
					<th style="text-align:center">${params.extendParams["f"]}</th>
					<th style="text-align:center">${params.extendParams["g"]}</th>
					<th style="text-align:center">${params.extendParams["h"]}</th>
					<th style="text-align:center">${params.extendParams["i"]}</th>
					<th style="text-align:center">${params.extendParams["j"]}</th>
					<th style="text-align:center">${params.extendParams["k"]}</th>
					<th style="text-align:center">${params.extendParams["l"]}</th>
				</tr>
				
				<#list data as entity>
  					<tr>
  						<#if entity.flag>
						<td style="text-align:center" rowspan="${entity.spanNum}">${entity.instClientID}</td>
						<td style="text-align:center" rowspan="${entity.spanNum}">${entity.subAccountID}</td>
						<td style="text-align:center" rowspan="${entity.spanNum}">${entity.subAccountName}</td>
						</#if>
						<td style="text-align:center">${entity.instrumentID}</td>
						<td style="text-align:center">${entity.direction}</td>
						<td style="text-align:center">${entity.leverage}</td>
						<td style="text-align:center">${entity.position}</td>
						<#if entity.flag>
						<td style="text-align:center" rowspan="${entity.spanNum}">${entity.preBalance}</td>
						</#if>
						<td style="text-align:center">${entity.preSettlementPrice}</td>
						<td style="text-align:center">${entity.lastPrice}</td>
						<td style="text-align:center">${entity.positionProfit}</td>
						<td style="text-align:center">${entity.usedMargin}</td>
						<#if entity.flag>
						<td style="text-align:center" rowspan="${entity.spanNum}">${entity.dynamicRights}</td>
						</#if>
						<#if entity.flag>
						<td style="text-align:center" rowspan="${entity.spanNum}">${entity.closeProfit}</td>
						</#if>
						<#if entity.flag>
						<td style="text-align:center" rowspan="${entity.spanNum}">${entity.sumPositionProfit}</td>
						</#if>
					</tr>
				</#list>
			</table>
		</div>
	</div>
</body>
</html>
