<!--
|metadata|
{
    "fileName": "igtreegrid-remote-features",
    "controlName": ["igTreeGrid"],
    "tags": ["Grids", "MVC"]
}
|metadata|
-->

# リモート機能 (igTreeGrid)

`igTreeGrid` のデータ操作機能は、ローカル実行またはリモート実行のセットアップをサポートします。リモート実行のセットアップは、クライアントでのロードを減らす必要がある場合や、クライアントに戻す前にデータにカスタム ロジックを適用する場合に役立ちます。このトピックでは、ツリー グリッドに対するリモート操作の基本について説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念、トピック、および記事の一覧です。

-   [機能の概要 (igTreeGrid)](igTreeGrid-Features-Overview.html): このトピックでは、`igTreeGrid` コントロールで使用可能なモジュラー機能の基本について説明します。 
-   [フィルタリング (igTreeGrid)](igTreeGrid-Filtering.html): このトピックでは、`igTreeGridFiltering` による階層データの操作方法を説明します。

### このトピックの内容

- [**概要**](#introduction)
	- [要求フォーマット](#request-format)
- [**機能固有の詳細**](#features)
    - [リモート フィルタリング](#filtering)
    - [リモートで並べ替え](#sorting)
    - [リモート ページング](#paging)
- [**関連コンテンツ**](#related-content)
    - [トピック](#topics)
    - [サンプル](#samples)

## <a id="introduction"></a> 概要

リモート機能を使用してツリー グリッドをセットアップする場合、データ操作に AJAX 要求を使用します。ページングのようなリモート機能は、最初に `igTreeGrid` をデータ全体にバインドせずに非常に大きなセットを扱うことができるため、パフォーマンスが大きく向上します。また、中間状態でのサーバー側コントロールにより、操作の結果に対して完全なカスタム ロジックを適用できます。 

リモート操作を実行できる機能として、**並べ替え**、**フィルタリング**、**ページング**がサポートされています。

> 注: 現時点でこれらのリモート操作は、グリッドのリモート AJAX 要求で送信されたパラメーターに基づき、サーバー側でデータを操作することにより手動で処理する必要があります。


### <a id="request-format"></a> 要求フォーマット

すべての機能は、追加データの要求に対して同じ [`dataSourceUrl`](%%jQueryApiUrl%%/ui.igtreegrid#options:dataSourceUrl) エンドポイント アドレス ([ロード オン デマンド](igTreeGrid-Load-On-Demand.html) でも使用) を共有します。すなわち、複数のリモート機能のバックエンド実装は、提供されたパラメーターを読み込むことにより要求の複数のスタイルを処理できる必要があります。

バックエンドで要求を処理する場合、操作の論理的順序を維持することが重要です。たとえば、フィルタリング データの変換を最初に適用して、次に必要に応じて並べ替えをし、要求されたページ サイズに結果を切り取ります。

**C# の場合:**
```csharpcsharp
private IQueryable GetProcessedData(TreeGridModel gridModel)
{
	IQueryable queryableData = (IQueryable)gridModel.DataSource;
	NameValueCollection queryString = this.HttpContext.Request.QueryString;
	TreeGridProcessDataHelper helper = new TreeGridProcessDataHelper();
	
	foreach (string key in queryString.Keys)
	{
		if (key.Contains("filter"))
		{
			// handle filtering
			queryableData = helper.TransformFilterData(queryString, gridModel);
		}
		if (key.Contains("sort"))
		{
			// handle sorting
			queryableData = helper.TransformSortData(queryString, gridModel);
		}
		if (key.Contains("pageSize"))
		{
			// handle paging
			queryableData = helper.TransformPagingData(queryString, gridModel, queryableData);
		}
	}
	return queryableData;
}
```

## <a id="features"></a> 機能固有の詳細

固有なパラメーターに加えて、データ全体への直接アクセスなしで機能が正しく動作するためには、返されるデータにも固有な要件があります。また、各機能はローカル操作用またはリモート操作用に個別に構成できますが、データの限定されたサブセット (ページ) に対するローカル機能の動作は、ユーザーの期待する動作と異なる場合があります。その理由から、リモート改ページが関係する多くの場合で、その他の操作も同じくリモートで処理されます。

### <a id="filtering"></a> リモート フィルタリング

[`type`](%%jQueryApiUrl%%/ui.igtreegridfiltering#options:type) 機能オプションを `'remote'` に設定することにより、リモート操作を有効にします。フィルタリングのためのデータ要求では、少なくとも 1 つの `filter(<property>)` スタイル パラメーターを指定します。Advanced [`mode`](%%jQueryApiUrl%%/ui.igtreegridfiltering#options:mode) が有効な場合、`filterLogic` 条件付き演算子は、基準がすべて一致する必要がある ("AND")、またはいずれか 1 つで充分である ("OR") の指定も送信します。コードは以下のようになります。

```
http://<SERVER>/treegrid/GetTreeData?filter(LastName)=contains(ski)&filter(HireDate)=before(1425340800000)&filterLogic=AND
```
可能な条件の完全なリストは、[API の使用 (igGrid Filtering)](igGrid-Filtering.html#api) のトピックを参照してください。簡易モードでは、基準ロジックをユーザーが制御することはなく、静的であるため (通常、デフォルトは条件付き AND)、`filterLogic` パラメーターは省略されます。通常、サーバー側は初期ツリー グリッド モデルを確認するために、それに対してアクセスします。

応答のためのデータを準備する場合、データのどの部分が実際に一致するかフィルタリングする際の処理を [`matchFiltering`](%%jQueryApiUrl%%/ui.igtreegridfiltering#options:matchFiltering) プロパティで設定しておく必要があります。また、初期モデルの定義済み表示モードとレベル制限にも従う必要があります。

**関連トピック:** [リモート フィルタリング (igGrid)](igGrid-Filtering.html#remote)

### <a id="sorting"></a> リモートで並べ替え

[`type`](%%jQueryApiUrl%%/ui.ui.igtreegridsorting#options:type) 機能オプションを `'remote'` に設定することにより、リモート操作を有効にします。AJAX 要求は少なくとも 1 つの `sort(<propertyName>)` スタイル パラメーターを持ち ([`mode`](%%jQueryApiUrl%%/ui.igtreegridsorting#options:mode) に応じて)、各オブジェクト プロパティの並べ替え方向を昇順または降順のいずれかに定義します。

```
http://<SERVER>/treegrid/GetTreeData?sort(Email)=asc&sort(Title)=desc
```

**関連トピック:** [リモートで並べ替え (igGrid)](igGrid-Sorting-Overview.html#remote)

### <a id="paging"></a> リモート ページング

[`type`](%%jQueryApiUrl%%/ui.igtreegridpaging#options:type) 機能オプションを `'remote'` に設定することにより、リモート操作を有効にします。リモート ページング操作は、2 つのメイン パラメーターを使用します。ユーザーが要求する `page` インデックスと、`pageSize` により設定されるページあたりの行数です。

```
http://<SERVER>/treegrid/GetTreeData?page=1&pageSize=3
```
リモート ページングを伴うすべての要求で、クライアント側ウィジェットがユーザーのピックできるページ数を決定できるように、`"TotalRecordsCount"` フィールドを提供しなければなりません。

```csharp
public JsonResult GetTreeData()
{
	TreeGridModel gridModel = GetRemoteTreeGridModel();
    IQueryable<EmployeeData> allData = RepositoryFactory.GetHierarchicalEmployeeData().AsQueryable();
	gridModel.DataSource = allData.AsQueryable();
	TreeGridPaging paging = (TreeGridPaging)gridModel.Features.Find(x => x.Name == "Paging");

	IQueryable data = GetProcessedData(gridModel);

	JsonResult result = new JsonResult();
	result.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
	result.Data = new ResultData() { Records = data, TotalRecordsCount = paging.TotalRecordsCount };
	return result;
}
```
**関連トピック:** [リモート ページング (igGrid)](igGrid-Paging.html#remote)

## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック
-   [機能の概要 (igTreeGrid)](igTreeGrid-Features-Overview.html): このトピックでは、`igTreeGrid` コントロールで使用可能なモジュラー機能の基本について説明します。 

### <a id="samples"></a> サンプル
- [igTreeGrid リモート機能](%%SamplesUrl%%/tree-grid/remote-features)
