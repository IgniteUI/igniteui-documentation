<!--
|metadata|
{
    "fileName": "igcategorychart-item-highlight-layer",
    "controlName": "igCategoryChart",
    "tags": ["API", "CategoryChart"]
}
|metadata|
-->

# 項目ハイライト レイヤー

項目ハイライト レイヤーは、カテゴリ上にポインターをホバー時にチャートのカテゴリを強調表示します。

## 項目ハイライト レイヤー

項目ハイライト レイヤーは、`isItemHighlightingEnabled` オプションを true に設定して有効にできます。

以下のコード スニペットは、`igCategoryChart` で項目ハイライト レイヤーを有効にする方法を示します。

*In HTML:*

```html
$(function () {
     $("chart1").igCategoryChart({
	     isItemHighlightingEnabled: true
     });
});
```

以下のスクリーンショットは、項目ハイライト レイヤーを使用した igCategoryChart コントロールを示します。

![](images/categorychart-item-highlight-layer-01.png)


## <a id="relatedtopics"/>関連トピック:

- [カテゴリ ハイライト レイヤー](igcategorychart-category-highlight-layer.html)

- [項目ハイライト レイヤー](igcategorychart-item-tooltip-layer.html)
