<!--
|metadata|
{
    "fileName": "migrating-to-the-new-igmaskeditor",
    "controlName": "igEditors",
    "tags": ["Migration","Getting Started"]
}
|metadata|
-->

# 新しい igMaskEditor への移行

%%ProductName%%™ の 15.2 リリースから、新しいエディター コントロールのセットが導入されました。これには、作り直された `igMaskEditor` も含まれています。簡便性と優れたユーザー エクスペリエンスを中心とした新しい設計では、いくつかのすぐに使える機能や新しいAPIが追加され、APIも修正または削除されています。このトピックでは、開発者が現在のアプリケーションから新しいエディターに移行する際に役立つ、新旧の機能の違いを説明します。

## トピックの概要
このトピックは、古いマスク エディターから新しいマスク エディターへの移行のサポートを目的としています。さまざまなシナリオを使用した実行方法を通して新旧を比較します。

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
animationHideDuration animationShowDuration|ドロップダウン リストの表示 / 非表示時のアニメーション時間の設定に使用されます。<br>`$(".selector").igMaskEditor({`<br>`animationShowDuration: 500,`<br>`animationHideDuration: 500`<br>`});`|igMaskEditor はドロップダウンをサポートしないため、このオプションはコントロールでもサポートされていません。
button|このオプションは、スピン ボタンとドロップダウン ボタンの表示 / 非表示の設定に使用されます。<br>`$(".selector").igMaskEditor({`<br>`button : "dropdown"`<br>`});`|このオプションは、機能を明確に表すために、`buttonType` という名前に変更されました。日付エディターのサポートされる型は 'clear' です。<br>`$(".selector").igMaskEditor({`<br>`buttonType : "clear"`<br>`});`
dataMode|'string' 型と 'number' 型のメンバーがサポートされていました。<br>`$(".selector").igMaskEditor({`<br>`dataMode: 0`<br>`});`|'number' 型のメンバーのサポートが廃止されました。<br>`$(".selector").igMaskEditor({`<br>`dataMode: "rawText"`<br>`});`
display|外部の HTML 要素の style.display を取得または設定します。|このオプションは削除されました。
dropDownOnReadOnly|このオプションは、「readOnly」オプションのオーバーライドを可能にし、ドロップダウン リストの表示やリストによるエディター内の値の変更ができます。<br>`$(".selector").igMaskEditor({`<br>    `dropDownOnReadOnly : true`<br>`});`|このオプションはマスク エディターで削除されました。
dropDownTriggers|ドロップダウン リストまたはカレンダーの表示をトリガーするアクションのリストを設定または取得します。|このオプションは削除されました。 
focusOnSpin|このオプションが無効で、エディターがフォーカスされていない場合、スピン ボタンをマウスでリックすると、エディター内のテキストがフォーカスされていない形式で維持され、スピン アクションが実行されました。|このオプションは削除されました。マスク エディターでスピン ボタンを利用できません。
height、width|以前にサポートされていた型: `number`。<br>`$(".selector").igMaskEditor({`<br>`width : 200`<br>`});`|現在サポートされている型: `number`、`string`、`null`。`string` 型を使用した場合、高さをピクセル (px) と パーセンテージ (%) で設定できます。<br>`$(".selector").igMaskEditor({`<br>`width : "200px"`<br>`});`
hideEnterKey|ブラウザーで Enter キーを非表示にする機能を設定または取得できます。<br>`$(".selector").igMaskEditor({`<br>    `hideEnterKey : false`<br>`});`|このオプションは削除されました。Enter キーを押しても送信されないようにするには、[preventSubmitOnEnter](#preventSubmitOnEnter) オプションを使用できます。<br>`$(".selector").igMaskEditor({`<br>`preventSubmitOnEnter : true`<br>`});
listAutoComplete|オートコンプリートを設定または取得します。|このオプションは削除されました。
listColumns|ドロップダウン リストの列の数値を設定または取得します。|このオプションは削除されました。
listDropDownAsChild|値 `true` は、HTML 要素のリストにメインの HTML 要素の子として作成します。値 `false` は、リストに本文の子として作成します。<br>`$(".selector").igMaskEditor({`<br>`listDropDownAsChild : true`<br>`});`|このオプションは igMaskEditor で利用できません。
listMatchContains|リスト一致に含まれる項目を設定または取得します。|このオプションは削除されました。
listMatchIgnoreCase|大文字と小文字の区別の検証を設定または取得します。|このオプションは削除されました。 
listMaxHeight|ドロップダウン リストの最大の高さをピクセル単位で設定する場合に使用されます。<br>`$(".selector").igMaskEditor({`<br>    `listMaxHeight : 400`<br>`});`|このオプションは削除されました。 
nullText|エディターにフォーカスがなく、エディターの「value」が null または空の文字列の場合に、エディターに表示されるテキストの設定に使用されます。<br>`$(".selector").igMaskEditor({`<br>`nullText : "Enter Value"`<br>`});`|このオプションは、機能を明確に表すために、`placeHolder` という名前に変更されました。<br>`$(".selector").igMaskEditor({`<br>    `placeHolder : "Enter Value"`<br>`});`
renderInContainer|入力フィールドを SPAN にラップするオプションを設定または取得します。|このオプションは削除されました。
required|エディター内の空の値の検証を設定または取得します。<br>`$(".selector").igMaskEditor({`<br>`required : true`<br>`});`|このオプションは削除されました。必要に応じて、バリデーター オプションを使用して、フィールドを設定できます。<br>`$(".selector").igMaskEditor({`<br>` validatorOptions : {`<br>`required: true`<br>`}`<br>`});`
selectionOnFocus|以前サポートされていたメンバー: `select`、`-1`、`start`、`0`、`end`、`1`、`default`、`2`。<br>`$(".selector").igMaskEditor({`<br>`selectionOnFocus: 0`<br>`});`|現在サポートされているメンバー: `selectAll`、`atStart`、`atEnd`、`browserDefault`。デフォルト値は `selectAll` です。<br>`$(".selector").igMaskEditor({`<br>`selectionOnFocus: "atStart"`<br>`});`
spinOnReadOnly|「readOnly」オプションのオーバーライドや、エディターまたはスピン イベントの「value」の変更を許可する場合に使用されます。<br>` $(".selector").igMaskEditor({`<br>`spinOnReadOnly : true`<br>`});` |このオプションは削除されました。`readOnly` を `true` に設定すると、エディターが無効になります。<br>`$(".selector").igMaskEditor({`<br>`readOnly : true`<br>`});`
textAlign|以前のデフォルトは `null` でした。|現在のデフォルトは `left` です。
theme|エディターが使用する CSS クラスのセレクターを設定または取得します。|このオプションは削除されました。
type|エディターのタイプを設定します。|このオプションは削除されました。対応するコントロールを使用できます。
promptChar|使用可能な入力位置に、編集モードでプロンプトとして使用される文字を設定します。<br>`$(".selector").igMaskEditor({`<br>`promptChar : "*"`<br>`});`|このオプションは、機能を明確に表すために、`unfilledCharsPrompt` という名前に変更されました。<br>`$(".selector").igMaskEditor({`<br>`unfilledCharsPrompt  : "*"`<br>`});`


<a name='new_options'></a>
### 新しいオプション

オプション|説明
---|---
unfilledCharsPrompt|<a name='unfilledCharsPrompt'></a>使用可能な入力位置に、編集モードでプロンプトとして使用される文字を設定します。
allowNullValue|<a name='allowNullValue'></a>このオプションが false で、エディターの値がない場合、「value」は空の文字列に設定されます。
disabled|<a name='disabled'></a>無効な属性の設定に使用されます。編集はできません。すべてのボタンが無効になり、インタラクションが適用されます。送信時に、現在の値が要求として送信されません。`$('#maskEditor').igMaskEditor({ disabled: true })`.
buttonType|<a name='buttonType'></a>クリア ボタンを設定または取得します。
placeHolder|<a name='placeHolder'></a>エディターにフォーカスがなく、エディターの「value」が null または空の文字列の場合に、エディターに表示されるテキストを取得または設定します。
revertIfNotValid|<a name='revertIfNotValid'></a>ぼかし、または Enter キー使用時の値が無効な場合、エディターの値を前の値に戻すように設定します。
preventSubmitOnEnter|<a name='preventSubmitOnEnter'></a>Enter キーが押されたときに送信しないように、エディターの機能を設定します。`$('#maskEditor').igMaskEditor({ preventSubmitOnEnter: true })`。
suppressNotifications|<a name='suppressNotifications'></a>要求されたリストの選択または値のラッピングなど、エディターに組み込まれた基本の検証シナリオのデフォルト通知を無効にします。

[すべてのオプションを参照](%%jQueryApiUrl%%/ui.igmaskeditor#options)

<a name='methods_changes'></a>
### API メソッドの変更点

メソッド|旧|新
---|---|---
addListItem|インデックスによって示された位置の項目内にオブジェクトを追加します。|このメソッドは削除されました。このようなシナリオでは、データ オブジェクトを操作し、UI コンポーネントを更新されたデータに再バインドする必要があります。
addListItems|インデックスによって示された位置にある配列の項目内にオブジェクトを追加します。|このメソッドは削除されました。このようなシナリオでは、データ オブジェクトを操作し、UI コンポーネントを更新されたデータに再バインドする必要があります。
clearListItems|リストからすべての項目を削除します。|このオプションは、マスク エディターでは使用できなくなりました。
dropDownElement|ドロップダウンのコンテナーとして使用されている jquery オブジェクトへの参照を取得します。|このオプションは、マスク エディターでは使用できなくなりました。
dropDownVisible|渡されたブール値に従って、ドロップダウン リストの表示を設定します。|このメソッドは、マスク エディターでは使用できなくなりました。
findListItemIndex|検索パラメーターと一致するテキストで、リスト項目のインデックスを検索します。|このオプションは、マスク エディターでは使用できなくなりました。
getRegionalOption|数値エディターと日付エディターで使用されている地域オプションの計算された値を取得します。|このメソッドは廃止されました。
getSelection|選択肢の左端または右端を取得します。|このメソッドは、`getSelectionStart` と `getSelectionEnd` という 2 つのメソッドに置き換えられました。
getValueByMode|dataMode によってエディター内の値を取得します。|このメソッドはサポートされていません。
hasInvalidMessage|表示された無効なメッセージの確認に使用されます。|igEditorNotifier には`同様に機能するAPIがあるため、このメソッドは削除されました。
mainElement|`igMaskEditor` のトップ / 外部要素として使用されている jquery オブジェクトへの参照を取得します。|このメソッドは、機能を明確に表すために、`editorContainter` という名前に変更されました。
paste|カレットの位置にテキストを貼り付けます。|このメソッドは `insert` に名前が変更され、`txt` パラメーターは文字列であるため、`string` に名前が変更されました。
remove|エディターを親要素から削除しますが、残りの機能は維持されます。|このメソッドはサポートされていません。
removeListItem|リストから項目を削除します。|このオプションは、マスク エディターでは使用できなくなりました。
removeListItemAt|インデックスのリストから項目を削除します。|このオプションは、マスク エディターでは使用できなくなりました。
select|エディター内のテキストを選択します。有効なパラメーター: `sel0`、`sel1`、`val`|2 つのパラメーターは間違えられる可能性があるため、`sel0` は `start`、`sel1` は `end` にそれぞれ名前が変更されました。 
setFocus|遅延によるエディターのフォーカスを設定します。パラメーターが -1 の場合、遅延なしでフォーカスが設定されます。|正の値のみを遅延の値としてサポートしました。デフォルト値は 0 で、遅延なしでフォーカスを移動します。
spin|パラメーターに従って、エディター内の値を増分 (正の差分) または減分 (負の差分) します。|このオプションは、マスク エディターでは使用できなくなりました。
text|選択されたテキストをエディターから取得、またはエディターに設定します。|これは getter メソッド `displayValue` に置き換えられました。パラメーターを取らず、入力に表示されたすべての文字で文字列を返します。

>**注:** 新しいマスク エディターの大きな変更点の 1 つは、リストとドロップダウンのサポートが廃止されたことです。ドロップダウンやリストに関連するメソッドを使用しようとすると、メソッドが使用できないことを通知するメッセージが表示されます。 

<a name='new_methods'></a>
### 新しい API メソッド

メソッド|説明
---|---
inputName|<a name='inputName'></a>エディターの要素に適用された name 属性を取得または設定します。
displayValue|<a name='displayValue'></a>入力で表示されたすべての文字による文字列を返します。
editorContainer|<a name='editorContainer'></a>igEditor のトップ / 外部要素として使用されている jquery オブジェクトへの参照を取得します。
clearButton|<a name='clearButton'></a>エディターのクリア ボタンへの参照を返します。
getSelectionStart|<a name='getSelectionStart'></a>エディター内の選択されたテキストの開始インデックスを取得します。
getSelectionEnd|<a name='getSelectionEnd'></a>エディター内の選択されたテキストの終了インデックスを取得します。
insert|<a name='insert'></a>カレットの位置にテキストを貼り付けます。

[すべての API メソッドを参照](%%jQueryApiUrl%%/ui.igmaskeditor#methods)

<a name='event_changes'></a>
### イベントの変更点

イベント|変更内容
---|---
hideDropDown|このイベントのサポートは廃止されました。
showDropDown|このイベントのサポートは廃止されました。
listSelected|このイベントのサポートは廃止されました。
listSelecting|このイベントのサポートは廃止されました。
mouseleave|このイベントは、機能を明確に表すために、`mouseout` という名前に変更されました。

<a name='new_events'></a>
### 新しいイベント

イベント|説明
---|---
rendering|<a name='rendering'></a>エディターの描画が完了する前に起動されるイベントです。
rendered|<a name='rendered'></a>エディターの描画が完了した後に起動されるイベントです。
mouseout|<a name='mouseout'></a>ドロップダウン リストを含めたエディターの任意の部分で、マウス ポインタが離れたときに起動されるイベントです。

[すべてのイベントを参照](%%jQueryApiUrl%%/ui.igmaskeditor#events)

<a name='requirements'></a>
### jQuery の要件

Lib|以前に必要とされたバージョン|新しく必要なバージョン
---|---|---
jQuery コア|1.4.4|1.9.1
jQuery UI|1.7|1.9.0
