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
-   [関連コンテンツ](#related-content)

## <a id="introduction"></a> 概要

`igGrid` では、グリッド内の 1 つまたは複数の列値をグループ化/再編成の基準 (たとえば、第 1 基準、第 2 基準、…等々) として使用し、グループ単位で各グループのレコードを再編成することができます。下の図に示すグリッドでは、データが `SafetyStockLevel` 列の値 (500、8000、1,000 といった数値) に基づいてグループ化/編成されています。つまり、このグリッドは `SafetyStockLevel` 列によってグループ化されたものです。グループ化の基準として使用する列はグリッドから抽出されます。

![](images/igGrid_GroupBy_Overview_01.png)

`igGrid` のグループ化機能の使い方は、Microsoft® Office Outlook® のグループ化機能と同じです。グループ化の基準として使用したい列をグリッドの上にある特別なグループ化領域にドラッグしてください。すると、選択したグリッド列のデータ件数と同じ数のグループでグリッドが再編成されます。また、各グループの内部でもレコードの並び替えが行われます。さらに列をドラッグして追加していくと、既存のグループ内のデータがさらに細かくグループ化されていきます。

グループ化メソッドは自身で定義することできます。カスタムのグループ化メソッドの詳細については、「Grid Outlook Group By の概要」というトピックをご覧ください。

グループ化は、Group By ウィジェットによって実行/管理されます。

## <a id="groupBy-persistence"></a> GroupBy の永続化

`igGrid` バインディングの間にグループ化された列の永続化は 14.1 リリースの新機能です。以前のデフォルト動作を置き換えます。

> **注:** GroupBy の永続化はデフォルトで True です。これは重大な変更です。

`igGridGroupBy` を有効する場合、[`persist`](%%jQueryApiUrl%%/ui.iggridgroupby#options:persist) モードで使用されます。`dataBind()` への呼び出しの後、UI およびデータ ソース ビューで永続化が適用されます。グループ化された列はクリアされなく、データ ソースの並べ替えも残ります。

GroupBy の永続化は `igHierarchicalGrid` にも実装されています。

ユーザーが `igGrid` を再バインドした後にグループ化をクリアする以前の動作に戻るには、[`persist`](%%jQueryApiUrl%%/ui.iggridgroupby#options:persist) オプションで機能を無効できます。以下はコード スニペットです。

**JavaScript の場合:**

```
features: [
  { 
     name: “GroupBy”, 
     persist: false 
  }
] 
```

## <a id="grouping-features"></a> グループ化機能の概要

下の表は、主なグループ化機能と、各機能の管理に使用する Group By ウィジェットのプロパティをまとめたものです。

> **注意:** 次の表において、[Group By ダイアログ](igGrid-Group-By-Dialog-Overview.html) 特有のプロパティとイベントはリストされていません。それらは [Group By ダイアログ](igGrid-Group-By-Dialog-Overview.html) のトピックにあります。

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
            <td>Group By ウィジェットは複数のグループ化モードに対応しています。</td>
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
            <td>グループの集計</td>
            <td>グループの集計には、個々のグループに固有な情報 (たとえば、そのグループに含まれる列の数といった情報) が表示されます。グループの集計は、グループごとに個別に構成されます。</td>
            <td>[summarySettings](%%jQueryApiUrl%%/ui.iggridgroupby#options:summarySettings)</td>
            <td>[SummarySettings](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~SummarySettings.html)</td>
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
Group By ウィジェットには、そのライフサイクル中に処理できる特殊なイベントがあります。以下のようなイベントです。 <br />
グループ化アクションが開始したときに呼び出されるイベント。(このイベントはキャンセルできます)。<br />
グループ化アクションが終了したときに呼び出されるイベント。**このイベントは、Group By モーダル ダイアログでグループ化/グループ化の解除を行った際にも開始します。**
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


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [グリッド Outlook Group By のセットアップ](igGrid-Enabling-GroupBy.html)

- [グリッド Outlook Group By プロパティ リファレンス](%%jQueryApiUrl%%/ui.iggridgroupby#options)

- [グリッドの既知の問題と重要な変更](igGrid-Known-Issues.html)

### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [集計とグループ化](%%SamplesUrl%%/grid/grouping)

 


