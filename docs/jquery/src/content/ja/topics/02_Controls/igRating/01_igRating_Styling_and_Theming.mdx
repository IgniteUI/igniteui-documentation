<!--
|metadata|
{
    "fileName": "igrating-styling-and-theming",
    "controlName": "igRating",
    "tags": ["Styling","Theming"]
}
|metadata|
-->

# スタイル設定とテーマ設定 (igRating)

`igRating` コントロール、%%ProductName%%™ レーティング コントロールは、カスタムのスタイル設定とテーマ設定をサポートしており、レーティング エクスペリエンスのルック アンド フィールを完全に制御できます。カスタム スタイルをコントロールに適用しない場合、デフォルトのスタイル設定がコントロールに適用されます。

このトピックの例には、jQuery/HTML での実装および Microsoft ASP.NET MVC での実装が含まれています。

### 必要な CSS とテーマ

%%ProductName%%™ レーティングは、ほかの jQuery ウィジェットのように、スタイリングに jQuery UI CSS Framework を使用します。%%ProductName%% には、Infragistics および Metro と呼ばれるカスタム jQuery UI テーマが含まれています。これらのテーマによって、Infragistics ウィジェットおよび標準の jQuery UI ウィジェットが、プロフェッショナルで魅力的な外観になります。

Infragistics および Metro テーマに加えて、Infragistics ウィジェットの基本 CSS レイアウトに必要な structure ディレクトリがあります。

### 必要なテーマの Web サイトへの追加

Infragistics および Metro テーマは、css フォルダー内のインストール ディレクトリに配置されています。テーマをアプリケーションに追加するには、css フォルダー全体 (structure および themes ディレクトリを含む) をサイトの場所にコピーします。

>**注:** Infragistics Loader の使用時は、フォルダー構造を保持する必要があります。このようにすると、ローダーは期待通りに機能します。使用されないテーマがある場合、それらは削除することができますが、その構造は変更してはいけません。

**図 1: 製品インストール時に含まれるテーマ フォルダー**

![](images/jQuery_Grid_Styling_and_Theming_2011.2_1.png)

### Infragistics および Metro テーマ

Infragistics テーマは、jQuery UI テーマに通常存在するすべてのスタイルを含むカスタム テーマです。このテーマは、別のテーマで置き換えることができますが、jQuery ウィジェットを正しく表示するには、`{IG Resources root}/css/structure/infragistics.css` ファイルへの参照が必要です。

Metro テーマは、クリーン、モダンかつ高速な Metro デザイン言語の実装です。これには、Infragistics テーマと同様に、`{IG Resources ルート}/css/structure/infragistics.css` と同じ要件があります。

Infragistics (または Metro) テーマ以外のテーマを使うと、`igRating` にスタイリング ポイントがいくつか追加されるため、完璧なデザインを実現するには、カスタマイズが必要になる場合があります (`igRating` で有効にしている機能とテーマによって異なります)。

`igRating` コントロールには、標準の jQuery UI テーマのスタイルシートへのリンクが必要です。IG テーマの場合、テーマのスタイルシートへの参照をページに含める必要があります。

### リスト 1: Infragistics テーマへの手動 CSS 参照

**HTML の場合:**

```html
<link href="css/themes/infragistics/infragistics.theme.css" rel="stylesheet" type="text/css" />
<link href="css/structure/modules/infragistics.ui.rating.css" rel="stylesheet" type="text/css" />
```

### リスト 2: ASP.NET MVC の Infragistics テーマへの CSS 参照

**HTML の場合:**

```html
<%@ Import Namespace="Infragistics.Web.Mvc" %>
<!DOCTYPE html>
<html>
<head runat="server">
<link href="<%= Url.Content("~/css/themes/infragistics/infragistics.theme.css") %>” rel="stylesheet"                                                                       type="text/css" />
<link href="<%= Url.Content("~/css/structure/modules/infragistics.ui.rating.css") %>” rel="stylesheet"                                                                       type="text/css" />
```

### Metro テーマ

Metro テーマは、jQuery テーマの後に参照されます。`igRating` コントロールを使用する場合、以下のスタイルシートが必要です。

