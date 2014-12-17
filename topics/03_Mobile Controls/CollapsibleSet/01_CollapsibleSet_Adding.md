<!--
|metadata|
{
    "fileName": "collapsibleset-adding",
    "controlName": "CollapsibleSet",
    "tags": ["Layouts","MVC"]
}
|metadata|
-->

# CollapsibleSet の追加


## トピックの概要

### 目的

このトピックでは、Infragistics® MVC ラッパーを使用して `CollapsibleSet`™ ウィジェットを有効にする方法をコード例を用いて説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [CollapsibleSet の概要](CollapsibleSet-Overview.html): このトピックでは、`CollapsibleSet` ウィジェットとその機能の概要について説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**CollapsibleSet の追加**](#adding)
    -   [プレビュー](#preview)
    -   [前提条件](#prerequisites)
    -   [概要](#overview)
    -   [手順](#steps)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="adding"></a> CollapsibleSet の追加

この手順では、MVC ラッパーを使用して、MVC ソリューション内の View ページに `CollapsibleSet` ウィジェットを追加する方法を説明します。Infragistics モバイル Loader への参照に加え、*Infragistics.Web.Mvc.Mobile.dll* への参照を追加する必要があります。

手順を説明するサンプル コードは `CollapsibleSet` を構成して、2 つの collapsible コントロールを含むようにしています。コントロールには、「First Collapsible」 と 「Second `Collapsible`」 というヘッダー、および 「This is the first `Collapsible`’s content」 と 「This is the second `Collapsible`’s content」 という collapsible テキストが含まれます。

### <a id="preview"></a> プレビュー 

以下のスクリーンショットは、手順の実行結果としてページに追加された Collapsible Set ウィジェットを示しています。

![](images/CollapsibleSet_Adding_CE_1.png)

### <a id="prerequisites"></a> 前提条件 

この手順を実行するには、以下のリソースが必要です。

-   MVC モバイル アプリケーション
-   *Infragistics.Web.Mvc.Mobile.dll* への参照
-   Infragistics モバイル Loader への参照
-   MVC reassurance ラッパーに必要なリソースへの参照

以下のサンプルコードでは、すべての JavaScript および CSS ファイルが *ig_mobileui* という名前の仮想ディレクトリの下に置かれています。この手順を完了するには、マシン上の正しい JavaScript および CSS の保管場所に従ってこのフォルダーの名前を変更する必要があります。

**Razor の場合:**

```
@using Infragistics.Web.Mvc.Mobile
<script src="http://code.jquery.com/jquery.min.js"></script>
<script src="http://code.jquery.com/mobile/1.1.1/jquery.mobile.min.js"></script>
<script type="text/javascript" src="http://localhost/ig_mobileui/js/infragistics.mobile.loader.js"></script>
@(Html.InfragisticsMobile().
    Loader().
    ScriptPath("http://localhost/ig_mobileui/js/").
    CssPath("http://localhost/ig_mobileui/css/").
    Render())
```

### <a id="overview"></a> 概要 

以下はプロセスの概念的概要です。

​1. `CollapsibleSet` を  View ページに追加

​2. (オプション) 結果の検証

### <a id="steps"></a> 手順

以下の手順は、`CollapsibleSet` の追加手順を示しています。

1. `CollapsibleSet` をビュー ページに追加します。

	`CollapsibleSet` ウィジェットのインスタンスを、その構成設定と共に追加します。
	
	この例では、`CollapsibleSet` は、「First Collapsible」 と「Second Collapsible」というヘッダー テキストが付いた 2 つの collapsible コントロール、および「This is the first Collapsible’s content」と「This is the second `Collapsible`’s content」という collapsible コンテンツと共に構成されています。
	
	**Razor の場合:**
	
	```
	@(
	 Html.InfragisticsMobile()
	    .CollapsibleSet()
	    .BeginRender()
	)
	@(
	    Html.InfragisticsMobile()
	    .Collapsible()
	    .HeaderText("First Collapsible")
	    .BeginRender()
	)
	    This is the first Collapsible’s content
	@(
	    Html.InfragisticsMobile()
	    .Collapsible()
	    .EndRender()
	)
	@(
	    Html.InfragisticsMobile()
	    .Collapsible()
	    .HeaderText("Second Collapsible")
	    .BeginRender()
	)
	    This is the second Collapsible’s content
	@(
	    Html.InfragisticsMobile()
	    .Collapsible()
	    .EndRender()
	)
	@(
	    Html.InfragisticsMobile()
	    .CollapsibleSet()
	    .EndRender()
	)
	```

2. (オプション) 結果を確認します。

	結果を検証するには、View を保存してから、アプリケーションを再ビルドおよび実行します。





## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*CollapsibleSet* の構成](CollapsibleSet-Configuring.html): このトピックでは、`CollapsibleSet` ウィジェットの構成方法を説明します。

- [CollapsibleSet プロパティ リファレンス](CollapsibleSet-Property-Reference.html): このトピックでは、`CollapsibleSet` ウィジェットに関する参照情報について説明します。



### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-collapsible-set/basic-usage): このサンプルでは、食品の注文フォームとして `CollapsibleSet` ASP.NET MVC ヘルパーを使用する方法を紹介します。すべての Collapsible コントロールが縮小可能なセットにグループ化されます。縮小可能なセットは一度に 1 つのみ展開されます。縮小可能なセットを展開すると、前に展開されたセットが縮小化されます。




 

 


