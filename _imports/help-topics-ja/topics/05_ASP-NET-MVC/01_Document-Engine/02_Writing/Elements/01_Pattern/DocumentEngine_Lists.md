<!--
|metadata|
{
    "fileName": "documentengine-lists",
    "controlName": "Infragistics Document Library",
    "tags": ["Layouts","Reporting"]
}
|metadata|
-->

# リスト

List 要素は、項目のグループを番号の付いた形式または黒丸の付いた形式のいずれかで提示する時に非常に役に立ちます。リストは、レポートのフローにしたがって、必要に応じてシンプルに、または複雑になる可能性があります。リストはテキスト項目で構成されるシンプルなリストになる場合もあれば、Bands から Images、さらに Quick Text までの個別のレイアウト要素で構成される複雑な配列になる場合もあります。

List 要素の興味深い特徴は、パターンをリストに適用する機能です。これでこれらのパターンはスタイルの変更をリストに適用します。いくつかのパターンを単一のリストに適用することができます。パターンを適用した後で特定のスタイル プロパティを設定することによって、パターンをオーバーライドすることもできます。

ほとんどのレイアウト 要素から AddList メソッドを呼び出すことによってリストを作成できます。いったん List を作成したら、IList インターフェイスから AddItem メソッドを呼び出すことによって、項目をリストに追加できます。これで、別の List 要素を含み、それぞれの Add メソッドによって、ほとんどのレイアウト項目をそれぞれ個々のリストに追加できます。

以下のコードは 4 つの手順に分けられます。第 1 の手順は、リストの特定のスタイルを変更する 2 つのリスト パターンを作成します。第 2 の手順は、リストを作成し、第 1 のパターンを適用します。第 3 の手順は、リストをもうひとつ作成し、第 2 のパターンを適用します。最後の手順は、リスト パターンによってすでに設定されているスタイル プロパティを設定することによって、パターンをオーバーライドする方法を示します。以下のようなコードでレポートをパブリッシュすると、上記のスクリーンショットのようなページが表示されます。

![](images/DocumentEngine_Lists_01.png)

1.  **2 つのリスト パターンを作成します。**

    **C# の場合:**

    ```csharp
    using Infragistics.Documents.Reports.Report;
    .
    .
    .
    // Create a list pattern. A list pattern is basically a style
    // that you want to apply to a specific list.
    Infragistics.Documents.Reports.Report.List.ListPattern listPattern1 = new ListPattern();
    listPattern1.Background = new Background(Brushes.LightSteelBlue);
    listPattern1.Bullets = 
      new Infragistics.Documents.Reports.Report.List.Bullets(BulletType.WhiteCircle);
    listPattern1.Borders = new Borders(new Pen(new Color(0, 0, 0)));
    listPattern1.Paddings = new Paddings(5);

    // Create a second list pattern.
    Infragistics.Documents.Reports.Report.List.ListPattern listPattern2 = new ListPattern();
    listPattern2.Background = new Background(Brushes.LightSlateGray);
    listPattern2.Bullets = 
      new Infragistics.Documents.Reports.Report.List.Bullets(BulletType.BlackCircle);
    listPattern2.Borders = new Borders(new Pen(new Color(0, 0, 0)));
    listPattern2.Paddings = new Paddings(5);
    listPattern2.Interval = 10;
    ```

2.  **リストを作成して、最初のパターンを適用します。**

    **C# の場合:**

    ```csharp
    // Create a list and apply the first pattern to it.
    Infragistics.Documents.Reports.Report.List.IList sectionList1 = section1.AddList();
    sectionList1.ApplyPattern(listPattern1);

    // Create a list item.
    Infragistics.Documents.Reports.Report.List.IListItem sectionListItem1;

    // For each name in the BulletType enum, add a new list item.
    foreach (string s in Enum.GetNames(typeof(BulletType)))
    {
            sectionListItem1 = sectionList1.AddItem();
            sectionListItem1.AddQuickText(s);
    }
    ```

3.  **リストをもうひとつ作成して、2 番目のパターンを適用します。**

    **C# の場合:**

    ```csharp
    Infragistics.Documents.Reports.Report.List.IList sectionList2 = section1.AddList();
    listPattern2.Apply(sectionList2);

    Infragistics.Documents.Reports.Report.List.IListItem sectionListItem2;

    foreach (string s in Enum.GetNames(typeof(Alignment)))
    {
            sectionListItem2 = sectionList2.AddItem();
            sectionListItem2.AddQuickText(s);
    }
    ```

4.  **3 番目のリストを作成して、最初のパターンをそのリストに適用します。**

    いったんパターンを適用したら、**Bullets** プロパティを新しい Bullets オブジェクトに設定します。これによってパターンの設定がオーバーライドされます。パターンはスタイル プロパティ変更のコレクションにすぎません。したがって個々のプロパティを変更した後で再度パターンを適用する場合には、パターンは個々のスタイル変更をオーバーライドすることができます。

    **C# の場合:**

    ```csharp
    Infragistics.Documents.Reports.Report.List.IList sectionList3 = section1.AddList();
    listPattern1.Apply(sectionList3);
    // Override the Pattern's style for the Bullet property.
    sectionList3.Bullets = 
      new Infragistics.Documents.Reports.Report.List.Bullets(BulletType.BlackCircle);

    Infragistics.Documents.Reports.Report.List.IListItem sectionListItem3;

    foreach (string s in Enum.GetNames(typeof(BrushType)))
    {
            sectionListItem3 = sectionList3.AddItem();
            sectionListItem3.AddQuickText(s);
    }
    ```
