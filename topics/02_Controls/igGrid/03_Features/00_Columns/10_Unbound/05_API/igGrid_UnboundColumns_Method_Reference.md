<!--
|metadata|
{
    "fileName": "iggrid-unboundcolumns-method-reference",
    "controlName": "igGrid",
    "tags": ["API","Grids"]
}
|metadata|
-->

# メソッド リファレンス (非バインド列、igGrid)



## トピックの概要

### 概要

このトピックは、`igGrid`™ コントロールにおける非バインド列機能の各種メソッドについて説明します。

### 非バインド列クライアント側メソッドの参照チャート

以下の表は、`igGrid` コントロールの非バインド列に関する**クライアント側メソッド**の目的と機能についての概要です。

<table class="table table-striped">
	<thead>
		<tr>
            <th>
メソッド
			</th>

            <th>
説明
			</th>

            <th>
パラメーター
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
[getUnboundColumnByKey](%%jQueryApiUrl%%/ui.iggrid#methods:getUnboundColumnByKey)
			</td>

            <td>
このメソッドは、指定されたキーで非バインド列を返します。列が見つからない場合は、null 値を返します。
			</td>

            <td>
colKey (string) - 非バインド列のキー
			</td>
        </tr>

        <tr>
            <td>
[getUnboundValues](%%jQueryApiUrl%%/ui.iggrid#methods:getUnboundValues)
			</td>

            <td>
このメソッドは、指定された列キーで非バインド値を取得します。パラメーターは**オプション**です。キーが指定されていない場合、メソッドはすべての非バインド値を返します。キーがバインド列のキーである場合、メソッドは null 値を返します。
			</td>

            <td>
colKey (string) - 非バインド列のキー
			</td>
        </tr>

        <tr>
            <td>
[setUnboundValues](%%jQueryApiUrl%%/ui.iggrid#methods:setUnboundValues)
			</td>

            <td>
                このメソッドは、非バインド列の列キーと値の配列をパラメーターとして承諾します。非バインド列に対して値の配列を指定されたキーで設定します。

                <blockquote>
                    **注:** 値の配列長さがデータ行のカウントより短い場合、残りのセルは空のままになります。グリッドは、値の設定後に非バインド列を再描画します。これは、グリッドを再バインドも再描画もしません。
                </blockquote>
            </td>

            <td>
colKey (string) - 非バインド列のキー

                values (array) - 非バインド値の配列
			</td>
        </tr>

        <tr>
            <td>
[setCellValue](%%jQueryApiUrl%%/ui.iggridupdating#methods:setCellValue)
			</td>

            <td>
非バインド セルの値は、行を編集し非バインド列を更新する場合に使用される `igGridUpdating.setCellValue` メソッドを使用して設定できます。
			</td>

            <td>
                <ul>
                    <li>
rowId(object) - 行の識別子
					</li>
                </ul>

                <ul>
                    <li>
colKey(string) - 列のキー
					</li>
                </ul>

                <ul>
                    <li>
value(object) - 新しいセル値
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>


#### 非バインド列サーバー側メソッドの参照チャート

以下の表は、`igGrid` コントロールの非バインド列に関するサーバー側メソッドの目的と機能についての概要です。

<table class="table table-striped">
	<thead>
		
	</thead>
	<tbody>
        <tr>
            <td>
UnboundColumnWrapper&lt;T&gt;.UnboundValues(List&lt;object&gt; list)
			</td>

            <td>
このメソッドは、MVC ラッパー チェーン機能により使用されます。

オブジェクトのリスト (非バインド列の値) を承諾し、ページング、並べ替え、フィルタリング等の任意の操作を実施後にデータ ソースに連続して適用します。

リストに含まれるのと同じ数の値を設定します。行数がリストの長さより長い場合、残りの行に値は設定されません。
			</td>
        </tr>

        <tr>
            <td>
GridModel.SetUnboundValues (&lt;Column key&gt;, &lt; Dictionary of values &gt;)
			</td>

            <td>
このメソッドは、指定されたキーで非バインド列に値を設定します。

このオーバーロードは、2 つのパラメーターを受け付けます。「列キー」および &lt;PrimaryKey, Unbound Value&gt; ペアのディクショナリです。ディクショナリ内の PrimaryKey は `igGrid` 内の行のプライマリ キーポイントし、「Unbound Value」は、「列キー」に等しいキーを持つ非バインド列に設定される値です。
				<blockquote>
**注:** 定義されたプライマリ キーでのみ、このオーバーロードを使用します。
                </blockquote>

`SetUnboundValues` を使用し `MergeUnboundColumns` が true を使用すると、ページング、並べ替え、フィルタリング等の操作を実施後に非バインド値がバインド データに追加されます。行識別子と非バインド値の間に明確に定義された相関関係があるためで、ページング、並べ替え、フィルタリングがリモートである場合に追加の操作は必要ないということです。
			</td>
        </tr>

        <tr>
            <td>
GridModel.SetUnboundValues (&lt;Column key&gt;, &lt; List of values &gt;)
			</td>

            <td>
このオーバーロードは、列キーおよび値のリストをパラメーターとして受け付けます。リストの値は指定した「列キー」で列のセルに設定されます。指定されたキーを持つ非バインド列がない場合、またはキーがバインド列のものである場合は、カスタム例外がスローされます。

`PrimaryKey` が未定義であってもこのメソッドを使用できます。

`PrimaryKey` が定義されていると、オーバーロード `SetUnboundValues(<列キー>, <値のディクショナリ>)` を使用しなければなりません。この場合にリストを使用するとパフォーマンスに悪影響を及ぼします。行識別子とリスト項目の間に相関関係を作るためデータ ソース全体をトラバースしなければならないためです。値の非バインド リストの項目の順序に従って関係を構築します。

リストに含まれるのと同じ数の値を設定します。行数がリストの長さより長い場合、残りの行に値は設定されません。

                <blockquote>
**注:** `PrimaryKey` を定義していない状態で `SetUnboundValues(<列キー="">, <値のリスト>)` オーバーロードが使用される場合、プライマリ キー (またはその他の行識別子) と非バインド値の間にマップは存在しません。リモートのフィルタリング、並べ替え、ページングを使用する場合には、この点を考慮する必要があります。
                </column></blockquote>

`SetUnboundValues` を使用し `MergeUnboundColumns` が true である場合、フィルタリング、並べ替え、ページング等の操作を実施後バインド データに非バインド値を追加します。
            </td>
        </tr>
    </tbody>
</table>


## 関連コンテンツ

### トピック

以下のトピックでは、このトピックに関連する追加情報を提供しています。

- [プロパティ リファレンス (非バインド列、igGrid)](igGrid-UnboundColumns-Property-Reference.html): このトピックは、`igGrid` コントロールにおける非バインド列機能の各種プロパティについて説明します。





 

 


