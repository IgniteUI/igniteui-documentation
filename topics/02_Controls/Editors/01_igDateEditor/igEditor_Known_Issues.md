<!--
|metadata|
{
    "fileName": "igeditor-known-issues",
    "controlName": "igEditors",
    "tags": ["Editing","Known Issues"]
}
|metadata|
-->

# igEditor の既知の問題点



###既知の問題

-   エディターのベース要素が **INPUT** または **TEXTAREA** 要素で、ボタン、テーマ、または renderInContainer オプションが有効な場合、その要素はその親から削除され、SPAN 要素内にラップされます。これは、ページのレイアウトおよび元のベース要素の兄弟に影響を与える場合があります。
-   エディターのベース要素が **TD** 要素 (または、SPAN または DIV 要素以外の特別なコンテナー) のとき、一部のブラウザーでコントロールを描画できない場合があります。たとえば、igCurrencyEditor コントロールのベース要素として **TD** を使用すると、Safari でのレンダリングは失敗します。この状況を改善するには、表示オプションのデフォルト値を inline-block から block に変更します。
-   ベース要素が **INPUT** または **TEXTAREA** 要素の場合、初期化後にテーマ オプションを変更することはできません。ボタンの場合は、renderInContainer およびテーマ オプションが無効になります。
-   ベース要素が **INPUT** 要素のとき、textMode オプションを multiline に設定することはサポートされていません。
-   ベース要素が **TEXTAREA** 要素のとき、textMode オプションは「multiline」に設定され変更できません。
-   ベース要素が **SELECT** 要素のとき、**INPUT** 要素に置換されます。ドロップ ダウン ボタンおよびリスト項目がプログラム的に作成され、元の **SELECT** 要素のオプションによってコンテンツが埋められます。
-   エディターがボタン、テーマ、または renderInContainer オプションを有効にしている場合、または、ベース要素が **INPUT** または **TEXTAREA** 要素でない場合、幅および高さのオプションは数値 (ピクセル単位) のみをサポートしています。
-   エディターが、SPAN 要素ラッパーなしで **INPUT** または **TEXTAREA** 要素として描画される場合、パーセントやその他の HTML 単位を含む文字列を幅と高さに設定できます。
-   button、textMode、および renderInContainer オプションの初期化後に値を変更することはサポートされていません。
-   listMatchIgnoreCase、listMatchOnly、listMatchContains、および listAutoComplete などのリストによるエントリのフィルタリングに関連するオプションは、タイプがテキストに設定された igEditor または igTextEditor でのみ有効です。
-   ドロップダウンのすべてのトリガーを無効にするには、dropDownTriggers オプションを空の文字列または null に設定する必要があります。
-   編集フィールドの幅を超えるテキストをユーザーが入力する場合:
    -   カレットが、一部のブラウザーで表示されない可能性があります。(エディター コントロールにはこの現象を最小限にするロジックが備わっていますが、完全にはサポートされていません。)
    -   一部のブラウザーは、文字の入力中にカレットの位置をすぐに調整できない場合があります。カレットが一時的に (一瞬) テキストの末尾にジャンプして戻ってくる場合もあります。次のキーの実際のエントリ ポイントとカレットの実際の場所を修正する必要があります。
    -   一部のブラウザー、特に Firefox では、keypress のたびにテキストが水平にジャンプまたは揺れる場合があります。
-   ベース要素が **TEXTAREA** (textMode=”multiline”) で、複数行の入力によってフィールドがスクロールする場合:
    -   複数回のキーボード入力後、**Shift + Enter** (改行) を入力すると、垂直方向のスクロールに失敗し、カレットが非表示になる場合があります。この現象は、テキストの途中にカレットがある場合に発生します。
    -   一部のブラウザー、特に Firefox では、keypress のたびにテキストが垂直および水平にジャンプする場合があります。
-   *igEditor* のタイプが「datepicker」または *igDatePicker* に設定された場合、jquery-datepicker に依存し、`jquery.ui.datepicker.js` への参照または `jqueryui/1.8.7/jquery-ui.js` などの結合ライブラリへの参照が必要です。
-   *igEditor* のタイプが「datepicker」または *igDatePicker* に設定された場合、「multiline」に設定された textMode オプションまたはベース要素としての **TEXTAREA** をサポートしていません。
-   数値エディターの編集モードでは、グループまたは 3 桁ごとの桁区切り文字および記号をサポートしていません。
-   数値および日付エディターは、`$.ig._regional` に依存します。そのため、そのオブジェクトは ig.util.js への参照または結合した ig-js ファイルへの参照で使用可能である必要があります。

#関連リンク

- [igDateEditor の概要](igDateEditor-Overview.html)

 

 


