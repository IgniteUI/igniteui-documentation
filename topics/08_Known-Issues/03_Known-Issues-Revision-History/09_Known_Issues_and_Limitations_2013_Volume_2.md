<!--
|metadata|
{
    "fileName": "known-issues-and-limitations-2013-volume-2",
    "controlName": "",
    "tags": ["Breaking Changes","Known Issues"]
}
|metadata|
-->

# 2013 Volume 2 の既知の問題と制限

## トピックの概要

### 目的

以下に、%%ProductName%%™ 2013 Volume 2 リリースの既知の問題と制限事項の概要を示します。旧リリースに関する情報は、[こちら](Known-Issues-Revision-History.html)です。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**既知の問題点と制限の概要**](#summary)
    -   [エディターの一般的な既知の問題点](#editors)
    -   [igBulletGraph](#bullet-graph)
    -   [igCombo](#combo)
    -   [igDataChart](#data-chart)
    -   [igDialog](#dialog)
    -   [igGrid - 全般](#grid)
    -   [igGrid - データ バインディング](#grid-data-binding)
    -   [igGrid - 非バインド列](#grid-unbound-columns)
    -   [igGrid - 仮想化](#grid-virtualization)
    -   [igGridColumnFixing](#grid-column-fixing)
    -   [igGridColumnMoving](#grid-column-moving)
    -   [igGrid - 複数列ヘッダー](#grid-multi-column-headers)
    -   [igGridFiltering](#grid-filtering)
    -   [igGridGroupBy](#grid-grouping)   
    -   [igGridHiding](#grid-hiding)
    -   [igGridPaging](#grid-paging)
    -   [igGridResizing](#grid-resizing)
    -   [igGridRowSelectors](#grid-row-selectors)
    -   [igGridSelection](#grid-selection)
    -   [igGridSummaries](#grid-summaries)
    -   [igGridTooltips](#grid-tooltips)
    -   [igGridUpdating](#grid-updating)
    -   [igHierarchicalGrid](#hierarchical-grid)
    -   [igHierarchicalGrid GroupBy](#hierarchical-grid-grouping)
    -   [igHierarchicalGrid RowSelectors](#hierarchical-grid-row-selectors)
    -   [igLinearGauge](#linear-gauge)
    -   [%%ProductName%% ASP.NET MVC ラッパー](#mvc)
    -   [%%ProductName%% ASP.NET MVC ラッパー (モバイル)](#mvc-mobile)
    -   [igMap](#map)
    -   [igOlapXmlaDataSource](#olap-xmla-data-source)
    -   [igPivotDataSelector](#pivot-data-selector)
    -   [igPivotGrid](#pivot-grid)
    -   [igQRCodeBarcode](#qr-barcode)
    -   [igZoombar](#zoombar)
    -   [Infragistics Document Engine](#infragistics-documents)
    -   [Infragistics テンプレート エンジン](#templating-engine)
    -   [Popup (モバイル)](#popup-mobile)
    -   [SelectMenu (モバイル)](#selectmenu-mobile)
    -   [Slider (モバイル)](#slider-mobile)



## <a id="summary"></a> 既知の問題点と制限の概要

以下の表に、%%ProductName%% 2013 Volume 2 リリースの既知の問題と制限事項の概要を示します。各コントロールの既知の問題点に関するトピックでは、それぞれの既知の問題点と考えられる回避策について詳しく説明します。

凡例: | 
-------|--------
![](images/positive.png) | 回避策
![](images/negative.png) | 既知の回避策はありません
![](images/plannedFix.png) | 修正予定です


### <a id="editors"></a> [エディターの一般的な既知の問題点](igCurrencyEditor-igEditor-Known-Issues.html)

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
要素が `<input>` または `<textarea>` の時のプレースホルダーのビヘイビアー
			</td>

            <td>
エディター ベースの要素が、`<input>` または `<textarea>` 要素で、`buttons`、`theme`、または[`renderInContainer`](%%jQueryApiUrl%%/ui.igeditor#options:renderInContainer) オプションが有効の場合、エディター ベースの要素がその親から削除され、`<span>` 要素でラップされます。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
`<td>` ベース要素の場合、一部のブラウザーではエディターが正しく描画されない
			</td>

            <td>
エディターのベース要素が `<td>` 要素 (または、`<span>` または `<div>` 要素とは異なる他の特定のコンテナー) である場合、ブラウザーによってはコントロールを描画しない場合があります。たとえば、`igCurrencyEditor`™ コントロールのベース要素として `<td>` を使用する場合、Safari® ブラウザーでは描画できません。

                <blockquote>
**回避方法**
                <br />
                    `display` オプションのデフォルトの値を inline-block から block に変更します。
                </blockquote>
            </td>

            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
初期設定の後のテーマの変更が、一定の条件下でサポートされない
			</td>

            <td>
ベース要素が `<input>` または `<textarea>` の場合、`button`、[`renderInContainer`](%%jQueryApiUrl%%/ui.igeditor#options:renderInContainer)、および `theme` オプションが無効の場合、初期化後の `theme` オプションの変更はサポートされません。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
複数行のテキスト モードが、`<input>` ベース要素でサポートされない
			</td>

            <td>
ベース要素が `<input>` の場合、[`textMode`](%%jQueryApiUrl%%/ui.igtexteditor#options:textMode) オプションの *multiline* の設定はサポートされていません。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
`<textarea>` ベース要素で、強制的に複数行のテキスト モードになる
			</td>

            <td>
ベース要素が `<textarea>` の場合、[`textMode`](%%jQueryApiUrl%%/ui.igtexteditor#options:textMode) オプションは *multiline* に設定され変更できません。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
ベースの `<select>` 要素が、`<input>` 要素と自動的に置き換えられる
			</td>

            <td>
ベース要素が `<select>` 要素の場合、`<input>` 要素で置き換えられます。ドロップダウン ボタンとリスト項目はプログラムによって作成され、元の `<select>` 要素のオプションでコンテンツに埋め込まれます。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
幅と高さのオプションの設定では、一定の条件下で使用できるのは絶対値 (ピクセル数) のみ
			</td>

            <td>
エディターのベース要素が `<input>` または `<textarea>` 要素でなく、`buttons`、`theme`、または [`renderInContainer`](%%jQueryApiUrl%%/ui.igeditor#options:renderInContainer) オプションが有効な場合、幅と高さのオプションは絶対値 (ピクセル数) でのみ設定できます。

                <blockquote>
**回避方法**
                <br />
エディターが `<span>` 要素ラッパーなしで `<input>` または `<textarea>` 要素として描画される場合、パーセントやその他の HTML 単位を含む文字列に幅と高さを設定できます。
                </blockquote>
            </td>

            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
初期化後に一部のオプションの値を変更できない
			</td>

            <td>
`button`、[`textMode`](%%jQueryApiUrl%%/ui.igeditor#options:textMode)、および [`renderInContainer`](%%jQueryApiUrl%%/ui.igeditor#options:renderInContainer) オプションの初期化後に値を変更することはサポートされていません。
			</td>

            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
リストによるエントリのフィルタリングに制限がある
			</td>

            <td>
[`listMatchIgnoreCase`](%%jQueryApiUrl%%/ui.igeditor#options:listMatchIgnoreCase)、[`listMatchOnly`](%%jQueryApiUrl%%/ui.igeditor#options:listMatchOnly)、[`listMatchContains`](%%jQueryApiUrl%%/ui.igeditor#options:listMatchContains)、および [`listAutoComplete`](%%jQueryApiUrl%%/ui.igeditor#options:listAutoComplete) などのリストによるエントリのフィルタリングに関連したオプションは、`type` が text または `igTextEditor` に設定されたエディターのみに影響を与えます。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
ドロップダウンですべてのトリガーを無効にする方法について
			</td>

            <td>
ドロップダウンのすべてのトリガーを無効にするには、[`dropDownTriggers`](%%jQueryApiUrl%%/ui.igeditor#options:dropDownTriggers) オプションを空の文字列または null に設定する必要があります。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
ユーザー入力が入力フィールドの長さを超えた場合に、ビヘイビアーに誤動作
			</td>

            <td>
ユーザーが編集フィールドの幅よりも長いテキストを入力した場合:

                <ul>
                    <li>
カレットが、一部のブラウザーで表示されない可能性があります。(エディターのコントロールは、この発生を最小限にするように設計されたロジックがありますが、この事例を 100% カバーするものではありません。)
					</li>

                    <li>
一部のブラウザーは、文字の入力時にカレットの位置をすぐに調整できない可能性があります。カレットが一時的に (一瞬) テキストの末尾にジャンプして戻ってくる場合もあります。入力を開始する前に、入力ポイントとカレットの実際の位置を必ず一致させる必要があります。
					</li>

                    <li>
一部のブラウザー、特に Firefox® では、キーを押すたびにテキストが水平にジャンプまたは揺れる場合があります。
					</li>
                </ul>
            </td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
一定の条件下でコードを間違う危険がある
			</td>

            <td>
ベース要素が `<textarea>` (`textMode=”multiline”`) で、複数行の入力によってフィールドがスクロールする場合:

                <ul>
                    <li>
複数回のキーボード入力後、Shift + Enter (改行) を入力すると、垂直方向のスクロールに失敗し、カレットが非表示になる場合があります。これは、カレットがテキストの中段にある場合に、起こる可能性があります。
					</li>

                    <li>
ブラウザーの中でも特に Firefox では、キーを押すたびにテキストが垂直または水平方向に移動する場合があります。
					</li>
                </ul>
            </td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
日付ピッカーに固有の参照要件がある
			</td>

            <td>
エディターが *datepicker* または `igDatePicker`™ に設定されたタイプを持つ場合、エディターは jquery-datepicker に依存し、jquery.ui.datepicker.js への参照または jqueryui/1.8.7/jquery-ui.js などの結合ライブラリへの参照が必要です。.
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
日付ピッカーは、複数行モードをサポートしていない
			</td>

            <td>
エディターが *datepicker* または `igDatePicker` に設定されたタイプを持つ場合、*multiline* [`textMode`](%%jQueryApiUrl%%/ui.igeditor#options:textMode) オプションをサポートしません。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
日付ピッカーが `<textarea>` ベース要素をサポートしていない
			</td>

            <td>
エディターが *datepicker* または `igDatePicker` に設定されたタイプを持つ場合は、ベース要素として `<textarea>` をサポートしません。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
数値エディターが編集モードの場合の制限
			</td>

            <td>
数値エディターは編集モードでは、グループ、または 1000 のセパレーターおよび記号をサポートしません。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
数値および日付エディターに固有の参照要件がある
			</td>

            <td>
数値および日付エディターは、$.ig._regional に依存します。そのため、そのオブジェクトは ig.util.js への参照または結合した ig-js ファイルへの参照で使用可能である必要があります。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
エディターに対するロケールの動的な変更が、Infragistics Loader でできない
			</td>

            <td>
Infragistics Loader を使用している場合は、プログラムを使用してエディターのロケール設定を動的に変更することはできません。

                

                <blockquote>
**回避方法**
                <br />
`regional` オプションを変更するには、ポストバックが必要です。別の回避策として、コントロールを作り直す方法があります。現在のエディター コントロールを破棄して、ローダーを呼び出して別のロケールでロードします。
                </blockquote>
            </td>

            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
スタイルの変更
			</td>

            <td>
HTML 要素のレイアウトが変更され、ボタンだけでなくエディター本体の四隅も丸みの付いたコーナーで描画されます。

                <blockquote>
**回避方法**
                <br />
アプリケーションは、カスタム CSS を提供することによって、またはデフォルトの `igEditor` CSS クラスをオーバーライドすることによって、丸みの付いたコーナーを無効にすることができます。
                </blockquote>
            </td>

            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
スピン ボタンの問題
			</td>

            <td>
スピン ボタンは水平方向に描画されます。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
エディターの描画不良
			</td>

            <td>
基本要素が `<td>` の場合、描画が失敗する場合があります。

                <blockquote>
**回避方法**
                <br />
ベース要素が `<td>` である場合は、アプリケーションで親要素の幅を制限しない、または `<td>` 要素の実際の幅をエディターのコントロールの幅よりも大きく設定する必要があります。親要素は、親テーブルであるだけでなく、DOM 階層の親のアップチェーン全体でもあります。
                </blockquote>
            </td>

            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
`igDateEditor` と `igDatePicker` の Knockout 拡張機能には、Immediate モードによる制限がある
			</td>

            <td>
`igDateEditor`™ と `igDatePicker` Knockout 拡張機能は、`updateMode` プロパティが immediate に設定された場合、制限が発生します。日付のフォーマットが en-US と異なる場合、Immediate モードはサポートされません。
<br />
en-US フォーマット以外が使用されている場合、immediate モードは、日付を日付ピッカーから選択した場合または有効な日付をエディター内部にペーストした場合のみ正常に動作します。文字の入力で値が入力された場合は、間違った日付が設定されます。これは、JavaScript の日付のオブジェクト コンストラクターによる制限です。

                <blockquote>
**回避方法**
                <br />
デフォルトの更新モード - On Change - を使用する、または日付を手動入力ではなく `igDatePicker` コンポーネントから選択するようにします。
                </blockquote>
            </td>

            <td>
![](images/positive.png)
			</td>
        </tr>
    </tbody>
</table>


 [既知の問題点と制限の概要](#summary)を参照してください。

### <a id="bullet-graph"></a> [igBulletGraph](igBulletGraph-Known-Issues-and-Limitations.html)

問題|説明|状態
---|---|---
1 つのパフォーマンス バーと、1 つの比較マーカーのみがサポートされています|`igBulletGraph` コントロールは、1 つのパフォーマンス バーと 1 つの比較マーカーのみをサポートします。 | ![](images/positive.png)
ラベル競合の検出なし|`igBulletGraph` コントロールは、ラベル競合を検出する手段を提供していません。その結果、ラベルを表示するスペースが十分にない場合は、ラベル競合が発生する可能性があります。 | ![](images/positive.png)
パフォーマンス バーは、最小スケールの位置からのみ描画することができます。|パフォーマンス バーの開始位置は、スケールの最小値の位置のみです。パフォーマンス バーを任意の場所から始めることはできません。 | ![](images/plannedFix.png)


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="combo"></a> [igCombo](igCombo-Known-Limitations.html)

問題|説明|状態
---|---|---
複数の選択とカスタム値を同時に使用できない|`AllowCustomValue = true` および `multiSelection = "on"` または `multiSelection = "onWithCheckBoxes"` との組合わせはサポートされていません。 | ![](images/positive.png)
コンボのカスケード用に親コンボのキーを使用すると、子コンボのフィルタリングができない|回避策については、データ ソース カスケードへの igCombo コントロール カスケードのバインドのトピックを参照してください。 | ![](images/positive.png)
`igCombo` の子のカスケードに対し、ロード オン デマンドがサポートされない|親コンボのキーの定義とともに、子の `igCombo` のカスケードにロード オン デマンドを有効にするように構成することはサポートされていません。 | ![](images/negative.png)


[既知の問題と制限の概要](#summary)を参照してください。


### <a id="data-chart"></a> [igDataChart](igDataChart-Known-Issues.html)

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
財務シリーズ チャートでは先頭の項目と最後の項目が半分切れた状態で表示される
			</td>

            <td>
財務シリーズにおいて、先頭と最後の項目はチャートのビュー上にすべてが表示されず、半分にカットされた状態でプロットされます。
			</td>

            <td>                
![](images/plannedFix.png)
			</td>
        </tr>

        <tr>
            <td>
軸範囲を変更するとチャート アニメーションが無効になる
			</td>

            <td>
チャートの Motion Framework を使用していてデータの更新により Y 軸範囲が変更された場合、すべてのチャート アニメーションは無効になり新しいデータがモーション効果なしで直ちに表示されます。
			</td>

            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
モノリス シャドウは、ぼかし効果を許可しません。
			</td>

            <td>
シリーズの [`useSingleShadow`](%%jQueryApiUrl%%/ui.igDataChart#options:useSingleShadow) プロパティを true に設定した場合、[`shadowBlur`](%%jQueryApiUrl%%/ui.igDataChart#options:shadowBlur) 設定は無視され、ぼかしはシャドウに適用されません。これは、[Google® Chrome™ のバグ](https://code.google.com/p/chromium/issues/detail?id=100703)に対応するための制限です。すべての主要なブラウザーで同じ動作効果を保証することが目的です。上記の Chrome のバグが解消され次第、この効果はアップデートの対象となる予定です。

                
**回避策:**
                <blockquote>
影をぼかす必要がある場合、コンパウンド シャドウを使用してください (`useSingleShadow = "true"`)。
                </blockquote>
            </td>

            <td>
![](images/positive.png)
			</td>
        </tr>
    </tbody>
</table>


 [既知の問題と制限の概要](#summary)を参照してください。

#### <a id="dialog"></a> [igDialog](igDialog-Known-Issues.html)

問題|説明|状態
------|-------------|-------
`igDialog` の内部情報と幅や高さの情報に関連性がある場合、コントロールのサイズが正しく設定されない|`igDialog` 内部のコントロールは、表示される幅や高さの情報と相対的であると正しいディメンションにはなりません。これは、`igDialog` が表示される前に、埋め込まれたコントロールのインスタンスが作成されるため、コントロールのディメンションを正しく計算できないことが原因です。 | ![](images/positive.png)


 [既知の問題点と制限の概要](#summary)を参照してください。

### <a id="grid"></a> [igGrid - 全般](igGrid-Known-Issues.html#grid-general)

問題|説明|状態
---|---|---
列のキャプションが、複数の行にラップされない|列キャプション ([`igGrid.headerText`](%%jQueryApiUrl%%/ui.iggrid#options:headerText)) は、複数の行にラップされません。これは以前のバージョンの機能の最新の変更です。 | ![](images/positive.png)
タッチ ポイントを特定の UI 要素の上をスライドする時に、動作が一致しない|タッチ ポイントが特定の UI 要素の上をスライドする時に、グリッドと機能の動作が一致しない場合があります。 | ![](images/positive.png)
混在 / 部分の列幅の設定がサポートされない|一部の列幅をパーセント値で定義し、その他の列幅をピクセルで定義する (または列幅を定義しない) という状態はサポートされません。 | ![](images/positive.png)
IE 7 で、グリッドのヘッダーとフッターが正しく描画されない|グリッド幅が指定されていない場合、表示されるヘッダー要素とフッター要素の幅は、Microsoft® Internet Explorer® 7 のグリッドの幅より短くなります。 | ![](images/positive.png)
`<div>` 要素で、グリッド機能の API 呼び出しが正しく動作しない|グリッドのインスタンスを `<div>` 要素で作成した場合、グリッドの機能に対する API 呼び出しは機能しません。 | ![](images/positive.png)
Android 4.0.2 で、レコードの背後にダイアログ / ポップアップが表示される|igGrid の垂直スクロールを有効にして、`igGrid` を Android のバージョン 4.0.2 で実行している場合、ポップアップ / ダイアログはすべてレコードの背後に表示されます。 | ![](images/positive.png)
ヘッダー、フッター、およびコンテンツを結合した高さがオプションの高さ設定以上の場合に、`igGrid` が再初期化される | `igGrid` のヘッダー、フッター、およびコンテンツの高さの合計が、オプションで設定された高さよりも大きい場合、`igGrid` ウィジェットは、ヘッダー、フッター、およびコンテンツが表示できる高さになるように、新しい高さで自身を再初期化します。 | ![](images/positive.png)
showHeader オプションが正しく動作しない|グリッドの初期化で [`showHeader`](%%jQueryApiUrl%%/ui.iggrid#options:showHeader) オプションが *false* に設定されている場合、API を使用してそれを *true* のランタイムに設定すると、ヘッダーが表示されません。 | ![](images/positive.png)
Mac OS での水平スクロールバーの表示の問題|Mac OS® で、*Show scrollbars only when scrolling* オプションを *true* に設定した場合、グリッドの水平スクロールバーは表示されません。これは、グリッドの水平スクロールバーで、`overflow` が *hidden* に設定されているためです。 | ![](images/positive.png)
自動生成の列で、ソースはキー / 値ペアが含まれている必要がある|グリッドの列が自動生成の場合 (たとえば、[autoGenerateColumns](%%jQueryApiUrl%%/ui.iggrid#options:autoGenerateColumns) が有効な場合)、ソースは常にキー / 値のペアを含む必要があります。含まれていない場合は、グリッドが正しく描画されない可能性があります。 | ![](images/positive.png)
機能を複数回定義できない|**JavaScript の場合:**<br />`igGrid` と `igHierarchicalGrid`™ のいずれの場合も、1 つの機能を複数回定義するとエラーがスローします。<br />**MVC の場合:**<br />`igGrid` と `igHierarchicalGrid` のいずれの場合も、MVC ラッパーで機能を複数回定義すると、最後の定義のみが取り入れられます。 | ![](images/negative.png)
チェックボックスの表示が、テンプレート (行および列) と一致しない|テンプレート機能を使用し、`renderCheckboxes` オプションを true に設定した場合、ブール値の列にテンプレートが定義されているかどうかをチェックできないため、ブール値の列にはチェックボックスが表示されません。 | ![](images/positive.png)
行テンプレートで、テーブルの行に属性を設定できない|`igGrid` と `igHierarchicalGrid` のいずれの場合も、行テンプレートを使用してテーブルの行に属性を設定することはできません。 | ![](images/positive.png)
イベントでトリガーしない|設計により、各イベントはユーザー インタラクションでのみトリガーします。公開 API を使用している時に、イベントでトリガーしません。 | ![](images/negative.png)
KnockoutJS の監視可能な配列機能が制限される|`unshift`、`reverse`、および `sort` の監視可能な配列機能を使用すると、グリッドのビジュアル外観が誤って表示されます。 | ![](images/positive.png)
id 属性は、DOM コントロール プレースホルダーで必須|id 属性は、グリッドが初期化される DOM 要素に設定する必要があります。グリッドは、jQuery セレクターを内部で使用して選択を高速化します。|![](images/negative.png)
スペースを含む列のキーはサポートされない|列のキーは、一部の DOM 要素の ID の生成に使用されます。[HTML 5 仕様](http://www.w3.org/TR/html5/dom.html#the-id-attribute)により、HTML id 属性にスペースを入れることはできません。|![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-data-binding"></a> [igGrid - データ バインディング](igGrid-Known-Issues.html#data-binding)

問題|説明|状態
---|---|---
`DataTable`/`DataSet` へのバインドを、更新機能と同時に使用する場合は、[LoadTransaction](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~LoadTransactions.html) メソッドを `GridModel` でオーバーライドする必要がある|`igGrid` を `DataTable` または `DataSet` にバインドすると同時に、更新機能を使用する場合、`GridModel` は、JSON に対する `Dictionary<string, string>` の逆シリアル化をサポートするシリアライザーを使用して、`LoadTransaction()` メソッドをオーバーライドする必要があります。 | ![](images/positive.png)
データ テーブル / セットへのバインドで、リモートのフィルタリング、並べ替え、集計、およびグループ化がサポートされない|グリッドを `DataTable` または `DataSet` にバインドしている場合、並び替え、フィルタリング、および Group By 機能のローカル構成を使用する可能性がありますが、並び替えとフィルタリングでは、リモート構成の回避策が利用できます。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-unbound-columns"></a> [igGrid - 非バインド列](igGrid-Known-Issues.html#unbound-columns)

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
非バインド列ではリモートのフィルタリング、並べ替え、およびグループ化がサポートされない
			</td>
            <td>
非バインド列列では、並び替え、フィルタリング、および Group By 機能をサポートしていません。[Columns](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~Columns.html) コレクションに含まれる非バインド列では、上記の機能は無効です。
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>
        <tr>
            <td>
グリッド MVC ヘルパーのグリッド SetUnboundValues([列キー], [値のディクショナリ]) メソッド オーバーロードにはプライマリ キーが必要とされる
			</td>
            <td>
`SetUnboundValues([列キー], [値のディクショナリー])` メソッド オーバーロードを使用するには、プライマリ キーを設定する必要があります。
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>
        <tr>
            <td>
ビュー内でのグリッド ヘルパーの使用に制限がある
			</td>
            <td>
データ ソースがリモートにあり、[`MergeUnboundColumns`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~MergeUnboundColumns.html) プロパティが *true* に設定されている場合、ASP.NET MVC ビューの内部ではグリッド ヘルパーが使用できないようになっています。
			</td>
            <td>
![](images/negative.png)
			</td>
        </tr>
        <tr>
            <td>
リモート ページングと `unboundValues` が使用されている場合、非バインド列の値は更新されません。
			</td>
            <td>
グリッドは、リモートのページングを有効にしたクライアント上で [`unboundValues`](%%jQueryApiUrl%%/ui.iggrid#options:columns.unboundValues) を設定している場合に、非バインド列に対して同じ値を表示します。
			</td>
            <td>
![](images/negative.png)
			</td>
        </tr>
        <tr>
            <td>
非バインド列の中で数式の使用に制限がある
			</td>
            <td>
[`MergeUnboundColumns`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~MergeUnboundColumns.html) オプションが *true* に設定されている場合、`igGrid` の非バインド列で数式を使用することはできません。
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>
        <tr>
            <td>
グリッド コントロールで非バインド データ値が自動的に保持されない
			</td>
            <td>
非バインド値の含まれる行を編集してコミットし、そのあとでグリッドをバインドし直した場合、変更内容は保持されません。
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>
        <tr>
            <td>
仮想化を使用している場合、一番上にグリッドが誤ってスクロールする
			</td>
            <td>
いずれかの形式 (固定式または連続式) の仮想化を使用し、[`setUnboundValues`](%%jQueryApiUrl%%/ui.iggrid#methods:setUnboundValues) クライアント API メソッドを呼び出した場合、非バインド列の値が表示される前にグリッドが一番上にスクロールします。
			</td>
            <td>
![](images/negative.png)
			</td>
        </tr>
        <tr>
            <td>
リモート データを使用している時、ブール値の非バインド列が間違って生成される
			</td>
            <td>
[`MergeUnboundColumns`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~MergeUnboundColumns.html) プロパティを *false* に設定した状態で、リモート データを使用すると、ブール値の非バインド列には *false* が入力されます。
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>
        <tr>
            <td>
特定の状況で、`igGrid` の [`getUnboundValues`](%%jQueryApiUrl%%/ui.iggrid#methods:getUnboundValues) メソッドが非バインド値を返さない
			</td>
            <td>
非バインド値が `dataBound` クライアント側イベントを介して設定される場合、`getUnboundValues()` クライアント API メソッドを使用しても非バインド値は返されません。
			</td>
            <td>
![](images/negative.png)
			</td>
        </tr>
    </tbody>
</table>


 [既知の問題と制限の概要](#summary)を参照してください。

### <a id="grid-virtualization"></a> [igGrid - 仮想化](igGrid-Known-Issues.html)

問題|説明|状態
---|---|---
固定ヘッダーが常に有効になる (制限)|仮想化が有効な場合、変更できない [`fixedHeaders`](%%jQueryApiUrl%%/ui.iggrid#options:fixedHeaders) オプションのフォームに制限があり、常に *true* に設定されます。 | ![](images/negative.png)
グリッドの高さ設定に制限がある|`igGrid` の高さは常に、行の平均の高さで割り切れる値でなければなりません。(割り算の剰余はゼロでなければなりません。) | ![](images/negative.png)
行の高さ設定に制限がある|データ行が数行しかない `igGrid` では、すべての `igGrid` 行の高さは展開します。これは、行の高さの合計がグリッドの高さと一致する必要があるためです。 | ![](images/negative.png)
列の可視の幅の設定に制限がある|列の可視の幅は、*igGrid* の幅と等しくなければなりません (水平方向の仮想化の場合)。 | ![](images/negative.png)
水平方向の仮想化に対して、キーボード ナビゲーションがサポートされない (制限)|水平方向の仮想化に対して、キーボード ナビゲーションはサポートされていません。 | ![](images/negative.png)
セル クラス適用の制限|特定のセルのクラスをソートされた列のすべてのセルに適用する操作はサポートされていません。たとえば、[`applySortedColumnCss`](%%jQueryApiUrl%%/ui.iggridsorting#options:applySortedColumnCss) は自動的に *false* に設定されます。 | ![](images/negative.png)
仮想化を有効にすると、autofitLastColumn が無効になる|仮想化を有効にすると、[autofitLastColumn](%%jQueryApiUrl%%/ui.iggrid#options:autofitLastColumn) は無効になり、列幅の合計がグリッド幅よりも小さい場合、列は拡張されグリッド全体を占有することになります (autofitLastColumn が true に設定された場合と同じように動作します)。|![](images/negative.png)
グリッドの幅がパーセンテージで定義されている場合、列の仮想化が機能しない|グリッドの幅がパーセンテージで定義され、列の仮想化が有効な場合 ([columnVirtualization](%%jQueryApiUrl%%/ui.iggrid#options:columnVirtualization) = true)、水平スクロールバーが表示されません。|![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-column-fixing"></a> [igGridColumnFixing](igGrid-Known-Issues.html)

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
列移動
					</li>
                    <li>
グループ化 (別名:グループ化)
					</li>
                    <li>
非表示
					</li>
                    <li>
(レスポンシブ Web デザイン (RWD) モード (別名:レスポンシブ)
					</li>
                    <li>
Knockout ライブラリ (KnockoutJS) の結合
					</li>
                    <li>
仮想化
					</li>
                    <li>
非バインド列
					</li>
                </ul>
これらの機能と列固定機能の統合は、次期ボリューム リリースで実装される予定です。
            </td>
            <td>
![](images/plannedFix.png)
			</td>
        </tr>
        <tr>
            <td>
IE9+ で行の固定部分および固定解除部分の配置が正しくない (IE9+ エンジンの問題)
			</td>
            <td>
Internet Explorer 9 以降で、列を `igGrid` に固定してグリッドの中央へスクロールすると、行の固定部分と固定解除部分との間に不整合が発生します。
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>
        <tr>
            <td>
グリッドおよびその列の幅は必須で、ピクセル単位で定義する必要がある
			</td>
            <td>
グリッドおよびその列 (明示的または [defaultColumnWidth](%%jQueryApiUrl%%/ui.iggrid#options:defaultColumnWidth) オプションを使用) の幅は必須で、ピクセル単位で定義する必要があります。
			</td>
            <td>
![](images/negative.png)
			</td>
        </tr>
    </tbody>
</table>


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-column-moving"></a> [igGridColumnMoving](igGrid-Known-Issues.html#column-moving)


問題|説明|状態
------|-------------|-------
IE 9 で列移動が機能しない|Internet Explorer 9 では、列移動は機能しません。これは、バージョン 1.7.2 で導入されたドラッグ可能な jQuery UI のバグが原因ですが、バージョン 1.8.6 で解決されています。バグの詳細は、[jQuery UI Bug 5370](http://bugs.jqueryui.com/ticket/5370) を参照してください。 | ![](images/positive.png)
Google Chrome で列移動が正常に動作しない|バージョン 1.8.6 よりも前の jQuery UI で列移動機能を使用している場合、Google Chrome ではグリッドが選択されることになります。 | ![](images/positive.png)


 [既知の問題点と制限の概要](#summary)を参照してください。

### <a id="grid-multi-column-headers"></a> [igGrid - 複数列ヘッダー](igGrid-Known-Issues.html)

問題|説明|状態
------|-------------|-------
複数列ヘッダー機能は `columnVirtualization` ではサポートされない|仮想化および複数列ヘッダー機能が有効の場合、`rowVirtualization` のみが統合されます。列仮想化はこのシナリオではサポートしていません。 | ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-filtering"></a> [igGridFiltering](igGrid-Known-Issues.html)


問題|説明|状態
------|-------------|-------
簡易フィルタリングが列の仮想化で機能しない|フィルター モードを「簡易」に設定すると、列の仮想化 ([columnVirtualization](%%jQueryApiUrl%%/ui.iggrid#options:columnVirtualization) = true) が機能しません。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-grouping"></a> [igGridGroupBy](igGrid-Known-Issues.html#groupby)

問題|説明|状態
---|---|---
グループ行の日付形式が他の行の形式と異なる|日付形式のデータを持つ列をグループ化する場合、グループの上部にある日付の形式 (この形式はグループ化するときに自動的に表示されます) は、列の形式と異なります。 | ![](images/positive.png)
IE 9 でグループ化が機能しない|Internet Explorer 9 では、グループ化機能は動作しません。これは、バージョン 1.7.2 で導入されたドラッグ可能な jQuery UI のバグが原因ですが、バージョン 1.8.6 で解決されています。バグの詳細は、[jQuery UI Bug 5370](http://bugs.jqueryui.com/ticket/5370) を参照してください。 | ![](images/positive.png)
列をグループ化し、すべての行を折り畳んだ時に、IE 9 で行が正しく配置されない|列をグループ化し、すべての行を折り畳むと、IE 9 では行が正しく配置されません。これはブラウザーが折り畳まれた要素を固有の方法で処理するためです。 | ![](images/negative.png) ![](images/plannedFix.png)
MVC でグループ化を実行する前にページング機能を定義すると、グループが不正となる|MVC ソリューションを使用して、ページングおよびグループ化機能をともに定義する場合、グループ化機能の実行前にページングが定義されるとグループが不正になります。 | ![](images/positive.png)
IE 8 では、フィルタリング行領域が不正になる|IE 8 でグループ化とフィルタリングがともに有効な場合、フィルタリング行領域は誤ったスタイルを取得します。これは、Internet Explorer 8 のブラウザーの固有の問題です。 | ![](images/negative.png) ![](images/plannedFix.png)
グリッドがフィルターされていると、グループの行カウントが変更されない|グループ化機能でフィルタリングが有効な場合、グリッドをフィルタリングして行カウントが減っても、グループの行カウントは設計上、変更されません。 | ![](images/negative.png)
リモート ページングを有効にして 3 つ以上のグループをグループ化すると、2 番目のグループの行カウントが不正になる|リモートのページングが有効な状態で、グループ化機能を使用して 3 つ以上のグループをグループ化すると、2 番目のグループは不正な行カウントを取得します。 | ![](images/negative.png)
リモートのページングおよび集計で、レコード カウントが不正になる|グリッドのページングおよびグリッドの集計がリモートで、null 値が含まれるレコードがある場合、グループのレコード カウントが不正になります。これは値がサーバーから null 文字列として送信されるためです。 | ![](images/negative.png)
グループ化機能で列設定を定義し、同時に継承を有効にすると、例外がスローされる|グループ化機能を有効にし、その中で列設定を定義し継承を有効にすると、ページ例外がスローされます。 | ![](images/positive.png)
グループ化を自動生成列とともに使用すると、他の列のグループ化ができない|`igGrid` コントロールにいくつかの列が明示的に定義されており、[`autoGenerateColumns`](%%jQueryApiUrl%%/ui.iggrid#options:autoGenerateColumns) が *true* に設定されていると、初期化時に列をグループ化すると、ランタイムに他の列のグループ化が妨げられます。 | ![](images/positive.png)
列内の値はグループ化されるが、正しく表示されない|[`autoGenerateColumns`](%%jQueryApiUrl%%/ui.iggrid#options:autoGenerateColumns) が *true* に設定され、列が初期化でグループ化されている場合、列の値はグループ化されますが、正しく表示されません。 | ![](images/positive.png)
`groupedColumnsChanged` イベントの入力引数の `ui.groupedColumns` が空き状態である|列をグループ化領域にドラッグしてグループ化した場合、[`groupedColumnsChanged`](%%jQueryApiUrl%%/ui.iggridgroupby#events:groupedColumnsChanged) イベントの `ui.groupedColumns` 入力の引数が空き状態になる場合があります。 | ![](images/positive.png)
グループ化のモーダル ダイアログ内の `igTree` のタップが正しく機能しない|Android 4.0 で、グループ化のモーダル ダイアログ内のドロップダウンをタップすると、レイアウトの問題が発生する場合があります。この問題は、ツリーが部分的に表示されており、垂直または水平スクロールを行った場合に発生します。 | ![](images/positive.png)
GroupBy 機能および連続的仮想化の使用時の制限|`igGrid` の連続的仮想化を使用して、グループ化機能を有効にしている場合、垂直スクロールにより、折り畳まれたグループが展開されます。 | ![](images/negative.png)


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-hiding"></a> igGridHiding

問題|説明|状態
---|---|---
グリッドの非表示が、行テンプレートで機能しない|行テンプレートを使用している場合、`igGridHiding`™ 機能は列を非表示にできません。 | ![](images/positive.png)


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-paging"></a> [igGridPaging](igGrid-Known-Issues.html#paging)

問題|説明|状態
---|---|---
実行時にページング イベントが発生しない|`igGrid` のページング イベントは、UI がページング操作をトリガーした場合のみ発生します。ページング オプションをランタイムで設定した場合は発生しません。 | ![](images/positive.png)

[既知の問題と制限の概要](#summary)を参照してください。


### <a id="grid-resizing"></a> [igGridResizing](igGrid-Known-Issues.html#resizing)

問題|説明|状態
---|---|---
サイズ変更が、古い jQuery バージョンで機能しない|`igGrid` のサイズ変更は、jQuery のバージョン 1.8.0 ~ 1.8.5 ではサポートされていません。 | ![](images/positive.png)
仮想化が有効な時にサイズ変更が機能しない|仮想化または列の仮想化が有効になっていると、列のサイズ変更機能は動作しません。 | ![](images/positive.png)
Firefox で列幅が設定されていないと、列のサイズ変更が正しく実行されない|Firefox のバグにより、列幅が設定されていない場合 `igGrid` 列を適切にサイズ変更できません。 | ![](images/negative.png)
Firefox で適切な列幅が設定されていないと、列のサイズ変更が正しく実行されない|列幅を適切なパーセント値で設定していない場合、Firefox のバグにより、`igGrid` 列のサイズを正しく変更できません。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-row-selectors"></a> [igGridRowSelectors](igGrid-Known-Issues.html#row-selectors)

問題|説明|状態
---|---|---
列仮想化で行セレクターが操作しない|列仮想化のコンテキストでは、列セレクターはサポートされません。これは今後のリリースで実装される予定です。 | ![](images/negative.png) ![](images/plannedFix.png)
`igGridRowSelectors` ウィジェットでは、選択機能を有効にする必要がある|`igGridRowSelectors` ウィジェットの [`requireSelection`](%%jQueryApiUrl%%/ui.iggridrowselectors#options:requireSelection) オプションは、デフォルトで *true* に設定されています。また行セレクターの使用に選択機能が必要なことを示す例外をスローします。 | ![](images/positive.png)
IE 9 で選択機能が正しく動作しない|Internet Explorer 9 では、テーブルが大き過ぎるとページに垂直スクロールバーが表示されますが、バーを下にスクロールすると、チェックボックスの有無に関係なく、`RowSelectors` を使用した選択が正しく動作しません。グリッドがフォーカスを得ると、Internet Explorer 9 がページを上方にスクロールして戻すため、選択は誤った行に適用される、または全く適用されません。 | ![](images/negative.png)
選択機能を自動的に有効にできない|選択機能の自動有効化は機能しません。選択ウィジェットでは、`RowSelectors` に全機能を持たせる必要があります。 | ![](images/positive.png)

[既知の問題と制限の概要](#summary)を参照してください。


### <a id="grid-selection"></a> [igGridSelection](igGrid-Known-Issues.html#selection)

問題|説明|状態
---|---|---
iOS でのセル選択が適切に動作しない|iOS で`igGrid` をスクロールする場合は、最初にセルをタップし、スクロールしたい方向にスワイプする必要があります。iOS と Android では jQuery モバイルによるスクロール イベントの処理方法が異なるため、`igGrid` のスクロール動作には違いがあります。 | ![](images/negative.png)
仮想化を有効にした場合、表示されている行以外選択できない|これは、仮想化を有効にすると非表示の行やセルは DOM ツリー内に存在しないとみなされるための制限です。 | ![](images/negative.png)
連続的仮想化が有効になっている場合、行 / セルを選択すると選択が不正になる|連続的仮想化が有効な場合に `igGrid` の行 / セルを選択すると、jQuery バージョン 1.6.4 のバグによりグリッドがスクロール ダウンし、異なる行 / セルが選択されます。この問題は、このバージョンの jQuery ライブラリのみで発生します。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-summaries"></a> [igGridSummaries](igGrid-Known-Issues.html#summaries)

問題|説明|状態
---|---|---
リモート データを使用したカスタム集計の使用時の制限|ASP.NET MVC ヘルパー ラッパーは、デフォルトでカスタム サマリーを処理できません。したがって、カスタム サマリーを別に作成して、計算する必要があります。 | ![](images/positive.png)
カスタム メソッド設定時の制限|カスタム メソッドを設定する場合は、順序および集計オペランドの [`summaryCalculator`](%%jQueryApiUrl%%/ui.iggridsummaries#options:columnSettings.summaryOperands.summaryCalculator) オプションの設定を強く推奨します。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-tooltips"></a> [igGridTooltips](igGrid-Known-Issues.html#tooltips)

問題|説明|状態
---|---|---
ポインターをセル上で移動する速度が速すぎる場合のツールチップの表示の問題|ユーザーがコントロールでマウスを素早く動かすと、ツールチップのフェード アニメーションがツールチップを表示 / 非表示する処理速度が遅くなり、値が非常に小さい場合は表示の問題が発生することがあります。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-updating"></a> [igGridUpdating](igGrid-Known-Issues.html#updating)

問題|説明|状態
---|---|---
更新と仮想化の機能を有効にして新しい行を追加するには、即時コミットが必要である|[`autoCommit`](%%jQueryApiUrl%%/ui.iggrid#options:autoCommit) を無効にして、更新と仮想化の機能を有効にした場合、新しい行の追加はサポートされません。autoCommit が *false* の場合、新たに追加された行は仮想化されません。 | ![](images/positive.png)
ExcelNavigationMode は「cell」および「row」編集モードのみで操作します。|[`excelNavigationMode`](%%jQueryApiUrl%%/ui.iggridupdating#options:excelNavigationMode) が有効の場合、矢印で移動するのは "cell" および "row" の [`editMode`](%%jQueryApiUrl%%/ui.iggridupdating#options:editMode) のみで可能です。editMode = "row" の場合、ナビゲーションは「新しい行の追加」でナビゲーションを正しく操作しません。その他の editMode 設定 ("rowedittemplate", none, null) は [`excelNavigationMode`](%%jQueryApiUrl%%/ui.iggridupdating#options:excelNavigationMode) でサポートされません。 | ![](images/negative.png)
グループ化されている場合に、仮想グリッドの追加および更新が機能しない|仮想グリッドの GroupBy および更新の使用で、グリッドがグループ化されている場合、行の更新または追加は機能しなくなります。グループ化を解除すると、グリッド レコードの最下部に新しいレコードが追加されます。 | ![](images/negative.png)
Updating の rowEditDialogMaxHeight プロパティ名は rowEditDialogContentHeight に変更されました|このプロパティは行編集テンプレート (Updating の [`editMode`](%%jQueryApiUrl%%/ui.iggridupdating#options:editMode) が rowedittemplate の場合) と関連付けられます。行編集ダイアログ コンテンツの高さを設定するために使用します。これは以前のバージョンの機能の重大な変更です。 | ![](images/negative.png)
`<td>` タグ属性を含む行テンプレートは行の更新で無視されます|行の更新で、igGrid は TD 要素に内部に適用されるスタイルまたは属性が保存されるために TD タグのコンテンツのみを正しく変更します。新しい値でテンプレートを再実行するには、テンプレートされた要素は TD のコンテンツである必要があります。dataBind を呼び出すと、列に適用されるすべてのテンプレート化を再実行します。 | ![](images/positive.png)

[既知の問題と制限の概要](#summary)を参照してください。


### <a id="hierarchical-grid"></a> [igHierarchicalGrid](igHierarchicalGrid-Known-Issues.html#general)

問題|説明|状態
---|---|---
Android 4.* デバイスで、スクリーン タップが誤って解釈される|Android 4.* を使用したタッチ デバイスでは、階層グリッドで Group By モーダル ダイアログのドロップダウンのタップは、多くの場合モーダル ダイアログの背後のグリッド セルに作用します。 | ![](images/positive.png)
階層グリッドにおいて特定の順序で機能を参照した場合に発生するレンダリング問題|Group By 機能を機能リストに追加した後に行セレクターを追加した場合、`igHierarchicalGrid` の子のレイアウトが正しく描画されないことがあります。 | ![](images/positive.png)
子レイアウトの `<div>` 要素は、jQuery ID セレクターで選択することはできません。|`igHierarchicalGrid` は親レイアウトのプライマリー キー値を使用して、固有の `id` 属性を持つ子レイアウトの `<div>` 要素を作成します。プライマリー キーの値に無効な文字が含まれる場合は、[jQuery ID セレクター](http://api.jquery.com/id-selector/)で DIV 要素を選択することはできません。 | ![](images/negative.png) ![](images/plannedFix.png)
MVC で自己参照が機能しない|`igHierarchicalGrid` を自己参照データにバインドしたい場合、シリアル化制限のために、MVC パターンによりバインドすることができません。 | ![](images/negative.png)
チェーンでロード オン デマンドが機能しない|MVC プロジェクトのビュー ページで、ロード オン デマンドを有効にすることはできません。 | ![](images/positive.png)
レイアウトでプライマリー キーを使用せずにロード オン デマンドを実行すると、例外がスローされる|ロード オン デマンド機能を有効にし、すべての子レイアウトに対してプライマリー キーを定義しなかった場合、例外がスローされます。 | ![](images/positive.png)
子レイアウトの一部の列が表示されない、または切り取られる|`igHierarchicalGrid` で幅が定義されず、また子レイアウトに列幅が width グリッドを越える列がある場合、子の列の一部は切り取りまたは非表示になります。 | ![](images/positive.png)
行テンプレートで、テーブルの行に属性を設定できない|`igGrid`™ と `igHierarchicalGrid` のいずれの場合も、行テンプレートを使用して属性をテーブルの行に設定することはできません。 | ![](images/negative.png)
機能を複数回定義できない|**JavaScript の場合:**<br />`igGrid` と `igHierarchicalGrid` のいずれの場合も、1 つの機能を複数回、定義するとエラーがスローされます。<br />**MVC の場合:**<br />`igGrid` と `igHierarchicalGrid` のいずれの場合も、MVC ラッパーで機能を複数回定義すると、最後の定義のみが取り入れられます。 | ![](images/negative.png)
id 属性は、DOM コントロール プレースホルダーで必須|id 属性は、グリッドが初期化される DOM 要素に設定する必要があります。グリッドは、jQuery セレクターを内部で使用して選択を高速化します。 |![](images/negative.png)
スペースを含む列のキーはサポートされない|列のキーは、一部の DOM 要素の ID の生成に使用されます。[HTML 5 仕様](http://www.w3.org/TR/html5/dom.html#the-id-attribute)により、HTML id 属性にスペースを入れることはできません。|![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="hierarchical-grid-grouping"></a> [igHierarchicalGrid GroupBy](igHierarchicalGrid-Known-Issues.html#grouping)

問題|説明|状態
---|---|---
階層グリッドにおけるリモート グループ化の制限事項|リモート グループ化では、複数のレイアウト (またはルート グリッド) の列のグループ化は機能しません。 | ![](images/positive.png)
ロード オン デマンドでのリモート グループ化が不正になる|グリッド全体のロード オン デマンドでリモートの Group By を有効にした場合、オン デマンドでロードしているデータを返すアクションを修正しない限り、グループは不正になります。 | ![](images/positive.png)
グループ化機能で列設定を定義し、同時に継承を有効にすると、例外がスローされる|グループ化機能を有効にし、その中で列設定を定義し継承を有効にすると、ページ例外がスローされます。 | ![](images/positive.png)


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="hierarchical-grid-row-selectors"></a> [igHierarchicalGrid RowSelectors](igHierarchicalGrid-Known-Issues.html)


問題|説明|状態
---|---|---
行セレクターの動作は、一度に 1 つのレイアウトに限られる|行セレクターの機能のチェックボックスで選択されたレイアウトは、別のレイアウトのチェックボックスがチェックされると選択が解除されます。 | ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="linear-gauge"></a> [igLinearGauge](igLinearGauge-Known-Issues-and-Limitations.html)

問題|説明|状態
---|---|---
1 つの針のみをサポート|`igLinearGauge` コントロールは、1 つの針のみをサポートします。 | ![](images/positive.png)
ラベル競合の検出なし|`igLinearGauge` コントロールには、ラベル競合を検出する手段はありません。その結果、ラベルを表示するスペースが十分にない場合は、ラベル競合が発生する可能性があります。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="mvc"></a> [%%ProductName%% ASP.NET MVC ラッパー](ASPNET-MVC-Wrappers-Known-Issues.html)

問題|説明|状態
---|---|---
MVC ヘルパー生成コードと MVC ローダーがカスタムの JavaScript ページ設定コードのあとに実行される|ASP.NET MVC ビューにおいてコントロールの MVC ローダーや MVC ヘルパーを使用した場合、それらが生成する JavaScript コードは、[`$(document).ready()`](http://api.jquery.com/ready/) や [`$(window).load()`](http://api.jquery.com/load-event/) イベントで渡されたカスタムのページ設定コードの後に実行されます。 | ![](images/positive.png)
`AutoGenerateLayouts` の既定値が変更される|グリッドの ASP.NET MVC ヘルパーでは、フラット グリッドに対して別のリモート データ要求が発行されることを防ぐために、`AutoGenerateLayouts` プロパティの既定値が *false* に変更されます。 | ![](images/negative.png)
MVC Razor レイアウト ビューで MVC Loader が正常に機能しない|ASP.NET MVC Loader を MVC Razor のレイアウト ビューに表示した場合、実際のビューにあるコントロールよりも前にローカルを初期化することはできません。 | ![](images/positive.png)


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="mvc-mobile"></a> [%%ProductName%% ASP.NET MVC ラッパー (モバイル)](ASPNET-MVC-Mobile-Wrappers-Known-Issues.html)

問題|説明|状態
---|---|---
モバイル コントロール ヘルパーの位置が変更された|2013.1 には、モバイル コントロール ヘルパーは *Infragistics.Web.MVC.dll* アセンブリの一部でした。2013.2 には、これらのヘルパーは *Infragistics.Web.MVC.Mobile dll* 内に常駐しています。 | ![](images/positive.png)

[既知の問題と制限の概要](#summary)を参照してください。


### <a id="map"></a> [igMap](igMap-Known-Issues-Limitations.html)

問題|説明|状態
---|---|---
地理等高線シリーズにツールチップが表示される|今のところ、地理等高線シリーズではツールチップはサポートされません。 | ![](images/plannedFix.png)
iPad デバイスの地理記号シリーズにツールチップが表示される|iPad デバイスでは、地理記号シリーズが表示される場合、ツールチップは表示されません。 | ![](images/plannedFix.png)


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="olap-xmla-data-source"></a> [igOlapXmlaDataSource](igOlapXmlaDataSource-Known-Issues-and-Limitations.html)

問題|説明|状態
---|---|---
`igOlapXmlaDataSource` が Android ベースのブラウザーでサポートされない | `igOlapXmlaDataSource`™ コンポーネントは、Android オペレーティング システム用ブラウザーでサポートされていません。| ![](images/plannedFix.png)
認証済みデータ アクセスが、`igOlapXmlaDataSource` で Mozilla Firefox と正しく連携しない|Firefox ブラウザーを認証済みアクセスで使用する場合は、[インターネット インフォメーション サービス](http://encyclopedia2.thefreedictionary.com/Internet+Information+Services) (IIS) の追加構成が必要です。 | ![](images/positive.png)
`igOlapXmlaDataSource` 用の信頼されていないドメインに対して、Internet Explorer 8.0 および 9.0 で認証済みデータ アクセスが正しく機能しない|`igOlapXmlaDataSource` コンポーネントは Internet Explorer ブラウザーのバージョン 8 および 9 で信頼されないドメインの OLAP データを取得できません。 | ![](images/positive.png)
`igOlapXmlaDataSource` を使用している場合に、Chrome がクロスドメイン要求の認証ポップアップを表示しない|Chrome ブラウザーのバージョン 13 以降では、認証ポップアップ ダイアログはクロスドメイン要求に対して表示されません。 | ![](images/positive.png)


[既知の問題と制限の概要](#summary)を参照してください。


### <a id="pivot-data-selector"></a> [igPivotDataSelector](igPivotDataSelector-Known-Issues-and-Limitations.html)

問題|説明|状態
---|---|---
古い jQuery UI バージョンを使用して、`igPivotDataSelector` のエリア間でドロップした後、ドロップ ラベルが残る|これは、バージョン 1.8.19 で導入されるドラッグ可能な jQuery UI バグにより引き起こされます。詳細は、[jQuery UI バグ 8269](http://bugs.jqueryui.com/ticket/8269)を参照してください。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="pivot-grid"></a> [igPivotGrid](igPivotGrid-Known-Issues-and-Limitations.html)

問題|説明|状態
---|---|---
`igPivotGrid` におけるキャプション ベースの並べ替えは、常にアルファベット順になる|現在、`igPivotGrid`™ コントロールでは、カスタム キャプションの並べ替えビヘイビアーはサポートされていません。アルファベット順の並べ替えのみを使用できます。 | ![](images/negative.png) ![](images/plannedFix.png)
`igPivotGrid` でメンバーを展開または折りたたむと、グリッドを再レンダリングする|`igPivotGrid` の行または列のメンバーを展開または折りたたむと、グリッド全体が再レンダリングされます。 | ![](images/negative.png) ![](images/plannedFix.png)
`igPivotGrid` が、Android オペレーティング システム用のブラウザー内で必ずしも正しく表示されない | Android オペレーティング システム用のブラウザーでは、`igPivotGrid` の最初の列のみが表示されます。 | ![](images/positive.png)
*jQuery UI 1.8.19 におけるドロップ エリア間でドラッグ アンド ドロップ後に ドロップ ラベルが残っている。*|`igPivotGrid` および / または `igPivotDataSelector`™ のエリア間で項目をドラッグ アンド ドロップする場合、ドロップ ラベルが残ります。 | ![](images/positive.png)
一定の条件下のMac OS で、水平スクロールバーが表示されない|Mac OS で、「Show scrollbars only when scrolling」オプションを *true* に設定した場合、水平スクロールバーは表示されません。グリッドの水平スクロールバーはオーバーフロー時に *hidden* に設定されます。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="qr-barcode"></a> [igQRCodeBarcode](igQRCodeBarcode-Known-Issues-and-Limitations.html)

問題|説明|状態
---|---|---
プラットフォーム固有の文字がサポートされない|現在のバージョンの `igQRCodeBarcode`™ コントロールは、4 バイトでエンコードする記号をサポートしません。 | ![](images/negative.png)
Micro QR Code フォーマットがサポートされない|このコントロールは現在 Micro QR Code 標準をサポートしていません。 | ![](images/negative.png)
Structured Append モードがサポートされない|`igQRCodeBarcode` コントロールは現在、 Structured Append モードに対するサポートを提供していません。 | ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="zoombar"></a> [igZoombar](igZoombar-Known-Issues-And-Limitations.html)

問題|説明|状態
---|---|---
`igDataChart` ラジアル シリーズがサポートされない | `igZoombar`™ は水平方向のみのズームをサポートしますが、ラジアル シリーズでは両方の軸で行った場合のみサポートされます。そのため、ラジアル シリーズの `igZoombar` によるズームは正しく機能しません。 | ![](images/negative.png)
`igDataChart` で使用した場合、`igZoombar` のサムネイルが描画されない | `igZoombar` は `igDataChart` コントロールのオプション (`igZoombar` の [`target`](%%jQueryApiUrl%%/ui.igzoombar#options:target) オプションで参照されます) を使用してサムネイルを作成します。`igZoombar` は、サムネイルの乱雑さを回避するためにこれらのオプションの一部を削除します。その結果、新しいオプション セットが無効になることがあります。 | ![](images/positive.png)
`igZoombar` のクローンとターゲット ウィジェットが自動的に同期しない|`igZoombar` コントロールによりズームされたウィジェットを変更しても、クローンが自動的に更新されません。 | ![](images/positive.png)


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="infragistics-documents"></a> [Infragistics Document Engine](DocumentEngine-Known-Issues.html)

問題|説明|状態
---|---|---
名前空間の競合|Infragistics ASP.NET と %%ProductName%% のドキュメント アセンブリを併用すると、名前空間の競合による例外が発生します。 | ![](images/positive.png)


 [既知の問題点と制限の概要](#summary)を参照してください。


### <a id="templating-engine"></a> Infragistics テンプレート エンジン

<table class="table table-bordered">
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
Infragistics テンプレート機能に関する制限事項
			</td>

            <td>
入れ子になった `{{each}}` テンプレートはサポートされません。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
A-Z、a-z、0-9、_ 以外の文字は置換されず、認識されません。
			</td>

            <td>
                置換の式には、英数字、数字、アンダースコア以外の記号を入れることはできません。

                回避方法

                <blockquote>
                    許可されない文字の使用が必要な場合は、次の $.ig.regExp オプションをカスタマイズできます。レンダリング前にエンコードされるテンプレート内のすべての置換要素と一致する `$.ig.regExp.sub:/\$\{(([\w\$]+(\.|\s)?[\w\$]*)+)\}/` オプション、またはそのままレンダリングされるテンプレート内のすべての置換要素と一致する `$.ig.regExp.nonEncodeSub: /\{\{html\s+([\w\$]+(\.|\s)?[\w\$]*)+\}\}/` オプション。
					たとえば、ダッシュ (-) を使用する場合は、`$.ig.regExp.sub:/\$\{(([\w\$-]+(\.|\s)?[\w\$-]*)+)\}/`、`$.ig.regExp.nonEncodeSub:/\{\{html\s+([\w\$-]+(\.|\s)?[\w\$-]*)+\}\}/` のように変更します。
                </blockquote>
            </td>

            <td>
![](images/positive.png)
			</td>
        </tr>
    </tbody>
</table>

[既知の問題と制限の概要](#summary)を参照してください。


### <a id="popup-mobile"></a> [Popup (モバイル)](Popup-Known-Issues.html)

問題|説明|状態
---|---|---
MVC `Popup` モバイル コントロールにはバージョン 1.2 の jQuery モバイルが必要|`Popup` ウィジェットは、jQuery モバイル 1.2 で初めて導入された機能です。 | ![](images/negative.png)

[既知の問題と制限の概要](#summary)を参照してください。


### <a id="selectmenu-mobile"></a> [SelectMenu (モバイル)](SelectMenu-Known-Issues.html)

問題|説明|状態
---|---|---
メニューがカスタム ダイアログ ベースのコンテナーに収められている場合、モバイル `SelectMenu` の [`CloseText`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuModel~CloseText.html) プロパティが適用されない|ダイアログ ベースのコンテナーで、`SelectMenu` コントロールの `CloseText` プロパティを使用して閉じるボタン ツールチップのテキストを設定しても、カスタムのツールチップは表示されず、代わりにデフォルトのツールチップが表示されます。<br />これは、jQuery モバイルが、あとでアクセスできなくなるカスタムの閉じるテキストを挿入しないためです。 | ![](images/negative.png)

[既知の問題と制限の概要](#summary)を参照してください。


### <a id="slider-mobile"></a> [Slider (モバイル)](Slider-Known-Issues.html)

問題|説明|状態
---|---|---
Mobile Slider が Windows Phone 7 上でスライドしない|Windows® Phone 7 は標準のタッチ イベントをサポートしないため、スライダーは読み取り専用です。 | ![](images/positive.png)

[既知の問題と制限の概要](#summary)を参照してください。

