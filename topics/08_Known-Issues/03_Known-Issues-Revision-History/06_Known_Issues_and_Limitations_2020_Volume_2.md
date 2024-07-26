<!--
|metadata|
{
    "fileName": "known-issues-and-limitations-2020-volume-2",
    "controlName": "",
    "tags": ["Breaking Changes","Known Issues"]
}
|metadata|
-->

# 2020 Volume 2 の既知の問題と制限

## トピックの概要

### 目的

以下に %%ProductName%%™ 2020 Volume 2 リリースの既知の問題と制限事項の概要を示します ([改訂履歴](https://jp.infragistics.com/support/online-documentation/revision-history))。旧リリースに関する情報は、[こちら](Known-Issues-Revision-History.html)を参照してください。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**既知の問題点と制限の概要**](#summary)
    -   [凡例](#legend)
    -   [全般的な既知の問題](#general-known-issues)
    -   [エディターの全般的な既知の問題](#editors)
    -   [igBulletGraph](#bullet-graph)
    -   [igCombo](#combo)
	-   [igFinancialChart](#financial-chart)
    -   [igDataChart](#data-chart)
    -   [igDialog](#dialog)
	-   [igUpload](#upload)
    -   [igGrid – 全般](#grid)
    -   [igGrid – データ バインディング](#grid-data-binding)
    -   [igGrid – 非バインド列](#grid-unbound-columns)
    -   [igGrid – 仮想化](#grid-virtualization)
	-   [igGrid - レスポンス Web デザイン モード](#grid-responsive)
	-   [igGridAppendRowsOnDemand](#appendRowsOnDemand)
    -   [igGridColumnFixing](#grid-column-fixing)
    -   [igGridColumnMoving](#grid-column-moving)
    -   [igGrid - 複数列ヘッダー](#grid-multi-column-headers)
    -   [igGridFiltering](#grid-filtering)
    -   [igGridGroupBy](#grid-grouping)
    -   [igGridPaging](#grid-paging)
    -   [igGridResizing](#grid-resizing)
    -   [igGridRowSelectors](#grid-row-selectors)
    -   [igGridSelection](#grid-selection)
    -   [igGridSummaries](#grid-summaries)
    -   [igGridTooltips](#grid-tooltips)
    -   [igGridUpdating](#grid-updating)
	-   [igGridHiding](#grid-hiding)
    -   [igGridExcelExporter](#grid-exporter)
    -   [機能セレクター](#feature-chooser)
    -   [igTreeGrid](#tree-grid)
    -   [igHierarchicalGrid](#hierarchical-grid)
    -   [igHierarchicalGrid GroupBy](#hierarchical-grid-grouping)
    -   [igHierarchicalGrid RowSelectors](#hierarchical-grid-row-selectors)
    -   [igHierarchicalGrid ツールチップ](#hierarchical-grid-tooltips)
	-   [igHierarchicalGrid 更新](#hierarchical-grid-updating)
    -   [igLinearGauge](#linear-gauge)
    -   [%%ProductNameMVC%%](#mvc)
    -   [%%ProductNameMVC%% (モバイル)](#mvc-mobile)
    -   [igMap](#map)
    -   [igOlapXmlaDataSource](#olap-xmla-data-source)
    -   [igPivotDataSelector](#pivot-data-selector)
    -   [igPivotGrid](#pivot-grid)
    -   [igPopover](#popover)
    -   [igQRCodeBarcode](#qr-barcode)
	-   [igShapeChart](#shape-chart)
    -   [igValidator](#validator)
    -   [igZoombar](#zoombar)
    -   [Infragistics Document Engine](#infragistics-documents)
    -   [Infragistics テンプレート エンジン](#templating-engine)
    -   [Popup (モバイル)](#popup-mobile)
    -   [SelectMenu (モバイル)](#selectmenu-mobile)
    -   [Slider (モバイル)](#slider-mobile)
	-   [igScroll](#scroll)



## <a id="summary"></a> 既知の問題点と制限の概要

以下の表に、%%ProductName%% 2020 Volume 1 リリースの既知の問題と制限事項の概要を示します。各コントロールの既知の問題点に関するトピックでは、それぞれの既知の問題点と考えられる回避策について詳しく説明します。
<a id="legend"></a>

凡例 | 
-------|--------
![](images/positive.png) | 回避策
![](images/negative.png) | 既知の回避策はありません。
![](images/plannedFix.png) | 修正予定です

###<a id="general-known-issues"></a> 全般的な既知の問題
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
Internet Explorer 7 および 8 で、Array.prototype が一部のヘルパー関数で拡張される
			</td>

            <td>
                Internet Explorer 7 および 8 では、Array.prototype が (infragistics.util.js ファイルによって) 以下のヘルパー関数で拡張されます。

                <ul>
                    <li>
add
					</li>

                    <li>
indexOf
					</li>

                    <li>
copy
					</li>

                    <li>
contains
					</li>

                    <li>
insert
					</li>

                    <li>
RemoveAt
					</li>

                    <li>
removeItem
					</li>

                    <li>
getEnumerator
					</li>

                    <li>
count
					</li>

                    <li>
item
					</li>

                    <li>
getLength
					</li>

                    <li>
clear
					</li>

                    <li>
resize
					</li>

                    <li>
filter
					</li>

                    <li>
insertRange
					</li>

                    <li>
insertRange1
					</li>

                    <li>
clone
					</li>
                </ul>これらの関数も繰り返されるため、for-in ループを含む配列の繰り返しに影響を与えます。
            </td>

            <td>
![](images/negative.png)
			</td>
        </tr>
		<tr>
            <td>
jQuery 3.2.\* の影響
			</td>
            <td>
jQuery 3.2.\* バージョンの API 変更のため、jQuery 3.2.\* を使用する際にコントロールまたはコントロールの機能が正しく動作しない場合があります。
            </td>
            <td>
![](images/plannedFix.png)
            </td>
        </tr>
    </tbody>
</table>

### <a id="editors"></a> [エディターの一般的な既知の問題点](igEditors-LandingPage.html)

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
複数行のテキスト モードが、`<input>` ベース要素でサポートされない
			</td>

            <td>
ベース要素が `<input>` の場合、[`textMode`](%%jQueryApiUrl%%/ui.igtexteditor#options:textMode) オプションの *multiline* の設定はサポートされません。
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
ベース要素が `<textarea>` の場合、[`textMode`](%%jQueryApiUrl%%/ui.igtexteditor#options:textMode) オプションは *multiline* に設定されるため変更できません。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>
        <tr>
            <td>
フォーカスでの選択動作
			</td>

            <td>
入力要素が `<textarea>` (textMode=”multiline”) 要素の場合、カレット位置の動作に一貫性がなくなることがあります。Gecko ベース (Firefox) や WebKit ベース (Chrome、Opera、Safari) の一部のブラウザーでは、a がフォーカスされた場合、Internet Explorer のように挿入ポイントがテキストの末尾に配置されるのではなく、デフォルトでテキストの冒頭に配置されます。一貫性のある動作を得るには、[selectionOnFocus](%%jQueryApiUrl%%/ui.igTextEditor#options:selectionOnFocus) のデフォルト値を `browserDefault` ではなく `selectAll` に設定します。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>
        <tr>
            <td>
初期化後に一部のオプションの値を変更できない
			</td>

            <td>
`igTextEditor` で [`buttonType`](%%jQueryApiUrl%%/ui.igtexteditor#options:buttonType)、[`textMode`](%%jQueryApiUrl%%/ui.igtexteditor#options:textMode)、[`dropDownOnReadOnly`](%%jQueryApiUrl%%/ui.igtexteditor#options:dropDownOnReadOnly)、[`visibleItemsCount`](%%jQueryApiUrl%%/ui.igtexteditor#options:visibleItemsCount)、および [`dropDownAttachedToBody`](%%jQueryApiUrl%%/ui.igtexteditor#options:dropDownAttachedToBody) オプションの初期化後に値を変更することはサポートされていません。また、`igMaskEditor` の [`inputMask`](%%jQueryApiUrl%%/ui.igmaskeditor#options:inputMask)、[`excludeKeys`](%%jQueryApiUrl%%/ui.igmaskeditor#options:excludeKeys)、[`includeKeys`](%%jQueryApiUrl%%/ui.igmaskeditor#options:includeKeys) および `igDateEditor` の [`dateInputFormat`](%%jQueryApiUrl%%/ui.igdateeditor#options:dateInputFormat) は初期化後に値を変更できません。制限は派生型に掛かります。
			</td>

            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
日付ピッカーに固有の参照要件がある
			</td>

            <td>
`igDatePicker`™ は jquery-datepicker に依存し、`jquery.ui.datepicker.js` への参照または `jqueryui/1.12.1/jquery-ui.js` などの結合ライブラリへの参照が必要です。
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
日付エディターの最小値および最大値
			</td>

            <td>
`minValue`、`maxValue`、および `value` オプションで `new Date()` を使用すると、問題が発生する可能性があります。new Date() は時間コンポーネントをもつため、制限の評価で使用されますが、デフォルトの入力形式から解析されず、含まれません。固定日付を解析するか、時間コンポーネントを削除することを推薦します。
            </td>

            <td>
![](images/positive.png)
			</td>
        </tr>
       
               <tr>
            <td>
Android Web View (Chrome モバイルおよび Android インターネット ブラウザー) は keypress イベントを発生しない
			</td>

            <td>
           エディターの複数の機能は文字確認のために keypress イベントを使用します。その機能は、オートコンプリートおよび候補 (IME) 入力で Android ブラウザーでサポートされていません。新しい DOM3 UI イベントの仕様の代替が完了すると、それらの機能のサポートを Android デバイスで実装できます。

igTextEditor に関連するオプションは excludeKeys、includeKeys、toLower、および toUpper です。 
これにより igMaskedEditor および派生された igDateEditor に入力する場合、連続文字制限機能にも影響します。その場合もエディターが値を保存する前の検証 (Enter キーの押しまたはぼかし) は正しく機能します。
すべての数値エディターは Android デバイスで正しく機能します。
 
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>
         
        

        <tr>
            <td>
最小値および最大値の範囲以外の値
			</td>

            <td>
igEditors で minValue および maxValue オプションを使用する場合、maxValue を超えると、エディターは値を自動的に maxValue プロパティ値に設定します。minValue より小さい値を入力すると、エディターは値を自動的に minValue プロパティ値に設定します。いずれの場合もエディターで値が変更されたことを説明するメッセージが表示されます。 
         <blockquote>
**注**: この制限は、gTextEditor、igCheckboxEditor、および igMaskEditor には適用されません。
        </blockquote>
            </td>

            <td>
![](images/negative.png)
			</td>
        </tr>
    </tbody>
</table>


 [既知の問題点と制限の概要](#summary)を参照してください。

### <a id="bullet-graph"></a> [igBulletGraph](igBulletGraph-Known-Issues-and-Limitations.html)

問題|説明|状態
---|---|---
1 つのパフォーマンス バーと、1 つの比較マーカーのみがサポートされています|`igBulletGraph` コントロールは、1 つのパフォーマンス バーと 1 つの比較マーカーのみをサポートします。 | ![](images/positive.png)
ラベル競合が検出されない|`igBulletGraph` コントロールはラ、ベル競合を検出する手段を提供していません。その結果、ラベルを表示するスペースが十分にない場合は、ラベル競合が発生する可能性があります。 | ![](images/positive.png)
パフォーマンス バーは、最小スケールの位置からのみ描画することができます。|パフォーマンス バーの開始位置は、スケールの最小値の位置のみです。パフォーマンス バーを任意の場所から始めることはできません。 | ![](images/negative.png) ![](images/plannedFix.png)


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="combo"></a> [igCombo](igCombo-Known-Limitations.html)

問題|説明|状態
---|---|---
IE9 以前のバージョンでは、プレースホルダー テキストはプレビューされない|IE9 以前のバージョンでは、入力プレースホルダーが無視されます。|![](images/negative.png)
仮想化を有効にする場合は、すべての ItemTemplate 要素を同じ高さにする必要があります。|スクロールバーに不整合の問題が発生する可能性があります。 | ![](images/positive.png)


[既知の問題点と制限の概要](#summary)を参照してください。

### <a id="financial-chart"></a> [igFinancialChart](financial-chart-known-limitations.html)

問題|説明|状態
---|---|---
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
ファイナンシャル チャートをすべての価格プロパティ (High、Low、Open、Close) を持たないデータにバインドする場合、ズーム ペインにシリーズの可視化を含むには、zoomSliderType を設定する必要があります。
			</td>

            <td>
$("#chart").igFinancialChart( {dataSource: data, "zoomSliderType": "line"} )
			</td>
            <td>
![](../images/images/positive.png)
			</td>
        </tr>
<tr>
            <td>
igLoader の igDataChart と注釈モジュール
			</td>

            <td>
igLoader を使用して注釈のリソースを読み込む際にリソースのリストに igDataChart.Annotation を含む必要があります。 リソース例: "igFinancialChart.*、igDataChart.Annotation"
			</td>
            <td>
![](../images/images/positive.png)
			</td>
        </tr>
		</tbody>
</table>

[既知の問題点と制限の概要](#summary) を参照してください。

### <a id="data-chart"></a> [igDataChart](igDataChart-Known-Issues.html)

<table class="table table-striped">
	<thead>
		<tr>
            <th>
Issue
			</th>

            <th>
Description
			</th>

            <th>
Status
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
財務シリーズ チャートで先頭の項目と最後の項目が半分切れた状態で表示される
			</td>

            <td>
財務シリーズにおいて、先頭と最後の項目はチャートのビュー上にすべてが表示されず、半分にカットされた状態でプロットされます。
			</td>

            <td>
![](../images/images/negative.png)
                
![](../images/images/plannedFix.png)
			</td>
        </tr>

        <tr>
            <td>
軸範囲を変更するとチャート アニメーションが無効になる
			</td>

            <td>
チャートの Motion Framework を使用してデータの更新により Y 軸範囲が変更された場合、すべてのチャート アニメーションが無効になり新しいデータがモーション効果なしで直ちに表示されます。
			</td>

            <td>
![](../images/images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
モノリス シャドウでぼかし効果を適用できない
			</td>

            <td>
[`useSingleShadow`](%%jQueryApiUrl%%/ui.igDataChart#options:useSingleShadow) プロパティを true に設定した場合、[`shadowBlur`](%%jQueryApiUrl%%/ui.igDataChart#options:shadowBlur) 設定は無視され、ぼかしはシャドウに適用されません。これは、[Google® Chrome™ のバグ] (https://code.google.com/p/chromium/issues/detail?id=100703) に対応するための制限です。すべての主要なブラウザーで同じ動作を確実にすることが目的です。上記の Chrome のバグが解消され次第、この効果はアップデートの対象となる予定です。
                

>**回避策:**
シャドウをぼかす必要がある場合、コンパウンド シャドウを使用してください ( (`useSingleShadow = “false”`)。
                
            </td>

            <td>
![](../images/images/positive.png)
			</td>
        </tr>
	<tr>
		<td>
		    <p>Chromium ブラウザーで折れ線シリーズが塗りつぶされた図形のように見える場合がある</p>
		</td>
		
		<td>
		    <p>これは、<a href="https://code.google.com/p/chromium/issues/detail?id=412640" target="_blank">Chromium のキャンバスのレンダリングの問題</a> (Google® Chrome™ や Opera などのブラウザーに影響がある) が原因です。</p>
		</td>
		
		<td>
		    <p><img alt="" src="../images/images/negative.png"></p>
		</td>
	</tr>
	<tr>
		<td>
		    <p>DataChart の ASP.NET MVC ヘルパーで AddClientEvent メソッドは利用できません。</p>
		</td>
		
		<td>
		    <p>DataChart の ASP.NET MVC ヘルパーで AddClientEvent メソッドは利用できません。</p>
		</td>
		
		<td>
		    <p><img alt="" src="../images/images/negative.png"></p>
		</td>
	</tr>
	<tr>
		<td>
		    <p>DataChart で CategoryDateTimeXAxis または TimeXAxis を使用してシリーズをプロットする場合、複数のデータ ソースの項目を配置しません。</p>
		</td>
		
		<td>
		    <p>データ項目を配置するには、データ ソースに相対する項目がない場合、null 項目を挿入します。</p>
		</td>
		
		<td>
		    <p></p>
		</td>
	</tr>    </tbody>
</table>


[既知の問題点と制限の概要](#summary) を参照してください。

#### <a id="dialog"></a> [igDialog](igDialog-Known-Issues.html)

問題|説明|状態
------|-------------|-------
`igDialog` の内部情報と幅や高さの情報に関連性がある場合、コントロールのサイズが正しく設定されない|`igDialog` 内部のコントロールは、表示される幅や高さの情報と相対的であると正しいディメンションにはなりません。これは、`igDialog` が表示される前に、埋め込まれたコントロールのインスタンスが作成されるため、コントロールのディメンションを正しく計算できないことが原因です。 | ![](images/positive.png)
埋め込み iframe (`igHtmlEditor` などのコントロールを含めて) の再読み込みにより、コンテンツを失う場合があります。|`igDialog` の最大化、最小化がコンテンツのフレーム要素 (`igHtmlEditor` などのコントロールも) の再読み込みを引き起こすことがあります。これは、ドキュメント本文の下に配置するためにダイアログが DOM で移動されるためです。構成によっては、ピン固定で同様の動作が可能です。 | ![](images/positive.png)


 [既知の問題点と制限の概要](#summary)を参照してください。
 
#### <a id="upload"></a> [igUpload](igUpload-Known-Issues.html)

問題|説明|状態
------|-------------|-------
パイプライン モードでクラシックおよびトレースを有効にしている場合、大きいファイル (50kb 以上) のアップロードが失敗する。|これは、サード パーティの問題です。Microsoft のサイトに掲載されたログでこの問題を詳しく確認できます。詳細は、[こちら](https://connect.microsoft.com/VisualStudio/feedback/details/1008381/readentitybody-returns-0-bytes-in-iis-7-5-when-pipelinemode-is-classic-and-trace-is-enabled) を参照してください。 | ![](images/positive.png)
Internet Explorer 10/11 で Windows 認証モードが有効で、IE の HTTP keep-alive タイムアウトが切れると、ファイルのアップロードが失敗する|これは IE のサード パーティ問題で、詳細については[ここ](https://connect.microsoft.com/IE/feedback/details/819941/file-upload-stop-working-on-ie-with-windows-authentication)を参照してください。回避策として、接続を保持するには特定の期間にサーバーへ POST 要求を送信できます。たとえば、keep-alive を 120 秒に設定した場合、最初のアップロードの後に要求を 90 秒ごとにトリガーします。| ![](images/positive.png)

 [既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid"></a> [igGrid – 全般](igGrid-Known-Issues.html#grid-general)

問題|説明|状態
---|---|---
rowTemplate オプションの非推奨|14.1 リリースより [`rowTemplate`](%%jQueryApiUrl%%/ui.iggrid#options:rowTemplate) オプションは非推奨となります。これは以前のバージョンの機能の重大な変更です。`igGrid`™ は、現在、列テンプレートを個別の列テンプレートに対して使用します。 | ![](images/negative.png)
列のキャプションが複数の行にラップされない|列キャプション ([`igGrid.headerText`](%%jQueryApiUrl%%/ui.iggrid#options:headerText)) は、複数の行にラップされません。これは以前のバージョンの機能の重大な変更です。 | ![](images/positive.png)
タッチ ポイントを特定の UI 要素の上をスライドする時に、動作が一貫性を欠く|タッチ ポイントが特定の UI 要素の上をスライドする時に、グリッドと機能の動作が一致しない場合があります。 | ![](images/positive.png)
混在 / 部分の列幅の設定がサポートされない|列幅の一部をパーセント値で定義し、その他の列幅をピクセルで定義する (または列幅を定義しない)設定はサポートされません。 | ![](images/positive.png)
IE 7 で、グリッドのヘッダーとフッターが正しく描画されない|グリッド幅が指定されていない場合、表示されるヘッダー要素とフッター要素の幅は、Microsoft® Internet Explorer® 7 のグリッドの幅より短くなります。 | ![](images/positive.png)
`<div>` 要素で、グリッド機能の API 呼び出しが正しく動作しない|グリッドのインスタンスを `<div>` 要素で作成した場合、グリッドの機能に対する API 呼び出しは機能しません。 | ![](images/positive.png)
Android 4.0.2 で、レコードの背後にダイアログ / ポップアップが表示される|igGrid の垂直スクロールを有効にして、`igGrid` を Android のバージョン 4.0.2 で実行している場合、ポップアップ / ダイアログはすべてレコードの背後に表示されます。 | ![](images/positive.png)
ヘッダー、フッター、およびコンテンツを結合した高さがオプションの高さ設定以上の場合に、`igGrid` が再初期化される | `igGrid` のヘッダー、フッター、およびコンテンツの高さの合計が、オプションで設定された高さよりも大きい場合、`igGrid` ウィジェットは、ヘッダー、フッター、およびコンテンツが表示できる高さになるよう新しい高さで再初期化されます。 | ![](images/positive.png)
showHeader オプションが正しく動作しない|グリッドの初期化で [`showHeader`](%%jQueryApiUrl%%/ui.iggrid#options:showHeader) オプションが *false* に設定されている場合、API を使用してそれを *true* のランタイムに設定すると、ヘッダーが表示されません。 | ![](images/positive.png)
Mac OS での水平スクロールバーの表示の問題|Mac OS® で、*Show scrollbars only when scrolling* オプションを *true* に設定した場合、グリッドの水平スクロールバーは表示されません。これは、グリッドの水平スクロールバーで、`overflow` が *hidden* に設定されているためです。 | ![](images/positive.png)
自動生成の列で、ソースはキー / 値ペアが含まれている必要がある|グリッドの列が自動生成の場合 (たとえば、[autoGenerateColumns](%%jQueryApiUrl%%/ui.iggrid#options:autoGenerateColumns) が有効な場合)、ソースは常にキー / 値のペアを含む必要があります。含まれていない場合は、グリッドが正しく描画されない可能性があります。 | ![](images/positive.png)
機能を複数回定義できない|**JavaScript の場合:**<br />`igGrid` と `igHierarchicalGrid`™ のいずれの場合も、1 つの機能を複数回定義するとエラーがスローされます。<br />**MVC の場合:**<br />`igGrid` と `igHierarchicalGrid` のいずれの場合も、MVC ラッパーで機能を複数回定義すると、最後の定義のみが取り入れられます。 | ![](images/negative.png)
チェックボックスの表示が、テンプレート (行および列) と一致しない|テンプレート機能を使用し、`renderCheckboxes` オプションを true に設定した場合、ブール値の列にテンプレートが定義されているかどうかをチェックできないため、ブール値の列にはチェックボックスが表示されません。 | ![](images/positive.png)
行テンプレートで、テーブルの行に属性を設定できない|`igGrid` と `igHierarchicalGrid` のいずれの場合も、行テンプレートを使用してテーブルの行に属性を設定することはできません。 | ![](images/positive.png)
API メソッドの呼び出しは関連イベントを直接発生させません。 | プログラムによる API メソッドの呼び出しはその操作に関連するイベントを発生させません。イベントは個別のユーザー操作によってのみ発生します。| ![](images/negative.png)
KnockoutJS の監視可能な配列関数の制限|`unshift`、`reverse`、および `sort` の監視可能な配列関数を使用すると、グリッドが正しく表示されません。 | ![](images/positive.png)
id 属性は、DOM コントロール プレースホルダーで必須|id 属性は、グリッドが初期化される DOM 要素に設定する必要があります。グリッドは、jQuery セレクターを内部で使用して選択を高速化します。| ![](images/negative.png)
スペースを含む列のキーはサポートされない|列のキーは、一部の DOM 要素の ID の生成に使用されます。<a href="http://www.w3.org/TR/html5/dom.html#the-id-attribute" target="_blank">HTML 5 仕様</a>により、HTML id 属性にスペースを入れることはできません。| ![](images/negative.png)
contextMenu イベントは cellRightClick に名前変更しました|イベント名は発生する操作を説明します。|![](images/negative.png)
ヘッダー テキストおよび並べ替え / フィルター処理 /ギアのアイコンは、IE8 で正しく配置されない。|これは、css calc() をサポートしない IE8 によるブラウザーの制限です。詳細は、http://caniuse.com/#feat=calc を参照してください。| ![](images/negative.png)
igGrid では特殊記号 ([、]、\、(、) など) を含む列キーがサポートされない|列キーは多くのグリッド機能で、内部の jQuery セレクターに使用されます。現在、セレクターがエスケープされないため、特殊記号を使用するとセレクターが正しく動作しなくなります。 | ![](images/positive.png)
Microsoft の日付形式はサポートされません。 | igDataSource は Microsoft 日付形式をサポートしません: (`"/Date(1234656000000)/"`)。 提供されたデータ ソースがこのような日付を含む場合、ISO UTC 形式 `"2009-02-15T00:00:00Z"` に変更する必要があります。この変更は `igGrid`、`igHierarchicalGrid`、および `igTreeGrid` に適用します。 | ![](images/negative.png)
タッチ環境で選択が有効な igGrid でスクロールする場合、IE11 でページをスクロールできません。 | 選択機能は IE でポインター イベントのデフォルト動作を無効にするために "-ms-touch-action: none" を適用します。これでページをスクロールする代わりにユーザーがセルをタッチしてドラッグできます。 | ![](images/negative.png)
水平スクロールバーで仮想化していないグリッドの終了までスクロール後、垂直スクロールバーで垂直方向にスクロールする動作は、 Edge ブラウザーで正しく機能しません。 | ブラウザーのデフォルト垂直スクロールバーが水平スクロールバーが右端にある場合に正しく動作しません。igGrid のスクロール領域で非表示のオーバーフローがある場合のサードパーティー (Microsoft) による問題です。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-data-binding"></a> [igGrid – データ バインディング](igGrid-Known-Issues.html#data-binding)

問題|説明|状態
---|---|---
`DataTable`/`DataSet` へのバインドを、更新機能と同時に使用する場合は、[LoadTransaction](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~LoadTransactions.html) メソッドを `GridModel` でオーバーライドする必要がある|`igGrid` を `DataTable` または `DataSet` にバインドすると同時に、更新機能を使用する場合、`GridModel` は、JSON に対する `Dictionary<string, string>` の逆シリアル化をサポートするシリアライザーを使用して、`LoadTransaction()` メソッドをオーバーライドする必要があります。 | ![](images/positive.png)
データ テーブル / セットへのバインドで、リモートのフィルタリング、並べ替え、集計、およびグループ化がサポートされない|グリッドを `DataTable` または `DataSet` にバインドしている場合、並び替え、フィルタリング、および Group By 機能のローカル構成を使用する可能性がありますが、並び替えとフィルタリングでは、リモート構成の回避策が利用できます。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-unbound-columns"></a> [igGrid – 非バインド列](igGrid-Known-Issues.html#unbound-columns)

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
非バインド列では、並び替え、フィルタリング、および Group By 機能をサポートしていません。[Columns](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~Columns.html) コレクションに含まれる非バインド列では、上記の機能は無効です。
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
仮想化を使用している場合、グリッドが誤って一番上にスクロールする
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
リモート データを使用している時、ブール値の非バインド列が正しく生成されない
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
特定の状況では `igGrid` の [`getUnboundValues`](%%jQueryApiUrl%%/ui.iggrid#methods:getUnboundValues) メソッドが非バインド値を返さない
			</td>
            <td>
非バインド値が `dataBound` クライアント側イベントを介して設定される場合、`getUnboundValues()` クライアント API メソッドを使用しても非バインド値は返されません。
			</td>
            <td>
![](images/negative.png)
			</td>
        </tr>
        <tr>
            <td>
並べ替え、フィルタリング、グループ化の状態は永続化されません
			</td>
            <td>
並べ替え、フィルタリング、および GroupBy は、非バインド列に適用すると、その状態を保持しません。

機能の永続化が有効 (デフォルト) で、非バインド列がグループ化/並べ替え/フィルターされた場合、`igGrid` の  `dataBind()` を起動した後:

                <ul>
                    <li>
**GroupBy** - 列はグループ化されません
					</li>

                    <li>
**Filtering** - 非バインド列のフィルタリング式がクリアされます
					</li>

                    <li>
**Sorting** - 非バインド列に適用された並べ替えが削除されます
					</li>
                </ul>
            </td>

            <td>
![](images/positive.png)
			</td>
        </tr>
    </tbody>
</table>


 [既知の問題点と制限の概要](#summary)を参照してください。

### <a id="grid-virtualization"></a> [igGrid – 仮想化](igGrid-Known-Issues.html)

問題|説明|状態
---|---|---
固定ヘッダーが常に有効になる (制限)|仮想化が有効な場合、変更できない [fixedHeaders](%%jQueryApiUrl%%/ui.iggrid#options:fixedHeaders) オプションのフォームに制限があり、常に true に設定されます。 | ![](images/negative.png)
グリッドの高さ設定に制限がある|igGrid の高さは常に、行の平均の高さで割り切れる値でなければなりません。(割り算の剰余はゼロでなければなりません。) | ![](images/negative.png)
列の可視の幅の設定に制限がある|列の表示幅は、igGrid の幅と等しくなければなりません (列の仮想化の場合)。 | ![](images/negative.png)
列の仮想化に対して、キーボード ナビゲーションがサポートされない (制限)|列の仮想化に対して、キーボード ナビゲーションはサポートされていません。 | ![](images/negative.png)
セル クラス適用の制限|特定のセルのクラスをソートされた列のすべてのセルに適用する処理はサポートされていません。即ち、[applySortedColumnCss](%%jQueryApiUrl%%/ui.iggridsorting#options:applySortedColumnCss) は自動的に false に設定されます。 | ![](images/negative.png)
仮想化を有効にすると、autofitLastColumn が無効になる|仮想化を有効にすると、[autofitLastColumn](%%jQueryApiUrl%%/ui.iggrid#options:autofitLastColumn) は無効になり、列幅の合計がグリッド幅よりも小さい場合、列は拡張されグリッド全体を占有することになります (autofitLastColumn が true に設定された場合と同じように動作します)。 | ![](images/negative.png)
グリッドの幅がパーセンテージで定義されている場合、列の仮想化が機能しない|グリッドの幅がパーセンテージで定義され、列の仮想化が有効な場合 ([columnVirtualization](%%jQueryApiUrl%%/ui.iggrid#options:columnVirtualization) = true)、水平スクロールバーが表示されません。 | ![](images/negative.png)
固定仮想化は RWD モードでサポートされていません|固定仮想化は、行の高さが定数であることが必要です。行の高さが変更する場合、固定仮想化は正しく操作しません。RWD モードは、画面サイズによって行の高さが変更するため、固定仮想化は正しく動作しません。 | ![](images/positive.png)
列仮想化は連続仮想化でサポートされていません。|列仮想化は固定仮想化のみでサポートされています。列仮想化が有効 ([columnVirtualization](%%jQueryApiUrl%%/ui.iggrid#options:columnVirtualization) = true) な場合、仮想化モードを "fixed" ([virtualizationMode](%%jQueryApiUrl%%/ui.iggrid#options:virtualizationMode) = "fixed") に設定する必要があります。 | ![](images/negative.png)
列の仮想化と自動サイズ変更がサポートされていない。|width オプションを「*」に設定することによる列の自動サイズ変更は、仮想化でサポートされていません。 | ![](images/negative.png)
列仮想化で列セッターが機能しない|列セッター  ($(".selector").igGrid("option", "columns", [/*columns definition*/]);) を使用すると水平方向のスクロールバーが非表示されます。 | ![](images/negative.png)
固定仮想化が有効な場合、グリッドのコンテンツ以外から行にタブすると、グリッドの実際の最初の行の代わりに最初の表示可能な行をフォーカスします。|固定仮想化が有効な場合、グリッドのコンテンツ以外から行内にタブすると、最初の表示可能な行がフォーカスされます。フォーカスがグリッドの後の要素にあって、Shift + Tab が押された場合、フォーカスは最後の表示可能なセルに設定されます。|![](images/negative.png)
列仮想化の場合、列幅の設定が使用されていません。 | 水平方向のスクロールでコンテンツが列間で移動されますが、表示可能な列幅は変更されないため、列幅の設定を変更してもほとんど影響しません。 |![](images/negative.png)

### <a id="grid-responsive"></a> [igGrid - レスポンス Web デザイン モード](igGrid-Known-Issues.html)

問題|説明|状態
---|---|---
RWD モードは IE8 でサポートされない | RWD は IE8 でモードを決定できません。この機能はモバイル互換性を対象するので、IE8 でサポートされません。 | ![](images/negative.png)
RWD 単一列のテンプレートはページング以外のグリッド機能でサポートされない | RWD 単一列のテンプレートはページングのグリッド機能でのみサポートされます。その他のグリッド機能は現在このモードでサポートされません。 | ![](images/negative.png)
モバイル タッチ デバイスで、レスポンス機能が有効化された場合、デバイスを回転すると igGrid のカスタム スクロールバーが更新されない | レスポンス機能が有効化された場合、デバイスを回転するとカスタム スクロールバーの高さ及び幅が正しくが更新されません。 | ![](images/plannedFix.png)
RWD モードが固定行仮想化および列仮想化でサポートされない | RWD モードは連続仮想化のみをサポートします。 |![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。

## <a id="appendRowsOnDemand"></a> igGridAppendRowsOnDemand

問題|説明|状態
------|-------------|-------
モバイル タッチ オンリー環境で AppendRowsOnDemand が機能しない|タッチ オンリー環境でロードされたチャンクの終わりに到達すると (loadTrigger: "auto")、新しいデータがロードされない タッチ環境で、loadTrigger オプションを button に設定すると、Load more data ボタンにスクロールできない | ![](images/plannedFix.png)

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
一部の igGrid 機能で、列固定がサポートされない
			</td>

            <td>
                igGrid の列固定機能は、以下の機能では動作しません。

                <ul>

                    <li>
グループ化 (別名 Group By)
					</li>

                    <li>
(レスポンシブ Web デザイン (RWD) モード (別名: Responsive)
					</li>

                    <li>
Knockout ライブラリ (KnockoutJS) の結合
					</li>

                    <li>
非バインド列
					</li>
                </ul>

                これらの機能と列固定機能の統合は、次期ボリューム リリースで実装される予定です。
            </td>

            <td>
![](images/negative.png)
                

                
                    ![](images/plannedFix.png)
			</td>
        </tr>

        <tr>
            <td>
IE9+ での行の固定部分と固定解除部分との不整合
			</td>

            <td>
Internet Explorer 9 以降で、igGrid で大量なレコードのある列を固定してグリッドの中央へスクロールすると、行の固定部分と固定解除部分との間に不整合が生じます。この問題は、
                    IE9 のエンジンが原因です。
			</td>

            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
列の幅が必須で、ピクセル単位で定義する必要がある
			</td>

            <td>
列の幅は必須で、ピクセル単位で定義することが推薦されています。明示的に設定するか、[defaultColumnWidth](%%jQueryApiUrl%%/ui.iggrid#options:defaultColumnWidth) オプションを使用できます。グリッド幅はピクセルまたはパーセンテージ単位で設定してください。			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
列の固定を解除し、連続仮想化を有効にすると、グリッドは最上部までスクロールしてしまう
			</td>

            <td>
連続仮想化を有効にし、列の固定を解除すると、グリッドは最上部までスクロールします。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>
		<tr>  
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
            <td>
Chrome および Safari でグリッドに長いテキストを持つキャプションが定義される場合、固定列のヘッダーの幅がキャプションの長さに引き伸び、列固定の解除ボタンが表示されないことがある
			</td>

            <td>
これは Chrome および Safari のサード パーティ問題です。これらのブラウザーでは、固定ヘッダーを含む thead 要素はキャプションの全体幅に引き伸ばされます。このため、列幅がキャプション幅より小さい場合、固定の解除ボタンがヘッダーの表示領域以外に移動する場合があります。その他のブラウザーが固定グリッド領域に同じ列幅を保持するため、この問題は起こりません。	    </td>

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
選択が行セレクターにより実行される場合、グリッドは行の固定されていない部分にフォーカスを適用します。
		</td>
		<td>
これは、レコードが 2 つの行 (固定部分および固定されていない部分) に分割されることに関連します。ページで単一の要素のみフォーカスできます。
		</td>
		<td>
![](images/negative.png)
		</td>
	</tr>
	<tr>
		<td>
モバイル デバイスで列固定が有効化された場合、固定されたコンテナをスクロールすると非固定エリアのスクロールバーが表示されない
		</td>
		<td>
固定されたエリアをスクロールすると、固定されていないエリアのカスタムのスクロールバーが非表示になります。
		</td>
		<td>
![](images/negative.png)
		</td>
	</tr>
	<tr>
		<td>
タッチ デバイスで固定エリアと非固定エリアを同時にスクロールする機能がサポートされません。
		</td>
		<td>
一方のエリアのみのスクロールが可能です。
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
列移動が列仮想化と機能しない | 列移動は行仮想化のみでサポートされています。 | ![](images/negative.png)


 [既知の問題点と制限の概要](#summary)を参照してください。

### <a id="grid-multi-column-headers"></a> [igGrid - 複数列ヘッダー](igGrid-Known-Issues.html)

問題|説明|状態
------|-------------|-------
複数列ヘッダー機能は `columnVirtualization` ではサポートされない|仮想化および複数列ヘッダー機能が有効の場合、`rowVirtualization` のみが統合されます。列仮想化はこのシナリオではサポートしていません。 | ![](images/negative.png)
縮小可能な列グループのマルチ列ヘッダー機能が列非表示でサポートされない|のマルチ列ヘッダーおよび縮小可能な列グループ機能が有効化された場合、列の非表示がサポートされません。 | ![](images/negative.png)
[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-filtering"></a> [igGridFiltering](igGrid-Known-Issues.html)

問題|説明|状態
------|-------------|-------
簡易フィルタリングが列の仮想化で機能しない| フィルター モードを「simple」に設定すると、列の仮想化が機能しません。 ([columnVirtualization](%%jQueryApiUrl%%/ui.iggrid#options:columnVirtualization) = true) | ![](images/positive.png)
詳細フィルタリングが、OR フィルタリング式と一緒に機能しない|oData プロトコルは OR フィルタリング式をサポートしておらず、詳細フィルタリングは AND フィルタリング式を併用した場合のみ使用できます。 | ![](images/negative.png)
時刻列のフィルタリングが秒とミリ秒で正しく動作しません。 | 時刻列のフィルタリングが特定の書式設定でのみ動作します。詳細については、[timeDisplayFormat](%%jQueryApiUrl%%/ui.igTimePicker#options:timeDisplayFormat) を参照してください。 | ![](images/negative.png)

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
列内の値はグループ化されるが、正しく表示されない|[`autoGenerateColumns`](%%jQueryApiUrl%%/ui.iggrid#options:autoGenerateColumns) が *true* に設定され、列が初期化でグループ化されている場合、列の値はグループ化されますが、正しく表示されません。 | ![](images/positive.png)
`groupedColumnsChanged` イベントの入力引数の `ui.groupedColumns` が空き状態である|列をグループ化領域にドラッグしてグループ化した場合、[`groupedColumnsChanged`](%%jQueryApiUrl%%/ui.iggridgroupby#events:groupedColumnsChanged) イベントの `ui.groupedColumns` 入力の引数が空き状態になる場合があります。 | ![](images/positive.png)
グループ化のモーダル ダイアログ内の `igTree` のタップが正しく機能しない|Android 4.0 で、グループ化のモーダル ダイアログ内のドロップダウンをタップすると、レイアウトの問題が発生する場合があります。この問題は、ツリーが部分的に表示されており、垂直または水平スクロールを行った場合に発生します。 | ![](images/positive.png)
グループ化が固定仮想化を使用しても機能しない|`igGrid` の GroupBy 機能は、固定仮想化を使用しても機能しません。 | ![](images/negative.png)
Firefox で列を非表示にするとグリッドが縮小される|GroupBy 機能が有効で `igGrid` が定義された列幅を持たない場合、列を非表示にすると Firefox ブラウザーのグリッドが縮小されます。 | ![](images/positive.png)
リモート グループ化がリモート ページングと正しく動作しません。 | リモート ページングおよびリモート グループ化が有効な場合、ページ カウントおよびページ サイズが正しくなくなります。| ![](images/negative.png)


[既知の問題点と制限の概要](#summary)を参照してください。

### <a id="grid-paging"></a> [igGridPaging](igGrid-Known-Issues.html#paging)

問題|説明|状態
---|---|---
実行時にページング イベントが発生しない|`igGrid` のページング イベントは、UI がページング操作をトリガーした場合のみ発生します。ページング オプションをランタイムで設定した場合は発生しません。 | ![](images/positive.png)


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-resizing"></a> [igGridResizing](igGrid-Known-Issues.html#resizing)

問題|説明|状態
---|---|---
サイズ変更が、古い jQuery バージョンで機能しない|`igGrid` のサイズ変更は、jQuery のバージョン 1.8.0 ～ 1.8.5 ではサポートされていません。 | ![](images/positive.png)
サイズ変更が固定仮想化および列仮想化を使用した場合に機能しない|固定仮想化および列 (またはどちらか)の仮想化が有効になっていると、列のサイズ変更機能は動作しません。| ![](images/positive.png)
Firefox で列幅が設定されていないと、列のサイズ変更が正しく実行されない|Firefox のバグにより、列幅が設定されていない場合 `igGrid` 列を適切にサイズ変更できません。 | ![](images/negative.png)
Firefox で相対的な列幅が設定されていないと、列のサイズ変更が正しく実行されない|列幅を相対的に (パーセント値で) 設定していない場合、Firefox のバグにより、`igGrid` 列のサイズを正しく変更できません。 | ![](images/positive.png)
グリッドが右側にスクロールされた場合、列のサイズ変更がより速いスピードで実行される|グリッドが右側にスクロールされた場合、列を右端から左へドラッグしてサイズ変更すると、サイズ変更スピードはより速くなります。この動作はブラウザーのレイアウト エンジンによるものです。|![](images/negative.png)
列自動サイズ調整の制限| グリッドの table 要素に 'white-space: nowrap' CSS ルールを明示的に設定した長いテキストを含むグリッド列が、ダブルクリックによって正しくサイズ変更されません。CSS で `tr td { white-space: nowrap; }` などのより包括的なセレクターを指定、あるいは列が自動生成されない場合、相対する列に `columnCssClass` オプションを設定できます。 |![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。

### <a id="grid-row-selectors"></a> [igGridRowSelectors](igGrid-Known-Issues.html#row-selectors)

問題|説明|状態
---|---|---
列仮想化で行セレクターが操作しない|列仮想化のコンテキストでは、列セレクターはサポートされません。これは今後のリリースで実装される予定です。 | ![](images/negative.png) ![](images/plannedFix.png)
`igGridRowSelectors` ウィジェットでは、選択機能を有効にする必要がある|`igGridRowSelectors` ウィジェットの [`requireSelection`](%%jQueryApiUrl%%/ui.iggridrowselectors#options:requireSelection) オプションは、デフォルトで *true* に設定されています。また行セレクターの使用に選択機能が必要なことを示す例外をスローします。 | ![](images/positive.png)
IE 9 で選択機能が正しく動作しない|Internet Explorer 9 では、テーブルが大き過ぎるとページに垂直スクロールバーが表示されますが、バーを下にスクロールすると、チェックボックスの有無に関係なく、`RowSelectors` を使用した選択が正しく動作しません。グリッドがフォーカスを得ると、Internet Explorer 9 がページを上方にスクロールして戻すため、選択が誤った行に適用される、またはまったく適用されません。 | ![](images/negative.png)
選択機能を自動的に有効にできない|選択機能の自動有効化は機能しません。`RowSelectors` に全機能を持たせるために、選択ウィジェットでが必要です。 | ![](images/positive.png)
[すべて選択](igGrid-Configuring-Row-Selectors.html#select-all-pages) 機能はリモート ページング機能をサポートしません。|[`enableSelectAllForPaging`](%%jQueryApiUrl%%/ui.iggridrowselectors#options:enableSelectAllForPaging) オプションはリモート ページングで正しく機能しません。 | ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-selection"></a> [igGridSelection](igGrid-Known-Issues.html#selection)

問題|説明|状態
---|---|---
iOS でのセル選択が適切に動作しない|iOS で`igGrid` をスクロールする場合は、最初にセルをタップし、スクロールしたい方向にスワイプする必要があります。iOS と Android では jQuery モバイルによるスクロール イベントの処理方法が異なるため、`igGrid` のスクロール動作には違いがあります。 | ![](images/negative.png)
連続的仮想化が有効になっている場合、行 / セルを選択すると選択が不正になる|連続的仮想化が有効な場合に `igGrid` の行 / セルを選択すると、jQuery バージョン 1.6.4 のバグによりグリッドがスクロール ダウンし、異なる行 / セルが選択されます。この問題は、このバージョンの jQuery ライブラリのみで発生します。 | ![](images/positive.png)
選択機能が有効な場合にテキスト選択が正しく動作しません。|選択機能が selectStart イベントをキャンセルしてグリッド内のテキスト選択を無効にするため、セル テキストは選択できません。 | ![](images/positive.png)
IE で行を選択すると、垂直スクロールバーを持つグリッドで行が左側にスクロールされます。 | IE で行を選択すると、行にフォーカスが適用され、`igGrid` が左側にスクロールされます。 | ![](images/positive.png)
列の仮想化に対して、キーボード ナビゲーションがサポートされない | 列の仮想化に対して、キーボード ナビゲーションはサポートされていません。 | ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-summaries"></a> [igGridSummaries](igGrid-Known-Issues.html#summaries)

問題|説明|状態
---|---|---
リモート データを使用したカスタム集計の使用時の制限|ASP.NET MVC ヘルパー ラッパーは、デフォルトでカスタム サマリーを処理できません。したがって、カスタム サマリーを別に作成して、計算する必要があります。 | ![](images/positive.png)
基本の数値フォーマットのみのサポート|[`summaryFormat`](%%jQueryApiUrl%%/ui.iggridgroupby#options:summarySettings.summaryFormat) プロパティは基本の数値フォーマットのみをサポートします。たとえば、$ .00 のような形式は「$」記号を表示することはできません。 | ![](images/negative.png)
カスタム メソッド設定時の制限|カスタム メソッドを設定する場合は、順序および集計オペランドの [`summaryCalculator`](%%jQueryApiUrl%%/ui.iggridsummaries#options:columnSettings.summaryOperands.summaryCalculator) オプションの設定を強く推奨します。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-tooltips"></a> [igGridTooltips](igGrid-Known-Issues.html#tooltips)

問題|説明|状態
---|---|---
ポインターをセル上で移動する速度が速すぎる場合のツールチップの表示の問題|ユーザーがコントロールでマウスを素早く動かすと、ツールチップのフェード アニメーションがツールチップを表示 / 非表示する処理速度が遅くなり、値が非常に小さい場合は表示の問題が発生することがあります。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-exporter"></a> [igGridExcelExporter](igGridExcelExporter-Overview.html)

問題|説明|状態
---|---|---
IE9 およびそれ以前のバージョンでファイルのエクスポートが正しく動作しない|GridExcelExporter が Blob オブジェクトを使用してエクスポートされたワークシートの行データを保持する機能が IE9 およびそれ以前でサポートされません。https://developer.mozilla.org/ja/docs/Web/API/Blob | ![](images/negative.png)
オンデマンドによる行追加またはリモート ページングではデータ部分のみエクスポートされます。|GridExcelExporter は完全にクライアント側コンポーネントのため、クライアントで利用可能なデータのみを使用します。リモート ページングおよびオンデマンドによる行追加を実装する場合、データが追加要求によって取得されるため、このデータはエクスポートされません。 | ![](images/positive.png)
カスタムフィルタリング条件がエクスポートしたワークシートに適用されない | igGrid のカスタム フィルタリング条件は、ネイティブの Excel フィルタリング条件で利用できないたため、エクスポートしたワークシートには適用されません。| ![](images/negative.png)
[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="grid-updating"></a> [igGridUpdating](igGrid-Known-Issues.html#updating)

問題|説明|状態
---|---|---
更新と仮想化の機能を有効にして新しい行を追加するには、即時コミットが必要である|[`autoCommit`](%%jQueryApiUrl%%/ui.iggrid#options:autoCommit) を無効にして、更新と仮想化の機能を有効にした場合、新しい行の追加はサポートされません。`autoCommit` が *false* の場合、新たに追加された行は仮想化されません。 | ![](images/positive.png)
Excel ナビゲーション モードは、セル編集モードでのみサポートされます。|[`excelNavigationMode`](%%jQueryApiUrl%%/ui.iggridupdating#options:excelNavigationMode) を有効にした場合、矢印を使用したナビゲーションは、"cell" [`editMode`](%%jQueryApiUrl%%/ui.iggridupdating#options:editMode) でのみ実行できます。その他すべての編集モード (*row*、*rowedittemplate*、*none*、*null*) は `excelNavigationMode` でサポートされません。 | ![](images/negative.png)
グループ化されている場合に、仮想グリッドの追加および更新が機能しない|仮想グリッドの GroupBy および更新の使用で、グリッドがグループ化されている場合、行の更新または追加は機能しなくなります。グループ化を解除すると、グリッド レコードの最下部に新しいレコードが追加されます。 | ![](images/negative.png)
[`autoCommit`](%%jQueryApiUrl%%/ui.iggrid#options:autoCommit) を無効にして、更新と連続仮想化の機能を有効にした場合、行/セルの更新はサポートされません。|[`autoCommit`](%%jQueryApiUrl%%/ui.iggrid#options:autoCommit) グリッド オプションが false で連続仮想化が有効な場合に、更新機能で行/セルを編集すると、例外が発生します。 | ![](images/positive.png)
列の仮想化に対して、キーボード ナビゲーションがサポートされない | 列の仮想化に対して、キーボード ナビゲーションはサポートされていません。 | ![](images/negative.png)
jQuery 3.2.1 および IE 11 で新規行のエディターの高さが正しくありません。| jQuery 3.2.1 を使用する場合、IE11 で新規行のエディターを使用できません | ![](images/positive.png)
時刻列値の更新は秒とミリ秒で正しく動作しません。 | 時刻列の更新は特定の書式設定でのみ動作します。詳細については、[timeInputFormat](%%jQueryApiUrl%%/ui.igTimePicker#options:timeInputFormat) を参照してください。| ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。

### <a id="grid-hiding"></a> igGridHiding

問題 | 説明 | 状態
---|---|---
MultiColumnHeaders がある場合、列非表示インジケーターが正しく表示されません。| ルート ヘッダー要素を非表示の場合、非表示インジケーターが他の表示列グループの下に表示されるため、非表示列がそのグループに属しているような誤解を招く可能性があります。| ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。

### <a id="feature-chooser"></a>[機能セレクター](igGrid-Known-Issues.html#feature-chooser)

問題|説明|状態
------|-------------|-------
機能またはそのオプションのいずれかが初期化の後に変更された場合、変更は機能セレクターで表示されません。|機能セレクターは初期化で一度に描画され、後に機能が変更されても、影響されません。|![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。

### <a id="tree-grid"></a>[igTreeGrid](igTreeGrid-Known-Issues-And-Limitations.html)

問題|説明|状態
------|-------------|-------
リモート機能により、展開インジケーターがトリミングされたり、非表示になることがある。|階層の低いレベルの展開インジケーターでは、リモート シナリオ内の個別のインジケーターの非データ列に描画されると、トリミングや非表示になる場合があります。|![](images/positive.png)
低いレベルの最初のセルのデータが正しく配置されない|低いレベルでのパディングは、表示されたデータをセルの使用可能な幅を越えてプッシュするため、テキストが最初の位置に折り返される原因になり、視覚的な階層構造を壊します。|![](images/positive.png)
ページング (allLevels) を使用した rowVirtualization モードで列を展開 / 縮小すると、スクロールの位置が変わります。|rowVirtualization と [`mode`](%%jQueryApiUrl%%/ui.igtreegrid#options:mode) が `allLevels` に設定されたページングが有効な場合、スクロールの位置が行の展開/縮小によって変更されます。| ![](images/negative.png) 
コンテキスト行のページングは、列固定でサポートされていません。|[contextRowMode](%%jQueryApiUrl%%/ui.igtreegridpaging#options:contextRowMode) が「parent」である場合、または「breadcrumb」と列固定が有効になっている場合は、例外をスローします。| ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。

### <a id="hierarchical-grid"></a> [igHierarchicalGrid](igHierarchicalGrid-Known-Issues.html#general)

問題|説明|状態
---|---|---
Android 4.* デバイスで、スクリーン タップが誤って解釈される|Android 4.* を使用したタッチ デバイスでは、階層グリッドで Group By モーダル ダイアログのドロップダウンのタップは、多くの場合モーダル ダイアログの背後のグリッド セルに作用します。 | ![](images/positive.png)
階層グリッドにおいて特定の順序で機能を参照した場合に発生するレンダリング問題|Group By 機能を機能リストに追加した後に行セレクターを追加した場合、igHierarchicalGrid の子のレイアウトが正しく描画されないことがあります。 | ![](images/positive.png)
プライマリ キー値の制限|igHierarchicalGrid は親レイアウトのプライマリー キー値を使用して、固有の id 属性を持つ子レイアウトの `<div>` 要素を作成します ([HTML5 仕様](http://www.w3.org/TR/html5/dom.html#the-id-attribute)により、id 属性値に[スペース文字](http://www.w3.org/TR/html5/infrastructure.html#space-character)を使用できません)。プライマリー キーの値に無効な文字が含まれる場合は、[jQuery ID セレクター](http://api.jquery.com/id-selector/)で DIV 要素を選択することはできません。結果として子グリッドの機能は正しく操作しない可能性があります。例: 子グリッドでフィルター ドロップダウンを開くと、例外が発生します。 | ![](images/negative.png)
MVC で自己参照が機能しない|igHierarchicalGrid を自己参照データにバインドしたい場合、シリアル化制限のために、MVC パターンによりバインドすることができません。 | ![](images/negative.png)
チェーンでロードオンデマンドが機能しない|MVC プロジェクトのビュー ページで、ロードオンデマンドを有効にすることはできません。 | ![](images/positive.png)
レイアウトでプライマリー キーを使用せずにロードオンデマンドを実行すると、例外がスローされる|ロードオンデマンド機能を有効にし、すべての子レイアウトに対してプライマリー キーを定義しなかった場合、例外がスローされます。 | ![](images/positive.png)
子レイアウトの一部の列が表示されない、または切り取られる|igHierarchicalGrid で幅が定義されず、また子レイアウトに列幅が width グリッドを越える列がある場合、子の列の一部は切り取りまたは非表示になります。 | ![](images/positive.png)
機能を複数回定義できない|**JavaScript の場合:** igGrid と igHierarchicalGrid の両方で、機能を 1 回以上定義すると、エラーがスローされます。 **MVC の場合**: igGrid と igHierarchicalGrid の両方に対し、MVC ラッパーで機能を 1 回以上定義すると、最後の定義のみが考慮されます。 | ![](images/negative.png)
XML へのクライアント側のバインディング|XML へのバインディングは再帰的スキーマのみサポートします。 | ![](images/negative.png) ![](images/plannedFix.png)
ロードオンデマンドが false の場合、永続化は子レイアウトに対して機能しない|ロードオンデマンドが false の場合、フィルタリング、並べ替えまたは GroupBy は子レイアウトに対して永続化されません。このシナリオでは、これらの機能に対してpersist オプションは自動的に false に設定されます。 | ![](images/negative.png)
id 属性は、DOM コントロール プレースホルダーで必須|id 属性は、グリッドが初期化される DOM 要素に設定する必要があります。グリッドは、jQuery セレクターを内部で使用して選択を高速化します。 | ![](images/negative.png)
スペースを含む列のキーはサポートされない|列のキーは、一部の DOM 要素の ID の生成に使用されます。[HTML 5 仕様](http://www.w3.org/TR/html5/dom.html#the-id-attribute)により、HTML id 属性にスペースを入れることはできません。 | ![](images/negative.png)
initialExpandDepth と仮想化の使用がサポートされない|仮想化が有効な場合、すべての取得された行は縮小状態です。initialExpandDepth の設定は無視されます。| ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="hierarchical-grid-grouping"></a> [igHierarchicalGrid GroupBy](igHierarchicalGrid-Known-Issues.html#grouping)

問題|説明|状態
---|---|---
階層グリッドにおけるリモート グループ化の制限事項|リモート グループ化では、複数のレイアウト (またはルート グリッド) の列のグループ化は機能しません。 | ![](images/positive.png)
ロードオンデマンドでのリモート グループ化が不正になる|グリッド全体のロードオンデマンドでリモートの Group By を有効にした場合、オン デマンドでロードしているデータを返すアクションを修正しない限り、グループは不正になります。 | ![](images/positive.png)
グループ化機能で列設定を定義し、同時に継承を有効にすると、例外がスローされる|グループ化機能を有効にし、その中で列設定を定義し継承を有効にすると、ページ例外がスローされます。 | ![](images/positive.png)
異なる子レイアウトからのリモート グループ化の制限|ロードオンデマンドが無効な場合は、リモート Group By を使用して異なる子レイアウトから列をグループ化すると、子の DataSourceUrl ではなく親の DataSourceUrl が呼び出されます。 | ![](images/positive.png)


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="hierarchical-grid-row-selectors"></a> [igHierarchicalGrid RowSelectors](igHierarchicalGrid-Known-Issues.html)

問題|説明|状態
---|---|---
行セレクターの動作は、一度に 1 つのレイアウトに限られる|行セレクターの機能のチェックボックスで選択されたレイアウトは、別のレイアウトのチェックボックスがチェックされると選択が解除されます。 | ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。

### <a id="hierarchical-grid-tooltips"></a> [igHierarchicalGrid ツールチップ](igHierarchicalGrid-Known-Issues.html)

問題|説明|状態
---|---|---
ツールチップのオプションが子およびルートの定義で異なる場合、ツールチップは子レイアウトで表示されません。|階層グリッドのすべてのツールチップ インスタンスで同じ DOM 要素を使用するようになったため、このシナリオはサポートされません。  | ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。

### <a id="hierarchical-grid-updating"></a> [igHierarchicalGrid 更新](igHierarchicalGrid-Known-Issues.html)

問題|説明|状態
---|---|---
高さが低すぎる場合、子レイアウトで [OK]/[キャンセル] ボタンの一部が表示されません。 | 特定の構成およびユースケースで子レイアウトの高さが低すぎる場合、表示要素の範囲外にフローティング要素は配置できません。  | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。

### <a id="linear-gauge"></a> [igLinearGauge](igLinearGauge-Known-Issues-and-Limitations.html)

問題|説明|状態
---|---|---
1 つの針のみをサポート|`igLinearGauge` コントロールは、1 つの針のみをサポートします。 | ![](images/positive.png)
ラベル競合が検出されない|`igLinearGauge` コントロールには、ラベル競合を検出する手段はありません。その結果、ラベルを表示するスペースが十分にない場合は、ラベル競合が発生する可能性があります。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。

### <a id="mvc"></a> [%%ProductNameMVC%%](ASPNET-MVC-Wrappers-Known-Issues.html)

問題|説明|状態
---|---|---
MVC ヘルパー生成コードと MVC ローダーがカスタムの JavaScript ページ設定コードのあとに実行される|ASP.NET MVC ビューにおいてコントロールの MVC ローダーや MVC ヘルパーを使用した場合、生成される JavaScript コードは、[`document.ready()`](http://api.jquery.com/ready/) や [`window.load()`](http://api.jquery.com/load-event/) イベントで渡されたカスタムのページ設定コードの後に実行されます。 | ![](images/positive.png)
`AutoGenerateLayouts` の既定値が変更される|グリッドの ASP.NET MVC ヘルパーでは、フラット グリッドに対して別のリモート データ要求が発行されることを防ぐために、`AutoGenerateLayouts` プロパティの既定値が *false* に変更されます。 | ![](images/negative.png)
MVC Razor レイアウト ビューで MVC Loader が正常に機能しない|ASP.NET MVC Loader を MVC Razor のレイアウト ビューに表示した場合、実際のビューにあるコントロールよりも前にローカルを初期化することはできません。 | ![](images/positive.png)


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="mvc-mobile"></a> [%%ProductNameMVC%% (モバイル)](ASPNET-MVC-Mobile-Wrappers-Known-Issues.html)

問題|説明|状態
---|---|---
モバイル コントロール ヘルパーの位置が変更された|2013.1 では、モバイル コントロール ヘルパーは *Infragistics.Web.MVC.dll* アセンブリの一部でした。2013.2 以降では、これらのヘルパーは *Infragistics.Web.MVC.Mobile dll* 内に常駐しています。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="map"></a> [igMap](igMap-Known-Issues-Limitations.html)

問題|説明|状態
---|---|---
現時点で地理等高線リーズにツールチップが表示されない|今のところ、地理等高線シリーズではツールチップはサポートされません。 | ![](images/negative.png) ![](images/plannedFix.png)
iPad デバイスで地理記号シリーズにツールチップが表示されない|iPad デバイスでは、地理記号シリーズが表示される場合、ツールチップは表示されません。 | ![](images/negative.png) ![](images/plannedFix.png)


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="olap-xmla-data-source"></a> [igOlapXmlaDataSource](igOlapXmlaDataSource-Known-Issues-and-Limitations.html)

問題|説明|状態
---|---|---
`igOlapXmlaDataSource` は、Android オペレーティング システム用ブラウザーでサポートされない | `igOlapXmlaDataSource`™ コンポーネントは、Android オペレーティング システム用ブラウザーでサポートされていません。 | ![](images/negative.png) ![](images/plannedFix.png)
認証済みデータ アクセスが、`igOlapXmlaDataSource` で Mozilla Firefox と正しく連携しない|Firefox ブラウザーを認証済みアクセスで使用する場合は、[インターネット インフォメーション サービス](http://encyclopedia2.thefreedictionary.com/Internet+Information+Services) (IIS) の追加構成が必要です。 | ![](images/positive.png)
`igOlapXmlaDataSource` 用の信頼されていないドメインに対して、Internet Explorer 8.0 および 9.0 で認証済みデータ アクセスが正しく機能しない|`igOlapXmlaDataSource` コンポーネントは Internet Explorer ブラウザーのバージョン 8 および 9 で信頼されないドメインの OLAP データを取得できません。 | ![](images/positive.png)
`igOlapXmlaDataSource` を使用している場合に、Chrome がクロスドメイン要求の認証ポップアップを表示しない|Chrome ブラウザーのバージョン 13 以降では、認証ポップアップ ダイアログはクロスドメイン要求に対して表示されません。 | ![](images/positive.png)


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="pivot-data-selector"></a> [igPivotDataSelector](igPivotDataSelector-Known-Issues-and-Limitations.html)

問題|説明|状態
---|---|---
古い jQuery UI バージョンでは、`igPivotDataSelector` のエリア間にドロップ ラベルをドロップすると、ドロップ ラベルが残る|これは、バージョン 1.8.19 で導入されるドラッグ可能な jQuery UI バグにより引き起こされます。詳細は、[jQuery UI バグ 8269](http://bugs.jqueryui.com/ticket/8269) を参照してください。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="pivot-grid"></a> [igPivotGrid](igPivotGrid-Known-Issues-and-Limitations.html)

問題|説明|状態
---|---|---
`igPivotGrid` におけるキャプション ベースの並べ替えは、常にアルファベット順になる|現在、`igPivotGrid`™ コントロールでは、カスタム キャプションの並べ替えビヘイビアーはサポートされていません。アルファベット順の並べ替えのみを使用できます。 | ![](images/negative.png) ![](images/plannedFix.png)
`igPivotGrid` でメンバーを展開または折りたたむと、グリッドが再レンダリングされる|`igPivotGrid` の行または列のメンバーを展開または折りたたむと、グリッド全体が再レンダリングされます。 | ![](images/negative.png) ![](images/plannedFix.png)
`igPivotGrid` が、Android オペレーティング システム用のブラウザー内で必ずしも正しく表示されない | Android オペレーティング システム用のブラウザーでは、`igPivotGrid` の最初の列のみが表示されます。 | ![](images/positive.png)
*jQuery UI 1.8.19 におけるドロップ エリア間でドラッグ アンド ドロップ後、ドロップ ラベルが残っている*|`igPivotGrid` および / または `igPivotDataSelector`™ のエリア間で項目をドラッグ アンド ドロップする場合、ドロップ ラベルが残ります。 | ![](images/positive.png)
一定の条件下のMac OS で、水平スクロールバーが表示されない|Mac OS で、「Show scrollbars only when scrolling」オプションを *true* に設定した場合、水平スクロールバーは表示されません。グリッドの水平スクロールバーはオーバーフロー時に *hidden* に設定されます。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="popover"></a> [igPopover](igPopover-Known-Issues-And-Limitations.html)

問題|説明|状態
---|---|---
ポインターはページのロード時に Chrome で正しい位置をポイントしない|ページの最初のロード時に  `igPopover` が表示されている場合、矢印がコンテンツ フレームに対して正しい位置に置かれません。 | ![](images/positive.png)
**selectors** オプションでターゲット パラメーターを必要とする **show** メソッドが使用されています。|selectors オプションが設定され、複数のターゲットが使用可能な場合、show メソッドにパラメーターとして DOM 要素を渡す必要があります。渡さなかった場合、エラーがスローされます。 | ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="qr-barcode"></a> [igQRCodeBarcode](igQRCodeBarcode-Known-Issues-and-Limitations.html)

問題|説明|状態
---|---|---
プラットフォーム固有の文字がサポートされない|現在のバージョンの `igQRCodeBarcode`™ コントロールは、4 バイト記号のエンコードをサポートしません。 | ![](images/negative.png)
Micro QR Code フォーマットがサポートされない|このコントロールは現在 Micro QR Code 標準をサポートしていません。 | ![](images/negative.png)
Structured Append モードがサポートされない|`igQRCodeBarcode` コントロールは現在、 Structured Append モードに対するサポートを提供していません。 | ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。

### <a id="shape-chart"></a> igShapeChart

問題|説明|状態
---|---|---
igLoader の igShapeChart および Interactivity モジュール | igLoader で `igShapeChart.Interactivity` のリソースが正しく読み込めません。ShapeChart のインタラクティビティを有効にするには、`igDataChart.Interactivity` をリソースのリストに追加してください。たとえば、`resources: "igShapeChart,igDataChart.Interactivity"` などです。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。

### <a id="validator"></a> igValidator

問題|説明|状態
---|---|---
Date オブジェクトの最小値および最大値|`valueRange` オプションで `new Date()` を使用した際に問題が発生する場合があります。時間部分もあるため制限の評価で使用されますが、デフォルトの入力形式から解析されず、含まれません。固定日付を解析または時間部分を削除することを推薦します。または、検証条件を実行するには、`custom` 検証を使用できます。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。

### <a id="zoombar"></a> [igZoombar](igZoombar-Known-Issues-And-Limitations.html)

問題|説明|状態
---|---|---
`igDataChart` ラジアル シリーズがサポートされない | `igZoombar`™ では、ズームは水平方向のみサポートされますが、ラジアル シリーズでは通常両方の軸でズームします。 そのためラジアル シリーズで `igZoombar` を使用したズームは正しく動作しません。 | ![](images/negative.png)
`igDataChart` で使用した場合、`igZoombar` のサムネイルが描画されない | `igZoombar` は `igDataChart` コントロールのオプション (`igZoombar` の [`target`](%%jQueryApiUrl%%/ui.igzoombar#options:target) オプションで参照されます) を使用してサムネイルを作成します。`igZoombar` は、サムネイルの乱雑さを回避するためにこれらのオプションの一部を削除します。その結果、新しいオプション セットが無効になることがあります。 | ![](images/positive.png)
`igZoombar` のクローンとターゲット ウィジェットが自動的に同期しない|`igZoombar` コントロールによりズームされたウィジェットを変更しても、クローンが自動的に更新されません。 | ![](images/positive.png)
`igZoombar` は igDataChart と正しく動作しない| `igZoombar` はターゲットとする元の `igDataChart` のクローンを作成します。デフォルトで `igZoombar` は元のチャート オブジェクトからクローンのオプションを暗示します (`igZoombar` の [`clone`](%%jQueryApiUrl%%/ui.igzoombar#options:clone) オプション参照)。より複雑な構造を持つ積み上げシリーズの場合、元のチャートはユーザーが内部的に提供するシリーズを変更します。 これにより、`igZoombar` は元のシリーズの取得およびクローンを自動で再作成することはできません。| ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="infragistics-documents"></a> [Infragistics Document Engine](DocumentEngine-Known-Issues.html)

問題|説明|状態
---|---|---
名前空間の競合|Infragistics ASP.NET と %%ProductName%% のドキュメント アセンブリを併用すると、名前空間の競合による例外が発生します。 | ![](images/positive.png)


 [既知の問題点と制限の概要](#summary)を参照してください。

### <a id="templating-engine"></a> Infragistics テンプレート エンジン

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

                

>**回避策:** 許可されない文字の使用が必要な場合は、次の `$.ig.regExp` オプションをカスタマイズできます。レンダリングの前にエンコードされるテンプレート内のすべての置換要素と一致する `$.ig.regExp.sub:/\$\{(([\w\$]+(\.|\s)?[\w\$]*)+)\}/` オプション、またはそのままレンダリングされるテンプレート内のすべての置換要素と一致する `$.ig.regExp.nonEncodeSub: /\{\{html\s+([\w\$]+(\.|\s)?[\w\$]*)+\}\}/ `オプション。**たとえば**、ダッシュ(-) を使用する場合は、式を次のように変更します。`$.ig.regExp.sub:/\$\{(([\w\$-]+(\.|\s)?[\w\$-]*)+)\}/`、`$.ig.regExp.nonEncodeSub: /\{\{html\s+([\w\$-]+(\.|\s)?[\w\$-]*)+\}\}/`。
            </td>

            <td>
![](images/positive.png)
			</td>
        </tr>
        <tr>
		<td>ブロックのリストはサポートされていません。</td>
		<td>ブロックのリストはサポートされていません。つまり、"{{if *条件 1* }} 何らかの処理 {{/if}} {{if *条件 2* }} 別の処理 {{/if}}" は、正しく定義されたブロックではありません。</td>
		<td>![](images/negative.png)</td>
        </tr>
    </tbody>
</table>


[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="popup-mobile"></a> [Popup (モバイル)](Popup-Known-Issues.html)

問題|説明|状態
---|---|---
MVC `Popup` モバイル コントロールには jQuery Mobile バージョン 1.2 が必要|`Popup` ウィジェットは、jQuery Mobile 1.2 で初めて導入された機能です。 | ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。


### <a id="selectmenu-mobile"></a> [SelectMenu (モバイル)](SelectMenu-Known-Issues.html)

問題|説明|状態
---|---|---
メニューがカスタム ダイアログ ベースのコンテナーに収められている場合、モバイル `SelectMenu` の [`CloseText`](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuModel~CloseText.html) プロパティが適用されない|ダイアログ ベースのコンテナーで、`SelectMenu` コントロールの `CloseText` プロパティを使用して閉じるボタン ツールチップのテキストを設定しても、カスタムのツールチップは表示されず、代わりにデフォルトのツールチップが表示されます。<br />これは、jQuery モバイルが、あとでアクセスできなくなるカスタムの閉じるテキストを挿入しないためです。 | ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。


###  <a id="slider-mobile"></a>  [Slider (モバイル)](Slider-Known-Issues.html)

問題|説明|状態
---|---|---
Mobile Slider が Windows Phone 7 上でスライドしない|Windows® Phone 7 は標準のタッチ イベントをサポートしないため、スライダーは読み取り専用です。 | ![](images/positive.png)

[既知の問題点と制限の概要](#summary)を参照してください。

###  <a id="scroll"></a>  [igScroll](igScroll-Known-Issues.html)

問題|説明|状態
---|---|---
igScroll を初期設定で非表示の要素で初期化すると、スクロールが動作しない。|igScroll を非表示の要素で初期化すると、要素が表示された後にスクロールバーが表示されず、スクロールが動作しません。| ![](images/positive.png)
igScroll でターゲット要素の tabIndex 属性を設定せず、フォーカスできない場合、キーボード インタラクションが動作しない。|igScroll 要素がフォーカスされている場合のみキーボード インタラクションが可能です。要素のフォーカスが有効でない (tabIndex 属性がない) 場合、キーボード インタラクションを起動できません。 | ![](images/negative.png)
igScroll インスタンスを持つ 2 つの要素が同期化される場合、1 つの要素をスクロールすると、その他の要素にスクロールバーを表示しない。|2 つの要素が [syncedElemsH](%%jQueryApiUrl%%/ui.igscroll#options:syncedElemsH)/[syncedElemsV](%%jQueryApiUrl%%/ui.igscroll#options:syncedElemsV) プロパティによって同期化され、両方の要素で igScroll インスタンスが初期化される場合、1 つの要素がスクロールされると、その他の要素にスクロールバーが表示されません。| ![](images/negative.png)

[既知の問題点と制限の概要](#summary)を参照してください。
