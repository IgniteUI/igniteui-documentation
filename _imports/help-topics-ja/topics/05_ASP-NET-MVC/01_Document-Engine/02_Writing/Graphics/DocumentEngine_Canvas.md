<!--
|metadata|
{
    "fileName": "documentengine-canvas",
    "controlName": "Infragistics Document Library",
    "tags": ["Reporting"]
}
|metadata|
-->

# キャンバス

Canvas 要素は多目的の描画サーフェイスです。Canvas 要素を使用すると、複数の異なる方法で操作する間に膨大な形状を描画できます。Canvas 要素は、その他のレイアウト要素で遭遇する [Background](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.ICanvas~Background.html)、[Borders](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.ICanvas~Borders.html)、および [Margins](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.ICanvas~Margins.html) などのいくつかの標準的なプロパティを公開しています。また、Canvas 要素は [IGraphics](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Graphics.IGraphics.html) インターフェイスを実装しており、ここでこの要素は視覚的プロセスを生成します。IGraphics インターフェイスは System.Drawing.Graphics オブジェクトに非常に似ています。

![](images/DocumentEngine_Canvas_01.png)

## 標準的なレイアウト 要素のプロパティ
Canvas 要素はキャンバス全体を配置する際に不可欠な標準的なレイアウト プロパティの固有のセットを公開しています。しかし実際に描画されるものに影響するプロパティがいくつかあり、 IGraphics を通して公開されます。IGraphics インターフェイスによって公開される 2 つの重要なプロパティは、[Pen](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Graphics.IGraphics~Pen.html) と [Brush](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Graphics.IGraphics~Brush.html) です（通常その要素自体によって公開される）。これらのプロパティはそれぞれ、IGraphics インターフェイスによって作成されるすべてのオブジェクトのストロークと塗りつぶしに影響します。もうひとつの理解すべき重要な概念は、すべての描画は線形で行われるこということです。つまり、形状を描画する間にペンとブラシを変更して、同じ寸法で同じ形状を異なった表現で描画することができます。

## IGraphics インターフェイス
IGraphics インターフェイスでは、レポートでのグラフィックスの実装のほとんどを行います。このインターフェイスを通して、ページの任意の場所にハイパーリンクを追加する、任意の形状を描画する、これらの形状を塗りつぶしたり、クリッピングする、さらには形状を拡大縮小、傾斜、変形することができます。

## ハイパーリンク
領域の境界四角形に左上隅の座標を指定し、次に四角形の高さと幅を指定することによって、ハイパーリンク領域を追加できます。以下のメソッドによって、キャンバスでハイパーリンクを操作することができます。

<table class="table table-striped">
	<thead>
		
	</thead>
	<tbody>
        <tr>
            <td valign="top">
                <ul>
                    <li>
[AddHyperlinkArea](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Graphics.IGraphics~AddHyperlinkArea.html)
					</li>

                    <li>
[StartHyperlink](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Graphics.IGraphics~StartHyperlink.html)
					</li>

                    <li>
[PauseHyperlink](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Graphics.IGraphics~PauseHyperlink.html)
					</li>
                </ul>
            </td>

            <td valign="top">
                <ul>
                    <li>
[ResumeHyperlink](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Graphics.IGraphics~ResumeHyperlink.html)
					</li>

                    <li>
[EndHyperlink](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Graphics.IGraphics~EndHyperlink.html)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

## 描画
それぞれの `Draw` メソッドを呼び出すことによって、以下の各々の形状/描画を作成できます（たとえば、`DrawRectangle` メソッドを呼び出して矩形を描画）。これらを作成するには、必要な Point オブジェクトを渡すだけで十分です。その他の描画プロパティ（ペンやブラシなど）は、Canvas 要素自体で設定され、すべての描画に影響します。

<table class="table table-striped">
	<tbody>
        <tr>
            <td valign="top">
                <ul>
                    <li>Arc</li>
                    <li>Bezier</li>
                    <li>Chord</li>
                    <li>Closed Curve</li>
                    <li>Curve</li>
                    <li>Ellipse</li>
                    <li>Image</li>
                </ul>
            </td>

            <td valign="top">
                <ul>
                    <li>Line</li>
                    <li>Pie</li>
                    <li>Polygon</li>
                    <li>Rectangle</li>
                    <li>Rounded Rectangle</li>
                    <li>Spacing</li>
                    <li>String</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

## 塗りつぶしとクリッピング
以下の形状のそれぞれで領域を塗りつぶすまたはクリッピングすることができます。Canvas は Brush プロパティを使用して形状を塗りつぶします。領域をクリッピングするために形状を使用する場合、クリッピングの形状の境界矩形内にあるクリッピングの形状の背後の形状の部分のみを見ることができます。形状のそれぞれの Clip メソッドまたは Fill メソッド（たとえば矩形のクリッピング領域を形成するには `ClipRectangle`、矩形を塗りつぶすには `FillRectangle`）を使用して、形状でそれぞれのアクションを実行します。

