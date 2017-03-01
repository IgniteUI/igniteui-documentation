<!--
|metadata|
{
    "fileName": "typescript-samples",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# TypeScript サンプル

## トピックの概要
このトピックでは、Ignite UI コントロールと TypeScript のサンプルについて説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。
-   [要件](#requirements)
-   [タイル マネージャー サンプル](#tile_manager_sample)
    -   [プレビュー](#tile_manager_sample_preview)
    -   [HTML を作成します。](#tile_manager_steps_html)
    -   [データ ソースを作成します。](#tile_manager_steps_ds)
    -   [igTileManager を作成します。](#tile_manager_steps_tm)
-   [関連コンテンツ](#related_content)

### <a id="requirements"></a>要件
これらのサンプルを実行するには、以下が必要となります。
-   必要な Ignite UI の JavaScript と CSS ファイル
-   必要な Ignite UI TypeScript の定義

### <a id="tile_manager_sample"></a>タイル マネージャー サンプル
このサンプルは、`igTileManager` を TypeScript で使用する方法を示します。

#### <a id="tile_manager_sample_preview"></a>プレビュー
以下のスクリーンショットは最終結果のプレビューです。

![](images/igTileManager_TypeScript.png)

<a id="tile_manager_steps_html"></a>HTML の作成 - 車メーカーを持つ 3 つのタブ、そして選択されたメーカーの写真を読み込む igTileManager があります。

**HTML の場合:**
```html
<h1 class="hOne">Infragistics Car Dealership</h1>
<h3>Choose a car brand to browse</h3>
<div id="car-tabs">
    <ul>
        <li><a href="#magarcedesDashboard">Magarcedes</a></li>
        <li><a href="#hoidaDashboard">Hoida</a></li>
        <li><a href="#pausheDashboard">Paushe</a></li>
    </ul>

    <div id="magarcedesDashboard" class="dashboard"></div>
    <div id="hoidaDashboard" class="dashboard"></div>
    <div id="pausheDashboard" class="dashboard"></div>
</div>
```

​<a id="tile_manager_steps_ds"></a>データソースの作成 - クラス `CarData` および `Info`、3 つの 車メーカーのデータを初期化します。すべてを `Cars` 配列に保存します。


**TypeScript の場合:**
```typescript
/// <reference path="../../js/typings/jquery.d.ts" />
/// <reference path="../../js/typings/jqueryui.d.ts" />
/// <reference path="../../js/typings/igniteui.d.ts" />

class Info {
    description: string
    constructor(_description: string) {
        this.description = _description;
    }
}

class CarData {
    name: string;
    picture: string;
    priceRange: string;
    extras: Info[];
    constructor(_name: string, _picture: string, _priceRange: string, _extras: Info[]) {
        this.name = _name;
        this.picture = _picture;
        this.priceRange = _priceRange;
        this.extras = _extras;
    }

    addExtra(_extra) {
        this.extras.push(_extra);
    }
}

var Magarcedes: CarData[] = [];
Magarcedes.push(new CarData("2013 LSL AMG", "../../images/samples/tile-manager/car-dealership/shutterstock_139519967.jpg",
    "$199,500 - $206,000", [new Info("0-100 in 3.8 seconds"), new Info("Top speed: 317 km/h")]));
...

var Hoida: CarData[] = [];
Hoida.push(new CarData("2013 Candy", "../../images/samples/tile-manager/car-dealership/shutterstock_57034834.jpg",
    "$21,661 - $29,404", [new Info("Gas I4 2.5L engine"), new Info("Highway fuel efficiency 35 mpg")]));
...

var Paushe: CarData[] = [];
Paushe.push(new CarData("2013 CST", "../../images/samples/tile-manager/car-dealership/shutterstock_38288989.jpg",
    "$39,095 - $59,090", [new Info("Available All Wheel Drive"), new Info("Available touch-screen glide-up navigation with voice recognition"),
        new Info("Leather seating surfaces"), new Info("Adaptive Remote Start")]));
...

var Cars: CarData[][] = [];
Cars.push(Magarcedes);
Cars.push(Hoida);
Cars.push(Paushe);
```

​<a id="tile_manager_steps_tm"></a>igTileManager の作成- `igTileManager` とタブを作成します。次に最初の車メーカーをあらかじめ選択し、タブが選択されたときに `igTileManager` データソースで更新するようタブを設定します。

**TypeScript の場合:**
```typescript
$(function () {
    var activated: boolean[] = [false, false, false, false],
    options: IgTileManager = {
            columnWidth: 210,
            columnHeight: 210,
            marginLeft: 10,
            marginTop: 10,
            dataSource: Cars,
            items: [
                { rowIndex: 0, colIndex: 0, rowSpan: 2, colSpan: 2 },
                { rowIndex: 0, colIndex: 2, rowSpan: 1, colSpan: 1 },
                { rowIndex: 1, colIndex: 2, rowSpan: 1, colSpan: 1 },
                { rowIndex: 2, colIndex: 0, rowSpan: 1, colSpan: 1 },
                { rowIndex: 2, colIndex: 1, rowSpan: 1, colSpan: 1 },
                { rowIndex: 2, colIndex: 2, rowSpan: 1, colSpan: 1 }
            ],
            maximizedTileIndex: 0,
            maximizedState: '<figure><figcaption>${name}</figcaption><img src="${picture}" title="${Name}" alt="error" /></figure><ul><li>Price: ${priceRange}</li>' +
            '{{each ${extras} }}<li>${extras.description}</li>{{/each}}</ul>',
            minimizedState: '<figure><figcaption>${name}</figcaption><img src="${picture}" title="${Name}" alt="error" />'
        };

    // ページの読み込みで表示されるタブの初めての初期化
    options.dataSource = Cars[0];
    activated[0] = true;
    $('#magarcedesDashboard').igTileManager(options);

    var tabOptions: JQueryUI.TabsOptions = {
        activate: function (event, ui) {
            var index = ui.newTab.index();
            if (!activated[index]) {
                options.dataSource = Cars[index];
                ui.newPanel.igTileManager(options);
                activated[index] = true;
            } else {
                ui.newPanel.igTileManager('reflow');
            }
        }
    }

    $('#car-tabs').tabs(tabOptions);
});
```

### <a id="related_content"></a>関連コンテンツ
以下のトピックでは、このトピックに関連する追加情報を提供しています。

[TypeScript での Ignite UI の使用](Using-Ignite-UI-with-TypeScript.html) - このトピックでは、Ignite UI の型定義を TypeScript で使用する方法の概要を説明します。
