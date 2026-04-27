<!--
|metadata|
{
    "fileName": "igtreegrid-filtering",
    "controlName": ["igTreeGrid"],
    "tags": ["Grids", "Filtering"]
}
|metadata|
-->

# フィルタリング (igTreeGrid)

`igTreeGrid` のフィルタリング機能は [`igGridFiltering`](igGrid-Filtering.html) 機能から拡張され、追加の API オプションおよびメソッド、スタイリング、および一般的動作を含めることにより、階層データの操作および表示ができるようにカスタマイズされています。

![](images/igtreegrid-filtering-row.png)

### このトピックの内容

- [**概要**](#introduction)
- [**表示モード**](#display-mode)
- [**API による一致するレコードの検索**](#api-matching)
- [**特定のレベルのみへのフィルタリングの適用**](#filter-levels)
- [**関連コンテンツ**](#related-content)
    - [トピック](#topics)
    - [サンプル](#samples)


## <a id="introduction"></a> 概要

フィルタリングは、レベルや展開状態にかかわらず、バインドされたすべてのデータ レコードで実行されます。これにより、フラット グリッドのデータから期待どおりのエクスペリエンスを得ることができます。ツリー グリッドに特化したカスタマイズにより、階層の異なるレベルにまたがって一致を調べることができ、階層構造でデフォルトによりグレー表示にした親行と子行の横に一致を表示することでコンテキストを維持します。

さらに、フィルタリングの結果、縮小された階層は展開され一致を表示しますが、フィルターがクリアされると、展開状態は元に戻ります。フィルター処理で行われたレコードの展開状態に対する変更は、保持された展開状態をオーバーライドします。

## <a id="display-mode"></a> 表示モード

[`displayMode`](%%jQueryApiUrl%%/ui.igtreegridfiltering#options:displayMode) プロパティは、フィルター結果のグリッドでの表示を制御します。デフォルトは `"showWithAncestors"` で、一致を完全な不透明で描画し、その親ノードをそれより低い不透明度で描画します。上の画像を参照してください。

使用可能なその他のモードに `"showWithAncestorsAndDescendants"` があります。これはデフォルトに加えて、子レコードがフィルタリング条件に一致しない場合でも、子レコードも描画します。この機能により、一致する親と関連付けられた子レベルを迅速に見つけて操作できます。これらのレベルのデフォルト状態は縮小ですが、展開状態に対して行われた変更はフィルターをクリアした後も保持されます。

![](images/igtreegrid-filtering-descendants.png)


## <a id="api-matching"></a> API による一致するレコードの検索

`igTreeGrid` は追加の親レコードと子レコード (モードによる) との一致を描画するため、コントロールの現在の表示状態にプログラムでアクセスしようとすると、どのレコードが実際にフィルター基準に一致するのか判定が難しい場合があります。一致するレコードの検索を支援するため、ツリー グリッド フィルタリングはデータ オブジェクトに対して [`matchFiltering`](%%jQueryApiUrl%%/ui.igtreegridfiltering#options:matchFiltering) という名前のプロパティを追加します。このプロパティは、フィルター処理されたデータ ビューで一致するデータ レコードに対してのみ直接適用されるブール値のフラグで、フィルタリング条件が変更されると削除されます。

フィルター処理されたレコードにアクセスするには、基になる `igTreeHierarchicalDataSource` インスタンスの [`flatDataView`](%%jQueryApiUrl%%/ig.treehierarchicaldatasource#methods:flatDataView) を要求できます。このインスタンスには、グリッド ウィジェットからアクセスできます ( [`.data()`](http://api.jquery.com/data/ "jQuery .data()") メソッドにより直接、またはイベント ハンドラーで提供される参照により)。

```js
// alternatively you can access the dataSource instance at any point using:
// var treeHierachicalDS = $("#treegrid").date("igTreeGrid").dataSource;

$("#treegrid").bind("igtreegridfilteringdatafiltered", function(ev, ui){
	var treeHierachicalDS = ui.owner.grid.dataSource;
	var flatView = treeHierachicalDS.flatDataView();

	for (var i = 0; i < flatView.length; i++) {
	  if( flatView[i]['__matchFiltering']) {
		//handle matching flatView[i]
	  }
	}
});

```

## <a id="filter-levels"></a> 特定のレベルに対してのみフィルタリングを適用

この機能を使用してフィルター処理される階層レベルを制御するために、 [`fromLevel`](%%jQueryApiUrl%%/ui.igtreegridfiltering#options:fromLevel) オプションと [`toLevel`](%%jQueryApiUrl%%/ui.igtreegridfiltering#options:toLevel) オプションを設定できます。これらのプロパティは、使用可能なレベルのゼロベースのインデックスで (0 が最初) 、子の階層の数が不明な場合は `toLevel` を `-1` に設定することで、バインドされた最後のレベルまでフィルター処理できます。

たとえば、子レベルのみにフィルタリングを適用するには

```js
$("#treegrid").igTreeGrid({
	//...
	features: [{
		name: 'Filtering',
		fromLevel: 1
	}]
});
```
前述のように、フィルタリング機能の初期化の結果は、ルート レベルを無視し、その子レベルでのみ一致を検索する操作になります。

![](images/igtreegrid-filtering-non-root-level.png)

最初の行は "an" 基準に一致する名前を含みますが、不一致のスタイルで表示され、ディスプレイ モード ルールに従って描画されている点に注意してください。


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック
-   [ロード オン デマンド (igTreeGrid)](igTreeGrid-Load-On-Demand.html): このトピックでは、`igTreeGrid` ロード オン デマンドのメリットと実装方法を説明します。

### <a id="samples"></a> サンプル
-	[igTreeGrid リモート機能](%%SamplesUrl%%/tree-grid/remote-features)
