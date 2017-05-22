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

## 全般

### Infragistics Util ファイルの分割

17.1 バージョン以後、`infragistics.util.js` ファイルが jQuery 以外のファイルおよび jQuery に関連するファイルに分割されます。新しい構造は以下のようになります。

-   `infragistics.util.js` - jQuery フレームワークに依存関係なしのユーティリティ関数を含みます。
-   `infragistics.util.jquery.js` - jQuery に依存関係あるユーティリティ関数を含みます。
-   `infragistics.util.jquerydeferred.js` - カスタム CommonJS Promises。それに、$.Deferred をサポートしない 1.5 バージョン以前の jQuery バージョンの実装。

%%ProductName%% コントロールの依存関係を読み込むために igLoader を使用するアプリケーションでローダーが内部に処理されているため、変更の必要がありません。ファイルを手動的に読み込むアプリケーションで必要のないのユーティリティ参照を削除できます。

### New Bootstrap themes structure

The default and all Bootstrap 3 based themes have moved under a common "/bootstrap3" folder. The following lists the current Bootstrap 3 themes currently shipped with %%ProductName%% and the location of the `infragistics.theme.css` relative to the product source root ("~"):

Themes | Previous path | New Path
-------|---------------|---------
Bootstrap 3 (default) |  ~/css/themes/bootstrap/ | ~/css/themes/bootstrap3/
Flatly | ~/css/themes/flatly/ | ~/css/themes/bootstrap3/flatly/
Yeti | ~/css/themes/yeti/ | ~/css/themes/bootstrap3/yeti/
Superhero | ~/css/themes/superhero/ | ~/css/themes/bootstrap3/superhero/

So for pages referencing the current Yeti theme for example, the new link becomes:
```html
<link href="/css/themes/bootstrap3/yeti/infragistics.theme.css" rel="stylesheet" type="text/css" />
```
Or if using the Infragistics Loader with [`theme`](%%jQueryApiUrl%%/ig.loaderClass#options:settings.theme) option:

```js
$.ig.loader({
    //...
    theme: "bootstrap3/yeti"
});
```

## igGrid

### igGrid Summaries のオプション変更
igGrid 集計のメイン レベル オプションである [*isGridFormatter*](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:isGridFormatter) および [*defaultDecimalDisplay*](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:defaultDecimalDisplay) は削除されました。
[columnSettings.summaryOperands](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:columnSettings.summaryOperands) の [*isGridFormatter*](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:columnSettings.summaryOperands.isGridFormatter) および [*decimalDisplay*](http://jp.igniteui.com/help/api/2016.2/ui.iggridsummaries#options:columnSettings.summaryOperands.decimalDisplay) オプションは削除されました。

igGrid 集計の新しい [*format*](%%jQueryApiUrl%%/ui.iggridsummaries#options:columnSettings.summaryOperands.format) オプションは、[*format*](%%jQueryApiUrl%%/ui.iggrid#options:columns.format) および [*autoFormat*](%%jQueryApiUrl%%/ui.iggrid#options:autoFormat) オプションと組み合わせて使用して、集計の書式を設定できるようになりました。

このオプションでは、削除された *decimalDisplay* と同様に浮動小数点の後に表示する桁数を設定できます。summaryOperand の [*format*](%%jQueryApiUrl%%/ui.iggridsummaries#options:columnSettings.summaryOperands.format) オプションが設定されていない場合、集計の書式は表示先の列に基づいて決定されます。つまり、列に [*format*](%%jQueryApiUrl%%/ui.iggrid#options:columns.format) が設定されている場合、その書式が使用されます。

集計と現在の列に書式が設定されていない場合、列タイプの地域の設定が集計に適用されます。[*autoFormat*](%%jQueryApiUrl%%/ui.iggrid#options:autoFormat) が 'date' のデフォルトのため、地域の設定はその列タイプの集計のみに適用されます。その他の列タイプは書式設定が適用されません。集計と列に *format* オプションを設定せずに地域の設定を他の列タイプに適用する必要がある場合、[*autoFormat*](%%jQueryApiUrl%%/ui.iggrid#options:autoFormat) を設定します。地域自動書式設定の適用を集計がどの列にあるかに基づいて指定します。

## igDateEditor/igDatePicker

[`enableUTCDates`](%%jQueryApiUrl%%/ui.igdateeditor#options:enableUTCDates) オプションの動作を変更しました。指定したオフセットとエディターで時間を表示するには [`displayTimeOffset`](%%jQueryApiUrl%%/ui.igdateeditor#options:displayTimeOffset) を使用します。既存のアプリケーションを変更する方法について、「[17.1 で enableUTCDate オプションの移動](Migrating-enableUTCDates-option-in-17-1.html)」トピックを参照してください。両方のオプションの詳細情報について、「[Ignite UI コントロールを別のタイム ゾーンで使用](Using-IgniteUI-controls-in-different-time-zones.html)」を参照してください。

## igNumericEditor

製品の以前バージョンで、ユーザーが `maxDecimals` オプションで定義される数より大きい小数位がある値を数値エディターに入力すると、値が切り捨てられます。つまり、`maxDecimals` が `3` に設定されるエディターが `123.4567` の値を受け取ると、`123.456` に切り捨てられます。製品の 17.1 バージョンで新しい [`roundDecimals`](ui.ignumericeditor#options:roundDecimals) オプションを追加しました。デフォルトで有効で、JavaScript の `Math.round()` 関数を使用して数値を丸めます。`123.4567` の値は丸めて、エディターで `123.457` として表示されます。[`roundDecimals`](ui.ignumericeditor#options:roundDecimals) オプションが無効な場合、値を切り捨て、以前のバージョンと同じように `123.456` を表示します。
