<!--
|metadata|
{
    "fileName": "adding-mobile-ignite-ui-controls-to-an-asp.net-mvc-application",
    "controlName": "",
    "tags": ["Getting Started","How Do I","MVC"]
}
|metadata|
-->

# ASP.NET MVC アプリケーションへのモバイル コントロールの追加



## トピックの概要
#### 目的

このトピックでは、ASP.NET MVC アプリケーションに Ignite UI モバイル コントロールを追加する方法について説明します。

#### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**モバイル MVC ヘルパーの使用方法**](#mvc-helper)
-   [**チェーン構文**](#chaining)
-   [**モバイル igListView™ を使用する ASP.NET MVC アプリケーションの開発**](#listview-example)****
-   [**関連コンテンツ**](#related-content)



## <a id="mvc-helper"></a> モバイル MVC ヘルパーの使用方法
### モバイル MVC ヘルパーの使用方法の概要

Ignite UI™ の ASP.NET™ MVC モバイル ヘルパーは、既存のクライアント専用モバイル コントロールを MVC 拡張機能のサーバー側セットにラップします。これによって、次のようにしてコントロールを定義および使用できるようになります。

**ASPX の場合:**

```
<%= Html.InfragisticsMobile().CONTROL_NAME() %>
```

または

**ASPX の場合:**

```
<%= Html.InfragisticsMobile().CONTROL_NAME(Model) %>
```

ASP.NET に依存しませんし、MVC 以外のフレームワークにも依存しません。

### インストールしたリソースへ移動

Ignite UI %%ProductVersion%% のインストール時に一般的なフォルダー構成を選択した場合、各リソースは次のパスに置かれています。

タイプ|パス
---|---
アセンブリ|%%InstallPath%%\MVC\
スクリプト ファイル|%%InstallPath%%\mobile\js
CSS ファイル|%%InstallPath%%\mobile\css\


**関連トピック:**

[Ignite UI でのモバイル リソースの参照](Referencing-Mobile-Resources-in-NetAdvantage-for-jQuery.html)

### MVC 3

MVC ヘルパーのすべてのコードは、Infragistics.Web.Mvc アセンブリに含まれています。これは、MVC3 に対してコンパイル済みです。

アセンブリは以下のパスにあります。

-   %%InstallPath%%\MVC\MVC3\Bin

アセンブリは、**gacutil** コマンドを使用して GAC にインストールできます。

[http://msdn.microsoft.com/ja-jp/library/ex0ss12c%28v=vs.80%29.aspx](http://msdn.microsoft.com/ja-jp/library/ex0ss12c%28v=vs.80%29.aspx)

> **注:** dll の参照の Copy Local プロパティを true に設定する必要があります。 [http://msdn.microsoft.com/ja-jp/library/t1zz5y8c%28v=vs.80%29.aspx](http://msdn.microsoft.com/ja-jp/library/t1zz5y8c%28v=vs.80%29.aspx)

### Render() メソッドの呼び出し

ASP.NET MVC ヘルパーでコントロールをインスタンス化する場合、必ず他のオプションをすべて構成し終わった後、最後に Render メソッドを呼び出します。これは、クライアントでコントロールをインスタンス化するのに必要な HTML および JavaScript を描画するメソッドです。




## <a id="chaining"></a> チェーン構文

MVC アプリケーションで Ignite UI コントロールを定義するための 2 つの異なるオプションがあります。最初のオプションは、Model クラスを構成し、コントロール拡張メソッドの引数として渡します。

もう 1 つのオプションは、次のコードで示すチェーニング方法を使用して View でコントロールを構成します。

**ASPX の場合:**

```
<%= Html.InfragisticsMobile().ListView(Model).ID(“igListView”).Render() %>
```

### チェーンを使用したコントロールの構成

チェーン構文を使用しコントロールを初期化すると、すべての作成および構成のロジックがビューに移動します。これによって、コントローラー コードが非常に簡潔で明快になります。ビューにコントロールを定義するには、呼び出したものと同じオブジェクトを常に返すヘルパー メソッドを介して、必要なプロパティとメソッドを公開します。複雑なオブジェクトでは、[ラムダ式ビルダー](http://msdn.microsoft.com/ja-jp/library/bb397687.aspx)を使用して適切な構文を得ます。以下にリストするコードは、チェーニングとラムダ式ビルダーを使用してコントロールをインスタンス化する方法を示します。

**ASPX の場合:**

```
<%= Html.InfragisticsMobile()
    .ListView(Model)
    .ID("listView")
    .Bindings(b =>
    {
        b.TextKey(”ProductName”)
            .DescriptionKey (”CategoryName”);
    })
    .DataBind()
    .Render() %>
```

### Model を使用したコントロールの構成

モデル クラスを使用する場合、コントローラーに依存してコントロールを構成します。これは、要求 (ページの変更やフィルタリングなど) の後に、コントロールの構成に使用した設定/プロパティを取得する必要があるシナリオで有効です。チェーンを使用して View にすべてを構成する場合は、こうした設定/プロパティは使用できません。以下のコードは、コントロールで `igListView` を定義する方法を示します。

**C# の場合:**

```
ListViewModel list = new ListViewModel();
ListViewBindings binding = new ListViewBindings();
binding.TextKey = "ProductName";
binding.DescriptionKey = "CategoryName";
list.Bindings = binding;
return View(list);
```

すると View で必要なのは、`igListView` ヘルパーでモデルを渡すだけです。

**ASPX の場合:**

```
<%= Html.InfragisticsMobile()
    .ListView(Model)
    .ID("listView")
    .DataBind()
    .Render() %>
```



## <a id="listview-example"></a> モバイル igListView を使用するASP.NET MVC アプリケーションの開発

この手順では、必要なすべてのアセンブリおよびリソース (CSS および JavaScript ファイル) を追加して、ASP.NET MVC で Ignite UI モバイル igListView を使用して作業する方法を示します。

### 要件

この手順を実行するには、以下が必要です。

-   MVC Controller、Model、View を含む MVC3 アプリケーション。
-   Ignite UI %%ProductVersion%% がインストール済み
-   必要な全リソースのロード。ロード方法は、トピック「[Ignite UI のモバイル リソースの参照](Referencing-Mobile-Resources-in-NetAdvantage-for-jQuery.html)」を参照してください。
-   ページに `igListView` コントロールを追加する方法の理解。これの詳細は、トピック「[ページへの igListView の追加](igListView-Adding-igListView-to-a-Web-Page.html)」を参照してください。

### 概要

このトピックでは、 `igListView` コントロールを使用した ASP.NET MVC アプリケーションの作成について順を追って説明します。以下はプロセスの概念的概要です。

1.  Web アプリケーション内に MVC ラッパーへの参照を追加します。
2.  Loader の MVC ラッパーの追加
3.  `igListView` の MVC ラッパーの追加
4.  `igListView` クライアント側 API を操作するクライアント側コードの追加

### 手順

以下のステップは、`igListView` コントロールを使用してモバイル ASP.NET MVC アプリケーションを開発する方法を示します。

1. **Web アプリケーション内に MVC ラッパーへの参照を追加します。**
	
	a. Web プロジェクト ウィンドウへ移動し、参照設定フォルダーのコンテキスト メニューを選択します。

	![](images/02_AddingNetAdvantagejQueryMobileASPNETMVCApp_1.png)
	
	b. 「参照リスト項目の追加」を選択して Infragistics.Web.Mvc アセンブリを参照します。以下から参照できます。
	-   GAC
	-   インストール フォルダー。ここでは、bin ディレクトリのアセンブリを得るため、`CopyLocal` プロパティを *true* に設定する必要があります。

2. **Loader の MVC ラッパーの追加**

	a. ASP.NET MVC ラッパーを使用してローダーをページに追加します。

	**ASPX の場合:**
	
	```
	<%= Html.Infragistics()
	        .Loader()
	        .ScriptPath(“http://cdn-na.infragistics.com/jquery/%%ProductVersionCondensed%%/latest/mobile/js/”)
	        .CssPath(“http://cdn-na.infragistics.com/jquery/%%ProductVersionCondensed%%/latest/mobile/css/”)
	        .Render() %>
	```

	> **注:** あるいは、手動で依存ファイルをページにロードすることもできます。手動ロードの詳細については、「Ignite UI でのモバイル リソースの参照」のトピックを参照してください。
	
	​b. 最初のオプションはそれらをローカルに参照しますが、JavaScript ファイルは、Infragistics CDN 上のホスト環境でも使用可能です。CDN を使用すると非常に多くのメリットがあります。詳細は、ヘルプ トピック「[インフラジスティックス コンテンツ配信ネットワーク (CDN)(Deployment-Guide-Infragistics-Content-Delivery-Network%28CDN%29.html)]」を参照してください。
	
	​c. ASP.NET MVC ヘルパーを使用する利点としては、コントロールの依存リソース (スクリプトやスタイルなど) の定義を必要とせず、構成オプションだけでよいことです。ページで使用している個々のコントロールの ヘルパー コントロールがローダーにロードする依存リソースを知らせます。

3. **igListView の MVC ラッパーの追加**

	コントロールの MVC ラッパーを追加します。
	
	**ASPX の場合:**
	
	```
	<%= Html.InfragisticsMobile()
	     .ListView()
	     .ID(“igListView”)
	     .Render() %>
	```
	
	> **注:** これは、`igListView` ラッパーの簡単な利用です。igListView コントロールを初期化するすべてのオプションについては、「[ページへの igListView の追加](igListView-Adding-igListView-to-a-Web-Page.html)」のトピックを参照してください。

4. `igListView` クライアント側 API を操作するクライアント側コードの追加

	Ignite UI ASP.NET MVC ラッパーを使用して、コントロールを描画するとき、`igLoader`™ ラッパーのコードではなく Control ラッパーのコードがコントロール リソースを要求します。したがって、ページに `igLoader` コンポーネントの 2 つのインスタンスが作られます。最初のものは、ローダー ラッパーが描画し、 2 つ目はコントロールのラッパーが描画します。これらはスクリプトを個別に非同期的にロードします。したがって、ページのライフサイクルの異なる段階でスクリプトをロードします。したがって、`igLoader` コンポーネントを使用する際には以下を考慮してください。

	1.  Ignite UI モバイル コントロールをアクセスする JavaScript コードは、コントロールの MVC ラッパーの後に定義する必要があります。これにより、ローダーが最初に処理され、ページがページ上のコントロールを使い始める前に依存リソースをロードすることができます。以下のコードにローダーとコントロール スクリプトの推奨する順番を示します。
		
		**ASPX の場合:**
	
	    ```
	    <%= Html.InfragisticsMobile()
	         .ListView()
	         .ID(“igListView”)
	         .Render() %>
	    ```
	
	    **JavaScript の場合:**
	
	    ```
	    <script type="text/javascript">
	        $.ig.loader(function () {
	            $("#igListView").igListView("option", "imageMode”);
	        });
	    </script>
	    ```

	2.  以下に示すように jQuery ハンドラの中からウィジットをアクセスする場合、常に jQuery メソッド bind の代わりに live を使用することを推奨します。

	    **JavaScript の場合:**
	
	    ```
	    $("#btnReset1").live({ click: function () {
	        $("#igRating1").igRating("option", "value", 0);
	    }});
	    ```
	
	    これによりページ サイクルのどの段階で作成された要素でもセレクターが必ず組み込むことができます。 
	
		> **注:** jQuery バージョン 1.7.1 以降を使用している場合、`bind` または `live` ハンドラーの代わりに `on` ハンドラーを使用できます。Ignite UI モバイル コントロールの %%ProductVersion%% リリースはデフォルトで jQuery バージョン 1.6.4 を使用します。



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [Ignite UI でのモバイル リソースの参照](Referencing-Mobile-Resources-in-NetAdvantage-for-jQuery.html): 本トピックでは、Ignite UI コントロールに必要なモバイル リソースの管理方法について説明します。

- [igListView の Web ページへの追加](igListView-Adding-igListView-to-a-Web-Page.html): このトピックでは、`igListView` モバイル・コントロールをウェブ ページに追加する方法を説明します。





 

 


