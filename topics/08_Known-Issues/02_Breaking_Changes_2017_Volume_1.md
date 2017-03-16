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

以下の表は、2017 Volume 1 新機能の概要を示します。問題の詳細な説明は、概要表の後に記載されています。

凡例 | 
-------|--------
![](images/positive.png) | 回避策
![](images/negative.png) | 既知の回避策はありません。
![](images/plannedFix.png) | 修正予定です

## [igGrid Summaries のオプション変更](#summaries)
igGrid 集計のメイン レベル オプションである [*isGridFormatter*](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:isGridFormatter) および [*defaultDecimalDisplay*](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:defaultDecimalDisplay) は削除されました。
[columnSettings.summaryOperands](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:columnSettings.summaryOperands) の [*isGridFormatter*](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:columnSettings.summaryOperands.isGridFormatter) および [*decimalDisplay*](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:columnSettings.summaryOperands.decimalDisplay) オプションは削除されました。

igGrid 集計の新しい [*format*](%%jQueryApiUrl%%/ui.iggridsummaries#options:columnSettings.summaryOperands.format) オプションは、[*format*](%%jQueryApiUrl%%/ui.iggrid#options:columns.format) および [*autoFormat*](%%jQueryApiUrl%%/ui.iggrid#options:autoFormat) オプションと組み合わせて使用して、集計の書式を設定できるようになりました。

このオプションでは、削除された *decimalDisplay* と同様に浮動小数点の後に表示する桁数を設定できます。summaryOperand の [*format*](%%jQueryApiUrl%%/ui.iggridsummaries#options:columnSettings.summaryOperands.format) オプションが設定されていない場合、集計の書式は表示先の列に基づいて決定されます。つまり、列に [*format*](%%jQueryApiUrl%%/ui.iggrid#options:columns.format) が設定されている場合、その書式が使用されます。

集計と現在の列に書式が設定されていない場合、列タイプの地域の設定が集計に適用されます。[*autoFormat*](%%jQueryApiUrl%%/ui.iggrid#options:autoFormat) が 'date' のデフォルトのため、地域の設定はその列タイプの集計のみに適用されます。その他の列タイプは書式設定が適用されません。集計と列に *format* オプションを設定せずに地域の設定を他の列タイプに適用する必要がある場合、[*autoFormat*](%%jQueryApiUrl%%/ui.iggrid#options:autoFormat) を設定します。地域自動書式設定の適用を集計がどの列にあるかに基づいて指定します。
