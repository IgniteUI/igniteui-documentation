<!--
|metadata|
{
    "fileName": "iggrid-using-tooltips",
    "controlName": "igGrid",
    "tags": ["Getting Started","Grids"]
}
|metadata|
-->

# ツールチップの構成 (igGrid)

## トピックの概要

### 目的

このトピックでは、コード例を使用して、最も一般的なケースの jQuery `igGrid`™ ツールチップの構成方法を説明しています。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**ツールチップ構成表**](#configuration-chart)
-   [**デフォルト設定でツールチップを表示する**](#default-settings)
    -   [デフォルトのツールチップ ビヘイビアーの概要](#default-overview)
    -   [デフォルトのツールチップ ビヘイビアーのプロパティ設定](#default-property-settings)
    -   [コード例](#default-code)
-   [**列のツールチップを無効にする**](#disable)
    -   [プロパティ設定](#disable-properties)
    -   [コード例](#disable-code)
-   [**カスタム ツールチップ位置を構成する**](#custom)
    -   [プロパティ設定](#custom-settings)
    -   [コード例](#custom-code)
-   [**サンプル**](#demo)
-   [**関連トピック**](#topics)


## <a id="configuration-chart"></a> ツールチップ構成表 

以下の表に jQuery `igGrid` ツールチップの最も一般的なユース ケースと、それらを構成するプロパティを示します。これらユース ケースの詳細はそれぞれ、表に続くテキスト ブロックで説明しています。

ユース ケース|構成の詳細|構成プロパティ
---|---|---
[デフォルト設定でツールチップを表示する](#default-settings)|デフォルト設定でツールチップを表示するには、ツールチップ機能を呼び出します。|[name](%%jQueryApiUrl%%/ui.iggridtooltips#options:name)
[ツールチップのないセル列を構成する](#disable)|たとえば、列のセルに画像が含まれている場合に、その列のツールチップを無効にすると便利です。この場合、列ごとに個々にツールチップのビヘイビアーを構成します。|[visibility](%%jQueryApiUrl%%/ui.iggridtooltips#options:visibility) [columnSettings](%%jQueryApiUrl%%/ui.iggridtooltips#options:columnSettings)
[カスタム ツールチップ位置を構成する](#custom)|ツールチップを表示させる位置を指定する。マウス ポインターからツールチップのオフセットを指定することでこれを構成します。|[cursorLeftOffset](%%jQueryApiUrl%%/ui.iggridtooltips#options:cursorLeftOffset) [cursorTopOffset](%%jQueryApiUrl%%/ui.iggridtooltips#options:cursorTopOffset)


## <a id="default-settings"></a> デフォルト設定でツールチップを表示する 

### <a id="default-overview"></a> デフォルトのツールチップ ビヘイビアーの概要 

デフォルトでは、セル中のテキストが長すぎてセルに納まらず、切り捨てられて表示される場合のみツールチップが表示されます。以下の 2 つの図は、このビヘイビアーを示しています。

-   左側 - テキストはグリッド セルで完全に表示できるため、ツールチップは表示されません
-   右側 - セルのテキストが長すぎて、切り捨てられて表示されるため、ツールチップが表示されます

![](images/Using_igGrid_Tooltips_01.png)   ![](images/Using_igGrid_Tooltips_02.png)


### <a id="default-property-settings"></a> デフォルトのツールチップ ビヘイビアーのプロパティ設定 

以下の表に、jQuery ツールチップ ウィジェットのデフォルト プロパティ設定を示しています。

プロパティ|設定
---|---
[visibility](%%jQueryApiUrl%%/ui.iggridtooltips#options:visibility)|“overflow”
[showDelay](%%jQueryApiUrl%%/ui.iggridtooltips#options:showDelay)|500
[hideDelay](%%jQueryApiUrl%%/ui.iggridtooltips#options:hideDelay)|300
[fadeTimespan](%%jQueryApiUrl%%/ui.iggridtooltips#options:fadeTimespan)|150
[cursorLeftOffset](%%jQueryApiUrl%%/ui.iggridtooltips#options:cursorLeftOffset)|10
[cursorTopOffset](%%jQueryApiUrl%%/ui.iggridtooltips#options:cursorTopOffset)|15
[style](%%jQueryApiUrl%%/ui.iggridtooltips#options:style)|"tooltip"


### <a id="default-code"></a> コード例 
ツールチップをデフォルト設定で有効にするには、Name プロパティを「Tooltips」に設定します。

以下のコードは、`igGrid` ツールチップのデフォルト ビヘイビアーを有効にします。

**JavaScript の場合:**

```js
$("#grid1").igGrid({
    features: [
        {
            name: "Tooltips"
        }
    ]
});
```

> **注:** MVC で同様の操作を行う方法については、「ツールチップを `igGrid` に追加する」トピックを参照してください。

## <a id="disable"></a> 列のツールチップを無効にする 

この例では、画像を保存している列ではなく、テキストを含むあらゆる列でツールチップを表示するよう構成しています。

以下の 2 つの図は、このビヘイビアーを示しています。

-   左側 - 列のセルにはテキストが含まれているため、ツールチップが表示されます
-   右側 - 列のセルには画像が含まれているため、ツールチップは表示されません

このビヘイビアーを構成するには、列ごとに個々にプロパティを定義する必要があります。

### <a id="disable-properties"></a> プロパティ設定 
以下の表は、ある列のツールチップを非表示にする一方で残りの列のツールチップを常に表示する場合に必要なプロパティ設定を示しています。プロパティの詳細については、API ドキュメントを参照してください。

プロパティ|設定
---|---
[name](%%jQueryApiUrl%%/ui.iggridtooltips#options:name)|“Tooltips”
[visibility](%%jQueryApiUrl%%/ui.iggridtooltips#options:visibility)|“always”
[columnSettings](%%jQueryApiUrl%%/ui.iggridtooltips#options:columnSettings)|[{ columnKey: "col1", allowTooltips: true }, { columnKey: "col2", allowTooltips: false }, { columnKey: "col3", allowTooltips: true }]



### <a id="disable-code"></a> コード例 
以下のコードでは、第 2 列のツールチップが無効になっています。

**JavaScript の場合:**

```js
$("#grid1").igGrid({
    features: [
        {
            name: "Tooltips",
            columnSettings: [
                { columnKey: "Name", allowTooltips: true },
                { columnKey: "BoxArt", allowTooltips: false },
                { columnKey: "Synopsis", allowTooltips: true }
            ]
        }    
    ]
});
```

> **注:** MVC で同様の操作を行う方法については、「ツールチップを jQuery `igGrid` に追加する」トピックを参照してください。

## <a id="custom"></a> カスタム ツールチップ位置を構成する 

ツールチップの位置を構成するには、jQuery `igGrid` ツールチップ API でマウス ポインターからのツールチップのオフセットを指定します。

![](images/Using_igGrid_Tooltips_03.png)   ![](images/Using_igGrid_Tooltips_04.png)


### <a id="custom-settings"></a> プロパティ設定 
ツールチップの配置は、`cursorLeftOffset` プロパティおよび `cursorTopOffset` プロパティで管理されます。以下の表は、上の図で示すオフセットを得るために必要なプロパティ設定を示しています。プロパティの詳細については、API ドキュメントを参照してください。

プロパティ|設定
---|---
[name](%%jQueryApiUrl%%/ui.iggridtooltips#options:name)|“Tooltips”
[cursorLeftOffset](%%jQueryApiUrl%%/ui.iggridtooltips#options:cursorLeftOffset)|50
[cursorTopOffset](%%jQueryApiUrl%%/ui.iggridtooltips#options:cursorTopOffset)|50


### <a id="custom-code"></a> コード例 
以下のコードでは、上の図で示すオフセットが構成されています。

**JavaScript の場合:**

```js
$("#grid1").igGrid({    
    features: [
        {
            name: "Tooltips",
            cursorLeftOffset: 50,
            cursorTopOffset: 50          
        }    
    ]
});
```

> **注:** MVC で同様の操作を行う方法については、「[igGrid のツールチップを有効にする](igGrid-Enabling-Tooltips.html)」トピックを参照してください。

## <a id="demo"></a> サンプル
<div class="embed-sample">
   [igGrid ツールチップ](%%SamplesEmbedUrl%%/grid/tooltips)
</div>

## <a id="topics"></a> 関連トピック 
以下は、その他の役立つトピックです。

- [igGrid ツールチップの概要](igGrid-Tooltips-Overview.html)

- [igGrid のツールチップを有効にする](igGrid-Enabling-Tooltips.html)

- [igGrid の既知の問題および重大な変更](igGrid-Known-Issues.html)

 

 


