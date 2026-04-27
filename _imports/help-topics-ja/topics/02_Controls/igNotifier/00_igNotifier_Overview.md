<!--
|metadata|
{
    "fileName": "ignotifier-overview",
    "controlName": "igNotifier",
    "tags": ["Getting Started"]
}
|metadata|
-->

# igNotifier の概要

`igNotifier` は、既存の `igPopover` ウィジェットの機能を拡張する新しいコントロールです。メッセージやオプション アイコンの表示、状態のスタイルのターゲットへの適用などもできる通知コントロールを提供します。通知は重要度に応じて、success、info、warning、error の 4 つの状態で表示できます。通知レベルは、通知のタイプによって区分けして管理することができます。

`igNotifier` の主な目的は、`igEditors` や他の対象となるエディターの状態の有益な情報を提供することです。表示される通知は、エラー関連のメッセージや完了メッセージだけでなく、エディターの状態を詳細に示す警告や追加情報も含まれています。さらに、通知はユーザーエクスペリエンスの観点から、メッセージのタイプに応じて異なった UI で表示されます。それぞれの通知の意味を即座に理解できるように、認識しやすい直感的なスタイルと画像が使用されています。

###このトピックの内容

このトピックは、以下のセクションで構成されます。

- [重要度レベル](#levels-importance)
	- [Success](#success)
	- [Info](#info)
	- [Warning](#warning)
	- [Error](#error)
-	[igNotifier のセットアップ](#setting-up)
-	[関連コンテンツ](#related-content)


## <a id="levels-importance"></a>重要度レベル

メッセージは、success メッセージから error メッセージまでの階層で重要レベルの順に配列できます。`igNotifier` は、適用されるスタイルとデフォルトのメッセージを定義します。

### <a id="success"></a>Success

すべてのメッセージのテキストをカスタマイズできます。カスタマイズする方法は、このトピックで口述します。

success の通知は、入力コンテナーおよび緑色のメッセ―ジともに表示されます。デフォルトのメッセージ テキストは「Success」です。`showIcon` オプションを有効に設定している場合は、「√」アイコンも表示されます。  

```js
$('#success').igNotifier({
  showOn: "focus",
  state: "success" ,
  showIcon: "true",
  mode:"popover",
  direction:"right"
});
```

![](images/igNotifier_Success.png)

### <a id="info"></a>Info

info メッセージの通知は、中程度を表すためにどのテーマでもグレー色で表示されます。このタイプの通知は、階層で 2 番目のレベルです。メッセージは、システムの具体的な状態またはユーザーに要求するアクションなどの情報の通知を目的としています。そのため、デフォルトの設定はありません。[`locale`](%%jQueryApiUrl%%/ui.igNotifier#options:locale) オプションを使用して設定できます。この状態でのテキストボックスの境界線は変化しません。

```js
$('#info').igNotifier({
    direction: "right",
	showIcon: "true",
    locale: {
      infoMsg: "Heads up! This alert needs your attention, but it's not super important."
    }
}).igNotifier("notify", "info");  
```

![](images/igNotifier_Info.png)

### <a id="warning"></a>Warning

階層の 3 番目のレベルは、warning メッセージです。入力コンテナーの境界線および通知は黄色で表示されます。この通知メッセージは、操作の間違いをユーザーに警告しますが、ユーザーはシステムの次の手順に進むことができます。


```js
$('#warning').igNotifier({
    direction: "right",
	showIcon: "true",
    locale: {
      warningMsg: "Warning! Better check yourself, you're not looking too good."
    }
}).igNotifier("notify", "warning");
```

![](images/igNotifier_Warning.png)

### <a id="error"></a>Error

階層の最後レベルは、error メッセージです。赤色で表示されます。error メッセージの場合は、操作の間違いをユーザーに通知するとともに、問題が解決されるまでシステムでの操作が続行できないことをユーザーに通知します。メッセージをポップオーバーで表示する場合は、mode プロパティを明示的に設定する必要があります。

```js
$('#error').igNotifier({
    mode: "popover",
	showIcon: "true",
    Locale: {
      errorMsg: "Oh snap! Change a few things up and try submitting again."
    }
}).igNotifier("notify", "error");
```
![](images/igNotifier_Error.png)


## <a id="setting-up"></a>igNotifier のセットアップ

`igNotifier` は、すべてのターゲットで初期化できますが、igEditors のような複雑なコントロールの場合は、DIV DOM 要素を含むターゲットでもコントロールを初期化する必要があります。これにより、実際のターゲットとCSS が適用される境界線が確実に表示されます。以下の例はこれを実装する方法を示します。

```html
<div id="notifier"></div>
```

```js
$('#notifier').igTextEditor({
  placeHolder: "Focus me."
});

$('#notifier').igNotifier({
    direction: "right",
    locale: {
      successMsg: "Well done!"
    }
}).igNotifier("notify", "success");

```

![](images/igNotifier_basic.png)

他のコントロールと同様に、`igNotifier` には、通知の外観をカスタマイズできる独自のプロパティがあります。たとえば、[`direction`](%%jQueryApiUrl%%/ui.ignotifier#options:direction) プロパティを使用して、メッセージの位置を指定できます。メッセージは、エディターの入力の左右いずれにも配置できます。

もう 1 つの重要なオプションは、[`mode`](%%jQueryApiUrl%%/ui.igNotifier#options:mode) です。`ポップオーバー`または`インライン`表示モードのいずれかを選択できます。デフォルト値は auto です。これは info メッセージと warning メッセージに対してポップオーバー モードが設定され、success メッセージと error メッセージに対してインラインが設定されます。

[`locale`](%%jQueryApiUrl%%/ui.ignotifier#options:locale) プロパティを使用すると、特定の状態で表示されるデフォルトのテキストをカスタマイズし、[`notify`](%%jQueryApiUrl%%/ui.ignotifier#methods:notify) メソッドの最後パラメータとして表示できます。

使用できるオプションや詳細な説明は、[igNotifier jQuery API](%%jQueryApiUrl%%/ui.igNotifier)の API マニュアルを参照してください。

## <a id="related-content"></a> 関連コンテンツ

- [Notifier の基本的な使用方法サンプル](%%SamplesUrl%%/notifier/basic-usage)
- [Notifier のインライン メッセージのサンプル](%%SamplesUrl%%/notifier/inline-messages)
- [Notifier と igEditors のサンプル](%%SamplesUrl%%/editors/with-igEditors)
- [igNotifier jQuery API](%%jQueryApiUrl%%/ui.igNotifier)
