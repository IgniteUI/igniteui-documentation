<!--
|metadata|
{
    "fileName": "documentengine-grids",
    "controlName": "Infragistics Document Library",
    "tags": ["Layouts","Reporting"]
}
|metadata|
-->

# グリッド

Grid 要素は行と列のレイアウトでコンテンツを表示します。グリッドの各セルは、追加する列と行の数で決定されるレイアウトにバインドされます。たとえば、セルの幅は列の幅で決まり、セルの高さは行の高さで決まります。

![](images/DocumentEngine_Grids_01.png)

各セルには [`ColSpan`](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.IGridCell~ColSpan.html) プロパティと [`RowSpan`](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.IGridCell~RowSpan.html) プロパティもあり、これらのプロパティによってセルは必要な列および行数だけスパンできます。したがって、グリッドの見出しが必要な場合には、行で最初のセルを追加して、ColSpan プロパティをグリッド内にある列の数に設定する必要があります。

Grid 要素は Header、Footer、および Divider 要素も含みます。これらの要素は、1 行と IGrid インターフェイスの [`AddColumn`](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.IGrid~AddColumn.html) メソッドを使用してグリッドに追加する列の数のみで構成されます。これらの要素も Band 要素の Header、Footer、および Divider 要素と同じように動作します。ヘッダーは、[`Repeat`](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.IGridHeader~Repeat.html) プロパティによって異なりますが、全ページまたは先頭ページのみのグリッドの一番上に表示します。フッターも同様ですが最終ページに適用されます。デバイダは、グリッドが次ページにまたがる場合に全ページの最後に表示します。

[パターン コンテンツ](DocumentEngine-Pattern-Content.html) ファミリーのメンバーとして、さまざまなグリッド レベルでパターンを適用することにより、さまざまなグリッド 要素のスタイルを修正できます。

*   **グリッド パターン** -- グリッド全体をスタイルし、セル パターン以外のその他すべてのパターンへのアクセスを提供します ([GridPattern](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.GridPattern.html) クラスはスタイルを [IGrid](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.IGrid.html) インターフェイスに適用します)。
*   **ヘッダー パターン** -- グリッドのヘッダー要素をスタイルします ([GridHeaderPattern](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.GridHeaderPattern.html) クラスはスタイルを [IGridHeader](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.IGridHeader.html) インターフェイスに適用します)。
*   **区分線パターン** -- グリッドの区分線要素をスタイルします ([GridDividerPattern](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.GridDividerPattern.html) クラスはスタイルを [IGridDivider](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.IGridDivider.html) インターフェイスに適用します)。
*   **フッター パターン** -- グリッドのフッター要素をスタイルします ([GridFooterPattern](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.GridFooterPattern.html) クラスはスタイルを [IGridFooter](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.IGridFooter.html) インターフェイスに適用します)。
*   **列パターン **-- グリッドの各列をスタイルします ([GridColumnPattern](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.GridColumnPattern.html) クラスはスタイルを [IGridColumn](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.IGridColumn.html) インターフェイスに適用します)。
*   **行パターン** -- グリッドの各行をスタイルします ([GridRowPattern](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.GridRowPattern.html) クラスはスタイルを [IGridRow](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.IGridRow.html) インターフェイスに適用します)。
*   **セル パターン** -- 各セル個々を詳細にスタイルします ([GridCellPattern](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.GridCellPattern.html) クラスはスタイルを [IGridCell](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Grid.IGridCell.html) インターフェイスに適用します)。

****

以下のコードは、ヘッダーとフッターを持つ 5 列 5 行で構成されるグリッドを作成します。セルの作成ループがセル 2 x 2 に遭遇すると、2 列ずつそのセルをスパンします。ループがセル 5 x 3 に遭遇すると、3 行ずつそのセルをスパンします。

