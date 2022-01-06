<!--
|metadata|
{
    "fileName": "documentengine-add-page-numbering",
    "controlName": "Infragistics Document Library",
    "tags": ["Paging","Reporting"]
}
|metadata|
-->

# ページ番号の追加

読む人がレポートをナビゲートする際に役に立つ優れたレポート 要素はページ番号です。目次とともに使用すると、読む人は目次にすばやく目を通して、読みたい機能がどのページにあるのかを判断することができるようになります。読む人にページ番号が与えられていたら、そのページをめくる（または Adobe Acrobat Reader のビューアの下部にページ番号を入力する）のは簡単な作業です。

ドキュメント オブジェクト モデルの Section 要素にページ番号を追加するためのメカニズムを説明します。Section 要素の詳細は、[`「Section」`](DocumentEngine-Section.html)のトピックを参照してください。ページ番号をレポートに追加するために必要とされる設定すべてを保持する、[`ISection`](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Section.PageNumbering.html) オブジェクトの [`PageNumbering`](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Section.ISection~PageNumbering.html) プロパティで使用可能な [`PageNumbering`](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Section.ISection.html) オブジェクトがあります。

以下のコードはレポートの右下隅にページ番号を追加します。コメントは各プロパティをより詳細に説明しているので、コメントに特に注意してください。

![](images/DocumentEngine_Add_Page_Numbering_01.png)

**Visual Basic の場合:**

```vb
' Get a reference to the section's PageNumbering object.
Dim pn As Infragistics.Documents.Reports.Report.Section.PageNumbering = _  section1.PageNumbering

' Create a style for the page numbering font.
pn.Style = New Infragistics.Documents.Reports.Report.Text.Style(Fonts.Arial, Brushes.Black)

' The Template property is the actual string that
' shows the page numbering. Use the [Page #] place-
' holder for the current page and the [TotalPages]
' place-holder for the total amount of pages in
' the entire document.
pn.Template = "Page [Page #] of [TotalPages]"

' Setting SkipFirst to true does not place page
' numbering on the first page of the section. This
' is useful if the first page is a Title page.
pn.SkipFirst = False

' The page numbering will be aligned with the
' right side of the page. Valid values off the
' Alignment enum include Left, Center, and Right.
pn.Alignment.Horizontal = Infragistics.Documents.Reports.Report.Alignment.Right

' The page numbering will be located at the 
' bottom of the page. Valid values off the
' Alignment enum include Top and Bottom.
pn.Alignment.Vertical = Infragistics.Documents.Reports.Report.Alignment.Bottom

' The page numbering is at the extreme bottom
' of the page, so we need to change the Y Offset
' in order to bring it in line with the rest of
' the page footer text.
pn.OffsetY = -18
```

**C# の場合:**

```csharp
// Get a reference to the section's PageNumbering object.
Infragistics.Documents.Reports.Report.Section.PageNumbering pn = _  section1.PageNumbering;

// Create a style for the page numbering font.
pn.Style = new Infragistics.Documents.Reports.Report.Text.Style(Fonts.Arial, Brushes.Black);
 
// The Template property is the actual string that
// shows the page numbering. Use the [Page #] place-
// holder for the current page and the [TotalPages]
// place-holder for the total amount of pages in
// the entire document.
pn.Template = "Page [Page #] of [TotalPages]";
                        
// Setting SkipFirst to true does not place page
// numbering on the first page of the section. This
// is useful if the first page is a Title page.
pn.SkipFirst = false;

// The page numbering will be aligned with the
// right side of the page. Valid values off the
// Alignment enum include Left, Center, and Right.
pn.Alignment.Horizontal = Infragistics.Documents.Reports.Report.Alignment.Right;

// The page numbering will be located at the 
// bottom of the page. Valid values off the
// Alignment enum include Top and Bottom.
pn.Alignment.Vertical = Infragistics.Documents.Reports.Report.Alignment.Bottom;
 
// The page numbering is at the extreme bottom
// of the page, so we need to change the Y Offset
// in order to bring it in line with the rest of
// the page footer text.
pn.OffsetY = -18; 
```

 

 


