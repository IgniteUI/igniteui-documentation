<!--
|metadata|
{
    "fileName": "iggrid-updating-rowedittemplate",
    "controlName": "igGrid",
    "tags": ["Editing","Grids","Templating"]
}
|metadata|
-->

# 行編集テンプレートの概要 (igGrid)

## トピックの概要

### 目的

このドキュメントでは、行編集テンプレートを使用するときのプロパティとメソッドを説明します。

### 前提条件

以下は、このトピックを理解するための前提条件として必要なトピックと記事の一覧です。

- [igGrid の概要](igGrid-Overview.html): `igGrid` は、表形式データの表示および操作に使用される jQuery ベースのクライアント側グリッドです。そのライフサイクル全体はクライアント側に存在し、サーバー側の技術からは独立しています。

- [更新の概要 (igGrid)](igGrid-Updating.html): このトピックでは、`igGrid`™ コントロールの更新機能の使用方法を説明します。

- [igTemplating](Infragistics-Templating-Engine.html): このトピックでは、Infragistics® テンプレート エンジンの使用方法を説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [行編集テンプレートの定義](#definition)
-   [行編集テンプレートのプロパティのリファレンス](#property-reference)
-   [行編集テンプレートのイベントのリファレンス](#events-reference)
-   [関連コンテンツ](#related-content)



## <a id="introduction"></a> 概要

バージョン 12.2 以降、`igGrid` の更新機能には、行編集テンプレートが用意され、インライン編集より強力なポップアップ ダイアログのレコード編集機能が備わりました。

この機能は、グリッド更新機能の一部として実装します。`editMode` プロパティには、現在の 「row」 と 「cell」 以外に新しい値 「rowEditTemplate」 が加わりました。

<table class="table">
	<thead>
		<tr>
            <th>
プロパティ
			</th>
            <th>
タイプ
			</th>
            <th>
説明
			</th>
            <th>
デフォルト値
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
[editMode](%%jQueryApiUrl%%/ui.iggridupdating#options:editMode)
			</td>
            <td>
“row|cell|**rowEditTemplate**|none|null”
			</td>
            <td>
`editMode` プロパティには、新しい値 「rowEditTemplate」 を追加しました。
			</td>

            <td>
                <ul>row</ul>
            </td>
        </tr>
    </tbody>
</table>



行テンプレートは、ダイアログ ウィンドウとしてレンダリングします。以下に例を示します。

![](images/igGrid_Updating_RowEditTemplate_1.png)

完了とキャンセルをクリックすると、`editMode`： 「row」 の使用時と同じ結果が得られます。

`startEditTriggers` Updating プロパティで指定したトリガーで行編集テンプレートが開きます (*click*、*dblClick*、*enter*、*F2* など)。

行編集テンプレートを自動的に生成するとき、列のデータ タイプが基準になります。行編集テンプレートは、更新機能に `columnSettings` を読み取り、レンダリングするエディターをこれで決めます。

無効なエディター (`readOnly`: true) のレンダリングは、`showReadonlyEditors` プロパティで制御します。`showReadonlyEditors` が *true* のとき、無効な列は行編集ダイアログ ウィンドウにレンダリングされますが、機能はしません。`showReadonlyEditors` が *false* のとき、`readOnly` 列は行エディター ウィンドウのエディターにレンダリングされません。

行編集テンプレートには検証統合機能があります。検証は、列設定の`検証`プロパティを読み取って行います。エンド ユーザーが無効な値を入力すると検証メッセージは行編集テンプレートにインラインでレンダリングされます。

パブリック API メソッド `startEdit` と `closeEdit` では、行編集テンプレートを開閉できます。



## <a id="definition"></a> 行編集テンプレートの定義

このセクションでは、行編集テンプレートのさまざまな定義方法を説明します。

行テンプレートは、以下の方法で定義できます。

1.  自動的に生成された行編集テンプレート

	行編集テンプレートは、列のデータ タイプを基に自動的に生成されます。その場合、行編集テンプレートは更新機能の `columnSettings` で、レンダリングするエディターの種類を決定します。

	**JavaScript の場合:**
	
	```js
	{
	    name: "Updating",
	    enableAddRow: true,
	    editMode: "rowedittemplate",
	    enableDeleteRow: true,
	    rowEditDialogRowTemplateID: "rowEditDialogRowTemplate1",
	    columnSettings:
	    [
	        {
	            columnKey: "OrderID",
	            readOnly: true
	        },
	        {
	            columnKey: "ShipName",
	            defaultValue: names[1],
	            editorOptions: {
	                button: "dropdown",
	                listItems: names,
	                readOnly: true,
	                dropDownOnReadOnly: true
	            }
	        }
	    ]
	}
	```

2.  `rowEditDialogRowTemplate` プロパティによりテンプレート文字列として指定します。

	`rowEditDialogRowTemplate` を指定すると、行編集ダイアログにカスタム テンプレートを使用します。
	
	テンプレート内では、`${headerText}` は列のヘッダー テキストを参照し、`${dataKey}` は列キーを参照します。
	
	このプロパティは、行編集ダイアログのフォーマットとスタイル設定に使用できます。
	
	**ASPX の場合:**
	
	```csharp
	<%= (Html.Infragistics().Grid(Model).ID("grid1").Height("400px").Width("100%")”
		// Grid Definition
		.Features(features =>
		{features.Updating()                
		.EditMode(GridEditMode.rowEditTemplate)
		.ShowReadonlyEditors(true)
		.StartEditTriggers(GridStartEditTriggers.Click)
		.RowEditDialogContainment("owner")
		.RowEditDialogRowTemplate("<tr><td>${headerText}</td><td data-key='${dataKey}'> {{if ${headerText} =='On Site'}} <input type='checkbox' />{{else}}<input />{{/if}}</td></tr>")
		.RowEditDialogWidth("400px");
		})
		.DataBind()
		.Render()%>
	```
	
	**JavaScript の場合:**
	
	```js
	features: [
	{ 
		name: "Updating",
		startEditTriggers: 'enter dblclick',    
		editMode: 'rowedittemplate',      
		showReadonlyEditors: false,      
		rowEditDialogRowTemplate:'<tr><td>${headerText}</td> 
			<td data-key='${dataKey}'> 
				{{if /${headerText} =='OnSite'}} 
					<input type='checkbox' />
				{{else}}
					<input />
				{{/if}} 
			</td>
			</tr>'
	},
	```

3.  `RowEditDialogRowTemplateID` プロパティでテンプレート要素を参照します。

	`RowEditDialogRowTemplateID` プロパティは、`x-jquery-tmpl` テンプレートの ID を指します。
	
	テンプレート内で `${headerText}` は列のヘッダー テキストを参照し、`${dataKey}` は列キーを参照します。
	
	このプロパティは、行編集ダイアログのフォーマットとスタイル設定に使用できます。
	
	`rowEditDialogRowTemplate` と `rowEditDialogRowTemplateID` の両方を設定すると、`rowEditDialogRowTemplateID` を使用します。
	
	**JavaScript の場合:**
	
	```js
	<style type="text/css">
	        .tableBackGround
	        {
	            background-color: #FF7283;
	        }
	        .labelBackGround
	        {
	            background-color: #FFE96D;
	        }
	    </style>
	    <script id="rowEditDialogRowTemplate1" type="text/x-jquery-tmpl">      
	          <tr class="tableBackGround">                  
	                <td class="labelBackGround"> ${headerText}
	                </td>
	                <td data-key='${dataKey}'>
	                      <input /> 
	                </td>
	          </tr>
	    </script>
	//Inside the grid Definition
	..    
	features: [      
	{
	    name: 'Updating',
	    startEditTriggers: 'enter dblclick',
	    editMode: 'rowedittemplate',
	       rowEditDialogContainment: "owner",
	    showReadonlyEditors: false,
	    rowEditDialogRowTemplateID:'rowEditDialogRowTemplate1',
	    columnSettings: [{
	          columnKey: "ProductID",
	          editorType: 'numeric',
	          readOnly: true
	    }, {
	          columnKey: "ProductDescription",
	          editorOptions: { readOnly: true }
	    }, {
	          columnKey: "DateCol",
	          editorType: 'datepicker',
	          validation: true,
	          editorOptions: { required: true }
	    }, {
	          columnKey: "UnitPrice",
	          editorType: 'currency',
	          validation: true,
	          editorOptions: { button: 'spin', required: true }
	    }]
	}]
	…
	```



## <a id="property-reference"></a> 行編集テンプレートのプロパティのリファレンス

このセクションでは、`igGrid` コントロールの更新機能を使用するときの行編集テンプレート関連の各種プロパティについて説明します。

以下は、非バインド列のプロパティの目的と機能をまとめました。

- [showReadonlyEditors](%%jQueryApiUrl%%/ui.iggridupdating#options:showReadonlyEditors)

	このプロパティは、特定の列で編集が無効なときに使用します (`readOnly: true`)。

	デフォルトで TRUE です。無効な列は行編集ダイアログ ウィンドウにレンダリングされますが、機能はしません。

	FALSE の場合、無効な列はエディターにはレンダリングされません。

- [rowEditDialogContainment](%%jQueryApiUrl%%/ui.iggridupdating#options:rowEditDialogContainment)

	このプロパティはダイアログの親コンテナーを設定します。デフォルト値は 「owner」 で、行編集ダイアログは、グリッド領域でのみドラッグできます。

	このプロパティを 「window」 に設定すると、ダイアログはウィンドウのどこででもドラッグできます。

- [rowEditDialogRowTemplate](%%jQueryApiUrl%%/ui.iggridupdating#options:rowEditDialogRowTemplate)

	このプロパティは、行編集ダイアログの行のカスタム テンプレートがある文字列値です。テンプレート内で `${headerText}` は列のヘッダー テキストを参照し、`${dataKey}` は列キーを参照します。このプロパティは、行編集ダイアログのフォーマットとスタイル設定に使用できます。

	**JavaScript の場合:**
	
	```js
	<tr>
	    <td>${headerText}</td>
	    <td data-key='${dataKey}'><input /></td>
	</tr>
	```
	
	**JavaScript の場合:**
	
	```js
	features: [
	{ 
		name: "Updating",
		startEditTriggers: 'enter dblclick',    
		editMode: 'rowedittemplate',      
		showReadonlyEditors: false,      
		rowEditDialogRowTemplate: 
		'<tr><td>${headerText}</td>
			<td data-key='${dataKey}'> 
			{{if /${headerText} =='OnSite'}} 
				<input type='checkbox' />
			{{else}}
				<input />
			{{/if}} 
		</td></tr>'
	},
	```

- [rowEditDialogRowTemplateID](%%jQueryApiUrl%%/ui.iggridupdating#options:rowEditDialogRowTemplateID)

	このプロパティは、x-jquery-tmpl テンプレートの ID を指します。`rowEditDialogRowTemplate` と `rowEditDialogRowTemplateID` の両方を設定すると、`rowEditDialogRowTemplateID` を使用します。このプロパティは、行編集ダイアログのフォーマットとスタイル設定に使用できます。
	
	**JavaScript の場合:**
	
	```js
	<style type="text/css">
        .tableBackGround
        {
            background-color: #FF7283;
        }
        .labelBackGround
        {
            background-color: #FFE96D;
        }
	</style>
	<script id="rowEditDialogRowTemplate1" type="text/x-jquery-tmpl">      
		<tr class="tableBackGround">                  
		    <td class="labelBackGround"> 
		             ${headerText}
		    </td>
		    <td data-key='${dataKey}'>
		          <input /> 
		    </td>
		</tr>
	</script>
	```

- [rowEditDialogOkCancelButtonWidth](%%jQueryApiUrl%%/ui.iggridupdating#options:rowEditDialogOkCancelButtonWidth)

	このプロパティは、行編集ダイアログの 「完了」 ボタンと「キャンセル」ボタンの幅をピクセル単位で制御します。各ボタンの幅を指定します。
	
	デフォルト値は 100 です。文字列 (“100px”) か数字 (100) を指定できます。
	
	![](images/igGrid_Updating_RowEditTemplate_2.png)

- [rowEditDialogHeight](%%jQueryApiUrl%%/ui.iggridupdating#options:rowEditDialogHeight)

	このプロパティは行編集ダイアログの高さをピクセル単位で制御します。
	
	デフォルト値は 350 です。文字列 (“350px”) か数字 (350) を指定できます。
	
	![](images/igGrid_Updating_RowEditTemplate_3.png)

- [rowEditDialogWidth](%%jQueryApiUrl%%/ui.iggridupdating#options:rowEditDialogWidth)

	このプロパティは行編集ダイアログの幅をピクセル単位で制御します。
	
	デフォルト値は 370 です。文字列 (“370px”) か数字 (370) を指定できます。
	
	![](images/igGrid_Updating_RowEditTemplate_4.png)

- [rowEditDialogFieldWidth](%%jQueryApiUrl%%/ui.iggridupdating#options:rowEditDialogFieldWidth)

	このプロパティは行編集ダイアログ フィールドの幅をピクセル単位で制御します。
	
	指定できる値は数字で、デフォルト値は 140 です。
	
	![](images/igGrid_Updating_RowEditTemplate_5.png)

- [startEditTriggers](%%jQueryApiUrl%%/ui.iggridupdating#options:startEditTriggers)

	`startEditTriggers` updating プロパティで指定したトリガーで行編集テンプレートが開きます (*click*、*dblClick*、*enter*、*F2* など)。

- [doneLabel](%%jQueryApiUrl%%/ui.iggridupdating#options:doneLabel)

	このプロパティは、行編集ダイアログの *完了* ボタンのテキストを制御します。

- [cancelLabel](%%jQueryApiUrl%%/ui.iggridupdating#options:cancelLabel)

	このプロパティは、行編集ダイアログの*キャンセル* ボタンのテキストを制御します。



## <a id="events-reference"></a> 行編集テンプレートのイベントのリファレンス

このセクションでは、`igGrid` コントロールの更新機能を使用するときの行編集テンプレート関連の各種プロパティについて説明します。

以下の表は、行編集テンプレートを有効にしたときに発生するイベントをまとめたものです。

イベントはテンプレートの表示時や非表示時に発生します。

テンプレート コンテンツをレンダリングすると、イベントの引数には編集する現在のデータ行を取り込みます。これで、デベロッパはレンダリングを完全に制御できます。

ハンドラー関数は引数として `evt` と `ui` を受け取ります。`ui.owner` は `igGridUpdating` への参照情報、`ui.dialogElement` は、行変数ダイアログ DOM 要素への参照を受け取るために使用できます。

現在のデータ行への参照を取得するには、`ui.dialogElement.data('tr')` を使用してください。

<table class="table table-bordered">
	<thead>
		<tr>
            <th>
イベント
			</th>
            <th>
説明
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
[rowEditDialogOpening](%%jQueryApiUrl%%/ui.iggridupdating#events:rowEditDialogOpening)
			</td>
            <td>
このイベントは行編集ダイアログが開く前に発生します。このイベントはキャンセルできます。 <br />
                
**JavaScript の場合:**
<pre>
	<code>
	$("#grid1").live("iggridupdatingrowEditDialogOpening ", function (event, ui) {
		var gridUpdating = ui.owner;
		var gridID = ui.owner.element.context.id;
		var dialogWindow = ui.dialogElement;
		var currDataRow = ui.dialogElement.data('tr');
	});
	</code>
</pre>
			</td>
        </tr>

        <tr>
            <td>
[rowEditDialogOpened](%%jQueryApiUrl%%/ui.iggridupdating#events:rowEditDialogOpened)
			</td>
            <td>
このイベントは行編集ダイアログが開いてから発生します。
			</td>
        </tr>

        <tr>
            <td>
[rowEditDialogContentsRendering](%%jQueryApiUrl%%/ui.iggridupdating#events:rowEditDialogContentsRendering)
			</td>
            <td>
このイベントは行編集ダイアログのコンテンツのレンダリングの前に発生します。このイベントはキャンセルできます。
			</td>
        </tr>

        <tr>
            <td>
[rowEditDialogContentsRendered](%%jQueryApiUrl%%/ui.iggridupdating#events:rowEditDialogContentsRendered)
			</td>
            <td>
このイベントは行編集ダイアログのコンテンツのレンダリングのあとに発生します。
			</td>
        </tr>

        <tr>
            <td>
[rowEditDialogClosing](%%jQueryApiUrl%%/ui.iggridupdating#events:rowEditDialogClosing)
			</td>
            <td>
このイベントは行編集ダイアログが閉じる前に発生します。このイベントはキャンセルできます。
			</td>
        </tr>

        <tr>
            <td>
[rowEditDialogClosed](%%jQueryApiUrl%%/ui.iggridupdating#events:rowEditDialogClosed)
			</td>
            <td>
                <ul>このイベントは行編集ダイアログが閉じてから発生します。</ul>
            </td>
        </tr>
    </tbody>
</table>



## <a id="related-content"></a> 関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [行編集テンプレートの構成](igGrid-Updating-RowEditTemplate-Configuring.html): このトピックでは、行編集テンプレートと組み合わせた `igGrid™` コントロールの更新機能の使用方法を説明します。

### サンプル

このトピックについては、以下のサンプルも参照してください。

- [行編集テンプレート](%%SamplesUrl%%/grid/row-edit-template): このサンプルでは、`igGrid` における行編集テンプレートの構成方法を紹介します。

- [階層グリッド行編集テンプレート](%%SamplesUrl%%/hierarchical-grid/row-edit-template): このサンプルでは、`igHierarchicalGrid` における行編集テンプレートの構成方法を紹介します。



 

 


