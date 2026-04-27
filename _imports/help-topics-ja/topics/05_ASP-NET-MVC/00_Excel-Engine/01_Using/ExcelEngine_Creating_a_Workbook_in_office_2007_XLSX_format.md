<!--
|metadata|
{
    "fileName": "excelengine-creating-a-workbook-in-office-2007-xlsx-format",
    "controlName": "Infragistics Excel Library",
    "tags": ["Getting Started"]
}
|metadata|
-->

# Office 2007 XLSX 形式でワークブックを作成

Infragistics® Excel® オブジェクト ライブラリによって、新しい `xlsx` フォーマット（Excel2007）で Excel ファイルを作成できます。

`xlsx` フォーマットを作成および保存する時のプロジェクトの依存および参照についての詳細は、トピック [Office® 2007 xlsx ファイル生成の参照と依存](ExcelEngine-Office-2007-XLSX-file-generation-references-and-dependencies.html)を参照してください。

以下のコード例は、Excel ワークブック用に新しい xlsx フォーマットを設定する方法を示します。

**Visual Basic の場合:**


```vb
Dim workbook As New Infragistics.Documents.Excel.Workbook()
workbook.SetCurrentFormat(WorkbookFormat.Excel2007)
```

**C# の場合:**


```csharp
Infragistics.Documents.Excel.Workbook workbook = new Infragistics.Documents.Excel.Workbook ();
workbook.SetCurrentFormat (WorkbookFormat.Excel2007);
```

