<!--
|metadata|
{
    "fileName": "igdialog-position",
    "controlName": "igDialog",
    "tags": ["API","How Do I"]
}
|metadata|
-->

# igDialog 配置

## トピックの概要

### 目的

このトピックでは、`igDialog`™ の配置方法を示します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [***igDialog* の概要**](igDialog-Overview.html): このトピックでは、`igDialog` コントロールの主な機能を紹介します。

- [***igDialog*** の追加](Adding-igDialog.html): このトピックでは、`igDialog` コントロールを Web ページに追加する方法について説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**コントロールの構成の概要**](#configuration-summary)
-   [**igDialog 位置の構成**](#position)
    -   [プロパティ形式](#position-formats)
    -   [オブジェクトの例](#position-object)
    -   [jQuery UI オブジェクトの例](#position-jquery-object)
-   [**igDialog 積み重ね順の構成**](#stack-order)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="configuration-summary"></a> コントロールの構成の概要

次の表は、 `igDialog` コントロールで構成可能な項目の一覧です。このメソッドについては、表の下にある解説も参照してください。

構成可能な要素|詳細|プロパティ
--- | --- | ----
`igDialog` 位置の構成|`igDialog` を配置するよう構成する必要があるプロパティ。|[position](%%jQueryApiUrl%%/ui.igDialog#options:position)
`igDialog` 積み重ね順の構成|ダイアログの積み重ね順を指定するプロパティ。|[zIndex](%%jQueryApiUrl%%/ui.igDialog#options:zIndex)





## <a id="position"></a> igDialog 位置の構成

`igDialog` は、その親にしたがって配置できます。コントロール API には、動的に構成し、変更できる [`position`](%%jQueryApiUrl%%/ui.igDialog#options:position) というプロパティがあります。以下の表は、このプロパティの使用方法と指定できる値を示します。

### <a id="position-formats"></a> プロパティ形式

以下の表は、プロパティ [`position`](%%jQueryApiUrl%%/ui.igDialog#options:position) で指定できる種類の形式を示しています。

<table class="table">
	<tbody>
		<tr>
			<th>
				書式
			</th>

			<th>
				例
			</th>

			<th>
				タイプ
			</th>
		</tr>

		<tr>
			<td>
				{ left: leftPos, top: topPos }
			</td>

			<td>
				{ left: 100, top: 200 }
			</td>

			<td>
				JavaScript オブジェクト
			</td>
		</tr>

		<tr>
				<td>
				{<br />
					my: “position”,<br />
					at: “position”,<br />
					of: “parent”,<br />
					offset: “left top”,<br />
					collision: “alternative position”<br />
					using: function(){}<br />
				}
			</td>

			<td>{</span> my: “left top”,</span> at: “left top”,</span> of: window,</span> offset: “</span>10</span>0</span> 20</span>0”</span>}</span></td>

			<td>object (jQuery UI</span> <a href="http://jqueryui.com/demos/position/" target="_blank">position()</a> メソッドでサポート)</span></td>
		</tr>
	</tbody>
</table>

### <a id="position-object"></a> オブジェクトの例

以下のコードは、オブジェクトを使用して `igDialog` をどのように配置できるかを示しています。

**JavaScript の場合:**

```js
$("#dialog").igDialog({
    position: { left: 100, top: 200 }
});
```

**C# の場合:**

```csharp
<%= Html.Infragistics()
    .Dialog()
    .Position(100,200)
    .Render()
%>
```

### <a id="position-jquery-object"></a> jQuery UI 位置オブジェクトの例

以下のコードは、jQuery UI の [`.position()`](http://api.jqueryui.com/position/) によってサポートされる特別に定義したオブジェクトを使用して `igDialog` をどのように配置できるかを示しています。

**JavaScript の場合:**

```js
var dialogPosition = {
    my: “left top”,
    at: “left top”,
    of: window,
    offset: “100 200”
}
$("#dialog").igDialog({
    position: dialogPosition
});
```



## <a id="stack-order"></a> igDialog 積み重ね順の構成

デフォルトで、ページ スタックの上部に `igDialog` ウィンドウが表示されます。そのデフォルト [`zIndex`](%%jQueryApiUrl%%/ui.igDialog#options:zIndex) 値は 1000 です。これは、1000 より大きな値で他の DOM 要素を変更しない場合、ダイアログがページ上部に表示されます。要素を別の要素の上または下に表示するために、このデフォルト値を変更する場合は、[`zIndex`](%%jQueryApiUrl%%/ui.igDialog#options:zIndex) 値を変更してこれを実行できます。

### 例

以下のコードは、[`zIndex`](%%jQueryApiUrl%%/ui.igDialog#options:zIndex) を変更する方法を示しています。

**JavaScript の場合:**

```js
$("#dialog").igDialog({
    zIndex: 1001
});
```

**C# の場合:**

```csharp
<%= Html.Infragistics()
    .Dialog()
    .ZIndex(1001)
    .Render()
%>
```


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [***igDialog* の概要**](igDialog-Overview.html): このトピックでは、`igDialog` コントロールの主な機能を紹介します。

- [***igDialog*** の追加](Adding-igDialog.html): このトピックでは、`igDialog` コントロールを Web ページに追加する方法について説明します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [API およびイベント](igdialog-event-reference.html#attaching-handlers-jquery): このサンプルでは、ダイアログ ウィンドウ コントロールのイベントを処理および API を使用する方法を紹介します。





 

 


