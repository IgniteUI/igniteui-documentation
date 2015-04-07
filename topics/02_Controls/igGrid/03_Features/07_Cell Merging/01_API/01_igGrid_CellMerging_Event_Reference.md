<!--
|metadata|
{
    "fileName": "iggrid-cellmerging-event-reference",
    "controlName": "igGrid",
    "tags": ["API","Grids"]
}
|metadata|
-->

# イベント リファレンス (セル結合、igGrid)


## トピックの概要

### 目的

このトピックでは、`igGrid`™ コントロールのセル結合機能のイベントに関する参照情報を提供します。

#### 前提条件

このトピックを理解するためには、以下のトピックを理解しておく必要があります:

- [セル結合の概要 (igGrid)](igGrid-CellMerging-Overview.html): このトピックは、`igGrid` コントロールのセル結合機能とその機能性について説明します。`igGrid` においてセル結合を有効にし構成する方法のコード例が含まれます。




## セル結合イベントの参照
このセクションでは、アルファベット順でリストされた `igGrid` コントロールのセル結合機能関連イベントを説明します。

以下の表は、セル結合機能 を有効にして発生したイベントについて説明し、個々のイベントを停止可能かどうかを示します。

<table class="table table-bordered">
	<tbody>
        <tr>
            <td>
![](images/positive.png)
			</td>
            <td colspan="2">
Yes (= イベントを停止**できます**。)
			</td>
        </tr>

        <tr>
            <td>
![](images/negative.png)
			</td>
            <td  colspan="2">
No (= イベントを停止**できません**。)
			</td>
        </tr>
		<tr>
            <th>
イベント
			</th>
            <th>
説明
			</th>
            <th>
停止可能
			</th>
        </tr>

        <tr>
            <td>
[cellsMerging](%%jQueryApiUrl%%/ui.iggridcellmerging#events:cellsMerging)
			</td>
            <td>
                このイベントは、等しい値を持つ結合セルの前に発生します。

                ハンドラー関数は、引数 `evt` と `ui` を取得します。`ui` 引数のオプションと各オプションの使用方法は以下のとおりです。

                <table class="table">
					<thead>
						<tr>
                            <th>
引数名
							</th>
                            <th>
使用方法
							</th>
                        </tr>
					</thead>
					<tbody>
                        <tr>
                            <td>
[ui.row](%%jQueryApiUrl%%/ui.iggridcellmerging#options:ui.row)
							</td>
                            <td>
結合されたグループが開始する行への参照を取得します。
							</td>
                        </tr>

                        <tr>
                            <td>
[ui.rowIndex](%%jQueryApiUrl%%/ui.iggridcellmerging#options:ui.rowIndex)
							</td>
                            <td>
結合されたグループが開始する行のインデックスを取得します。
							</td>
                        </tr>

                        <tr>
                            <td>
[ui.rowKey](%%jQueryApiUrl%%/ui.iggridcellmerging#options:ui.rowKey)
							</td>
                            <td>
結合されたグループが開始する行のキーを取得します。
							</td>
                        </tr>

                        <tr>
                            <td>
[ui.owner](%%jQueryApiUrl%%/ui.iggridcellmerging#options:ui.owner)
							</td>
                            <td>
`igGridCellMerging` ウィジェットへの参照を取得します。
							</td>
                        </tr>

                        <tr>
                            <td>
[ui.grid](%%jQueryApiUrl%%/ui.iggridcellmerging#options:ui.grid)
							</td>
                            <td>
`igGrid` セル結合が初期化された `igGrid` への参照を取得します。
							</td>
                        </tr>

                        <tr>
                            <td>
[ui.value](%%jQueryApiUrl%%/ui.iggridcellmerging#options:ui.value)
							</td>
                            <td>
作成対象の結合されたグループの繰り返すセル値を取得します。
							</td>
                        </tr>
                    </tbody>
</table>
                <br>
            </td>
            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
[cellsMerged](%%jQueryApiUrl%%/ui.iggridcellmerging#events:cellsMerged)
			</td>
            <td>
                結合されたグループが終了すると (異なる値が見つかる)、このイベントが発生します。ハンドラー関数は、引数 `evt` と `ui` を取得します。`ui` 引数のオプションと各オプションの使用方法は以下のとおりです。

                <table class="table">
					<thead>
						<tr>
                            <th>
引数名
							</th>
                            <th>
使用方法
							</th>
                        </tr>
					</thead>
					<tbody>
                        <tr>
                            <td>
[ui.row](%%jQueryApiUrl%%/ui.iggridcellmerging#options:ui.row)
							</td>
                            <td>
結合されたグループが開始する行への参照を取得します。
							</td>
                        </tr>

                        <tr>
                            <td>
[ui.rowIndex](%%jQueryApiUrl%%/ui.iggridcellmerging#options:ui.rowIndex)
							</td>
                            <td>
結合されたグループが開始する行のインデックスを取得します。
							</td>
                        </tr>

                        <tr>
                            <td>
[ui.rowKey](%%jQueryApiUrl%%/ui.iggridcellmerging#options:ui.rowKey)
							</td>
                            <td>
結合されたグループが開始する行のキーを取得します。
							</td>
                        </tr>

                        <tr>
                            <td>
[ui.owner](%%jQueryApiUrl%%/ui.iggridcellmerging#options:ui.owner)
							</td>
                            <td>
`igGridCellMerging` ウィジェットへの参照を取得します。
							</td>
                        </tr>

                        <tr>
                            <td>
[ui.grid](%%jQueryApiUrl%%/ui.iggridcellmerging#options:ui.grid)
							</td>

                            <td>
`igGridCellMerging` が初期化される `igGrid` への参照を取得します。
							</td>
                        </tr>

                        <tr>
                            <td>
[ui.value](%%jQueryApiUrl%%/ui.iggridcellmerging#options:ui.value)
							</td>
                            <td>
結合されたグループの繰り返すセル値を取得します。
							</td>
                        </tr>

                        <tr>
                            <td>
[ui.count](%%jQueryApiUrl%%/ui.iggridcellmerging#options:ui.count)
							</td>
                            <td>
結合されたセルの総数を取得します。
							</td>
                        </tr>
                    </tbody>
				</table>
            </td>

            <td>
![](images/negative.png)
			</td>
        </tr>
    </tbody>
</table>


## 関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [プロパティ リファレンス (セル結合、igGrid)](igGrid-CellMerging-Property-Reference.html): このトピックでは、`igGrid` コントロールのセル結合機能のプロパティに関する参照情報を提供します。

- [CSS クラス リファレンス (セル結合、igGrid)](igGrid-CellMerging-CSS-Classes-Reference.html): このトピックでは、`igGrid` コントロールのセル結合機能の CSS クラスに関する参照情報を提供します。



 

 


