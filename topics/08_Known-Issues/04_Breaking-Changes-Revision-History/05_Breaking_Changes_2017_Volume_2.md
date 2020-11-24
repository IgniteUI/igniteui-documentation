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

## データ可視化の依存関係

オプションの機能の一部がモジュール化され、そのファイルが以下のように再編成されます。

- `infragistics.barcode_core.js` は igQRCodeBarcode の新しい依存関係です。

- `infragistics.ui.barcode.js` は "infragistics.ui.qrcodebarcode.js" に名前変更されました。参照を更新してください。

- `infragistics.chart_sparkline.js` は "infragistics.sparkline.js" に名前変更されました。参照を更新してください。

- `infragistics.dv.simple.core.js` は削除されました。参照を削除してください。

- `infragistics.olap.js` は igOlapFlatDataSource および igOlapXmlaDataSource の新しい依存関係です。

- `infragistics.radialmenu_core.js` は削除されました。参照は削除してください。

- `infragistics.dv_interactivity.js` はパンニング、ズーム、ドラッグなどのユーザー インタラクションのサポートを提供します。これは以下のコントロールで**必須**依存関係として追加されました。
 - igPieChart
 - igFunnelChart
 - igSparkline
 - igRadialGauge
 - igLinearGauge
 - igBulletGraph
 - igRadialMenu
 - igSpreadsheet
 - igScheduler

- `infragistics.datachart_interactivity.js` pはツールチップ、パンニング、ズーム、ドラッグなどのユーザー インタラクションのサポートを提供します。これは以下のコントロールで**オプション**の依存関係として追加され、infragistics.dv_interactivity.js と一緒に参照されます。
 - igDataChart
 - igCategoryChart
 - igShapeChart
 - igMap

- `infragistics.dv_visualdata.js` は自動テストのために視覚データのエクスポートを有効にします。次のコントロールの**オプション**の依存関係として追加されました。
 - igDataChart
 - igCategoryChart
 - igShapeChart
 - igMap
 
- `infragistics.datachart_visualdata.js` はチャートの自動テストのために視覚データのエクスポートを有効にします。次のコントロールの**オプション**の依存関係として追加され、infragistics.dv_visualdata.js と一緒に参照されます。
 - igDataChart
 - igCategoryChart
 - igShapeChart
 - igMap

## データ可視化の依存関係の比較

### igQRCodeBarcode
| 17.1 依存関係  | 17.2 依存関係 |
| ------------------ |:------------------|
|infragistics.util.js<br/> infragistics.util.jquery.js<br/> infragistics.util.jquerydeferred.js<br/> infragistics.dv.simple.core.js<br/> infragistics.ext_core.js<br/> infragistics.ext_collections.js<br/> infragistics.ext_ui.js<br/> infragistics.dv_core.js<br/> infragistics.dv_jquerydom.js<br/> infragistics.barcode_qrcodebarcode.js<br/> infragistics.ui.barcode.js<br/> infragistics.encoding.js | infragistics.util.js<br/> infragistics.util.jquery.js<br/> infragistics.util.jquerydeferred.js<br/> infragistics.ui.widget.js<br/> infragistics.ext_core.js<br/> infragistics.ext_text.js<br/> infragistics.ext_collections.js<br/> encoding/infragistics.encoding.core.js<br/> infragistics.ext_ui.js<br/> infragistics.dv_core.js<br/> infragistics.ext_collectionsextended.js<br/> infragistics.barcode_core.js<br/> infragistics.dv_jquerydom.js<br/> infragistics.barcode_qrcodebarcode.js<br/> infragistics.ui.qrcodebarcode.js |

### igSparkline

| 17.1 依存関係  | 17.2 依存関係 |
| ------------------ |:------------------|
|infragistics.util.js<br/> infragistics.util.jquery.js<br/> infragistics.util.jquerydeferred.js<br/> infragistics.ext_core.js<br/> infragistics.ext_collections.js<br/> infragistics.ext_ui.js<br/> infragistics.dv_core.js<br/> infragistics.dv_geometry.js<br/> infragistics.dv.simple.core.js<br/> infragistics.templating.js<br/> infragistics.datasource.js<br/> infragistics.dv_jquerydom.js<br/> infragistics.ui.basechart.js<br/> infragistics.chart_sparkline.js<br/> infragistics.ui.sparkline.js | infragistics.util.js<br/> infragistics.util.jquery.js<br/> infragistics.util.jquerydeferred.js<br/> infragistics.templating.js<br/> infragistics.datasource.js<br/> infragistics.ext_core.js<br/> infragistics.ext_collections.js<br/> infragistics.ext_ui.js<br/> infragistics.dv_core.js<br/> infragistics.dv_jquerydom.js<br/> infragistics.ui.basechart.js<br/> infragistics.dv_geometry.js<br/> infragistics.dv_interactivity.js<br/> infragistics.ui.widget.js<br/> infragistics.sparkline.js<br/> infragistics.ui.sparkline.js |

