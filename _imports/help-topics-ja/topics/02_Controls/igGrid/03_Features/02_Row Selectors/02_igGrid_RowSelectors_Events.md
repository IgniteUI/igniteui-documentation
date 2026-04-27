<!--
|metadata|
{
    "fileName": "iggrid-rowselectors-events",
    "controlName": "igGrid",
    "tags": ["API","Grids","Selection"]
}
|metadata|
-->

# 行セレクター イベント (igGrid)


### 目的
このトピックは、`igGrid`™ の RowSelectors ウィジェットに固有のイベントを説明します。

### このトピックの内容
このトピックは、以下のセクションで構成されます。

-   [イベントの概要](#overview)
-   [jQuery および MVC でハンドラーをイベントに添付する](#attach)
-   [イベント参照チャート](#reference-chart)
-   [関連トピック](#topics)

## <a id="overview"></a> イベントの概要 

RowSelectors ウィジェットに固有なイベントは 3 つあります。(以下の「イベント参照チャート」ブロックを参照してください)。`checkBoxStateChanging` イベントはキャンセルでき、ハンドラーで false を返す場合に伝達を終了できます。

**JavaScript の場合:**

```js
$("#grid1").igGrid({
features: [
     {
          name: 'RowSelectors',
          enableCheckBoxes: true,
          checkBoxStateChanging: function (ui, args) {
               return  false;
          }                
     },
     {
         name: 'Selection'
     }
  ]
});
```

引数のメソッドおよびプロパティのほとんどに、それらが属するグリッドだけでなく、行固有のデータが含まれています。

## <a id="attach"></a> jQuery および MVC でハンドラーをイベントに添付する
 
イベントに添付するには、プロパティの定義と同じようにイベントのハンドラーを定義する必要があります。これでイベントをトリガーすると、ハンドラーが呼び出されます。

**JavaScript の場合:**

```js
$("#grid1").igGrid({
     responseDataKey: 'Records',
     features: [
          {
               name: 'RowSelectors',
                       enableCheckBoxes: true,
               rowSelectorClicked: function(evt, ui) {
                     // Handle event  
               }              },
          {
            name: 'Selection'
          }
     ]
});
```

MVC でハンドラーを添付する場合、jQuery UI パターンを使用する必要があります。このパターンは、コントロールとイベントの名前を小文字で連結したものです。

**JavaScript の場合:**

```js
$("#grid1").on("iggridrowselectorsrowselectorclicked", function (evt, ui) {
      // Handle event  
   }
);
```

> **注:** 詳細については、[%%ProductName%% でイベントの使用](Using-Events-in-IgniteUI-for-jQuery.html)を参照してください。

## <a id="reference-chart"></a> イベント参照チャート 

<table class="table table-bordered">
	<thead>
		<tr>
            <th>
イベント
			</th>

            <th>
説明
			</th>

            <th>
キャンセル可能
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
[rowSelectorClicked](%%jQueryApiUrl%%/ui.iggridrowselectors#events:rowSelectorClicked)
			</td>
            <td>
行セレクターがクリックされた後に発生します。 <br />
            
関数には引数 evt および ui が必要です。 <br />
            
ui.row を使用して、クリックされた行セレクターが常駐する行への参照を取得します。 <br />
            
ui.rowIndex を使用して、クリックされた行セレクターが常駐する行のインデックスを取得します。 <br />
            
ui.rowKey を使用して、クリックされた行セレクターが常駐する行のキーを取得します。 <br />
            
ui.rowSelector を使用して行セレクター セルへの参照を取得します。 <br />
            
ui.owner を使用して igRowSelectors への参照を取得します。 <br />
            
ui.grid を使用して igRowSelectors が初期化されている igGrid への参照を取得します。
            </td>
            <td>
![](images/negative.png)
			</td>
        </tr>

        <tr>
            <td>
[checkBoxStateChanging](%%jQueryApiUrl%%/ui.iggridrowselectors#events:checkBoxStateChanging)
			</td>
            <td>
行セレクターのチェックボックスが変化している場合に発生します。 <br />

関数には引数 evt および ui が必要です。 <br />

ui.row を使用して、クリックされた行セレクターが常駐する行への参照を取得します。 <br />

ui.rowIndex を使用して、クリックされた行セレクターが常駐する行のインデックスを取得します。 <br />

ui.rowKey を使用して、クリックされた行セレクターが常駐する行のキーを取得します。 <br />

ui.rowSelector を使用して行セレクター セルへの参照を取得します。 <br />

ui.owner を使用して igRowSelectors への参照を取得します。 <br />

ui.grid を使用して igRowSelectors が初期化されている igGrid への参照を取得します。 <br />

ui.currentState を使用してチェックボックスの現在の状態 (「on」、「off」) を取得します。 <br />

ui.newState を使用してチェックボックスの新しい状態 (「on」、「off」) を取得します。 <br />

ui.isHeader を使用してヘッダー チェックボックスがクリックされているかどうか確認します。この場合、行関連の引数は渡されません。
			</td>
            <td>
![](images/positive.png)
			</td>
        </tr>

        <tr>
            <td>
[checkBoxStateChanged](%%jQueryApiUrl%%/ui.iggridrowselectors#events:checkBoxStateChanged)
			</td>

            <td>
行セレクターのチェックボックスの状態が変化した後に発生します。 <br />

関数には引数 evt および ui が必要です。 <br />

ui.row を使用して、クリックされた行セレクターが常駐する行への参照を取得します。 <br />

ui.rowIndex を使用して、クリックされた行セレクターが常駐する行のインデックスを取得します。 <br />

ui.rowKey を使用して、クリックされた行セレクターが常駐する行のキーを取得します。 <br />

ui.rowSelector を使用して行セレクター セルへの参照を取得します。 <br />

ui.owner を使用して igRowSelectors への参照を取得します。 <br />

ui.grid を使用して igRowSelectors が初期化されている igGrid への参照を取得します。 <br />

ui.state を使用してチェックボックスの状態 (「on」、「off」) を取得します。 <br />

ui.isHeader を使用してヘッダー チェックボックスがクリックされているかどうか確認します。この場合、行関連の引数は渡されません。
			</td>
            <td>
![](images/negative.png)
			</td>
        </tr>
    </tbody>
</table>


##  <a id="topics"></a> 関連トピック 

- [行セレクターを有効にする](igGrid-Enabling-Row-Selectors.html)

- [igGrid 構成: 行セレクター](igGrid-Configuring-Row-Selectors.html)

 

 


