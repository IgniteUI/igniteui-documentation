<!--
|metadata|
{
    "fileName": "iglistview-known-issues",
    "controlName": "igListView",
    "tags": ["Known Issues"]
}
|metadata|
-->

# 既知の問題と制限 (igListView)

## トピックの概要

### 目的

このトピックは、`igListView`™ コントロールに関する既知の問題点について説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要なトピックを示しています。

- [既知の問題](Known-Issues-Revision-History.html): すべての Ignite UI コントロールの既知の問題と制限に関する参考情報を提供します。


## 既知の問題と制限

次の表は、Ignite UI %%ProductVersionShort%% リリースの `igListView`™ に対する既知の問題と制限を簡単に説明しています。いくつかの問題については、この概要表の後に、既知の問題点に関する詳しい説明と、考えられる回避策を示します。

### 凡例:
<table class="table">
	<tbody>
        <tr>
            <td>
![](images/positive.png)
			</td>
            <td>
回避策
			</td>
        </tr>
        <tr>
            <td>
![](images/negative.png)
			</td>
            <td>
既知の回避策はありません
			</td>
        </tr>
        <tr>
            <td>
![](images/plannedFix.png)
            </td>
            <td>
修正予定です
			</td>
        </tr>
    </tbody>
</table>


機能|説明|解決済み
---|---|---
igListView は、`$.mobile.ajaxEnabled = false` の場合には期待通りの動作をしません|jQueryMobile が `$.mobile.ajaxEnabled = false` であるように設定されている場合、子ページはページ ロード内で作成されないため、リスト ビューは期待通りの動きをしません。 | ![](images/negative.png)
Netflix oData は Android 4 装置では動作しない可能性があります|要求が Android 4 ブラウザによってなされたものである場合、Netflix oData サービスで問題が生じます。 | ![](images/negative.png)
プリセット付の全フィールド フィルタリングは oData では動作しない可能性があります|それは、oData はブール ロジック (AND or OR) で動作するからです。その場合、プリセットにおいては AND ロジックに、**全フィールド** では OR となります。 | ![](images/negative.png)
[非文字列フィールドをもつ全フィールド フィルタリングは  Linq  クエリでは動作しません](#linq)|エントリへの Linq は `ToString()` メソッドをサポートしません。 | ![](images/positive.png)
[区分線はページ サイズで考慮されます](#dividers)|それにより、並べ替えやフィルタリング、オン デマンド ロードが期待通りの動きをしなくなる可能性があります。たとえば、ページサイズが 5 の中に 4 項目が表示される場合があります。これはデザイン上の問題で、特に対応されません。 | ![](images/positive.png)




### <a id="linq"></a> 非文字列フィールドをもつ全フィールド フィルタリングは  Linq  クエリ回避策では動作しません

エントリへの Linq は `ToString()` メソッドをサポートしません。

以下はコード例です。

**C# の場合:**

```csharp
private ActionResult FilterData()
{
    IQueryable<Person> queryable = this.GetDataFromLinqToEntities();
    return View(queryable);
}
```

上記は次のように書かなければなりません。

**C# の場合:**

```csharp
private ActionResult FilterData()
{
    IQueryable<Person> queryable = this.GetDataFromLinqToEntities();
    return View(queryable.ToArray().AsQueryable());
}
```

### <a id="dividers"></a> 区分線はページ サイズの回避策とは考慮されません

クライアント サイドのイベントを取り扱うことができ、手動でより多くのデータをロードできます。




## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック


このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [アクセシビリティ準拠 (igListView)](igListView-Accessibility-Compliance.html): このトピックでは、`igListView`™ のアクセシビリティ機能について説明し、`igListView` を含むページのアクセシビリティ準拠を達成する方法に関する情報を提供します。

- [アクセシビリティ準拠](Accessibility-Compliance.html): すべての Ignite UI コントロールのアクセシビリティ準拠のための参照情報を提供します。





 

 


