<!--
|metadata|
{
    "fileName": "javascript-excel-library-save-and-load-files-in-excel-template-format",
    "controlName": ["igExcel"],
    "tags": ["How Do I", "Templating"]
}
|metadata|
-->

# Excel テンプレート フォーマットでファイルを保存および読み込み

Infragistics JavaScript Excel ライブラリは、テンプレート ファイルを定義できる 3 つのファイル形式があります。テンプレートの形式には、Excel テンプレート フォーマット（拡張子は XLTX）、Excel マクロに対応したテンプレート フォーマット（拡張子は XLTM）、および Excel 97-2003 テンプレート フォーマット（拡張子は XLT）があり、これらの形式で保存および読み込みが可能です。

[`WorkbookFormat`](%%jQueryApiUrl%%/ig.excel.WorkbookFormat) 列挙体は、XLTX、XLTM、および XLT に対応する値 excel2007Template、excel2007MacroEnabledTemplate、および excel97To2003Template を含みます。[`currentFormat`](%%jQueryApiUrl%%/ig.excel.Workbook#methods:currentFormat) プロパティは、ファイルの現在の形式を取得するために使用できます。拡張子が不明なファイルを読み込む場合、ファイル コンテンツは適切な形式を動的に決定するために解析されます。

以下のコードは、Excel ファイルを [`save`](%%jQueryApiUrl%%/ig.excel.Workbook#methods:save) 関数を使用して excel2007Template 形式で保存します。

**JavaScript の場合:**

```js
// Create a workbook and set its format to Excel2007Template
var newWorkBook = 
  new $.ig.excel.Workbook($.ig.excel.WorkbookFormat.excel2007Template);
// Add a worksheet to the workbook
var worksheet1 = newWorkBook.worksheets().add("Sheet1");
// Format a cell in the worksheet
worksheet1.rows(1).cells(1).cellFormat().fill(
  $.ig.excel.CellFill.createSolidFill("red"));
// Save the workbook
newWorkBook.save(function(data) { 
  },
  function(error) {
  });
```
