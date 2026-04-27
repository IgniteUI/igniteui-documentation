<!--
|metadata|
{
    "fileName": "igtree-drag-and-drop-event-api-reference",
    "controlName": "igTree",
    "tags": ["API","Events"]
}
|metadata|
-->

# ドラッグ アンド ドロップ イベント API リファレンス (igTree)

## ドラッグ アンド ドロップ イベント リファレンス
### 概要

以下のチャートでは、ドラッグ アンド ドロップ機能に関する `igTree`™ コントロールのイベントに関するリファレンス情報を紹介します。イベントはアルファベット順に並んでいます。

### ドラッグ アンド ドロップ イベント リファレンス チャート

以下の表では、`igTree` コントロールのドラッグ アンド ドロップ イベントを説明します。イベントごとに、停止できるかどうかも示します。

**凡例:**
<table class="table">
    <tbody>
        <tr>
            <td><img alt="" src="images/positive.png" width="19" height="18"></td>
            <td>はい (= イベントは停止できます。)</td>
        </tr>
        <tr>
            <td><img alt="" src="images/negative.png" width="18" height="19"></td>
            <td>いいえ (= イベントは停止できません。)</td>
        </tr>
    </tbody>
</table>

<table class="table table-bordered">
	<thead>
		<tr>
            <th colspan="2">
イベント
			</th>

            <th>
説明
			</th>

            <th>
