<!--
|metadata|
{
    "fileName": "migrating-to-the-new-igcurrencyeditor",
    "controlName": "igEditors",
    "tags": ["Migration","Getting Started"]
}
|metadata|
-->

# 新しい igCurrencyEditor への移行

%%ProductName%%™ の 15.2 リリースから、新しいエディター コントロールのセットが導入されました。これには、作り直された `igCurrencyEditor` も含まれています。簡便性と優れたユーザー エクスペリエンスを中心とした新しい設計では、いくつかのすぐに使える機能や新しいAPIが追加され、APIも修正または削除されています。このトピックでは、開発者が現在のアプリケーションから新しいエディターに移行する際に役立つ、新旧の機能の違いを説明します。

## トピックの概要
このトピックは、古い通貨エディターから新しい通貨エディターへの移行のサポートを目的としています。さまざまなシナリオを使用した実行方法を通して新旧を比較します。

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

オプション|旧|新
---|---|---
animationHideDuration animationShowDuration|ドロップダウン リストの表示 / 非表示時のアニメーション時間の設定に使用されます。<br>`$(".selector").igCurrencyEditor({`<br>`animationShowDuration: 500,`<br>`animationHideDuration: 500`<br>`});`|これらのオプションは、ドロップダウン リストのアニメーション時間を制御する新しいオプションの `dropDownAnimationDuration` に置き換えられました。<br>`$(".selector").igCurrencyEditor({`<br>`dropDownAnimationDuration: 500`<br>`});`
button|このオプションは、スピン ボタンとドロップダウン ボタンの表示 / 非表示の設定に使用されます。<br>`$(".selector").igCurrencyEditor({`<br>`button : "dropdown"`<br>`});`|このオプションは、機能を明確に表すために、`buttonType` という名前に変更されました。<br>`$(".selector").igCurrencyEditor({`<br>`buttonType : "dropdown"`<br>`});`
display|外部の HTML 要素の style.display を取得または設定します。|このオプションは削除されました。
dropDownTriggers|ドロップダウン リストまたはカレンダーの表示をトリガーするアクションのリストを設定または取得します。|このオプションは削除されました。新しいエディターでは、`Alt` + `下矢印` キーでドロップダウンが表示されます。
focusOnSpin|このオプションが無効で、エディターがフォーカスされていない場合、スピン ボタンをマウスでリックすると、エディター内のテキストがフォーカスされていない形式で維持され、スピン アクションが実行されました。|このオプションは削除されました。新しいエディターでは、エディターがフォーカスされていない状態でスピン ボタンをマウスでクリックしても、エディターがフォーカスされません。
height、width|以前にサポートされていた型: `number`。<br>`$(".selector").igCurrencyEditor({`<br>`width : 200`<br>`});`|現在サポートされている型: `number`、`string`、`null`。`string` 型を使用した場合、高さをピクセル (px) と パーセンテージ (%) で設定できます。<br>`$(".selector").igCurrencyEditor({`<br>`width : "200px"`<br>`});`
hideEnterKey|ブラウザーで Enter キーを非表示にする機能を設定または取得できます。<br>`$(".selector").igCurrencyEditor({`<br>    `hideEnterKey : false`<br>`});`|このオプションは削除されました。Enter キーを押しても送信されないようにするには、[preventSubmitOnEnter](#preventSubmitOnEnter) オプションを使用できます。<br>`$(".selector").igCurrencyEditor({`<br>`preventSubmitOnEnter : true`<br>`});`
listColumns|ドロップダウン リストの列の数値を設定または取得します。|このオプションは削除されました。
listDropDownAsChild|値 `true` は、HTML 要素のリストにメインの HTML 要素の子として作成します。値 `false` は、リストに本文の子として作成します。<br>`$(".selector").igCurrencyEditor({`<br>`listDropDownAsChild : true`<br>`});`|名前が `dropDownAttachedToBody` に変更されました。値 `true` は、リストに本文の子として作成します。値 `false` は、HTML 要素のリストにメインの HTML 要素の子として作成します。<br>`$(".selector").igCurrencyEditor({`<br>`dropDownAttachedToBody : true`<br>`});`
listMaxHeight|ドロップダウン リストの最大の高さをピクセル単位で設定する場合に使用されます。<br>`$(".selector").igCurrencyEditor({`<br>    `listMaxHeight : 400`<br>`});`|このオプションは削除されました。表示されるリスト項目の数を設定する場合は、新しいオプションの [visibleItemsCount](#visibleItemsCount) を使用できます。<br>`$(".selector").igCurrencyEditor({`<br>    `visibleItemsCount : 5`<br>`});`
negativeSign|負の数値の表示に使用する文字の設定に使用されます。|このオプションは、地域の言語で使用可能な記号のみに使用できます。
nullText|エディターにフォーカスがなく、エディターの「value」が null または空の文字列の場合に、エディターに表示されるテキストの設定に使用されます。<br>`$(".selector").igCurrencyEditor({`<br>`nullText : "Enter Value"`<br>`});`|このオプションは、機能を明確に表すために、`placeHolder` という名前に変更されました。<br>`$(".selector").igCurrencyEditor({`<br>    `placeHolder : "Enter Value"`<br>`});`
renderInContainer|入力フィールドを SPAN にラップするオプションを設定または取得します。|このオプションは削除されました。
required|エディター内の空の値の検証を設定または取得します。<br>`$(".selector").igCurrencyEditor({`<br>`required : true`<br>`});`|このオプションは削除されました。必要に応じて、バリデーター オプションを使用して、フィールドを設定できます。<br>`$(".selector").igCurrencyEditor({`<br>` validatorOptions : {`<br>`required: true`<br>`}`<br>`});`
selectionOnFocus|以前サポートされていたメンバー: `select`、`-1`、`start`、`0`、`end`、`1`、`default`、`2`。<br>`$(".selector").igCurrencyEditor({`<br>`selectionOnFocus: 0`<br>`});`|現在サポートされているメンバー: `selectAll`、`atStart`、`atEnd`、`browserDefault`。デフォルト値は `selectAll` です。<br>`$(".selector").igCurrencyEditor({`<br>`selectionOnFocus: "atStart"`<br>`});`
spinOnReadOnly|「readOnly」オプションのオーバーライドや、エディターまたはスピン イベントの「value」の変更を許可する場合に使用されます。<br>` $(".selector").igCurrencyEditor({`<br>`spinOnReadOnly : true`<br>`});` |このオプションは削除されました。`readOnly` を `true` に設定すると、スピン ボタンが無効になります。<br>`$(".selector").igCurrencyEditor({`<br>`readOnly : true`<br>`});`
textAlign|以前のデフォルトは `null` でした。|現在のデフォルトは `left` です。
theme|エディターが使用する CSS クラスのセレクターを設定または取得します。|このオプションは削除されました。
type|エディターのタイプを設定します。|このオプションは削除されました。対応するコントロールを使用できます。
maxLength|ユーザーが入力可能なテキストの最大長を設定または取得します。|このオプションは削除されました。
symbol|表示 (フォーカスなし) 状態で使用される通貨記号の設定に使用されます。<br>`$(".selector").igCurrencyEditor({`<br>`symbol: "*"`<br>}`);`|このオプションは、機能を明確に表すように、`currencySymbol` という名前に変更されました。<br>`$(".selector").igCurrencyEditor({`<br>`currencySymbol: "*"`<br>`});`

<a name='new_options'></a>
### 新しいオプション

オプション|説明
---|---
currencySymbol|地域の設定による通貨記号とは別に、カスタム通貨記号を設定します。
allowNullValue|<a name='allowNullValue'></a>このオプションが false で、エディターの値がない場合、「value」は空の文字列に設定されます。
disabled|<a name='disabled'></a>無効な属性の設定に使用されます。編集はできません。すべてのボタンが無効になり、インタラクションが適用されます。送信時に、現在の値が要求として送信されません。`$('#currencyEditor').igCurrencyEditor({ disabled: true })`。
buttonType|<a name='buttonType'></a>スピン ボタン、クリア ボタン、およびドロップダウン ボタンの表示を設定または取得します。
listItemHoverDuration|<a name='listItemHoverDuration'></a>ドロップダウン リスト内の項目に対するアニメーション時間のホバー / ホバー解除の設定に使用されます。`$('#currencyEditor').igCurrencyEditor({ listItems: ["A", "B", "C", "D"], listItemHoverDuration: 400 })`。
dropDownAttachedToBody|<a name='dropDownAttachedToBody'></a>ドロップダウン リストの位置を取得または設定します。
dropDownAnimationDuration|<a name='dropDownAnimationDuration'></a>ドロップダウン リストのアニメーション時間の表示 / 非表示をミリ秒で取得または設定します。
visibleItemsCount|<a name='visibleItemsCount'></a>同時に表示する項目数の設定に使用します。`$('#currencyEditor').igCurrencyEditor({ listItems: [10, 20, 30, 40], visibleItemsCount: 2 })`.
isLimitedToListValues|<a name='isLimitedToListValues'></a>リスト項目のみに値の設定を許可する機能を設定します。これを有効にすると、スピン操作は代わりにリスト項目に移動します。 `$('#currencyEditor').igCurrencyEditor({ listItems: [10, 20, 30, 40], isLimitedToListValues: true })`。
placeHolder|<a name='placeHolder'></a>エディターにフォーカスがなく、エディターの「value」が null または空の文字列の場合に、エディターに表示されるテキストを取得または設定します。
revertIfNotValid|<a name='revertIfNotValid'></a>ぼかし、または Enter キー使用時の値が無効な場合、エディターの値を前の値に戻すように設定します。false に設定されている場合は、clear が呼び出されます。`$('#currencyEditor').igCurrencyEditor({ listItems: [10, 20, 30, 40], isLimitedToListValues: true, revertIfNotValid: false })`。
preventSubmitOnEnter|<a name='preventSubmitOnEnter'></a>Enter キーが押されたときに送信しないようにエディターの機能を設定します。`$('#currencyEditor').igCurrencyEditor({ preventSubmitOnEnter: true })`。
dropDownOrientation|<a name='dropDownOrientation'></a>開くボタンをクリックしたときのドロップダウン リストが開く方向を設定します。`$('#currencyEditor').igCurrencyEditor({ listItems: [10, 20, 30, 40], dropDownOrientation: 'top' })`。
suppressNotifications|<a name='suppressNotifications'></a>要求されたリストの選択、値のラッピング、またはスピンの制限など、エディターに組み込まれた基本の検証シナリオのデフォルト通知を無効にします。


[すべてのオプションを参照](%%jQueryApiUrl%%/ui.igcurrencyeditor#options)

<a name='methods_changes'></a>
### API メソッドの変更点

メソッド|旧|新
---|---|---
addListItem|インデックスによって示された位置の項目内にオブジェクトを追加します。|このメソッドは削除されました。このようなシナリオでは、データ オブジェクトを操作し、UI コンポーネントを更新されたデータに再バインドする必要があります。
addListItems|インデックスによって示された位置にある配列の項目内にオブジェクトを追加します。|このメソッドは削除されました。このようなシナリオでは、データ オブジェクトを操作し、UI コンポーネントを更新されたデータに再バインドする必要があります。
clearListItems|リストからすべての項目を削除します。|このメソッドは削除されました。このようなシナリオでは、データ オブジェクトを操作し、UI コンポーネントを更新されたデータに再バインドする必要があります。
dropDownElement|ドロップダウンのコンテナーとして使用されている jquery オブジェクトへの参照を取得します。|このオプションは、機能を明確に表すために、`dropDownContainter` という名前に変更されました。
dropDownVisible|渡されたブール値に従って、ドロップダウン リストの表示を設定します。|ドロップダウン リストの表示のみを取得します。新しいメソッドの [showDropDown](#showDropDown) と [hideDropDown](#hideDropDown) は以前の機能と置き換えられました。
findListItemIndex|検索パラメーターと一致するテキストで、リスト項目のインデックスを検索します。|単一の数値パラメーター `number` のみを入力して、完全一致を検索する必要があります (15.00 は 15 と等しい)。
getSelectedText|選択されたテキストをエディターから取得します。|このようなメソッドは数値エディターでは意味がないため、削除されました。
getSelection|選択肢の左端または右端を取得します。|このようなメソッドは通貨エディターでは意味がないため、削除されました。
getValueByMode|dataMode によってエディター内の値を取得します。|このメソッドはサポートされていません。
hasInvalidMessage|表示された無効なメッセージの確認に使用されます。|igNotifier には`同様に機能するAPIがあるため、このメソッドは削除されました。
mainElement|`igCurrencyEditor` のトップ / 外部要素として使用されている jquery オブジェクトへの参照を取得します。|このメソッドは、機能を明確に表すために、`editorContainter` という名前に変更されました。
paste|カレットの位置にテキストを貼り付けます。|このメソッドは `insert` に名前が変更され、`txt` パラメーターは文字列であるため、`string` に名前が変更されました。
remove|エディターを親要素から削除しますが、残りの機能は維持されます。|このメソッドはサポートされていません。
removeListItem|リストから項目を削除します。|このメソッドは削除されました。このようなシナリオでは、データ オブジェクトを操作し、UI コンポーネントを更新されたデータに再バインドする必要があります。
removeListItemAt|インデックスのリストから項目を削除します。|このメソッドは削除されました。このようなシナリオでは、データ オブジェクトを操作し、UI コンポーネントを更新されたデータに再バインドする必要があります。
select|エディター内のテキストを選択します。有効なパラメーター: `sel0`、`sel1`、`val`|2 つのパラメーターは間違えられる可能性があるため、`sel0` は `start`、`sel1` は `end` にそれぞれ名前が変更されました。 
setFocus|遅延によるエディターのフォーカスを設定します。パラメーターが -1 の場合、遅延なしでフォーカスが設定されます。|正の値のみを遅延の値としてサポートしました。デフォルト値は 0 で、遅延なしでフォーカスを移動します。
spin|パラメーターに従って、エディター内の値を増分 (正の差分) または減分 (負の差分) します。|このメソッドは、`spinUp` と `spinDown` という新しい 2 つのメソッドに置き換えられました。このメソッドは、`isLimitedToListValues` が有効な場合、値またはドロップダウン ナビゲーションと操作します。
text|選択されたテキストをエディターから取得、またはエディターに設定します。|これは getter メソッド `displayValue` に置き換えられました。パラメーターを取らず、入力に表示されたすべての文字で文字列を返します。

<a name='new_methods'></a>
### 新しい API メソッド

メソッド|説明
---|---
currencySymbol|<a name='currencySymbol'></a>数値と一緒に入力された通貨記号に使用される文字列を取得または設定します。パラメーターとして使用された値は、currencySymbol オプションに伝達され、オプションと同じ優先順位が付けられます。
inputName|<a name='inputName'></a>エディターの要素に適用された name 属性を取得または設定します。
displayValue|<a name='displayValue'></a>入力で表示されたすべての文字による文字列を返します。
editorContainer|<a name='editorContainer'></a>igEditor のトップ / 外部要素として使用されている jquery オブジェクトへの参照を取得します。
dropDownContainer|<a name='dropDownContainer'></a>ドロップダウンのコンテナーとして使用されている jquery オブジェクトへの参照を取得します。
showDropDown|<a name='showDropDown'></a>ドロップダウン リストを表示します。
hideDropDown|<a name='hideDropDown'></a>ドロップダウン リストを非表示にします。
dropDownVisible|<a name='dropDownVisible'></a>項目がリストされたドロップダウンの表示状態を返します。
dropDownButton|<a name='dropDownButton'></a>エディターのドロップダウン ボタンへの参照を返します。
clearButton|<a name='clearButton'></a>エディターのクリア ボタンへの参照を返します。
insert|<a name='insert'></a>カレットの位置にテキストを貼り付けます。
spinUp|<a name='spinUp'></a>パラメーターに基づいてエディターの値をインクリメントするか、`isLimitedToListValues` が有効な場合にドロップダウン リストから前の値を選択します。
spinDown|<a name='spinDown'></a>パラメーターに基づいてエディターの値をデクリメントするか、`isLimitedToListValues` が有効な場合にドロップダウン リストから次の値を選択します。
spinUpButton|<a name='spinUpButton'></a>エディターのスピン アップ ボタンへの参照を返します。
spinDownButton|<a name='spinDownButton'></a>エディターのスピン ダウン ボタンへの参照を返します。

[すべての API メソッドを参照](%%jQueryApiUrl%%/ui.igcurrencyeditor#methods)

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

[すべてのイベントを参照](%%jQueryApiUrl%%/ui.igcurrencyeditor#events)

<a name='requirements'></a>
### jQuery の要件

Lib|以前に必要とされたバージョン|新しく必要なバージョン
---|---|---
jQuery コア|1.4.4|1.9.1
jQuery UI|1.7|1.9.0