1.  **グリッド全体のパターンを作成し、次の個々のセルのパターンを作成します。**

    **Visual Basic の場合:**

    ```vb
    Imports Infragistics.Documents.Reports.Report
    .
    .
    .
    ' Create a new pattern for the grid as a whole.
    Dim gridPattern As New Infragistics.Documents.Reports.Report.Grid.GridPattern()
    gridPattern.Borders = New Borders(New Pen(New Color(0, 0, 0)), 5)
    gridPattern.Background = New Background(Brushes.LightSteelBlue)

    ' Create a new pattern for each cell.
    Dim cellPattern As New Infragistics.Documents.Reports.Report.Grid.GridCellPattern()
    cellPattern.Paddings = New Paddings(5, 10)
    cellPattern.Borders = New Borders(New Pen(New Color(0, 0, 0)))
    'cellPattern.Background = new Background(brush3);
    cellPattern.Alignment = _
      New ContentAlignment(Alignment.Center, Alignment.Middle)
    ```

    **C# の場合:**

    ```csharp
    using Infragistics.Documents.Reports.Report;
    .
    .
    .
    // Create a new pattern for the grid as a whole.
    Infragistics.Documents.Reports.Report.Grid.GridPattern gridPattern = 
      new GridPattern();
    gridPattern.Borders = new Borders(new Pen(new Color(0, 0, 0)), 5);

    // Create a new pattern for each cell.
    Infragistics.Documents.Reports.Report.Grid.GridCellPattern cellPattern = new GridCellPattern();
    cellPattern.Paddings = new Paddings(5, 10);
    cellPattern.Borders = new Borders(new Pen(new Color(0, 0, 0)));
    cellPattern.Background = new Background(Brushes.LightSteelBlue);
    cellPattern.Alignment = 
      new ContentAlignment(Alignment.Center, Alignment.Middle);
    ```

2.  **グリッドを作成し、グリッド パターンを適用します。**

    **Visual Basic の場合:**

    ```vb
    ' Create the grid and apply the GridPattern
    Dim grid As Infragistics.Documents.Reports.Report.Grid.IGrid = section1.AddGrid()
    grid.ApplyPattern(gridPattern)

    ' Declare a Row, and Cell object 
    ' for object creation.
    Dim gridRow As Infragistics.Documents.Reports.Report.Grid.IGridRow
    Dim gridCell As Infragistics.Documents.Reports.Report.Grid.IGridCell
    ```

    **C# の場合:**

    ```csharp
    // Create the grid and apply the GridPattern
    Infragistics.Documents.Reports.Report.Grid.IGrid grid = section1.AddGrid();
    grid.ApplyPattern(gridPattern);

    // Declare a Row, and Cell object 
    // for object creation.
    Infragistics.Documents.Reports.Report.Grid.IGridRow gridRow;
    Infragistics.Documents.Reports.Report.Grid.IGridCell gridCell;
    ```

3.  **列を定義します。**

    **Visual Basic の場合:**

    ```vb
    ' Add five columns to the grid.
    For i As Integer = 0 To 4
            grid.AddColumn()
    Next i
    ```

    **C# の場合:**

    ```csharp
    // Add five columns to the grid.
    for (int i = 0; i < 5; i++)
    {
            grid.AddColumn();
    }
    ```

