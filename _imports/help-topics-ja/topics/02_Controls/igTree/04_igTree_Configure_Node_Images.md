<!--
|metadata|
{
    "fileName": "igtree-configure-node-images",
    "controlName": "igTree",
    "tags": ["Styling"]
}
|metadata|
-->

# igTree におけるノード イメージの構成

## トピックの概要
### 目的
このトピックでは、`igTree`™ コントロール ノード イメージを構成する方法を紹介します。

### このトピックの内容
このトピックは、以下のセクションで構成されます。

-   [**igTree 構成の概要**](#config-overview)
    -   [igTree の構成チャート](#config-chart)
-   [**ノード イメージを構成する**](#node-image)
    -   [ノード イメージの概要](#node-image-overview)
    -   [ノード イメージ設定](#node-image-settings)
-   [**関連トピック**](#related-topics)

### 前提条件
[「igTree を使用した作業の開始」](igTree-Getting-Started.html)というトピックを最初にお読みください。

## <a id="config-overview"></a>igTree 構成の概要 
### <a id="config-chart"></a>igTree の構成チャート 
以下の表は、`igTree` コントロールの構成可能な画面要素とビヘイビアーを示しています。

<table class="table table-bordered">
	<thead>
		<tr>
            <th>
構成可能な画面要素とビヘイビアー
			</th>

            <th>
構成の詳細
			</th>

            <th>
構成オプション
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
ノード イメージを構成する
			</td>

            <td>
画像は `igTree` コントロールの各ノードの次を表示するようバインディング、CSS、または URL で構成できます。
			</td>

            <td>
                <ul>
                    <li>
[parentNodeImageUrl](%%jQueryApiUrl%%/ui.igTree#options:parentNodeImageUrl)
					</li>

                    <li>
[parentNodeImageClass](%%jQueryApiUrl%%/ui.igTree#options:parentNodeImageClass)
					</li>

                    <li>
[leafNodeImageUrl](%%jQueryApiUrl%%/ui.igTree#options:leafNodeImageUrl)
					</li>

                    <li>
[leafNodeImageClass](%%jQueryApiUrl%%/ui.igTree#options:leafNodeImageClass)
					</li>

                    <li>
[imageUrlKey](%%jQueryApiUrl%%/ui.igTree#options:bindings.imageUrlKey)
					</li>

                    <li>
[imageUrlXPath](%%jQueryApiUrl%%/ui.igTree#options:bindings.imageUrlXPath)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

## <a id="node-image"></a>ノード イメージを構成する 
### <a id="node-image-overview"></a>ノード イメージの概要 
ノード イメージは `igTree` コントロール上に構成し、ノードの詳細情報を表示できます。これらの画像は各項目のバインディングから構成でき、CSS クラスまたは画像 URL を `igTree` コントロール オプションに設定することで親ノードと子ノード両方に表示できます。

 

![](images/igTree_Configure_Node_Images_Pic01.png)

### <a id="node-image-settings"></a>ノード イメージ設定 
以下の表は、オプション設定の推奨構成をマップしています。オプションは、`igTree` のオプションからアクセスされます。

目的|使用するオプション|それを次に設定...
---|---|---
[URL を使用して親ノードおよびリーフ ノードの画像を構成する](#example_configure_using_url)|[parentNodeImageUrl](%%jQueryApiUrl%%/ui.igTree#options:parentNodeImageUrl)<br>[leafNodeImageUrl](%%jQueryApiUrl%%/ui.igTree#options:leafNodeImageUrl)|string URL<br>string URL
[CSS を使用して親ノードおよびリーフ ノードの画像を構成する](#example_configure_using_css)|[parentNodeImageClass](%%jQueryApiUrl%%/ui.igTree#options:parentNodeImageClass)<br>[leafNodeImageClass](%%jQueryApiUrl%%/ui.igTree#options:leafNodeImageClass)|string CSS クラス名<br>string CSS クラス名
[バインディングにより個々のデータ項目のノード イメージを構成する](#example_configure_through_binding)|[imageUrlKey](%%jQueryApiUrl%%/ui.igTree#options:bindings.imageUrlKey)<br>(XML の場合)<br>[imageUrlXPath](%%jQueryApiUrl%%/ui.igTree#options:bindings.imageUrlXPath)|画像への URL がある string 型データ メンバー <br> XML にバインドされた場合の画像 URL への string 型 XPath


### <a id="example_configure_using_url"></a> 例: URL を使用して構成された親ノードおよびリーフ ノードの画像を構成する 

親ノードおよびリーフ ノードの画像を構成するには、URL を既存の画像の位置に指定する必要があります。以下の画像は、以下の設定を行った後のノード イメージを構成する方法を示しています。

<table class="table tale-bordered">
	<thead>
		<tr>
            <th>
オプション
			</th>

            <th>
設定
			</th>

            <th>
プレビュー
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
[parentNodeImageUrl](%%jQueryApiUrl%%/ui.igTree#options:parentNodeImageUrl)
			</td>

            <td>
"../../Content/images/DocumentsFolder.png"
			</td>

            <td rowspan="2">
![](images/igTree_Configure_Node_Images_Pic02.png)
			</td>
        </tr>

        <tr>
            <td>
[leafNodeImageUrl](%%jQueryApiUrl%%/ui.igTree#options:leafNodeImageUrl)
			</td>

            <td>
"../../Content/images/Documents.png"
			</td>
        </tr>
    </tbody>
</table>

### <a id="example_configure_using_css"></a> 例: CSS を使用して構成された親ノードおよびリーフ ノードの画像を構成する 

画像スプライトを使用して、CSS から画像を構成している場合、ツリー ノード イメージを含む CSS クラスを指定できます。以下のコードは、以下の設定を行った後のノード イメージを構成する方法を示しています。

オプション|設定
---|---
[parentNodeImageClass](%%jQueryApiUrl%%/ui.igTree#options:parentNodeImageClass)|"sprite-DocumentsFolder"
[leafNodeImageClass](%%jQueryApiUrl%%/ui.igTree#options:leafNodeImageClass)|"sprite-Documents"

>**注:** ツリー画像を正しく描画するには、CSS クラスを「display:inline-block」として定義する必要があります。

**HTML の場合:**

```html
<style type="text/css">
    .sprite-DocumentsFolder
    {
        background: url("../../Content/images/leafimages.png") no-repeat top left;
        display: inline-block;
        background-position: 0 -52px;
        width: 16px;
        height: 16px;
    }        
    .sprite-Documents
    {
        background: url("../../Content/images/leafimages.png") no-repeat top left;
        display: inline-block;
        background-position: 0 -26px;
        width: 16px;        
        height: 16px;
    }
 
</style>

<script type="text/javascript">
    $(function () {
        $("#tree").igTree({
            dataSource: data,
            parentNodeImageClass: "sprite-DocumentsFolder",
            leafNodeImageClass: "sprite-Documents",
            bindings: {
                textKey: 'Text',
                childDataProperty: 'Nodes'
            },
        });
</script>
```

**ASPX の場合:**

```csharp
<style type="text/css">
    .sprite-DocumentsFolder
    {
        background: url("../../Content/images/leafimages.png") no-repeat top left;
        display: inline-block;
        background-position: 0 -52px;
        width: 16px;
        height: 16px;
    }        
    .sprite-Documents
    {
        background: url("../../Content/images/leafimages.png") no-repeat top left;
        display: inline-block;
        background-position: 0 -26px;
        width: 16px;        
        height: 16px;
    }
 
</style>

<%= Html.
    Infragistics().
    Tree().
    ID("tree").
    DataSource(this.Model).
    ParentNodeImageClass("sprite-DocumentsFolder").
    LeafNodeImageClass("sprite-Documents"). 
    Bindings( bindings => {
        bindings.
        TextKey("Text").      
        ChildDataProperty("Nodes");
    }).
    DataBind().
    Render()       
%>
```

### <a id="example_configure_through_binding"></a> 例: バインディングを使用して構成された親ノードおよびリーフ ノードの画像を構成する 

この例は XML へのバインディングを示し、`imageUrlXPath` に必要な設定を組み込んでいます。この設定は JSON データにバインディングしている場合は必要ありません。以下の例は、バインディングによるノード イメージの構成方法を示しています。

オプション|設定|プレビュー
---|---|---
[imageUrlKey](%%jQueryApiUrl%%/ui.igTree#options:bindings.imageUrlKey) | ImageUrl|![](images/igTree_Configure_Node_Images_Pic03.png)
[imageUrlXPath](%%jQueryApiUrl%%/ui.igTree#options:bindings.imageUrlXPath)|@ImageUrl|-

**HTML の場合:**

```html
$("#tree").igTree({
    checkboxMode: 'triState',
    singleBranchExpand: true,
    dataSource: data,
    dataSourceType: 'xml',
    initialExpandDepth: 0,
    pathSeparator: '.',
    bindings: {
        textKey: 'Text',
        textXPath: '@Text',
        valueKey: 'Value',
        valueXPath: '@Value',
        imageUrlKey: 'ImageUrl',
        imageUrlXPath: '@ImageUrl',
        childDataProperty: 'Folder',
        childDataXPath: 'Folder',
        searchFieldXPath: 'Folder'
    }
});
```

**XML データ:**

```xml
<?xml version="1.0" encoding="utf-8" ?>

<Folder Text="Computer" ImageUrl="../content/images/igTree/Common/computer.png" Value="Folder">

    <Folder Text="Music" ImageUrl="../content/images/igTree/Common/book.png" Value="Folder">

        <!-- data omitted for example -->

    </Folder>


<Folder Text="My Documents" ImageUrl="../content/images/igTree/Common/DocumentsFolder.png" Value="Folder">

    <Folder Text="2009" ImageUrl="../content/images/igTree/Common/DocumentsFolder.png" Value="Folder">

        <!-- data omitted for example -->

    </Folder>

    <Folder Text="2010" ImageUrl="../content/images/igTree/Common/DocumentsFolder.png" Value="Folder">

        <Folder Text="Month Report" ImageUrl="../content/images/igTree/Common/Documents.png" Value="File"></Folder>

        <Folder Text="Year Report" ImageUrl="../content/images/igTree/Common/Documents.png" Value="File"></Folder>

    </Folder>

</Folder>

<Folder Text="Pictures" ImageUrl="../content/images/igTree/Common/coins.png" Value="Folder">

    <!-- data omitted for example -->

</Folder>

<Folder Text="Network" ImageUrl="../content/images/igTree/Common/door.png" Value="Folder">

    <Folder Text="Archive" ImageUrl="../content/images/igTree/Common/door_in.png" Value="Folder"></Folder>

    <Folder Text="BackUp" ImageUrl="../content/images/igTree/Common/door_in.png" Value="Folder"></Folder>

    <Folder Text="FTP" ImageUrl="../content/images/igTree/Common/door_in.png" Value="Folder"></Folder>

</Folder>

<Folder Text="Deleted" ImageUrl="../content/images/igTree/Common/bin_empty.png" Value="Folder"></Folder>
```

>**注:** `igTree` はクライアントで XML へのバインディングのみサポートします。ASP.NET MVC では、XML を `IQueryable<T>` に変換する必要があります。ツリーは `ImageUrl` を表すフィールドにバインドでき、`imageUrlXPath` は必要ありません。

これらのプロパティの詳細情報は、プロパティ参照セクションのリストを参照してください。

-   [igTree オプション](%%jQueryApiUrl%%/ui.igTree#options)

## <a id="related-topics"></a>関連トピック 
以下は、その他の役立つトピックです。

-   [igTree でノードを構成する](igTree-Configure-Nodes.html)

 

 


