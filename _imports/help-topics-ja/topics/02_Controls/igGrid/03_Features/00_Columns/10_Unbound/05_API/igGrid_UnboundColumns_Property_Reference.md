<!--
|metadata|
{
    "fileName": "iggrid-unboundcolumns-property-reference",
    "controlName": "igGrid",
    "tags": ["API","Grids"]
}
|metadata|
-->

# プロパティ リファレンス (非バインド列、igGrid)



## トピックの概要
### 概要

このトピックは、`igGrid`™ コントロールにおける非バインド列機能の各種プロパティについて説明します。

### 非バインド列プロパティの参照表

以下の表は、`igGrid` コントロールの非バインド列機能のプロパティの目的と機能の概要を説明しています。


<table class="table table-striped">
	<thead>
		<tr>
            <th>
プロパティ
			</th>

            <th>
説明
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
[key](%%jQueryApiUrl%%/ui.iggrid#options:columns.key)
			</td>

            <td>
列のキーは、非バインド列だけではなく、すべての列で一意である必要があります。
			</td>
        </tr>

        <tr>
            <td>
[unbound](%%jQueryApiUrl%%/ui.iggrid#options:columns.unbound)
			</td>

            <td>
このプロパティは列を非バインド列として設定します。True に設定すると、非バインド列に適用するプロパティを有効にします。これは `unboundValues` および `formula` プロパティです。
			</td>
        </tr>

        <tr>
            <td>
[unboundValues](%%jQueryApiUrl%%/ui.iggrid#options:columns.unboundValues)
			</td>

            <td>
このプロパティは、非バインド列を初期化するための値の配列を受けます。 <br />

データ行数が unbound 配列の長さより長い場合、残りのセルに値は設定されません。 <br />

データ行数が unbound 配列の長さより小さい場合、残りのセルの影響がありません。 <br />
            </td>
        </tr>

        <tr>
            <td>
[formula](%%jQueryApiUrl%%/ui.iggrid#options:columns.formula)
			</td>

            <td>
非バインド列に formula プロパティがあります。 <br />

現在のデータ行およびグリッドを引数として受けて、値を返す JavaScript 関数への参照または名前です。 <br />

列のセルの値を行の他のセル値に基づいて計算されるために使用されます。一般的な数式も使用できます。 <br />

数式の計算はグリッドがデータ ソースにバインドされた後に実行します。非バインド列に数式が構成された場合、評価された値は基本の `$.ig.dataSource` の `dataView` に保存されています。
			</td>
        </tr>

        <tr>
            <td>
[template](%%jQueryApiUrl%%/ui.iggrid#options:columns.template)
			</td>

            <td>
非バインド列は `igGrid` のテンプレート機能を使用できます。テンプレートを使用すると、他の列の値に基づいて非バインド列の値を設定できます。 <br />

バインド列および非バインド列のテンプレートの違いはありません。
			</td>
        </tr>

        <tr>
            <td>
[format](%%jQueryApiUrl%%/ui.iggrid#options:columns.format)
			</td>

            <td>
非バインド列も format を使用できます。format は列の基本データ型に基づいて設定されます。たとえば、`DataType` が bool の場合、サポートされる format は checkbox です。グリッドの `RenderCheckboxes` プロパティをオーバーライドして、非バインド列のチェックボックスとして使用できます。
			</td>
        </tr>

        <tr>
            <td>
mergeUnboundValues
			</td>

            <td>
MVC ラッパーはこのオプションを使用します。リモート シナリオのみに影響します。このオプションはクライアント側に構成しません。サーバー側では、このオプションを `Grid<T>.MergeUnboundColumns` メソッドで View に 設定するか、`GridModel. MergeUnboundColumns` プロパティで Controller に設定できます。

True に設定される場合、このオプションは、非バインド列データがサーバーに結合され、グリッド データの部分としてクライアントに送信されることを示します。この場合、リモート ページングが正しく操作しますが、[既知の問題と制限](igGrid-UnboundColumns-Known-Issues.html)トピックに説明したとおり、並べ替え、フィルタリング、およびグループ化が正しく動作しません。ローカル操作が正しく操作します。

False に設定される場合、非バインド列データはグリッド データと一緒に送信されていません。`igGrid` は、データ バインドする前にデータを結合する必要があります。この場合、リモート操作がサポートされていません。ローカル操作が正しく操作します。
			</td>
        </tr>
    </tbody>
</table>


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [メソッド リファレンス (非バインド列、igGrid)](igGrid-UnboundColumns-Method-Reference.html): このトピックは、`igGrid` コントロールにおける非バインド列機能の各種メソッドについて説明します。

- [既知の問題と制限](igGrid-UnboundColumns-Known-Issues.html): このトピックは、`igGrid` 非バインド列機能のすべての既知問題と制限について説明します。



 

 


