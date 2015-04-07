<!--
|metadata|
{
    "fileName": "adding-igrating(mobile)-to-a-web-page",
    "controlName": "igRatingMobile",
    "tags": ["Data Presentation","Getting Started"]
}
|metadata|
-->

# igRating (Mobile) の Web ページへの追加

## トピックの概要

### 目的

このトピックでは、`igRating`™ モバイル コントロールをウェブ ページに追加する方法を説明します。

### 前提条件

- 概念
	- jQuery Mobile フレームワーク
- トピック
	- [igRating の概要](igRating%28Mobile%29-Overview.html): このトピックでは、`igRating`™ コントロールの主な特長および機能を紹介します。
- 外部リソース
	- [jQuery Mobile イベント](http://jquerymobile.com/demos/1.1.0-rc.1/docs/api/events.html)


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**igRating の Web ページへの追加**](#adding)
    -   [概要](#adding-overview)
    -   [手順](#adding-steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="adding"></a> igRating の Web ページへの追加

ここでは、`igRating` コントロールを Web ページに追加する手順について説明します。コントロールのインスタンスを作成する方法はいくつかかあります。このトピックでは一般的な jQuery UI メソッド、jQuery モバイル メソッド (属性を使用して) および MVC Rating ラッパーを使用したコントロールのインスタンス化を示します。

### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/02_igRatingAdding_1.png)

### <a id="adding-overview"></a> 概要

このトピックでは、`igRating` コントロールを Web ページに追加する手順をステップごとに説明します。以下はプロセスの概念的概要です。

1. [必要な JavaScript および CSS ファイルを参照します](#reference-resources)
2. [igRating のインスタンス化](#instantiate-igListView)

### <a id="adding-steps"></a> 手順

ここでは、`igRating` コントロールを Web ページに追加する手順について説明します。

1. 必要な JavaScript および CSS ファイルを参照します。 <a id="reference-resources"></a>

	必要なファイルを追加する方法は 2 つあります。1 つは個別のスクリプトを使用し、もう 1 つは [Infragistics ローダー コンポーネント](Using-Infragistics-Loader.html)を使用します。
	
	ローダーを使用してレーティング コントロールをインスタンス化する方法を推奨します。以下の各コードは、ローダー コンポーネントを設定して手動でローダーを作動させる方法を示したものです。
	
	1. 個々のファイルを使用して参照します。
	
		**HTML の場合:**
		
		```html
		<link rel="stylesheet" href="jquery.mobile.structure.min.css" />
		<link rel="Stylesheet" href="infragistics.mobile.theme.css" />
		<link rel="Stylesheet" href="infragistics.mobile.rating.css" />
		    
		<script type="text/javascript" src="jquery.min.js"></script>
		<script type="text/javascript" src="jquery.mobile.min.js"></script>
		<script type="text/javascript" src="infragistics.mobileui.rating.js"></script>
		```

	2. Infragistics Loader を使用して参照します。
	
		**HTML の場合:**
		
		```html
		<link rel="stylesheet" href="jquery.mobile.structure.min.css" />
		<script type="text/javascript" src="jquery.min.js"></script>
		<script type="text/javascript" src="jquery.mobile.min.js"></script>
		<script type="text/javascript" src="infragistics.mobile.loader.js"></script>
		```
		
		**JavaScript の場合:**
		
		```js
		<script type="text/javascript">
		    $.ig.loader({
		        scriptPath: "../js/",
		        cssPath: "../css/",
		        resources: "igmRating",
		        theme: "ios"
		    });
		</script>
		```

2. `igRating` のインスタンス化 <a id="instantiate-igListView"></a>
	1. マークアップを使用したインスタンス化

		マークアップのみで Web ページの `igRating` コントロールを初期化する場合、HTML DIV 要素を定義し、適切な属性を定義する必要があります。すると付属の Ignite UI ファイルが背後でウィジットを初期化します。
		
		必要な属性を定義するには、HTML 5 `data-*` 属性を使用して `igRating` コントロールのすべての初期設定を行います。
		
		`data-role` 属性は、HTML 要素をラップするコントロールを定義します。同時に他のオプションは、`igRating` コントロールの外観と動作をカスタマイズします。
		
		**HTML の場合:**
		
		```html
		<div id="igRating1"
		    data-role="igrating"
		    data-value="2"
		    data-vote-count="5"
		    data-read-only="false">
		</div>
		```

	2. JavaScript におけるインスタンス化
	
		i. DIV HTML プレースホルダーを定義します。
		
		**HTML の場合:**
		
		```html
		<div id="igRating"></div>
		```
		
		ii. JavaScript 初期化コード
		
		Infragistics ローダー コンポーネントを使用している場合、以下のコードをローダーのコールバック関数内に入れることができます。
		
		**JavaScript の場合:**
		
		```js
		$.ig.loader(function () {
		/*Initialization code here*/
		});
		```
		
		個別のファイルを参照する場合、以下のコードに示すように jQuery Mobile `pageinit` イベントにバインドできます。
		
		**JavaScript の場合:**
		
		```js
		$(document).bind({ pageinit: function () {
		    $("#igRating1").igRating({
		        value: 2,
		        voteCount: 5,
		        readOnly: false
		    });
		}});
		```
	
	3.  Razor 構文を使用して MVC でインスタンスを作成します。
	
		**C# の場合:**
		
		```csharp
		@(Html
		    .InfragisticsMobile()
		    .Rating()
		    .ID("igRating1")
		    .Value(2)
		    .VoteCount(5)
		    .ReadOnly(false)
		    .Render()
		)
		```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igRating モバイルの概要](igRating%28Mobile%29-Overview.html): このトピックでは `igRating` コントロールの主な機能を紹介します。

- [データ属性リファレンス](igRating-Data-Attributes-Reference.html): このトピックでは、すべての `igRating`™ データ属性をリストしています。これらの属性を使用してマークアップで `igRating` を初期化できます。

- [既知の問題と制限](igRating%28Mobile%29-Known-Issues.html): このトピックでは、モバイル `igRating` コントロールの既知の問題を説明します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-rating/basic-usage): `igRating` モバイルの初期化方法を示すサンプル。





 

 


