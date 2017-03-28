<!--
|metadata|
{
    "fileName": "iggrid-unboundcolumns-populating-with-data-locally",
    "controlName": "igGrid",
    "tags": ["API","Grids"]
}
|metadata|
-->

# 非バインド列をローカルに生成 (igGrid)

## トピックの概要

### 目的

このトピックは、クライアント上で非バインド列の値を設定する方法をコード例を用いて示します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [非バインド列の概要](igGrid-UnboundColumns-Overview.html): このトピックでは、`igGrid` の非バインド列機能の概要について説明します。

- [列を非バインドとして設定 (igGrid)](igGrid-UnboundColumns-Setting-Column-as-Unbound.html): このトピックでは、クライアント側およびサーバー側で `igGrid` に非バインド列を設定する方法を示します。これには、JavaScript と ASP.NET のコード スニペットが含まれます。

- [非バインド列の生成の概要 (igGrid)](igGrid-UnboundColumns-Populating-with-Data-Overview.html): このトピックは、非バインド列にデータを生成する方法の概念的な概要を示し、オプション (ローカル/リモート) を簡単に説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [非バインド列のデータをローカルで生成 - 概要](#overview)
-   [コード例](#code-examples)
-   [unboundValues プロパティで非バインド列を生成 (コード例)](#unboundValues)
-   [setUnboundValues メソッドで非バインド列を生成 (コード例)](#setUnboundValues)
-   [dataBound イベントを介して非バインド列に生成 (コード例)](#dataBound-event)
-   [setCellValue メソッドを介して非バインド列に生成 (コード例)](#setCellValue)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)



## <a id="overview"></a> 非バインド列のデータをローカルで生成 - 概要

`igGrid` は、デフォルトで非バインド列をサポートしますが、これを設定する必要があります。この操作は、グリッドの有効期間によって異なります。

非バインド列の値を設定するには||以下を実行します。
--- | ------- | ------- 
グリッドの初期化コードにおいて|値が既知の場合|`unboundValues` プロパティを使用します。
 | 値を計算する必要がある場合 | `dataBound` イベントを使用します。列の formula プロパティを使用します。詳細は、「[非バインド列の計算値をレンダリングする](igGrid-UnboundColumns-Rendering-Calculated-Values.html)」トピックを参照してください。 
実行時|複数の値を設定するには|`setUnboundValues` メソッドを使用します。
 | 単一の値を設定するには | `setCellValue` メソッドを使用します。





## <a id="code-examples"></a> コード例

以下の表は、このトピックで使用したコード例をまとめたものです。

- [unboundValues プロパティで非バインド列を生成](#unboundValues): 列の `unboundValues` プロパティを使用して非バインド列にグリッド初期化コード内の値を生成する方法を示します。

- [setUnboundValues メソッドで非バインド列を生成](#setUnboundValues): `setUnboundValues` メソッドを使用して非バインド列にランタイム時の値を生成する方法示します。

- [dataBound イベントを使用して非バインド列に生成](#dataBound-event): グリッドの `dataBound` イベントで計算することにより非バインド列で値を生成する方法を示します。

- [setCellValue メソッドを介して非バインド列を生成](#setCellValue): グリッドのアップデート `setCellValue` メソッドを使用してランタイム時の非バインド列のセル値を生成する方法を示します。





## <a id="unboundValues"></a> unboundValues プロパティで非バインド列を生成 (コード例)

列の [`unboundValues`](%%jQueryApiUrl%%/ui.iggrid#options:columns.unboundValues) プロパティを使用してグリッドの初期化時に既知の値で初期化できます。一般的なシナリオは、`igGrid` で外部データ ソースからのデータを統合する必要がある場合です。

> **注:** 値の配列長さがデータ行のカウントより短い場合、残りのセルは空のままになります。

### コード

以下のコードでは、サンプルの `userAccounts` 配列にバインドされる `igGrid` インスタンスを作成し、キー  `AccountIsLocked` で非バインド列を構成して `unboundValues` プロパティからの値を提供します。

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
            headerText: "Account is Locked",
            key: "AccountIsLocked",
            dataType: "bool",
            unbound: true,
            unboundValues: [true, false, true]
        }
    ]
});
```



## <a id="setUnboundValues"></a> setUnboundValues メソッドで非バインド列を生成 (コード例)

[`setUnboundValues`](%%jQueryApiUrl%%/ui.iggrid#methods:setUnboundValues) メソッドを使用して、グリッドを初期化しデータにバインドした後、ランタイム時の列値を設定できます。一般的なシナリオは、`igGrid` で非同期に外部データ ソースからのデータを統合する必要がある場合です。

注: 値の配列長さがデータ行のカウントより短い場合、残りのセルは空のままになります。グリッドは、値の設定後に非バインド列を再描画します。これは、グリッドを再バインドも再描画もしません。

### コード

以下のコードは、サンプルの `userAccounts` 配列にバインドされる `igGrid` インスタンスを作成し、キー  `AccountIsLocked` で非バインド列を構成して `setUnboundValues` メソッドにより実行時に値を提供します。

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
            headerText: "Account is Locked",
            key: "AccountIsLocked",
            dataType: "bool",
            unbound: true
        }
    ]
});
var lockedUserAccounts = [true,false,true];
$("#grid").igGrid("setUnboundValues", "AccountIsLocked", lockedUserAccounts);
```


## <a id="dataBound-event"></a> dataBound イベントを介して非バインド列に生成 (コード例)

グリッドの [`dataBound`](%%jQueryApiUrl%%/ui.iggrid#events:dataBound) イベントを使用して、別の列値から計算された列値を設定できます。

### コード

以下のコードは、サンプルの employees にバインドされる `igGrid` インスタンスを作成し、キー `FullName` を使用して非バインド列を構成し、 `FirstName` 列と `LastName` 列を連結することによりグリッドの `dataBound` イベント内の値を計算します。

**JavaScript の場合:**

```js
var employees = [
    {FirstName: "Nancy", LastName: "Davolio"},
    {FirstName: "Andrew", LastName: "Fuller"},
    {FirstName: "Janet", LastName: "Leverling"}
];
$("#grid").igGrid({
    dataSource: employees,
    autoGenerateColumns: false,
    localSchemaTransform: false,
    columns: [
        { 
            headerText: "Full Name",
            key: "FullName",
            dataType: "string",
            unbound: true
        }
    ],
    dataBound: function (evt, ui) {
        var i, grid = ui.owner,
            data = grid.dataSource.data();
        for (i = 0; i < data.length; i++) {
          data[i]["FullName"] = 
            data[i]["FirstName"] + ' ' + data[i]["LastName"];
        }
    }
});
```



## <a id="setCellValue"></a> setCellValue メソッドを介して非バインド列に生成 (コード例)

[`setCellValue`](%%jQueryApiUrl%%/ui.iggridupdating#methods:setCellValue) メソッドを使用してランタイム時の単一のセル値を設定できます。一般的なシナリオには、アップデート機能の有効化が含まれます。行を追加または更新する場合、その非バインド列は計算する必要があります。

### コード

以下のコードは、サンプルの products 配列にバインドされる `igGrid` インスタンスを作成し、 `TotalPrice` キーを使用して非バインド列を構成し、新しい行を追加または更新する場合にランタイム時の値を計算します。

**JavaScript の場合:**

```js
var products = [
    {ProductID: 1, UnitPrice: 4.1, VAT: 0.2}, 
    {ProductID: 2, UnitPrice: 4.1, VAT: 0.2}, 
    {ProductID: 3, UnitPrice: 4.1, VAT: 0.2}
];
$("#grid").igGrid({
    dataSource: products,
    autoGenerateColumns: false,
    primaryKey: "ProductID",
    columns: [
        { key: "ProductID", dataType: "number" },
        { key: "VAT", dataType: "number" },
        { key: "UnitPrice" },
        { 
            headerText: "Total Price",
            key: "TotalPrice",
            dataType: "number",
            unbound: true
        }
    ],
    features: [
        {
            name: "Updating",
            mode: "row",
            editRowEnded: function (evt, ui) {
                var totalPrice = ui.values["UnitPrice"] * (1 + ui.values["VAT"]);
                ui.owner.setCellValue(ui.rowID, "TotalPrice", totalPrice);
            }
        }
    ]
});
```


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [非バインド列をリモートに生成 (igGrid)](igGrid-UnboundColumns-Populating-with-Data-Remotely.html): このトピックでは、サーバー上で非バインド列の値を設定する方法をコード例を用いて示します。

- [非バインド列の計算値をレンダリングする](igGrid-UnboundColumns-Rendering-Calculated-Values.html): このトピックは、非バインド列の値を計算するために関数式を設定する方法をコード例を用いて示します。

- [非バインド列の使用時にグリッドのパフォーマンスを最適化](igGrid-UnboundColumns-Optimize-Performance.html): このトピックでは、クライアントベースとサーバーベースの非バインド列の統合とそれぞれの最適化について説明します。また、統合が行われる場合に開発者がプログラム的に制御する方法を示します。




 

 


