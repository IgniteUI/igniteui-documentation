<!--
|metadata|
{
    "fileName": "igscroll-configuring",
    "controlName": "igScroll",
    "tags": ["Configuration","igScroll"]
}
|metadata|
-->

# igScroll の構成

## 目的

このトピックでは、igScroll の構成方法をコード例を用いて説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

- [デフォルトの構成](#defaults)
- [構成の概要](#summary)
	- [複数のコンテナーを一度に垂直スクロール](#syncVertically)
	- [複数のコンテナーを一度に水平スクロール](#syncHorizontally)
	- [カスタム水平スクロールバーを設定](#customHorizontalScr)
	- [カスタム垂直スクロールバーを設定](#customVerticalScr)
	- [カスタム垂直スクロールバーを設定](#customVerticalScr)
- [関連コンテンツ](#related)

## <a id="defaults"></a> デフォルトの構成

このセクションは、表示およびスクロール動作に関連するデフォルトの igScroll 設定をリストします。

プロパティ|タイプ|デフォルト値|説明
---|---|---|---
[`scrollbarType`](%%jQueryApiUrl%%/ui.igscroll#options:scrollbarType)|string |"custom"|このオプションは、コンテナーに表示されるスクロールバーのタイプを決定します。デフォルトでカスタム スクロールバーが表示されます。現在の環境のネイティブなスクロールバーを表示するには、オプションを native に設定します。スクロールバーを非表示するには、none に設定します。
[`alwaysVisible`](%%jQueryApiUrl%%/ui.igscroll#options:alwaysVisible)|bool|false|このオプションは、環境に関係なく幅の狭いカスタム スクロールバーが常に表示されるかどうかを決定します。デフォルトで、ユーザーがスクロール可能なコンテンツまたはスクロールバーを操作しない場合、スクロールバーは非表示になります。スクロールバーを常に表示するには、このオプションを true に設定します。*[`scrollbarType`](%%jQueryApiUrl%%/ui.igscroll#options:scrollbarType) が "custom" の場合のみ適用されます。 *
[`wheelStep`](%%jQueryApiUrl%%/ui.igscroll#options:wheelStep)|number|50|このオプションは、マウス ホイールを一度使用すると、スクロールするピクセルを決定します。*スムージングがないスクロールのみに適用されます。[smoothing](%%jQueryApiUrl%%/ui.igscroll#options:smoothing) オプションを false に設定します。*
[`inertiaStep`](%%jQueryApiUrl%%/ui.igscroll#options:inertiaStep)|number|1|このオプションは、タッチ デバイスで慣性がスクロールする修飾子を決定します。負の値が設定される場合、スクロールは反転されます。
[`inertiaDuration`](%%jQueryApiUrl%%/ui.igscroll#options:inertiaDuration)|number|1 |このオプションは、タッチ デバイスで慣性が中止する前にスクロールする時間の修飾子を決定します。値を 0 に設定すると、タッチ デバイスで慣性を無効にします。
[`swipeToleranceX`](%%jQueryApiUrl%%/ui.igscroll#options:swipeToleranceX)|number|30|このオプションは、タッチ操作で上下にスワイプした際に許可される左右移動のピクセル数を決定します。ユーザーが上下にスクロールする際にジェスチャに左右のブレがある場合、コンテンツが左右にはスクロールせずに上下のみにスクロールします。
[`inertiaDeltaY`](%%jQueryApiUrl%%/ui.igscroll#options:inertiaDeltaY)|number|1.25|このオプションは、慣性が水平方向ではなく垂直方向へのみスクロールするために、垂直方向の速度が水平方向の速度の何倍になるかを決定します。 
[`inertiaDeltaX`](%%jQueryApiUrl%%/ui.igscroll#options:inertiaDeltaX)|number|2|このオプションは、慣性が垂直方向ではなく水平方向へのみスクロールするために、水平方向の速度が垂直方向の速度の何倍になるかを決定します。 

## <a id="summary"></a>構成の概要
以下の表は、`igScroll` の構成可能な要素を示します。

構成の目的:|使用するプロパティ:|設定値:
---|---|---
スムーズなホイール スクロール - <br/>Firefox でマウス ホイールを使用するスクロール動作と同様な動作。|[`smoothing`](%%jQueryApiUrl%%/ui.igscroll#options:smoothing) <br/>[`smoothingStep`](%%jQueryApiUrl%%/ui.igscroll#options:smoothingStep) <br/>[`smoothingDuration`](%%jQueryApiUrl%%/ui.igscroll#options:smoothingDuration)|true<br/>1<br/>1
[複数のコンテナーを一度に垂直スクロール](#syncVertically)|[`syncedElemsV`](%%jQueryApiUrl%%/ui.igscroll#options:syncedElemsV) |現在の igScroll と垂直方向に同期する jQuery 要素の配列。  
[複数のコンテナーを一度に水平スクロール](#syncHorizontally)|[`syncedElemsH`](%%jQueryApiUrl%%/ui.igscroll#options:syncedElemsH) |現在の igScroll と水平方向に同期する jQuery 要素の配列。
[カスタム水平スクロールバーを設定](#customHorizontalScr)|[`scrollbarH`](%%jQueryApiUrl%%/ui.igscroll#options:scrollbarH)|水平スクロールバーになる要素。<br/>水平スクロールバーを表示するために `overflow-x: auto` および幅が設定されるコンテンツを持つ外部の要素が可能です。 
[カスタム垂直スクロールバーを設定](#customVerticalScr)|[`scrollbarV`](%%jQueryApiUrl%%/ui.igscroll#options:scrollbarV)|垂直スクロールバーになる要素。<br/>垂直スクロールバーを表示するために `overflow-y: auto` および高さが設定されるコンテンツを持つ外部の要素が可能です。 
カスタム スクロールバーがリンクされている場合、リンクされているスクロールバーのみのスクロールを許可し、現在のスクロールバーのスクロールを無効にします。<br/>メイン コンテンツを上下にスクロールするリンクされた垂直スクロールバーで特定のスクロール位置の後に表示されるコンテンツの量を更新するなどのカスタム ロジックがある場合に便利です。<br/>たとえば、仮想化の実装などです。|[`scrollOnlyVBar`](%%jQueryApiUrl%%/ui.igscroll#options:scrollOnlyVBar)/[`scrollOnlyHBar`](%%jQueryApiUrl%%/ui.igscroll#options:scrollOnlyHBar) |true
水平/垂直スクロールバーのカスタム水平スクロールバーの親を設定します。<br/>カスタム DOM 構造を構築する場合に便利です。たとえば、[`modifyDOM`](%%jQueryApiUrl%%/ui.igscroll#options:syncedElemsV) オプションが false に設定される場合に使用できます。|[`scrollbarHParent`](%%jQueryApiUrl%%/ui.igscroll#options:scrollbarHParent)/ [`scrollbarVParent`](%%jQueryApiUrl%%/ui.igscroll#options:scrollbarHParent) |スクロールの親要素になる要素。

## <a id="syncVertically"></a> 複数のコンテナーを一度に垂直スクロール

このセクションは、別のコンテナーを垂直方向に同期化する方法を紹介し、コード例があります。

### 例

1) igScroll DOM 要素を定義します。

**HTML の場合:**

```html
 <div style="width: 33%; float:left; position: relative;">
	<div id='scrContainerLeft' style="height:200px; width:100%; overflow: hidden;">
		<div style="width: 500px;">
			...
		</div>
	</div>
</div>
```

2) igScroll と同期される追加のスクロール可能なコンテナーを定義します。

**HTML の場合:**

```html
 <div style="width: 33%; float:left; position: relative;">
	<div id='scrContainerMiddle' style="height:200px;  width:100%;  overflow: auto;">
		<div  style="height:600px;width: 500px; background-color: green;">
			...
		</div>
	</div>
</div>
<div style="width: 33%; float:right; position: relative;">
	<div id='scrContainerRight' style="height:200px;  width:100%; overflow: auto;">
		<div  style="height:600px;width: 500px; background-color: red;">
			...
		</div>
	</div>
</div>
```

3) 追加のスクロール可能な要素をポイントする [`syncedElemsV`](%%jQueryApiUrl%%/ui.igscroll#options:syncedElemsV) オプションで igScroll ウィジェットを初期化します。

**JavaScript の場合:**

```js
$("#scrContainerLeft").igScroll({
	syncedElemsV: [$("#scrContainerMiddle"), $("#scrContainerRight")]
});
```
	  
## <a id="syncHorizontally"></a> 複数のコンテナーを一度に水平スクロール

このセクションは、別のコンテナーを水平方向に同期化する方法を紹介し、コード例があります。

### 例

[複数のコンテナーを一度に水平スクロール](#syncVertically)で複数のスクロール可能なコンテナーの定義の手順 1 および 2 を実行します。
[`syncedElemsH`](%%jQueryApiUrl%%/ui.igscroll#options:syncedElemsH) オプションが追加のスクロール可能な要素に参照する igScroll ウィジェットを初期化します。

**JavaScript の場合:**

```js
$("#scrContainerLeft").igScroll({
	syncedElemsH: [$("#scrContainerMiddle"), $("#scrContainerRight")]
});
```
## <a id="customHorizontalScr"></a> カスタム水平スクロールバーを設定

このセクションは、カスタム要素を igScroll の水平スクロールバーとして設定する方法を紹介し、コード例があります。

### 例

1) 主要なターゲット要素を定義します。

**HTML の場合:**

```html
<div style="width: 200px;">
	<div id='scrContainerLeft' style="height:200px; width:100%; overflow: hidden;">
		<div style="width: 500px;">
			...
		</div>
	</div>
</div>
```

2) カスタム スクロールバー要素を定義します。

**HTML の場合:**

```html
<div id='customHScroll' style='width:200px; overflow-x:auto;'>
	<div style='width:500px; height:1px;'></div>
</div>
```

3) 追加のスクロール可能な要素をポイントする [`scrollbarH`](%%jQueryApiUrl%%/ui.igscroll#options:scrollbarH) オプションで igScroll ウィジェットを初期化します。
	  
**JavaScript の場合:**

```js
$("#scrContainerLeft").igScroll({
	scrollbarH: $("#customHScroll")
});
```

## <a id="customVerticalScr"></a> カスタム垂直スクロールバーを設定

このセクションは、カスタム要素を igScroll の垂直スクロールバーとして設定する方法を紹介し、コード例があります。
 ### 例

1) 主要なターゲット要素を定義します。

**HTML の場合:**
		

```html
<div style="width: 200px; float:left; position:relative;">
    <div id='scrContainerLeft' style="height:200px; width:100%; overflow: hidden;">
	    <div style="width: 500px;">
			...
		</div>
	</div>
</div>
```

2) カスタム スクロールバー要素を定義します。

**HTML の場合:**
		
		
```html
<div id='customVScroll' style='height:200px; overflow-y:auto; float:left; position:relative;'>
	<div style='width:20px; height:500px;'></div>
</div>
```

3) 追加のスクロール可能な要素をポイントする [`scrollbarH`](%%jQueryApiUrl%%/ui.igscroll#options:scrollbarH) オプションで igScroll ウィジェットを初期化します。
		  
**JavaScript の場合:**
			  
			  
```js
$("#scrContainerLeft").igScroll({
	scrollbarV: $("#customVScroll")
});
```

## <a id="related"></a> 関連コンテンツ

### トピック
-   [アクセシビリティの遵守 (igScroll)](igScroll-Accessibility-Compliance.html)
-   [既知の問題 (igScroll)](igScroll-Known-Issues.html)

### サンプル
-   [構成オプション](%%SamplesUrl%%/scroll/configuration-options)
