<!--
|metadata|
{
    "fileName": "breaking-changes-2017-volume-2",
    "controlName": "",
    "tags": ["Breaking Changes","Known Issues"]
}
|metadata|
-->

# 2017 Volume 2 の重大な変更

以下のトピックは、2017 Volume 2 新機能の概要を示します。

## igDataChart

- `windowResponse` オプションのデフォルトの値を `deferred` から `immediate` に変更しました。つまり、パンとズーム操作はユーザーがこの操作でポインター位置を変更するときすぐに実行します。以前の deferred 動作は、ユーザーが移動完了したときにビューを更新しました。

## 複数のデータ ビジュアライゼーション コントロール

オプションの機能がモジュラーになって、ファイルは以下のとおり再編成されます。

- 削除した
  * infragistics.ui.barcode.js  
  * infragistics.radialmenu_core.js  
  * infragistics.chart_sparkline.js  
  * infragistics.dv.simple.core.js
 
- 追加した
  * infragistics.ui.qrcodebarcode.js  
  * infragistics.barcode_core.js  
  * infragistics.radialmenu.js  
  * infragistics.olap.js  
  * infragistics.sparkline.js  
  * infragistics.dv_interactivity.js  
  * infragistics.datachart_interactivity.js  
  * infragistics.dv_visualdata.js  
  * infragistics.datachart_visualdata.js