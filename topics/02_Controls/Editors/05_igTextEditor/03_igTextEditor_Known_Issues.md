<!--
|metadata|
{
    "fileName": "igtexteditor-known-issues",
    "controlName": "igEditors",
    "tags": ["Editing","Known Issues"]
}
|metadata|
-->

# igTextEditor 既知の問題



##既知の問題

-   エディターのベース要素が INPUT または TEXTAREA 要素であり、ボタン、テーマ、または [renderInContainer](%%jQueryApiUrl%%/ui.igTextEditor#options:renderInContainer) オプションが有効な場合、その要素はその親から削除され、SPAN 要素内にラップされます。これは、ページのレイアウトおよび元のベース要素の兄弟に影響を与える場合があります。
-   エディターのベース要素が TD 要素 (または、SPAN または DIV 要素以外の特別なコンテナー) のとき、一部のブラウザーでコントロールを描画できない場合があります。.たとえば、`igCurrencyEditor` コントロールのベース要素として TD を使用するとき、Safari で描画が失敗します。この状況を改善するには、[display](%%jQueryApiUrl%%/ui.igTextEditor#options:display) オプションのデフォルト値を inline-block から block に変更します。
-   ベース要素が INPUT または TEXTAREA 要素で、[button](%%jQueryApiUrl%%/ui.igTextEditor#options:button)、`renderInContainer` および [theme](%%jQueryApiUrl%%/ui.igTextEditor#options:theme) オプションが無効の場合、初期化後にテーマ オプションを変更することはできません。
-   ベース要素が INPUT 要素のとき、[textMode](%%jQueryApiUrl%%/ui.igTextEditor#options:textMode) オプションを multiline に設定することはサポートされていません。
-   ベース要素が TEXTAREA 要素のとき、`textMode` オプションは　multiline に設定され無効にできません
-   エディターのボタン、テーマ、または `renderInContainer` オプションが有効、または、ベース要素が INPUT 要素または TEXTAREA 要素でない場合、幅および高さのオプションは数値 (ピクセル単位) のみサポートしています。
-   エディターが、SPAN 要素ラッパーなしで INPUT または TEXTAREA 要素として描画される場合、パーセントやその他の HTML 単位を含む文字列を幅と高さに設定できます。
-   button、`textMode`、および `renderInContainer` オプションの初期化後に値を変更することはサポートされていません。
-   [listMatchIgnoreCase](%%jQueryApiUrl%%/ui.igTextEditor#options)、[listMatchOnly](%%jQueryApiUrl%%/ui.igTextEditor#options)、[listMatchContains](%%jQueryApiUrl%%/ui.igTextEditor#options)、および [listAutoComplete](%%jQueryApiUrl%%/ui.igTextEditor#options) などのリストによるエントリのフィルタリングに関連するオプションは、[type](%%jQueryApiUrl%%/ui.igTextEditor#options) が [text](%%jQueryApiUrl%%/ui.igTextEditor#options) に設定された `igEditor` または `igTextEditor` にのみ有効です。
-   ベース要素が TEXTAREA (textMode=”multiline”) 要素で、複数行の入力によってフィールドがスクロールする場合:
    -   Shift + Enter 使用せずに複数回キーボード入力した後に、垂直方向のスクロールに失敗し、カレットが非表示になる場合があります。この現象は、テキストの途中にカレットがある場合に発生します。
    -   ブラウザーの中でも特に Firefox では、キーを押すたびにテキストが垂直または水平方向に移動する場合があります。

既知の問題およびすべてのエディターの重大な変更の詳しいリストについては、[igEditors 一般的な既知の問題](igCurrencyEditor-igEditor-Known-Issues.html)を参照してください。

## 関連リンク
[igTextEditor の概要](igTextEditor-Overview.html)

 

 


