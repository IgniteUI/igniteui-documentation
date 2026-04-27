<!--
|metadata|
{
    "fileName": "iggrid-columnfixing-method-reference",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# メソッドの参照 (列固定、igGrid)

## 列固定メソッドの参照

`igGrid`™ コントロールでの固定および固定解除領域は、2 つの異なるテーブル DOM 要素として実装されます。そのため、固定列領域に対してすべてのグリッド ドキュメント オブジェクト モデル (DOM) 操作メソッドを複製することが必要です。通常、固定列領域の API は固定を示す接頭辞が付けられます。

#### 列固定のメソッド参照表

以下の表で、列固定機能に関連する `igGrid` メソッドの目的と機能を簡単に説明します。

メソッド|説明
-------|------------
[allFixedRows](%%jQueryApiUrl%%/ui.iggrid#methods:allFixedRows) |固定列領域のすべての行にあるデータを取得します。
[cellAt](%%jQueryApiUrl%%/ui.iggrid#methods:cellAt) |グリッドから特定のセルを取得します。指定した位置にセルの DOM 要素を返します。新しく Boolean 型のパラメーターが API に追加されます。
[fixedBodyContainer](%%jQueryApiUrl%%/ui.iggrid#methods:fixedBodyContainer) |固定列領域のボディ コンテナーを取得します。固定列を含むボディ要素の DOM を返します。
[fixedContainer](%%jQueryApiUrl%%/ui.iggrid#methods:fixedContainer) |固定列領域のコンテナーを取得します。固定列の DOM コンテナー要素を返します。
[fixedFooterContainer](%%jQueryApiUrl%%/ui.iggrid#methods:fixedFooterContainer) |固定列領域にあるフッターのコンテナーを取得します。固定列領域にあるフッターの DOM コンテナー要素を返します。
[fixedFootersTable](%%jQueryApiUrl%%/ui.iggrid#methods:fixedFootersTable) |固定列領域にあるフッターのテーブルを取得します。固定列領域にあるフッターの DOM テーブル要素を返します。
[fixedHeaderContainer](%%jQueryApiUrl%%/ui.iggrid#methods:fixedHeaderContainer) |固定列領域にあるヘッダーのコンテナーを取得します。固定列領域にあるヘッダーの DOM コンテナー要素を返します。
[fixedRowAt](%%jQueryApiUrl%%/ui.iggrid#methods:fixedRowAt) |固定列領域から特定の行を取得します。指定したインデックスに行の DOM 要素を返します。
[fixedRows](%%jQueryApiUrl%%/ui.iggrid#methods:fixedRows) |固定行を取得します。すべての DOM の `<tr>` 要素の配列を返します。
[fixedTable](%%jQueryApiUrl%%/ui.iggrid#methods:fixedTable) |固定テーブルを取得します。固定テーブルの DOM 要素を返します。
[hasFixedColumns](%%jQueryApiUrl%%/ui.iggrid#methods:hasFixedColumns) |グリッドに固定列があるか確認します。true または false を返します。
[isFixedColumn](%%jQueryApiUrl%%/ui.iggrid#methods:isFixedColumn) |列キーまたはインデックスで列が固定されているか確認します。true または false を返します。

