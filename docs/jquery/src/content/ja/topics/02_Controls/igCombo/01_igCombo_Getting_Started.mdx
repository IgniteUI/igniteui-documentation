<!--
|metadata|
{
    "fileName": "igcombo-getting-started",
    "controlName": "igCombo",
    "tags": ["Editing","Getting Started"]
}
|metadata|
-->

# igCombo の追加



##トピックの概要


###目的


`igCombo`™ は、jQuery または ASP.NET MVC を使用して動作するよう構成できます。このヘルプ トピックは、クライアントの JSON データおよびサーバーのビジネス オブジェクトのコレクションにバインドしている各環境で基本的な `igCombo` コントロールを設定する方法を示しています。

###前提条件


まず以下のトピックを読む必要があります。

-   [%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)
-   [%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)

##基本的な igCombo 実装を作成する


###概要


以下の手順は基本オプションの構成方法と、jQuery および ASP.NET MVC の両方を使用したデータへのバインド方法を示しています。

###プレビュー


以下は最終結果のプレビューです。

![](images/igCombo_Auto_Complete.png)

###要件

この手順を実行するには、以下が必要です。

-   この例を追加する Web サイトと Web ページ
-   Web サイト上の必要な JavaScript リソースおよび jQuery テーマ
-   Web ページ上の必要な JavaScript ファイルと CSS ファイルへの参照
-   (ASP.NET MVC) `Infragistics.Web.Mvc.dll` アセンブリへの参照

###概要


以下はプロセスの概念的概要です。

1.  `igCombo` のインスタンス化
2.  データへのバインド
3.  (オプション) 幅の構成
4.  (オプション) オートコンプリートの有効化

###手順

1. **`igCombo` をインスタンス化します。**

 a. **ターゲット要素を定義します。**

	Web ページで、`igCombo` コントロールのベース オブジェクトとしての役割を果たすターゲットの HTML 要素を定義し、その ID を設定します。これは ASP.NET MVC のオプション手順です。
	
	**HTML の場合:**
	
	```html
	<div id="comboTarget"></div>
	```
	
	`igCombo` をインスタンス化します。jQuery では、document ready JavaScript イベントを使用してコンボをインスタンス化できます。ASP.NET MVC では、%%ProductNameMVC%% を使用して、`IQueryable` データ ソースにバインドします。
	
	**HTML の場合:**
	
	```html
	<script type="text/javascript">
	     $(function () {
	          $("#comboTarget").igCombo({
	 
	          });
	      });
	</script>
	```
	
	 **ASPX の場合:**
	
	```csharp
	<%= Html.
	    Infragistics().
	    Combo().
	    ID("comboTarget").
	    Render() 
	%>
	```

2.  **データへバインドします。**

	**a. データを定義します。**
	
	jQuery では、この例は単純な JSON 配列にバインドします。このデータはページ要求の一部分として渡すか、Web サービスから返すことができます。ASP.NET MVC では、この例はサーバーの Controller クラスで定義され、View でモデルとして返される、Color オブジェクトのコレクションにバインドします。
	
	**HTML の場合:**
	
	```html
	var colors = [{ "Name": "Black" },{ "Name": "Blue" },{ "Name": "Brown" },{ "Name": "Red" },{ "Name": "White" },{ "Name": "Yellow" }];
	```
	
	**C# の場合:**
	
	```csharp
	public class DefaultController : Controller
	{
	     public ActionResult Index()
	     {
	        List<Color> colors = new List<Color>();
	        colors.Add(Color.Black);
	        colors.Add(Color.Blue);
	        colors.Add(Color.Brown);
	        colors.Add(Color.Red);
	        colors.Add(Color.White);
	        colors.Add(Color.Yellow);
	 
	        return View("default", colors.AsQueryable());
	     }
	}
	```

   **b. データ ソースを設定します。**

	dataSource オプションを使用してデータをコンボに提供します。ASP.NET MVC では、DataSource メソッドを使用して、Model の一部として渡されるデータにバインドします。
	
	**HTML の場合:**
	
	```html
	dataSource: colors
	```
	
	**ASPX の場合:**
	
	```csharp
	DataSource(this.Model as IQueryable<System.Drawing.Color>)
	```
	
	**c. text フィールドおよび value フィールドを構成します。**
	
	`igCombo` の `textKey` オプションおよび `valueKey` オプションを設定します。この単純な例では、`textKey` と `valueKey` は両方とも「Name」という同じオブジェクト値に設定されています。ただし、`textKey` および `valueKey` は 2 つの異なるフィールドとして設定できます。項目を正しく選択するには、`valueKey` を一意の値に設定する必要があります。たとえば、`valueKey` は各 Color オブジェクトの ID フィールドをポイントします。`textKey` は、どのフィールドを使用してドロップダウン リストでバインドされたアイテムを表すテキストを表示するかを決定します。
	
	>**注:** 「key」プロパティは、コンボのデータ ソースのどのプロパティを、コンボの選択された値および選択されたテキストとして使用するかを指定します。
	
	**HTML の場合:**
	
	```html
	textKey: "Name",
	valueKey: "Name",
	```
	
	**ASPX の場合:**
	
	```csharp
	TextKey("Name").
	ValueKey("Name").  
	```
	
	**d. (ASP.NET MVC) Render() を呼び出します。**
	
	%%ProductNameMVC%% `Combo` をインスタンス化する場合、他のオプションの構成がすべて終了した後、最後にレンダリング メソッドを呼び出します。これは、クライアントで `igCombo` をインスタンス化するのに必要な HTML および JavaScript を描画するメソッドです。
	
	**ASPX の場合:**
	
	```csharp
	Render()
	```

