<!--
|metadata|
{
    "fileName": "iggrid-unboundcolumns-setting-column-as-unbound",
    "controlName": "igGrid",
    "tags": ["Grids","How Do I"]
}
|metadata|
-->

# 列を非バインドとして設定 (igGrid)

## トピックの概要

### 目的

このトピックでは、クライアント側およびサーバー側で igGrid™ に非バインド列を設定する方法を示します。これには、JavaScript と ASP.NET のコード スニペットが含まれます。

### 前提条件

このトピックを理解するためには、以下のトピックを理解しておく必要があります:

- [非バインド列の概要 (igGrid)](igGrid-UnboundColumns-Overview.html): このトピックは、`igGrid` の非バインド列機能およびこの機能が提供する機能性について概念的に説明します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [非バインド列 - 概要](#overview)
-   [コード例](#code-examples)
-   [JavaScript で非バインドとして列を設定 (コード例)](#js)
-   [ASP.NET MVC で非バインドとして列を設定 (コード例)](#mvc)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)



## <a id="overview"></a> 列を非バインドとして設定 - 概要

`igGrid` は、デフォルトでは非バインド列をサポートしていませんが、これを構成する必要があります。これは、JavaScript と ASP.NET MVC では異なります。

列を非バインドとして設定するには|以下を実行します。
---|---
JavaScript ファイル|グリッドの `columns` の配列に新規列を定義し、`unbound` プロパティを true に追加します。
ASP.NET MVC|`GridColumnBuilder` オブジェクト上で Unbound 列を呼び出し列に対してキーとして使用される文字列を渡します。



## <a id="code-examples"></a> コード例

以下の表は、このトピックで使用したコード例をまとめたものです。

- [JavaScript で非バインドとして列として設定](#js): この例は、データ値を提供する関数式で `igGrid` に非バインド列を構成します。

- [ASP.NET MVC で非バインドとして列を設定](#mvc): この例は、ASP.NET MVC で非バインド列を構成します。非バインド列値は、`UnboundValues` メソッドへの呼び出しにより提供されます。



## <a id="js"></a> JavaScript で非バインドとして列を設定 (コード例)

[`unboundValues`](%%jQueryApiUrl%%/ui.iggrid#options:columns.unboundValues) プロパティを使用することにより、グリッドの初期化の一部として非バインド列値を設定します。このシナリオでは、非バインド列値はグリッドの初期化時にすでに使用可能でなければなりません。非バインド値は非バインド列では連続して生成し、そのためグリッド データの順序と`unboundValues` データの順序が一致しなければならないという点にご注意ください。

注: 「[非バインド列をローカルで生成 (igGrid)](igGrid-UnboundColumns-Populating-with-Data-Locally.html)」トピックで取り扱われるクライアント上に非バインド列値を設定する方法は他にもあります。

### コード

以下のコードでは、サンプルの `userAccounts` 配列にバインドされる `igGrid` インスタンスを作成し、キー DomainName で非バインド列を構成して `unboundValues` プロパティにより値を与えます。

**JavaScript の場合:**

```js
var userAccounts = [
    {UserAccountId: 1, UserId: 1, UserName: "nancyd"},
    {UserAccountId: 2, UserId: 2, UserName: "andrewf"},
    {UserAccountId: 3, UserId: 3, UserName: "janetl"}
];
$("#grid").igGrid({
    dataSource: userAccounts,
    autoGenerateColumns: false,
    columns: [
        {key: "UserAccountId", headerText: "UserAccountId"},
        {key: "UserName", headerText: "UserName"},
        { 
            headerText: "Domain Name",
            key: "DomainName",
            dataType: "string",
            unbound: true,
            unboundValues: ["examplenancyd", "exampleandrewf", "examplejanetl"]
        }
    ]
});
```


## <a id="mvc"></a> ASP.NET MVC で非バインドとして列を設定 (コード例)

以下のコードは、ビューモデルとして定義されるカスタム Employee オブジェクト コレクションにバインドされる `igGrid` インスタンスを作成します。非バインド列値は、`UnboundValues` メソッドへの呼び出しにより提供されます。`UnboundValues` 属性は `EmployeeFullName` と呼ばれる `ViewData` 変数で、`List<object>` インスタンスであり、連結値 `FirstName` と `LastName` を保持します。

> **注:** 「[非バインド列をリモートで生成 (igGrid)](igGrid-UnboundColumns-Populating-with-Data-Remotely.html)」トピックで説明されていますがサーバー上に非バインド列値を設定する方法は他にもあります。

### コード

以下のコードは、ビューモデルとして定義されるカスタム Employee オブジェクト コレクションにバインドされる `igGrid` インスタンスを作成します。非バインド列値は、`UnboundValues` メソッドへの呼び出しにより供給されます。`UnboundValues` 属性は EmployeeFullName と呼ばれる `ViewData` 変数で、`List<object>` インスタンスであり、連結値 `FirstName` と `LastName` を保持します。

`UnboundValues` メソッドの操作内容は、列の `unboundValues` プロパティでデータをシリアル化することです。

モデル:

**C# の場合:**

```csharp
namespace UnboundColumns.Models
{
    public class Employee
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
```

これは、`FirstName` と `LastName` という 2 つのフィールドを含む非常にシンプルな Employee モデルです。

ビュー:

**ASPX の場合:**

```csharp
@using Infragistics.Web.Mvc
@model IQueryable<UnboundColumns.Models.Employee>
@(Html.Infragistics().Grid(Model)
.AutoGenerateColumns(false)
.ID("grid1")
.Columns(column =>
    {
        column.Unbound("FullName").UnboundValues((List<object>)ViewData["EmployeeFullName"]);
    }
)
.DataBind()
.Render())
```

View はモデル `IQueryable<UnboundColumns.Models.Employee>` で厳密に型指定されています。%%ProductNameMVC%% Grid は、このモデルを使用してデータをバインドします。コードは、キー `FullName` を持つ 1 つの非バインド列でグリッドを構成し、キー `EmployeeFullName` を持つ `ViewData` 変数で値を提供します。

コントローラー:

**C# の場合:**

```csharp
public class HomeController : Controller
{
    public ActionResult Index()
    {
        List<object> employeeFullName = new List<object>();
        List<Employee> employees = this.GetEmployees();
        foreach (Employee emp in employees)
        {
            employeeFullName.Add(emp.FirstName + " " + emp.LastName);
        }
        ViewData["EmployeeFullName"] = employeeFullName;
        return View(employees.AsQueryable());
    }
    private List<Employee> GetEmployees()
    {
        List<Employee> employees = new List<Employee>()
        {
            new Employee() { FirstName = "Nancy", LastName = "Davolio" },
            new Employee() { FirstName = "Andrew", LastName = "Fuller" },
            new Employee() { FirstName = "Janet", LastName = "Leverling" }
        };
        return employees;
    }
}
```

コントローラーには 2 つのメソッドが含まれます。`GetEmployees` メソッドは Employee オブジェクトのリストを返し、サンプル データのデータ ソースとして使用され、Index アクション メソッドは各従業員の `FirstName` と `LastName` データを連結することにより `ViewData["EmployeeFullName"]` 変数を構築して従業員データをビューへ戻すために使用されます。


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

以下のトピックでは、このトピックに関連する追加情報を提供しています。

- [非バインド列での作業 (igGrid)](igGrid-UnboundColumns-Working-with-LandingPage.html): このトピックのグループは、クライアント上とサーバー上で非バインド列にデータを生成する方法について説明します。


 