<table class="table table-striped">
	<thead>
		
	</thead>
	<tbody>
        <tr>
            <td valign="top">
                <ul>
                    <li>
Arc
					</li>

                    <li>
Bezier
					</li>

                    <li>
Chord
					</li>

                    <li>
Closed Curve
					</li>

                    <li>
Ellipse
					</li>
                </ul>
            </td>

            <td valign="top">
                <ul>
                    <li>
Pie
					</li>

                    <li>
Polygon
					</li>

                    <li>
Rectangle
					</li>

                    <li>
Rounded Rectangle
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

以下のコードは、Canvas 要素をセクションに追加し、次にいくつかのスタイルを使用していくつかの形状を描画します。

1.  **キャンバスをセクションに追加します。**

    **Visual Basic の場合:**

    ```vb
    Imports Infragistics.Documents.Reports.Report
    Imports Infragistics.Documents.Reports.Graphics
    .
    .
    .
    ' Add a canvas to the section.
    Dim canvas1 As Infragistics.Documents.Reports.Report.ICanvas = section1.AddCanvas()
    canvas1.Borders = New Borders(Pens.Black, 5)
    canvas1.Margins.Vertical = 5
    canvas1.Paddings.All = 5
    canvas1.Background = New Background(New SolidColorBrush(New Color(240, 240, 220)))
    ```

    **C# の場合:**

    ```csharp
    using Infragistics.Documents.Reports.Report;
    using Infragistics.Documents.Reports.Graphics;
    .
    .
    .
    // Add a canvas to the section.
    Infragistics.Documents.Reports.Report.ICanvas canvas1 = section1.AddCanvas();
    canvas1.Borders = new Borders(Pens.Black, 5);
    canvas1.Margins.Vertical = 5;
    canvas1.Paddings.All = 5;
    canvas1.Background = new Background(new SolidColorBrush(new Color(240, 240, 220)));
    ```

2.  **System.Drawing.Graphics オブジェクトを作成し、矩形を作成します。**

    **Visual Basic の場合:**

    ```vb
    ' Create a System Graphics object and use it
    ' to draw a rectangle
    canvas1.CreateGraphics().DrawRectangle( _
            System.Drawing.Pens.Green, _
            New System.Drawing.Rectangle(10, 10, 20, 20))
    ```

    **C# の場合:**

    ```csharp
    // Create a System Graphics object and use it
    // to draw a rectangle
    canvas1.CreateGraphics().DrawRectangle
    (
            System.Drawing.Pens.Green,
            new System.Drawing.Rectangle(10, 10, 20, 20)
    );
    ```

3.  **四角形を描画します。**

    **Visual Basic の場合:**

    ```vb
    ' Draw a Rectangle with a Hyperlink inside.
    canvas1.StartHyperlink(1, 0, 10)
    canvas1.Pen = New Pen(Colors.Red, 5)
    canvas1.Brush = New SolidColorBrush(New Color(255, 240, 240))
    canvas1.DrawRectangle(50, 50, 150, 100, PaintMode.FillStroke)
    canvas1.AddHyperlinkArea(50, 50, 150, 100)
    canvas1.EndHyperlink()

    ' Add text to the rectangle (more accurately, overtop the rectangle).
    canvas1.Font = New Font("Times New Roman", 18, FontStyle.Italic)
    canvas1.Brush = Brushes.BlueViolet
    canvas1.DrawString(70, 90, "Go to page 2")
    ```

    **C# の場合:**

    ```csharp
    // Draw a Rectangle with a Hyperlink inside.
    canvas1.StartHyperlink(1, 0, 10);
    canvas1.Pen = new Pen(Colors.Red, 5);
    canvas1.Brush = new SolidColorBrush(new Color(255, 240, 240));
    canvas1.DrawRectangle(50, 50, 150, 100, PaintMode.FillStroke);
    canvas1.AddHyperlinkArea(50, 50, 150, 100);
    canvas1.EndHyperlink();

    // Add text to the rectangle (more accurately, overtop the rectangle).
    canvas1.Font = new Font("Times New Roman", 18, FontStyle.Italic);
    canvas1.Brush = Brushes.BlueViolet;
    canvas1.DrawString(70, 90, "Go to page ¹2");
    ```

4.  **緑の斜めの線を描画します。**

    **Visual Basic の場合:**

    ```vb
    ' Draw a green line 5px thick. 
    canvas1.Pen = New Pen(Colors.Green, 5)
    canvas1.DrawLine(220, 50, 320, 150)
    ```

    **C# の場合:**

    ```csharp
    // Draw a green line 5px thick. 
    canvas1.Pen = new Pen(Colors.Green, 5);
    canvas1.DrawLine(220, 50, 320, 150);
    ```

