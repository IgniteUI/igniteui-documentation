<!--
|metadata|
{
    "fileName": "iglayoutmanager-handling-events",
    "controlName": "igLayoutManager",
    "tags": ["How Do I","Events","Layouts"]
}
|metadata|
-->

# イベント処理 (igLayoutManager)



##トピックの概要


### 目的

このトピックではコード例を使用して、イベント ハンドラーを `igLayoutManager`™ コントロールにアタッチする方法を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

-	[%%ProductName%% でイベントの使用](Using-Events-in-IgniteUI-for-jQuery.html): このトピックでは、Web アプリケーションで %%ProductName%%® を操作して、必要なリソースを管理する方法について説明します。

-	[igLayoutManager の概要](igLayoutManager-Overview.html): このトピックでは、`igLayoutManager` コントロールの概念について説明し、サポートされているレイアウトやその使用についての情報を提供します。

-	[igLayoutManager の追加](igLayoutManager-Adding.html): このトピックではコード例を使用して、HTML 単体、JavaScript または ASP.MVC 実装のいずれかで `igLayoutManager` コントロールを HTML ページに追加する方法を説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**イベントの処理 - 概要**](#overview)
    -   [イベント処理の概要](#summary)
    -   [イベント処理ケースの概要表](#event-handaling)
-   [**コード例**](#code-examples)
-   [**コード例: jQuery での初期化時に itemRendered イベントを処理する**](#example-jquery)
    -   [説明](#itemRender-jquery-description)
    -   [コード](#itemRender-jquery-code)
-   [**コード例: ASP.NET での初期化時の itemRendered イベントの処理**](#example-asp-net)
    -   [説明](#itemRender-mvc-description)
    -   [コード](#itemRender-mvc-code)
-   [**コード例: jQuery での実行時に itemRendered イベントを処理する**](#example-run-time-jquery)
    -   [説明](#itemRender-jquery-description-run-time)
    -   [コード](#itemRender-jquery-code-run-time)
-   [**コード例: ASP.NET MVC での実行時に itemRendered イベントを処理する**](#example-run-time-mvc)
    -   [説明](#itemRender-mvc-description-run-time)
    -   [コード](#itemRender-mvc-code-run-time)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="overview"></a>イベントの処理 - 概要


### <a id="summary"></a>イベント処理の概要

イベント ハンドラー関数の `igLayoutManager` コントロールへのアタッチは、一般的にコントロールの初期化時に行われます。

HTML 内ではイベント ハンドラーを定義できないので、%%ProductNameMVC%% を使用するときは、実行時にイベント ハンドラーを割り当てる必要があります。

jQuery はイベント ハンドラーの割り当てるための以下のメソッドをサポートします。

-   bind()
-   delegate()
-   live()
-   on()

`igLayoutManager` は、以下のイベントをサポートします。

-   [`itemRendering`](%%jQueryApiUrl%%/ui.iglayoutmanager#events:itemRendering) - コンテナーで 1 つの項目が描画された後に発生します。
-   [`itemRendered`](%%jQueryApiUrl%%/ui.iglayoutmanager#events:itemRendered) - すべての項目が描画された後に発生します。
-   [`rendered`](%%jQueryApiUrl%%/ui.iglayoutmanager#events:rendered) - 項目がコンテナーの幅または高さに完全に対応しようとする前に発生します。

イベントを処理する方法の詳細は、[%%ProductName%% でのイベントの使用](Using-Events-in-IgniteUI-for-jQuery.html)のトピックを参照してください。

### <a id="event-handaling"></a>イベント処理ケースの概要表

以下の表で、`igLayoutManager` に関連するイベント処理ケースを簡単に説明します。詳細は、表の後に記載されています。

<table cellspacing="0" cellpadding="0">
	<tbody>
		<tr>
			<th>
				イベント処理ケース
			</th>

			<th>
				詳細
			</th>
		</tr>

		<tr>
			<td>
				jQuery における初期化時のイベント処理
			</td>

			<td>
				ウィジェット初期化時にイベントへバインドすると、以下の形式でオプションを使用してイベントをサブスクライブします。

				`<eventName>: <handler>`

				`<eventName>` の有効な設定

				<ul>
					<li>itemRendering</li>

					<li>itemRendered</li>

					<li>rendred</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				jQuery および ASP.NET MVC で実行時にイベントを処理
			</td>

			<td>
				コントロール初期化の外側でハンドラーを実装するために、イベント ハンドラーを関数名に割り当てることができます。
			</td>
		</tr>
	</tbody>
</table>



##<a id="code-examples"></a>コード例


以下の表は、このトピックで使用したコード例をまとめたものです。

例|説明
---|---
[jQuery での初期化時に itemRendered イベントを処理する](#example-jquery)|この例は、初期化時に jQuery で [`itemRendered`](%%jQueryApiUrl%%/ui.iglayoutmanager#events) イベントにイベント処理関数を割り当てます。
[ASP.NET MVC での初期化時に itemRendered イベントを処理する](#example-asp-net)|この例は、初期化時に %%ProductNameMVC%% を使用して [`itemRendered`](%%jQueryApiUrl%%/ui.iglayoutmanager#events) イベントにイベント処理関数を割り当てます。
[jQuery での実行時に itemRendered イベントを処理する](#example-run-time-jquery)|この例は、実行時に jQuery で [`itemRendered`](%%jQueryApiUrl%%/ui.iglayoutmanager#events) イベントにイベント処理関数を割り当てます。
[ASP.NET MVC での実行時に itemRendered イベントを処理する](#example-run-time-mvc)|この例は、実行時に %%ProductNameMVC%% を使用して [`itemRendered`](%%jQueryApiUrl%%/ui.iglayoutmanager#events:itemRendered) イベントにイベント処理関数を割り当てます。

##<a id="example-jquery"></a>コード例: jQuery での初期化時に itemRendered イベントを処理する


### <a id="itemRender-jquery-description"></a>説明

この例は、初期化時に jQuery で [`itemRendered`](%%jQueryApiUrl%%/ui.iglayoutmanager#events:itemRendered) イベントにイベント処理関数を割り当てます。

### <a id="itemRender-jquery-code"></a>コード

**JavaScript の場合:**

```js
$(".selector").igLayoutManager({
                        itemRendered: function(evt, ui) { 
                              // Handle event
                        }
});
```



##<a id="example-asp-net"></a>コード例: ASP.NET MVC での初期化時に itemRendered イベントを処理する


### <a id="itemRender-mvc-description"></a>説明

この例は、初期化時に %%ProductNameMVC%% を使用して [`itemRendered`](%%jQueryApiUrl%%/ui.iglayoutmanager#events:itemRendered) イベントにイベント処理関数を割り当てます。

### <a id="itemRender-mvc-code"></a>コード

**ASPX (MVC) の場合:**

        
```csharp
@(Html.Infragistics().LayoutManager()
        .AddClientEvent("iglayoutmanageritemrendered", "itemRenderedHandler")
        .Render());
```



##<a id="example-run-time-jquery"></a>コード例: jQuery での実行時に itemRendered イベントを処理する


### <a id="itemRender-jquery-description-run-time"></a>説明

この例は、実行時に jQuery で [`itemRendered`](%%jQueryApiUrl%%/ui.iglayoutmanager#events:itemRendered) イベントにイベント処理関数を割り当てます。 

### <a id="itemRender-jquery-code-run-time"></a>コード

**JavaScript の場合:**

```js
$(document).delegate(".selector", "iglayoutmanageritemrendered", function(evt, ui) { 
   // Handle event
});
```



##<a id="example-run-time-mvc"></a>コード例: ASP.NET MVC での実行時に itemRendered イベントを処理する


### <a id="itemRender-mvc-description-run-time"></a>説明

この例は、実行時に %%ProductNameMVC%% を使用して [`itemRendered`](%%jQueryApiUrl%%/ui.iglayoutmanager#events) イベントにイベント処理関数を割り当てます。

### <a id="itemRender-mvc-code-run-time"></a>コード

**JavaScript の場合:**

```js
$(document).delegate(".selector", "iglayoutmanageritemrendered", function(evt, ui) { 
   // Handle event
});
```



##<a id="related-content"></a>関連コンテンツ


### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[レイアウトの構成 (igLayoutManager)](igLayoutManager-Configuring-layouts.html) このトピックではコード例を使用して、`igLayoutManager` コントロールのタイトルおよびサブタイトルを構成する方法を説明します。説明には、タイトル領域の幅、テキストの開始位置、およびタイトル / サブタイトルのテキストが含まれます。



### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

-	[ASP.NET MVC の基本的な使用方法](%%SamplesUrl%%/layout-manager/aspnet-mvc-helper): このサンプルでは、レイアウト マネージャー コントロールの %%ProductNameMVC%% を使用する方法を紹介します。

-	[HTML マークアップからの境界線のレイアウト](%%SamplesUrl%%/layout-manager/border-layout-markup): このサンプルでは、「*center*」/「*left*」/「*right*」/「*header*」/「*footer*」 の各 CSS クラスを割り当て、HTML マークアップから `igLayoutManager` コントロールの境界線レイアウトを初期化する方法を紹介します。

-	[境界線のレイアウト - JavaScript による初期化](iglayoutmanager-adding.html#js-steps): このサンプルでは、[`itemRendered`](%%jQueryApiUrl%%/ui.iglayoutmanager#events:itemRendered) イベントの処理や作成した領域へのコンテンツの割り当てによって、`igLayoutManager` コントロールの境界線レイアウトを JavaScript から初期化する方法を紹介します。

-	[レスポンシブ列レイアウト](%%SamplesUrl%%/layout-manager/column-layout-markup): このサンプルでは、項目にクラスを割り当て、その内容がまたがる領域を指定して、`igLayoutManager` コントロールの列レイアウトを使用する方法を紹介します。このサンプルは JavaScript の初期化コードを使用しません。CSS および HTML のみで実装されています。

-	[レスポンシブ フロー レイアウト](%%SamplesUrl%%/layout-manager/flow-layout): このサンプルは、さまざまな項目のサイズがピクセルまたはパーセンテージで設定された `igLayoutManager` コントロールのフロー レイアウトの応答について、また初期化のマークアップの必要なしで `igLayoutManager` のオプションに項目数を設定する方法を紹介します。

-	[colspan および rowspan 対応のグリッド レイアウト](%%SamplesUrl%%/layout-manager/grid-layout): このサンプルは、定義済みのサイズのグリッドに項目を任意の位置に配置できる `igLayoutManager` コントロールのグリッド レイアウトの機能を紹介します。rowspan や colspan がさまざまに設定された項目があります。

-	[カスタム サイズのグリッド レイアウト](%%SamplesUrl%%/layout-manager/grid-layout-custom-size): このサンプルは、`igLayoutManager` コントロールのグリッド レイアウトで各列に特定の幅および高さを指定する機能を紹介します。

-	[レスポンシブ垂直レイアウト](%%SamplesUrl%%/layout-manager/vertical-layout)  このサンプルは、さまざまな項目のサイズがピクセルまたはパーセンテージで設定された `igLayoutManager` コントロールの垂直レイアウトの応答について、また初期化のマークアップの必要なしで `igLayoutManager` のオプションに項目数を設定する方法を紹介します。





 

 