3.  **(オプション) 幅を構成します。**

    width オプションは igCombo のベース DOM 要素の width 属性を構成する文字列値を受け入れます。値は、対象の Web ブラウザーでサポートされている任意の HTML サイズ単位に設定できます。

    **HTML の場合:**

    ```html
    width: "200px"
    ```

    **ASPX の場合:**

    ```csharp
    Width("200px")
    ```

4.  **(オプション) オートコンプリートの有効化**

    autoComplete オプションを使用して、`igCombo` でオートコンプリートを有効にします。

    **HTML の場合:**

    ```html
    autoComplete: true
    ```

    **ASPX の場合:**

    ```csharp
    AutoComplete(true)
    ```

##コード例


###例の概要


以下の表は、以下に提供されたコード例を示しています。

<table class="table">
    <tbody>
        <tr>
            <th>例</th>

            <th>説明</th>
        </tr>

        <tr>
            <td>基本的な jQuery の実装</td>

            <td>jQuery でのデータへのバインド方法と基本オプションの設定方法を示します。</td>
        </tr>

        <tr>
            <td>基本的な ASP.NET MVC の実装</td>

            <td>%%ProductNameMVC%% を使用したデータへのバインド方法と基本オプションの設定方法を示します。</td>
        </tr>
    </tbody>
</table>

###コード例: 基本的な jQuery の実装

以下のコードは、以下のパラメーターを指定した jQuery を使用して、`igCombo` コントロールを作成・構成する方法を示します。


<table class="table">
	<thead>
		<tr>
			<th>データ ソース</th>
			<th>JSON データ</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>テキスト キー</td>
			<td>名前</td>
		</tr>
		<tr>
			<td>値キー</td>
			<td>名前</td>
		</tr>
		<tr>
			<td>幅</td>
			<td>200px</td>
		</tr>
		<tr>
			<td>AutoComplete</td>
			<td>true</td>
		</tr>
	</tbody>
</table>





**HTML の場合:**

```html
<script type="text/javascript">
    $(function () {
        var colors = [
            { "Name": "Black" },
            { "Name": "Blue" },
            { "Name": "Brown" },
            { "Name": "Red" },
            { "Name": "White" },
            { "Name": "Yellow" }
        ];
        $("#comboTarget").igCombo({
            dataSource: colors,
            textKey: "Name",
            valueKey: "Name",
            width: "200px",
			autoComplete: true
        });
    });
</script>
```

###コード例: 基本的な ASP.NET MVC の実装


以下のコードは、以下のパラメーターを指定した %%ProductNameMVC%% `Combo` コントロールを作成・構成する方法を示します。

<table class="table">
	<thead>
		<tr>
			<th>プロパティ</th>
			<th>値</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>データ ソース</td>
			<td>IQueryable</td>
		</tr>
		<tr>
			<td>スクリプト ファイル</td>
			<td>名前</td>
		</tr>
		<tr>
			<td>値キー</td>
			<td>名前</td>
		</tr>
		<tr>
			<td>幅</td>
			<td>300px</td>
		</tr>
		<tr>
			<td>AutoComplete</td>
			<td>true</td>
		</tr>
	</tbody>
</table>


**ASPX の場合:**

```csharp
<%= Html.
    Infragistics().
    Combo().
    ID("comboTarget").
    DataSource(this.Model as IQueryable<System.Drawing.Color>).
    ValueKey("Name").
    TextKey("Name").
    Width("300px").
	AutoComplete(true).  
    Render()
%>
```

**C# の場合:**

```csharp
public class DefaultController : Controller{ 
   public ActionResult Index()    {      
  		List<Color> colors = new List<Color>(); 
    colors.Add(Color.Black);
    colors.Add(Color.Blue);
    colors.Add(Color.Brown);
    colors.Add(Color.Red);  
    colors.Add(Color.White); 
    colors.Add(Color.Yellow);
    return View("default", colors.AsQueryable());   
 }}
```

##関連トピック


以下は、その他の役立つトピックです。

-   [%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)
-   [%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)

 

 


