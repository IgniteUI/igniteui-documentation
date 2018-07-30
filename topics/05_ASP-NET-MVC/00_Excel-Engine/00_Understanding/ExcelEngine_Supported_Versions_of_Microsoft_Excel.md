<!--
|metadata|
{
    "fileName": "excelengine-supported-versions-of-microsoft-excel",
    "controlName": "Infragistics Excel Library",
    "tags": ["FAQ"]
}
|metadata|
-->

# サポートされるバージョンの Microsoft Excel

Infragistics Excel Engine™ は、以下の Microsoft® Excel® ファイル形式の保存および読み込みが可能です。

|ファイル形式                          | 列挙体                                                               | 列挙体
|--------------------------------------|---------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Excel 97-2003 ワークブック (*.xls)        | Infragistics.Documents.Excel.WorkbookFormat.Excel97To2003                 | BIFF8 形式を使用します。 format.                                                                                                                                                                          |
|Excel 97-2003 テンプレート (*.xlt)        | Infragistics.Documents.Excel.WorkbookFormat.Excel97To2003Template         | BIFF8 形式を使用します。 format.                                                                                                                                                                          |
|Excel ワークブック (*.xlsx)              | Infragistics.Documents.Excel.WorkbookFormat.Excel2007                     |                                                                                                                                                                                             |
|Excel マクロ有効ワークブック (*.xlsm) | Infragistics.Documents.Excel.WorkbookFormat.Excel2007MacroEnabled         | Infragistics Excel Engine はマクロの作成、分析、または実行をサポートしません。読み込んだファイルにモジュールがある場合、保存時にそのモジュールが出力に含まれます。 |
|Excel テンプレート (*.xltx)               | Infragistics.Documents.Excel.WorkbookFormat.Excel2007Template             |                                                                                                                                                                                             |
|Excel マクロ有効テンプレート (*.xltm) | Infragistics.Documents.Excel.WorkbookFormat.Excel2007MacroEnabledTemplate | Infragistics Excel Engine はマクロの作成、分析、または実行をサポートしません。読み込んだファイルにモジュールがある場合、保存時にそのモジュールが出力に含まれます。 |
|Strict Open XML スプレッドシート (*.xlsx)  | Infragistics.Documents.Excel.WorkbookFormat.StrictOpenXml                 | Strict Open XML (ISO/IEC 29500 Strict) ファイル形式です。                                                                                                                                      |

