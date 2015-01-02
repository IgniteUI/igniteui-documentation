<!--
|metadata|
{
    "fileName": "igmaskeditor-known-issues",
    "controlName": "igEditors",
    "tags": ["Editing","Known Issues"]
}
|metadata|
-->

# igMaskEditor の既知の問題

##既知の問題

-   ベース要素が INPUT または TEXTAREA 要素の場合、初期化後にテーマ オプションを変更することはできません。ボタンの場合は、[`renderInContainer`](%%jQueryApiUrl%%/ui.igMaskEditor#options:renderInContainer) およびテーマ オプションが無効になります。
-   エディターが、SPAN 要素ラッパーなしで INPUT または TEXTAREA 要素として描画される場合、パーセントやその他の HTML 単位を含む文字列を幅と高さに設定できます。
-   [`button`](%%jQueryApiUrl%%/ui.igMaskEditor#options:button)、[`textMode`](%%jQueryApiUrl%%/ui.igMaskEditor#options:textMode)、および renderInContainer オプションの初期化後に値を変更することはサポートされていません。

既知の問題およびすべてのエディターの重大な変更の詳しいリストについては、[igEditors 一般的な既知の問題](igCurrencyEditor-igEditor-Known-Issues.html)を参照してください。

##関連リンク


- [igMaskEditor の概要](igMaskEditor--Overview.html)

 

 


