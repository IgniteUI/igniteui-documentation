<!--
|metadata|
{
    "fileName": "igdatachart-motion-framework",
    "controlName": "igDataChart",
    "tags": ["API","Charting"]
}
|metadata|
-->

# チャートの Infragistics Motion Framework の概要 (igDataChart)



##トピックの概要


### 目的

このトピックでは、チャートの Infragistics® Motion Framework™ の概要とチャート アニメーションを構成できる項目について説明します。

### 前提条件

この題材を理解するのにあらかじめ必要となるトピック。


-	[](igDataChart-Overview.html)[igDataChart の概要](igDataChart-Overview.html): このトピックは、`igDataChart`™ コントロールについて、その主要機能、最低必須事項、ユーザー機能といった事項の概念的情報を提供します。

-	[](igDataChart-Adding.html)[igDataChart の追加](igDataChart-Adding.html): このトピックでは、`igDataChart`™ コントロールをページに追加し、データにバインドする方法を紹介します。





##チャートの Infragistics Motion Framework


### チャートの Infragistics Motion Framework の概要

Infragistics Motion Framework はまるでデータについてのストーリーを語りかけているかのような感覚を提供し、その中でエンドユーザーは目的に合わせたカスタマイズが可能となり、アニメーション化されたユーザー エクスペリエンスを体現することができます。エンド ユーザーは、時間の流れとともに推移するデータ ポイントの動向を容易に確認できます。

Motion Framework の基本原理は、データを継続的にまたは一括でチャート コントロールに提供し、適切な API メソッドを呼び出してデータの変更に対応し、データを十分にカスタマイズできるアニメーション化された視覚表現でレンダリングすることです。

開発者は、Motion Framework を %%ProductName%% チャート コントロールと併用することによって、ビジュアルを向上させ、データの背後にある傾向や意味をあますところなく表現することができます。



##チャート アニメーション構成の概要


### チャート アニメーション構成グラフ

Infragistics Motion Network 対応の構成可能なチャート アニメーション項目のカタログです。

<table class="table">
	<thead>
		<tr>
			<th>構成可能な要素</th>
			<th>詳細</th>
			<th>プロパティ</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>切り替え間隔</td>
			<td>データ シリーズごとに、特定のデータ変更のアニメーション時間を定義できます。</td>
			<td>jQuery:<br>[series[“key”].transitionDuration](%%jQueryApiUrl%%/ui.igDataChart#options:series[“key”].transitionDuration)<br>MVC:<br>[Series.TransitionDuration()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.Series`3~TransitionDuration.html)</td>
		</tr>
		<tr>
			<td>すべてのデータ項目が置き換えられたことを示す通知</td>
			<td>項目が指定されたデータ ソースからクリアされたことをチャートに通知します。</td>
			<td><ul><li>[notifyClearItems()](%%jQueryApiUrl%%/ui.igDataChart#methods:notifyClearItems)</li></ul></td>
		</tr>
		<tr>
			<td>データ項目挿入の通知</td>
			<td>項目が指定されたデータ ソースの指定されたインデックスに挿入されたことをチャートに通知します。</td>
			<td><ul><li>[notifyInsertItem()](%%jQueryApiUrl%%/ui.igDataChart#methods:notifyInsertItem)</li></ul></td>
		</tr>
		<tr>
			<td>データ項目削除の通知</td>
			<td>項目が指定されたデータ ソースの指定されたインデックスから削除されたことをチャートに通知します。</td>
			<td><ul><li>[notifyRemoveItem()](%%jQueryApiUrl%%/ui.igDataChart#methods:notifyRemoveItem)</li></ul></td>
		</tr>
		<tr>
			<td>データ項目変更の通知</td>
			<td>項目が指定されたデータ ソースに設定されたことをチャートに通知します。</td>
			<td><ul><li> [notifySetItem()](%%jQueryApiUrl%%/ui.igDataChart#methods:notifySetItem)</li></ul></td>
		</tr>
		<tr>
			<td>データ項目追加の通知</td>
			<td>新しい項目がデータ ソースに追加されたことをチャートに通知します。</td>
			<td><ul><li>[addItem()](%%jQueryApiUrl%%/ui.igDataChart#methods:addItem)</li></ul></td>
		</tr>
		<tr>
			<td>データ項目挿入の通知</td>
			<td>新しい項目がデータ ソースに挿入されたことをチャートに通知します。</td>
			<td><ul><li>[insertItem()](%%jQueryApiUrl%%/ui.igDataChart#methods:insertItem)</li></ul></td>
		</tr>
		<tr>
			<td>データ項目削除の通知</td>
			<td>新しい項目がデータ ソースから削除されたことをチャートに通知します。</td>
			<td><ul><li>[removeItem()](%%jQueryApiUrl%%/ui.igDataChart#methods:removeItem)</li></ul></td>
		</tr>
		<tr>
			<td>データ項目更新の通知</td>
			<td>項目がデータ ソースで更新されたことをチャートに通知します。</td>
			<td><ul><li>[setItem() ](%%jQueryApiUrl%%/ui.igDataChart#methods:setItem)</li></ul></td>
		</tr>
	</tbody>
</table>

###<a id="motion-framework-sample"></a> サンプル

以下のサンプルでは、igDataChart で Motion Framework™ を使用し、データの推移を効果的に視覚化しています。

<div class="embed-sample">
   [Motion Framework](%%SamplesEmbedUrl%%/data-chart/motion-framework)
</div>

##関連コンテンツ


### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[HTML および JavaScript におけるチャートのアニメーション化 (igDataChart)](igDataChart-Animating-HTML.html)

このトピックでは、コード例を使用して、HTML および JavaScript で簡単なアニメーション化された柱状チャートを追加する方法を示します。

-	[ASP.NET MVC でのチャートのアニメーション化 (igDataChart)](Animating-Charts-in-ASP.NET-MVC.html)

このトピックでは、コード例を使用して、AJAX POST 要求を使用してデータを動的に追加しているMVC で、簡単なアニメーション化された柱状チャートを追加する方法を示します。






 

 


