<!--
|metadata|
{
    "fileName": "igdatepicker-known-issues",
    "controlName": "igDatePicker",
    "tags": ["Known Issues"]
}
|metadata|
-->

# igDatePicker 既知の問題

**既知の問題**

-   ドロップダウンのすべてのトリガーを無効にするには、[`dropDownTriggers`](%%jQueryApiUrl%%/ui.igDatePicker#options:dropDownTriggers) オプションを空の文字列または null に設定する必要があります。

-   *datepicker* に設定された [`type`](%%jQueryApiUrl%%/ui.igDatePicker#options:type) オプションまたは igDatePicker を igEditor コントロールが持つ場合、`igEditor` は jquery-datepicker に依存し、`jquery.ui.datepicker.js` への参照または `jqueryui/1.8.7/jquery-ui.js` などの結合ライブラリへの参照が必要です。

-   datepicker に設定された [`type`](%%jQueryApiUrl%%/ui.igDatePicker#options:type) または igDatePicker を持つ igEditor コントロールは、*multiline* に設定された `textMode` オプションまたはベース要素としての TEXTAREA 要素をサポートしていません。

既知の問題およびすべてのエディターの重大な変更の詳しいリストについては、[igEditor 既知の問題](igEditor-Known-Issues-DP.html) を参照してください。

## 関連リンク

- [igDatePicker の概要](igDatePicker-Overview.html)

 

 


