<!--
|metadata|
{
    "fileName": "iggrid-enabling-and-configuring-virtualization",
    "controlName": "igGrid",
    "tags": []
}
|metadata|
-->

# 仮想化の有効化と構成 (igGrid)

## トピックの概要

### 目的

このトピックは、コード例を示して、`igGrid`™ で仮想化機能を有効化して構成する方法を説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**仮想化を有効にする方法の概要**](#overview)
-   [**仮想化の構成 - 概要**](#configuring)
-   [**固定仮想化の有効化と構成**](#fixed)
	-   [行の高さと列の幅の構成](#fixed-configuring-rows-columns)
    -   [プロパティ設定](#fixed-property-settings)
    -   [例](#fixed-example)
-   [**連続仮想化の有効化と構成**](#continuous)
    -   [プロパティ設定](#continuous-property-settings)
    -   [例](#continuous-example)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)


## <a id="overview"></a> 仮想化を有効にする方法の概要

仮想化は [`virtualization`](%%jQueryApiUrl%%/ui.iggrid#options:virtualization) プロパティを true に設定することで有効になります。仮想化のタイプは、[`virtualizationMode`](%%jQueryApiUrl%%/ui.iggrid#options:virtualizationMode) プロパティを fixed または continuous に設定して指定します。

仮想化をタイプの指定をせずに有効化すると、Fixed (仮想化タイプのデフォルト) に設定されます。

仮想化機能はグリッドで高さが定義されていなければ動作しません。



## <a id="configuring"></a> 仮想化の構成 - 概要 

次の表は、仮想化が構成されるいろいろな側面をリストしたもので、それらを管理するためのプロパティがそれらにマップされます。

<table class="table table-striped">
	<thead>
		<tr>
            <th>
仮想化タイプ
			</th>
            <th>
構成可能な項目
			</th>
            <th>
プロパティ
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
固定仮想化
			</td>
            <td>
全/列/行仮想化
			</td>
            <td>
                <ul>
                    <li>
[virtualization](%%jQueryApiUrl%%/ui.iggrid#options:virtualization)
					</li>
                    <li>
[virtualizationMode](%%jQueryApiUrl%%/ui.iggrid#options:virtualizationMode)
					</li>
                    <li>
[rowVirtualization](%%jQueryApiUrl%%/ui.iggrid#options:rowVirtualization)
					</li>
                    <li>
[columnVirtualization](%%jQueryApiUrl%%/ui.iggrid#options:columnVirtualization)
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td></td>
            <td>
行の高さ
			</td>
            <td>
                <ul>
                    <li>
[height](%%jQueryApiUrl%%/ui.iggrid#options:height)
					</li>

                    <li>
[avgRowHeight](%%jQueryApiUrl%%/ui.iggrid#options:avgRowHeight)
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td></td>
            <td>
列の幅
			</td>
            <td>
                <ul>
                    <li>
[avgColumnWidth](%%jQueryApiUrl%%/ui.iggrid#options:avgColumnWidth)
					</li>
                    <li>
[width](%%jQueryApiUrl%%/ui.iggrid#options:width)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>




## <a id="fixed"></a> 固定仮想化の有効化と構成

固定仮想化は、`igGrid` コントロールの仮想化オプションを true に設定し、仮想化モードを Fixed にすることで有効化します。これにより、行と列の仮想化が有効になります。あるいは、該当するプロパティ ([`rowVirtualization`](%%jQueryApiUrl%%/ui.iggrid#options:rowVirtualization) または [`columnVirtualization`](%%jQueryApiUrl%%/ui.iggrid#options:columnVirtualization)) を true に設定して行または列のみを仮想化することもできます。

行の幅の指定は必須です。列仮想化を使用する場合、列の幅とグリッドの全体の幅も定義する必要があります。

行仮想化を使用する場合、すべての行の高さは同じです。行の高さを正しく設定しないと、最後の行がグリッドから切り落とされる (表示されない) 可能性があります。列仮想化を使用するとき列幅でも同じ問題が発生します。このため、行仮想化の行の高さプロパティおよび列仮想化の列幅プロパティを手動で設定する必要があります。正しい値は、それぞれ平均行高さおよび平均行幅を計算して決定します。詳細は、「行の高さと列の幅の構成」を参照してください。

### <a id="fixed-configuring-rows-columns"></a> 行の高さと列の幅の構成 

行の高さと列の幅は、それぞれ `avgRowHeight` および `avgColumnWidth` プロパティで管理します。

`avgRowHeight` プロパティは、グリッドの各表示行の高さを決定します。

`avgRowHeight` プロパティは、グリッドの各表示列の幅を決定します。

一般則として、常に `avgRowHeight` をグリッドの高さの値で均等に分割できる値に設定します。固定仮想化の構成で重要な点として、`avgRowHeight` プロパティの値の決定プロセスがあります。デフォルトでは、グリッドはほとんどのデータ ソースで機能する妥当な行高さを設定しようとします。

例:

グリッド高さ: 600px => `avgRowHeight`: 30, または 15, または 60。

右端での折り返しを行うには、`avgRowHeight` の値を大きめにする必要があるでしょう。

列仮想化を使用する場合、`avgColumnWidth` を `avgRowHeight` として計算する必要があります。

### <a id="fixed-property-settings"></a> プロパティ設定

以下の表は、要求ビヘイビアーをプロパティ設定にマップしています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
仮想化を有効にする|[virtualization](%%jQueryApiUrl%%/ui.iggrid#options:virtualization)|true
固定仮想化を有効化|[virtualizationMode](%%jQueryApiUrl%%/ui.iggrid#options:virtualizationMode)|fixed
グリッドの高さを設定|[height](%%jQueryApiUrl%%/ui.iggrid#options:height)|グリッドの高さ (ピクセル)
行仮想化を有効化 (オプション)|[rowVirtualization](%%jQueryApiUrl%%/ui.iggrid#options:rowVirtualization)|true
行の高さを設定 (オプション)|[avgRowHeight](%%jQueryApiUrl%%/ui.iggrid#options:avgRowHeight)|行の高さの計算値 (ピクセル)
列仮想化を有効化 (オプション)|[columnVirtualization](%%jQueryApiUrl%%/ui.iggrid#options:columnVirtualization)|true
グリッド幅を設定 (columnVirtualizaton のみ)|[width](%%jQueryApiUrl%%/ui.iggrid#options:width)|グリッド幅 (ピクセル)
列幅を設定 (オプション)|[avgColumnWidth](%%jQueryApiUrl%%/ui.iggrid#options:avgColumnWidth)|列幅の計算値 (ピクセル)


### <a id="fixed-example"></a> 例

以下の表は、行の高さ 400 ピクセルで行と列の固定仮想化を構成する方法を示します。

プロパティ|値
---|---
[virtualization](%%jQueryApiUrl%%/ui.iggrid#options:virtualization)|true
[virtualizationMode](%%jQueryApiUrl%%/ui.iggrid#options:virtualizationMode)|fixed
[height](%%jQueryApiUrl%%/ui.iggrid#options:height)|400px


#### コード

次のコードは、例 における設定を構成するものです。

**JavaScript の場合:**

```js
$("#grid1").igGrid({
        virtualization: true,
        virtualizationMode: 'fixed',
        height: '400px'
});
```

**ASPX の場合:**

```csharp
<%=Html.Infragistics().Grid(Model).ID("grid1").LoadOnDemand(false).AutoGenerateColumns(false).AutoGenerateLayouts(false).PrimaryKey("ProjectID").Columns(column => 
    {
        column.For(x => x.ProjectID)
			.HeaderText(this.GetGlobalResourceObject("Grid", "ProjectID").ToString());
        column.For(x => x.Name)
			.HeaderText(this.GetGlobalResourceObject("Grid", "Name").ToString());
        column.For(x => x.StartDate)
			.HeaderText(this.GetGlobalResourceObject("Grid", "StartDate").ToString());
        column.For(x => x.EndDate)\
			.HeaderText(this.GetGlobalResourceObject("Grid", "EndDate").ToString());
    })
	.Virtualization(true)
	.VirtualizationMode(VirtualizationMode.Fixed)
}).DataBind().Height("400px").Render() %>
```

## <a id="continuous"></a> 連続仮想化の有効化と構成

igGrid コントロールの仮想化オプションを true に設定し、仮想化モードを continuous にすることで、仮想化が継続的になります。グリッドの高さは構成可能です。
> **注:** 列仮想化は連続仮想化でサポートされていません。

### <a id="continuous-property-settings"></a> プロパティ設定

以下の表は、要求ビヘイビアーをプロパティ設定にマップしています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
仮想化を有効にする|[virtualization](%%jQueryApiUrl%%/ui.iggrid#options:virtualization)|true
継続的な仮想化を有効にする|[virtualizationMode](%%jQueryApiUrl%%/ui.iggrid#options:virtualizationMode)|continuous
高さの設定|[height](%%jQueryApiUrl%%/ui.iggrid#options:height)|グリッドの高さ (ピクセル)


### <a id="continuous-example"></a> 例

次の表は、行の高さが 400 ピクセルの行と列に対し、継続的な仮想化を設定する方法を示します。

プロパティ|値
---|---
[virtualization](%%jQueryApiUrl%%/ui.iggrid#options:virtualization)|true
[virtualizationMode](%%jQueryApiUrl%%/ui.iggrid#options:virtualizationMode)|continuous
[height](%%jQueryApiUrl%%/ui.iggrid#options:height)|400px


![](images/igGrid_Enabling_and_Configuring_Virtualization_1.png)

#### コード
次のコードは、例 における設定を構成するものです。

**JavaScript の場合:**

```js
$("#grid1").igGrid({
        virtualization: true,
        virtualizationMode: 'continuous',
        height: '400px'
});
```

**ASPX の場合:**

```csharp
<%=Html.Infragistics().Grid(Model).ID("grid1").LoadOnDemand(false).AutoGenerateColumns(false).AutoGenerateLayouts(false).PrimaryKey("ProjectID").Columns(column => 
    {
        column.For(x => x.ProjectID)
			.HeaderText(this.GetGlobalResourceObject("Grid", "ProjectID").ToString());
        column.For(x => x.Name)
			.HeaderText(this.GetGlobalResourceObject("Grid", "Name").ToString());
        column.For(x => x.StartDate)
			.HeaderText(this.GetGlobalResourceObject("Grid", "StartDate").ToString());
        column.For(x => x.EndDate)\
			.HeaderText(this.GetGlobalResourceObject("Grid", "EndDate").ToString());
    })
	.Virtualization(true)
	.VirtualizationMode(VirtualizationMode.Continuous)
}).DataBind().Height("400px").Render() %>
```



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [仮想化の概要](igGrid-Virtualization-Overview.html): このトピックは、`igGrid` コントロールの仮想化機能を紹介します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [仮想化 (固定)](%%SamplesUrl%%/grid/virtualization-fixed): この例では、固定数の行を用いた `igGrid` のHTML 仮想化機能を説明します。

- [連続仮想化](%%SamplesUrl%%/grid/virtualization-continuous): このサンプルでは、`igGrid` コントロールの連続仮想化機能を紹介します。





 

 


