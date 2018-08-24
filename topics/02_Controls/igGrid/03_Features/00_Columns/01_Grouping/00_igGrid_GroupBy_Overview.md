<!--
|metadata|
{
    "fileName": "iggrid-groupby-overview",
    "controlName": "igGrid",
    "tags": ["Getting Started","Grids","Grouping"]
}
|metadata|
-->

# 列のグループ化の概要 (igGrid)

## トピックの概要

### 目的

このトピックでは、`igGrid`™ のグループ化機能を紹介します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [GroupBy の永続化](#groupBy-persistence)
-   [グループ化機能の概要](#grouping-features)
-   [API の使用](#api-usage) 
-   [キーボード操作](#keyboard-interaction) 
-   [関連コンテンツ](#related-content)

## <a id="introduction"></a> 概要

`igGrid` では、グリッド内の 1 つまたは複数の列値をグループ化/再編成の基準 (たとえば、第 1 基準、第 2 基準、…等々) として使用し、グループ単位で各グループのレコードを再編成することができます。下の図に示すグリッドでは、データが `SafetyStockLevel` 列の値 (500、8000、1,000 といった数値) に基づいてグループ化/編成されています。つまり、このグリッドは `SafetyStockLevel` 列によってグループ化されたものです。

![](images/igGrid_GroupBy_Overview_01.png)

`igGrid` のグループ化機能の使い方は、Microsoft® Office Outlook® のグループ化機能と同じです。グループ化の基準として使用したい列をグリッドの上にある特別なグループ化領域にドラッグしてください。すると、選択したグリッド列のデータ件数と同じ数のグループでグリッドが再編成されます。また、各グループの内部でもレコードの並び替えが行われます。さらに列をドラッグして追加していくと、既存のグループ内のデータがさらに細かくグループ化されていきます。

グループ化メソッドは自身で定義することできます。カスタムのグループ化メソッドの詳細については、「Grid Group By の概要」というトピックをご覧ください。

グループ化は、GroupBy ウィジェットによって実行/管理されます。

## <a id="groupBy-persistence"></a> GroupBy の永続化

`igGrid` バインディングの間にグループ化された列の永続化は 14.1 リリースの新機能です。以前のデフォルト動作を置き換えます。

> **注:** GroupBy の永続化はデフォルトで True です。これは重大な変更です。

`igGridGroupBy` を有効する場合、[`persist`](%%jQueryApiUrl%%/ui.iggridgroupby#options:persist) モードで使用されます。`dataBind()` への呼び出しの後、UI およびデータ ソース ビューで永続化が適用されます。グループ化された列はクリアされなく、データ ソースの並べ替えも残ります。

GroupBy の永続化は `igHierarchicalGrid` にも実装されています。

以下のサンプルは、GroupBy 機能の永続化機能を紹介します。

<div class="embed-sample">
   [機能の永続化](%%SamplesEmbedUrl%%/grid/feature-persistence)
</div>

ユーザーが `igGrid` を再バインドした後にグループ化をクリアする以前の動作に戻るには、[`persist`](%%jQueryApiUrl%%/ui.iggridgroupby#options:persist) オプションで機能を無効できます。以下はコード スニペットです。

**JavaScript の場合:**

```js
features: [
  { 
     name: "GroupBy", 
     persist: false 
  }
] 
```

## <a id="grouping-features"></a> グループ化機能の概要

下の表は、主なグループ化機能と、各機能の管理に使用するグループ化ウィジェットのプロパティをまとめたものです。

> **注:** 次の表において、[グループ化ダイアログ](igGrid-Group-By-Dialog-Overview.html)特有のプロパティとイベントは示されていません。 それらは[グループ化ダイアログ](igGrid-Group-By-Dialog-Overview.html)のトピックにあります。

<table class="table table-bordered">
    <tbody>
        <tr>
            <th>機能</th>
            <th>説明</th>
            <th>jQuery プロパティ</th>
            <th>MVC プロパティ</th>
        </tr>
        <tr>
            <td>グループ化モード</td>
            <td>グループ化ウィジェットは複数のグループ化モードに対応しています。</td>
            <td>[type](%%jQueryApiUrl%%/ui.iggridgroupby#options:type)</td>
            <td>[Type](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~Type.html)</td>
        </tr>
        <tr>
            <td>列の設定</td>
            <td>このオプションを使用すると、各列のグループ化基準を個別に構成できます。</td>
            <td>[columnSettings](%%jQueryApiUrl%%/ui.iggridgroupby#options:columnSettings)</td>
            <td>[ColumnSettings](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~ColumnSettings.html)</td>
        </tr>
        <tr>
            <td>グループ行でのグループ集計</td>
            <td>グループの集計には、個々のグループに固有な情報 (たとえば、そのグループに含まれる列の数といった情報) が表示されます。グループの集計は、グループごとに個別に構成されます。</td>
            <td>[summarySettings](%%jQueryApiUrl%%/ui.iggridgroupby#options:summarySettings)</td>
            <td>[SummarySettings](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~SummarySettings.html)</td>
        </tr>
		<tr>
            <td>データ アイランド別の GroupBy 集計</td>
            <td>アイランドにあるデータ列の集計情報を表示するグループ データ アイランドの下に追加の集計行を表示できます。</td>
            <td>[groupSummaries](%%jQueryApiUrl%%/ui.iggridgroupby#options:groupSummaries)</td>
            <td>[SummarySettings](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~GroupSummaries.html)</td>
        </tr>
        <tr>
            <td>グループ化される行テキストのテンプレート</td>
            <td>
グループ化される行テキストのテンプレート。(jQuery テンプレート処理ガイドラインに準拠)。
            </td>
            <td>
[groupedRowTextTemplate](%%jQueryApiUrl%%/ui.iggridgroupby#options:groupedRowTextTemplate)
            </td>
            <td>
[GroupedRowTextTemplate](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~GroupedRowTextTemplate.html)
            </td>
        </tr>
        <tr>
            <td>クライアント イベント</td>
            <td>
グループ化ウィジェットには、そのライフサイクル中に処理できる特殊なイベントがあります。以下のようなイベントです。<br />
グループ化アクションが開始したときに呼び出されるイベント。 (このイベントはキャンセルできます)。<br />
グループ化アクションが終了したときに呼び出されるイベント。**このイベントは、グループ化モーダル ダイアログでグループ化/グループ化の解除を行った際にも開始します。**
            </td>
            <td>
[groupedColumnsChanging](%%jQueryApiUrl%%/ui.iggridgroupby#events:groupedColumnsChanging) <br />
[groupedColumnsChanged](%%jQueryApiUrl%%/ui.iggridgroupby#events:groupedColumnsChanged)
            </td>
            <td>
[groupedColumnsChanging](%%jQueryApiUrl%%/ui.iggridgroupby#events:groupedColumnsChanging) <br />
[groupedColumnsChanged](%%jQueryApiUrl%%/ui.iggridgroupby#events:groupedColumnsChanged)
            </td>
        </tr>
        <tr>
            <td>外観</td>
            <td>グループ インジケーターのルック アンド フィールや各インジケーターのテキストを変更できる豊富な機能。</td>
            <td>
[groupByAreaVisibility](%%jQueryApiUrl%%/ui.iggridgroupby#options:groupByAreaVisibility)
<br />
[initialExpand](%%jQueryApiUrl%%/ui.iggridgroupby#options:initialExpand)
<br />
[emptyGroupByAreaContent](%%jQueryApiUrl%%/ui.iggridgroupby#options:emptyGroupByAreaContent)
<br />
[expansionIndicatorVisibility](%%jQueryApiUrl%%/ui.iggridgroupby#options:expansionIndicatorVisibility)
<br />
[groupByLabelWidth](%%jQueryApiUrl%%/ui.iggridgroupby#options:groupByLabelWidth)
<br />
[labelDragHelperOpacity](%%jQueryApiUrl%%/ui.iggridgroupby#options:labelDragHelperOpacity)
<br />
[indentation](%%jQueryApiUrl%%/ui.iggridgroupby#options:indentation)
<br />
[expandTooltip](%%jQueryApiUrl%%/ui.iggridgroupby#options:expandTooltip)
<br />
[collapseTooltip](%%jQueryApiUrl%%/ui.iggridgroupby#options:collapseTooltip)
<br />
[removeButtonTooltip](%%jQueryApiUrl%%/ui.iggridgroupby#options:removeButtonTooltip)
            </td>
            <td>
[GroupByAreaVisibility](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~GroupByAreaVisibility.html)
<br />
[InitialExpand](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~InitialExpand.html)
<br />
[EmptyGroupByAreaContent](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~EmptyGroupByAreaContent.html)
<br />
[ExpansionIndicatorVisibility](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~ExpansionIndicatorVisibility.html)
<br />
[GroupByLabelWidth](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~GroupByLabelWidth.html)
<br />
[LabelDragHelperOpacity](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~LabelDragHelperOpacity.html)
<br />
[Indentation](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~Indentation.html)
<br />
[ExpandTooltip](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~ExpandTooltip.html)
<br />
[CollapseTooltip](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~CollapseTooltip.html)
<br />
[RemoveButtonTooltip](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~RemoveButtonTooltip.html)
            </td>
        </tr>
    </tbody>
</table>

以下のサンプルは、グループ化をカスタマイズするために [compareFunc](%%jQueryApiUrl%%/ui.iggridgroupby#options:columnSettings.compareFunc) を使用する方法を紹介します。

> **注:** 
> `time` 列のグループ化をカスタマイズするには、`compareFunc` を使用します。詳細については、実例のコードを参照してください。
 
<div class="embed-sample">    
    [グループ化のカスタマイズ](%%SamplesEmbedUrl%%/grid/grouping-customization)
</div>

## <a id="api-usage"></a> API の使用

列をプログラムでグループ化するには、次の方法で行うことができます。

**JavaScript の場合:**

```js
$('#grid1').igGridGroupBy('groupByColumn', 'ProductID');
```


適用された並べ替え式がグリッドのデータ ソースから取得できます。コードで取得するには、以下のコードを使用します:

**JavaScript の場合:**

```js
var expressions = $('#grid1').data('igGrid').dataSource.settings.sorting.expressions; // array of expressions
// expression structure
{compareFunc: <type="function" comparer function>, dir: <type="string" sort direction>, fieldName: <type="string" column key>, isGroupBy: <type="bool" is the expression created by the Group By widget>, layout: <type="string" the key of the layout if done in igHierarchicalGrid>}
```

グループ化ウィジェットにより作成された式の "isGroupBy" プロパティが "true" の場合、式と並べ替えウィジェットで作成された式を識別します。

グループ化されたデータ (データ行およびグループ行) をコードで取得するには、以下のコードを使用します:

**JavaScript の場合:**

```js
var data = $('#grid1').data('igGrid').dataSource.groupByData();
// group rows' structure
{collapsed: <type="bool" collapsed state>, fieldName: <type="string" column key>, gbExpr: <type="object" group by expression object>, id: <type="string" identificator of the group row>, len: <type="number" the number of data rows in the group>, level: <type="number" level of grouping>, recs: <type="array" set of the data records in the group>, val: <type="string" the value of the group>}
```

グループ化データのグループ行は、グループ行の生成された ID を含むオブジェクトです。コードで行を [`collapse`](%%jQueryApiUrl%%/ui.iggridgroupby#methods:collapse) / [`expand`](%%jQueryApiUrl%%/ui.iggridgroupby#methods:expand) ために ID を使用します。

**JavaScript の場合:**

```js
var data = $('#grid1').data('igGrid').dataSource.groupByData(), 
	id = data[0].id; 
// collapse
$('#grid1').igGridGroupBy("collapse", id); 
// expand
$('#grid1').igGridGroupBy("expand", id);
```

API 使用については、以下のサンプルも参照してください。

<div class="embed-sample">
   [グループ化 API](%%SamplesEmbedUrl%%/grid/grouping-api)
</div>

## <a id="keyboard-interaction"></a> キーボード操作

以下のキーボード操作が可能です。

グリッドにフォーカスがある場合:

-	TAB: GroupBy 機能のフォーカス可能な要素間でフォーカスを移動: GroupBy 領域の選択列リンク。

要素にフォーカスがある場合:

-	ENTER: グループ化ダイアログを開く。

ダイアログにフォーカスがある場合:

-	TAB: ダイアログのフォーカス可能な要素間でフォーカスを移動 - [グループ化] ボタン、[すべてクリア] ボタン、[適用] および [キャンセル] ボタン フォーカスが関連する要素にある際に、ENTER を押すことにより関連する操作を適用できます。
-	ESCAPE: ダイアログを閉じる。

## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [列のグループ化の有効化 (igGrid)](igGrid-Enabling-GroupBy.html)

- [グリッド GroupBy プロパティ リファレンス](%%jQueryApiUrl%%/ui.iggridgroupby#options)

- [グリッドの既知の問題と重要な変更](igGrid-Known-Issues.html)

### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [グループ化](%%SamplesUrl%%/grid/grouping)
 


