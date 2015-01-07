<!--
|metadata|
{
    "fileName": "iglistview-generating-direct-links-to-child-layouts",
    "controlName": "igListView",
    "tags": ["How Do I"]
}
|metadata|
-->

# 子レイアウトとの直接リンクの生成

## トピックの概要

### 目的

このトピックでは、`igListView`™ コントロールの子レイアウトへの直接リンクを生成する方法をコード例を用いて説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igListView の Web ページへの追加](igListView-Adding-igListView-to-a-Web-Page.html): このトピックでは、`igListView`™ モバイル コントロールを Web ページに追加する方法について説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**子レイアウトへの直接リンクの生成 - 概念的概要**](#overview)
-   [**子レイアウトへの直接リンクの生成 - コード例**](#example)
-   [**関連コンテンツ**](#related-content)



## <a id="overview"></a> 子レイアウトへの直接リンクの生成 - 概念的概要 
### 概要

`igListView` コントロールでは、子レイアウトの静的リンクを生成できるようになりました。子レイアウトの静的リンクを生成すると、外部 Web ページのどれかから直接子レイアウトに移動できます。

![](images/GeneratingDirectLinksToChildLayouts_CopyEdited_1.png)

上の画像では、赤い矢印はユーザーが通常従う必要があるルートを示しています（子レイアウトへの直接リンクを使用しない場合）。これらは最初にリストビューに移動してから、子レイアウトへ移動します。直接リンクを使用すると、ユーザーはレイアウトに直接移動できます（緑の矢印）。

静的リンクの生成は、`igListView` コントロールのオプション、`generateSubPagesOnInit` によって管理されます。`generateSubPagesOnInit` オプションを true に設定すると、直接リンクの生成が可能になります。

`igListView` インスタンスの生成された直接リンクは、そのすべての子レイアウトに対して 固有です。リンクの形成において、データベースからのプライマリ キー フィールドを使用することによって唯一性を確保します（*直接リンクの構文*を参照）。

### 直接リンクの構文

直接リンクを形成するパターンは以下の通りです。

```
<target web page URL>&ui-page=<ID of the listview>-<PrimaryKey>/< PrimaryKey value >
```

たとえば、`igListview` の `ID` が `listView1` の場合、プライマリ キーのデータベース フィールドは `MarketID` であり、最初の親項目のプライマリ キーの値は *1* です。直接リンクの URL は `Markets.html&ui-page=listView1-MarketID/1` です。

### 要件

以下は、子レイアウトへの直接リンク URL を生成するための一般的な要件です。

-   外部（開始）ページと子レイアウト（宛先）ページは共に、AJAX に対応している必要があります。
-   データ ソースはローカルである必要があります。
-   データ ソースは、外部（開始）ページと子レイアウト（宛先）ページ両方で利用できる必要があります。

> **注:**
>
> データは、以下のいずれかとしてページに供給できます。
> 
> -    スクリプト タグ内
> -    JavaScript ファイルへのリンク

### プロパティ設定

以下の表では、直接リンク URL を生成するために目的のプロパティ設定をマップしています。

プロパティ|設定
---- | -----
[CreateSubPagesOnInit プロパティ](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ListViewModel~CreateSubPagesOnInit.html)|true



## <a id="example"></a> 子レイアウトへの直接リンクの生成 - コード例

以下の例には、2 つの HTML ページが示されています。最初のページ（開始ページ）には、2 番目の HTML ページ（ランディング ページ）の `igListView` の子レイアウトへのリンクが含まれています。子レイアウトへの直接 URL リンクを受け入れるように `igListView` を構成することによって、最初のページのリンクは、2 番目のページの特定の子レイアウトにユーザーを導きます。この動作を例示するには、`igListView` で 2 番目のページのスクリプト ブロック内の定義済みローカル JSON データをバインドします。

### 前提条件

この手順を実行するには、以下のリソースが必要です。

-   Html、Head および Body タグが含まれ、Home.html に指定された HTML ページ。
-   Html、Head および Body タグが含まれ、Markets.html に指定された HTML ページ。
-   両方のページで参照される、必要な JavaScript および CSS ファイル。詳細は、[igListView を Web ページに追加](igListView-Adding-igListView-to-a-Web-Page.html)を参照してください。

### 概要

以下はプロセスの概念的概要です。

1.  Markets ページの作成
2.  Home ページの作成
3.  結果の検証

### 手順

1. Markets ページを作成します。

	1. ローカル データ ソースをページに追加します。編集のために *Markets.html* ファイルを開き、データが含まれる以下のスクリプトを HEAD タグに追加します。
		
		**JavaScript の場合:**
		
		```
		var markets = [{
		        "MarketID": 1,
		        "Name": "GreenShop",
		        "Branches": [
		      { "chid": 1, "City": "New York" },
		      { "chid": 5, "City": "Sofia"}]
		    }, {
		        "MarketID": 2,
		        "Name": "RedShop",
		        "Branches": [
		      { "chid": 2, "City": "Rio" },
		      { "chid": 3, "City": "Moscow"}]
		    }];
		```

	2. `igListView` コントロールを追加し、`generateSubPagesOnInit` オプションを true に設定します。
		
		`igListView` を作成し、上のスニペットの markets 配列にデータ ソースを設定します。
		
		**HTML の場合:**
		
		```
		<body>
		    <div data-role="page">
		            <div data-role="header">
		                  <h1>Branches</h1>
		                  <a href="#" data-icon="home" data-iconpos="notext">Home</a>
		            </div>
		            <div data-role="content">
		            <div id="listView1" data-role="iglistview"
		                        data-data-source="markets" data-bindings-primary-key="MarketID" 
		                        data-data-source-type="json" data-bindings-text-key="Name"
		                        data-show-count="true" data-local-schema-transform="true" 
		                        data-create-sub-pages-on-init="true">
		                        <ul>
		                        <li>
		                              <ul data-role="childLayout" data-key="Branches" 
		                                    data-data-source-type="json" data-data-bind-text-key="City" 
		                                    data-item-template="City: ${City}">
		                              </ul>                              
		                              </li>
		                        <ul>
		                  </div>
		            </div>
		    </div> 
		</body>
		```

	3. HTML ファイルを保存します。

2. Home ページを作成します。

	1. 宛先ページのデータ ソースを追加します。編集のために *Home.html* ファイルを開き、データが含まれる以下のスクリプトを HEAD タグに追加します。
	
		> **注:**
		>
		> Home ページに使用したものと同じデータ ソースを含める必要があります。ページ要求に対して AJAX が有効な場合、応答からのヘッド コンテンツが使用されないため、これは必須です。詳細は、[スクリプティング ページ](http://jquerymobile.com/test/docs/pages/page-scripting.html)を参照してください。
		
		**JavaScript の場合:**
		
		```
		var markets = [{
		      "MarketID": 1,
		      "Name": "GreenShop",
		      "Branches": [
		      { "chid": 1, "City": "New York"},
		      { "chid": 5, "City": "Sofia"}]
		}, {
		      "MarketID": 2,
		      "Name": "RedShop",
		      "Branches": [
		      { "chid": 2, "City": "Rio"},
		      { "chid": 3, "City": "Moscow"}]
		}];
		```

	2. リンクを宛先ページに追加します。
		
		以下のコード スニペットでは、`igListview` の `ID` は `listView1`、プライマリ キーのデータベース フィールドは `MarketID`、最初の親項目のプライマリ キーの値は *1* です。リンクは、
		
		```
		Markets.html&ui-page=listView1-MarketID/1
		```

		**HTML の場合:**
		
		```
		<body>
		      <div data-role="page" id="myID">
		            <div data-role="content">
		                  <div data-role="header" >
		                        <h1>Market Branches</h1>
		                  </div>
		                  <div data-role="controlgroup">
		                        <a data-role="button"
		                        href="Markets.html&ui-page=listView1-MarketID/1">GreenShop Branches</a>
		                        <a data-role="button"
		                        href="Markets.html&ui-page=listView1-MarketID/2">RedShop Branches</a>
		                  </div>      
		            </div>
		      </div>
		</body>
		```
	
	3. HTML ファイルを保存します。

3. 結果を検証します。

Home.html ファイルをブラウザで開き、2 つのリンク ボタンのいずれかをクリックします。コードを正しく実装した場合、Markets.html ページの `igListView` のそれぞれの子レイアウトに移動します。




## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック


このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*igListView* の概要](igListView-Overview.html): このトピックでは、`igListView` の機能について説明します。





 

 


