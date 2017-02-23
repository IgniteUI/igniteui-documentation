<!--
|metadata|
{
    "fileName": "iggrid-groupby-summaries",
    "controlName": "igGrid",
    "tags": ["Getting Started","Grids","Grouping", "Summaries"]
}
|metadata|
-->

# グループ化集計の機能概要 (igGrid)

## トピックの概要

### 目的

このトピックでは、`igGrid`™ のグループ集計機能を紹介します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [グループ化集計の機能概要](#summaries-overview)
-   [グループ化集計機能の有効化](#enable-summaries)
	- [基本設定](#summaries-basic)
	- [詳細設定](#summaries-advanced)
    - [カスタム集計](#summaries-custom)
-   [関連コンテンツ](#related-content)


## <a id="summaries-overview"></a> グループ化集計の機能概要

グループ化集計機能は、そのアイランドにあるデータ列の集計情報を表示するグループ データ アイランドの下に追加の集計行を表示します。以下の画像は、グループ化された列を持つグリッドで各グループの下に「Price」列の合計数が集計行に表示されます。

![](images/igGrid_GroupBy_Summaries_Overview_01.png)
    
この機能は、データ グループの意味のある集計を提供するためにデフォルトの集計関数 (合計、最小値、最大値、平均値など) の結果、またはカスタム集計の結果を表示できます。

## <a id="enable-summaries"></a> グループ化集計機能の有効化

### <a id='summaries-basic'></a> 基本設定

グループ集計機能を有効にするには、[`groupSummaries`](%%jQueryApiUrl%%/ui.iggridgroupby#options:groupSummaries) オプションを有効にします。

```js
$("#grid1").igGrid({
     features: [
       {
           name: 'GroupBy',
           groupSummaries: true
       }
    ],
    dataSource: data
});
```


有効な場合、グリッドは関連の列タイプにデフォルト集計を描画します。 
以下は列タイプに基づいたデフォルト列集計です。

集計|適用する列型 |
-------  | ------- |
カウント|すべての列タイプ
最小値|数値、日付
最大値|数値、日付
合計値|数値
平均|数値

以下にデフォルト設定の結果の例を示します。

![](images/igGrid_GroupBy_Summaries_Overview_02.png)

適用可能な列タイプおよびデフォルト集計に関連するその他のオプションを `$.ig.util.defaultSummaryMethods` で変更できます。

### <a id='summaries-advanced'></a>詳細設定

以下のリストはメイン集計に関連するオプションについての情報を含みます。

オプション | 説明 | デフォルト値 | 有効な値 |
--------|-------------|----------------|-------------
[groupSummaries](%%jQueryApiUrl%%/ui.iggridgroupby#options:groupSummaries) |各列に適用されるデフォルト集計メソッドを制御します。<br/>**true** の場合 - デフォルト集計はすべての列で有効されます。<br/>**false** の場合 - デフォルト集計はすべての列で無効されます。<br/>**array** の場合 - 配列に指定された集計はすべての列で適用されます。集計オブジェクトの形式については [groupSummariesObject](#groupSummariesObject) を参照してください。<br/>|false |true, false, array|
[columnSettings.groupSummaries](%%jQueryApiUrl%%/ui.iggridgroupby#options:columnSettings.groupSummaries)|columnSettings の列の集計を設定するオブジェクトの配列。メイン groupSummaries オプションより優先があります。<br/>**true** の場合 - デフォルト集計は指定した列で有効されます。<br/>**false** の場合 - デフォルト集計は指定した列で無効されます。<br/>**array** の場合 - 配列に指定された集計は指定した列で適用されます。集計オブジェクトの形式については [groupSummariesObject](#groupSummariesObject) を参照してください。<br/>|null |true, false, array, null|

groupSummaries オプションは、true/false に設定して集計を有効/無効にできます。また、その集計タイプを許可するすべての列で適用されるデフォルトの集計メソッドを配列で指定できます。以下の例は「合計」の単一のデフォルト集計の設定を指定することを紹介します。

```js
$("#grid1").igGrid({
   features: [
	{
       	name: "GroupBy",
		initialExpand: false,
		groupSummaries: [
			{
				summaryFunction: "Sum",
				label: "Total = "
			}
		]
     ]
    dataSource: data
});
```

この集計は、データ型の適用が許可されるすべての列に適用されます。 
この例で、「合計」は数値列のみに適用可能ため、グリッドのすべての数値列は集計行で「合計」集計が表示されます。

columnSettings.groupSummaries オプションは列で集計の指定を許可します。これは groupSummaries メイン レベル オプションより優先されます。特定の列でこのオプションが設定される場合、この列に関連するメイン groupSummaries オプションからの設定は無視されます。

集計オプションの指定のために使用される <a id="groupSummariesObject"></a>**groupSummariesObject** は以下のプロパティを持ちます:

名前|説明|タイプ|デフォルト値 |
----|-------------|------|---------------|
summaryFunction|集計を指定する名前またはカスタム関数。|string または function |
label |集計値の表示で使用されるラベルを設定します。|string |
summaryTemplate|各集計結果のテンプレートを設定します。|string |"{label}{value}"
format |集計値の書式設定を適用します。|string |グリッドの column.format 値。

グリッドの集計行に表示される集計の外観をカスタマイズできます。

### <a id='summaries-custom'></a> カスタム集計

カスタム集計は、データ アイランドからのデータの集計に使用するカスタム関数を指定します。
カスタム集計を設定するには、グループの summaries オブジェクトの `summaryFunction` プロパティに関数を設定します。
カスタム集計をすべての列または特定の列に適用することにより、グループ集計オブジェクトを最上位 GroupBy groupSummaries 配列または特定の列の columnSettings で定義します。 
関数はデータ アイランドのデータを受け、そのデータの集計結果を返します。

カスタム集計の例:

```js
$("#grid1").igGrid({
    features: [
         {
            name: "GroupBy",
            initialExpand: false,
            columnSettings: [
                {
                    columnKey: "ExisitingCustomer",
                    groupSummaries: [
                     {
                         summaryFunction: existingCount,
                         label: "Existing Count: "
                      }
                    ]
                }
        }
    ],
    dataSource: data
 });

function existingCount(data) {
    var i, count = 0; 
    for (i = 0; i < data.length; i++) {
        if(data[i] === "Y"){
           count++;
       }
    }
    return count;
}
 ```


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックに関連する追加情報については、以下のトピックを参照してください。

- [グリッド Outlook Group By のセットアップ](igGrid-Enabling-GroupBy.html)

- [グリッド Outlook Group By プロパティ リファレンス](%%jQueryApiUrl%%/ui.iggridgroupby#options)