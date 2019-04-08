<!--
|metadata|
{
    "fileName": "whats-new-in-2015-volume2",
    "controlName": [],
    "tags": []
}
|metadata|
-->

#2015 Volume 2 の新機能

このトピックでは、%%ProductName%%™ 2015 Volume 2 リリースのコントロールと新機能および拡張機能を紹介します。


##新機能:

以下の表に 2015 Volume 2 の新機能の概要を示します。追加の詳細は以下のとおりです。

### 全般

機能|説明
---|---
[MVC 向けの新しい %%ProductName%% Scaffolder](#igniteui-scaffolder) |%%ProductName%% ウィジェット用の新しい Scaffolder
%%ProductName%% のすべてのウィジェットを対象とした ASP.NET MVC 6 の完全なサポート|ASP.NET MVC 6 のバージョン ビルドが、Infragistics.Web.Mvc.dll に含まれるようになりました。
%%ProductName%% の TypeScript 1.5 定義|%%ProductName%% の TypeScript 定義は、TypeScript 1.5 をサポートするようになりました。ウィジェットのメソッドに Intellisense が追加されました。

### igCombo
機能|説明
---|---
オートコンプリート|コンボに入力すると、一覧から一致する結果を絞り込み表示します。[サンプルの表示](%%SamplesUrl%%/combo/filtering)
[グループ化](#combo-grouping)|コンボ リスト内の項目をグループ化することができるようになりました。[サンプルの表示](%%SamplesUrl%%/combo/grouping)
ヘッダーとフッターのテンプレート|テンプレートを使用して、ヘッダーとフッターをコンボで構成できるようになりました。[サンプルの表示](%%SamplesUrl%%/combo/templates) 
RTL サポート|右から左に記述する言語のサポートを追加しました。
[ドロップダウンの方向](#combo-dd-orientation) |デフォルトで、ドロップダウン リストは使用可能なスペースに応じて上部または下部に自動的に表示されます。ドロップダウン リストのこの動作は、`dropDownOrientation` オプションを使用して明示的に構成することもできます。 
カスタム値|コンボのテキスト入力でカスタム値を設定する `allowCustomValue` オプションは、15.1 で削除されましたが、お客様からのフィードバックに応え、このリリースで復活させました。[サンプルの表示](%%SamplesUrl%%/combo/editing)
パフォーマンスの向上|コンボを使用するすべての操作は、10,000 個以上のレコードでスムーズに動作します。初期ロード時間、ドロップダウン リストのオープン時およびクローズ時のアニメーション、選択、オート コンプリートおよびオート セレクトによる入力はいずれも、高速で動作します。 

### igDataChart

機能|説明
---|---
[新しい軸間隔](#chart-axis-intervals) |`igDataChart` コントロールの主軸および副軸の間隔機能を使用すると、指定された色および太さの間隔を `igDataChart` コントロールの x および y 軸に適用することができます。

### エディター

機能|説明
---|---
[新しいエディター](#new-editors)|15.2 には、より堅牢で豊富な機能を持つ、高性能な新しいエディターが付属しています。

### igGrid

機能|説明
---|---
[リファクタリングされた更新機能](#grid-refactored-updating)|リファクタリングされたグリッドの更新機能は、新しいエディターおよび検証メカニズムを利用し、設計し直されたダイアログ編集モードを提供します。
列の自動サイズ変更|グリッド列は、セルの内容の幅に基づく自動サイズ変更をサポートするようになりました。自動サイズ変更を有効にするには、列の [`width`](%%jQueryApiUrl%%/ui.iggrid#options:columns.width) オプションの値として `*` を使用します。
[フィルタリングの向上](#grid-filtering-improvements)|カスタム フィルター条件を追加し、特定の列に対するフィルター条件を選択できるようになりました。
KnockoutJS サポートの改善|レスポンシブ垂直列レンダリングが KnockoutJS でサポートされるようになりました。
JavaScript ベースの Excel グリッド エクスポーター (RTM)|現在、RTM 版の JavaScript ベースの Excel グリッド エクスポーターは、igGrid、igTreeGrid、igHierarchicalGrid をサポートします。
ARIA のサポート|W3C WAI-ARIA 仕様に準拠するようになりました。これにより無効化されたユーザーに対しても満足のいくエクスペリエンスが提供できます。
[RowSelectors の向上](#grid-row-selectors-improvements)  |チェックボックス付きの行セレクターおよびページングが有効な場合、すべてのページで選択を有効にできます。

### igHierarchicalGrid

機能|説明
---|---
JavaScript ベースの Excel グリッド エクスポーター (RTM)|現在、RTM 版の JavaScript ベースの Excel グリッド エクスポーターは、igGrid、igTreeGrid、igHierarchicalGrid をサポートします。
ARIA のサポート|W3C WAI-ARIA 仕様に準拠するようになりました。これにより無効化されたユーザーに対しても満足のいくエクスペリエンスが提供できます。

### igTreeGrid

機能|説明
---|---
[行セレクター](#treegrid-row-selectors)|TreeGrid の行セレクター機能は、igGrid の行セレクターの機能を継承し、tri-state モードが追加されています。
[TreeGrid の MVC ラッパーにおけるリモートの並び替え、ページング、フィルタリング、ロードオンデマンド](#treegrid-remote-mvc-features) |リモート シナリオで、標準の並び替え、ページング、フィルタリング、ロードオンデマンドのすべての機能が、MVC ラッパー内部でデフォルト設定のまま使用できるようになりました。
列移動|TreeGrid に、igGrid の列移動機能を継承する機能が組み込まれました。
サイズ変更|TreeGrid に、igGrid のサイズ変更機能を継承する機能が組み込まれました。
キーボード ナビゲーション|TreeGrid のキーボード ナビゲーション機能が向上しました。 
[コンテキスト行のページング](#treegrid-paging-context-row) |リーフレベルのコンテキストを説明する、コンテキスト行のページング機能が追加されました。
JavaScript ベースの Excel グリッド エクスポーター (RTM)|現在、RTM 版の JavaScript ベースの Excel グリッド エクスポーターは、igGrid、igTreeGrid、igHierarchicalGrid をサポートします。
ARIA のサポート|W3C WAI-ARIA 仕様に準拠するようになりました。これにより無効化されたユーザーに対しても満足のいくエクスペリエンスが提供できます。

### igNotifier
機能|説明
---|---
[新しいコンポーネント](#notifier)|Notifier コンポーネントは、ポップオーバー コンポーネントの拡張機能で、エンドユーザーに通知情報を提供します。

### igValidator
機能|説明
---|---
[リファクタリングされたバリデーター](#validator) |標準の入力フォーム要素だけではなく、一連の %%ProductName%% コンポーネントも柔軟に検証できるように、バリデーターが作り直されました。

### igUpload

機能|説明
---|---
ファイル アップロード時の、クライアントとサーバー間での追加データの送信|ファイルのアップロード プロセス中にクライアントとサーバーとの間でデータを送信できるようになりました。

##全般

### <a id="igniteui-scaffolder"></a> MVC 向けの新しい %%ProductName%% Scaffolder

%%ProductName%% ウィジェット用の新しい Scaffolder を公開しました。これにより、開発者の生産性が大幅に向上します。データの作成、読み込み、アップデート、削除などの標準的なデータ操作を迅速に絞り込む、コード生成およびテンプレートを提供します。数回のクリック操作で、グリッドの完全な構成やコントローラーの作成、手動によるコーディングの所要時間を短縮することができます。HierarchicalGrid、TreeGrid、DataChart などの他のウィジェットの構成は、すでに進行中です。
ASP.NET MVC とともに出荷される、作成、編集、削除、詳細、リストの標準テンプレートに加え、新しいエディター ウィジェットを使用する、カスタマイズされた %%ProductName%% テンプレートを提供します。

![](images/igniteui_scafolder.png)

#### 関連トピック

-   [%%ProductName%% Scaffolder の Visual Studio 拡張機能](MVC-Scaffolding.html)

## igCombo
### <a id="combo-grouping"></a>
####グループ化
新しいグループ化機能は、項目が属するカテゴリに基づき、項目 (たとえば、社員および社員が属する部門) をグループ化し、分類する方法を提供します。

![](images/combo-grouping.png)

### <a id="combo-dd-orientation"></a>
####ドロップダウンの方向
ドロップダウンの方向は、デフォルトで「auto」に設定されています。この場合、利用できるスペース (コンボの上部、下部) に基づき、ドロップダウンの位置は自動的に計算されます。下部にドロップダウンを表示するには、この値を「bottom」に設定し、上部に表示するには「top」に設定します。

#### 関連サンプル

-   [オートコンプリート](%%SamplesUrl%%/combo/filtering) 
-   [グループ化](%%SamplesUrl%%/combo/grouping)
-   [ヘッダーとフッターのテンプレート](%%SamplesUrl%%/combo/templates)
-   [カスタム値](%%SamplesUrl%%/combo/editing)





## igDataChart

### <a id="chart-axis-intervals"></a> 新しい軸間隔

igDataChart では、Interval プロパティおよび MinorInterval プロパティを使用して、主間隔および副間隔をすべての数値型およびカテゴリ型の軸に実装できるようになりました。この機能には、チャート軸から公開される MajorStroke、MajorThickness、MinorStroke、MinorThickness の各プロパティを使用して、間隔を色と太さでカスタマイズする機能が含まれています。

以下の例では、igDataChart LineSeries の NumericX 軸で主軸および副軸の間隔を使用する方法を示します。

![](images/jQuery_AxisIntervals_NumericX_X_Intervals.png)

この例では、igDataChart LineSeries のNumericY 軸で主軸および副軸の間隔を使用する方法を示します。

![](images/jQuery_AxisIntervals_NumericY_Y_Intervals.png)

#### 関連トピック

-   [igDataChart の概要](igDataChart-Overview.html)
-   [軸間隔の構成 (igDataChart)](igdatachart-configuring-axis-intervals.html)

#### 関連サンプル

-   [NumericAxesIntervals](igDataChart-Axis-Intervals.html#preview) : このサンプルでは、NumericX 軸およびNumericY 軸を使用して ScatterLineSeries の主軸および副軸の間隔の使用を紹介します。
-   [CategoryXAxisIntervals](igDataChart-Axis-Intervals.html#categoryxexample) : このサンプルでは、CategoryXAxis を使用して ColumnSeries の主軸および副軸の間隔の使用を紹介します。

## エディター

### <a id="new-editors"></a> 新しいエディター

このリリースでは、より堅牢で豊富な機能を持つ、高性能なエディター ウィジェットを提供することが 1 つの目的です。エディター の各コンポーネントには、膨大な量のコードで支援された多くの機能があります。弊社の開発チームは、エディターの最適なユーザビリティのためにすべてのエディターを設計し直し、新しいコンポーネントの Checkbox ウィジェットを追加しました。そのため、この最新リリースは、もう 1 つの大型開発キャンペーンとなりました。
以下に、新しいエディターの主要なゴールの一部を紹介します。
 - 最高のユーザー エクスペリエンスの提供 - すべてのエディターの全体的なユーザー エクスペリエンスを再検討しました。そのため、詳細な設定なしで、従来よりも優れたエクスペリエンスが提供されています。HTML5 の編集機能のメリット、最新のルック アンド フィール、タッチ フレンドリーなインターフェイスを提供します。ラベルの配置から検証、さまざまな状態での対話まで、細部に至るまで配慮しました。
 - より直感的な API - ヘルプ トピックを見る必要はありません。直感的で、確かめられるエディターになりました。基本的に、コントロールを書き込む場合と同様にコード化するだけです。新しいAPIは明示的で、不要なメソッドやオプションはありません。
 - 信頼性の向上 - 低減されたコードの複雑さ、向上したパフォーマンス、高いテスト容易性は、この新しいリリースで提供される全般的な品質向上のごく一部です。

![](images/new_editors.png)

新しいエディターへの移行方法に関する詳細は、以下の「関連トピック」を参照してください。

#### 関連トピック

-   [新しい igCurrencyEditor への移行](migrating-to-the-new-igcurrencyeditor.html)
-   [新しい igDateEditor への移行](migrating-to-the-new-igdateeditor.html)
-   [新しい igMaskEditor への移行](migrating-to-the-new-igmaskeditor.html)
-   [新しい igNumericEditor への移行](migrating-to-the-new-ignumericeditor.html)
-   [新しい igPercentEditor への移行](migrating-to-the-new-igpercenteditor.html)
-   [新しい igTextEditor への移行](migrating-to-the-new-igtexteditor.html)
-   [新しい igDatePicker への移行](migrating-to-the-new-igdatepicker.html)

#### 関連サンプル

-   [新しいテキストエディター](%%SamplesUrl%%/editors/text-editor)
-   [クレジット](%%SamplesUrl%%/editors/credit)
-   [数値エディター](%%SamplesUrl%%/editors/numeric-editor)
-   [マスク エディター](%%SamplesUrl%%/editors/mask-editor)
-   [チェックボックス エディター](%%SamplesUrl%%/editors/checkbox-editor)
-   [日付エディター](%%SamplesUrl%%/editors/date-editor)

## igGrid

### <a id="grid-refactored-updating"></a> リファクタリングされた更新機能
リファクタリングされたグリッドの更新機能は、新しいエディターおよび検証メカニズムの特長が活かされています。このリリースで初公開となる機能には、リファクタリングされたダイアログ編集モード (「行編集ダイアログ」と名前を変更しました) もあります。このモードは、ダイアログが簡単にカスタマイズできるように、外観もアーキテクチャも新しく設計し直されています。リファクタリングされた更新機能への移行方法の詳細は、[新しい更新への移行 (igGrid)](iggrid-updating-migrating-to-the-new-updating.html) を参照してください。 
グリッド コンポーネントの新しい更新機能は、コードの軽量化、柔軟性の向上、最適化のためにリファクタリングされています。

![](images/updating_row_edit_dialog.png)
 
#### 関連トピック
-   [新しい更新への移行 (igGrid)](iggrid-updating-migrating-to-the-new-updating.html)
-   [行編集ダイアログの概要 (igGrid)](iggrid-updating-roweditdialog.html)
-   [行編集ダイアログの構成 (igGrid)](iggrid-updating-roweditdialog-configuring.html)

#### 関連サンプル
-   [行編集ダイアログ](%%SamplesUrl%%/grid/row-edit-dialog)
-   [編集 - カスタム エディター プロバイダー](%%SamplesUrl%%/grid/editing-custom-editor-provider)

### <a id="grid-filtering-improvements"></a> フィルタリングの向上

カスタム フィルター条件を追加し、特定の列に対するフィルター条件を選択できるようになりました。

フィルタリング機能に、2 つのオプションが組み込まれました。
- [`customConditions`](%%jQueryApiUrl%%/ui.iggridfiltering#options:columnSettings.customConditions) - 列単位でカスタム条件を定義する一連のオブジェクト。

![](images/filtering_custom_conditions.png)

- [`conditionList`](%%jQueryApiUrl%%/ui.iggridfiltering#options:columnSettings.conditionList) - 列単位で有効にする一連の条件。

#### 関連サンプル
-   [フィルタリング](%%SamplesUrl%%/grid/custom-conditions-filtering)

### <a id="grid-row-selectors-improvements"></a> RowSelectors の向上
行セレクターと組み合わせてページング機能を有効にすると、すべての行をすべてのページにわたって選択できるように、追加 UI が表示されます。

![](images/grid_improvements_row_selectors.png)

この機能は、[enableSelectAllForPaging](%%jQueryApiUrl%%/ui.iggridrowselectors#options:enableSelectAllForPaging) オプション、[enableCheckBoxes](%%jQueryApiUrl%%/ui.iggridrowselectors#options:enableCheckBoxes)、および [multipleSelection](%jQueryApiUrl%%/ui.iggridselection#options:multipleSelection) オプションを設定して有効にします。

#### 関連トピック
-   [行セレクターの構成 (igGrid)](iggrid-configuring-row-selectors.html)

## igTreeGrid

### <a id="treegrid-row-selectors"></a> 行セレクター

igTreeGrid の行セレクター機能は、igGrid の RowSelectors が拡張されています。 
この機能には、階層番号付けモードと tri-state チェックボックスという 2 つの新しい機能が導入され、階層データが簡単に選択できるようにカスタマイズされています。
階層番号付けモードの場合、行番号に、階層の各レベルのカウンターが含まれます。この機能は [`rowSelectorNumberingMode`](%%jQueryApiUrl%%/ui.igtreegridrowselectors#options:rowSelectorNumberingMode) オプションにより管理します。

![](images/tregrid_row_selectors_hierarchical_numbering_mode.png)
 
tri-state チェックボックスには、親行にオン状態の子行があることを示す、部分的なチェック状態が導入されています。この機能は [`checkBoxMode`](%%jQueryApiUrl%%/ui.igtreegridrowselectors#options:checkBoxMode) オプションにより管理します。

![](images/tregrid_row_selectors_tri_state_checkboxes.png)

さらに、行セレクターと組み合わせてページング機能を有効にすると、すべてのページを跨ぎすべての行が選択できるように、追加の UI が表示されます。

![](images/tregrid_row_selectors_paging.png)
 
#### 関連トピック
-   [行セレクター (igTreeGrid)](igtreegrid-row-selectors.html)

#### 関連サンプル
-   [行セレクター](%%SamplesUrl%%/tree-grid/row-selectors)

### <a id="treegrid-remote-mvc-features"></a> TreeGrid の MVC ラッパーにおけるリモートの並び替え、ページング、フィルタリング、ロードオンデマンド

TreeGrid の MVC ラッパーは、並び替え、ページング、フィルタリング、ロードオンデマンドのリモート操作をデフォルト設定のままで処理できるようになりました。
必要なのは、`TreeGridDataSourceAction` 属性を使用して、リモート機能を処理するアクションの追加だけです。  
 
#### 関連トピック
-   [リモート機能 (igTreeGrid)](igtreegrid-remote-features.html)

#### 関連サンプル
-   [リモート機能](%%SamplesUrl%%/tree-grid/remote-features)

### <a id="treegrid-paging-context-row"></a> コンテキスト行のページング

大量な階層データセットでは、階層内の場所を特定するのが難しい場合があります。リーフレベルのコンテキストを説明する、コンテキスト行のページング機能を追加しました。このトレイルは、リーフからすべての先祖までの完全なパスを表しています。使用可能なコンテキストは以下のとおりです。
    - none - コンテキスト行は描画されません。
    - parent - 直近の親行の読み取り専用表記を描画します。
    - breadcrumb - すべての先祖にわたる完全なパスを表す読み取り専用ブレッドクラムトレイルを描画します。
この機能は [`contextRowMode`](%%jQueryApiUrl%%ui.igtreegridpaging#options:contextRowMode) オプションにより管理します。

![](images/treegrid_paging_context_row.png)

#### 関連トピック
-   [ページング (igTreeGrid)](igtreegrid-paging.html)

#### 関連サンプル
-   [ページング](%%SamplesUrl%%/tree-grid/paging)

## igNotifier

### <a id="notifier"></a> 新しいコンポーネント

Notifier コンポーネントは、ポップオーバー コンポーネントの拡張機能で、エンドユーザーに通知情報を提供します。通知状態は、success、info、warning、errorの 4 つが事前定義されています。 
コンポーネントは、単純なインライン スタイルのメッセージングだけではなく、ポップオーバー モードもサポートします。さらに、ディター ウィジェットを使用した自動ペアリング機能が追加され、定義済みの範囲外の入力エラーが検出できるようになりました。 
Notifier コンポーネントは、%%ProductName%% ウィジェットでの使用または単独での使用にかかわらず、簡単で直観的な方法でユーザー エクスペリエンスを向上させます。

![](images/notifier.png)

#### 関連トピック
-   [igNotifier の概要](ignotifier-overview.html)

#### 関連サンプル
-   [基本的な使用方法](%%SamplesUrl%%/notifier/basic-usage)
-   [インライン メッセージ](%%SamplesUrl%%/notifier/inline-messages)
-   [igEditors を使用するNotifier](%%SamplesUrl%%/editors/with-igEditors)

## igValidator

### <a id="validator"></a> リファクタリングされたバリデーター

リファクタリングされた igValidator コンポーネントを使用すると、標準の入力フォーム要素だけではなく、一連の %%ProductName%% コンポーネントも柔軟に検証できます。このメカニズムは、検証プロセスの処理とエンド ユーザーに対する柔軟で視覚的な通知の表示の両方で、igNotification コンポーネントの機能を使用します。リファクタリングされた igValidator への移行方法については、[新しい igValidator コントロールへの移行](igvalidator-migration-topic.html)を参照してください。

![](images/validator.png)

#### 関連トピック
-   [igValidator の概要](igvalidator-overview.html)
-   [新しい igValidator コントロールへの移行](igvalidator-migration-topic.html)

#### 関連サンプル
-   [基本的な使用方法](%%SamplesUrl%%/validator/basic-usage)
