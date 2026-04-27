<!--
|metadata|
{
    "fileName": "javascript-excel-library-create-a-workbook",
    "controlName": ["igExcel"],
    "tags": ["Getting Started"]
}
|metadata|
-->

# ワークブックを作成

JavaScript Excel ライブラリの機能を活用するには、最初に [Workbook](%%jQueryApiUrl%%/ig.excel.Workbook) オブジェクトを作成する必要があります。そのためには、操作方法のトピック [Excel ファイルをブックに読み込む](JavaScript-Excel-Library-Read-an-Excel-2007-XLSX-File-Into-a-Workbook.html)で説明するように既存の Microsoft® Excel® ファイルを読み込む、またはブランクのワークブックを作成します。ブランクのワークブックを作成する場合は、それをファイルに書き込む前に、ワークシートを少なくとも 1 つ追加する必要があります。また、様々な表示および印刷のオプションをワークブックとワークシートに設定できます。

以下のコードは、ブランクのワークブックの作成、いくつかのプロパティの設定、およびワークシートの追加のそれぞれの方法を示します。

**JavaScript の場合:**

```js
// Create a new workbook
// Create a new workbook
var workbook = new $.ig.excel.Workbook();

// Show only the vertical scroll bar
workbook.windowOptions().scrollBars($.ig.excel.ScrollBars.vertical);

// Create two worksheets for the workbook
var worksheet1 = workbook.worksheets().add("Sheet1");
var worksheet2 = workbook.worksheets().add("Sheet2");

// Set the value of one of the cells
worksheet2.rows(0).cells(0).value(14.56);

// Zoom in to double the normal viewing size on Sheet2
worksheet2.displayOptions().magnificationInNormalView(200);

// Make Sheet2 the selected worksheet
workbook.windowOptions().selectedWorksheet(worksheet2);
```
![](images/ExcelEngine_Create_a_Workbook_01.png)
