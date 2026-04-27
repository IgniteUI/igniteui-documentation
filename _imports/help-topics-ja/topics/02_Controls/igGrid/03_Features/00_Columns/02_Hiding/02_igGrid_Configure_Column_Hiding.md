<!--
|metadata|
{
    "fileName": "iggrid-configure-column-hiding",
    "controlName": "igGrid",
    "tags": ["Getting Started","Grids"]
}
|metadata|
-->

# 列の非表示の構成 (igGrid)

## トピックの概要

### 目的

このトピックでは、コードで `igGrid`™ コントロールの列を構成する方法を説明します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**列構成の概要**](#column-configuration-overview)
-   [**例: 列の非表示 (デフォルト)**](#example-hiding-column-by-default)
    -   [プロパティ設定](#example-hiding-column-by-default-property-settings)
    -   [コード](#example-hiding-column-by-default-code)
-   [**例: 列の完全な非表示**](#example-hiding-column-completely)
    -   [プレビュー](#example-hiding-column-completely-preview)
    -   [プロパティ設定](#example-hiding-column-completely-property-settings)
    -   [コード](#example-hiding-column-completely-code)
-   [**例: 列の非表示のキャンセル**](#example-canceling-column-hiding)
    -   [概要](#example-canceling-column-hiding-overview)
    -   [手順](#example-canceling-column-hiding-steps)
-   [**例: 列チューザーの構成**](#example-configuring-column-chooser)
    -   [プレビュー](#example-configuring-column-chooser-preview)
    -   [プロパティ設定](#example-configuring-column-chooser-property-settings)
    -   [コード](#example-configuring-column-chooser-code)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)

### 必要な背景

以下の表は、このトピックの情報を完全に理解するために前提条件を示しています。

- トピック
	- まず[列の非表示を有効にする](igGrid-Column-Hiding-Enabling-Column-Hiding.html)トピックを読む必要があります。
- 外部リソース
	- まず以下のセクションを読む必要があります。
	- [jQuery on() API](http://api.jquery.com/on/)

## <a id="column-configuration-overview"></a> 列構成の概要

以下の表は、`igGrid` コントロール列の構成可能なビヘイビアーを示しています。これらのビヘイビアーは、コントロールの `columnSettings` オプションのプロパティで管理されます。一部のビヘイビア/機能については、チャートに続くブロックに詳細説明と例が記載されています。

> **注:** 以下の表には、[列チューザーの非表示](igGrid-Hiding-Column-Chooser.html)に固有のプロパティとメソッドは記載されていません。それらについては、[列チューザーを非表示にする](igGrid-Hiding-Column-Chooser.html)トピックをご覧ください。

構成可能なビヘイビアー/機能|構成の詳細|構成プロパティ
------------------------------|-----------------------|-------------------------
列の非表示 (デフォルト)|グリッドの初期化時は列は非表示になっています。|hidden
列を完全に非表示にする|グリッドの初期化時は列は非表示なっており、ユーザー オプションは何も表示されません。|allowHiding
列の非表示を有効にする|ユーザーによる列の非表示を可能にします。|allowHiding
非表示の列インジケーターの幅|ヘッダー内の非表示の列インジケーターの幅 (ピクセル)|hiddenColumnIndicatorHeaderWidth
列チューザーの構成|デフォルトの列チューザーの幅 (ピクセル)|columnChooserWidth
列チューザーの構成|デフォルトの列チューザーの高さ (ピクセル)。|columnChooserHeight
ドロップダウン アニメーションの期間|ドロップダウン アニメーションの時間 (ミリ秒)。|dropDownAnimationDuration
ドロップダウン ボタンの表示/非表示。|フッター ボタンの表示状態。|showDropDownButton
列チューザーの構成|列チューザー ウィンドウのキャプションのテキスト。|columnChooserCaptionText
列チューザーの構成|ドロップダウン ツール メニューのキャプション (機能セレクター)。|columnChooserDisplayText
ツールチップ テキスト|非表示の列インジケーターのツールチップに表示されるテキスト。|hiddenColumnIndicatorTooltipText
列キーの構成|列キー。これは優先列 ID です。|columnKey
列インデックスの構成|列インデックス。列キーが設定されていない場合に使用できます。|columnIndex


## <a id="example-hiding-column-by-default"></a> 例: 列の非表示 (デフォルト)

以下の図では、Reorder Point 列が初期化時に非表示になっています。

![](images/Hiding_Configure_Pic1.png)

### <a id="example-hiding-column-by-default-property-settings"></a> プロパティ設定

以下の表は、プロパティ設定の推奨構成をマップしています。プロパティは `igGridHiding` オプションからアクセスされます。

プロパティ|設定
----|----
[columnKey](%%jQueryApiUrl%%/ui.igGridHiding#options:columnSettings.columnKey) |ReorderPoint
[allowHiding](%%jQueryApiUrl%%/ui.igGridHiding#options:columnSettings.allowHiding) |true
[hidden](%%jQueryApiUrl%%/ui.igGridHiding#options:columnSettings.hidden) |true

### <a id="example-hiding-column-by-default-code"></a> コード

**JavaScript の場合:**

```javascript
<script type="text/javascript">
$(function () {
    $("#grid1").igGrid({
        autoGenerateColumns: true,
        dataSource: adventureWorks,
        responseDataKey: 'Records',
        features: [
        {
            name: 'Hiding',
            columnSettings: [
                {columnKey: 'ReorderPoint', allowHiding: true, hidden: true}
            ]
        }
    });
});
</script>
```


**Razor の場合:**

```csharp
@Html.Infragistics().Grid(Model)
    .AutoGenerateColumns(true)
    .Features(feature =>{       
        feature.Hiding().ColumnSettings(settings =>    settings.ColumnSetting()
        .ColumnKey("ReorderPoint")
        .AllowHiding(true)
        .Hidden(true));
    }).DataBind().Render()
)
```

## <a id="example-hiding-column-completely"></a> 例: 列の完全な非表示

### <a id="example-hiding-column-completely-preview"></a> プレビュー

以下の図は Address と BirthDate の 2 つの列が完全に非表示になったグリッドを表示します。これらの列の印がないため、ユーザーは列が非表示でることを認識できません。

![](images/Hiding_Configure_Pic2.png)

### <a id="example-hiding-column-completely-property-settings"></a> プロパティ設定

以下の表は、プロパティ設定の推奨構成をマップしています。プロパティは igGridHiding オプションからアクセスされます。

プロパティ|設定
----|----
[columnKey](%%jQueryApiUrl%%/ui.igGridHiding#options:columnSettings.columnKey)|true
[allowHiding](%%jQueryApiUrl%%/ui.igGridHiding#options:columnSettings.allowHiding)|false

### <a id="example-hiding-column-completely-code"></a> コード

**JavaScript の場合:**

```javascript
<script type="text/javascript">
$(function () {
    $("#grid1").igGrid({
        autoGenerateColumns: true,
        dataSource: adventureWorks,
        responseDataKey: 'Records',
        features: [
        {
            name: 'Hiding',
            columnSettings: [
                {columnKey: 'Address', allowHiding: false, hidden: true}
                {columnKey: 'BirthDate', allowHiding: false, hidden: true}
            ]
        }
    });
});
</script>
```

**Razor の場合:**

```csharp
@Html.Infragistics().Grid(Model)
    .AutoGenerateColumns(true)
    .Features(feature =>{       
        feature.Hiding().
        .ColumnSettings(settings =>
        {                             
            settings.ColumnSetting().ColumnKey("Address").Hidden(true).AllowHiding(false);                                
            settings.ColumnSetting().ColumnKey("BirthDate").Hidden(true).AllowHiding(false);
        })
    ).DataBind().Render()
)
```

### <a id="example-canceling-column-hiding"></a> 列の非表示のキャンセル

列の非表示のキャンセルは、`columnHiding` イベントをキャンセルすることで行います。`columnHiding` が発生した場合に、列を非表示にしないようにするためにこれが行われます。

### <a id="example-canceling-column-hiding-overview"></a> 概要

以下はプロセスの概念的概要です。

1.  `columnHiding` イベントの処理
2.  イベントのキャンセル

### <a id="example-canceling-column-hiding-steps"></a> 手順

1.  `columnHiding` イベントを処理します。
    1.  ハンドラー関数を定義します。

        columnHiding イベントが発生した場合に呼び出される関数を定義します。

        **JavaScript の場合:**

        ```javascript
        <script type="text/javascript">     
        function gridColumnHiding (evt, ui) {
         
        };   
        </script>
        ```

	2. ハンドラーを `igGrid` の `columnHiding` イベントに設定します。
		
		いったんハンドラーを定義したら、`columnHiding` イベントのハンドラーとして設定する必要があります。jQuery では、これはウィジェットがインスタンス化されるときに行うことができます。ASP.NET MVC では、jQuery `on` または `bind` API を使用してイベントを添付する必要があります。また on API の使用は、純粋な jQuery 実装のイベントを添付するためのオプションです。このイベントの型は `iggridhidingcolumnhiding` です。

		**JavaScript の場合:**
		
		```javascript
		$(function () {
			$("#grid1").igGrid({
				autoGenerateColumns: true,
				dataSource: adventureWorks,
				responseDataKey: 'Records',
				features: [
				{
				     name: 'Hiding',
				     columnHiding: gridColumnHiding
				}
				]
			});
		});
		```
		
		**HTML と ASPX の場合:**
		
		```js
		$("# grid1").on("iggridhidingcolumnhiding", comboSelectionChanging);
		```

2.  イベントをキャンセルします。

    イベントをキャンセルするには、false を返します。

    **HTML と JavaScript の場合:**

    ```javascript
    <script type="text/javascript">
            
        function gridColumnHiding (evt, ui) {
           if (conditionNotMet)
              return false;
         };   
    </script>
    ```

これらのプロパティの詳細情報は、プロパティ参照セクションのリストを参照してください。

-   [igGridColumnHiding イベント](%%jQueryApiUrl%%/ui.igGridHiding#events)

## <a id="example-configuring-column-chooser"></a> 例: 列チューザーの構成

この例では、列チューザーが以下の設定で構成されています。

-   width - 300 ピクセル
-   height - 300 ピクセル
-   caption - New Caption Text
-   列選択ボタン - New Chooser Text

### <a id="example-configuring-column-chooser-preview"></a> プレビュー 

以下は最終結果のプレビューです。

![](images/Hiding_Configure_Pic3.png)

### <a id="example-configuring-column-chooser-property-settings"></a> プロパティ設定

以下の表は、プロパティ設定の推奨構成をマップしています。
プロパティは `igGridHiding` オプションからアクセスされます。

プロパティ|設定
---------|-------
[columnChooserWidth](%%jQueryApiUrl%%/ui.igGridHiding#options:columnChooserWidth) |300
[columnChooserHeight](%%jQueryApiUrl%%/ui.igGridHiding#options:columnChooserHeight) |300
[columnChooserCaptionText](%%jQueryApiUrl%%/ui.igGridHiding#options:columnChooserCaptionText) |New Caption Text
[columnChooserDisplayText](%%jQueryApiUrl%%/ui.igGridHiding#options:columnChooserDisplayText) |New Chooser Text


### <a id="example-configuring-column-chooser-code"></a> コード

**JavaScript の場合:**

```javascript
<script type="text/javascript">
$(function () {
    $("#grid").igGrid({
          autoGenerateColumns: true,
          dataSource: source,
              features: [
              {
                  name: 'Hiding',
                  columnChooserWidth: 300,
                  columnChooserHeight: 300,
                  columnChooserCaptionText: 'New Caption Text',
                  columnChooserDisplayText: 'New Chooser Text'
              }]
    });
});
</script>
```

**Razor の場合:**

```csharp
@Html.Infragistics().Grid(Model)
    .AutoGenerateColumns(true)
    .Features(feature =>{       
            feature.Hiding()
            .ColumnChooserHeight(300)
            .ColumnChooserWidth(300)
            .ColumnChooserCaptionText("New Caption Text")
            .ColumnChooserDisplayText("New Chooser Text");
        }).DataBind().Render()
)
```

## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-   [列の非表示を有効にする](igGrid-Column-Hiding-Enabling-Column-Hiding.html)
-   [列非表示イベント API](%%jQueryApiUrl%%/ui.iggridhiding#events)

