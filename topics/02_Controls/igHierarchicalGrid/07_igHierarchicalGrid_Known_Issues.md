<!--
|metadata|
{
    "fileName": "ighierarchicalgrid-known-issues",
    "controlName": "igHierarchicalGrid",
    "tags": ["Grids","Known Issues","Tips and Tricks"]
}
|metadata|
-->

# 既知の問題点および制限事項 (igHierarchicalGrid)

## 既知の問題点と制限の概要

以下の表で、`igHierarchicalGrid`™ コントロールの既知の問題点と制限事項を簡単に説明します。いくつかの問題については、この概要表の後に、既知の問題点に関する詳しい説明と、考えられる回避策を示します。

#### 凡例:

<table class="table">
    <tbody>
        <tr>
            <td><img src="images/positive.png" alt="" class="img-responsive"></td>
            <td>回避策</td>
        </tr>
        <tr>
            <td><img src="images/negative.png" alt="" class="img-responsive"></td>
            <td>既知の回避策はありません</td>
        </tr>
        <tr>
            <td><img src="images/tobeUpdated.png" alt="" class="img-responsive"></td>
            <td>修正予定です</td>
        </tr>
    </tbody>
</table>

#### [igHierarchicalGrid](#general)

問題|説明|状態
---|---|---
[Android 4.* デバイスで、スクリーン タップが誤って解釈される](#android-taps)|Android 4.* を使用したタッチ デバイスでは、階層グリッドで Group By モーダル ダイアログのドロップダウンのタップは、多くの場合モーダル ダイアログの背後のグリッド セルに作用します。 | ![](images/positive.png)
[階層グリッドにおいて特定の順序で機能を参照した場合に発生するレンダリング問題](#feature-order)|Group By 機能を機能リストに追加した後に行セレクターを追加した場合、`igHierarchicalGrid` の子のレイアウトが正しく描画されないことがあります。 | ![](images/positive.png)
[子レイアウトの `<div>` 要素は、jQuery ID セレクターで選択することはできません。](#limitation-primary-key)|`igHierarchicalGrid` は親レイアウトのプライマリー キー値を使用して、固有の `id` 属性を持つ子レイアウトの `<div>` 要素を作成します。プライマリー キーの値に無効な文字が含まれる場合は、[jQuery ID セレクター](http://api.jquery.com/id-selector/)で DIV 要素を選択することはできません。 | ![](images/tobeUpdated.png)
MVC で自己参照が機能しない|`igHierarchicalGrid` を自己参照データにバインドしたい場合、シリアル化制限のために、MVC パターンによりバインドすることができません。 | ![](images/negative.png)
[チェーンでロード オン デマンドが機能しない](#load-on-demand-chaining)|MVC プロジェクトのビュー ページで、ロード オン デマンドを有効にすることはできません。 | ![](images/positive.png)
[レイアウトでプライマリー キーを使用せずにロード オン デマンドを実行すると、例外がスローされる](#load-on-demand-primary)|ロード オン デマンド機能を有効にし、すべての子レイアウトに対してプライマリー キーを定義しなかった場合、例外がスローされます。 | ![](images/positive.png)
[子レイアウトの一部の列が表示されない、または切り取られる](#hidden-child-columns)|`igHierarchicalGrid` で幅が定義されず、また子レイアウトに列幅が width グリッドを越える列がある場合、子の列の一部は切り取りまたは非表示になります。 | ![](images/positive.png)
機能を複数回定義できない|**JavaScript の場合:** `igGrid` と `igHierarchicalGrid` のいずれの場合も、1 つの機能を複数回、定義するとエラーがスローされます。**MVC の場合:** `igGrid` と `igHierarchicalGrid` のいずれの場合も、MVC ラッパーで機能を複数回定義すると、最後の定義のみが取り入れられます。 | ![](images/negative.png)
XML へのクライアント側のバインディング|XML へのバインディングは再帰的スキーマのみサポートします。 | ![](images/tobeUpdated.png)
[ロード オン デマンドが false の場合、永続化は子レイアウトに対して機能しない](#child-persistence)|ロード オン デマンドが false の場合、フィルタリング、並べ替えまたは GroupBy は子レイアウトに対して永続化されません。 | ![](images/positive.png)



#### [igHierarchicalGrid GroupBy](#grouping)

問題|説明|状態
---|---|---
[階層グリッドにおけるリモート グループ化の制限事項](#remote-grouping)|リモート グループ化では、複数のレイアウト (またはルート グリッド) の列のグループ化は機能しません。 | ![](images/positive.png)
[ロード オン デマンドでのリモート グループ化が不正になる](#remote-grouping-error)|グリッド全体のロード オン デマンドでリモートの Group By を有効にした場合、オン デマンドでロードしているデータを返すアクションを修正しない限り、グループは不正になります。 | ![](images/positive.png)
[グループ化機能で列設定を定義し、同時に継承を有効にすると、例外がスローされる](#inheritance-exception)|グループ化機能を有効にし、その中で列設定を定義し継承を有効にすると、ページ例外がスローされます。 | ![](images/positive.png)
[異なる子レイアウトからのリモート グループ化の制限](#different-child-layouts)|ロード オン デマンドが無効な場合は、リモート Group By を使用して異なる子レイアウトから列をグループ化すると、子の `DataSourceUrl` ではなく親の `DataSourceUrl` が呼び出されます。 | ![](images/positive.png)


#### igHierarchicalGrid RowSelectors

問題|説明|状態
---|---|---
行セレクターの動作は、一度に 1 つのレイアウトに限られる|行セレクターの機能のチェックボックスで選択されたレイアウトは、別のレイアウトのチェックボックスがチェックされると選択が解除されます。 | ![](images/negative.png)



## <a id="general"></a> igHierarchicalGrid

<table class="table table-striped">
	<thead>
        <tr>
            <th>問題</th>
            <th>説明</th>
			<th>回避方法</th>
        </tr>
    </thead>
    <tbody>
        <tr id="android-taps">
            <td>
                <a id="misinterpreted-screen-taps"></a>Android 4.* デバイスで、スクリーン タップが誤って解釈される
            </td>

            <td>
	            Android 4.* を使用したタッチ デバイスでは、階層グリッドで Group By モーダル ダイアログのドロップダウンのタップは、多くの場合モーダル ダイアログの背後のグリッド セルに作用します。
			</td>
			<td>
	            [`modalDialogDropDownWidth`](%%jQueryApiUrl%%/ui.iggridgroupby#options) と [`modalDialogDropDownAreaWidth`](%%jQueryApiUrl%%/ui.iggridgroupby#options) プロパティの値を変更して、モーダル ダイアログのドロップダウンにレイアウト ツリー全体が表示されるようにするか、もしくは上記のプロパティ値を null に設定しておくという方法が考えられます。
            </td>
            </tr>
            <tr id="limitation-primary-key">
	            <td>
	            	子レイアウトの `<div>` 要素は、jQuery ID セレクターで選択することはできません。
	            </td>
	
	            <td>
	            	更新機能が有効かどうかに基づいて、2 つの回避方法があります。
				</td>
				<td>
	            	**更新機能が無効の場合:**[primaryKey](%%jQueryApiUrl%%/ui.iggrid#options) オプションをグリッドの構成から削除します。igHierarchicalGrid は、データ行のプライマリ キーを自動生成します。**更新機能が有効な場合:**igHierarchicalGrid データ ソースの各レイアウトにフィールドを追加し、それをプライマリ キーとして使用します。連番を使用できます。
	            </td>
            </tr>
			<tr id="feature-order">
	            <td>
	            	階層グリッドにおいて特定の順序で機能を追加した場合に発生するレンダリング問題
	            </td>
	            <td>
	           		igHierarchicalGrid では、機能リストに行セレクター機能を追加する前にグループ化機能を入れておいた場合、子レイアウトにレンダリング問題 (列の欠落やずれ) が発生することがあります。
				</td>
				<td>
					この問題を回避するには、配列にグループ化を追加する**前に**行セレクターを追加します。
				</td>
            </tr>
			<tr id="load-on-demand-chaining">
		    	<td>
		           	チェーンでロード オン デマンドが機能しない
		    	</td>
	            <td>
		            MVC プロジェクトのビュー ページで、ロード オン デマンドを有効にすることはできません。
				</td>
				<td>
		            Controller で階層モデルを作成するか、モデル クラスを作成し、それを View ページに渡す必要があります。
			    </td>
            </tr>
		    <tr id="load-on-demand-primary">
				<td>
		            レイアウトでプライマリー キーを使用せずにロード オン デマンドを実行すると、例外がスローされる
		    	</td>
	            <td>
		            ロード オン デマンド機能を有効にし、すべての子レイアウトに対してプライマリー キーを定義しなかった場合、例外がスローされます。これは、レイアウトのプライマリ キーがないと、グリッドがデータのロード オン デマンド要求を行うことができないためです。
				</td>
				<td>
					常に、すべてのレイアウトのプライマリ キーと外部キーを定義しておくことをお勧めします。
		    	</td>
		    </tr>
              <tr id="hidden-child-columns">
	             <td>
		            子レイアウトの一部の列が表示されない、または切り取られる
			    </td>
			    <td>
					igHierarchicalGrid で幅が定義されず、また子レイアウトの幅がグリッドの幅を越える列がある場合、子の列の一部は切り取りまたは非表示になります。
				</td>
				<td>
					常に igHierarchicalGrid に幅を設定しておくことをお勧めします。子レイアウトがグリッドの幅より広い場合、水平スクロールバーが表示されます。
			    </td>
		    </tr>
          	<tr id="child-persistence">
		    	<td>
		            ロード オン デマンドが `false` の場合、永続化は子レイアウトに対して機能しない
		    	</td>
				<td>
					ロード オン デマンドの永続化が無効で、永続化は子レイアウトに対して機能しない
				</td>
		    <td>
				子レイアウト機能で persist を `false` に設定します。
		    </td>
	    </tr>
    </tbody>         
</table>

## <a id="grouping"></a> igHierarchicalGrid GroupBy
<table class="table table-striped">
	<thead>
        <tr>
            <th>問題</th>
            <th>説明</th>
			<th>回避方法</th>
        </tr>
    </thead>
    <tbody>
		<tr id="remote-grouping">
            <td>
				階層グリッドにおけるリモート グループ化の制限事項
			</td>

            <td>
				リモート グループ化では、複数のレイアウト (またはルート グリッド) の列のグループ化は機能しません。
			</td>
			<td>  
                **ローカル グループ化の使用:**問題を回避します。
                
                **リモート グループ化の使用:**リモート グループ化を使用する場合は、1 つのレイアウト (またはルート グリッド) にある列のみをグループ化してください。
			</td>
        </tr>      
        <tr id="remote-grouping-error">
            <td>
				ロード オン デマンドでのリモート グループ化が不正になる
			</td>

            <td>
				グリッド全体のロード オン デマンドでリモートの Group By を有効にした場合、オン デマンドでロードしているデータを返すアクションを修正しない限り、グループは不正になります。
			</td>
			<td>                    
                オン デマンドで要求されるデータを返すアクション メソッドを実装する場合、返される結果のタイプを、GridModel ではなく GridColumnLayoutModel に設定します。
                以下のコードはこの設定を示したものです。
                    <br>
                **C# の場合:**

<pre>public JsonResult BindChildLayout(string path, string layout)
{
    GridColumnLayoutModel childLayout = new GridColumnLayoutModel();
    …
    return childLayout.GetData(path, layout);
}
</pre>
			</td>
        </tr>

        <tr id="inheritance-exception">
            <td>
				グループ化機能で列設定を定義し、同時に継承を有効にすると、例外がスローされる
			</td>

            <td>
				グループ化機能が列設定を定義し、同時に継承を有効にすると、例外がスローされるこの問題は、MVC View ページでチェーン化アプローチを用いるグリッドを持つ MVC ソリューション内で発生します。グループ化機能を有効にし、その中で列設定を定義し継承を有効にすると、ページ例外がスローされます。
			</td>
			<td>
				列設定を定義し、グループ化機能で継承を有効にする代わりに、グループ化機能で継承を無効にしてから各子レイアウト内で同じグループ化設定を手動で定義します。
			</td>
        </tr>

        <tr id="different-child-layouts">
            <td>
				異なる子レイアウトからのリモート グループ化の制限
			</td>
            <td>
				ロード オン デマンドが false の場合、子の DataSourceUrl は使用されません。
			</td>
			<td>
				ロード オン デマンド機能を有効にします。
			</td>
        </tr>
    </tbody>
</table>


## 関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [グループ化の有効化と設定 (igHierarchicalGrid)](igHierarchicalGrid-Grouping-Enabling-and-Configuring.html): このトピックでは、コード例を使用して、 jQuery および MVC の両方で `igHierarchicalGrid` コントロールのグループ化機能を有効にして構成する方法を示します。
- [ロードオンデマンド (igHierarchicalGrid)](igHierarchicalGrid-Load-on-Demand.html): このトピックでは、データを一度にオン デマンドで `igHierarchicalGrid` に読み込む 2 とおりの方法を示します。
- [行セレクターの構成 (igHierarchicalGrid)](igHierarchicalGrid-Configuring-RowSelectors.html): コード例を使用して、`igHierarchicalGrid` コントロールの行セレクター機能を構成する方法を説明します。

### リソース

以下の資料 (Infragistics のコンテンツ ファミリー以外でもご利用いただけます) は、このトピックに関連する追加情報を提供します。

- [ID セレクター (“#id”)](http://api.jquery.com/id-selector/): jQuery ID セレクターを説明する jQuery ヘルプのトピック。
