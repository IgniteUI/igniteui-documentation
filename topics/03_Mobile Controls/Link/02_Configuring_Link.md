<!--
|metadata|
{
    "fileName": "configuring-link",
    "controlName": "Link",
    "tags": ["How Do I","MVC","Navigation"]
}
|metadata|
-->

# Link の構成

## トピックの概要

### 目的

このトピックでは、MVC ラッパーを使用した `Link` を構成するために必要な情報とリファレンスを提供します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

[*Link* の概要](Link-Overview.html): このトピックでは、MVC `Link` コントロール ラッパーとその主な機能を紹介します。



#### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**コントロールの構成の概要**](#summary)
-   [**ボタンのような Link **](#button) 
    -   [プロパティの設定](#button-property-settings)
    -   [コード例](#button-example)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="summary"></a> コントロールの構成の概要

以下の表は、`Link` MVC ラッパーの構成可能な要素を示しています。

<table class="table">
	<thead>
		<tr>
            <th>
構成可能な点
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
ボタンのような `Link`
			</td>
            <td>
以下は、`Link` をボタンのような外観にするために使用できるすべてのプロパティのリストです。
			</td>
            <td>
                <ul>
                    <li>
[RenderMode](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~RenderMode.html)
					</li>
                    <li>
[Icon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Icon.html)
					</li>
                    <li>
[Shadow](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Shadow.html)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>


## <a id="button"></a> ボタンのような *Link* 

このシナリオは、基本 `Link` をより使いやすいボタンのような外観を持つ `Link` に変換する方法を示します。

![](images/04_LinkConfiguring_1.png)

### <a id="button-property-settings"></a> プロパティ設定 

以下の表では、目的の構成をマップして、`Link` をボタンに変換しています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
Link をボタンとして描画|[RenderMode](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~RenderMode.html)|[LinkRenderMode.Button](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkRenderMode.html)
グリッドを `Link` アイコンとして設定|[Icon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Icon.html)|"grid"
`Link` の影を設定|[Shadow](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Shadow.html)|true



### <a id="button-example"></a> コード例 

**Razor の場合:**

```
@(Html.InfragisticsMobile()
    .Link()
    .ID("lnk2")
    .Text("Infragistics")
    .NavigateUrl("http://www.infragistics.com")
    .Target("_blank")
    .RenderAsButton(true)
    .Icon(DefaultIcons.Grid)
    .Mini(true)
    .Shadow(true)
    .Render())
```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*Link* の概要](Link-Overview.html): このトピックでは、MVC `Link` コントロール ラッパーとその主な機能を紹介します。

- [*Link* の追加](Adding-Link.html): このトピックでは、Infragistics MVC ラッパーを使用した `Link` を有効にするために必要な情報を提供します。

- [*Link* のプロパティ リファレンス](Link-Property-Reference.html): このトピックでは、`Link` MVC ラッパーのプロパティに関するリファレンス情報を提供します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-link/basic-usage): このサンプルでは、`Link` の ASP.NET MVC ヘルパーの使用方法を紹介します。




 

 


