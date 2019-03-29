<!--
|metadata|
{
    "fileName": "iggrid-known-issues",
    "controlName": "igGrid",
    "tags": ["Grids","Known Issues","Tips and Tricks"]
}
|metadata|
-->

# 既知の問題と制限 (igGrid)


以下の表で、`igGrid`™ コントロールの既知の問題と制限を簡単に説明します。以下の表は、一部の問題の詳細な説明とその回避策を示します。

**凡例:**
<table class="table">
	<tbody>
		<tr>
			<td>![](images/positive.png)</td>
			<td>回避策</td>
		</tr>
		<tr>
			<td>![](images/negative.png)</td>
			<td>既知の回避策はありません</td>
		</tr>
		<tr>
			<td>![](images/plannedFix.png)</td>
			<td>既知の回避策はありません。修正予定です</td>
		</tr>
	</tbody>
</table>

## [igGrid - 全般](#grid-general)

問題|説明|状態
------|-------------|-------
`rowTemplate` オプションは非推奨 | 14.1 リリースより `rowTemplate` オプションは非推奨となります。これは以前のバージョンの機能の最新の変更です。<br />`igGrid` は、特定の列テンプレートのために列テンプレートを使用します。 | ![](images/negative.png)
[列のキャプションが、複数の行にラップされない](#column-caption-wrap)|列キャプション ([`headerText`](%%jQueryApiUrl%%/ui.iggrid#options:columns.headerText)) は、複数の行にラップされません。これは以前のバージョンの機能の重大な変更です。 | ![](images/positive.png)
[タッチ ポイントを特定の UI 要素の上をスライドする時に、動作が一致しない](#touch-scroll)|タッチ ポイントが特定の UI 要素の上をスライドする時に、グリッドと機能の動作が一致しない場合があります。 | ![](images/positive.png)
[混在 / 部分の列幅の設定がサポートされない](#column-width)|一部の列幅をパーセント値で定義し、その他の列幅をピクセルで定義する (または列幅を定義しない) という状態はサポートされません。 | ![](images/positive.png)
[IE 7 で、グリッドのヘッダーとフッターが正しく描画されない](#header-footer-ie7)|グリッド幅が指定されていない場合、表示されるヘッダー要素とフッター要素の幅は、Microsoft® Internet Explorer® 7 のグリッドの幅より短くなります。 | ![](images/positive.png)
[<div> 要素で、グリッド機能の API 呼び出しが正しく動作しない](#div-element-api)|グリッドのインスタンスを `<div>` 要素で作成した場合、グリッドの機能に対する API 呼び出しは機能しません。 | ![](images/positive.png)
[Android 4.0.2 で、レコードの背後にダイアログ / ポップアップが表示される](#dialogs-android)|igGrid の垂直スクロールを有効にして、`igGrid` を Android のバージョン 4.0.2 で実行している場合、ポップアップ / ダイアログはすべてレコードの背後に表示されます。 | ![](images/positive.png)
ヘッダー、フッター、およびコンテンツを結合した高さがオプションの高さ設定以上の場合に、`igGrid` が再初期化される | `igGrid` のヘッダー、フッター、およびコンテンツの高さの合計が、オプションで設定された高さよりも大きい場合、`igGrid` ウィジェットは、ヘッダー、フッター、およびコンテンツが表示できる高さになるように、新しい高さで自身を再初期化します。 | ![](images/positive.png)
[showHeader オプションが正しく動作しない](#showHeader)|グリッドの初期化で [`showHeader`](%%jQueryApiUrl%%/ui.iggrid#options:showHeader) オプションが false に設定されている場合、API を使用してそれを true のランタイムに設定すると、ヘッダーが表示されません。 | ![](images/positive.png)
[Mac OS での水平スクロールバーの表示の問題](#scrollbar-mac)|Mac OS® で、*Show scrollbars only when scrolling* オプションを true に設定した場合、グリッドの水平スクロールバーは表示されません。これは、グリッドの水平スクロールバーで、`overflow` が hidden に設定されているためです。 | ![](images/positive.png)
自動生成の列で、ソースはキー / 値ペアが含まれている必要がある|グリッドの列が自動生成の場合 (たとえば、[`autoGenerateColumns`](%%jQueryApiUrl%%/ui.iggrid#options:autoGenerateColumns) が有効な場合)、ソースは常にキー / 値のペアを含む必要があります。含まれていない場合は、グリッドが正しく描画されない可能性があります。 | ![](images/positive.png)
機能を複数回定義できない|**JavaScript の場合:**<br />`igGrid` と `igHierarchicalGrid`™ のいずれの場合も、1 つの機能を複数回定義するとエラーがスローします。<br />**MVC の場合:**<br />`igGrid` と `igHierarchicalGrid` のいずれの場合も、MVC ラッパーで機能を複数回定義すると、最後の定義のみが取り入れられます。 | ![](images/negative.png)
[チェックボックスの表示が、テンプレート (行および列) と一致しない](#checkbox-template)|テンプレート機能を使用し、`renderCheckboxes` オプションを true に設定した場合、ブール値の列にテンプレートが定義されているかどうかをチェックできないため、ブール値の列にはチェックボックスが表示されません。 | ![](images/positive.png)
API メソッドの呼び出しは関連イベントを直接発生させません。 | プログラムによる API メソッドの呼び出しはその操作に関連するイベントを発生させません。イベントは個別のユーザー操作によってのみ発生します。| ![](images/negative.png)
[KnockoutJS の監視可能な配列機能が制限される](#knockout-observable-array)|`unshift`、`reverse`、および `sort` の監視可能な配列機能を使用すると、グリッドのビジュアル外観が誤って表示されます。 | ![](images/positive.png)
id 属性は、DOM コントロール プレースホルダーで必須|id 属性は、グリッドが初期化される DOM 要素に設定する必要があります。グリッドは、jQuery セレクターを内部で使用して選択を高速化します。|![](images/negative.png)
スペースを含む列のキーはサポートされない|列のキーは、一部の DOM 要素の ID の生成に使用されます。[HTML 5 仕様](http://www.w3.org/TR/html5/dom.html#the-id-attribute)により、HTML id 属性にスペースを入れることはできません。|![](images/negative.png)
contextMenu イベントは cellRightClick に名前変更しました|イベント名は発生する操作を説明します。|![](images/negative.png)
IE8 でヘッダー テキストと並べ替え/フィルタリング/ギア アイコンが整列しない|IE8 で css calc() がサポートされないブラウザーの制限によるものです。詳細は http://caniuse.com/#feat=calc を参照してください。| ![](images/negative.png)
タッチ環境で選択が有効な igGrid でスクロールする場合、IE11 でページをスクロールできません。 | 選択機能は IE でポインター イベントのデフォルト動作を無効にするために "-ms-touch-action: none" を適用します。これでページをスクロールする代わりにユーザーがセルをタッチしてドラッグできます。 | ![](images/negative.png)
[水平スクロールバーで仮想化していないグリッドの終了までスクロール後、垂直スクロールバーで垂直方向にスクロールする動作は、 Edge ブラウザーで正しく機能しません。](#edge-vertical-scrollbar) | 垂直スクロールバーは、水平スクロールバーが右端にある場合に動作しません。igGrid のスクロール領域で非表示のオーバーフローがある場合のサードパーティー (Microsoft) による問題です。 | ![](images/positive.png)

## [igGrid - データ バインディング](#data-binding)

問題|説明|状態
------|-------------|-------
`DataTable`/`DataSet` へのバインドを、更新機能と同時に使用する場合は、[`LoadTransaction()`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~LoadTransactions.html) メソッドを `GridModel` でオーバーライドする必要がある|`igGrid` を `DataTable` または `DataSet` にバインドすると同時に、更新機能を使用する場合、`GridModel` は、JSON に対する `Dictionary<string, string>` の逆シリアル化をサポートするシリアライザーを使用して、`LoadTransaction()` メソッドをオーバーライドする必要があります。 | ![](images/positive.png)
[データ テーブル / セットへのバインドで、リモートのフィルタリング、並べ替え、集計、およびグループ化がサポートされない](#datatable-remote-operations)|グリッドを `DataTable` または `DataSet` にバインドしている場合、並び替え、フィルタリング、および Group By 機能のローカル構成を使用する可能性がありますが、並び替えとフィルタリングでは、リモート構成の回避策が利用できます。 | ![](images/positive.png)



## [igGrid - 非バインド列](#unbound-columns)

<table class="table table-striped">
	<thead>
        <tr>
            <th>問題</th>
            <th>説明</th>
            <th>状態</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>[非バインド列ではリモートのフィルタリング、並べ替え、およびグループ化がサポートされない](#unbound-remote-operations)</td>
            <td>非バインド列列では、並び替え、フィルタリング、および Group By 機能をサポートしていません。[`Columns`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~Columns.html) コレクションに含まれる非バインド列では、上記の機能は無効です。</td>
            <td>![](images/positive.png)</td>
        </tr>
        <tr>
            <td>[グリッド MVC ヘルパーのグリッド `SetUnboundValues(<列キー>, <値のディクショナリ>)` メソッド オーバーロードにはプライマリ キーが必要とされる](#SetUnboundValues)</td>
            <td>`SetUnboundValues(<列キー>], [<値のディクショナリー>])` メソッド オーバーロードを使用するには、プライマリ キーを設定する必要があります。</td>
            <td>![](images/positive.png)</td>
        </tr>
        <tr>
            <td>[ビュー内でのグリッド ヘルパーの使用に制限がある](#unbound-mvc-helper)</td>
            <td>データ ソースがリモートにあり、[`MergeUnboundColumns`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~MergeUnboundColumns.html) プロパティが true に設定されている場合、ASP.NET MVC ビューの内部ではグリッド ヘルパーが使用できないようになっています。</td>
            <td>![](images/negative.png)</td>
        </tr>
        <tr>
            <td>[リモート ページングと *unboundValues* が使用されている場合、非バインド列の値は更新されません。](#unboundValues-remote-paging)</td>
            <td>グリッドは、リモートのページングを有効にしたクライアント上で [`unboundValues`](%%jQueryApiUrl%%/ui.iggrid#options:columns.unboundValues) を設定している場合に、非バインド列に対して同じ値を表示します。</td>
            <td>![](images/negative.png)</td>
        </tr>
        <tr>
            <td>[非バインド列の中で数式の使用に制限がある](#unbound-formulas)</td>
            <td>[`MergeUnboundColumns`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~MergeUnboundColumns.html) オプションが true に設定されている場合、igGrid の非バインド列で数式を使用することはできません。</td>
            <td>![](images/positive.png)</td>
        </tr>
        <tr>
            <td>[グリッド コントロールで非バインド データ値が自動的に保持されない](#unbound-CRUD)</td>
            <td>非バインド値の含まれる行を編集してコミットし、そのあとでグリッドをバインドし直した場合、変更内容は保持されません。</td>
            <td>![](images/positive.png)</td>
        </tr>
        <tr>
            <td>仮想化を使用している場合、一番上にグリッドが誤ってスクロールする</td>
            <td>いずれかの形式 (固定式または連続式) の仮想化を使用し、[`SetUnboundValues()`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~SetUnboundValues.html) クライアント API メソッドを呼び出した場合、非バインド列の値が表示される前にグリッドが一番上にスクロールします。</td>
            <td>![](images/negative.png)</td>
        </tr>
        <tr>
            <td>[リモート データを使用している時、ブール値の非バインド列が間違って生成される](#boolean-unbound-remote)</td>
            <td>[`MergeUnboundColumns`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~MergeUnboundColumns.html) プロパティを false に設定しているときにリモート データを使用すると、ブール値の非バインド列には false が入力されます。</td>
            <td>![](images/positive.png)</td>
        </tr>
        <tr>
            <td>特定の状況で、グリッドの `igGrid` の [`getUnboundValues()`](%%jQueryApiUrl%%/ui.iggrid#methods:getUnboundValues) メソッドが非バインド値を返さない</td>
            <td>非バインド値が [`dataBound`](%%jQueryApiUrl%%/ui.iggrid#events:dataBound) クライアント側イベントを介して設定される場合、`getUnboundValues()` クライアント API メソッドを使用しても非バインド値は返されません。</td>
            <td>![](images/negative.png)</td>
        </tr>
        <tr>
            <td>[並べ替え、フィルタリング、グループ化の状態は永続化されません](#unbound-persisting-state)</td>
            <td>並べ替え、フィルタリング、および GroupBy は、非バインド列に適用すると、その状態を保持しません。機能の永続化が有効 (デフォルト) で、非バインド列がグループ化/並べ替え/フィルターされた場合、`igGrid` の  `dataBind()` を起動した後:: 
			<ul>
				<li>**GroupBy** - 列はグループ化されません</li>
				<li>**Filtering** - 非バインド列のフィルタリング式がクリアされます</li>
				<li>**Sorting** - 非バインド列に適用された並べ替えが削除されます</li>
			</ul>
			</td>
            <td>![](images/positive.png)</td>
        </tr>
    </tbody>
</table>


## [igGrid - 仮想化](#virtualization)

問題|説明|状態
------|-------------|-------
固定ヘッダーが常に有効になる (制限)|仮想化が有効な場合、変更できない [`fixedHeaders`](%%jQueryApiUrl%%/ui.iggrid#options:fixedHeaders) オプションのフォームに制限があり、常に true に設定されます。 | ![](images/negative.png)
グリッドの高さ設定に制限がある|`igGrid` の高さは常に、行の平均の高さで割り切れる値でなければなりません。(割り算の剰余はゼロでなければなりません。) | ![](images/negative.png)
列の可視の幅の設定に制限がある|列の表示幅は、`igGrid` の幅と等しくなければなりません (列の仮想化の場合)。 | ![](images/negative.png)
列の仮想化に対して、キーボード ナビゲーションがサポートされない (制限)|列の仮想化に対して、キーボード ナビゲーションはサポートされていません。 | ![](images/negative.png)
セル クラス適用の制限|特定のセルのクラスをソートされた列のすべてのセルに適用する操作はサポートされていません。たとえば、[`applySortedColumnCss`](%%jQueryApiUrl%%/ui.iggridsorting#options:applySortedColumnCss) は自動的に false に設定されます。 | ![](images/negative.png)
仮想化を有効にすると、autofitLastColumn が無効になる|仮想化を有効にすると、[autofitLastColumn](%%jQueryApiUrl%%/ui.iggrid#options:autofitLastColumn) は無効になり、列幅の合計がグリッド幅よりも小さい場合、列は拡張されグリッド全体を占有することになります (autofitLastColumn が true に設定された場合と同じように動作します)。|![](images/negative.png)
グリッドの幅がパーセンテージで定義されている場合、列の仮想化が機能しない|グリッドの幅がパーセンテージで定義され、列の仮想化が有効な場合 ([columnVirtualization](%%jQueryApiUrl%%/ui.iggrid#options:columnVirtualization) = true)、水平スクロールバーが表示されません。|![](images/negative.png)
[固定仮想化は RWD モードでサポートされていません](#fixed-virtualization)|固定仮想化は、行の高さが定数であることが必要です。行の高さが変更する場合、固定仮想化は正しく操作しません。RWD モードは、画面サイズによって行の高さを変更するため、固定仮想化は正しく動作しません。|![](images/positive.png)
列仮想化は連続仮想化でサポートされていません。 | 列仮想化は固定仮想化のみでサポートされています。列仮想化が有効 ([columnVirtualization](%%jQueryApiUrl%%/ui.iggrid#options:columnVirtualization) = true) な場合、仮想化モードを "fixed" ([virtualizationMode](%%jQueryApiUrl%%/ui.iggrid#options:virtualizationMode) = "fixed") に設定する必要があります。 | ![](images/negative.png)
仮想化と列の自動サイズ変更はサポートされない|幅オプションを "*" に設定して列を自動サイズ変更する機能は、仮想化ではサポートされません。 | ![](images/negative.png)
固定仮想化が有効な場合、グリッドのコンテンツ以外から行にタブすると、グリッドの実際の最初の行の代わりに最初の表示可能な行をフォーカスします。 | 固定仮想化が有効な場合、グリッドのコンテンツ以外から行内にタブすると、最初の表示可能な行がフォーカスされます。フォーカスがグリッドの後の要素にあって、Shift + Tab が押された場合、フォーカスは最後の表示可能なセルに設定されます。|![](images/negative.png)
列仮想化の場合、列幅の設定が使用されていません。 | 水平方向のスクロールでコンテンツが列間で移動されますが、表示可能な列幅は変更されないため、列幅の設定を変更してもほとんど影響しません。 |![](images/negative.png)

## igGrid - レスポンス Web デザイン モード
問題|説明|状態
---|---|---
RWD モードは IE8 でサポートされない|RWD は IE8 でモードを決定できません。この機能はモバイル互換性を対象するので、IE8 でサポートされません。|![](images/negative.png)
RWD 単一列のテンプレートはページング以外のグリッド機能でサポートされません。|RWD 単一列のテンプレートはページングのグリッド機能のみでサポートされます。グリッドのその他の機能は現在このモードでサポートされていません。|![](images/negative.png) 
モバイル タッチ デバイスで、レスポンス機能が有効化された場合、デバイスを回転すると igGrid のカスタム スクロールバーが更新されない | レスポンス機能が有効化された場合、デバイスを回転するとカスタム スクロールバーの高さ及び幅が正しくが更新されません。 | ![](images/plannedFix.png)
RWD モードが固定行仮想化および列仮想化でサポートされない | RWD モードは連続仮想化のみをサポートします。 |![](images/negative.png)

## [igGridColumnFixing](#column-fixing)

<table class="table table-striped">
	<thead>
		<tr>
            <th>
問題
			</th>
            <th>
説明
			</th>
            <th>
状態
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
一部の `igGrid` 機能で、列固定がサポートされない
			</td>
            <td>
`igGrid` の列固定機能は、以下の機能では動作しません。
                <ul>
                    <li>
**グループ化** (別名:グループ化)
					</li>
                    <li>
**(レスポンシブ Web デザイン (RWD) モード** (別名:レスポンシブ)
					</li>
                    <li>
**Knockout ライブラリ** (KnockoutJS) の結合
					</li>
                    <li>
**非バインド列**
					</li>
                </ul>
これらの機能と列固定機能の統合は、次期ボリューム リリースで実装される予定です。
            </td>
            <td>
![](images/negative.png)
			</td>
        </tr>
        <tr>
            <td>
[IE9+ での行の固定部分と固定解除部分との不整合](#misalignment-ie9)
			</td>
            <td>
Internet Explorer 9 以降で、列をレコードが大量の `igGrid` に固定してグリッドの中央へスクロールすると、行の固定部分と固定解除部分との間に不整合が発生します。この問題は IE9 のエンジンが原因です。
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>
        <tr>
            <td>
列の幅は必須で、ピクセル単位で定義する必要がある
			</td>
            <td>
列の幅は必須で、ピクセル単位で定義することが推薦されます。明示的に設定または[defaultColumnWidth](%%jQueryApiUrl%%/ui.iggrid#options:defaultColumnWidth) オプションを使用できます。グリッド幅はピクセルまたはパーセンテージ単位で設定してください。
			</td>
            <td>
![](images/negative.png)
			</td>
        </tr>
        <tr>
            <td>
グリッドの高さはパーセンテージ単位で設定できません。
			</td>
            <td>
グリッドの高さをパーセンテージ単位で設定することはサポートされていません。
			</td>
            <td>
![](images/negative.png)
			</td>
		</tr>
	<tr>
            <td>
グリッドおよびその列 (明示的または [defaultColumnWidth](%%jQueryApiUrl%%/ui.iggrid#options:defaultColumnWidth) オプションを使用) の幅は必須で、ピクセル単位で定義する必要があります。
			</td>
			
            <td>
これは Chrome および Safari のサード パーティ問題です。このブラウザーで、固定ヘッダーを含む thead 要素は、キャプションの幅全体に引き伸びます。そのため、列幅がキャプション幅より小さい場合、固定の解除ボタンがヘッダーの表示領域以外に移動することがあります。その他のブラウザーは、固定グリッド領域に同じ列幅を保持するため、この動作を示しません。	    </td>

            <td>
![](images/negative.png)
			</td>
        </tr>
		<tr>
            <td>
選択が行セレクターにより実行される場合、グリッドは行の固定されていない部分にフォーカスを適用します。
			</td>
            <td>
レコードが 2 つの行 (固定部分および固定されていない部分) に分割されることに関連付けられます。ページで単一の要素のみをフォーカスできます。
			</td>
            <td>
![](images/negative.png)
			</td>
        </tr>
		<tr>
            <td>
[fixDataSkippedColumns](%%jQueryApiUrl%%/ui.iggrid#methods:fixDataSkippedColumns) および [unfixDataSkippedColumns](%%jQueryApiUrl%%/ui.iggrid#methods:unfixDataSkippedColumns) メソッドは非推奨になりました。
			</td>
            <td>
その代わりに、[fixNonDataColumns](%%jQueryApiUrl%%/ui.iggrid#methods:fixNonDataColumns) および [unfixNonDataColumns](%%jQueryApiUrl%%/ui.iggrid#methods:unfixNonDataColumns) メソッドを使用します。
			</td>
            <td>
![](images/negative.png)
			</td>
        </tr>
    </tbody>
</table>


## [igGridColumnMoving](#column-moving)

問題|説明|状態
------|-------------|-------
[IE 9 で列移動が機能しない](#column-moving-ie9)|Internet Explorer 9 では、列移動は機能しません。これは、バージョン 1.7.2 で導入されたドラッグ可能な jQuery UI のバグが原因ですが、バージョン 1.8.6 で解決されています。バグの詳細は、[jQuery UI Bug 5370](http://bugs.jqueryui.com/ticket/5370) を参照してください。 | ![](images/positive.png)
[Google Chrome で列移動が正常に動作しない](#column-moving-chrome)|バージョン 1.8.6 よりも前の jQuery UI で列移動機能を使用している場合、Google Chrome™ ではグリッドが選択されることになります。 | ![](images/positive.png)
列移動が列仮想化と機能しない | 列移動は行仮想化のみでサポートされています。 | ![](images/negative.png)



## igGrid - 複数列ヘッダー

問題|説明|状態
------|-------------|-------
複数列ヘッダー機能は [`columnVirtualization`](%%jQueryApiUrl%%/ui.iggrid#options:columnVirtualization) ではサポートされない|仮想化および複数列ヘッダー機能が有効の場合、[`rowVirtualization`](%%jQueryApiUrl%%/ui.iggrid#options:rowVirtualization) のみが統合されます。列仮想化はこのシナリオではサポートしていません。 | ![](images/negative.png)



## igGridFiltering
問題|説明|状態
------|-------------|-------
[簡易フィルタリングが列の仮想化で機能しない](#simple-filtering)|フィルター モードを「簡易」に設定すると、列の仮想化 ([columnVirtualization](%%jQueryApiUrl%%/ui.iggrid#options:columnVirtualization) = true) が機能しません。 | ![](images/positive.png)
詳細フィルタリングが、OR フィルタリング式と一緒に機能しない | oData プロトコルは OR フィルタリング式をサポートしていないため、詳細フィルタリングは AND フィルタリング式を併用した場合のみ使用できます。 | ![](images/negative.png)



## [igGridGroupBy](#groupby)


問題|説明|状態
------|-------------|-------
[グループ行の日付形式が他の行の形式と異なる](#groupby-date-format)|日付形式のデータを持つ列をグループ化する場合、グループの上部にある日付の形式 (この形式はグループ化するときに自動的に表示されます) は、列の形式と異なります。 | ![](images/positive.png)
[IE 9 でグループ化が機能しない](#groupby-ie9)|Internet Explorer 9 では、グループ化機能は動作しません。これは、バージョン 1.7.2 で導入されたドラッグ可能な jQuery UI のバグが原因ですが、バージョン 1.8.6 で解決されています。バグの詳細は、[jQuery UI Bug 5370](http://bugs.jqueryui.com/ticket/5370) を参照してください。 | ![](images/positive.png)
列をグループ化し、すべての行を折り畳んだ時に、IE 9 で行が正しく配置されない|列をグループ化し、すべての行を折り畳むと、IE 9 では行が正しく配置されません。これはブラウザーが折り畳まれた要素を固有の方法で処理するためです。 | ![](images/plannedFix.png)
[MVC でグループ化を実行する前にページング機能を定義すると、グループが不正となる](#groupby-paging-mvc)|MVC ソリューションを使用して、ページングおよびグループ化機能をともに定義する場合、グループ化機能の実行前にページングが定義されるとグループが不正になります。 | ![](images/positive.png)
IE 8 では、フィルタリング行領域が不正になる|IE 8 でグループ化とフィルタリングがともに有効な場合、フィルタリング行領域は誤ったスタイルを取得します。これは、Internet Explorer 8 のブラウザーの固有の問題です。 | ![](images/plannedFix.png)
グリッドがフィルターされていると、グループの行カウントが変更されない|グループ化機能でフィルタリングが有効な場合、グリッドをフィルタリングして行カウントが減っても、グループの行カウントは設計上、変更されません。 | ![](images/negative.png)
[リモート ページングを有効にして 3 つ以上のグループをグループ化すると、2 番目のグループの行カウントが不正になる](#multiple-groupby-remote-paging)|リモートのページングが有効な状態で、グループ化機能を使用して 3 つ以上のグループをグループ化すると、2 番目のグループは不正な行カウントを取得します。 | ![](images/negative.png)
[リモートのページングおよび集計で、レコード カウントが不正になる](#groupby-remote-paging-summaries)|グリッドのページングおよびグリッドの集計がリモートで、null 値が含まれるレコードがある場合、グループのレコード カウントが不正になります。これは値がサーバーから null 文字列として送信されるためです。 | ![](images/negative.png)
[グループ化機能で列設定を定義し、同時に継承を有効にすると、例外がスローされる](#groupby-column-settings-mvc)|グループ化機能を有効にし、その中で列設定を定義し継承を有効にすると、ページ例外がスローされます。 | ![](images/positive.png)
[列内の値はグループ化されるが、正しく表示されない](#groupby-incorrect-values)|[`autoGenerateColumns`](%%jQueryApiUrl%%/ui.iggrid#options:autoGenerateColumns) が true に設定され、列が初期化でグループ化されている場合、列の値はグループ化されますが、正しく表示されません。 | ![](images/positive.png)
[*groupedColumnsChanged* イベントの入力引数の *ui.groupedColumns* が空き状態である](#groupedColumnsChanged)|列をグループ化領域にドラッグしてグループ化した場合、[`groupedColumnsChanged`](%%jQueryApiUrl%%/ui.iggridgroupby#events:groupedColumnsChanged) イベントの `ui.groupedColumns` 入力の引数が空き状態になる場合があります。 | ![](images/positive.png)
[グループ化のモーダル ダイアログ内の igTree のタップが正しく機能しない](#groupby-dialog-tree)|Android 4.0 で、グループ化のモーダル ダイアログ内のドロップダウンをタップすると、レイアウトの問題が発生する場合があります。この問題は、ツリーが部分的に表示されており、垂直または水平スクロールを行った場合に発生します。 | ![](images/positive.png)
GroupBy 機能および連続的仮想化の使用時の制限|`igGrid` の連続的仮想化を使用してグループ化機能を有効にしている場合、垂直スクロールにより、グループが初期状態 ([`initialExpand`](%%jQueryApiUrl%%/ui.iggridgroupby#options:initialExpand) オプションに基づいて展開状態または縮小状態) に戻ります。 | ![](images/negative.png)
グループ化が固定仮想化を使用しても機能しない|`igGrid` の GroupBy 機能は、固定仮想化を使用しても機能しません。 | ![](images/negative.png)
[列を非表示にすると Firefox のグリッドが縮小する](#groupby-hide-firefox)|GroupBy 機能が有効で `igGrid` が定義された列幅を持たない場合、列を非表示にすると Firefox ブラウザーのグリッドが縮小します。 | ![](images/positive.png)
リモート グループ化がリモート ページングと正しく動作しません。 | リモート ページングおよびリモート グループ化が有効な場合、ページ カウントおよびページ サイズが正しくなくなります。| ![](images/negative.png)



## [igGridPaging](#paging)

問題|説明|状態
------|-------------|-------
[実行時にページング イベントが発生しない](#paging-events)|`igGrid` のページング イベントは、UI がページング操作をトリガーした場合のみ発生します。ページング オプションをランタイムで設定した場合は発生しません。 | ![](images/positive.png)




## [igGridResizing](#resizing)

問題|説明|状態
------|-------------|-------
[サイズ変更が、古い jQuery バージョンで機能しない](#resizing-jquery-versions)|`igGrid` のサイズ変更は、jQuery のバージョン 1.8.0 ～ 1.8.5 ではサポートされていません。 | ![](images/positive.png)
[サイズ変更が固定仮想化および列仮想化を使用した場合に機能しない](#resizing-virtualization)|固定仮想化および列 (またはどちらか)の仮想化が有効になっていると、列のサイズ変更機能は動作しません。| ![](images/positive.png)
[Firefox で列幅が設定されていないと、列のサイズ変更が正しく実行されない](#resizing-column-width-firefox)|Firefox® のバグにより、列幅が設定されていないと、`igGrid` 列を適切にサイズ変更できません。 | ![](images/negative.png)
[Firefox で適切な列幅が設定されていないと、列のサイズ変更が正しく実行されない](#resizing-column-relative-firefox)|列幅を適切なパーセント値で設定していない場合、Firefox のバグにより、`igGrid` 列のサイズを正しく変更できません。 | ![](images/positive.png)
グリッドが右側にスクロールされた場合、列のサイズ変更はより速いスピードで行います。|グリッドが右側にスクロールされ、列が右端から左へドラッグしてサイズ変更される場合、サイズ変更スピードはより速くなります。この動作はブラウザーのレイアウト エンジンによるものです。|![](images/negative.png)
[列自動サイズ調整の制限](#limitation-autosizing) | グリッドの table 要素に 'white-space: nowrap' CSS ルールが明示的に設定された長いテキストを含むグリッド列がダブルクリックで正しくサイズ変更されません。 |![](images/positive.png)


## [igGridRowSelectors](#row-selectors)

問題|説明|状態
------|-------------|-------
列仮想化で行セレクターが操作しない|列仮想化のコンテキストでは、列セレクターはサポートされません。これは今後のリリースで実装される予定です。 | ![](images/plannedFix.png)
[*igGridRowSelectors* ウィジェットでは、選択機能を有効にする必要がある](#row-selectors-selection)|`igGridRowSelectors` ウィジェットの [`requireSelection`](%%jQueryApiUrl%%/ui.iggridrowselectors#options:requireSelection) オプションは、デフォルトで true に設定されています。また行セレクターの使用に選択機能が必要なことを示す例外をスローします。 | ![](images/positive.png)
IE 9 で選択機能が正しく動作しない|Internet Explorer 9 では、テーブルが大き過ぎるとページに垂直スクロールバーが表示されますが、バーを下にスクロールすると、チェックボックスの有無に関係なく、`RowSelectors` を使用した選択が正しく動作しません。グリッドがフォーカスを得ると、Internet Explorer 9 がページを上方にスクロールして戻すため、選択は誤った行に適用される、または全く適用されません。 | ![](images/negative.png)
[選択機能を自動的に有効にできない](#row-selectors-selection-auto)|選択機能の自動有効化は機能しません。選択ウィジェットでは、`RowSelectors` に全機能を持たせる必要があります。 | ![](images/positive.png)
[「すべて選択」](igGrid-Configuring-Row-Selectors.html#select-all-pages) 機能はリモート ページング機能をサポートしません。 | [`enableSelectAllForPaging`](%%jQueryApiUrl%%/ui.iggridrowselectors#options:enableSelectAllForPaging) オプションはリモート ページングと正しく動作しません。 | ![](images/negative.png)



## [igGridSelection](#selection)

問題|説明|状態
------|-------------|-------
[iOS でのセル選択が適切に動作しない](#selection-cell-ios)|iOS で`igGrid` をスクロールする場合は、最初にセルをタップし、スクロールしたい方向にスワイプする必要があります。iOS と Android では jQuery モバイルによるスクロール イベントの処理方法が異なるため、`igGrid` のスクロール動作には違いがあります。 | ![](images/negative.png)
[連続的仮想化が有効になっている場合、行 / セルを選択すると選択が不正になる](#selection-continuous-virtualization)|連続的仮想化が有効な場合に `igGrid` の行 / セルを選択すると、jQuery バージョン 1.6.4 のバグによりグリッドがスクロール ダウンし、異なる行 / セルが選択されます。この問題は、このバージョンの jQuery ライブラリのみで発生します。 | ![](images/positive.png)
永続化を有効にし、マウスをドラッグしてセルを選択すると、間違ったセルが選択される|セルが複製される行が存在する状態で (これらの行は、視覚的に区別できません)、永続化を有効にし、マウスをドラッグしてセルを選択すると、最初の行のセルのみが選択されます。|![](images/positive.png)
[選択機能が有効な場合にテキスト選択が正しく動作しません。](#text-selection) | 選択機能が selectStart イベントをキャンセルしてグリッド内のテキスト選択を無効にするため、セル テキストは選択できません。 | ![](images/positive.png)
[IE で行を選択すると、垂直スクロールバーを持つグリッドで行が左側にスクロールされます。](#selecting-rows-ie) | IE で行を選択すると、行にフォーカスが適用され、`igGrid` が左側にスクロールされます。 | ![](images/positive.png)
列の仮想化に対して、キーボード ナビゲーションがサポートされない | 列の仮想化に対して、キーボード ナビゲーションはサポートされていません。 | ![](images/negative.png)


## [igGridSummaries](#summaries)

問題|説明|状態
------|-------------|-------
[リモート データを使用したカスタム集計の使用時の制限](#summaries-custom-remote)|ASP.NET MVC ヘルパー ラッパーは、デフォルトでカスタム サマリーを処理できません。したがって、カスタム サマリーを別に作成して、計算する必要があります。 | ![](images/positive.png)
基本の数値フォーマットのみのサポート|[`summaryFormat`](%%jQueryApiUrl%%/ui.iggridgroupby#options:summarySettings.summaryFormat) プロパティは基本の数値フォーマットのみをサポートします。たとえば、$ 0.00 のような形式は「$」記号を表示することはできません。 | ![](images/negative.png)
[カスタム メソッド設定時の制限](#summaries-custom-methods)|カスタム メソッドを設定する場合は、順序および集計オペランドの [`summaryCalculator`](%%jQueryApiUrl%%/ui.iggridsummaries#options:columnSettings.summaryOperands.summaryCalculator) オプションの設定を強く推奨します。 | ![](images/positive.png)



## [igGridTooltips](#tooltips)

問題|説明|状態
------|-------------|-------
[ポインターをセル上で移動する速度が速すぎる場合のツールチップの表示の問題](#tooltips-fast-movement)|ユーザーがコントロールでマウスを素早く動かすと、ツールチップのフェード アニメーションがツールチップを表示 / 非表示する処理速度が遅くなり、値が非常に小さい場合は表示の問題が発生することがあります。 | ![](images/positive.png)


## [igGridUpdating](#updating)

問題|説明|状態
------|-------------|-------
[更新と仮想化の機能を有効にして新しい行を追加するには、即時コミットが必要である](#updating-add-virtualization)|[autoCommit](%%jQueryApiUrl%%/ui.iggrid#options:autoCommit) を無効にして、更新と仮想化の機能を有効にした場合、新しい行の追加はサポートされません。`autoCommit` が false の場合、新たに追加された行は仮想化されません。 | ![](images/positive.png)
Excel ナビゲーション モードは、セル編集モードのみをサポートします。|[`excelNavigationMode`](%%jQueryApiUrl%%/ui.iggridupdating#options:excelNavigationMode) を有効にした場合、矢印を使用したナビゲーションは、"cell" [`editMode`](%%jQueryApiUrl%%/ui.iggridupdating#options:editMode)でのみ実行できます。.その他の編集モード (*"rowedittemplate"*、*none*、*null*) は `excelNavigationMode` でサポートされません。 | ![](images/negative.png)
グループ化されている場合に、仮想グリッドの追加および更新が機能しない|仮想グリッドの `GroupBy` および`更新`の使用で、グリッドがグループ化されている場合、行の更新または追加は機能しなくなります。グループ化を解除すると、グリッド レコードの最下部に新しいレコードが追加されます。 | ![](images/negative.png)
[[`autoCommit`](%%jQueryApiUrl%%/ui.iggrid#options:autoCommit) を無効にして、更新と連続仮想化の機能を有効にした場合、行/セルの更新はサポートされません。](#updating-edit-virtualization)|[`autoCommit`](%%jQueryApiUrl%%/ui.iggrid#options:autoCommit) グリッド オプションが false で連続仮想化が有効な場合に、更新機能で行/セルを編集すると、例外が発生されます。 | ![](images/positive.png)
仮想化が有効な場合、編集モードでキーボード ナビゲーションによる折り返しができない。 | 仮想化が有効な場合、編集モードが cell の場合に Tab/Shift+Tab および編集モードが row の場合、Enter/Shift+Enter のキーボード ナビゲーションで折り返ができません。最後の行/セルから次の行/セルに移動した際に、最初の行/セルが編集モードに入りません。最初の行/セルから以前の行/セルに移動した際に、最後の行/セルが編集モードに入りません。 | ![](images/negative.png)
列の仮想化に対して、キーボード ナビゲーションがサポートされない | 列の仮想化に対して、キーボード ナビゲーションはサポートされていません。 | ![](images/negative.png)
[jQuery 3.2.1 および IE 11 で新規行のエディターの高さが正しくありません。](#updating-new-row-editors) | jQuery 3.2.1 を使用する場合、IE11 で新規行のエディターを使用できません | ![](images/positive.png)

## igGridHiding

問題 | 説明 | 状態
---|---|---
MultiColumnHeaders がある場合、列非表示インジケーターが正しく表示されません。| ルート ヘッダー要素を非表示の場合、非表示インジケーターが他の表示列グループの下に表示されるため、非表示列がそのグループに属しているような誤解を招く可能性があります。| ![](images/negative.png)

##  <a id="feature-chooser"></a> 機能セレクター

問題|説明|状態
------|-------------|-------
機能またはそのオプションのいずれかが初期化の後に変更された場合、変更は機能セレクターで表示されません。|機能セレクターは初期化で一度に描画され、後に機能が変更されても、影響されません。|![](images/negative.png)

## <a id="grid-general"></a> igGrid - 全般

### <a id="column-caption-wrap"></a> 列のキャプションが、複数の行にラップされない

列キャプション (igGrid.[`headerText`](%%jQueryApiUrl%%/ui.iggrid#options:columns.headerText)) は、複数の行にラップされません。この重大な変更は、複数の機能が有効の場合、テキストとアイコンの配置および外観を向上するために変更しました。

> **回避方法**
> 
> キャプションを繰り返すために、グリッドが初期化される場所に次のスタイルをページに追加します。

**CSS の場合:**

```css
.ui-iggrid th, .ui-iggrid th.ui-state-default, .ui-iggrid th.ui-state-hover, .ui-iggrid th.ui-state-active {
     text-align:left;
     white-space: pre-wrap;
 }
```

### <a id="touch-scroll"></a> タッチ ポイントを特定の UI 要素の上をスライドする時に、動作が一致しない

タッチ ポイントが特定の UI 要素の上をスライドする時に、グリッドと機能の動作が一致しない場合があります。

> **回避方法**
> 
> スライドが正しい UI 要素上をスクロールするよう *js\modules\infragistics.ui.scroll.js* ファイルを明示的に参照する必要があります。

### <a id="column-width"></a> 混在 / 部分の列幅の設定がサポートされない

一部の列幅をパーセント値で定義し、その他の列幅をピクセルで定義する (または列幅を定義しない) という状態はサポートされません。

> **回避方法**
> 
> すべての列幅を同じ単位 (パーセンテージ値またはピクセル値) で定義してください。

### <a id="header-footer-ie7"></a> IE 7 で、グリッドのヘッダーとフッターが正しく描画されない

グリッド コントロールに幅が定義されていない場合、Microsoft Internet Explorer 7 では、コントロールのヘッダー/フッター要素 (キャプション、ページャー、グループ化領域など) がレコード テーブルよりも小さい幅で描画されます。

> **回避方法**
> 
> グリッドの幅は明示的に定義できます。

### <a id="div-element-api"></a> <div> 要素で、グリッド機能の API 呼び出しが正しく動作しない

グリッドのインスタンスを <div> 要素から作成した場合、グリッドの機能に対する API 呼び出しが期待どおりに機能しません。

> **回避方法 1**
> 
> `<table>` 要素 (`<div>` の代わりに) をグリッドの基本要素として使用してください。これが最適な解決策です。


> **回避方法 2** 
> 
> グリッドの基本要素として `<div>` 要素を使用する必要がある場合、この回避策を使用します。グリッドの機能 API への呼び出しがアタッチされているテーブルの依存関係があります: `[gridElementId]_table`。グリッドが `<div>` 要素にバインドされていて、その `id` 属性が「grid1」に設定されているものとした場合、そのテーブルを参照する最も簡単な方法は、以下に示すような形でグリッドの [`id()`](%%jQueryApiUrl%%/ui.iggrid#methods:id) または [`widget()`](%%jQueryApiUrl%%/ui.iggrid#methods:widget) API メソッドを使用することです。

**JavaScript の場合:**

```js
$("#" + $("#grid1").igGrid("id")).igGridPaging("option", "pageSize", 2)
```

**JavaScript の場合:**

```js
$("#grid1").igGrid("widget").igGridPaging("option", "pageSize", 10)
```

### <a id="dialogs-android"></a> Android 4.0.2 で、レコードの背後にダイアログ / ポップアップが表示される

igGrid の垂直スクロールを有効にして、`igGrid` を Android のバージョン 4.0.2 で実行している場合、ポップアップ / ダイアログはすべてレコードの背後に表示されます。これは、インデックスまたは CSS 規則として設定したものに関係なく、別のスクロール可能な `<div>` に配置されたすべての HTML `<div>` 要素は実際、スクロール可能な `<div>` の背後に描画されるという事実によるものです。

> **回避方法** 
> 
> Modernizr JavaScript ライブラリの最新の安定したバージョンを参照し、Infragistics `igScroll`™ ウィジェットを使用します。

### <a id="showHeader"></a> *showHeader* オプションが正しく動作しない

グリッドの初期化で [`showHeader`](%%jQueryApiUrl%%/ui.iggrid#options:showHeader) オプションが false に設定されている場合、API を使用してそれを true のランタイムに設定すると、ヘッダーが表示されません。

> **回避方法** 
> 
> `showHeader` オプションを true に設定し、rendered イベントで API を使用して非表示します。ヘッダーが DOM 構造に追加されることを実行します。ランタイムにヘッダーを表示するために API を使用します。

**JavaScript の場合:**

```js
$("#grid1").on("iggridrendered", function (evt, ui) {
  if (ui.owner.dataSource.dataView().length === 0) {
    ui.owner._setOption("showHeader", false);
  }
});
//At runtime use the following code to show the header:
$("#grid1").igGrid("option", "showHeader", true);
```

### <a id="scrollbar-mac"></a> Mac OS での水平スクロールバーの表示の問題

Mac OS で、**Show scrollbars only when scrolling** オプションを true に設定した場合、グリッドの水平スクロールバーは表示されません。これは、グリッドの水平スクロールバーで、overflow が hidden に設定されているためです。

> **回避方法** 
> 
> スクロールバーを表示するためにスクロールバーのクラスをオーバーライドできます。以下は、オーバーライドする方法の例です。

**CSS の場合:**

```css
::-webkit-scrollbar {
    width:16px;
}
::-webkit-scrollbar-track {
    -webkit-border-radius:5px;
    border-radius:5px;
    background:rgba(0,0,0,0.1);
}

::-webkit-scrollbar-thumb {
    -webkit-border-radius:5px;
    border-radius:5px;
    background:rgba(0,0,0,0.2);
}

::-webkit-scrollbar-thumb:hover {
    background:rgba(0,0,0,0.4);
}

::-webkit-scrollbar-thumb:window-inactive {
    background:rgba(0,0,0,0.05);
}
```

### <a id="checkbox-template"></a> チェックボックスの表示が、テンプレート (行および列) と一致しない

行/列テンプレートを使用している場合、`renderCheckboxes` オプションを *true* に設定していても、ブール値の列にテンプレートが定義されているかどうかをチェックできないため、ブール値の列にはチェックボックスが表示されません。

> **回避方法** 
> 
> ブール値の列にチェックボックスを表示するには、表示されるテンプレート内で `<input type='checkbox'/>` を使用します。以下はテンプレートの例です。

**HTML の場合:**

```html
<input type="checkbox" {{if ${MakeFlag} === "true"}} checked="checked" {{/if}} disabled="disabled">
```

### <a id="knockout-observable-array"></a> KnockoutJS の監視可能な配列機能が制限される

`unshift`、`reverse`、および `sort` の監視可能な配列機能を使用すると、グリッドのビジュアル外観が誤って表示されます。

-   `unshift` - 新しい行がグリッドの終了に追加されます。
-   `reverse` - 代替行スタイルを中止します。
-   `sort` - 代替行スタイルを中止します。

> **回避方法** 
> 
> [`dataBind`](%%jQueryApiUrl%%/ui.iggrid#methods:dataBind) メソッドを呼び出すと、行を正しい順序で描画します。

### <a id="edge-vertical-scrollbar"></a> 水平スクロールバーで仮想化していないグリッドの終了までスクロール後、垂直スクロールバーで垂直方向にスクロールする動作は、 Edge ブラウザーで正しく機能しません。

ブラウザーのデフォルト垂直スクロールバーが水平スクロールバーが右端にある場合に正しく動作しません。igGrid のスクロール領域で非表示のオーバーフローがある場合のサードパーティー (Microsoft) による問題です。

> **回避方法** 
> 
> igGrid の連続仮想化がグリッドのスクロールバーで完全にカスタムなスクロール動作を使用するため、この機能を有効にします。

## <a id="data-binding"></a> igGrid - データ バインディング

### <a id="datatable-remote-operations"></a> データ テーブル / セットへのバインドで、リモートのフィルタリング、並べ替え、集計、およびグループ化がサポートされない

グリッドを `DataTable` または `DataSet` にバインドしている場合、並び替え、フィルタリング、集計、およびグループ化機能のローカル構成を使用する可能性がありますが、並び替えとフィルタリングでは、リモート構成の回避策が利用できます。 

> **回避方法** 
> 
> リモートの並べ替えおよびフィルター処理は、要求を処理してから、データを返す前にサーバーでフィルタリングまたは並べ替えを実行すると実装できます。

要求を処理し、データを返す前に `DataTable` レベルでデータの並べ替え、およびリモート*並べ替え*を実装する方法の詳細については、「[`DataTable のバインド`](iggrid-binding-to-datatable.html#dataTable_example)」サンプルを参照してください。



## <a id="unbound-columns"></a> igGrid - 非バインド列

### <a id="unbound-remote-operations"></a> 非バインド列ではリモートのフィルタリング、並べ替え、およびグループ化がサポートされない

非バインド列列では、並び替え、フィルタリング、および Group By 機能をサポートしていません。[`Columns`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~Columns.html) コレクションに含まれる非バインド列では、上記の機能は無効です。

> **回避方法** 
> 
> 非バインド列が定義される場合、並べ替え、フィルタリング、グループ化機能のためにローカル構成を使用します。

### <a id="SetUnboundValues"></a> グリッド MVC ヘルパーのグリッド SetUnboundValues(&lt;列キー&gt;, &lt;値のディクショナリ&gt;) メソッド オーバーロードにはプライマリ キーが必要とされる

グリッド MVC ヘルパーのグリッド [`SetUnboundValues(<列キー>, <値のディクショナリ>)`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~SetUnboundValues.html) メソッド オーバーロードにはプライマリ キーが必要とされるこのオーバーロードは、プライマリ キーに関するパラメーターと、プライマリ キーおよび非バインド値ペアのディクショナリーに関するパラメーターを備えています。ディクショナリーに含まれるプライマリ キーは、グリッド内の行のプライマリ キーであり、非バインド値は、その列キーに一致するキーを持つ非バインド列内に設定されることになる値です。

> **回避方法** 
> 
> プライマリ キーが定義されていない場合は、`SetUnboundValues (<列キー>, <値のリスト>)` というメソッド オーバーロードを使用します。

### <a id="unbound-mvc-helper"></a> ビュー内でのグリッド ヘルパーの使用に制限がある

データ ソースがリモートにあり、[`MergeUnboundColumns`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~MergeUnboundColumns.html) が true に設定されている場合、View でグリッド ヘルパーを使用できないデータ ソースがリモートにあり、`MergeUnboundColumns` プロパティが true に設定されている場合、ASP.NET MVC ビューの内部ではグリッド ヘルパーが使用できないようになっています。

チェーン処理を介して設定できるオプションがいくつかありますが、リモート要求が実行される場合、こうしたオプションは、その要求に設定されている既定値にリセットされます。

### <a id="unboundValues-remote-paging"></a> リモート ページングと *unboundValues* が使用されている場合、非バインド列の値は更新されません。

グリッドは、リモートのページングを有効にしたクライアント上で [`unboundValues`](%%jQueryApiUrl%%/ui.iggrid#options:columns.unboundValues) を設定している場合に、非バインド列に対して同じ値を表示します。この場合、グリッドが再バインドするときに、新しい設定を再適用します。したがって、新しいページにナビゲートすると同じ値が表示されます。これは、サーバーが現在のページに対して結果のみを返す場合の標準ビヘイビアーです。

### <a id="unbound-formulas"></a> 非バインド列の中で数式の使用に制限がある

[`MergeUnboundColumns`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~MergeUnboundColumns.html) オプションが true に設定されている場合、`igGrid` の非バインド列で数式を使用することはできません。

> **回避方法** 
> 
> この問題は、[`dataBound`](%%jQueryApiUrl%%/ui.iggrid#events:dataBound) クライアント側イベントを使用すれば回避できます。非バインド列は、データ ソース内の data() 配列の一部として `dataBound` イベント ハンドラーに渡されます。この `dataBound` クライアント側イベントは、グリッドが表示される前に処理することができ、また、その値はクライアント側からデータ ソースに手動で追加できます。したがって、非バインド列には、他の現在行データや別の列値に基づいてアクセスすることやデータを入力することできます。

**JavaScript の場合:**

```js
$("#grid1").live("iggriddatabound", function (event, ui) {
            var i, grid = ui.owner,
                ds = grid.dataSource,
                data = ds.data(),
                dsLength = data.length;
            for (i = 0; i < dsLength; i++) {
              data[i]["UnboundColumn1"] = 
                data[i]["UnitPrice"] * data[i]["UnitsInStock"];              
            }
 });
```

### <a id="unbound-CRUD"></a> グリッド コントロールで非バインド データ値が自動的に保持されない

非バインド値の含まれる行を編集してコミットし、そのあとでグリッドをバインドし直した場合、変更内容は保持されません。

> **回避方法** 
> 
> CRUD 操作の実行中、非バインド列はトランザクションの中に含まれ、*更新*されることになります。非バインド列はデータ ソース内のデータ配列の一部であるため、アプリケーションは、トランザクションがデータ ソースにコミットされる前に、こうした列が基本データ ソース内に存在するかどうかをチェックする必要があります。

### <a id="boolean-unbound-remote"></a> リモート データを使用している時、ブール値の非バインド列が間違って生成される

[`MergeUnboundColumns`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~MergeUnboundColumns.html) プロパティを *false* に設定した状態で、リモート データを使用すると、ブール値の非バインド列には *false* が入力されます。

> **回避方法** 
> 
> サーバー上ですべてのブール値行の値を明示的に設定します。

### <a id="unbound-persisting-state"></a> 並べ替え、フィルタリング、グループ化の状態は永続化されません

並べ替え、フィルタリング、および GroupBy は、非バインド列に適用すると、その状態を保持しません。機能の永続化が有効 (デフォルト) で、非バインド列がグループ化/並べ替え/フィルターされた場合、`igGrid` の  `dataBind()` を起動した後:

- ***GroupBy*** - 列はグループ化されません

- **Filtering** - 非バインド列のフィルタリング式がクリアされます

- **Sorting** - 非バインド列に適用された並べ替えが削除されます

> **回避方法** 
> 
> 1.すべての非バインド列の場合、`dataBind()` を起動する前にフィルター式、グループ化された列、並べ替えた列を保存します。

2. `dataBound` イベントの後 (`dataRendered` イベントなどで) 機能の API メソッドで列設定/式を適用します。


## <a id="virtualization"></a> igGridVirtualization

### <a id="fixed-virtualization"></a> 固定仮想化は RWD モードでサポートされていません

固定仮想化は、行の高さが定数であることが必要です。行の高さが変更する場合、固定仮想化は正しく操作しません。RWD モードは、画面サイズによって行の高さを変更するため、固定仮想化は正しく動作しません。

>**回避方法 1**: 連続仮想化を使用します。行の高さが動的にサイズ変更されるシナリオで操作します。

>**回避方法 2**: 動的にサイズ変更すると、行の高さが変更されないことを確認するセルのスタイル設定を適用します。たとえば、テキストの長さが行の高さに影響しないために、セルに “white-space:nowrap” を適用します。

**HTML の場合:**
```html
<style> 
.ui-iggrid-record > tr > td
{ 
  white-space:nowrap; 
} 
</style> 
```

## <a id="column-fixing"></a> igGridColumnFixing

### <a id="misalignment-ie9"></a> IE9+ で行の固定部分および固定解除部分の配置が正しくない

IE 9 以降で、`igGrid` で列を固定し、グリッドの中央へスクロールすると、行の固定部分と固定解除部分との間に不整合が発生します。

> **回避方法** 
> 
> 行で TD 要素の高さを設定し、パフォーマンスの問題のために [`syncRowHeights`](%%jQueryApiUrl%%/ui.iggridcolumnfixing#options:syncRowHeights) を false に設定します。

**HTML の場合:**

```html
<style> 
	#grid1 tbody tr td, 
	#grid1_fixed tbody tr td {    
		height: 100px !important; 
	} 
</style> 
```


## <a id="column-moving"></a> igGridColumnMoving

### <a id="column-moving-ie9"></a> IE 9 で列移動が機能しない

これは、バージョン 1.7.2 で導入されたドラッグ可能な jQuery UI のバグが原因ですが、バージョン 1.8.6 で解決されています。バグの詳細は、[jQuery UI Bug 5370](http://bugs.jqueryui.com/ticket/5370) を参照してください。

> **回避方法** 
> 
> jQuery バージョン 1.8.6 以降を使用します。

### <a id="column-moving-chrome"></a> Google Chrome で列移動が正常に動作しない

バージョン 1.8.6 よりも前の jQuery UI で列移動機能を使用している場合、Google Chrome ではグリッドが選択されることになります。

> **回避方法** 
> 
> jQuery バージョン 1.8.6 以降を使用します。

## igGridFiltering
### <a id="simple-filtering"></a> 簡易フィルタリングが列の仮想化で機能しない

>**回避方法**: 列の仮想化とともに高度なフィルター処理 ([モード](%%jQueryApiUrl%%/ui.iggridfiltering#options:mode)を "advanced" に設定) を使用します。


## <a id="groupby"></a> igGridGroupBy

### <a id="groupby-date-format"></a> グループ行の日付形式が他の行の形式と異なる

グループ化の場合、グループ行の日付形式が行の形式と異なる日付形式のデータを持つ列をグループ化する場合、グループの上部にある日付の形式 (この形式はグループ化するときに自動的に表示されます) は、列の形式と異なります。

> **回避方法** 
> 
> 日付列の関数を使用してカスタム グループを実装した場合、またはグループ化された行のカスタム名を使用した場合、形式を変更し、それを行形式に一致させることができます。

### <a id="groupby-ie9"></a> IE 9 でグループ化が機能しない

これは、バージョン 1.7.2 で導入されるドラッグ可能な jQuery UI バグにより引き起こされます。詳細は、[jQuery UI バグ 5370](http://bugs.jqueryui.com/ticket/5370)を参照してください。

> **回避方法** 
> 
> jQuery バージョン 1.8.6 以降を使用します。

### <a id="groupby-paging-mvc"></a> MVC でグループ化を実行する前にページング機能を定義すると、グループが不正となる

MVC ソリューションを使用して、ページングおよびグループ化機能をともに定義する場合、グループ化機能の実行前にページングが定義されるとグループが不正になります。

> **回避方法** 
> 
> ASP.NET MVC ソリューションで機能を定義する時は、ページングの前にグループ化を設定します。

### <a id="multiple-groupby-remote-paging"></a> リモート ページングを有効にして 3 つ以上のグループをグループ化すると、2 番目のグループの行カウントが不正になる

リモート ページングが有効な状態で、グループ化機能を使用して 3 つ以上のグループをグループ化すると、2 番目のグループが不正な行カウントを取得します。

これが発生するのは、サーバーが送信するグループの順序をサーバー自身が知らないためです。サーバーは、グループ化または深度レベルの情報なしに、単に個々の値のカウントをクライアントに送信します。

### <a id="groupby-remote-paging-summaries"></a> リモートのページングおよび集計で、レコード カウントが不正になる

グリッドのページングおよびグリッドの集計がリモートで、null 値が含まれるレコードがある場合、グループのレコード カウントが不正になります。これは値がサーバーから null 文字列として送信されるためです。

これは、null 値が JSON 形式でラップされると、その値は引用符で囲まれる (`"null"`) ためです。それ以外の場合、これはクライアント上で正しく解析することができません。ただし、この要件によって、`"null"`  を実際の null 値から区別することができなくなります。

### <a id="groupby-column-settings-mvc"></a> グループ化機能で列設定を定義し、同時に継承を有効にすると、例外がスローされる

グループ化機能が列設定を定義し、同時に継承を有効にすると、例外がスローされるこの問題は、MVC View ページでチェーン化アプローチを用いるグリッドを持つ MVC ソリューション内で発生します。グループ化機能を有効にし、その中で列設定を定義し継承を有効にすると、ページ例外がスローされます。

> **回避方法** 
> 
> 列設定を定義し、グループ化機能で継承を有効にする代わりに、グループ化機能で継承を無効にしてから各子レイアウト内で同じグループ化設定を手動で定義します。

### <a id="groupby-incorrect-values"></a> 列内の値はグループ化されるが、正しく表示されない

[`autoGenerateColumns`](%%jQueryApiUrl%%/ui.iggrid#options:autoGenerateColumns) が true (明示的またはデフォルトで) に設定されており、列が初期化でグループ化されている場合、列の値はグループ化されますが、正しく表示されません。

> **回避方法** 
> 
> 自動生成列の使用に対して列を定義すると、グループ化が正しく動作します。

### <a id="groupedColumnsChanged"></a> *groupedColumnsChanged* イベントの入力引数の *ui.groupedColumns* が空き状態である

列をグループ化領域にドラッグしてグループ化した場合、[`groupedColumnsChanged`](%%jQueryApiUrl%%/ui.iggridgroupby#events:groupedColumnsChanged) イベントの `ui.groupedColumns` 入力の引数が空き状態になる場合があります。

> **回避方法** 
> 
> `ui.groupedColumns` 配列は、ルート レベルのグループ化した列のみ表示します (グループ化によるフラット グリッドにおけるフラット グリッドとして振る舞うかのように)。グループ化されている列をすべて取得したい場合には、API の [`groupByColumns()`](%%jQueryApiUrl%%/ui.iggridgroupby#methods:groupByColumns) 関数を使用してください。この関数では、すべての子グリッドが再帰的に走査され、グループ化されている列がすべてのレイアウトについて集計されます。

### <a id="groupby-dialog-tree"></a> グループ化のモーダル ダイアログ内の igTree のタップが Android 4.0 で正しく機能しない

Android 4.0 で、グループ化のモーダル ダイアログ内のドロップダウンをタップすると、レイアウトの問題が発生する場合があります。これは以下のいずれかになります。

-   ドロップダウンの縮小
-   ドロップ ダウンから子レイアウトを選択しても、列がまだルート列にある
-   クリックすると、グループ化のモーダル ダイアログが消えることで、モーダル ダイアログを操作する代わりグリッド自体に影響します。

この問題は、Android OS の最近変更によって生じます。この問題は、ツリーが部分的に表示されており、垂直または水平スクロールを行った場合に発生します。

> **回避方法** 
> 
> [`modalDialogDropDownWidth`](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogDropDownWidth) および [`modalDialogDropDownAreaWidth`](%%jQueryApiUrl%%/ui.iggridgroupby#options:modalDialogDropDownAreaWidth) を、レイアウト ツリー全体を表示できる値に設定することです。その他のオプションは、すべての値を null に設定することです。

### <a id="groupby-hide-firefox"></a> 列を非表示にすると Firefox のグリッドが縮小する

グループ化機能が有効で、`igGrid` の列幅が定義されていない場合、Firefox ブラウザーで列を非表示すると、グリッドのサイズが少し減らされます。 

列選択が使用で、グループ化機能が有効の場合に同じ問題があります。

> **回避方法** 
> 
> コンテナーを非表示して、表示します。

**JavaScript の場合:**

```js
var gridInstance = ("#grid1").data('igGrid');gridInstance.container().hide();setTimeout(function () {   gridInstance.container().show();}, 0);
```



## <a id="paging"></a> igGridPaging

### <a id="paging-events"></a> 実行時にページング イベントが発生しない

`igGrid` のページング イベントは、UI がページング操作をトリガーした場合のみ発生します。ページング オプションをランタイムで設定した場合は発生しません。

> **回避方法** 
> 
> ページング イベントが発生したときに使用されるハンドラー関数を作成します。コードでページング オプションを変更する場合、イベントが実行するアクションも合わせて実行するために、ハンドラー関数を明示的に呼び出します。



## <a id="resizing"></a> igGridResizing

### <a id="resizing-jquery-versions"></a> サイズ変更が、古い jQuery バージョンで機能しない

`igGrid` のサイズ変更は、jQuery のバージョン 1.8.0 ～ 1.8.5 で正しく操作しません。 

> **回避方法** 
> 
> バージョン 1.8.0 - 1.8.5 以外の jQuery UI を使用してください。

### <a id="resizing-virtualization"></a> サイズ変更が固定仮想化を使用しても機能しない

固定仮想化が有効になっていると、列のサイズ変更機能は動作しません。

> **回避方法** 
> 
> サイズ変更が固定仮想化と操作しないですが、連続仮想化と操作します。

### <a id="resizing-column-width-firefox"></a> Firefox で列幅が設定されていないと、列のサイズ変更が正しく実行されない

列幅を設定していない場合、Firefox のバグにより、igGrid の列のサイズを正しく変更できません。これは、<colgroup> に含まれる 2 番目の <col> 要素のサイズを変更しようとした場合に発生する問題です。この Firefox のバグに関する詳細情報は、バグ [スレッド](https://bugzilla.mozilla.org/show_bug.cgi?id=741370) を参照してください。

### <a id="resizing-column-relative-firefox"></a> Firefox で適切な列幅が設定されていないと、列のサイズ変更が正しく実行されない

列幅を適切なパーセント値で設定していない場合、Firefox ブラウザーのバグにより、`igGrid` 列のサイズを正しく変更できません。これは、`<colgroup>` に含まれる 2 番目の `<col>` 要素のサイズを変更しようとした場合に発生する問題です。Firefox のバグに関する詳細情報は、バグ [スレッド](https://bugzilla.mozilla.org/show_bug.cgi?id=741370)を参照してください。

テーブルのサイズを変更する前に、グリッド テーブル コンテナーの高さ値を削除しておく必要があります。サイズ変更の完了後は、その高さ値を復元する必要があります。

### <a id="limitation-autosizing"></a> 列自動サイズ調整の制限

グリッドの table 要素に 'white-space: nowrap' CSS ルールが明示的に設定された長いテキストを含むグリッド列がダブルクリックで正しくサイズ変更されません。

> **回避方法** 
> 
> CSS でより包括的なセレクターを指定できます。また列が自動生成されない場合は、相対する列に `columnCssClass` オプションを設定できます。

**CSS の場合:** 
```css
tr td { white-space: nowrap; }
```

## <a id="row-selectors"></a> igGridRowSelectors

### <a id="row-selectors-selection"></a> igGridRowSelectors ウィジェットでは、選択機能を有効にする必要がある

[`requireSelection`](%%jQueryApiUrl%%/ui.iggridrowselectors#options:requireSelection)
`igGridRowSelectors` ウィジェットの requireSelection オプションは、デフォルトで true に設定されています。また行セレクターの使用に選択機能が必要なことを示す例外をスローします。

> **回避方法** 
> 
> 行セレクターの設定で選択機能を有効にすることを推奨します。行の番号付けに選択機能が有効である必要はありません。この機能を選択機能を有効にせずに使用するには、`requireSelection`オプションを *false* に設定し、`igGridRowSelectors` ウィジェットが例外をスローするのを防止します。

### <a id="row-selectors-selection-auto"></a> 選択機能を自動的に有効にできない

選択機能の自動有効化は機能しません。選択ウィジェットでは、RowSelectors に全機能を持たせる必要があります。([igGridRowSelectors ウィジェットでは、選択機能を有効にする](#row-selectors-selection)を参照)このウィジェットがないと、行セレクターの特定の機能 (チェックボックスの選択など) が利用できない、または部分的にしか利用できません。RowSelectors は選択を自動的に有効にしません。

> **回避方法** 
> 
> RowSelectors を使用する時は、選択機能が有効になっていることを確認してください。



## <a id="selection"></a> igGridSelection

### <a id="selection-cell-ios"></a> セル選択が iOS で正しく動作しない

iOS で`igGrid` をスクロールする場合は、最初にセルをタップし、スクロールしたい方向にスワイプする必要があります。iOS における場合と Android における場合では、jQuery モバイルによるスクロール イベントの処理方法が異なるため、`igGrid` のスクロール動作には違いがあります。

-   iOS では、いったんセルを選択すると、その選択を解除できません。
-   Android では、`igGrid` をスワイプしているときにはどのセルも選択されていない状態になります。

### <a id="selection-continuous-virtualization"></a> jQuery 1.6.4 の連続仮想化で無効な行/セルを選択

連続的仮想化が有効な場合に `igGrid` の行 / セルを選択すると、jQuery バージョン 1.6.4 のバグによりグリッドがスクロール ダウンし、異なる行 / セルが選択されます。
この問題は、このバージョンの jQuery ライブラリのみで発生します。

> **回避方法** 
> 
> 1.6.4 以外のバージョンの jQuery ライブラリを使用してください。

### <a id="text-selection"></a> 選択機能が有効な場合にテキスト選択が正しく動作しません。
 
選択機能が selectStart イベントをキャンセルしてグリッド内のテキスト選択を無効にするため、セル テキストは選択できません。
cell 選択モードの場合、以下の回避策を使用できます。
 
> **回避方法** 
> 
> グリッドより最も近い親で selectstart イベントを処理し、伝達を中止します。グリッドはイベントを受信しないため、キャンセルしません。
 
**JavaScript の場合:**
 
```js
 $("#grid td").on("selectstart",
 function (e) {
 e.stopPropagation();
 }
```
この回避策は、選択状態で行全体がフォーカスされるカスタム ロジックがある場合に適用できません。この場合、セルにフォーカスできません。テキスト選択がフォーカスされた要素に基づくため、セルのテキストが選択できなくなります。

### 永続化を有効にし、マウスをドラッグしてセルを選択すると、間違ったセルが選択される

セルが複製される行が存在する状態で (これらの行は、視覚的に区別できません)、永続化を有効にし、マウスをドラッグしてセルを選択すると、最初の行のセルのみが選択されます。

>**回避方法**: 永続化を false に設定します。

### <a id="selecting-rows-ie"></a> IE で行を選択すると、垂直スクロールバーを持つグリッドで行が左側にスクロールされます。

IE で行を選択すると、行にフォーカスが適用され、`igGrid` が左側にスクロールされます。

> **回避方法 1** 
> 
> アクティブ化を解除します (注: 選択機能のキーボード ナビゲーションも解除します)。

> **回避方法 2** 
> 
> 選択モードを "cell" に設定します。

## <a id="summaries"></a> igGridSummaries

### <a id="summaries-custom-remote"></a> リモート データを使用したカスタム集計の使用時の制限

ASP.NET MVC ヘルパー ラッパーは、デフォルトでカスタム サマリーを処理できません。
したがって、カスタム サマリーを別に作成して、計算する必要があります。

> **回避方法** 
> 
> 適切なイベントにフック ([`summariesCalculating`](%%jQueryApiUrl%%/ui.iggridsummaries#events:summariesCalculating) イベントにフックすることを推奨します) し、サーバーからサマリーをリクエストするカスタム ロジックを使用します。

### <a id="summaries-custom-methods"></a> カスタム メソッド設定時の制限

カスタム メソッドを設定する場合は、順序および集計オペランドの [`summaryCalculator`](%%jQueryApiUrl%%/ui.iggridsummaries#options:summaryCalculator) オプションの設定を強く推奨します。順序を定義しないと、集計計算式は期待通りに動作しません - ドロップダウンおよび集計内の summary オペランドの順序が異なる場合があります。[`summaryOperand`](%%jQueryApiUrl%%/ui.iggridsummaries#options:summaryOperand) をカスタム タイプに設定し、[`customCalculator`](%%jQueryApiUrl%%/ui.iggridsummaries#options:customCalculator) を設定しない場合、`summaryOperand` は集計結果にもドロップダウンにも表示されません。



## <a id="tooltips"></a> igGridTooltips

### <a id="tooltips-fast-movement"></a> ポインターをセル上で移動する速度が速すぎる場合のツールチップの表示の問題

ユーザーがコントロールでマウスを素早く動かすと、ツールチップのフェード アニメーションがツールチップを表示 / 非表示する処理速度が遅くなり、値が非常に小さい場合は表示の問題が発生することがあります。

これらの問題は、以下の条件の両方が満たされた場合に発生します。

-   [`fadeTimespan`](%%jQueryApiUrl%%/ui.iggridtooltips#options:fadeTimespan) 値は [`showDelay`](%%jQueryApiUrl%%/ui.iggridtooltips#options:showDelay) または [`hideDelay`](%%jQueryApiUrl%%/ui.iggridtooltips#options:hideDelay) より大きいです。
-   [`showDelay`](%%jQueryApiUrl%%/ui.iggridtooltips#options:showDelay) および [`hideDelay`](%%jQueryApiUrl%%/ui.iggridtooltips#options:hideDelay) 値が 200 ミリ秒より小さいです。

> **回避方法** 
> 
> この問題を防ぐには、以下のいずれかを行います。
> - `fadeTimeout` を `showDelay` および `hideDelay` の値より小さい値に設定します。
> - `showDelay` および `hideDelay` を 200 ミリ秒より大きい値に設定します。



## <a id="updating"></a> igGridUpdating

### <a id="updating-add-virtualization"></a> 更新と仮想化の機能を有効にして新しい行を追加するには、即時コミットが必要である

[`autoCommit`](%%jQueryApiUrl%%/ui.iggrid#options:autoCommit) を無効にして、更新と仮想化の機能を有効にした場合、新しい行の追加はサポートされません。`autoCommit` = false の場合、トランザクションは保留トランザクション ログに保持されます。コミットされるまで仮想化機能で表示されません。新規追加行は、新しいデータ群が仮想化機能によって読み込まれるまで、ユーザーに表示されません。

> **回避方法** 
> 
> `autoCommit` は true に設定されます。または、新規の追加行は直ちにコミットする必要があります。

### <a id="updating-tempalte-attributes"></a> &lt;td&gt; タグ属性を含む列テンプレートが、行の更新で無視される

行の更新で、`igGrid`  は TD 要素に内部に適用されるスタイルまたは属性が保存されるために TD タグのコンテンツのみを正しく変更します。

> **回避方法 1** 
> 
> 新しい値でテンプレートを再実行するには、テンプレートされた要素は `<td>` タグのコンテンツである必要があります。

> **回避方法 2** 
> 
> `dataBind()` メソッドを呼び出すと、列に適用されるテンプレート化を再実行します。

### <a id="updating-edit-virtualization"></a> [`autoCommit`](%%jQueryApiUrl%%/ui.iggrid#options:autoCommit) を無効にして、更新と連続仮想化の機能を有効にした場合、行/セルの更新はサポートされません。
[`autoCommit`](%%jQueryApiUrl%%/ui.iggrid#options:autoCommit) グリッド オプションが false で連続仮想化が有効な場合に、更新機能で行/セルを編集すると、例外が発生されます。

> **回避方法** 
> 
> `autoCommit` オプションを true に設定します。

### <a id="updating-new-row-editors"></a> jQuery 3.2.1 および IE 11 で新規行のエディターの高さが正しくありません

jQuery 3.2.1 は IE11 でエディターが小さく描画されて利用できない新規行のエディターの無効な高さを通知します。

> **回避方法** 
> 
> その他の jQuery バージョンにこの問題はありません。

## 関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igGrid](igGrid.html) - このグループ トピックは、`igGrid` コントロールの機能について説明します。