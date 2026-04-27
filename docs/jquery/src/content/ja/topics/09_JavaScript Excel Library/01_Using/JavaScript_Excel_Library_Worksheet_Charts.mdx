<!--
|metadata|
{
    "fileName": "javascript-excel-library-worksheet-charts",
    "controlName": ["igExcel"],
    "tags": ["How Do I"]
}
|metadata|
-->

# ワークシートにチャートを追加

## 概要

このトピックでは、データ トレンドを視覚的に表示するためにコードを使用して Excel® ワークシート (.xlsx) にワークシート チャートを追加し、ワークシートのセル領域のデータ トレンドを可視化する方法を表します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

- [前提要件](#background)
- [はじめに](#intro)
- [Excel ワークシートにチャートを追加](#adding_chart)
- [サポートされるチャート タイプ](#chart_types)
- [プレビュー](#preview)
- [コード スニペット](#code_snippets)

<a id="background"/>
## 前提条件

**注： XLSX 形式が必要です。現在他の形式はサポートされていません。**

以下のトピックがあります。

- [ワークブックを作成](javascript-excel-library-create-a-workbook.html)

- [参照文字列による Cells および Regions のアクセス](javascript-excel-library-accessing-cells-and-regions-by-their-reference-strings.html)

<a id="intro"/>
## 概要

ワークシートを追加するには、ワークシートの Shapes コレクションの [addChart](%%jQueryApiUrl%%/ig.excel.WorksheetShapeCollection#methods:addChart) メソッドを使用する必要があります。
このメソッドでは、チャート タイプを指定し、使用するメソッドのオーバーロードに応じて twip の領域または左上と右下のセルのいずれかを選択します。

[addChart](%%jQueryApiUrl%%/ig.excel.WorksheetShapeCollection#methods:addChart ) メソッドはワークシートに追加されるワークシート チャート要素を返します。チャートで [setSourceData](%%jQueryApiUrl%%/ig.excel.WorksheetChart#methods:setSourceData ) メソッドを使用してデータソースとして使用するワークシート セル領域のセルのセル アドレスを設定できます。同様に行列のマッピングを Y と X 軸に切り替えることもできます。

<a id="adding_chart"/>
## Excel ワークシートにチャートを追加

<a id="chart_types"/>
### サポートされるチャート タイプ

折れ線、エリア、柱状、円を含む 70 タイプ以上のチャート タイプがサポートされます。詳細については、[Worksheet ChartType API topic](%%jQueryApiUrl%%/ig.excel.ChartType.html#options) をご覧ください。

<a id="preview"/>
### プレビュー

以下は、各データと折れ線、エリア、柱状、円チャートをコードスニペットを使用して表示したワークシートのプレビューです。

![Displays the results of using the code below.](images/ExcelEngine_Worksheet_Charts.png)

<a id="code_snippets"/>
### コード スニペット

**JavaScript の場合:**

```html
$(function () {
    
    //Create workbook with a worksheet to place the charts in. Data is assumed to already exist in the screenshot above.
    var workbook = new $.ig.excel.Workbook($.ig.excel.WorkbookFormat.excel2007);
    var sheet = workbook.worksheets().add("Sheet1");
    
    //Set column widths and height of first row to show the charts more clearly.
    sheet.defaultColumnWidth(10000);    
    sheet.rows(0).height(5000);

    //Get the four cells that will be used to place the four charts below.
    var cell1 = sheet.getCell("A1");
    var cell2 = sheet.getCell("B1");
    var cell3 = sheet.getCell("C1");
    var cell4 = sheet.getCell("D1");

    //Create Line chart.
    var chart1 = sheet.shapes().addChart($ig.excel.ChartType.line, cell1, { x: 0, y: 0 }, cell1, { x: 100, y: 100 });
    chart1.setSourceData('Sheet1!A2:D4', true);

    //Create Column chart.
    var chart2 = sheet.shapes().addChart($ig.excel.ChartType.columnClustered, cell2, { x: 0, y: 0 }, cell2, { x: 100, y: 100 });
    chart2.setSourceData('Sheet1!A2:D4', true);

    //Create Area chart.
    var chart3 = sheet.shapes().addChart($ig.excel.ChartType.area, cell3, { x: 0, y: 0 }, cell3, { x: 100, y: 100 });
    chart3.setSourceData('Sheet1!A2:D4', true);

    //Create Pie chart.
    var chart4 = sheet.shapes().addChart($ig.excel.ChartType.pie, cell4, { x: 0, y: 0 }, cell4, { x: 100, y: 100 });
    chart4.setSourceData('Sheet1!A2:D4', false);
});
```
