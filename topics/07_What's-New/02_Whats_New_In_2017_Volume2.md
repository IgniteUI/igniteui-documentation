<!--
|metadata|
{
    "fileName": "whats-new-in-2017-volume2",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# 2017 Volume 2 の新機能

このトピックでは、Ignite UI™ 2017 Volume 2 リリースのコントロールと新機能および拡張機能を紹介します。


## 新機能の概要

以下の表に 2017 Volume 2 の新機能の概要を示します。追加の詳細は以下のとおりです。

### 全般
機能 | 説明
---|---
[新規のバンドル ファイル](#bundledFiles)| Excel、スプレッドシート、およびスケジューラの新規のバンドル ファイルがあります。

### スプレッドシート
機能 | 説明
---|---
[編集](#spreadsheetEditing)| スプレッドシート コンテンツの編集。
[MVC ラッパー](#spreadsheetMVCWrapper)| スプレッドシート コントロールの MVC ラッパー。

### エディター

機能 | 説明
---|---
[キーボードの制御](#suppressKeyboard)| ドロップダウン ボタンがクリック/タップされたときにスクリーン キーボードが表示されないようにします。

### igDateEditor/igDatePicker

機能 | 説明
---|---
[スピン デルタをオブジェクトとして構成](#spinDeltaObject)| スピン デルタを各時間間隔の指定値を定義するオブジェクトとして構成できます。

### igValidator

機能 | 説明
---|---
[すべてのルールの実行](#execute-all-rules)| 新しいオプションは、複数のルールを実行し、複数のエラー メッセージを表示できます。

### 全般

### <a id="bundledFiles"></a> 新規のバンドル ファイル

Excel、スプレッドシート、およびスケジューラの新規のバンドル ファイルは 17.2 リリースに含まれています。各必須リソースを読み込むか、igLoader を使用する代わりにバンドル ファイルを使用できます。Excel、スプレッドシート、またはスケジューラを実行するには、以下のバンドル リソースを読み込む必要があります。

igExcel を使用した igGrid の Excel エクスポート

```
<script type="text/javascript" src="igniteui/js/infragistics.core.js"></script>
<script type="text/javascript" src="igniteui/js/infragistics.lob.js"></script>
<script type="text/javascript" src="igniteui/js/infragistics.excel-bundled.js"></script>
<script type="text/javascript" src="igniteui/js/modules/infragistics.gridexcelexporter.js"></script>
```

igSpreadsheet

```
<script src="igniteui/js/infragistics.core.js"></script>
<script src="igniteui/js/infragistics.lob.js"></script>
<script src="igniteui/js/infragistics.excel-bundled.js"></script>
<script src="igniteui/js/infragistics.spreadsheet-bundled.js"></script>
```

igScheduler

```
<script src="igniteui/js/infragistics.core.js"></script>
<script src="igniteui/js/infragistics.lob.js"></script>
<script src="igniteui/js/infragistics.scheduler-bundled.js"></script>
```

## スプレッドシート

### <a id="spreadsheetEditing"></a> スプレッドシート コンテンツの編集

製品の 17.2 バージョンはスプレッドシートのセルに編集のサポートを追加します。スプレッドシート コンテンツの編集で使用可能な新しい API イベント、メソッド、およびオプションがあります。

新しいイベント:
-   [`editModeEntering`](ui.igspreadsheet#events:editModeEntering) - Spreadsheet が [`activeCell`](ui.igspreadsheet#options:activeCell) のインプレース編集を開始しようとするときに呼び出されます。
-   [`editModeEntered`](ui.igspreadsheet#events:editModeEntered) - Spreadsheet が [`activeCell`](ui.igspreadsheet#options:activeCell) のインプレース編集を開始したときに呼び出されます。
-   [`editModeExiting`](ui.igspreadsheet#events:editModeExiting) - Spreadsheet が [`activeCell`](ui.igspreadsheet#options:activeCell) のインプレース編集を終了しようとするときに呼び出されます。
-   [`editModeExited`](ui.igspreadsheet#events:editModeExited) - Spreadsheet が [`activeCell`](ui.igspreadsheet#options:activeCell) のインプレース編集を終了したときに呼び出されます。
-   [`editModeValidationError`](ui.igspreadsheet#events:editModeValidationError) - Spreadsheet が編集モードを終了し、[`activeCell`](ui.igspreadsheet#options:activeCell) の新しい値がセルの [`ig.excel.DataValidationRule`](ig.excel.DataValidationRule) の条件に基づいて有効ではない場合に発生されます。 


新しいメソッド:
-   [`getIsInEditMode()`](ui.igspreadsheet#methods:getIsInEditMode) - コントロールが現在 [`activeCell`](ui.igspreadsheet#options:activeCell) の値を編集しているかどうかを示します。
-   [`getCellEditMode()`](ui.igspreadsheet#methods:getCellEditMode) - 現在の編集モード状態を示すために使用する列挙体を返します。

新しいオプション:
-   [`isFixedDecimalEnabled`](ui.igspreadsheet#options:isFixedDecimalEnabled) - 編集モードで整数が入力されたときに固定小数位が自動的に追加されるかどうかを示します。
-   [`fixedDecimalPlaceCount`](ui.igspreadsheet#options:fixedDecimalPlaceCount) - 編集モードで入力された整数に使用される小数位。

#### 関連トピック
-   [igSpreadsheet の概要](igspreadsheet-overview.html)
-   [編集 API (igSpreadsheet)](igspreadsheet-editing.html) 

#### 関連サンプル
-   [概要](%%SamplesUrl%%/spreadsheet/overview)
-   [表示の構成](%%SamplesUrl%%/spreadsheet/create-view-save)
-   [エクセル ファイルからデータをインポート](%%SamplesUrl%%/spreadsheet/loading-data)

## エディター

### <a id="suppressKeyboard"></a> キーボードの制御

[`suppressKeyboard`](ui.igtexteditor#options:suppressKeyboard) オプションは、ドロップダウン ボタンがクリックまたはタップされたとき、デバイスで利用可能な場合に画面にキーボードの表示を回避します。このオプションは最初のフォーカスを回避するか、ドロップダウン ボタンがクリックまたはタップされたときにフォーカスを解除します。

## igDateEditor/igDatePicker

### <a id="spinDeltaObject"></a> スピン デルタをオブジェクトとして構成

[`spinDelta`](%%jQueryApiUrl%%/ui.igdateeditor#options:spinDelta) オプションを各時間間隔の指定値を定義するオブジェクトとして構成できます。
クライアント側ウィジェットのデルタに有効な値は正の整数で、浮動小数点数の分数が無視されます。
MVC ラッパーのデルタの有効な値は整数です。

このオプションは以下の形式が有効です。

```
$("#editor").igDateEditor({
    value: new Date(2017, 11, 8, 1, 1, 1),
    dateInputFormat: "dateTime",
    spinDelta: {
        year: 4,
        month: 3,
        day: 10,
        hours: 12,
        minutes: 15,
        seconds: 10,
        milliseconds: 100
    }
});
```

MVC の場合:
```
@(Html.Infragistics()
	.DateEditor()
	.Value(new DateTime(2017, 11, 8, 1, 1, 1))
    .DateInputFormat("dateTime")
    .SpinDelta(deltas =>
    {
        deltas.Year(4);
        deltas.Month(3);
        deltas.Day(10);
        deltas.Hours(12);
        deltas.Minutes(15);
        deltas.Seconds(10);
        deltas.Milliseconds(100);
    })
	.Render())
```

## igValidator 

### <a id="execute-all-rules"></a> すべてのルールの実行

`igValidator` は、ルールが失敗した場合も複数のルールを実行し、複数のエラー メッセージを表示する新しい [`executeAllRules`](%%jQueryApiUrl%%/ui.igValidator#options:executeAllRules) オプションをサポートします。

![](../02_Controls/igValidator/images/igValidator-execute-all-rules.png)

[`error`](%%jQueryApiUrl%%/ui.igValidator#events:error) または [`validated`](%%jQueryApiUrl%%/ui.igValidator#events:validated) などのエラーに関連するイベントは `ui.rules` および `ui.messages` 配列引数を提供します。これは失敗したルールおよびそのメッセージを示します。

この実行処理の変更で、ルールが空値の場合も実行するかどうかを指定し、[`custom`](%%jQueryApiUrl%%/ui.igValidator#options:custom) ルールも値なしで実行できます。 `required` オプションに関係なく外部の要件に基づく検証が空の値に適用できます。

#### 関連トピック
-   [入力規則](igValidator-Validation-Rules.html)