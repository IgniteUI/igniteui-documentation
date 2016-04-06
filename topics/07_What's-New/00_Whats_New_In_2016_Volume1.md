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

このトピックでは、Ignite UI™ 2016 Volume 1 リリースのコントロールと新機能および拡張機能を紹介します。


##新機能:

以下の表に 2016 Volume 1 の新機能の概要を示します。追加の詳細は以下のとおりです。

### 全般

機能|説明
---|---
新しい Bootstrap 4 テーマ|新しい Bootstrap 4 互換性のあるテーマが Ignite UI に含まれます - [サンプルの表示](%%SamplesUrl%%/themes/bootstrap4-default)。
Angular 2 コンポーネント (CTP) |Ignite UI ウィジェットは Angular 2 のコンポーネント ラッパーがあります。詳細については、[Ignite UI Angular 2 GitHub](https://github.com/IgniteUI/igniteui-angular2) ページを参照してください。|
新しいスケール可能なフォント アイコン|デフォルトの Infragistics テーマは画像アイコンの代わりに [jQuery UI フォント アイコン](https://github.com/mkkeck/jquery-ui-iconfont) を使用します。 |
Modernizr 3.x サポート|Ignite UI は、タッチ環境を検出するために Modernizr ライブラリを使用します。詳細については、[Ignite UI コントロールのタッチ サポート](08_Touch_Support_for_NetAdvantage_for_jQuery_Controls.html)を参照してください。[Mordernizr 3.x](https://modernizr.com/) は、以前の Modernizr バージョンもサポートされます。 |

### igTileManager

機能|説明
---|---
スプリッター オプション|`splitterOptions` は `showSplitter` オプションを置き換えます。表示および非表示があり、およびその他のオプションが追加されました。スプリッターを縮小可能に構成でき、縮小した/展開したイベントにアタッチできます。`showSplitter` オプションは利用可能ではないため、次のサンプルを参照すると、新しいオプションの使用を参照できます - [サンプルの表示](%%SamplesUrl%%/tile-manager/collapsible-splitter)。

### igDataSource

機能|説明
---|---
新しいフィールド オプション - `mapper`|dataType="object" のフィールドの場合、[`mapper`](%%jQueryApiUrl%%/ui.iggrid#options:columns.mapper) 関数の設定を許可します。複雑なオブジェクトから複雑なデータ展開のために使用できます。戻り値は特定のフィールドに実行されるすべてのデータ操作に使用されます。</br> 詳細については、次のトピックを参照してください: [igDataSource 概要](igDataSource-igDataSource-Overview.html#schema-fields-mapper)|

### igGrid

機能|説明
---|---
新しい列オプション - mapper|dataType="object" の列の場合、mapper 関数の設定を許可します。複雑なオブジェクトから複雑なデータ展開のために使用できます。戻り値は特定の列に実行されるすべてのデータ操作に使用されます。[サンプルの表示](%%SamplesUrl%%/grid/handling-complex-objects)。</br> 詳細については、次のトピックを参照してください: [列およびレイアウト](igGrid-Columns-and-Layout.html#defining-mapper)|
ColumnFixing 機能は、パーセンテージで設定されるグリッド幅と操作します。|ColumnFixing 機能は、グリッドの幅がパーセンテージで設定される場合に操作します。<br/>**注**: 列幅をピクセル単位で定義することが推薦されます。明示的に設定するか、[defaultColumnWidth](%%jQueryApiUrl%%/ui.iggrid#options:defaultColumnWidth) オプションを使用できます。|
[複数行レイアウト機能](#multi-row-layout)|複数行レイアウト機能を使用すると、セルが複数の列および行がまたがるセルを含む複数の業を含む複雑なグリッド レコード レイアウトを作成できます。 |
[チェックボックスの外観](#checkbox-appearance)|チェックマークが表示モードで操作できないことを示すためにチェックボックス列の外観が変更されました。 |
Excel からの貼り付けサンプル|Excel クリップボード データを igGrid に貼り付けることを紹介するサンプルが追加されました - [サンプルの表示](%%SamplesUrl%%/grid/paste-from-excel)。 |

### igTreeGrid

機能|説明
---|---
[向上された更新機能](#treegrid-updating) |igTreeGrid の更新機能にルートおよび子レベル行の追加の UI を追加しました。

### TypeScript サポート

16.1 リリースから Ignite UI の最小サポートされる TypeScript バージョンは 1.4 になります。

機能|説明
---|---
[和集合型のサポート](#union-types) |タイプ チェックを向上するためにウィジェット メンバーは和集合型をサポートします。
[Intellisense の向上](#intellisense-improvements) |Intellisense はオプションおよびメソッドで向上されました。
[メンバーの説明](#member-descriptions) |すべてのメンバーが説明を持ちます。

## igGrid

### <a id="multi-row-layout"></a> 複数行レイアウト機能

複数行レイアウト機能を使用すると、セルが複数の列および行がまたがるセルを含む複数の業を含む複雑なグリッド レコード レイアウトを作成できます。この構造は、列が多くあるため水平スクロールバーが必要なグリッド、または表以外の表示の方が必要なグリッドのその他の描画オプションを提供します。
複数行レイアウトの初期化は、igGrid の列コレクションにより実行できます。列の位置およびサイズを指定する 4 つの新しいプロパティが列定義に追加されました - [`rowIndex`](%%jQueryApiUrl%%/ui.iggrid#options:columns.rowIndex)、[`columnIndex`](%%jQueryApiUrl%%/ui.iggrid#options:columns.columnIndex)、[`rowSpan`](%%jQueryApiUrl%%/ui.iggrid#options:columns.rowSpan) および [`colSpan`](%%jQueryApiUrl%%/ui.iggrid#options:columns.colSpan)。

![](images/iggrid-multi-row-layout.png)
 
#### 関連トピック
-   [グリッドの複数行レイアウト](igGrid-MultiRowLayout.html)

#### 関連サンプル
-   [複数行レイアウト](%%SamplesUrl%%/grid/multi-row-layout)

### <a id="checkbox-appearance"></a> チェックボックスの外観
チェックボックス列の外観が変更されました。グリッドが表示モードにある場合、四角ボックスが描画されません。プレーン チェックマークのみは表示されます。この変更はユーザー エクスペリエンスの向上です。切り替えるためにクリックできないため、クリック可能として表示しません。

![](images/iggrid-checkbox.png)

#### 関連トピック
-   [列のチェックボックスのレンダリング](igGrid-Columns-and-Layout.html#checkboxes)

#### 関連サンプル
-   [チェックボックス列](%%SamplesUrl%%/grid/checkbox-column)

## igTreeGrid

### <a id="treegrid-updating"></a> 向上された更新機能

「新規行の追加」がユーザー インターフェイスで有効になりました。更に TreeGrid 更新機能の新しいレコードの追加はルート レベルおよび指定したレベルに子レコードをサポートします。行の追加は UI および API により実行できます。
行がマウスでホバーされるか、タッチ デバイスで行がスワイプされたとき、[子行の追加] ボタンは [行の削除] ボタンの隣に表示されます。
![](images/igtreegrid-updating.png)

「新規行の追加」UI は親の隣にインラインで描画されます。

![](images/igtreegrid-updating-add-child.png)

#### 関連トピック
-   [更新 (igTreeGrid)](igTreeGrid-Updating.html)

#### 関連サンプル
-   [更新](%%SamplesUrl%%/tree-grid/updating)

## TypeScript サポート

### <a id="union-types"></a> 和集合型のサポート

TypeScript 1.4 で追加された[和集合型](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#3.4)は、変数またはメンバーが複数型のセットの 1 つの型に設定することは許可されます。`any` 型として宣言されたメンバーは、特定の型のセットを宣言するために和集合型を使用できます。 

![](images/union-types.png)

### <a id="intellisense-improvements"></a> Intellisense の向上

オプションおよびメソッドの Intellisense がウィジェットのすべてのオーバーロードを推薦するために向上されました。

#### オプションのオーバーロード

getter および setter を含むすべての利用可能なオプションは Intellisense にリストされます。

![](images/option-overloads.png)

#### メソッドのオーバーロード

パラメーターを含むすべての利用可能なメソッドは Intellisense にリストされます。

![](images/method-overloads.png)

#### ウィジェットの `data` にメソッドは Intellisense があります
jQuery UI 構文でウィジェットのメソッドをウィジェットの data から起動できます。: $(".selector").data('widgetName')。Ignite UI TypeScript 命令でも可能になりました。

![](images/method-data-overloads.png)

### <a id="member-descriptions"></a> メンバーの説明

ウィジェットのオプション、イベント、およびメソッドは機能説明があります。ウィジェットのユーザビリティを向上するために説明は Intellisense で表示されます。

![](images/member-descriptions.png)
