<!--
|metadata|
{
    "fileName": "iggrid-multiple-sorting-dialog",
    "controlName": "igGrid",
    "tags": []
}
|metadata|
-->

# 複数並べ替えダイアログ (igGrid)

## トピックの概要

### 目的

このトピックでは、`igGrid`™ コントロールの [複数並べ替え] ダイアログ ウィンドウを使用する方法を紹介します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要なトピックを示しています。

- [%%ProductName%% コントロールのタッチ サポート](Touch-Support-for-IgniteUI-for-jQuery-Controls.html): このトピックでは、%%ProductName%%™ コントロールのタッチ サポート インタラクションの更新内容を紹介します。

- [igGrid 機能セレクター](igGrid-Feature-Chooser.html): このトピックでは、`igGrid`™ 機能セレクター] メニューとそのそのセクションについて説明します。

- [igGrid 並べ替えの概要](igGrid-Sorting-Overview.html): このサンプルでは、`igGrid` 並べ替え機能を有効にして、使用する方法を示します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**ダイアログ ウィンドウの状態**](#window-states)
	-   [モーダル ウィンドウ](#modal-window)
    -   [複数の列を一度に並べ替える](#multiple)
    -   [クリックで列を並べ替える](#on-click)
-   [**プロパティ リファレンス**](#property-reference)
-   [**メソッド リファレンス**](#method-reference)
-   [**イベント リファレンス**](#event-reference)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)


## <a id="introduction"></a> 概要

このトピックでは、`igGrid` コントロールの [複数並べ替え] モーダル ダイアログを操作する方法を紹介します。`igGrid` 機能セレクター詳細セクションの複数並べ替えリスト項目を選択して、[複数並べ替え] モーダル ダイアログをアクティブ化できます。[複数並べ替え] ダイアログ ウィンドウと並べ替え API を使用することは、`igGrid` の複数列を並べ替える 2 種類の方法です。

![](images/06_igGrid_MultipleSorting_ModalDialog_1.png)

並べ替えダイアログには、グリッドで並べ替えた複数列の順序が表示されます。また、並べ替え基準から列を削除できます。


## <a id="window-states"></a> ダイアログ ウィンドウの状態

### <a id="modal-window"></a> モーダル ウィンドウ

以下の表に、[複数並べ替え] モーダル ダイアログ ウィンドウの状態をまとめています。ウィンドウには、[`modalDialogSortOnClick`](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogSortOnClick) プロパティの値 (デフォルトは false) で定義された 2 種類の状態があります*。*デフォルトの状態では、ユーザーはダイアログに変更を行い、変更を適用する必要があります。プロパティが true に設定されている場合、並べ替えは即座に有効になります。

詳細は、概要表の後に記載されています。

状態|modalDialogSortOnClick|説明
---|---|---
[クリックで列を並べ替える](#on-click)|true|[列の選択] ウィンドウから列を選択することで、列は即座に並べ替えられます。
[複数の列を一度に並べ替える](#multiple)|false|複数列は [列の選択] ウィンドウから選択され、ウィンドウで変更が適用されると、列が並べ替えられます。


### <a id="multiple"></a> 複数の列を一度に並べ替える

デフォルトで [`modalDialogSortOnClick`](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogSortOnClick) プロパティは false に設定されます。つまり、どの列を並べ替えて、変更をグリッドに適用するか選択する必要があるということです。

![](images/06_igGrid_MultipleSorting_ModalDialog_2.png)

以下のボタンを使用します。

1.  並べ替え - 現在の列で昇順に並べ替える場合 (行全体がクリック可能)
2.  上矢印 - 列を昇順に並べ替えます。降順に並べ替える場合は、ボタンを押します (行全体がクリック可能)
3.  下矢印 - 列を降順に並べ替えます。昇順に並べ替える場合は、ボタンを押します (行全体がクリック可能)
4.  並べ替えなし - 現在の列による並べ替えをしない場合 **SHIFT** キーとグループ化を解除する `igGrid` 列のヘッダーを押して、モーダル ダイアログ コンテキスト外でそれを実現できます
5.  適用 - 目的の順序で列を並べ替え、それを適用する場合
6.  キャンセル - モーダル ダイアログを閉じ、変更を適用しない場合
7.  リセット - モーダル ダイアログを開いたときに定義されたように、すべての列のデフォルト状態を戻す場合
8.  ESC (キー) - モーダル ダイアログを閉じます


### <a id="on-click"></a> クリックで列を並べ替える

[`modalDialogSortOnClick`](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogSortOnClick) プロパティが true に設定されており、列の名前をクリックすると、グリッドで並べ替えが即座に実行されます。

![](images/06_igGrid_MultipleSorting_ModalDialog_3.png)

以下のボタンを使用します。

1.  並べ替え - 現在の列で並べ替える場合 (行全体がクリック可能)
2.  上矢印 - 列を昇順に並べ替えます。降順に並べ替える場合は、ボタンを押します (行全体がクリック可能)
3.  下矢印 - 列を降順に並べ替えます。昇順に並べ替える場合は、ボタンを押します (行全体がクリック可能)
4.  並べ替えなし - 現在の列による並べ替えをしない場合**SHIFT** キーと並べ替えをしない `igGird` コントロールの列のヘッダーを押して、モーダル ダイアログ コンテキスト外でそれを実現できます。
5.  閉じる - モーダル ダイアログを閉じます。
6.  ESC (キー) - モーダル ダイアログを閉じます



## <a id="property-reference"></a> プロパティ リファレンス

このセクションでは、モーダル ダイアログに影響を与える `igGrid` コントロールの Sorting プロパティについて説明します。

以下の表は、モーダル ダイアログの構成を行う `igGrid` Sorting プロパティを示します。


プロパティ|説明
---|---
[modalDialogSortOnClick](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogSortOnClick) |[複数並べ替え] ダイアログで sort/unsort 列をクリックすると並べ替えが即座に適用されるかどうかを指定します。
[featureChooserText](%%jQueryApiUrl%%/ui.iggridsorting#options:featureChooserText) |機能セレクターのテキストを指定します。
[modalDialogWidth](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogWidth)|[複数並べ替え] ダイアログの幅を指定します。
[modalDialogHeight](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogHeight)|[複数並べ替え] ダイアログの高さを指定します。
[modalDialogAnimationDuration](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogAnimationDuration)|モーダル ダイアログを表示または非表示にするアニメーション時間をミリ秒で指定します。
[modalDialogSortByButtonText](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogSortByButtonText) |[複数並べ替え] ダイアログ ウィンドウの並べ替えられていない項目ごとに Sort By ボタンのテキストを指定します。
[modalDialogResetButtonLabel](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogResetButtonLabel) |[複数並べ替え] ダイアログの並べ替えられていない項目ごとに [並べ替え] ボタンのラベルを指定します。
[modalDialogCaptionButtonDesc](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogCaptionButtonDesc)|[複数並べ替え] ダイアログの降順に並べ替えられた項目ごとにキャプションを指定します。
[modalDialogCaptionButtonAsc](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogCaptionButtonAsc)|[複数並べ替え] ダイアログの昇順に並べ替えられた項目ごとにキャプションを指定します。
[modalDialogCaptionButtonUnsort](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogCaptionButtonUnsort) |[複数並べ替え] ダイアログの [並べ替えなし]ボタンのキャプションを指定します。
[unsortedColumnTooltip](%%jQueryApiUrl%%/ui.iggridsorting#options:unsortedColumnTooltip) |並べ替えされていない列の %%ProductName%% テンプレート化形式のカスタム ツールチップ。
[modalDialogCaptionText](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogCaptionText)|[複数並べ替え] ダイアログのキャプションのテキストを指定します。
[modalDialogButtonApplyText](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogButtonApplyText)|モーダル ダイアログで変更を適用するボタンのテキストを指定します。
[modalDialogButtonCancelText](%%jQueryApiUrl%%/ui.iggridsorting#options:modalDialogButtonCancelText)|モーダル ダイアログで変更を取り消すボタンのテキストを指定します。



## <a id="method-reference"></a> メソッド リファレンス

このセクションでは、モーダル ダイアログに影響を与える `igGrid` の Sorting メソッドについて説明します。

以下の表は、モーダル ダイアログ API を使用できるようにする、`igGrid` コントロールの並べ替えメソッドを示します。


メソッド|説明
---|---
[openMultipleSortingDialog](%%jQueryApiUrl%%/ui.iggridsorting#methods:openMultipleSortingDialog) |モーダル ダイアログを表示します。表示されている場合、メソッドは何も行いません。
[closeMultipleSortingDialog](%%jQueryApiUrl%%/ui.iggridsorting#methods:closeMultipleSortingDialog) |モーダル ダイアログを非表示にします。非表示の場合、メソッドは何も行いません。
[renderMultipleSortingDialogContent](%%jQueryApiUrl%%/ui.iggridsorting#methods:renderMultipleSortingDialogContent) |並べ替えられた項目および並べ替えられていない項目の [複数並べ替え] ダイアログの内容を描画します。
[removeDialogClearButton](%%jQueryApiUrl%%/ui.iggridsorting#methods:removeDialogClearButton) |[複数並べ替え] ダイアログの [クリア] ボタンを削除します。




## <a id="event-reference"></a> イベント リファレンス

このセクションでは、モーダル ウィンドウに関与する `igGrid` コントロールの並べ替えイベントについて説明します。

以下の表は、 モーダル ダイアログの操作中に発生する、`igGrid` の並べ替えイベントを示しています。

イベント|説明
---|---
[modalDialogOpening](%%jQueryApiUrl%%/ui.iggridsorting#events:modalDialogOpening)|モーダル ダイアログを開く前に発生するイベント
[modalDialogOpened](%%jQueryApiUrl%%/ui.iggridsorting#events:modalDialogOpened)|モーダル ダイアログを開いた後に発生するイベント
[modalDialogMoving](%%jQueryApiUrl%%/ui.iggridsorting#events:modalDialogMoving)|モーダル ダイアログの位置が変わるたびに発生するイベント
[modalDialogClosing](%%jQueryApiUrl%%/ui.iggridsorting#events:modalDialogClosing)|モーダル ダイアログを閉じる前に発生するイベント
[modalDialogClosed](%%jQueryApiUrl%%/ui.iggridsorting#events:modalDialogClosed)|モーダル ダイアログを閉じた後に発生するイベント
[modalDialogContentsRendering](%%jQueryApiUrl%%/ui.iggridsorting#events:modalDialogContentsRendering)|モーダル ダイアログのコンテンツが描画される前に発生するイベント
[modalDialogContentsRendered](%%jQueryApiUrl%%/ui.iggridsorting#events:modalDialogContentsRendered)|モーダル ダイアログのコンテンツが描画された後に発生するイベント
[modalDialogSortingChanged](%%jQueryApiUrl%%/ui.iggridsorting#events:modalDialogSortingChanged) |列の並べ替えがモーダル ダイアログで変更された場合に発生するイベント
[modalDialogButtonUnsortClick](%%jQueryApiUrl%%/ui.iggridsorting#events:modalDialogButtonUnsortClick) |列の並べ替えをしないボタンをモーダル ダイアログでクリックした場合に発生するイベント
[modalDialogSortClick](%%jQueryApiUrl%%/ui.iggridsorting#events:modalDialogSortClick) |並べ替えられていない列をクリックして、モーダル ダイアログで並べ替える場合に発生するイベント
[modalDialogButtonApplyClick](%%jQueryApiUrl%%/ui.iggridsorting#events:modalDialogButtonApplyClick)|モーダル ダイアログの [適用] ボタンをクリックしたときに発生するイベント
[modalDialogButtonResetClick](%%jQueryApiUrl%%/ui.iggridsorting#events:modalDialogButtonResetClick)|並べ替えをリセットするボタンをクリックしたときに発生するイベント



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [%%ProductName%% コントロールのタッチ サポート](Touch-Support-for-IgniteUI-for-jQuery-Controls.html): このトピックでは、%%ProductName%%™ コントロールのタッチ サポート インタラクションの更新内容を紹介します。

- [igGrid 機能セレクター](igGrid-Feature-Chooser.html): このトピックでは、`igGrid`™ 機能セレクター メニューとそのそのセクションについて説明します。

- [igGrid 並べ替えの概要](igGrid-Sorting-Overview.html): このサンプルでは、`igGrid` 並べ替え機能を有効にして、使用する方法を示します。



### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [機能セレクター](%%SamplesUrl%%/grid/feature-chooser): 機能セレクターを紹介するサンプル。





 

 


