<!--
|metadata|
{
    "fileName": "animating-charts-in-asp.net-mvc",
    "controlName": "igDataChart",
    "tags": ["Charting","Data Presentation","How Do I","MVC"]
}
|metadata|
-->

# ASP.NET MVC でのチャートのアニメーション化 (igDataChart)



##トピックの概要


### 目的

このトピックでは、コード例を使用して、AJAX POST 要求を使用してデータを動的に追加しているMVC で、簡単なアニメーション化された柱状チャートを追加する方法を示します。

### 前提条件


**トピック**

-	[igDataChart の概要](igDataChart-Overview.html): このトピックは、`igDataChart`™ コントロールについて、その主要機能、最低必須事項、ユーザー機能といった事項の概念的情報を提供します。

-	[igDataChart の追加](igDataChart-Adding.html): このトピックでは、`igDataChart`™ コントロールをページに追加し、データにバインドする方法を紹介します。

-	[igDataSource の概要](igDataSource-igDataSource-Overview.html): `igDataSource` コントロールを紹介します。

-	[チャートの Infragistics Motion Framework](igDataChart-Motion-Framework.html) : チャート対応の Infragistics® Motion Framework を紹介します。

**外部リソース**

-   [ASP.NET MVC Framework の基本知識](http://www.asp.net/mvc)



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [MVC でのチャートのアニメーション化 - コード例](#animating-charts)
   -   [概要](#introduction)
    -   [プレビュー](#preview)
    -   [要件](#requirements)
    -   [概要](#overview)
    -   [手順](#steps)
-   [関連コンテンツ](#related-content)
   -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="animating-charts"></a>MVC でのチャートのアニメーション化


###<a id="introduction"></a> 概要

この手順では、更新データの AJAX Post 要求により MVC アプリケーションの簡単なアニメーション化された柱状チャートを作成する方法を示します。

Motion Framework をアクティブ化するには、**一部のメカニズムを組み込み**チャートの背後で動的に**データを更新する**必要があります。この例では、クリック ハンドラーのあるボタンを使用して 1 つのデータ項目をチャートに追加しています。

例では、3 つのデータ シリーズがあり、車の販売データがランダムに生成されている柱状チャートを実装しています。チャートの下に [項目を追加] ボタンを配置します。ボタンをクリックすると、新しいデータがチャートに追加されます。ボタンにより AJAX Post 要求がサーバーに送信され、新しいデータ項目を生成して、プレーンな JSON 応答としてクライアントに戻します。要求に対する応答を受信すると、クライアントは新しいデータ項目をチャートに追加し、変更についてチャートに通知します。チャート データ項目が大きくなり 5 件を超えると、最も古いデータ項目 (インデックス番号が一番小さな項目) がチャートから削除されます。

###<a id="preview"></a> プレビュー

コードで視覚化されると、チャートはこの例のようになります。

![](images/Using_Motion_Framework_in_MVC_with_AJAX_Updates_1.png)

###<a id="requirements"></a> 要件

この手順を実行するには、以下が必要です。

-   Microsoft® Visual Studio® 2010 と MVC プロジェクト

###<a id="overview"></a> 概要

3 つのデータ シリーズで構成されるアニメーション化された柱状チャートのある、簡単な Web ページを作成するための段階的な手順です。これは、この作業を完了するための基本的な手順です。

1.  データ モデルを追加します。
2.  基本的なコントローラー ロジックを追加します。
3.  MVC ビューの追加
4.  基本チャートの追加
5.  チャート シリーズの構成
6.  コントロールをデータにバインドし、ビューで描画
7.  データを更新するためのボタンの追加
8.  データを更新して、変更をチャートに通知
9.  (オプション) 結果の検証

###<a id="steps"></a> 手順

1. データ モデルを追加します。

 以下の構造をした MVC アプリケーションの Models フォルダーに、空のモデル クラスを作成します。

 **C# の場合:**

	```csharp
	public class ColumnChartDataItem
    {
        public int Label { get; set; }
        public double Value1 { get; set; }
        public double Value2 { get; set; }
        public double Value3 { get; set; }
    }
	```

2. 基本的なコントローラー ロジックを追加します。

 1. 新しいコントローラーを作成し、デフォルト アクション メソッドを追加します。このコードは `CreateChartItem()` というメソッドを使用して、1 つの `ColumnChartDataItem` (データ モデル) オブジェクトでリストを初期化し、MVC ビューに渡します。
	
	**C# の場合:**

		```csharp
		public ActionResult Index()
	    {
	        return View(new List<ColumnChartDataItem> { CreateChartItem() });
	    }
		```

 2. ヘルパー メソッドを作成します。
	
	**C# の場合:**

		```csharp
		private ColumnChartDataItem CreateChartItem(int label = 1)
		{
		    Random rnd = new Random();
		    var val1 = rnd.NextDouble() * 100;
		    var val2 = rnd.NextDouble() * 100;
		    var val3 = rnd.NextDouble() * 100;
		    return new ColumnChartDataItem 
		        { 
		            Label = label, 
		            Value1 = val1, 
		            Value2 = val2, 
		            Value3 = val3 
		        };
		}
		```

3. MVC ビューを追加します。

 新しい空の MVC ビューを作成するには、コントローラーの `Index()` メソッドを右クリックします。コンテキスト メニューから、[ビューを追加] を選択します。[igDataChart の追加](igDataChart-Adding.html)のトピックのステップに従って、チャートを組み込むスケルトン MVC ビューを作成します。この例では、最初のステップ[必要なリソースへの参照の追加](igDataChart-Adding.html#add-references-to-required-resources)が必要です。

4. 基本チャートを追加します。
 
 コードを追加して基本チャートをインスタンス化し、構成します。これには、ビューのデータ モデルをチャートに割り当て、`IQueryable` オブジェクト `(DataChart(Model.AsQueryable()))` に変換することが含まれます。次に、X カテゴリ軸 と Y 数値軸を構成します。Y 数値軸は 0 から 100 の固定範囲です。軸範囲の固定は重要です。データをチャートに動的に追加すると、軸が自動的にその範囲を調整するためです。これにより、アニメーション効果が無効になります。

 **ASPX の場合:**

	```csharp
	<%= Html.Infragistics().DataChart(Model.AsQueryable())
            .ID("chart")
            .Width("500px")
            .Height("500px")
            .Legend(legend => legend.ID("legend"))
            .WindowResponse(WindowResponse.Immediate)
            .Axes((axes) =>
                {
                    axes.CategoryX("xAxis").Label(d => d.Label);
                    axes.NumericY("yAxis").MinimumValue(0).MaximumValue(100);
                })
    ...
	```

5. チャート シリーズを構成します。

 3 つのデータ シリーズを視覚化するよう定義します。シリーズ設定で、`transitionDuration` プロパティを設定することで切り替えオプションを定義します。

 **ASPX の場合:**

	```csharp
	.Series(series =>
	{
	    series
	    .Column("series1")
	    .Title("BMW")
	    .XAxis("xAxis").YAxis("yAxis")
	    .ValueMemberPath((item) => item.Value1)
	    .TransitionDuration(400)
	    series
	    .Column("series2")
	    .Title("Audi")
	    .XAxis("xAxis").YAxis("yAxis")
	    .ValueMemberPath((item) => item.Value2)
	    .TransitionDuration(700)
	    series
	    .Column("series3")
	    .Title("Mazda")
	    .XAxis("xAxis").YAxis("yAxis")
	    .ValueMemberPath((item) => item.Value3)
	    .TransitionDuration(1000)                   
	})
	```

 前記のコード スニペットでは、`TransitionDuration()` 呼び出しは、Motion Framework に関連した動作を設定しています。このオプションは、チャート シリーズの 2 種類の状態で、アニメーション (切り替え) の切り替えにかかる時間を管理します。このオプションに関連した単位は、ミリ秒です。より視覚的に訴えるようにするため、3 種類のデータ ソースに故意に異なる値を設定しました。最初のデータ シリーズ列の動作が速い場合は、2 番目のデータ シリーズの動作は多少遅くなり、3 番目のデータ シリーズが最も遅くなるという効果が見られます。これにより、アニメーション効果が強調されます。

6. コントロールをデータにバインドし、ビューで描画します。

 コントロールをデータにバインドし、ビューを描画するには、 `DataBind()` 呼び出しと `Render()` 呼び出しを使用します。

 **ASPX の場合:**

	```csharp
	<%
        .DataBind().Render()
    %>
	```

7. データを更新するためのボタンを追加します。

 1. HTML マークアップでボタンを定義します。マークアップはチャート div 要素の下に配置します。

	**HTML の場合:**

		```html
		<input type="button" id="btnPlay" value="Add Data" />
		```

 2. JavaScript でこのボタンのインスタンスを作成して構成します。Infragistics Script Loader 構文を使用して、クリックしたときに `getNewChartItemFromServer()` 関数を呼び出すチャートの下に `igButton` コントロールを作成します。

	**JavaScript の場合:**

		$.ig.loader(function () {
		```
		$("#btnPlay").igButton({
	        labelText: $("#btnPlay").val(),
	        click: getNewChartItemFromServer
	    });
		```
		});

8. データを更新し、変更についてのチャートに通知します。

 1. データ要求の JavaScript 関数を追加します。
	
	この関数は、前のステップから [データを追加] ボタンへのクリック イベント ハンドラーの役割を果たします。

	**JavaScript の場合:**

		```js
		function getNewChartItemFromServer() {
		    var chartData = $("#chart").igDataChart("option", "dataSource");
		    $.post('<%= Url.Action("CreateNewChartItem")%>', 
		        { "Label": chartData[chartData.length - 1].Label + 1 },
		        addNewItemToChart, 
		        'json');
		}
		```

 	前述のコードは、チャートにバインドされたデータ配列を取得します。次に、配列からチャートの最後の項目の `Label` を取得し、サーバーに渡します。次に、コードは jQuery を利用してサーバーに AJAX POST 要求を行い、データを受信したときに `addNewItemToChart()` 関数を呼び出す必要があることを指定して、JSON で書式設定されたデータを表示します。サーバーは `CreateNewChartItem` を呼び出します。このアクションをサポートするには、コントローラー アクション メソッドを追加する必要があります。

 2. データをチャートに提供する Controller メソッドを追加します。

	クライアントの POST 要求はコントローラー アクション メソッドで提供する必要があります。要求はさまざまな方法で処理できますが、MVC アプリケーションではこの方法をお勧めします。

	以下のアクション メソッドを、ステップ 2: [基本的なコントローラー ロジックの追加](#steps)で作成されたコントローラーに追加します。

	**C# の場合:**

		```csharp
		[HttpPost]
		[ActionName("CreateNewChartItem")]
		public JsonResult CreateNewChartItem(int Label)
		{
		    return new JsonResult { Data = CreateChartItem(Label) };
		}
		```

	`HttpPost` 属性は、このアクションが POST 要求を行うよう指示し、`ActionName` 属性はアクションの正確な名前を指定します。メソッドはクライアントから `Label` パラメーターを受信し、そのパラメーターをコントローラーで定義済みの `CreateChartItem()` メソッドに渡して新しいデータ項目を生成します。新しい項目は `JsonResult` オブジェクトの `Data` プロパティに割り当てられます。このオブジェクトは、POST 要求の後にクライアントに戻されます。

 3. データ更新の JavaScript 関数を追加します。

	POST 要求が終了し、応答がクライアントに届くと、サーバーは JSON データを jQuery `post()` 呼び出しで指定された `addNewItemToChart()` 関数にフィードします。このデータをクライアントで処理し、チャートを更新するには以下のコードを追加します。

	**JavaScript の場合:**

		```js
		function addNewItemToChart(data, textStatus, jqXHR) {
		    var chartData = $("#chart").igDataChart("option", "dataSource");
		    var newItem = data;
		    chartData[chartData.length] = newItem;
		    $("#chart").igDataChart("notifyInsertItem", chartData, chartData.length - 1, newItem);
		}
		```

	この関数は、チャートの `dataSource` メソッドを呼び出す最初の行でチャートにバインドされたオブジェクトの配列を取得します。関数のデータ引数にはサーバーから戻されたデータが入っており、このデータをチャートの背後にある配列の最後の要素 (`chartData[chartData.length] = newItem`) に割り当てます。

	この結果、Chart コントロールの `notifyInsertItem()` メソッドが呼び出され、Motion Framework ロジックが開始します。メソッド引数は変更が行われたデータ ソース、データが挿入されたインデックス、および挿入された実際のデータ項目です。ここではデータは最後に挿入されていますが、データ ソースの任意の場所にデータを挿入できます。

9. (オプション) 結果を確認します。

 結果を検証するには、[項目を追加] ボタンをクリックし、その効果を観察します。新しい柱状チャート項目は、既存の項目の右側に表示され、項目数が 5 つになると、左端にある項目が削除され、項目すべてが 1 つずつ左にずれます。

 項目を削除する、`notifyRemoveItem()` メソッドを呼び出す、またはすべてのデータをクリアして `notifyClearItem()` メソッドを呼び出すなど、さまざまな変更を行って実験します。

##<a id="related-content"></a>関連コンテンツ


###<a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[HTML および JavaScript におけるチャートのアニメーション化](igDataChart-Animating-HTML.html) : 次の方法を紹介します。HTML ビューを作成する、JavaScript を使用して柱状チャートにデータを動的に追加する、%%ProductName%% ライブラリでチャートの Motion Framework を使用してデータ変更をアニメーション化する。



###<a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

-	[Motion Framework](igDataChart-Motion-Framework.html#motion-framework-sample) : このサンプルでは、Motion Framework を使用すると、柱状シリーズのチャートにアニメーションを追加する方法を紹介します。





 

 


