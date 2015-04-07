<!--
|metadata|
{
    "fileName": "igmap-configuring-navigation-features",
    "controlName": "igMap",
    "tags": ["Charting","How Do I","Navigation"]
}
|metadata|
-->

# ナビゲーション機能の構成 (igMap)



##トピックの概要

### 目的

このトピックでは、コード例と共に、`igMap`™ コントロールのナビゲーション機能を構成する方法と、その API を使用してマップの表示部分の位置およびサイズを定義する方法を示します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igMap の概要](Overview-igMap.html): このトピックは、`igMap` コントロールについて、その主要機能、最小要件、ユーザー インタラクションといった事項の概念的情報を提供します。

- [igMap の追加](Adding-igMap.html): このトピックは、基本的な機能を備えた簡易 `igMap` コントロールを Web ページに追加する方法を示すチュートリアルです。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [ナビゲーション機能の構成の概要](#navigation)
-   [コード例の概要](#code-example)
    -   [マップの表示部分の座標を取得して地理単位に変換する方法](#coordinates-visible-portion)
    -   [マップ ウィンドウの変更ごとに通知を取得する方法](#notification)
    -   [マップの中心の地理座標を取得する方法](#coordinates-map-center)
    -   [任意の地理ポイントにマップの中心を置く方法](#centering)
    -   [プログラムによってマップをズームする方法](#zooming)
    -   [プログラムによってマップをパンする方法](#panning)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)



##<a id="introduction"></a>概要


### <a id="navigation"></a>ナビゲーション機能の概要

オブジェクトのナビゲーションと探索が、マップを使用する主な目的です。`igMap` コントロールは、広範なナビゲーション機能のセットと、そうした機能を各種コードで使用するためのオプションやメソッドを備えています。

Overview Plus Detail (OPD) パネルを有効にすると、このパネルはマップの右下隅に現れることになります。このパネルの中には、世界地図のサムネイルが表示され、ズーム操作用のボタン類とスライダーが含まれます。さらに、このパネル内で現在のビューの枠をドラッグして別の地域に移動させることもできるようになっています。

ユーザーは、マウス スクロールまたは [Page Up]/[Page Down] キーでズームアウト/ズームイン操作、マウス ドラッグまたはタッチ アンド ドラッグでパン操作を実行でき、他のナビゲーション操作はすべてオプションの設定によって制御されます。すべてのインタラクティブ機能のリファレンスについては、[igMap の概要: ユーザー操作とユーザー補助機能](Overview-igMap.html#user-interaction)を参照してください。

`igMap` のオプションやメソッドを使用することにより、開発者は、ユーザーによる別の領域への移動操作に伴って現在のマップ位置の設定や現在ビューの座標の取得をさまざまな方法で実装できます。開発者は、初期化時に表示する具体的なビューを指定しておくことも、ユーザー入力や動的操作に応じてランタイムで既定のビューを変更することもできます。



##ナビゲーション機能の構成の概要


### ナビゲーション機能の構成に関する要点チャート

次の表は、ナビゲーション機能に関して `igMap` コントロールで構成可能な項目をまとめたものです。

構成可能な項目|詳細|プロパティ
---|---|---
OPD パネルの表示/非表示|既定では、OPD パネルは表示されません。OPD パネルを表示するように構成した場合、このパネルはマップの右下隅に表示されることになります。|JavaScript の場合:<ul><li>[overviewPlusDetailPaneVisibility](%%jQueryApiUrl%%/ui.igMap#options:overviewPlusDetailPaneVisibility)</li></ul><br>ASP.NET MVC の場合:<ul><li> [OverviewPlusDetailPaneVisibility()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.SeriesViewer`3~OverviewPlusDetailPaneVisibility.html)</li></ul>
OPD パネルの背景画像|OPD パネルの背景に使用する画像の URL です。|JavaScript の場合:<ul><li>[overviewPlusDetailPaneBackgroundImageUri](%%jQueryApiUrl%%/ui.igMap#options:overviewPlusDetailPaneBackgroundImageUri)</li></ul><br>ASP.NET MVC の場合:<ul><li>[OverviewPlusDetailPaneBackgroundImageUri()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.Map`1~OverviewPlusDetailPaneBackgroundImageUri.html)</li></ul>
既定の操作|既定では、パン操作は行えず、ズーム操作が既定のドラッグ操作になっています。パン操作を既定のドラッグ操作に設定しておくこともできます。|JavaScript の場合:<ul><li>[defaultInteraction](%%jQueryApiUrl%%/ui.igMap#options:defaultInteraction)</li></ul><br>ASP.NET MVC の場合:<ul><li>[DefaultInteraction()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.SeriesViewer`3~DefaultInteraction.html)</li></ul>
パン操作の修飾キー|パン操作が既定の操作でない場合に使用する修飾キーです。|JavaScript の場合:<ul><li>[panModifier](%%jQueryApiUrl%%/ui.igMap#options:panModifier)</li></ul><br>ASP.NET MVC の場合:<ul><li>[PanModifier()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.SeriesViewer`3~PanModifier.html)</li></ul>
ズーム操作の修飾キー|ズーム操作が既定の操作でない場合に使用する修飾キーです。既定では、[Ctrl] キーを押すとズームに切り替わります。|JavaScript の場合:<ul><li>[dragModifier](%%jQueryApiUrl%%/ui.igMap#options:dragModifier)</li></ul><br>ASP.NET MVC の場合:<ul><li>[DragModifier()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.SeriesViewer`3~DragModifier.html)</li></ul>
マップに現在表示されている部分の取得|世界地図の表示部分の座標とサイズを取得します。|<ul><li>[actualWindowRect](%%jQueryApiUrl%%/ui.igMap#options:actualWindowRect)</li></ul>
マップの表示部分の設定|表示されるようにしたい世界地図の表示部分の座標とサイズを設定します。|JavaScript の場合:<ul><li>[windowRect](%%jQueryApiUrl%%/ui.igMap#options:windowRect)</li></ul><br>ASP.NET MVC の場合:<ul><li>[WindowRect()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.SeriesViewer`3~WindowRect.html)</li></ul>

>**注:** `windowRect` オプションは、現在のマップ ウィンドウを設定し、そのウィンドウに最後に割り当てられた値を保持します。`actualWindowRect` オプションは、マップのアスペクト比を維持してウィンドウの更新結果を取得し、実際のマップ ウィンドウのレンダリングに関する情報を提供します。



##<a id="code-example"></a>コード例の概要


### コード例の概要表

以下の表は、このトピックで使用したコード例をまとめたものです。

例|説明
---|---
[](#coordinates-visible-portion)[マップの表示部分の座標を取得して地理単位に変換する方法](#coordinates-visible-portion)|このコード例では、表示部分の座標を取得して地理単位に変換する方法を示します。
[](#notification)[マップ ウィンドウの変更ごとに通知を取得する方法](#notification)|このコード例では、`igMap` コントロールの `windowRectChanged` イベントにアタッチして、現在のマップ ウィンドウが変更されるたびに通知を受け取れるようにする方法を示します。
[マップの中心の地理座標を取得する方法](#coordinates-map-center)|このコード例では、マップの表示部分の座標を取得してその中心点の地理座標を計算する方法を示します。
[](#centering)[任意の地理ポイントにマップの中心を置く方法](#centering)|このコード例では、マップの地理座標を使用してマップの表示部分の中心点を任意のポイント (たとえば、特定の町など) に置く方法を示します。
[](#zooming)[プログラムによってマップをズームする方法](#zooming)|このコード例では、`igMap` API を使用してズームイン/ズームアウトを行う方法を示します。 
[](#panning)[プログラムによってマップをパンする方法](#panning)|このコード例では、`igMap` API を使用して東西南北の各方角にパンする方法を示します。


## <a id="coordinates-visible-portion"></a>コード例: マップの表示部分の座標を取得して地理単位に変換する方法


### 説明

このコード例では、マップ ウィンドウの地理座標を取得する方法を示します。

`igMap` コントロールの内部では、マップの表示部分の位置およびサイズが世界地図全体から見た (0 から 1 までの) 相対的な単位で保持されます。水平位置については、0 がマップの左端 (つまり、経度 -180 度に相当する西端) にあたり、1 がマップの右端 (つまり、経度 +180 度に相当する東端) にあたります。同様に、垂直位置については、0 がマップの上端 (つまり、緯度 90 度に相当する北端) にあたり、1 がマップの下端 (つまり、経度 -90 度に相当する南端) にあたります。

`igMap` コントロールには、相対座標を地理座標に変換する `getGeographicFromZoom()` メソッドが装備されています。このメソッドは、相対単位で指定された左、上、幅、および高さプロパティを備えたウィンドウ枠オブジェクトを受け取り、同じプロパティを備えたオブジェクトを地理単位で返します。

### コード

次のコード スニペットでは、`igMap` コントロールの `actualWindowRect` オプションを使用して、現在表示されているビューの位置およびサイズを取得して地理単位に変換する方法を示します。

**JavaScript の場合:**

```js
var relative = $("#map").igMap("option", "actualWindowRect");
var geographic = $("#map").igMap("getGeographicFromZoom", relative);
//  Assign coordinates to geographic area input elements
$("#leftGeo").val(geographic.left);
$("#topGeo").val(geographic.top);
$("#widthGeo").val(geographic.width);
$("#heightGeo").val(geographic.height);
```



##<a id="notification"></a>コード例: マップ ウィンドウの変更ごとに通知を取得する方法


### 説明

ユーザーはインタラクティブなマップ機能を使用してズーム操作やパン操作を実行できるようになっているため、現在のマップ ウィンドウで行われた表示位置や縮尺の変更は、その都度 HTML アプリケーションに通知する必要があります。`igMap` コントロールでは `windowRectChanged` イベントが発行されるようになっているため、アプリケーションは、マップ ウィンドウが変更されるたびに関数呼び出しをアタッチできます。

### コード

次のコード スニペットは、jQuery の `on()` 構文を使用して `actualWindowRectChanged` イベントに関数をアタッチします。アタッチされた関数は、座標を地理単位に変換してページ上にある HTML 要素の値に格納します。

**JavaScript の場合:**

```js
$(document).on("igmapactualwindowrectchanged", "#map", function (evt, ui) {
    //  Convert from relative to geographic coordinates
    var geographic = $("#map").igMap("getGeographicFromZoom",
                    {
                        left: ui.newLeft,
                        top: ui.newTop,
                        width: ui.newWidth,
                        height: ui.newHeight
                    }
        );
    //  Assign coordinates to geographic area input elements
    $("#leftGeo").val(geographic.left);
    $("#topGeo").val(geographic.top);
    $("#widthGeo").val(geographic.width);
    $("#heightGeo").val(geographic.height);
});
```



##<a id="coordinates-map-center"></a>コード例: マップの中心の地理座標を取得する方法


### 説明

このコード例では、マップの表示部分の座標を取得してその中心点の地理座標を計算する方法を示します。これにより、マップの中心が目的の地理ポイントまたはその近傍に置かれているかどうかを判断できるようになります。

### コード

次のコード スニペットは `actualWindowRect` オプションを取得して現在のマップ ウィンドウの座標を特定します。その後、その座標を地理単位に変換し、表示領域の中心点座標と半径を地理単位 (経度/緯度) で算出します。表示半径は、ウィンドウの幅または高さのいずれか小さい方の値をとります。各値の計算結果は、ページ上にある HTML　要素の値として割り当てられます。

**JavaScript の場合:**

```js
//  Calculates the central point and radius of the specified rectangle in
//  geographic coordinates
function centeredFromGeographic(geographic) {
    var centered =
        {
            latitude: geographic.top + (geographic.height / 2),
            longitude: geographic.left + (geographic.width / 2),
            radius: Math.min(geographic.height / 2, geographic.width / 2)
        };
    return centered;
}
 
var relative = $("#map").igMap("option", "actualWindowRect");
var geographic = $("#map").igMap("getGeographicFromZoom", relative);
//  Calculate central point and radius and assign to Center and Zoom editors
var centered = centeredFromGeographic(geographic);
$("#centerLatitude").val(centered.latitude);
$("#centerLongitude").val(centered.longitude);
$("#centerRadius").val(centered.radius);
```



##<a id="centering"></a>コード例: 任意の地理ポイントにマップの中心を置く方法

### 説明

このコード例では、マップの地理座標を使用してマップの表示部分の中心点を任意のポイントに置く方法を示します。ユーザーが一覧から特定のポイント (たとえば、町、病院、デパート…等) を選択してアプリケーションがそのポイントへ移動またはズームするという方式のアプリケーションには、このコードを使用すると便利です。

### コード

次のコードは、あるポイントの座標をページ上の HTML 要素の値から取得し、その値に基づいて適切なマップ ウィンドウ枠の座標を地理単位で計算します。このコードは、次に、`getZoomFromGeographic()` メソッドを使用してその地理単位を相対的な単位に変換し、変換結果を `windowRect` オプションに割り当ててマップの表示領域を所定の地域に移動させます。

**JavaScript の場合:**

```js
//  Calculates the geographic coordinates of a square around a central point and radius
function geographicFromCentered(centered) {
    var geographic =
    {
        left: centered.longitude - centered.radius,
        top: centered.latitude - centered.radius,
        width: centered.radius * 2,
        height: centered.radius * 2
    };
    return geographic;
}
var centered =
    {
        latitude: $("#centerLatitude").val(),
        longitude: $("#centerLongitude").val(),
        radius: $("#centerRadius").val()
    };
var geographic = geographicFromCentered(centered);
var relative = $("#map").igMap("getZoomFromGeographic", geographic);
$("#map").igMap("option", "windowRect", relative);
```



##<a id="zooming"></a>コード例: プログラムによってマップをパンする方法

### 説明

このコード例では、`igMap` API を使用してズームイン/ズームアウトを行う方法を示します。ズーム操作は、現在表示されているマップ ウィンドウを同じ中心点で計算し直すことによって実行されますが、表示地域はマップ ウィンドウよりも若干広い面積　(つまり、ズームアウトされた状態) になるか、または若干狭い面積 (つまり、ズームインされた状態) になります。

### コード

次のコード スニペットでは、`zoomScale` 変数に 5% のズーム率を定義することによってズームインをプログラミングし、`zoomIn()` メソッドを呼び出して実際のズーム操作を実行します。このメソッドは、まずマップ コントロールのアスペクト比をその幅と高さとの比率として計算します。次に、ズーム率を絶対単位で計算し、新しいマップ ウィンドウの幅、高さ、および左上隅の座標を算出します。このとき、新しい幅から高さを割り出すことによってアスペクト比を保持し、ウィンドウの中心点を同じポイントに置いたままの状態で維持します。また、左上隅の位置を 1.0 の座標に維持します。最後に、新しいマップ ウィンドウをコントロールの `windowRect` オプションに割り当てます。

**JavaScript の場合:**

```js
var zoomScale = 0.05;   //  Zoom scale to be used for zoom in/out operations
zoomIn("#map", zoomScale);
//  Calculates and sets a new zoomed in window rectangle for the specified map 
//  control, and specified zoom factor
function zoomIn(mapSelector, zoomFactor) {
    var map = $(mapSelector);
    var aspectRatio = map.width() / map.height();
    var mapWindow = map.igMap("option", "windowRect");
    var zoomScaleAbs = mapWindow.width * zoomFactor;
    mapWindow.width = mapWindow.width - (2 * zoomScaleAbs);
    mapWindow.height = mapWindow.width / aspectRatio;
    mapWindow.left = Math.min(1.0, mapWindow.left + zoomScaleAbs);
    mapWindow.top = Math.min(1.0, mapWindow.top + zoomScaleAbs);
    map.igMap("option", "windowRect", mapWindow);
}
```

次のコード スニペットは、プログラムによってズームアウトする方法を示してます。このコードは、ズームインの例と同じように機能しますが、異なる計算を実行してマップ ウィンドウを拡大して、左上隅の座標を 0.0 よりも大きな座標位置に維持します。

**JavaScript の場合:**

```js
var zoomScale = 0.05;   //  Zoom scale to be used for zoom in/out operations
zoomOut("#map", zoomScale);
//  Calculates and sets a new zoomed out window rectangle for the specified map 
//  control, and specified zoom factor
function zoomOut(mapSelector, zoomFactor) {
    var map = $(mapSelector);
    var aspectRatio = map.width() / map.height();
    var mapWindow = map.igMap("option", "windowRect");
    var zoomScaleAbs = mapWindow.width * zoomScale;
    mapWindow.width = mapWindow.width + (2 * zoomScaleAbs);
    mapWindow.height = mapWindow.width / aspectRatio;
    mapWindow.left = Math.max(0.0, mapWindow.left - zoomScaleAbs);
    mapWindow.top = Math.max(0.0, mapWindow.top - zoomScaleAbs);
    map.igMap("option", "windowRect", mapWindow);
}
```



##<a id="panning"></a>コード例: プログラムによってマップをパンする方法

### 説明

このコード例では、`igMap` API を使用して東西南北の各方角にパンする方法を示します。現在表示されているマップ ウィンドウの左上隅の位置を計算し直すことによってパン操作を実行します。この結果、マップ ウィンドウは、4 つの方角のいずれかの方向に移動します。

### コード

次のコード スニペットは、移動可能な 4 つ方角へパンするための関数を定義しています。どのメソッドも `actualWindowRect` オプションを使用してコントロールから現在のマップ ウィンドウを取得し、要求された方向に左上隅の座標を移動させます。すべての関数が、左上隅の座標を 0.0 から 1.0 の範囲内に制限するように配慮します。`panFactor` 引数は、要求された方向へのビューの移動量をパーセンテージで定義します。

**JavaScript の場合:**

```js
//  Calculates and sets a new window rectangle for the specified map control with
//  the specified amount of panning to the North
function panNorth(mapSelector, panFactor) {
    var map = $(mapSelector);
    var mapWindow = map.igMap("option", "actualWindowRect");
    var panScale = Math.min(mapWindow.width, mapWindow.height) * panFactor;
    mapWindow.top = Math.max(0.0, mapWindow.top - panScale);
    map.igMap("option", "windowRect", mapWindow);
}
//  Calculates and sets a new window rectangle for the specified map control with
//  the specified amount of panning to the South
function panSouth(mapSelector, panFactor) {
    var map = $(mapSelector);
    var mapWindow = map.igMap("option", "actualWindowRect");
    var panScale = Math.min(mapWindow.width, mapWindow.height) * panFactor;
    mapWindow.top = Math.min(1.0 - mapWindow.height, mapWindow.top + panScale);
    map.igMap("option", "windowRect", mapWindow);
}
//  Calculates and sets a new window rectangle for the specified map control with
//  the specified amount of panning to the West
function panWest(mapSelector, panFactor) {
    var map = $(mapSelector);
    var mapWindow = map.igMap("option", "actualWindowRect");
    var panScale = Math.min(mapWindow.width, mapWindow.height) * panFactor;
    mapWindow.left = Math.max(0.0, mapWindow.left - panScale);
    map.igMap("option", "windowRect", mapWindow);
}
//  Calculates and sets a new window rectangle for the specified map control with
//  the specified amount of panning to the East
function panEast(mapSelector, panFactor) {
    var map = $(mapSelector);
    var mapWindow = map.igMap("option", "actualWindowRect");
    var panScale = Math.min(mapWindow.width, mapWindow.height) * panFactor;
    mapWindow.left = Math.min(1.0 - mapWindow.width, mapWindow.left + panScale);
    map.igMap("option", "windowRect", mapWindow);
}
```



##<a id="related-content"></a>関連コンテンツ


###<a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [ビジュアル機能の構成 (igMap)](igMap-Configuring-Visual-Features.html): このトピックでは、十字形、ツールチップ テンプレート、マーカー テンプレートなど、`igMap` コントロールのビジュアル機能を構成する方法を示します。

- [マップ シリーズの構成 (igMap)](igMap-Creating-Different-Kinds-Maps.html): このトピック グループでは、多種多様なマップを生成できるように `igMap`™ コントロールでサポートされる全マップ タイプ (マップ シリーズ) の構成方法を説明します。





 

 


