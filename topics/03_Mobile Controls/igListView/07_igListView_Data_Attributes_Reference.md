<!--
|metadata|
{
    "fileName": "iglistview-data-attributes-reference",
    "controlName": "igListView",
    "tags": ["API","Data Binding","Filtering","Sorting"]
}
|metadata|
-->

# データ属性の参照 (igListView)

## トピックの概要

### 目的

このトピックでは、すべての `igListView`™ データ属性の一覧を示します。これらの属性を使用して、マークアップで `igListView` を初期化できます。

### 前提条件

- 概念
	- HTML 5 データ-* 属性
- トピック
	- [igListView の概要](igListView-Overview.html): このトピックでは、`igListView` の機能について説明します。
	- [igListView の Web ページへの追加](igListView-Adding-igListView-to-a-Web-Page.html): このトピックでは、`igListView` モバイル・コントロールをウェブ ページに追加する方法を説明します。
- 外部リソース
	- [HTML 5 データ-* 属性](https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [ListView オプション データ属性リファレンス](#options)
-   [ListView 並び替えデータ属性リファレンス](#sorting)
-   [ListView フィルタリングのデータ属性リファレンス](#filtering)
-   [ListView ロード オン デマンド データ属性リファレンス](#load-ondemand)



## <a id="options"></a> ListView オプション データ属性リファレンス

`igListView` データ属性は、コントロールをマークアップで構成できるようにします。

`igListView` マークアップ初期化の例:

**HTML の場合:**

```html
<div id="igListViewMarkupInitializtion"
    data-role="iglistview"
    data-numbered-list="true"
    data-bindings-header-key="ProductName"
    data-bindings-description-key="CategoryName"
    data-bindings-count-key="InStock"
    data-bindings-image-url-key="ImageUrl"
    data-data-source="northwindProducts">
</div>
```

### ListView オプション データ属性リファレンス概要

次の表は、`igListView` コントロール特有のデータ属性の目的と機能について概要を示します。

プロパティ|タイプ|説明|デフォルト値
---------|------|-------------|--------------
data-role |string|`igListView` の識別子|iglistview
data-inset |bool|list view をページ内の挿入物のように示すかどうかを決定します。|false
data-numbered-list |bool|**ol** または **ul** をデータ バインド リストの主要要素として使用するかどうかを判断します。|false
data-data-source |object|以下のいずれかとなります。<ul> <li>JavaScript 変数の名前</li> <li>実際の Json エンコードされた配列</li> <li>$.ig.DataSource が受け入れる任意の有効なデータ ソース</li> <li>$.ig.DataSource 自身のインスタンス</li> </ul> |null
data-data-source-url |string|AJAX コール ($.ajax) を使用してデータが取得されるデータ ソースとしてリモート URL を指定します。|null
data-data-source-type |string|データ ソースの種類 (**json** など) を明示的に設定します。|null
data-response-data-key |string|これは、応答がラップした場合にデータ レコードが保持される応答内のプロパティです。|null
data-response-total-rec-count-key |string|これは、サーバー上のレコード総数を指定する応答内のプロパティです。|null
data-local-schema-transform |bool|このオプションが false と設定されている場合、データ スキーマへの変換は適用されません。|true
data-item-template |string|リスト項目を描画するために使用される、IG templating スタイル テンプレート。|null
data-item-details-template |string|サブ ページ内のリスト項目の詳細を描画するために使用される、IG templating スタイル テンプレート。|null
data-image-mode |string|画像、アイコン、またはiサムネイルを表示するかどうかを決定します。|サムネイル
data-show-count |bool|カウント バブルを表示するかどうかを判断します。|true
data-item-header-size |string|LI に見出しタグを表示するかどうかを決定します。値によって、H1 から H6 になります。|h2
data-bindings-text-key |string|その値がノード テキストになる、data source プロパティの名前を指定します。|null
data-bindings-text-x-path |string|テキスト属性／ノードへの XPath を指定します。クライアントのみのXML への直接バインディングで使用されます。|null
data-bindings-image-url-key |string|値がノード イメージに対する URL として使用されるデータ ソース プロパティの名前を指定します。|null
data-bindings-image-url-x-path |string|イメージ URL 属性／ノードへの XPath を指定します。クライアントのみのXML への直接バインディングで使用されます。|null
data-bindings-navigate-url-key |string|その値がノード アンカーの **href** 属性として使用される、data source プロパティの名前を指定します。|null
data-bindings-navigate-url-x-path |string|ナビゲート URL 属性／ノードへの XPath を指定します。クライアントのみのXML への直接バインディングで使用されます。|null
data-bindings-count-key |string|その値がノードのカウントとして使用される、data source プロパティの名前を指定します。|null
data-bindings-count-x-path |string|ノード カウントへの XPath を指定します。クライアントのみのXML への直接バインディングで使用されます。|null
data-bindings-header-key |string|その値がノードのカウントとして使用される、data source プロパティの名前を指定します。|null
data-bindings-header-x-path |string|リスト項目ヘッダーへの XPath を指定します。クライアントのみのXML への直接バインディングで使用されます。|null
data-bindings-description-key |string|その値がノードのカウントとして使用される、data source プロパティの名前を指定します。|null
data-bindings-description-x-path |string|クライアントのみの XML への直接バインディングで使用されるリスト項目記述への XPath を指定します。|null
data-bindings-primary-key |string|その値がデータのプライマリ キー属性として使用される、data source プロパティの名前を指定します。ロード オン デマンドが有効であり、指定されたノードのパスがインデックスの代わりにプライマリ キーを使用して生成される場合に、このプロパティが使用されます。|null
data-bindings-is-divider-key |string|項目が読み取り専用のリスト ディバイダーを表すかどうかを決定するために使用される data source プロパティの名前を指定します。|null
data-bindings-details-title-key |string|その値がノードのサブ ページのタイトルになる、data source プロパティの名前を指定します。|null
data-bindings-details-title-x-path |string|タイトル属性／ノードへの XPath を指定します。クライアントのみのXML への直接バインディングで使用されます。|null
data-binding-custom-bindings |array|カスタム バインディングをもつオブジェクトのリストです。これは項目内の追加データまたはテンプレート詳細を取り入れます。各項目は、`fieldName` および `dataType` のキー／値ペアをもつオブジェクトです。|[]
data-initial-data-bind-depth |number|最初は先頭のレベルだけがデータ バウンドになります。また、描画深さとして機能します。これは、最初はこのプロパティの値に応じてリスト レベルの数が描画されることを意味しています。|-1
data-odata |bool|*true* の場合、OData 規則と `$expand` 構文を用いてすべての要求をエンコードします。|false
data-default-children-data-property |string|子供が位置する応答内にデフォルトのプロパティを指定します。|Children
data-path-separator |string|データの階層的ルックアップのためのパスを作るために区切り文字を指定します。|/
data-auto-generate-layouts |bool|true の場合、キーのデフォルト値を想定してすべてのレイアウトを自動生成します。|false
data-child-layout-key |string|レイアウト キーを指定します。これは、子レイアウトのデータ レコードを保持するプロパティになります。|null
data-init-selector |string|このウィジェットに変換される html 要素を見つけるためにデフォルトで使用されるセレクターです。|:jqmData(role='iglistview')



## <a id="sorting"></a> ListView 並び替えデータ属性リファレンス

`igListView` 並び替え機能のデータ属性によりマークアップ中に構成を作ることができます。

`igListView` マークアップ初期化の例:

**HTML の場合:**

```html
<ul id="igListViewSorting"
    data-role="iglistview" 
    data-data-source="northwindProducts"                 
    data-auto-generate-layouts="False" 
    data-bindings-text-key="ProductName"
    data-bindings-description-key="CategoryName"
    data-bindings-image-url-key="ImageUrl"
    data-bindings-count-key="InStock"
    data-sorting="true" 
    data-sorting-type="local"
    data-sorting-sort-presets-label="Sorting options" 
    data-sorting-auto-generate-sort-presets="false" 
    data-sorting-presets='[         {"text":"Inventory","sortedFields":[ {"fieldName":"InStock","direction":"desc"} ]},         {"text":"Category","sortedFields":[ {"fieldName":"CategoryName","direction":"asc"} ]} ]'
    data-sorting-grouping-settings='{"enableCollapsibleDividers" : true }'>
</ul>
```

### ListView 並び替えデータ属性リファレンス概要

次の表は、`igListView` 並び替え特有のデータ属性の目的と機能について概要を示します。

プロパティ|タイプ|説明|デフォルト値
---|---|---|---
data-sorting |bool|並び替えの有効化、無効化をします。|false
data-sorting-type |string|ローカルまたはリモート並べ替えを定義。|null
data-sorting-case-sensitive |bool|並べ替えの大文字と小文字の区別です。|false
data-sorting-sort-presets-label |string|並べ替えプリセットの上に表示されるテキスト。|null
data-sorting-sort-state |string|開始時に選択されるプリセットの数です。|default
data-sorting-sort-url-key |string|並び替え式が URL 中でどのようにエンコードされるかを指定する URL パラメータ名です。OData 規則を使用します。`例: ?sort(col1)=asc`|null
data-sorting-sort-url-key-asc-value |string|昇順の並び替え用の URL パラメータ値です。OData 規則を使用します。|null
data-sorting-sort-url-key-desc-value |string|降順の並び替え用の URL パラメータ値です。OData 規則を使用します。|null
data-sorting-custom-sort-function |関数|<ul> <li>並べ替えられるデータ</li>、<li>データ ソース フィールド定義の配列</li>、<li>および使用する並べ替え方向 (オプション)</li></ul> の 3 つのパラメーターを使用するカスタムの並べ替え関数。<ul></ul>この関数は、並べ替えられたデータ配列を返します。|null
data-sorting-sorted-fields |array|並べ替え対象フィールドと方向を示すキー/値ペア (fieldName と direction) のリスト。|[]
data-sorting-show-grouping |bool|最初の並び替えフィールドがリストに挿入されたグループをもつかどうかを判断します。|false
data-sorting-group-comparer-function |関数|機能でカスタム グループを指定します。これは、ブール値を比較し返すための 1 番目と 2 番目の値をとります。この値はそれらが同じグループかどうかを判断します。|null
data-sorting-group-name-function |関数|カスタム グループ名関数を指定します。これは、グループの値を受け取り、表示する名前を返します。|null
data-sorting-presets |array|事前設定並べ替えオプションのリスト。|[]
data-sorting-divider-template |string|jQuery テンプレート スタイルはリスト区分線目を描画するために使われるテンプレートです。カウントと名前のキー／値ペアを含むデータオブジェクトで描画します。|null
data-sorting-auto-generate-sort-presets |bool|値が true の場合、プリセット配列は null で、プリセットはバインディングごとに生成されます。|true
data-sorting-grouping-settings |object|デフォルトのフィールドおよびすべてのプリセットのためにグループ化の表示方法を制御する設定を持つオブジェクト。|[object](%%jQueryApiUrl%%/mobile.igListViewSorting#options:object)




## <a id="filtering"></a> ListView フィルタリングのデータ属性リファレンス

`igListView` フィルタリング機能のデータ属性によりマークアップ中に構成を作ることができます。

`igListView` フィルタリング マークアップ初期化の例:

**HTML の場合:**

```html
<ul id="filterPresetsListView"
    data-role="iglistview"  
    data-auto-generate-layouts="False" 
    data-bindings-header-key="ProductName"
    data-bindings-description-key="CategoryName"
    data-bindings-count-key="InStock"
    data-bindings-image-url-key="ImageUrl"
    data-data-source="northwindProducts" 
    data-data-source-type="json" 
    data-filtering="true" 
    data-filtering-presets='[         {"text":"Beverages","filteredFields":[ {"fieldName":"CategoryName","searchValue":"Beverages","condition":"equals"} ]},         {"text":"Dairy","filteredFields":[ {"fieldName":"CategoryName","searchValue":"Dairy Products","condition":"equals"} ]},         {"text":"Seafood","filteredFields":[ {"fieldName":"CategoryName","searchValue":"Seafood","condition":"equals"} ]},         {"text":"Confections","filteredFields":[ {"fieldName":"CategoryName","searchValue":"Confections","condition":"equals"} ]} ]' 
    data-filtering-search-bar-enabled="false">
</ul>
```

### ListView フィルタリング データ属性リファレンス概要

次の表は、`igListView` フィルタリング特有のデータ属性の目的と機能について概要を示します。

プロパティ|タイプ|説明|デフォルト値
---|---|---|---
data-filtering |bool|フィルタリングの有効化、無効化をします。|false
data-filtering-type |string|フィルタリングのローカルとリモートのいずれかを決定します。|null
data-filtering-case-sensitive |bool|フィルタリングの大文字小文字の区別を有効化／無効化します。|false
data-filtering-filter-expr-url-key |string|フィルタリング式がリモート要求用にどのようにエンコードされるかを指定する URL キー名です。たとえば、`&filter('col') = startsWith.`。デフォルト値は OData です。|null
data-filtering-search-bar-enabled |bool|トレイ内に検索バーを有効化するかどうかを判断します。|true
data-filtering-search-bar-fields |array|これは、エンドユーザーにキーワード検索構成を許すためのソース中のフィールドのリストです。|[]
data-filtering-search-bar-field-name |string|これはキーワード検索のフィールドを決めます。これが空の場合、すべてのフィールドを検索します。|””
data-filtering-search-bar-placeholder |string|これが空の時に検索バーにプレースホルダを表示するかどうかを決めます。|null
data-filtering-search-bar-condition |array|デフォルトのフィルタリング条件です。|contains
data-filtering-filtered-fields |array|これはフィルターされたフィールドを表すキー／値のペア (*fieldName、searchValue、条件、ロジック*) のリストです。|[]
data-filtering-filter-presets-label |string|フィルター プリセットの上に表示されるテキストです。|null
data-filtering-filter-state |string|使用されるプリセットのインデックス。*デフォルト* はなし。|default
data-filtering-presets |array|これはプリセット フィルタリング オプションのリストです。|[]



## <a id="load-ondemand"></a> ListView ロード オン デマンド データ属性リファレンス

`igListView` ロード・オンデマンド機能のデータ属性によりマークアップ中に構成を作ることができます。

`igListView` ロード・オンデマンドのマークアップ初期化の例:

**HTML の場合:**

```html
<ul> 
    data-auto-generate-layouts="False" 
    data-bindings="{'textKey':'ProductName','descriptionKey':'CategoryName','imageUrlKey':'ImageUrl'}" 
    data-data-source="/SampleDataJson/ProductJSONOnDemand" 
    data-generate-compact-jsonresponse="false" 
    data-image-mode="icon" 
    data-inset="true" 
    data-key="Products" 
    data-load-on-demand="true" 
    data-load-on-demand-page-index-url-key="page" 
    data-load-on-demand-page-size="5" 
    data-load-on-demand-page-size-url-key="pageSize" 
    data-load-on-demand-record-count-key="TotalRecordsCount" 
    data-load-on-demand-type="remote" 
    data-response-data-key="Records" 
    data-role="iglistview">
</ul>
```

### ListView ロード・オンデマンド・データ属性リファレンス

次の表は、`igListView` ロード オン デマンド機能データ属性の目的と機能について概要を示します。

プロパティ|タイプ|説明|デフォルト値
---|---|---|---
data-load-on-demand |bool|ロード オン デマンドを有効または無効にします。|false
data-load-on-demand-type |string|ローディングのローカルとリモートのいずれかを決定します。|null
data-load-on-demand-page-size |number|*0* よりも大きい場合、最初にフェッチされてロードされる項目をいくつにするかをコントロールします。|10
data-load-on-demand-record-count-key |string|データ ソース中のレコード総数を保持する応答内のプロパティです。|null
data-load-on-demand-page-size-url-key |string|現在要求されているページ サイズが何であるかを示すエンコードされた URL パラメータの名前を示します。|null
data-load-on-demand-page-index-url-key |string|現在要求されているページ インデックスが何であるかを示すエンコードされた URL パラメータの名前を示します。|null
data-load-on-demand-mode |string|追加小目をロードするためのボタンを表示するか、自動的にフェッチするかを定めます。|ボタン
data-load-on-demand-auto-hide-button-at-end |bool|*True* の場合、残っているページはなく（データ ソースによれば）、追加のボタンがフェッチされ、自動ローディングは停止します。|true



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。


- [並べ替えの構成](igListView-Configuring-Sorting.html): このトピックでは、`igListView`™ の並べ替え機能を使用する方法を説明します。

- [フィルタリングの構成](igListView-Configuring-Filtering.html): このトピックでは、`igListView`™ のフィルタリング機能を使用する方法を示します。

- [ロード オン デマンドの構成](igListView-Configuring-Load-on-Demand.html): このトピックでは、`igListView`™ のロード オン デマンド機能の使い方を示します。

- [igDataSource](igDataSource-igDataSource.html): このトピックでは、`igDataSource` トピックに関する参照の情報を提供します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [並べ替えとグループ化のプリセット](%%SamplesUrl%%/mobile-list-view/sort-group-presets): このサンプルでは、並べ替えたフィールドのコレクションを使用してデフォルトの並べ替えを構成できます。また、並べ替えとグループ化プリセットを並べ替えトレーに表示できます。

- [フィルターのプリセット](%%SamplesUrl%%/mobile-list-view/filter-presets): このサンプルでは、特定のカテゴリーだけを表示するようにフィルター プリセットを適用する方法を説明します。

- [検索](%%SamplesUrl%%/mobile-list-view/search): このサンプルは、検索ボックスを使用するためにフィルタリングを構成する方法を示します。

- [ロード オン デマンド](%%SamplesUrl%%/mobile-list-view/load-on-demand): このサンプルでは、ロード オン デマンドの構成方法を説明します。





 

 


