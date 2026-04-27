<!--
|metadata|
{
    "fileName": "ighierarchicalgrid-rowselectors-events",
    "controlName": "igHierarchicalGrid",
    "tags": []
}
|metadata|
-->

# イベントのリファレンス (行セレクター, igHierarchicalGrid)

## トピックの概要
### 目的

このトピックでは、igHierarchicalGrid™ コントロールの行セレクターのイベントに関するリファレンスと、こうしたイベントの処理に関するコード例を示します。

#### 前提条件

この題材を理解するのにあらかじめ必要となるトピック。

- [igHierarchicalGrid の概要](igHierarchicalGrid-Overview.html): 機能、データ バインディング、要件、テンプレート、やりとりを含む、igHierarchicalGrid コントロールについての概念的情報を提供します。
- [igHierarchicalGrid の初期化](igHierarchicalGrid-Initializing.html): jQuery と MVCの両方を用いた igHierarchicalGrid を初期化する方法を説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [行セレクター イベントのリファレンス](#events_reference)
-   [コード例: jQuery で初期化時にイベント ハンドラーを割り当てる場合](#example_attaching_event_handler_jquery)
-   [コード例: jQuery および MVC で実行時にイベント ハンドラーを割り当てる場合](#example_attaching_event_handler_mvc)
-   [コード例: チェックボックスの状態変更イベントを取り消す場合](#example_cancelling_checkbox_state)
-   [関連コンテンツ](#related_content)


## <a id="events_reference"></a> 行セレクター イベントのリファレンス
### 概要

igGridRowSelectors ウィジェットに固有なイベントは次の 3 つです。

-   `checkBoxStateChanging`
-   `checkBoxStateChanged`
-   `rowSelectorClicked`

`checkBoxStateChanging` イベントは取り消し可能なものであり、イベント ハンドラーが `false` を返す場合は伝達を停止できます。

### 行セレクター イベントのリファレンスのまとめ
igGridRowSelectors コントロールの各イベントの目的と機能。

<table class="table">
	<thead>
		<tr>
            <th>
プロパティ
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
            <td>
[rowSelectorClicked](%%jQueryApiUrl%%/ui.iggridrowselectors_hg#events)
			</td>

            <td>
                行セレクターをクリックすると発生します。ハンドラー関数は、引数 `evt` と `ui` を取得します。`ui` 引数のオプションと各オプションの使用方法は以下のとおりです。
                    follow.

                <table class="table table-striped">
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
[ui.row](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
クリックした行セレクターが置かれている行への参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.rowIndex](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
クリックした行セレクターが置かれている行のインデックスを取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.rowKey](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
クリックした行セレクターが置かれている行のキーを取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.rowSelector](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
行セレクター セルへの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.owner](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
igRowSelectors への参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.grid](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
igRowSelectors コントロールが初期化される igGrid への参照を取得します。
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
            <td>
[checkBoxStateChanging](%%jQueryApiUrl%%/ui.iggridrowselectors_hg#events)
			</td>

            <td>
                行セレクター チェックボックスの状態が変更されるときに発生します。ハンドラー関数は、引数 `evt` と `ui` を取得します。`ui` 引数のオプションと各オプションの使用方法は以下のとおりです。

                <table class="table table-striped">
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
[ui.row](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
クリックした行セレクターが置かれている行への参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.rowIndex](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
クリックした行セレクターが置かれている行のインデックスを取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.rowKey](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
クリックした行セレクターが置かれている行のキーを取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.rowSelector](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
行セレクター セルへの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.owner](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
igRowSelectors への参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.grid](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
igRowSelectors コントロールが初期化される igGrid への参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.currentState](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
チェックボックスの現在の状態 (**on** または **off**) を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.newState](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
チェックボックスの変更後の状態 (**on** または **off**) を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.isHeader](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
クリックされているチェックボックスがヘッダーのチェックボックスであるかどうかを確認します。ヘッダーのチェックボックスがクリックされている場合、行に関連した引数は渡されません。
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
[checkBoxStateChanged](%%jQueryApiUrl%%/ui.iggridrowselectors_hg#events)
			</td>

            <td>
                行セレクターのチェックボックスの状態が変更された後に発生します。ハンドラー関数は、引数 `evt` と `ui` を取得します。`ui` 引数のオプションと各オプションの使用方法は以下のとおりです。

                <table class="table table-striped">
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
[ui.row](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
クリックした行セレクターが置かれている行への参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.rowIndex](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
クリックした行セレクターが置かれている行のインデックスを取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.rowKey](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
クリックした行セレクターが置かれている行のキーを取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.rowSelector](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
行セレクター セルへの参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.owner](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
igRowSelectors への参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.grid](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
igRowSelectors が初期化される igGrid への参照を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.state](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
チェックボックスの現在の状態 (**on** または **off**) を取得します。
			</td>
                        </tr>

                        <tr>
                            <td>
[ui.isHeader](%%jQueryApiUrl%%/ui.iggridrowselectors_hg)
			</td>

                            <td>
クリックされているチェックボックスがヘッダーのチェックボックスであるかどうかを確認します。ヘッダーのチェックボックスがクリックされている場合、行に関連した引数は渡されません。
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
    </tbody>
</table>

## コード例

### <a id="example_attaching_event_handler_jquery"></a> コード例: jQuery で初期化時にイベント ハンドラーを割り当てる場合
初期化時に特定のイベント ハンドラー関数を共通のオプションとして igGridRowSelectors コントロールの `rowSelectorClicked` イベントに割り当てます。このイベントが発生すると、指定した処理関数が呼び出されます。ただし、コントロールをいったん破棄して作成し直した場合、同じハンドラーを再度割り当てておかない限り、このイベント ハンドラーが呼び出されることはなくなります。

#### コード

初期化時にイベント ハンドラー関数を `rowSelectorClicked` イベントに割り当てる場合のコード例。

**JavaScript の場合:**

```js
$("#grid").igHierarchicalGrid({
    initialDataBindDepth: -1,
    dataSource: data,
    dataSourceType: "json",
    responseDataKey: "Records",
    autoGenerateColumns: true,
    autoGenerateLayouts: true,
    primaryKey: "ID",
    features: [
        {
            name: 'RowSelectors',
            enableCheckBoxes: true,
            rowSelectorClicked: function(evt, ui) {
                // Handle event  
            }
        },
        {
            name: 'Selection'
        }
    ]
});
```



## <a id="example_attaching_event_handler_mvc"></a> コード例: jQuery および MVC で実行時にイベント ハンドラーを割り当てる場合
### 説明

%%ProductNameMVC%% を使用する場合、jQueryの `on()` メソッドを使用して、ランタイムにイベントハンドラーをアタッチできます。

**JavaScript の場合:**

```js
$("#grid").on("iggridrowselectorsrowselectorclicked", function (e, args) {
        // Handle event  
    }
);
```

このオプションは、%%ProductNameMVC%% を使用する場合にも使用できますが、%%ProductNameMVC%% は、 `AddClientEvent` メソッドによって別の方法も公開します。最初のメソッド引数は、イベントのオプションの文字列名前です。第 2 の引数は、イベント ハンドラー関数の文字列名前です。

この方法は一般的なユース ケースに使用できますが、`AddClientEvent` メソッドの第 2 の引数も実行する JavaScript コードの文字列が可能で、スクリプト要素タグがない手順 2 の完全な JavaScript 関数を表現する文字列も可能です。

**ASPX の場合:**

```csharp
    <%= Html.Infragistics()
        .Grid(Model)
        .ID("grid")
        .Features(features =>
            {
                features.RowSelectors().Inherit(true).AddClientEvent("rowSelectorClicked", "selectorClicked")
                features.Selection().Mode(SelectionMode.Row).MultipleSelection(true);
            })
        .AutoGenerateColumns(true)
        .AutoGenerateLayouts(true)
        .DataBind()
        .Render()
    %>
```


## <a id="example_cancelling_checkbox_state"></a> コード例: チェックボックスの状態変更イベントを取り消す場合
### 説明
このコード例では、`checkBoxStateChanging` イベントの取り消し方を示します。このコードが実行されると、指定した基準を満たしている特定の行が選択不可または未選択状態になります。

### コード

この例では、ヘッダー行のチェックボックスにチェックが入っているかどうかを確認するコードが定義されています。`checkBoxStateChanging` イベントを呼び出すことにより、チェックボックスの選択を取り消せるようになります。この方法により、すべての行の一括選択を防止して、ユーザーに各行を個別に選択させることができるようになります。これにより、ユーザーは目的の行を一括して選択することができなくなり、各行を 1 つずつ別個に選択せざるをえなくなります。

**JavaScript の場合:**

```js
$("#grid").igHierarchicalGrid({
    initialDataBindDepth: -1,
    dataSource: data,
    dataSourceType: "json",
    responseDataKey: "Records",
    autoGenerateColumns: true,
    autoGenerateLayouts: true,
    primaryKey: "ID",
    features: [
        {
            name: 'RowSelectors',
            enableCheckBoxes: true,
            checkBoxStateChanging: function (evt, ui) {
                       if (ui.isHeader && ui.newState === "on")
                           return false;
                   }
        },
        {
            name: 'Selection'
        }
    ]
});
```



## <a id="related_content"></a> 関連コンテンツ
### トピック

詳しくは、以下の各トピックを参照してください。

- [行セレクターを有効にする](igHierarchicalGrid-Enabling-RowSelectors.html): コード例を掲げて、jQuery および ASP.NET MVC で行セレクター機能を有効にする方法を説明します。
- [行セレクターの構成](igHierarchicalGrid-Configuring-RowSelectors.html): コード例を掲げて、igHierarchicalGrid の行セレクター機能を構成する方法を説明します。

### サンプル

このトピックについては、以下のサンプルも参照してください。

- [**行セレクター**](%%SamplesUrl%%/hierarchical-grid/selection-rowselectors): igHierarchicalGrid で RowSelectors を使用する用法について説明します。





 

 