### リスト 3: Metro テーマへの手動 CSS 参照

**HTML の場合:**

```html
<link href="css/themes/metro/infragistics.theme.css " rel="stylesheet" type="text/css" />
<link href="css/structure/modules/infragistics.ui.rating.css" rel="stylesheet" type="text/css" />
```

### リスト 4: ASP.NET MVC の Metro テーマへの CSS 参照

**HTML の場合:**

```html
<%@ Import Namespace="Infragistics.Web.Mvc" %>
<!DOCTYPE html>
<html>
<head runat="server">
<link href="<%= Url.Content("~/css/themes/metro/infragistics.theme.css ") %>” rel="stylesheet"                                                                       type="text/css" />
<link href="<%= Url.Content("~/css/structure/modules/infragistics.ui.rating.css") %>” rel="stylesheet"                                                                       type="text/css" />
```

## レーティング スタイル アーキテクチャについて

コントロールを描画するとき、HTML には メイン DIV 要素が 1 つ含まれます。メイン要素の中には、次のレーティング状態に使用する 3 つの異なる DIV 要素があります。

-   標準
-   ホバー
-   選択済み

これらの DIV 要素それぞれに、単一の投票項目を表す HTML スパン要素が含まれています。表 1 は、各 HTML 要素に適用されるクラスを表します。これらのリスト項目は、レーティング コントロールの外観をカスタマイズするときに CSS スタイルを作成するためのクラスです。

## 表 1: CSS クラスのリスト

クラスのグループ|要素に適用される CSS クラスのリスト|CSS クラスが適用される範囲
---|---|---
`normal`|ui-igrating ui-state-default ui-widget-content|DIV コンテナー要素に適用されるクラス。
`hover`|ui-igrating-hover ui-state-hover|ホバー状態の投票のコンテナーに適用されるクラス。
`active`|ui-igrating-active|ウィジェットにフォーカスがあるときに DIV コンテナー要素に適用されるクラス。
`selected`|ui-igrating-selected ui-state-highlight|選択された状態の投票のコンテナーに適用されるクラス。
`vote`|ui-igrating-vote ui-icon ui-icon-star|投票の SPAN 要素に適用されるクラス。
`voteSelected`|ui-igrating-voteselected|選択された状態の投票の SPAN 要素に適用されるクラス。
`voteDisabled`|ui-igrating-votedisabled ui-state-disabled|無効な状態の投票の SPAN 要素に適用されるクラス。
`voteHover`|ui-igrating-votehover|ホバー状態の投票の SPAN 要素に適用されるクラス。
`voteDisabledSelected`|ui-igrating-votedisabledselected|ウィジェットが無効のときに、選択された状態の投票の SPAN 要素に適用されるクラス。

