<!--
|metadata|
{
    "fileName": "igdialog-event-reference",
    "controlName": "igDialog",
    "tags": ["API","Events"]
}
|metadata|
-->

# イベント リファレンス (igDialog)

## トピックの概要

### 目的

このトピックでは、`igDialog`™ コントロールのイベントを紹介します。

#### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**イベント リファレンス**](#events)
-   [**jQuery および MVC でイベント ハンドラーを添付する**](#attaching-handlers)
	-   [jQuery でイベント ハンドラーを添付する](#attaching-handlers-jquery)
    -   [MVC でイベント ハンドラーを添付する](#attaching-handlers-mvc)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)



## <a id="events"></a> イベント リファレンス

以下の表に、`igDialog` コントロールの主なイベントの目的と機能の概要を示します。

イベント|説明|キャンセル可能
------|-------------|-----------
[stateChanging](%%jQueryApiUrl%%/ui.igDialog#events:stateChanging) |イベントは、ダイアログの状態が変更される前に発生します。|True
[stateChanged](%%jQueryApiUrl%%/ui.igDialog#events:stateChanged) |イベントは、ダイアログの状態が変更された後に発生します。|False
[animationEnded](%%jQueryApiUrl%%/ui.igDialog#events:animationEnded) |イベントは、ダイアログが閉じるまたは開いたとき、終了アニメーションの後に発生します。|False
[focus](%%jQueryApiUrl%%/ui.igDialog#events:focus) |イベントは、ダイアログまたはそのコンテンツがフォーカスされるときに発生します。|False
[blur](%%jQueryApiUrl%%/ui.igDialog#events:blur) |イベントは、ダイアログまたはそのコンテンツがフォーカスを失ったときに発生します。|False



## <a id="attaching-handlers"></a> jQuery および MVC でイベント ハンドラーを添付する

### <a id="attaching-handlers-jquery"></a> jQuery でイベント ハンドラーを添付する

イベントに添付するには、プロパティの定義と同じようにイベントのハンドラーを定義します。これでイベントをトリガーすると、ハンドラーが呼び出されます。

**JavaScript の場合:**

```js
$("#igDialog1").igDialog({
      stateChanging: function (e, args) {
           // Handle event  
      }
});
```

以下のサンプルは、使用する方法を紹介し、イベント ハンドラーを指定した要素にアタッチするための jQuery の [`on`](http://api.jquery.com/on/) メソッドの使用も紹介します。

<div class="embed-sample">
   [%%SamplesEmbedUrl%%/dialog-window/api-and-events](%%SamplesEmbedUrl%%/dialog-window/api-and-events)
</div>

### <a id="attaching-handlers-mvc"></a> MVC でイベント ハンドラーを添付する

MVC でハンドラーを添付する場合、ハンドラーをウィジェット イベントに添付する jQuery User Interface (UI) パターンを使用します。つまり、jQuery の [`on`](http://api.jquery.com/on/)、[`bind`](http://api.jquery.com/bind/)、または [`live`](http://api.jquery.com/live/) 関数を使用して、イベントの名前をそれらに渡す必要があります。イベント名は、コントロールおよびイベントの名前を連結した小文字の文字列でなければなりません。jQuery ウィジェットでも同様のことができますが、コントロールを初期化するときにイベント ハンドラーを直接添付できるため、これは必要ありません。詳細は、[jQuery ウィジェット ファクトリ](http://wiki.jqueryui.com/w/page/12138135/Widget%20factory)を参照してください。以下のコードは、MVC ソリューションを実装する場合にハンドラーを igDialog イベントに添付する方法を示しています。

**JavaScript の場合:**

```js
$("#igDialog1").live({ igdialogstatechanging: function (e, args) {
     // Handle event  
}});
```

> **注:** jQuery [`live`](http://api.jquery.com/live/) 関数は、イベントをハンドラーに添付した後に一部の DOM 要素が追加される場合に使用されます。

## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [プロパティ リファレンス (*igDialog*)](igDialog-Property-Reference.html): このトピックでは、`igDialog` コントロールのプロパティを紹介します。
- [メソッドのリファレンス (*igDialog*)](igDialog-Method-Reference.html): このトピックでは `igRating` コントロールのメソッドを紹介します。
- [CSS クラス リファレンス (*igDialog*)](igDialog-Css-Classes-Reference.html): このトピックでは、`igDialog` コントロールの CSS クラスを紹介します。


 

 


