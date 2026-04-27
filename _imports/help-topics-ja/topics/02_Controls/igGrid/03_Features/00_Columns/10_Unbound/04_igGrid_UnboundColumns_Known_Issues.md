<!--
|metadata|
{
    "fileName": "iggrid-unboundcolumns-known-issues",
    "controlName": "igGrid",
    "tags": ["Grids","Known Issues"]
}
|metadata|
-->

# 既知の問題と制限 (非バインド列、igGrid)



## トピックの概要

### 概要

以下の表は、`igGrid`™ 非バインド列機能の既知の問題と制限事項の要約です。いくつかの問題については、この概要表の後に、既知の問題点に関する詳しい説明と、考えられる回避策を示します。

### 凡例:

<table class="table">
	<tbody>
		<tr>
			<td>
![](images/positive.png)
			</td>
			<td>
				回避策
			</td>
		</tr>

		<tr>
			<td>
![](images/negative.png)
			</td>
			<td>
				既知の回避策はありません
			</td>
		</tr>

		<tr>
			<td>
![](images/plannedFix.png)
			</td>
			<td>
				修正予定です
			</td>
		</tr>
	</tbody>
</table>


問題|説明|状態
---|---|---
[リモートフィルタリング、並べ替えおよび GroupBy 機能](#remote-filtering-sorting)|非バインド列機能は、リモート フィルタリング、並べ替えおよび GroupBy 機能はサポートしていません。 | ![](images/negative.png)
[GridModel.SetUnboundValues (&lt;列キー&gt;, &lt;値のディクショナリ&gt;) を使用するには、GridModel.PrimaryKey プロパティを設定する必要があります。](#using-SetUnboundValues-primary)|`GridModel.SetUnboundValues(<列キー>, <値のディクショナリ>)` オーバーロード メソッドには、グリッドに対し設定するプライマリ キーが必要です。理由は、このメソッドの 2 つめのパラメータは、そのキーがグリッドのプライマリ キーに設定されるディクショナリであるためです。 | ![](images/positive.png)
[非バインド列とリモート URLでのチェーン](#chaining-remote-url)|`MergeUnboundColumns` が true に設定されている場合に非バインド列をチェーンで使用するのは無効なシナリオです。 | ![](images/negative.png)
[リモート データ ソース、ページングおよび初期 unboundValues](#remote-source-initial-values)|グリッドは、リモートのページングを有効にしたクライアント上で `unboundValues` を設定している場合に非バインド列に対して同じ値を表示します。 | ![](images/negative.png)
[MergeUnboundColumns=true の場合、非バインド列の値の設定に数式は使用できません。](#MergeUnboundColumns-formula)|MergeUnboundColums=TRUE の MVC シナリオの場合、クライアント側で非バインド値はすでにデータ ソースの一部であり、列は「バインド」列として解釈されます。データ バインドがグリッドである場合に数式を考慮します。列に関数式が設定されている場合、これらの非バインド列の値が評価され、データ ソースのデータビューに設定されます。数式がクライアント側で実行されると、「非バインド」列の値は計算されず (「バインドされている」とみなされるため) グリッドは空のままです。 | ![](images/positive.png)
[更新と非バインド列](#updating)|非バインド列の値はグリッドの再バインド間では存続しません。 | ![](images/negative.png)
仮想化と igGrid.setUnboundValues クライアント API|仮想化を使用して igGrid.setUnboundValues メソッドを呼び出す場合、非バインド列で値をレンダリングする前にグリッドは一番上までスクロールします。 | ![](images/negative.png)
[MergeUnboundColumns = false およびブール値の非バインド列](#MergeUnboundColumns-boolean)|非バインドブール値列に対して値がサーバー上で構成される場合、サーバー上で明示的に設定されない列内のセルはクライアント上でレンダリングされる際に自動的に false に設定されます。 | ![](images/positive.png)
getUnboundValues クライアント API および dataBound クライアント イベントにおける非バインド値の設定|クライアント上で igGrid.getUnboundValues メソッドを使用すると、`dataBound()` クライアント側イベントを介して設定される場合に非バインド値は返されません。 | ![](images/negative.png)




## <a id="remote-filtering-sorting"></a> リモートフィルタリング、並べ替えおよび GroupBy 機能

> **注**: 非バインド値はリモート並べ替え、フィルタリングおよびグループ化をサポートしていません。したがって、これらの機能は Columns コレクション内の非バインド列に対して無効になります。

`igGrid` は、以下のスクリーンショットに示されるように非バインド列に対してリモート並べ替え、フィルタリングおよびグループ化を無効にします。

## <a id="using-SetUnboundValues-primary"></a> GridModel.SetUnboundValues (&lt;列キー&gt;, &lt;値のディクショナリ&gt;) を使用するには、PrimaryKey を設定する必要があります。

このオーバーロードは、「列キー」と `<PrimaryKey, Unbound Value>` ペアのディクショナリを承諾します。ディクショナリ内の `PrimaryKey` は `igGrid` 内の行のプライマリ キーをポイントし、「非バインド値」は「列キー」に等しいキーで非バインド列に設定されます。プライマリ キーが定義されない場合、オーバーロード `SetUnboundValues(<列キー>, < 値のリスト>)` を使用します。

## <a id="chaining-remote-url"></a> 非バインド列とリモート URLでのチェーン

リモート URL があり MergeUnboundColumns = TRUE の場合、チェーンを介していくつかのオプションは設定できるためチェーンの使用は無効ではありませんが、リモート リクエストを行うと、これらのオプションはコントローラー/モデル内でデフォルト値に再設定されるため MergeUnboundColumns = FALSE になります。

## <a id="remote-source-initial-values"></a> リモート データ ソース、ページングおよび初期 unboundValues

リモート データ ソースがある場合、グリッドを再バインドするたびにクライアント側コードでデフォルトの unboundValues を設定し、これらの新しい設定を再適用します。したがって、新しいページにナビゲートすると同じ値が表示されます。これは、サーバーが現在のページに対して結果のみを返す場合の標準ビヘイビアーです。

## <a id="MergeUnboundColumns-formula"></a> MergeUnboundColumns=true の場合、非バインド列の値の設定に数式は使用できません。

回避策として、データバウンド クライアント側イベントを処理でき、描画する前にこれらの値を手動でクライアント上のデータ ソースのデータ/データビューに追加します。dataBound イベントの内部では、非バインド列はデータ ソース内の data() 配列の一部です。従ってこれらはアクセス可能であり、現在の行データまたはその他の値に基づいて設定されます。

**JavaScript の場合:**

```js
$("#grid1").live("iggriddatabound", function (event, ui) {
            var i, grid = ui.owner,
                ds = grid.dataSource,
                data = ds.data(),
                dsLength = data.length;
            for (i = 0; i < dsLength; i++) {
              data[i]["UnboundColumn1"] = 
                data[i]["UnitPrice"] * data[i]["UnitsInStock"];              
            }
 });
```

## <a id="updating"></a> 更新と非バインド列

> **注:** 非バインド値を含む行が編集およびコミットされ、グリッドがページングまたは並べ替えの結果として再バインドされる場合、これらの変更は保存されません。これは、`dataBound` イベント上に非バインド列値を設定することにより回避できます。

CRUD 操作の間、非バインド列データは更新と同様にトランザクションの更新において示されます。非バインド列がデータ ソース内のデータ配列の一部であるため、アプリケーションは、トランザクションがデータ ソースにコミットされる前に、こうした列が基本データ ソース内に存在するかどうかをチェックする必要があります。

非バインド列は編集可能の場合があります。読み取り専用にする場合は、更新機能の列設定で設定します。

**JavaScript の場合:**

```js
{
      name: "Updating",
      editMode: 'row',
      enableAddRow: false,
      enableDeleteRow: true,                          
      columnSettings: [
        {
            columnKey: "Total",
            editorType: 'numeric',
            readOnly: true
        },
        {
            columnKey: "IsPromotion",
            editorType: 'bool',
            readOnly: true
        }
      ]
}
```

## <a id="MergeUnboundColumns-boolean"></a> MergeUnboundColumns = false およびブール値の非バインド列

サーバー上ですべてのブール値行の値を回避策として明示的に設定します。


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [既知の問題と制限 (igGrid)](igGrid-Known-Issues.html): このトピックでは、`igGrid` コントロールに関連する既知の問題点について説明します。

- [既知の問題点の改訂履歴](Known-Issues-Revision-History.html): このトピックのグループでは、ボリューム リリース間の %%ProductName%% コントロールの既知の問題について説明します。



 


