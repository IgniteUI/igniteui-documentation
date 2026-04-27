<!--
|metadata|
{
    "fileName": "igExcelEngineFiltering",
    "controlName": ["igExcel"],
    "tags": ["Sort"]
}
|metadata|
-->

# ワークシート レベル フィルター

## 概要

JavaScript Excel ライブラリのフィルター設定を活用するには、まず [Workbook](%%jQueryApiUrl%%/ig.excel.Workbook) オブジェクトを作成してください。それには、操作方法のトピック『[Excel ファイルをブックに読み込む](JavaScript-Excel-Library-Read-an-Excel-2007-XLSX-File-Into-a-Workbook.html)』で説明したように既存の Microsoft® Excel® ファイルを読み込むか、ブランクのワークブックを作成します。空白のワークブックを作成する場合、ファイルに書き込む前にワークシートを少なくとも 1 つ追加する必要があります。ワークシートを作成後、Excel ファイルにフィルター条件およびその他の設定を追加できます。

フィルターを構成するには、ワークシートの [WorksheetFilterSettings](%%jQueryApiUrl%%/ig.excel.WorksheetFilterSettings) にフィルター条件を設定します。フィルター条件は、フィルター条件が追加、削除、変更される時に、または [reapplyFilters](%%jQueryApiUrl%%/ig.excel.WorksheetFilterSettings#methods:reapplyFilters) メソッドがシートで呼び出されるときに限り再適用されます。フィルターは、領域のデータの変更に伴って絶えず評価しなおされるというわけではありません。フィルターが領域に適用されるのは、並べ替え条件が追加または削除されたときや、ReapplyFilters メソッドが呼び出されたときだけです。

フィルターが適用されていない場合、このメソッドは列データに対して何も行いません。

### プロパティ設定

以下の表は、[WorksheetFilterSettings](%%jQueryApiUrl%%/ig.excel.WorksheetFilterSettings) によって処理されるメソッドについて説明します。

| メソッド			| 説明 |
| ------------- 	|:-------------: |
|[SetRegion](%%jQueryApiUrl%%/ig.excel.WorksheetSortSettings#methods:setRegion)|フィルターする領域を指定するために使用されます。|
|[GetFilter](%%jQueryApiUrl%%/ ig.excel.WorksheetSortSettings%601#methods:getFilter) |指定された列に適用されるフィルターを取得します。|

列に設定する並べ替え条件タイプは次のとおりです。

| メソッド			| 説明 |
| ------------- 	|:-------------:|
|[ApplyAverageFilter](%%jQueryApiUrl%%/ig.excel.AverageFilter#methods:ig.excel.AverageFilter) |データ範囲全体の平均を下回るデータであるか上回るデータであるかという条件に基づいてデータを絞り込むことのできるフィルターです。|
|[ApplyDatePeriodFilter](%%jQueryApiUrl%%/ig.excel.DatePeriodFilter#methods:ig.excel.DatePeriodFilter) |月または四半期の日付をフィルターできるフィルターを表します。|
|[ApplyFillFilter](%%jQueryApiUrl%%/ig.excel.FillFilter#methods:ig.excel.FillFilter) |背景の塗りつぶしに基づいてセルを絞り込むフィルターを表します。このフィルターには CellFill を 1 つ指定します。この塗りつぶしのセルがデータ範囲に表示されることになります。他のセルはすべて非表示になります。|
|[ApplyFixedValuesFilter](%%jQueryApiUrl%%/ig.excel.FixedValuesFilter#methods:ig.excel.FixedValuesFilter) |具体的な指定値に基づいて表示セルを絞り込むことのできるフィルターです。|
|[ApplyFontColorFilter](%%jQueryApiUrl%%/ig.excel.FontColorFilter#methods:ig.excel.FontColorFilter) |フォントの色に基づいてセルを絞り込むフィルターを表します。このフィルターには 1 つの色を指定します。この色のフォントのセルがデータ範囲に表示されることになります。他のセルはすべて非表示になります。|
|[ApplyIconFilter](%%jQueryApiUrl%%/ig.excel.IconFilter#methods:ig.excel.IconFilter) |条件付き書式アイコンに基づいてセルを絞り込むフィルターを表します。|
|[ApplyRelativeDateRangeFilter](%%jQueryApiUrl%%/ig.excel.IconFilter#methods:ig.excel.RelativeDateRangeFilter) |フィルターの適用日を基点とした相対日付によって日付セルの範囲を絞り込むことのできるフィルターです。|
|[ApplyTopOrBottomFilter](%%jQueryApiUrl%%/ig.excel.IconFilter#methods:ig.excel.TopOrBottomFilter) |並べ替えられた値リストの上位または下位にあるセルを表示できるフィルターです。|
|[ApplyYearToDateFilter](%%jQueryApiUrl%%/ig.excel.YearToDateFilter#methods:ig.excel.YearToDateFilter) |日付セルの範囲を現在の年の開始日からフィルターの評価実施日までの期間に絞り込むことのできるフィルターです。|
|[ApplyCustomFilter](%%jQueryApiUrl%%/ig.excel.AverageFilter#methods:ig.excel.CustomFilter) |1 つ、ないし 2 つのカスタム条件に基づいてデータを絞り込むことのできるフィルターです。この 2 つの絞り込み条件は論理積 (and) または論理和 (or) 演算子と組み合わせて使用できます。|

### コード スニペット: ApplyAverageFilter

このコードは、列のすべてのセルの平均値を上回るセルをフィルターする方法を示します。平均値より下回るフィルタリングは同じ方法で実行されます。

この例のコードは、ワークブックおよびワークシートを作成し、指定した領域を [WorksheetFilterSettings](%%jQueryApiUrl%%/ig.excel.WorksheetFilterSettings) で変更します。その後フィルターが領域の列で適用されます。最後にワークブックが保存されるため、フィルターされた領域が表示できます。

以下のコードはこの例を実装します。


**JavaScript の場合:**

```js
// Create a new workbook

var workbook = new $.ig.excel.Workbook($.ig.excel.WorkbookFormat.excel2007);
var sheet = workbook.worksheets().add('Sheet1');

// Filter the worksheet object

sheet.filterSettings().setRegion("C1:C15");	
sheet.filterSettings().applyCustomFilter(0, new $.ig.excel.CustomFilterCondition($.ig.excel.ExcelComparisonOperator.equals, "Dairy Products")); 
			
```

![](images/ExcelEngine_Worksheet_Filtering.png)

### 関連トピック

- [JavaScript Excel ライブラリの概要](JavaScript-Excel-Library-Overview.html)

### 関連サンプル

- [Excel の表](%%SamplesUrl%%/javascript-excel-library/excel-table)

- [Excel の書式設定](%%SamplesUrl%%/javascript-excel-library/excel-formatting)

- [Excel の数式](%%SamplesUrl%%/javascript-excel-library/excel-formulas)

- [Excel からデータをインポート](%%SamplesUrl%%/javascript-excel-library/excel-import-data)