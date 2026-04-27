<!--
|metadata|
{
    "fileName": "igtree-drag-and-drop-property-api-reference",
    "controlName": "igTree",
    "tags": ["API"]
}
|metadata|
-->

# ドラッグ アンド ドロップ プロパティ API リファレンス (igTree)

## ドラッグ アンド ドロップ プロパティ リファレンス
### 概要

ここでは、ドラッグ アンド ドロップ機能に関する `igTree`™ コントロールのプロパティに関するリファレンス情報を紹介します。プロパティはアルファベット順に紹介します。

### ドラッグ アンド ドロップ プロパティ リファレンス表

以下の表では、`igTree` のドラッグ アンド ドロップ機能のプロパティについて説明するとともに、デフォルト値と推奨値を紹介します。

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
[allowDrop](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.allowDrop)
			</td>

            <td>
Boolean
			</td>

            <td>
コントロールが別のコントロールからドロップを受け付けるかどうかを指定します。

                このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
false
			</td>
        </tr>

        <tr>
            <td>
[containment](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.containment)
			</td>

            <td>
Boolean/Selector/Element/String/Array
			</td>

            <td>
true に設定すると、ヘルパーを収容するその内部領域はドラッグの最中にスクロールできます。

                このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
false
			</td>
        </tr>

        <tr>
            <td>
[]()[copyAfterMarkup](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.copyAfterMarkup)
			</td>

            <td>
String
			</td>

            <td>
“後にコピーする” 上のヒント マークアップ。このヒントは、コピーしたノードを、現在ハイライトしているノード (マウス ポインターを合わせたノード) の後にドロップしようとすると表示されます。

                このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
<div><p>{0} の後へコピー</p></div>
			</td>
        </tr>

        <tr>
            <td>
[copyBeforeMarkup](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.copyBeforeMarkup)
			</td>

            <td>
String
			</td>

            <td>
“前にコピーする” 上のヒント マークアップ。このヒントは、コピーしたノードを、現在ハイライトしているノード (マウス ポインターを合わせたノード) の前にドロップしようとすると表示されます。

                このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
<div><p>{0} の前へコピー</p></div>
			</td>
        </tr>

        <tr>
            <td>
[copyBetweenMarkup](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.copyBetweenMarkup)
			</td>

            <td>
String
			</td>

            <td>
“間にコピーする” 上のヒント マークアップ。このヒントは、コピーしたノードを、現在ハイライトしている隣り合った 2 つのノード (両者の間にマウス ポインターを合わせたノード) の間にドロップしようとすると表示されます。

                このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
<div><p>{0} および {1} の間へコピー</p></div>
			</td>
        </tr>

        <tr>
            <td>
[copyToMarkup](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.copyToMarkup)
			</td>

            <td>
String
			</td>

            <td>
“コピー先” 上のヒント マークアップ。このヒントは、コピーしたノードを、現在ハイライトしているノード (マウス ポインターを合わせたノード) の上にドラッグしようとすると表示されます。この場合、移動したノードはターゲット (ハイライト表示) ノードの子ノードになります。

このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
<div><p>{0} へコピー</p></div>
			</td>
        </tr>

        <tr>
            <td>

			</td>

            <td>

			</td>

            <td>

			</td>

            <td>

			</td>
        </tr>

        <tr>
            <td>
[customDropValidation](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.customDropValidation)
			</td>

            <td>
Function
			</td>

            <td>
カスタム ドロップ検証のエントリ ポイントを提供します。カスタム検証には、ブール返り値が必要です。false が返るとドロップ ポイントが無効になります。

カスタム ドロップ検証関数は、内部ツリー検証機能がオーバーライドします。したがって、ドラッグ アンド ドロップ アクションを無効にできる位置はドロップ ポイントだけです。

このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td>
[dragAndDrop](%%jQueryApiUrl%%/ui.igtree#options:dragAndDrop)
			</td>

            <td>
Boolean
			</td>

            <td>
ドラッグ アンド ドロップ関数を有効/無効にする
			</td>

            <td>
false
			</td>
        </tr>

        <tr>
            <td>
[dragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings)
			</td>

            <td>
Object
			</td>

            <td>
ドラッグ アンド ドロップ機能を設定する複雑なオプション
			</td>

            <td>
none
			</td>
        </tr>

        <tr>
            <td>
[dragAndDropMode](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.dragAndDropMode)
			</td>

            <td>
String
			</td>

            <td>
                ドラッグ アンド ドロップ モードを指定します。

                有効な設定は以下のとおりです。

                <ul>
                    <li>
[default](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.dragAndDropMode)
					</li>

                    <li>
[move](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.dragAndDropMode)
					</li>

                    <li>
[copy](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.dragAndDropMode)
					</li>
                </ul>

いずれも、個々のドラッグ アンド ドロップ モードを設定します。

このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
            </td>

            <td>
default
			</td>
        </tr>

        <tr>
            <td>
[dragOpacity](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.dragOpacity)
			</td>

            <td>
Float
			</td>

            <td>
ドラッグしたノードの不透明度/透明度のレベルとドラッグ中のヒント有効値の範囲は 0 から 1 です。1 でヒントは完全に不透明になり、0 で完全に透明になります。

このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
0.75
			</td>
        </tr>

        <tr>
            <td>
[dragStartDelay](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.dragStartDelay)
			</td>

            <td>
Number
			</td>

            <td>
`mousedown` イベントから、ドラッグが実行されるまでの待ち時間 (単位ミリ秒)これは、要素をクリックするときに不必要なドラッグが発生するのを防ぐためのオプションです。

このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
200
			</td>
        </tr>

        <tr>
            <td>
[expandDelay](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.expandDelay)
			</td>

            <td>
Number
			</td>

            <td>
`mousedown` イベントの後、ドラッグでマウス ポインターを合わせてからノードが展開するまでの待ち時間 (ミリ秒)

このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
1000
			</td>
        </tr>

        <tr>
            <td>
[helper](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.helper)
			</td>

            <td>
String
			</td>

            <td>
                ドラッグの表示にヘルパー要素の使用を可能にします。

                有効な設定は以下のとおりです。

                <ul>
                    <li>
[default](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.helper)
					</li>

                    <li>
`<function>;`
					</li>
                </ul>

                `<function>` では、DOM 要素を返す関数を記述します。

                default 設定では、内部的に定義した関数をヘルパー要素が使用します。

                このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
            </td>

            <td>
default
			</td>
        </tr>

        <tr>
            <td>
[invalidMoveToMarkup](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.invalidMoveToMarkup)
			</td>

            <td>
String
			</td>

            <td>
ドロップ場所が正しくない場合のヒント マークアップ。このヒントは、移動したノードを、間違った場所にドロップしようとすると表示されます。

                このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
<div><p><span></span><strong></strong></p></div>
			</td>
        </tr>

        <tr>
            <td>
[moveAfterMarkup](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.moveAfterMarkup)
			</td>

            <td>
String
			</td>

            <td>
“後に移動する” 上のヒント マークアップ。このヒントは、移動したノードを、現在ハイライトしているノード (マウス ポインターを合わせたノード) の後にドロップしようとすると表示されます。

                このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
<div><p>{0} の後へ移動</p></div>
			</td>
        </tr>

        <tr>
            <td>
[moveBeforeMarkup](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.moveBeforeMarkup)
			</td>

            <td>
String
			</td>

            <td>
“前に移動する” 上のヒント マークアップ。このヒントは、移動したノードを現在ハイライトしているノード (マウス ポイターを合わせたノード) の前にドロップしようとすると表示されます。

                このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
<div><p>{0} の前へ移動</p></div>
			</td>
        </tr>

        <tr>
            <td>
[moveBetweenMarkup](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.moveBetweenMarkup)
			</td>

            <td>
String
			</td>

            <td>
“間に移動する” 上のヒント マークアップ。このヒントは、移動したノードを、現在ハイライトしている隣り合った 2 つのノード (両者の間にマウス ポインターを合わせたノード) の間にドロップしようとすると表示されます。

                このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
<div><p>{0} および {1} の間へ移動</p></div>
			</td>
        </tr>

        <tr>
            <td>
[moveToMarkup](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.moveToMarkup)
			</td>

            <td>
String
			</td>

            <td>
“移動先” 上のヒント マークアップ。このヒントは、移動したノードを現在ハイライトしているノード (マウス ポインターを合わせたノード) の上にドラッグしようとすると表示されます。
                    この場合、移動したノードはターゲット (ハイライト表示) ノードの子ノードになります。

                このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
<div><p>{0} へ移動</p></div>
			</td>
        </tr>

        <tr>
            <td>
[revert](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.revert)
			</td>

            <td>
Boolean
			</td>

            <td>
true に設定すると、ドラッグしたノードはドラッグの停止時に元の位置に戻ります。

                このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
true
			</td>
        </tr>

        <tr>
            <td>
[revertDuration](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.revertDuration)
			</td>

            <td>
Number
			</td>

            <td>
取り消しアニメーションの時間 (ミリ秒)。

                このプロパティを 0 に設定するとアニメーションが無効になります。

                [revert](%%jQueryApiUrl%%/ui.igtree#options:revert) プロパティを false に設定すると、[revertDuration](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.revertDuration) 設定を無視します。

                このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
500
			</td>
        </tr>

        <tr>
            <td>
[zIndex](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings.zIndex)
			</td>

            <td>
Number
			</td>

            <td>
要素をドラッグ中のヘルパーの z-index。

                z-index は、要素のスタックの順序を指定します。スタック インデックスが大きい要素の位置はスタックが下位の要素の前になります。

                このプロパティは、[DragAndDropSettings](%%jQueryApiUrl%%/ui.igtree#options:dragAndDropSettings) プロパティ内で設定します。
			</td>

            <td>
10
			</td>
        </tr>
    </tbody>
</table>





## 関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [ドラッグ アンド ドロップの概要 (igTree)](igTree-Drag-and-Drop-Overview.html): このトピックは、`igTree` コントロールのドラッグ アンド ドロップ機能の概要を提供します。

- [ドラッグ アンド ドロップ イベント リファレンス (igTree)](igTree-Drag-and-Drop-Event-API-Reference.html): ここでは、ドラッグ アンド ドロップ機能に関する `igTree` コントロールのイベントに関するリファレンス情報を紹介します。

- [API リンク (igTree)](igTree-jQuery-And-ASP-NET-MVC-Helper-API-Links.html): ここでは、`igTree` jQuery と MVC API までのリンクを紹介します。

### サンプル

このトピックについては、以下のサンプルも参照してください。

- [ドラッグ アンド ドロップ - 単一のツリー](%%SamplesUrl%%/tree/drag-and-drop-single-tree): このサンプルでは、`igTree` コントロールのドラッグ アンド ドロップ機能を有効にして初期化する方法を紹介します。

- [ドラッグ アンド ドロップ - 複数のツリー](%%SamplesUrl%%/tree/drag-and-drop-multiple-trees): このサンプルでは、2 つの `igTree` の間にノードをドラッグ アンド ドロップする方法を紹介します。

- [API およびイベント](igtree-event-reference.html#attaching-handlers-jquery): このサンプルは `igTree` API を使用する方法を紹介します。





 

 


