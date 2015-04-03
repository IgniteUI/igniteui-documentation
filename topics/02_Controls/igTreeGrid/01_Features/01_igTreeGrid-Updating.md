<!--
|metadata|
{
    "fileName": "igtreegrid-updating",
    "controlName": ["igTreeGrid"],
    "tags": ["Grids", "Editing"]
}
|metadata|
-->

# 更新 (igTreeGrid)

`igTreeGrid` 更新機能により、バインドされたデータをグリッドから直接編集できます。グリッドの更新機能は、グリッドにバインドされたデータの基となるセットの値を追加および編集する多様な機能を提供します。

> **注:** 現時点で、`igTreeGrid` は UI からの完全な「新しい行の追加」機能をサポートしていませんが、行追加メソッドを使用してこの操作ができます。


### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念、トピック、および記事の一覧です。

- [更新の概要 (igGrid)](igGrid-Updating.html): このトピックでは、`igGrid`™ コントロールの更新機能の使用方法を説明します。


## 概要

他の機能と同様、更新機能も同等のフラット データ コントロールを拡張して、単一グリッド内の階層構造に対するサポートを追加しています。これは、`igTreeHierarchicalDataSource` の基となるインスタンスにより可能になります。大部分の追加は、インライン編集エクスペリエンスや行編集テンプレートのような使用可能な機能に対する内容のサポートですが、「新しい行の追加」ユーザー インターフェイスがデフォルトで無効にされる点が変更されています。その理由は、UI の更新と [`addRow`](%%jQueryApiUrl%%/ui.igtreegridupdating#methods:addRow) API メソッドが、現時点では**ルート レベルのみに対する**新しいレコードの直接追加のみをサポートしているためです。この機能を有効にするために、[`enableAddRow`](%%jQueryApiUrl%%/ui.igtreegridupdating#options:enableAddRow) オプションを `true` に設定した状態にします。

また、UI または一致を使用すると、`igTreeGridUpdating` またはデータ ソースの行追加メソッドは、コントロールがフラット データ ソースにバインドされ、外部キーが新しいレコードに対して提供されている場合でも、デフォルトで新しいデータを直接ルート レベルに追加することにも注意してください。

## 特定のレベルに対する新しい行の追加

ツリー グリッドにプログラムにより新しい行を追加するには、Tree Hierarchical DataSource の [`insertRow`](%%jQueryApiUrl%%/ui.igtreegridupdating#methods:insertRow) API メソッドを使用できます。このメソッドのパラメーターで、親ならびに新しいレコードを挿入する特定のインデックスの両方を指定できます。変更を適用するには、 `dataBind` を呼び出し、最新の変更をグリッドに描画する必要があります。

たとえば、以下のグリッド定義があるとします。
```js
$("#treegrid").igTreeGrid({
	width: '700px',
	autoCommit: true,
	dataSource: employeeDS,
	autoGenerateColumns: false,
	primaryKey: "employeeID",
	columns: [
		{ headerText: "ID", key: "employeeID", width: "200px", dataType: "number" },
		{ headerText: "First", key: "firstName", width: "220px", dataType: "string" },
		{ headerText: "Last", key: "lastName", width: "220px", dataType: "string" }
	],
	features: [
		{ name: "Updating" }
	]
});
```

子を最初のレコードに追加する方法は以下のようになります。

```js
var ds = $('#treegrid').data("igTreeGrid").dataSource;
var newRow = { "employeeID": 22, "firstName": "John", "lastName": "Doe"};
ds.insertRow(22, newRow, 1, true, 0);

$('#treegrid').data("igTreeGrid").dataBind();
```
`insertRow` メソッドの最後のパラメーターは、希望する親 ID (プライマリキー値) です。

## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック
-   [ロード オン デマンド (igTreeGrid)](igTreeGrid-Load-On-Demand.html): このトピックでは、`igTreeGrid` ロード オン デマンドのメリットと実装方法を説明します。

### <a id="samples"></a> サンプル
- [igTreeGrid 更新](%%SamplesUrl%%/tree-grid/overview)
