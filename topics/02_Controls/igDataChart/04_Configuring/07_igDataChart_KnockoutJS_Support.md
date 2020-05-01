<!--
|metadata|
{
    "fileName": "igdatachart-knockoutjs-support",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# Knockout サポートの構成 (igDataChart)



##トピックの概要

### 目的

このトピックは、Knockout ライブラリにより管理されるビューモードのオブジェクトをバインドするために `igDataChart`™ コントロールを構成する方法について説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要なトピックと外部リソースの一覧です。

**トピック**

-	[igDataChart の概要](igDataChart-Overview.html) : このトピックでは、`igDataChart` コントロールについての概念情報を提供します。これには、その主な機能、チャートとユーザー機能を使用するための最低要件が含まれます。

-	[シリーズ タイプ (igDataChart)](igDataChart-Series-Types.html): このトピックでは、`igDataChart` コントロールにより生成できるあらゆる種類のチャートを表示します。

-	[igDataChart の追加](igDataChart-Adding.html): このトピックでは、`igDataChart` コントロールをページに追加し、データにバインドする方法を紹介します。


**外部リソース**

-   [**Knockout インタラクティブ チュートリアル**](http://learn.knockoutjs.com/#/?tutorial=intro)

##概要

### Knockout サポートの概要

`igDataChart` コントロールにおける Knockout ライブラリのサポートは、開発者が Knockout ライブラリとその宣言構文を使用して、チャート コントロールのインスタンスを作成し構成するための簡単な方法を提供することを目的としています。

Knockout のサポートは、Knockout バインディングがページに適用されるときに最初に呼び出される Knockout 拡張機能として、ページの存続期間中にビューモデルへの外部更新が発生した場合に実装されます。

Knockout 管理データ構造へバインドされるチャート コントロールのインスタンスを作成するには、`igDataChart` 構成オプションを HTML div 要素または span 要素の data-bind 属性に指定する必要があります。これにより、JavaScript を使用してコントロールを作成する場合と同様に、HTML タグの位置にチャートが描画されます。通常使用されるオプションに関する情報については、[](#Configuring_igDataChart)[Knockout サポートによる `igDataChart` 構成](#Configuring_igDataChart)のセクションを参照してください。data-bind 属性を使用して、ビジネス ケースに関連する他のすべての igDataChart オプションを指定することもできます。

>**注:** Knockout サポートはビューモデルからビューの間、つまり igDataChart コントロールでのみ有効です。
ビューモデルの更新は dataSource プロパティとして `igDataChart` に渡され、`igDataChart` UI に通知されて新しい値の描画が実行されます。`igDataChart` の編集に API メソッドを使用した場合、ビューモデルは更新されません。これは、`igDataChart` が HTML キャンバス要素の内部にあるため、ビューから igDataChart が更新できないためです。

>**注:** `igDataChart` の Knockout 拡張機能により、非表示の HTML div 要素が UL リストを含むブラウザーの DOM ツリーに追加されます。チャートが単一の HTML キャンバスで、各チャート項目のバインド ハンドラーが追加の DOM 要素 (この場合、HTML LI) を要求するためです。非常に大きなデータを視覚化する場合は注意が必要です。



## Knockout サポートによる igDataChart 構成


###<a id="Configuring_igDataChart"></a> Knockout サポートによる igDataChart 構成の概要表

以下の表は、これらのタスクを管理する各プロパティに対し Knockout 使用シナリオに関連する `igDataChart` コントロールの構成タスクをマップします。実際の実装コード例の一部を、表の下に示します。

<table class="table table-bordered">
	<thead>
		<tr>
			<th>構成タスク</th>
			<th>必須ですか？</th>
			<th>詳細</th>
			<th>プロパティ</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>チャート項目のデータ ソースの指定</td>
			<td>必須</td>
			<td>チャートの dataSource のデータ ソースを構成するためのプロパティです。

			以下の[コード例: 項目の編集、追加、削除](#Code_Example_igDataChart)のために igDataChart を構成するのセクションに示すように、フラット データ ソースとなります。
			<blockquote>**注:** このオプションを監視可能に設定すると、要素を追加または削除するためのデータ ソースへの直接アクセスができるようになり、チャートを変更します。</blockquote>
			<blockquote>**注:** プロパティが監視可能に設定されたデータ ソースのレコードがある場合、更新され、レコードの更新による影響が *igDataChart* 項目にすぐに反映されます。 </blockquote>
			<blockquote>**Knockout JS のチャート拡張機能を使用している場合、チャートをデータ ソースの配列にバインドすることはできません。**</blockquote></td>
			<td><ul><li>[dataSource](%%jQueryApiUrl%%/ui.igDataChart#options:dataSource)</li></ul></td>
		</tr>
		<tr>
			<td>データ ビジュアライゼーションを表示するメンバー パスの構成</td>
			<td>必須</td>
			<td>シリーズの種類によっては、さまざまなメンバー パスを使用し、パスをデータ ソース レコードのオブジェクト フィールドにマップして、オプションのデータをチャートに表示する場合があります。
			シリーズおよび対応するメンバー パスの詳細は、[シリーズのタイプ (*igDataChart*)](igDataChart-Series-Types.html)のトピックを参照してください。</td>
			<td><ul><li>[シリーズ](%%jQueryApiUrl%%/ui.igDataChart#options:Series)
			<ul><li>[valueMemeberPath](%%jQueryApiUrl%%/ui.igDataChart#options:valueMemeberPath)</li><li>[lowMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:lowMemberPath)</li><li>[xMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:xMemberPath)</li><li>[yMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:yMemberPath)</li><li>[radiusMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:radiusMemberPath)</li><li>[fillMemeberPath](%%jQueryApiUrl%%/ui.igDataChart#options:fillMemeberPath)</li><li>[labelMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:labelMemberPath)</li><li>[angleMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:angleMemberPath)</li><li>[openMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:openMemberPath)</li><li> [closeMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:closeMemberPath)</li><li>[volumeMemberPath](%%jQueryApiUrl%%/ui.igDataChart#options:volumeMemberPath)</li></ul>
			</li></ul></td>
		</tr>
	</tbody>
</table>

##<a id="Code_Example_igDataChart"></a>コード例: 項目の編集、追加、削除のために igDataChart を構成する


### 説明

この例は、`igDataChart` コントロールのインスタンスを作成し、Knockout で管理されるデータ構造にバインドする方法について示します。Knockout の宣言構文を使用して、div 要素の data-bind 属性からチャートのインスタンスを作成し、ビューモデル監視可能プロパティにバインドします。

### コード

以下のコード スニペットは、Knockout により管理される監視可能なフラットな構造とプロパティを持つ ビューモデル オブジェクトを表示します。この例ではデータ構造を明確にするために明示的に宣言していますが、データがリモート データ ソース (データベースなど) から提供される実環境では、データは JSON 形式になります。その後、データは Knockout マッピング ライブラリを使用して監視できるようになります。

>**注:** 配列構造と各オブジェクト フィールドの両方が監視可能として宣言される点に注意してください。データ項目が追加、削除または変更される場合にビューを更新でき、ユーザーが編集を行う場合にビューモデルを変更できます。

**JavaScript の場合:**

```js
var viewModel = {
    data: ko.observableArray(
        [{
            label: ko.observable("I"),
            value1: ko.observable(90.34),
            value2: ko.observable(15.77),
            value3: ko.observable(10.09)
        }, {
            label: ko.observable("II"),
            value1: ko.observable(45.11),
            value2: ko.observable(80.12),
            value3: ko.observable(9.89)
        }, {
        . . .
        }];
    );
}
```

以下のコード スニペットは、宣言されたKnockout バインディングをページに適用する方法を示します。

>**注: **`ko.applyBindings()` 呼び出しは、 Loader の即時コールバック内で出される点に注意してください。これは、Knockout のチャート拡張機能はバインディングが適用される前にページに読み込まなければならないため必要です。

**JavaScript の場合:**

```js
$.ig.loader({
    scriptPath: "http://localhost/ig_ui/js/",
    cssPath: "http://localhost/ig_ui/css/",
    resources: "igDataChart.Category,extensions/infragistics.ui.datachart.knockout-extensions.js",
    ready: function () {
        ko.applyBindings(viewModel);
    }
});
```

以下のコード スニペットは、3 つの異なる折れ線シリーズを持つチャート コントロールのバインディング オプションをビュー内で宣言する方法を示します。最も重要なのは、div 要素の data-bind 属性におけるインスタンス化オプションの宣言部分です。

**HTML の場合:**

```html
<div data-bind="igDataChart: {
      dataSource: data,
      axes: [{
            name: "xAxis",
            type: "categoryX",
            label: "label",
      }, {
            name: "yAxis",
            type: "numericY",
      }],
      series: [{
            name: "line1",
            type: "line",
            markerType: "automatic",
            xAxis: "xAxis",
            yAxis: "yAxis",
            valueMemberPath: "value1"
      }, {
            name: "line2",
            type: "line",
            markerType: "automatic",
            xAxis: "xAxis",
            yAxis: "yAxis",
            valueMemberPath: "value2"
      }, {
            name: "line3",
            type: "line",
            markerType: "automatic",
            xAxis: "xAxis",
            yAxis: "yAxis",
            valueMemberPath: "value3"
      }] }"></div>
```

コントロールが Knockout を通してビューモデルにバインドされる場合、すべての変更に関する通知を受け取ります。

コントロールを監視不可能な配列にバインドすることもできますが、更新機能が使用できず、KnockoutJS のコンテキストで使用する意味がなくなります。

##<a id="Live_Example_igDataChart"></a> サンプル: KnockoutJS でチャート項目の編集
  
このサンプルは、Knockout ビュー モデルのデータ ソースの変更を処理する igDataChart コントロールを紹介します。コントロールを再バインドせずにチャートが更新されます。デフォルトで、サンプルは月の最初の 10 日の売上および経費を表示します。チャートに日を追加/削除するか、項目を移動し、チャートを更新します。

>**注:** Knockout 拡張子が %%ProductNameMVC%% との互換性がありません。

<div class="embed-sample">
   [%%SamplesEmbedUrl%%/data-chart/edit-chart-items-with-knockout](%%SamplesEmbedUrl%%/data-chart/edit-chart-items-with-knockout)
</div>

##関連コンテンツ


### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[igDataChart の概要](igDataChart-Overview.html): このトピックでは、`igDataChart` コントロールについての概念情報を提供します。これには、その主な機能、チャートとユーザー機能を使用するための最低要件が含まれます。

-	[シリーズ タイプ (igDataChart)](igDataChart-Series-Types.html): このトピックでは、`igDataChart` コントロールにより生成できるあらゆる種類のチャートを表示します。

-	[igDataChart の追加](igDataChart-Adding.html): このトピックでは、`igDataChart` コントロールをページに追加し、データにバインドする方法を紹介します。

-	[Knockout サポートの構成 (igCombo)](igCombo-Configuring.html): このトピックは、Knockout ライブラリにより管理されるビューモードのオブジェクトをバインドするために `igCombo` コントロールを構成する方法について説明します。

-	[Knockout サポートの構成 (igEditors)](Configuring-Knockout-Support-%28Editors%29.html): このトピックは、Knockout ライブラリを使用してビューモード オブジェクトをバインドするために %%ProductName%% エディター コントロールを構成する方法について説明します。

-	[Knockout サポートの構成 (igTree)](igTree-KnockoutJS-Support.html): このトピックは、Knockout ライブラリにより管理される View-Model オブジェクトをバインドするために `igTree` コントロールを構成する方法について説明します。



### サンプル

このトピックについては、以下のサンプルも参照してください。

-	[KnockoutJS で igDataChart をバインド](%%SamplesUrl%%/data-chart/bind-data-chart-with-ko): このサンプルでは、コントロールの Infragistics Knockout 拡張機能を使用して `igDataChart` を Knockout ビューモデルとバインドする方法を紹介します。



### リソース

以下に、このトピックに関連する追加情報を示します (Infragistics のコンテンツ ファミリー以外にも利用できます)。

-	[Knockout Web サイト](http://knockoutjs.com/): これは、すべての必要なドキュメンテーションおよびサンプルが利用可能な Knockout ライブラリのホーム ページホーム ページです。





 

 


