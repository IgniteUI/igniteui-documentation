<!--
|metadata|
{
    "fileName": "excelengine-add-document-properties-to-a-workbook",
    "controlName": "Infragistics Excel Library",
    "tags": ["How Do I"]
}
|metadata|
-->

# ドキュメント プロパティをワークブックに追加



ワークブックの内容に関する情報を提供する各種のプロパティが、それぞれのワークブック ファイルに関連付けられています。それらのプロパティには、以下のような情報が含まれています。

-   作成者
-   タイトル
-   件名
-   キーワード
-   カテゴリ
-   状態
-   コメント

この情報には、Microsoft® Excel® インターフェイスおよびワークブック ファイルの Properties ダイアログ ボックスを介してアクセスできます。その [`DocumentProperties`](Infragistics.Web.Mvc.Documents.Excel~Infragistics.Documents.Excel.Workbook~DocumentProperties.html) プロパティを使って、シリアル化する前に、この情報をワークブック内で編集できます。

以下のコードは、ワークブックを作成し、 [`Title`](Infragistics.Web.Mvc.Documents.Excel~Infragistics.Documents.Excel.DocumentProperties~Title.html) および [`Status`](Infragistics.Web.Mvc.Documents.Excel~Infragistics.Documents.Excel.DocumentProperties~Status.html) ドキュメント プロパティを設定する方法を示します。

**Visual Basic の場合:**

```
Dim workbook As New Infragistics.Documents.Excel.Workbook()
workbook.DocumentProperties.Title = "Expense Report"
workbook.DocumentProperties.Status = "Complete"
```

**C# の場合:**

```
Infragistics.Documents.Excel.Workbook workbook = new Infragistics.Documents.Excel.Workbook();
workbook.DocumentProperties.Title = "Expense Report";
workbook.DocumentProperties.Status = "Complete";
```



 

 