### igRadialMenu
| 17.1 依存関係  | 17.2 依存関係 |
| ------------------ |:------------------|
|infragistics.util.js<br/> infragistics.util.jquery.js<br/> infragistics.util.jquerydeferred.js<br/> infragistics.ext_core.js<br/> infragistics.ext_collections.js<br/> infragistics.ext_ui.js<br/> infragistics.dv_core.js<br/> infragistics.dv_jquerydom.js<br/> infragistics.radialmenu_core.js<br/> infragistics.ui.radialmenu.js | infragistics.util.js<br/> infragistics.util.jquery.js<br/> infragistics.util.jquerydeferred.js<br/> infragistics.ext_core.js<br/> infragistics.ext_collections.js<br/> infragistics.ext_collectionsextended.js<br/> infragistics.ext_ui.js<br/> infragistics.dv_core.js<br/> infragistics.dv_interactivity.js<br/> infragistics.dv_jquerydom.js<br/> infragistics.ui.widget.js<br/> infragistics.radialmenu.js<br/> infragistics.ui.radialmenu.js |
  
## igGrid

### セル結合の変更

igGrid のセル結合機能は物理セルの結合をサポートします。

物理セル結合がサポートされるため、セルを HTML Table で rowspan を使用してセルを結合できます。結合セルは表示されず、単一の結合セルのみ描画されます。「ビジュアル セル結合」と呼ばれる以前のセル結合動作のサポートは継続されます。ビジュアル セル結合の場合、結合セルは rowspan の代わりに CSS スタイルを使用して結合として表示されます。

物理セル結合は、レスポンシブ垂直描画および単一列テンプレートでサポートされません。

そのため、以下のオプションが削除/追加されました。

