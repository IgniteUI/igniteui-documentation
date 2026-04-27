<!--
|metadata|
{
    "fileName": "javascript-excel-library-conditional-formatting",
    "controlName": ["igExcel"],
    "tags": ["How Do I", "Conditional Formatting"]
}
|metadata|
-->

# 条件付き書式

### 目的

このトピックは、Infragistics Excel Library を使用してワークシートで条件付き書式を構成して設定する方法を説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

- [条件付き書式の構成の概要](#formattingsummary)
- [条件付き書式の構成の概要表](#formattingsummarychart)
- [コード例](#codeexample)
- [関連コンテンツ](#relatedcontent)

<a id="formattingsummary" />
## 条件付き書式の構成の概要

特定のワークシートの条件付き書式を構成するには、ワークシートの ConditionalFormats コレクションに公開される Add メソッドを使用できます。この Add メソッドの最初のパラメーターは条件付き書式に適用するワークシートの文字列領域です。

Worksheet に追加可能な条件付き書式にその条件が true の場合にワークシート セル要素の外観を決定する `CellFormat` メソッドがあります。たとえば、Fill および Font などのこの `CellFormat` メソッドにアタッチされるメソッドを使用してセルの背景およびフォント設定を決定できます。

条件付き書式が作成され、セルの書式設定が適用される場合、ワークシート セルにサポートされるプロパティのサブセットがあります。 現在サポートされる CellFormat メソッドのプロパティは Fill、Border プロパティ、FormatString、および Strikethrough、Underline、Italic、Bold、Color などの Font プロパティです。以下のコード スニペットに複数のプロパティが設定されます。

ワークシート セルの可視化の動作が異なるため、`CellFormat` メソッドがない条件付き書式もあります。この条件付き書式は `DataBarConditionalFormat`、`ColorScaleConditionalFormat`、および `IconSetConditionalFormat` です。

既存のワークブックを Excel から読み込む場合、ワークブック読み込み時に書式設定が保持されます。ワークブックを Excel ファイルに保存する場合も保持されます。

<a id="formattingsummarychart" />
## 条件付き書式の構成の概要表

以下の表は、ワークシートでサポートされる条件付き書式を説明し、その要素の `ConditionalFormats` コレクションの追加するメソッドにマップします。

<table class="table">
	<thead>
		<tr>
			<th>条件付き書式</th>
			<th>メソッド</th>
			<th>説明</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>[AverageConditionalFormat](%%jQueryApiUrl%%/ig.excel.AverageConditionalFormat)</td>
			<td>[addAverageCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addAverageCondition)</td>
			<td>セルの値が関連する範囲の平均または標準偏差の上下にあるかどうかに基づいてワークシート セルのビジュアル属性を制御するメソッドを公開します。</td>
		</tr>
		<tr>
			<td>[BlanksConditionalFormat](%%jQueryApiUrl%%/ig.excel.BlanksConditionalFormat)</td>
			<td>[addBlanksCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addBlanksCondition)</td>
			<td>セルの値が設定されていないかどうかに基づいてワークシート セルのビジュアル属性を制御するプロパティを公開します。</td>
		</tr>
		<tr>
			<td>[ColorScaleConditionalFormat](%%jQueryApiUrl%%/ig.excel.ColorScaleConditionalFormat)</td>
			<td>[addColorScaleCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addColorScaleCondition)</td>
			<td>最小値、中値、および最大値のしきい値に相対してセル値に基づいてワークシート セルの色設定を制御するプロパティを公開します。</td>
		</tr>
		<tr>
			<td>[DataBarConditionalFormat](%%jQueryApiUrl%%/ig.excel.DataBarConditionalFormat)</td>
			<td>[addDataBarCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addDataBarCondition)</td>
			<td>関連する値範囲に相対するセルの値に基づいてワークシート セルでデータ バーを表示するプロパティを公開します。</td>
		</tr>
		<tr>
			<td>[DateTimeConditionalFormat](%%jQueryApiUrl%%/ig.excel.DateTimeConditionalFormat)</td>
			<td>[addDateTimeCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addDateTimeCondition)</td>
			<td>セルの日付値が指定した範囲にあるかどうかに基づいてワークシート セルのビジュアル属性を制御するプロパティを公開します。</td>
		</tr>
		<tr>
			<td>[DuplicateConditionalFormat](%%jQueryApiUrl%%/ig.excel.DuplicateConditionalFormat)</td>
			<td>[addDuplicateCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addDuplicateCondition)</td>
			<td>セルの値が関連する範囲で一意または複製かどうかに基づいてワークシート セルのビジュアル属性を制御するプロパティを公開します。</td>
		</tr>
		<tr>
			<td>[ErrorsConditionalFormat](%%jQueryApiUrl%%/ig.excel.ErrorsConditionalFormat)</td>
			<td>[addErrorsCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addErrorsCondition)</td>
			<td>セルの値が有効かどうかに基づいてワークシート セルのビジュアル属性を制御するプロパティを公開します。</td>
		</tr>
		<tr>
			<td>[FormulaConditionalFormat](%%jQueryApiUrl%%/ig.excel.FormulaConditionalFormat)</td>
			<td>[addFormulaCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addFormulaCondition)</td>
			<td>セルの値が数式によって定義される条件に一致するかどうかに基づいてワークシート セルのビジュアル属性を制御するプロパティを公開します。</td>
		</tr>
		<tr>
			<td>[IconSetConditionalFormat](%%jQueryApiUrl%%/ig.excel.IconSetConditionalFormat)</td>
			<td>[addIconSetCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addIconSetCondition)</td>
			<td>しきい値に相対するセルの値に基づいてワークシート セルでアイコンを表示するプロパティを公開します。</td>
		</tr>
		<tr>
			<td>[NoBlanksConditionalFormat](%%jQueryApiUrl%%/ig.excel.NoBlanksConditionalFormat)</td>
			<td>[addNoBlanksCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addNoBlanksCondition)</td>
			<td>セルの値が設定されるかどうかに基づいてワークシート セルのビジュアル属性を制御するプロパティを公開します。</td>
		</tr>
				<tr>
			<td>[NoErrorsConditionalFormat](%%jQueryApiUrl%%/ig.excel.NoErrorsConditionalFormat)</td>
			<td>[addNoErrorsCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addNoErrorsCondition)</td>
			<td>セルの値が有効かどうかに基づいてワークシート セルのビジュアル属性を制御するプロパティを公開します。</td>
		</tr>
		<tr>
			<td>[OperatorConditionalFormat](%%jQueryApiUrl%%/ig.excel.OperatorConditionalFormat)</td>
			<td>[addOperatorCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addOperatorCondition)</td>
			<td>セルの値が論理演算子によって定義される条件に一致するかどうかに基づいてワークシート セルのビジュアル属性を制御するプロパティを公開します。</td>
		</tr>
				<tr>
			<td>[RankConditionalFormat](%%jQueryApiUrl%%/ig.excel.RankConditionalFormat)</td></td>
			<td>[addRankCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addRankCondition)</td>
			<td>セルの値が関連する範囲の上位または下位にあるかどうかに基づいてワークシート セルのビジュアル属性を制御するプロパティを公開します。</td>
		</tr>
		<tr>
			<td>[TextOperatorConditionalFormat](%%jQueryApiUrl%%/ig.excel.TextOperatorConditionalFormat)</td>
			<td>[addTextCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addTextCondition)</td>
			<td>セルのテキスト値が文字列によって定義される条件に一致するかどうかに基づいてワークシート セルのビジュアル属性を制御するプロパティを公開します。</td>
		</tr>
		<tr>
			<td>[UniqueConditionalFormat](%%jQueryApiUrl%%/ig.excel.UniqueConditionalFormat)</td>
			<td>[addUniqueCondition](%%jQueryApiUrl%%/ig.excel.ConditionalFormatCollection#methods.addUniqueCondition)</td>
			<td>セルの値が関連する範囲で一意かどうかに基づいてワークシート セルのビジュアル属性を制御するプロパティを公開します。</td>
		</tr>
	</tbody>
</table>


<a id="codeexample" />
## コード例

以下のコード例は上記の条件付き書式の使用を紹介します。


**HTML の場合:**

```html
$(function () {

        var workbook = new $.ig.excel.Workbook($.ig.excel.WorkbookFormat.excel2007);
        var sheet = workbook.worksheets().add('Sheet1');
        
        var duplicateCondition = sheet.conditionalFormats().addDuplicateCondition("A2:A15");
        duplicateCondition.cellFormat().font().colorInfo(new $.ig.excel.WorkbookColorInfo("red"));                               
        var blanksCondition = sheet.conditionalFormats().addBlanksCondition("B2:B15");
        blanksCondition.cellFormat().fill($.ig.excel.CellFill.createSolidFill("gray"));

        var textCondition = sheet.conditionalFormats().addTextCondition("C2:C15", "Bev");
        textCondition.cellFormat().font().colorInfo(new $.ig.excel.WorkbookColorInfo("blue"));                                 
        var uniqueCondition = sheet.conditionalFormats().addUniqueCondition("D2:D15");      
        uniqueCondition.cellFormat().font().colorInfo(new $.ig.excel.WorkbookColorInfo("orange"));
        
        var notBlankCondition = sheet.conditionalFormats().addNoBlanksCondition("E2:E15");
        notBlankCondition.cellFormat().font().colorInfo(new $.ig.excel.WorkbookColorInfo("green"));
                
        sheet.conditionalFormats().addDataBarCondition("F2:F15");

        var avgCondition = sheet.conditionalFormats().addAverageCondition("G2:G15");
        avgCondition.cellFormat().font().colorInfo(new $.ig.excel.WorkbookColorInfo("red"));
    });
```

<a id="relatedcontent" />
### 関連コンテンツ

-   [セルの結合](javascript-excel-library-merge-cells.html)
-   [Worksheet API](%%jQueryApiUrl%%/ig.excel.Worksheet)