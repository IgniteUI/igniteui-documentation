<!--
|metadata|
{
    "fileName": "javascript-excel-library-moving-a-worksheet-within-an-excel-workbook",
    "controlName": ["igExcel"],
    "tags": ["How Do I"]
}
|metadata|
-->

# Excel ワークブック内でのワークシートの移動
特定のケースで、所有する Excel® ワークブックのワークシート コレクションの特定のインデックス位置にワークシートを移動しなければならない場合があります。

Excel Workbook に 3 つのワークシートがある場合、[`Worksheet`](%%jQueryApiUrl%%/ig.excel.Worksheet) クラスの [`moveToIndex`](%%jQueryApiUrl%%/ig.excel.Worksheet#methods:moveToIndex) メソッドを使用して worksheet3 を先頭の位置に配置できます。

以下の例のコードはこれを実装する方法を示します。

**JavaScript の場合:**
```js
var workbook = new $.ig.excel.Workbook();
var worksheet1 = workbook.worksheets().add("Sheet1");
var worksheet2 = workbook.worksheets().add("Sheet2");
var worksheet3 = workbook.worksheets().add("Sheet3");
// Moving Sheet3 to the first position
worksheet3.moveToIndex(0);
```