| オプション名 | 説明 | デフォルト値 | 状態 |
|-------------|-------------|---------------|-------|
|[*initialState*](%%jQueryApiUrl%%/ui.iggridcellmerging#options:initialState) | 初期状態を制御します。 | "regular" | <span style="color:red">削除した</span>|
|[*mergeType*](%%jQueryApiUrl%%/ui.iggridcellmerging#options:mergeType) | 結合のタイプを定義します。 | "visual" | <span style="color:green">新規</span>|
|[*mergeOn*](%%jQueryApiUrl%%/ui.iggridcellmerging#options:mergeOn) | 結合がいつ適用されるかを定義します。 | "sorting" | <span style="color:green">新規</span>|
|[*mergeStrategy*](%%jQueryApiUrl%%/ui.iggridcellmerging#options:mergeStrategy) | 結合に基づくルールを定義します。 | "duplicate" | <span style="color:green">新規</span>|
|[*columnSettings*](%%jQueryApiUrl%%/ui.iggridcellmerging#options:columnSettings) | 非表示オプションを列ごとに指定する列設定のリスト。 | [ ] | <span style="color:green">新規</span>|

以上のオプション変更と同様に igGrid セル結合の MVC ラッパー オプションも更新されます。以下の型が削除/追加されました:

| タイプ名 | 説明 | 状態 |
|-------------|-------------|---------------|-------|
|CellMergingInitialState | 最初状態オプションを指定する型。 | <span style="color:red">削除した</span>|
|CellMergingMergeOn | 結合の適用ときを指定する型。 | <span style="color:green">新規</span>|
|CellMergingMergeStrategy | 結合方法を指定する型。 |<span style="color:green">新規</span>|
| CellMergingMergeType | 結合のタイプを指定する型。 | <span style="color:green">新規</span> | 
  
## igGrid ロケール変更

igGrid およびその機能のロケール固有のオプションの動作が変更されました。17.2 バージョン以後、すべてのロケール固有のオプションは [*locale*](%%jQueryApiUrl%%/ui.iggrid#options:locale) オプションによって設定されます。

### igGrid 集計のオプション変更

以前のオプション | 新しいオプション 
----------------|-----------
dialogButtonOKText |  [locale.dialogButtonOKText](%%jQueryApiUrl%%/ui.iggridsummaries#options:locale.dialogButtonOKText)
dialogButtonCancelText | [locale.featureChooserText](%%jQueryApiUrl%%/ui.iggridsummaries#options:locale.featureChooserText)
featureChooserText | [locale.featureChooserText](%%jQueryApiUrl%%/ui.iggridsummaries#options:locale.featureChooserText)
featureChooserTextHide | [locale.featureChooserTextHide](%%jQueryApiUrl%%/ui.iggridsummaries#options:locale.featureChooserTextHide)
emptyCellText | [locale.emptyCellText](%%jQueryApiUrl%%/ui.iggridsummaries#options:locale.emptyCellText)
summariesHeaderButtonTooltip | [locale.summariesHeaderButtonTooltip](%%jQueryApiUrl%%/ui.iggridsummaries#options:locale.summariesHeaderButtonTooltip)

### igGrid ページングのオプション変更

以前のオプション | 新しいオプション 
----------------|-----------
pageSizeDropDownLabel | [locale.pageSizeDropDownLabel](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.pageSizeDropDownLabel)
pageSizeDropDownTrailingLabel | [locale.pageSizeDropDownTrailingLabel](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.pageSizeDropDownTrailingLabel)
pagerRecordsLabelTemplate | [locale.pagerRecordsLabelTemplate](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.pagerRecordsLabelTemplate)
nextPageLabelText | [locale.nextPageLabelText](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.nextPageLabelText)
firstPageLabelText | [locale.firstPageLabelText](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.firstPageLabelText)
lastPageLabelText | [locale.lastPageLabelText](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.lastPageLabelText)
currentPageDropDownLeadingLabel | [locale.currentPageDropDownLeadingLabel](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.currentPageDropDownLeadingLabel)
currentPageDropDownTrailingLabel | [locale.currentPageDropDownTrailingLabel](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.currentPageDropDownTrailingLabel)
currentPageDropDownTooltip | [locale.currentPageDropDownTooltip](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.currentPageDropDownTooltip)
pageSizeDropDownTooltip | [locale.pageSizeDropDownTooltip](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.pageSizeDropDownTooltip)
pagerRecordsLabelTooltip | [locale.pagerRecordsLabelTooltip](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.pagerRecordsLabelTooltip)
prevPageTooltip | [locale.prevPageTooltip](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.prevPageTooltip)
nextPageTooltip | [locale.nextPageTooltip](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.nextPageTooltip)
firstPageTooltip | [locale.firstPageTooltip](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.firstPageTooltip)
lastPageTooltip | [locale.lastPageTooltip](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.lastPageTooltip)
pageTooltipFormat | [locale.pageTooltipFormat](%%jQueryApiUrl%%/ui.iggridpaging#options:locale.pageTooltipFormat)

### igGrid 並べ替えのオプション変更

以前のオプション | 新しいオプション 
----------------|-----------
modalDialogSortByButtonText  | [locale.modalDialogSortByButtonText](%%jQueryApiUrl%%/ui.iggridsorting#options:locale.modalDialogSortByButtonText)
modalDialogResetButtonLabel | [locale.modalDialogResetButton](%%jQueryApiUrl%%/ui.iggridsorting#options:locale.modalDialogResetButton)
modalDialogCaptionButtonDesc | [locale.modalDialogCaptionButtonDesc](%%jQueryApiUrl%%/ui.iggridsorting#options:locale.modalDialogCaptionButtonDesc)
modalDialogCaptionButtonAsc | [locale.modalDialogCaptionButtonUnsort](%%jQueryApiUrl%%/ui.iggridsorting#options:locale.modalDialogCaptionButtonUnsort)
featureChooserText | [locale.featureChooserText](%%jQueryApiUrl%%/ui.iggridsorting#options:locale.featureChooserText)
unsortedColumnTooltip  | [locale.unsortedColumnTooltip](%%jQueryApiUrl%%/ui.iggridsorting#options:locale.unsortedColumnTooltip)
modalDialogCaptionText | [locale.modalDialogButtonApplyText](%%jQueryApiUrl%%/ui.iggridsorting#options:locale.modalDialogButtonApplyText)
modalDialogButtonCancelText | [locale.modalDialogButtonCancelText](%%jQueryApiUrl%%/ui.iggridsorting#options:locale.modalDialogButtonCancelText)
featureChooserSortAsc | [locale.featureChooserSortAsc](%%jQueryApiUrl%%/ui.iggridsorting#options:locale.featureChooserSortAsc)
featureChooserSortDesc | [locale.featureChooserSortDesc](%%jQueryApiUrl%%/ui.iggridsorting#options:locale.featureChooserSortDesc)

### igGrid 列の移動のオプション変更

以前のオプション | 新しいオプション 
----------------|-----------
movingDialogCaptionButtonDesc | [locale.movingDialogCaptionButtonAsc](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:locale.movingDialogCaptionButtonAsc)
movingDialogCaptionButtonAsc | [locale.movingDialogCaptionButtonAsc](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:locale.movingDialogCaptionButtonAsc)
movingDialogCaptionText | [locale.movingDialogCaptionText](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:locale.movingDialogCaptionText)
movingDialogDisplayText | [locale.movingDialogDisplayText](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:locale.movingDialogDisplayText)
movingDialogDropTooltipText | [locale.movingDialogDropTooltipText](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:locale.movingDialogDropTooltipText)
dropDownMoveLeftText | [locale.dropDownMoveLeftText](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:locale.dropDownMoveLeftText)
dropDownMoveRightText | [locale.dropDownMoveRightText](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:locale.dropDownMoveRightText)
dropDownMoveFirstText | [locale.dropDownMoveFirstText](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:locale.dropDownMoveFirstText)
dropDownMoveLastText | [locale.dropDownMoveLastText](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:locale.dropDownMoveLastText)
movingToolTipMove | [locale.movingToolTipMove](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:locale.movingToolTipMove)
featureChooserSubmenuText | [locale.featureChooserSubmenuText](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:locale.featureChooserSubmenuText)

### igGrid フィルタリングのオプション変更

以前のオプション | 新しいオプション 
----------------|-----------
filterSummaryTemplate | [locale.filterSummaryTemplate](%%jQueryApiUrl%%/ui.iggridfiltering#options:locale.filterSummaryTemplate)
tooltipTemplate | [locale.tooltipTemplate](%%jQueryApiUrl%%/ui.iggridfiltering#options:locale.tooltipTemplate)
featureChooserText | [locale.featureChooserText](%%jQueryApiUrl%%/ui.iggridfiltering#options:locale.featureChooserText)
featureChooserTextHide | [locale.featureChooserTextHide](%%jQueryApiUrl%%/ui.iggridfiltering#options:locale.featureChooserTextHide)
featureChooserTextAdvancedFilter | [locale.featureChooserTextAdvancedFilter](%%jQueryApiUrl%%/ui.iggridfiltering#options:locale.featureChooserTextAdvancedFilter)
nullTexts | [locale](%%jQueryApiUrl%%/ui.iggridfiltering#options:locale)
labels | [locale](%%jQueryApiUrl%%/ui.iggridfiltering#options:locale)

### igGrid GroupBy のオプション変更

以前のオプション | 新しいオプション 
----------------|-----------
expandTooltip | [locale.expandTooltip](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.expandTooltip)
collapseTooltip | [locale.collapseTooltip](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.collapseTooltip)
removeButtonTooltip | [locale.removeButtonTooltip](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.removeButtonTooltip)
modalDialogGroupByButtonText | [locale.modalDialogGroupByButtonText](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.modalDialogGroupByButtonText)
modalDialogCaptionButtonDesc | [locale.modalDialogCaptionButtonDesc](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.modalDialogCaptionButtonDesc)
modalDialogCaptionButtonAsc | [locale.modalDialogCaptionButtonAsc](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.modalDialogCaptionButtonAsc)
modalDialogCaptionButtonUngroup | [locale.modalDialogCaptionButtonUngroup](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.modalDialogCaptionButtonUngroup)
modalDialogCaptionText | [locale.modalDialogCaptionText](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.modalDialogCaptionText)
modalDialogDropDownLabel | [locale.modalDialogDropDownLabel](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.modalDialogDropDownLabel)
modalDialogRootLevelHierarchicalGrid | [locale.modalDialogRootLevelHierarchicalGrid](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.modalDialogRootLevelHierarchicalGrid)
modalDialogDropDownButtonCaption | [locale.modalDialogDropDownButtonCaption](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.modalDialogDropDownButtonCaption)
modalDialogClearAllButtonLabel | [locale.modalDialogClearAllButtonLabel](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.modalDialogClearAllButtonLabel)
emptyGroupByAreaContentSelectColumnsCaption | [locale.emptyGroupByAreaContentSelectColumnsCaption](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.emptyGroupByAreaContentSelectColumnsCaption)
modalDialogButtonApplyText | [locale.modalDialogButtonApplyText](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.modalDialogButtonApplyText)
modalDialogButtonCancelText | [locale.modalDialogButtonCancelText](%%jQueryApiUrl%%/ui.iggridgroupby#options:locale.modalDialogButtonCancelText)

### igGrid の非表示のオプション変更

以前のオプション | 新しいオプション 
----------------|-----------
columnChooserCaptionText | [locale.columnChooserCaptionText](%%jQueryApiUrl%%/ui.iggridhiding#options:locale.columnChooserCaptionText)
columnChooserDisplayText | [locale.columnChooserDisplayText](%%jQueryApiUrl%%/ui.iggridhiding#options:locale.columnChooserDisplayText)
hiddenColumnIndicatorTooltipText | [locale.hiddenColumnIndicatorTooltipText](%%jQueryApiUrl%%/ui.iggridhiding#options:locale.hiddenColumnIndicatorTooltipText)
columnHideText | [locale.columnHideText](%%jQueryApiUrl%%/ui.iggridhiding#options:locale.columnHideText)
columnChooserShowText | [locale.columnChooserShowText](%%jQueryApiUrl%%/ui.iggridhiding#options:locale.columnChooserShowText)
columnChooserHideText | [locale.columnChooserHideText](%%jQueryApiUrl%%/ui.iggridhiding#options:locale.columnChooserHideText)
columnChooserResetButtonLabel | [locale.columnChooserResetButtonLabel](%%jQueryApiUrl%%/ui.iggridhiding#options:locale.columnChooserResetButtonLabel)
columnChooserButtonApplyText | [locale.columnChooserButtonApplyText](%%jQueryApiUrl%%/ui.iggridhiding#options:locale.columnChooserButtonApplyText)
columnChooserButtonCancelText | [locale.columnChooserButtonCancelText](%%jQueryApiUrl%%/ui.iggridhiding#options:locale.columnChooserButtonCancelText)

### igGrid 更新のオプション変更

以前のオプション | 新しいオプション 
----------------|-----------
doneLabel | [locale.doneLabel](%%jQueryApiUrl%%/ui.iggridupdating#options:locale.doneLabel)
doneTooltip | [locale.doneTooltip](%%jQueryApiUrl%%/ui.iggridupdating#options:locale.doneTooltip)
cancelLabel | [locale.cancelLabel](%%jQueryApiUrl%%/ui.iggridupdating#options:locale.cancelLabel)
cancelTooltip | [locale.cancelTooltip](%%jQueryApiUrl%%/ui.iggridupdating#options:locale.cancelTooltip)
addRowLabel | [locale.addRowLabel](%%jQueryApiUrl%%/ui.iggridupdating#options:locale.addRowLabel)
addRowTooltip | [locale.addRowTooltip](%%jQueryApiUrl%%/ui.iggridupdating#options:locale.addRowTooltip)
deleteRowLabel | [locale.deleteRowLabel](%%jQueryApiUrl%%/ui.iggridupdating#options:locale.deleteRowLabel)
deleteRowTooltip | [locale.deleteRowTooltip](%%jQueryApiUrl%%/ui.iggridupdating#options:locale.deleteRowTooltip)

### igGrid オンデマンドの行追加のオプション変更

以前のオプション | 新しいオプション 
----------------|-----------
loadMoreDataButtonText | [locale.loadMoreDataButtonText](%%jQueryApiUrl%%/ui.iggridappendrowsondemand#options:locale.loadMoreDataButtonText)

### igGrid 列の固定のオプション変更

以前のオプション | 新しいオプション 
----------------|-----------
headerFixButtonText | [locale.headerFixButtonText](%%jQueryApiUrl%%/ui.iggridcolumnfixing#options:locale.headerFixButtonText)
headerUnfixButtonText | [locale.headerUnfixButtonText](%%jQueryApiUrl%%/ui.iggridcolumnfixing#options:locale.headerUnfixButtonText)
featureChooserTextFixedColumn | [locale.featureChooserTextFixedColumn](%%jQueryApiUrl%%/ui.iggridcolumnfixing#options:locale.featureChooserTextFixedColumn)
featureChooserTextUnfixedColumn | [locale.featureChooserTextUnfixedColumn](%%jQueryApiUrl%%/ui.iggridcolumnfixing#options:locale.featureChooserTextUnfixedColumn)



## igHierarchicalGrid

igHierarchicalGrid のオプション変更

以前のオプション | 新しいオプション 
----------------|-----------
expandTooltip | [locale.columnChooserCaptionText](%%jQueryApiUrl%%/ui.ighierarchicalgrid#options:locale.expandTooltip)
collapseTooltip | [locale.collapseTooltip](%%jQueryApiUrl%%/ui.ighierarchicalgrid#options:locale.collapseTooltip)


## igTreeGrid

igTreeGrid のオプション変更

以前のオプション | 新しいオプション 
----------------|-----------
expandTooltipText | [locale.expandTooltipText](%%jQueryApiUrl%%/ui.igtreegrid#options:locale.expandTooltipText)
collapseTooltipText | [locale.collapseTooltipText](%%jQueryApiUrl%%/ui.igtreegrid#options:locale.collapseTooltipText)

### igTreeGrid フィルタリングのオプション変更

以前のオプション | 新しいオプション 
----------------|-----------
filterSummaryInPagerTemplate | [locale.collapseTooltipText](%%jQueryApiUrl%%/ui.igtreegrid#options:locale.collapseTooltipText)

### igTreeGrid 更新のオプション変更

以前のオプション | 新しいオプション 
----------------|-----------
addChildTooltip | [locale.enableAddChild](%%jQueryApiUrl%%/ui.igtreegrid#options:locale.enableAddChild)
addChildButtonLabel | [locale.addChildButtonLabel](%%jQueryApiUrl%%/ui.igtreegrid#options:locale.addChildButtonLabel)

## igDialog

igDialog のロケール固有のオプションの動作が変更されました。17.2 バージョン以後、すべてのロケール固有のオプションは [*locale*](%%jQueryApiUrl%%/ui.igdialog#options:locale) オプションによって設定されます。

### 変更されたオプション

以前のオプション | 新しいオプション 
----------------|-----------
closeButtonTitle |  [locale.closeButtonTitle](%%jQueryApiUrl%%/ui.igdialog#options:locale.closeButtonTitle)
minimizeButtonTitle | [locale.minimizeButtonTitle](%%jQueryApiUrl%%/ui.igdialog#options:locale.minimizeButtonTitle)
maximizeButtonTitle | [locale.minimizeButtonTitle](%%jQueryApiUrl%%/ui.igdialog#options:locale.minimizeButtonTitle)
pinButtonTitle | [locale.pinButtonTitle](%%jQueryApiUrl%%/ui.igdialog#options:locale.pinButtonTitle)
unpinButtonTitle | [locale.unpinButtonTitle](%%jQueryApiUrl%%/ui.igdialog#options:locale.unpinButtonTitle)
restoreButtonTitle | [locale.restoreButtonTitle](%%jQueryApiUrl%%/ui.igdialog#options:locale.restoreButtonTitle)

## igCombo

igCombo のロケール固有のオプションの動作が変更されました。17.2 バージョン以後、すべてのロケール固有のオプションは [*locale*](%%jQueryApiUrl%%/ui.igcombo#options:locale) オプションによって設定されます。

### 変更されたオプション

以前のオプション | 新しいオプション 
----------------|-----------
noMatchFoundText |  [locale.noMatchFoundText](%%jQueryApiUrl%%/ui.igcombo#options:locale.noMatchFoundText)
dropDownButtonTitle | [locale.dropDownButtonTitle](%%jQueryApiUrl%%/ui.igcombo#options:locale.dropDownButtonTitle)
clearButtonTitle | [locale.clearButtonTitle](%%jQueryApiUrl%%/ui.igcombo#options:locale.clearButtonTitle)
placeHolder | [locale.placeHolder](%%jQueryApiUrl%%/ui.igcombo#options:locale.placeHolder)

## igUpload

igUpload のロケール固有のオプションの動作が変更されました。17.2 バージョン以後、すべてのロケール固有のオプションは [*locale*](%%jQueryApiUrl%%/ui.igupload#options:locale) オプションによって設定されます。

### 変更されたオプション

以前のオプション | 新しいオプション 
----------------|-----------
labelUploadButton |  [locale.labelUploadButton](%%jQueryApiUrl%%/ui.igupload#options:locale.labelUploadButton)
labelAddButton | [locale.labelAddButton](%%jQueryApiUrl%%/ui.igupload#options:locale.labelAddButton)
labelClearAllButton | [locale.labelClearAllButton](%%jQueryApiUrl%%/ui.igupload#options:locale.labelClearAllButton)
labelSummaryTemplate | [locale.labelSummaryTemplate](%%jQueryApiUrl%%/ui.igupload#options:locale.labelSummaryTemplate)
labelSummaryProgressBarTemplate | [locale.labelSummaryProgressBarTemplate](%%jQueryApiUrl%%/ui.igupload#options:locale.labelSummaryProgressBarTemplate)
labelShowDetails | [locale.labelShowDetails](%%jQueryApiUrl%%/ui.igupload#options:locale.labelShowDetails)
labelHideDetails | [locale.labelHideDetails](%%jQueryApiUrl%%/ui.igupload#options:locale.labelHideDetails)
labelSummaryProgressButtonCancel | [locale.labelSummaryProgressButtonCancel](%%jQueryApiUrl%%/ui.igupload#options:locale.labelSummaryProgressButtonCancel)
labelSummaryProgressButtonContinue | [locale.labelSummaryProgressButtonContinue](%%jQueryApiUrl%%/ui.igupload#options:locale.labelSummaryProgressButtonContinue)
labelSummaryProgressButtonDone | [locale.labelSummaryProgressButtonDone](%%jQueryApiUrl%%/ui.igupload#options:locale.labelSummaryProgressButtonDone)
labelProgressBarFileNameContinue | [locale.labelProgressBarFileNameContinue](%%jQueryApiUrl%%/ui.igupload#options:locale.labelProgressBarFileNameContinue)
errorMessageMaxFileSizeExceeded | [locale.errorMessageMaxFileSizeExceeded](%%jQueryApiUrl%%/ui.igupload#options:locale.errorMessageMaxFileSizeExceeded)
errorMessageGetFileStatus | [locale.errorMessageGetFileStatus](%%jQueryApiUrl%%/ui.igupload#options:locale.errorMessageGetFileStatus)
errorMessageCancelUpload | [locale.errorMessageCancelUpload](%%jQueryApiUrl%%/ui.igupload#options:locale.errorMessageCancelUpload)
errorMessageNoSuchFile | [locale.errorMessageNoSuchFile](%%jQueryApiUrl%%/ui.igupload#options:locale.errorMessageNoSuchFile)
errorMessageOther | [locale.errorMessageOther](%%jQueryApiUrl%%/ui.igupload#options:locale.errorMessageOther)
errorMessageValidatingFileExtension | [locale.errorMessageValidatingFileExtension](%%jQueryApiUrl%%/ui.igupload#options:locale.errorMessageValidatingFileExtension)
errorMessageAJAXRequestFileSize | [locale.errorMessageAJAXRequestFileSize](%%jQueryApiUrl%%/ui.igupload#options:locale.errorMessageAJAXRequestFileSize)
errorMessageTryToRemoveNonExistingFile | [locale.errorMessageTryToRemoveNonExistingFile](%%jQueryApiUrl%%/ui.igupload#options:locale.errorMessageTryToRemoveNonExistingFile)
errorMessageTryToStartNonExistingFile | [locale.errorMessageTryToStartNonExistingFile](%%jQueryApiUrl%%/ui.igupload#options:locale.errorMessageTryToStartNonExistingFile)
errorMessageMaxUploadedFiles | [locale.errorMessageMaxUploadedFiles](%%jQueryApiUrl%%/ui.igupload#options:locale.errorMessageMaxUploadedFiles)
errorMessageMaxSimultaneousFiles | [locale.errorMessageMaxSimultaneousFiles](%%jQueryApiUrl%%/ui.igupload#options:locale.errorMessageMaxSimultaneousFiles)
errorMessageDropMultipleFilesWhenSingleModel | [locale.errorMessageDropMultipleFilesWhenSingleModel](%%jQueryApiUrl%%/ui.igupload#options:locale.errorMessageDropMultipleFilesWhenSingleModel)