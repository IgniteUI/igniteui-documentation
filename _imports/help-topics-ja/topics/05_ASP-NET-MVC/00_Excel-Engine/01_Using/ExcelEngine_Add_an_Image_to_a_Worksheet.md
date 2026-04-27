<!--
|metadata|
{
    "fileName": "excelengine-add-an-image-to-a-worksheet",
    "controlName": "Infragistics Excel Library",
    "tags": ["How Do I"]
}
|metadata|
-->

# 画像をワークシートに追加

Microsoft® Excel® では、ワークシートの任意の位置に画像や形状を配置できます。[`WorksheetImage`](Infragistics.Web.Documents.Excel~Infragistics.Documents.Excel.WorksheetImage.html) オブジェクトを使って、画像を [Worksheet](Infragistics.Web.Documents.Excel~Infragistics.Documents.Excel.Worksheet.html) に追加することもできます。次の手順に従って、すべての形状をワークシートに追加できます。

1.  希望の形状を作成します。
2.  形状のアンカーを設定します。これは、形状がワークシート上のどこに配置されるかを決定します。
3.  形状をワークシートの [Shapes](Infragistics.Web.Documents.Excel~Infragistics.Documents.Excel.Worksheet~Shapes.html) コレクションに追加します。

形状をワークシートに配置する前に設定する必要があるアンカーは、形状の [TopLeftCornerCell](Infragistics.Web.Documents.Excel~Infragistics.Documents.Excel.WorksheetShape~TopLeftCornerCell.html) および [BottomRightCornerCell](Infragistics.Web.Documents.Excel~Infragistics.Documents.Excel.WorksheetShape~BottomRightCornerCell.html) プロパティです。これらのセルは、形状のワークシートを Excel で表示するときに、形状の関連付けられた隅がどこに表示されるかを決定します。追加のアンカー プロパティとして、形状の [TopLeftCornerPosition](Infragistics.Web.Documents.Excel~Infragistics.Documents.Excel.WorksheetShape~TopLeftCornerPosition.html) および [BottomRightCornerPosition](Infragistics.Web.Documents.Excel~Infragistics.Documents.Excel.WorksheetShape~BottomRightCornerPosition.html) プロパティがあります。これらのプロパティを使用することで、形状の関連付けられた隅がセル内のどこに表示されるかを細かく制御できます。これらの位置プロパティでは、セルの各寸法をすべてパーセンテージで表し、(0.0, 0.0) が関連付けられたアンカー セルの左上隅を意味し、(100.0, 100.0) が右下隅を意味します。

以下のコードは、画像を作成し、ワークシートの A1 セル全体を塗りつぶす方法を示します。

**Visual Basic の場合:**

```vb
Dim workbook As New Infragistics.Documents.Excel.Workbook()
Dim worksheet As Infragistics.Documents.Excel.Worksheet = _
  workbook.Worksheets.Add("Sheet1")

Dim image As Image = image.FromFile("C:image.bmp")
Dim imageShape As Infragistics.Documents.Excel.WorksheetImage = _
  New Infragistics.Documents.Excel.WorksheetImage(image)

Dim cellA1 As Infragistics.Documents.Excel.WorksheetCell = _
  worksheet.Rows.Item(0).Cells.Item(0)

' The top-left corner of the image should be at the 
' top-left corner of cell A1
imageShape.TopLeftCornerCell = cellA1
imageShape.TopLeftCornerPosition = New PointF(0.0F, 0.0F)

' The bottom-right corner of the image should be at 
' the bottom-right corner of cell A1
imageShape.BottomRightCornerCell = cellA1
imageShape.BottomRightCornerPosition = New PointF(100.0F, 100.0F)

worksheet.Shapes.Add(imageShape)
```

**C# の場合:**

```csharp
Infragistics.Documents.Excel.Workbook workbook = new Infragistics.Documents.Excel.Workbook();
Infragistics.Documents.Excel.Worksheet worksheet =
  workbook.Worksheets.Add( "Sheet1" );

Image image = Image.FromFile( "C:image.bmp" );
Infragistics.Documents.Excel.WorksheetImage imageShape = 
  new Infragistics.Documents.Excel.WorksheetImage( image );

Infragistics.Documents.Excel.WorksheetCell cellA1 = worksheet.Rows[0].Cells[0];

// The top-left corner of the image should be at the 
// top-left corner of cell A1
imageShape.TopLeftCornerCell = cellA1;
imageShape.TopLeftCornerPosition = new PointF( 0.0F, 0.0F );

// The bottom-right corner of the image should be at 
// the bottom-right corner of cell A1
imageShape.BottomRightCornerCell = cellA1;
imageShape.BottomRightCornerPosition = new PointF( 100.0F, 100.0F );

worksheet.Shapes.Add( imageShape );
```
![](images/ExcelEngine_Add_an_Image_to_a_Worksheet_01.png)



 

 


