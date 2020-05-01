<!--
|metadata|
{
    "fileName": "creating-basic-conditional-template",
    "controlName": "igTemplating Engine",
    "tags": ["How Do I","Templating"]
}
|metadata|
-->

# 基本的な条件付きテンプレートの作成

## <a id="topic-overview"></a>トピックの概要
### <a id="purpose"></a>目的

このトピックでは、テンプレート エンジンを使用して基本的な条件付きテンプレートを作成する方法を紹介します。

### <a id="required-background"></a>前提条件

以下の表は、このトピックを理解するための前提条件として必要なトピックを示しています。

- [テンプレート エンジンの参照の追加](Adding-igTemplating-References.html): このトピックでは、テンプレート エンジンを使い始めるために必要な最低限の JavaScript ファイルについて説明します。

- [テンプレート エンジンの概要](igTemplating-Overview.html): このトピックには、テンプレート エンジンでサポートされている機能に関する情報が含まれています。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [トピックの概要](#topic-overview)
    -   [目的](#purpose)
    -   [必要な背景](#required-background)
-   [基本的な条件付きテンプレートの作成](#basic-traditional-template)
    -   [概要](#introduction)
    -   [プレビュー](#preview)
    -   [前提条件](#prerequisites)
    -   [手順](#steps)
-   [%%ProductFamilyName%% CLI で基本条件付きテンプレートを含む igTreeGrid の作成](#adding-using-CLI)
-   [関連コンテンツ](#related-content)


## <a id="basic-traditional-template"></a>基本的な条件付きテンプレートの作成
### <a id="introduction"></a>概要

この例では、基本的な置換テンプレートを作成し、結果を HTML のテーブルに追加します。

### <a id="preview"></a>プレビュー

以下のスクリーンショットは最終結果のプレビューです。この例では、年齢の値が 21 未満のレコードは表示されません。例ではデータ ソースに 3 つのレコードがありますが、結果的に 2 つのレコードのみが表示されます。

![](images/%28Walkthrough%29Creating_Basic_Conditional_Template_1.png)

### <a id="prerequisites"></a>前提条件

この手順を実行するには、以下が必要です。

-   `テンプレート エンジン`で必要な最低限の js ファイルのセットを参照する空の HTML ページ。(詳細については、[igTemplating 参照の追加](Adding-igTemplating-References.html)を参照してください)。

### <a id="steps"></a>手順

以下の手順は、基本的な条件付きテンプレートの作成方法を示します。

1.  IG テンプレート エンジンを使用した行テンプレートの追加と適用

	1. サンプル データと行テンプレートをページに追加します。
	
		**JavaScript の場合:**
		
		```js
		<script type="text/javascript">
		var employees = [
		{ firstName: "Joseph", lastName: "Sommers", age: 17 },
		{  firstName: "Anna", lastName: "Paterson", age: 25}, 
		{  firstName: "Mark", lastName: "Smith", age: 22}];
		var template = '{{if ${age} > 21 }} <tr><td><b>First Name: </b>${firstName}</td><td><b>Last Name: </b>${lastName}</td><td><b>Age: </b>${age}</td></tr> {{/if}}';
		</script>
		```
		
		**HTML の場合:**
		
		```html
		<body>
		<table id="resultTable" style="border: 1px solid #000;"></table>
		</body>
		```
	
	2. テンプレートを適用し、結果を HTML テーブルに追加します
	
		**JavaScript の場合:**
		
		```js
		<script type="text/javascript">
		$(document).ready(function () {
		      var result = $.ig.tmpl(template, employees);
		      $('#resultTable').html(result);
		});
		</script>
		```

2.  (オプション) 結果を確認します。

	ファイルを保存し、ダブル クリックして結果をプレビューします。3 番目の行の年齢プロパティが 21 未満であるため、テンプレート中の適用されたチェックに従い、2 行のみが表示されます。

## <a id="adding-using-CLI"></a> %%ProductFamilyName%% CLI で基本条件付きテンプレートを含む igTreeGrid の作成

%%ProductFamilyName%% CLI を使用して基本条件付きテンプレートが構成された igGrid を簡単に追加できます。

%%ProductFamilyName%% CLI のインストール:

```
npm install -g igniteui-cli
```

%%ProductFamilyName%% CLI インストール後、%%ProductName%% プロジェクトを生成し、基本条件付きテンプレートを含む新しい igGrid コンポーネントを追加してプロジェクトをビルドおよび公開するには、以下のコマンドを使用します。

```
ig new <project name>
cd <project name>
ig add grid-templating newGridTemplating
ig start
```

このコマンドは、[「条件付きテンプレート」](%%SamplesUrl%%/templating-engine/conditional-templates)サンプルと同じテンプレートで構成された新しい igGrid を追加します。
 
すべての利用可能なコマンドおよび詳細な情報については、[「%%ProductFamilyName%% CLI の使用」](Using-Ignite-UI-CLI.html)のトピックを参照してください。

## <a id="related-content"></a>関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [テンプレート エンジンの概要](igTemplating-Overview.html): このトピックでは、IG テンプレート エンジンに関するすべての情報についてのトピックを示します。

- [代替行表示テンプレートの作成](Creating-an-Alternating-Rows-Template-%28igTemplating%29.html): このトピックでは、テンプレート エンジンを使用して代替行表示テンプレートを作成する方法を紹介します。

- [基本的な置換テンプレートの作成](Creating-Basic-Substitution-Template.html): このトピックでは、テンプレート エンジンを使用して基本的な置換テンプレートを作成する方法を紹介します。

- [複合プロパティ置換テンプレートの作成](Creating-Complex-Property-Substitution-Template.html): このトピックでは、テンプレート エンジンを使用して複合プロパティ置換テンプレートを作成する方法を紹介します。

- [デフォルト ステートメントを含む条件付きテンプレートの作成](Creating-Conditional-Template-Containing-Default-Statement.html): このトピックでは、テンプレート エンジンを使用して、デフォルト ステートメントを含む条件付きテンプレートを作成する方法を紹介します。

- [デフォルト ステートメントを含む複数条件付きテンプレートの作成](Creating-Multi-Conditional-Template-Containing-Default-Statement.html): このトピックでは、コード例を示し、テンプレート エンジンを使用して、デフォルト ステートメントを含む複数条件付きテンプレートを作成する方法を紹介します。

- [ネスト ブロック テンプレートの作成](Creating-Nested-Blocks-Template.html): このトピックでは、テンプレート エンジンを使用してネストしたブロック テンプレートを作成する方法を紹介します。

### サンプル

このトピックについては、以下のサンプルも参照してください。

- [条件付きテンプレート](%%SamplesUrl%%/templating-engine/conditional-templates): このサンプルは、Infragistics テンプレート エンジンを使用して条件付きのセル テンプレートをグリッドで使用する方法を紹介します。「単位価格」列のセルは上矢印または下矢印の画像を含みます。「差分価格」列は動的に作成して非表示されます。上矢印または下矢印の画像は、非表示される列の値と「単位価格」列の値の比較に基づいて適用されます。Infragistics テンプレート エンジンは「デルタ価格」列と「単位価格」列の値を比較します。「差分価格」列の値が「単位価格」値より大きい場合、緑色の上矢印を描画します。そうでない場合、赤色の下矢印を描画します。







 

 


