<!--
|metadata|
{
    "fileName": "iggrid-group-by-dialog-overview",
    "controlName": "igGrid",
    "tags": []
}
|metadata|
-->

# グループ化ダイアログの概要 (igGrid)

## トピックの概要

### 目的

このトピックでは、`igGrid`™ コントロールのグループ化ダイアログについて説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要なトピックを示しています。

- [%%ProductName%% コントロールのタッチ サポート](Touch-Support-for-IgniteUI-for-jQuery-Controls.html): このトピックでは、%%ProductName%%™ コントロールのタッチ サポート インタラクションの更新内容を紹介します。

- [機能セレクター](igGrid-Feature-Chooser.html): このトピックでは、`igGrid`™ 機能セレクター メニューとそのそのセクションについて説明します。 

- [igGrid Group By の概要](igGrid-GroupBy-Overview.html): このトピックでは、`igGrid` におけるグループ化を示します。

- [igHierarchicalGrid™ Group By の概要](igHierarchicalGrid-Grouping-Overview.html): このトピックでは、`igHierarchicalGrid` におけるグループ化を示します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**構成可能な動作**](#configurable-behaviors)
-   [**ユーザーによる操作**](#user-interactions)
    -   [ユーザー相互作用の概要](#user-interactions-summary)
    -   [即時グループ化が有効な状態のグループ化](#interactions-immediate-grouping)
    -   [遅延グループ化が有効な状態のグループ化](#interactions-deferred-grouping)
-   [**プロパティ リファレンス**](#property-reference)
-   [**メソッド リファレンス**](#method-reference)
-   [**イベント リファレンス**](#event-reference)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

### グループ化ダイアログの概要

`igGrid` グループ化のモーダル ダイアログは、任意の列によるグリッドのグループ化を可能にするウィンドウです。グループ化モーダル ダイアログによって、グループ化された列を順序を選択でき、またすべての列に変更を即座に適用、あるいは複数の列に変更を一度に適用することができます。これは、タッチ プラットフォーム デバイスで、`igGrid` ごとにグループ化する必要がある場合に非常に役立ちます。グループ化ダイアログ ウィンドウは、特にタッチ プラットフォーム デバイス向けに設計されています。

![](images/07_igGrid_GroupBy_ModalDialog_1.png)

モーダル ダイアログ ウィンドウは、グリッド内でグループ化される順序で、グループ化された列を表示します。

### グループ化ダイアログへのアクセス

グループ化モーダル ダイアログ ウィンドウを開くには、グループ化領域の「列を選択」のラベルをクリックします。

*Group By* ダイアログを表示するには、デフォルトではグリッドの上部にある `igGrid` グループ化領域の*列を選択*リンクをクリックします。

![](images/07_igGrid_GroupBy_ModalDialog_2.png)

### igGrid および igHierarchicalGrid グループ化ダイアログの違い

`igGrid` および `igHierarchicalGrid` のダイアログの違いは、`igHierarchicalGrid` には追加のドロップ ダウンがあり、階層から列レイアウトを選択できることです。ドロップダウンからレイアウトを選択することによって、モーダル ダイアログは、現在のグリッド レイアウトのすべての列を表示します。表示された列のいくつかを選択することによって、グリッドをグループ化できます。新しいグリッド レイアウトを選択してから同じレイアウトに再び戻ると、グループ化された列の順序は保持されています。モーダル ダイアログの*すべてクリア* ボタンを押すことによって、すべてのグループ化をクリアできます。

igGrid|igHierarchicalGrid
----   | -----
![](images/07_igGrid_GroupBy_ModalDialog_1.png) | ![](images/07_igGrid_GroupBy_ModalDialog_4.png)





## <a id="configurable-behaviors"></a> 構成可能な動作

ウィンドウには、即時グループ化および遅延グループ化 (デフォルト) の、2 つのグループ化動作があります。これは、ユーザーがグループ化アクションを実行したときに、グリッドを自動的に更新するかどうかを定義します。これらの動作は、[`modalDialogGroupByOnClick`](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogGroupByOnClick) プロパティの状態によって管理されます。詳細については、構成可能な動作チャートを参照してください。

### igGrid の構成可能な動作チャート

以下の表は、グループ化ダイアログの構成可能な動作を示しています。このメソッドについては、表の下にある解説も参照してください。

動作|説明|*modalDialogGroupByOnClick* 値
-------  | ----------- | ------------ 
[即時グループ化](#interactions-immediate-grouping)|ユーザーが列を選択すると、グリッドは遅延なしにその列によってグループ化されます。|true
[遅延グループ化](#interactions-deferred-grouping)|ユーザーが列を選択すると、グリッドは、**適用**ボタンがクリックされるまでグループ化されません。これによって、グループ化アクションが発生する前に、ユーザーは複数の列を選択して、その順序を定義できます。|false





## <a id="user-interactions"></a> ユーザーによる操作

### <a id="user-interactions-summary"></a> ユーザー相互作用の概要

ユーザーがグループ化を実行する方法は、即時グループ化および遅延グループ化*が有効かどうかによって*異なります。*以下の表では、それぞれのユーザー アクションの概要をまとめています。*このメソッドについては、表の下にある解説も参照してください。

ユーザー操作|説明
-------  | -----------
[即時グループ化が有効な状態のグループ化](#interactions-immediate-grouping)|ユーザーは、列をクリックすることによって、特定の列ごとにグリッドをグループ化します。
[遅延グループ化が有効な状態のグループ化](#interactions-deferred-grouping)|ユーザーは希望の列を選択してから、**適用**ボタンをクリックしてグループ化アクションを適用します。



### <a id="interactions-immediate-grouping"></a> 即時グループ化が有効な状態のグループ化

![](images/07_igGrid_GroupBy_ModalDialog_5.png)

以下のボタンを使用します。

1.  グループ化 - 現在の列を昇順にグループ化します (行全体がクリック可能です)。
2.  上矢印 - 列は昇順でグループ化されます。ボタンを押すと、降順でグループ化されます (行全体がクリック可能です)。
3.  下矢印 - 列は降順でグループ化されます。ボタンを押すと、昇順でグループ化されます (行全体がクリック可能です)。
4.  グループの解除 - 現在の列によるグループ化を解除します。
5.  閉じる - モーダル ダイアログを閉じます。
6.  ESC (キー) - モーダル ダイアログを閉じます。

### <a id="interactions-deferred-grouping"></a> 遅延グループ化が有効な状態のグループ化

デフォルトで、[`modalDialogGroupByOnClick`](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogGroupByOnClick) は false に設定されます。つまり、グループ化する列を選択してから、変更をグリッドに適用してグループ化を適用する必要があります。

![](images/07_igGrid_GroupBy_ModalDialog_6.png)

以下のボタンを使用します。

1.  グループ化 - 現在の列を昇順にグループ化します (行全体がクリック可能です)。
2.  上矢印 - 列は昇順でグループ化されます。ボタンを押すと、降順でグループ化されます (行全体がクリック可能です)。
3.  下矢印 - 列は降順でグループ化されます。ボタンを押すと、昇順でグループ化されます (行全体がクリック可能です)。
4.  グループの解除 - 現在の列によるグループ化を解除します。
5.  適用 - 目的の順序で列をグループ化、それを適用します。
6.  キャンセル - モーダル ダイアログを閉じ、変更を適用しません。
7.  すべてクリア - すべてのレイアウト内のグループ化された列をすべて削除します。
8.  ESC (キー) - モーダル ダイアログを閉じます。

> **注**: `igHierarchicalGrid` ウィジェットについては、追加のドロップダウンが利用可能であり、これを使用して、まず子レイアウトを選択してから、グループ化する列を選択できます。



## <a id="property-reference"></a>プロパティ リファレンス

このセクションでは、モーダル ダイアログに影響を及ぼす、`igGrid` の Group By プロパティについて説明します。

以下の表は、モーダル ダイアログの構成を担当する、`igGrid` の Group By プロパティを示しています。

プロパティ|説明
-------  | -----------
[modalDialogGroupByOnClick](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogGroupByOnClick) |グループ化ダイアログ ウィンドウで列を選択したときに発生することを指定します。即時グループ化/グループ化解除するか、または「適用」ボタンがクリアされるまで待機します。
[modalDialogWidth](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogWidth) |ダイアログの幅を指定します
[modalDialogHeight](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogHeight) |ダイアログの高さを指定します
[modalDialogAnimationDuration](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogAnimationDuration) |ダイアログを表示/非表示にするための、アニメーションの時間を指定します (ミリ秒)
[modalDialogDropDownWidth](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogDropDownWidth) |グリッド レイアウトを表示する Modal Dialog のドロップダウンの幅を指定します
[modalDialogDropDownAreaWidth](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogDropDownAreaWidth) |ダイアログのレイアウト ドロップダウンの高さを指定します
[modalDialogGroupByButtonText](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogGroupByButtonText) |ダイアログの Group By ボタンのテキストを指定します
[modalDialogCaptionButtonDesc](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogCaptionButtonDesc) |ダイアログ内の降順に並べ替えられた各列のキャプションを指定します
[modalDialogCaptionButtonAsc](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogCaptionButtonAsc) |ダイアログ内の昇順に並べ替えられた各列のキャプションを指定します
[modalDialogCaptionButtonUngroup](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogCaptionButtonUngroup) |グループ化ダイアログ内のキャプション ボタンのグループ解除を指定します
[modalDialogCaptionText](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogCaptionText) |ダイアログのキャプション テキストを指定します
[modalDialogDropDownLabel](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogDropDownLabel) |グリッド レイアウトを表示するモーダル ダイアログのドロップダウンのラベルを指定します。
[modalDialogRootLevelHierarchicalGrid](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogRootLevelHierarchicalGrid) |レイアウトのツリー ダイアログを示す root レイアウトの名前を指定します
[modalDialogDropDownButtonCaption](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogDropDownButtonCaption) |ダイアログのグリッド レイアウト ドロップダウン ボタンのキャプションを指定します
[modalDialogClearAllButtonLabel](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogClearAllButtonLabel) |ダイアログのすべてクリア ボタンのラベルを指定します
[emptyGroupByAreaContentSelectColumnsCaption](%%jQueryApiUrl%%/ui.iggridgroupby#options:emptyGroupByAreaContentSelectColumnsCaption) |ダイアログを開くボタンのキャプションを指定します
[modalDialogButtonApplyText](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogButtonApplyText) |ダイアログで変更を適用するボタンのテキストを指定します
[modalDialogButtonCancelText](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogButtonCancelText) |ダイアログで変更をキャンセルするボタンのテキストを指定します



## <a id="method-reference"></a> メソッド リファレンス

このセクションでは、モーダル ダイアログに影響を及ぼす、`igGrid` の Group By メソッドについて説明します。

以下の表は、モーダル ダイアログ API で定義される `igGrid` グループ化メソッドを示しています。

メソッド|説明
------ | -----------
[openGroupByDialog](%%jQueryApiUrl%%/ui.iggridgroupby#methods:openGroupByDialog) |ダイアログを表示します。表示されている場合、メソッドは何も行いません。
[closeGroupByDialog](%%jQueryApiUrl%%/ui.iggridgroupby#methods:closeGroupByDialog) |ダイアログを非表示にします。非表示の場合、メソッドは何も行いません。
[renderGroupByModalDialog](%%jQueryApiUrl%%/ui.iggridgroupby#methods:renderGroupByModalDialog) |グループ化モーダル ダイアログのマークアップを描画します。マークアップがすでに描画されている場合、`openGroupByDialog` および `closeGroupByDialog` プロパティを使用して、モーダル ダイアログをオープン/クローズします。
[openDropDown](%%jQueryApiUrl%%/ui.iggridgroupby#methods:openDropDown) |レイアウト ドロップダウンを開きます (`igHierarchicalGrid` の場合のみ)。
[closeDropDown](%%jQueryApiUrl%%/ui.iggridgroupby#methods:closeDropDown) |レイアウト ドロップダウンを閉じます (`igHierarchicalGrid` の場合のみ)。


## <a id="event-reference"></a> イベント リファレンス

このセクションでは、モーダル ウィンドウに関連付けられた、`igGrid` のグループ化イベントについて説明します。

以下の表は、 モーダル ダイアログの操作中に発生する、`igGrid` の Sorting イベントを示しています。

イベント|説明
----- | -----------
[modalDialogOpening](%%jQueryApiUrl%%/ui.iggridgroupby#events:modalDialogOpening) |モーダル ダイアログが開く前に発生するイベント。 
[modalDialogOpened](%%jQueryApiUrl%%/ui.iggridgroupby#events:modalDialogOpened) |モーダル ダイアログがすでに開いた後に発生するイベント。
[modalDialogMoving](%%jQueryApiUrl%%/ui.iggridgroupby#events:modalDialogMoving) |列チューザーの位置が変わるたびに発生するイベント。
[modalDialogClosing](%%jQueryApiUrl%%/ui.iggridgroupby#events:modalDialogClosing) |モーダル ダイアログが閉じる前に発生するイベント。
[modalDialogClosed](%%jQueryApiUrl%%/ui.iggridgroupby#events:modalDialogClosed) |モーダル ダイアログが閉じた後に発生するイベント。
[modalDialogContentsRendering](%%jQueryApiUrl%%/ui.iggridgroupby#events:modalDialogContentsRendering) |列チューザーのコンテンツが描画される前に発生するイベント。
[modalDialogContentsRendered](%%jQueryApiUrl%%/ui.iggridgroupby#events:modalDialogContentsRendered) |列チューザーのコンテンツが描画された後に発生するイベント。
[modalDialogButtonApplyClick](%%jQueryApiUrl%%/ui.iggridgroupby#events:modalDialogButtonApplyClick) |列チューザーのリセット ボタンをクリックすると発生するイベント
[modalDialogButtonResetClick](%%jQueryApiUrl%%/ui.iggridgroupby#events:modalDialogButtonResetClick) |列チューザーのリセット ボタンをクリックすると発生するイベント。
[modalDialogGroupingColumn](%%jQueryApiUrl%%/ui.iggridgroupby#events:modalDialogGroupingColumn) |モーダル ダイアログ内のグループ化される列がクリックされたときに発生するイベント。
[modalDialogGroupColumn](%%jQueryApiUrl%%/ui.iggridgroupby#events:modalDialogGroupColumn) |モーダル ダイアログ内のグループ化される列がクリックされたときに発生するイベント。
[modalDialogUngroupingColumn](%%jQueryApiUrl%%/ui.iggridgroupby#events:modalDialogUngroupingColumn) |モーダル ダイアログ内のグループ化を解除される列がクリックされたときに発生するイベント。
[modalDialogUngroupColumn](%%jQueryApiUrl%%/ui.iggridgroupby#events:modalDialogUngroupColumn) |モーダル ダイアログ内のグループ化を解除される列がクリックされたときに発生するイベント。
[modalDialogSortGroupedColumn](%%jQueryApiUrl%%/ui.iggridgroupby#events:modalDialogSortGroupedColumn) |モーダル ダイアログ内のグループ化を解除される列がクリックされたときに発生するイベント。





## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [%%ProductName%% コントロールのタッチ サポート](Touch-Support-for-IgniteUI-for-jQuery-Controls.html): このトピックでは、%%ProductName%%™ コントロールのタッチ サポート インタラクションの更新内容を紹介します。

- [機能セレクター](igGrid-Feature-Chooser.html): このトピックでは、`igGrid`™ 機能セレクター メニューとそのそのセクションについて説明します。 

- [igGrid Group By の概要](igGrid-GroupBy-Overview.html): このトピックでは、`igGrid` におけるグループ化を示します。
 
- [igHierarchicalGrid™ Group By の概要](igHierarchicalGrid-Grouping-Overview.html): このトピックでは、`igHierarchicalGrid` におけるグループ化を示します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [グループ化](%%SamplesUrl%%/grid/grouping): igGrid グループ化のモーダル ダイアログ ウィンドウの操作を示すサンプル。