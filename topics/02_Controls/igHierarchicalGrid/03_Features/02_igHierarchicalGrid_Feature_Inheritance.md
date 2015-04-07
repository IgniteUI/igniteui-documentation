<!--
|metadata|
{
    "fileName": "ighierarchicalgrid-feature-inheritance",
    "controlName": "igHierarchicalGrid",
    "tags": ["Extending","Grids"]
}
|metadata|
-->

# 機能の継承 (igHierarchicalGrid)

## トピックの概要

### 目的
これは、igHierarchicalGrid™ の子レイアウトの機能を継承する方法を示します。

## このトピックの内容
このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [レイアウトの機能とプロパティを個別に定義する](#individually)
-   [継承を使用してレイアウトの機能とプロパティを定義する](#inheritance)
-   [継承により定義された機能とプロパティをカスタマイズする](#custom)
-   [関連トピック](#relTopics)

## <a id="introduction"></a> 概要
igHierarchicalGrid のレイアウト プロパティはフラット igGrid のレイアウト プロパティと同じです。しかし、これらのプロパティは `responseDataKey` などのいくつかの例外はありますが、デフォルトでは親レイアウトから子レイアウトには継承されていません。すべてのレイアウトのプロパティと機能を定義する必要があるのはこのためです。継承を使用して、機能は親レイアウトで 1 回だけ定義され、子レイアウトに伝達されます。

デフォルトでは、機能は継承されません。また、列設定は子レイアウトでは継承できません。これには、グリッドの列設定だけでなく、機能の列設定も含まれます。これらの設定はすべてのレイアウトで個別に定義する必要があります。

継承機能は、主にレイアウトが自動的に生成されている (`autoGenerateLayouts` が有効になっている) 場合に使用すると便利です。実際、この場合、子レイアウトの機能を持つ方法としては継承しかありません。これは、レイアウトの定義が見つからない場合、その機能も見つからないためです。

## <a id="individually"></a> レイアウトの機能とプロパティを個別に定義する 
以下のコード例は、階層の第 1 レベルにある子レイアウトの並べ替え機能を定義する方法を示しています。すべての子レイアウト内の他の機能を同様に定義できます。

**JavaScript の場合:**

```js
$("#grid1").igHierarchicalGrid({
    features: [
        {
            name: "Sorting",
            type: "remote"
        }
    ],
    autoGenerateLayouts: false,
    columnLayouts: [
    {
         features: [
         {
             name: "Sorting",
             type: "remote"
         }
       }    
    ]
});
```

## <a id="inheritance"></a> 継承を使用してレイアウトの機能とプロパティを定義する 
子レイアウトが複数ある場合は、すべての子レイアウトのプロパティと機能を個別に定義できますが、上記のブロック (「レイアウトの機能とプロパティを個別に定義する」) のコードにあるように機能が親レイアウトの機能と同じ場合、igHierarchicalGrid の継承機能を使用できます。親の継承を設定し (`inherit: true`) すべての子レイアウトに適用させます。

**JavaScript の場合:**

```js
$("#grid1").igHierarchicalGrid({
    features: [
        {
            name: "Sorting",
            type: "remote",
            inherit: true
        }
    ],
    autoGenerateLayouts: true
});
```

以下のコードは、igHierarchicalGrid MVC ラッパーを使用している場合に並べ替え機能を継承する方法を示しています。

**C# の場合:**

```csharp
<%=  Html.Infragistics()
    .Grid(Model)
    .ID("grid1")
    .Features(features =>
    {
        features.Sorting().Inherit(true);  
    }
    .Render()%>
```

## <a id="custom"></a> 継承により定義された機能とプロパティをカスタマイズする 
親グリッドの一部の機能を継承し、子グリッドで新しい設定を定義する場合があります。igHierarchicalGrid は両方のオプション セットを内部で結合し、いくつかのオプションが複製された場合、選択時に子レイアウトのカスタム オプションの優先度が高くなります。

## <a id="relTopics"></a>関連トピック 
以下は、その他の役立つトピックです。

- [igHierarchicalGrid の概要](igHierarchicalGrid-Overview.html)
- [igHierarchicalGrid の初期化](igHierarchicalGrid-Initializing.html)
- [igHierarchicalGrid プロパティ リファレンス](%%jQueryApiUrl%%/ui.ighierarchicalgrid#options)

 

 


