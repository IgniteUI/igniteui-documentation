<!--
|metadata|
{
    "fileName": "iggrid-cellmerging-property-reference",
    "controlName": "igGrid",
    "tags": ["API","Grids"]
}
|metadata|
-->

# プロパティ リファレンス (セル結合、igGrid)

## トピックの概要

### 目的

このトピックでは、`igGrid`™ コントロールの セル結合機能のプロパティに関する参照情報を提供します。

### 前提条件

このトピックを理解するためには、以下のトピックを理解しておく必要があります:

- [セル結合の概要 (igGrid)](igGrid-CellMerging-Overview.html): このトピックは、`igGrid` コントロールのセル結合機能とその機能性について説明します。`igGrid` においてセル結合を有効にし構成する方法のコード例が含まれます。




## セル結合プロパティの参照

このセクションは、`igGrid` コントロールの関連 セル結合 プロパティを説明します。

以下の表は、セル結合 プロパティの目的と機能性をまとめたものです。

<table class="table">
	<thead>
		<tr>
            <th>
プロパティ
			</th>
            <th>
タイプ
			</th>
            <th>
説明
			</th>
            <th>
デフォルト値
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
[initialState](%%jQueryApiUrl%%/ui.iggridcellmerging#options:initialState)
			</td>
            <td>
string
			</td>
            <td>
                セル結合の初期モードを設定します。有効な値：

                <ul>
                    <li>
`“regular”` – セル結合 を通常の初期モードに設定します。等しいセルをレギュラーとして描画し、並べ替え操作後にセルをマージしてスタイルを等しいグループに適用します。
					</li>

                    <li>
`“merged”` – 列セル結合 をマージされた初期モードに設定します。`initialState` が merged の場合、最初に特別なスタイルを適用して等しいセルが描画されます。
					</li>
                </ul>
            </td>
            <td>
 “regular”
			</td>
        </tr>
    </tbody>
</table>





## 関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [イベント リファレンス](igGrid-CellMerging-Event-Reference.html): このトピックでは、`igGrid` コントロールのセル結合機能のイベントに関する参照情報を提供します。

- [CSS クラス リファレンス (セル結合、igGrid)](igGrid-CellMerging-CSS-Classes-Reference.html): このトピックでは、`igGrid` コントロールのセル結合機能の CSS クラスに関する参照情報を提供します。



 

 