5.  **楕円形を描画します。**

    **Visual Basic の場合:**

    ```vb
    ' Draw an ellipse and outline it with a blue, 5px line
    ' and fill it with a light blue color.
    canvas1.Pen = New Pen(Colors.Blue, 5)
    canvas1.Brush = New SolidColorBrush(New Color(240, 240, 255))
    canvas1.DrawEllipse(340, 50, 150, 100, PaintMode.FillStroke)
    ```

    **C# の場合:**

    ```csharp
    // Draw an ellipse and outline it with a blue, 5px line
    // and fill it with a light blue color.
    canvas1.Pen = new Pen(Colors.Blue, 5);
    canvas1.Brush = new SolidColorBrush(new Color(240, 240, 255));
    canvas1.DrawEllipse(340, 50, 150, 100, PaintMode.FillStroke);
    ```

6.  **Canvas のペンとブラシのスタイルを変更します。**

    **Visual Basic の場合:**

    ```vb
    ' Change the Canvas' pen and brush.
    canvas1.Pen = New Pen(Colors.DarkBlue, 5, DashStyle.DashDot)
    canvas1.Brush = New LinearGradientBrush(Colors.Yellow, Colors.Green, 45.0F)
    ```

    **C# の場合:**

    ```csharp
    // Change the Canvas' pen and brush.
    canvas1.Pen = new Pen(Colors.DarkBlue, 5, DashStyle.DashDot);
    canvas1.Brush = new LinearGradientBrush(Colors.Yellow, Colors.Green, 45F);
    ```

7.  **複合した形状を作成します。**

    **Visual Basic の場合:**

    ```vb
    ' Because both shapes are being created as one (using
    ' StartShape and EndShape), the intersection of the 
    ' two shapes is considered not a part of the shape 
    ' and not filled in. Also, the gradient will traverse
    ' the entire shape, not both individually.
    canvas1.StartShape(PaintMode.FillStroke)
    canvas1.FillRectangle(120, 200, 200, 200)
    canvas1.DrawEllipse(220, 250, 200, 200)
    canvas1.EndShape()
    ```

    **C# の場合:**

    ```csharp
    // Because both shapes are being created as one (using
    // StartShape and EndShape), the intersection of the 
    // two shapes is considered not to be a part of the shape 
    // and not filled in. Also, the gradient will traverse
    // the entire shape, not both individually.
    canvas1.StartShape(PaintMode.FillStroke);
    canvas1.FillRectangle(120, 200, 200, 200);
    canvas1.DrawEllipse(220, 250, 200, 200);
    canvas1.EndShape();
    ```

8.  **矩形をもうひとつ作成します。**

    **Visual Basic の場合:**

    ```vb
    ' Draw another rectangle with a different pen and brush.
    canvas1.Pen = New Pen(Colors.Red, 5, DashStyle.DashDotDot)
    canvas1.Brush = New HatchBrush(HatchStyle.Cross, Colors.Red, Colors.White)
    canvas1.DrawRectangle(50, 500, 150, 100, PaintMode.FillStroke)
    ```

    **C# の場合:**

    ```csharp
    // Draw another rectangle with a different pen and brush.
    canvas1.Pen = new Pen(Colors.Red, 5, DashStyle.DashDotDot);
    canvas1.Brush = new HatchBrush(HatchStyle.Cross, Colors.Red, Colors.White);
    canvas1.DrawRectangle(50, 500, 150, 100, PaintMode.FillStroke);
    ```

9.  **線をもう 1 本作成します。**

    **Visual Basic の場合:**

    ```vb
    ' Draw another line, this time with a different dash style.
    canvas1.Pen = New Pen(Colors.Green, 5, DashStyle.DashDot)
    canvas1.DrawLine(220, 500, 320, 600)
    ```

    **C# の場合:**

    ```csharp
    // Draw another line, this time with a different dash style.
    canvas1.Pen = new Pen(Colors.Green, 5, DashStyle.DashDot);
    canvas1.DrawLine(220, 500, 320, 600);
    ```

10. **楕円形をもうひとつ作成します。**

    **Visual Basic の場合:**

    ```vb
    ' Draw another ellipse with a different pen and brush.
    canvas1.Pen = New Pen(Colors.Blue, 5, DashStyle.Dash)
    canvas1.Brush = _
      New HatchBrush(HatchStyle.DiagonalBrick, Colors.Blue, Colors.White)
    canvas1.DrawEllipse(340, 500, 150, 100, PaintMode.FillStroke)
    ```

    **C# の場合:**

    ```csharp
    // Draw another ellipse with a different pen and brush.
    canvas1.Pen = new Pen(Colors.Blue, 5, DashStyle.Dash);
    canvas1.Brush = 
      new HatchBrush(HatchStyle.DiagonalBrick, Colors.Blue, Colors.White);
    canvas1.DrawEllipse(340, 500, 150, 100, PaintMode.FillStroke);
    ```

 

 

