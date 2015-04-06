<!--
|metadata|
{
    "fileName": "igCombo-keyboard-navigation",
    "controlName": "igCombo",
    "tags": []
}
|metadata|
-->

#キーボード ナビゲーション (igCombo)

##トピックの概要
このトピックでは、エンドユーザーが容易に迅速に項目を移動したり、選択や強調表示する項目を変更できるように、キーボード ナビゲーションの使用方法を説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [キーボード操作](#kbInteraction)
-   [Multiselection](#multiselection)
	-   [Shift 操作](#shiftInteraction)
	-   [Ctrl 操作](#ctrlInteraction)
-   [ブラウザーから](#fromBrowser)

## <a id="kbInteraction"></a> キーボード操作
### 概要


押す|結果|使用する状況
---|---|---
<kbd>Alt</kbd> + <kbd>下矢印</kbd>|ドロップダウンを開く|ドロップダウンが閉じているとき
<kbd>Alt</kbd> + <kbd>上矢印</kbd>|ドロップダウンを閉じる|ドロップダウンが開いているとき
<kbd>Ctrl</kbd> + <kbd>Home</kbd>|ドロップダウンの一番最初の項目に移動|ドロップダウンが開いているとき
<kbd>Ctrl</kbd> + <kbd>End</kbd>|一番最後の項目に移動|ドロップダウンが開いているとき
<kbd>Page Up</kbd>|表示されている最初の項目に移動|ドロップダウンが開いているとき
<kbd>Page Down</kbd>|表示されている最後の項目に移動|ドロップダウンが開いているとき
<kbd>上矢印</kbd>|前の項目に移動。ドロップダウンが開いている場合は閉じる|ドロップダウンが開いているとき、または閉じているとき
<kbd>下矢印</kbd>|次の項目に移動。ドロップダウンが閉じている場合は開く|ドロップダウンが開いているとき、または閉じているとき
<kbd>Esc キー</kbd>|選択された項目がない場合はコンテンツを消去|入力にコンテンツがあるとき
<kbd>Esc キー</kbd>|ドロップダウンを閉じる|ドロップダウンが開いているとき
<kbd>Enter キー</kbd>|アクティブ項目を選択|アクティブ項目があるとき

##<a id="multiselection"></a>Multiselection
###<a id="shiftInteraction"></a>Shift 操作

押した場合|結果
---|---
<kbd>Shift</kbd>|項目がアクティブ状態で強調表示
<kbd>Shift</kbd>|複数の項目が選択されていない場合は何も起こらず、項目はアクティブ状態を保持
<kbd>Shift</kbd> + <kbd>上矢印 / 下矢印</kbd> |アクティブ (強調表示された) 項目を変更し、<kbd>Shift キーを離した場合、</kbd> アクティブ項目を選択
<kbd>Shift</kbd> + <kbd>Enter</kbd>|**シナリオ**: 項目がマウスで選択され、<kbd>Shift と上矢印 / 下矢印キーでアクティブ項目を移動した場合</kbd> + <kbd>Enter</kbd> 項目の状態、最初と最後の選択項目が Selected に変更

> **注:** <kbd>Shift キー</kbd> のみは項目を選択

###<a id="ctrlInteraction"></a>Ctrl 操作 (addWithKeyModifier オプションを true に設定)
デフォルトでは、MultiSelection が有効な場合、エンドユーザーは左マウス ボタンをクリックするのみで複数の項目を選択できます。<kbd>Ctrl</kbd> で複数の項目を選択するには、`addWithKeyModifier` オプションを `true` に設定する必要があります。


##<a id="fromBrowser"></a> ブラウザーから

押す|結果
---|---
<kbd>左矢印</kbd>|カーソルを 1 文字左に移動
<kbd>右矢印</kbd>|カーソルを 1 文字右に移動
<kbd>Ctr + 左矢印</kbd>|カーソルを 1 単語左に移動
<kbd>Ctr + 右矢印</kbd>|カーソルを 1 単語右に移動
<kbd>Shift</kbd>|カーソル移動時のテキストの選択
<kbd>Delete</kbd>、<kbd>Backspace</kbd>|選択されたテキストのみを消去
<kbd>Delete</kbd>、<kbd>Backspace</kbd>|1文字ずつ消去
<kbd>Enter キー</kbd>|項目を選択
<kbd>Home キー</kbd>|入力テキストの先頭にカーソルを移動
<kbd>End キー</kbd>|入力テキストの末尾にカーソルを移動
<kbd>Backspace キー</kbd>|コンボ ボックスのコンテンツをすべて消去 (キーを押した状態で、<kbd>Ctrl+A</kbd>)
