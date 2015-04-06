<!--
|metadata|
{
    "fileName": "iggrid-columnmoving-propertyreference",
    "controlName": "igGrid",
    "tags": ["API","Grids"]
}
|metadata|
-->

# プロパティ参照 (igGrid)



## igGrid 列移動のプロパティ

以下の表では、`igGrid` の列移動機能のプロパティを説明し、またデフォルト値と推奨値を紹介します。プロパティはアルファベット順に並び替えられます。

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
            <td><a id="addMovingDropdown" name="addMovingDropdown"></a>
[addMovingDropdown](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:addMovingDropdown)
			</td>

            <td>
bool
			</td>

            <td>
false の場合、すべての列に対して列移動メニューを非表示にします。
			</td>

            <td>
true
			</td>
        </tr>

        <tr>
            <td><a id="columnSettings" name="columnSettings"></a>
[columnSettings](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:columnSettings)
			</td>

            <td>
array
			</td>

            <td>
列移動が有効になっていると、 移動が無効になる各列を構成します。列は、[`columnSettings.allowMoving`](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:columnSettings.allowMoving) および [`columnSettings.columnIndex`](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:columnSettings.columnIndex) /[`columnSettings.columnKey`](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:columnSettings.columnKey) プロパティを介して指定されます。
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td><a id="allowMoving" name="allowMoving"></a>
[columnSettings.allowMoving](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:columnSettings.allowMoving)
			</td>

            <td>
bool
			</td>

            <td>
false である場合、グリッド内で特定の列に対して列移動を無効にします。構成済みの列は、 [`columnSettings.columnIndex`](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:columnSettings.columnIndex) または [`columnSettings.columnKey`](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:columnSettings.columnKey) により指定されます。
                        .
			</td>

            <td>
true
			</td>
        </tr>

        <tr>
            <td><a id="columnIndex" name="columnIndex"></a>
[columnSettings.columnIndex](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:columnSettings.columnIndex)
			</td>

            <td>
number
			</td>

            <td>
構成されている列のインデックスグリッド列に列キーが定義されていない場合に列インデックスを使用して列を指定します (例: [`autoGenerateColumns`](%%jQueryApiUrl%%/ui.iggrid#options:autoGenerateColumns) を  true に設定する場合)。
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td><a id="columnKey" name="columnKey"></a>
[columnSettings.columnKey](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:columnSettings.columnKey)
			</td>

            <td>
string
			</td>

            <td>
構成されている列の列キーグリッド列に列キーが定義されている場合に列インデックスを使用して列を指定します (例: グリッド列が手動で定義される場合)。
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td><a id="mode" name="mode"></a>
[mode](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:mode)
			</td>

            <td>
string
			</td>

            <td>
[列移動モード](igGrid-ColumnMoving-Overview.html#mode)を設定します。有効な値：

                <ul>
                    <li>
“immediate” - 列移動 を即時モードに設定します。
					</li>
                </ul>
(ユーザーがヘッダーをドラッグすると、ヘッダーが移動されて列がアニメーションで置き換えされます)

                <ul>
                    <li>
“deferred” - 列移動 を遅延モードに設定します。
					</li>
                </ul>

                (ドラッグでは列ヘッダーは移動しませんが、代わりにユーザーがマウス ボタンをリリースする場合に列がドロップされる位置をマーク付けします)
            </td>

            <td>
“immediate”
			</td>
        </tr>

        <tr>
            <td><a id="moveType" name="moveType"></a>
[moveType](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:moveType)
			</td>

            <td>
string
			</td>

            <td>
                [列移動タイプ](igGrid-ColumnMoving-Overview.html#type)を設定します。有効な値：

                <ul>
                    <li>
“dom” - タイプを DOM 操作に設定します。
					</li>
                </ul>

                (列をデタッチし、DOM ツリーに再度アタッチすることで列を移動します)

                <ul>
                    <li>
“render” - タイプをグリッドの再レンダリングに設定します。
					</li>
                </ul>

                (グリッドは、新しい列の順序で再描画されます)
            </td>

            <td>
“dom”
			</td>
        </tr>

        <tr>
            <td><a id="movingDialogAnimationDuration" name="movingDialogAnimationDuration"></a>
[movingDialogAnimationDuration](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:movingDialogAnimationDuration)
			</td>

            <td>
number
			</td>

            <td>
アニメーションで[列の移動ダイアログ](igGrid-ColumnMoving-Overview.html#column-moving-dialog)を表示または非表示にする timeDuration をミリ秒で設定します。
			</td>

            <td>
200
			</td>
        </tr>

        <tr>
            <td><a id="movingDialogHeight" name="movingDialogHeight"></a>
[movingDialogHeight](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:movingDialogHeight)
			</td>

            <td>
number
			</td>

            <td>
[列の移動ダイアログ](igGrid-ColumnMoving-Overview.html#column-moving-dialog)の高さを設定します。デフォルトでは高さは設定されません。そのため、データの高さはすべてのグリッド列を表示するまで引き伸ばされます。        
			</td>

            <td>
なし
			</td>
        </tr>

        <tr>
            <td><a id="movingDialogWidth" name="movingDialogWidth"></a>
[movingDialogWidth](%%jQueryApiUrl%%/ui.iggridcolumnmoving#options:movingDialogWidth)
			</td>

            <td>
number
			</td>

            <td>
[列の移動ダイアログ](igGrid-ColumnMoving-Overview.html#column-moving-dialog)の幅を設定します。
			</td>

            <td>
400
			</td>
        </tr>
    </tbody>
</table>


## 関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [列移動の概要](igGrid-ColumnMoving-Overview.html): このトピックは、`igGrid` コントロールの列移動機能およびこの機能が提供する機能性について概念的に説明します。

- [列移動の有効化](igGrid-ColumnMoving-Enabling.html): このトピックでは、コード例を用いて、`igGrid` の列移動機能を有効にする方法について説明します。

- [列移動の構成](igGrid-ColumnMoving-Configuring.html): このトピックでは、コード例を用いて、`igGrid` の列移動機能を構成する方法について説明します。

- [コードによる列の移動](igGrid-ColumnMoving-MovingColumnsProgrammatically.html): このトピックは、列移動 API を使用して列を移動する方法をコード例を用いて説明します。





 

 


