<!--
|metadata|
{
    "fileName": "adding-igdialog",
    "controlName": "igDialog",
    "tags": ["Getting Started", "TypeScript", "AngularJS"]
}
|metadata|
-->

# igDialog の追加

## 概要

ここでは、`igDialog` コントロールを Web ページに追加する手順について説明します。`igDialog` では、[最小化]、[最大化]、[ピン固定]、[閉じる] ボタンなど、ヘッダーのボタンがすべて有効になるように構成されています。

コントロールのインスタンスを作成する方法はいくつかかあります。このトピックでは、一般的な jQuery UI メソッドの作成方法、(属性を使用することによる) jQuery モバイル メソッドの作成方法、および %%ProductNameMVC%% ダイアログを使用したコントロール インスタンスの作成方法を示します。

### プレビュー

次のスクリーンショットは最終結果のプレビューです。

![](images/03_Adding_igDialog_1.png)

## 手順

ここでは、`igDialog` コントロールを Web ページに追加する手順について説明します。

### 1.必要な JavaScript および CSS ファイルを参照します。

必要なファイルを追加する方法は 2 つあります。1 つは個別のスクリプトを使用した方法であり、もう 1 つは [Infragistics Loader コンポーネント](Using-Infragistics-Loader.html)を使用した方法です。

`igDialog` コントロールのインスタンスを作成する方法としては、ローダーを使用した方法をお勧めします。以下の各コードは、ローダー コンポーネントを設定して手動でローダーを作動させる方法を示したものです。

- **個々のファイルを使用して参照します。**

	**HTML の場合:**

	```html
	<script src="js/jquery.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>
    <script src="js/modules/infragistics.ui.dialog.js"></script>
	```

- **Infragistics ローダーを使用して参照します。**

	**HTML の場合:**

	```html
	<script src="js/jquery.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>
    <script src="js/infragistics.loader.js"></script>
	```

	**JavaScript の場合:**

	```js
	<script type="text/javascript">
        $.ig.loader({
            scriptPath: "../js/",
            cssPath: "../css/",
            resources: "igDialog",
        });
    </script>
	```

> **注:** %%ProductNameMVC%% ダイアログを使用する際には、***Infragistics.Web.Mvc*** dll への参照をプロジェクトに追加することを忘れないでください。


### 2.igDialog インスタンスを作成します。

