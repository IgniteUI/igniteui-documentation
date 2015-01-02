<!--
|metadata|
{
    "fileName": "igcurrencyeditor-igcurrencyeditor-known-issues",
    "controlName": "igEditors",
    "tags": ["Known Issues"]
}
|metadata|
-->

# igCurrencyEditor 既知の問題


**既知の問題**

-   エディターのベース要素が INPUT または TEXTAREA 要素であり、ボタン、テーマ、または [`renderInContainer`](%%jQueryApiUrl%%/ui.igCurrencyEditor#options:renderInContainer) オプションが有効な場合、その要素はその親から削除され、SPAN 要素内にラップされます。これは、ページのレイアウトおよび元のベース要素の兄弟に影響を与える場合があります。
-   エディターのベース要素が TD 要素 (または、SPAN または DIV 要素以外の特別なコンテナー) のとき、一部のブラウザーでコントロールを描画できない場合があります。たとえば、[`igCurrencyEditor`](%%jQueryApiUrl%%/ui.igCurrencyEditor#!overview) コントロールのベース要素として TD を使用すると、Safari でのレンダリングは失敗します。この状況を改善するには、表示オプションのデフォルト値を **inline-block** から **block** に変更します。
-   ベース要素が INPUT または TEXTAREA 要素の場合、初期化後にテーマ オプションを変更することはできません。ボタンの場合は、renderInContainer およびテーマ オプションが無効になります。
-   エディター コントロールが、SPAN 要素ラッパーなしで INPUT または TEXTAREA 要素として描画される場合、パーセントやその他の HTML 単位を含む文字列に幅と高さを設定できます。

既知の問題およびすべてのエディターの重大な変更の詳しいリストについては、[igEditors 一般的な既知の問題](igCurrencyEditor-igEditor-Known-Issues.html)を参照してください。

## 関連リンク

[igCurrencyEditor の概要](igCurrencyEditor-igCurrencyEditor-Overview.html)

 

 


