<!--
|metadata|
{
    "fileName": "selectmenu-adding",
    "controlName": "SelectMenu",
    "tags": ["Editing","How Do I","MVC","Selection"]
}
|metadata|
-->

# SelectMenu の追加

## トピックの概要
### 目的

このトピックでは、コード例と共に、Infragistics® ASP.NET MVC ヘルパーを使用して jQuery Mobile `selectmenu` ウィジェットを ASP.NET MVC ビューに追加する方法を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [SelectMenu の概要](SelectMenu-Overview.html): このトピックでは、`SelectMenu` ASP.NET MVC ヘルパーとその機能の概要を説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**SelectMenu の追加**](#adding-menu)
-   [**関連コンテンツ**](#related-content)



## <a id="adding-menu"></a>SelectMenu の追加
### 概要

この手順は、ASP.NET MVC ヘルパーを使用して、ASP.NET MVC ソリューションのビューに `selectmenu` ウィジェットを追加する方法を示します。Infragistics モバイル Loader への参照に加え、`Infragistics.Web.Mvc.Mobile.dll` への参照を追加する必要があります。

サンプル コードは、3 つのメニュー項目（「Apples」、「Oranges」、「Bananas」） および Products を表示する上揃えのラベルと共に、`SelectMenu` を初期化する方法を示しています。

### プレビュー

以下のスクリーンショットは、手順を実行した結果として、ページに追加された `SelectMenu` ウィジェットを示しています。

![](images/SelectMenu_Adding_1.png)

### 前提条件

この手順を実行するには、以下のリソースが必要です。

-   ASP.NET MVC モバイル アプリケーションのインストール
-   ASP.NET MVC ヘルパーに必要なリソースへの参照

### 概要

以下はプロセスの概念的概要です。

1. リソースを  View ページに追加
2. `SelectMenu` を View ページに追加
3. 結果の検証

### 手順

以下の手順は、ASP.NET MVC ヘルパーを使用して `SelectMenu` をインスタンス化する方法を示します。

1. リソースをビューに追加します。

	以下のサンプル コードでは、すべての JavaScript および CSS ファイルが、ig_mobileui という名前の仮想ディレクトリの下に置かれています。この手順を完了するためには、このフォルダーは、アプリケーションの正しい JavaScript と CSS の場所に従って、名前を変更する必要があります。
	
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

2. SelectMenu を View ページに追加します。

	SelectMenu ヘルパーのインスタンスを、その構成設定と共に追加します。
	
	この例では、SelectMenu は 3 つのメニュー項目「Apples」、「Oranges」および「Bananas」と共に構成されています。[Label](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Label.html) プロパティは「Products」に設定され、[LabelAlignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~LabelAlignment.html) は Top に設定されています
	
	**Razor の場合:**
	
	```
	@(
	 Html.InfragisticsMobile()
	    .SelectMenu()
	    .Label("Products")
	    .LabelAlignment(Alignment.Top)
	    .Items(s =>
	    {
	        s.MenuItems.Add(new SelectMenuItem { 
	            Text = "Apples", Selected = false });
	        s.MenuItems.Add(new SelectMenuItem { 
	            Text = "Oranges", Selected = true });
	        s.MenuItems.Add(new SelectMenuItem { 
	            Text = "Bananas", Selected = false });
	    })
	    .Render()
	)
	```

3. 結果を検証します。

	結果を検証するには、ビューを保存して、アプリケーションを再構築および実行します。


## <a id="related-content"></a>関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [SelectMenu の構成](SelectMenu-Configure.html): このトピックでは、`SelectMenu` ヘルパーの構成方法について説明します。

- [SelectMenu プロパティ参照](SelectMenu-Property-Reference.html): このトピックでは、`SelectMenu` ヘルパーのプロパティに関する参照情報を提供します。

### サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-selectmenu/basic-usage): このサンプルでは、基本の例で `SelectMenu` ASP.NET MVC ヘルパーを使用する方法を紹介します。





 

 