次のコードでは、ヘッダーの `igDialog` コントロールをフルコントロールでで初期化する方法を示します。コードをご覧になれば分かるように、ここで定義されているプロパティは、既定値をオーバーライドする必要のあるプロパティだけです。[`showCloseButton`](%%jQueryApiUrl%%/ui.igDialog#options:showCloseButton) のようなプロパティは、デフォルトで `true` になるため、構成する必要はありません。

- **JavaScript におけるインスタンス化**

	- `DIV` HTML プレースホルダーを定義します。
	
		**HTML の場合:**
		
		```html
		<div id="igDialog1">
		    igDialog Content
		</div>
		```

	- JavaScript 初期化コード

		Infragistics ローダー コンポーネントを使用する場合、次のコードをローダーのコールバック関数に挿入しておくことができます。

		**JavaScript の場合:**

		```js
		$.ig.loader(function () {
	    	/* Initialization code here */
	    });
		```

		個々のファイルを参照する場合、次のコードで示すように、jQuery ready イベントにバインドできます。

		**JavaScript の場合:**

		```js
		$(function () {
	        $("#igDialog1").igDialog({
	            showMinimizeButton: true,
	            showMaximizeButton: true,
	            showPinButton: true,
	            width: "400px",
	            height: "500px"    
	        });
	    });
		```

`igDialog` を TypeScript で使用するには、以上のコードを使用してインスタンス化できます。そのためには TypeScript 用の %%ProductFamilyName%% と jQuery の型定義への参照パスを指定する必要があります。

    **TypeScript の場合:**
    ```typescript
    /// <reference path="jqueryui.d.ts" />
    /// <reference path="jquery.d.ts" />
    /// <reference path="igniteui.d.ts" />
    ```
    
>**注:** TypeScript の 1.5 以前のバージョンでは、コンパイラがコンパイル中にプログラムに依存関係を組み込むため、型定義への参照パスは必須です。1.5 以降のバージョンでは、単独の tsconfig.json ファイルで定義することができます。詳細は、[tsconfig.json wiki のページ](https://github.com/Microsoft/TypeScript/wiki/tsconfig.json)を参照してください。
		
> TypeScript の %%ProductName%% 定義を使用する詳細については、[「TypeScript で %%ProductName%% を使用」](using-ignite-ui-with-typescript.html)トピックを参照してください。

- **Razor の初期化**
	
	%%ProductNameMVC%% ダイアログは、HTML を表示すると同時に、コントロールを初期化する JavaScript コードを表示するものであるという点で他のコントロールとは異なります。この点を理解しておくことは非常に重要です。`igDialog` のコンテンツには任意の HTML マークアップを使用することができるため、このマークアップを最初に定義しておく必要があります。コードを定義しておけば、あとは、コントロールのすべての構成が %%ProductNameMVC%% によって自動的に定義されることになります。

	- `DIV` HTML プレースホルダーを定義します。

		**HTML の場合:**
		
		```html
		<div id="igDialog1">
	        igDialog Content
	    </div>
		```

		%%ProductNameMVC%% コード:
		
		**C# の場合:**
		
		```csharp
		@(Html
	        .Infragistics()
	        .Dialog()
	        .ContentID("igDialog1")
	        .ShowMinimizeButton(true)
	        .ShowMaximizeButton(true)
	        .ShowPinButton(true)
	        .Width("400px")
	        .Height("500px")    
	        .Render()
	    )
		```

> **注:** %%ProductNameMVC%% ダイアログの ID を設定したいという場合には、3 つの選択肢があります。詳細については、[プロパティ リファレンス](igDialog-Property-Reference.html)のトピックを参照してください。定義済みの HTML プレースホルダーに上記のサンプルと同じ ID (`igDialog1`) が設定されている場合、次のいずれかのメソッドを使用できます。

> `Dialog.ContentJquerySelector(“#igDialog1”)`- jQuery の場合と同じ形でセレクターを定義します。

> `Dialog.ContentID(“igDialog1”)` - # を付けずにセレクターを定義します。この場合、セレクターは、%%ProductNameMVC%% によって自動的に表示されます。

> `Dialog.ID(“igDialog1”)` - `ContentID(“igDialog1”)` と同じです。

> **注:** %%ProductNameMVC%% を使用して HTML DIV プレースホルダー コードを定義したい場合は、ダイアログ ヘルパーで示される次のメソッドを使用することができます。DIV HTML プレースホルダーの定義と同じ効果を実現したい場合は、次のメソッドを使用してください。 `Dialog.ContentHTML("<div id="igDialog1"> igDialog Content </div>")`

- **AngularJS でのインスタンス化**

以下のサンプルは、AngularJS ディレクティブを使用してダイアログ ウィンドウを宣言する方法を紹介します。

<div class="embed-sample">
   [%%SamplesEmbedUrl%%/dialog-window/angular](%%SamplesEmbedUrl%%/dialog-window/angular)
</div>

> AngularJS の %%ProductName%% 命令を使用する詳細については、[「AngularJS で %%ProductName%% を使用」](using-ignite-ui-with-angularjs.html)トピックを参照してください。

## igDialog の破棄

### 概要

igDialog をブラウザー DOM ツリーに追加すると、ターゲット igDialog HTML 要素が元の親要素から削除され、動的に作成された要素に挿入されます。これにより、igDialog の絶対位置を決めることができるようになります。ページからコントロールを動的に削除したい場合、最も楽な方法は、[`destroy`](%%jQueryApiUrl%%/ui.igDialog#methods:destroy) メソッドを使用することです。このメソッドを使用すると、当該の要素が DOM ツリーから削除されると同時に、ターゲット igDialog 要素が元の親要素に戻されることになります。

ウィジェットを作成し直したいときには、[`destroy`](%%jQueryApiUrl%%/ui.igDialog#methods:destroy) メソッドの使用が適切な場合もあります。一例を挙げると、他の削除操作では削除できないプロパティの値を動的に変更したいという場合がこれに当たります。たとえば、[`temporaryURL`](%%jQueryApiUrl%%/ui.igDialog#options:temporaryURL) は、動的に変更できないプロパティの　1 つです。

### コード

次の JavaScript スニペットは、`igDialog` [`destroy`](%%jQueryApiUrl%%/ui.igDialog#methods:destroy) メソッドを呼び出す方法を示します。

**JavaScript の場合:**

```js
$('#igDialog).igDialog("destroy");
```

## 関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igDialog の概要](igDialog-Overview.html): このトピックでは、`igDialog` コントロールの主な機能を紹介します。
- [igDialog の構成](Configuring-igDialog.html): このトピックでは、`igDialog` の主な機能をすべて取り上げ、それぞれの構成および使用法について説明します。
- [API リファレンス](igDialog-API-Reference.html): このトピックでは、`igDialog` API のカテゴリーを紹介します。ここでは、制御プロパティ、メソッド、イベント、および CSS クラスに関するリファレンス情報を提供し、具体的な API の使用例をいくつか示します。

### サンプル

このトピックについては、以下のサンプルも参照してください。

- [アイコン](%%SamplesUrl%%/dialog-window/icons): このサンプルでは、`igDialog` のアイコンを表示する方法を紹介します。
