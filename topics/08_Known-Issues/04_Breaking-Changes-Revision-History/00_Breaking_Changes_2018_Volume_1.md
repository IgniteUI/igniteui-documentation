<!--
|metadata|
{
    "fileName": "breaking-changes-2018-volume-1",
    "controlName": "",
    "tags": ["Breaking Changes","Known Issues"]
}
|metadata|
-->

# 2018 Volume 1 の重大な変更

以下のトピックは、2018 Volume 1 の重大な変更の概要を示します。

## igCategoryChart

* `IsHorizontalZoomEnabled` および `IsVerticalZoomEnabled` プロパティはデフォルトで `true` に設定されます。
* `ChartType` プロパティのデフォルト値は `Line` の代わりに `Auto` に設定されます。コントロールは、バインドされるデータ ポイントの数に基づいて描画するシリーズのタイプを選択します。

## igShapeChart

* ShapeChart の `IsHorizontalZoomEnabled` および `IsVerticalZoomEnabled` プロパティがデフォルトで `true` に設定されます。

## ドメイン チャート

* ドメイン チャート (CategoryChart、ShapeChart など) は新しく追加された js ファイルに依存関係があります。 `infragistics.datachart_domainChart.js`

## Ignite UI

* `infragistics.util.jquerydeferred.js` ファイルが削除されました。loader を使用してインスタンス化されたチャートは `double.ToString("00.0#")` 書式をサポートします。

## PercentChangeYAxis

* この軸は積層シリーズでサポートされません。

## igSpreadsheet

* igSpreadsheet は igDialog への参照が必要です。