## jQuery UI Theme Roller の使用
異なる外観を jQuery Rating コントロールに適用する最も簡単な方法は、jQuery UI ツール [Theme Switcher](http://docs.jquery.com/UI/Theming/ThemeSwitcher) を使用することです。レーティング自体が、このツールと統合された CSS クラスを持っています。必要なことは、ツールのスクリプトを含めて、Theme Roller ツールを HTML DIV 要素にアタッチすることです。

**リスト 1: Theme Switcher を使用した HTML 内のテーマの変更**

**HTML の場合:**

```html
<script type="text/javascript" src="/Scripts/themeswitchertool.js"></script>
<script type="text/javascript">
$(window).load(function () {
    $("#igRating1").igRating({ voteCount: 10, value: 0.4 });
    $('#ThemeRoller').themeswitcher();
});
</script>

<div id="igRating1"></div>
<div>
    <label>Select theme</label>
    <div id="ThemeRoller"></div>
</div>
```

**リスト 2: Theme Switcher を使用した ASP.NET MVC 内のテーマの変更**

**ASPX の場合:**

```csharp
<script type="text/javascript" 
        src="<%= Url.Content("~/Scripts/themeswitchertool.js") %>"></script>
<script type="text/javascript" language="javascript">
    $(window).load(function () {
        $('#ThemeRoller').themeswitcher();
    });
</script>

<%= Html.Infragistics().Rating()
    .ID("igRating1")
    .VoteCount(10)
    .ValueAsPercent(true)
    .Value(0.4)
    .Render() %>
<div>
    <label>Select Theme</label>
    <div id="ThemeRoller"></div>
</div>
```

テーマ ローラーで使用可能なすべてのテーマが、jQuery Rating コントロールで使用可能です。

![](images/Rating_Styling_and_Theming_03.png)

## 「theme」プロパティの使用
Theme Switcher では基本的なクラスのみを変更できますが、`igRating` コントロールの「theme」プロパティを使用すると、投票項目の背景画像も変更できます。この方法を使用すると、コントロールに適用される基本 CSS ルール (表 1 で定義したような) を変更することになるため、外観全体を変更できます。

>**注:** テーマの CSS スタイルを作成する場合は、リスト 3 に示すように、各スタイル ルールのスタイルにベース クラス名をプレフィックスする点に注意してください。

以下の例は、カスタムのテーマを作成する方法を示しています。リスト 3 は、`igRating` のカスタム テーマの完全な定義を示しています。

**リスト 3: CSS におけるテーマの定義**

**CSS の場合:**

```css
<style type="text/css">
    .theme1 .ui-igrating { }
    .theme1 .ui-igrating-active { }
    .theme1 .ui-igrating-hover { }
    .theme1 .ui-igrating-vote 
    { 
        width: 20px; 
        height: 20px; 
        background: transparent url(images/ig-rating-red.png) no-repeat; 
        background-position: -75px 0; 
    }
    .theme1 .ui-igrating-voteselected 
    { 
        background: transparent url(/images/ig-rating-red.png) no-repeat; 
        background-position: 0 0; 
    }
    .theme1 .ui-igrating-votehover 
    { 
        background: transparent url(/images/ig-rating-red.png) no-repeat; 
        background-position: -25px 0; 
        filter: alpha(opacity=40); 
        opacity: 0.4; 
    }
    .theme1 .ui-igrating-votedisabled 
    { 
        background: transparent url(images/ig-rating-red.png) no-repeat; 
        background-position: -100px 0; 
    }
    .theme1 .ui-igrating-votedisabledselected 
    { 
         background: transparent url(images/ig-rating-red.png) no-repeat; 
         background-position: -50px 0; 
    }
</style>
```

**リスト 4** は、jQuery/HTML のシナリオでレーティング コントロールをマークアップおよびインスタンス化する方法を示しています。**リスト 5** は、%%ProductNameMVC%% のレーティングを使用してレーティング コントロールを作成する方法を示しています。

**リスト 4: HTML におけるマークアップおよび関連するスクリプトの作成**

**HTML の場合:**

```html
<script type="text/javascript" language="javascript">
$(window).load(function () {
    $("#igRating1").igRating({
        voteCount: 10,
        value: 0.5,
        theme: 'theme1'
    });
});
</script>
<div id="igRating1"></div>
```

**リスト 5: ASP.NET MVC におけるレーティング コントロールのインスタンス化**

**ASPX の場合:**

```csharp
<%= Html.Infragistics().Rating()
    .ID("igRating1")
    .VoteCount(10)
    .Value(0.5)
    .Theme("theme1")
    .Render()%>
```

>**注:** このサンプルでは、CSS スプライトを使用します。異なる状態のすべての画像が 1 つの画像に結合され、背景の位置だけが変更されます。

![](images/Rating_Styling_and_Theming_04.png)

## 「cssVotes」プロパティの使用
theme プロパティを使用する場合は、すべての項目に同じ背景画像を設定しています。すべての投票に異なるスタイルを適用するには、`cssVotes` プロパティを使用します。`cssVotes` の値には、複数オブジェクトの内の 1 つのオブジェクト、または 2 次元配列に設定できます。最初のオプションを使用する場合、`cssVotes` オブジェクトを次のように定義します。

リスト 6: JSON 配列を使用したカスタム投票スタイル マップの作成

**ASPX の場合:**

```csharp
var customCss1 = 
{
   0: { 0: 'normal0', 1: 'selected0', 2: 'hovered0' },
   1: { 0: 'normal1', 1: 'selected1', 2: 'hovered1' },
   2: { 0: 'normal2', 1: 'selected2', 2: 'hovered2' }
};
```

ご覧のように、それぞれのオブジェクトには 3 つのプロパティがあり、レーティング項目の様々な状態の CSS クラスにマップします。

-   0 は通常状態です。
-   1 は選択された状態です。
-   2 はホバー状態です。

    次の配列を使用しても、同じ効果が得られます。

**リスト 7: JavaScript 配列を使用したカスタム スタイル マップの作成**

**jQuery の場合:**

```js
var customCss1 = 
[
   [ 'normal0', 'selected0', 'hovered0' ],
   [ 'normal1', 'selected1', 'hovered1' ],
   [ 'normal2', 'selected2', 'hovered2' ]
];
```

JavaScript 配列を使用する場合、状態の順序が非常に重要であることに注意してください。最初が通常状態、その次に、選択された状態、ホバー状態です。開発者自身のケースに適した方法を選択できます。JSON 配列または JavaScript 配列を作成した後で、各項目にクラスを定義する必要があります。

**リスト 8: CSS における独立した投票スタイルの作成**

**CSS の場合:**

```css
<style type="text/css">
  .normal0 { background: transparent url(normal0.png) no-repeat; }
  .normal1 { background: transparent url(normal1.png) no-repeat; }
  .normal2 { background: transparent url(normal2.png) no-repeat; }
  .selected0 { background: transparent url(selected0.png) no-repeat; }
  .selected1 { background: transparent url(selected1.png) no-repeat; }
  .selected2 { background: transparent url(selected2.png) no-repeat; }
  .hovered0 { background: transparent url(hovered0.png) no-repeat; }
  .hovered1 { background: transparent url(hovered1.png) no-repeat; }
  .hovered2 { background: transparent url(hovered2.png) no-repeat; }
</style>
```

最後に、「cssVotes1」オブジェクトまたは配列を Rating プロパティに渡します。

**リスト 9: HTML におけるカスタム投票スタイルのレーティング コントロールへの適用**

**HTML の場合:**

```html
$("#igRating1).igRating({
    cssVotes: customCss1
});

<div id="igRating1"></div>
```

%%ProductNameMVC%% Rating を使用すると、各項目のクラスを直接設定できます (つまり、JSON 配列または JavaScript 配列を定義する必要がありません)。%%ProductNameMVC%% はシーンの背後で作業を行っています。

**リスト 10: ASP.NET MVC におけるカスタム スタイルのレーティング コントロールへの適用**

**ASPX の場合:**

```csharp
<%= Html.Infragistics().Rating()
    .CssVotes(c => 
    {
        c.AddVoteCSS().ItemIndex(0).EmptyCss("normal0").
                        SelectedCss("selected0").HoverCss("hovered0");
                                                                                          
        c.AddVoteCSS().ItemIndex(1).EmptyCss("normal1").
                        SelectedCss("selected1").HoverCss("hovered1");
 
       c.AddVoteCSS().ItemIndex(2).EmptyCss("normal2").
                        SelectedCss("selected2").HoverCss("hovered2");
    })
    .Render()
%>
```

## まとめ
このトピックでは、独立した項目および `igRating` コントロール全体のスタイルを設定する方法を示しました。コントロールは柔軟性で、コントロールのすべてのレベルでカスタム CSS ルールを作成できることを説明しました。たとえば、カスタム スタイルに不透明度 CSS ルールを設定すると、投票項目を半分色付けした効果を出せます。ホバー状態に不透明度を使用すると、ユーザーがレーティング コントロールの上をホバーしたときにコントロールに透明な項目を表示できます。

![](images/Rating_Styling_and_Theming_05.png)

## 外部参照
-   [jQuery UI](http://jqueryui.com/)
-   [jQuery UI - はじめに](http://docs.jquery.com/UI/Getting_Started)
-   [jQuery Themeroller](http://jqueryui.com/themeroller/)
-   [jQuery UI のテーマ設定](http://docs.jquery.com/UI/Theming)
-   [jQuery UI CSS Framework](http://docs.jquery.com/UI/Theming/API)

## 関連リンク
-   [カスタム スタイル](%%SamplesUrl%%/rating/custom-styles) 
-   [%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)

 

 


