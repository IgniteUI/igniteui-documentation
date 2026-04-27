<!--
|metadata|
{
    "fileName": "igtree-knockoutjs-support",
    "controlName": "igTree",
    "tags": ["Data Binding","Data Presentation","Editing"]
}
|metadata|
-->

# Knockout サポートの構成

## トピックの概要
### 目的

このトピックは、Knockout ライブラリにより管理される View-Model オブジェクトをバインドするために `igTree`™ コントロールを構成する方法について説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要なトピックと外部リソースの一覧です。

**トピック**

- [igTree の概要](igTree-Overview.html): このトピックでは、機能、データ ソースとのバインド、要件、テンプレートなど、`igTree` コントロール関連の概念について説明します。

- [igTree を使用した作業の開始](igTree-Getting-Started.html): このトピックは、クライアント上では JSON データにバインドし、サーバー上でビジネス オブジェクトのコレクションにバインドする異なるアプリケーションのシナリオにおいて `igTree` コントロールをセットアップする方法について説明します。


**外部リソース**

-   [Knockout インタラクティブ チュートリアル](http://learn.knockoutjs.com/)


## 概要
### <a id="summary"></a>Knockout サポートの概要

`igTree` コントロールにおけるKnockout ライブラリのサポートは、開発者がKnockout ライブラリとその宣言構文を使用してツリー コントロールを初期化し構成するための簡単な手段を提供することを目的としています。

Knockout のサポートは、Knockout バインディングがページに適用されるときに最初に呼び出される Knockout 拡張機能として、View-Model への外部更新が起こったときにページの存続期間中に実装されます。

Knockout 管理データ構造へバインドされるツリー コントロールを初期化するには、`igTree` 構成オプションを div 要素の data-bind属性に指定する必要があります。ツリーは、JavaScript を使用してコントロールを作成する場合同様に div の場所で描画されます。以下の「[Knockout 構成のあるツリーの概要](#summary)」セクションで最重要オプションを参照できます。また、データ バインド属性においてビジネス案件に対して関連度を有するそのほかの `igTree` オプションすべてを指定することもできます。



## コード例: 簡易な 2 レベル階層ツリーを構成する
### 説明

このサンプルは、`igTree` コントロールをインスタンス化し、Knockout により管理される 2 レベル階層データ構造にバインドする方法について示します。Knockout の宣言構文を使用して、div 要素の data-bind 属性からツリーをインスタンス化し View-Model 監視可能プロパティにバインドします。

### コード

以下のコード スニペットは、Knockout により管理される監視可能プロパティで階層構造を宣言する View-Model オブジェクトを示します。データ構造は、例を明確化するためにここで明示的に宣言されます。実環境の案件では、データがリモート データ ソース (データベースなど) から提供されると、そのデータは JSON 形式になります。その後、データは Knockout マッピング ライブラリを使用して監視できるようになります。

**JavaScript の場合:**

```js
var viewModel = {
    data: ko.observableArray(
        [{
            ID: ko.observable("1"),
            CategoryName: ko.observable("Stationery"),
            Products: ko.observableArray(
                [{
                    ProductID: ko.observable("1"),
                    ProductName: ko.observable("Pencil")
                }, {
                . . .
                }]
            )
        }, {
        . . .
        }];
    );
}
```

以下のコード スニペットは、宣言されたKnockout バインディングをページに適用する方法を示します。`ko.applyBindings()` 呼び出しは、Loader の即時コールバック内で出される点にご注意ください。これは、Knockout のツリー拡張機能はバインディングが適用される前にページにロードしなければならないため必要です。

**JavaScript の場合:**

```js
$.ig.loader({
    scriptPath: "http://localhost/ig_ui/js/",
    cssPath: "http://localhost/ig_ui/css/",
    resources: "igTree,extensions/infragistics.ui.tree.knockout-extensions.js",
    ready: function () {
        ko.applyBindings(viewModel);
    }
});
```

以下のコード スニペットは、ビュー内でツリー コントロールのバインディング オプションを宣言する方法を示します。最も重要なのは、div 要素の data-bind 属性におけるインスタンス化オプションの宣言部分です。

**HTML の場合:**

```html
<div data-bind="igTree: {
    dataSource: data,
    bindings: {
        textKey: 'CategoryName',
        valueKey: 'ID',
        childDataProperty: 'Products',
        bindings: {
            textKey: 'ProductName',
            valueKey: 'ProductID'
        }
    }
}"></div>
```

コントロールが Knockout を介してビューモデルにバインドされる場合、いずれかの変更に対して通知を受け取ります。配列構造と個々のオブジェクト フィールドの両方が監視可能として宣言される点にご注意ください。データ項目が追加、削除または変更される場合にビューを更新でき、ユーザーが編集を行う場合にビューモデルを変更できます。

コントロール監視不可能オブジェクトにバインドできますが、アプリケーションは更新機能を失います。そのようなシナリオは意味をなしません。


## 関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [Knockout でエディターをバインド](Configuring-Knockout-Support-%28Editors%29.html): このトピックは、Knockout ライブラリを使用してビューモード オブジェクトをバインドするために %%ProductName%% エディター コントロールを構成する方法について説明します。

- [Knockout サポートの構成 (igCombo)](igCombo-KnockoutJS-Support.html): このトピックは、Knockout ライブラリにより管理されるビューモードのオブジェクトをバインドするために `igCombo` コントロールを構成する方法について説明します。

### サンプル

このトピックについては、以下のサンプルも参照してください。

- [KnockoutJS のバインド](%%SamplesUrl%%/tree/bind-tree-with-ko): このサンプルは、`igTree` をKnockout データ バインディングにより管理される階層データにバインドする操作を示します。


### リソース

以下の資料 (Infragistics のコンテンツ ファミリー以外でもご利用いただけます) は、このトピックに関連する追加情報を提供します。

- [Knockout](http://knockoutjs.com/): これは、すべての必要なドキュメンテーションおよびサンプルが利用可能な Knockout ライブラリのホーム ページホーム ページです。





 

 


