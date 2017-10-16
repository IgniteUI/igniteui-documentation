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

### General
Feature | Description
---|---
[New bundled files](#bundledFiles)| New bundled files for excel, spreadsheet and scheduler.

### エディター

機能 | 説明
---|---
[キーボードの制御](#suppressKeyboard)| ドロップダウン ボタンがクリック/タップされたときにスクリーン キーボードが表示されないようにします。

### igDateEditor/igDatePicker

機能 | 説明
---|---
[スピン デルタをオブジェクトとして構成](#spinDeltaObject)| スピン デルタを各時間間隔の指定値を定義するオブジェクトとして構成できます。

### igValidator

Feature | Description
---|---
[Execute all rules](#execute-all-rules)| New option allows multiple rules to run and display multiple error messages.

### General

### <a id="bundledFiles"></a> New bundled files
New bundled files for excel, spreadsheet and scheduler have been included in 17.2 release. You can use them instead of defining individual required resources, or instead of using the igLoader. In order to run excel, spreadsheet or scheduler, it is needed to define the following bundled resources:

igGrid excel exporting using igExcel
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

### <a id="execute-all-rules"></a> Execute all rules

The `igValidator` now supports a new [`executeAllRules`](%%jQueryApiUrl%%/ui.igValidator#options:executeAllRules) option that allows multiple rules to run even if one has already failed and thus produce and display multiple error messages.

![](../02_Controls/igValidator/images/igValidator-execute-all-rules.png)

Error related events like [`error`](%%jQueryApiUrl%%/ui.igValidator#events:error) and [`validated`](%%jQueryApiUrl%%/ui.igValidator#events:validated) now also provide `ui.rules` and `ui.messages` array arguments, listing in order each rule that did not pass and its message.

With this execution process change, rules also specify if they should run for empty values and the [`custom`](%%jQueryApiUrl%%/ui.igValidator#options:custom) rule is now allowed to run without one. This allows for scenarios where validation based on external factors can be applied on the empty value independently of the `required` option.

#### Related Topics
-   [Validation Rules](igValidator-Validation-Rules.html)