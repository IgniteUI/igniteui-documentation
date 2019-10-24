<!--
|metadata|
{
    "fileName": "javaScript-excel-library-adding-a-sparkline-to-an-excel-worksheet",
    "controlName": ["igExcel"],
    "tags": ["Sparklines"]
}
|metadata|
-->

# スパークラインを Excel ワークシートに追加

JavaScript Excel Library を使用するために[ワークブック](%%jQueryApiUrl%%/ig.excel.Workbook "ワークブック メンバーの Web API リファレンス ガイド") オブジェクトを作成する必要があります。既存の Microsoft® Excel® を読み込むか [Excel ファイルをワークブックに読み込み](JavaScript-Excel-Library-Read-an-Excel-2007-XLSX-File-Into-a-Workbook.html "Excel ファイルをワークブックへ読み込む方法") または空のワークブックを作成できます。空白のワークブックを作成する場合、ファイルに書き込む前にワークシートを少なくとも 1 つ追加する必要があります。

このトピックでは、データ トレンドを視覚的に表すために Javascript Excel Library を使用して Excel® ワークシート (.xlsx) にスパークラインを追加する方法を表します。スパークラインでデータでの変更を簡単にビジュアル化できます。スパークラインはワークシート内のセル内にどこでも配置できます。

# サポートされるスパークライン

以下はサポートされる定義済スパークラインのタイプです。

| SparklineType | 外観                                         |
|---------------|-------------------------------------------------------|
|Line           | ![Line](./images/ExcelChart_Sparkline_Line.png)       |
|Column         | ![Column](./images/ExcelChart_Sparkline_Column.png)   |
|Stacked        | ![Stacked](./images/ExcelChart_Sparkline_Stacked.png) |


# 概要

ワークシートにスパークラインを追加する前に SparklineGroup の Add メソッドで Worksheet.SparklineGroups コレクションに新しい SparklineGroup を追加する必要があります。SparklineGroups の Add メソッドはスパークラインのタイプ、位置とデータの位置を表す 3 つのパラメーターを取得します。

# プレビュー

以下に、Microsoft Excel 2016 で表示した Sheet1: Sparklines の最終的な結果のプレビューを示します。データは Sheet2: Data にあり、A1 から A10 までのデータは (4, 5, 2, 7, -1, 3, -2, 5, 2, and 6) です。

![Sparklines](./images/ExcelChart_Sparklines.png)

以下は上記のサンプルを実装するコードです。

**JavaScript の場合:**

```js
var workbook = new $.ig.excel.Workbook($.ig.excel.WorkbookFormat.excel2007);
var sheet1 = workbook.worksheets().add('Sparklines');
var sheet2 = workbook.worksheets().add('Data');
sheet1.sparklineGroups().add($.ig.excel.SparklineType.line, "Sparklines!A1:A1", "Data!A2:A11"); 
sheet1.sparklineGroups().add($.ig.excel.SparklineType.column, "Sparklines!B1:B1", "Data!A2:A11"); 
saveWorkbook(workbook, "Sparklines.xlsx");
```