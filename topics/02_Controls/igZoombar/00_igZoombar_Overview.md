<!--
|metadata|
{
    "fileName": "igzoombar-overview",
    "controlName": "igZoombar",
    "tags": ["Charting","Data Presentation","Getting Started"]
}
|metadata|
-->

# igZoombar の概要

ズーム範囲ウィンドウの配置

## トピックの概要
### 目的

このトピックは、`igZoombar`™ コントロールの概念的な情報を説明し、このコントロールがサポートするユーザー インタラクションや基本構成などを含む機能を紹介します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igDataChart の概要](igDataChart-Overview.html): このトピックは、`igDataChart`™ コントロールについて、その主要機能、最低必須事項、ユーザー機能といった事項の概念的情報を提供します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
    -   [igZoombar の概要](#summary)
    -   [サポートされるコントロール](#supported-controls)
-   [**主要機能**](#main-features)
-   [**ユーザー インタラクションと操作性**](#user-interaction)
    -   [ユーザー インタラクションの概要](#user-interaction-summary)
    -   [ユーザー インタラクションの概要表](#user-interaction-summary-chart)
    -   [タッチ サポート](#touch-support)
-   [**igZoombar の構成**](#config-igzoombar)
-   [**igZoombar デフォルトの構成**](#default-config)
    -   [igZoombar デフォルト構成の概要](#config-summary)
    -   [igZoombar デフォルト構成の概要表](#config-summary-chart)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a>概要
### <a id="summary"></a>igZoombar の概要

`igZoombar` コントロールは、範囲対応コントロールにズーム機能を提供します。`igZoombar` には、水平スクロールバー、全範囲の縮小表示、サイズ変更可能なズーム範囲ウィンドウの機能があります。

![](images/igZoombar_Overview_1.png)

`igZoombar` コントロールは、`igDataChart`™ のような範囲ベースのコントロールに対する機能拡張として使用するように設計されています。`igZoombar` は、スタンドアロン コントロールとしては機能しません。

### <a id="supported-controls"></a>サポートされるコントロール

`igZoombar` コントロールは、追加設定なしで `igDataChart` コントロール をサポートします。`igZoombar` コントロールは拡張可能で、他の Infragistics® コントロールやサード パーティの範囲対応コントロールとカスタム統合できます。

以下のスクリーンショットは、`igDataChart` と組み合わせた `igZoombar` を示します。

![](images/igZoombar_Overview_2.png)



## <a id="main-features"></a>主要機能
### 主要な機能の概要表

以下の表で、`igZoombar` コントロールの主な機能を簡単に説明します。

<table class="table">
	<thead>
		<tr>
            <th>
機能
			</th>

            <th>
説明
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
スクロールバーのナビゲーション
			</td>

            <td>
`igZoombar` スクロールバーの組み込み機能を使用して、スケールを変更してデータ範囲をスクロールできます。
			</td>
        </tr>

        <tr>
            <td>
パンとズーム
			</td>

            <td>
サムパッドの端をドラッグして表示スケールを調節し、現在の表示範囲を広げる (ズーム アウト)、または狭くする (ズーム イン) ことができます。
			</td>
        </tr>

        <tr>
            <td>
複数のユーザー インタラクション オプション
			</td>

            <td>
マウスによるすべてのインタラクションは、タッチ操作 (ほとんどはキーボードを介した操作) でもサポートされます。詳細については、次を参照してください:
                    [ユーザー インタラクションと操作性](#user-interaction)
			</td>
        </tr>

        <tr>
            <td>
タッチ サポート
			</td>

            <td>
タッチ対応デバイスでは、`igZoombar` のすべての機能を使用できます。すべてのマウス操作は、タッチ環境でもサポートされます。
			</td>
        </tr>

        <tr>
            <td>
設定不要の、他のコントロールとの統合
			</td>

            <td>
`igZoombar` コントロールは、追加設定なしで `igDataChart` コントロール をサポートします。
			</td>
        </tr>

        <tr>
            <td>
拡張性
			</td>

            <td>
`igZoombar` コントロールは、追加設定なしで `igDataChart` コントロール をサポートします。`igZoombar` コントロールは拡張可能で、他の Infragistics® コントロールやサード パーティの範囲対応コントロールとカスタム統合できます。
			</td>
        </tr>

        <tr>
            <td>
構成可能なズーム範囲ウィンドウ
			</td>

            <td>
                ズーム範囲ウィンドウの初期幅、初期位置、最小サイズは、構成可能です。

               ** 関連トピック:**

                <ul>
                    <li>
[igZoombar の構成](Configuring-igZoombar.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
更新モード
			</td>

            <td>
                ズーム操作は、以下のいずれかのモードで構成できます。`igZoombar` コントロールを使用してズーム操作を行った場合、その効果をすぐに適用するイミディエイト モードまたは操作が完了するまで適用しない遅延モード。

                **関連トピック:**

                <ul>
                    <li>
[igZoombar の構成](Configuring-igZoombar.html)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>



## <a id="user-interaction"></a>ユーザー インタラクションと操作性
### <a id="user-interaction-summary"></a>ユーザー インタラクションの概要

`igZoombar` のすべての機能は、マウス対応デバイスおよびタッチ対応デバイスで使用できます。キーボード操作は、ズーム範囲ウィンドウの左右方向のスクロールのみサポートします。

### <a id="user-interaction-summary-chart"></a>ユーザー インタラクションの概要表

以下の表は、すべての可能なインターフェイスで実行できる `igZoombar` コントロールの操作を示しています。

<table class="table">
	<thead>
		<tr>
            <th>
目的
			</th>

            <th>
方法
			</th>

            <th>
詳細
			</th>

            <th>
クライアント/サーバー設定
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
パンとズーム
			</td>

            <td>
ズーム範囲ウィンドウに広い範囲 (ズーム アウト) または狭い範囲 (ズーム イン) を表示するために、ズーム範囲ウィンドウの範囲スライダーを使用します。
			</td>

            <td>
マウスでドラッグする、またはドラッグ ジェスチャでドラッグし、範囲スライダーを動かすことができます。
			</td>

            <td>
                
                    
                        ![](images/positive.png)
                    
                

                ユーザー インタラクションと間接的に関連する以下の項目で、コントロールを構成できます。

                <ul>
                    <li>
更新モード
					</li>

                    <li>
ズーム範囲ウィンドウの初期サイズおよび位置
					</li>

                    <li>
ズーム範囲ウィンドウの最小サイズ
					</li>
                </ul>

                <h4>関連トピック:</h4>

                <ul>
                    <li>
[igZoombar の構成](Configuring-igZoombar.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td rowspan="5">
ズーム範囲ウィンドウの配置
			</td>

            <td>
ズーム範囲ウィンドウ自体
			</td>

            <td>
ズーム範囲ウィンドウは、任意の位置までドラッグできます。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
スクロールバー スライダー
			</td>

            <td>
スクロールバー スライダーをドラッグし、ズーム範囲ウィンドウの位置を決めることができます。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
サムネイル領域
			</td>

            <td>
範囲を表すサムネイル領域をクリックまたはタップすると、ズーム範囲ウィンドウはその地位に移動します。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
スクロールバーのトラック
			</td>

            <td>
スクロールバー スライダーの左右のトラックをクリックすると、ズーム範囲ウィンドウはそれぞれの方向にウィンドウ 1 つ分移動します。
			</td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
                <ul>
                    <li>
スクロールバーのナビゲーション ボタン
					</li>

                    <li>
矢印キー
					</li>
                </ul>
            </td>

            <td>
スクロールバーのナビゲーション ボタンの操作は、キーボードの左右の矢印キーでも同様に動作します。
			</td>

            <td>
![](images/positive.png)
                1 回のボタン操作でズーム範囲ウィンドウが移動する距離は、[zoomWindowMoveDistance](%%jQueryApiUrl%%/ui.igzoombar#options:zoomWindowMoveDistance) プロパティで構成できます。
			</td>
        </tr>
    </tbody>
</table>



### <a id="touch-support"></a>タッチ サポート

タッチ対応デバイスでは、igZoombar のすべての機能を使用できます。すべてのマウス操作は、タッチ環境でもサポートされます。



## <a id="config-igzoombar"></a>igZoombar の構成
### igZoombar 構成の概要表

以下の表は、`igZoombar` の構成可能な要素を示します。詳細は、[構成トピック](Configuring-igZoombar.html)を参照してください。

<table class="table table-bordered">
	<thead>
		<tr>
            <th>
構成可能な項目
			</th>

            <th>
詳細
			</th>

            <th>
プロパティ
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
ズーム範囲ウィンドウの初期サイズおよび位置
			</td>

            <td>
ズーム範囲ウィンドウの初期幅および位置を構成できます。
			</td>

            <td>
                <ul>
                    <li>
[defaultZoomWindow.left](%%jQueryApiUrl%%/ui.igzoombar#options:defaultZoomWindow.left)
					</li>

                    <li>
[defaultZoomWindow.width](%%jQueryApiUrl%%/ui.igzoombar#options:defaultZoomWindow.width)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
ズーム範囲ウィンドウの最小サイズ
			</td>

            <td>
ズーム範囲ウィンドウの最小幅は、ウィンドウをそれ以上縮小できない限界のサイズです。最小サイズは構成できます。
			</td>

            <td>
                <ul>
                    <li>
[zoomWindowMinWidth](%%jQueryApiUrl%%/ui.igzoombar#options:zoomWindowMinWidth)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
ズーム操作で最新の情報に更新
			</td>

            <td>
                igZoombar コントロールは、実行するズーム操作に対するコントロールの反応に基づき、以下のリフレッシュ モードのいずれかに設定できます。

                <ul>
                    <li>
**Immediate** (デフォルト) - ズーム効果は、igZoombar コントロール操作に従って即座に適用されます。
					</li>

                    <li>
**Deferred** - ズーム効果は操作を終了するまで遅延されます。
					</li>
                </ul>
            </td>

            <td>
                <ul>
                    <li>
[zoomAction](%%jQueryApiUrl%%/ui.igzoombar#options:zoomAction)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
ズーム範囲ウィンドウの移動ステップ
			</td>

            <td>
スクロールバーのナビゲーション ボタンをクリックまたはタップ、またはキーボードの右 / 左矢印キーを押すとズーム範囲ウィンドウが移動するステップを構成することができます。
			</td>

            <td>
                <ul>
                    <li>
[zoomWindowMoveDistance](%%jQueryApiUrl%%/ui.igzoombar#options:zoomWindowMoveDistance)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>




## <a id="default-config"></a>igZoombar デフォルトの構成
### <a id="config-summary"></a>igZoombar デフォルト構成の概要

デフォルトで、ズーム範囲ウィンドウは `igZoombar` コントロールの中心に位置し、その幅全体 (= 100%) の 30% まで広がります。ズーム範囲ウィンドウのサイズは、全コントロール幅の 5% まで縮小できます。デフォルトのリフレッシュ モードはImmediateです。

### <a id="config-summary-chart"></a>igZoombar デフォルト構成の概要表

以下の表に、`igZoombar` プロパティとコントロールのデフォルト構成を形成する設定を示します。

プロパティ|タイプ|デフォルト値|説明
---|---|---|---
[defaultZoomWindow.left](%%jQueryApiUrl%%/ui.igzoombar#options)|number|35|ズーム範囲ウィンドウの始点側 (左) の端は、`igZoombar` コントロールの始点側 (左) の端から数えて幅全体の 35% の所に位置します。
[defaultZoomWindow.width](%%jQueryApiUrl%%/ui.igzoombar#options)|number|30|ズーム範囲ウィンドウの幅は、`igZoombar` コントロールの幅全体の 30% に設定されています。
[zoomWindowMinWidth](%%jQueryApiUrl%%/ui.igzoombar#options)|number|5|ズーム範囲ウィンドウのサイズは全コントロール幅の 5% まで縮小できます。
[zoomAction](%%jQueryApiUrl%%/ui.igzoombar#options)|string|"immediate"|デフォルトのリフレッシュ モードはImmediateです。


## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igZoombar の追加](Adding-igZoombar.html): このトピックではコード例を使用して、`igZoombar` コントロールを HTML ページおよび ASP.NET MVC アプリケーションに追加する方法を説明します。

- [igZoombar の構成](Configuring-igZoombar.html): このトピックではコード例を使用して、ズーム動作と `igZoombar` コントロールのズーム ウィンドウを構成する方法を説明します。

- [アクセシビリティの遵守 (igZoombar)](igZoombar-Accessibility-Compliance.html): このトピックは、`igZoombar` コントロールのアクセシビリティ機能を説明し、このコントロールを含むページのアクセシビリティ遵守を実現する方法を説明します。

- [既知の問題と制限 (igZoombar)](igZoombar-Known-Issues-And-Limitations.html): このトピックでは、`igZoombar` コントロールの既知の問題と制限、その回避策について説明します。

- [jQuery および MVC API リファレンス リンク (igZoombar)](igZoombar-ASP-NET-MVC-Helper-API.html): このトピックでは、`igZoombar` コントロールと ASP.NET MVC ヘルパーに関する API 参照ドキュメントへのリンクを提供します。

### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本のズームバー](%%SamplesUrl%%/zoombar/financial-chart): このサンプルは、`igZoombar` を財務データを表示する `igDataChart` コントロールに統合する方法を紹介します。





 

 


