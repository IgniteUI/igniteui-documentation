<!--
|metadata|
{
    "fileName": "migrating-to-the-new-igdatepicker",
    "controlName": "igEditors",
    "tags": ["Migration","Getting Started"]
}
|metadata|
-->

# 新しい igDatePicker への移行

Ignite UI™ の 15.2 リリースから、新しいエディター コントロールのセットが導入されました。これには、作り直された `igDatePicker` も含まれています。簡便性と優れたユーザー エクスペリエンスを中心とした新しい設計では、いくつかのすぐに使える機能や新しいAPIが追加され、APIも修正または削除されています。このトピックでは、開発者が現在のアプリケーションから新しいエディターに移行する際に役立つ、新旧の機能の違いを説明します。

## トピックの概要
このトピックは、古い日付ピッカーから新しい日付ピッカーへの移行のサポートを目的としています。さまざまなシナリオを使用した実行方法を通して新旧を比較します。

### このトピックの内容
このトピックは、以下のセクションで構成されます。

1. [変更されたオプション](#options_changes)
2. [新しいオプション](#new_options)
3. [API メソッドの変更点](#methods_changes)
4. [新しい API メソッド](#new_methods)
5. [イベントの変更点](#event_changes)
6. [新しいイベント](#new_events)
7. [要件](#requirements)

<a name='options_changes'></a>
### 変更されたオプション

<a name='methods_changes'></a>
### API メソッドの変更点

メソッド|旧|新
---|---|---
addListItem|インデックスによって示された位置の項目内にオブジェクトを追加します。|このメソッドは削除されました。このようなシナリオでは、データ オブジェクトを操作し、UI コンポーネントを更新されたデータに再バインドする必要があります。
addListItems|インデックスによって示された位置にある配列の項目内にオブジェクトを追加します。|このメソッドは削除されました。このようなシナリオでは、データ オブジェクトを操作し、UI コンポーネントを更新されたデータに再バインドする必要があります。
clearListItems|リストからすべての項目を削除します。|このメソッドは削除されました。このようなシナリオでは、データ オブジェクトを操作し、UI コンポーネントを更新されたデータに再バインドする必要があります。
dropDownElement|ドロップダウンのコンテナーとして使用されている jquery オブジェクトへの参照を取得します。|このメソッドは、機能を明確に表すために、`getCalandar` という名前に変更されました。
dropDownVisible|渡されたブール値に従って、ドロップダウン リストの表示を設定します。|ドロップダウン リストの表示のみを取得します。新しいメソッドの [showDropDown](#showDropDown) と [hideDropDown](#hideDropDown) は以前の機能と置き換えられました。
findListItemIndex|検索パラメーターと一致するテキストで、リスト項目のインデックスを検索します。|このオプションは、マスク エディターでは使用できなくなりました。
getRegionalOption|数値エディターと日付エディターで使用されている地域オプションの計算された値を取得します。|このメソッドは廃止されました。
getSelection|選択肢の左端または右端を取得します。|このメソッドは、`getSelectionStart` と `getSelectionEnd` という 2 つのメソッドに置き換えられました。
getValueByMode|dataMode によってエディター内の値を取得します。|このメソッドはサポートされていません。
hasInvalidMessage|表示された無効なメッセージの確認に使用されます。|igNotifier には`同様に機能するAPIがあるため、このメソッドは削除されました。
mainElement|igDatePicker のトップ / 外部要素として使用されている jquery オブジェクトへの参照を取得します。|このメソッドは、機能を明確に表すために、`editorContainter` という名前に変更されました。
paste|カレットの位置にテキストを貼り付けます。|このメソッドは `insert` に名前が変更され、`txt` パラメーターは文字列であるため、`string` に名前が変更されました。
remove|エディターを親要素から削除しますが、残りの機能は維持されます。|このメソッドはサポートされていません。
removeListItem|リストから項目を削除します。|このメソッドは削除されました。このようなシナリオでは、データ オブジェクトを操作し、UI コンポーネントを更新されたデータに再バインドする必要があります。
removeListItemAt|インデックスのリストから項目を削除します。|このメソッドは削除されました。このようなシナリオでは、データ オブジェクトを操作し、UI コンポーネントを更新されたデータに再バインドする必要があります。
select|エディター内のテキストを選択します。有効なパラメーター: `sel0`、`sel1`、`val`|2 つのパラメーターは間違えられる可能性があるため、`sel0` は `start`、`sel1` は `end` にそれぞれ名前が変更されました。 
setFocus|遅延によるエディターのフォーカスを設定します。パラメーターが -1 の場合、遅延なしでフォーカスが設定されます。|正の値のみを遅延の値としてサポートしました。デフォルト値は 0 で、遅延なしでフォーカスを移動します。
spin|パラメーターに従って、エディター内の値を増分 (正の差分) または減分 (負の差分) します。|このメソッドは、`spinUp` と `spinDown` という新しい 2 つのメソッドに置き換えられました。エディターにリスト項目がある場合は、これらのメソッドによって、vew 値を設定せずにリスト内のアクティブなインデックスを増分または減分できます。
text|選択されたテキストをエディターから取得、またはエディターに設定します。|これは getter メソッド `displayValue` に置き換えられました。パラメーターを取らず、入力に表示されたすべての文字で文字列を返します。

<a name='new_options'></a>
### 新しいオプション

オプション|説明
---|---
limitSpinToCurrentField|<a name='limitSpinToCurrentField'></a>スピン イベントの日付フィールドを 1 つのみ編集できる機能を設定または取得します。
allowNullValue|<a name='allowNullValue'></a>このオプションが false で、エディターの値がない場合、「value」は空の文字列に設定されます。
disabled|<a name='disabled'></a>無効な属性の設定に使用されます。編集はできません。すべてのボタンが無効になり、インタラクションが適用されます。送信時に、現在の値が要求として送信されません。`$('#datePicker').igDatePicker({ disabled: true }] })`。
buttonType|<a name='buttonType'></a>スピン ボタン、クリア ボタン、およびドロップダウン ボタンの表示を設定または取得します。
dropDownAttachedToBody|<a name='dropDownAttachedToBody'></a>ドロップダウン リストの位置を取得または設定します。
dropDownAnimationDuration|<a name='dropDownAnimationDuration'></a>ドロップダウン リストのアニメーション時間の表示 / 非表示をミリ秒で取得または設定します。
placeHolder|<a name='placeHolder'></a>エディターにフォーカスがなく、エディターの「value」が null または空の文字列の場合に、エディターに表示されるテキストを取得または設定します。
revertIfNotValid|<a name='revertIfNotValid'></a>ぼかし、または Enter キー使用時の値が無効な場合、エディターの値を前の値に戻すように設定します。false に設定されている場合は、clear が呼び出されます。
preventSubmitOnEnter|<a name='preventSubmitOnEnter'></a>Enter キーが押されたときに送信しないように、エディターの機能を設定します。`$('#datePicker').igDatePicker({ preventSubmitOnEnter: true }] })`。
dropDownOrientation|<a name='dropDownOrientation'></a>開くボタンをクリックしたときのドロップダウン リストが開く方向を設定します。
suppressNotifications|<a name='suppressNotifications'></a>要求されたリストの選択、値のラッピング、またはスピンの制限など、エディターに組み込まれた基本の検証シナリオのデフォルト通知を無効にします。

[すべてのオプションを参照](%%jQueryApiUrl%%/ui.igdatepicker#options)

<a name='methods_changes'></a>
### API メソッドの変更点

メソッド|旧|新
---|---|---
addListItem|インデックスによって示された位置の項目内にオブジェクトを追加します。|このメソッドは削除されました。 
addListItems|インデックスによって示された位置にある配列の項目内にオブジェクトを追加します。|このメソッドは削除されました。
clearListItems|リストからすべての項目を削除します。|このメソッドは削除されました。
dropDownElement|ドロップダウンのコンテナーとして使用されている jquery オブジェクトへの参照を取得します。|このメソッドは削除されました。
dropDownVisible|渡されたブール値に従って、ドロップダウン リストの表示を設定します。|このメソッドは削除されました。
findListItemIndex|検索パラメーターと一致するテキストで、リスト項目のインデックスを検索します。|このメソッドは削除されました。
getRegionalOption|数値エディターと日付エディターで使用されている地域オプションの計算された値を取得します。|このメソッドは廃止されました。
getSelection|選択肢の左端または右端を取得します。|このメソッドは、`getSelectionStart` と `getSelectionEnd` という 2 つのメソッドに置き換えられました。
getValueByMode|dataMode によってエディター内の値を取得します。|このメソッドはサポートされていません。
hasInvalidMessage|表示された無効なメッセージの確認に使用されます。|igNotifier には`同様に機能するAPIがあるため、このメソッドは削除されました。
mainElement|igDatePicker のトップ / 外部要素として使用されている jquery オブジェクトへの参照を取得します。|このメソッドは、機能を明確に表すために、`editorContainter` という名前に変更されました。
paste|カレットの位置にテキストを貼り付けます。|このメソッドは `insert` に名前が変更され、`txt` パラメーターは文字列であるため、`string` に名前が変更されました。
remove|エディターを親要素から削除しますが、残りの機能は維持されます。|このメソッドはサポートされていません。
removeListItem|リストから項目を削除します。|このメソッドは削除されました。 
removeListItemAt|インデックスのリストから項目を削除します。|このメソッドは削除されました。 
select|エディター内のテキストを選択します。有効なパラメーター: `sel0`、`sel1`、`val`|2 つのパラメーターは間違えられる可能性があるため、`sel0` は `start`、`sel1` は `end` にそれぞれ名前が変更されました。 
setFocus|遅延によるエディターのフォーカスを設定します。パラメーターが -1 の場合、遅延なしでフォーカスが設定されます。|正の値のみを遅延の値としてサポートしました。デフォルト値は 0 で、遅延なしでフォーカスを移動します。
spin|パラメーターに従って、エディター内の値を増分 (正の差分) または減分 (負の差分) します。|このメソッドは、`spinUp` と `spinDown` という新しい 2 つのメソッドに置き換えられました。
text|選択されたテキストをエディターから取得、またはエディターに設定します。|これは getter メソッド `displayValue` に置き換えられました。パラメーターを取らず、入力に表示されたすべての文字で文字列を返します。
validate|エディターの検証をトリガーし、エラー メッセージを表示します。単一のパラメーター `noLabel` があります。|このパラメーターは、名前が `skipErrorMessage` に変更されました。
value|エディターから値を取得、またはエディターに値を設定します。|このオプションは、機能を明確に表すために、`newValue` という名前に変更されました。

<a name='new_methods'></a>
### 新しい API メソッド

メソッド|説明
---|---
getSelectedDate|選択された日付を取得します。
selectDate|選択された日付を設定します。
getCalendar|<a name='getCalendar'></a>ピッカー セレクターとして使用される jQuery カレンダーへの参照を返します。
inputName|<a name='inputName'></a>エディターの要素に適用された name 属性を取得または設定します。
displayValue|<a name='displayValue'></a>入力で表示されたすべての文字による文字列を返します。
editorContainer|<a name='editorContainer'></a>igEditor のトップ / 外部要素として使用されている jquery オブジェクトへの参照を取得します。
showDropDown|<a name='showDropDown'></a>ドロップダウン リストを表示します。
hideDropDown|<a name='hideDropDown'></a>ドロップダウン リストを非表示にします。
dropDownVisible|<a name='dropDownVisible'></a>項目がリストされたドロップダウンの表示状態を返します。
dropDownButton|<a name='dropDownButton'></a>エディターのドロップダウン ボタンへの参照を返します。
clearButton|<a name='clearButton'></a>エディターのクリア ボタンへの参照を返します。
getSelectionStart|<a name='getSelectionStart'></a>エディター内の選択されたテキストの開始インデックスを取得します。
getSelectionEnd|<a name='getSelectionEnd'></a>エディター内の選択されたテキストの終了インデックスを取得します。
insert|<a name='insert'></a>カレットの位置にテキストを貼り付けます。
spinUp|<a name='spinUp'></a>カーソルの位置に従って、日付と時間の期間を増分します。
spinDown|<a name='spinDown'></a>カーソルの位置に従って、日付と時間の期間を減分します。
spinUpButton|<a name='spinUpButton'></a>エディターのスピン アップ ボタンへの参照を返します。
spinDownButton|<a name='spinDownButton'></a>エディターのスピン ダウン ボタンへの参照を返します。
spinDownButton|<a name='spinDownButton'></a>エディターのスピン ダウン ボタンへの参照を返します。

[すべての API メソッドを参照](%%jQueryApiUrl%%/ui.igdatepicker#methods)

<a name='event_changes'></a>
### イベントの変更点

イベント|変更内容
---|---
hideDropDown|このイベントのサポートは廃止されました。ドロップダウン リストの非表示をより詳細に制御できる、[dropDownListClosing](#dropDownListClosing) と [dropDownListClosed](#dropDownListClosed) の 2 つのイベントが新しく導入されました。
showDropDown|このイベントのサポートは廃止されました。ドロップダウン リストの表示をより詳細に制御できる、[dropDownListOpening](#dropDownListOpening) と [dropDownListOpened](#dropDownListOpened) の 2 つのイベントが新しく導入されました。
listSelected|このイベントは、機能を明確に表すために、`dropDownItemSelected` という名前に変更されました。`ui.owner` は、igEditor への参照を取得します。`ui.editorInput` は、編集可能な入力への参照を取得します。`ui.list` は、リスト コンテナーへの参照を取得します。`ui.item` は、選択されたリスト項目への参照を取得します。
listSelecting|このイベントは、機能を明確に表すために、`dropDownItemSelecting` という名前に変更されました。`ui.owner` は、igEditor への参照を取得します。`ui.editorInput` は、編集可能な入力への参照を取得します。`ui.list` は、リスト コンテナーへの参照を取得します。`ui.item` は、選択されようとしているリスト項目への参照を取得します。
mouseleave|このイベントは、機能を明確に表すために、`mouseout` という名前に変更されました。

<a name='new_events'></a>
### 新しいイベント

イベント|説明
---|---
rendering|<a name='rendering'></a>エディターの描画が完了する前に起動されるイベントです。
rendered|<a name='rendered'></a>エディターの描画が完了した後に起動されるイベントです。
dropDownListOpening|<a name='dropDownListOpening'></a>ドロップダウンを開く操作中に起動されるイベントです。
dropDownListOpened|<a name='dropDownListOpened'></a>ドロップダウンを開いた後に起動されるイベントです。
dropDownListClosing|<a name='dropDownListClosing'></a>ドロップダウンを閉じる操作中に起動されるイベントです。
dropDownListClosed|<a name='dropDownListClosed'></a>ドロップダウンを閉じた後に起動されるイベントです。
dropDownItemSelecting|<a name='dropDownItemSelecting'></a>ドロップダウン リストの項目の選択中に起動されるイベントです。
dropDownItemSelected|<a name='dropDownItemSelected'></a>ドロップダウン リストの項目が選択された後に起動されるイベントです。
mouseout|<a name='mouseout'></a>ドロップダウン リストを含めたエディターの任意の部分で、マウス ポインタが離れたときに起動されるイベントです。

[すべてのイベントを参照](%%jQueryApiUrl%%/ui.igdatepicker#events)

<a name='requirements'></a>
### jQuery の要件

Lib|以前に必要とされたバージョン|新しく必要なバージョン
---|---|---
jQuery コア|1.4.4|1.9.1
jQuery UI|1.7|1.9.0
