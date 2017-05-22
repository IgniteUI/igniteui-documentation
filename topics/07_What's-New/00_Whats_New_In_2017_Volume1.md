<!--
|metadata|
{
    "fileName": "whats-new-in-2017-volume1",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# 2017 Volume 1 の新機能

このトピックでは、Ignite UI™ 2017 Volume 1 リリースのコントロールと新機能および拡張機能を紹介します。

## 新機能の概要

以下の表に 2017 Volume 1 の新機能の概要を示します。追加の詳細は以下のとおりです。

### igSpreadsheet

機能 | 説明
---|---
[igSpreadsheet - 新しいコントロール](#spreadsheet)| igSpreadsheet は、最新のあらゆるブラウザーで Excel ドキュメントを視覚化する jQuery ウィジェットです。

### igScheduler

機能 | 説明
---|---
[igScheduler - 新しいコントロール](#scheduler)| igScheduler は、時間範囲および関連アクティビティを表示し、管理するスケジュール ソリューションを提供する jQuery ウィジェットです。

### igCombo

機能 | 説明
---|---
[Knockout の Disable ハンドラー](#comboKnockoutDisable)| Knockout の Disable バインディング ハンドラーがコンボで実装されます。

### Editors

機能 | 説明
---|---
[Knockout の Disable ハンドラー](#editorsKnockoutDisable)| Knockout の Disable バインディング ハンドラーがエディターで実装されます。

### igNumericEditor

機能 | 説明
---|---
[10 進数の丸み](#roundDecimals)| 数値エディターに小数部を持つ値の丸みを許可する新しい [`roundDecimals`](ui.ignumericeditor#options:roundDecimals) オプションを追加しました。

### igDateEditor/igDatePicker

機能 | 説明
---|---
[Date Handling](#dateHandling)| New editors' settings are needed when handling date transfers.

### igDatePicker

機能 | 説明
---|---
[Date Picker Options MVC wrapper](#pickerOptionsWrapper) | When using DatePicker MVC wrapper, now additional wrapper for the date picker options is available.

## <a id="spreadsheet"></a>igSpreadsheet

2017.1 バージョンで igSpreadsheet コントロールを追加しました。最新のあらゆるブラウザーで Excel ドキュメントを視覚化する jQuery ウィジェットです。For MVP version, the control has the following areas and features available:

-   Configurable component areas
    -   Formula Bar
    -   Context Menu
    -   Tab Bar Area
    -   Headers

-   Control manupaltions

    -   Selection
    -   Resizing
    -   Hiding
    -   Freezing Panes
    -   Splitting Panes
    -   Zooming

-   Data manipualtions
    -   Inserting and Deleting Cells, Columns and Rows
    -   Undo and Redo
    -   Copy and Paste
    -   Data Validation
    -   Worksheets
    -   Hyperlinks

-   Visual configurations
    -   Gridlines
    -   Cell Alignment
    -   Cell Borders
    -   Font Styles

![](images/spreadsheet.png)

#### Related Topics
-   [igSpreadsheet Overview](igspreadsheet-overview.html)
-   [Adding igSpreadsheet](adding-igspreadsheet.html)
-   [Configuring igSpreadsheet](igspreadsheet-configuring.html)


#### Related Samples
-   [Overview](%%SamplesUrl%%/spreadsheet/overview)
-   [View Configuration](%%SamplesUrl%%/spreadsheet/create-view-save)
-   [Import Data From Excel File](%%SamplesUrl%%/spreadsheet/loading-data)

## <a id="igScheduler"></a> igScheduler
### 新しいコントロール (RTM)

`igScheduler`™ コントロールは、時間範囲および関連アクティビティを表示し、管理するスケジュール ソリューションを提供します。

### RTM でサポートされる機能
-   予定の作成、編集、削除
    -   月単位の表示で構成可能な予定表示モード (インジケーターまたはイベントの件名)
    -   予定を色付きリソースへの割り当て
-   別のビューの使用 (月ビューおよび予定一覧ビュー)
    -   月ビューおよび予定一覧ビューの間の切り替え
    -   月ビューでの予定一覧ビュー
    -   構成可能な予定一覧ビューの日の表示範囲
-   終日イベントのサポート
-   デスクトップ、タブレット、および携帯レイアウト
-   レスポンシブ デザイン
    -   デスクトップ環境に最適化された UI
-   リソースの色スキーマ サポート
-   キーボード ナビゲーション サポート
-   ローカライズのサポート

![](../02_Controls/igScheduler/images/scheduler.png)

#### 関連トピック
-   [igScheduler の概要](igScheduler-Overview.html)
-   [igScheduler の構成](igscheduler-configuring.html)
-	[igScheduler の追加](igscheduler-adding-igscheduler.html)
-	[igScheduler の構成](igscheduler-Configuring.html)
-	[igScheduler のスタイル設定](igscheduler-using-themes.html)
-	[アクセシビリティの遵守 (igScheduler)](igscheduler-accessibility-compliance.html)
-	[既知の問題と制限 (igScheduler)](igscheduler-known-limitations.html)

#### 関連サンプル

-   [igScheduler 予定一覧ビュー](%%SamplesUrl%%/scheduler/agenda-view)
-   [igScheduler 予定インジケーター](%%SamplesUrl%%/scheduler/appointment-indicators)

### igGrid

機能 | 説明
---|---
[GroupBy 集計](#groupSummaries)| GroupBy 機能により集計行を各グループのデータ アイランドの下に表示できるようになりました。

## igGrid

### <a id="groupSummaries"></a> GroupBy 集計

GroupBy 集計機能は、そのアイランドにあるデータ列の集計情報を表示するグループ データ アイランドの下に追加の集計行を表示します。集計行は、関連するグループが展開された場合のみ表示されます。

![](images/group-summaries.png)

#### 関連トピック
-   [GroupBy 集計の機能概要 (igGrid)](igGrid-GroupBy-Summaries.html)

#### 関連サンプル
-   [集計とグループ化](%%SamplesUrl%%/grid/grouping)

## igCombo

### <a id="comboKnockoutDisable"></a> Knockout の Disable ハンドラー

開発者がコンボ コントロールに Knockout の [`disabled`](http://knockoutjs.com/documentation/disable-binding.html) バインディング ハンドラーを適用したい場合、ハンドラーは動作せず、自動的に有効/無効にしません。コンボにコントロールの有効化/無効化を処理する特別なロジックがあります。そのため、Knockout `disabled` ハンドラーを使用時に予期される動作を実装する追加の `igComboDisable` バインディング ハンドラーが作成されます。

#### 関連トピック
-   [Knockout サポートの構成 (igCombo)](igCombo-KnockoutJS-Support.html#)

## エディター

### <a id="editorsKnockoutDisable"></a> Knockout の Disable ハンドラー

開発者がエディターに Knockout の [`disabled`](http://knockoutjs.com/documentation/disable-binding.html) バインディング ハンドラーを適用したい場合、ハンドラーは動作せず、自動的に有効/無効にしません。エディターにコントロールの有効化/無効化を処理する特別なロジックがあります。そのため、Knockout `disabled` ハンドラーを使用時の予期される動作を実装する追加の `igEditorDisable` バインディング ハンドラーが作成されます。

#### 関連トピック
-   [Knockout サポートの構成 (エディター)](Configuring-Knockout-Support-%28Editors%29.html)

## igNumericEditor

### <a id="roundDecimals"></a> 10 進数の丸み

製品の以前バージョンで、ユーザーが `maxDecimals` オプションで定義される数より大きい小数位がある値を数値エディターに入力すると、値が切り捨てられます。つまり、`maxDecimals` が `3` に設定されるエディターが `123.4567` の値を受けると、`123.456` に切り捨てられます。製品の 17.1 バージョンで新しい [`roundDecimals`](ui.ignumericeditor#options:roundDecimals) オプションを追加しました。デフォルトで有効で、JavaScript の `Math.round()` 関数を使用して数値を丸めます。`123.4567` の値は丸めて、エディターで `123.457` として表示されます。[`roundDecimals`](ui.ignumericeditor#options:roundDecimals) オプションが無効な場合、値を切り捨て、以前のバージョンと同じように `123.456` を表示します。

## igDateEditor/igDatePicker

### <a id="dateHandling"></a> Date Handling

When the dates in the editors are transferred from the client to the server аnd vice versa, the options [`enableUTCDates`](%%jQueryApiUrl%%/ui.igdateeditor#options:enableUTCDates) and [`displayTimeOffset`](%%jQueryApiUrl%%/ui.igdateeditor#options:displayTimeOffset) can be used to configure the editоrs and to properly handle date transfer.

#### Related Topics
-   [Migrating enableUTCDate option in 17.1](Migrating-enableUTCDates-option-in-17-1.html)
-   [Ignite UI controls in different time zones](Using-IgniteUI-controls-in-different-time-zones.html)

## igDatePicker

### <a id="pickerOptionsWrapper"></a> Date Picker Options MVC wrapper

The DatePicker MVC wrapper is extended to allow the definition of the date picker options, using additional MVC wrapper. The new wrapper contains all the jQuery UI datepicker options that can be applied to our igDatePicker. Here is an example of how it can be configured in MVC:

```
@(Html.Infragistics()
	.DatePicker()
	.DropDownAnimationDuration(1000)
	.DatePickerOptions(options => {
		 options.DefaultDate("+8");
		 options.MinDate("-5d");
		 options.MaxDate("+10d");

		 options.FirstDay(FirstWeekDay.Monday);
		 options.ShowWeek(true);

		 options.ShowOtherMonths(true);
		 options.SelectOtherMonths(true);

		 options.ChangeMonth(true);
		 options.ChangeYear(true);
		 options.AddClientEvent("onChangeMonthYear", "onChangeMonthYearHandler");

		 options.ShowButtonPanel(true);
		 options.GoToCurrent(true);

		 options.ShowAnim(AnimationEffect.Show);

		 options.AddClientEvent("onSelect", "onSelectHandler");
		 options.AddClientEvent("onClose", "onCloseHandler");
	})
	.Render())
```
