<!--
|metadata|
{
    "fileName": "igzoombar-known-issues-and-limitations",
    "controlName": "igZoombar",
    "tags": ["Charting","Data Presentation","Known Issues","Breaking Changes"]
}
|metadata|
-->

# 既知の問題と制限 (igZoombar)

## 既知の問題と制限
### 概要

以下の表で、`igZoombar` コントロールの既知の問題と制限を簡単に説明します。以下の概要表に、いくつかの問題に関する既知の問題の詳細説明と考えられる回避策が記載されています。

### 凡例:

<table class="table">
    <tbody>
        <tr>
            <td><img src="images/positive.png" alt="" class="img-responsive"></td>
            <td>回避策</td>
        </tr>
        <tr>
            <td><img src="images/negative.png" alt="" class="img-responsive"></td>
            <td>既知の回避策はありません</td>
        </tr>
        <tr>
            <td><img src="images/plannedFix.png" alt="" class="img-responsive"></td>
            <td>修正予定です</td>
        </tr>
    </tbody>
</table>

### igZoombar

問題|説明|状態
---|---|---
`igDataChart` ラジアル シリーズがサポートされない| `igZoombar` は水平方向のみのズームをサポートしますが、ラジアル シリーズでは両方の軸で行った場合のみサポートされます。そのため、ラジアル シリーズの `igZoombar` によるズームは正しく機能しません。 |![](images/negative.png)
[igDataChart で使用した場合、igZoombar のサムネイルが描画されない](igZoombar-Known-Issues-And-Limitations.html#thumbnail)|`igZoombar` は `igDataChart` コントロールのオプション (`igZoombar` の [target](%%jQueryApiUrl%%/ui.igzoombar#options) オプションで参照されます) を使用してサムネイルを作成します。`igZoombar` は、サムネイルの乱雑さを回避するためにこれらのオプションの一部を削除します。その結果、新しいオプション セットが無効になることがあります。| ![](images/positive.png)
[igZoombar のクローンとターゲット ウィジェットが自動的に同期しない](igZoombar-Known-Issues-And-Limitations.html#synchronize)|`igZoombar` コントロールによりズームされたウィジェットを変更しても、クローンが自動的に更新されません。|![](images/positive.png)
[`igZoombar` が積層シリーズを含む igDataChart と正しく動作しない](igZoombar-Known-Issues-And-Limitations.html#stackedseries)| `igZoombar` は、ターゲットとする元の `igDataChart` のクローンを作成します。デフォルトで `igZoombar` は元のチャート オブジェクトからクローンのオプションを暗示します (`igZoombar` の [`clone`](%%jQueryApiUrl%%/ui.igzoombar#options:clone) オプションを参照してください)。 より複雑な構造を持つ積層シリーズの場合、ユーザーが内部的に提供する元のチャート シリーズを変更します。これにより、`igZoombar` は元のシリーズを取得できず、クローンを自動で再作成することができません。| ![](images/positive.png)


## igZoombar
### <a id="thumbnail"></a>igDataChart で使用した場合、igZoombar のサムネイルが描画されない

`igZoombar` は `igDataChart` コントロールのオプション (`igZoombar` の [target](%%jQueryApiUrl%%/ui.igzoombar#options:target) オプションで参照されます) を使用してサムネイルを作成します。`igZoombar` は、サムネイルの乱雑さを回避するためにこれらのオプションの一部を削除します。その結果、新しいオプション セットが無効になることがあります。

>**回避策:** `igDataChart` オプションを使用し、[clone](%%jQueryApiUrl%%/ui.igzoombar#methods:clone) オプションを構成して `igZoombar` を初期化します。

**JavaScript の場合:**

```js
$("#zoombar").igZoombar({
      target: "chart",
      clone: {
            // use igDataChart options
      }
});
```

### <a id="synchronize"></a>igZoombar のクローンとターゲット ウィジェットが自動的に同期しない

`igZoombar` コントロールによりズームされたウィジェットを変更しても、クローンが自動的に更新されません。

>**回避策:** `igZoombar` 公開 API を使用して、クローンが初期化される要素を検索し、それに同じ変更を適用します。`igDataChart` インスタンスを更新するときに、[clone](%%jQueryApiUrl%%/ui.igzoombar#methods) API メソッドを使用し、その `igZoombar` サムネイル クローンも更新します。

**JavaScript の場合:**

```js
$("#dataChart").igDataChart("addItem", {"Item1": "Value1", "Item2": 1000, "Item3": 1019.75}, "series1" );
$("#zoombar").igZoombar("clone").igDataChart("addItem", {"Item1": "Value1", "Item2": 1000, "Item3": 1019.75}, "series1" );
```

### <a id="stackedseries"></a>igZoombar が積層シリーズを含む igDataChart と正しく動作しない

`igZoombar` は、ターゲットとする元の `igDataChart` のクローンを作成します。デフォルトで `igZoombar` は元のチャート オブジェクトからクローンのオプションを推測します (`igZoombar` の [`clone`](%%jQueryApiUrl%%/ui.igzoombar#options:clone) オプションを参照してください)。 より複雑な構造を持つ積層シリーズの場合、ユーザーが内部的に提供する元のチャート シリーズを変更します。これにより、`igZoombar` は元のシリーズを取得できず、クローンを自動で再作成することができません。

>**回避策:** igDataChart オプションを使用し、[clone](%%jQueryApiUrl%%/ui.igzoombar#methods:clone) オプションを構成して igZoombar を初期化します。

**JavaScript の場合:**

```js
$("#zoombar").igZoombar({
      target: "chart",
      clone: {
            // igDataChart オプションを使用
      }
});
```

 

 


