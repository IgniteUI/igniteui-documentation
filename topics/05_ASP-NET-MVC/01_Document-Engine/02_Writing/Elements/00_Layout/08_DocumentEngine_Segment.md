<!--
|metadata|
{
    "fileName": "documentengine-segment",
    "controlName": "Infragistics Document Library",
    "tags": ["Layouts","Reporting"]
}
|metadata|
-->

# セグメント



Segment 要素は、この要素が作成できるコンテンツのいくつかの完全なセグメント (またはページ) に由来して適切に命名されています。Section 要素と同じように、Segment 要素は個々のページごとに異なるヘッダー/フッターを持つことができます (ページ数がヘッダー/フッターの数を超えない場合に限ります。詳細は以下の「セグメント ヘッダーおよびフッター」のセクションを参照してください)。しかし、Section 要素と異なり、Segment のサイズを設定できません。Segment は含んでいる Section 要素のサイズに依存しています。Segment 要素と Section 要素は両方とも個々のページ上でコンテンツを引き伸ばすための [AddStretcher](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Segment.ISegment~AddStretcher.html) メソッドがあります。ただし、Segment 要素には、全ページですべてのコンテンツを引き伸ばすための [Stretch](Infragistics.Web.Documents.Reports~Infragistics.Documents.Reports.Report.Segment.ISegment~Stretch.html) プロパティもあります。

Segment 要素は Section、Band、Group の各要素に機能が非常に似ています。これらの 4 つの要素間の主な違いは、以下の表を参照してください。

機能|セグメント|セクション|バンド|グループ
---- | --- | --- |--- | --- |
ヘッダー、フッター、区分線|区分線はありません。ヘッダーおよびフッターの繰り返し可能なコレクション。|区分線はありません。個々のページごとに個別のヘッダーおよびフッターを追加できます。|Band 全体に対して １ セットのヘッダー、フッター、およびデバイダ。|なし
高さと幅|設定できません。|設定できます。|設定できます。|設定できます。
コンテンツの引き伸ばし|要素全体だけでなく、個々のページそれぞれを引き伸ばすことができます。|個々のページそれぞれを引き伸ばすことができます。|要素全体だけでなく、個々のページそれぞれを引き伸ばすことができます。|個々のページそれぞれを引き伸ばすことができます。

## セグメントのヘッダーとフッター
Segment 要素の最も優れた機能は、ヘッダーとフッターを使用する方法です。必要に応じた数だけヘッダーとフッターをセグメントに追加できます。ヘッダーとフッターのコレクションは、追加する順番に基づいて、特定の順番で使用されます。セグメントの各ページには個別のヘッダーとフッターが付きます（複数のヘッダーとフッターをセグメントに追加する場合）。たとえば、2 つの Header 要素をセグメントに追加して、次に 2 つの Footer 要素を追加する場合、最初のページには最初のヘッダー/フッターを含み、2 番目のページには 2 番目のヘッダー/フッターを含みます。ところが 3 番目のページには最初のヘッダー/フッターが含まれ、4 番目のページには 2 番目のヘッダー/フッターが含まれます。セグメントに含まれるページ数だけこのパターンが続きます。以下の画像はこの概念を示しています。

![](images/DocumentEngine_Segment_01.png)

------

以下の例のコードは、2 つの異なる Header および Footer 要素を使用して Segment 要素を定義します。ページ区切りが 2 つあるため、3 つの個別のページができます。3 番目のページでは、最初のヘッダー/フッターが使用されます。ページ数が Header および Footer 要素の数を超えた場合にヘッダー/フッター コレクションがループして先頭に戻るからです。

1.  **セグメントを定義します。**

	**C# の場合:**

	```csharp
	using Infragistics.Documents.Reports.Report;
	.
	.
	.
	// Add a Segment to the Section.
	Infragistics.Documents.Reports.Report.Segment.ISegment segment =   section1.AddSegment();
	segment.Background = new Background(Brushes.WhiteSmoke);
	segment.Stretch = true;
	```

