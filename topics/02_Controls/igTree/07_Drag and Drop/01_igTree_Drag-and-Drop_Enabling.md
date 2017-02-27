<!--
|metadata|
{
    "fileName": "igtree-drag-and-drop-enabling",
    "controlName": "igTree",
    "tags": ["Getting Started","How Do I"]
}
|metadata|
-->

# ドラッグ アンド ドロップの有効化 (igTree)

## トピックの概要
### 目的

ここでは、コード例とともに、`igTree`™ コントロールでドラッグ アンド ドロップ機能を有効にする方法を説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [ドラッグ アンド ドロップ機能を有効にする (概要)](#feature-summary)
-   [igTree  コントロール内でドラッグ アンド ドロップ機能を有効にする](#drag-drop-within-tree)
    -   [概要](#within-tree-overview)
    -   [プロパティ設定](#within-tree-settings)
    -   [コード例](#within-tree-code-example)
-   [igTree  コントロール内でドラッグ アンド ドロップ機能を有効にする](#between-different-trees)
    -   [概要](#between-trees-overview)
    -   [プロパティ設定](#between-trees-settings)
    -   [コード例](#between-trees-code-example)
-   [関連コンテンツ](#related-content)



## <a id="introduction"></a>概要
### ドラッグ アンド ドロップ機能

ドラッグ アンド ドロップは同じ `igTree` コントロール内だけでなく、異なる `igTree` コントロール間でも実行できます。2 つの igTree コントロール間で動作するよう設定できます。

##<a id="feature-summary"></a>ドラッグ アンド ドロップ機能を有効にする (概要) 

### ドラッグ アンド ドロップ操作を有効にする (概要チャート)

以下の表では、`igTree` コントロールのドラッグ アンド ドロップ機能を有効にする 2 とおりの方法をまとめました。

<table class="table table-bordered">
	<thead>
		<tr>
            <th>
有効化のタイプ
			</th>

            <th>
構成の詳細
			</th>

            <th>
プロパティ
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
`igTree` 内でドラッグ アンド ドロップ機能を有効にする
			</td>

            <td>
`igTree` コントロールのドラッグ アンド ドロップ機能を有効にしておきます。
			</td>

            <td>
                <ul>
                    <li>
[dragAndDrop](igTree-Drag-and-Drop-Property-API-Reference.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
異なる `igTree` 間でドラッグ アンド ドロップ機能を有効にする
			</td>

            <td>
関係するすべての `igTree` コントロールでドラッグ アンド ドロップ機能を有効にしておきます。また、各`igTree` コントロールは、他のコントロールのドロップを受け付ける構成にしておきます。
			</td>

            <td>
                <ul>
                    <li>
[dragAndDrop](igTree-Drag-and-Drop-Property-API-Reference.html)
					</li>

                    <li>
[dragAndDropSettings](igTree-Drag-and-Drop-Property-API-Reference.html)
					</li>

                    <li>
[allowDrop](igTree-Drag-and-Drop-Property-API-Reference.html)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>



## <a id="drag-drop-within-tree"></a>igTree  コントロール内でドラッグ アンド ドロップ機能を有効にする
### <a id="within-tree-overview"></a>概要

`igTree` コントロールのドラッグ アンド ドロップ機能を有効にしておきます。

![](images/igTree_Drag-and-Drop_Enabling_1.png)

1 つのコントロール内のドラッグの有効化は [dragAndDrop](igTree-Drag-and-Drop-Property-API-Reference.html) プロパティで管理します。

### <a id="within-tree-settings"></a>プロパティ設定

以下の表では、目的の構成をプロパティ設定にマップしています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
igTree でドラッグを有効にする|[dragAndDrop](igTree-Drag-and-Drop-Property-API-Reference.html)|true


### <a id="within-tree-code-example"></a>コード例

以下のコード例は、コードに実装した[](#within-tree-settings)のサンプルです。

**JavaScript の場合:**                                                                                                                                                
```js
$("#tree").igTree({                                                           
 dragAndDrop: true,                                                 
});                                                      
```

**Razor の場合:**                                                                                                                                            
```csharp
@(Html.
   	Infragistics().
	Tree().
	ID("tree").
	DragAndDrop(true).
	DataBind().
	Render()                                                              
)                                                            
```




## <a id="between-different-trees"></a>igTree  コントロール内でドラッグ アンド ドロップ機能を有効にする
### <a id="between-trees-overview"></a>概要

関係するすべての `igTree` コントロールでドラッグ アンド ドロップ機能を有効にしておきます。
また、各 `igTree` コントロールは、他のコントロールのドロップを受け付ける構成にしておきます。

![](images/igTree_Drag-and-Drop_Enabling_2.png)

この場合、関係する `igTree` コントロールの [dragAndDrop](igTree-Drag-and-Drop-API-Reference.html) プロパティをそれぞれ true に設定して、ドラッグを有効にしておきます。これらの `igTree` コントロール間でドロップを有効にするには、他のツリーからドロップを受け取る `igTree` ごとに以下のように 2 つのプロパティをさらに設定しておきます。

-   [dragAndDropSettings](igTree-Drag-and-Drop-Property-API-Reference.html) を allowDrop に設定します。
-   [allowDrop](igTree-Drag-and-Drop-Property-API-Reference.html) プロパティを true に設定します。

### <a id="between-trees-settings"></a>プロパティ設定

以下の表では、目的の構成をプロパティ設定にマップしています。

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
igTree でドラッグを有効にする|[dragAndDrop](igTree-Drag-and-Drop-Property-API-Reference.html)|true
ドラッグ アンド ドロップ設定を有効にする|[dragAndDropSettings](igTree-Drag-and-Drop-Property-API-Reference.html)|allowDrop
igTree でドロップを有効にする|[allowDrop](igTree-Drag-and-Drop-Property-API-Reference.html)|true



### <a id="between-trees-code-example"></a>コード例

以下のコード例は、コードで実装したサンプル ブロックの設定です。

 **JavaScript の場合:** 

```js 
$("#firstTree").igTree({                                                      
	dragAndDrop: true,
	dragAndDropSettings: {                                                       
		allowDrop: true                                                      
	}                                                                     
}); 


$("#secondTree").igTree({                                                     
	dragAndDrop: true,
	dragAndDropSettings: {                                                      
		allowDrop: true                                                       
	}                                                                   
});                                                       
```


**Razor の場合:**

```csharp
@(Html.Infragistics()
	.Tree()
	.ID("firstTree")
	.DragAndDrop(true)
	.DragAndDropSettings(settings =>{
		settings.AllowDrop(true);
	})
	.DataBind()
	.Render())  
                                                                       
@(Html.Infragistics()
	.Tree()
	.ID("secondTree")
	.DragAndDrop(true)
	.DragAndDropSettings(settings =>{
		settings.AllowDrop(true);
	})
	.DataBind()
	.Render())
```

## <a id="related-content"></a>関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [ドラッグ アンド ドロップの構成 (igTree)](igTree-Drag-and-Drop-Configuring.html): ここでは、コード例とともに、 Javascript と MVC の両方で `igTree` コントロールのドラッグ アンド ドロップを構成する方法を紹介します。

- [ドラッグ アンド ドロップ API リファレンス (igTree)](igTree-Drag-and-Drop-API-Reference.html): このグループのトピックは、`igTree` コントロールのドラッグ アンド ドロップ機能に関連するイベントとプロパティについての参照情報を提供します。


### サンプル

このトピックについては、以下のサンプルも参照してください。

- [ドラッグ アンド ドロップ - 単一のツリー](%%SamplesUrl%%/tree/drag-and-drop-single-tree): このサンプルでは、`igTree` コントロールのドラッグ アンド ドロップ機能を有効にして初期化する方法を紹介します。

- [ドラッグ アンド ドロップ - 複数のツリー](%%SamplesUrl%%/tree/drag-and-drop-multiple-trees): このサンプルでは、2 つの `igTree` の間にノードをドラッグ アンド ドロップする方法を紹介します。

- [API およびイベント](igtree-event-reference.html#attaching-handlers-jquery): このサンプルは `igTree` API を使用する方法を紹介します。





 

 


