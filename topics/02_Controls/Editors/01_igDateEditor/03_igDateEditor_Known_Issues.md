<!--
|metadata|
{
    "fileName": "igdateeditor-known-issues",
    "controlName": "igEditors",
    "tags": ["Editing","Known Issues"]
}
|metadata|
-->

# igDateEditor の既知の問題

**既知の問題**

-   エディターのベース要素が INPUT または TEXTAREA 要素で、ボタン、テーマ、または [`renderInContainer`](%%jQueryApiUrl%%/ui.igDateEditor#options:renderInContainer) オプションが有効な場合、その要素はその親から削除され、SPAN 要素内にラップされます。これは、ページのレイアウトおよび元のベース要素の兄弟に影響を与える場合があります。

-   [`button`](%%jQueryApiUrl%%/ui.igDateEditor#options:button)、[`textMode`](%%jQueryApiUrl%%/ui.igDateEditor#options:textMode)、および `renderInContainer` オプションの初期化後に値を変更することはサポートされていません。

-   ベース要素が INPUT または TEXTAREA 要素の場合、初期化後にテーマ オプションを変更することはできません。ボタンの場合は、`renderInContainer` およびテーマ オプションが無効になります。

既知の問題およびすべてのエディターの重大な変更の詳しいリストについては、[igEditors 一般的な既知の問題](igCurrencyEditor-igEditor-Known-Issues.html)を参照してください。

## 関連リンク

[igDateEditor の概要](igDateEditor-Overview.html)

 

 