2.  **2 つのセグメント ヘッダーを定義します。**

	**C# の場合:**

	```csharp
	// Add the first Header to the Segment.
	Infragistics.Documents.Reports.Report.Segment.ISegmentHeader segmentHeader1 =   segment.AddHeader();
	segmentHeader1.Background = new Background(Brushes.LightBlue);
	segmentHeader1.Height = new FixedHeight(40);
	segmentHeader1.Paddings = new Paddings(10);

	Infragistics.Documents.Reports.Report.Text.IText segmentHeaderText =   segmentHeader1.AddText();
	segmentHeaderText.Style = mainStyle1;

	segmentHeaderText.AddContent("Header 1, Page #");
	segmentHeaderText.AddPageNumber(PageNumberFormat.Decimal);

	// Add the second Header to the Segment.
	Infragistics.Documents.Reports.Report.Segment.ISegmentHeader segmentHeader2 =   segment.AddHeader();
	segmentHeader2.Background = new Background(Brushes.LightGreen);
	segmentHeader2.Height = new FixedHeight(40);
	segmentHeader2.Paddings = new Paddings(10);

	segmentHeaderText = segmentHeader2.AddText();
	segmentHeaderText.Style = mainStyle1;
	segmentHeaderText.AddContent("Header 2, Page #");
	segmentHeaderText.AddPageNumber(PageNumberFormat.Decimal);
	```

3.  **2 つのセグメント フッターを定義します。**

	**C# の場合:**

	```csharp
	// Add the first Footer to the Segment.
	Infragistics.Documents.Reports.Report.Segment.ISegmentFooter segmentFooter1 =   segment.AddFooter();
	segmentFooter1.Background = new Background(Brushes.LightBlue);
	segmentFooter1.Height = new FixedHeight(40);
	segmentFooter1.Paddings = new Paddings(10);

	Infragistics.Documents.Reports.Report.Text.IText segmentFooterText =   segmentFooter1.AddText();
	segmentFooterText.Style = mainStyle1;

	segmentFooterText.AddContent("Footer 1, Page #");
	segmentFooterText.AddPageNumber(PageNumberFormat.Decimal);

	// Add the second Footer to the Segment.
	Infragistics.Documents.Reports.Report.Segment.ISegmentFooter segmentFooter2 =   segment.AddFooter();
	segmentFooter2.Background = new Background(Brushes.LightGreen);
	segmentFooter2.Height = new FixedHeight(40);
	segmentFooter2.Paddings = new Paddings(10);

	segmentFooterText = segmentFooter2.AddText();
	segmentFooterText.Style = mainStyle1;

	segmentFooterText.AddContent("Footer 2, Page #");
	segmentFooterText.AddPageNumber(PageNumberFormat.Decimal);
	```

4.  **最初のページにテキストを追加して、次ページとのページ区切りを追加します。**

	以下のテキストを使用して、`string1` 変数を設定します。

	> Lorem ipsum dolor sit amet, consectetuer adipiscing elit.Donec imperdiet mattis sem.Nunc ornare elit at justo.In quam nulla, lobortis non, commodo eu, eleifend in, elit.Nulla eleifend.Nulla convallis.Sed eleifend auctor purus.Donec velit diam, congue quis, eleifend et, pretium id, tortor.Nulla semper condimentum justo.Etiam interdum odio ut ligula.Vivamus egestas scelerisque est. Donec accumsan.In est urna, vehicula non, nonummy sed, malesuada nec, purus.Vestibulum erat.Vivamus lacus enim, rhoncus nec, ornare sed, scelerisque varius, felis.Nam eu libero vel massa lobortis accumsan.Vivamus id orci.Sed sed lacus sit amet nibh pretium sollicitudin.Morbi urna.

	**C# の場合:**

	```csharp
	// Add text to the Segment. The first page of the
	// Segment will use the first Header and Footer.
	Infragistics.Documents.Reports.Report.Text.IText segmentText1 = segment.AddText();
	string string1 = "Lorem ipsum...";
	segmentText1.AddContent(string1);
	segmentText1.Paddings.All = 5;

	// Break to the next page.
	segment.AddPageBreak();
	```

5.  **テキストを 2 番目のページに追加して、次ページとのページ区切りを追加します。**

	**C# の場合:**

	```csharp
	// Add more text to the Segment. The second page of
	// the Segment will use the second Header and Footer.
	segmentText1 = segment.AddText();
	segmentText1.AddContent(string2);
	segmentText1.Paddings.All = 5;

	// Break to the third page.
	segment.AddPageBreak();
	```

6.  **テキストを 3 ページ目に追加します。**

	**C# の場合:**

	```csharp
	// Add more text to the Segment. The third page of
	// the Segment will use the first Header and Footer.
	segmentText1 = segment.AddText();
	segmentText1.AddContent(string1);
	segmentText1.Paddings.All = 5;
	```
