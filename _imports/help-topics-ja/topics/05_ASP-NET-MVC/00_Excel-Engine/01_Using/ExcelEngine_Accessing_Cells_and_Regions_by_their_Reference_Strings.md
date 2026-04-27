<!--
|metadata|
{
    "fileName": "excelengine-accessing-cells-and-regions-by-their-reference-strings",
    "controlName": "Infragistics Excel Library",
    "tags": ["How Do I"]
}
|metadata|
-->

# 参照文字列による Cells および Regions のアクセス

このトピックによって、Excel® ワークブックのワークシート内でセルと範囲にアクセスする方法をよく知ることができます。Worksheet クラスの [`GetCell`](Infragistics.Web.Documents.Excel~Infragistics.Documents.Excel.Worksheet~GetCell.html) メソッドと [`GetRegion`](Infragistics.Web.Documents.Excel~Infragistics.Documents.Excel.Worksheet~GetRegion.html) メソッドはセル参照文字列をパラメーターとして受け取ります。

以下の例のコードで、Worksheet セルは GetCell メソッドによってアクセスされ、Excel 数式が適用されます。同様に Excel 数式がワークシート内のセルの範囲に適用されます。

**Visual Basic の場合:**


```vb
'Accessing a single cell
worksheet.GetCell ("C5").ApplyFormula ("=A5*B5")
'Accessing a range of cells
 worksheet.GetRegion ("G1:G10").ApplyFormula ("=E1*F1")
```

**C# の場合:**


```csharp
//Accessing a single cell
worksheet.GetCell ("C5").ApplyFormula ("=A5*B5");
//Accessing a range of cells
 worksheet.GetRegion ("G1:G10").ApplyFormula ("=E1*F1");
```

 

 