停止可能
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td colspan="2">
[drag](%%jQueryApiUrl%%/ui.igtree#events:drag)
			</td>

            <td>
                ノードをドラッグしているときに立ち上がります。ハンドラー関数は、引数 `evt` と `ui` を取得します。`ui` 引数のオプションと各オプションの使用方法は以下のとおりです。
                    follow.

                <table class="table table-bordered">
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
[ui.binding](%%jQueryApiUrl%%/ui.igtree#events:drag)
			</td>

                            <td>
バインディング プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.data](%%jQueryApiUrl%%/ui.igtree#events:drag)
			</td>

                            <td>
データ プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.element](%%jQueryApiUrl%%/ui.igtree#events:drag)
			</td>

                            <td>
要素プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.helper](%%jQueryApiUrl%%/ui.igtree#events:drag)
			</td>

                            <td>
ヘルパー プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.offset](%%jQueryApiUrl%%/ui.igtree#events:drag)
			</td>

                            <td>
オフセット プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.orginalPosition](%%jQueryApiUrl%%/ui.igtree#events:drag)
			</td>

                            <td>
originalPosition プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.path](%%jQueryApiUrl%%/ui.igtree#events:drag)
			</td>

                            <td>
パス プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.position](%%jQueryApiUrl%%/ui.igtree#events:drag)
			</td>

                            <td>
位置プロパティの参照を取得します。
			</td>
                        </tr>
                    </tbody>
</table>
            </td>

            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td colspan="2">
[dragStart](%%jQueryApiUrl%%/ui.igtree#events:dragStart)
			</td>

            <td>
                ノードのドラッグの開始時に立ち上がります。ハンドラー関数は、引数 `evt` と `ui` を取得します。`ui` 引数のオプションと各オプションの使用方法は以下のとおりです。

                <table class="table table-bordered">
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
[ui.binding](%%jQueryApiUrl%%/ui.igtree#events:dragStart)
			</td>

                            <td>
バインディング プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.data](%%jQueryApiUrl%%/ui.igtree#events:dragStart)
			</td>

                            <td>
データ プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.element](%%jQueryApiUrl%%/ui.igtree#events:dragStart)
			</td>

                            <td>
要素プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.helper](%%jQueryApiUrl%%/ui.igtree#events:dragStart)
			</td>

                            <td>
ヘルパー プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.offset](%%jQueryApiUrl%%/ui.igtree#events:dragStart)
			</td>

                            <td>
オフセット プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.orginalPosition](%%jQueryApiUrl%%/ui.igtree#events:dragStart)
			</td>

                            <td>
originalPosition プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.path](%%jQueryApiUrl%%/ui.igtree#events:dragStart)
			</td>

                            <td>
パス プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.position](%%jQueryApiUrl%%/ui.igtree#events:dragStart)
			</td>

                            <td>
位置プロパティの参照を取得します。
			</td>
                        </tr>
                    </tbody>
</table>
            </td>

            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td colspan="2">
[dragStop](%%jQueryApiUrl%%/ui.igtree#events:dragStop)
			</td>

            <td>
                ノードのドラッグの停止時に立ち上がります。ハンドラー関数は、引数 `evt` と `ui` を取得します。`ui` 引数のオプションと各オプションの使用方法は以下のとおりです。

                <table class="table table-bordered">
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
[ui.helper](%%jQueryApiUrl%%/ui.igtree#events:dragStop)
			</td>

                            <td>
ヘルパー プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.offset](%%jQueryApiUrl%%/ui.igtree#events:dragStop)
			</td>

                            <td>
オフセット プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.orginalPosition](%%jQueryApiUrl%%/ui.igtree#events:dragStop)
			</td>

                            <td>
originalPosition プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.position](%%jQueryApiUrl%%/ui.igtree#events:dragStop)
			</td>

                            <td>
位置プロパティの参照を取得します。
			</td>
                        </tr>
                    </tbody>
</table>
                <br>
            </td>

            <td>

			</td>
        </tr>

        <tr>
            <td colspan="2">
[nodeDropped](%%jQueryApiUrl%%/ui.igtree#events:nodeDropped)
			</td>

            <td>
                ノードをドロップすると立ち上がります。ハンドラー関数は、引数 `evt` と `ui` を取得します。`ui` 引数のオプションと各オプションの使用方法は以下のとおりです。

                <table class="table table-bordered">
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
[ui.binding](%%jQueryApiUrl%%/ui.igtree#events:nodeDropped)
			</td>

                            <td>
バインディング プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.data](%%jQueryApiUrl%%/ui.igtree#events:nodeDropped)
			</td>

                            <td>
データ プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.draggable](%%jQueryApiUrl%%/ui.igtree#events:nodeDropped)
			</td>

                            <td>
ドラッグ可能なプロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.element](%%jQueryApiUrl%%/ui.igtree#events:nodeDropped)
			</td>

                            <td>
要素プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.helper](%%jQueryApiUrl%%/ui.igtree#events:nodeDropped)
			</td>

                            <td>
ヘルパー プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.offset](%%jQueryApiUrl%%/ui.igtree#events:nodeDropped)
			</td>

                            <td>
オフセット プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.path](%%jQueryApiUrl%%/ui.igtree#events:nodeDropped)
			</td>

                            <td>
パス プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.position](%%jQueryApiUrl%%/ui.igtree#events:nodeDropped)
			</td>

                            <td>
位置プロパティの参照を取得します。
			</td>
                        </tr>
                    </tbody>
</table>
                <br>
            </td>

            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td colspan="2">
[nodeDropping](%%jQueryApiUrl%%/ui.igtree#events:nodeDropping)
			</td>

            <td>
                ノードのドロップ中に立ち上がります。ハンドラー関数は、引数 `evt` と `ui` を取得します。`ui` 引数のオプションと各オプションの使用方法は以下のとおりです。

                <table class="table table-bordered">
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
[ui.binding](%%jQueryApiUrl%%/ui.igtree#events:nodeDropping)
			</td>

                            <td>
バインディング プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.data](%%jQueryApiUrl%%/ui.igtree#events:nodeDropping)
			</td>

                            <td>
データ プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.draggable](%%jQueryApiUrl%%/ui.igtree#events:nodeDropping)
			</td>

                            <td>
ドラッグ可能なプロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.element](%%jQueryApiUrl%%/ui.igtree#events:nodeDropping)
			</td>

                            <td>
要素プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.helper](%%jQueryApiUrl%%/ui.igtree#events:nodeDropping)
			</td>

                            <td>
ヘルパー プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.offset](%%jQueryApiUrl%%/ui.igtree#events:nodeDropping)
			</td>

                            <td>
オフセット プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.path](%%jQueryApiUrl%%/ui.igtree#events:nodeDropping)
			</td>

                            <td>
パス プロパティの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.position](%%jQueryApiUrl%%/ui.igtree#events:nodeDropping)
			</td>

                            <td>
位置プロパティの参照を取得します。
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
    </tbody>
</table>





## 関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [ドラッグ アンド ドロップ プロパティ リファレンス (igTree)](igTree-Drag-and-Drop-Property-API-Reference.html): ここでは、ドラッグ アンド ドロップ機能に関する `igTree` コントロールのプロパティに関するリファレンス情報を紹介します。

- [API リンク (igTree)](igTree-jQuery-And-ASP-NET-MVC-Helper-API-Links.html): ここでは、`igTree` jQuery と MVC API までのリンクを紹介します。

### サンプル

このトピックについては、以下のサンプルも参照してください。

- [ドラッグ アンド ドロップ - 単一のツリー](%%SamplesUrl%%/tree/drag-and-drop-single-tree): このサンプルでは、`igTree` コントロールのドラッグ アンド ドロップ機能を有効にして初期化する方法を紹介します。

- [ドラッグ アンド ドロップ - 複数のツリー](%%SamplesUrl%%/tree/drag-and-drop-multiple-trees): このサンプルでは、2 つの `igTree` の間にノードをドラッグ アンド ドロップする方法を紹介します。

- [API およびイベント](igtree-event-reference.html#attaching-handlers-jquery): このサンプルは `igTree` API を使用する方法を紹介します。





 

 


