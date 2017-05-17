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

### igCombo

Feature | Description
---|---
[Knockout Disable Handler](#comboKnockoutDisable)| Knockout Disable binding handler has been implemnted for the combo.

### Editors

Feature | Description
---|---
[Knockout Disable Handler](#editorsKnockoutDisable)| Knockout Disable binding handler has been implemnted for the editors.

### igNumericEditor

Feature | Description
---|---
[Round Decimals](#roundDecimals)| The numeric editor introduces new option [`roundDecimals`](ui.ignumericeditor#options:roundDecimals), that allows to round values with decimal point.

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

### <a id="comboKnockoutDisable"></a> Knockout Disable Handler

If a developer wants to apply the Knockout [`disabled`](http://knockoutjs.com/documentation/disable-binding.html) binding handler to the combo control, it will not work and will not automatically enables/disables it. This is because combo has a special logic that handles enabling/disabling of the control. For that purpose additional `igComboDisable` binding handler is created, which implements the behavior, expected, when using the Knockout `disabled` handler.

#### Related Topics
-   [Configuring Knockout Support (igCombo)](igCombo-KnockoutJS-Support.html#)

## Editors

### <a id="editorsKnockoutDisable"></a> Knockout Disable Handler

If a developer wants to apply the Knockout [`disabled`](http://knockoutjs.com/documentation/disable-binding.html) binding handler to the editors, it will not work and will not automatically enables/disables them. This is because editors have a special logic that handles enabling/disabling of the control. For that purpose additional `igEditorDisable` binding handler is created, which implements the behavior, expected, when using the Knockout `disabled` handler.

#### Related Topics
-   [Configuring Knockout Support (Editors)](Configuring-Knockout-Support-%28Editors%29.html)

## igNumericEditor

### <a id="roundDecimals"></a> Round Decimals

In previous versions of the product, if user sets or enters a value in a numeric editor that has more decimal places than the one defined in the `maxDecimals` option, then the value was truncated. E.g. If an editor with defined 'maxDecimals' to `3`, receives a value `123.4567`, then it will be truncated to `123.456`. With version 17.1 of the product, a new option [`roundDecimals`](ui.ignumericeditor#options:roundDecimals) is introduced, which is enabled by default and rounds the numeric values, using the JavaScript `Math.round()` function. This means that the value of `123.4567` will be rounded and displayed in the editor as `123.457`. If the [`roundDecimals`](ui.ignumericeditor#options:roundDecimals) is disabled, then it will truncate the value and will show it as `123.456`, like in the old versions.