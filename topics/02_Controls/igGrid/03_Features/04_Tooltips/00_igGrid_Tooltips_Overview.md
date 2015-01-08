<!--
|metadata|
{
    "fileName": "iggrid-tooltips-overview",
    "controlName": "igGrid",
    "tags": ["Getting Started","Grids"]
}
|metadata|
-->

# ツールチップの概要 (igGrid)

## トピックの概要

### 目的
このトピックは、`igGrid`™ のツールチップ ウィジェットとその主な機能を紹介します。

### このトピックの内容
このトピックは、以下のセクションで構成されます。

- [概要](#introduction)
- [主要機能](#features)
- [関連トピック](#topics)

## <a id="introduction"></a> 概要 

`igGrid` では、ツールチップの主な目的はセル全体の内容を表示し、ツールチップ コンテナー内のテキストをユーザーが選択してコピーできるようにすることです (グリッド セルに記入するにはテキストが長すぎる場合などに便利です。下の画像を参照してください)。マウス ポインターを `igGrid` セルの上に置くと、ツールチップが表示されます。

![](images/igGrid_Tooltips_Overview__01.png)

`igGrid` のツールチップ機能はツールチップ ウィジェットにより提供されます。機能については、以下の[主要機能](#features)セクションに示します。

## <a id="features"></a> 主要機能 

以下の表では、ツールチップ ウィジェットの主要機能とそれらを管理するプロパティの概要を説明します。
<table class="table">
	<thead>
		<tr>
            <th>
機能
			</th>
            <th>
説明
			</th>
            <th>
jQuery プロパティ
			</th>
            <th>
MVC プロパティ
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
可視性管理
			</td>
            <td>
ツールチップ ウィジェットの動作モード (ツールチップの表示/非表示など)
			</td>
            <td>
[visibility](%%jQueryApiUrl%%/ui.iggridtooltips#options:visibility) <br />
                
[style](%%jQueryApiUrl%%/ui.iggridtooltips#options:style)
			</td>
            <td>
[Visibility](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridTooltips~Visibility.html) <br />
                
[Style](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridTooltips~Style.html)
			</td>
        </tr>

        <tr>
            <td>
構成可能な列
			</td>
            <td>
列ごとにツールチップの表示状態を構成できます (列のセルにツールチップを表示させるかどうかなど)。
			</td>
            <td>
[columnSettings](%%jQueryApiUrl%%/ui.iggridtooltips#options:columnSettings) 
			</td>
            <td>
[ColumnSettings](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridTooltips~ColumnSettings.html)
			</td>
        </tr>

        <tr>
            <td>
アニメーションのタイミング管理
			</td>

            <td>
構成可能なツールチップの表示時間と遅延時間 (ミリ秒) とツールチップを表示/非表示するアニメーションの継続時間
			</td>
            <td>
[showDelay](%%jQueryApiUrl%%/ui.iggridtooltips#options:showDelay) <br />
                
[hideDelay](%%jQueryApiUrl%%/ui.iggridtooltips#options:hideDelay) <br />
                
[fadeTimespan](%%jQueryApiUrl%%/ui.iggridtooltips#options:fadeTimespan)
			</td>
            <td>
[ShowDelay](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridTooltips~ShowDelay.html) <br />
                
[HideDelay](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridTooltips~HideDelay.html) <br />
                
[FadeTimespan](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridTooltips~FadeTimespan.html)
			</td>
        </tr>

        <tr>
            <td>
位置のカスタマイズ
			</td>
            <td>
マウス ポインターからのオフセットとして指定される構成可能なツールチップの表示位置
			</td>
            <td>
[cursorLeftOffset](%%jQueryApiUrl%%/ui.iggridtooltips#options:cursorLeftOffset) <br />

[cursorTopOffset](%%jQueryApiUrl%%/ui.iggridtooltips#options:cursorTopOffset)
                
            </td>
            <td>
[CursorLeftOffset](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridTooltips~CursorLeftOffset.html) <br />
                
[CursorTopOffset](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridTooltips~CursorTopOffset.html)
			</td>
        </tr>

        <tr>
            <td>
クライアント イベント
			</td>
            <td>
ツールチップ ウィジェットのライフサイクル中に処理できる特殊なイベント

ツールチップの各状態のイベントがあります。  <br />

showing  <br />

shown  <br />

hiding  <br />

hidden  <br />
			</td>
            <td>
[tooltipShowing](%%jQueryApiUrl%%/ui.iggridtooltips#events:tooltipShowing) <br />
                

[tooltipShown](%%jQueryApiUrl%%/ui.iggridtooltips#events:tooltipShown) <br />


[tooltipHiding](%%jQueryApiUrl%%/ui.iggridtooltips#events:tooltipHiding) <br />


[tooltipHidden](%%jQueryApiUrl%%/ui.iggridtooltips#events:tooltipHidden)
			</td>
            <td>

			</td>
        </tr>

        <tr>
            <td>
外観
			</td>
            <td>
ツールチップのスタイルや位置を設定します。「tooltip」と「popover」の 2 つのモードがあります。
                <br />
「tooltip」スタイルでは、マウス カーソルに応じてツールチップの位置を決めます (ツールチップがマウス カーソルの隣に表示されます)。ツールチップの内容はプレーンテキストとして表示されます。
                <br />
「popover」スタイルは、igPopover コントロールのインスタンスを初期化します。矢印で示すターゲット TD 要素に応じてツールチップの位置を決めます。ツールチップの内容は HTML として表示されます。
                <br />
jQuery UI CSS Framework クラスを変更するすると、外観をカスタマイズできます。
			</td>
            <td>
[style](%%jQueryApiUrl%%/ui.iggridtooltips#options:style)
			</td>
            <td>
[Style](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridTooltips~Style.html)
			</td>
        </tr>
    </tbody>
</table>

ツールチップ ウィジェットのプロパティの説明は、[jQuery](%%jQueryApiUrl%%/ui.iggridtooltips#options) および [MVC](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridTooltips_members.html) API ドキュメントを参照してください。


## <a id="topics"></a> 関連トピック 

以下は、その他の役立つトピックです。

- [igGrid ツールチップの有効化](igGrid-Enabling-Tooltips.html)

- [igGrid ツールチップの使用](igGrid-Using-Tooltips.html)

- [igGrid の既知の問題および重大な変更](igGrid-Known-Issues.html)

 

 


