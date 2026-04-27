<!--
|metadata|
{
    "fileName": "igpopover-known-issues-and-limitations",
    "controlName": "igPopover",
    "tags": ["Breaking Changes","Known Issues"]
}
|metadata|
-->

# 既知の問題と制限事項 (igPopover)

## 既知の問題点と制限の概要
### 既知の問題点と制約の概要表

以下の表に、%%ProductName%%® 20%%ProductVersionShort%% リリースでの `igPopover`™ コントロールの既知の問題と制限について簡単に説明します。以下の表は、すべての問題の詳細な説明とその回避策を示します。

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

### igPopover

問題|説明|状態
---|---|---
[Chrome でページのロード時にポインターが正しい位置をポイントしません。](#mispositioned-pointer)|ページの最初のロード時に  `igPopover` が表示されている場合、矢印がコンテンツ フレームに対して正しい位置に置かれません。|![](images/positive.png)
[selectors](%%jQueryApiUrl%%/ui.igpopover#options:selectors) オプションでターゲット パラメーターを必要とする [show](%%jQueryApiUrl%%/ui.igpopover#methods:show) メソッドが使用されています。|selectors オプションが設定され、複数のターゲットが使用可能な場合、show メソッドにパラメーターとして DOM 要素を渡す必要があります。渡さなかった場合、エラーがスローされます。|![](images/negative.png)


## igPopover
### <a id="mispositioned-pointer"></a>Chrome でページのロード時にポインターが正しい位置をポイントしません。

Google® Chrome™ ブラウザーでは、ページの最初のロード時に `igPopover` コントロールが表示されている場合、ポインターがコンテンツ フレームに対して正しい位置に置かれません。

この問題は、DOM 要素はロードされてもコンテンツがないため、ターゲット要素の幅と高さが 0 になることで発生します。

>**回避策 1:** style 属性でターゲット要素の幅と高さを設定してください。

**HTML の場合:**

```html
style="width:160px;height:160px"
```

>**回避策 2:** `$(window).load()` 関数の内部で `igPopover` の [show](%%jQueryApiUrl%%/ui.igpopover#methods:show) メソッドを呼び出してください。

**JavaScript の場合:**

```js
$(window).load(function () {
            $('#imgPopover').igPopover("show");
        });
```



 

 


