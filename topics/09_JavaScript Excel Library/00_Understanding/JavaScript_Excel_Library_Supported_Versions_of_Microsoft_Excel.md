<!--
|metadata|
{
    "fileName": "javascript-excel-library-supported-versions-of-microsoft-excel",
    "controlName": ["igExcel"],
    "tags": ["FAQ"]
}
|metadata|
-->

# サポートされるバージョンの Microsoft Excel

Infragistics JavaScript Excel ライブラリ™ は Microsoft® Excel®.xls ファイルを保存および読み込むことができます。これらの .xls ファイルは BIFF8 フォーマットで保存されるため、特定のバージョンの Excel に限り互換性があります。以下の表はサポートされるバージョンの Excel と、そのバージョンに関連付けられた制約または制限をリストしています。

Excel のバージョン|説明
---|---
Microsoft Excel 97|BIFF8 フォーマットを使用。
Microsoft Excel 2000|BIFF8 フォーマットを使用。
Microsoft Excel 2002|Microsoft Office® XP ファミリー製品のメンバー。BIFF8 フォーマットを使用。
Microsoft Excel 2003|BIFF8 フォーマットを使用。
Microsoft Excel 2007|[Workbook](%%jQueryApiUrl%%/ig.excel.Workbook#methods:save) オブジェクトの [Save](%%jQueryApiUrl%%/ig.excel.Workbook) 関数を使用する場合、.xlsx ファイルは XML ファイル形式で書き出されます。<br/>**注:** Excel Engine は Excel Binary Workbook (.xlsb) フォーマットを現時点ではサポートしていません。

