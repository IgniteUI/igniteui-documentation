<!--
|metadata|
{
    "fileName": "using-ignite-ui-with-angularjs",
    "controlName": [],
    "tags": []
}
|metadata|
-->

#AngularJS での %%ProductName%% の使用

##トピックの概要

このトピックでは、AngularJS 用に %%ProductName%% ディレクティブを使用する方法の概要を説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念、トピック、および記事の一覧です。

-   トピック
    -   [%%ProductName%% の概要](IgniteUI-for-jQuery-Overview.html)

-   概念
    -   [AngularJS の概念的な概要](https://docs.angularjs.org/guide/concepts)
    -   [AngularJS の TwoWay データ バインディング](https://docs.angularjs.org/tutorial/step_04)

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
    -   [ディレクティブ](#directives)
-   [**オプション**](#options)
    -   [宣言によるオプション](#declarative-options)
    -   [スコープ オプション](#scope-options)
    -   [イベント](#events)
    -   [オプション評価](#options-evaluation)
-   [**%%ProductName%% を使用した Angular アプリケーションの作成**](#creating-angular-app)
    -   [要件](#requirements)
    -   [手順](#steps)
-   [**データ バインディング**](#data-binding)
    -   [TwoWay データ バインディング](#two-way-data-binding)
    -   [OneWay データ バインディング](#one-way-data-binding)
-   [**テンプレート**](#templates)
    -   [宣言によるテンプレートの設定](#setting-templates-declaratively)
-   [**HTML コンテンツでの制御**](#controls-with-html-content)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)

## <a id="introduction"></a>概要


AngularJS アプリケーションで %%ProductName%%® コントロールを使用する場合に、[AngularJS 用の %%ProductName%%® ディレクティブ](https://github.com/IgniteUI/igniteui-angularjs)によりデータ バインディングと宣言型プログラミングを利用できます。

各ディレクティブは、`igniteui-angular.js` ファイル内の *'igniteui-directives'* と呼ばれる個別のモジュールとして利用できます。それらは HTML マーカーで AngularJS を拡張し、AngularJS により提供されるコンテキスト (スコープ) 内で、%%ProductName%% コントロールを初期化しバインディングします。

>**注:** ディレクティブは、ロードされた %%ProductName%% ウィジェットに基づき動的に登録されます。したがって、正しいスクリプトのみがページにロードされるように、できれば未使用のウィジェットをロードしないように注意してください。

## <a id="directives"></a>ディレクティブ

Angular は、1 つのビヘイビアに対するディレクティブの記述や異なる宣言的なアプローチを正規化する非常に柔軟な構文を提供するため、複数の方法でコントロールとそのオプションを初期化することができます。Angular アプリケーションで %%ProductName%% の初期化を可能にする複数のオプションがあります。カスタム タグ要素の `<control-name>`、`<div data-control-name>` のような属性、またはクラス名 `<div class=”control-name”>` を使用できます。これらの各アプローチは、コントロール ディレクティブと一致し、同じ結果を得ることができます。つまり、以下の各定義のすべてが `igRating` コントロールを初期化します。

**HTML の場合:**

```html
<ig-rating></ig-rating>
<div data-ig-rating></div>
<div class="ig-rating"></div>
```

読みやすくするために、クラス上でタグや属性を使用することをお勧めします。Angular は他の区切り文字を正規化しますが、%%ProductName%% の Angular ディレクティブではコントロール名をダッシュで区切り、小文字で記述することもお勧めします。

## <a id="options"></a>オプション


ディレクティブ用に提供されるすべてのオプションは、作成用の %%ProductName%% ウィジェットでの使用を意図しています。したがって適用可能なすべてのオプションは、[%%ProductName%% API リファレンス](%%jQueryApiUrl%%/) で確認することができます。オプションの定義には、ビューでの宣言またはスコープ内でのオブジェクトという 2 つの 相互排他的な方法があります。

### <a id="declarative-options"></a>宣言によるオプション

ビュー内のオプションは、メイン タグの属性、または複合型オプションの場合の子タグとして提供されます。

>**注:** 宣言によるオプションは、ダッシュで区切り、小文字で記述する必要があります。

たとえば、`igRating` での値の設定は次のようになります。

**HTML の場合:**
```html
<ig-rating value="4" value-as-percent="false"></ig-rating>
```
また、`igGrid` に対する列構成の定義は次のようになります。

**HTML の場合:**
```html
<ig-grid id="grid1" data-source="northwind" auto-generate-columns="false">
    <columns>
        <column key="ProductID" header-text="Product ID" width="50px" data-type="number"></column>
        <column key="ProductName" header-text="Name"  width="250px"  data-type="string"></column>
        <column key="QuantityPerUnit" header-text="Quantity per unit"  width="200px" data-type="string"></column>
        <column key="UnitPrice" header-text="Unit Price"  width="100px" data-type="number"></column>
    </columns>
</ig-grid>
```
親タグの名前は、複合オプションまたは配列の名前 (この場合は、[`columns`](%%jQueryApiUrl%%/ui.iggrid#options:columns)) と一致する必要があります。配列の場合、子タグは名前を明確に引き継がれることがなく任意であることが可能ですが、複合オブジェクトの設定では、子オブジェクトも一致している必要があります。たとえば、[`restSettings`](%%jQueryApiUrl%%/ui.iggrid#options:restSettings) には、以下のように設定できる `create` と `remove` のオプションがあります。

**HTML の場合:**
```html
<rest-settings>
    <create url="/api/product/" batch="false"></create>
    <remove url="/api/product/" batch="true"></remove>
</rest-settings>
```
### <a id="scope-options"></a>スコープ オプション

最も一般的にコントロールの初期化で取り上げられることの多いスコープ オプションでは、全体のオプション オブジェクトがスコープ内で定義されます。ディレクティブは、スコープ オブジェクト プロパティに属性ディレクティブを一致させ、それを割り当てることでスコープ オプションを確認します。たとえば、以下の `igTree` ディレクティブを持つ場合:

**HTML の場合:**
```html
<div ig-tree="treeOptions"></div>
```
オプションはコントローラで初期化されます。

**JavaScript の場合:**
```js
app.controller('treeController',
            ['$scope', 'productCategories',
    function ($scope,   productCategories) {
        $scope.treeOptions = {
            dataSource: productCategories.data,
            bindings: {
                textKey: "Name",
                valueKey: "ProductCategoryID",
                childDataProperty: "ProductSubcategories"
            }
        };
    }]);
```
これらはユーザーにとって親しみやすいオプションで、AngularJS でビューからの正規化が必要ないだけでなく、[%%ProductName%% API](%%jQueryApiUrl%%/ui.igtree) をコントローラーで簡単に使用できるようにします。

### <a id="events"></a>イベント

[%%ProductName%% イベントを処理](Using-Events-in-IgniteUI-for-jQuery.html)する標準的な方法は他にもありますが、ディレクティブは `event-` の接頭辞を持つ属性として、宣言的に定義されたハンドラをバインドすることもできます。イベントの名前は、オプションで **小文字およびダッシュで区切り、小文字で記述する**命名規則に従います。たとえば、以下のコードリストは `igVideoPlayer` の [`ended`](%%jQueryApiUrl%%/ui.igvideoplayer#events:ended) イベントを宣言する方法を示しています。

**HTML の場合:**
```html
<ig-video-player id="video1" event-ended="videoEnded"></ig-video-player>
```
**JavaScript の場合:**
```js
app.controller('videoController', ['$scope',
function ($scope) {
    $scope.videoEnded = function (e, args) {
        //handle event, use arguements
    }
}]);
```
>**注:** %%ProductName%% にはユーザーとの対話に関連した多くのイベントがありますが、コントロールを API により操作する場合は起動しないように注意してください。ディレクティブはデータのバインドにAPI メソッドを使用します。たとえば、`igCombo` コントロールの [`activeItemChanged`](%%jQueryApiUrl%%/ui.igcombo#events:activeItemChanged) イベントは、バインドされた `ngModel` が変更されると起動されません。

### <a id="options-evaluation"></a>オプション評価

現在、ディレクティブに提供されている各オプションは、Angular の式を使用してバインドを一回だけサポートします。これは式の値が、初期化のウィジェットに渡される前に、スコープ内で一度評価されることを意味します。スコープをオプションに正しく割り当てるには、値の内部で Angular の式構文を使用します。[$eval](https://docs.angularjs.org/api/ng/type//$rootScope.Scope#$eval) ではスコープの範囲内で評価できるすべてを、使用することができます。たとえば 0～10 の値で、`igRating` 値 (デフォルトではパーセント ベース) を割り当てる場合:

**JavaScript の場合:**
```js
app.controller('ratingController', ['$scope',
function ($scope) {
    $scope.averageRating = 7.5;
}]);
```
10 で割ります:

**HTML の場合:**
```html
<ig-rating value="{{averageRating/10}}"></ig-rating>
```

![](images/Using_Ignite_UI_with_AngularJS_1.png)

## <a id="creating-angular-app"></a>%%ProductName%% を使用した Angular アプリケーションの作成

### <a id="requirements"></a>要件

必要なリソースを考慮する場合は、[%%ProductName%% での JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html) のドキュメントで説明するように、同じ要件とオプションが適用され、その後に %%ProductName%% Angular ディレクティブ モジュールをロードします。アプリケーションにはいくつかのスタイルと共に、以下も含める必要があります。

-   [jQuery](http://www.jquery.com/)1.7 以降
-   [jQuery UI](http://jqueryui.com/) 1.8 以降
-   [AngularJS](http://www.angularjs.org/)1.0 以降
-   [%%ProductName%%](http://www.igniteui.com/)13.1 以降

### <a id="steps"></a>手順

1.  [%%ProductName%% のテーマと構造](Deployment-Guide-Styling-and-Theming.html) ファイルを含めて開始します。

    **HTML の場合:**
	```html
	<!-- %%ProductName%% Required Combined CSS Files -->
	<link href="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
	<link href="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/css/structure/infragistics.css" rel="stylesheet" />
	```

2.  JavaScript ライブラリを追加します ([modernizr](http://modernizr.com/) はオプションです)。

    **HTML の場合:**
	```html
	<!-- JavaScript Library Dependencies -->
	<script src="http://modernizr.com/downloads/modernizr-latest.js"></script>
	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.min.js"></script>
	```

3.  %%ProductName%% とディレクティブ モジュールを含めます。必要に応じてカスタム ダウンロードを使用しますが、[いずれかの方法で %%ProductName%% を含めることもできます](Deployment-Guide-JavaScript-Resources.html)。

    **HTML の場合:**
	```html
	<!-- %%ProductName%% Required Combined JavaScript Files -->
	<script src="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/js/infragistics.core.js"></script>
	<script src="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/js/infragistics.lob.js"></script>
	<script src="igniteui-angular.min.js"></script>
	```

4.  すべてのディレクティブがモジュール内にすべてのディレクティブをロードした時点で、独自の依存関係を明確にして、Angular のコントローラ、ファクトリ、プロバイダなどを定義できます。

    **JavaScript の場合:**
	```js
	var app = angular.module('igniteui-sample', ['igniteui-directives']);
	app.controller('sampleController', ['$scope', function($scope) {
		$scope.header = 'Hello World!';
	}]);
	```
5.  ビューで、Angular に対しアプリケーションの実行場所を指示し、コントローラにアプリケーションの使用を指示する必要があります。例：

	**HTML の場合:**
	```html
	<body class="container" ng-app="igniteui-sample" ng-controller="sampleController">
		<!--...-->
	</body>
	```

6.  最後に、`igDialog` などの使用するディレクティブを追加します。

    **HTML の場合:**
	```html
	<body class="container" ng-app="igniteui-sample" ng-controller="sampleController">
		<ig-dialog id="dialog1" header-text="{{header}}" height="325px"></ig-dialog>
	</body>
	```
    ![](images/Using_Ignite_UI_with_AngularJS_2.png)

## <a id="data-binding"></a>データ バインディング


%%ProductName%% ディレクティブの主な利点の 1 つは、初期化の統合だけでなくデータ バインディングのサポートがあります。ディレクティブは自動的に AngularJS のウォッチャーを初期化時に提供される各ソースに割り当てます。そのため、スコープから`dataSource` オプションまたは `data-source` 属性を必要なプロパティに設定するだけで、データ バインディングを有効にできます。

**HTML の場合:**
```html
<ig-grid id="grid1" data-source="northwind" primary-key="ProductID" auto-generate-columns="true"></ig-grid>
```

ここでデータは、[factory provider](https://docs.angularjs.org/guide/providers) を使用してスコープ内に挿入され、次のように定義されます。

**JavaScript の場合:**

    app.controller('gridController',
                ['$scope', 'northwind',
        function ($scope,   northwind) {
            $scope.northwind = northwind.data;
    }]);

### <a id="two-way-data-binding"></a>TwoWay データ バインディング

データを消費し操作できるコントロールを含む最も一般的なケースでのコントロールの場合は、TwoWay データ バインディングがサポートされます。TwoWay データ バインディングでは、対象のデータ ソースが変更された場合に、コントロール内部のデータ値が更新されます。また、変更がコントロールからビューで実行された場合、対象のデータの同期も維持されます。TwoWay データ バインディングをサポートする次のコントロールがあります:

-   igGrid
-   igCombo
-   igEditors
-   igTree

>**注:** 一部のコントロールでは、`igGrid` の Updating 機能のように、TwoWay データ バインディングで追加機能を有効にする必要があります。

### <a id="one-way-data-binding"></a>OneWay データ バインディング

その他のメイン グループは、主にデータの可視化コントロールで構成されるコントロールで情報を編集することができませんが、バインドされたデータ ソース内の変更を引き続き反映します。この場合、ディレクティブは OneWay コネクションを作成し、データの変更内容をビュー内のウィジェットに伝播します。このグループ内には次のコントロールが含まれます:

-   igHtmlEditor
-   igDataChart
-   igSparkline
-   igFunnelChart

## <a id="templates"></a>テンプレート

多数の %%ProductName%% のコントロールでは、[Infragistics テンプレート エンジン](igTemplating-Overview.html) によって処理されるテンプレートをデフォルトでサポートしています。%%ProductName%%® Templating Engine は、HTML 要素のセットにコンテンツ テンプレートを適用するための JavaScript ライブラリです。これは条件付きのロジックとネストされたテンプレートをサポートします。エンジンは、提供されたデータ内の対応するプロパティ値の置き換えに、`${property}` 表記を使用します。たとえば、以下のように、列の値をスタイルとフォーマット用に追加のマークアップでラッピングします。

**HTML の場合:**
```html
<ig-grid>
    <columns>
        <column key="UnitPrice" header-text="Unit Price"  width="100px" data-type="number"
                template="€ <strong> ${UnitPrice} </strong>"></column>
    </columns>
</ig-grid>
```

![](images/Using_Ignite_UI_with_AngularJS_3.png)

または、イメージ列のように、セルに対して追加の HTML マークアップを設定します。

**JavaScript の場合:**
```js
app.controller('gridController',
            ['$scope', 'northwindEmployees',
    function ($scope,   northwindEmployees) {
        $scope.gridOptions = {
            dataSource: $scope.northwindEmployees.data,
            columns: [
                   //...
                   { headerText: "PhotoPath", 
                   key: "PhotoPath", 
                   dataType: "string",  
                   template: '<img class="gallery-image" src="${PhotoPath}" />' 
               }
            ],
            // ...
        };
    }]);
```

![](images/Using_Ignite_UI_with_AngularJS_4.png)

### <a id="setting-templates-declaratively"></a>宣言によるテンプレートの設定

テンプレート エンジンは、**条件付のテンプレート**に二重の波括弧 (`{{if condition}}` など) を使用しますが、この括弧はAngular の式で評価に使用されます。したがって、このようなテンプレートを宣言による初期化で使用すると、**競合の原因になる場合があります**。条件付テンプレートを宣言的に提供する方法や、テンプレートのプロセスをカスタマイズする方法の詳細は、[AngularJS を使用した条件付きテンプレート化および高度なテンプレート化](Conditional-and-Advanced-Templating-with-AngularJS.html) のトピックを参照してください。

**関連項目:**[igGrid のサンプル](http://igniteui.github.io/igniteui-angularjs/samples/igGrid.html)

## <a id="controls-with-html-content"></a>HTML コンテンツでの制御

HTML のコンテンツをコントロールに提供するには （またオプションとして構文解析されないようにするには)、`<content>` エレメント内で構文解析されないようにラップおよびマークアップする必要があります。以下の例は、追加のマークアップを `igDialog` コントロールに追加する方法を示します。

**HTML の場合:**
```html
<ig-dialog id="dialog1" header-text="Foo" height="300px">
      <content>
      <p>
            <img style="width: 220px" src="http://www.igniteui.com/images/samples/dialog-window/content.jpg" />
      </p>
      </content>
</ig-dialog>
```

![](images/Using_Ignite_UI_with_AngularJS_5.png)

この手法は、`igDialog`、`igLayoutManager`、および `igTileManager` などのコントロールに対し、追加のマークアップを適用します。

**関連項目:**[igDialog Angular のサンプル](http://igniteui.github.io/igniteui-angularjs/samples/igDialog.html)

## <a id="related-content"></a>関連コンテンツ

### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-   [AngularJS を使用した条件付きテンプレート化および高度なテンプレート化](Conditional-and-Advanced-Templating-with-AngularJS.html)

### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

-   [AngularJS のサンプル用の %%ProductName%% ディレクティブ](http://igniteui.github.io/igniteui-angularjs/)
-   [%%ProductName%% コントロールの全サンプル](%%SamplesUrl%%)
  
