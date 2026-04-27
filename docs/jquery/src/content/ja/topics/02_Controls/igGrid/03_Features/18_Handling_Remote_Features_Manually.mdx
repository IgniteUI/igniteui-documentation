<!--
|metadata|
{
	"fileName": "handling-remote-features-manually",
	"controlName": "igGrid",
	"tags": ["Grids","How to"]
}
|metadata|
-->

# リモート機能を手動的に処理 (igGrid)

## このトピックの内容

- [概要](#overview)
- [リモート ページングの処理](#paging)
- [リモート フィルタリングの処理](#filtering)
- [リモートで並べ替え/グループ化の処理](#sorting)
- [リモート集計の処理](#summaries)
- [関連コンテンツ](#related-content)

## <a id="overview"></a> 概要

`igGrid` のリモート機能は、特定のリモート要求の処理と結果データを返すためにバックエンド実装を要求します。
以下の機能はリモート機能があります。
  - ページング
  - フィルタリング
  - 並べ替え
  - Groupby 
  - 集計

該当する機能の関連 **type** オプションで有効にできます。例:

```js
features: [
	{ name: "Paging", type: "remote" },
	{ name: "Sorting", type: "remote" },
	{ name: "Filtering", type: "remote" },
     ...
]
```

%%ProductNameMVC%% Grid を使用する際に、関連する `GridDataSourceActionAttribute` 操作を追加し、既定でこれらの機能が処理されることによってリモートが初期化されることを要求します。
操作フィルターの属性は、グリッド データを返す MVC 操作を修飾するために使用できます。
例:

```csharp
[GridDataSourceAction]
public ActionResult GetGridData()
{
     ...
  return View(quryableData);
}
```

さまざまなリモート グリッド機能によって受信した要求を処理し、グリッドへ処理済みの JSON を戻します。

> **注:** ビューでグリッドを構成する際に `GridDataSourceAction` 属性を使用します。`GridModel` クラスを使用してコントローラーのグリッドを構成する場合、`GridModel.GetData` インスタンス メソッドを使用してデータをブラウザーへ戻す必要があります。 

上記メソッドを使用してリモート機能を最大限に活用することをお勧めします。

MVC ラッパーへアクセスができない場合 (ASP.NET プロジェクトで %%ProductName%% を使用している場合など)、あるいはこれらの要求を処理するためにカスタム ロジックを構築する必要がある場合があります。
このトピックは手動で `igGrid` 機能を処理する手順について説明します。

## <a id="paging"></a> リモート ページングの処理

このセクションは、リモート ページングの構成および処理の手順について説明します。

手順:

1. クライアント側の構成
2. サーバー側の構成と要求の処理

### クライアント側の構成

以下の表は、リモート ページングに影響があるオプションを示します。

オプション|説明 | 必須 |
-------|-------------|---------|
[responseDataKey](%%jQueryApiUrl%%/ui.igGrid#options:responseDataKey) | これはデータ レコードが保持される応答内のプロパティです。|はい
[dataSource](%%jQueryApiUrl%%/ui.igGrid#options:dataSource)|`$.ig.DataSource` が受け入れる任意の有効なデータ ソース、または `$.ig.DataSource` 自体のインスタンスにすることができます。 | はい。バックエンドの url を設定してください。
[recordCountKey](%%jQueryApiUrl%%/ui.iggridpaging#options:recordCountKey) | データ ソース中のレコード総数を保持する応答内のプロパティです。|はい
[type](%%jQueryApiUrl%%/ui.iggridpaging#options:type) | ページングのタイプを設定します。 | はい。remote に設定してリモート ページングを有効にします。
[pageSizeUrlKey](%%jQueryApiUrl%%/ui.iggridpaging#options:pageSizeUrlKey) | 現在要求されているページ サイズを保持するエンコードされた URL パラメータの名前。 | いいえ。設定しない場合、OData 規則がデフォルトで使用されます。
[pageIndexUrlKey](%%jQueryApiUrl%%/ui.iggridpaging#options:pageIndexUrlKey) | 現在要求されているページ インデックスを保持するエンコードされた URL パラメータの名前。|いいえ。設定しない場合、OData 規則がデフォルトで使用されます。

構成の例:

```js
responseDataKey: "Records",
dataSource: "http://<server>/grid/GetData",
features: [
{ name: "Paging", type: "remote", recordCountKey: "TotalRecordsCount" }
]
```

例のページ要求によって生成される要求

```js
http://<server>/grid/GetData?$skip=0&$top=25
```

### サーバー側の構成

要求が送信されるバックエンドは以下を行います。

1. ページング情報を含むクエリ文字列パラメーターを読み込みます (`$skip` および `$top`)。
2. グリッドのデータを処理してパラメーターに基づいた現在のページのデータのみ取得します。
3. 処理済みのグリッド データおよびグリッド レコードの総数を含む JSON データを返します。例:

```js
{Records: <data>, TotalRecordsCount: totalCountOfAllRecords}
```
データを含むプロパティは、クライアント側で定義された `responseDataKey` オプションと一致する必要があります。また、合計数を保持するプロパティは、ページ機能の `recordCountKey` オプションと一致する必要があります。

以下の例は、ASP.NET MVC アプリケーションに上記手順を適用する方法です。

**C# の場合:**

```csharp
public JsonResult GetData() {
			IEnumerable<Order> orders = RepositoryFactory.GetOrderRepository().Get().Take(200);
			IQueryable data = orders.AsQueryable();
      int totalCount = data.Count();
      if (Request.QueryString["$top"] != null && Request.QueryString["$skip"] != null) {
				data = ApplyPaging(Request.QueryString, data);
			}

      JsonResult result = new JsonResult();
			result.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
			result.Data = new { Records = data, TotalRecordsCount = totalCount };
			return result;
}
private IQueryable ApplyPaging(NameValueCollection queryString, IQueryable data)
{
			int recCount = Convert.ToInt32(queryString["$top"]);
			int startIndex = Convert.ToInt32(queryString["$skip"]);

			data = data.Skip(startIndex).Take(recCount);
			return data;
}
```

## <a id="filtering"></a> リモート フィルタリングの処理

このセクションは、リモート フィルタリングの構成および処理の手順について説明します。

手順:

1. クライアント側の構成
2. サーバー側の構成と要求の処理

### クライアント側の構成

以下の表は、バックエンドからの応答を手動で処理する場合に設定する必要のある、リモート フィルタリングに影響するオプションの一覧です。

オプション|説明 | 必須 |
-------|-------------|---------|
[dataSource](%%jQueryApiUrl%%/ui.igGrid#options:dataSource)|`$.ig.DataSource` が受け入れる任意の有効なデータ ソース、または `$.ig.DataSource` 自体のインスタンスにすることができます。 | はい。リモート要求を処理するバックエンドの URL に設定します。
[type](%%jQueryApiUrl%%/ui.iggridfiltering#options:type) | フィルタリングのタイプを設定します。 | はい。remote に設定してリモート フィルタリングを有効にします。
[filterExprUrlKey](%%jQueryApiUrl%%/ui.iggridfiltering#options:filterExprUrlKey)|リモート要求に対してフィルタリングの式をエンコードする方法を指定する URL キー名。たとえば、`&filter('col') = startsWith`。デフォルトは OData です。|いいえ。設定しない場合、OData 規則がデフォルトで使用されます。

構成の例:

```js
dataSource: "http://<server>/grid/GetData",
features: [
{ name: "Filtering", type: "remote", filterExprUrlKey: "filter" }
...
]
```

例で設定したフィルタリング要求によって生成された要求。たとえば: 

```js
http://<server>/grid/GetData?filter(OrderID)=equals(10273)
```

### サーバー側の構成

要求が送信されるバックエンドは以下を行います。

1. フィルタリング情報を含むクエリ文字列パラメーターを読み込みます。
2. グリッドのデータを処理し、フィルタリングデータを返します。

以下の例は、ASP.NET MVC アプリケーションに上記手順を適用する方法です。

**C# の場合:**

```csharp

public JsonResult GetData() {
			IEnumerable<Order> orders = RepositoryFactory.GetOrderRepository().Get().Take(200);
			IQueryable data = orders.AsQueryable();
      var filterExprs = Request.QueryString.AllKeys.Where(x => x.Contains("filter"));
			if (filterExprs.Count() != 0)
			{
				data = ApplyFilterExpr(Request.QueryString, data);
			}
      JsonResult result = new JsonResult();
			result.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
			result.Data = data;
			return result;
}
private IQueryable ApplyFilterExpr(NameValueCollection queryString, IQueryable data)
{
			List<FilterExpression> exprs = GetFilterExpressions(queryString);
			StringBuilder builder = new StringBuilder();
			int count = 0;

			for (int i = 0; i < exprs.Count; i++)
			{
				if (count != 0 && count <= exprs.Count - 1)
				{
					builder.Append(exprs[i].Logic.ToLower() == "AND".ToLower() ? " AND " : " OR ");
				}
				count++;

				string condition = exprs[i].Condition;
				string expr = exprs[i].Expr;
				string colKey = exprs[i].Key;
				var dt = DateTime.Now;
				
				switch (condition.ToLower())
				{
					case "startswith":
						 builder.Append(colKey + ".StartsWith(\"" + expr + "\")");
						break;
					case "contains":
						 builder.Append(colKey + ".Contains(\"" + expr + "\")");
						break;
					case "endswith":
						 builder.Append(colKey + ".EndsWith(\"" + expr + "\")");
						break;
					case "equals":
						if (colKey == "ShipName") {
							//col type is string
							builder.Append(colKey + " == \"" + expr + "\"");
						}
						else
						{
							//col type is number
							builder.Append(colKey + " == " + expr);
						}
						
						break;
					case "doesnotequal":
						if (colKey == "ShipName")
						{
							//col type is string
							builder.Append(colKey + " != \"" + expr + "\"");
						}
						else
						{
							//col type is number
							builder.Append(colKey + " != " + expr);
						}
						break;
					case "doesnotcontain":
						 builder.Append("! " + colKey + ".Contains(\"" + expr + "\")");
						break;
					case "lessthan":
						 builder.Append(colKey + " < " + expr);
						break;
					case "greaterthan":
						 builder.Append(colKey + " > " + expr);
						break;
					case "lessthanorequalto":
						 builder.Append(colKey + " <= " + expr);
						break;
					case "greaterthanorequalto":
						 builder.Append(colKey + " >= " + expr);
						break;
					case "on":
						dt = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddMilliseconds(double.Parse(expr)).ToUniversalTime();
						 builder.Append("(" + colKey + ".Value.Day == " + dt.Day + " AND " + colKey +
							".Value.Year == " + dt.Year + " AND " +colKey + ".Value.Month == " + dt.Month + ")");
						break;
					case "noton":
						dt = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddMilliseconds(double.Parse(expr)).ToUniversalTime();
						 builder.Append("!("+colKey + ".Value.Day == " + dt.Day + " AND " + colKey +
							".Value.Year == " + dt.Year + " AND " + colKey + ".Value.Month == " + dt.Month + ")");
						break;
					case "after":
						dt = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddMilliseconds(double.Parse(expr)).ToUniversalTime();
						 builder.Append("((" + colKey + ".Value.Year > " + dt.Year + " OR (" +
							colKey + ".Value.Month > " + dt.Month + " AND " + colKey + ".Value.Year == " + dt.Year + ") OR (" +
							colKey + ".Value.Day > " + dt.Day + " AND " + colKey + ".Value.Year == " + dt.Year + " AND " +
							colKey + ".Value.Month == " + dt.Month + ")))");
						break;
					case "before":
						dt = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddMilliseconds(double.Parse(expr)).ToUniversalTime();
						builder.Append("((" + colKey + ".Value.Year < " + dt.Year + " OR (" +
									   colKey + ".Value.Month < " + dt.Month + " AND " + colKey + ".Value.Year == " + dt.Year + ") OR (" +
									   colKey + ".Value.Day < " + dt.Day + " AND " + colKey + ".Value.Year == " + dt.Year + " AND " +
									   colKey + ".Value.Month == " + dt.Month + ")))");
						break;
					case "today":
						builder.Append("(" + colKey + ".Value.Day == " + DateTime.Now.Day + " AND " + colKey +
						 ".Value.Year == " + DateTime.Now.Year + " AND " + colKey + ".Value.Month == " + DateTime.Now.Month + ")");
						break;
					case "yesterday":
						DateTime yesterday = DateTime.Now.AddDays(-1);
						builder.Append("(" + colKey + ".Value.Day == " + yesterday.Day + " AND " + colKey +
						 ".Value.Year == " + yesterday.Year + " AND " + colKey + ".Value.Month == " + yesterday.Month + ")");
						break;
					case "thismonth":
						builder.Append("(" + colKey + ".Value.Year == " + DateTime.Now.Year + " AND " + colKey + ".Value.Month == " + DateTime.Now.Month + ")");
						break;
					case "lastmonth":
						builder.Append("(" + colKey + ".Value.Year == " + (DateTime.Now.Year - 1) + " AND " + colKey + ".Value.Month == " + (DateTime.Now.Month - 1) + ")");
						break;
					case "nextmonth":
						builder.Append("(" + colKey + ".Value.Year == " + (DateTime.Now.Year - 1) + " AND " + colKey + ".Value.Month == " + (DateTime.Now.Month + 1) + ")");
						break;
					case "thisyear":
						builder.Append(colKey + ".Value.Year == " + DateTime.Now.Year);
						break;
					case "lastyear":
						builder.Append(colKey + ".Value.Year == " + (DateTime.Now.Year - 1));
						break;
					case "nextyear":
						builder.Append(colKey + ".Value.Year == " + (DateTime.Now.Year + 1));
						break;
					default:
						break;
				}
			}
			if (builder.Length > 0) {
				data = data.Where(builder.ToString(), new object[0]);
			}
		
			return data;
}

```

## <a id="sorting"></a> リモートで並べ替え/グループ化の処理

このセクションは、リモート並べ替えの構成および処理の手順について説明します。GroupBy に適用されるデータ操作はデータの並べ替えのみであるため、同じ手順が GroupBy に適用されます。

手順:

1. クライアント側の構成
2. サーバー側の構成と要求の処理

### クライアント側の構成

以下の表は、バックエンドからの応答を手動で処理する場合に設定する必要のある、リモート並べ替えに影響するオプションの一覧です。

オプション|説明 | 必須 |
-------|-------------|---------|
[dataSource](%%jQueryApiUrl%%/ui.igGrid#options:dataSource)|`$.ig.DataSource` が受け入れる任意の有効なデータ ソース、または `$.ig.DataSource` 自体のインスタンスにすることができます。 | はい。リモート要求を処理するバックエンドの URL に設定します。
[type](%%jQueryApiUrl%%/ui.iggridsorting#options:type) | 並べ替えのタイプを設定します。 | はい。remote に設定してリモート並べ替えを有効にします。
[sortUrlKey](%%jQueryApiUrl%%/ui.iggridsorting#options:sortUrlKey)|並べ替えの式を URL 内でエンコードする方法を指定する URL パラメーター名。例: ?sort(col1)=asc。|いいえ。設定しない場合、OData 規則がデフォルトで使用されます。
[sortUrlKeyAscValue](%%jQueryApiUrl%%/ui.iggridsorting#options:sortUrlKeyAscValue) | 昇順の並べ替えの URL パラメーター値。例: ?sort(col1)=asc。|いいえ。設定しない場合、OData 規則がデフォルトで使用されます。
[sortUrlKeyDescValue](%%jQueryApiUrl%%/ui.iggridsorting#options:sortUrlKeyDescValue)|降順の並び替えの URL パラメーター値。例: ?sort(col1)=desc.|いいえ。設定しない場合、OData 規則がデフォルトで使用されます。


構成の例:

```js
dataSource: "http://<server>/grid/GetData",
features: [
	{
		name: "Sorting",
		type: "remote",
		sortUrlKey: 'sort',
		sortUrlKeyAscValue: 'asc',
		sortUrlKeyDescValue: 'desc'
	}
...
]
```

例で設定した並べ替え要求によって生成された要求。たとえば:

```js
http://<server>/grid/GetData?sort(OrderID)=asc
```

### サーバー側の構成

要求が送信されるバックエンドは以下を行います。

1. 並べ替え情報を含むクエリ文字列パラメーターを読み込みます。
2. グリッドのデータを処理し、フィルタリングデータを返します。

以下の例は、ASP.NET MVC アプリケーションに上記手順を適用する方法です。

**C# の場合:**

```csharp
public JsonResult GetData() {
			IEnumerable<Order> orders = RepositoryFactory.GetOrderRepository().Get().Take(200);
			IQueryable data = orders.AsQueryable();
      var sortExprs = Request.QueryString.AllKeys.Where(x => x.Contains("sort"));
			if (sortExprs.Count() != 0) {
				data = ApplySorting(Request.QueryString, data);
			}
      JsonResult result = new JsonResult();
			result.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
			result.Data = data;
			return result;
}
private IQueryable ApplySorting(NameValueCollection queryString, IQueryable data)
		{
			List<SortExpression> sortExpressions = BuildSortExpressions(queryString, "sort", false);

			string orderBy = "OrderBy";
			string orderByDescending = "OrderByDescending";
			foreach (SortExpression expr in sortExpressions)
			{

				data = ApplyOrder(data, expr.Key, expr.Mode == SortMode.Ascending ? orderBy : orderByDescending);
				orderBy = "ThenBy";
				orderByDescending = "ThenByDescending";
			}
			return data;
			
		}
public List<SortExpression> BuildSortExpressions(NameValueCollection queryString, string sortKey, bool isTable)
{
			List<SortExpression> expressions = new List<SortExpression>();
			List<string> sortKeys = new List<string>();
			foreach (string key in queryString.Keys)
			{
				if (!string.IsNullOrEmpty(key) && key.StartsWith(sortKey))
				{
					SortExpression e = new SortExpression();
					e.Key = key.Substring(key.IndexOf("(")).Replace("(", "").Replace(")", "");
					e.Logic = "AND";
					e.Mode = queryString[key].ToLower().StartsWith("asc") ? SortMode.Ascending : SortMode.Descending;
					expressions.Add(e);
					sortKeys.Add(key);
				}
			}
			if (sortKeys.Count > 0 && isTable)
			{
				foreach (string sortedKey in sortKeys)
				{
					queryString.Remove(sortedKey);
				}
				string url = Request.Url.AbsolutePath;
				string updatedQueryString = "?" + queryString.ToString();
				Response.Redirect(url + updatedQueryString);
			}
			return expressions;
}
```

## <a id="summaries"></a> リモート集計の処理

このセクションは、リモート集計の構成および処理の手順について説明します。

手順:

1. クライアント側の構成
2. サーバー側の構成と要求の処理

### クライアント側の構成

以下の表は、バックエンドからの応答を手動で処理する場合に設定する必要のある、リモート集計に影響するオプションの一覧です。

オプション|説明 | 必須 |
-------|-------------|---------|
[responseDataKey](%%jQueryApiUrl%%/ui.igGrid#options:responseDataKey) | データ レコードが保持される応答内のプロパティ。|はい
[dataSource](%%jQueryApiUrl%%/ui.igGrid#options:dataSource)|`$.ig.DataSource` が受け入れる任意の有効なデータ ソース、または `$.ig.DataSource` 自体のインスタンスにすることができます。 | はいリモート要求を処理するバックエンドの URL に設定します。
[type](%%jQueryApiUrl%%/ui.iggridsummaries#options:type) | 集計のタイプを設定します。 | はい。remote に設定してリモート集計を有効にします。
[summariesResponseKey](%%jQueryApiUrl%%/ui.iggridsummaries#options:summariesResponseKey)|リモート データ ソースによって返された結果からデータを取得する結果キー。 | いいえ。デフォルトは "summaries" です。
[summaryExprUrlKey](%%jQueryApiUrl%%/ui.iggridsummaries#options:summaryExprUrlKey) | 集計の GET 要求にキーを設定します (タイプがリモートの場合にのみ使用)。 | いいえ。デフォルトは "summaries" です。

構成の例:

```js
dataSource: "http://<server>/grid/GetData",
responseDataKey: "Records",
features: [
	{ name: "Summaries", type:"remote"}
...
]
```

例で設定した集計要求によって生成された要求。たとえば:

```js
http://<server>/grid/GetData?summaries(OrderID)=count,min,max,sum,avg
```

### サーバー側の構成

要求が送信されるバックエンドは以下を行います。

1. 集計情報を含むクエリ文字列パラメーターを読み込みます。
2. グリッドのデータを処理し、集計を生成します。
3. 処理済みのグリッド データおよび計算済みの集計を含む JSON データを返します。例:

```
{
    Records: <data>,
    "Metadata": {
        "Summaries": {
            "OrderID": {
                "count": 100
            }
        }
    }
}
```

## <a id="related-content"></a> 関連コンテンツ

このトピックに関連する追加情報については、以下のトピックを参照してください。
-   [フィルタリング](igGrid-Filtering.html)
-   [ページング](igGrid-Paging.html)
-   [列の集計](igGrid-Column-Summaries.html)
-   [並べ替え](igGrid-Sorting.html)
-   [列のグループ化](igGrid-GroupBy.html)