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

-   入力要素が `<textarea>` (textMode=”multiline”) 要素の場合、カレット位置の動作に一貫性がなくなることがあります。Gecko ベース (Firefox) や WebKit ベース (Chrome、Opera、Safari) の一部のブラウザーでは、a がフォーカスされた場合、Internet Explorer のように挿入ポイントがテキストの末尾に配置されるのではなく、デフォルトでテキストの冒頭に配置されます。一貫性のある動作を得るには、[selectionOnFocus](%%jQueryApiUrl%%/ui.igTextEditor#options:selectionOnFocus) のデフォルト値を `browserDefault` ではなく `selectAll` に設定します。


## 関連リンク
[igTextEditor の概要](igTextEditor-Overview.html)

 

 


