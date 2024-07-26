<!--
|metadata|
{
    "fileName": "whats-new-in-2016-volume1",
    "controlName": [],
    "tags": []
}
|metadata|
-->

#2016 Volume 1 の新機能

このトピックでは、%%ProductFamilyName%%™ 2016 Volume 1 リリースのコントロールと新機能および拡張機能を紹介します。


##新機能:

以下の表に 2016 Volume 1 の新機能の概要を示します。追加の詳細は以下のとおりです。

### 全般

機能|説明
---|---
新しい Bootstrap 4 テーマ|新しい Bootstrap 4 互換性のあるテーマが %%ProductName%% に含まれます - [サンプルの表示](%%SamplesUrl%%/themes/bootstrap4-default)。
Angular 2 コンポーネント (CTP) |%%ProductName%% ウィジェットは Angular 2 のコンポーネント ラッパーがあります。詳細については、[%%ProductName%% Angular 2 GitHub](https://github.com/IgniteUI/igniteui-angular-wrappers) ページを参照してください。|
新しいスケール可能なフォント アイコン|デフォルトの Infragistics テーマは画像アイコンの代わりに [jQuery UI フォント アイコン](https://github.com/mkkeck/jquery-ui-iconfont) を使用します。 |
Modernizr 3.x サポート|%%ProductName%% は、Modernizr ライブラリを使用してタッチ環境を検出します。詳細については、[%%ProductName%% コントロールのタッチ サポート](Touch-Support-for-IgniteUI-for-jQuery-Controls.html)を参照してください。[Mordernizr 3.x](https://modernizr.com/) は、以前の Modernizr バージョンもサポートされます。 |

### igTileManager

機能|説明
---|---
スプリッター オプション|`splitterOptions` は `showSplitter` オプションに代わります。表示および非表示、その他複数のオプションが追加されました。スプリッターを縮小可能に構成し、collapsed/expanded イベントにアタッチできます。新しいオプションの使用は次のサンプルを参照ください - [サンプルの表示](%%SamplesUrl%%/tile-manager/collapsible-splitter)。

### igDataSource

機能|説明
---|---
新しいフィールド オプション - `mapper`|dataType="object" のフィールドの場合、複合オブジェクトから複合データ抽出で使用する [`mapper`](%%jQueryApiUrl%%/ui.iggrid#options:columns.mapper) 関数の設定を許可します。その戻り値は特定のフィールドに実行されるすべてのデータ操作で使用されます。</br> 詳細については、次のトピックを参照してください: [igDataSource 概要](igDataSource-igDataSource-Overview.html#schema-fields-mapper)|

### igGrid

機能|説明
---|---
新しい列オプション - mapper|dataType="object" の列の場合、複合オブジェクトから複合データ抽出で使用する、mapper 関数の設定を許可します。その戻り値は、その列に対するすべてのデータ操作（更新、フィルター、並べ替えなど）で使用されます - [サンプルの表示](%%SamplesUrl%%/grid/handling-complex-objects)。</br> 詳細については、次のトピックを参照してください: [列およびレイアウト](igGrid-Columns-and-Layout.html#defining-mapper)|
ColumnFixing 機能は、パーセンテージで設定されるグリッド幅で使用できます。|ColumnFixing 機能は、グリッドの幅がパーセンテージで設定される場合に使用できるようになりました。<br/>**注**: 列幅は依然としてピクセル単位で定義します。明示的に設定するか、[defaultColumnWidth](%%jQueryApiUrl%%/ui.iggrid#options:defaultColumnWidth) オプションを使用できます。|
[複数行レイアウト機能](#multi-row-layout)|複数行レイアウト機能は、複数の列および行にまたがるセルを含む多数の行で構成される複雑なグリッド レコード レイアウトを作成できます。 |
[チェックボックスの外観](#checkbox-appearance)|チェックマークが表示モードで操作できないことを示すためにチェックボックス列の外観が変更されました。 |
Excel からの貼り付けサンプル|Excel クリップボード データを igGrid に貼り付けることを紹介するサンプルが追加されました - [サンプルの表示](%%SamplesUrl%%/grid/paste-from-excel)。 |

### igTreeGrid

機能|説明
---|---
[向上された更新機能](#treegrid-updating) |igTreeGrid の更新機能に、ルートおよび子レベル行を追加するための UI を導入しました。

### TypeScript サポート

サポートされる TypeScript のバージョンは 1.4 およびそれ以降です。

機能|説明
---|---
[共用体型のサポート](#union-types) |タイプ チェックを向上するためにウィジェット メンバーは共用体型をサポートします。
[Intellisense の機能向上](#intellisense-improvements) |Intellisense はオプションおよびメソッドで機能が向上しました。
[メンバーの説明](#member-descriptions) |すべてのメンバーに説明があります。

## igGrid

### <a id="multi-row-layout"></a> 複数行レイアウト機能

複数行レイアウト機能は、複数の列および行にまたがるセルを含む多数の行で構成される複雑なグリッド レコード レイアウトを作成できます。この構造は、列が多くあるため水平スクロールバーが必要なグリッド、または表以外の表示の方が必要なグリッドの代替描画オプションを提供します。
複数行レイアウトの初期化は、igGrid の列コレクションにより実行できます。列の位置およびサイズを指定する 4 つの新しいプロパティが列定義に追加されました - [`rowIndex`](%%jQueryApiUrl%%/ui.iggrid#options:columns.rowIndex)、[`columnIndex`](%%jQueryApiUrl%%/ui.iggrid#options:columns.columnIndex)、[`rowSpan`](%%jQueryApiUrl%%/ui.iggrid#options:columns.rowSpan) および [`colSpan`](%%jQueryApiUrl%%/ui.iggrid#options:columns.colSpan)。

![](images/iggrid-multi-row-layout.png)
 
#### 関連トピック
-   [グリッドの複数行レイアウト](igGrid-MultiRowLayout.html)

#### 関連サンプル
-   [複数行レイアウト](%%SamplesUrl%%/grid/multi-row-layout)

### <a id="checkbox-appearance"></a> チェックボックスの外観
チェックボックス列の外観が変更されました。グリッドが表示モードにある場合、四角ボックスが描画されません。プレーン チェックマークのみが表示されます。この変更はユーザー エクスペリエンスの向上です。切り替えるためにクリックできないため、クリック可能として表示されません。

![](images/iggrid-checkbox.png)

#### 関連トピック
-   [列のチェックボックスのレンダリング](igGrid-Columns-and-Layout.html#checkboxes)

#### 関連サンプル
-   [チェックボックス列](%%SamplesUrl%%/grid/checkbox-column)

## igTreeGrid

### <a id="treegrid-updating"></a> 向上された更新機能

[新規行の追加] がユーザー インターフェイスで有効になりました。更に TreeGrid 更新機能の新しいレコードの追加はルート レベルおよび指定したレベルに子レコードをサポートします。行の追加は UI および API により実行できます。
行がマウスでホバーされるか、タッチ デバイスで行がスワイプされたとき、子行の追加ボタンは行の削除ボタンの隣に表示されます。
![](images/igtreegrid-updating.png)

[新規行の追加] UI は親の隣にインラインで描画されます。

![](images/igtreegrid-updating-add-child.png)

#### 関連トピック
-   [更新 (igTreeGrid)](igTreeGrid-Updating.html)

#### 関連サンプル
-   [更新](%%SamplesUrl%%/tree-grid/updating)

## TypeScript サポート

### <a id="union-types"></a> 共用体型のサポート

TypeScript 1.4 で追加された[共用体型](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#3.4)は、変数またはメンバーが複数型のセットの 1 つの型に設定することを可能にします。以前、`any` 型として宣言されたメンバーは、特定の型のセットを宣言するために共用体型を使用するようになりました。 

![](images/union-types.png)

### <a id="intellisense-improvements"></a> Intellisense の向上

オプションおよびメソッドの Intellisense がウィジェットのすべてのオーバーロードを表示するために向上されました。

#### オプションのオーバーロード

getter および setter を含むすべての利用可能なオプションが Intellisense にリストされます。

![](images/option-overloads.png)

#### メソッドのオーバーロード

パラメーターを含むすべての利用可能なメソッドが Intellisense にリストされます。

![](images/method-overloads.png)

#### ウィジェットの `data` にメソッドの Intellisense があります
jQuery UI 構文でウィジェットのメソッドをウィジェットの data から起動できます: $(".selector").data('widgetName')。%%ProductName%% TypeScript ディレクティブでも可能になりました。

![](images/method-data-overloads.png)

### <a id="member-descriptions"></a> メンバーの説明

ウィジェットのオプション、イベント、およびメソッドに説明を追加しました。ウィジェットのユーザビリティを向上するために Intellisense で説明が表示されます。

![](images/member-descriptions.png)
