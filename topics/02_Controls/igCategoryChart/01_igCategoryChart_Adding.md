<!--
|metadata|
{
    "fileName": "igcategorychart-adding",
    "controlName": "igCategoryChart",
    "tags": ["API", "CategoryChart", "Axes"]
}
|metadata|
-->

# igCategoryChart の追加

### 目的

このトピックでは、コード例を使用して igCategoryChart™ コントロールをアプリケーションに追加する方法を説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [カテゴリ チャート コントロールをアプリケーションに追加](#Adding)
    -   [概要](#Introduction)
    -   [プレビュー](#Preview)
    -   [要件](#Prerequisites)
    -   [概要](#Overview)
    -   [手順](#Steps)
-   [**関連コンテンツ**](#RelatedContent)

<a id="Adding"/>
## igCategoryChart コントロールをアプリケーションに追加

<a id="Introduction"/>

### 概要

以下の手順は、igCategoryChart コントロールをアプリケーションに追加する方法を示します。

<a id="Preview"/>

### プレビュー

以下は igCategoryChart の画像です。
![](images/categorychart-walkthrough-01.png)

<a id="Prerequisites"/>
### 要件



<a id="Overview"/>

### 概要

以下はプロセスの概要です。

1. データ ソースを追加します。 

2. igCategoryChart コントロールをアプリケーションに追加

3. 結果の確認

<a id="Steps"/>

### 手順

以下では igCategoryChart コントロールをページに追加するために必要な手順を示します。

**データ ソースを追加します。**

igCategoryChart コントロールを作成するには、はじめにデータをバインドする必要があります。以下のコード スニペットは、シンプルなデータソースを作成する方法を示します。その他のデータソースへのバインドについては、[データへバインド](categorychart-binding-to-data.html)を参照してください。

**HTML の場合:**
```
var data = [
 { "CountryName": "China", "Pop1995": 1216, "Pop2005": 1297, "Pop2015": 1361, "Pop2025": 1394 },
 { "CountryName": "India", "Pop1995": 920, "Pop2005": 1090, "Pop2015": 1251, "Pop2025": 1396 },
 { "CountryName": "United States", "Pop1995": 266, "Pop2005": 295, "Pop2015": 322, "Pop2025": 351 },
 { "CountryName": "Indonesia", "Pop1995": 197, "Pop2005": 229, "Pop2015": 256, "Pop2025": 277 },
 { "CountryName": "Brazil", "Pop1995": 161, "Pop2005": 186, "Pop2015": 204, "Pop2025": 218 }
];

```

**igCategoryChart の追加**

igCategoryChart コントロールをページに追加し、上記データにバインドします。

以下のコードは、表示に必要な最小限のコードとプロパティ設定で igCategoryChart コントロールを追加します。

**HTML の場合:**

```html
 $(function () {
    $("#chart").igCategoryChart({ dataSource: data});
});
```

**結果を確認する**

結果を確認するために、プロジェクトをビルドおよび実行します。手順を正しく実装した場合、igCategoryChart は上記のプレビュー セクションで示したように表示されます。


<a id="RelatedContent"/>

## 関連コンテンツ

### トピック

- [軸](categorychart-axes.html)
- [チャート タイプの構成](categorychart-chart-types.html)
