<!--
|metadata|
{
    "fileName": "iglistview-overview",
    "controlName": "igListView",
    "tags": ["Data Binding","Drilldown","Filtering","Getting Started","Grouping","Sorting","Templating"]
}
|metadata|
-->

# igListView の概要

## トピックの概要

### 目的

このトピックでは、`igListView`™ の機能について説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**概要**](#introduction)
-   [**主要機能**](#features)
	-   [データ バインディング](#data-binding)
    -   [階層](#hierarchy)
    -   [テンプレート](#templates)
    -   [並べ替え](#sorting)
    -   [フィルタリング](#filtering)
    -   [グループ化](#grouping)
    -   [ロード オン デマンド](#load-on-demand)



## <a id="introduction"></a> 概要

`igListView` コントロールの目的は、jQuery Mobile プラットフォームでリスト機能を提供することです。

![](images/igListView_Overview_1.png)



## <a id="features"></a> 主要機能

以下の表は、`igListView` コントロールの主な機能についてまとめています。詳細は、概要表の後に記載されています。

機能|説明
---|---
[データ バインディング](#data-binding)|`igListView` は、`igDataSource` 、および UL または OL HTML 要素で使用可能なすべてのデータ ソースにバインドできます。
[階層](#hierarchy)|`igListView` は階層型ナビゲーションをサポートしています。階層型ナビゲーションは、jQuery Mobile ナビゲーションの概念に従っています。
[テンプレート](#templates)|`igListView` はテンプレートと簡単に併用できます。
[並べ替え](#sorting)|`igListView` は、ローカルまたはリモートの並べ替えをサポートしています。カスタムの並べ替えもサポートしています。並べ替えは、グループ化と併用することもできます。
[フィルタリング](#filtering)|フィルタリングにはローカルまたはリモートがあります。フィルターのプリセットまたは検索ボックスを使用できます。
[グループ化](#grouping)|グループ化によって、類似の項目をまとめてスタックできます。
[ロード オン デマンド](#load-on-demand)|`igListView` ロード オン デマンドによって、ユーザーの要求に応じて、より多くの項目をリストに追加できます。




### <a id="data-binding"></a> データ バインディング

`igListView` は、`igDataSource`、および UL または OL HTML 要素で使用可能なすべてのデータ ソースにバインドできます。

![](images/igListView_Overview_1.png)

**関連トピック:**

-   [igListView の Web ページへの追加](igListView-Adding-igListView-to-a-Web-Page.html)
-   [igDataSource の概要](igDataSource-igDataSource-Overview.html)

### <a id="hierarchy"></a> 階層

`igListView` は階層型ナビゲーションをサポートしています。階層型ナビゲーションは、jQuery Mobile ナビゲーションの概念に従っています。

![](images/igListView_Overview_3.png)

**関連トピック:**

-   [複数レベルのデータ バインディングの構成](igListView-Configuring-Multi-Level-Data-Binding.html)

### <a id="templates"></a> テンプレート

`igListView` はテンプレートと簡単に併用できます。

![](images/igListView_Overview_4.png)

**関連トピック:**

-   [igTemplate の概要](igTemplating-Overview.html)

### <a id="sorting"></a> 並べ替え

`igListView` は、ローカルまたはリモートの並べ替えをサポートしています。カスタムの並べ替えもサポートしています。並べ替えは、グループ化と併用することもできます。

![](images/igListView_Overview_5.png)

**関連トピック:**

-   [並べ替えの構成](igListView-Configuring-Sorting.html)

### <a id="filtering"></a> フィルタリング

フィルタリングにはローカルまたはリモートがあります。フィルターのプリセットまたは検索ボックスを使用できます。

![](images/igListView_Overview_6.png)

**関連トピック:**

-   [フィルタリングの構成](igListView-Configuring-Filtering.html)

### <a id="grouping"></a> グループ化

グループ化によって、類似の項目をまとめてスタックできます。`igListViewSorting` ウィジェットのグループ化オプションにアクセスすると、縮小可能なグループを有効にし、分割テンプレートを適用してグループ化機能を構成できます。

![](images/igListView_Overview_7.png)

**関連トピック:**

-   [グループ化の構成](igListView-Configuring-Grouping.html)

### <a id="load-on-demand"></a> ロード オン デマンド

`igListView` ロード オン デマンドは、2 種類のシナリオで使用できます。最初のシナリオは、階層型データの場合です。2 番目は、ユーザーがボタンを押すことによってより多くの項目を要求できる、フラット データの場合です。これは、以下のスクリーンショットに示されています。

![](images/igListView_Overview_8.png)

**関連トピック:**

-   [ロード オン デマンドの構成](igListView-Configuring-Load-on-Demand.html)



 

 


