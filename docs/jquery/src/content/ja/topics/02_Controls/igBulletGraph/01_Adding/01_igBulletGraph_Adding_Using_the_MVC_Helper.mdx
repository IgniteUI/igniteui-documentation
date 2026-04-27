<!--
|metadata|
{
    "fileName": "igbulletgraph-adding-using-the-mvc-helper",
    "controlName": "igBulletGraph",
    "tags": ["Application Scenarios","Charting","Getting Started","How Do I"]
}
|metadata|
-->

# ASP.NET MVC アプリケーションへの igBulletGraph の追加



## トピックの概要

#### 目的

このトピックではコード例を示して、ASP.NET MVC ヘルパーで ASP.NET MVC アプリケーションに `igBulletGraph`™ を追加する方法を説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念とトピックの一覧です。

- 概念
	-   jQuery
	-   jQuery UI
	-   ASP.NET MVC
	-   ASP.NET MVC HTML ヘルパー

- トピック
	- [コントロールを MVC プロジェクトに追加](Adding-IgniteUI-Controls-to-an-MVC-Project.html): このトピックでは、ASP.NET MVC アプリケーションで %%ProductName%%™ コンポーネントを使用した作業の開始方法を説明します。
	- [*igBulletGraph* の概要](igBulletGraph-Overview.html): このトピックは、主要機能、最小要件およびユーザー機能性など、`igBulletGraph` コントロールの概念的な情報を提供します。



 



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [***igBulletGraph* の ASP.NET MVC アプリケーションへの追加 - 概念的な概要**](#overview)
    -   [要件](#requirements)
    -   [手順](#steps)
-   [***igBulletGraph* の ASP.NET MVC アプリケーションへの追加 - 手順**](#procedure)
    -   [概要](#procedure-introduction)
    -   [プレビュー](#preview)
    -   [前提条件](#prerequisites)
    -   [手順](#steps)
    -   [全コード](#full-code)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)


## <a id="overview"></a>igBulletGraph の ASP.NET MVC アプリケーションへの追加 - 概念的な概要

`igBulletGraph` コントロールは、ASP.NET MVC ヘルパーを使用して ASP.NET MVC View に追加できます。ブレット グラフを正しく表示するには、コントロールのディメンションを設定する必要があります。`igBulletGraph コントロール`をインスタンス化する場合、以下を含む基本的な描画に設定すべき複数の**ヘルパー メソッド**があります。


- [`Width()`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.BulletGraphModel_members.html): igBulletGraph の幅を設定します。

- [`Height()`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.BulletGraphModel_members.html): igBulletGraph の高さを設定します。

- [`MinimumValue()`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.BulletGraphModel_members.html): スケール範囲の開始値を設定します。

- [`MaximumValue()`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.BulletGraphModel_members.html): スケール範囲の終了値を設定します。

- [`Value()`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.BulletGraphModel_members.html): パフォーマンス バーの終了位置を指定する値を設定します。

- [`TargetValue()`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.BulletGraphModel_members.html): 比較マーカーで示された値を設定します。

- [`Ranges()`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.BulletGraphModel_members.html): `igBulletGraph` の範囲オブジェクトのインスタンスを作成します。

[`startValue`](%%jQueryApiUrl%%/ui.igBulletGraph#options:ranges) や [`endValue`](%%jQueryApiUrl%%/ui.igBulletGraph#options:ranges) に加え、各範囲に [`name`](%%jQueryApiUrl%%/ui.igBulletGraph#options:ranges) を割り当てて範囲を指定する必要があります。



### <a id="requirements"></a>要件

この手順を実行するには、以下が必要です。

-   **ASP.NET MVC アプリケーション**
-   **アプリケーション プロジェクトに追加される *Infragistics.Web.Mvc.dll* アセンブリに対する参照**。詳細は、「[MVC プロジェクトへのコントロールの追加](Adding-IgniteUI-Controls-to-an-MVC-Project.html)」のトピックを参照してください。
-   ビューの依存関係:

    -   **ASP.NET MVC ビューに追加される `Infragistics.Web.Mvc` 名前空間**

	    **ASPX の場合:**
	
	    ```csharp
	    <%@ Import Namespace="Infragistics.Web.Mvc" %>
	    ```

    -   すべてのデータ ビジュアライゼーション コントロール用の**結合された Java Script ファイル**、および ASP.NET MVC ビューの `<head>` タグに追加された必要な CSS ファイルへの参照

    **ASPX の場合:**

    ```csharp
    <link href="<%=Url.Content("~/Scripts/css/themes/infragistics/infragistics.theme.css")%>" rel="stylesheet"></link>
    <link href="<%=Url.Content("~/Scripts/css/structure/infragistics.css")%>" rel="stylesheet"></link>
    <script src="<%=Url.Content("~/Scripts/jquery.min.js")%>" type="text/javascript"></script>
    <script src="<%=Url.Content("~/Scripts/jquery-ui.min.js")%>" type="text/javascript"></script>
    <script src="<%=Url.Content("~/Scripts/js/infragistics.core.js")%>" type="text/javascript"></script>
    <script src="<%=Url.Content("~/Scripts/js/infragistics.dv.js")%>" type="text/javascript"></script>
    ```

    [HTML ページへの *igBulletGraph* の追加](igBulletGraph-Adding-to-an-HTML-Page.html)のトピックで説明するように、Infragistics Loader ( コンポーネント) を使用すること、あるいはすべての igBulletGraph 関連のファイルを明示的に含めることも可能です。

### <a id="steps"></a>手順

1. ASP.NET MVC ヘルパーの追加
2. 基本的な描画オプションを構成する `igBulletGraph` コントロールのインスタンス作成
3. スケールの構成
4. パフォーマンス バーの追加
5. 比較マーカーの構成
6. 比較範囲の追加

## <a id="procedure"></a>igBulletGraph の ASP.NET MVC アプリケーションへの追加 - 手順

#### <a id="procedure-introduction"></a> 概要

この手順では、コントロールのASP.NET MVC ヘルパーを使用して `igBulletGraph` のインスタンスを ASP.NET MVC アプリケーションに追加し、`width` や `height` などの基本的なオプショを設定します。スケールの設定やパフォーマンス バー、比較マーカー、3 つの比較範囲の追加も実行します。この手順は、*Infragistics.Web.Mvc.dll* アセンブリ参照がプロジェクトに追加され、コントロールがASP.NET MVC ヘルパーの `Render()` メソッドでビューに描画されることを前提とします。

#### <a id="preview"></a>プレビュー

以下のスクリーンショットは結果のプレビューです。

![](images/igBulletGraph_Adding_igBulletGraph_to_an_ASP.NET_MVC_Application_1.png)

### <a id="prerequisites"></a>前提条件

「`igBulletGraph` の ASP.NET MVC アプリケーションへの追加」の手順にある前提条件に定義されている、必要な JavaScript ファイル、CSS ファイルおよび ASP.NET MVC アセンブリで構成される ASP.NET MVC アプリケーション

### <a id="steps"></a>手順

以下の手順では、ASP.NET MVC ヘルパーを使用して ASP.NET MVC アプリケーションに `igBulletGraph` のインスタンスを作成する方法を示します。

**1. ASP.NET MVC ヘルパーを追加します**。

ASP.NET MVC ヘルパーを ASP.NET ページの本文に追加します。

**ASPX の場合:**

```csharp
<body>
<%=(Html.Infragistics().BulletGraph()
.Render())%>
</body>
```

**2. 基本的な描画オプションを構成する *igBulletGraph* コントロールのインスタンスを作成します**。

`igBulletGraph` のインスタンスの作成すべての %%ProductNameMVC%% コントロールと同様に、Render メソッドを呼び出して HTML と JavaScript をビューに描画します。

**ASPX の場合:**

```csharp
<body>
    <%= Html.Infragistics().BulletGraph()
                    .Width("300px")
                    .Height("70px").Render()%>
</body>
```

**3. スケールを構成します。**

スケールの値をカスタマイズするには、 [`MinimumValue()`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.BulletGraphModel_members.html) および [`MaximumValue()`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.BulletGraphModel_members.html) メソッドに値を渡す必要があります。この例では、スケールは 5 から開始され 55 で終了します。

**ASPX の場合:**

```csharp
<%= Html.Infragistics().BulletGraph()
                .Width("300px")
                .Height("70px")
                .MinimumValue(5)
                .MaximumValue(55).Render()%>
```

変化したスケールを以下のスクリーンショットに示します。

**![](images/igBulletGraph_Adding_igBulletGraph_to_an_ASP.NET_MVC_Application_2.png)**

**4. パフォーマンス バーを追加します。**

igBulletGraph の `Value()` メソッドを設定して、パフォーマンス バーを追加します。この例では、値を 35 に設定しています。

**ASPX の場合:**

```csharp
<%= Html.Infragistics().BulletGraph()
				...
                .Value(35)
                .Render()%>
```

**5. 比較マーカーを構成します。**

比較目盛マーカーのスケールへの配置は、`TargetValue()` メソッドの値を設定します。この例では、値を 43 に設定しています。

**ASPX の場合:**

```csharp
<%= Html.Infragistics().BulletGraph()
				...
                .TargetValue(43)
                .Render()%>
```

以下のスクリーンショットは、これまでの手順で `igBulletGraph` コントロールの外観がどのようになるか示しています。

![](images/igBulletGraph_Adding_igBulletGraph_to_an_ASP.NET_MVC_Application_3.png)

**6. 比較範囲を追加します。**

`Ranges()` メソッドの中に、各比較範囲を定義します。開始値および終了値は、各範囲 (`StartValue()` や `EndValue()` のパラメーター) およびカラー (`Brush()`) で個別に設定できます。

この例では、3 つの比較範囲を構成します。それぞれ異なる灰色のグラデーションで、スケール目盛の 0、15、30 から開始します。

**ASPX の場合:**

```csharp
<%= Html.Infragistics().BulletGraph()
				...
                .Ranges(range =>
                    {
                        range.Range("range1").StartValue(0).EndValue(15).Brush("#DCDCDC");
                        range.Range("range2").StartValue(15).EndValue(30).Brush("#A9A9A9");
                        range.Range("range3").StartValue(30).EndValue(55).Brush("#808080");
                    })
                .Render()%>
```

グラフの最終的な外観を以下に示します。

![](images/igBulletGraph_Adding_igBulletGraph_to_an_ASP.NET_MVC_Application_1.png)



### <a id="full-code"></a>全コード

以下は、この手順の完全なコードです。

**ASPX の場合:**

```csharp
<%@ Import Namespace="Infragistics.Web.Mvc" %>
<!DOCTYPE html>
<html>
<head>
<title>BulletGraph</title>
<link href="<%=Url.Content("~/Scripts/css/themes/infragistics/infragistics.theme.css")%>" rel="stylesheet"></link>
<link href="<%=Url.Content("~/Scripts/css/structure/infragistics.css")%>" rel="stylesheet"></link>
<script src="<%=Url.Content("~/Scripts/jquery.min.js")%>" type="text/javascript"></script>
<script src="<%=Url.Content("~/Scripts/jquery-ui.min.js")%>" type="text/javascript"></script>
<script src="<%=Url.Content("~/Scripts/js/infragistics.core.js")%>" type="text/javascript"></script>
<script src="<%=Url.Content("~/Scripts/js/infragistics.dv.js")%>" type="text/javascript"></script>
</head>
<body>
    <%= Html.Infragistics().BulletGraph()
                    .Width("300px")
                    .Height("70px")
                    .MinimumValue(5)
                    .MaximumValue(55)
                    .Value(35)
                    .TargetValue(43)
                    .Ranges(range =>
                        {
                            range.Range("range1").StartValue(0).EndValue(15).Brush("#DCDCDC");
                            range.Range("range2").StartValue(15).EndValue(30).Brush("#A9A9A9");
                            range.Range("range3").StartValue(30).EndValue(55).Brush("#808080");
                        })
                    .Render()%>
</body>
</html>
```


## <a id="related-content"></a>関連コンテンツ

### <a id="topics"></a>トピック
このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [HTML ページへの *igBulletGraph* の追加](igBulletGraph-Adding-to-an-HTML-Page.html): このトピックではコード例を使用して、`igBulletGraph` コントロールを HTML ページに追加する方法を説明します。

- [jQuery および MVC API リファレンス リンク (*igBulletGraph*)](igBulletGraph-API-Links.html): このトピックでは、`igBulletGraph` コントロールと ASP.NET MVC ヘルパーに関する API 参照ドキュメントへのリンクを提供します。



### <a id="samples"></a>サンプル

以下のサンプルでは、このトピックに関連する情報を提供しています。

- [MVC の初期化](%%SamplesUrl%%/bullet-graph/mvc-initialization): このサンプルでは、ブレット グラフの ASP.NET MVC ヘルパーを使用する方法を紹介します。





 

 