4.  **ヘッダーとフッターを追加します。**

    **Visual Basic の場合:**

    ```vb
    ' Add a header to the grid.
    Dim gridHeader As Infragistics.Documents.Reports.Report.Grid.IGridHeader = grid.Header
    Dim headerCell As Infragistics.Documents.Reports.Report.Grid.IGridCell = _
      gridHeader.AddCell()
    headerCell.ColSpan = 5
    cellPattern.Apply(headerCell)
    Dim headerCellText As IText = headerCell.AddText()
    headerCellText.Alignment = _
      New TextAlignment(Alignment.Center, Alignment.Middle)
    headerCellText.AddContent("Grid Header")

    ' Add a footer to the grid.
    Dim gridFooter As Infragistics.Documents.Reports.Report.Grid.IGridFooter = grid.Footer
    Dim footerCell As Infragistics.Documents.Reports.Report.Grid.IGridCell = _
      gridFooter.AddCell()
    footerCell.ColSpan = 5
    cellPattern.Apply(footerCell)
    Dim gridFooterText As Infragistics.Documents.Reports.Report.Text.IText = _
      footerCell.AddText()
    gridFooterText.Alignment = _
      New TextAlignment(Alignment.Right, Alignment.Middle)
    gridFooterText.AddContent("Grid Footer")
    ```

    **C# の場合:**

    ```csharp
    // Add a header to the grid.
    Infragistics.Documents.Reports.Report.Grid.IGridHeader gridHeader = grid.Header;
    Infragistics.Documents.Reports.Report.Grid.IGridCell headerCell = 
      gridHeader.AddCell();
    headerCell.ColSpan = 5;
    cellPattern.Apply(headerCell);
    Infragistics.Documents.Reports.Report.Text.IText headerCellText = headerCell.AddText();
    headerCellText.Alignment = 
      new TextAlignment(Alignment.Center, Alignment.Middle);
    headerCellText.AddContent("Grid Header");

    // Add a footer to the grid.
    Infragistics.Documents.Reports.Report.Grid.IGridFooter gridFooter = grid.Footer;
    Infragistics.Documents.Reports.Report.Grid.IGridCell footerCell = 
      gridFooter.AddCell();
    footerCell.ColSpan = 5;
    cellPattern.Apply(footerCell);
    Infragistics.Documents.Reports.Report.Text.IText gridFooterText = 
      footerCell.AddText();
    gridFooterText.Alignment = 
      new TextAlignment(Alignment.Right, Alignment.Middle);
    gridFooterText.AddContent("Grid Footer");
    ```

5.  **5 行追加し各行にセルを 5 つ追加します。**

    **Visual Basic の場合:**

    ```vb
    For i As Integer = 0 To 4
            gridRow = grid.AddRow()

            ' Add five cells to each row.
            For j As Integer = 0 To 4

                    If i = 1 AndAlso j = 1 Then
                            gridCell = gridRow.AddCell()
                            cellPattern.Apply(gridCell)
                            gridCell.Background = _
                              New Background(Brushes.LightSlateGray)
                            gridCell.AddQuickText("Column Span")

                            gridCell.ColSpan = 2

                            j += 1
                    ElseIf i = 2 AndAlso j = 4 Then
                            gridCell = gridRow.AddCell()
                            cellPattern.Apply(gridCell)
                            gridCell.Background = _
                              New Background(Brushes.LightSlateGray)
                            gridCell.AddQuickText("Row Span")

                            gridCell.RowSpan = 3
                    Else
                            gridCell = gridRow.AddCell()
                            cellPattern.Apply(gridCell)
                            gridCell.AddQuickText( _
                              ("row " + i.ToString() + ", col " + j.ToString()))
                    End If
            Next j
    Next i
    ```

    **C# の場合:**

    ```csharp
    // Add five rows to the grid.
    for (int i = 0; i < 5; i++)
    {
            gridRow = grid.AddRow();

            // Add five cells to each row.
            for (int j = 0; j < 5; j++)
            {

                    if (i == 1 && j == 1)
                    {
                            gridCell = gridRow.AddCell();
                            cellPattern.Apply(gridCell);
                            gridCell.Background = 
                              new Background(Brushes.LightSlateGray);
                            gridCell.AddQuickText("Column Span");

                            gridCell.ColSpan = 2;

                            j++;
                    }
                    else if (i == 2 && j == 4)
                    {
                            gridCell = gridRow.AddCell();
                            cellPattern.Apply(gridCell);
                            gridCell.Background = 
                              new Background(Brushes.LightSlateGray);
                            gridCell.AddQuickText("Row Span");

                            gridCell.RowSpan = 3;
                    }
                    else
                    {
                            gridCell = gridRow.AddCell();
                            cellPattern.Apply(gridCell);
                            gridCell.AddQuickText( 
                              "row " + i + ", col " + j);
                    }
            }
    }
    ```
