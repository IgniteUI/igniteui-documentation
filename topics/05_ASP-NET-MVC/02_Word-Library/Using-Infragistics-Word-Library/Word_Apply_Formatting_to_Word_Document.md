<!--
|metadata|
{
    "fileName": "word-apply-formatting-to-word-document",
    "controlName": "Infragistics Word Library",
    "tags": ["Formatting","How Do I"]
}
|metadata|
-->

# 書式設定を Word 文書に適用

このトピックは、Infragistics® Word ライブラリを使用して Word 文書を書式設定する方法を示します。以下のコードは、forward-only の [WordDocumentWriter](Infragistics.Web.Documents.IO~Infragistics.Documents.Word.WordDocumentWriter.html) オブジェクトを使用します。このトピックで検討されるさまざまな書式設定機能は、サイズ、方向などのフォント、段落書式およびページ属性です。

**注:** Infragistics.Web.Documents.IO アセンブリへの参照が必要とされます。

## フォントの指定
[Font](Infragistics.Web.Documents.IO~Infragistics.Documents.Word.Font.html) クラスは、文字のビジュアル属性または文字の範囲をカスタマイズする方法を提供します。

**C# の場合:**

```csharp
using Infragistics.Documents.Word;

//  Create a font, which can be reused in content creation
Infragistics.Documents.Word.Font font = docWriter.CreateFont();
font.Bold = true;
font.Size = .23f;
font.Underline = Underline.Double;
font.UnderlineColor = Color.Blue;
font.Effects.Capitalization = Capitalization.CapsOn;
```

## 段落プロパティ
[ParagraphProperties](Infragistics.Web.Documents.IO~Infragistics.Documents.Word.ParagraphProperties.html) クラスは段落の書式設定を制御する方法を提供します。

**C# の場合:**

```csharp
using Infragistics.Documents.Word;

// Paragraph Properties
// Create a new instance of the WordDocumentWriter class using the
// static 'Create' method.
WordDocumentWriter docWriter = WordDocumentWriter.Create(@"C:TestWordDoc.docx");
ParagraphProperties paraformat = docWriter.CreateParagraphProperties();
paraformat.Alignment = ParagraphAlignment.Right;
```

## セクション プロパティ
[SectionProperties](Infragistics.Web.Documents.IO~Infragistics.Documents.Word.SectionProperties.html) クラスは、サイズ、余白、方向などのページ属性を制御する方法を提供します。SectionProperties インスタンスを渡す DefineSection メソッドは、EndParagraph メソッドの後で呼び出さなければなりません。

**C# の場合:**

```csharp
using Infragistics.Documents.Word;

//  Create a new instance of the WordDocumentWriter class using the
//  static 'Create' method.
WordDocumentWriter docWriter = WordDocumentWriter.Create(@"C:TestWordDoc.docx");
//  Use inches as the unit of measure
docWriter.Unit = UnitOfMeasurement.Inch;
SectionProperties secProperties = docWriter.CreateSectionProperties();
secProperties.PageSize = new SizeF(7, 5);
secProperties.PageOrientation = PageOrientation.Landscape;
// Applies the section properties(PageSize and Orientation) for the above added paragraphs
docWriter.DefineSection(secProperties);    
```
以下は上記の書式設定すべてを含む完全なコードです。

**C# の場合:**

```csharp
using Infragistics.Documents.Word;

// Create a new instance of the WordDocumentWriter class using the
// static 'Create' method.
//  This instance must be closed once content is written into Word.
WordDocumentWriter docWriter = WordDocumentWriter.Create(@"C:TestWordDoc.docx");
//  Use inches as the unit of measure
docWriter.Unit = UnitOfMeasurement.Inch;

//  Create a font, which we can use in content creation
Infragistics.Documents.Word.Font font = docWriter.CreateFont();
//Start the document...note that each call to StartDocument must
//be balanced with a corresponding call to EndDocument.
docWriter.StartDocument();
//Start a paragraph
docWriter.StartParagraph();
//  Add a text run for the title, bolded and a little bigger
font.Bold = true;
font.Size = .23f;
font.Underline = Underline.Double;
font.UnderlineColor = Color.Blue;
font.Effects.Capitalization = Capitalization.CapsOn;
docWriter.AddTextRun("Paragraphs and Topic Sentences", font);
//End the paragraph
docWriter.EndParagraph();

// Paragraph Properties
ParagraphProperties paraformat = docWriter.CreateParagraphProperties();
paraformat.Alignment = ParagraphAlignment.Right;

// Start another Paragraph
// and apply the ParagraphProperties Object
docWriter.StartParagraph(paraformat);
docWriter.AddNewLine();
// Reset font, and apply different font settings for this paragraph.
font.Reset();
font.Italic = true;
font.ForeColor = Color.Blue;
font.Effects.TextEffect = FontTextEffect.EngravingOn;
docWriter.AddTextRun("A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs. This is because paragraphs show a reader where the subdivisions of an essay begin and end, and thus help the reader see the organization of the essay and grasp its main points.", font);
// End the paragraph
docWriter.EndParagraph();
//Add an Empty paragraph
docWriter.AddEmptyParagraph();
docWriter.StartParagraph();
font.Reset();
font.ForeColor = Color.Red;
docWriter.AddTextRun("This page is defined by the SectionProperties object. The size of the page is set to 7x5 inches and the Orientation is set to Landscape.", font);
docWriter.EndParagraph();

// Set page attributes
SectionProperties secProperties = docWriter.CreateSectionProperties();
secProperties.PageSize = new SizeF(7, 5);
secProperties.PageOrientation = PageOrientation.Landscape;
// Applies the section properties(PageSize and Orientation) for the above added paragraphs
docWriter.DefineSection(secProperties);

// End the Document
docWriter.EndDocument();
// Close the writer
docWriter.Close();
```

## 関連トピック
-   [Word 文書の作成](Word-Create-a-Word-Document.html)
-   [テーブルを Word 文書に追加](Word-Add-Table-to-Word-Document.html)
-   [画像を Word 文書に追加](Word-Add-Images-to-Word-Document.html)
-   [ヘッダー、フッター、ページ番号](Word-Headers-Footers-and-Page-Numbers.html)
-   [Infragistics Word ライブラリの理解](Word-Understanding-Infragistics-Word-Library.html)

 

 


