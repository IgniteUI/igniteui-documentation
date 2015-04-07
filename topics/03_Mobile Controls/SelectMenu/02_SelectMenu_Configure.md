<!--
|metadata|
{
    "fileName": "selectmenu-configure",
    "controlName": "SelectMenu",
    "tags": ["Editing","Getting Started","MVC","Selection"]
}
|metadata|
-->

# SelectMenu の構成

## トピックの概要
### 目的

このトピックでは、`SelectMenu` ASP.NET MVC ヘルパーを構成する方法を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [SelectMenu の概要](SelectMenu-Overview.html): このトピックでは、`SelectMenu` ASP.NET MVC ヘルパーとその機能の概要を説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [SelectMenu 構成の概要](#config-summary)
-   [SelectMenu での複数選択の構成](#config-multiple-selections)
    -   [概要](#multiple-selection-overview)
    -   [プロパティ設定](#multiple-selection-settings)
    -   [コード例](#multiple-selection-code-example)
-   [SelectMenu のコーナーの構成](#config-corners)
    -   [概要](#corners-overview)
    -   [プロパティ設定](#corners-settings)
    -   [コード例](#corners-code-example)
-   [オプション ラベルの構成](#config-optional-labels)
    -   [概要](#optional-labels-overview)
    -   [プロパティ設定](#optional-labels-settings)
    -   [コード例](#optional-labels-code-example)
-   [SelectMenu でのユーザー操作の無効化](#disable-user-operation)
    -   [概要](#user-operation-overview)
    -   [プロパティ設定](#user-operation-settings)
    -   [コード例](#user-operation-code-example)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="config-summary"></a>SelectMenu 構成の概要
### SelectMenu 構成の概要図

以下の表は、`SelectMenu` ASP.NET MVC ヘルパーの構成可能な要素を示しています。

<table class="table table-bordered">
	<thead>
		<tr>
            <th>
構成可能な項目
			</th>

            <th>
詳細
			</th>

            <th>
プロパティ
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
[複数/単一選択の構成](#config-multiple-selections)
			</td>

            <td>
デフォルトでは、`selectmenu` は単一選択オプションが有効に構成されています。Multiple プロパティを使用することで、複数選択動作を有効にすることができます。
			</td>

            <td>
                <ul>
                    <li>
[Multiple](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Multiple.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
[Label](#config-optional-labels)
			</td>

            <td>
`selectmenu` のオプションのラベルは、[text](#text)、[position](#position)、および [visibility](#visibility) によって構成できます。

                これらの点はそれぞれ、専用のプロパティで管理されます。
			</td>

            <td>
                <ul>
                    <li>
[Label](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Label.html)
					</li>

                    <li>
[LabelAlignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~LabelAlignment.html)
					</li>

                    <li>
[HideLabel](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~HideLabel.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
[構成可能なコーナー](#config-corners)
			</td>

            <td>
`selectmenu` の四隅には、[Corners](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Corners.html) プロパティを使用して丸みを付けることができます。
			</td>

            <td>
                <ul>
                    <li>
[Corners](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Corners.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
[操作モード](#disable-user-operation)
			</td>

            <td>
`selectmenu` には、Enabled と Read-Only の 2 つの操作モードがあります。
			</td>

            <td>
                <ul>
                    <li>
[Disabled](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Disabled.html)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>





## <a id="config-multiple-selections"></a>SelectMenu での複数選択の構成
### <a id="multiple-selection-overview"></a>概要

複数選択を有効にするには、`SeletMenu` ヘルパーの [Multiple](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Multiple.html) プロパティを使用します。デフォルトでは、`selectmenu` では単一選択が有効になります。

### <a id="multiple-selection-settings"></a>プロパティ設定

以下の表に、`selectmenu` を初期化して複数選択を有効するために必要な構成を示します。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
選択モードを複数に設定する|[Multiple](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Multiple.html)|true


### <a id="multiple-selection-code-example"></a>コード例

以下のコードは、ヘルパーの [Multiple](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Multiple.html) プロパティを true (左図) または false (右図) に設定することで `selectmenu` の選択モードを変更する方法を示しています。

![](images/SelectMenu_Configuring_1.png)



**Razor の場合:**

```csharp
@(
 Html.InfragisticsMobile()
    .SelectMenu()
    .NativeMenu(false)
    .Multiple(true)
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
@(
 Html.InfragisticsMobile()
    .SelectMenu()
    .NativeMenu(false)
    .Multiple(false)
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

![](images/SelectMenu_Configuring_2.png)

**Razor の場合:**

```csharp
@(
 Html.InfragisticsMobile()
    .SelectMenu()
    .NativeMenu(false)
    .Multiple(true)
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
@(
 Html.InfragisticsMobile()
    .SelectMenu()
    .NativeMenu(false)
    .Multiple(false)
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



## <a id="config-corners"></a>SelectMenu のコーナーの構成
### <a id="corners-overview"></a>概要

デフォルトでは、`SelectMenu` のコーナーは角丸です。角丸を無効にするには、[Corners](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Corners.html) プロパティを使用します。

### <a id="corners-settings"></a>プロパティ設定

以下の表に、これらを管理するプロパティ設定に必要な構成を示します。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
角丸を無効にする|[Corners](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Corners.html)|false

### <a id="corners-code-example"></a>コード例

以下のコード スニペットは、`SelectMenu` のさまざまな [Corners](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Corners.html) 設定を示しています。

![](images/SelectMenu_Configuring_3.png)



**Razor の場合:**

```csharp
@(
 Html.InfragisticsMobile()
    .SelectMenu()
    .Corners(false)
    .NativeMenu(false)
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
@(
 Html.InfragisticsMobile()
    .SelectMenu()
    .Corners(true)
    .NativeMenu(false)
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

![](images/SelectMenu_Configuring_4.png)

**Razor の場合:**

```csharp
@(
 Html.InfragisticsMobile()
    .SelectMenu()
    .Corners(false)
    .NativeMenu(false)
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
@(
 Html.InfragisticsMobile()
    .SelectMenu()
    .Corners(true)
    .NativeMenu(false)
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

## <a id="config-optional-labels"></a>ラベルの構成
### <a id="optional-labels-overview"></a>概要

`SelectMenu` のラベルは以下の方法で構成できます。

-   <a id="text"></a>テキスト - ラベルのテキスト
-   <a id="position"></a>位置 - selectmenu に対するラベルの位置
-   <a id="visibility"></a>表示状態 - ラベルの表示または非表示: 特定の状況では、ラベルを非表示にする場合があります (デフォルトでは構成されたラベルは表示されます)

### <a id="optional-labels-settings"></a>プロパティ設定

以下の表では、希望の構成をプロパティ設定にマップしています。

<table class="table table-bordered">
	<thead>
		<tr>
            <th>
目的:
			</th>

            <th>
使用するプロパティ:
			</th>

            <th>
設定の選択肢:
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
ラベルのテキストを設定
			</td>

            <td>
[Label](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Label.html)
			</td>

            <td>
必要なテキスト文字列
			</td>
        </tr>

        <tr>
            <td>
ラベルの位置を設定
			</td>

            <td>
[LabelAlignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~LabelAlignment.html)
			</td>

            <td>
                以下のいずれかを指定

                <ul>
                    <li>
Left
					</li>

                    <li>
Right
					</li>

                    <li>
Top
					</li>

                    <li>
Bottom
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
ラベルの表示または非表示
			</td>

            <td>
[HideLabel](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~HideLabel.html)
			</td>

            <td>
                <ul>
                    <li>
true - ラベルを非表示にする
					</li>

                    <li>
false - ラベルを表示する
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>



### <a id="optional-labels-code-example"></a>コード例

左のコード スニペットは、[Label](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Label.html) プロパティを 「Products」 に設定し、[LabelAlignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~LabelAlignment.html) プロパティを 「Bottom」 に設定することで、`selectmenu` の下に Products と表示させるようにラベルを設定する方法を示しています。右のコード スニペットは、ラベルを非表示にする方法を示しています。

![](images/SelectMenu_Configuring_5.png)



**Razor の場合:**

```csharp
@(
 Html.InfragisticsMobile()
    .SelectMenu()
    .Label("Products")
    .LabelAlignment(Alignment.Bottom)
    .Multiple(false).NativeMenu(false)
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
@(
 Html.InfragisticsMobile()
    .SelectMenu()
    .Label("Products")
    .LabelAlignment(Alignment.Bottom)
    .Hidelabel(true)
    .Multiple(false).NativeMenu(false)
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
![](images/SelectMenu_Configuring_6.png)

**Razor の場合:**

```csharp
@(

	Html.InfragisticsMobile()
	
	.SelectMenu()
	
	.Label("Products")
	
	.LabelAlignment(Alignment.Bottom)
	
	.Hidelabel(true)
	
	.Multiple(false).NativeMenu(false)
	
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

## <a id="disable-user-operation"></a>SelectMenu でのユーザー操作の無効化
### <a id="user-operation-overview"></a>概要

デフォルトでは `SelectMenu` が有効になっていますが、ユーザーの介入を無効にする必要がある場合は、ウィジェットは読み取り専用モードでも動作します (その場合、`SelectMenu` では初期化の際に選択した項目だけが表示されます)。

以下のスクリーンショットは、読み取り専用に構成した場合の `SelectMenu` の表示結果です。

![](images/SelectMenu_Configuring_7.png)

### <a id="user-operation-settings"></a>プロパティ設定

以下の表では、希望の構成をプロパティ設定にマップしています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
`selectmenu` を無効にする|[Disabled](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Disabled.html)|true
`selectmenu` を有効にする|[Disabled](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Disabled.html)|false


### <a id="user-operation-code-example"></a>コード例

以下のコードは、[Disabled](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Disabled.html) プロパティを true に設定して `selectmenu` を無効にする方法を示しています。

**Razor の場合:**

```csharp
@(
 Html.InfragisticsMobile()
    .SelectMenu()
    .Disabled(true)
    .NativeMenu(false)
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



## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [SelectMenu プロパティ参照](SelectMenu-Property-Reference.html): このトピックでは、`SelectMenu` ヘルパーのプロパティに関する参照情報を提供します。

- [SelectMenu の追加](SelectMenu-Adding.html): このトピックでは、Infragistics® ASP.NET MVC ヘルパーを使用して jQuery Mobile `selectmenu` ウィジェットを ASP.NET ビューに追加する方法をコード例を示して説明します。

### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-selectmenu/basic-usage): このサンプルでは、基本の例で `SelectMenu` ASP.NET MVC ヘルパーを使用する方法を紹介します。





 

 


