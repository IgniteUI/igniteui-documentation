<!--
|metadata|
{
    "fileName": "javascript-excel-library-read-an-excel-2007-xlsx-file-into-a-workbook",
    "controlName": ["igExcel"],
    "tags": ["Data Binding","How Do I"]
}
|metadata|
-->

# Excel 2007 XLSX ファイルをワークブックに読み込む

Microsoft® Excel® ファイルを書き出すだけでなく、JavaScript Excel ライブラリはこれらのファイルを読み込むこともできます。Excel ファイルが静的な [`load`](%%jQueryApiUrl%%/ig.excel.Workbook#methods:load) メソッドで読み取られる時に、[`Workbook`](%%jQueryApiUrl%%/ig.excel.Workbook) オブジェクトが作成され、オブジェクト モデル全体にファイルからのすべてのサポートされる情報が移植されます。

特定のフォーマットのワークブックをロードし、それを別のフォーマットで保存したい場合、[Infragistics.Documents.Excel.Workbook](%%jQueryApiUrl%%/ig.excel.Workbookl) オブジェクトの [setCurrentFormat](%%jQueryApiUrl%%/ig.excel.Workbook#methods:setCurrentFormatl) メソッドを使用できます。また、[currentFormat](%%jQueryApiUrl%%/ig.excel.Workbook#methods:currentFormat) プロパティは、現在のワークブック形式を取得するために使用できます。

以下のコードは、既存の XLSX ワークブックで読み取り、変更を行い、ワークブックを新しいファイルに書き込む方法を示します。

**JavaScript の場合:**

```js
var workbook = $.ig.excel.Workbook.load(fileData);

workbook.worksheets(0).rows(0).cells(0).value(19);
workbook.save(function(data) { 
  },
  function(error) {
  });
```



 

 


