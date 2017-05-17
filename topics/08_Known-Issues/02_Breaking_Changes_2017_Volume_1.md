<!--
|metadata|
{
    "fileName": "breaking-changes-2017-volume-1",
    "controlName": "",
    "tags": ["Breaking Changes","Known Issues"]
}
|metadata|
-->

# 2017 Volume 1 の重大な変更

以下のトピックは、2017 Volume 1 新機能の概要を示します。

## General

### [Split of the Infragstics Util file](#util)

From version 17.1 the `infragistics.util.js` file has been split into a non-jQuery specific file and jQuery specific files. The new structure is the following:

-   `infragistics.util.js` - holds only utility functions that do not depend on jQuery framework.
-   `infragistics.util.jquery.js` - holds jQuery dependant utility functions.
-   `infragistics.util.jquerydeferred.js` - custom CommonJS Promises/A implementation, for users that are using versions of the jQuery, prior to version 1.5, which doesn't support $.Deferred.

For applications that are using the igLoader to load Ignite IU controls' dependencies, no change is required, because the loader is handling this internally. The other applications that load manaully the files, may take advantage and not include the unnecessary utility references.

## igGrid

### [igGrid Summaries のオプション変更](#summaries)
igGrid 集計のメイン レベル オプションである [*isGridFormatter*](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:isGridFormatter) および [*defaultDecimalDisplay*](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:defaultDecimalDisplay) は削除されました。
[columnSettings.summaryOperands](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:columnSettings.summaryOperands) の [*isGridFormatter*](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:columnSettings.summaryOperands.isGridFormatter) および [*decimalDisplay*](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:columnSettings.summaryOperands.decimalDisplay) オプションは削除されました。

igGrid 集計の新しい [*format*](%%jQueryApiUrl%%/ui.iggridsummaries#options:columnSettings.summaryOperands.format) オプションは、[*format*](%%jQueryApiUrl%%/ui.iggrid#options:columns.format) および [*autoFormat*](%%jQueryApiUrl%%/ui.iggrid#options:autoFormat) オプションと組み合わせて使用して、集計の書式を設定できるようになりました。

このオプションでは、削除された *decimalDisplay* と同様に浮動小数点の後に表示する桁数を設定できます。summaryOperand の [*format*](%%jQueryApiUrl%%/ui.iggridsummaries#options:columnSettings.summaryOperands.format) オプションが設定されていない場合、集計の書式は表示先の列に基づいて決定されます。つまり、列に [*format*](%%jQueryApiUrl%%/ui.iggrid#options:columns.format) が設定されている場合、その書式が使用されます。

集計と現在の列に書式が設定されていない場合、列タイプの地域の設定が集計に適用されます。[*autoFormat*](%%jQueryApiUrl%%/ui.iggrid#options:autoFormat) が 'date' のデフォルトのため、地域の設定はその列タイプの集計のみに適用されます。その他の列タイプは書式設定が適用されません。集計と列に *format* オプションを設定せずに地域の設定を他の列タイプに適用する必要がある場合、[*autoFormat*](%%jQueryApiUrl%%/ui.iggrid#options:autoFormat) を設定します。地域自動書式設定の適用を集計がどの列にあるかに基づいて指定します。

## [igDateEditor/igDatePicker](#timeOffset)

The option [`enableUTCDates`](%%jQueryApiUrl%%/ui.igdateeditor#options:enableUTCDates) has now a different function. You can use the [`displayTimeOffset`](%%jQueryApiUrl%%/ui.igdateeditor#options:displayTimeOffset) if you want to show the time in the editor with the desired offset. Please follow the [Migrating enableUTCDate option in 17.1](Migrating-enableUTCDates-option-in-17-1.html) topic to see how you can adapt to the new changes and the [Using Ignite UI controls in different time zones](Using-IgniteUI-controls-in-different-time-zones.html) topic for more detailed infomration of how the both options work.

## igNumericEditor(#roundDecimals)

In previous versions of the product, if user sets or enters a value in a numeric editor that has more decimal places than the one defined in the `maxDecimals` option, then the value was truncated. E.g. If an editor with defined 'maxDecimals' to `3`, receives a value `123.4567`, then it will be truncated to `123.456`. With version 17.1 of the product, a new option [`roundDecimals`](ui.ignumericeditor#options:roundDecimals) is introduced, which is enabled by default and rounds the numeric values, using the JavaScript `Math.round()` function. This means that the value of `123.4567` will be rounded and displayed in the editor as `123.457`. If the [`roundDecimals`](ui.ignumericeditor#options:roundDecimals) is disabled, then it will truncate the value and will show it as `123.456`, like in the old versions.
